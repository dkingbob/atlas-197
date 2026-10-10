/**
 * Game session: shared rules for every mode.
 *
 *   - builds the question list from the settings (see pool.js for the config shape)
 *   - prepares the map ("smart graying": dim other continents, hide names, no flags…)
 *   - scoring, lives, hint & skip counters, HUD, end screen
 *
 * The question flow itself lives in two engines that receive a shared context:
 *   question-round.js  click / type / multiple choice (all modes except flag match)
 *   flag-match.js      drag flags onto names, capitals or the map
 */
import { CONFIG, CONTINENTS, CONTINENT_IDS } from '../config.js';
import { WATERS } from '../data/waters.js';
import { Store } from '../core/store.js';
import { $, escapeHtml, shuffle } from '../core/utils.js';
import { t, countryName, capitalName, continentName, waterName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Modal, Toast } from '../ui/components.js';
import { buildCountryPool, pickWeighted } from './pool.js';
import { QuestionRound } from './question-round.js';
import { FlagMatch } from './flag-match.js';

const HUD = () => $('#hud');
const END_ID = 'end-modal';
const POINTS = { base: 10, withHint: 5, streakBonus: 2, maxStreakBonusSteps: 5 };

let config = null;      // settings of the running game
let state = null;       // live session state (see start())
let onModeChange = () => {};
const timers = new Set();

/* ---------- helpers shared with the engines ---------- */
const context = {
  get config() { return config; },
  get state() { return state; },
  isFlagMatch: () => config?.mode === 'flagmatch',
  /** setTimeout that is cancelled automatically when the game ends */
  later(fn, ms) {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
  },
  renderHud,
  finish,
  regionView,
  clearMapHighlights,
  /** Next country for hard-list mode, chosen by weight at the moment it is asked. */
  nextHardCountry(previous) { return pickWeighted(state.pool, previous); },

  /**
   * Apply the shared scoring rules. Returns the points earned (0 when wrong).
   * Records statistics and updates the hard-list weight for countries.
   */
  scoreAnswer({ correct, countryId, reduced = false }) {
    let points = 0;
    if (correct) {
      points = (reduced ? POINTS.withHint : POINTS.base) + Math.min(state.streak, POINTS.maxStreakBonusSteps) * POINTS.streakBonus;
      state.score += points;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correct++;
    } else {
      state.lives--;
      state.streak = 0;
      state.wrong++;
    }
    if (countryId) {
      Store.recordAnswer(countryId, config.subject, correct);
      Store.updateHardWeight(countryId, correct);
    }
    return points;
  },

  /** Text of the right answer, e.g. "Paris (France)". */
  answerText(question) {
    if (question.kind === 'water') return waterName(question.item);
    const c = question.item;
    return config.subject === 'capital' ? `${capitalName(c)} (${countryName(c)})` : countryName(c);
  },
};

const engine = () => (context.isFlagMatch() ? FlagMatch : QuestionRound);

/* ---------- start / stop ---------- */
function start(newConfig) {
  clearTimers();
  config = structuredClone(newConfig);
  const isOceans = config.mode === 'oceans';
  const pool = isOceans ? WATERS.slice() : buildCountryPool(config);
  if (!pool.length) return Toast.show(t('poolEmpty'));

  let total;
  if (config.mode === 'hard') total = config.count || Math.min(pool.length * 2, 60); // repeats allowed
  else total = Math.min(config.count || pool.length, pool.length);

  state = {
    pool,
    total,                 // number of questions in this game
    questions: config.mode === 'hard' ? [] // hard mode picks each question when it is asked
      : shuffle(pool).slice(0, total).map(item => ({ kind: isOceans ? 'water' : 'country', item })),
    index: 0,              // questions answered or skipped so far
    score: 0, streak: 0, bestStreak: 0, correct: 0, wrong: 0,
    lives: CONFIG.LIVES, hints: CONFIG.HINTS, skips: CONFIG.SKIPS,
    missed: [],            // [{ question, skipped }]
    over: false,
    locked: false,         // true while showing feedback (input ignored)
  };

  onModeChange(true);
  prepareMap();
  if (!flagsAllowed() && Store.pref('display') === 'flag') Toast.show(t('flagOff'), 3200);
  renderHud();
  engine().start(context);
}

