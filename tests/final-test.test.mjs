/**
 * Final test at the end of a Study session: everything again in one go,
 * no second try; mistakes show the answer (wrong place in red) and move on.
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

const peek = () => page.evaluate(() => FinalTest.peek());
const name = id => page.evaluate(i => COUNTRY_BY_ID.get(i).name.en, id);

test('the Study end screen opens the final test with the session countries', async () => {
  await page.evaluate(() => Study.start({ conts: ['EUR'], levels: [1], newCount: 3, capitals: false, recap: 'none' }));
  for (let i = 0; i < 40; i++) {
    const p = await page.evaluate(() => Study.peek());
    if (!p || p.over) break;
    if (p.phase.includes('place')) await page.evaluate(id => Study.onPlaceClick(MapView.record(id)), p.id);
    else { await page.fill('#study-card input', await name(p.id)); await page.press('#study-card input', 'Enter'); }
    await page.waitForFunction(b => { const x = Study.peek(); return !x || x.over || x.id !== b.id || x.phase !== b.phase; }, p);
  }
  await page.waitForSelector('#study-end-modal.open');
  await page.click('#study-end-modal [data-act="final"]');
  await page.waitForSelector('#ft-card.show');
  const p = await peek();
  assert.equal(p.total, 3);
  assert.equal(p.step, 'name');
});

test('right answers go on; wrong ones show the answer, the wrong place in red, then go on', async () => {
  // 1st country: name right, place wrong
  let p = await peek();
  await page.fill('#ft-card input', await name(p.id));
  await page.press('#ft-card input', 'Enter');
  assert.equal((await peek()).result.ok, true);
  await page.waitForFunction(() => FinalTest.peek().step === 'place');
  p = await peek();
  const wrong = await page.evaluate(id => COUNTRIES.find(c => c.continent === 'EUR' && c.id !== id && MapView.record(c.id).pathEl).id, p.id);
  await page.evaluate(id => FinalTest.onPlaceClick(MapView.record(id)), wrong);
  const r = (await peek()).result;
  assert.equal(r.ok, false);
  assert.equal(r.wrongId, wrong);
  assert.ok(await page.evaluate(id => MapView.record(id).pathEl.classList.contains('flash-bad'), wrong), 'clicked place in red');
  assert.ok(await page.evaluate(id => MapView.record(id).pathEl.classList.contains('flagged'), p.id), 'right place with its flag');
  assert.match(await page.textContent('#ft-card .ft-result'), /You clicked/);
  // moves on by itself (no retry)
  await page.waitForFunction(i => FinalTest.peek().index === i + 1, p.index);
  assert.ok(!(await page.evaluate(id => MapView.record(id).pathEl.classList.contains('flash-bad'), wrong)), 'red cleared');

  // 2nd: "I don't know" then Next; 3rd: all right
  await page.click('#ft-card [data-act="dunno"]');
  await page.click('#ft-card [data-act="next"]');
  await page.waitForFunction(() => FinalTest.peek().step === 'place');
  p = await peek();
  await page.evaluate(id => FinalTest.onPlaceClick(MapView.record(id)), p.id);
  await page.waitForFunction(i => FinalTest.peek().index === i + 1, p.index);
  p = await peek();
  await page.fill('#ft-card input', await name(p.id));
  await page.press('#ft-card input', 'Enter');
  await page.waitForFunction(() => FinalTest.peek().step === 'place');
  await page.evaluate(id => FinalTest.onPlaceClick(MapView.record(id)), p.id);

  await page.waitForSelector('#ft-end-modal.open');
  assert.match(await page.textContent('#ft-end-modal'), /To look at again \(2\)/);
  await page.click('#ft-end-modal [data-act="misses"]');
  assert.equal((await peek()).total, 2, 'retest only the mistakes');
  await page.click('#ft-hud [data-act="quit"]');
  assert.equal(await peek(), null);
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
