/* global d3, topojson */
/**
 * Turns the world-atlas TopoJSON into "map records" — one per drawn place.
 * No DOM work here: map-view.js creates the SVG elements from these records.
 *
 * A record looks like:
 *   key           unique id used in the DOM (data-key)
 *   kind          'country' | 'territory'
 *   id            country id ('FR') — null for territories
 *   country       country data object (countries only)
 *   territory     territory info object (territories only)
 *   continent     continent id
 *   flagCode      flag image code, or null
 *   feature       GeoJSON shape (null if the map file has no shape, e.g. Tuvalu)
 *   mainShape     largest polygon of the shape (used for label, zoom box and flag fit)
 *   areaKm2       area of the whole shape
 *   labelLonLat   where the name label goes
 *   markerLonLat  where the clickable circle goes (small places only)
 *   isSmall       true → also gets a clickable marker circle
 *   neighbors     ids of the countries sharing a land border (countries only)
 */
import { CONFIG } from '../config.js';
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries/index.js';
import { TERRITORIES, SPLITS, MERGES, SKIP_FEATURES } from '../data/territories.js';
import { normalize } from '../core/utils.js';
import { polylabel } from './polylabel.js';

const EARTH_RADIUS_KM = 6371;
const SMALL_TERRITORY_KM2 = 3000;

export function buildMapRecords(topology) {
  const records = [];
  const add = rec => { rec.key = 'r' + records.length; records.push(describe(rec)); };

  // name lookups (all names normalised: accents, case and punctuation ignored)
  const countryByMapName = new Map();
  COUNTRIES.forEach(c => [c.name.en, ...(c.mapNames || [])].forEach(n => countryByMapName.set(normalize(n), c)));
  const territoryByMapName = new Map();
  TERRITORIES.forEach(t => [t.mapName, ...(t.mapNameAlts || [])].forEach(n => territoryByMapName.set(normalize(n), t)));
  const mergeInto = new Map(Object.entries(MERGES).map(([name, id]) => [normalize(name), id]));
  const skipped = new Set(SKIP_FEATURES.map(normalize));

  // 1. Sort every map shape into a country (possibly several shapes) or a territory
  const shapesByCountry = new Map();
  const territoryShapes = [];
  const geometries = topology.objects.countries.geometries;
  const countryOfShape = new Array(geometries.length).fill(null);
  geometries.forEach((geometry, index) => {
    const name = normalize(geometry.properties?.name);
    if (skipped.has(name)) return;
    const country = countryByMapName.get(name) || COUNTRY_BY_ID.get(mergeInto.get(name));
    if (country) {
      countryOfShape[index] = country.id;
      if (!shapesByCountry.has(country.id)) shapesByCountry.set(country.id, []);
      shapesByCountry.get(country.id).push(geometry);
    } else {
      territoryShapes.push(geometry);
    }
  });
  const neighborsOf = landNeighbors(topology, countryOfShape);

  // 2. Countries (merged shapes are dissolved into one outline)
  for (const country of COUNTRIES) {
    const shapes = shapesByCountry.get(country.id);
    let feature = null;
    if (shapes) {
      feature = shapes.length === 1
        ? topojson.feature(topology, shapes[0])
        : { type: 'Feature', properties: {}, geometry: topojson.merge(topology, shapes) };
      if (SPLITS[country.id]) feature = splitOverseasParts(feature, SPLITS[country.id], add);
    }
    add({
      kind: 'country', id: country.id, country, continent: country.continent,
      flagCode: country.id.toLowerCase(), feature, fixedLonLat: country.markerAt,
      neighbors: neighborsOf.get(country.id) || [],
    });
  }

  // 3. Territories
  for (const geometry of territoryShapes) {
    const name = geometry.properties?.name;
    const territory = territoryByMapName.get(normalize(name))
      || { en: name, fr: name, code: null, sov: null, cont: null };
    add({
      kind: 'territory', id: null, territory, continent: territory.cont,
      flagCode: territory.code, feature: topojson.feature(topology, geometry),
    });
  }
  return records;
}

/**
 * Countries sharing a border, from the shared arcs of the TopoJSON.
 * Borders reached only through an overseas part (France ↔ Brazil via
 * French Guiana) are left out.
 */
function landNeighbors(topology, countryOfShape) {
  const adjacency = topojson.neighbors(topology.objects.countries.geometries);
  const result = new Map();
  adjacency.forEach((list, index) => {
    const id = countryOfShape[index];
    if (!id) return;
    const set = result.get(id) || new Set();
    for (const other of list) {
      const otherId = countryOfShape[other];
      if (!otherId || otherId === id) continue;
      if (SPLITS[id] || SPLITS[otherId]) {
        if (COUNTRY_BY_ID.get(id).continent !== COUNTRY_BY_ID.get(otherId).continent) continue;
      }
      set.add(otherId);
    }
    result.set(id, set);
  });
  return new Map([...result].map(([id, set]) => [id, [...set]]));
}

/** Cut overseas parts out of a country (e.g. French Guiana out of France). */
function splitOverseasParts(feature, parts, add) {
  const geom = feature.geometry;
  const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  const keep = [];
  const cut = parts.map(() => []);
  for (const polygon of polygons) {
    const [x, y] = ringMean(polygon[0]);
    const i = parts.findIndex(p => x >= p.box[0] && x <= p.box[2] && y >= p.box[1] && y <= p.box[3]);
    (i >= 0 ? cut[i] : keep).push(polygon);
  }
  parts.forEach((territory, i) => {
    if (!cut[i].length) return;
    add({
      kind: 'territory', id: null, territory, continent: territory.cont, flagCode: territory.code,
      feature: { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: cut[i] } },
    });
  });
  return { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: keep } };
}

/** Fill in geometry-derived fields (see the record description at the top). */
function describe(rec) {
  if (rec.feature) {
    const main = largestPolygon(rec.feature.geometry);
    rec.mainShape = { type: 'Feature', geometry: { type: 'Polygon', coordinates: main } };
    rec.areaKm2 = d3.geoArea(rec.feature) * EARTH_RADIUS_KM ** 2;
    rec.labelLonLat = rec.fixedLonLat || labelPoint(main);
  } else {
    rec.areaKm2 = 0;
    rec.labelLonLat = rec.fixedLonLat;
  }
  rec.markerLonLat = rec.fixedLonLat || rec.labelLonLat;
  const smallLimit = rec.kind === 'territory' ? SMALL_TERRITORY_KM2 : CONFIG.SMALL_AREA_KM2;
  rec.isSmall = !rec.feature || rec.areaKm2 < smallLimit;
  rec.revealed = false;
  rec.dimmed = false;
  return rec;
}

function largestPolygon(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates;
  let best = null, bestArea = -1;
  for (const polygon of geometry.coordinates) {
    const area = d3.geoArea({ type: 'Polygon', coordinates: polygon });
    if (area > bestArea) { bestArea = area; best = polygon; }
  }
  return best;
}

/** Label spot in lon/lat: polylabel on a plane where longitude is scaled by cos(latitude). */
function labelPoint(polygon) {
  const [, meanLat] = ringMean(polygon[0]);
  const kx = Math.cos(meanLat * Math.PI / 180) || 1;
  const [x, y] = polylabel(polygon.map(ring => ring.map(([lon, lat]) => [lon * kx, lat])));
  return [x / kx, y];
}

function ringMean(ring) {
  let x = 0, y = 0;
  for (const p of ring) { x += p[0]; y += p[1]; }
  return [x / ring.length, y / ring.length];
}
