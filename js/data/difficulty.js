/**
 * Difficulty level of every country (how hard it is to recognise from its
 * flag and place on the map), from 1 (easy) to 5 (very hard, only a few).
 * Harder countries are worth more points in every game mode.
 *
 * To move a country, cut its id from one list and paste it into another —
 * tests/data.test.mjs checks that all 197 appear exactly once.
 */
export const LEVELS = {
  1: ['US', 'CA', 'MX', 'BR', 'AR', 'GB', 'IE', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'CH', 'SE', 'NO', 'FI',
    'DK', 'PL', 'GR', 'RU', 'UA', 'TR', 'CN', 'JP', 'KR', 'IN', 'AU', 'NZ', 'EG', 'ZA', 'SA', 'IL', 'CU'],

  2: ['CL', 'CO', 'PE', 'VE', 'AT', 'CZ', 'HU', 'RO', 'HR', 'IS', 'RS', 'BG', 'SK', 'SI', 'EE', 'LV', 'LT', 'BY',
    'IR', 'IQ', 'PK', 'AF', 'TH', 'VN', 'ID', 'PH', 'MY', 'SG', 'KP', 'MA', 'DZ', 'TN', 'NG', 'KE', 'ET', 'GH',
    'JM', 'AE', 'QA', 'KZ', 'MN', 'NP', 'SY', 'LB', 'JO'],

  3: ['EC', 'BO', 'UY', 'PY', 'PA', 'CR', 'GT', 'HN', 'NI', 'SV', 'DO', 'HT', 'BS', 'LU', 'MT', 'CY', 'MC', 'AD',
    'LI', 'SM', 'VA', 'AL', 'MK', 'ME', 'BA', 'MD', 'GE', 'AM', 'AZ', 'UZ', 'BD', 'LK', 'MM', 'KH', 'LA', 'TW',
    'KW', 'BH', 'OM', 'YE', 'PS', 'LY', 'SD', 'SN', 'CM', 'CD', 'CI', 'TZ', 'UG', 'ZW', 'ZM', 'AO', 'MZ', 'MG',
    'SO', 'NA', 'BW', 'ML', 'RW'],

  4: ['XK', 'TM', 'KG', 'TJ', 'BN', 'TL', 'MV', 'NE', 'TD', 'BF', 'BJ', 'TG', 'LR', 'SL', 'GN', 'GM', 'MR', 'ER',
    'DJ', 'SS', 'CF', 'CG', 'GA', 'BI', 'MW', 'LS', 'CV', 'MU', 'SC', 'BZ', 'GY', 'SR', 'TT', 'BB', 'GD', 'LC',
    'FJ', 'PG', 'SB', 'WS', 'TO', 'VU', 'BT'],

  5: ['TV', 'NR', 'KI', 'MH', 'FM', 'PW', 'ST', 'KM', 'SZ', 'GQ', 'GW', 'KN', 'VC', 'AG', 'DM'],
};

/** Points for a correct answer, by level. */
export const LEVEL_POINTS = { 1: 10, 2: 15, 3: 20, 4: 30, 5: 50 };

export const LEVEL_NAMES = {
  1: { en: 'Easy', fr: 'Facile' },
  2: { en: 'Medium', fr: 'Moyen' },
  3: { en: 'Hard', fr: 'Difficile' },
  4: { en: 'Expert', fr: 'Expert' },
  5: { en: 'Very hard', fr: 'Très difficile' },
};

export const LEVEL_IDS = [1, 2, 3, 4, 5];

const LEVEL_BY_ID = new Map();
for (const [level, ids] of Object.entries(LEVELS)) ids.forEach(id => LEVEL_BY_ID.set(id, Number(level)));

/** Level of a country id (3 if unknown). */
export const levelOf = id => LEVEL_BY_ID.get(id) || 3;
/** Points a country is worth. */
export const pointsFor = id => LEVEL_POINTS[levelOf(id)];
