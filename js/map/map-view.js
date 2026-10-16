/* global d3 */
/**
 * MapView — draws the interactive world map and exposes a small API used by
 * the explore panel and the games (highlight a country, dim a continent, zoom…).
 *
 * Layers, bottom to top (all inside #map-layer):
 *   svg#map      ocean background, water highlights, land, markers, labels
 *   svg.fx-layer hover lift + game-target pulse (see highlight-layer.js)
 *
 * Smooth zooming: while the user pans/zooms, #map-layer is moved with a CSS
 * transform (GPU, nothing is redrawn). When the gesture settles we "commit":
 * the real transform is applied to the SVG, which redraws crisp at the new scale.
 * During animated zooms, the mid-way redraws are "light" (no label work), the
 * mouse wheel glides instead of jumping, and long flights take a little longer.
 */
import { CONFIG } from '../config.js';
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { $, clamp, debounce, escapeHtml } from '../core/utils.js';
import { t, countryName, capitalName, territoryName, waterName } from '../i18n/i18n.js';
import { STATS } from '../data/facts/stats.js';
import { levelOf } from '../data/difficulty.js';
import { buildMapRecords } from './map-data.js';
import { buildWaterShapes } from './water-shapes.js';
import { createFlagFills } from './flags.js';
import { createHighlightLayer } from './highlight-layer.js';

const COMMIT_DELAY_MS = 60;          // wait this long after the last zoom event before redrawing
const MAX_PREVIEW_SCALE = 3;         // beyond this the stretched preview gets blurry → redraw
const MIN_PREVIEW_SCALE = 0.4;
const MAX_PREVIEW_SHIFT = 0.5;       // fraction of the screen before undrawn edges show → redraw
const WHEEL_STEP = 0.0022;           // zoom per wheel "pixel"
const WHEEL_GLIDE = 0.22;            // share of the remaining distance covered each frame (smooth wheel)
const REDUCED_MOTION = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const LABEL_FONT_PX = 11.5;
const CAPITAL_FONT_PX = 10.5;
const CAPITAL_DOT_PX = 3.2;
const MARKER_R = { country: 5.2, territory: 3.6 };
const MARKER_HIT_R = { country: 11, territory: 7 };

/* ---------- state ---------- */
let records = [];
const recordById = new Map();
const recordByKey = new Map();
let waters = [];                      // { water, feature, el, labels[] }

let wrap, layer, svg, root, defs, shadow, tooltip;
let gWaters, gLand, gMarkers, gWaterLabels, gLabels, gCapitals;
let capitals = [];          // [{ country, lonLat, xy, g, text, width }] — "Capitals" display
let showCapitals = false;
let flags, highlight, zoom;
let width = 0, height = 0, projection, path;
let center = CONFIG.DEFAULT_CENTER;
let transform = d3.zoomIdentity;      // follows the gesture live
let committed = d3.zoomIdentity;      // what the SVG content is actually drawn with
let commitTimer = 0, labelFrame = 0;
let animating = 0;
let boxSelect = false;                // drag = draw a selection rectangle (see ui/box-select.js)                    // number of running programmatic zoom animations
let wheelTarget = null, wheelFrame = 0;
let display = 'gray';                 // 'gray' | 'flag'
let nameMode = 'all';                 // 'all' | 'revealed' | 'none'
let showWaterLabels = true;
let insets = { top: 70, bottom: 16 }; // screen space hidden by the top bar / game card
const targets = new Set();
const handlers = { placeClick: null, waterClick: null };
const measureCtx = document.createElement('canvas').getContext('2d');

/* =====================================================================
   BUILD
   ===================================================================== */
