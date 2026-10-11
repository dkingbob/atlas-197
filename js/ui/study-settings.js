/**
 * Settings form for Study mode (deck, new countries per session, capitals),
 * shown inside the setup dialog.
 *
 *   renderStudySettings(settings)   → HTML
 *   applyStudyClick(settings, e)    → true if the click changed settings
 *   studyPoolLine(settings)         → { count, message } for the dialog footer
 */
import { CONTINENT_IDS } from '../config.js';
import { escapeHtml } from '../core/utils.js';
import { t, continentName } from '../i18n/i18n.js';
import { STUDY_NEW_COUNTS, RECAP_CHOICES, studySummary, whenText } from '../game/study.js';
import { ICONS } from './icons.js';
import { renderLevelChips } from './rush-settings.js';

export function renderStudySettings(s) {
  return `
    <p class="note s-intro">${t('studyIntro')}</p>
    <div class="d-sec"><h3>${t('studyNewCount')}</h3><div class="chips">${STUDY_NEW_COUNTS.map(n => `
      <button class="chip ${s.newCount === n ? 'active' : ''}" data-study="newCount" data-val="${n}">${n}</button>`).join('')}</div>
      <label class="switch"><input type="checkbox" data-study-option="capitals" ${s.capitals ? 'checked' : ''}>${t('studyCapitals')}</label>
    </div>
    <div class="d-sec"><h3>${t('studyRecallSteps')}</h3>
      <label class="switch"><input type="checkbox" data-study-option="askName" ${s.askName !== false ? 'checked' : ''}>${t('studyAskName')}</label>
      <label class="switch"><input type="checkbox" data-study-option="askPlace" ${s.askPlace !== false ? 'checked' : ''}>${t('studyAskPlace')}</label>
    </div>
    ${recapSection(s)}
    ${renderLevelChips(s.levels, false, 'data-study-level')}
    <div class="d-sec"><h3>${t('fContinents')}</h3><div class="chips">${CONTINENT_IDS.map(id => `
      <button class="chip ${s.conts.includes(id) ? 'active' : ''}" data-study-cont="${id}">${continentName(id)}</button>`).join('')}</div></div>`;
}

/** "Before the new countries": nothing / quiz everything seen / slideshow of everything seen. */
function recapSection(s) {
  const seen = studySummary(s).total - studySummary(s).fresh;
  const icons = { none: ICONS.next, quiz: ICONS.repeat, slideshow: ICONS.play };
  return `<div class="d-sec"><h3>${t('recapTitle')} <small class="h-note">${t('recapSeen', { n: seen })}</small></h3>
    <div class="modes three">${RECAP_CHOICES.map(r => `
      <button class="mode-card ${s.recap === r ? 'active' : ''}" data-study-recap="${r}" ${r !== 'none' && !seen ? 'disabled' : ''}>
        <span class="mi">${icons[r]}</span><b>${t('recap_' + r)}</b><small>${t('recap_' + r + '_d')}</small></button>`).join('')}</div></div>`;
}

const toggle = (list, value) => (list.includes(value) ? list.filter(x => x !== value) : list.concat(value));

export function applyStudyClick(s, e) {
  const setter = e.target.closest('[data-study]');
  if (setter) { s[setter.dataset.study] = Number(setter.dataset.val); return true; }
  const recap = e.target.closest('[data-study-recap]');
  if (recap && !recap.disabled) { s.recap = recap.dataset.studyRecap; return true; }
  const level = e.target.closest('[data-study-level]');
  if (level) { s.levels = toggle(s.levels, Number(level.dataset.studyLevel)).sort(); return true; }
  const cont = e.target.closest('[data-study-cont]');
  if (cont) { s.conts = toggle(s.conts, cont.dataset.studyCont); return true; }
  return false;
}

/** Footer line: "12 new · 3 to review · 5 mastered of 35". */
export function studyPoolLine(s) {
  const sum = studySummary(s);
  const seen = sum.total - sum.fresh;
  const count = Math.min(sum.fresh, s.newCount) + (s.recap !== 'none' && seen ? seen : sum.due);
  if (count) return { count, message: t('studyDeckLine', sum) };
  if (sum.nextDue) return { count: 0, message: t('studyAllDone', { when: escapeHtml(whenText(sum.nextDue)) }) };
  return { count: 0, message: t('poolEmpty') };
}
