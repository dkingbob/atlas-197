/**
 * Classic question flow, used by every mode except flag match.
 *
 * Answer types:
 *   click  the card names a place, the player clicks it on the map
 *   type   the place is highlighted, the player types its name (or its capital)
 *   mc     the place is highlighted, the player picks one of 4 options
 *
 * What is asked depends on the subject:
 *   name      "Click on France" / "Which country is highlighted?" (zoomed in, neighbours visible)
 *   capital   "Which country has the capital Paris?" / "What is the capital of France?"
 *   location  "Where is France?" / "Name the highlighted country" (map stays zoomed out)
 */
import { COUNTRIES } from '../data/countries/index.js';
import { WATERS } from '../data/waters.js';
import { Answers } from '../core/answers.js';
import { $, $$, escapeHtml, shuffle } from '../core/utils.js';
import { t, countryName, capitalName, waterName, territoryName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Toast } from '../ui/components.js';

const FEEDBACK_MS = { correct: 950, wrong: 2200, skip: 1600 };
const card = () => $('#qcard');
const count = n => (n === Infinity ? '∞' : n);
let ctx = null; // shared game context (see game.js)

/* ---------- flow ---------- */
function start() { nextQuestion(); }

function nextQuestion() {
  const { state, config } = ctx;
  ctx.clearMapHighlights();
  if (state.index >= state.total) return ctx.finish(true);

  if (config.mode === 'hard') {
    const previous = state.questions.at(-1)?.item;
    state.questions.push({ kind: 'country', item: ctx.nextHardCountry(previous) });
  }
  ctx.ensureQuestion();
  state.question = state.questions[state.index];
  ctx.markAsked(state.question.item);
  state.locked = false;
  state.usedHint = false;
  state.removedOptions = new Set();
  state.hintLine = '';
  state.hintPlaceholder = '';
  state.options = config.answer === 'mc' ? multipleChoiceOptions(state.question) : null;

  showQuestionOnMap();
  render();
  ctx.renderHud();
}

function showQuestionOnMap() {
  const { state, config } = ctx;
  const q = state.question;
  if (q.kind === 'water') {
    if (config.answer !== 'click') MapView.setWaterState(q.item.id, 'on', true);
    MapView.resetView();
    return;
  }
  if (config.answer === 'click') return ctx.regionView();
  const rec = currentRecord();
  MapView.setState(rec, 'target', true);
  if (config.subject === 'location') ctx.regionView(); // keep the wide view: finding it is the point
  else MapView.zoomToRecord(rec);                      // zoom in with neighbours for context
}

const currentRecord = () => (ctx.state.question?.kind === 'country' ? MapView.record(ctx.state.question.item.id) : null);

/** Right answer + 3 distractors, preferably from the same continent (or same water type). */
function multipleChoiceOptions(q) {
  if (q.kind === 'water') {
    const sameType = shuffle(WATERS.filter(w => w !== q.item && w.type === q.item.type));
    const otherType = shuffle(WATERS.filter(w => w !== q.item && w.type !== q.item.type));
    return shuffle([q.item, ...sameType.concat(otherType).slice(0, 3)]);
  }
  const c = q.item;
  const sameContinent = shuffle(COUNTRIES.filter(x => x !== c && x.continent === c.continent));
  const elsewhere = shuffle(COUNTRIES.filter(x => x !== c && x.continent !== c.continent));
  return shuffle([c, ...sameContinent.concat(elsewhere).slice(0, 3)]);
}

function optionLabel(option) {
  if (ctx.state.question.kind === 'water') return waterName(option);
  return ctx.config.subject === 'capital' ? capitalName(option) : countryName(option);
}

/* ---------- card ---------- */
function promptHtml() {
  const { state, config } = ctx;
  const q = state.question;
  const { answer, subject } = config;
  if (q.kind === 'water') {
    return answer === 'click' ? t('q_click_water', { name: escapeHtml(waterName(q.item)) }) : t('q_type_water');
  }
  const c = q.item;
  if (answer === 'click') {
    if (subject === 'capital') return t('q_click_capital', { capital: escapeHtml(capitalName(c)) });
    return t(subject === 'name' ? 'q_click_name' : 'q_click_location', { name: escapeHtml(countryName(c)) });
  }
  if (subject === 'capital') return t('q_type_capital', { name: escapeHtml(countryName(c)) });
  return t(subject === 'name' ? 'q_type_name' : 'q_type_location');
}

