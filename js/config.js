/**
 * App-wide constants. Tweak gameplay and map behaviour here.
 */

export const CONFIG = {
  /** World map (Natural Earth 1:50m via the world-atlas package). */
  MAP_URL: 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json',
  /** SVG flag for an ISO alpha-2 code. */
  flagUrl: code => `https://flagcdn.com/${String(code).toLowerCase()}.svg`,

  DEFAULT_CENTER: 10,      // central meridian of the world view (°E)
  PACIFIC_CENTER: 150,     // central meridian used when playing Oceania only
  SMALL_AREA_KM2: 12000,   // countries smaller than this also get a clickable marker
  MAX_ZOOM: 80,

  LIVES: 3,                // per game
  HINTS: 1,                // per game
  SKIPS: 1,                // per game

  STORAGE_KEY: 'atlas197.v1',
  /** Official address. Progress is saved per address, so other addresses start empty. */
  HOME_URL: 'https://atlas-197.vercel.app/',

  /**
   * Accounts (Supabase). Paste the values from Supabase › Project Settings › API.
   * The anon key is meant to be public: the database rules (supabase/schema.sql)
   * are what protect each player's data. Empty = accounts turned off.
   */
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  SUPABASE_JS_URL: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.97.0',

  /** Party (multiplayer): WebRTC library, loaded only when a party is opened. */
  PEERJS_URL: 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js',
  PARTY_MAX_PLAYERS: 4,
  PARTY_COUNTDOWN_S: 3,
};

/**
 * Continents used for grouping, filters and "continent quiz" zoom.
 * `view` is the lon/lat box the map zooms to.
 */
export const CONTINENTS = {
  AFR: { en: 'Africa',        fr: 'Afrique',          view: [[-20, -36], [55, 38]] },
  ASI: { en: 'Asia',          fr: 'Asie',             view: [[26, -11], [148, 54]] },
  EUR: { en: 'Europe',        fr: 'Europe',           view: [[-25, 34], [45, 71]] },
  NAM: { en: 'North America', fr: 'Amérique du Nord', view: [[-168, 7], [-52, 72]] },
  SAM: { en: 'South America', fr: 'Amérique du Sud',  view: [[-82, -56], [-34, 13]] },
  OCE: { en: 'Oceania',       fr: 'Océanie',          view: [[110, -48], [196, 10]] },
};

export const CONTINENT_IDS = ['AFR', 'ASI', 'EUR', 'NAM', 'SAM', 'OCE'];