function init(topology) {
  wrap = $('#map-wrap');
  layer = $('#map-layer');
  tooltip = $('#tooltip');
  svg = d3.select('#map');

  defs = svg.append('defs');
  shadow = defs.append('filter').attr('id', 'liftShadow')
    .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    .append('feDropShadow').attr('dx', 0).attr('dy', 2).attr('stdDeviation', 2)
    .attr('flood-color', '#0b1b2e').attr('flood-opacity', 0.38);

  root = svg.append('g').attr('class', 'root');
  root.append('rect').attr('class', 'bg').attr('x', -1e4).attr('y', -1e4).attr('width', 3e4).attr('height', 3e4)
    .on('click', onWaterClick);
  gWaters = root.append('g').attr('class', 'waters');
  gLand = root.append('g').attr('class', 'land');
  gMarkers = root.append('g').attr('class', 'markers');
  gWaterLabels = root.append('g').attr('class', 'wlabels');
  gLabels = root.append('g').attr('class', 'labels');
  gCapitals = root.append('g').attr('class', 'capitals').style('display', 'none');

  flags = createFlagFills(defs);
  highlight = createHighlightLayer(layer);

  records = buildMapRecords(topology);
  records.forEach(rec => {
    recordByKey.set(rec.key, rec);
    if (rec.id) recordById.set(rec.id, rec);
    createElements(rec);
  });
  createCapitals();
  waters = buildWaterShapes().map(({ water, feature }) => ({
    water, feature,
    el: gWaters.append('path').attr('class', 'water').attr('data-water', water.id).node(),
    labels: water.label.map(() => gWaterLabels.append('text').attr('class', 'wlbl ' + water.type).node()),
  }));

  zoom = d3.zoom().scaleExtent([1, CONFIG.MAX_ZOOM])
    .on('zoom', event => { transform = event.transform; preview(); })
    .on('end', () => { clearTimeout(commitTimer); commitTimer = setTimeout(commit, COMMIT_DELAY_MS); });
  // the wheel is handled by smoothWheel() (gliding) instead of d3's jumpy steps
  // box-select mode (or Shift held): the drag draws a rectangle instead of moving the map
  zoom.filter(event => event.type !== 'wheel' && !event.ctrlKey && !event.button
    && !(event.type === 'mousedown' || event.type === 'pointerdown' ? boxSelect || event.shiftKey : false)
    && !(event.type === 'touchstart' && boxSelect && event.touches?.length === 1));
  d3.select(wrap).call(zoom).on('dblclick.zoom', null);
  wrap.addEventListener('wheel', smoothWheel, { passive: false });

  render();
  window.addEventListener('resize', debounce(render, 180));
}

function createElements(rec) {
  if (rec.feature) {
    rec.pathEl = gLand.append('path')
      .attr('class', rec.kind === 'country' ? 'country' : 'terr')
      .attr('data-key', rec.key).node();
    bindPointer(rec.pathEl, rec);
  }
  if (rec.isSmall) {
    const g = gMarkers.append('g')
      .attr('class', 'marker' + (rec.kind === 'territory' ? ' t-marker' : ''))
      .attr('data-key', rec.key);
    rec.markerDot = g.append('circle').attr('class', 'dot').node();
    rec.markerHit = g.append('circle').attr('class', 'hit').node();   // larger invisible click area
    rec.markerEl = g.node();
    bindPointer(rec.markerEl, rec);
  }
  rec.labelEl = gLabels.append('text')
    .attr('class', 'lbl' + (rec.kind === 'territory' ? ' t-lbl' : '') + (rec.isSmall ? ' s-lbl' : ''))
    .node();
  rec.labelEl.style.display = 'none';
}

/* =====================================================================
   PROJECTION & RENDER  (runs at start, on resize and when re-centering)
   ===================================================================== */
/** Points covering the visible world (Antarctica excluded) for fitting the projection. */
function worldOutline(centerLon) {
  const points = [];
  for (let lon = -179.5; lon <= 179.5; lon += 7) {
    for (const lat of [-62, -30, 0, 30, 84]) points.push([centerLon + lon, lat]);
  }
  return { type: 'MultiPoint', coordinates: points };
}

