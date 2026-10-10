/**
 * Builds js/data/facts/stats.js — numbers and names for the Facts game,
 * from two public datasets:
 *   CIA World Factbook (public domain)      https://github.com/factbook/factbook.json
 *   mledoze/countries (ODbL)                https://github.com/mledoze/countries
 *
 * Usage (from the repo root):
 *   git clone --depth 1 https://github.com/factbook/factbook.json /tmp/factbook
 *   git clone --depth 1 https://github.com/mledoze/countries /tmp/countries
 *   node tools/build-stats.mjs /tmp/factbook /tmp/countries
 *
 * Only language-neutral data is kept (numbers, dates, codes, proper names);
 * the sentences are written in js/game/facts-pool.js in both languages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { COUNTRIES } from '../js/data/countries/index.js';
import { normalize } from '../js/core/utils.js';

const [FACTBOOK, MLEDOZE] = process.argv.slice(2);
if (!FACTBOOK || !MLEDOZE) { console.error('usage: node tools/build-stats.mjs <factbook dir> <countries dir>'); process.exit(1); }

const FILE_OF = JSON.parse(fs.readFileSync(new URL('./factbook-map.json', import.meta.url)));
FILE_OF.VA = 'europe/vt.json';
delete FILE_OF.PS; // the Factbook splits it into West Bank and Gaza Strip

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const COLORS = ['sky blue', 'light blue', 'dark blue', 'blue', 'white', 'red', 'green', 'yellow', 'black', 'orange', 'gold', 'maroon', 'crimson', 'purple', 'brown', 'silver', 'gray', 'grey', 'turquoise'];

/** "(from …)" texts that are not one of our countries → a key translated in facts-pool.js, or a country id. */
const FORMER_RULERS = [
  [/^Soviet Russia/i, 'SOVIET_RUSSIA'], [/^Soviet Union/i, 'USSR'], [/^Yugoslavia/i, 'YUGOSLAVIA'],
  [/Serbia and Montenegro/i, 'SERBIA_MONTENEGRO'], [/^Ottoman Empire/i, 'OTTOMAN'], [/^British India/i, 'BRITISH_INDIA'],
  [/^Malaysian Federation/i, 'MY'], [/^(UK|federation of UK)/i, 'GB'], [/^US administration/i, 'US'],
  [/^South African mandate/i, 'ZA'], [/British administration/i, 'GB'], [/French administration|^French-administered/i, 'FR'],
  [/^Belgi/i, 'BE'], [/^Australia-administered/i, 'AU'], [/^New Zealand-administered/i, 'NZ'], [/^US-administered/i, 'US'],
];
/** Short, well-known names for some cities (Factbook uses metro-area names). */
const CITY_NAMES = {
  'New York-Newark': 'New York', 'Los Angeles-Long Beach-Santa Ana': 'Los Angeles', 'Marseille-Aix-en-Provence': 'Marseille',
  'Tel Aviv-Yafo': 'Tel Aviv', 'Kitakyushu-Fukuoka': 'Fukuoka', 'Shizuoka-Hamamatsu': 'Shizuoka', 'Dallas-Fort Worth': 'Dallas',
  'Blantyre-Limbe': 'Blantyre', 'Sekondi Takoradi': 'Sekondi-Takoradi', "Bur Sa'id": 'Port Said', Mombassa: 'Mombasa',
  Hims: 'Homs', Esfahan: 'Isfahan', Shimkent: 'Shymkent', Valparaiso: 'Valparaíso', Concepcion: 'Concepción', Medellin: 'Medellín',
  Krakow: 'Kraków', Fes: 'Fez',
};
/** Capitals that are not in the Factbook coordinates. */
const CAPITAL_LONLAT = { NR: [166.92, -0.55], PS: [35.23, 31.78] };
/** No independence fact (the Factbook date is misleading for these). */
const NO_INDEPENDENCE = new Set(['RU', 'JP', 'GB', 'FR', 'CN', 'TH', 'NP', 'IR', 'ET', 'SA', 'DE', 'TR', 'DK', 'SE', 'AD', 'SM', 'CH', 'ES', 'PT', 'NL', 'AT']);

