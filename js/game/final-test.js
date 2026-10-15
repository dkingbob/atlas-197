/**
 * Final test — at the end of a Study session, redo everything in one go,
 * from memory, with no second try (active recall check).
 *
 * For each country of the session, in a new random order:
 *   1. its flag → write its name
 *   2. click where it is on the gray map
 *   3. (if capitals were studied) write its capital
 *
 * A wrong answer is not repeated: the right answer is shown — the country
 * painted with its flag, and the place you clicked in red with its name —
 * then the test moves on. The results list what to look at again.
 *
 *   FinalTest.start({ ids, capitals })
 */
import { CONFIG, CONTINENTS } from '../config.js';
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { Answers } from '../core/answers.js';
import { Store } from '../core/store.js';
import { $, escapeHtml, shuffle } from '../core/utils.js';
import { t, countryName, capitalName, territoryName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Modal, Toast } from '../ui/components.js';

const RIGHT_PAUSE_MS = 120; // right answer: next one almost at once
const WRONG_PAUSE_MS = 3200;
const END_ID = 'ft-end-modal';

const card = () => $('#ft-card');
const hud = () => $('#ft-hud');

let test = null;
let onModeChange = () => {};
let timer = 0;

/** Steps for each country; the Name / Place switches on the card turn the first two on or off. */
const steps = () => [...(test.askName ? ['name'] : []), ...(test.askPlace ? ['place'] : []), ...(test.capitals ? ['capital'] : [])];
const current = () => COUNTRY_BY_ID.get(test.ids[test.index]);
const record = () => MapView.record(test.ids[test.index]);

/* =====================================================================
   START / STOP
   ===================================================================== */
