/**
 * Rush — timed modes: answer as many countries as you can before the clock runs out.
 * Used for solo play and for party (multiplayer) games, where every player gets
 * the same sequence of countries.
 *
 * Rush types (settings.rushMode):
 *   flag-map   the country is painted with its flag on the map → type its name
 *   flag-only  only the flag is shown                            → type the country
 *   capital    the country is highlighted and named              → type its capital
 *   map-hunt   the country is named                              → click it on the map
 *   survival   like flag-map, easy → very hard, 3 mistakes and you are out
 *
 * Settings shape: { rushMode, duration (seconds), levels: [1..5], conts: [continent ids] }
 *
 * Scoring: each country is worth its difficulty points (data/difficulty.js).
 * A hint costs 40 % of that value. Passing gives 0. Wrong answers cost nothing
 * (you may retry), except in survival where they cost a life.
 */
import { CONTINENT_IDS, CONFIG } from '../config.js';
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries/index.js';
import { levelOf, pointsFor, LEVEL_IDS } from '../data/difficulty.js';
import { Answers } from '../core/answers.js';
import { Store } from '../core/store.js';
import { $, escapeHtml, shuffle } from '../core/utils.js';
import { t, countryName, capitalName, continentName, territoryName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Modal, Toast } from '../ui/components.js';

export const RUSH_MODES = ['flag-map', 'flag-only', 'capital', 'map-hunt', 'survival'];
export const RUSH_DURATIONS = [60, 90, 120, 180, 300];
export const DEFAULT_RUSH_SETTINGS = { rushMode: 'flag-map', duration: 90, levels: [1, 2, 3], conts: CONTINENT_IDS.slice() };

const HINT_COST_SHARE = 0.4;
const MAX_HINTS_PER_COUNTRY = 2;
const SURVIVAL_LIVES = 3;
const NEXT_DELAY_MS = 450;
const END_ID = 'rush-end-modal';

const card = () => $('#rush-card');
const hud = () => $('#rush-hud');
const board = () => $('#scoreboard');

let run = null;              // the running round (null when idle)
let onModeChange = () => {};
let clock = 0;

/* =====================================================================
   SEQUENCE
   ===================================================================== */
/** Countries matching the settings, in play order. */
export function buildRushSequence(settings) {
  const levels = settings.levels?.length ? settings.levels : LEVEL_IDS;
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  const pool = COUNTRIES.filter(c => levels.includes(levelOf(c.id)) && conts.includes(c.continent));
  if (settings.rushMode !== 'survival') return shuffle(pool).map(c => c.id);
  // survival: easy first, then harder and harder
  return LEVEL_IDS.flatMap(level => shuffle(pool.filter(c => levelOf(c.id) === level))).map(c => c.id);
}

export const rushPoolSize = settings => buildRushSequence(settings).length;

/* =====================================================================
   START / STOP
   ===================================================================== */
/**
 * @param {object} options
 *   settings     rush settings
 *   sequence     country ids in play order (built here when omitted)
 *   party        { onProgress(stats), onFinish(result) } for multiplayer, or null
 */
function start({ settings, sequence = null, party = null }) {
  stop({ silent: true });
  const ids = sequence || buildRushSequence(settings);
  if (!ids.length) return Toast.show(t('poolEmpty'));
  run = {
    settings, party, ids,
    index: -1,
    score: 0, found: 0, passed: 0,
    lives: settings.rushMode === 'survival' ? SURVIVAL_LIVES : null,
    history: [],               // [{ id, status: 'found'|'passed'|'missed', points, hints }]
    hintsHere: 0,
    endsAt: performance.now() + settings.duration * 1000,
    over: false,
    locked: false,
  };
  onModeChange(true);
  document.body.classList.add('in-rush');
  prepareMap();
  next();
  tick();
  clock = setInterval(tick, 250);
}

/** Abort a round (quit button, leaving a party…). */
function stop({ silent = false } = {}) {
  if (!run) return;
  clearInterval(clock);
  run.over = true;
  run = null;
  restoreMap();
  card().classList.remove('show');
  hud().classList.remove('show');
  document.body.classList.remove('in-rush');
  if (!silent) onModeChange(false);
}