function render() {
  width = wrap.clientWidth;
  height = wrap.clientHeight;
  projection = d3.geoNaturalEarth1().rotate([-center, 0])
    .fitExtent([[10, insets.top], [width - 10, height - Math.max(10, insets.bottom)]], worldOutline(center));
  path = d3.geoPath(projection);

  for (const rec of records) {
    if (rec.feature) {
      rec.pathEl.setAttribute('d', path(rec.feature) || '');
      rec.box = largestPieceBounds(rec.mainShape);
      rec.boxAll = path.bounds(rec.feature);
    }
    rec.labelXY = projection(rec.labelLonLat);
    rec.markerXY = projection(rec.markerLonLat);
    if (!rec.feature) {
      const [x, y] = rec.markerXY;
      rec.box = rec.boxAll = [[x - 1, y - 1], [x + 1, y + 1]];
    }
    if (rec.markerEl) rec.markerEl.setAttribute('transform', `translate(${rec.markerXY[0]},${rec.markerXY[1]})`);
    const [lx, ly] = rec.isSmall ? rec.markerXY : rec.labelXY;
    rec.labelEl.setAttribute('x', lx);
    rec.labelEl.setAttribute('y', ly);
    flags.fit(rec);
  }
  placeCapitals();
  for (const w of waters) {
    w.el.setAttribute('d', path(w.feature) || '');
    w.water.label.forEach((lonLat, i) => {
      const [x, y] = projection(lonLat);
      w.labels[i].setAttribute('x', x);
      w.labels[i].setAttribute('y', y);
    });
  }
  zoom.extent([[0, 0], [width, height]])
    .translateExtent([[-width * 0.3, -height * 0.3], [width * 1.3, height * 1.3]]);
  refreshLanguage();
  highlight.redraw();
  if (pinPoints.length) MapView.setPins(pinPoints); // re-project pins (e.g. new map centre)
  d3.select(wrap).call(zoom.transform, d3.zoomIdentity);
  commit();
}

/**
 * Screen box of the biggest drawn piece of a shape.
 * A shape that crosses the map edge (e.g. Russia, cut at the 180° line) is
 * drawn as several pieces; path.bounds() would span the whole map width,
 * which broke labels, zoom and the flag fill. Rings are collected from the
 * projected path and the one with the largest area wins.
 */
function largestPieceBounds(feature) {
  const rings = [];
  let ring = null;
  const recorder = {
    moveTo(x, y) { ring = [[x, y]]; rings.push(ring); },
    lineTo(x, y) { ring?.push([x, y]); },
    closePath() { ring = null; },
    arc() {}, rect() {},
  };
  d3.geoPath(projection, recorder)(feature);
  let best = null, bestArea = -1;
  for (const r of rings) {
    const area = Math.abs(d3.polygonArea(r));
    if (area > bestArea) { bestArea = area; best = r; }
  }
  if (!best) return path.bounds(feature);
  return [[d3.min(best, p => p[0]), d3.min(best, p => p[1])], [d3.max(best, p => p[0]), d3.max(best, p => p[1])]];
}

function setCenter(lon) {
  if (lon === center) return;
  center = lon;
  render();
}

/* =====================================================================
   SMOOTH ZOOM — preview during the gesture, commit when it settles
   ===================================================================== */
function preview() {
  hideTooltip();
  highlight.clearHover();
  clearTimeout(commitTimer);
  const r = transform.k / committed.k;
  const dx = transform.x - r * committed.x;
  const dy = transform.y - r * committed.y;
  const tooFar = r > MAX_PREVIEW_SCALE || r < MIN_PREVIEW_SCALE
    || Math.abs(dx) > width * MAX_PREVIEW_SHIFT || Math.abs(dy) > height * MAX_PREVIEW_SHIFT;
  if (tooFar) return commit({ light: animating > 0 || Boolean(wheelFrame) });
  layer.style.transform = `translate3d(${dx}px,${dy}px,0) scale(${r})`;
}

/**
 * Redraw the SVG at the current transform. `light` = in the middle of an
 * animation: only move the drawing, the labels are sorted out at the end.
 */
function commit({ light = false } = {}) {
  clearTimeout(commitTimer);
  committed = transform;
  root.attr('transform', transform);
  layer.style.transform = '';
  highlight.setTransform(transform);
  if (light) {
    gLabels.attr('font-size', LABEL_FONT_PX / transform.k).attr('stroke-width', 3 / transform.k);
    return;
  }
  updateForScale();
}

