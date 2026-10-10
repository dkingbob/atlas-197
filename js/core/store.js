/**
 * Store — the ONLY place that reads or writes saved progress.
 *
 * Today it saves to localStorage. To move to a real backend (user accounts),
 * write an adapter with the same two methods and call Store.setAdapter():
 *
 *   Store.setAdapter({
 *     load: () => cachedStateFromServer,          // must be synchronous
 *     save: state => fetch('/api/progress', { method: 'PUT', body: JSON.stringify(state) }),
 *   });
 *
 * Saved shape:
 *   lang     'en' | 'fr'
 *   prefs    { display: 'gray'|'flag', names: boolean, setup: last game settings }
 *   known    { [countryId]: timestamp }       countries marked "I know this"
 *   hard     { [countryId]: weight 1..9 }     "I can't remember" list (higher = asked more)
 *   stats    { [countryId]: { name|capital|location: { seen, ok, ko } } }
 */
import { CONFIG } from '../config.js';
import { clamp } from './utils.js';

const localStorageAdapter = {
  load() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || null; } catch { return null; }
  },
  save(state) {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state)); } catch { /* full or blocked */ }
  },
};

const HARD_START_WEIGHT = 3;

function defaultState() {
  return {
    v: 1,
    lang: /^fr\b/i.test(navigator.language || '') ? 'fr' : 'en',
    prefs: { display: 'gray', names: true, setup: null },
    known: {},
    hard: {},
    stats: {},
  };
}

function withDefaults(saved) {
  const base = defaultState();
  if (!saved || typeof saved !== 'object') return base;
  return { ...base, ...saved, prefs: { ...base.prefs, ...(saved.prefs || {}) } };
}

let adapter = localStorageAdapter;
let state = withDefaults(adapter.load());

function save() { adapter.save(state); }

export const Store = {
  /** Swap the persistence backend (see top of file). */
  setAdapter(newAdapter) { adapter = newAdapter; state = withDefaults(adapter.load()); save(); },

  /* language & preferences */
  lang: () => state.lang,
  setLang(lang) { state.lang = lang; save(); },
  pref: key => state.prefs[key],
  setPref(key, value) { state.prefs[key] = value; save(); },

  /* "I know this country" */
  isKnown: id => Boolean(state.known[id]),
  setKnown(id, on) {
    if (on) { state.known[id] = Date.now(); delete state.hard[id]; } else delete state.known[id];
    save();
  },
  knownIds: () => Object.keys(state.known),

  /* "I can't remember this one" — simple spaced repetition */
  isHard: id => id in state.hard,
  setHard(id, on) {
    if (on) { state.hard[id] = Math.max(state.hard[id] || 0, HARD_START_WEIGHT); delete state.known[id]; } else delete state.hard[id];
    save();
  },
  /** Add several countries at once; returns how many were new. */
  addHardMany(ids) {
    let added = 0;
    for (const id of ids) {
      if (!(id in state.hard)) { state.hard[id] = HARD_START_WEIGHT; delete state.known[id]; added++; }
    }
    save();
    return added;
  },
  hardWeight: id => state.hard[id] || 0,
  /** A correct answer lowers how often it is asked; a miss raises it. */
  updateHardWeight(id, correct) {
    if (!(id in state.hard)) return;
    state.hard[id] = clamp(state.hard[id] + (correct ? -1 : 2), 1, 9);
    save();
  },
  hardIds: () => Object.keys(state.hard),

  /* answer statistics */
  recordAnswer(id, subject, correct) {
    const perCountry = state.stats[id] || (state.stats[id] = {});
    const s = perCountry[subject] || (perCountry[subject] = { seen: 0, ok: 0, ko: 0 });
    s.seen++;
    if (correct) s.ok++; else s.ko++;
    save();
  },
  allStats: () => state.stats,

  /** Erase progress but keep language and display preferences. */
  reset() {
    const keep = { lang: state.lang, prefs: state.prefs };
    state = { ...defaultState(), ...keep };
    save();
  },
};
