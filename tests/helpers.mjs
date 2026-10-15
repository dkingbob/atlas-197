/**
 * Test helpers: a tiny static server for the repo and a Playwright page factory.
 *
 * Offline mode (CI sandboxes without internet): set ATLAS_OFFLINE_VENDOR to a
 * folder containing d3.min.js, topojson-client.min.js and countries-50m.json.
 * CDN requests are then served from that folder and flags are replaced by
 * generated placeholders. Put peerjs.min.js there too for the party tests.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

export function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end('not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}/` })));
}

function placeholderFlag(code) {
  const h = crypto.createHash('md5').update(code).digest('hex');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="10" height="20" fill="#${h.slice(0, 6)}"/><rect x="10" width="10" height="20" fill="#${h.slice(6, 12)}"/><rect x="20" width="10" height="20" fill="#${h.slice(12, 18)}"/></svg>`;
}

async function routeOffline(context, vendorDir) {
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.includes('/d3@')) return route.fulfill({ path: path.join(vendorDir, 'd3.min.js'), contentType: 'text/javascript' });
    if (url.includes('topojson-client')) return route.fulfill({ path: path.join(vendorDir, 'topojson-client.min.js'), contentType: 'text/javascript' });
    if (url.includes('/peerjs@')) return route.fulfill({ path: path.join(vendorDir, 'peerjs.min.js'), contentType: 'text/javascript' });
    if (url.includes('world-atlas')) return route.fulfill({ path: path.join(vendorDir, 'countries-50m.json'), contentType: 'application/json' });
    const flag = url.match(/flagcdn\.com\/([a-z-]+)\.svg/);
    if (flag) return route.fulfill({ body: placeholderFlag(flag[1]), contentType: 'image/svg+xml' });
    if (url.includes('fonts.g')) return route.fulfill({ body: '', contentType: 'text/css' });
    if (url.startsWith('http://127.0.0.1')) return route.continue();
    return route.abort();
  });
}

/**
 * Open the app and wait for the map. Returns { browser, page, errors }.
 * `fastTimers` divides setTimeout delays so feedback pauses don't slow tests down.
 * `peerPort` points party games to a local signaling server (tests/peer-server.mjs).
 * `browser` reuses an open browser (several players in one test).
 * `fakeAccounts` replaces Supabase with tests/fake-supabase.js (no network).
 */
export async function openApp(url, { width = 1440, height = 900, mobile = false, fastTimers = false, peerPort = 0, browser: shared = null, fakeAccounts = false } = {}) {
  // Chrome hides local IPs behind mDNS names by default, which do not resolve in sandboxes.
  const browser = shared || await chromium.launch({ args: ['--disable-features=WebRtcHideLocalIpsWithMdns'] });
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
  if (process.env.ATLAS_OFFLINE_VENDOR) await routeOffline(context, process.env.ATLAS_OFFLINE_VENDOR);
  if (fastTimers) {
    await context.addInitScript(() => {
      const original = window.setTimeout;
      window.setTimeout = (fn, ms, ...args) => original(fn, (ms || 0) / 6, ...args);
    });
  }
  if (peerPort) {
    await context.addInitScript(port => {
      window.ATLAS_PEER_OPTIONS = { host: '127.0.0.1', port, path: '/', secure: false, config: { iceServers: [] } };
    }, peerPort);
  }
  if (fakeAccounts) await context.addInitScript({ path: new URL('./fake-supabase.js', import.meta.url).pathname });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => document.getElementById('loader').classList.contains('hide'), null, { timeout: 30000 });
  await page.evaluate(() => Object.assign(window, window.atlas)); // expose modules for page.evaluate
  return { browser, page, errors };
}

export const baseConfig = (overrides = {}) => ({
  mode: 'world', subject: 'location', answer: 'click', continent: 'EUR', count: 10,
  filters: { conts: ['AFR', 'ASI', 'EUR', 'NAM', 'SAM', 'OCE'], excluded: [], excludeKnown: false, onlyHard: false },
  ...overrides,
});
