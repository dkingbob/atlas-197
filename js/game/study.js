/**
 * Study — learn countries for good, with active recall and spaced repetition.
 *
 * For each NEW country:
 *   1. SEE IT      its flag is painted on the map, with name, capital, neighbours
 *                  and a memorable fact. You write the name once to continue.
 *   2. RECALL IT   a bit later, after other countries (spacing): the map is gray.
 *                  Flag only → type the name. Then click where it is.
 *                  (+ the capital, if chosen.)
 *   3. FIX IT      a mistake shows the answer; you write / click it correctly
 *                  before moving on, the country is shown again and comes back
 *                  sooner. It must be recalled right twice to leave the session.
 *
 * Countries studied before come back on review days (1, 2, 4, 8… days later;
 * see srs.js). A miss sends them back to day 1.
 *
 * Other learning techniques used: a small working set of new countries at a
 * time (chunking), mixing new and review countries (interleaving), "you wrote
 * Niger — here is Niger's flag" side-by-side comparisons (discrimination),
 * neighbours and a fact for each country (elaboration).
 *
 * Settings: { conts: [continent ids], levels: [1..5], newCount, capitals: boolean,
 *             askName / askPlace: which recall steps to do (at least one) }
 */
import { CONTINENT_IDS, CONTINENTS, CONFIG } from '../config.js';
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries/index.js';
import { levelOf, LEVEL_IDS } from '../data/difficulty.js';
import { Answers } from '../core/answers.js';
import { Store } from '../core/store.js';
import { $, escapeHtml } from '../core/utils.js';
import { t, lang, countryName, capitalName, continentName, territoryName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Modal, Toast } from '../ui/components.js';
import { SessionQueue, planSession, nextCard, lapsedCard, deckSummary, isDue, DAY_MS } from './srs.js';
import { Recap } from './recap.js';
import { FinalTest } from './final-test.js';

export const STUDY_NEW_COUNTS = [3, 5, 10, 15, 20];
export const DEFAULT_STUDY_SETTINGS = { conts: CONTINENT_IDS.slice(), levels: [1, 2], newCount: 5, capitals: false, recap: 'none', askName: true, askPlace: true };
/** Before the new countries: nothing, a quiz on everything seen, or a slideshow of everything seen. */
export const RECAP_CHOICES = ['none', 'quiz', 'slideshow'];

const WORKING_SET = 4;
const OK_TYPED_MS = 150;   // right typed answer: go on almost at once
const OK_PLACE_MS = 450;   // right click: a short green flash on the map
const END_ID = 'study-end-modal';

const card = () => $('#study-card');
const hud = () => $('#study-hud');

let run = null;
let onModeChange = () => {};

/* =====================================================================
   DECK
   ===================================================================== */
const continentOrder = id => CONTINENT_IDS.indexOf(id);

/** Countries of the deck, easiest first, grouped by region (neighbours are learned together). */
export function studyDeck(settings) {
  const levels = settings.levels?.length ? settings.levels : LEVEL_IDS;
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  return COUNTRIES
    .filter(c => levels.includes(levelOf(c.id)) && conts.includes(c.continent))
    .sort((a, b) => levelOf(a.id) - levelOf(b.id) || continentOrder(a.continent) - continentOrder(b.continent)
      || a.name.en.localeCompare(b.name.en))
    .map(c => c.id);
}

/** Countries of the deck already studied, in a map-friendly order (by region, west to east). */
export function seenIds(settings) {
  const cards = Store.srsCards();
  return studyDeck(settings).filter(id => cards[id])
    .sort((a, b) => continentOrder(COUNTRY_BY_ID.get(a).continent) - continentOrder(COUNTRY_BY_ID.get(b).continent)
      || (MapView.record(a)?.labelLonLat?.[0] ?? 0) - (MapView.record(b)?.labelLonLat?.[0] ?? 0));
}

/** { total, fresh, due, learning, mastered, nextDue } for the setup screen. */
export const studySummary = settings => deckSummary(studyDeck(settings), Store.srsCards(), Date.now());

/* =====================================================================
   START / STOP
   ===================================================================== */
