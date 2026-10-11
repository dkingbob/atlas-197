/**
 * Time on the site (idle stretches removed), click again to put a country
 * back to gray, and the smooth wheel / animated zoom.
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

test('active time counts; a quiet stretch over 5 minutes is removed entirely', async () => {
  const s0 = await page.evaluate(() => Activity.sessionMs());
  await page.evaluate(() => Activity._simulate(2 * 60e3));     // 2 min with activity → counted
  const s1 = await page.evaluate(() => Activity.sessionMs());
  assert.ok(s1 - s0 >= 2 * 60e3 && s1 - s0 < 2 * 60e3 + 5000);
  await page.evaluate(() => Activity._simulate(7 * 60e3));     // 7 min idle → nothing counted
  const s2 = await page.evaluate(() => Activity.sessionMs());
  assert.ok(s2 - s1 < 1000, 'idle time (including the first 5 minutes) not counted');
  await page.evaluate(() => Activity._simulate(5 * 60e3 - 1000)); // just under 5 min → counted
  assert.ok((await page.evaluate(() => Activity.sessionMs())) - s2 >= 4 * 60e3);

  await page.click('#nav [data-nav="progress"]');
  const text = await page.textContent('#progress-modal');
  assert.match(text, /Time on Atlas/);
  assert.match(text, /This session/);
  assert.match(text, /6 min/);
  await page.keyboard.press('Escape');
  // saved when the tab is hidden
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  assert.ok((await page.evaluate(() => Store.activeTime().total)) >= 6 * 60e3);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
});

test('click a gray country: flag; click again: back to gray', async () => {
  const rec = () => page.evaluate(() => { const r = MapView.record('BR'); return { revealed: r.revealed, flagged: r.pathEl.classList.contains('flagged') }; });
  await page.evaluate(() => MapView.record('BR').pathEl.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  assert.deepEqual(await rec(), { revealed: true, flagged: true });
  assert.ok(await page.evaluate(() => CountryPanel.isOpen()));
  await page.evaluate(() => MapView.record('BR').pathEl.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  assert.deepEqual(await rec(), { revealed: false, flagged: false });
  assert.ok(!(await page.evaluate(() => CountryPanel.isOpen())));
});

test('mouse wheel glides to the new zoom', async () => {
  const settled = () => page.waitForFunction(() => !document.querySelector('#map-layer').style.transform, null, { timeout: 4000 });
  const k = () => page.evaluate(() => Number(document.querySelector('#map .root').getAttribute('transform')?.match(/scale\(([\d.]+)/)?.[1] || 1));
  const box = await page.locator('#map-wrap').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(300); await settled();
  assert.ok((await k()) > 1.5, 'zoomed in');
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(300); await settled();
  assert.ok(Math.abs((await k()) - 1) < 0.01, 'back to the whole world');
  await page.click('#zoom-in');
  await page.waitForTimeout(300); await settled();
  assert.ok((await k()) > 1.4);
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
