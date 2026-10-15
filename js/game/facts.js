/**
 * Facts — read the clues, guess the country (or its capital).
 *
 *   normal  starts with the 3 key facts shown in the explore panel
 *   hard    starts with 3 historical facts, out of 20+ per country; more
 *           points, and the clues get easier only as you ask for them
 *
 * "One more clue" adds the next fact (each costs points); the very last clue
 * gives the capital (or the country, when guessing capitals). A wrong answer
 * costs a life (endless games have no lives). After each answer the map flies
 * to the country, painted with its flag.
 *
 * Settings: { difficulty, guess: 'country'|'capital', answer: 'type'|'mc'|'click', count, levels, conts }
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
import { flagImage, bestScoreHtml, Modal, Toast } from '../ui/components.js';
import { freshOrder } from './pool.js';
import { factsFor, answerClue, MASK } from './facts-pool.js';
import { INFINITE } from './game.js';

export const DEFAULT_FACTS_SETTINGS = {
  difficulty: 'normal', guess: 'country', answer: 'type', count: 10, levels: [1, 2, 3], conts: CONTINENT_IDS.slice(),
};
const LIVES = 3;
const START_CLUES = 3;
const CLUE_COST = 0.15;        // share of the points lost per extra clue
const MIN_SHARE = 0.25;        // never less than this share of the points
const HARD_MULTIPLIER = 2;
const END_ID = 'facts-end-modal';

const card = () => $('#facts-card');
const hud = () => $('#facts-hud');

let run = null;
let onModeChange = () => {};

export function factsPoolCountries(settings) {
  const levels = settings.levels?.length ? settings.levels : LEVEL_IDS;
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  return COUNTRIES.filter(c => levels.includes(levelOf(c.id)) && conts.includes(c.continent));
}

/* =====================================================================
   START / STOP
   ===================================================================== */
