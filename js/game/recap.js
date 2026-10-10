/**
 * Recap slideshow (Study mode) — shows every country you have already seen,
 * one after the other: the map flies to it, paints its flag, and the card
 * shows (and can say aloud) its name and capital.
 *
 * Speed: 0.75× / 1× / 1.5× / 2×, where 1× = 3.5 s per country.
 * Controls: previous, play/pause, next, voice on/off, "start learning".
 *
 *   Recap.play(ids, { onDone, onQuit })
 */
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { Store } from '../core/store.js';
import { Speech } from '../core/speech.js';
import { $, escapeHtml } from '../core/utils.js';
import { t, lang, countryName, capitalName, continentName } from '../i18n/i18n.js';
import { MapView } from '../map/map-view.js';
import { ICONS } from '../ui/icons.js';
import { flagImage } from '../ui/components.js';
import { createSpeedSlider } from '../ui/speed-slider.js';

export const RECAP_SPEEDS = [0.75, 1, 1.5, 2];
const BASE_MS = 3500;

const card = () => $('#recap-card');

let show = null; // { ids, index, playing, timer, startedAt, remaining, onDone, onQuit, slider }

const speed = () => Store.pref('recapSpeed') || 1;
const voiceOn = () => Store.pref('recapVoice') !== false && Speech.canSpeak();
const slideMs = () => BASE_MS / speed();
const current = () => COUNTRY_BY_ID.get(show.ids[show.index]);
const formatSpeed = v => `${String(v).replace('.', lang() === 'fr' ? ',' : '.')}×`;

/** Fly to the country and paint its flag. */
function showOnMap(previousId) {
  if (previousId) {
    MapView.setFlagShown(MapView.record(previousId), false);
  }
  const rec = MapView.record(current().id);
  MapView.setFlagShown(rec, true);
  MapView.setPulse([rec]);
  MapView.zoomAround(rec, 5, { minK: 1.4, maxK: 6, duration: Math.min(900, slideMs() * 0.35) });
}

function render() {
  const c = current();
  const other = lang() === 'en' ? 'fr' : 'en';
  $('.rc-slide', card()).innerHTML = `
    <div class="rc-flag">${flagImage(c.id, '', countryName(c))}</div>
    <div class="rc-info">
      <h2>${escapeHtml(countryName(c))}${c.name[other] !== countryName(c) ? ` <small>${escapeHtml(c.name[other])}</small>` : ''}</h2>
      <p><b>${escapeHtml(capitalName(c))}</b> · ${escapeHtml(continentName(c.continent))}</p>
    </div>`;
  $('.rc-count', card()).textContent = `${show.index + 1} / ${show.ids.length}`;
  $('.rc-progress i', card()).style.width = `${((show.index + 1) / show.ids.length) * 100}%`;
  $('[data-act="toggle"]', card()).innerHTML = show.playing ? ICONS.pause : ICONS.play;
  $('[data-act="toggle"]', card()).setAttribute('aria-label', t(show.playing ? 'pause' : 'play'));
  $('[data-act="voice"]', card())?.classList.toggle('on', voiceOn());
  restartTimeBar();
}

/** The thin bar under the card fills up during the time a country stays on screen. */
function restartTimeBar() {
  const bar = $('.rc-time i', card());
  bar.style.animation = 'none';
  void bar.offsetWidth;
  bar.style.animation = `rcfill ${slideMs()}ms linear forwards`;
  bar.style.animationPlayState = show.playing ? 'running' : 'paused';
}

function say() {
  if (!voiceOn()) return;
  const c = current();
  Speech.say(`${countryName(c)}. ${capitalName(c)}.`, lang(), Math.min(1.4, 0.9 + (speed() - 1) * 0.4));
}

function go(index) {
  if (!show) return;
  const previous = show.ids[show.index];
  if (index >= show.ids.length) return done();
  show.index = Math.max(0, index);
  showOnMap(previous !== show.ids[show.index] ? previous : null);
  render();
  say();
  schedule();
}

function schedule() {
  clearTimeout(show.timer);
  if (!show.playing) return;
  show.timer = setTimeout(() => go(show.index + 1), slideMs());
}

function toggle() {
  show.playing = !show.playing;
  render();
  schedule();
}

function setSpeed(value) {
  Store.setPref('recapSpeed', value);
  restartTimeBar();
  schedule(); // the current country gets a full slide at the new speed
}

function clearMap() {
  if (!show) return;
  MapView.setFlagShown(MapView.record(show.ids[show.index]), false);
  MapView.setPulse([]);
}

function done() {
  const { onDone } = show;
  stop();
  onDone();
}

function stop() {
  if (!show) return;
  clearTimeout(show.timer);
  Speech.stopTalking();
  clearMap();
  show = null;
  card().classList.remove('show');
}

function build() {
  card().innerHTML = `
    <div class="rc-top"><span class="s-tag">${t('recapTag')}</span><span class="rc-count"></span>
      <button class="hud-quit" data-act="quit" title="${t('quit')}" aria-label="${t('quit')}">${ICONS.close}</button></div>
    <div class="rc-progress"><i></i></div>
    <div class="rc-slide"></div>
    <div class="rc-time"><i></i></div>
    <div class="rc-controls">
      <button class="rc-btn" data-act="prev" aria-label="${t('previous')}">${ICONS.prev}</button>
      <button class="rc-btn big" data-act="toggle"></button>
      <button class="rc-btn" data-act="next" aria-label="${t('next')}">${ICONS.next}</button>
      ${Speech.canSpeak() ? `<button class="rc-btn" data-act="voice" title="${t('recapVoice')}" aria-label="${t('recapVoice')}">${ICONS.speaker}</button>` : ''}
      <div class="rc-speed"><small>${t('recapSpeed')}</small></div>
      <button class="btn btn-primary rc-skip" data-act="skip">${t('recapSkip')}</button>
    </div>`;
  show.slider = createSpeedSlider({ values: RECAP_SPEEDS, value: speed(), format: formatSpeed, label: t('recapSpeed'), onChange: setSpeed });
  $('.rc-speed', card()).appendChild(show.slider.el);
}

export const Recap = {
  init() {
    card().addEventListener('click', e => {
      if (!show) return;
      const action = e.target.closest('[data-act]')?.dataset.act;
      if (action === 'prev') go(show.index - 1);
      if (action === 'next') go(show.index + 1);
      if (action === 'toggle') toggle();
      if (action === 'skip') done();
      if (action === 'quit') { const { onQuit } = show; stop(); onQuit(); }
      if (action === 'voice') {
        Store.setPref('recapVoice', !voiceOn());
        if (!voiceOn()) Speech.stopTalking(); else say();
        render();
      }
    });
    document.addEventListener('keydown', e => {
      if (!show || e.target.closest('input, textarea, [role="slider"]')) return;
      if (e.key === ' ') { e.preventDefault(); toggle(); }
      if (e.key === 'ArrowRight') go(show.index + 1);
      if (e.key === 'ArrowLeft') go(show.index - 1);
    });
  },
  /** Show `ids` one by one, then call onDone (or onQuit if the player quits). */
  play(ids, { onDone, onQuit }) {
    stop();
    show = { ids, index: 0, playing: true, timer: 0, onDone, onQuit };
    build();
    card().classList.add('show');
    go(0);
  },
  stop,
  isRunning: () => Boolean(show),
  refresh() { if (show) { const index = show.index; build(); show.index = index; render(); } },
  peek: () => (show ? { id: show.ids[show.index], index: show.index, total: show.ids.length, playing: show.playing, speed: speed() } : null),
};
