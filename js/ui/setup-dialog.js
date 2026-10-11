/**
 * "Start a game" dialog: mode, subject, answer type, question count and filters.
 * Calls onStart(config) — see game/pool.js for the config shape.
 * For Rush the config is { mode: 'rush', rush: <rush settings> } (see game/rush.js),
 * for Study { mode: 'study', study: <study settings> } (see game/study.js),
 * and for the form modes (mode-forms.js) { mode, settings }.
 *
 * SetupDialog.open({ hub: 'capitals' }) shows only the capital games.
 */
import { CONTINENT_IDS } from '../config.js';
import { COUNTRIES } from '../data/countries/index.js';
import { WATERS } from '../data/waters.js';
import { Store } from '../core/store.js';
import { $, $$, escapeHtml, normalize } from '../core/utils.js';
import { t, lang, countryName, continentName } from '../i18n/i18n.js';
import { buildCountryPool } from '../game/pool.js';
import { INFINITE } from '../game/game.js';
import { DEFAULT_RUSH_SETTINGS, rushPoolSize } from '../game/rush.js';
import { LEVEL_IDS } from '../data/difficulty.js';
import { renderRushSettings, renderLevelChips, applyRushClick } from './rush-settings.js';
import { DEFAULT_STUDY_SETTINGS } from '../game/study.js';
import { renderStudySettings, applyStudyClick, studyPoolLine } from './study-settings.js';
import { FORM_MODES, formSettings } from './mode-forms.js';
import { renderForm, applyFormEvent } from './form.js';
import { ICONS } from './icons.js';
import { flagImage, Modal } from './components.js';

const ID = 'setup-modal';
const MODES = [
  ['study', ICONS.book], ['rush', ICONS.timer], ['flags', ICONS.flag], ['facts', ICONS.landmark], ['world', ICONS.globe], ['continent', ICONS.map],
  ['oceans', ICONS.waves], ['flagmatch', ICONS.flag], ['learn', ICONS.check], ['hard', ICONS.repeat],
];
/** The Capitals button shows only the capital games (mode id, icon, label key). */
const CAPITAL_MODES = [
  ['world', ICONS.globe, 'capquiz'], ['pin', ICONS.pin, 'pin'], ['facts', ICONS.landmark, 'capfacts'],
  ['rush', ICONS.timer, 'caprush'], ['flagmatch', ICONS.flag, 'capmatch'], ['study', ICONS.book, 'capstudy'],
];
const COUNTS = [10, 20, 50, 0, INFINITE]; // 0 = all, INFINITE = endless
const MAX_CUSTOM_COUNT = 500;
const copyStudy = r => ({ ...DEFAULT_STUDY_SETTINGS, ...(r || {}), levels: (r?.levels || DEFAULT_STUDY_SETTINGS.levels).slice(), conts: (r?.conts || DEFAULT_STUDY_SETTINGS.conts).slice() });
const copyRush = r => ({ ...DEFAULT_RUSH_SETTINGS, ...(r || {}), levels: (r?.levels || DEFAULT_RUSH_SETTINGS.levels).slice(), conts: (r?.conts || DEFAULT_RUSH_SETTINGS.conts).slice() });

const defaults = () => ({
  mode: 'world', subject: 'location', answer: 'click', continent: 'EUR', count: 20,
  conts: CONTINENT_IDS.slice(), levels: LEVEL_IDS.slice(), excluded: [], excludeKnown: false, onlyHard: false,
  rush: copyRush(),
  study: copyStudy(),
  forms: {},          // settings of each form mode, by mode id
});

const isFormMode = mode => mode in FORM_MODES;
const formOf = () => settings.forms[settings.mode];

let settings = defaults();
let hub = null;      // null = all games, 'capitals' = capital games only
let search = '';
let onStart = () => {};

const modal = () => $('#' + ID);

const prefKey = () => (hub === 'capitals' ? 'setupCapitals' : 'setup');
const modeList = () => (hub === 'capitals' ? CAPITAL_MODES : MODES.map(([id, icon]) => [id, icon, id]));

function open({ hub: newHub = null, ...overrides } = {}) {
  hub = newHub;
  const hubDefaults = hub === 'capitals' ? { subject: 'capital', answer: 'type' } : {};
  settings = { ...defaults(), ...hubDefaults, ...(Store.pref(prefKey()) || {}), ...overrides };
  if (!modeList().some(([id]) => id === settings.mode)) settings.mode = modeList()[0][0];
  if (!Array.isArray(settings.conts) || !settings.conts.length) settings.conts = CONTINENT_IDS.slice();
  if (!Array.isArray(settings.levels) || !settings.levels.length) settings.levels = LEVEL_IDS.slice();
  settings.rush = copyRush(settings.rush);
  settings.study = copyStudy(settings.study);
  settings.forms = Object.fromEntries(Object.keys(FORM_MODES).map(m => [m, formSettings(m, settings.forms?.[m])]));
  if (hub === 'capitals') {
    settings.subject = 'capital';
    settings.study.capitals = true;
    settings.forms.facts.guess = 'capital';
  }
  search = '';
  render();
  Modal.open(ID);
}

