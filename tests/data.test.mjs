/**
 * Data integrity: every country is complete, ids are unique, texts exist in both languages.
 * Runs in plain Node (no browser). Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COUNTRIES } from '../js/data/countries/index.js';
import { TERRITORIES, SPLITS } from '../js/data/territories.js';
import { WATERS } from '../js/data/waters.js';
import { STRINGS } from '../js/i18n/strings.js';

const CONTINENTS = ['AFR', 'ASI', 'EUR', 'NAM', 'SAM', 'OCE'];
const LANGS = ['en', 'fr'];

test('197 countries: 193 UN members + Palestine, Vatican City, Kosovo, Taiwan', () => {
  assert.equal(COUNTRIES.length, 197);
  for (const id of ['PS', 'VA', 'XK', 'TW']) assert.ok(COUNTRIES.some(c => c.id === id), id);
});

test('ids are unique ISO alpha-2 codes', () => {
  const ids = COUNTRIES.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[A-Z]{2}$/);
});

test('every country has complete EN/FR data', () => {
  for (const c of COUNTRIES) {
    assert.ok(CONTINENTS.includes(c.continent), `${c.id} continent`);
    for (const lang of LANGS) {
      assert.ok(c.name[lang], `${c.id} name.${lang}`);
      assert.ok(c.capital[lang], `${c.id} capital.${lang}`);
      const history = c.history?.[lang] || '';
      const sentences = history.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý«"])/).length;
      assert.ok(sentences >= 3 && sentences <= 5, `${c.id} history.${lang} has ${sentences} sentences`);
      assert.equal(c.keyFacts?.[lang]?.length, 3, `${c.id} keyFacts.${lang}`);
    }
    if (c.markerAt) assert.equal(c.markerAt.length, 2, `${c.id} markerAt`);
  }
});

test('continent counts', () => {
  const count = id => COUNTRIES.filter(c => c.continent === id).length;
  assert.deepEqual(CONTINENTS.map(count), [54, 48, 46, 23, 12, 14]);
});

test('territories and waters have both languages', () => {
  for (const t of [...TERRITORIES, ...Object.values(SPLITS).flat()]) assert.ok(t.en && t.fr, t.en);
  for (const w of WATERS) {
    assert.ok(w.en && w.fr && w.label.length && w.poly.length, w.id);
    assert.ok(['ocean', 'sea'].includes(w.type), w.id);
  }
});

test('UI strings exist in both languages', () => {
  assert.deepEqual(Object.keys(STRINGS.en).sort(), Object.keys(STRINGS.fr).sort());
});

test('difficulty: every country has exactly one level, level 5 is small', async () => {
  const { LEVELS, LEVEL_POINTS, pointsFor } = await import('../js/data/difficulty.js');
  const all = Object.values(LEVELS).flat();
  assert.equal(all.length, 197);
  assert.equal(new Set(all).size, 197);
  for (const c of COUNTRIES) assert.ok(all.includes(c.id), c.id);
  assert.ok(LEVELS[5].length <= 20);
  assert.ok(LEVEL_POINTS[5] > LEVEL_POINTS[1]);
  assert.equal(pointsFor('TV'), LEVEL_POINTS[5]);
});
