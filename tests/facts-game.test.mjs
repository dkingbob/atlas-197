/**
 * Facts game in the browser: clues, extra clues, answers by typing,
 * multiple choice and map click, lives, capitals.
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp } from './helpers.mjs';

let server, url, browser, page, errors;

before(async () => {
  ({ server, url } = await startServer());
  ({ browser, page, errors } = await openApp(url, { fastTimers: true }));
});
after(async () => { await browser?.close(); server?.close(); });

const peek = () => page.evaluate(() => Facts.peek());
const ALL = ['AFR', 'ASI', 'EUR', 'NAM', 'SAM', 'OCE'];
async function startFacts(settings) {
  await page.evaluate(s => Facts.start(s), { difficulty: 'normal', guess: 'country', answer: 'type', count: 5, levels: [1, 2, 3, 4, 5], conts: ALL, ...settings });
  await page.waitForSelector('#facts-card.show .fx-list li');
}
async function type(text) {
  await page.fill('#facts-card input', text);
  await page.press('#facts-card input', 'Enter');
}

test('normal: 3 clues, more on demand (points go down), name hidden, typed answer', async () => {
  await startFacts({ count: 3 });
  let p = await peek();
  assert.equal(p.clues, 3);
  const name = await page.evaluate(id => COUNTRY_BY_ID.get(id).name.en, p.id);
  assert.ok(!(await page.textContent('.fx-list')).includes(name), 'name hidden in the clues');
  const before = await page.textContent('.fx-head .r-level');
  await page.click('#facts-card [data-act="clue"]');
  assert.equal((await peek()).clues, 4);
  assert.notEqual(await page.textContent('.fx-head .r-level'), before, 'fewer points after a clue');
  await type(name);
  p = await peek();
  assert.equal(p.result, 'ok');
  assert.ok(p.score > 0);
  assert.ok(await page.$('.fx-answer.ok img'));
  await page.click('#facts-card [data-act="next"]');
  assert.equal((await peek()).revealed, false);
});

test('wrong answers cost lives; 3 wrong ends the game', async () => {
  await startFacts({ count: 10 });
  for (let i = 0; i < 3; i++) {
    await type('zzzzzz');
    assert.equal((await peek()).result, 'bad');
    await page.click('#facts-card [data-act="next"]');
  }
  await page.waitForSelector('#facts-end-modal.open');
  await page.click('#facts-end-modal [data-act="back"]');
  assert.equal(await peek(), null);
});

test('hard: historical clues, capital guess, multiple choice', async () => {
  await startFacts({ difficulty: 'hard', guess: 'capital', answer: 'mc' });
  const p = await peek();
  assert.ok(p.waiting >= 17, `20+ clues in total (${p.clues + p.waiting})`);
  const capital = await page.evaluate(id => COUNTRY_BY_ID.get(id).capital.en, p.id);
  const options = await page.$$eval('#facts-card .q-opt', els => els.map(e => e.textContent));
  const index = options.findIndex(o => o.includes(capital));
  assert.ok(index >= 0, 'capital among the options');
  await page.keyboard.press(String(index + 1));
  assert.equal((await peek()).result, 'ok');
  // last clue gives the country
  await page.click('#facts-card [data-act="next"]');
  while ((await peek()).waiting) await page.click('#facts-card [data-act="clue"]');
  assert.match(await page.textContent('.fx-list li.give'), /The country is/);
  await page.evaluate(() => Facts.stop());
});

test('answer by clicking the map', async () => {
  await startFacts({ answer: 'click', conts: ['EUR'] });
  const p = await peek();
  await page.evaluate(id => Facts.onPlaceClick(MapView.record(id)), p.id);
  assert.equal((await peek()).result, 'ok');
  await page.evaluate(() => Facts.stop());
});

test('setup dialog: Facts mode', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="facts"]');
  await page.click('#setup-modal [data-f-key="difficulty"][data-f-val="hard"]');
  await page.click('#start-btn');
  await page.waitForSelector('#facts-card.show');
  assert.match(await page.textContent('.fx-head'), /Hard/);
  await page.click('#facts-hud [data-act="quit"]');
  await page.click('#facts-end-modal [data-act="back"]');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
