/**
 * Capitals button (capital-only games) and the capital pin game.
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

const peek = () => page.evaluate(() => CapitalPin.peek());

test('pin: exact click = full points + right-country bonus, far click = 0', async () => {
  await page.evaluate(() => CapitalPin.start({ count: 3, levels: [1], conts: ['EUR'], showCountry: true }));
  await page.waitForSelector('#pin-card.show .pin-ask');
  let p = await peek();
  const city = await page.evaluate(id => import('./js/data/facts/stats.js').then(m => m.STATS[id].capitalLonLat), p.id);
  await page.evaluate(ll => CapitalPin.pinAt(ll), city);
  p = await peek();
  assert.ok(p.answered);
  assert.ok(p.km < 1);
  assert.equal(p.points, 120);
  assert.equal(await page.$$eval('.fx-layer .fx-pin', els => els.length), 2, 'guess + answer pins');
  await page.click('#pin-card [data-act="next"]');

  await page.evaluate(() => CapitalPin.pinAt([-150, -60])); // middle of the South Pacific
  assert.equal((await peek()).points, 0);
  await page.click('#pin-card [data-act="next"]');
});

test('pin: a real click on the map drops a pin', async () => {
  await page.waitForSelector('#pin-card .pin-ask');
  const box = await page.locator('#map-wrap').boundingBox();
  await page.mouse.click(box.x + box.width * 0.52, box.y + box.height * 0.42);
  const p = await peek();
  assert.ok(p.answered, 'answered by clicking');
  assert.ok(Number.isFinite(p.km));
  await page.click('#pin-card [data-act="next"]');
  await page.waitForSelector('#pin-end-modal.open');
  await page.click('#pin-end-modal [data-act="back"]');
});

test('Capitals button: only capital games, and they are about capitals', async () => {
  await page.click('#nav [data-nav="capitals"]');
  assert.match(await page.textContent('#setup-modal h2'), /Capital games/);
  const modes = await page.$$eval('#setup-modal .modes:first-of-type .mode-card', els => els.map(e => e.dataset.val));
  assert.deepEqual(modes, ['world', 'pin', 'facts', 'rush', 'flagmatch', 'study']);
  // capital quiz: no subject choice, game asks capitals
  await page.click('#setup-modal [data-val="world"]');
  assert.equal(await page.$('#setup-modal [data-set="subject"]'), null);
  await page.click('#start-btn');
  await page.waitForSelector('#qcard.show');
  assert.equal(await page.evaluate(() => Game.isActive()), true);
  assert.match(await page.textContent('#qcard'), /capital/i);
  assert.ok(await page.$eval('#nav [data-nav="capitals"]', b => b.classList.contains('active')));
  await page.click('#hud [data-act="quit"]');

  // facts: guess is locked to capitals
  await page.click('#nav [data-nav="capitals"]');
  await page.click('#setup-modal [data-val="facts"]');
  assert.equal(await page.$('#setup-modal [data-f-key="guess"]'), null);
  await page.click('#start-btn');
  await page.waitForSelector('#facts-card.show');
  assert.match(await page.textContent('#facts-card h2'), /capital/i);
  await page.evaluate(() => Facts.stop());

  // rush: capital type only
  await page.click('#nav [data-nav="capitals"]');
  await page.click('#setup-modal [data-val="rush"]');
  assert.equal(await page.$('#setup-modal [data-rush="rushMode"]'), null);
  await page.click('#start-btn');
  await page.waitForSelector('#rush-card.show');
  assert.equal(await page.evaluate(() => Rush.peek().mode), 'capital');
  await page.click('#rush-hud [data-act="quit"]');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