function start(settings) {
  stop({ silent: true });
  const recapQuiz = settings.recap === 'quiz';
  const plan = planSession({
    deckIds: studyDeck(settings), cards: Store.srsCards(), now: Date.now(), newLimit: settings.newCount,
    reviewAll: recapQuiz, reviewLimit: recapQuiz ? 200 : 50,
  });
  const slides = settings.recap === 'slideshow' ? seenIds(settings) : [];
  if (!plan.reviews.length && !plan.fresh.length && !slides.length) return Toast.show(t('studyNothing'));
  const now = Date.now();
  run = {
    settings,
    plan,
    early: new Set(plan.reviews.filter(id => !isDue(Store.srsCards()[id], now))), // recap quiz: not due yet
    queue: new SessionQueue({ ...plan, workingSet: WORKING_SET, reviewsFirst: recapQuiz }),
    current: null,       // { id, step, kind }
    phase: '',           // see render()
    missed: false,       // a mistake on the current country (this round)
    feedback: '', feedbackType: '',
    confusion: null,     // id of the country the player wrote instead
    locked: false,
    newLearned: 0, reviewed: 0, reviewedClean: 0,
    tricky: new Map(),   // id → misses
    over: false,
  };
  onModeChange(true);
  document.body.classList.add('in-study');
  prepareMap();
  if (slides.length) {
    run.phase = 'recap';
    Recap.play(slides, {
      onDone: () => {
        if (!run) return;
        if (!plan.reviews.length && !plan.fresh.length) { Toast.show(t('recapDone')); return stop(); }
        next();
      },
      onQuit: () => stop(),
    });
    return;
  }
  next();
}

function stop({ silent = false } = {}) {
  if (!run) return;
  run.over = true;
  Recap.stop();
  clearCountryFromMap();
  run = null;
  card().classList.remove('show');
  hud().classList.remove('show');
  document.body.classList.remove('in-study');
  MapView.setDimmed(null);
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.resetView();
  if (!silent) onModeChange(false);
}