/** Settings → game config. In the Capitals hub every game is about capitals. */
function toConfig() {
  const config = baseConfig();
  if (hub !== 'capitals') return config;
  if (config.mode === 'rush') config.rush.rushMode = 'capital';
  else if (config.mode === 'study') config.study.capitals = true;
  else if (config.mode === 'facts') config.settings.guess = 'capital';
  else if (config.filters) config.subject = 'capital';
  return config;
}

/** Settings → game config (capital is meaningless for oceans). */
function baseConfig() {
  if (settings.mode === 'rush') return { mode: 'rush', rush: copyRush(settings.rush) };
  if (settings.mode === 'study') return { mode: 'study', study: copyStudy(settings.study) };
  if (isFormMode(settings.mode)) return { mode: settings.mode, settings: structuredClone(formOf()) };
  const subject = settings.mode === 'oceans' && settings.subject === 'capital' ? 'location' : settings.subject;
  return {
    mode: settings.mode, subject, answer: settings.answer, continent: settings.continent, count: settings.count,
    filters: {
      conts: settings.conts.slice(), levels: settings.levels.slice(), excluded: settings.excluded.slice(),
      excludeKnown: settings.excludeKnown, onlyHard: settings.onlyHard,
    },
  };
}

/* ---------- rendering ---------- */
function chips(key, values, label, isDisabled = () => false) {
  return `<div class="chips">${values.map(v => `
    <button class="chip ${settings[key] === v ? 'active' : ''}" data-set="${key}" data-val="${v}" ${isDisabled(v) ? 'disabled' : ''}>${label(v)}</button>`).join('')}</div>`;
}

function modeCards() {
  return `<div class="modes">${modeList().map(([id, icon, labelKey]) => `
    <button class="mode-card ${settings.mode === id ? 'active' : ''}" data-set="mode" data-val="${id}">
      <span class="mi">${icon}</span><b>${t('m_' + labelKey)}</b><small>${t('m_' + labelKey + '_d')}</small>
    </button>`).join('')}</div>`;
}

/** 10 / 20 / 50 / All / ∞ / Custom [n]. */
function countChips() {
  const isFlagMatch = settings.mode === 'flagmatch';
  const custom = !COUNTS.includes(settings.count);
  const label = v => (v === INFINITE ? t('countInfinite') : v ? String(v) : t('all'));
  return `<div class="chips">${COUNTS.map(v => `
      <button class="chip ${settings.count === v ? 'active' : ''}" data-set="count" data-val="${v}" ${isFlagMatch && v === INFINITE ? 'disabled' : ''}>${label(v)}</button>`).join('')}
      <button class="chip ${custom ? 'active' : ''}" data-act="custom-count">${t('countCustom')}</button>
      ${custom ? `<input class="c-search count-input" type="number" min="1" max="${MAX_CUSTOM_COUNT}" inputmode="numeric"
        value="${settings.count}" placeholder="${t('countCustomPh')}" aria-label="${t('countCustom')}">` : ''}
    </div>${settings.count === INFINITE ? `<p class="note">${t('infiniteNote')}</p>` : ''}`;
}

