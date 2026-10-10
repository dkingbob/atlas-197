/**
 * Study mode: see → write → recall from memory on a gray map → fix mistakes,
 * and the spaced-repetition cards saved at the end.
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

const peek = () => page.evaluate(() => Study.peek());
const name = id => page.evaluate(i => COUNTRY_BY_ID.get(i).name.en, id);
const flagged = id => page.evaluate(i => {
  const rec = MapView.record(i);
  return Boolean(rec.pathEl?.classList.contains('flagged') || rec.markerEl?.classList.contains('flagged'));
}, id);

async function waitChange(before) {
  await page.waitForFunction(b => {
    const p = Study.peek();
    return !p || p.over || p.id !== b.id || p.phase !== b.phase;
  }, before);
}

async function type(text) {
  await page.fill('#study-card input', text);
  await page.press('#study-card input', 'Enter');
}

/** Answer the current step correctly. */
async function answerRight() {
  const p = await peek();
  if (p.phase === 'place' || p.phase === 'fix-place') await page.evaluate(id => Study.onPlaceClick(MapView.record(id)), p.id);
  else if (p.phase.endsWith('capital')) await type(await page.evaluate(i => COUNTRY_BY_ID.get(i).capital.en, p.id));
  else await type(await name(p.id));
  await waitChange(p);
}

test('neighbours come from the map borders', async () => {
  const fr = await page.evaluate(() => MapView.record('FR').neighbors);
  for (const id of ['ES', 'DE', 'BE', 'IT', 'CH']) assert.ok(fr.includes(id), id);
  assert.ok(!fr.includes('BR'), 'not via French Guiana');
});

test('see it (flag on the map) → write it → recall it later on a gray map', async () => {
  await page.evaluate(() => Study.start({ conts: ['EUR'], levels: [1], newCount: 3, capitals: false }));
  await page.waitForSelector('#study-card.show');
  const first = await peek();
  assert.equal(first.phase, 'present');
  assert.ok(await flagged(first.id), 'flag painted while learning');
  assert.ok((await page.textContent('#study-card')).includes(await name(first.id)));

  // copying a wrong name does not pass
  await type('zzzz');
  assert.match(await page.textContent('#study-card .q-feedback'), /Write/);
  await type(await name(first.id));
  await waitChange(first);

  const second = await peek();
  assert.notEqual(second.id, first.id, 'something else comes before the recall');
  assert.ok(!(await flagged(first.id)), 'map back to gray');

  // play the rest of the session right; check recall steps show no flag on the map
  for (let i = 0; i < 40; i++) {
    const p = await peek();
    if (!p || p.over) break;
    if (p.phase === 'name' || p.phase === 'place') assert.ok(!(await flagged(p.id)), `${p.id} hidden during recall`);
    if (p.phase === 'name') assert.ok(await page.$('#study-card .s-recall-flag img'), 'flag shown on the card');
    await answerRight();
  }
  await page.waitForSelector('#study-end-modal.open');
  const cards = await page.evaluate(() => Store.srsCards());
  assert.equal(Object.keys(cards).length, 3);
  for (const card of Object.values(cards)) {
    assert.equal(card.box, 1);
    assert.ok(card.due > Date.now() + 20 * 3600e3, 'due tomorrow');
  }
  await page.click('#study-end-modal [data-act="back"]');
  assert.equal(await peek(), null);
});

test('mistakes: "you wrote X" comparison, must rewrite / re-click, comes back again', async () => {
  await page.evaluate(() => Study.start({ conts: ['AFR'], levels: [2], newCount: 2, capitals: true }));
  await page.waitForSelector('#study-card.show');
  await answerRight(); // present A
  await answerRight(); // present B (or A's recall)
  let p = await peek();
  while (p.phase !== 'name') { await answerRight(); p = await peek(); }
  const target = p.id;

  // type another country's name → comparison + fix step
  const wrong = await page.evaluate(id => COUNTRIES.find(c => c.continent === 'EUR' && c.id !== id).name.en, target);
  await type(wrong);
  await page.waitForSelector('#study-card .s-confuse img');
  assert.equal((await peek()).phase, 'fix-name');
  await type(await name(target));
  await waitChange({ id: target, phase: 'fix-name' });

  // wrong place → the right one is shown with its flag, must click it
  assert.equal((await peek()).phase, 'place');
  const other = await page.evaluate(id => COUNTRIES.find(c => c.continent === 'AFR' && c.id !== id && MapView.record(c.id).pathEl).id, target);
  await page.evaluate(id => Study.onPlaceClick(MapView.record(id)), other);
  assert.equal((await peek()).phase, 'fix-place');
  assert.ok(await flagged(target), 'answer revealed with its flag');
  await answerRight();

  // capital
  p = await peek();
  assert.equal(p.phase, 'capital');
  await page.click('#study-card [data-act="reveal"]');
  assert.equal((await peek()).phase, 'fix-capital');
  await answerRight();

  // the missed country is shown again later, before its next recall
  const seen = [];
  for (let i = 0; i < 60; i++) {
    const s = await peek();
    if (!s || s.over) break;
    if (s.id === target) seen.push(s.phase);
    await answerRight();
  }
  assert.equal(seen[0], 'present', 'shown again after the mistake');
  assert.ok(seen.filter(x => x === 'name').length >= 2, 'recalled right twice before leaving');
  await page.waitForSelector('#study-end-modal.open');
  assert.match(await page.textContent('#study-end-modal'), new RegExp(await name(target)));
  await page.click('#study-end-modal [data-act="back"]');
});

test('reviews: due countries are asked straight from memory', async () => {
  await page.evaluate(() => {
    for (const [id, card] of Object.entries(Store.srsCards())) Store.setSrsCard(id, { ...card, due: Date.now() - 1000 });
  });
  await page.evaluate(() => Study.start({ conts: ['EUR'], levels: [1], newCount: 3, capitals: false }));
  await page.waitForSelector('#study-card.show');
  const p = await peek();
  assert.equal(p.kind, 'review');
  assert.equal(p.phase, 'name', 'no presentation for a review');
  await page.evaluate(() => Study.stop());
});

test('setup dialog: Study card, deck line, start', async () => {
  await page.click('#nav [data-nav="play"]');
  await page.click('#setup-modal [data-val="study"]');
  await page.click('#setup-modal [data-study="newCount"][data-val="3"]');
  assert.match(await page.textContent('#pool-line'), /new/);
  await page.click('#start-btn');
  await page.waitForSelector('#study-card.show img');
  await page.click('#study-hud [data-act="quit"]');
  assert.equal(await peek(), null);
  await page.click('#nav [data-nav="progress"]');
  assert.match(await page.textContent('#progress-modal'), /Study memory/);
  await page.keyboard.press('Escape');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