function start(settings) {
  stop({ silent: true });
  const pool = factsPoolCountries(settings);
  if (!pool.length) return Toast.show(t('poolEmpty'));
  const infinite = settings.count === INFINITE;
  const answer = settings.guess === 'capital' && settings.answer === 'click' ? 'type' : settings.answer;
  run = {
    settings: { ...settings, answer },
    pool, infinite,
    total: infinite ? Infinity : Math.min(settings.count > 0 ? settings.count : pool.length, pool.length),
    queue: infinite ? [] : freshOrder(pool),
    index: 0,
    current: null,
    lives: infinite ? Infinity : LIVES,
    score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0,
    missed: [],
    over: false,
  };
  onModeChange(true);
  document.body.classList.add('in-facts');
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  MapView.setInsets({ top: $('.topbar').getBoundingClientRect().bottom + 62, bottom: 24 });
  MapView.setCenter(conts.length === 1 && conts[0] === 'OCE' ? CONFIG.PACIFIC_CENTER : CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay('gray');
  MapView.setNameMode('none');
  MapView.setDimmed(conts.length < CONTINENT_IDS.length ? rec => !conts.includes(rec.continent) : null);
  MapView.resetView();
  next();
}

function stop({ silent = false } = {}) {
  if (!run) return;
  clearFromMap();
  run = null;
  card().classList.remove('show');
  hud().classList.remove('show');
  document.body.classList.remove('in-facts');
  MapView.setDimmed(null);
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.resetView();
  if (!silent) onModeChange(false);
}

/* =====================================================================
   QUESTIONS
   ===================================================================== */
/** Clues already shown + the ones waiting, in the order they will come. */
function buildClues(c) {
  const neighbors = MapView.record(c.id)?.neighbors || [];
  const all = factsFor(c, { neighbors });
  const byTier = tier => shuffle(all.filter(f => f.tier === tier));
  let first, rest;
  if (run.settings.difficulty === 'hard') {
    const history = shuffle(all.filter(f => f.kind === 'history' && f.tier === 1));
    first = history.slice(0, START_CLUES);
    rest = shuffle(history.slice(START_CLUES).concat(all.filter(f => f.kind === 'stat' && f.tier === 1)))
      .concat(byTier(2), byTier(3));
  } else {
    const keys = all.filter(f => f.kind === 'key');
    const summary = all.filter(f => f.kind === 'history' && f.tier === 2);
    first = keys.concat(summary).slice(0, START_CLUES);
    rest = summary.filter(f => !first.includes(f))
      .concat(byTier(2).filter(f => f.kind !== 'history'), all.filter(f => f.kind === 'history' && f.tier === 1), byTier(3))
      .filter(f => !first.includes(f));
  }
  rest.push(answerClue(c, run.settings.guess));
  return { shown: first, waiting: rest };
}

function next() {
  if (!run || run.over) return;
  clearFromMap();
  if (run.index >= run.total) return finish();
  if (run.infinite && !run.queue.length) {
    const round = freshOrder(run.pool);
    if (round.length > 1 && round[0] === run.current) round.push(round.shift());
    run.queue = round;
  }
  run.current = run.infinite ? run.queue.shift() : run.queue[run.index];
  Store.markAsked(run.current.id);
  const clues = buildClues(run.current);
  Object.assign(run, { shown: clues.shown, waiting: clues.waiting, revealed: false, result: null, feedback: '', feedbackType: '' });
  run.options = run.settings.answer === 'mc' ? options(run.current) : null;
  MapView.resetView(500);
  render();
  renderHud();
}

/** 4 choices from the same continent. */
function options(c) {
  const same = shuffle(COUNTRIES.filter(x => x !== c && x.continent === c.continent));
  const other = shuffle(COUNTRIES.filter(x => x !== c && x.continent !== c.continent));
  return shuffle([c, ...same.concat(other).slice(0, 3)]);
}

const label = c => (run.settings.guess === 'capital' ? capitalName(c) : countryName(c));
const basePoints = c => pointsFor(c.id) * (run.settings.difficulty === 'hard' ? HARD_MULTIPLIER : 1);
const extraClues = () => Math.max(0, run.shown.length - START_CLUES);
const pointsNow = c => Math.round(basePoints(c) * Math.max(MIN_SHARE, 1 - extraClues() * CLUE_COST));

/* =====================================================================
   RENDERING
   ===================================================================== */
const MASK_HTML = '<span class="mask">???</span>';
const clueHtml = text => escapeHtml(text).split(escapeHtml(MASK)).join(MASK_HTML);

function render() {
  const c = run.current;
  const s = run.settings;
  const prompt = s.guess === 'capital' ? t('fxPromptCapital') : t('fxPromptCountry');
  const facts = run.shown.map((f, i) => `<li class="${f.kind === 'answer' ? 'give' : ''} ${i === run.shown.length - 1 && run.justAdded ? 'new' : ''}">${clueHtml(f.text)}</li>`).join('');
  const answerArea = run.revealed
    ? `<div class="fx-answer ${run.result}">${flagImage(c.id)}<div><b>${escapeHtml(countryName(c))}</b>
        <small>${t('capital')}: ${escapeHtml(capitalName(c))} · ${escapeHtml(continentName(c.continent))}</small></div>
        <button class="btn btn-primary" data-act="next">${t('next')} <kbd>↵</kbd></button></div>`
    : s.answer === 'mc'
      ? `<div class="q-opts">${run.options.map((o, i) => `<button class="q-opt" data-opt="${o.id}"><kbd>${i + 1}</kbd>${escapeHtml(label(o))}</button>`).join('')}</div>`
      : s.answer === 'click'
        ? `<p class="q-sub fx-click">${ICONS.pin}${t('fxClickMap')}</p>`
        : `<form class="q-type" data-form="answer" autocomplete="off">
            <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
              placeholder="${s.guess === 'capital' ? t('fxCapitalPh') : t('fqPlaceholder')}">
            <button class="btn btn-primary">${t('submit')}</button></form>`;
  card().innerHTML = `
    <div class="fx-head"><h2 class="q-prompt">${prompt}</h2>
      <span class="r-level l${levelOf(c.id)}">${t(s.difficulty === 'hard' ? 'fxHard' : 'fxNormal')} · ${t('pts', { n: run.revealed ? 0 : pointsNow(c) })}</span></div>
    <ol class="fx-list">${facts}</ol>
    ${answerArea}
    <div class="q-foot">
      ${run.revealed ? '' : `
        <button class="q-tool" data-act="clue" ${run.waiting.length ? '' : 'disabled'}>${ICONS.bulb}${t('fxMoreClue')} <span class="n">${run.waiting.length}</span></button>
        <button class="q-tool" data-act="pass">${ICONS.skip}${t('pass')}</button>`}
      <div class="q-feedback ${run.feedbackType}">${escapeHtml(run.feedback)}</div>
    </div>`;
  card().classList.add('show');
  run.justAdded = false;
  const list = $('.fx-list', card());
  list.scrollTop = list.scrollHeight;
  const field = $('input', card());
  if (field) setTimeout(() => field.focus(), 30);
  else if (run.revealed) setTimeout(() => $('[data-act="next"]', card())?.focus(), 30);
}

function renderHud() {
  const lives = run.infinite
    ? `<div class="hud-stat"><span>${t('correctCount')}</span>${run.correct}/${run.correct + run.wrong}</div><span class="inf">∞</span>`
    : `<div class="hearts" title="${t('lives')}">${Array.from({ length: LIVES }, (_, i) => ICONS.heart(i >= run.lives)).join('')}</div>
       <span>${Math.min(run.index + 1, run.total)}/${run.total}</span>`;
  hud().innerHTML = `
    <div class="hud-stat"><span>${t('score')}</span>${run.score}</div>
    <div class="hud-stat ${run.streak >= 3 ? 'streak-hot' : ''}"><span>${t('streak')}</span>${run.streak}</div>
    ${lives}
    <button class="hud-quit" data-act="quit" title="${t('finishNow')}" aria-label="${t('finishNow')}">${run.infinite ? ICONS.check : ICONS.close}</button>`;
  hud().classList.add('show');
}

/* =====================================================================
   ANSWERS
   ===================================================================== */
function moreClue() {
  if (!run || run.revealed || !run.waiting.length) return;
  run.shown.push(run.waiting.shift());
  run.justAdded = true;
  const typed = $('input', card())?.value || '';
  render();
  const field = $('input', card());
  if (field) field.value = typed;
}

function check(value) {
  if (!run || run.revealed || !value.trim()) return;
  const c = run.current;
  const right = run.settings.guess === 'capital' ? Answers.isCapital(value, c) : Answers.isCountry(value, c);
  if (right) return answered(true);
  const other = run.settings.guess === 'country' ? Answers.findCountry(value) : null;
  answered(false, other && other !== c.id ? t('fxNotX', { name: countryName(COUNTRY_BY_ID.get(other)) }) : '');
}

function answered(right, note = '') {
  const c = run.current;
  const subject = run.settings.guess === 'capital' ? 'capital' : 'name';
  if (right) {
    const points = pointsNow(c);
    run.score += points;
    run.correct++;
    run.streak++;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    run.feedback = t('plusPoints', { p: points, name: label(c) });
    run.feedbackType = 'ok';
  } else {
    run.wrong++;
    run.streak = 0;
    run.lives--;
    run.missed.push(c.id);
    run.feedback = note || t('wrongWas', { answer: label(c) });
    run.feedbackType = 'bad';
  }
  Store.recordAnswer(c.id, subject, right);
  run.result = right ? 'ok' : 'bad';
  reveal();
}

function pass() {
  if (!run || run.revealed) return;
  run.streak = 0;
  run.missed.push(run.current.id);
  run.feedback = t('passedWas', { answer: label(run.current) });
  run.feedbackType = '';
  run.result = 'pass';
  reveal();
}

function reveal() {
  run.revealed = true;
  run.index++;
  render();
  renderHud();
  const rec = MapView.record(run.current.id);
  MapView.setInsets({ bottom: card().offsetHeight + 30 });
  MapView.setFlagShown(rec, true);
  MapView.setPulse([rec]);
  MapView.zoomAround(rec, 5, { minK: 1.4, maxK: 6, duration: 650 });
}

function goOn() {
  if (!run?.revealed) return;
  if (run.lives <= 0) return finish();
  next();
}

function clearFromMap() {
  if (!run?.current) return;
  MapView.setFlagShown(MapView.record(run.current.id), false);
  MapView.setPulse([]);
}

function onPlaceClick(rec) {
  if (!run || run.revealed || run.settings.answer !== 'click') return;
  if (rec.kind === 'territory') return Toast.show(t('terrNotQuiz', { name: territoryName(rec.territory) }));
  if (rec.id === run.current.id) return answered(true);
  MapView.flash(rec, false, 900);
  answered(false, t('fxNotX', { name: countryName(rec.country) }));
}

/* =====================================================================
   END
   ===================================================================== */
function finish() {
  if (!run || run.over) return;
  run.over = true;
  clearFromMap();
  card().classList.remove('show');
  hud().classList.remove('show');
  const seen = run.correct + run.wrong;
  const accuracy = seen ? Math.round(run.correct / seen * 100) : 0;
  const missed = [...new Set(run.missed)];
  const outOfLives = run.lives <= 0;
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge ${outOfLives ? 'lost' : ''}">${outOfLives ? ICONS.sad : ICONS.trophy}</div>
        <div><h2>${t(outOfLives ? 'lost' : 'won')}</h2>
          <p class="lead flush">${t('m_facts')} · ${t(run.settings.difficulty === 'hard' ? 'fxHard' : 'fxNormal')} · ${t(run.settings.guess === 'capital' ? 's_capital' : 's_name')}</p></div>
      </div>
      ${bestScoreHtml(`facts:${run.settings.difficulty}:${run.settings.guess}:${run.settings.count}`, `${t('m_facts')} · ${t(run.settings.difficulty === 'hard' ? 'fxHard' : 'fxNormal')} · ${t(run.settings.guess === 'capital' ? 's_capital' : 's_name')}`, run.score)}
      <div class="stats">
        <div class="stat"><b>${run.score}</b><span>${t('score')}</span></div>
        <div class="stat"><b>${accuracy}%</b><span>${t('accuracy')}</span></div>
        <div class="stat"><b>${run.correct}/${run.index}</b><span>${t('correctCount')}</span></div>
        <div class="stat"><b>${run.bestStreak}</b><span>${t('bestStreak')}</span></div>
      </div>
      <div class="d-sec"><h3>${t('missed')} (${missed.length})</h3>
        ${missed.length ? `<ul class="missed">${missed.map(id => {
          const c = COUNTRY_BY_ID.get(id);
          return `<li>${flagImage(id)}<span>${escapeHtml(countryName(c))}<small>${escapeHtml(capitalName(c))}</small></span></li>`;
        }).join('')}</ul>` : `<p class="empty">${t('noMissed')}</p>`}</div>
      <div class="d-foot"><span class="pool"></span>
        <button class="btn btn-soft" data-act="back">${t('backMap')}</button>
        <button class="btn btn-primary" data-act="replay">${ICONS.repeat}${t('replay')}</button>
      </div>
    </div>`;
  Modal.open(END_ID);
}

function onEndClick(e) {
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (!action) return;
  const settings = run?.settings;
  Modal.close(END_ID);
  stop();
  if (action === 'replay' && settings) start(settings);
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const Facts = {
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    card().addEventListener('submit', e => { e.preventDefault(); check($('input', card()).value); });
    card().addEventListener('click', e => {
      const option = e.target.closest('[data-opt]');
      if (option && !run.revealed) return answered(option.dataset.opt === run.current.id);
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'clue') moreClue();
      if (action === 'pass') pass();
      if (action === 'next') goOn();
    });
    hud().addEventListener('click', e => { if (e.target.closest('[data-act="quit"]') && run) finish(); });
    document.addEventListener('keydown', e => {
      if (!run || run.over || !card().classList.contains('show')) return;
      if (run.revealed && e.key === 'Enter' && !e.target.closest('input')) { e.preventDefault(); goOn(); }
      if (!run.revealed && run.options && /^[1-4]$/.test(e.key) && !e.target.closest('input')) {
        answered(run.options[Number(e.key) - 1].id === run.current.id);
      }
    });
    $('#' + END_ID).addEventListener('click', onEndClick);
  },
  start,
  stop,
  isRunning: () => Boolean(run),
  onPlaceClick,
  refresh() { if (run && !run.over) { render(); renderHud(); } },
  peek: () => (run ? { id: run.current?.id, clues: run.shown?.length, waiting: run.waiting?.length, revealed: run.revealed, result: run.result, score: run.score, lives: run.lives, index: run.index, over: run.over } : null),
};