/** Mouse wheel / trackpad: glide towards the new zoom instead of jumping. */
function smoothWheel(e) {
  e.preventDefault();
  const [px, py] = d3.pointer(e, wrap);
  const delta = -e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode ? 500 : 1) * (e.ctrlKey ? 4 : 1);
  const from = wheelTarget || transform;
  const k = clamp(from.k * Math.pow(2, delta * WHEEL_STEP), 1, CONFIG.MAX_ZOOM);
  const scale = k / from.k;
  wheelTarget = keepInBounds(d3.zoomIdentity.translate(px - (px - from.x) * scale, py - (py - from.y) * scale).scale(k));
  d3.select(wrap).interrupt(); // stop a running animation
  if (REDUCED_MOTION) { applyStep(wheelTarget); wheelTarget = null; return; }
  if (!wheelFrame) wheelFrame = requestAnimationFrame(glide);
}

function glide() {
  const t0 = transform, t1 = wheelTarget;
  const close = Math.abs(t1.k - t0.k) / t1.k < 0.004 && Math.abs(t1.x - t0.x) < 1 && Math.abs(t1.y - t0.y) < 1;
  const next = close ? t1 : d3.zoomIdentity
    .translate(t0.x + (t1.x - t0.x) * WHEEL_GLIDE, t0.y + (t1.y - t0.y) * WHEEL_GLIDE)
    .scale(Math.exp(Math.log(t0.k) + (Math.log(t1.k) - Math.log(t0.k)) * WHEEL_GLIDE));
  applyStep(next);
  if (close) {
    wheelFrame = 0;
    wheelTarget = null;
    clearTimeout(commitTimer);
    commitTimer = setTimeout(commit, COMMIT_DELAY_MS);
  } else wheelFrame = requestAnimationFrame(glide);
}

/** Same limits as dragging: the map can't be pushed off screen. */
function keepInBounds(t) {
  return zoom.constrain()(t, zoom.extent().call(wrap), zoom.translateExtent());
}

/** Set the zoom without an animation (d3 keeps it within the allowed bounds). */
function applyStep(target) { d3.select(wrap).call(zoom.transform, target); }

/** Sizes that must stay constant on screen (labels, markers, shadow) + what to show at this zoom. */
function updateForScale() {
  const k = transform.k;
  gLabels.attr('font-size', LABEL_FONT_PX / k).attr('stroke-width', 3 / k);
  shadow.attr('dy', 2 / k).attr('stdDeviation', 2 / k);

  const screenFactor = clamp(width / 1300, 0.62, 1); // smaller water labels on narrow screens
  for (const w of waters) {
    const isOcean = w.water.type === 'ocean';
    const fontPx = isOcean ? 13 * screenFactor : 10.5 * Math.max(screenFactor, 0.85);
    const visible = showWaterLabels && k >= w.water.minK / (isOcean ? 1 : screenFactor);
    for (const label of w.labels) {
      label.setAttribute('font-size', fontPx / k);
      label.style.display = visible ? '' : 'none';
    }
  }
  for (const rec of records) {
    if (!rec.markerEl) continue;
    const shapeBigEnough = rec.feature && (rec.box[1][0] - rec.box[0][0]) * k > 26;
    const visible = !shapeBigEnough && (rec.kind === 'country' || k >= 3);
    rec.markerEl.style.display = visible ? '' : 'none';
    sizeMarker(rec);
  }
  if (!labelFrame) labelFrame = requestAnimationFrame(() => { labelFrame = 0; updateLabels(); });
}

function sizeMarker(rec) {
  const k = transform.k;
  const grow = rec.markerEl.classList.contains('target') ? 1.5 : 1;
  rec.markerDot.setAttribute('r', MARKER_R[rec.kind] * grow / k);
  rec.markerHit.setAttribute('r', MARKER_HIT_R[rec.kind] / k);
}

/* =====================================================================
   LABELS & LANGUAGE
   ===================================================================== */
const placeName = rec => (rec.kind === 'country' ? countryName(rec.country) : territoryName(rec.territory));
const namesAllowedFor = rec => nameMode === 'all' || (rec.revealed && nameMode !== 'none');

function textWidth(text) {
  measureCtx.font = `700 ${LABEL_FONT_PX}px Manrope, system-ui, sans-serif`;
  return measureCtx.measureText(text).width;
}

