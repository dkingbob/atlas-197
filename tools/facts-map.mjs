/**
 * Finds which CIA World Factbook file describes each of our countries and
 * writes tools/factbook-map.json (used by build-stats.mjs).
 *   node tools/facts-map.mjs /tmp/factbook
 */
import fs from 'node:fs'; import path from 'node:path';
import { COUNTRIES } from '../js/data/countries/index.js';
import { normalize } from '../js/core/utils.js';
const FB = process.argv[2];
const files = [];
for (const region of fs.readdirSync(FB)) {
  const dir = path.join(FB, region);
  if (!fs.statSync(dir).isDirectory() || ['meta', 'oceans', 'antarctica'].includes(region)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) files.push(path.join(dir, f));
}
const t = o => o?.text?.replace(/<[^>]+>/g, '').trim();
const fbByName = new Map();
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(f));
  const cn = d.Government?.['Country name'] || {};
  for (const k of ['conventional short form', 'conventional long form', 'local short form', 'former']) {
    const v = t(cn[k]); if (v && v !== 'none') v.split(/;|,/).forEach(x => fbByName.set(normalize(x), f));
  }
  fbByName.set(normalize(path.basename(f, '.json')), fbByName.get(normalize(path.basename(f)))); 
}
const out = {}; const missing = [];
for (const c of COUNTRIES) {
  const f = [c.name.en, ...(c.aliases || [])].map(n => fbByName.get(normalize(n))).find(Boolean);
  if (f) out[c.id] = path.relative(FB, f); else missing.push(c.id + ' ' + c.name.en);
}
console.log(Object.keys(out).length, 'missing', missing);
fs.writeFileSync('tools/factbook-map.json', JSON.stringify(out, null, 0));
