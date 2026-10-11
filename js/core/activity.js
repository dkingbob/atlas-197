/**
 * Activity — how long you have really been using the site.
 *
 * Only active time counts: every mouse move, click, key, scroll or touch
 * keeps the clock running. After 5 minutes with no activity the whole quiet
 * stretch is taken out (not "5 minutes then stop" — the 5 minutes are not
 * counted either). Time while the tab is hidden never counts.
 *
 * Saved through Store (total + per day) every 10 seconds and when the tab is
 * hidden or closed.
 *
 *   Activity.start()
 *   Activity.sessionMs()   active time since the page was opened
 *   Activity.totalMs()     active time on this site, ever (this browser)
 *   Activity.todayMs()
 */
import { Store } from './store.js';

const IDLE_MS = 5 * 60 * 1000;
const SAVE_EVERY_MS = 10 * 1000;
const EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];

let lastActive = null;  // time of the last activity (null while the tab is hidden)
let pending = 0;        // active time not saved yet
let session = 0;        // active time this visit
let lastSeen = 0;       // throttle: handle at most one event per second

const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD, local time

/** Count the time since the last activity — unless it was a long quiet stretch. */
function touch(now = Date.now()) {
  if (lastActive !== null) {
    const gap = now - lastActive;
    if (gap > 0 && gap <= IDLE_MS) { pending += gap; session += gap; }
  }
  lastActive = now;
}

function onActivity() {
  const now = Date.now();
  if (now - lastSeen < 1000) return;
  lastSeen = now;
  touch(now);
}

function save() {
  if (!pending) return;
  Store.addActiveTime(pending, today());
  pending = 0;
}

function onVisibility() {
  if (document.hidden) { touch(); lastActive = null; save(); }
  else lastActive = Date.now();
}

export const Activity = {
  start() {
    lastActive = document.hidden ? null : Date.now();
    EVENTS.forEach(type => window.addEventListener(type, onActivity, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', () => { touch(); save(); });
    setInterval(save, SAVE_EVERY_MS);
  },
  sessionMs: () => session,
  totalMs: () => Store.activeTime().total + pending,
  todayMs: () => (Store.activeTime().days[today()] || 0) + pending,
  /** Days the site was used (for "x days"). */
  daysUsed: () => Object.keys(Store.activeTime().days).length,
  /** Tests: pretend `ms` passed with activity at the end. */
  _simulate(gapMs) { if (lastActive !== null) lastActive -= gapMs; touch(); },
};

/** "2 h 05 min", "12 min", "< 1 min". */
export function formatDuration(ms, lang = 'en') {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return lang === 'fr' ? '< 1 min' : '< 1 min';
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (!h) return `${m} min`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}
