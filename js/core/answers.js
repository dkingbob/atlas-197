/**
 * Checks typed answers.
 *
 * Accepted: English or French name, any alias, any case, with or without accents,
 * and small typos (1 letter for names of 5+ letters, 2 for 10+).
 * Never accepted: the exact name of a DIFFERENT country/capital/sea
 * (so "Niger" is wrong for Nigeria even though it is close).
 */
import { COUNTRIES } from '../data/countries/index.js';
import { WATERS } from '../data/waters.js';
import { normalize, levenshtein } from './utils.js';

/** normalised name → set of country ids that use it */
function buildIndex(namesOf) {
  const index = new Map();
  for (const c of COUNTRIES) {
    for (const name of namesOf(c)) {
      const key = normalize(name);
      if (!key) continue;
      if (!index.has(key)) index.set(key, new Set());
      index.get(key).add(c.id);
    }
  }
  return index;
}

const countryNames = c => [c.name.en, c.name.fr, ...(c.aliases || [])];
const capitalNames = c => [c.capital.en, c.capital.fr, ...(c.capitalAliases || [])];
const COUNTRY_INDEX = buildIndex(countryNames);
const CAPITAL_INDEX = buildIndex(capitalNames);

function typoTolerance(length, longThreshold = 10) {
  if (length >= longThreshold) return 2;
  if (length >= 5) return 1;
  return 0;
}

function matches(input, candidates, index, ownId) {
  const typed = normalize(input);
  if (!typed) return false;
  const wanted = candidates.map(normalize).filter(Boolean);
  if (wanted.includes(typed)) return true;
  if (index.has(typed) && !index.get(typed).has(ownId)) return false; // it's another place's exact name
  return wanted.some(w => {
    const tol = typoTolerance(w.length);
    return tol > 0 && Math.abs(w.length - typed.length) <= tol && levenshtein(w, typed) <= tol;
  });
}

/* Water names: compare without generic words ("Pacific" = "Pacific Ocean" = "Océan Pacifique") */
const GENERIC_WATER_WORDS = /\b(ocean|oceano|sea|gulf|bay|of|the|mer|de|du|des|la|le|golfe|baie|d)\b/g;
const waterCore = s => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/['’]/g, ' ').replace(GENERIC_WATER_WORDS, ' ').replace(/[^a-z0-9]/g, '');
const waterNames = w => [w.en, w.fr, ...(w.alt || [])];

export const Answers = {
  isCountry: (input, country) => matches(input, countryNames(country), COUNTRY_INDEX, country.id),
  isCapital: (input, country) => matches(input, capitalNames(country), CAPITAL_INDEX, country.id),
  isWater(input, water) {
    const typed = waterCore(input);
    if (!typed) return false;
    const wanted = waterNames(water).map(waterCore).filter(Boolean);
    if (wanted.includes(typed)) return true;
    const isOtherWater = WATERS.some(o => o !== water && waterNames(o).map(waterCore).includes(typed));
    if (isOtherWater) return false;
    return wanted.some(w => {
      const tol = typoTolerance(w.length, 9);
      return tol > 0 && levenshtein(w, typed) <= tol;
    });
  },
};
