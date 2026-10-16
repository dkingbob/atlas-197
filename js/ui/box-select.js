/**
 * Box select (explore mode) — select many countries at once and mark them.
 *
 *   - turn on the "Select" button (or hold Shift) and drag a rectangle on the
 *     map: every country whose name/dot is inside gets selected
 *   - in select mode, clicking a country adds or removes it
 *   - a bar at the bottom: Learn (Study mode with these countries), I know,
 *     I don't know (hard list), remove from "known", remove from "don't know"
 *
 *   BoxSelect.init({ onLearn: ids => …, onChange: () => … })
 */
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { Store } from '../core/store.js';
import { $ } from '../core/utils.js';
import { t, countryName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from './icons.js';
import { flagImage, Toast } from './components.js';

const MIN_DRAG_PX = 6;
const MAX_FLAGS_SHOWN = 8;

let active = false;          // select mode on
let selected = new Set();    // country ids
let drag = null;             // { x0, y0, additive, removing }
let callbacks = { onLearn: () => {}, onChange: () => {} };

const wrap = () => $('#map-wrap');
const rect = () => $('#select-rect');
const bar = () => $('#select-bar');
const button = () => $('#select-btn');

/* ---------- selection ---------- */
function paint() {
  MapView.records().forEach(rec => {
    if (rec.kind === 'country') MapView.setState(rec, 'selected', selected.has(rec.id));
  });
  renderBar();
}

function toggle(id) {
  if (selected.has(id)) selected.delete(id); else selected.add(id);
  paint();
}

function clear() {
  selected = new Set();
  paint();
}

/* ---------- rectangle ---------- */
function point(e) {
  const box = wrap().getBoundingClientRect();
  return [e.clientX - box.left, e.clientY - box.top];
}

function onDown(e) {
  if (e.button !== 0 || !(active || e.shiftKey) || document.body.classList.contains('in-game')) return;
  if (e.target.closest('.zoom-ctrl, #select-bar, .topbar, .legend')) return;
  const [x, y] = point(e);
  drag = { x0: x, y0: y, x1: x, y1: y, moved: false, removing: e.altKey };
  wrap().setPointerCapture?.(e.pointerId);
}

function onMove(e) {
  if (!drag) return;
  [drag.x1, drag.y1] = point(e);
  drag.moved ||= Math.abs(drag.x1 - drag.x0) > MIN_DRAG_PX || Math.abs(drag.y1 - drag.y0) > MIN_DRAG_PX;
  if (!drag.moved) return;
  const r = rect();
  r.style.left = `${Math.min(drag.x0, drag.x1)}px`;
  r.style.top = `${Math.min(drag.y0, drag.y1)}px`;
  r.style.width = `${Math.abs(drag.x1 - drag.x0)}px`;
  r.style.height = `${Math.abs(drag.y1 - drag.y0)}px`;
  r.classList.toggle('removing', drag.removing);
  r.classList.add('show');
}

function onUp() {
  if (!drag) return;
  const d = drag;
  drag = null;
  rect().classList.remove('show');
  if (!d.moved) return; // a simple click: handled as a click on the country
  const [x0, x1] = [Math.min(d.x0, d.x1), Math.max(d.x0, d.x1)];
  const [y0, y1] = [Math.min(d.y0, d.y1), Math.max(d.y0, d.y1)];
  let n = 0;
  for (const rec of MapView.records()) {
    if (rec.kind !== 'country' || rec.dimmed) continue;
    const xy = MapView.screenXY(rec);
    if (!xy || xy[0] < x0 || xy[0] > x1 || xy[1] < y0 || xy[1] > y1) continue;
    if (d.removing) selected.delete(rec.id); else selected.add(rec.id);
    n++;
  }
  if (!active) setActive(true); // Shift + drag also turns select mode on, so the bar stays
  paint();
  if (!n) Toast.show(t('selNone'));
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 0);
}
let suppressClick = false;

