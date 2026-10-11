/**
 * Study recap: quiz everything already seen first, or the automatic
 * slideshow with its speed slider (0.75× / 1× / 1.5× / 2×, 1× = 3.5 s).
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp } from './helpers.mjs';

let server, url, browser, page, errors;

before(async () => {
  ({ server, url } = await startServer());
  ({ browser, page, errors } = await openApp(url));
  // pretend 4 European countries were studied, due in a few days
  await page.evaluate(() => ['FR', 'DE', 'IT', 'ES'].forEach(id => Store.setSrsCard(id, { box: 2, due: Date.now() + 3 * 864e5, lapses: 0, last: Date.now() })));
});
after(async () => { await browser?.close(); server?.close(); });

const settings = recap => ({ conts: ['EUR'], levels: [1], newCount: 3, capitals: false, recap });

test('slideshow: shows every seen country on the map, then the new ones', async () => {
  await page.evaluate(() => Store.setPref('recapVoice', false));
  await page.evaluate(s => Study.start(s), settings('slideshow'));
  await page.waitForSelector('#recap-card.show .rc-flag img');
  let r = await page.evaluate(() => Recap.peek());
  assert.equal(r.total, 4);
  assert.ok(['FR', 'DE', 'IT', 'ES'].includes(r.id));
  assert.ok(await page.evaluate(id => MapView.record(id).pathEl.classList.contains('flagged'), r.id), 'flag on the map');

  // pause / next / previous
  await page.click('#recap-card [data-act="toggle"]');
  assert.equal((await page.evaluate(() => Recap.peek())).playing, false);
  await page.click('#recap-card [data-act="next"]');
  assert.equal((await page.evaluate(() => Recap.peek())).index, 1);
  await page.click('#recap-card [data-act="prev"]');
  assert.equal((await page.evaluate(() => Recap.peek())).index, 0);

  // speed slider: click the "2×" label, then drag back to 0.75×, keyboard to 1.5×
  await page.click('#recap-card .ss-labels span[data-i="3"]');
  assert.equal((await page.evaluate(() => Recap.peek())).speed, 2);
  const track = await page.locator('#recap-card .ss-track').boundingBox();
  await page.mouse.move(track.x + track.width * 0.9, track.y + track.height / 2);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width * 0.4, track.y + track.height / 2, { steps: 5 });
  await page.mouse.move(track.x + 2, track.y + track.height / 2, { steps: 5 });
  await page.mouse.up();
  assert.equal((await page.evaluate(() => Recap.peek())).speed, 0.75);
  await page.focus('#recap-card .ss-track');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  assert.equal((await page.evaluate(() => Recap.peek())).speed, 1.5);

  // auto-advance at 4× (0.875 s per country)
  await page.keyboard.press('End');
  await page.click('#recap-card [data-act="toggle"]'); // play again
  const start = Date.now();
  await page.waitForFunction(() => Recap.peek()?.index === 1, null, { timeout: 4000 });
  const elapsed = Date.now() - start;
  assert.equal((await page.evaluate(() => Recap.peek())).speed, 4);
  assert.ok(elapsed > 500 && elapsed < 1800, `~0.9 s per country at 4× (${elapsed} ms)`);

  // skip to learning
  await page.click('#recap-card [data-act="skip"]');
  await page.waitForSelector('#study-card.show');
  assert.equal(await page.evaluate(() => Recap.isRunning()), false);
  assert.equal((await page.evaluate(() => Study.peek())).phase, 'present', 'new countries next');
  await page.evaluate(() => Study.stop());
});

test('quiz first: every seen country is asked before any new one', async () => {
  await page.evaluate(s => Study.start(s), settings('quiz'));
  await page.waitForSelector('#study-card.show');
  const kinds = [];
  for (let i = 0; i < 4; i++) {
    const p = await page.evaluate(() => Study.peek());
    kinds.push(p.kind);
    // answer the name, then the place
    await page.fill('#study-card input', await page.evaluate(id => COUNTRY_BY_ID.get(id).name.en, p.id));
    await page.press('#study-card input', 'Enter');
    await page.waitForFunction(() => Study.peek().phase === 'place');
    await page.evaluate(id => Study.onPlaceClick(MapView.record(id)), p.id);
    await page.waitForFunction(id => Study.peek().id !== id || Study.peek().phase !== 'place', p.id);
  }
  assert.deepEqual(kinds, ['review', 'review', 'review', 'review']);
  assert.equal((await page.evaluate(() => Study.peek())).kind, 'fresh');
  // a recap of a country not due yet keeps its box
  assert.equal(await page.evaluate(() => Store.srsCards().FR.box), 2);
  await page.evaluate(() => Study.stop());
});

test('setup: recap choices', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="study"]');
  assert.ok(await page.$('#setup-modal [data-study-recap="slideshow"]'));
  await page.click('#setup-modal [data-study-recap="slideshow"]');
  assert.ok(await page.$eval('#setup-modal [data-study-recap="slideshow"]', b => b.classList.contains('active')));
  await page.keyboard.press('Escape');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