/** Show a label only if names are allowed and it fits inside its shape at the current zoom. */
function updateLabels() {
  const k = transform.k;
  for (const rec of records) {
    let visible = false;
    if (namesAllowedFor(rec) && rec.labelText) {
      if (rec.isSmall) {
        const besideMarker = rec.markerEl && rec.markerEl.style.display !== 'none';
        visible = rec.kind === 'country' ? k >= 4.5 || (rec.revealed && k >= 2) : k >= 6;
        const [x, y] = !besideMarker && rec.feature ? rec.labelXY : rec.markerXY;
        rec.labelEl.setAttribute('x', x);
        rec.labelEl.setAttribute('y', y);
        rec.labelEl.setAttribute('dx', besideMarker ? 8 / k : 0);
        rec.labelEl.style.textAnchor = besideMarker ? 'start' : 'middle';
      } else {
        const boxW = (rec.box[1][0] - rec.box[0][0]) * k;
        const boxH = (rec.box[1][1] - rec.box[0][1]) * k;
        visible = boxW >= rec.labelWidth * (rec.kind === 'territory' ? 1.25 : 1.02) && boxH >= 13;
        if (rec.kind === 'territory' && k < 2 && rec.areaKm2 < 1e6) visible = false;
      }
    }
    rec.labelEl.style.display = visible ? '' : 'none';
  }
  updateCapitals(); // capital names avoid the country names shown above
}

/* =====================================================================
   CAPITALS DISPLAY — a dot and the name of every capital city
   ===================================================================== */
function createCapitals() {
  for (const rec of records) {
    const lonLat = rec.kind === 'country' && STATS[rec.id]?.capitalLonLat;
    if (!lonLat) continue;
    const g = gCapitals.append('g').attr('class', 'cap');
    g.append('rect').attr('class', 'cap-dot');
    const text = g.append('text').attr('class', 'cap-lbl').node();
    capitals.push({ rec, lonLat, g: g.node(), text, width: 0 });
  }
}

function placeCapitals() {
  for (const c of capitals) {
    c.xy = projection(c.lonLat);
    c.g.setAttribute('transform', `translate(${c.xy[0]},${c.xy[1]})`);
  }
}

function capitalTexts() {
  measureCtx.font = `700 ${CAPITAL_FONT_PX}px Manrope, system-ui, sans-serif`;
  for (const c of capitals) {
    c.text.textContent = capitalName(c.rec.country);
    c.width = measureCtx.measureText(c.text.textContent).width;
  }
}

/** Screen boxes [x0, y0, x1, y1] of the country names currently shown. */
function countryLabelBoxes(k) {
  const boxes = [];
  for (const rec of records) {
    if (rec.labelEl.style.display === 'none') continue;
    const x = Number(rec.labelEl.getAttribute('x')) * k, y = Number(rec.labelEl.getAttribute('y')) * k;
    const besideMarker = rec.labelEl.style.textAnchor === 'start';
    const x0 = besideMarker ? x + 8 : x - rec.labelWidth / 2;
    boxes.push([x0, y - 7, x0 + rec.labelWidth, y + 7]);
  }
  return boxes;
}

const overlaps = (box, list) => list.some(o => box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1]);

/**
 * Show every capital dot, and the names that fit: better-known countries
 * first, on the right of the dot or else on the left; a name is hidden when
 * it would cover a country name, another capital name or a dot.
 */
function updateCapitals() {
  if (!showCapitals) return;
  const k = transform.k;
  const size = (width < 600 ? CAPITAL_DOT_PX * 0.7 : CAPITAL_DOT_PX) / k;
  gCapitals.attr('font-size', CAPITAL_FONT_PX / k).attr('stroke-width', 3 / k);
  const dots = capitals.map(c => {
    const [sx, sy] = [c.xy[0] * k, c.xy[1] * k];
    return [sx - 3, sy - 3, sx + 3, sy + 3];
  });
  const taken = countryLabelBoxes(k);
  const order = capitals.map((c, i) => ({ c, i })).sort((a, b) => levelOf(a.c.rec.id) - levelOf(b.c.rec.id));
  for (const { c, i } of order) {
    const dot = c.g.firstChild;
    dot.setAttribute('x', -size); dot.setAttribute('y', -size);
    dot.setAttribute('width', size * 2); dot.setAttribute('height', size * 2);
    const [sx, sy] = [c.xy[0] * k, c.xy[1] * k];
    const others = dots.filter((_, j) => j !== i);
    const right = [sx + 5, sy - 6, sx + 7 + c.width, sy + 6];
    const left = [sx - 7 - c.width, sy - 6, sx - 5, sy + 6];
    const side = [right, left].find(box => !overlaps(box, taken) && !overlaps(box, others));
    c.text.style.display = side ? '' : 'none';
    if (side) {
      taken.push(side);
      const onRight = side === right;
      c.text.setAttribute('x', (onRight ? 6 : -6) / k);
      c.text.style.textAnchor = onRight ? 'start' : 'end';
      c.text.setAttribute('y', 3.5 / k);
    }
    c.g.classList.toggle('dim', Boolean(c.rec.dimmed));
  }
}

