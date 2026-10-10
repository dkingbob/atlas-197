/**
 * All the facts known about a country, as clues for the Facts game, in the
 * current language, with the country's name hidden.
 *
 * Sources, from hardest to easiest clue ("tier"):
 *   tier 1  numbers few people know (median age, forests, time zone…)       data/facts/stats.js
 *           historical facts                                               data/facts/history-*.js
 *   tier 2  size, population, highest point, independence, big city…       stats.js
 *           the country's history summary and key facts                     data/countries/*.js
 *   tier 3  give-aways: neighbours, anthem, currency, languages, phone code, web domain
 *
 *   factsFor(country, { neighbors })  → [{ key, text, tier, kind }]
 *   answerClue(country, guess)        → the clue that gives it away (capital, or country)
 *   MASK                              → the marker that replaces the names in `text`
 *                                       (country, its people, its capital)
 */
import { COUNTRY_BY_ID } from '../data/countries/index.js';
import { STATS } from '../data/facts/stats.js';
import { HISTORY } from '../data/facts/history.js';
import { lang, countryName, capitalName } from '../i18n/i18n.js';

export const MASK = '⁣?⁣'; // invisible separators around "?" — rendered as a blank by the UI

/* ---------- formatting ---------- */
const locale = () => (lang() === 'fr' ? 'fr-FR' : 'en-GB');
const num = (n, digits = 0) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits }).format(n);
const roundTo = (n, step) => Math.round(n / step) * step;

function people(n) {
  const fr = lang() === 'fr';
  if (n >= 1e9) return fr ? `${num(n / 1e9, 2)} milliard${n >= 2e9 ? 's' : ''}` : `${num(n / 1e9, 2)} billion`;
  if (n >= 1e6) return fr ? `${num(n / 1e6, 1)} million${n >= 2e6 ? 's' : ''}` : `${num(n / 1e6, 1)} million`;
  if (n >= 1e4) return num(roundTo(n, 1000));
  return num(roundTo(n, 100));
}
const ordinal = n => (lang() === 'fr' ? (n === 1 ? '1er' : `${n}e`) : `${n}${[, 'st', 'nd', 'rd'][(n % 100 >> 3) ^ 1 && n % 10] || 'th'}`);
const listOf = items => new Intl.ListFormat(locale(), { type: 'conjunction' }).format(items);
const dayMonth = ({ d, m }) => new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(Date.UTC(2001, m - 1, d));
const nameOfId = id => (COUNTRY_BY_ID.get(id) ? countryName(COUNTRY_BY_ID.get(id)) : null);

/** Display name of a currency / language code, in the current language (falls back to English). */
function displayName(type, code, english) {
  try {
    const name = new Intl.DisplayNames([lang()], { type, fallback: 'none' }).of(code);
    if (name && name.toLowerCase() !== code.toLowerCase()) return name;
  } catch { /* unknown code */ }
  return english;
}

/** Former rulers that are not countries any more. */
const FORMER = {
  USSR: { en: 'the Soviet Union', fr: 'l’Union soviétique' },
  SOVIET_RUSSIA: { en: 'Soviet Russia', fr: 'la Russie soviétique' },
  YUGOSLAVIA: { en: 'Yugoslavia', fr: 'la Yougoslavie' },
  SERBIA_MONTENEGRO: { en: 'Serbia and Montenegro', fr: 'la Serbie-et-Monténégro' },
  OTTOMAN: { en: 'the Ottoman Empire', fr: 'l’Empire ottoman' },
  BRITISH_INDIA: { en: 'British India', fr: 'l’Inde britannique' },
};
const formerName = key => FORMER[key]?.[lang()] || nameOfId(key);

const COLOR_NAMES = {
  'sky blue': 'bleu ciel', 'light blue': 'bleu clair', 'dark blue': 'bleu foncé', blue: 'bleu', white: 'blanc', red: 'rouge',
  green: 'vert', yellow: 'jaune', black: 'noir', orange: 'orange', gold: 'or', maroon: 'bordeaux', crimson: 'cramoisi',
  purple: 'violet', brown: 'marron', silver: 'argent', gray: 'gris', grey: 'gris', turquoise: 'turquoise',
};
const colorName = c => (lang() === 'fr' ? COLOR_NAMES[c] || c : c);