function helperText() {
  const { answer } = ctx.config;
  if (answer === 'click') return ctx.state.question.kind === 'water' ? t('helper_click_water') : t('helper_click');
  return answer === 'type' ? t('helper_type') : t('helper_mc');
}

function answerInputHtml() {
  const { state, config } = ctx;
  const disabled = state.locked ? 'disabled' : '';
  if (config.answer === 'type') {
    return `<form class="q-type" autocomplete="off">
      <input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
        placeholder="${escapeHtml(state.hintPlaceholder || t('typeHere'))}" aria-label="${t('typeHere')}" ${disabled}>
      <button class="btn btn-primary" ${disabled}>${t('submit')}</button></form>`;
  }
  if (config.answer === 'mc') {
    return `<div class="q-opts">${state.options.map((option, i) => {
      const removed = state.removedOptions.has(i);
      return `<button class="q-opt ${removed ? 'gone' : ''}" data-option="${i}" ${removed || state.locked ? 'disabled' : ''}>
        <kbd>${i + 1}</kbd><span>${escapeHtml(optionLabel(option))}</span></button>`;
    }).join('')}</div>`;
  }
  return '';
}

function render({ keepTyped = false } = {}) {
  const { state, config } = ctx;
  if (!state?.question) return;
  const typed = keepTyped ? $('input', card())?.value || '' : '';
  // flag next to "What is the capital of X?" — it can't give that answer away
  const showFlag = state.question.kind === 'country' && config.subject === 'capital' && config.answer !== 'click';
  const input = answerInputHtml();
  card().innerHTML = `
    <div class="q-top">
      ${showFlag ? flagImage(state.question.item.id, 'q-flag') : ''}
      <div class="q-text"><h2 class="q-prompt">${promptHtml()}</h2><p class="q-sub">${helperText()}</p></div>
    </div>
    ${input ? `<div class="q-body">${input}</div>` : ''}
    <div class="q-foot">
      <button class="q-tool" data-act="hint" ${state.hints && !state.locked ? '' : 'disabled'}>${ICONS.bulb}${t('hint')}<span class="n">${count(state.hints)}</span></button>
      <button class="q-tool" data-act="skip" ${state.skips && !state.locked ? '' : 'disabled'}>${ICONS.skip}${t('skip')}<span class="n">${count(state.skips)}</span></button>
      <span class="q-hintline">${escapeHtml(state.hintLine || '')}</span>
      <div class="q-feedback ${state.feedbackType || ''}">${escapeHtml(state.feedback || '')}</div>
    </div>`;
  card().classList.add('show');
  const field = $('input', card());
  if (field) {
    field.value = typed;
    const hasMouse = matchMedia('(pointer:fine)').matches; // don't pop up phone keyboards uninvited
    if (!state.locked && !keepTyped && hasMouse) setTimeout(() => field.focus(), 60);
  }
}

/* ---------- answering ---------- */
function onSubmit(e) {
  e.preventDefault();
  const { state, config } = ctx;
  if (!state || state.locked) return;
  const value = $('input', card()).value;
  if (!value.trim()) return;
  const q = state.question;
  const correct = q.kind === 'water' ? Answers.isWater(value, q.item)
    : config.subject === 'capital' ? Answers.isCapital(value, q.item) : Answers.isCountry(value, q.item);
  resolve(correct);
}

function chooseOption(i) {
  ctx.state.chosenOption = i;
  resolve(ctx.state.options[i] === ctx.state.question.item);
}

function onPlaceClick(rec) {
  const { state, config } = ctx;
  if (state.locked) return;
  if (rec.kind === 'territory') return Toast.show(t('terrNotQuiz', { name: territoryName(rec.territory) }));
  if (config.answer !== 'click') return;
  if (state.question.kind === 'water') return Toast.show(t('clickWater'));
  resolve(rec.id === state.question.item.id, rec);
}

function onWaterClick(lonLat) {
  const { state, config } = ctx;
  if (state.locked || config.answer !== 'click' || state.question?.kind !== 'water' || !lonLat) return;
  resolve(MapView.waterContains(state.question.item.id, lonLat));
}

