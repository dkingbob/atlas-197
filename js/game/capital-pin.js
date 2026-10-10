/* global d3 */
/**
 * Capital pin — a capital city is named; click where it is on the map.
 *
 * Points depend on how far your pin is from the real city (100 points within
 * 25 km, nothing beyond 1,500 km) + a bonus when the pin is inside the right
 * country. The answer is shown with a pin and a dashed line.
 *
 * Settings: { count (INFINITE = endless), levels, conts, showCountry: boolean }
 */
import { CONTINENT_IDS, CONTINENTS, CONFIG } from '../config.js';
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries/index.js';
import { levelOf, LEVEL_IDS } from '../data/difficulty.js';
import { STATS } from '../data/facts/stats.js';
import { Store } from '../core/store.js';
import { $, escapeHtml } from '../core/utils.js';
import { t, lang, countryName, capitalName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage, Modal, Toast } from '../ui/components.js';
import { freshOrder } from './pool.js';
import { INFINITE } from './game.js';

export const DEFAULT_PIN_SETTINGS = { count: 10, levels: [1, 2, 3], conts: CONTINENT_IDS.slice(), showCountry: true };
const EARTH_RADIUS_KM = 6371;
const PERFECT_KM = 25;
const ZERO_KM = 1500;
const MAX_POINTS = 100;
const COUNTRY_BONUS = 20;
const END_ID = 'pin-end-modal';

const card = () => $('#pin-card');
const hud = () => $('#pin-hud');

let run = null;
let onModeChange = () => {};

export function pinPool(settings) {
  const levels = settings.levels?.length ? settings.levels : LEVEL_IDS;
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  return COUNTRIES.filter(c => STATS[c.id]?.capitalLonLat && levels.includes(levelOf(c.id)) && conts.includes(c.continent));
}

/** Points for a pin `km` away from the city. */
export function pinPoints(km, insideCountry) {
  const distancePoints = km <= PERFECT_KM ? MAX_POINTS : Math.round(MAX_POINTS * Math.max(0, 1 - (km - PERFECT_KM) / (ZERO_KM - PERFECT_KM)));
  return distancePoints + (insideCountry ? COUNTRY_BONUS : 0);
}

const kmBetween = (a, b) => d3.geoDistance(a, b) * EARTH_RADIUS_KM;
const formatKm = km => new Intl.NumberFormat(lang() === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 0 }).format(km);

/* =====================================================================
   START / STOP
   ===================================================================== */
function start(settings) {
  stop({ silent: true });
  const pool = pinPool(settings);
  if (!pool.length) return Toast.show(t('poolEmpty'));
  const infinite = settings.count === INFINITE;
  run = {
    settings, pool, infinite,
    total: infinite ? Infinity : Math.min(settings.count > 0 ? settings.count : pool.length, pool.length),
    queue: infinite ? [] : freshOrder(pool),
    index: 0, current: null, score: 0, results: [], over: false,
  };
  onModeChange(true);
  document.body.classList.add('in-pin');
  const conts = settings.conts?.length ? settings.conts : CONTINENT_IDS;
  MapView.setInsets({ top: $('.topbar').getBoundingClientRect().bottom + 62, bottom: 150 });
  MapView.setCenter(conts.length === 1 && conts[0] === 'OCE' ? CONFIG.PACIFIC_CENTER : CONFIG.DEFAULT_CENTER);
  MapView.clearReveals();
  MapView.setDisplay('gray');
  MapView.setNameMode('none');
  MapView.setDimmed(conts.length < CONTINENT_IDS.length ? rec => !conts.includes(rec.continent) : null);
  next();
}

function stop({ silent = false } = {}) {
  if (!run) return;
  clearMap();
  run = null;
  card().classList.remove('show');
  hud().classList.remove('show');
  document.body.classList.remove('in-pin');
  MapView.setDimmed(null);
  MapView.setInsets({ top: 70, bottom: 16 });
  MapView.setCenter(CONFIG.DEFAULT_CENTER);
  MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
  MapView.clearReveals();
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  MapView.resetView();
  if (!silent) onModeChange(false);
}

function clearMap() {
  MapView.setPins([]);
  if (run?.current) MapView.setFlagShown(MapView.record(run.current.id), false);
}

/* =====================================================================
   FLOW
   ===================================================================== */
function next() {
  if (!run || run.over) return;
  clearMap();
  if (run.index >= run.total) return finish();
  if (run.infinite && !run.queue.length) {
    const round = freshOrder(run.pool);
    if (round.length > 1 && round[0] === run.current) round.push(round.shift());
    run.queue = round;
  }
  run.current = run.infinite ? run.queue.shift() : run.queue[run.index];
  run.answer = null;
  Store.markAsked(run.current.id);
  regionView();
  render();
  renderHud();
}

/** Zoom out to the continents in play. */
function regionView() {
  const conts = run.settings.conts?.length ? run.settings.conts : CONTINENT_IDS;
  if (conts.length === 1) MapView.zoomToGeo(CONTINENTS[conts[0]].view, { duration: 500 });
  else MapView.resetView(500);
}