/* ---------- helpers ---------- */
const decode = s => String(s || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(ldquo|rdquo|quot);/g, '"').replace(/&(rsquo|lsquo|#39);/g, "'")
  .replace(/&([a-z])(acute|grave|circ|uml|tilde|cedil|ring);/gi, (m, l, mark) => l.normalize('NFD') + { acute: '́', grave: '̀', circ: '̂', uml: '̈', tilde: '̃', cedil: '̧', ring: '̊' }[mark.toLowerCase()])
  .replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').normalize('NFC')
  .replace(/\s+/g, ' ').trim();
const text = node => (node && typeof node === 'object' && 'text' in node ? decode(node.text) : null);
const number = s => {
  if (!s) return null;
  const m = String(s).match(/(-?[\d,.]+)\s*(million|billion)?/i);
  if (!m) return null;
  let n = Number(m[1].replace(/,/g, ''));
  if (m[2]?.toLowerCase() === 'million') n *= 1e6;
  if (m[2]?.toLowerCase() === 'billion') n *= 1e9;
  return Number.isFinite(n) ? n : null;
};
const firstText = obj => (obj ? text(Object.values(obj).find(v => v && typeof v === 'object' && 'text' in v)) : null);

/** Country name (as written in the Factbook) → our id. */
const ID_BY_NAME = new Map();
for (const c of COUNTRIES) [c.name.en, ...(c.aliases || [])].forEach(n => ID_BY_NAME.set(normalize(n), c.id));
Object.entries({ US: 'USA', GB: 'UK', AE: 'UAE', KR: 'South Korea', KP: 'North Korea', CD: 'Democratic Republic of the Congo', CG: 'Republic of the Congo', NL: 'Netherlands', CZ: 'Czechia', TR: 'Turkey', CI: "Cote d'Ivoire", BA: 'Bosnia and Herzegovina', MM: 'Burma', SZ: 'Swaziland', CV: 'Cabo Verde', TL: 'Timor-Leste' })
  .forEach(([id, name]) => ID_BY_NAME.set(normalize(name), id));
const idOf = name => ID_BY_NAME.get(normalize(String(name).replace(/^the /i, ''))) || null;

/** "48 52 N, 2 20 E" → [lon, lat] */
function coords(s) {
  const m = s && s.match(/(\d+)\s+(\d+)\s*([NS]),\s*(\d+)\s+(\d+)\s*([EW])/);
  if (!m) return null;
  const lat = (+m[1] + m[2] / 60) * (m[3] === 'S' ? -1 : 1);
  const lon = (+m[4] + m[5] / 60) * (m[6] === 'W' ? -1 : 1);
  return [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100];
}

/** "UTC+5.75" → "+5:45" */
function utc(s) {
  const m = s && s.match(/UTC\s*([+-−])\s*([\d.]+)/);
  if (!m) return s && /UTC\s*0?\b/.test(s) ? '+0' : null;
  const hours = Number(m[2]);
  const h = Math.floor(hours), min = Math.round((hours - h) * 60);
  return `${m[1] === '-' || m[1] === '−' ? '-' : '+'}${h}${min ? ':' + String(min).padStart(2, '0') : ''}`;
}

/** "Mount Everest (highest peak in Asia…) 8,849 m" → { name, m } */
function peak(s) {
  if (!s) return null;
  const m = s.replace(/\([^)]*\)/g, '').trim().match(/^(.*?)\s+(-?[\d,]+)\s*m?$/);
  if (!m || /unnamed/i.test(m[1])) return m ? { name: null, m: number(m[2]) } : null;
  return { name: m[1].replace(/\s+/g, ' ').trim(), m: number(m[2]) };
}

/** "11.208 million PARIS (capital), 1.761 million Lyon, …" → ['Lyon', …] (capital left out) */
function cities(s) {
  if (!s) return [];
  return s.replace(/\(\d{4}\)\s*$/, '').split(/,(?![^()]*\))/)
    .map(x => x.trim())
    .filter(x => !/\(capital\)/i.test(x))
    .map(x => x.replace(/^[\d.,]+\s*(million|thousand)?\s*/i, '').replace(/\s*\(.*\)$/, '').trim())
    .filter(x => x && x.length < 40 && !/[\d;]/.test(x) && x !== x.toUpperCase()) // capitals are written in CAPITALS
    .map(x => CITY_NAMES[x] || x);
}