/* ---------- mode ---------- */
function setActive(on) {
  active = on;
  MapView.setBoxSelect(on);
  button().classList.toggle('on', on);
  button().setAttribute('aria-pressed', on);
  document.body.classList.toggle('selecting', on);
  if (!on) clear(); else renderBar();
}

/* ---------- actions ---------- */
function act(action) {
  const ids = [...selected];
  if (!ids.length) return;
  if (action === 'learn') { const list = ids.slice(); setActive(false); callbacks.onLearn(list); return; }
  if (action === 'known') ids.forEach(id => Store.setKnown(id, true));
  if (action === 'unknown') Store.addHardMany(ids);
  if (action === 'unknown-off') ids.forEach(id => Store.setHard(id, false));
  if (action === 'known-off') ids.forEach(id => Store.setKnown(id, false));
  if (action === 'clear') return clear();
  Toast.show(t({ known: 'selDone_known', unknown: 'selDone_unknown', 'known-off': 'selDone_knownOff', 'unknown-off': 'selDone_unknownOff' }[action], { n: ids.length }));
  callbacks.onChange();
  renderBar();
}

function renderBar() {
  const show = active;
  bar().classList.toggle('show', show);
  if (!show) return;
  const ids = [...selected];
  const known = ids.filter(id => Store.isKnown(id)).length;
  const hard = ids.filter(id => Store.isHard(id)).length;
  const flags = ids.slice(0, MAX_FLAGS_SHOWN).map(id => flagImage(id, '', countryName(COUNTRY_BY_ID.get(id)))).join('');
  const more = ids.length > MAX_FLAGS_SHOWN ? `<span class="sel-more">+${ids.length - MAX_FLAGS_SHOWN}</span>` : '';
  const off = ids.length ? '' : 'disabled';
  bar().innerHTML = ids.length ? `
    <div class="sel-head">
      <div class="sel-flags">${flags}${more}</div>
      <b>${t('selCount', { n: ids.length })}</b>
      <small>${t('selStatus', { k: known, h: hard })}</small>
      <button class="sel-x" data-sel="clear" title="${t('selClear')}" aria-label="${t('selClear')}">${ICONS.close}</button>
    </div>
    <div class="sel-actions">
      <button class="btn btn-primary sm" data-sel="learn" ${off}>${ICONS.book}${t('selLearn')}</button>
      <button class="btn btn-ok sm" data-sel="known" ${off}>${ICONS.check}${t('selKnown')}</button>
      <button class="btn btn-bad sm" data-sel="unknown" ${off}>${ICONS.bulb}${t('selUnknown')}</button>
      <button class="btn btn-soft sm" data-sel="known-off" ${known ? '' : 'disabled'}>${t('selKnownOff')}</button>
      <button class="btn btn-soft sm" data-sel="unknown-off" ${hard ? '' : 'disabled'}>${t('selUnknownOff')}</button>
    </div>`
    : `<p class="sel-help">${ICONS.select}<span>${t('selHelp')}</span></p>`;
}

/* ---------- public ---------- */
export const BoxSelect = {
  init(cbs) {
    callbacks = { ...callbacks, ...cbs };
    wrap().addEventListener('pointerdown', onDown, true);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    button().addEventListener('click', () => setActive(!active));
    bar().addEventListener('click', e => { const a = e.target.closest('[data-sel]')?.dataset.sel; if (a) act(a); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && active) setActive(false); });
  },
  isActive: () => active,
  /**
   * A click on a country while selecting: add / remove it.
   * @returns true if the click was used by the selection
   */
  onPlaceClick(rec) {
    if (suppressClick) return true;
    if (!active || rec.kind !== 'country') return false;
    toggle(rec.id);
    return true;
  },
  /** Games start: leave select mode. */
  stop() { if (active) setActive(false); },
  refresh() { if (active) renderBar(); },
  selected: () => [...selected],
};