function filtersSection() {
  const isContinentMode = settings.mode === 'continent';
  const excluded = new Set(settings.excluded);
  const sorted = COUNTRIES.slice().sort((a, b) => countryName(a).localeCompare(countryName(b), lang()));
  const isOpen = settings.excluded.length || settings.conts.length < CONTINENT_IDS.length
    || settings.levels.length < LEVEL_IDS.length || settings.excludeKnown || settings.onlyHard;
  return `
    <div class="d-sec"><details class="filters" ${isOpen ? 'open' : ''}>
      <summary>${t('filters')}</summary>
      ${isContinentMode ? '' : `
        <div class="f-row"><h4>${t('fContinents')}</h4><div class="chips">${CONTINENT_IDS.map(id => `
          <button class="chip ${settings.conts.includes(id) ? 'active' : ''}" data-filter-continent="${id}">${continentName(id)}</button>`).join('')}</div></div>`}
      <div class="f-row">${renderLevelChips(settings.levels)}</div>
      <div class="f-row"><h4>${t('fOptions')}</h4>
        <label class="switch"><input type="checkbox" data-option="excludeKnown"
          ${settings.excludeKnown || settings.mode === 'learn' ? 'checked' : ''} ${settings.mode === 'learn' ? 'disabled' : ''}>${t('excludeKnown')}</label>
        <label class="switch"><input type="checkbox" data-option="onlyHard"
          ${settings.onlyHard || settings.mode === 'hard' ? 'checked' : ''} ${settings.mode === 'hard' ? 'disabled' : ''}>${t('onlyHard')}</label>
      </div>
      <div class="f-row"><h4>${t('fCountries')}</h4>
        <input class="c-search" type="search" placeholder="${t('search')}" value="${escapeHtml(search)}">
        <div class="c-tools"><button data-act="all">${t('selectAll')}</button><button data-act="none">${t('selectNone')}</button></div>
        <div class="c-list">${sorted.map(c => `
          <label class="c-item" data-search="${escapeHtml(normalize(c.name.en) + ' ' + normalize(c.name.fr))}">
            <input type="checkbox" data-country="${c.id}" ${excluded.has(c.id) ? '' : 'checked'}>
            ${flagImage(c.id)}<span>${escapeHtml(countryName(c))}</span><small>${escapeHtml(continentName(c.continent))}</small>
          </label>`).join('')}</div>
      </div>
    </details></div>`;
}

function render() {
  const { mode } = settings;
  const note = mode === 'flagmatch' ? t('fm_note_' + settings.subject)
    : mode === 'oceans' ? t('oceans_note')
      : mode === 'hard' ? t('hard_note') : '';
  modal().innerHTML = `
    <div class="dialog">
      <button class="d-close" data-act="close" aria-label="${t('close')}">${ICONS.close}</button>
      <h2>${t(hub === 'capitals' ? 'capTitle' : 'setupTitle')}</h2><p class="lead">${t(hub === 'capitals' ? 'capLead' : 'setupLead')}</p>
      <div class="d-sec"><h3>${t('mode')}</h3>${modeCards()}</div>
      ${mode === 'rush' ? renderRushSettings(settings.rush, { fixedMode: hub === 'capitals' })
        : mode === 'study' ? renderStudySettings(settings.study)
          : isFormMode(mode) ? renderForm(formFields(), formOf())
            : classicSections(note)}
      <div class="d-foot">
        <span class="pool" id="pool-line"></span>
        <button class="btn btn-soft" data-act="close">${t('cancel')}</button>
        <button class="btn btn-primary" data-act="start" id="start-btn">${t('start')}</button>
      </div>
    </div>`;
  applySearch();
  updatePoolLine();
}

function classicSections(note) {
  const { mode } = settings;
  return `
      ${mode === 'continent' ? `<div class="d-sec"><h3>${t('chooseContinent')}</h3>${chips('continent', CONTINENT_IDS, continentName)}</div>` : ''}
      ${hub === 'capitals' ? '' : `<div class="d-sec"><h3>${t('subject')}</h3>${chips('subject', ['name', 'capital', 'location'], v => t('s_' + v), v => mode === 'oceans' && v === 'capital')}</div>`}
      ${mode === 'flagmatch' ? '' : `<div class="d-sec"><h3>${t('answerType')}</h3>${chips('answer', ['click', 'type', 'mc'], v => t('a_' + v))}</div>`}
      ${note ? `<p class="note">${note}</p>` : ''}
      <div class="d-sec"><h3>${t('questions')}</h3>${countChips()}</div>
      ${mode === 'oceans' ? '' : filtersSection()}`;
}

function applySearch() {
  const query = normalize(search);
  $$('.c-item', modal()).forEach(item => { item.style.display = !query || item.dataset.search.includes(query) ? '' : 'none'; });
}

/** "N countries in play" + disable Start when nothing matches. */
function updatePoolLine() {
  const line = $('#pool-line', modal());
  if (!line) return;
  let count, message;
  if (isFormMode(settings.mode)) {
    ({ count, message } = FORM_MODES[settings.mode].pool(formOf()));
  } else if (settings.mode === 'study') {
    ({ count, message } = studyPoolLine(settings.study));
  } else if (settings.mode === 'rush') {
    count = rushPoolSize(settings.rush);
    message = count ? t('poolCount', { n: count }) : t('poolEmpty');
  } else if (settings.mode === 'oceans') {
    count = WATERS.length;
    message = t('poolWaters', { n: count });
  } else {
    count = buildCountryPool(toConfig()).length;
    if (count) message = t('poolCount', { n: count });
    else if (settings.mode === 'hard' || settings.onlyHard) message = Store.hardIds().length ? t('poolEmpty') : t('hardEmpty');
    else if (settings.mode === 'learn') message = t('learnEmpty');
    else message = t('poolEmpty');
  }
  line.textContent = message;
  line.classList.toggle('bad', !count);
  $('#start-btn', modal()).disabled = !count;
}