function prepareMap() {
  const conts = run.settings.conts?.length ? run.settings.conts : CONTINENT_IDS;
  const topbarBottom = $('.topbar').getBoundingClientRect().bottom;
  MapView.setInsets({ top: topbarBottom + 62, bottom: 210 });
  const oceaniaOnly = conts.length === 1 && conts[0] === 'OCE';
  MapView.setCenter(oceaniaOnly ? CONFIG.PACIFIC_CENTER : CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay('gray');
  MapView.setNameMode(run.settings.rushMode === 'capital' ? 'all' : 'none');
  MapView.setDimmed(conts.length < CONTINENT_IDS.length ? rec => !conts.includes(rec.continent) : null);
  MapView.resetView();
}

function restoreMap() {
  clearQuestionFromMap();
  MapView.setDimmed(null);
  MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.resetView();
}

/* =====================================================================
   QUESTIONS
   ===================================================================== */
const current = () => (run && run.index >= 0 && run.index < run.ids.length ? COUNTRY_BY_ID.get(run.ids[run.index]) : null);
const currentRecord = () => (current() ? MapView.record(current().id) : null);
const typedMode = () => run.settings.rushMode !== 'map-hunt';

function clearQuestionFromMap() {
  const c = current();
  if (c) {
    const rec = MapView.record(c.id);
    MapView.setFlagShown(rec, false);
    MapView.setState(rec, 'target', false);
  }
  MapView.setPulse([]);
}

function next() {
  if (!run || run.over) return;
  clearQuestionFromMap();
  run.index++;
  run.hintsHere = 0;
  run.locked = false;
  run.feedback = '';
  run.hintText = '';
  if (run.index >= run.ids.length) return finish('done');
  showOnMap();
  render();
  reportProgress();
}

function showOnMap() {
  const rec = currentRecord();
  const mode = run.settings.rushMode;
  if (mode === 'flag-map' || mode === 'survival') {
    MapView.setFlagShown(rec, true);
    MapView.setPulse([rec]);
    MapView.zoomAround(rec, 4, { minK: 1.5, maxK: 6, duration: 550 });
  } else if (mode === 'capital') {
    MapView.setState(rec, 'target', true);
    MapView.zoomAround(rec, 4, { minK: 1.5, maxK: 6, duration: 550 });
  } else if (mode === 'map-hunt') {
    MapView.resetView(450);
  }
  // flag-only: the map stays still
}

function promptHtml(c) {
  switch (run.settings.rushMode) {
    case 'flag-only': return t('rq_flag');
    case 'capital': return t('rq_capital', { name: escapeHtml(countryName(c)) });
    case 'map-hunt': return t('rq_find', { name: escapeHtml(countryName(c)) });
    default: return t('rq_name');
  }
}

/** The text the player must find (for hints and feedback). */
const expectedAnswer = c => (run.settings.rushMode === 'capital' ? capitalName(c) : countryName(c));
const hintCost = c => Math.max(2, Math.round(pointsFor(c.id) * HINT_COST_SHARE));

/** "B _ _ _ _ _ a" style pattern; level 2 reveals every other letter. */
function hintPattern(answer, level) {
  let letterIndex = 0;
  return [...answer].map(ch => {
    if (!/\p{L}/u.test(ch)) return ch === ' ' ? ' ' : ch;
    const show = letterIndex === 0 || (level >= 2 && letterIndex % 2 === 0);
    letterIndex++;
    return show ? ch : '_';
  }).join(' ');
}

function render() {
  const c = current();
  if (!run || !c) return;
  const mode = run.settings.rushMode;
  const cost = hintCost(c);
  const hintsLeft = MAX_HINTS_PER_COUNTRY - run.hintsHere;
  card().innerHTML = `
    <div class="r-top">
      ${mode === 'flag-only' ? `<div class="r-flag">${flagImage(c.id, '', '')}</div>` : ''}
      <div class="r-text">
        <h2 class="q-prompt">${promptHtml(c)}</h2>
        <p class="q-sub">${typedMode() ? t('rushHelp') : t('rushHelpMap')}
          <span class="r-level l${levelOf(c.id)}">${t('level', { n: levelOf(c.id) })} · ${t('pts', { n: pointsFor(c.id) })}</span></p>
      </div>
    </div>
    ${run.hintText ? `<p class="r-hint">${escapeHtml(run.hintText)}</p>` : ''}
    ${typedMode() ? `
      <form class="q-type r-form" autocomplete="off">
        <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
          placeholder="${t('typeHere')}" aria-label="${t('typeHere')}" ${run.locked ? 'disabled' : ''}>
        <button class="btn btn-primary" ${run.locked ? 'disabled' : ''}>${t('submit')}</button>
      </form>` : ''}
    <div class="q-foot">
      <button class="q-tool" data-act="hint" ${hintsLeft > 0 && !run.locked ? '' : 'disabled'}>${ICONS.bulb}${t('hintCost', { n: cost })}</button>
      <button class="q-tool" data-act="pass" ${run.locked ? 'disabled' : ''}>${ICONS.skip}${t('pass')} <kbd>Esc</kbd></button>
      <div class="q-feedback ${run.feedbackType || ''}">${escapeHtml(run.feedback || '')}</div>
    </div>`;
  card().classList.add('show');
  const field = $('input', card());
  if (field && !run.locked) setTimeout(() => field.focus(), 30);
}

/* ---------- HUD (timer, score) ---------- */
function tick() {
  if (!run || run.over) return;
  const left = Math.max(0, Math.ceil((run.endsAt - performance.now()) / 1000));
  const min = Math.floor(left / 60), sec = String(left % 60).padStart(2, '0');
  hud().innerHTML = `
    <div class="rh-time ${left <= 10 ? 'hot' : ''}"><span>${t('time')}</span>${min}:${sec}</div>
    <div class="hud-stat"><span>${t('score')}</span>${run.score}</div>
    <div class="hud-stat"><span>${t('found')}</span>${run.found}</div>
    ${run.lives !== null ? `<div class="hearts" title="${t('livesLeft')}">${Array.from({ length: SURVIVAL_LIVES }, (_, i) => ICONS.heart(i >= run.lives)).join('')}</div>` : ''}
    <button class="hud-quit" data-act="quit" title="${t('quit')}" aria-label="${t('quit')}">${ICONS.close}</button>`;
  hud().classList.add('show');
  if (left <= 0) finish('time');
}

/* =====================================================================
   ANSWERS
   ===================================================================== */
function submit(value) {
  const c = current();
  if (!run || run.locked || !c || !value.trim()) return;
  const correct = run.settings.rushMode === 'capital' ? Answers.isCapital(value, c) : Answers.isCountry(value, c);
  if (correct) return found(c);
  if (run.lives !== null) return loseLife(c);
  run.feedback = t('notQuite');
  run.feedbackType = 'bad';
  const field = $('input', card());
  $('.q-feedback', card()).className = 'q-feedback bad';
  $('.q-feedback', card()).textContent = run.feedback;
  field.classList.remove('shake'); void field.offsetWidth; field.classList.add('shake');
  field.select();
}

function onPlaceClick(rec) {
  if (!run || run.locked || run.settings.rushMode !== 'map-hunt') return;
  if (rec.kind === 'territory') return Toast.show(t('terrNotQuiz', { name: territoryName(rec.territory) }));
  const c = current();
  if (rec.id === c.id) return found(c);
  MapView.flash(rec, false, 600);
  if (run.lives !== null) loseLife(c);
}

function found(c) {
  const points = Math.max(0, pointsFor(c.id) - run.hintsHere * hintCost(c));
  run.score += points;
  run.found++;
  run.history.push({ id: c.id, status: 'found', points, hints: run.hintsHere });
  run.locked = true;
  run.feedback = t('plusPoints', { p: points, name: countryName(c) });
  run.feedbackType = 'ok';
  MapView.flash(MapView.record(c.id), true, 700);
  render();
  tick();
  setTimeout(next, NEXT_DELAY_MS);
}

function pass() {
  const c = current();
  if (!run || run.locked || !c) return;
  if (run.lives !== null) return loseLife(c);
  run.passed++;
  run.history.push({ id: c.id, status: 'passed', points: 0, hints: run.hintsHere });
  run.locked = true;
  run.feedback = t('passedWas', { answer: expectedAnswer(c) });
  run.feedbackType = '';
  MapView.flash(MapView.record(c.id), true, 900);
  render();
  setTimeout(next, NEXT_DELAY_MS + 500);
}

/** Survival: a wrong answer or a pass costs a life and moves on. */
function loseLife(c) {
  run.lives--;
  run.passed++;
  run.history.push({ id: c.id, status: 'missed', points: 0, hints: run.hintsHere });
  run.locked = true;
  run.feedback = t('wrongLife', { answer: expectedAnswer(c) });
  run.feedbackType = 'bad';
  MapView.flash(MapView.record(c.id), true, 900);
  render();
  tick();
  if (run.lives <= 0) setTimeout(() => finish('out'), 900);
  else setTimeout(next, NEXT_DELAY_MS + 600);
}

function useHint() {
  const c = current();
  if (!run || run.locked || !c || run.hintsHere >= MAX_HINTS_PER_COUNTRY) return;
  const cost = hintCost(c);
  run.hintsHere++;
  run.score = Math.max(0, run.score - cost);
  if (typedMode()) {
    run.hintText = hintPattern(expectedAnswer(c), run.hintsHere)
      + (run.hintsHere >= 2 ? `  ·  ${continentName(c.continent)}` : '');
  } else {
    run.hintText = continentName(c.continent);
    MapView.zoomAround(currentRecord(), run.hintsHere === 1 ? 10 : 5, { minK: 2, maxK: 7 });
  }
  const typed = $('input', card())?.value || '';
  render();
  const field = $('input', card());
  if (field) field.value = typed;
  tick();
  reportProgress();
}

/* =====================================================================
   END
   ===================================================================== */
function result() {
  return {
    score: run.score, found: run.found, passed: run.passed,
    history: run.history.slice(),
    seen: run.index,
  };
}

function reportProgress() {
  if (run?.party) run.party.onProgress({ score: run.score, found: run.found, done: false });
}

function finish(reason) {
  if (!run || run.over) return;
  clearInterval(clock);
  run.over = true;
  run.reason = reason;
  const res = result();
  card().classList.remove('show');
  clearQuestionFromMap();
  if (run.party) {
    run.party.onFinish(res);
    hud().innerHTML = `<div class="rh-wait">${t(reason === 'time' ? 'rushOver' : reason === 'out' ? 'rushOut' : 'rushDone')} · ${t('waitingOthers')}</div>`;
    return; // the party dialog shows the shared results
  }
  hud().classList.remove('show');
  renderEndScreen(res, reason);
  Modal.open(END_ID);
}

/** Solo end screen: score and every country seen, with the right answer. */
function renderEndScreen(res, reason) {
  const title = t(reason === 'time' ? 'rushOver' : reason === 'out' ? 'rushOut' : 'rushDone');
  const items = res.history.map(h => {
    const c = COUNTRY_BY_ID.get(h.id);
    const status = h.status === 'found' ? `<span class="tag ok">+${h.points}</span>` : `<span class="tag">${t(h.status === 'found' ? 'statusFound' : 'statusPassed')}</span>`;
    return `<li>${flagImage(c.id)}<span>${escapeHtml(countryName(c))}<small>${escapeHtml(capitalName(c))}${h.hints ? ' · ' + t('statusHint', { n: h.hints }) : ''}</small></span>${status}</li>`;
  }).join('');
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge">${ICONS.trophy}</div>
        <div><h2>${title}</h2><p class="lead flush">${t('rushLead', { n: res.found, p: res.passed })} · ${t('r_' + run.settings.rushMode.replace('-', ''))}</p></div>
      </div>
      <div class="stats">
        <div class="stat"><b>${res.score}</b><span>${t('score')}</span></div>
        <div class="stat"><b>${res.found}</b><span>${t('found')}</span></div>
        <div class="stat"><b>${res.passed}</b><span>${t('statusPassed')}</span></div>
        <div class="stat"><b>${run.settings.duration}s</b><span>${t('time')}</span></div>
      </div>
      <div class="d-sec"><h3>${t('yourAnswers')} (${res.history.length})</h3>
        ${items ? `<ul class="missed">${items}</ul>` : `<p class="empty">—</p>`}</div>
      <div class="d-foot"><span class="pool"></span>
        <button class="btn btn-soft" data-act="back">${t('backMap')}</button>
        <button class="btn btn-primary" data-act="replay">${ICONS.repeat}${t('replay')}</button>
      </div>
    </div>`;
}

function onEndClick(e) {
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (!action) return;
  const settings = run?.settings;
  Modal.close(END_ID);
  stop();
  if (action === 'replay' && settings) start({ settings });
}

/* =====================================================================
   SCOREBOARD (party games)
   ===================================================================== */
function showScoreboard(players, myId) {
  if (!players) { board().classList.remove('show'); board().innerHTML = ''; return; }
  const sorted = players.slice().sort((a, b) => b.score - a.score || b.found - a.found);
  board().innerHTML = `<h3>${t('scoreboard')}</h3><ol>${sorted.map(p => `
    <li class="${p.id === myId ? 'me' : ''}"><span class="sb-name">${escapeHtml(p.name)}${p.done ? ` <small>✓ ${t('finished')}</small>` : ''}</span>
      <b>${p.score}</b><small>${p.found}</small></li>`).join('')}</ol>`;
  board().classList.add('show');
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const Rush = {
  /** @param {{ onModeChange: (inGame: boolean) => void }} callbacks */
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    card().addEventListener('submit', e => { e.preventDefault(); submit($('input', card()).value); });
    card().addEventListener('click', e => {
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'hint') useHint();
      if (action === 'pass') pass();
    });
    hud().addEventListener('click', e => {
      if (!e.target.closest('[data-act="quit"]') || !run) return;
      const party = run.party;
      stop();
      party?.onQuit?.();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && run && !run.over) { e.stopImmediatePropagation(); pass(); }
    }, true);
    $('#' + END_ID).addEventListener('click', onEndClick);
  },
  start,
  stop,
  isActive: () => Boolean(run) && !run.over,
  isRunning: () => Boolean(run),
  onPlaceClick,
  showScoreboard,
  /** End the round as if the clock had run out (tests). */
  finishNow: () => finish('time'),
  /** Snapshot for tests and the console. */
  peek: () => (run ? { id: current()?.id || null, score: run.score, found: run.found, lives: run.lives, over: run.over, mode: run.settings.rushMode } : null),
  refresh() { if (run && !run.over) { render(); tick(); } },
};