/* ---------- templates: [tier, test(stats), en(s), fr(s)] ---------- */
const T = (en, fr) => () => (lang() === 'fr' ? fr() : en());
const STAT_FACTS = {
  medianAge: [1, s => s.medianAge, s => T(() => `Half of the people are younger than ${num(s.medianAge, 1)} years.`, () => `La moitié des habitants a moins de ${num(s.medianAge, 1)} ans.`)],
  lifeExpectancy: [1, s => s.lifeExpectancy, s => T(() => `Life expectancy at birth is about ${num(s.lifeExpectancy, 1)} years.`, () => `L’espérance de vie à la naissance est d’environ ${num(s.lifeExpectancy, 1)} ans.`)],
  fertility: [1, s => s.fertility, s => T(() => `Women have ${num(s.fertility, 1)} children on average.`, () => `Les femmes ont en moyenne ${num(s.fertility, 1)} enfants.`)],
  urban: [1, s => s.urban, s => T(() => `${num(s.urban, 0)}% of the people live in towns and cities.`, () => `${num(s.urban, 0)} % des habitants vivent en ville.`)],
  forest: [1, s => s.forest !== undefined, s => (s.forest < 1
    ? T(() => 'There is almost no forest at all.', () => 'Il n’y a presque aucune forêt.')
    : T(() => `Forests cover ${num(s.forest, 0)}% of the land.`, () => `Les forêts couvrent ${num(s.forest, 0)} % du territoire.`))],
  meanElevation: [1, s => s.meanElevation, s => T(() => `Its average altitude is ${num(s.meanElevation)} m.`, () => `Son altitude moyenne est de ${num(s.meanElevation)} m.`)],
  gdp: [1, s => s.gdpPerCapita, s => T(() => `Wealth per person (GDP per capita): about $${num(roundTo(s.gdpPerCapita, 100))}.`, () => `Richesse par habitant (PIB par habitant) : environ ${num(roundTo(s.gdpPerCapita, 100))} $.`)],
  utc: [1, s => s.utc, s => T(() => `The capital's time zone is UTC${s.utc}.`, () => `Le fuseau horaire de la capitale est UTC${s.utc}.`)],
  anthemYear: [1, s => s.anthemYear, s => T(() => `Its national anthem was adopted in ${s.anthemYear}.`, () => `Son hymne national a été adopté en ${s.anthemYear}.`)],
  borders: [1, s => s.borderKm !== undefined, s => (s.borderKm === 0
    ? T(() => 'It has no land border with any other country.', () => 'Il n’a aucune frontière terrestre avec un autre pays.')
    : T(() => `Its land borders measure ${num(s.borderKm)} km in total.`, () => `Ses frontières terrestres mesurent ${num(s.borderKm)} km au total.`))],
  exportPartner: [1, s => s.exportPartner && nameOfId(s.exportPartner), s => T(() => `Its biggest export customer is ${nameOfId(s.exportPartner)}.`, () => `Son premier client à l’exportation est : ${nameOfId(s.exportPartner)}.`)],

  population: [2, s => s.population, s => T(() => `About ${people(s.population)} people live here (${ordinal(s.populationRank)} in the world).`, () => `Environ ${people(s.population)} d’habitants (${ordinal(s.populationRank)} rang mondial).`)],
  area: [2, s => s.area, s => T(() => `Its area is ${num(s.area < 10 ? s.area : roundTo(s.area, s.area > 1e5 ? 1000 : 1), 2)} km², the ${ordinal(s.areaRank)} largest country.`, () => `Sa superficie est de ${num(s.area < 10 ? s.area : roundTo(s.area, s.area > 1e5 ? 1000 : 1), 2)} km² : ${ordinal(s.areaRank)} plus grand pays du monde.`)],
  highest: [2, s => s.highest, s => (s.highest.name
    ? T(() => `Its highest point is ${s.highest.name} (${num(s.highest.m)} m).`, () => `Son point culminant est ${s.highest.name} (${num(s.highest.m)} m).`)
    : T(() => `Its highest point is only ${num(s.highest.m)} m above sea level.`, () => `Son point culminant ne dépasse pas ${num(s.highest.m)} m d’altitude.`))],
  coast: [2, s => s.coastline !== undefined, s => (s.landlocked || s.coastline === 0
    ? T(() => 'It is landlocked: no coastline at all.', () => 'Il est enclavé : aucun accès à la mer.')
    : T(() => `Its coastline is ${num(s.coastline)} km long.`, () => `Son littoral mesure ${num(s.coastline)} km.`))],
  independence: [2, s => s.independence, s => (s.independenceFrom && formerName(s.independenceFrom)
    ? T(() => `It became independent from ${formerName(s.independenceFrom)} in ${s.independence}.`, () => `Il est devenu indépendant de ${formerName(s.independenceFrom)} en ${s.independence}.`)
    : T(() => `It became independent in ${s.independence}.`, () => `Il est devenu indépendant en ${s.independence}.`))],
  nationalDay: [2, s => s.nationalDay, s => T(() => `Its national day is on ${dayMonth(s.nationalDay)}.`, () => `Sa fête nationale a lieu le ${dayMonth(s.nationalDay)}.`)],
  city: [2, s => s.cities?.length, s => T(() => `${s.cities[0]} is one of its big cities (not the capital).`, () => `${s.cities[0]} est l’une de ses grandes villes (pas la capitale).`)],

  colors: [3, s => s.colors?.length, s => T(() => `Its national colours are ${listOf(s.colors.map(colorName))}.`, () => `Ses couleurs nationales sont : ${listOf(s.colors.map(colorName))}.`)],
  anthem: [3, s => s.anthem, s => T(() => `Its national anthem is called “${s.anthem}”.`, () => `Son hymne national s’appelle « ${s.anthem} ».`)],
  currency: [3, s => s.currencies?.length, s => T(
    () => `Money used: ${listOf(s.currencies.map(c => displayName('currency', c.code, c.en)))}.`,
    () => `Monnaie : ${listOf(s.currencies.map(c => displayName('currency', c.code, c.en)))}.`)],
  languages: [3, s => s.languages?.length, s => T(
    () => `Official language${s.languages.length > 1 ? 's' : ''}: ${listOf(s.languages.slice(0, 5).map(l => displayName('language', l.code, l.en)))}.`,
    () => `Langue${s.languages.length > 1 ? 's' : ''} officielle${s.languages.length > 1 ? 's' : ''} : ${listOf(s.languages.slice(0, 5).map(l => displayName('language', l.code, l.en)))}.`)],
  calling: [3, s => s.calling, s => T(() => `Its international phone code is ${s.calling}.`, () => `Son indicatif téléphonique est le ${s.calling}.`)],
  tld: [3, s => s.tld, s => T(() => `Its internet domain is “${s.tld}”.`, () => `Son domaine internet est « ${s.tld} ».`)],
};

