/**
 * Flags mode (a flag pops up, write the country), endless & custom question
 * counts in the classic games, and the game memory / backup.
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp, baseConfig } from './helpers.mjs';

let server, url, browser, page, errors;

before(async () => {
  ({ server, url } = await startServer());
  ({ browser, page, errors } = await openApp(url, { fastTimers: true }));
});
after(async () => { await browser?.close(); server?.close(); });

const peek = () => page.evaluate(() => FlagQuiz.peek());
const nameOf = id => page.evaluate(i => COUNTRY_BY_ID.get(i).name.en, id);
async function type(text) {
  await page.fill('#fq-card input', text);
  await page.press('#fq-card input', 'Enter');
}
async function waitNext(id) { await page.waitForFunction(i => { const p = FlagQuiz.peek(); return !p || p.over || p.id !== i; }, id); }

test('practice: retry, letters, show answer, endless', async () => {
  await page.evaluate(() => FlagQuiz.start({ style: 'practice', conts: ['EUR'], levels: [1], letters: false, count: 20 }));
  await page.waitForSelector('#fq-card.show .fq-flag img');
  let p = await peek();
  assert.equal(await page.$('.fq-letters'), null);
  await page.click('#fq-card [data-act="letters"]');
  const boxes = await page.$$eval('.fq-letters b:not(.sym)', els => els.length);
  assert.equal(boxes, (await nameOf(p.id)).replace(/[^\p{L}]/gu, '').length);

  await type('zzzzzz');
  assert.equal((await peek()).id, p.id, 'retry allowed in practice');
  await type(await nameOf(p.id));
  await waitNext(p.id);

  p = await peek();
  await page.click('#fq-card [data-act="reveal"]');
  assert.ok((await page.textContent('.fq-answer')).includes(await nameOf(p.id)));
  await page.click('#fq-card form button.btn-primary'); // Next
  await waitNext(p.id);

  for (let i = 0; i < 40; i++) { // more than the 35 easy countries: endless
    p = await peek();
    await type(await nameOf(p.id));
    await waitNext(p.id);
  }
  assert.ok((await peek()).index >= 40);
  await page.click('#fq-hud [data-act="quit"]');
  await page.waitForSelector('#flags-end-modal.open');
  await page.click('#flags-end-modal [data-act="back"]');
  assert.equal(await peek(), null);
});

test('game: 3 lives, 1 hint, wrong answer costs a life', async () => {
  await page.evaluate(() => FlagQuiz.start({ style: 'game', conts: ['AFR'], levels: [1, 2, 3, 4, 5], letters: false, count: 10 }));
  await page.waitForSelector('#fq-card.show');
  const p = await peek();
  await page.click('#fq-card [data-act="hint"]');
  const first = await page.textContent('.fq-letters b');
  assert.equal(first, (await nameOf(p.id))[0].toUpperCase());
  assert.ok(await page.$eval('#fq-card [data-act="hint"]', b => b.disabled), 'only one hint');
  for (let i = 0; i < 3; i++) {
    const q = await peek();
    await type('zzzzzz');
    await page.waitForFunction(id => { const x = FlagQuiz.peek(); return !x || x.over || x.id !== id; }, q.id);
  }
  await page.waitForSelector('#flags-end-modal.open');
  assert.match(await page.textContent('#flags-end-modal h2'), /lives/i);
  await page.click('#flags-end-modal [data-act="back"]');
});

test('endless classic game: no game over, ✓ ends it with results', async () => {
  await page.evaluate(c => Game.start(c), baseConfig({ count: -1, subject: 'name', answer: 'mc', filters: { conts: ['OCE'], levels: [1, 2, 3, 4, 5], excluded: [], excludeKnown: false, onlyHard: false } }));
  for (let i = 0; i < 20; i++) { // 14 countries in Oceania → it keeps going; always answer wrong
    await page.waitForSelector('#qcard.show .q-opt:not([disabled])');
    const id = await page.evaluate(() => Game.isActive() && document.querySelector('#map .target')?.getAttribute('data-key'));
    assert.ok(id, `question ${i} shown`);
    const wrongIndex = await page.evaluate(() => {
      const target = MapView.recordByKey(document.querySelector('#map .target').getAttribute('data-key'));
      return [...document.querySelectorAll('#qcard .q-opt')].findIndex(b => !b.textContent.includes(countryName(target.country)));
    });
    await page.click(`#qcard .q-opt >> nth=${wrongIndex}`);
    await page.waitForTimeout(450);
  }
  assert.ok(await page.evaluate(() => Game.isActive()), 'still playing after 20 wrong answers');
  await page.click('#hud [data-act="quit"]');
  await page.waitForSelector('#end-modal.open');
  assert.match(await page.textContent('#end-modal'), /Endless/);
  await page.click('#end-modal [data-act="back"]');
});

test('custom question count', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="world"]');
  await page.click('#setup-modal [data-act="custom-count"]');
  await page.fill('#setup-modal .count-input', '7');
  await page.click('#start-btn');
  await page.waitForSelector('#hud');
  assert.match(await page.textContent('#hud'), /\/7/);
  await page.click('#hud [data-act="quit"]');
});

test('game memory: next games start with what was not asked recently; clear & backup', async () => {
  await page.evaluate(() => Store.clearAsked());
  const order1 = await page.evaluate(() => {
    const ids = COUNTRIES.filter(c => c.continent === 'SAM').map(c => c.id);
    ids.slice(0, 6).forEach(id => Store.markAsked(id));
    return ids;
  });
  const first = await page.evaluate(() => import('./js/game/pool.js').then(m => m.freshOrder(COUNTRIES.filter(c => c.continent === 'SAM')).map(c => c.id)));
  assert.deepEqual(new Set(first.slice(0, 6)), new Set(order1.slice(6)), 'never-asked countries come first');

  await page.click('#nav [data-nav="progress"]');
  assert.match(await page.textContent('#progress-modal'), /Game memory: 6/);
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#progress-modal [data-act="backup"]')]);
  const backupPath = await download.path();
  await page.click('#progress-modal [data-act="clear-asked"]');
  await page.click('#confirm-modal [data-act="yes"]');
  assert.match(await page.textContent('#progress-modal'), /Game memory: 0/);
  await page.setInputFiles('#progress-modal input[type=file]', backupPath);
  await page.waitForFunction(() => /Game memory: 6/.test(document.getElementById('progress-modal').textContent));
  await page.keyboard.press('Escape');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