function refreshLanguage() {
  for (const rec of records) {
    rec.labelText = placeName(rec);
    rec.labelEl.textContent = rec.labelText;
    rec.labelWidth = textWidth(rec.labelText) * (rec.kind === 'territory' ? 0.9 : 1);
  }
  for (const w of waters) w.labels.forEach(label => { label.textContent = waterName(w.water); });
  capitalTexts();
  updateLabels();
  updateCapitals();
}

/* =====================================================================
   POINTER: hover lift, tooltip, clicks
   ===================================================================== */
function bindPointer(el, rec) {
  el.addEventListener('pointerenter', e => { highlight.showHover(rec); showTooltip(rec, e); });
  el.addEventListener('pointerleave', () => { highlight.clearHover(); hideTooltip(); });
  el.addEventListener('pointermove', moveTooltip);
  el.addEventListener('click', e => { e.stopPropagation(); handlers.placeClick?.(rec, e); });
}

function showTooltip(rec, e) {
  if (!namesAllowedFor(rec) || !e) return hideTooltip();
  let detail = '';
  if (rec.kind === 'territory') {
    const sovereign = rec.territory.sov && COUNTRY_BY_ID.get(rec.territory.sov);
    detail = rec.territory.disputed ? t('disputed')
      : sovereign ? t('territoryOf', { sov: countryName(sovereign) }) : t('territory');
  }
  tooltip.innerHTML = escapeHtml(placeName(rec)) + (detail ? `<small>${escapeHtml(detail)}</small>` : '');
  tooltip.classList.add('show');
  moveTooltip(e);
}
function moveTooltip(e) {
  if (!tooltip.classList.contains('show')) return;
  tooltip.style.left = e.clientX + 'px';
  tooltip.style.top = e.clientY + 'px';
}
function hideTooltip() { tooltip.classList.remove('show'); }

/** [lon, lat] of the point under a mouse / touch event. */
function lonLatOf(e) {
  const [x, y] = transform.invert(d3.pointer(e, svg.node()));
  return projection.invert([x, y]);
}

/** Click on the ocean → [lon, lat] of that point. */
function onWaterClick(e) {
  if (!handlers.waterClick) return;
  handlers.waterClick(lonLatOf(e), e);
}

let pinPoints = []; // [{ lonLat, cls }] — re-projected when the map changes

/* =====================================================================
   ZOOM HELPERS
   ===================================================================== */
function zoomToBox([[x0, y0], [x1, y1]], { maxK = 12, minK = 1, pad = 0.86, minSize = 0, duration = 750 } = {}) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const boxW = Math.max(x1 - x0, minSize), boxH = Math.max(y1 - y0, minSize);
  const view = { x: 0, y: insets.top, w: width, h: height - insets.top - insets.bottom };
  const k = clamp(pad / Math.max(boxW / view.w, boxH / view.h), Math.min(minK, maxK), maxK);
  applyTransform(d3.zoomIdentity.translate(view.x + view.w / 2 - k * cx, view.y + view.h / 2 - k * cy).scale(k), duration);
}

/**
 * Animate to `target`. Long flights (big zoom change or far away) get a bit
 * more time so they never feel rushed; reduced-motion users jump straight there.
 */
