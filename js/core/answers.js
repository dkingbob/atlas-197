/**
 * Checks typed answers — forgiving, but never confuses two places.
 *
 * Accepted:
 *   - English or French name, or any alias ("USA", "Ivory Coast", "Holland"…)
 *   - any case, with or without accents or punctuation
 *   - typos: about 1 wrong letter in 3 (1 for short names)
 *   - spellings that SOUND right in English or French (see phonetic.js):
 *     "Filipines", "Djibuti", "Kazakstan", "Swizerland", "Ouzbekistan"…
 *
 * Safety rule: the answer must be closer to the expected place than to any
 * other one. "Niger" is never accepted for Nigeria, "Zambia" never for Gambia;
 * a tie ("Austrlia" is as close to Austria as to Australia) is rejected.
 */
import { COUNTRIES } from '../data/countries/index.js';
import { WATERS } from '../data/waters.js';
import { normalize, levenshtein } from './utils.js';
import { phoneticKey } from './phonetic.js';

const MAX_RELATIVE_ERROR = 0.34; // share of the name that may be wrong
const MAX_ABSOLUTE_ERROR = 4;

/** Every way of writing one place, pre-normalised. */
function variantsOf(names) {
  return names.filter(Boolean).map(name => ({ plain: normalize(name), sound: phoneticKey(name) }))
    .filter(v => v.plain);
}

const countryNames = c => [c.name.en, c.name.fr, ...(c.aliases || [])];
const capitalNames = c => [c.capital.en, c.capital.fr, ...(c.capitalAliases || [])];
const waterNames = w => [w.en, w.fr, ...(w.alt || [])];

const COUNTRY_VARIANTS = COUNTRIES.map(c => ({ id: c.id, variants: variantsOf(countryNames(c)) }));
const CAPITAL_VARIANTS = COUNTRIES.map(c => ({ id: c.id, variants: variantsOf(capitalNames(c)) }));

/* Water names: generic words are ignored ("Pacific" = "Pacific Ocean" = "Océan Pacifique") */
const GENERIC_WATER_WORDS = /\b(ocean|oceano|sea|gulf|bay|of|the|mer|de|du|des|la|le|golfe|baie|d)\b/g;
const stripWaterWords = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/['’]/g, ' ').replace(GENERIC_WATER_WORDS, ' ');
const WATER_VARIANTS = WATERS.map(w => ({ id: w.id, variants: variantsOf(waterNames(w).map(stripWaterWords)) }));

/**
 * How far the typed text is from one place: 0 = exact, 1 = completely different.
 * Uses the better of the plain-spelling and sound-alike comparisons.
 */
function distance(typed, variants) {
  let best = Infinity;
  for (const v of variants) {
    if (typed.plain === v.plain) return 0;
    const plain = levenshtein(typed.plain, v.plain);
    const sound = typed.sound && v.sound ? levenshtein(typed.sound, v.sound) : Infinity;
    const plainRel = plain / Math.max(v.plain.length, typed.plain.length);
    const soundRel = sound / Math.max(v.sound.length, typed.sound.length, 1);
    const allowedPlain = plain <= MAX_ABSOLUTE_ERROR && (plain <= 1 || plainRel <= MAX_RELATIVE_ERROR);
    const allowedSound = sound <= MAX_ABSOLUTE_ERROR && (sound === 0 || soundRel <= MAX_RELATIVE_ERROR);
    const score = Math.min(allowedPlain ? plainRel : Infinity, allowedSound ? soundRel * 0.9 : Infinity);
    if (score < best) best = score;
  }
  return best;
}

/** True if `input` designates `targetId` (and nothing closer) among `all`. */
function matches(input, targetId, all) {
  const plain = normalize(input);
  if (plain.length < 2) return false;
  const typed = { plain, sound: phoneticKey(input) };
  const target = all.find(x => x.id === targetId);
  if (!target) return false;
  const own = distance(typed, target.variants);
  if (own === 0) return true;
  if (own === Infinity) return false;
  if (plain.length < 4 && own > 0.25) return false; // very short answers must be nearly exact
  for (const other of all) {
    if (other.id === targetId) continue;
    if (distance(typed, other.variants) <= own) return false; // as close or closer to another place
  }
  return true;
}

export const Answers = {
  isCountry: (input, country) => matches(input, country.id, COUNTRY_VARIANTS),
  isCapital: (input, country) => matches(input, country.id, CAPITAL_VARIANTS),
  isWater: (input, water) => matches(stripWaterWords(input), water.id, WATER_VARIANTS),
};
