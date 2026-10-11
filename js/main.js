/* global d3, topojson */
/**
 * Entry point: loads the world map, then connects the header controls,
 * the explore panel, the setup dialog, the progress panel and the games.
 *
 *   Explore  click a place → CountryPanel
 *   Play     SetupDialog → Game (classic modes), Rush (timed modes) or Study (learning)
 *   Party    PartyDialog → Lobby (net/) → Rush, with friends
 *   Progress ProgressPanel
 */
import { CONFIG } from './config.js';
import { COUNTRIES, COUNTRY_BY_ID } from './data/countries/index.js';
import { WATERS } from './data/waters.js';
import { Store } from './core/store.js';
import { Activity } from './core/activity.js';
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
import { Rush } from './game/rush.js';
import { Study } from './game/study.js';
import { Recap } from './game/recap.js';
import { FinalTest } from './game/final-test.js';
import { FlagQuiz } from './game/flag-quiz.js';
import { Facts } from './game/facts.js';
import { CapitalPin } from './game/capital-pin.js';
import { PartyDialog } from './ui/party-dialog.js';

let inGame = false;
let playNav = 'play'; // which nav button started the game: 'play' or 'capitals'

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
  const capitalsOn = Boolean(Store.pref('capitals'));
  const capitalsButton = $('#capitals-btn');
  capitalsButton.classList.toggle('off', !capitalsOn);
  capitalsButton.title = capitalsOn ? t('capitalsOnTip') : t('capitalsOffTip');
  if (!$('#loader').classList.contains('error')) $('#loader-msg').textContent = t('loading');
}

function setLanguage(newLang) {
  Store.setLang(newLang);
  applyStaticTexts();
  MapView.refreshLanguage();
  CountryPanel.refresh();
  ProgressPanel.refresh();
  SetupDialog.refresh();
  PartyDialog.refresh();
  Game.refresh();
  Rush.refresh();
  Study.refresh();
  Object.values(ENGINES).forEach(engine => engine.refresh());
}

/* ---------- display mode (flags / gray) & names ---------- */
function syncHeaderButtons() {
  $$('#display-seg [data-display]').forEach(b => {
    b.classList.toggle('active', b.dataset.display === MapView.getDisplay());
    b.disabled = inGame && !flagsAllowed() && b.dataset.display === 'flag';
  });
  $('#names-btn').disabled = inGame;
  $('#capitals-btn').disabled = inGame;
}

/** Flags would give the answer away in Rush and in most classic modes. */
/** Engines with their own screens (start(settings) / stop() / isRunning() / onPlaceClick(rec)). */
const ENGINES = { flags: FlagQuiz, facts: Facts, pin: CapitalPin, final: FinalTest };
const runningEngine = () => Object.values(ENGINES).find(e => e.isRunning());
const flagsAllowed = () => !Rush.isRunning() && !Study.isRunning() && !runningEngine() && Game.flagsAllowed();
const anyGameActive = () => Game.isActive() || Rush.isRunning() || Study.isRunning() || Boolean(runningEngine());