function applyTransform(target, duration) {
  const host = d3.select(wrap);
  if (wheelFrame) { cancelAnimationFrame(wheelFrame); wheelFrame = 0; wheelTarget = null; }
  if (!duration || REDUCED_MOTION) { host.interrupt(); host.call(zoom.transform, target); commit(); return; }
  const a = [(width / 2 - transform.x) / transform.k, (height / 2 - transform.y) / transform.k, width / transform.k];
  const b = [(width / 2 - target.x) / target.k, (height / 2 - target.y) / target.k, width / target.k];
  const flight = d3.interpolateZoom(a, b).duration; // d3's estimate of how "far" this is
  const ms = clamp(Math.max(duration, flight * 0.6), duration, duration * 1.8);
  animating++;
  host.transition('fly').duration(ms).ease(d3.easeCubicInOut)
    .call(zoom.transform, target)
    .on('end interrupt', () => { animating = Math.max(0, animating - 1); clearTimeout(commitTimer); commitTimer = setTimeout(commit, COMMIT_DELAY_MS); });
}

/** Screen box of a lon/lat rectangle (sampled along its edges). */
function geoBox([[lon0, lat0], [lon1, lat1]]) {
  const points = [];
  for (let i = 0; i <= 20; i++) {
    const lon = lon0 + (lon1 - lon0) * i / 20, lat = lat0 + (lat1 - lat0) * i / 20;
    points.push([lon, lat0], [lon, lat1], [lon0, lat], [lon1, lat]);
  }
  const xy = points.map(p => projection(p));
  return [[d3.min(xy, p => p[0]), d3.min(xy, p => p[1])], [d3.max(xy, p => p[0]), d3.max(xy, p => p[1])]];
}

function unionBox(boxes) {
  return [[d3.min(boxes, b => b[0][0]), d3.min(boxes, b => b[0][1])],
    [d3.max(boxes, b => b[1][0]), d3.max(boxes, b => b[1][1])]];
}

/* =====================================================================
   STATE CLASSES (target, matched, flash-ok, flash-bad, dim)
   ===================================================================== */
function setState(rec, cls, on) {
  if (!rec) return;
  rec.pathEl?.classList.toggle(cls, on);
  if (rec.markerEl) { rec.markerEl.classList.toggle(cls, on); sizeMarker(rec); }
  if (cls === 'target') {
    if (on) targets.add(rec); else targets.delete(rec);
    highlight.setTargets([...targets]);
  }
}

