/**
 * Accounts: password rules, create an account (+ celebration), progress saved
 * online, sign out / sign in brings it back. Uses a fake Supabase (no network).
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp } from './helpers.mjs';

let server, url, browser, page, errors;

before(async () => {
  ({ server, url } = await startServer());
  ({ browser, page, errors } = await openApp(url, { fakeAccounts: true }));
});
after(async () => { await browser?.close(); server?.close(); });

const fill = async (name, value) => page.fill(`#account-modal input[name="${name}"]`, value);
const fakeProgress = () => page.evaluate(() => Object.values(JSON.parse(sessionStorage.getItem('fake-sb') || '{}').progress || {})[0] || null);

test('password rules: 8+ characters, a capital letter, a number', async () => {
  await page.click('#account-btn');
  await page.click('#account-modal [data-go="signup"]');
  await fill('name', 'Lina');
  await fill('email', 'lina@example.com');
  for (const [pw, ok] of [['short1A', ['upper', 'number']], ['longenough', ['length']], ['Longenough', ['length', 'upper']], ['Longenough1', ['length', 'upper', 'number']]]) {
    await fill('password', pw);
    const lit = await page.$$eval('#account-modal .a-rules li.ok', els => els.map(e => e.dataset.rule));
    assert.deepEqual(lit.sort(), ok.sort(), pw);
  }
  await fill('password', 'longenough1');
  await page.click('#account-modal .a-submit');
  assert.match(await page.textContent('#account-modal .a-msg.bad'), /capital/);
});

test('create an account: celebration, progress uploaded', async () => {
  await page.evaluate(() => { Store.setKnown('FR', true); Store.recordAnswer('JP', 'name', true); });
  await page.click('#account-modal [data-go="signup"]').catch(() => {});
  await fill('name', 'Lina');
  await fill('email', 'lina@example.com');
  await fill('password', 'Atlas2026');
  await page.click('#account-modal .a-submit');
  await page.waitForSelector('#account-modal .a-success .a-check svg');
  assert.equal(await page.$$eval('#account-modal .a-burst', els => els.length), 18, 'flags burst out');
  assert.match(await page.textContent('#account-modal .a-done h2'), /Welcome, Lina/);
  await page.waitForFunction(() => !document.getElementById('account-modal').classList.contains('open'), null, { timeout: 5000 });
  assert.match(await page.textContent('#account-btn'), /Lina/);
  const remote = await fakeProgress();
  assert.ok(remote.known.FR, 'progress saved online');
});

test('changes are uploaded; sign out + sign in brings progress back (merged)', async () => {
  await page.evaluate(() => Store.setKnown('BR', true));
  await page.waitForFunction(() => Object.values(JSON.parse(sessionStorage.getItem('fake-sb')).progress)[0].known.BR, null, { timeout: 6000 });

  await page.click('#account-btn');
  assert.match(await page.textContent('#account-modal'), /saved online/);
  await page.click('#account-modal [data-act="signout"]');
  await page.evaluate(() => { Store.reset(); Store.setKnown('DE', true); }); // another device's progress
  // wrong password
  await fill('email', 'lina@example.com');
  await fill('password', 'Wrong1234');
  await page.click('#account-modal .a-submit');
  await page.waitForSelector('#account-modal .a-msg.bad');
  await fill('password', 'Atlas2026');
  await page.click('#account-modal .a-submit');
  await page.waitForFunction(() => !document.getElementById('account-modal').classList.contains('open'));
  const known = await page.evaluate(() => Store.knownIds().sort());
  assert.deepEqual(known, ['BR', 'DE', 'FR'], 'account progress + this device merged');
  await page.waitForFunction(() => Object.values(JSON.parse(sessionStorage.getItem('fake-sb')).progress)[0].known.DE, null, { timeout: 6000 });
});

test('the same email cannot sign up twice', async () => {
  await page.click('#account-btn');
  await page.click('#account-modal [data-act="signout"]');
  await page.click('#account-modal [data-go="signup"]');
  await fill('name', 'X');
  await fill('email', 'lina@example.com');
  await fill('password', 'Another123');
  await page.click('#account-modal .a-submit');
  assert.match(await page.textContent('#account-modal .a-msg.bad'), /already exists/);
  await page.keyboard.press('Escape');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
