/**
 * Historical facts for the Facts game: 6 per country, in English and French.
 * One file per region; this file joins them.
 *
 *   HISTORY[countryId] = { en: [...], fr: [...] }
 */
import africa from './history-africa.js';
import americas from './history-americas.js';
import asia from './history-asia.js';
import europe from './history-europe.js';
import oceania from './history-oceania.js';

export const HISTORY = { ...africa, ...americas, ...asia, ...europe, ...oceania };