function clearState(cls) {
  for (const rec of records) {
    const has = rec.pathEl?.classList.contains(cls) || rec.markerEl?.classList.contains(cls);
    if (has) setState(rec, cls, false);
  }
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const MapView = {
  init,
  render,

  /* data access */
  records: () => records,
  record: id => recordById.get(id),
  recordByKey: key => recordByKey.get(key),
  /** Map element under a screen point (used by drag & drop). */
  recordAt(x, y) {
    const node = document.elementFromPoint(x, y)?.closest?.('[data-key]');
    return node ? recordByKey.get(node.getAttribute('data-key')) : null;
  },

  /* events */
  onPlaceClick(fn) { handlers.placeClick = fn; },
  onWaterClick(fn) { handlers.waterClick = fn; },

  /* layout */
  setInsets(next) { insets = { ...insets, ...next }; },
  setCenter,
  getCenter: () => center,
  refreshLanguage,

  /* display */
  setDisplay(mode) {
    display = mode;
    svg.classed('mode-flag', mode === 'flag').classed('mode-gray', mode !== 'flag');
    records.forEach(rec => flags.apply(rec, display === 'flag' || rec.revealed));
  },
  getDisplay: () => display,
  /** 'all' = labels + tooltips · 'revealed' = only revealed places · 'none' = never */
  setNameMode(mode) { nameMode = mode; updateLabels(); },
  setWaterLabels(on) { showWaterLabels = on; updateForScale(); },
  /** Show a dot and the name of every capital city. */
  setCapitals(on) {
    showCapitals = Boolean(on);
    gCapitals.style('display', showCapitals ? null : 'none');
    updateCapitals();
  },

  /** Gray mode: show this place's flag and name. */
  reveal(rec) { rec.revealed = true; flags.apply(rec, true); updateLabels(); },
  clearReveals() {
    records.forEach(rec => { if (rec.revealed) { rec.revealed = false; flags.apply(rec, display === 'flag'); } });
    updateLabels();
  },

  /* game states */
  setState,
  /** Drag draws a selection rectangle instead of moving the map. */
  setBoxSelect(on) { boxSelect = Boolean(on); },
  /** Where a place's name / marker is on screen (px, relative to the map). */
  screenXY(rec) {
    const xy = rec.isSmall || !rec.feature ? rec.markerXY : rec.labelXY;
    return xy ? transform.apply(xy) : null;
  },
  clearState,
  flash(rec, correct, ms = 1300) {
    const cls = correct ? 'flash-ok' : 'flash-bad';
    setState(rec, cls, true);
    setTimeout(() => setState(rec, cls, false), ms);
  },
  /** Dim (and make unclickable) every place for which `shouldDim(rec)` is true; null = none. */
  setDimmed(shouldDim) {
    for (const rec of records) {
      rec.dimmed = shouldDim ? Boolean(shouldDim(rec)) : false;
      rec.pathEl?.classList.toggle('dim', rec.dimmed);
      rec.markerEl?.classList.toggle('dim', rec.dimmed);
      rec.labelEl.classList.toggle('dim', rec.dimmed);
    }
  },
  /** Paint one place with its flag (even in gray mode), without showing its name. */
  setFlagShown(rec, on) { if (rec) flags.apply(rec, on || display === 'flag' || rec.revealed); },
  /** Pulsing outline around places, without changing their colour (rush modes). */
  setPulse(list) { highlight.setTargets(list || []); },
  /** Pins at [lon, lat] points (capital pin game): [{ lonLat, cls }]; [] to clear. */
  setPins(list) {
    pinPoints = list || [];
    highlight.setPins(pinPoints.map(p => ({ cls: p.cls, xy: projection(p.lonLat) })).filter(p => p.xy));
  },
  /** [lon, lat] under a click (land or sea). */
  lonLatOf,
  /** Is [lon, lat] inside this place's shape? */
  contains: (rec, lonLat) => Boolean(rec?.feature && lonLat && d3.geoContains(rec.feature, lonLat)),
  /** Drag & drop feedback: lift the place under the dragged flag. */
  setDropTarget(rec) { if (rec) highlight.showHover(rec); else highlight.clearHover(); },

  /* oceans & seas */
  setWaterState(id, cls, on) { waters.forEach(w => { if (!id || w.water.id === id) w.el.classList.toggle(cls, on); }); },
  clearWaterStates() { waters.forEach(w => w.el.classList.remove('on', 'hint', 'ok')); },
  waterContains: (id, lonLat) => {
    const w = waters.find(x => x.water.id === id);
    return Boolean(w && lonLat && d3.geoContains(w.feature, lonLat));
  },
  waterBox: id => path.bounds(waters.find(w => w.water.id === id).feature),

  /* camera */
  zoomToBox,
  geoBox,
  unionBox,
  zoomToRecord(rec, opts = {}) { zoomToBox(rec.box, { maxK: 9, minSize: 34, pad: 0.5, ...opts }); },
  /** Zoom on the area around a place (used by hints). */
  zoomAround(rec, factor = 6, opts = {}) {
    const [[x0, y0], [x1, y1]] = rec.box;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const half = Math.max(x1 - x0, y1 - y0, 6) * factor / 2;
    zoomToBox([[cx - half, cy - half], [cx + half, cy + half]], { maxK: 7, ...opts });
  },
  zoomToGeo(lonLatBox, opts) { zoomToBox(geoBox(lonLatBox), { maxK: 8, pad: 0.94, ...opts }); },
  resetView(duration = 750) { applyTransform(d3.zoomIdentity, duration); },
  zoomBy(factor) {
    const k = clamp(transform.k * factor, 1, CONFIG.MAX_ZOOM) / transform.k;
    const [cx, cy] = [width / 2, (insets.top + height - insets.bottom) / 2];
    applyTransform(d3.zoomIdentity.translate(cx - (cx - transform.x) * k, cy - (cy - transform.y) * k).scale(transform.k * k), 380);
  },
  /** Unreveal a country revealed in explore mode (back to gray). */
  unreveal(rec) { rec.revealed = false; flags.apply(rec, false); updateLabels(); },
  getTransform: () => transform,
  /** [lon, lat] → screen pixel at the current zoom. */
  toScreen(lonLat) { const p = projection(lonLat); return p ? transform.apply(p) : null; },

  hideTooltip,
};
