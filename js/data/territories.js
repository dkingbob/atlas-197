/**
 * Places drawn on the map that are NOT quizzable countries.
 *
 * TERRITORIES  dependent / disputed territories, matched by their name in the
 *              world-atlas map file (`mapName`, plus optional `mapNameAlts`). `sov` = id of the sovereign country.
 * SPLITS       overseas parts cut out of a country's shape and shown as territories
 *              (each part is picked by the lon/lat box its polygons fall in).
 * MERGES       map shapes merged into a UN-recognised country.
 * SKIP_FEATURES shapes not drawn at all.
 */
export const TERRITORIES = [
  { mapName: 'Åland', en: 'Åland Islands', fr: 'Îles Åland', code: 'ax', sov: 'FI', cont: 'EUR' },
  { mapName: 'American Samoa', en: 'American Samoa', fr: 'Samoa américaines', code: 'as', sov: 'US', cont: 'OCE' },
  { mapName: 'Anguilla', en: 'Anguilla', fr: 'Anguilla', code: 'ai', sov: 'GB', cont: 'NAM' },
  { mapName: 'Aruba', en: 'Aruba', fr: 'Aruba', code: 'aw', sov: 'NL', cont: 'NAM' },
  { mapName: 'Ashmore and Cartier Is.', en: 'Ashmore and Cartier Islands', fr: 'Îles Ashmore-et-Cartier', code: null, sov: 'AU', cont: 'OCE' },
  { mapName: 'Bermuda', en: 'Bermuda', fr: 'Bermudes', code: 'bm', sov: 'GB', cont: 'NAM' },
  { mapName: 'Br. Indian Ocean Ter.', en: 'British Indian Ocean Territory', fr: "Territoire britannique de l'océan Indien", code: 'io', sov: 'GB', cont: 'ASI' },
  { mapName: 'British Virgin Is.', en: 'British Virgin Islands', fr: 'Îles Vierges britanniques', code: 'vg', sov: 'GB', cont: 'NAM' },
  { mapName: 'Cayman Is.', en: 'Cayman Islands', fr: 'Îles Caïmans', code: 'ky', sov: 'GB', cont: 'NAM' },
  { mapName: 'Cook Is.', en: 'Cook Islands', fr: 'Îles Cook', code: 'ck', sov: 'NZ', cont: 'OCE' },
  { mapName: 'Curaçao', en: 'Curaçao', fr: 'Curaçao', code: 'cw', sov: 'NL', cont: 'NAM' },
  { mapName: 'Faeroe Is.', en: 'Faroe Islands', fr: 'Îles Féroé', code: 'fo', sov: 'DK', cont: 'EUR', mapNameAlts: ['Faroe Is.', 'Faroe Islands'] },
  { mapName: 'Falkland Is.', en: 'Falkland Islands', fr: 'Îles Malouines', code: 'fk', sov: 'GB', cont: 'SAM' },
  { mapName: 'Fr. Polynesia', en: 'French Polynesia', fr: 'Polynésie française', code: 'pf', sov: 'FR', cont: 'OCE' },
  { mapName: 'Fr. S. Antarctic Lands', en: 'French Southern Lands', fr: 'Terres australes françaises', code: 'tf', sov: 'FR', cont: 'AFR' },
  { mapName: 'Greenland', en: 'Greenland', fr: 'Groenland', code: 'gl', sov: 'DK', cont: 'NAM' },
  { mapName: 'Guam', en: 'Guam', fr: 'Guam', code: 'gu', sov: 'US', cont: 'OCE' },
  { mapName: 'Guernsey', en: 'Guernsey', fr: 'Guernesey', code: 'gg', sov: 'GB', cont: 'EUR' },
  { mapName: 'Heard I. and McDonald Is.', en: 'Heard and McDonald Islands', fr: 'Îles Heard-et-MacDonald', code: 'hm', sov: 'AU', cont: 'OCE' },
  { mapName: 'Hong Kong', en: 'Hong Kong', fr: 'Hong Kong', code: 'hk', sov: 'CN', cont: 'ASI' },
  { mapName: 'Indian Ocean Ter.', en: 'Christmas & Cocos Islands', fr: 'Îles Christmas et Cocos', code: 'cx', sov: 'AU', cont: 'ASI' },
  { mapName: 'Isle of Man', en: 'Isle of Man', fr: 'Île de Man', code: 'im', sov: 'GB', cont: 'EUR' },
  { mapName: 'Jersey', en: 'Jersey', fr: 'Jersey', code: 'je', sov: 'GB', cont: 'EUR' },
  { mapName: 'Macao', en: 'Macao', fr: 'Macao', code: 'mo', sov: 'CN', cont: 'ASI', mapNameAlts: ['Macau'] },
  { mapName: 'Montserrat', en: 'Montserrat', fr: 'Montserrat', code: 'ms', sov: 'GB', cont: 'NAM' },
  { mapName: 'N. Mariana Is.', en: 'Northern Mariana Islands', fr: 'Îles Mariannes du Nord', code: 'mp', sov: 'US', cont: 'OCE' },
  { mapName: 'New Caledonia', en: 'New Caledonia', fr: 'Nouvelle-Calédonie', code: 'nc', sov: 'FR', cont: 'OCE' },
  { mapName: 'Niue', en: 'Niue', fr: 'Niue', code: 'nu', sov: 'NZ', cont: 'OCE' },
  { mapName: 'Norfolk Island', en: 'Norfolk Island', fr: 'Île Norfolk', code: 'nf', sov: 'AU', cont: 'OCE' },
  { mapName: 'Pitcairn Is.', en: 'Pitcairn Islands', fr: 'Îles Pitcairn', code: 'pn', sov: 'GB', cont: 'OCE' },
  { mapName: 'Puerto Rico', en: 'Puerto Rico', fr: 'Porto Rico', code: 'pr', sov: 'US', cont: 'NAM' },
  { mapName: 'S. Geo. and the Is.', en: 'South Georgia & S. Sandwich Is.', fr: 'Géorgie du Sud-et-les îles Sandwich du Sud', code: 'gs', sov: 'GB', cont: 'SAM' },
  { mapName: 'Saint Helena', en: 'Saint Helena', fr: 'Sainte-Hélène', code: 'sh', sov: 'GB', cont: 'AFR' },
  { mapName: 'Sint Maarten', en: 'Sint Maarten', fr: 'Saint-Martin (Pays-Bas)', code: 'sx', sov: 'NL', cont: 'NAM' },
  { mapName: 'St-Barthélemy', en: 'Saint Barthélemy', fr: 'Saint-Barthélemy', code: 'bl', sov: 'FR', cont: 'NAM' },
  { mapName: 'St-Martin', en: 'Saint Martin', fr: 'Saint-Martin', code: 'mf', sov: 'FR', cont: 'NAM' },
  { mapName: 'St. Pierre and Miquelon', en: 'Saint Pierre and Miquelon', fr: 'Saint-Pierre-et-Miquelon', code: 'pm', sov: 'FR', cont: 'NAM' },
  { mapName: 'Turks and Caicos Is.', en: 'Turks and Caicos Islands', fr: 'Îles Turques-et-Caïques', code: 'tc', sov: 'GB', cont: 'NAM' },
  { mapName: 'U.S. Virgin Is.', en: 'U.S. Virgin Islands', fr: 'Îles Vierges des États-Unis', code: 'vi', sov: 'US', cont: 'NAM' },
  { mapName: 'W. Sahara', en: 'Western Sahara', fr: 'Sahara occidental', code: null, sov: null, cont: 'AFR', disputed: true },
  { mapName: 'Wallis and Futuna Is.', en: 'Wallis and Futuna', fr: 'Wallis-et-Futuna', code: 'wf', sov: 'FR', cont: 'OCE' },
  { mapName: 'Siachen Glacier', en: 'Siachen Glacier', fr: 'Glacier de Siachen', code: null, sov: null, cont: 'ASI', disputed: true },
];

/* Overseas parts cut out of a country's shape and shown as territories */
export const SPLITS = {
  FR: [
    { en: 'French Guiana', fr: 'Guyane', code: 'gf', sov: 'FR', cont: 'SAM', box: [-56, 1, -50, 7] },
    { en: 'Guadeloupe', fr: 'Guadeloupe', code: 'gp', sov: 'FR', cont: 'NAM', box: [-62, 15.8, -60.9, 16.6] },
    { en: 'Martinique', fr: 'Martinique', code: 'mq', sov: 'FR', cont: 'NAM', box: [-61.4, 14.3, -60.7, 15] },
    { en: 'Réunion', fr: 'La Réunion', code: 're', sov: 'FR', cont: 'AFR', box: [55, -21.5, 56, -20.8] },
    { en: 'Mayotte', fr: 'Mayotte', code: 'yt', sov: 'FR', cont: 'AFR', box: [44.9, -13.1, 45.4, -12.5] },
  ],
};

/* Map features merged into a UN-recognised country */
export const MERGES = { 'N. Cyprus': 'CY', 'Somaliland': 'SO' };
/* Not drawn */
export const SKIP_FEATURES = ['Antarctica'];