/** Score the answer, show feedback on the card and the map, then move on. */
function resolve(correct, clickedRec = null) {
  const { state, config } = ctx;
  state.locked = true;
  const q = state.question;
  const points = ctx.scoreAnswer({ correct, countryId: q.kind === 'country' ? q.item.id : null, reduced: state.usedHint });
  if (correct) {
    state.feedback = t('correct', { p: points });
    state.feedbackType = 'ok';
  } else {
    state.missed.push({ question: q });
    state.feedback = t('wrongWas', { answer: ctx.answerText(q) });
    state.feedbackType = 'bad';
  }

  if (q.kind === 'country') {
    const rec = currentRecord();
    MapView.setState(rec, 'target', false);
    MapView.flash(rec, true, correct ? 1100 : 2100);           // always show where it was
    if (!correct && clickedRec) MapView.flash(clickedRec, false, 1600);
    if (!correct && config.answer === 'click') MapView.zoomAround(rec, 5, { duration: 600 });
  } else {
    MapView.setWaterState(q.item.id, 'on', false);
    MapView.setWaterState(q.item.id, 'ok', true);
  }

  render({ keepTyped: true });
  markOptions(correct);
  ctx.renderHud();
  state.index++;
  ctx.later(() => {
    state.feedback = '';
    state.feedbackType = '';
    if (state.lives <= 0) ctx.finish(false); else nextQuestion();
  }, correct ? FEEDBACK_MS.correct : FEEDBACK_MS.wrong);
}

/** Colour the right option green (and the chosen wrong one red). */
function markOptions(correct) {
  const { state, config } = ctx;
  if (config.answer !== 'mc') return;
  $$('.q-opt', card()).forEach((button, i) => {
    if (state.options[i] === state.question.item) button.classList.add('ok');
    else if (i === state.chosenOption && !correct) button.classList.add('bad');
  });
}

/* ---------- hint & skip ---------- */
function useHint() {
  const { state, config } = ctx;
  if (state.locked) return;
  if (!state.hints) return Toast.show(t('noHints'));
  state.hints--;
  state.usedHint = true;
  const q = state.question;
  if (config.answer === 'type') {
    const answer = q.kind === 'water' ? waterName(q.item) : config.subject === 'capital' ? capitalName(q.item) : countryName(q.item);
    state.hintPlaceholder = answer.charAt(0) + '…';
    state.hintLine = t('hintFirst', { l: answer.charAt(0) });
  } else if (config.answer === 'mc') {
    const wrongIndexes = state.options.map((_, i) => i).filter(i => state.options[i] !== q.item);
    shuffle(wrongIndexes).slice(0, 2).forEach(i => state.removedOptions.add(i));
  } else {
    state.hintLine = t('hintZoom');
    if (q.kind === 'water') {
      MapView.setWaterState(q.item.id, 'hint', true);
      MapView.zoomToBox(MapView.waterBox(q.item.id), { maxK: 4, pad: 0.4 });
    } else {
      MapView.zoomAround(currentRecord(), 7, { minK: 2.2 });
    }
  }
  render({ keepTyped: true });
}

function skip() {
  const { state } = ctx;
  if (state.locked) return;
  if (!state.skips) return Toast.show(t('noSkips'));
  state.skips--;
  state.locked = true;
  const q = state.question;
  state.missed.push({ question: q, skipped: true });
  state.feedback = t('skippedWas', { answer: ctx.answerText(q) });
  state.feedbackType = '';
  if (q.kind === 'country') {
    const rec = currentRecord();
    MapView.setState(rec, 'target', false);
    MapView.flash(rec, true, 1500);
  } else {
    MapView.setWaterState(q.item.id, 'on', false);
    MapView.setWaterState(q.item.id, 'ok', true);
  }
  render({ keepTyped: true });
  markOptions(true);
  state.index++;
  ctx.renderHud();
  ctx.later(() => { state.feedback = ''; nextQuestion(); }, FEEDBACK_MS.skip);
}

/* ---------- public ---------- */
export const QuestionRound = {
  init(context) {
    ctx = context;
    card().addEventListener('submit', onSubmit);
    card().addEventListener('click', e => {
      if (!ctx.state || ctx.isFlagMatch()) return;
      const option = e.target.closest('[data-option]');
      if (option) { if (!ctx.state.locked) chooseOption(Number(option.dataset.option)); return; }
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'hint') useHint();
      if (action === 'skip') skip();
    });
    // keys 1–4 pick an option
    document.addEventListener('keydown', e => {
      const { state, config } = ctx;
      if (!state || state.over || state.locked || ctx.isFlagMatch() || config.answer !== 'mc') return;
      if (e.target.matches?.('input')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && !state.removedOptions.has(n - 1)) chooseOption(n - 1);
    });
  },
  start,
  onPlaceClick,
  onWaterClick,
  refresh: () => render({ keepTyped: true }),
  hide: () => card().classList.remove('show'),
};

