/**
 * Flags — a flag pops up, you write (or say) the country.
 *
 * Two styles:
 *   practice  endless: wrong answers can be retried, "Show answer" is always
 *             there, the number of letters can be switched on and off
 *   game      a fixed number of flags, 3 lives, 1 hint (first letter + letters)
 *
 * After each flag the map flies to the country, painted with that flag, so
 * the flag is linked to its place.
 *
 * Settings: { style, conts, levels, letters: boolean, count (game: 0 = all) }
 */
import { CONTINENT_IDS, CONFIG } from '../config.js';
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries/index.js';
import { levelOf, pointsFor, LEVEL_IDS } from '../data/difficulty.js';
import { Answers } from '../core/answers.js';
import { Store } from '../core/store.js';
import { Speech } from '../core/speech.js';
import { $, escapeHtml } from '../core/utils.js';
import { t, lang, countryName, capitalName, continentName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, bestScoreHtml, Modal, Toast } from '../ui/components.js';
import { freshOrder } from './pool.js';

export const DEFAULT_FLAG_SETTINGS = { style: 'practice', conts: CONTINENT_IDS.slice(), levels: [1, 2, 3, 4, 5], letters: false, count: 20 };
const LIVES = 3;
const HINTS = 1;
const NEXT_DELAY = { right: 1100, wrong: 2300, reveal: 0 };
const END_ID = 'flags-end-modal';

const card = () => $('#fq-card');
const hud = () => $('#fq-hud');

let run = null;
let onModeChange = () => {};
let stopListening = null;
let timer = 0;

/* =====================================================================
   POOL
   ===================================================================== */
export function flagPool(settings) {
  const levels = settings.levels?.length ? settings.levels : LEVEL_IDS;
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  return COUNTRIES.filter(c => levels.includes(levelOf(c.id)) && conts.includes(c.continent));
}

/* =====================================================================
   START / STOP
   ===================================================================== */
