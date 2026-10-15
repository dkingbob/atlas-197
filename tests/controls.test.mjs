/**
 * Replay / leave buttons, best scores, and small Pacific islands (Kiribati)
 * shown where their marker is.
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

test('every small country: zooming to it lands on its marker (Kiribati across the date line)', async () => {
  for (const center of [10, 150]) {
    const far = await page.evaluate(c => {
      MapView.setCenter(c); MapView.resetView(0);
      return COUNTRIES.map(x => MapView.record(x.id)).filter(r => r.isSmall && r.feature).filter(r => {
        const cx = (r.box[0][0] + r.box[1][0]) / 2, cy = (r.box[0][1] + r.box[1][1]) / 2;
        return Math.hypot(cx - r.markerXY[0], cy - r.markerXY[1]) > 30;
      }).map(r => r.id);
    }, center);
    assert.deepEqual(far, [], `center ${center}`);
  }
  await page.evaluate(() => { MapView.setCenter(10); MapView.resetView(0); });
  assert.notEqual(await page.evaluate(() => MapView.record('KI').markerEl.style.display), 'none');
});

test('replay restarts the same game; leave goes back to the map', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="world"]');
  await page.click('#setup-modal [data-set="count"][data-val="10"]');
  await page.click('#start-btn');
  await page.waitForSelector('#game-controls.show');
  await page.click('#hud [data-act="skip"]').catch(() => {});
  await page.click('#game-controls [data-act="replay"]');
  assert.ok(await page.evaluate(() => Game.isActive()));
  assert.match(await page.textContent('#hud'), /0\/10/);
  await page.click('#game-controls [data-act="leave"]');
  assert.equal(await page.evaluate(() => Game.isActive()), false);
  assert.ok(!(await page.$eval('#game-controls', el => el.classList.contains('show'))));
});

test('best score: saved per game, "new record" then "your best"', async () => {
  const play = () => page.evaluate(() => FlagQuiz.start({ style: 'game', conts: ['EUR'], levels: [1], letters: false, count: 3 }));
  const answerAll = async right => {
    for (let i = 0; i < 3; i++) {
      const p = await page.evaluate(() => FlagQuiz.peek());
      if (!p || p.over) break;
      await page.fill('#fq-card input', right ? await page.evaluate(id => COUNTRY_BY_ID.get(id).name.en, p.id) : 'zzzz');
      await page.press('#fq-card input', 'Enter');
      await page.waitForFunction(i => { const x = FlagQuiz.peek(); return !x || x.over || x.index > i; }, p.index);
    }
    await page.waitForSelector('#flags-end-modal.open');
  };
  await play(); await answerAll(true);
  assert.match(await page.textContent('#flags-end-modal .best-line'), /New record/);
  await page.click('#flags-end-modal [data-act="back"]');
  await play(); await answerAll(false);
  assert.match(await page.textContent('#flags-end-modal .best-line'), /Your best: \d+/);
  await page.click('#flags-end-modal [data-act="back"]');
  await page.click('#nav [data-nav="progress"]');
  assert.match(await page.textContent('#progress-modal .best-list'), /Flags · Game.*★ \d+/s);
  await page.keyboard.press('Escape');
});

test('changing an option does not scroll the setup dialog back up', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="facts"]');
  const top = await page.$eval('#setup-modal .dialog', d => { d.scrollTop = d.scrollHeight; return d.scrollTop; });
  assert.ok(top > 100);
  await page.click('#setup-modal [data-f-cont="ASI"]');
  const after = await page.$eval('#setup-modal .dialog', d => d.scrollTop);
  assert.ok(Math.abs(after - top) < 5, `stayed at ${top} (now ${after})`);
  await page.keyboard.press('Escape');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
