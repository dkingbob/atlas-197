/**
 * "My progress" dialog: % of countries known per continent, Study mode
 * memory (mastered / learning / due), accuracy per subject, the hard list,
 * and a reset button.
 */
import { CONTINENT_IDS } from '../config.js';
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries/index.js';
import { Store } from '../core/store.js';
import { $, escapeHtml } from '../core/utils.js';
import { t, lang, countryName, continentName } from '../i18n/i18n.js';
import { deckSummary } from '../game/srs.js';
import { whenText } from '../game/study.js';
import { ICONS } from './icons.js';
import { flagImage, Modal, Toast } from './components.js';

const ID = 'progress-modal';
let onPlayHardList = () => {};
let onReset = () => {};

function progressBar(label, done, total) {
  const pct = total ? Math.round(done / total * 100) : 0;
  return `<div class="cbar"><span>${escapeHtml(label)}</span>
    <div class="track"><i style="width:${pct}%"></i></div><em>${done}/${total} · ${pct}%</em></div>`;
}

function knownSection() {
  const known = new Set(Store.knownIds());
  const rows = CONTINENT_IDS.map(id => {
    const list = COUNTRIES.filter(c => c.continent === id);
    return progressBar(continentName(id), list.filter(c => known.has(c.id)).length, list.length);
  }).join('');
  const all = progressBar(t('overall'), COUNTRIES.filter(c => known.has(c.id)).length, COUNTRIES.length);
  return `<div class="cont-bars">${rows}<div style="height:4px"></div>${all}</div>`;
}

