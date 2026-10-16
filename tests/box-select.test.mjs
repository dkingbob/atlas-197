/**
 * Box select: drag a rectangle to select countries, click to add/remove,
 * then mark them known / not known, remove the marks, or learn them.
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

const selected = () => page.evaluate(() => window.__box().sort());

async function dragOver(ids, { shift = false } = {}) {
  // rectangle around the screen positions of these countries (+ margin)
  const pts = await page.evaluate(list => list.map(id => MapView.screenXY(MapView.record(id))), ids);
  const box = await page.locator('#map-wrap').boundingBox();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const [x0, y0, x1, y1] = [Math.min(...xs) - 4, Math.min(...ys) - 4, Math.max(...xs) + 4, Math.max(...ys) + 4];
  if (shift) await page.keyboard.down('Shift');
  await page.mouse.move(box.x + x0, box.y + y0);
  await page.mouse.down();
  await page.mouse.move(box.x + (x0 + x1) / 2, box.y + (y0 + y1) / 2, { steps: 4 });
  await page.mouse.move(box.x + x1, box.y + y1, { steps: 4 });
  await page.mouse.up();
  if (shift) await page.keyboard.up('Shift');
}

test('select button + drag selects the countries inside; the map does not move', async () => {
  await page.evaluate(() => { window.__box = () => atlas.BoxSelect.selected(); MapView.zoomToGeo([[-10, 36], [30, 60]], { duration: 0 }); });
  const before = await page.$eval('#map .root', g => g.getAttribute('transform'));
  await page.click('#select-btn');
  assert.match(await page.textContent('#select-bar'), /Drag a rectangle/);
  await dragOver(['FR', 'DE']);
  const s = await selected();
  assert.ok(s.includes('FR') && s.includes('DE'), s.join());
  assert.equal(await page.$eval('#map .root', g => g.getAttribute('transform')), before, 'map did not pan');
  assert.ok(await page.evaluate(() => MapView.record('FR').pathEl.classList.contains('selected')));
  // click toggles one country
  await page.evaluate(() => MapView.record('FR').pathEl.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  assert.ok(!(await selected()).includes('FR'));
  assert.ok(!(await page.evaluate(() => CountryPanel.isOpen())), 'no country panel while selecting');
});

test('I know / I don\'t know / remove both', async () => {
  const ids = await selected();
  await page.click('#select-bar [data-sel="known"]');
  assert.ok(await page.evaluate(list => list.every(id => Store.isKnown(id)), ids));
  await page.click('#select-bar [data-sel="known-off"]');
  assert.ok(await page.evaluate(list => list.every(id => !Store.isKnown(id)), ids));
  await page.click('#select-bar [data-sel="unknown"]');
  assert.ok(await page.evaluate(list => list.every(id => Store.isHard(id)), ids));
  await page.click('#select-bar [data-sel="unknown-off"]');
  assert.ok(await page.evaluate(list => list.every(id => !Store.isHard(id)), ids));
});

test('Learn starts Study with exactly the selected countries', async () => {
  const ids = await selected();
  await page.click('#select-bar [data-sel="learn"]');
  await page.waitForSelector('#study-card.show');
  const p = await page.evaluate(() => Study.peek());
  assert.equal(p.total, ids.length);
  assert.ok(ids.includes(p.id));
  assert.ok(!(await page.$eval('#select-bar', b => b.classList.contains('show'))), 'select mode off during the game');
  await page.click('#game-controls [data-act="leave"]');
});

test('Shift + drag works without the button; Escape leaves select mode', async () => {
  await page.waitForTimeout(1200); // the map is still flying back after the game
  await dragOver(['ES', 'PT'], { shift: true });
  assert.ok((await selected()).includes('ES'));
  await page.keyboard.press('Escape');
  assert.deepEqual(await selected(), []);
  assert.ok(!(await page.$eval('#select-btn', b => b.classList.contains('on'))));
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
