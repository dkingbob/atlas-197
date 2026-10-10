/**
 * Typed-answer checking: forgiving spelling, never the wrong country.
 * Runs in plain Node. Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Answers } from '../js/core/answers.js';
import { COUNTRY_BY_ID } from '../js/data/countries/index.js';
import { WATERS } from '../js/data/waters.js';

const c = id => COUNTRY_BY_ID.get(id);
const w = id => WATERS.find(x => x.id === id);

const ACCEPTED = [
  // exact, aliases, accents, case
  ['FR', 'france'], ['DE', 'Allemagne'], ['CI', 'cote divoire'], ['CI', 'Ivory Coast'], ['US', 'usa'],
  ['US', 'Etats-Unis'], ['NL', 'holland'], ['GB', 'royaume uni'], ['LC', 'st lucia'], ['VC', 'Saint Vincent'],
  // typos
  ['DE', 'germny'], ['SE', 'sweeden'], ['AF', 'afganistan'], ['AZ', 'azerbajan'], ['MZ', 'mozambik'],
  ['KZ', 'kazakstan'], ['VE', 'venezuala'], ['CO', 'columbia'], ['PH', 'phillipines'],
  // sounds right (English / French habits)
  ['PH', 'filipines'], ['DJ', 'djibuti'], ['DJ', 'jibouti'], ['CH', 'swizerland'], ['UZ', 'ouzbekistan'],
  ['KG', 'kirgistan'], ['GH', 'gana'], ['FJ', 'fidgi'], ['KW', 'kouwait'], ['TH', 'tailand'], ['QA', 'katar'],
  ['IQ', 'irak'], ['CZ', 'tcheckie'], ['MY', 'malaisia'], ['NI', 'nikaragua'], ['ZW', 'zimbabwey'],
  ['GE', 'jeorgia'], ['SY', 'sirie'], ['CY', 'siprus'], ['KH', 'kambodia'], ['HU', 'ungary'],
];

const REJECTED = [
  ['NG', 'niger'], ['NE', 'nigeria'], ['IQ', 'iran'], ['IR', 'iraq'], ['AU', 'austria'], ['AT', 'australia'],
  ['GM', 'zambia'], ['ZM', 'gambia'], ['SK', 'slovenia'], ['SI', 'slovakia'], ['ML', 'malawi'], ['MW', 'mali'],
  ['GN', 'guyana'], ['GY', 'guinea'], ['DO', 'dominica'], ['SS', 'sudan'], ['FR', 'finland'], ['PE', 'peru brazil'],
  ['CA', 'cuba'], ['IN', 'indonesia'], ['ID', 'india'], ['DE', 'denmark'], ['FR', 'x'], ['BR', 'zzzzzz'],
];

test('accepts misspellings and sound-alike spellings', () => {
  for (const [id, typed] of ACCEPTED) assert.ok(Answers.isCountry(typed, c(id)), `${typed} → ${id}`);
});

test('never accepts a different country', () => {
  for (const [id, typed] of REJECTED) assert.ok(!Answers.isCountry(typed, c(id)), `${typed} must not count for ${id}`);
});

test('capitals', () => {
  assert.ok(Answers.isCapital('bogota', c('CO')));
  assert.ok(Answers.isCapital('Pékin', c('CN')));
  assert.ok(Answers.isCapital('la paz', c('BO')));
  assert.ok(Answers.isCapital('kyiv', c('UA')));
  assert.ok(Answers.isCapital('ouagadougu', c('BF')));
  assert.ok(Answers.isCapital('copenhaguen', c('DK')));
  assert.ok(!Answers.isCapital('Sydney', c('AU')));
  assert.ok(!Answers.isCapital('Kingstown', c('JM')), 'Kingstown is St Vincent, not Kingston');
});

test('oceans and seas', () => {
  assert.ok(Answers.isWater('pacific', w('pacific')));
  assert.ok(Answers.isWater('Océan Pacifique', w('pacific')));
  assert.ok(Answers.isWater('mer mediterranee', w('mediterranean')));
  assert.ok(Answers.isWater('meditteranean', w('mediterranean')));
  assert.ok(!Answers.isWater('Atlantic', w('pacific')));
});

test('every country accepts all of its own names and aliases', async () => {
  const { COUNTRIES } = await import('../js/data/countries/index.js');
  const failures = [];
  for (const country of COUNTRIES) {
    for (const name of [country.name.en, country.name.fr, ...(country.aliases || [])]) {
      if (!Answers.isCountry(name, country)) failures.push(`${country.id}: ${name}`);
    }
    for (const name of [country.capital.en, country.capital.fr, ...(country.capitalAliases || [])]) {
      if (!Answers.isCapital(name, country)) failures.push(`${country.id} capital: ${name}`);
    }
  }
  assert.deepEqual(failures, []);
});
