/**
 * Settings form for Rush games (type, time, difficulty levels, continents).
 * Shared by the solo setup dialog and the party lobby.
 *
 *   renderRushSettings(settings, { readOnly })  → HTML
 *   applyRushClick(settings, event)             → true if the click changed settings
 */
import { CONTINENT_IDS } from '../config.js';
import { LEVEL_IDS, LEVEL_NAMES, LEVEL_POINTS, LEVELS } from '../data/difficulty.js';
import { t, lang, continentName } from '../i18n/i18n.js';
import { RUSH_MODES, RUSH_DURATIONS } from '../game/rush.js';

const modeKey = mode => 'r_' + mode.replace('-', '');
const durationLabel = s => (s < 60 || s % 60 ? t('seconds', { n: s }) : t('minutes', { n: s / 60 }));
export const levelLabel = n => `${n} · ${LEVEL_NAMES[n][lang()]}`;

/** A one-line summary ("Flag on the map · 1 min 30 · levels 1–3"), for players who are not the host. */
export function rushSummary(s) {
  return [t(modeKey(s.rushMode)), durationLabel(s.duration),
    s.levels.map(n => LEVEL_NAMES[n][lang()]).join(', '),
    s.conts.length === CONTINENT_IDS.length ? '' : s.conts.map(continentName).join(', ')].filter(Boolean).join(' · ');
}

export function renderRushSettings(s, { readOnly = false, fixedMode = false } = {}) {
  const off = readOnly ? 'disabled' : '';
  return `
    ${fixedMode ? '' : `<div class="d-sec"><h3>${t('rushMode')}</h3><div class="modes rush-modes">${RUSH_MODES.map(m => `
      <button class="mode-card ${s.rushMode === m ? 'active' : ''}" data-rush="rushMode" data-val="${m}" ${off}>
        <b>${t(modeKey(m))}</b><small>${t(modeKey(m) + '_d')}</small></button>`).join('')}</div></div>`}
    <div class="d-sec"><h3>${t('duration')}</h3><div class="chips">${RUSH_DURATIONS.map(d => `
      <button class="chip ${s.duration === d ? 'active' : ''}" data-rush="duration" data-val="${d}" ${off}>${durationLabel(d)}</button>`).join('')}</div></div>
    ${renderLevelChips(s.levels, readOnly, 'data-rush-level')}
    <div class="d-sec"><h3>${t('fContinents')}</h3><div class="chips">${CONTINENT_IDS.map(id => `
      <button class="chip ${s.conts.includes(id) ? 'active' : ''}" data-rush-cont="${id}" ${off}>${continentName(id)}</button>`).join('')}</div></div>`;
}

/** Level chips with points and country counts (also used by the classic setup). */
export function renderLevelChips(levels, readOnly = false, attr = 'data-level') {
  return `<div class="d-sec"><h3>${t('levels')}</h3><div class="chips">${LEVEL_IDS.map(n => `
    <button class="chip lvl-chip l${n} ${levels.includes(n) ? 'active' : ''}" ${attr}="${n}" ${readOnly ? 'disabled' : ''}>
      ${levelLabel(n)} <small>${LEVELS[n].length} · ${t('pts', { n: LEVEL_POINTS[n] })}</small></button>`).join('')}</div>
    <p class="note">${t('levelsNote')}</p></div>`;
}

const toggle = (list, value) => (list.includes(value) ? list.filter(x => x !== value) : list.concat(value));

/** Update `s` from a click inside the form. Returns true when something changed. */
export function applyRushClick(s, e) {
  const setter = e.target.closest('[data-rush]');
  if (setter && !setter.disabled) {
    const key = setter.dataset.rush;
    s[key] = key === 'duration' ? Number(setter.dataset.val) : setter.dataset.val;
    return true;
  }
  const level = e.target.closest('[data-rush-level]');
  if (level && !level.disabled) {
    s.levels = toggle(s.levels, Number(level.dataset.rushLevel)).sort();
    return true;
  }
  const cont = e.target.closest('[data-rush-cont]');
  if (cont && !cont.disabled) {
    s.conts = toggle(s.conts, cont.dataset.rushCont);
    return true;
  }
  return false;
}
