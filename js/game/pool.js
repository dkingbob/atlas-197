/**
 * Which countries a game draws its questions from.
 *
 * Game settings ("config") shape, shared by the setup dialog and the engine:
 *   mode       'world' | 'continent' | 'oceans' | 'flagmatch' | 'learn' | 'hard'
 *   subject    'name' | 'capital' | 'location'
 *   answer     'click' | 'type' | 'mc'        (ignored by flag match)
 *   continent  continent id                  (continent mode only)
 *   count      number of questions, 0 = all
 *   filters    { conts: string[], levels: number[] (1–5), excluded: string[], excludeKnown: boolean, onlyHard: boolean }
 */
import { COUNTRIES } from '../data/countries/index.js';
import { levelOf } from '../data/difficulty.js';
import { Store } from '../core/store.js';

export function buildCountryPool(config) {
  const { filters } = config;
  const excluded = new Set(filters.excluded);
  return COUNTRIES.filter(c => {
    if (config.mode === 'continent') {
      if (c.continent !== config.continent) return false;
    } else if (filters.conts.length && !filters.conts.includes(c.continent)) {
      return false;
    }
    if (excluded.has(c.id)) return false;
    if (filters.levels?.length && !filters.levels.includes(levelOf(c.id))) return false;
    if ((filters.excludeKnown || config.mode === 'learn') && Store.isKnown(c.id)) return false;
    if ((filters.onlyHard || config.mode === 'hard') && !Store.isHard(c.id)) return false;
    return true;
  });
}

/** Key of an item in the game memory (Store.asked). */
export const memoryKey = item => (item.type && !item.continent ? 'w:' + item.id : item.id);

const RECENT_JITTER_MS = 6 * 60 * 60 * 1000;

/**
 * Random order that puts what you have not seen for a while first:
 * never-asked items (in random order), then the ones asked longest ago.
 * A bit of randomness (6 h) mixes items asked around the same time.
 */
export function freshOrder(items, keyOf = memoryKey) {
  return items
    .map(item => ({ item, score: Store.lastAsked(keyOf(item)) + Math.random() * RECENT_JITTER_MS }))
    .sort((a, b) => a.score - b.score)
    .map(x => x.item);
}

/**
 * Hard-list mode: pick the next country, favouring high weights
 * (missed recently) and never repeating the previous question.
 */
export function pickWeighted(pool, previous) {
  const candidates = pool.length > 1 ? pool.filter(c => c !== previous) : pool;
  const total = candidates.reduce((sum, c) => sum + Store.hardWeight(c.id), 0);
  let roll = Math.random() * total;
  for (const c of candidates) {
    roll -= Store.hardWeight(c.id);
    if (roll <= 0) return c;
  }
  return candidates[candidates.length - 1];
}
