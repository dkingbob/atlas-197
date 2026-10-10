/* global d3, topojson */
/**
 * Entry point: loads the world map, then connects the header controls,
 * the explore panel, the setup dialog, the progress panel and the games.
 *
 *   Explore  click a place → CountryPanel
 *   Play     SetupDialog → Game
 *   Progress ProgressPanel
 */
import { CONFIG } from './config.js';
import { COUNTRIES, COUNTRY_BY_ID } from './data/countries/index.js';
import { WATERS } from './data/waters.js';
import { Store } from './core/store.js';
import { Answers } from './core/answers.js';
import { $, $$ } from './core/utils.js';
import { STRINGS } from './i18n/strings.js';
import { t, lang, countryName, capitalName, waterName } from './i18n/i18n.js';
import { MapView } from './map/map-view.js';
import { CountryPanel } from './ui/country-panel.js';
import { ProgressPanel } from './ui/progress-panel.js';
import { SetupDialog } from './ui/setup-dialog.js';
import { Modal, Toast } from './ui/components.js';
import { Game } from './game/game.js';

let inGame = false;

/* ---------- static texts (elements with data-i18n / data-i18n-title) ---------- */
function applyStaticTexts() {
  document.documentElement.lang = lang();
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
  $$('#lang-seg [data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === lang()));
  const namesOn = Store.pref('names');
  const namesButton = $('#names-btn');
  namesButton.classList.toggle('off', !namesOn);
  namesButton.title = namesOn ? t('namesOnTip') : t('namesOffTip');
  if (!$('#loader').classList.contains('error')) $('#loader-msg').textContent = t('loading');
}

function setLanguage(newLang) {
  Store.setLang(newLang);
  applyStaticTexts();
  MapView.refreshLanguage();
  CountryPanel.refresh();
  ProgressPanel.refresh();
  SetupDialog.refresh();
  Game.refresh();
}

/* ---------- display mode (flags / gray) & names ---------- */
function syncHeaderButtons() {
  $$('#display-seg [data-display]').forEach(b => {
    b.classList.toggle('active', b.dataset.display === MapView.getDisplay());
    b.disabled = inGame && !Game.flagsAllowed() && b.dataset.display === 'flag';
  });
  $('#names-btn').disabled = inGame;
}

function setDisplay(mode) {
  if (inGame && !Game.flagsAllowed()) return Toast.show(t('flagOff'));
  Store.setPref('display', mode);
  if (!inGame && mode === 'gray') MapView.clearReveals(); // fresh self-test
  MapView.setDisplay(mode);
  syncHeaderButtons();
}

function toggleNames() {
  if (inGame) return;
  Store.setPref('names', !Store.pref('names'));
  MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
  applyStaticTexts();
}

function setGameMode(on) {
  inGame = on;
  document.body.classList.toggle('in-game', on);
  $$('#nav [data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === (on ? 'play' : 'explore')));
  if (on) CountryPanel.close();
  syncHeaderButtons();
}

/* ---------- explore mode ---------- */
function explorePlace(rec) {
  if (MapView.getDisplay() === 'gray' && !rec.revealed) MapView.reveal(rec);
  CountryPanel.open(rec);
}

/* ---------- wiring ---------- */
function bindHeader() {
  $('#nav').addEventListener('click', e => {
    const target = e.target.closest('[data-nav]')?.dataset.nav;
    if (target === 'explore') {
      if (Game.isActive()) Game.quit();
      Modal.close('setup-modal');
      Modal.close('progress-modal');
      setGameMode(false);
    }
    if (target === 'play') {
      if (Game.isActive()) return Toast.show(t('gameRunning'));
      Modal.close('progress-modal');
      CountryPanel.close();
      SetupDialog.open();
    }
    if (target === 'progress') {
      Modal.close('setup-modal');
      ProgressPanel.open();
    }
  });
  $('#display-seg').addEventListener('click', e => {
    const button = e.target.closest('[data-display]');
    if (button && !button.disabled) setDisplay(button.dataset.display);
  });
  $('#names-btn').addEventListener('click', toggleNames);
  $('#lang-seg').addEventListener('click', e => {
    const button = e.target.closest('[data-lang]');
    if (button) setLanguage(button.dataset.lang);
  });
  $('#zoom-in').addEventListener('click', () => MapView.zoomBy(1.6));
  $('#zoom-out').addEventListener('click', () => MapView.zoomBy(1 / 1.6));
  $('#zoom-reset').addEventListener('click', () => MapView.resetView());
}

function bindGlobalKeys() {
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target.closest('.d-close')) m.classList.remove('open'); }));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openModal = ['confirm-modal', 'setup-modal', 'progress-modal'].find(Modal.isOpen);
    if (openModal) return Modal.close(openModal);
    if (CountryPanel.isOpen()) CountryPanel.close();
  });
}

function bindMap() {
  MapView.onPlaceClick(rec => {
    if (Game.isActive()) return Game.onPlaceClick(rec);
    if (Modal.isOpen('end-modal')) return;
    explorePlace(rec);
  });
  MapView.onWaterClick(lonLat => { if (Game.isActive()) Game.onWaterClick(lonLat); });
}

function showLoadError() {
  $('#loader').classList.add('error');
  $('#loader-msg').textContent = t('loadError');
}

/* ---------- boot ---------- */
async function boot() {
  applyStaticTexts();
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return showLoadError();

  CountryPanel.init();
  SetupDialog.init({ onStart: config => Game.start(config) });
  ProgressPanel.init({
    onPlayHardList: () => SetupDialog.open({ mode: 'hard' }),
    onChange: () => CountryPanel.refresh(),
  });
  Game.init({ onModeChange: setGameMode });
  bindHeader();
  bindGlobalKeys();
  bindMap();

  try {
    const topology = await d3.json(CONFIG.MAP_URL);
    MapView.init(topology);
    MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
    MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
    syncHeaderButtons();
    $('#loader').classList.add('hide');
  } catch (err) {
    console.error(err);
    showLoadError();
  }
}

/* Handle for the browser console and the end-to-end tests. Not used by the app itself. */
window.atlas = {
  CONFIG, COUNTRIES, COUNTRY_BY_ID, WATERS, STRINGS, Store, Answers, MapView, Game, CountryPanel,
  SetupDialog, ProgressPanel, setLanguage, t, countryName, capitalName, waterName,
};

boot();