function quit() {
  if (!state) return;
  state.over = true;
  cleanup();
  state = null;
}

function clearTimers() { timers.forEach(clearTimeout); timers.clear(); }

/* ---------- smart graying ---------- */
/** Names are only shown when they can't give the answer away. */
const namesAllowed = () => config.mode === 'oceans'
  || (config.mode !== 'flagmatch' && config.subject === 'capital' && config.answer !== 'click');
/** Same rule for the flag display mode. */
const flagsAllowed = () => namesAllowed();

/** Continents covered by the game (used to dim the rest and to zoom). */
function regionContinents() {
  if (config.mode === 'continent') return [config.continent];
  if (config.mode === 'oceans') return CONTINENT_IDS.slice();
  const inPool = new Set(state.pool.map(c => c.continent));
  return CONTINENT_IDS.filter(id => inPool.has(id));
}

function prepareMap() {
  const continents = regionContinents();
  state.region = continents;
  const topbarBottom = $('.topbar').getBoundingClientRect().bottom;
  MapView.setInsets({ top: topbarBottom + 62, bottom: context.isFlagMatch() ? 190 : 205 });
  const oceaniaOnly = continents.length === 1 && continents[0] === 'OCE';
  MapView.setCenter(oceaniaOnly ? CONFIG.PACIFIC_CENTER : CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay(flagsAllowed() ? Store.pref('display') : 'gray');
  MapView.setNameMode(namesAllowed() ? 'all' : 'none');
  MapView.setWaterLabels(config.mode !== 'oceans');
  const partial = continents.length < CONTINENT_IDS.length;
  MapView.setDimmed(partial ? rec => !continents.includes(rec.continent) : null);
  regionView();
}

/** Zoom on the game's continents (or show the whole world). */
function regionView() {
  if (state.region.length < CONTINENT_IDS.length) {
    const box = MapView.unionBox(state.region.map(id => MapView.geoBox(CONTINENTS[id].view)));
    MapView.zoomToBox(box, { maxK: 8, pad: 0.96 });
  } else {
    MapView.resetView();
  }
}

function clearMapHighlights() {
  ['target', 'flash-ok', 'flash-bad'].forEach(MapView.clearState);
  MapView.setDropTarget(null);
  MapView.clearWaterStates();
}

/** Put the map back the way the explore mode wants it. */
function cleanup() {
  clearTimers();
  clearMapHighlights();
  MapView.clearState('matched');
  MapView.setDimmed(null);
  MapView.setWaterLabels(true);
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.setDisplay(Store.pref('display'));
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.resetView();
  QuestionRound.hide();
  FlagMatch.hide();
  onModeChange(false);
}

/* ---------- HUD ---------- */
function renderHud() {
  if (!state) return;
  const done = context.isFlagMatch() ? state.matchedCount || 0 : state.index;
  const pct = Math.round(done / state.total * 100);
  HUD().innerHTML = `
    <div class="hud-stat"><span>${t('score')}</span>${state.score}</div>
    <div class="hud-stat ${state.streak >= 3 ? 'streak-hot' : ''}"><span>${t('streak')}</span>${state.streak}</div>
    <div class="hearts" title="${t('lives')}">${Array.from({ length: CONFIG.LIVES }, (_, i) => ICONS.heart(i >= state.lives)).join('')}</div>
    <div class="hud-prog" title="${done}/${state.total}"><i style="width:${pct}%"></i></div>
    <span>${done}/${state.total}</span>
    <button class="hud-quit" data-act="quit" title="${t('quit')}" aria-label="${t('quit')}">${ICONS.close}</button>`;
}

/* ---------- end screen ---------- */
function finish(won) {
  if (!state || state.over) return;
  state.over = true;
  state.won = won;
  clearTimers();
  QuestionRound.hide();
  FlagMatch.hide();
  renderEndScreen();
  Modal.open(END_ID);
}

function missedItemHtml({ question, skipped }) {
  const tag = skipped ? `<span class="tag">${t('skippedTag')}</span>` : '';
  if (question.kind === 'water') return `<li><span>${escapeHtml(waterName(question.item))}</span>${tag}</li>`;
  const c = question.item;
  return `<li>${flagImage(c.id)}<span>${escapeHtml(countryName(c))}
    <small>${escapeHtml(t('capital'))}: ${escapeHtml(capitalName(c))} · ${escapeHtml(continentName(c.continent))}</small></span>${tag}</li>`;
}

function renderEndScreen() {
  const { won } = state;
  const answered = state.correct + state.wrong;
  const accuracy = answered ? Math.round(state.correct / answered * 100) : 0;
  const missedIds = [...new Set(state.missed.filter(m => m.question.kind === 'country').map(m => m.question.item.id))];
  const subtitle = t(won ? 'wonLead' : 'lostLead') + ' · ' + t('m_' + config.mode)
    + (config.mode === 'continent' ? ' · ' + continentName(config.continent) : '');
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge ${won ? '' : 'lost'}">${won ? ICONS.trophy : ICONS.sad}</div>
        <div><h2>${won ? t('won') : t('lost')}</h2><p class="lead flush">${escapeHtml(subtitle)}</p></div>
      </div>
      <div class="stats">
        <div class="stat"><b>${state.score}</b><span>${t('score')}</span></div>
        <div class="stat"><b>${accuracy}%</b><span>${t('accuracy')}</span></div>
        <div class="stat"><b>${state.correct}/${state.total}</b><span>${t('correctCount')}</span></div>
        <div class="stat"><b>${state.bestStreak}</b><span>${t('bestStreak')}</span></div>
      </div>
      <div class="d-sec">
        <h3>${t('missed')} (${state.missed.length})</h3>
        ${state.missed.length ? `<ul class="missed">${state.missed.map(missedItemHtml).join('')}</ul>` : `<p class="empty">${t('noMissed')}</p>`}
      </div>
      <div class="d-foot"><span class="pool"></span>
        <button class="btn btn-soft" data-act="back">${t('backMap')}</button>
        ${missedIds.length ? `<button class="btn btn-bad" data-act="addhard" data-ids="${missedIds.join(',')}">${ICONS.bulb}${t('addHard')}</button>` : ''}
        <button class="btn btn-primary" data-act="replay">${ICONS.repeat}${t('replay')}</button>
      </div>
    </div>`;
}

function onEndScreenClick(e) {
  const button = e.target.closest('[data-act]');
  if (!button) return;
  const action = button.dataset.act;
  if (action === 'addhard') {
    const added = Store.addHardMany(button.dataset.ids.split(','));
    Toast.show(t('addedHard', { n: added }));
    button.disabled = true;
  }
  if (action === 'back') { Modal.close(END_ID); cleanup(); state = null; }
  if (action === 'replay') {
    const sameConfig = config;
    Modal.close(END_ID);
    cleanup();
    state = null;
    start(sameConfig);
  }
}

/* ---------- public API ---------- */
export const Game = {
  /** @param {{ onModeChange: (inGame: boolean) => void }} callbacks */
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    QuestionRound.init(context);
    FlagMatch.init(context);
    HUD().addEventListener('click', e => { if (e.target.closest('[data-act="quit"]')) quit(); });
    $('#' + END_ID).addEventListener('click', onEndScreenClick);
  },
  start,
  quit,
  isActive: () => Boolean(state) && !state.over,
  /** Can the "Flags" display be switched on right now? */
  flagsAllowed: () => !state || state.over || flagsAllowed(),
  onPlaceClick(rec) { if (state && !state.over) engine().onPlaceClick(rec); },
  onWaterClick(lonLat) { if (state && !state.over) engine().onWaterClick?.(lonLat); },
  /** Re-render texts after a language change. */
  refresh() {
    if (!state) return;
    renderHud();
    if (state.over) { if (Modal.isOpen(END_ID)) renderEndScreen(); return; }
    engine().refresh();
  },
};
