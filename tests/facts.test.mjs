/**
 * Facts game data: every country has at least 20 facts in both languages,
 * and the clues never show the name of the country or of its capital.
 * Runs in plain Node (a tiny stand-in for the language setting).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COUNTRIES } from '../js/data/countries/index.js';
import { HISTORY } from '../js/data/facts/history.js';
import { STATS } from '../js/data/facts/stats.js';
import { normalize } from '../js/core/utils.js';
import { Store } from '../js/core/store.js';

const { factsFor, MASK } = await import('../js/game/facts-pool.js');
const languages = ['en', 'fr'];

test('6 historical facts per country, in both languages', () => {
  for (const c of COUNTRIES) {
    const h = HISTORY[c.id];
    assert.ok(h, c.id);
    for (const l of languages) assert.equal(h[l]?.length, 6, `${c.id} ${l}`);
  }
  assert.equal(Object.keys(HISTORY).length, COUNTRIES.length);
});

test('stats exist for every country', () => {
  for (const c of COUNTRIES) assert.ok(STATS[c.id]?.tld, c.id);
});

test('at least 20 facts per country, and hard mode has historical clues', () => {
  for (const l of languages) {
    Store.setLang(l);
    for (const c of COUNTRIES) {
      const facts = factsFor(c, { neighbors: [] });
      assert.ok(facts.length >= 20, `${c.id} ${l}: ${facts.length} facts`);
      assert.ok(facts.filter(f => f.kind === 'history').length >= 6, `${c.id} ${l}`);
      assert.equal(new Set(facts.map(f => f.text)).size, facts.length, `${c.id} ${l}: duplicate fact`);
    }
  }
});

test('clues never give the name away', () => {
  for (const l of languages) {
    Store.setLang(l);
    for (const c of COUNTRIES) {
      const names = [c.name.en, c.name.fr, c.capital.en, c.capital.fr].map(n => normalize(n)).filter(n => n.length > 3);
      for (const f of factsFor(c, { neighbors: [] })) {
        const visible = normalize(f.text.split(MASK).join(' '));
        for (const n of names) {
          assert.ok(!new RegExp(`(^| )${n}( |$)`).test(visible), `${c.id} ${l}: "${f.text}" shows "${n}"`);
        }
      }
    }
  }
});
