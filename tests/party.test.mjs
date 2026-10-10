/**
 * Party (multiplayer): 4 browsers in one room through a local signaling
 * server. The host picks the settings, everyone gets the same countries,
 * a 5th player is refused, scores and the ranking reach every player.
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp } from './helpers.mjs';
import { startPeerServer } from './peer-server.mjs';

let server, url, signaling, browser;
const players = []; // { page, errors }

before(async () => {
  ({ server, url } = await startServer());
  signaling = await startPeerServer();
  const first = await openApp(url, { peerPort: signaling.port });
  browser = first.browser;
  players.push(first);
  for (let i = 0; i < 4; i++) players.push(await openApp(url, { peerPort: signaling.port, browser }));
});
after(async () => { await browser?.close(); signaling?.close(); server?.close(); });

const NAMES = ['Ana', 'Ben', 'Chloé', 'Dev', 'Eve'];

async function openParty(page, name) {
  await page.click('#nav [data-nav="party"]');
  await page.fill('#party-modal .p-name', name);
}

test('host creates a room and picks the settings', async () => {
  const host = players[0].page;
  await openParty(host, NAMES[0]);
  await host.click('#party-modal [data-act="create"]');
  await host.waitForSelector('#party-modal .p-code-big', { timeout: 20000 });
  await host.click('#party-modal [data-val="flag-only"]');
  await host.click('#party-modal [data-val="60"]');
  assert.match(await host.textContent('#party-modal .p-code-big'), /^[A-Z]{5}$/);
  assert.match(host.url(), /\?room=[A-Z]{5}$/);
});

test('three friends join (one with the invite link), a fifth is refused', async () => {
  const code = await players[0].page.textContent('#party-modal .p-code-big');
  for (let i = 1; i <= 3; i++) {
    const { page } = players[i];
    if (i === 3) {
      await page.goto(`${url}?room=${code}`); // invite link
      await page.waitForSelector('#party-modal.open');
      await page.evaluate(() => Object.assign(window, window.atlas));
      await page.fill('#party-modal .p-name', NAMES[i]);
      assert.equal(await page.inputValue('#party-modal .p-code'), code);
    } else {
      await openParty(page, NAMES[i]);
      await page.fill('#party-modal .p-code', code.toLowerCase());
    }
    await page.click('#party-modal .p-join button');
    await page.waitForSelector('#party-modal .p-code-big', { timeout: 20000 });
  }
  for (let i = 0; i <= 3; i++) {
    await players[i].page.waitForFunction(() => document.querySelectorAll('#party-modal .p-slot:not(.empty)').length === 4);
  }
  // non-hosts see the host's settings, read-only
  assert.match(await players[1].page.textContent('#party-modal .p-summary'), /Flag only/);
  assert.equal(await players[1].page.$('#party-modal [data-act="start"]'), null);

  const fifth = players[4].page;
  await openParty(fifth, NAMES[4]);
  await fifth.fill('#party-modal .p-code', code);
  await fifth.click('#party-modal .p-join button');
  await fifth.waitForSelector('#party-modal .bad-note', { timeout: 20000 });
  assert.match(await fifth.textContent('#party-modal .bad-note'), /full/i);
});

test('wrong code is reported', async () => {
  const page = players[4].page;
  await page.fill('#party-modal .p-code', 'ZZZZZ');
  await page.click('#party-modal .p-join button');
  await page.waitForFunction(() => /not found/i.test(document.querySelector('#party-modal .bad-note')?.textContent || ''), null, { timeout: 25000 });
});

test('everyone plays the same countries; scores and ranking are shared', async () => {
  const four = players.slice(0, 4).map(p => p.page);
  await four[0].click('#party-modal [data-act="start"]');
  await Promise.all(four.map(page => page.waitForSelector('#rush-card.show', { timeout: 15000 })));
  const firstIds = await Promise.all(four.map(page => page.evaluate(() => Rush.peek().id)));
  assert.equal(new Set(firstIds).size, 1, 'same first country for everyone');
  assert.equal(await four[0].evaluate(() => Rush.peek().mode), 'flag-only');

  // player i answers i+1 countries correctly (host: 1, … Dev: 4)
  for (let i = 0; i < 4; i++) {
    const page = four[i];
    for (let k = 0; k <= i; k++) {
      const before = await page.evaluate(() => Rush.peek().id);
      const name = await page.evaluate(id => COUNTRY_BY_ID.get(id).name.en, before);
      await page.fill('#rush-card input', name);
      await page.press('#rush-card input', 'Enter');
      await page.waitForFunction(id => Rush.peek()?.id !== id, before);
    }
  }
  // live scoreboard on everyone's screen
  await four[0].waitForFunction(() => document.querySelectorAll('#scoreboard li').length === 4);
  await four[0].waitForFunction(() => document.querySelector('#scoreboard li b')?.textContent !== '0');

  // everyone's clock runs out → finish → shared results
  // end the round now instead of waiting a full minute
  await Promise.all(four.map(page => page.evaluate(() => Rush.finishNow())));
  await Promise.all(four.map(page => page.waitForSelector('#party-modal.open .p-results', { timeout: 20000 })));
  for (const page of four) {
    const rows = await page.$$eval('#party-modal .p-results li b', els => els.map(e => e.textContent));
    assert.deepEqual(rows, ['Dev', 'Chloé', 'Ben', 'Ana'], 'ranked by score');
    assert.match(await page.textContent('#party-modal h2'), /Dev wins/);
  }
});

test('host starts another round from the results', async () => {
  const four = players.slice(0, 4).map(p => p.page);
  await four[0].click('#party-modal [data-act="again"]');
  await Promise.all(four.map(page => page.waitForSelector('#party-modal.open .p-code-big')));
  await four[0].click('#party-modal [data-act="start"]');
  await Promise.all(four.map(page => page.waitForSelector('#rush-card.show', { timeout: 15000 })));
  const scores = await Promise.all(four.map(page => page.evaluate(() => Rush.peek().score)));
  assert.deepEqual(scores, [0, 0, 0, 0]);
});

test('when the host leaves, the others are told', async () => {
  await players[0].page.click('#rush-hud [data-act="quit"]');
  for (let i = 1; i <= 3; i++) {
    const page = players[i].page;
    await page.waitForFunction(() => /host/i.test(document.querySelector('#party-modal .bad-note')?.textContent || ''), null, { timeout: 20000 });
    assert.equal(await page.evaluate(() => Rush.peek()), null, 'round stopped');
  }
});

test('no console errors', () => {
  for (const { errors } of players) {
    // a refused / unknown room logs a WebRTC error in some browsers: ignore network noise only
    assert.deepEqual(errors.filter(e => !/peer|webrtc|could not connect|ws:\/\//i.test(e)), []);
  }
});
