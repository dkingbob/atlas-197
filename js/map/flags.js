/* global d3 */
/**
 * Flag fills: each country can be painted with its flag through an SVG <pattern>.
 *
 * Browsers ignore preserveAspectRatio="slice" for SVG images, so the "cover"
 * box (fill the shape, crop the overflow) is computed here from each flag's
 * real aspect ratio, which is read once by loading the image.
 */
import { CONFIG } from '../config.js';

const DEFAULT_ASPECT = 1.5; // most flags are 3:2 — used until the real ratio is known

export function createFlagFills(defs) {
  const aspectByCode = new Map(); // code → ratio, or an array of callbacks while loading

  function loadAspect(code, onReady) {
    const known = aspectByCode.get(code);
    if (typeof known === 'number') return onReady(known);
    if (known) return known.push(onReady);
    const waiting = [onReady];
    aspectByCode.set(code, waiting);
    const img = new Image();
    const done = ratio => { aspectByCode.set(code, ratio); waiting.forEach(fn => fn(ratio)); };
    img.onload = () => done(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : DEFAULT_ASPECT);
    img.onerror = () => done(DEFAULT_ASPECT);
    img.src = CONFIG.flagUrl(code);
  }

  /** Create the two patterns of a record: one for its shape, one for its marker circle. */
  function ensurePatterns(rec) {
    if (rec.shapePattern) return;
    rec.flagAspect = DEFAULT_ASPECT;
    rec.shapePattern = defs.append('pattern').attr('id', 'flag-' + rec.key).attr('patternUnits', 'userSpaceOnUse').node();
    d3.select(rec.shapePattern).append('image').attr('href', CONFIG.flagUrl(rec.flagCode)).attr('preserveAspectRatio', 'none');
    rec.markerPattern = defs.append('pattern').attr('id', 'flag-dot-' + rec.key)
      .attr('patternContentUnits', 'objectBoundingBox').attr('width', 1).attr('height', 1).node();
    d3.select(rec.markerPattern).append('image').attr('href', CONFIG.flagUrl(rec.flagCode)).attr('preserveAspectRatio', 'none');
    fit(rec);
    loadAspect(rec.flagCode, ratio => { rec.flagAspect = ratio; fit(rec); });
  }

  /** Size the patterns so the flag covers the shape's main box (call again after a re-projection). */
  function fit(rec) {
    if (!rec.shapePattern || !rec.box) return;
    const [[x0, y0], [x1, y1]] = rec.box;
    const w = Math.max(x1 - x0, 0.5), h = Math.max(y1 - y0, 0.5), ratio = rec.flagAspect;
    const wider = w / h > ratio;
    const imgW = wider ? w : h * ratio, imgH = wider ? w / ratio : h;
    d3.select(rec.shapePattern).attr('x', x0).attr('y', y0).attr('width', w).attr('height', h)
      .select('image').attr('x', (w - imgW) / 2).attr('y', (h - imgH) / 2).attr('width', imgW).attr('height', imgH);
    const dotW = ratio >= 1 ? ratio : 1, dotH = ratio >= 1 ? 1 : 1 / ratio;
    d3.select(rec.markerPattern).select('image')
      .attr('x', (1 - dotW) / 2).attr('y', (1 - dotH) / 2).attr('width', dotW).attr('height', dotH);
  }

  /** Paint (or un-paint) a record with its flag. */
  function apply(rec, showFlag) {
    const on = showFlag && Boolean(rec.flagCode);
    if (on) ensurePatterns(rec);
    if (rec.pathEl) {
      rec.pathEl.classList.toggle('flagged', on);
      if (on) rec.pathEl.style.setProperty('--flag', `url(#flag-${rec.key})`);
    }
    if (rec.markerEl) {
      rec.markerEl.classList.toggle('flagged', on);
      if (on) rec.markerEl.style.setProperty('--flag-dot', `url(#flag-dot-${rec.key})`);
    }
  }

  return { apply, fit };
}
