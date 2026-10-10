/**
 * Explore panel — slides in from the right when a country or territory is clicked.
 * Shows flag, capital, history, key facts and the "known" / "hard list" buttons.
 */
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { Store } from '../core/store.js';
import { $, escapeHtml } from '../core/utils.js';
import { t, lang, countryName, capitalName, continentName, territoryName } from '../i18n/i18n.js';
import { ICONS } from './icons.js';
import { flagImage, Toast } from './components.js';

const panel = () => $('#panel');
let current = null; // map record being shown

function open(rec) {
  current = rec;
  render();
  panel().classList.add('open');
  panel().querySelector('.p-scroll').scrollTop = 0;
}

function close() {
  panel().classList.remove('open');
  current = null;
}

const otherLang = () => (lang() === 'en' ? 'fr' : 'en');

function renderTerritory(info) {
  const sovereign = info.sov && COUNTRY_BY_ID.get(info.sov);
  const other = otherLang();
  return `
    <button class="p-close" data-act="close" aria-label="${t('close')}">${ICONS.close}</button>
    <div class="p-scroll">
      ${info.code ? `<div class="p-flagbox">${flagImage(info.code, 'p-flag', territoryName(info))}</div>` : ''}
      <p class="p-eyebrow">${escapeHtml(info.disputed ? t('disputed') : t('territory'))}</p>
      <h2 class="p-name">${escapeHtml(territoryName(info))}</h2>
      ${info[other] && info[other] !== territoryName(info) ? `<p class="p-alt">${other.toUpperCase()} · ${escapeHtml(info[other])}</p>` : ''}
      ${sovereign ? `
        <dl class="p-meta">
          <div><dt>${t('territory')}</dt><dd>${escapeHtml(countryName(sovereign))}</dd></div>
          <div><dt>${t('continent')}</dt><dd>${escapeHtml(continentName(info.cont))}</dd></div>
        </dl>` : ''}
      <p class="p-terr-note">${t('terrNote')}</p>
    </div>`;
}

function renderCountry(c) {
  const known = Store.isKnown(c.id);
  const hard = Store.isHard(c.id);
  const other = otherLang();
  return `
    <button class="p-close" data-act="close" aria-label="${t('close')}">${ICONS.close}</button>
    <div class="p-scroll">
      <div class="p-flagbox">${flagImage(c.id, 'p-flag', countryName(c))}</div>
      <p class="p-eyebrow">${escapeHtml(continentName(c.continent))}</p>
      <h2 class="p-name">${escapeHtml(countryName(c))}</h2>
      ${c.name[other] !== countryName(c) ? `<p class="p-alt">${other.toUpperCase()} · ${escapeHtml(c.name[other])}</p>` : ''}
      <dl class="p-meta">
        <div><dt>${t('capital')}</dt><dd>${escapeHtml(capitalName(c))}</dd></div>
        <div><dt>${t('continent')}</dt><dd>${escapeHtml(continentName(c.continent))}</dd></div>
      </dl>
      <section class="p-sec">
        <h3>${t('history')}</h3>
        <p>${escapeHtml(c.history[lang()])}</p>
      </section>
      <section class="p-sec">
        <h3>${t('keyFacts')}</h3>
        <ul class="p-facts">${c.keyFacts[lang()].map((fact, i) => `<li><b>${i + 1}</b><span>${escapeHtml(fact)}</span></li>`).join('')}</ul>
      </section>
    </div>
    <div class="p-actions">
      <button class="btn btn-ok ${known ? 'on' : ''}" data-act="known">${ICONS.check}<span>${known ? t('known') : t('know')}</span></button>
      <button class="btn btn-bad ${hard ? 'on' : ''}" data-act="hard">${ICONS.bulb}<span>${hard ? t('onHard') : t('cantRemember')}</span></button>
    </div>`;
}

function render() {
  if (!current) return;
  panel().innerHTML = current.kind === 'territory' ? renderTerritory(current.territory) : renderCountry(current.country);
}

function onClick(e) {
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (!action) return;
  if (action === 'close') return close();
  if (current?.kind !== 'country') return;
  const { id } = current.country;
  if (action === 'known') {
    const on = !Store.isKnown(id);
    Store.setKnown(id, on);
    if (on) Toast.show(t('markedKnown', { name: countryName(current.country) }));
  }
  if (action === 'hard') {
    const on = !Store.isHard(id);
    Store.setHard(id, on);
    if (on) Toast.show(t('addedToHard', { name: countryName(current.country) }));
  }
  render();
}

export const CountryPanel = {
  init() { panel().addEventListener('click', onClick); },
  open,
  close,
  refresh: render,
  isOpen: () => panel().classList.contains('open'),
};