/** Study mode: how many countries are in long-term memory. */
function studySection() {
  const s = deckSummary(COUNTRIES.map(c => c.id), Store.srsCards(), Date.now());
  if (s.fresh === s.total) return `<p class="empty">${t('studyNone')}</p>`;
  const stat = (n, label) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`;
  return `<div class="stats">
    ${stat(s.mastered, t('studyMastered'))}${stat(s.learning, t('studyInProgress'))}
    ${stat(s.due, t('studyDueNow'))}${stat(s.due ? t('today') : s.nextDue ? whenText(s.nextDue) : '—', t('studyNextReview'))}
  </div>`;
}

function accuracySection() {
  const totals = { name: [0, 0], capital: [0, 0], location: [0, 0] }; // [correct, seen]
  for (const perCountry of Object.values(Store.allStats())) {
    for (const subject of Object.keys(totals)) {
      if (perCountry[subject]) { totals[subject][0] += perCountry[subject].ok; totals[subject][1] += perCountry[subject].seen; }
    }
  }
  return `<div class="cont-bars">${Object.entries(totals).map(([subject, [ok, seen]]) => {
    const pct = seen ? Math.round(ok / seen * 100) : 0;
    return `<div class="cbar"><span>${t('s_' + subject)}</span>
        <div class="track"><i class="acc" style="width:${pct}%"></i></div><em>${seen ? pct + '%' : '—'}</em></div>
      <p class="note tight">${seen ? t('answered', { n: seen }) : t('noAnswers')}</p>`;
  }).join('')}</div>`;
}

function hardListSection(hard) {
  if (!hard.length) return `<p class="empty">${t('hardListEmpty')}</p>`;
  return `<div class="hard-list">${hard.map(c => {
    const weight = Store.hardWeight(c.id);
    return `<span class="hard-item">${flagImage(c.id, '', countryName(c))}${escapeHtml(countryName(c))}
      <span class="w" title="${weight}/9">${'<i></i>'.repeat(Math.ceil(weight / 3))}</span>
      <button data-remove="${c.id}" title="${t('remove')}" aria-label="${t('remove')}">${ICONS.close}</button></span>`;
  }).join('')}</div>`;
}

/** Game memory, study memory, backup / restore. */
function memorySection() {
  const studied = Object.keys(Store.srsCards()).length;
  return `
    <p class="note tight">${t('memoryLead')}</p>
    <div class="mem-rows">
      <div class="mem-row"><span>${t('memoryGames', { n: Store.askedCount() })}</span>
        <button class="btn btn-soft sm" data-act="clear-asked" ${Store.askedCount() ? '' : 'disabled'}>${ICONS.trash}${t('clear')}</button></div>
      <div class="mem-row"><span>${t('memoryStudy', { n: studied })}</span>
        <button class="btn btn-soft sm" data-act="clear-study" ${studied ? '' : 'disabled'}>${ICONS.trash}${t('clear')}</button></div>
      <div class="mem-row"><span>${t('backupLead')}</span>
        <span class="mem-btns"><button class="btn btn-soft sm" data-act="backup">${ICONS.download}${t('backup')}</button>
        <label class="btn btn-soft sm">${ICONS.upload}${t('restore')}<input type="file" accept=".json,application/json" data-act-file="restore" hidden></label></span></div>
    </div>`;
}

function downloadBackup() {
  const blob = new Blob([Store.exportBackup()], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `atlas197-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function restoreBackup(file) {
  try {
    Store.importBackup(await file.text());
    render();
    onReset();
    Toast.show(t('restored'));
  } catch {
    Toast.show(t('restoreBad'), 3500);
  }
}

function render() {
  const hard = Store.hardIds().map(id => COUNTRY_BY_ID.get(id)).filter(Boolean)
    .sort((a, b) => countryName(a).localeCompare(countryName(b), lang()));
  $('#' + ID).innerHTML = `
    <div class="dialog">
      <button class="d-close" data-act="close" aria-label="${t('close')}">${ICONS.close}</button>
      <h2>${t('progTitle')}</h2><p class="lead">${t('progLead')}</p>
      <div class="d-sec"><h3>${t('knownByCont')}</h3>${knownSection()}</div>
      <div class="d-sec"><h3>${t('studyMemory')}</h3>${studySection()}</div>
      <div class="d-sec"><h3>${t('bySubject')}</h3>${accuracySection()}</div>
      <div class="d-sec"><h3>${t('hardList')} (${hard.length})</h3>${hardListSection(hard)}</div>
      <div class="d-sec"><h3>${t('memoryTitle')}</h3>${memorySection()}</div>
      <div class="d-foot"><span class="pool"></span>
        ${hard.length ? `<button class="btn btn-accent" data-act="playhard">${ICONS.repeat}${t('playHard')}</button>` : ''}
        <button class="btn btn-soft" data-act="reset">${ICONS.trash}${t('reset')}</button>
      </div>
    </div>`;
}

function onClick(e) {
  const modal = $('#' + ID);
  if (e.target === modal) return Modal.close(ID);
  const remove = e.target.closest('[data-remove]');
  if (remove) { Store.setHard(remove.dataset.remove, false); render(); onReset(); return; }
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (action === 'close') Modal.close(ID);
  if (action === 'playhard') { Modal.close(ID); onPlayHardList(); }
  if (action === 'backup') downloadBackup();
  if (action === 'clear-asked') {
    Modal.confirm({ title: t('clearAskedTitle'), text: t('clearAskedText'), okLabel: t('clear') }, () => { Store.clearAsked(); render(); Toast.show(t('cleared')); });
  }
  if (action === 'clear-study') {
    Modal.confirm({ title: t('clearStudyTitle'), text: t('clearStudyText'), okLabel: t('clear') }, () => { Store.clearStudy(); render(); onReset(); Toast.show(t('cleared')); });
  }
  if (action === 'reset') {
    Modal.confirm({ title: t('resetTitle'), text: t('resetConfirm'), okLabel: t('confirm') }, () => {
      Store.reset();
      render();
      onReset();
      Toast.show(t('resetDone'));
    });
  }
}

export const ProgressPanel = {
  /** @param {{ onPlayHardList: Function, onChange: Function }} callbacks */
  init(callbacks) {
    onPlayHardList = callbacks.onPlayHardList;
    onReset = callbacks.onChange;
    $('#' + ID).addEventListener('click', onClick);
    $('#' + ID).addEventListener('change', e => {
      if (e.target.dataset.actFile === 'restore' && e.target.files[0]) restoreBackup(e.target.files[0]);
    });
  },
  open() { render(); Modal.open(ID); },
  refresh() { if (Modal.isOpen(ID)) render(); },
};
