/**
 * All 197 quizzable countries: the 193 UN member states
 * plus Palestine, Vatican City, Kosovo and Taiwan.
 * Each continent lives in its own file — edit those, not this one.
 */
import africa from './africa.js';
import asia from './asia.js';
import europe from './europe.js';
import northAmerica from './north-america.js';
import southAmerica from './south-america.js';
import oceania from './oceania.js';

export const COUNTRIES = [...africa, ...asia, ...europe, ...northAmerica, ...southAmerica, ...oceania];

/** Fast lookup: 'FR' → country object */
export const COUNTRY_BY_ID = new Map(COUNTRIES.map(c => [c.id, c]));