function setDisplay(mode) {
  if (inGame && !flagsAllowed()) return Toast.show(t('flagOff'));
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

/** "Capitals" display: a dot and the name of every capital (hidden during games — it would give answers away). */
function toggleCapitals() {
  if (inGame) return;
  Store.setPref('capitals', !Store.pref('capitals'));
  MapView.setCapitals(Store.pref('capitals'));
  applyStaticTexts();
}

function setGameMode(on) {
  inGame = on;
  MapView.setCapitals(!on && Store.pref('capitals'));
  document.body.classList.toggle('in-game', on);
  const playing = on ? (PartyDialog.isInParty() ? 'party' : playNav) : 'explore';
  $$('#nav [data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === playing));
  if (on) CountryPanel.close();
  syncHeaderButtons();
}

/* ---------- explore mode ---------- */
/** Gray map: 1st click shows the flag + panel, 2nd click on the same place puts it back to gray. */
function explorePlace(rec) {
  if (MapView.getDisplay() === 'gray' && rec.revealed) {
    MapView.unreveal(rec);
    if (CountryPanel.current() === rec) CountryPanel.close();
    return;
  }
  if (MapView.getDisplay() === 'gray') MapView.reveal(rec);
  CountryPanel.open(rec);
}

/* ---------- wiring ---------- */
function bindHeader() {
  $('#nav').addEventListener('click', e => {
    const target = e.target.closest('[data-nav]')?.dataset.nav;
    if (target === 'explore') {
      if (Game.isActive()) Game.quit();
      if (Rush.isRunning() && !PartyDialog.isInParty()) { Modal.close('rush-end-modal'); Rush.stop(); }
      if (Study.isRunning()) { Modal.close('study-end-modal'); Study.stop(); }
      const engine = runningEngine();
      if (engine) { document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open')); engine.stop(); }
      Modal.close('setup-modal');
      Modal.close('party-modal');
      Modal.close('progress-modal');
      setGameMode(false);
    }
    if (target === 'play' || target === 'capitals') {
      if (anyGameActive() || PartyDialog.isInParty()) return Toast.show(t('gameRunning'));
      Modal.close('progress-modal');
      Modal.close('party-modal');
      CountryPanel.close();
      playNav = target;
      SetupDialog.open(target === 'capitals' ? { hub: 'capitals' } : {});
    }
    if (target === 'party') {
      if (Game.isActive() || Study.isRunning() || runningEngine()) return Toast.show(t('gameRunning'));
      Modal.close('setup-modal');
      Modal.close('progress-modal');
      CountryPanel.close();
      PartyDialog.open();
    }
    if (target === 'progress') {
      Modal.close('setup-modal');
      Modal.close('party-modal');
      ProgressPanel.open();
    }
  });
  $('#display-seg').addEventListener('click', e => {
    const button = e.target.closest('[data-display]');
    if (button && !button.disabled) setDisplay(button.dataset.display);
  });
  $('#names-btn').addEventListener('click', toggleNames);
  $('#capitals-btn').addEventListener('click', toggleCapitals);
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
    const openModal = ['confirm-modal', 'setup-modal', 'party-modal', 'progress-modal'].find(Modal.isOpen);
    if (openModal) return Modal.close(openModal);
    if (CountryPanel.isOpen()) CountryPanel.close();
  });
}

function bindMap() {
  MapView.onPlaceClick((rec, e) => {
    if (Game.isActive()) return Game.onPlaceClick(rec);
    if (Rush.isRunning()) return Rush.onPlaceClick(rec);
    if (Study.isRunning()) return Study.onPlaceClick(rec);
    if (runningEngine()) return runningEngine().onPlaceClick(rec, e);
    if (Modal.isOpen('end-modal')) return;
    explorePlace(rec);
  });
  MapView.onWaterClick(lonLat => {
    if (Game.isActive()) Game.onWaterClick(lonLat);
    else runningEngine()?.onWaterClick?.(lonLat);
  });
}

function showLoadError() {
  $('#loader').classList.add('error');
  $('#loader-msg').textContent = t('loadError');
}

/**
 * Progress lives in this browser, for this exact address. Vercel also serves
 * every deployment on its own address (atlas-197-abc123.vercel.app): warn
 * there, otherwise the player thinks their progress is gone.
 */
function warnIfOtherAddress() {
  const home = new URL(CONFIG.HOME_URL);
  const { hostname } = location;
  if (hostname === home.hostname || !hostname.endsWith('.vercel.app')) return;
  const banner = document.createElement('div');
  banner.id = 'address-banner';
  banner.className = 'glass';
  banner.innerHTML = `<span>${t('otherAddress')}</span><a class="btn btn-primary sm" href="${CONFIG.HOME_URL}">${home.hostname}</a>
    <button class="btn btn-soft sm" aria-label="${t('close')}">✕</button>`;
  banner.querySelector('button').addEventListener('click', () => banner.remove());
  document.body.appendChild(banner);
}

/* ---------- boot ---------- */
async function boot() {
  applyStaticTexts();
  Store.askPersistent();
  Activity.start();
  warnIfOtherAddress();
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return showLoadError();

  CountryPanel.init();
  SetupDialog.init({
    onStart: config => {
      if (config.mode === 'rush') Rush.start({ settings: config.rush });
      else if (config.mode === 'study') Study.start(config.study);
      else if (ENGINES[config.mode]) ENGINES[config.mode].start(config.settings);
      else Game.start(config);
    },
  });
  PartyDialog.init();
  ProgressPanel.init({
    onPlayHardList: () => SetupDialog.open({ mode: 'hard' }),
    onChange: () => CountryPanel.refresh(),
  });
  Game.init({ onModeChange: setGameMode });
  Rush.init({ onModeChange: setGameMode });
  Study.init({ onModeChange: setGameMode });
  Object.values(ENGINES).forEach(engine => engine.init({ onModeChange: setGameMode }));
  bindHeader();
  bindGlobalKeys();
  bindMap();

  try {
    const topology = await d3.json(CONFIG.MAP_URL);
    MapView.init(topology);
    MapView.setDisplay(Store.pref('display') === 'flag' ? 'flag' : 'gray');
    MapView.setNameMode(Store.pref('names') ? 'all' : 'revealed');
    MapView.setCapitals(Store.pref('capitals'));
    syncHeaderButtons();
    $('#loader').classList.add('hide');
    const room = new URLSearchParams(location.search).get('room');
    if (room) PartyDialog.open({ code: room }); // invite link
  } catch (err) {
    console.error(err);
    showLoadError();
  }
}

/* Handle for the browser console and the end-to-end tests. Not used by the app itself. */
window.atlas = {
  CONFIG, COUNTRIES, COUNTRY_BY_ID, WATERS, STRINGS, Store, Answers, MapView, Game, Rush, Study, Activity, Recap, FinalTest, FlagQuiz, Facts, CapitalPin, CountryPanel,
  SetupDialog, PartyDialog, ProgressPanel, setLanguage, t, countryName, capitalName, waterName,
};

boot();