function start(settings) {
  stop({ silent: true });
  const pool = flagPool(settings);
  if (!pool.length) return Toast.show(t('poolEmpty'));
  const practice = settings.style === 'practice';
  run = {
    settings, practice, pool,
    queue: [],
    total: practice ? Infinity : Math.min(settings.count > 0 ? settings.count : pool.length, pool.length),
    index: 0,
    current: null,
    letters: settings.letters,
    revealed: false,     // answer shown (practice) or given (game)
    hintLevel: 0,        // game: 1 = first letter shown
    locked: false,
    feedback: '', feedbackType: '',
    score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0,
    lives: practice ? Infinity : LIVES,
    hints: practice ? Infinity : HINTS,
    missed: [],
    over: false,
  };
  if (!practice) run.queue = freshOrder(pool).slice(0, run.total);
  onModeChange(true);
  document.body.classList.add('in-flags');
  MapView.setInsets({ top: $('.topbar').getBoundingClientRect().bottom + 62, bottom: 24 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay('gray');
  MapView.setNameMode('none');
  MapView.resetView();
  next();
}

function stop({ silent = false } = {}) {
  if (!run) return;
  clearTimeout(timer);
  stopListening?.();
  clearFromMap();
  run = null;
  card().classList.remove('show');
  hud().classList.remove('show');
  document.body.classList.remove('in-flags');
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.resetView();
  if (!silent) onModeChange(false);
}

/* =====================================================================
   FLOW
   ===================================================================== */
const current = () => run?.current;

function next() {
  if (!run || run.over) return;
  clearTimeout(timer);
  stopListening?.();
  clearFromMap();
  if (run.index >= run.total) return finish();
  if (run.practice && !run.queue.length) {
    // endless: a new random round, never the same flag twice in a row
    const round = freshOrder(run.pool);
    if (round.length > 1 && round[0] === run.current) round.push(round.shift());
    run.queue = round;
  }
  run.current = run.practice ? run.queue.shift() : run.queue[run.index];
  Store.markAsked(run.current.id);
  Object.assign(run, { revealed: false, hintLevel: 0, locked: false, feedback: '', feedbackType: '', tries: 0 });
  render(true);
  renderHud();
}

function clearFromMap() {
  const c = current();
  if (!c) return;
  const rec = MapView.record(c.id);
  MapView.setFlagShown(rec, false);
  MapView.setPulse([]);
}

/** After a flag: fly to the country, painted with its flag. */
function showOnMap() {
  const rec = MapView.record(current().id);
  MapView.setInsets({ bottom: card().offsetHeight + 30 }); // keep the country visible above the card
  MapView.setFlagShown(rec, true);
  MapView.setPulse([rec]);
  MapView.zoomAround(rec, 5, { minK: 1.4, maxK: 6, duration: 650 });
}

/* =====================================================================
   RENDERING
   ===================================================================== */
/** "_ _ _ _ _ _" — letters shown with `show` (first letter for a hint). */
function letterBoxes(name, firstLetter) {
  let i = 0;
  const boxes = [...name].map(ch => {
    if (ch === ' ') return '<i class="gap"></i>';
    if (!/\p{L}/u.test(ch)) return `<b class="sym">${escapeHtml(ch)}</b>`;
    const shown = firstLetter && i === 0;
    i++;
    return `<b>${shown ? escapeHtml(ch.toUpperCase()) : ''}</b>`;
  }).join('');
  return `<div class="fq-letters" aria-label="${t('nLetters', { n: i })}">${boxes}<small>${t('nLetters', { n: i })}</small></div>`;
}

function render(pop = false) {
  const c = current();
  if (!c) return;
  const name = countryName(c);
  const showLetters = run.letters || run.hintLevel > 0;
  const listen = Speech.canListen();
  card().innerHTML = `
    <div class="fq-flag ${pop ? 'pop' : ''}">${flagImage(c.id, '', '')}</div>
    ${run.revealed
      ? `<div class="fq-answer"><b>${escapeHtml(name)}</b><small>${escapeHtml(capitalName(c))} · ${escapeHtml(continentName(c.continent))}</small></div>`
      : showLetters ? letterBoxes(name, run.hintLevel > 0) : ''}
    <form class="q-type fq-form" autocomplete="off">
      <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
        placeholder="${t('fqPlaceholder')}" aria-label="${t('fqPlaceholder')}" ${run.locked ? 'disabled' : ''}>
      ${listen ? `<button type="button" class="btn btn-soft fq-mic" data-act="mic" title="${t('sayIt')}" aria-label="${t('sayIt')}" ${run.locked ? 'disabled' : ''}>${ICONS.mic}</button>` : ''}
      <button class="btn btn-primary" ${run.locked ? 'disabled' : ''}>${run.revealed && run.practice ? t('next') : t('submit')}</button>
    </form>
    <div class="q-foot">
      ${run.practice ? `
        <button class="q-tool ${run.letters ? 'on' : ''}" data-act="letters" aria-pressed="${run.letters}">${ICONS.eye}${t('showLetters')}</button>
        <button class="q-tool" data-act="reveal" ${run.revealed || run.locked ? 'disabled' : ''}>${ICONS.bulb}${t('showAnswer')}</button>
        <button class="q-tool" data-act="skip" ${run.locked ? 'disabled' : ''}>${ICONS.skip}${t('next')}</button>`
    : `<button class="q-tool" data-act="hint" ${run.hints > 0 && !run.hintLevel && !run.locked ? '' : 'disabled'}>${ICONS.bulb}${t('hint')}<span class="n">${run.hints}</span></button>`}
      <div class="q-feedback ${run.feedbackType}">${escapeHtml(run.feedback)}</div>
    </div>`;
  card().classList.add('show');
  const field = $('input', card());
  if (field && !run.locked) setTimeout(() => field.focus(), 30);
}

function renderHud() {
  if (!run) return;
  const progress = run.practice
    ? `<div class="hud-stat"><span>${t('correctCount')}</span>${run.correct}/${run.correct + run.wrong}</div><span class="inf">∞</span>`
    : `<div class="hearts" title="${t('lives')}">${Array.from({ length: LIVES }, (_, i) => ICONS.heart(i >= run.lives)).join('')}</div>
       <span>${Math.min(run.index + 1, run.total)}/${run.total}</span>`;
  hud().innerHTML = `
    <div class="hud-stat"><span>${t('score')}</span>${run.score}</div>
    <div class="hud-stat ${run.streak >= 3 ? 'streak-hot' : ''}"><span>${t('streak')}</span>${run.streak}</div>
    ${progress}
    <button class="hud-quit" data-act="quit" title="${t('finishNow')}" aria-label="${t('finishNow')}">${run.practice ? ICONS.check : ICONS.close}</button>`;
  hud().classList.add('show');
}

function setFeedback(text, type) {
  run.feedback = text;
  run.feedbackType = type;
  const el = $('.q-feedback', card());
  if (el) { el.textContent = text; el.className = `q-feedback ${type}`; }
}

/* =====================================================================
   ANSWERS
   ===================================================================== */
function submit(values) {
  const c = current();
  if (!run || run.locked || !c) return;
  const list = (Array.isArray(values) ? values : [values]).filter(v => v && v.trim());
  const isRight = list.some(v => Answers.isCountry(v, c));
  // after "Show answer": writing it moves on (no points), and so does an empty "Next"
  if (run.revealed && run.practice) return isRight ? right() : list.length ? wrong(list[0]) : next();
  if (!list.length) return;
  if (isRight) return right();
  wrong(list[0]);
}

function right() {
  const c = current();
  const points = run.revealed ? 0 : Math.round(pointsFor(c.id) * (run.hintLevel ? 0.5 : 1));
  if (!run.revealed) {
    run.score += points;
    run.correct++;
    run.streak++;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    Store.recordAnswer(c.id, 'name', true);
  }
  run.revealed = true;
  run.locked = true;
  run.index++;
  render();
  setFeedback(points ? t('plusPoints', { p: points, name: countryName(c) }) : '✓', 'ok');
  showOnMap();
  renderHud();
  timer = setTimeout(next, NEXT_DELAY.right);
}

function wrong(typed) {
  const c = current();
  const other = Answers.findCountry(typed);
  const message = other && other !== c.id ? t('fqThatsFlagOf', { name: countryName(COUNTRY_BY_ID.get(other)) }) : t('notQuite');
  if (run.practice) {
    run.tries++;
    if (run.tries === 1) { run.wrong++; run.streak = 0; Store.recordAnswer(c.id, 'name', false); }
    setFeedback(message, 'bad');
    const field = $('input', card());
    field.classList.remove('shake'); void field.offsetWidth; field.classList.add('shake');
    field.select();
    return;
  }
  // game: a wrong answer costs a life and shows the answer
  run.lives--;
  run.wrong++;
  run.streak = 0;
  run.missed.push(c.id);
  Store.recordAnswer(c.id, 'name', false);
  run.revealed = true;
  run.locked = true;
  run.index++;
  render();
  setFeedback(t('wrongWas', { answer: countryName(c) }), 'bad');
  showOnMap();
  renderHud();
  timer = setTimeout(() => (run.lives <= 0 ? finish() : next()), NEXT_DELAY.wrong);
}

function reveal() {
  if (!run || run.revealed || run.locked) return;
  const c = current();
  if (!run.tries) { run.wrong++; run.streak = 0; Store.recordAnswer(c.id, 'name', false); }
  run.missed.push(c.id);
  run.revealed = true;
  render();
  showOnMap();
  renderHud();
}

function hint() {
  if (!run || run.practice || run.hints <= 0 || run.hintLevel || run.locked) return;
  run.hints--;
  run.hintLevel = 1;
  const typed = $('input', card())?.value || '';
  render();
  $('input', card()).value = typed;
}

function skip() {
  if (!run || run.locked) return;
  const c = current();
  if (!run.revealed && !run.tries) { run.wrong++; run.streak = 0; run.missed.push(c.id); }
  next();
}

function listen() {
  const button = $('[data-act="mic"]', card());
  if (!button || run.locked) return;
  if (stopListening) { stopListening(); stopListening = null; button.classList.remove('rec'); return; }
  button.classList.add('rec');
  setFeedback(t('listening'), '');
  stopListening = Speech.listen(lang(), {
    onResult: alternatives => {
      $('input', card()).value = alternatives[0] || '';
      submit(alternatives);
    },
    onError: code => setFeedback(code === 'not-allowed' ? t('micBlocked') : t('micError'), 'bad'),
    onEnd: () => { stopListening = null; $('[data-act="mic"]', card())?.classList.remove('rec'); },
  });
}

/* =====================================================================
   END
   ===================================================================== */
function finish() {
  if (!run || run.over) return;
  run.over = true;
  clearTimeout(timer);
  stopListening?.();
  card().classList.remove('show');
  hud().classList.remove('show');
  const seen = run.correct + run.wrong;
  const accuracy = seen ? Math.round(run.correct / seen * 100) : 0;
  const missed = [...new Set(run.missed)];
  const outOfLives = !run.practice && run.lives <= 0;
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge ${outOfLives ? 'lost' : ''}">${outOfLives ? ICONS.sad : ICONS.flag}</div>
        <div><h2>${t(outOfLives ? 'lost' : 'fqDone')}</h2><p class="lead flush">${t('m_flags')} · ${t(run.practice ? 'fqPractice' : 'fqGame')}</p></div>
      </div>
      ${bestScoreHtml(`flags:${run.practice ? 'practice' : 'game:' + run.total}`, `${t('m_flags')} · ${t(run.practice ? 'fqPractice' : 'fqGame')}`, run.score)}
      <div class="stats">
        <div class="stat"><b>${run.score}</b><span>${t('score')}</span></div>
        <div class="stat"><b>${accuracy}%</b><span>${t('accuracy')}</span></div>
        <div class="stat"><b>${run.correct}/${seen}</b><span>${t('correctCount')}</span></div>
        <div class="stat"><b>${run.bestStreak}</b><span>${t('bestStreak')}</span></div>
      </div>
      <div class="d-sec"><h3>${t('missed')} (${missed.length})</h3>
        ${missed.length ? `<ul class="missed">${missed.map(id => {
          const c = COUNTRY_BY_ID.get(id);
          return `<li>${flagImage(id)}<span>${escapeHtml(countryName(c))}<small>${escapeHtml(capitalName(c))}</small></span></li>`;
        }).join('')}</ul>` : `<p class="empty">${t('noMissed')}</p>`}</div>
      <div class="d-foot"><span class="pool"></span>
        ${missed.length ? `<button class="btn btn-bad" data-act="addhard" data-ids="${missed.join(',')}">${ICONS.bulb}${t('addHard')}</button>` : ''}
        <button class="btn btn-soft" data-act="back">${t('backMap')}</button>
        <button class="btn btn-primary" data-act="replay">${ICONS.repeat}${t('replay')}</button>
      </div>
    </div>`;
  Modal.open(END_ID);
}

function onEndClick(e) {
  const button = e.target.closest('[data-act]');
  if (!button) return;
  if (button.dataset.act === 'addhard') {
    Toast.show(t('addedHard', { n: Store.addHardMany(button.dataset.ids.split(',')) }));
    button.disabled = true;
    return;
  }
  const settings = run?.settings;
  Modal.close(END_ID);
  stop();
  if (button.dataset.act === 'replay' && settings) start(settings);
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const FlagQuiz = {
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    card().addEventListener('submit', e => { e.preventDefault(); submit($('input', card()).value); });
    card().addEventListener('click', e => {
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'letters') { run.letters = !run.letters; render(); }
      if (action === 'reveal') reveal();
      if (action === 'hint') hint();
      if (action === 'skip') skip();
      if (action === 'mic') listen();
    });
    hud().addEventListener('click', e => { if (e.target.closest('[data-act="quit"]') && run) finish(); });
    $('#' + END_ID).addEventListener('click', onEndClick);
  },
  start,
  stop,
  isRunning: () => Boolean(run),
  /** Clicking the map does nothing here (answers are typed or said). */
  onPlaceClick() {},
  refresh() { if (run && !run.over) { render(); renderHud(); } },
  peek: () => (run ? { id: run.current?.id, index: run.index, score: run.score, lives: run.lives, revealed: run.revealed, over: run.over, practice: run.practice } : null),
};