function guess(lonLat) {
  if (!run || run.answer || !lonLat) return;
  const c = run.current;
  const city = STATS[c.id].capitalLonLat;
  const km = kmBetween(lonLat, city);
  const inside = MapView.contains(MapView.record(c.id), lonLat);
  const points = pinPoints(km, inside);
  run.score += points;
  run.answer = { km, inside, points };
  run.results.push({ id: c.id, km, points });
  run.index++;
  Store.recordAnswer(c.id, 'location', km < 300 || inside);
  MapView.setFlagShown(MapView.record(c.id), true);
  MapView.setPins([{ lonLat, cls: 'guess' }, { lonLat: city, cls: 'answer' }]);
  // show both points
  const lons = [lonLat[0], city[0]], lats = [lonLat[1], city[1]];
  const pad = Math.max(1.5, Math.min(12, km / 250));
  MapView.zoomToGeo([[Math.min(...lons) - pad, Math.min(...lats) - pad], [Math.max(...lons) + pad, Math.max(...lats) + pad]], { duration: 600, maxK: 9 });
  render();
  renderHud();
}

/* =====================================================================
   RENDERING
   ===================================================================== */
function render() {
  const c = run.current;
  const a = run.answer;
  const country = run.settings.showCountry ? `<small>${escapeHtml(countryName(c))}</small>` : '';
  card().innerHTML = a
    ? `<div class="pin-result">
        ${flagImage(c.id)}
        <div><b>${escapeHtml(capitalName(c))}</b><small>${escapeHtml(countryName(c))}</small></div>
        <div class="pin-score"><strong>+${a.points}</strong><small>${t('pinKm', { km: formatKm(a.km) })}${a.inside ? ' · ' + t('pinRightCountry') : ''}</small></div>
        <button class="btn btn-primary" data-act="next">${t('next')} <kbd>↵</kbd></button>
      </div>`
    : `<div class="pin-ask">${ICONS.pin}<div><span>${t('pinWhere')}</span><b>${escapeHtml(capitalName(c))}</b>${country}</div></div>
       <p class="q-sub">${t('pinHelp')}</p>`;
  card().classList.add('show');
  if (a) setTimeout(() => $('[data-act="next"]', card())?.focus(), 30);
}

function renderHud() {
  const progress = run.infinite ? '<span class="inf">∞</span>' : `<span>${Math.min(run.index + (run.answer ? 0 : 1), run.total)}/${run.total}</span>`;
  const avg = run.results.length ? Math.round(run.results.reduce((s, r) => s + r.km, 0) / run.results.length) : null;
  hud().innerHTML = `
    <div class="hud-stat"><span>${t('score')}</span>${run.score}</div>
    ${avg !== null ? `<div class="hud-stat"><span>${t('pinAverage')}</span>${formatKm(avg)} km</div>` : ''}
    ${progress}
    <button class="hud-quit" data-act="quit" title="${t('finishNow')}" aria-label="${t('finishNow')}">${run.infinite ? ICONS.check : ICONS.close}</button>`;
  hud().classList.add('show');
}

/* =====================================================================
   END
   ===================================================================== */
function finish() {
  if (!run || run.over) return;
  run.over = true;
  clearMap();
  card().classList.remove('show');
  hud().classList.remove('show');
  const n = run.results.length;
  const avg = n ? run.results.reduce((s, r) => s + r.km, 0) / n : 0;
  const worst = run.results.slice().sort((a, b) => b.km - a.km).slice(0, 8);
  $('#' + END_ID).innerHTML = `
    <div class="dialog">
      <div class="end-hero">
        <div class="end-badge">${ICONS.pin}</div>
        <div><h2>${t('won')}</h2><p class="lead flush">${t('m_pin')}</p></div>
      </div>
      <div class="stats">
        <div class="stat"><b>${run.score}</b><span>${t('score')}</span></div>
        <div class="stat"><b>${formatKm(avg)} km</b><span>${t('pinAverage')}</span></div>
        <div class="stat"><b>${run.results.filter(r => r.km <= PERFECT_KM * 4).length}/${n}</b><span>${t('pinClose')}</span></div>
        <div class="stat"><b>${n}</b><span>${t('pinCities')}</span></div>
      </div>
      <div class="d-sec"><h3>${t('pinFarthest')}</h3>
        ${worst.length ? `<ul class="missed">${worst.map(r => {
          const c = COUNTRY_BY_ID.get(r.id);
          return `<li>${flagImage(r.id)}<span>${escapeHtml(capitalName(c))}<small>${escapeHtml(countryName(c))}</small></span><span class="tag">${formatKm(r.km)} km</span></li>`;
        }).join('')}</ul>` : `<p class="empty">—</p>`}</div>
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
export const CapitalPin = {
  init(callbacks) {
    onModeChange = callbacks.onModeChange;
    card().addEventListener('click', e => { if (e.target.closest('[data-act="next"]')) next(); });
    hud().addEventListener('click', e => { if (e.target.closest('[data-act="quit"]') && run) finish(); });
    document.addEventListener('keydown', e => {
      if (run?.answer && !run.over && e.key === 'Enter' && !e.target.closest('button, input')) { e.preventDefault(); next(); }
    });
    $('#' + END_ID).addEventListener('click', onEndClick);
  },
  start,
  stop,
  isRunning: () => Boolean(run),
  /** Clicks on land and on water both drop a pin. */
  onPlaceClick(rec, e) { if (e) guess(MapView.lonLatOf(e)); },
  onWaterClick(lonLat) { guess(lonLat); },
  /** Tests: drop a pin at [lon, lat]. */
  pinAt: guess,
  refresh() { if (run && !run.over) { render(); renderHud(); } },
  peek: () => (run ? { id: run.current?.id, answered: Boolean(run.answer), points: run.answer?.points, km: run.answer?.km, score: run.score, index: run.index, over: run.over } : null),
};
