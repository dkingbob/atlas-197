/**
 * Translation helpers. The current language is stored in Store.
 *
 *   t('correct', { p: 10 })   → "Correct! +10"
 *   countryName(c)            → name in the current language
 */
import { STRINGS } from './strings.js';
import { CONTINENTS } from '../config.js';
import { Store } from '../core/store.js';
import { fill } from '../core/utils.js';

export const lang = () => Store.lang();

export const t = (key, vars) => fill(STRINGS[lang()]?.[key] ?? STRINGS.en[key] ?? key, vars);

export const countryName = c => c.name[lang()];
export const capitalName = c => c.capital[lang()];
export const waterName = w => w[lang()];
export const continentName = id => CONTINENTS[id]?.[lang()] ?? '';
export const territoryName = info => info[lang()] || info.en;