/* ---------- events ---------- */
function onClick(e) {
  if (e.target === modal()) return Modal.close(ID);
  if (settings.mode === 'rush' && applyRushClick(settings.rush, e)) return render();
  if (settings.mode === 'study' && applyStudyClick(settings.study, e)) return render();
  if (isFormMode(settings.mode) && formEvent(e)) return;

  const levelChip = e.target.closest('[data-level]');
  if (levelChip) {
    const n = Number(levelChip.dataset.level);
    settings.levels = settings.levels.includes(n) ? settings.levels.filter(x => x !== n) : settings.levels.concat(n).sort();
    levelChip.classList.toggle('active', settings.levels.includes(n));
    return updatePoolLine();
  }

  const setter = e.target.closest('[data-set]');
  if (setter) {
    const key = setter.dataset.set;
    settings[key] = key === 'count' ? Number(setter.dataset.val) : setter.dataset.val;
    if (key === 'mode' && settings.mode === 'oceans' && settings.subject === 'capital') settings.subject = 'location';
    if (key === 'mode' && settings.mode === 'flagmatch' && settings.count === INFINITE) settings.count = 20;
    return render();
  }

  const continentChip = e.target.closest('[data-filter-continent]');
  if (continentChip) {
    const id = continentChip.dataset.filterContinent;
    settings.conts = settings.conts.includes(id) ? settings.conts.filter(x => x !== id) : settings.conts.concat(id);
    continentChip.classList.toggle('active', settings.conts.includes(id));
    return updatePoolLine();
  }

  const action = e.target.closest('[data-act]')?.dataset.act;
  if (action === 'close') Modal.close(ID);
  if (action === 'custom-count') {
    if (COUNTS.includes(settings.count)) settings.count = 30;
    render();
    $('.count-input', modal())?.select();
    return;
  }
  if (action === 'all' || action === 'none') {
    const visibleBoxes = $$('.c-item', modal()).filter(item => item.style.display !== 'none').map(item => item.querySelector('input'));
    const excluded = new Set(settings.excluded);
    for (const box of visibleBoxes) {
      box.checked = action === 'all';
      if (action === 'all') excluded.delete(box.dataset.country); else excluded.add(box.dataset.country);
    }
    settings.excluded = [...excluded];
    updatePoolLine();
  }
  if (action === 'start') {
    Store.setPref(prefKey(), { ...settings });
    Modal.close(ID);
    onStart(toConfig());
  }
}

/** Fields of the current form mode (capital games hide the "guess" choice). */
const formFields = () => FORM_MODES[settings.mode].fields().filter(f => !(hub === 'capitals' && f.lockedInCapitals));

/** Form modes: apply the event, then redraw what is needed. */
function formEvent(e) {
  const result = applyFormEvent(formFields(), formOf(), e);
  if (result === 'render') render();
  if (result === 'update') updatePoolLine();
  return Boolean(result);
}

function onChange(e) {
  if (isFormMode(settings.mode) && formEvent(e)) return;
  const input = e.target;
  if (input.dataset.country) {
    const excluded = new Set(settings.excluded);
    if (input.checked) excluded.delete(input.dataset.country); else excluded.add(input.dataset.country);
    settings.excluded = [...excluded];
    updatePoolLine();
  }
  if (input.dataset.studyOption) {
    const key = input.dataset.studyOption;
    settings.study[key] = input.checked;
    // name / place: at least one stays on
    if ((key === 'askName' || key === 'askPlace') && !input.checked) {
      const other = key === 'askName' ? 'askPlace' : 'askName';
      if (settings.study[other] === false) { settings.study[other] = true; render(); }
    }
    updatePoolLine();
  }
  if (input.dataset.option) {
    settings[input.dataset.option] = input.checked;
    updatePoolLine();
  }
}

function onInput(e) {
  if (isFormMode(settings.mode) && formEvent(e)) return;
  if (e.target.classList.contains('count-input')) {
    const n = Math.round(Number(e.target.value));
    if (n >= 1) { settings.count = Math.min(n, MAX_CUSTOM_COUNT); updatePoolLine(); }
    return;
  }
  if (!e.target.classList.contains('c-search')) return;
  search = e.target.value;
  applySearch();
}

export const SetupDialog = {
  /** @param {{ onStart: (config) => void }} callbacks */
  init(callbacks) {
    onStart = callbacks.onStart;
    modal().addEventListener('click', onClick);
    modal().addEventListener('change', onChange);
    modal().addEventListener('input', onInput);
  },
  open,
  refresh() { if (Modal.isOpen(ID)) render(); },
};