/* ---------- mledoze ---------- */
const MLEDOZE_BY_ID = new Map(JSON.parse(fs.readFileSync(path.join(MLEDOZE, 'countries.json'))).map(c => [c.cca2, c]));

/** The Factbook describes Palestine as two entries: West Bank + Gaza Strip. */
function palestineStats() {
  const wb = JSON.parse(fs.readFileSync(path.join(FACTBOOK, 'middle-east/we.json')));
  const gz = JSON.parse(fs.readFileSync(path.join(FACTBOOK, 'middle-east/gz.json')));
  const pop = d => number(text(d['People and Society']?.Population?.total));
  const area = d => number(text(d.Geography?.Area?.['total ']) || text(d.Geography?.Area?.total));
  return {
    population: pop(wb) + pop(gz),
    area: area(wb) + area(gz),
    coastline: number(text(gz.Geography?.Coastline)),
    highest: peak(text(wb.Geography?.Elevation?.['highest point'])),
    utc: utc(text(wb.Government?.Capital?.['time difference']) || 'UTC+2'),
  };
}

/* ---------- build ---------- */
const stats = {};
for (const c of COUNTRIES) {
  const s = {};
  const m = MLEDOZE_BY_ID.get(c.id);
  if (m) {
    s.currencies = Object.entries(m.currencies || {}).map(([code, v]) => ({ code, en: v.name }));
    s.languages = Object.entries(m.languages || {}).map(([code, en]) => ({ code, en }));
    if (m.idd?.root) s.calling = m.idd.root + (m.idd.suffixes?.length === 1 ? m.idd.suffixes[0] : '');
    if (s.calling?.length < 3 && c.id !== 'US') delete s.calling; // e.g. Vatican: several codes
    s.tld = m.tld?.[0];
    s.landlocked = Boolean(m.landlocked);
    s.demonyms = { en: [...new Set(Object.values(m.demonyms?.eng || {}))], fr: [...new Set(Object.values(m.demonyms?.fra || {}))] };
  }
  const file = FILE_OF[c.id];
  if (file) {
    const d = JSON.parse(fs.readFileSync(path.join(FACTBOOK, file)));
    const geo = d.Geography || {}, ppl = d['People and Society'] || {}, gov = d.Government || {}, eco = d.Economy || {};

    s.population = number(text(ppl.Population?.total) || text(ppl.Population));
    s.area = number(text(geo.Area?.['total ']) || text(geo.Area?.total));
    if (!s.area || s.area < 1) s.area = number(text(geo.Area?.land));
    const coast = text(geo.Coastline);
    s.coastline = coast ? number(coast) : null;
    const elev = geo.Elevation || {};
    s.highest = peak(text(elev['highest point']));
    s.meanElevation = number(text(elev['mean elevation']));
    s.borderKm = number(text(geo['Land boundaries']?.total));
    s.forest = number(text(geo['Land use']?.forest));

    s.medianAge = number(text(ppl['Median age']?.total));
    s.lifeExpectancy = number(text(ppl['Life expectancy at birth']?.['total population']));
    s.fertility = number(text(ppl['Total fertility rate']));
    s.urban = number(text(ppl.Urbanization?.['urban population']));
    s.cities = cities(text(ppl['Major urban areas - population']));

    const indep = text(gov.Independence);
    const from = indep && indep.match(/\(from ([^)]+)\)/);
    if (from && !NO_INDEPENDENCE.has(c.id)) {
      const year = indep.match(/\b(1\d{3}|20\d{2})\b/);
      if (year) s.independence = Number(year[1]);
      const ruler = from[1].replace(/^the /i, '').trim();
      s.independenceFrom = idOf(ruler.split(/ and |;|,/)[0]) || FORMER_RULERS.find(([re]) => re.test(ruler))?.[1];
    }
    const holiday = text(gov['National holiday']);
    const date = holiday && holiday.match(/(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)/i);
    if (date) s.nationalDay = { d: Number(date[1]), m: MONTHS.indexOf(date[2].toLowerCase()) + 1 };

    const anthem = gov['National anthem(s)'] || gov['National anthem'];
    const title = text(anthem?.title) || text(anthem?.name);
    if (title) {
      const q = title.match(/["“]([^"”]+)["”]/);
      s.anthem = (q ? q[1] : title.split('(')[0]).trim();
    }
    const anthemHistory = text(anthem?.history) || text(anthem?.note);
    const adopted = anthemHistory && anthemHistory.match(/adopted (\d{4})/);
    if (adopted) s.anthemYear = Number(adopted[1]);

    const colors = text(gov['National color(s)']);
    if (colors) s.colors = COLORS.filter(col => new RegExp(`\\b${col}\\b`, 'i').test(colors)).filter((col, i, all) => !all.some(o => o !== col && o.endsWith(' ' + col)));

    const capital = gov.Capital || {};
    s.capitalLonLat = coords(text(capital['geographic coordinates']));
    const capitalNames = [c.capital.en, c.capital.fr].map(normalize);
    if (s.cities) s.cities = s.cities.filter(x => !capitalNames.includes(normalize(x)));
    s.utc = utc(text(capital['time difference']));

    const gdp = firstText(eco['Real GDP per capita']);
    if (gdp) s.gdpPerCapita = number(gdp.replace('$', ''));
    const partner = text(eco['Exports - partners']);
    if (partner) {
      const top = partner.split(',')[0].replace(/\s+\d+%.*$/, '').trim();
      s.exportPartner = idOf(top);
    }
  }
  if (c.id === 'PS') Object.assign(s, palestineStats());
  if (CAPITAL_LONLAT[c.id]) s.capitalLonLat = CAPITAL_LONLAT[c.id];
  for (const k of Object.keys(s)) if (s[k] === null || s[k] === undefined || (Array.isArray(s[k]) && !s[k].length)) delete s[k];
  stats[c.id] = s;
}

// size rank among the 197 (1 = largest)
const byArea = COUNTRIES.filter(c => stats[c.id].area).sort((a, b) => stats[b.id].area - stats[a.id].area);
byArea.forEach((c, i) => { stats[c.id].areaRank = i + 1; });
const byPopulation = COUNTRIES.filter(c => stats[c.id].population).sort((a, b) => stats[b.id].population - stats[a.id].population);
byPopulation.forEach((c, i) => { stats[c.id].populationRank = i + 1; });

const header = `/**
 * GENERATED by tools/build-stats.mjs — do not edit by hand.
 * Sources: CIA World Factbook (public domain), mledoze/countries (ODbL).
 * Used by the Facts game (js/game/facts-pool.js) and the capital pin game.
 */
`;
fs.mkdirSync('js/data/facts', { recursive: true });
fs.writeFileSync('js/data/facts/stats.js', header + 'export const STATS = ' + JSON.stringify(stats, null, 0).replace(/\},"/g, '},\n"') + ';\n');
const missing = COUNTRIES.filter(c => !stats[c.id].capitalLonLat).map(c => c.id);
console.log('countries', Object.keys(stats).length, 'no capital coords:', missing.join(' '));
