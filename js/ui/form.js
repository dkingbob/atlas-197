/**
 * Tiny declarative settings forms, for the game modes that have their own
 * settings (Flags, Facts, Capital pin…). A mode describes its fields:
 *
 *   { type: 'cards',  key, options: [{ val, label, desc }] }    big choice cards
 *   { type: 'chips',  key, label, options: [{ val, label }] }   one choice
 *   { type: 'count',  key, label, infinite: true }              10/20/50/All/∞/Custom
 *   { type: 'switch', key, label }                              on/off
 *   { type: 'levels', key }                                     difficulty levels 1–5
 *   { type: 'conts',  key }                                     continents
 *   { type: 'note',   text }
 *   any field can have `when: settings => boolean` to show it only sometimes
 *
 *   renderForm(fields, settings)          → HTML
 *   applyFormEvent(fields, settings, e)   → 'render' | 'update' | null
 */
import { CONTINENT_IDS } from '../config.js';
import { t, continentName } from '../i18n/i18n.js';
import { INFINITE } from '../game/game.js';
import { renderLevelChips } from './rush-settings.js';

export { INFINITE };
export const COUNT_CHOICES = [10, 20, 50, 0]; // 0 = all
const MAX_CUSTOM = 500;

const visible = (field, s) => !field.when || field.when(s);
const section = (title, body) => `<div class="d-sec">${title ? `<h3>${title}</h3>` : ''}${body}</div>`;

function countField(f, s) {
  const choices = f.infinite ? COUNT_CHOICES.concat(INFINITE) : COUNT_CHOICES;
  const value = s[f.key];
  const custom = !choices.includes(value);
  const label = v => (v === INFINITE ? t('countInfinite') : v ? String(v) : t('all'));
  return section(f.label || t('questions'), `<div class="chips">${choices.map(v => `
      <button class="chip ${value === v ? 'active' : ''}" data-f-key="${f.key}" data-f-val="${v}" data-f-num>${label(v)}</button>`).join('')}
      <button class="chip ${custom ? 'active' : ''}" data-f-custom="${f.key}">${t('countCustom')}</button>
      ${custom ? `<input class="c-search count-input" type="number" min="1" max="${MAX_CUSTOM}" inputmode="numeric"
        data-f-input="${f.key}" value="${value}" aria-label="${t('countCustom')}">` : ''}</div>
      ${value === INFINITE ? `<p class="note">${t('infiniteNote')}</p>` : ''}`);
}

const RENDERERS = {
  cards: (f, s) => section(f.label, `<div class="modes ${f.className || ''}">${f.options.map(o => `
      <button class="mode-card ${s[f.key] === o.val ? 'active' : ''}" data-f-key="${f.key}" data-f-val="${o.val}">
        ${o.icon ? `<span class="mi">${o.icon}</span>` : ''}<b>${o.label}</b>${o.desc ? `<small>${o.desc}</small>` : ''}</button>`).join('')}</div>`),
  chips: (f, s) => section(f.label, `<div class="chips">${f.options.map(o => `
      <button class="chip ${s[f.key] === o.val ? 'active' : ''}" data-f-key="${f.key}" data-f-val="${o.val}" ${typeof o.val === 'number' ? 'data-f-num' : ''}>${o.label}</button>`).join('')}</div>`),
  count: countField,
  switch: (f, s) => `<label class="switch"><input type="checkbox" data-f-switch="${f.key}" ${s[f.key] ? 'checked' : ''}>${f.label}</label>`,
  levels: (f, s) => renderLevelChips(s[f.key], false, 'data-f-level'),
  conts: (f, s) => section(t('fContinents'), `<div class="chips">${CONTINENT_IDS.map(id => `
      <button class="chip ${s[f.key].includes(id) ? 'active' : ''}" data-f-cont="${id}" data-f-list="${f.key}">${continentName(id)}</button>`).join('')}</div>`),
  note: f => `<p class="note">${f.text}</p>`,
};

export function renderForm(fields, s) {
  return fields.filter(f => visible(f, s)).map(f => RENDERERS[f.type](f, s)).join('');
}

const toggle = (list, value) => (list.includes(value) ? list.filter(x => x !== value) : list.concat(value));
const levelsKey = fields => fields.find(f => f.type === 'levels')?.key;

/** Update settings from a click / change / input event. */
export function applyFormEvent(fields, s, e) {
  const el = e.target;
  if (e.type === 'input') {
    const key = el.dataset?.fInput;
    if (!key) return null;
    const n = Math.round(Number(el.value));
    if (n >= 1) s[key] = Math.min(n, MAX_CUSTOM);
    return 'update';
  }
  if (e.type === 'change') {
    const key = el.dataset?.fSwitch;
    if (!key) return null;
    s[key] = el.checked;
    return 'render';
  }
  const setter = el.closest('[data-f-key]');
  if (setter) {
    s[setter.dataset.fKey] = 'fNum' in setter.dataset ? Number(setter.dataset.fVal) : setter.dataset.fVal;
    return 'render';
  }
  const custom = el.closest('[data-f-custom]');
  if (custom) {
    const key = custom.dataset.fCustom;
    if ([...COUNT_CHOICES, INFINITE].includes(s[key])) s[key] = 30;
    return 'render';
  }
  const level = el.closest('[data-f-level]');
  if (level) {
    const key = levelsKey(fields);
    s[key] = toggle(s[key], Number(level.dataset.fLevel)).sort();
    return 'render';
  }
  const cont = el.closest('[data-f-cont]');
  if (cont) {
    s[cont.dataset.fList] = toggle(s[cont.dataset.fList], cont.dataset.fCont);
    return 'render';
  }
  return null;
}
