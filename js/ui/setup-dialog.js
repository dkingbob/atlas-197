/**
 * "Start a game" dialog: mode, subject, answer type, question count and filters.
 * Calls onStart(config) — see game/pool.js for the config shape.
 * For Rush the config is { mode: 'rush', rush: <rush settings> } (see game/rush.js).
 */
import { CONTINENT_IDS } from '../config.js';
import { COUNTRIES } from '../data/countries/index.js';
import { WATERS } from '../data/waters.js';
import { Store } from '../core/store.js';
import { $, $$, escapeHtml, normalize } from '../core/utils.js';
import { t, lang, countryName, continentName } from '../i18n/i18n.js';
import { buildCountryPool } from '../game/pool.js';
import { DEFAULT_RUSH_SETTINGS, rushPoolSize } from '../game/rush.js';
import { LEVEL_IDS } from '../data/difficulty.js';
import { renderRushSettings, renderLevelChips, applyRushClick } from './rush-settings.js';
import { ICONS } from './icons.js';
import { flagImage, Modal } from './components.js';

const ID = 'setup-modal';
const MODES = [
  ['rush', ICONS.timer], ['world', ICONS.globe], ['continent', ICONS.map], ['oceans', ICONS.waves],
  ['flagmatch', ICONS.flag], ['learn', ICONS.book], ['hard', ICONS.repeat],
];
const COUNTS = [10, 20, 50, 0]; // 0 = all
const copyRush = r => ({ ...DEFAULT_RUSH_SETTINGS, ...(r || {}), levels: (r?.levels || DEFAULT_RUSH_SETTINGS.levels).slice(), conts: (r?.conts || DEFAULT_RUSH_SETTINGS.conts).slice() });

const defaults = () => ({
  mode: 'world', subject: 'location', answer: 'click', continent: 'EUR', count: 20,
  conts: CONTINENT_IDS.slice(), levels: LEVEL_IDS.slice(), excluded: [], excludeKnown: false, onlyHard: false,
  rush: copyRush(),
});

let settings = defaults();
let search = '';
let onStart = () => {};

const modal = () => $('#' + ID);

function open(overrides = {}) {
  settings = { ...defaults(), ...(Store.pref('setup') || {}), ...overrides };
  if (!Array.isArray(settings.conts) || !settings.conts.length) settings.conts = CONTINENT_IDS.slice();
  if (!Array.isArray(settings.levels) || !settings.levels.length) settings.levels = LEVEL_IDS.slice();
  settings.rush = copyRush(settings.rush);
  search = '';
  render();
  Modal.open(ID);
}

/** Settings → game config (capital is meaningless for oceans). */
function toConfig() {
  if (settings.mode === 'rush') return { mode: 'rush', rush: copyRush(settings.rush) };
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
  return `<div class="modes">${MODES.map(([id, icon]) => `
    <button class="mode-card ${settings.mode === id ? 'active' : ''}" data-set="mode" data-val="${id}">
      <span class="mi">${icon}</span><b>${t('m_' + id)}</b><small>${t('m_' + id + '_d')}</small>
    </button>`).join('')}</div>`;
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
      <h2>${t('setupTitle')}</h2><p class="lead">${t('setupLead')}</p>
      <div class="d-sec"><h3>${t('mode')}</h3>${modeCards()}</div>
      ${mode === 'rush' ? renderRushSettings(settings.rush) : classicSections(note)}
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
      <div class="d-sec"><h3>${t('subject')}</h3>${chips('subject', ['name', 'capital', 'location'], v => t('s_' + v), v => mode === 'oceans' && v === 'capital')}</div>
      ${mode === 'flagmatch' ? '' : `<div class="d-sec"><h3>${t('answerType')}</h3>${chips('answer', ['click', 'type', 'mc'], v => t('a_' + v))}</div>`}
      ${note ? `<p class="note">${note}</p>` : ''}
      <div class="d-sec"><h3>${t('questions')}</h3>${chips('count', COUNTS, v => (v ? String(v) : t('all')))}</div>
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
  if (settings.mode === 'rush') {
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
    Store.setPref('setup', { ...settings });
    Modal.close(ID);
    onStart(toConfig());
  }
}

function onChange(e) {
  const input = e.target;
  if (input.dataset.country) {
    const excluded = new Set(settings.excluded);
    if (input.checked) excluded.delete(input.dataset.country); else excluded.add(input.dataset.country);
    settings.excluded = [...excluded];
    updatePoolLine();
  }
  if (input.dataset.option) {
    settings[input.dataset.option] = input.checked;
    updatePoolLine();
  }
}

function onInput(e) {
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
