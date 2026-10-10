/**
 * Flag match: drag each flag onto the right target, in batches of 5–8.
 *
 *   subject 'name'      → targets are country names (list on the right)
 *   subject 'capital'   → targets are capitals (list on the right)
 *   subject 'location'  → targets are the countries on the map
 *
 * Works with mouse, pen and touch (pointer events). Tapping a flag selects it;
 * tapping a target then counts as dropping it there.
 */
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { $, $$, escapeHtml, shuffle } from '../core/utils.js';
import { t, countryName, capitalName, territoryName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Toast } from '../ui/components.js';

const MAX_BATCH = 8;
const DRAG_THRESHOLD_PX = 6;
const tray = () => $('#fm-tray');
const list = () => $('#fm-list');
let ctx = null;

const usesMap = () => ctx.config.subject === 'location';

/* ---------- batches ---------- */
/** Split n items into batches of at most 8, as even as possible (20 → 7, 7, 6). */
function makeBatches(items) {
  const count = items.length <= MAX_BATCH ? 1 : Math.ceil(items.length / MAX_BATCH);
  const batches = [];
  let from = 0;
  for (let b = 0; b < count; b++) {
    const size = Math.round((items.length - from) / (count - b));
    batches.push(items.slice(from, from + size));
    from += size;
  }
  return batches;
}

function start() {
  const { state } = ctx;
  state.batches = makeBatches(state.questions.map(q => q.item));
  state.questions.forEach(q => ctx.markAsked(q.item));
  state.batchIndex = 0;
  state.matchedCount = 0;      // flags placed or skipped (drives the progress bar)
  state.missedIds = new Set(); // flags that had at least one wrong drop
  startBatch();
}

function startBatch() {
  const { state } = ctx;
  ctx.clearMapHighlights();
  const batch = state.batches[state.batchIndex];
  state.remaining = shuffle(batch.map(c => c.id)); // flags still in the tray
  state.selected = null;
  if (usesMap()) {
    document.body.classList.remove('fm-list-on');
    ctx.regionView();
  } else {
    document.body.classList.add('fm-list-on');
    state.targets = shuffle(batch.map(c => c.id));
  }
  render();
}

function batchDone() {
  const { state } = ctx;
  state.batchIndex++;
  if (state.batchIndex >= state.batches.length) ctx.later(() => ctx.finish(true), 700);
  else ctx.later(() => { MapView.clearState('matched'); startBatch(); }, 800);
}

/* ---------- rendering ---------- */
function render() {
  const { state, config } = ctx;
  if (!state || state.over) return;
  tray().innerHTML = `
    <div class="fm-head">
      <p><b>${t('fm_batch', { i: state.batchIndex + 1, n: state.batches.length })}</b><span class="fm-help"> · ${t('fm_help')}</span></p>
      <button class="q-tool" data-act="hint" ${state.hints ? '' : 'disabled'}>${ICONS.bulb}${t('hint')}<span class="n">${state.hints}</span></button>
      <button class="q-tool" data-act="skip" ${state.skips ? '' : 'disabled'}>${ICONS.skip}${t('skip')}<span class="n">${state.skips}</span></button>
    </div>
    <div class="fm-chips">${state.remaining.map(id => `
      <div class="fm-chip ${state.selected === id ? 'sel' : ''}" data-chip="${id}" role="button" tabindex="0" aria-label="flag">${flagImage(id)}</div>`).join('')}
    </div>`;
  tray().classList.add('show');
  if (!usesMap()) {
    list().innerHTML = state.targets.map(id => {
      const c = COUNTRY_BY_ID.get(id);
      const placed = !state.remaining.includes(id);
      const label = config.subject === 'capital' ? capitalName(c) : countryName(c);
      return `<button class="fm-target ${placed ? 'done' : ''}" data-target-id="${id}" ${placed ? 'disabled' : ''}>
        ${placed ? flagImage(id) : ''}<span>${escapeHtml(label)}</span></button>`;
    }).join('');
  }
}

function select(id) {
  const { state } = ctx;
  state.selected = state.selected === id ? null : id;
  $$('.fm-chip', tray()).forEach(chip => chip.classList.toggle('sel', chip.dataset.chip === state.selected));
}