function prepareMap() {
  const conts = run.settings.conts?.length ? run.settings.conts : CONTINENT_IDS;
  MapView.setInsets({ top: $('.topbar').getBoundingClientRect().bottom + 62, bottom: 300 });
  MapView.setCenter(conts.length === 1 && conts[0] === 'OCE' ? CONFIG.PACIFIC_CENTER : CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay('gray');
  MapView.setNameMode('none');
  MapView.setDimmed(conts.length < CONTINENT_IDS.length ? rec => !conts.includes(rec.continent) : null);
}

/* =====================================================================
   FLOW
   ===================================================================== */
const country = () => (run?.current ? COUNTRY_BY_ID.get(run.current.id) : null);
const record = () => (run?.current ? MapView.record(run.current.id) : null);

/** Recall steps for one round, in order. */
const recallPhases = () => {
  const { askName = true, askPlace = true, capitals } = run.settings;
  const list = [...(askName || !askPlace ? ['name'] : []), ...(askPlace ? ['place'] : []), ...(capitals ? ['capital'] : [])];
  return list;
};

function next() {
  if (!run || run.over) return;
  clearCountryFromMap();
  const step = run.queue.next();
  if (!step) return finish();
  run.current = step;
  run.missed = false;
  run.confusion = null;
  run.feedback = '';
  run.locked = false;
  setPhase(step.step === 'present' ? 'present' : recallPhases()[0]);
}

function setPhase(phase) {
  run.phase = phase;
  run.locked = false;
  run.feedback = '';
  showOnMap();
  render();
  renderHud();
}

/** Move to the next recall step, or close the round. */
function phaseDone() {
  const phases = recallPhases();
  const base = run.phase.replace('fix-', '');
  const i = phases.indexOf(base);
  if (i >= 0 && i < phases.length - 1) return setPhase(phases[i + 1]);
  endRound(!run.missed);
}

function endRound(clean) {
  const entry = run.queue.report(run.current.id, clean);
  if (entry) saveCard(entry);
  next();
}

/** Save the spaced-repetition card of a country that left the session. */
function saveCard(entry) {
  const now = Date.now();
  const cards = Store.srsCards();
  const wasReview = entry.kind !== 'fresh';
  // a recap of a country not due yet does not move it up a box (that would skip the spacing)
  if (!(run.early.has(entry.id) && entry.clean)) {
    Store.setSrsCard(entry.id, nextCard(cards[entry.id], { wasReview, cleanReview: entry.clean, now }));
  }
  if (entry.kind === 'fresh') run.newLearned++;
  else { run.reviewed++; if (entry.clean) run.reviewedClean++; }
}

function miss() {
  if (!run.missed) {
    run.missed = true;
    const { id, kind } = run.current;
    run.tricky.set(id, (run.tricky.get(id) || 0) + 1);
    if (kind === 'review') Store.setSrsCard(id, lapsedCard(Store.srsCards()[id], Date.now()));
  }
}

/* ---------- map ---------- */
function clearCountryFromMap() {
  const rec = record();
  if (rec) {
    MapView.setFlagShown(rec, false);
    MapView.setState(rec, 'target', false);
  }
  MapView.setPulse([]);
}

function showOnMap() {
  const rec = record();
  if (!rec) return;
  const reveal = run.phase === 'present' || run.phase === 'fix-place';
  MapView.setFlagShown(rec, reveal);
  MapView.setPulse(reveal ? [rec] : []);
  if (run.phase === 'present') MapView.zoomAround(rec, 5, { minK: 1.4, maxK: 6, duration: 600 });
  else if (run.phase === 'place' || run.phase === 'name') MapView.zoomToGeo(CONTINENTS[rec.continent].view, { duration: 500 });
}

/* =====================================================================
   RENDERING
   ===================================================================== */
const otherLang = () => (lang() === 'en' ? 'fr' : 'en');
const neighborsText = rec => (rec?.neighbors || []).map(id => countryName(COUNTRY_BY_ID.get(id))).sort().join(', ');
const memoryHook = c => c.keyFacts[lang()][c.keyFacts[lang()].length - 1];

function inputRow(placeholder) {
  return `<form class="q-type r-form" data-form="answer" autocomplete="off">
      <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
        placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}" ${run.locked ? 'disabled' : ''}>
      <button class="btn btn-primary" ${run.locked ? 'disabled' : ''}>${t('submit')}</button>
    </form>`;
}

function presentHtml(c) {
  const rec = record();
  const neighbors = neighborsText(rec);
  const other = c.name[otherLang()] !== countryName(c) ? `<small>${escapeHtml(c.name[otherLang()])}</small>` : '';
  return `
    <div class="s-tag">${t(run.current.kind === 'fresh' ? 'studyNew' : 'studyAgain')}</div>
    <div class="s-learn">
      <div class="s-flag">${flagImage(c.id, '', countryName(c))}</div>
      <div class="s-info">
        <h2>${escapeHtml(countryName(c))} ${other}</h2>
        <dl>
          <dt>${t('capital')}</dt><dd>${escapeHtml(capitalName(c))}</dd>
          <dt>${t('continent')}</dt><dd>${escapeHtml(continentName(c.continent))}</dd>
          ${neighbors ? `<dt>${t('neighbours')}</dt><dd>${escapeHtml(neighbors)}</dd>` : ''}
        </dl>
        <p class="s-hook">${ICONS.bulb}${escapeHtml(memoryHook(c))}</p>
      </div>
    </div>
    <p class="q-sub">${t('studyWriteOnce')}</p>
    ${inputRow(countryName(c))}
    <div class="q-foot"><div class="q-feedback ${run.feedbackType}">${escapeHtml(run.feedback)}</div></div>`;
}

function recallHtml(c) {
  const phase = run.phase;
  const fixing = phase.startsWith('fix-');
  const base = phase.replace('fix-', '');
  let prompt, body = '', help = '';
  if (base === 'name') {
    prompt = fixing ? t('studyFixName', { name: escapeHtml(countryName(c)) }) : t('rq_flag');
    body = `<div class="s-recall-flag">${flagImage(c.id)}${confusionHtml()}</div>${inputRow(t('typeHere'))}`;
  } else if (base === 'place') {
    prompt = fixing ? t('studyFixPlace', { name: escapeHtml(countryName(c)) }) : t('rq_find', { name: escapeHtml(countryName(c)) });
    help = t(fixing ? 'studyFixPlaceHelp' : 'rushHelpMap');
  } else {
    prompt = fixing ? t('studyFixCapital', { name: escapeHtml(capitalName(c)) }) : t('rq_capital', { name: escapeHtml(countryName(c)) });
    body = inputRow(t('typeHere'));
  }
  return `
    <div class="s-tag ${fixing ? 'fix' : ''}">${fixing ? t('studyFix') : t('studyRecall')}</div>
    <h2 class="q-prompt">${prompt}</h2>
    ${help ? `<p class="q-sub">${help}</p>` : ''}
    ${body}
    <div class="q-foot">
      ${fixing ? '' : `<button class="q-tool" data-act="reveal" ${run.locked ? 'disabled' : ''}>${ICONS.bulb}${t('studyDontKnow')}</button>`}
      <div class="q-feedback ${run.feedbackType}">${escapeHtml(run.feedback)}</div>
    </div>`;
}

/** "You wrote Niger — this is Niger's flag", next to the right one. */
function confusionHtml() {
  if (!run.confusion) return '';
  const other = COUNTRY_BY_ID.get(run.confusion);
  return `<div class="s-confuse">${flagImage(other.id)}<small>${t('studyYouWrote', { name: escapeHtml(countryName(other)) })}</small></div>`;
}

function render() {
  const c = country();
  if (!c) return;
  card().innerHTML = run.phase === 'present' ? presentHtml(c) : recallHtml(c);
  card().className = `glass show phase-${run.phase}`;
  const field = $('input', card());
  if (field && !run.locked) setTimeout(() => field.focus(), 40);
}

function renderHud() {
  if (!run) return;
  const q = run.queue;
  const pct = Math.round(q.done / Math.max(1, q.total) * 100);
  hud().innerHTML = `
    <div class="hud-stat"><span>${t('studyLearning')}</span>${q.learningCount() + q.waiting.length}</div>
    <div class="hud-stat"><span>${t('studyReviews')}</span>${[...q.active.values()].filter(it => it.kind !== 'fresh').length}</div>
    <div class="hud-prog" title="${q.done}/${q.total}"><i style="width:${pct}%"></i></div>
    <div class="hud-stat">${q.done}/${q.total}</div>
    <button class="hud-quit" data-act="quit" title="${t('quit')}" aria-label="${t('quit')}">${ICONS.close}</button>`;
  hud().classList.add('show');
}

function setFeedback(text, type) {
  run.feedback = text;
  run.feedbackType = type;
  const el = $('.q-feedback', card());
  if (el) { el.textContent = text; el.className = `q-feedback ${type}`; }
}

function shakeInput() {
  const field = $('input', card());
  if (!field) return;
  field.classList.remove('shake'); void field.offsetWidth; field.classList.add('shake');
  field.select();
}

/* =====================================================================
   ANSWERS
   ===================================================================== */
function onSubmit(value) {
  const c = country();
  if (!run || run.locked || !c || !value.trim()) return;
  const phase = run.phase;
  const wantsCapital = phase === 'capital' || phase === 'fix-capital';
  const right = wantsCapital ? Answers.isCapital(value, c) : Answers.isCountry(value, c);

  if (phase === 'present') {
    if (!right) { setFeedback(t('studyCopyIt', { name: countryName(c) }), 'bad'); return shakeInput(); }
    run.locked = true;
    return next(); // the recall comes later, after other countries
  }
  if (phase.startsWith('fix-')) {
    if (!right) { setFeedback(t('studyCopyIt', { name: wantsCapital ? capitalName(c) : countryName(c) }), 'bad'); return shakeInput(); }
    return accepted();
  }
  if (right) return accepted();

  miss();
  if (phase === 'name') {
    const wrote = Answers.findCountry(value);
    run.confusion = wrote && wrote !== c.id ? wrote : null;
    Store.recordAnswer(c.id, 'name', false);
  } else {
    Store.recordAnswer(c.id, 'capital', false);
  }
  setPhase('fix-' + phase);
}

function accepted() {
  const c = country();
  const base = run.phase.replace('fix-', '');
  if (!run.phase.startsWith('fix-')) Store.recordAnswer(c.id, base === 'place' ? 'location' : base, true);
  run.locked = true;
  run.confusion = null;
  render();
  setFeedback(run.phase.startsWith('fix-') ? t('studyLocked') : t('studyRight'), 'ok');
  const placed = base === 'place';
  if (placed) MapView.flash(record(), true, OK_PLACE_MS);
  setTimeout(() => { if (run && !run.over) phaseDone(); }, placed ? OK_PLACE_MS : OK_TYPED_MS);
}

function reveal() {
  if (!run || run.locked || run.phase === 'present' || run.phase.startsWith('fix-')) return;
  miss();
  const subject = run.phase === 'place' ? 'location' : run.phase;
  Store.recordAnswer(country().id, subject, false);
  setPhase('fix-' + run.phase);
}

function onPlaceClick(rec) {
  if (!run || run.locked) return;
  if (run.phase !== 'place' && run.phase !== 'fix-place') return;
  if (rec.kind === 'territory') return Toast.show(t('terrNotQuiz', { name: territoryName(rec.territory) }));
  const c = country();
  if (rec.id === c.id) return accepted();
  MapView.flash(rec, false, 900);
  Toast.show(t('studyThatsX', { name: countryName(rec.country) }));
  if (run.phase === 'place') {
    miss();
    Store.recordAnswer(c.id, 'location', false);
    setPhase('fix-place');
  }
}

/* =====================================================================
   END
   ===================================================================== */
function finish() {
  const summary = studySummary(run.settings);
  const tricky = [...run.tricky.entries()].sort((a, b) => b[1] - a[1]);
  const items = tricky.map(([id, misses]) => {
    const c = COUNTRY_BY_ID.get(id);
    return `<li>${flagImage(id)}<span>${escapeHtml(countryName(c))}<small>${escapeHtml(capitalName(c))}</small></span><span class="tag">×${misses}</span></li>`;
  }).join('');
  const nextReview = summary.nextDue ? whenText(summary.nextDue) : '—';
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge">${ICONS.book}</div>
        <div><h2>${t('studyDoneTitle')}</h2><p class="lead flush">${t('studyDoneLead', { n: run.newLearned, r: run.reviewed })}</p></div>
      </div>
      <div class="stats">
        <div class="stat"><b>${run.newLearned}</b><span>${t('studyNewLearned')}</span></div>
        <div class="stat"><b>${run.reviewedClean}/${run.reviewed}</b><span>${t('studyReviewedOk')}</span></div>
        <div class="stat"><b>${summary.mastered}</b><span>${t('studyMastered')}</span></div>
        <div class="stat"><b>${escapeHtml(nextReview)}</b><span>${t('studyNextReview')}</span></div>
      </div>
      <div class="d-sec"><h3>${t('studyTricky')} (${tricky.length})</h3>
        ${items ? `<ul class="missed">${items}</ul>` : `<p class="empty">${t('studyNoMistake')}</p>`}</div>
      <p class="note">${t('studyComeBack')}</p>
      <div class="d-foot"><span class="pool"></span>
        <button class="btn btn-soft" data-act="back">${t('backMap')}</button>
        <button class="btn btn-accent" data-act="final" ${run.queue.finished.length ? '' : 'disabled'}>${ICONS.repeat}${t('ftButton')}</button>
        <button class="btn btn-primary" data-act="more" ${summary.fresh || summary.due ? '' : 'disabled'}>${ICONS.repeat}${t('studyMore')}</button>
      </div>
    </div>`;
  run.over = true;
  card().classList.remove('show');
  hud().classList.remove('show');
  Modal.open(END_ID);
}

/** "today", "tomorrow", "in 3 days". */
export function whenText(timestamp) {
  const days = Math.ceil((timestamp - Date.now()) / DAY_MS);
  if (days <= 0) return t('today');
  if (days === 1) return t('tomorrow');
  return t('inDays', { n: days });
}

function onEndClick(e) {
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (!action) return;
  const settings = run?.settings;
  const sessionIds = run?.queue.finished.map(f => f.id) || [];
  Modal.close(END_ID);
  stop();
  if (action === 'more' && settings) start(settings);
  if (action === 'final' && sessionIds.length) FinalTest.start({ ids: sessionIds, capitals: settings.capitals, askName: settings.askName !== false, askPlace: settings.askPlace !== false });
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const Study = {
  /** @param {{ onModeChange: (inGame: boolean) => void }} callbacks */
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    Recap.init();
    card().addEventListener('submit', e => { e.preventDefault(); onSubmit($('input', card()).value); });
    card().addEventListener('click', e => { if (e.target.closest('[data-act="reveal"]')) reveal(); });
    hud().addEventListener('click', e => { if (e.target.closest('[data-act="quit"]')) stop(); });
    $('#' + END_ID).addEventListener('click', onEndClick);
  },
  start,
  stop,
  isRunning: () => Boolean(run),
  onPlaceClick,
  refresh() {
    if (!run || run.over) return;
    if (run.phase === 'recap') return Recap.refresh();
    render();
    renderHud();
  },
  /** Snapshot for tests and the console. */
  peek: () => (run ? { id: run.current?.id || null, phase: run.phase, kind: run.current?.kind, done: run.queue.done, total: run.queue.total, over: run.over } : null),
};