/* ---------- name hiding ---------- */
const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const maskCache = new Map();

/** Every word that would give the country away: names, aliases, demonyms (EN + FR). */
function maskPattern(c) {
  if (maskCache.has(c.id)) return maskCache.get(c.id);
  const s = STATS[c.id] || {};
  // the capital is hidden too: it is a clue of its own (the last one)
  const words = [c.name.en, c.name.fr, ...(c.aliases || []), ...(s.demonyms?.en || []), ...(s.demonyms?.fr || []),
    c.capital.en, c.capital.fr, ...(c.capitalAliases || [])]
    .filter(w => w && w.length > 2)
    .sort((a, b) => b.length - a.length);
  const variants = words.flatMap(w => [w, w.replace(/^(the|le|la|les|l’|l')\s*/i, '')]).filter(Boolean);
  // name, plural/feminine endings, possessive ("Japan's", "Japanese", "Japonaises")
  const pattern = new RegExp(`(?<![\\p{L}])(?:${[...new Set(variants)].map(escapeRegex).join('|')})(?:e?s)?(?:['’]s)?(?![\\p{L}])`, 'giu');
  maskCache.set(c.id, pattern);
  return pattern;
}

export const maskNames = (text, c) => text.replace(maskPattern(c), MASK);

/* ---------- the pool ---------- */
const letters = text => (text.split(MASK).join('').match(/\p{L}/gu) || []).length;
const sentences = text => (text.match(/[^.!?]+(?:[.!?]+|$)/g) || []).map(x => x.trim()).filter(x => x.length > 25);

/**
 * @param c          country
 * @param neighbors  ids of the land neighbours (from the map)
 * @returns [{ key, text, tier, kind: 'stat'|'history'|'key' }]  text is masked
 */
export function factsFor(c, { neighbors = [] } = {}) {
  const L = lang();
  const s = STATS[c.id] || {};
  const facts = [];
  const seen = new Set();
  const add = (key, tier, kind, text) => {
    if (!text) return;
    const masked = maskNames(text, c);
    if (seen.has(masked)) return; // same sentence from two sources
    if (masked !== text && letters(masked) < 16) return; // nothing left once the name is hidden ("Language: ?")
    seen.add(masked);
    facts.push({ key, tier, kind, text: masked });
  };

  for (const [key, [tier, has, make]] of Object.entries(STAT_FACTS)) {
    if (has(s)) add(key, tier, 'stat', make(s)());
  }
  if (neighbors.length) {
    add('neighborCount', 2, 'stat', L === 'fr'
      ? `Il a ${neighbors.length} pays voisin${neighbors.length > 1 ? 's' : ''} par la terre.`
      : `It shares a land border with ${neighbors.length} countr${neighbors.length > 1 ? 'ies' : 'y'}.`);
    add('neighbors', 3, 'stat', (L === 'fr' ? 'Ses voisins : ' : 'Its neighbours: ')
      + listOf(neighbors.map(nameOfId).filter(Boolean).sort((a, b) => a.localeCompare(b, L))) + '.');
  }
  (HISTORY[c.id]?.[L] || []).forEach((text, i) => add('hist' + i, 1, 'history', text));
  sentences(c.history?.[L] || '').forEach((text, i) => add('summary' + i, 2, 'history', text));
  (c.keyFacts?.[L] || []).forEach((text, i) => add('key' + i, i === 2 ? 2 : 3, 'key', text));
  return facts;
}

/** The fact that gives the answer away (used as the very last clue). */
export function answerClue(c, guess) {
  if (guess === 'capital') return { key: 'name', tier: 4, kind: 'answer', text: (lang() === 'fr' ? 'Le pays est : ' : 'The country is ') + countryName(c) + '.' };
  return { key: 'capital', tier: 4, kind: 'answer', text: (lang() === 'fr' ? 'Sa capitale est ' : 'Its capital is ') + capitalName(c) + '.' };
}
