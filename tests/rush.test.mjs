/**
 * Rush (timed) modes, solo: every type can be played, scoring follows the
 * difficulty levels, hints cost points, the clock ends the round.
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp } from './helpers.mjs';

let server, url, browser, page, errors;

before(async () => {
  ({ server, url } = await startServer());
  ({ browser, page, errors } = await openApp(url));
});
after(async () => { await browser?.close(); server?.close(); });

const ALL = ['AFR', 'ASI', 'EUR', 'NAM', 'SAM', 'OCE'];
const peek = () => page.evaluate(() => Rush.peek());

async function startRush(settings) {
  await page.evaluate(s => Rush.start({ settings: s }), { rushMode: 'flag-map', duration: 120, levels: [1, 2, 3, 4, 5], conts: ALL, ...settings });
  await page.waitForSelector('#rush-card.show');
}

async function waitForNext(previousId) {
  await page.waitForFunction(id => { const p = Rush.peek(); return p && (p.over || (p.id && p.id !== id)); }, previousId);
}

/** The text a good player would type for the current question. */
const answerFor = (mode, alternate = false) => page.evaluate(([m, alt]) => {
  const c = COUNTRY_BY_ID.get(Rush.peek().id);
  if (m === 'capital') return alt ? c.capital.fr : c.capital.en;
  return alt ? c.name.fr : c.name.en;
}, [mode, alternate]);

async function typeAnswer(text) {
  await page.fill('#rush-card input', text);
  await page.press('#rush-card input', 'Enter');
}

test('flag on the map: the flag is painted, EN and FR answers score difficulty points', async () => {
  await startRush({ rushMode: 'flag-map', levels: [5] });
  const first = await peek();
  const painted = await page.evaluate(id => {
    const rec = MapView.record(id);
    return Boolean(rec.pathEl?.classList.contains('flagged') || rec.markerEl?.classList.contains('flagged'));
  }, first.id);
  assert.ok(painted, 'current country shows its flag');
  await typeAnswer(await answerFor('flag-map'));
  await waitForNext(first.id);
  let p = await peek();
  assert.equal(p.score, 50, 'level 5 = 50 points');
  await typeAnswer(await answerFor('flag-map', true)); // French name
  await waitForNext(p.id);
  p = await peek();
  assert.equal(p.found, 2);
  assert.equal(p.score, 100);
  await page.evaluate(() => Rush.stop());
});

test('wrong answers can be retried, pass moves on, hints cost points', async () => {
  await startRush({ rushMode: 'flag-only', levels: [1] });
  const first = await peek();
  await typeAnswer('zzzzzz');
  assert.match(await page.textContent('#rush-card .q-feedback'), /.+/);
  assert.equal((await peek()).id, first.id, 'still on the same country');
  await page.click('#rush-card [data-act="hint"]');
  assert.match(await page.textContent('#rush-card .r-hint'), /_/);
  await typeAnswer(await answerFor('flag-only'));
  await waitForNext(first.id);
  assert.equal((await peek()).score, 10 - 4, 'level 1 (10) minus one hint (4)');
  const second = await peek();
  await page.click('#rush-card [data-act="pass"]');
  await waitForNext(second.id);
  assert.equal((await peek()).found, 1);
  await page.evaluate(() => Rush.stop());
});

test('capitals and map hunt', async () => {
  await startRush({ rushMode: 'capital', levels: [1, 2] });
  const first = await peek();
  await typeAnswer(await answerFor('capital'));
  await waitForNext(first.id);
  assert.equal((await peek()).found, 1);
  await page.evaluate(() => Rush.stop());

  await startRush({ rushMode: 'map-hunt', levels: [1], conts: ['EUR'] });
  const target = await peek();
  await page.evaluate(id => Rush.onPlaceClick(MapView.record(id)), target.id);
  await waitForNext(target.id);
  assert.equal((await peek()).found, 1);
  await page.evaluate(() => Rush.stop());
});

test('survival: easy first, three mistakes end the round', async () => {
  await startRush({ rushMode: 'survival' });
  const level = await page.evaluate(() => import('./js/data/difficulty.js').then(m => m.levelOf(Rush.peek().id)));
  assert.equal(level, 1);
  for (let i = 0; i < 3; i++) {
    const p = await peek();
    await typeAnswer('zzzzzz');
    await waitForNext(p.id);
  }
  await page.waitForSelector('#rush-end-modal.open');
  assert.match(await page.textContent('#rush-end-modal h2'), /lives/i);
  await page.click('#rush-end-modal [data-act="back"]');
  assert.equal(await peek(), null);
});

test('the clock ends the round and shows the results', async () => {
  await page.evaluate(() => Rush.start({ settings: { rushMode: 'flag-map', duration: 1, levels: [1], conts: ['EUR'] } }));
  await page.waitForSelector('#rush-end-modal.open', { timeout: 5000 });
  assert.match(await page.textContent('#rush-end-modal h2'), /time/i);
  await page.click('#rush-end-modal [data-act="back"]');
  assert.ok(!(await page.evaluate(() => document.body.classList.contains('in-game'))));
});

test('setup dialog starts a rush with levels', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="rush"]');
  await page.click('#setup-modal [data-val="flag-only"]');
  await page.click('#setup-modal [data-rush-level="5"]'); // add level 5 to the default 1–3
  const pool = await page.textContent('#pool-line');
  assert.match(pool, /\d+/);
  await page.click('#start-btn');
  await page.waitForSelector('#rush-card.show .r-flag img');
  const p = await peek();
  assert.equal(p.mode, 'flag-only');
  await page.click('#rush-hud [data-act="quit"]');
  assert.equal(await peek(), null);
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