/* ---------- dropping ---------- */
function attempt(flagId, targetId, targetRec = null) {
  const { state } = ctx;
  if (!state || state.over || !state.remaining.includes(flagId)) return;
  const correct = flagId === targetId;
  const chip = $(`[data-chip="${flagId}"]`, tray());
  ctx.scoreAnswer({ correct, countryId: flagId, reduced: state.missedIds.has(flagId) });

  if (correct) {
    state.matchedCount++;
    state.remaining = state.remaining.filter(id => id !== flagId);
    if (state.selected === flagId) state.selected = null;
    if (usesMap()) {
      const rec = MapView.record(flagId);
      MapView.setState(rec, 'target', false);
      MapView.setState(rec, 'matched', true);
      MapView.flash(rec, true, 700);
    }
    render();
    ctx.renderHud();
    if (!state.remaining.length) batchDone();
    return;
  }

  if (!state.missedIds.has(flagId)) {
    state.missedIds.add(flagId);
    state.missed.push({ question: { kind: 'country', item: COUNTRY_BY_ID.get(flagId) } });
  }
  if (chip) { chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake'); }
  if (targetRec) MapView.flash(targetRec, false, 900);
  const target = targetId && $(`[data-target-id="${targetId}"]`, list());
  if (target) { target.classList.add('bad'); setTimeout(() => target.classList.remove('bad'), 700); }
  ctx.renderHud();
  if (state.lives <= 0) { state.locked = true; ctx.later(() => ctx.finish(false), 900); }
}

function onPlaceClick(rec) {
  const { state } = ctx;
  if (!usesMap() || state.locked) return;
  if (rec.kind === 'territory') return Toast.show(t('terrNotQuiz', { name: territoryName(rec.territory) }));
  if (!state.selected) return Toast.show(t('pickFlag'));
  attempt(state.selected, rec.id, rec);
}

/* ---------- hint & skip ---------- */
function useHint() {
  const { state } = ctx;
  if (!state.hints) return Toast.show(t('noHints'));
  const id = state.selected || state.remaining[0];
  if (!id) return;
  state.hints--;
  if (!state.selected) select(id);
  if (usesMap()) {
    const rec = MapView.record(id);
    MapView.setState(rec, 'target', true);
    MapView.zoomAround(rec, 6, { minK: 2 });
    ctx.later(() => MapView.setState(rec, 'target', false), 2600);
  } else {
    const target = $(`[data-target-id="${id}"]`, list());
    if (target) {
      target.classList.add('pulse');
      target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      setTimeout(() => target.classList.remove('pulse'), 3000);
    }
  }
  render();
}

function skip() {
  const { state } = ctx;
  if (!state.skips) return Toast.show(t('noSkips'));
  const id = state.selected || state.remaining[0];
  if (!id) return;
  state.skips--;
  const country = COUNTRY_BY_ID.get(id);
  if (!state.missedIds.has(id)) state.missed.push({ question: { kind: 'country', item: country }, skipped: true });
  state.remaining = state.remaining.filter(x => x !== id);
  state.selected = null;
  state.matchedCount++;
  if (usesMap()) MapView.flash(MapView.record(id), true, 1500);
  Toast.show(t('skippedWas', { answer: ctx.answerText({ kind: 'country', item: country }) }));
  render();
  ctx.renderHud();
  if (!state.remaining.length) batchDone();
}

/* ---------- drag with pointer events ---------- */
function dropTargetAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  const item = el.closest('[data-target-id]');
  if (item && !item.disabled) return { id: item.dataset.targetId, item };
  if (usesMap()) {
    const rec = MapView.recordAt(x, y);
    if (rec?.kind === 'country' && !rec.dimmed) return { id: rec.id, rec };
  }
  return null;
}

function onPointerDown(e) {
  const chip = e.target.closest('[data-chip]');
  if (!chip || !ctx.state || ctx.state.locked || e.button > 0) return;
  e.preventDefault();
  const flagId = chip.dataset.chip;
  const startX = e.clientX, startY = e.clientY;
  let ghost = null, hovered = null;
  chip.setPointerCapture(e.pointerId);

  const setHovered = target => {
    hovered?.item?.classList.remove('over');
    hovered = target;
    hovered?.item?.classList.add('over');
    MapView.setDropTarget(hovered?.rec || null);
  };
  const move = ev => {
    if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD_PX) {
      ghost = document.createElement('div');
      ghost.className = 'fm-ghost';
      ghost.innerHTML = chip.innerHTML;
      document.body.appendChild(ghost);
      chip.classList.add('dragging');
    }
    if (!ghost) return;
    ghost.style.transform = `translate(${ev.clientX - ghost.offsetWidth / 2}px,${ev.clientY - ghost.offsetHeight / 2}px) rotate(-4deg)`;
    setHovered(dropTargetAt(ev.clientX, ev.clientY));
  };
  const end = ev => {
    chip.removeEventListener('pointermove', move);
    chip.removeEventListener('pointerup', end);
    chip.removeEventListener('pointercancel', end);
    if (ghost) {
      const target = dropTargetAt(ev.clientX, ev.clientY);
      setHovered(null);
      ghost.remove();
      chip.classList.remove('dragging');
      if (target && ev.type === 'pointerup') attempt(flagId, target.id, target.rec);
    } else if (ev.type === 'pointerup') {
      select(flagId); // a tap, not a drag
    }
  };
  chip.addEventListener('pointermove', move);
  chip.addEventListener('pointerup', end);
  chip.addEventListener('pointercancel', end);
}

/* ---------- public ---------- */
export const FlagMatch = {
  init(context) {
    ctx = context;
    tray().addEventListener('pointerdown', onPointerDown);
    tray().addEventListener('click', e => {
      if (!ctx.state || !ctx.isFlagMatch()) return;
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'hint') useHint();
      if (action === 'skip') skip();
    });
    tray().addEventListener('keydown', e => {
      const chip = e.target.closest('[data-chip]');
      if (chip && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(chip.dataset.chip); }
    });
    list().addEventListener('click', e => {
      const target = e.target.closest('[data-target-id]');
      if (!target || !ctx.state || ctx.state.locked) return;
      if (!ctx.state.selected) return Toast.show(t('pickFlag'));
      attempt(ctx.state.selected, target.dataset.targetId);
    });
  },
  start,
  onPlaceClick,
  refresh: render,
  hide() {
    tray().classList.remove('show');
    document.body.classList.remove('fm-list-on');
    list().innerHTML = '';
  },
};