function start({ ids, capitals = false, askName = true, askPlace = true }) {
  stop({ silent: true });
  if (!ids?.length) return;
  if (!askName && !askPlace) askName = true;
  test = {
    ids: shuffle(ids), capitals, askName, askPlace, index: 0, step: askName ? 'name' : 'place',
    result: null,          // null while answering, then { ok, text, wrongId }
    score: { name: 0, place: 0, capital: 0 },
    misses: new Map(),     // id → set of steps missed
    over: false,
  };
  onModeChange(true);
  document.body.classList.add('in-final');
  MapView.setInsets({ top: $('.topbar').getBoundingClientRect().bottom + 62, bottom: 290 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay('gray');
  MapView.setNameMode('none');
  ask();
}

function stop({ silent = false } = {}) {
  if (!test) return;
  clearTimeout(timer);
  clearMap();
  test = null;
  card().classList.remove('show');
  hud().classList.remove('show');
  document.body.classList.remove('in-final');
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.resetView();
  if (!silent) onModeChange(false);
}

function clearMap() {
  if (!test) return;
  const rec = record();
  if (rec) { MapView.setFlagShown(rec, false); MapView.setState(rec, 'flash-ok', false); }
  if (test.result?.wrongId) MapView.setState(MapView.record(test.result.wrongId), 'flash-bad', false);
  MapView.setPulse([]);
}

/* =====================================================================
   FLOW
   ===================================================================== */
function ask() {
  test.result = null;
  if (test.step === 'place') {
    const rec = record();
    MapView.zoomToGeo(CONTINENTS[rec.continent].view, { duration: 500 }); // its continent: fair, not given away
  }
  render();
  renderHud();
}

function advance() {
  clearTimeout(timer);
  clearMap();
  const list = steps();
  const i = list.indexOf(test.step);
  if (i < list.length - 1) test.step = list[i + 1];
  else {
    test.index++;
    test.step = steps()[0];
    if (test.index >= test.ids.length) return finish();
  }
  ask();
}

function answer(ok, text, wrongId = null) {
  const c = current();
  test.result = { ok, text, wrongId };
  if (ok) test.score[test.step]++;
  else {
    if (!test.misses.has(c.id)) test.misses.set(c.id, new Set());
    test.misses.get(c.id).add(test.step);
  }
  Store.recordAnswer(c.id, { name: 'name', place: 'location', capital: 'capital' }[test.step], ok);
  // show the answer on the map: the right country with its flag, the wrong one in red
  const rec = record();
  MapView.setFlagShown(rec, true);
  if (ok) MapView.setState(rec, 'flash-ok', true);
  else MapView.setPulse([rec]);
  if (wrongId) MapView.setState(MapView.record(wrongId), 'flash-bad', true);
  const focus = wrongId ? MapView.unionBox([rec.box, MapView.record(wrongId).box]) : null;
  if (focus) MapView.zoomToBox(focus, { maxK: 8, pad: 0.7, duration: 550 });
  else if (test.step !== 'place' || !ok) MapView.zoomAround(rec, 5, { minK: 1.4, maxK: 6, duration: 550 });
  render();
  renderHud();
  timer = setTimeout(advance, ok ? RIGHT_PAUSE_MS : WRONG_PAUSE_MS);
}

function submit(value) {
  if (!test || test.result || !value.trim() || test.step === 'place') return;
  const c = current();
  if (test.step === 'capital') {
    if (Answers.isCapital(value, c)) return answer(true, t('studyRight'));
    return answer(false, t('ftItWas', { answer: capitalName(c) }));
  }
  if (Answers.isCountry(value, c)) return answer(true, t('studyRight'));
  const other = Answers.findCountry(value);
  answer(false, other && other !== c.id
    ? t('ftWroteOther', { other: countryName(COUNTRY_BY_ID.get(other)), answer: countryName(c) })
    : t('ftItWas', { answer: countryName(c) }));
}

function onPlaceClick(rec) {
  if (!test || test.result || test.step !== 'place') return;
  if (rec.kind === 'territory') return Toast.show(t('terrNotQuiz', { name: territoryName(rec.territory) }));
  const c = current();
  if (rec.id === c.id) return answer(true, t('studyRight'));
  answer(false, t('ftClickedOther', { other: countryName(rec.country), answer: countryName(c) }), rec.id);
}

/* =====================================================================
   RENDERING
   ===================================================================== */
function render() {
  const c = current();
  const r = test.result;
  const prompt = {
    name: t('rq_flag'),
    place: t('rq_find', { name: escapeHtml(countryName(c)) }),
    capital: t('rq_capital', { name: escapeHtml(countryName(c)) }),
  }[test.step];
  const showFlag = test.step === 'name' || r;
  const typed = test.step !== 'place';
  card().innerHTML = `
    <div class="ft-top"><span class="s-tag">${t('ftTag')}</span>
      <span class="ft-step">${t('ftStep_' + test.step)}</span>
      <span class="ft-switches">
        <button class="ft-sw ${test.askName ? 'on' : ''}" data-act="sw-name" aria-pressed="${test.askName}">${t('ftAskName')}</button>
        <button class="ft-sw ${test.askPlace ? 'on' : ''}" data-act="sw-place" aria-pressed="${test.askPlace}">${t('ftAskPlace')}</button>
      </span></div>
    <h2 class="q-prompt">${prompt}</h2>
    ${showFlag ? `<div class="ft-flag ${r ? (r.ok ? 'ok' : 'bad') : ''}">${flagImage(c.id)}
      ${r ? `<div><b>${escapeHtml(countryName(c))}</b><small>${escapeHtml(capitalName(c))}</small></div>` : ''}</div>` : ''}
    ${r ? `<p class="ft-result ${r.ok ? 'ok' : 'bad'}">${escapeHtml(r.text)}</p>`
    : typed ? `<form class="q-type" autocomplete="off">
        <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${t('typeHere')}">
        <button class="btn btn-primary">${t('submit')}</button></form>`
      : `<p class="q-sub">${t('rushHelpMap')}</p>`}
    <div class="q-foot">
      ${r ? `<button class="q-tool" data-act="next">${ICONS.next}${t('next')} <kbd>↵</kbd></button>`
    : `<button class="q-tool" data-act="dunno">${ICONS.bulb}${t('studyDontKnow')}</button>`}
    </div>`;
  card().classList.add('show');
  if (!r) setTimeout(() => $('input', card())?.focus(), 30);
}

function renderHud() {
  const done = test.index + (test.result && test.step === steps().at(-1) ? 1 : 0);
  const total = test.ids.length;
  hud().innerHTML = `
    <div class="hud-stat"><span>${t('ftTag')}</span>${Math.min(test.index + 1, total)}/${total}</div>
    <div class="hud-prog"><i style="width:${Math.round(done / total * 100)}%"></i></div>
    <div class="hud-stat"><span>${t('ftRight')}</span>${test.score.name + test.score.place + test.score.capital}</div>
    <button class="hud-quit" data-act="quit" title="${t('quit')}" aria-label="${t('quit')}">${ICONS.close}</button>`;
  hud().classList.add('show');
}

/* =====================================================================
   END
   ===================================================================== */
function finish() {
  test.over = true;
  clearMap();
  card().classList.remove('show');
  hud().classList.remove('show');
  const n = test.ids.length;
  const missed = [...test.misses.entries()];
  const stat = step => `<div class="stat"><b>${test.score[step]}/${n}</b><span>${t('ftStep_' + step)}</span></div>`;
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge ${missed.length ? '' : ''}">${missed.length ? ICONS.book : ICONS.trophy}</div>
        <div><h2>${t(missed.length ? 'ftDone' : 'ftPerfect')}</h2><p class="lead flush">${t('ftLead', { n })}</p></div>
      </div>
      <div class="stats">${steps().map(stat).join('')}</div>
      <div class="d-sec"><h3>${t('ftToReview')} (${missed.length})</h3>
        ${missed.length ? `<ul class="missed">${missed.map(([id, set]) => {
          const c = COUNTRY_BY_ID.get(id);
          return `<li>${flagImage(id)}<span>${escapeHtml(countryName(c))}<small>${escapeHtml(capitalName(c))}</small></span>
            <span class="tag">${[...set].map(s => t('ftStep_' + s)).join(' · ')}</span></li>`;
        }).join('')}</ul>` : `<p class="empty">${t('studyNoMistake')}</p>`}</div>
      <div class="d-foot"><span class="pool"></span>
        <button class="btn btn-soft" data-act="back">${t('backMap')}</button>
        ${missed.length ? `<button class="btn btn-bad" data-act="misses">${ICONS.repeat}${t('ftRetryMisses')}</button>` : ''}
        <button class="btn btn-primary" data-act="again">${ICONS.repeat}${t('ftAgain')}</button>
      </div>
    </div>`;
  Modal.open(END_ID);
}

/** Turn "write the name" / "place it" on or off (at least one stays on). */
function toggleStep(key) {
  const other = key === 'askName' ? 'askPlace' : 'askName';
  test[key] = !test[key];
  if (!test[key] && !test[other]) test[other] = true;
  if (!test.result && !steps().includes(test.step)) { clearMap(); test.step = steps()[0]; return ask(); }
  render();
}

function onEndClick(e) {
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (!action || !test) return;
  const { ids, capitals, misses, askName, askPlace } = test;
  Modal.close(END_ID);
  stop();
  if (action === 'again') start({ ids, capitals, askName, askPlace });
  if (action === 'misses') start({ ids: [...misses.keys()], capitals, askName, askPlace });
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const FinalTest = {
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    card().addEventListener('submit', e => { e.preventDefault(); submit($('input', card()).value); });
    card().addEventListener('click', e => {
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'next' && test?.result) advance();
      if ((action === 'sw-name' || action === 'sw-place') && test) toggleStep(action === 'sw-name' ? 'askName' : 'askPlace');
      if (action === 'dunno' && test && !test.result) {
        const c = current();
        answer(false, t('ftItWas', { answer: test.step === 'capital' ? capitalName(c) : countryName(c) }));
      }
    });
    hud().addEventListener('click', e => { if (e.target.closest('[data-act="quit"]')) stop(); });
    document.addEventListener('keydown', e => {
      if (test?.result && !test.over && e.key === 'Enter') { e.preventDefault(); advance(); }
    });
    $('#' + END_ID).addEventListener('click', onEndClick);
  },
  /** Not started from the setup dialog: Study's end screen calls start({ ids, capitals }). */
  start,
  stop,
  isRunning: () => Boolean(test),
  /** Same countries and switches, for "Replay". */
  settings: () => (test ? { ids: test.ids.slice(), capitals: test.capitals, askName: test.askName, askPlace: test.askPlace } : null),
  onPlaceClick,
  refresh() { if (test && !test.over) { render(); renderHud(); } },
  peek: () => (test ? { id: test.ids[test.index], step: test.step, index: test.index, total: test.ids.length, result: test.result, score: { ...test.score }, over: test.over } : null),
};
