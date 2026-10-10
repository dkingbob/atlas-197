/**
 * End-to-end tests: play every mode in a real (headless) browser.
 * Run with: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openApp, baseConfig } from './helpers.mjs';

let server, url, browser, page, errors;

before(async () => {
  ({ server, url } = await startServer());
  ({ browser, page, errors } = await openApp(url, { fastTimers: true }));
});
after(async () => { await browser?.close(); server?.close(); });

/* ---------- a scripted player ---------- */
/** What the current question is about, read from the screen. */
const readQuestion = () => page.evaluate(() => {
  const em = document.querySelector('#qcard .q-prompt em');
  const target = document.querySelector('#map .country.target, #map .marker.target');
  const water = document.querySelector('#map .water.on');
  let country = null, waterId = null;
  if (target) country = MapView.recordByKey(target.getAttribute('data-key'))?.id;
  if (em && !country) {
    const text = em.textContent;
    country = (COUNTRIES.find(c => countryName(c) === text) || COUNTRIES.find(c => capitalName(c) === text))?.id || null;
    waterId = WATERS.find(w => waterName(w) === text)?.id || null;
  }
  if (water) waterId = water.getAttribute('data-water');
  return {
    country, water: waterId,
    cardShown: document.getElementById('qcard').classList.contains('show'),
    endOpen: document.getElementById('end-modal').classList.contains('open'),
    locked: Boolean(document.querySelector('#qcard .q-feedback.ok, #qcard .q-feedback.bad')),
  };
});

async function waitForQuestion() {
  for (let i = 0; i < 100; i++) {
    const q = await readQuestion();
    if (q.endOpen) return q;
    if (q.cardShown && !q.locked && (q.country || q.water)) return q;
    await page.waitForTimeout(60);
  }
  return readQuestion();
}

const clickPlace = id => page.evaluate(id => {
  const rec = MapView.record(id);
  (rec.pathEl || rec.markerEl).dispatchEvent(new MouseEvent('click', { bubbles: true }));
}, id);

async function pickOption(label, correct) {
  for (const option of await page.$$('#qcard .q-opt:not([disabled])')) {
    const text = (await (await option.$('span')).innerText()).trim();
    if ((text === label) === correct) return option.click();
  }
  throw new Error('no option for ' + label);
}

async function answer(config, q, correct) {
  const { answer: type, subject } = config;
  if (q.water) {
    const id = q.water;
    if (type === 'click') {
      const clickOn = correct ? id : (id === 'arctic' ? 'indian' : 'arctic');
      return page.evaluate(w => Game.onWaterClick(WATERS.find(x => x.id === w).label[0]), clickOn);
    }
    const name = await page.evaluate(w => waterName(WATERS.find(x => x.id === w)), id);
    if (type === 'type') { await page.fill('#qcard input', correct ? name : 'zzzz'); return page.press('#qcard input', 'Enter'); }
    return pickOption(name, correct);
  }
  const id = q.country;
  if (type === 'click') {
    const target = correct ? id : await page.evaluate(id => COUNTRIES.find(c => c.id !== id && !MapView.record(c.id).dimmed).id, id);
    return clickPlace(target);
  }
  const expected = await page.evaluate(([id, sub]) => {
    const c = COUNTRY_BY_ID.get(id);
    return sub === 'capital' ? capitalName(c) : countryName(c);
  }, [id, subject]);
  if (type === 'type') { await page.fill('#qcard input', correct ? expected : 'qqqqqq'); return page.press('#qcard input', 'Enter'); }
  return pickOption(expected, correct);
}

/** Play a full game, always right ('win') or always wrong ('lose'). */
async function play(config, outcome = 'win') {
  await page.evaluate(c => Game.start(c), config);
  const seen = [];
  for (let i = 0; i < 70; i++) {
    const q = await waitForQuestion();
    if (q.endOpen) break;
    seen.push(q.country || q.water);
    await answer(config, q, outcome === 'win');
    await page.waitForTimeout(outcome === 'win' ? 250 : 450);
  }
  await page.waitForTimeout(300);
  const end = await page.evaluate(() => ({
    open: document.getElementById('end-modal').classList.contains('open'),
    title: document.querySelector('#end-modal h2')?.textContent || '',
    missed: document.querySelectorAll('#end-modal .missed li').length,
  }));
  return { seen, end };
}

const closeEnd = async () => { await page.click('#end-modal [data-act="back"]'); await page.waitForTimeout(200); };
const isWin = end => end.open && /complete/i.test(end.title);
const isLoss = end => end.open && /lives/i.test(end.title);

/* ---------- tests ---------- */
test('world quiz: every subject × answer type can be won', async () => {
  for (const subject of ['name', 'capital', 'location']) {
    for (const type of ['click', 'type', 'mc']) {
      const { seen, end } = await play(baseConfig({ subject, answer: type }));
      assert.ok(isWin(end) && end.missed === 0 && seen.length === 10, `${subject}/${type}: ${JSON.stringify(end)}`);
      await closeEnd();
    }
  }
});

test('continent quiz: can be lost with each answer type and stays in the continent', async () => {
  for (const [subject, type] of [['location', 'click'], ['name', 'type'], ['capital', 'mc']]) {
    const { seen, end } = await play(baseConfig({ mode: 'continent', continent: 'AFR', subject, answer: type }), 'lose');
    const continents = await page.evaluate(ids => ids.map(id => COUNTRY_BY_ID.get(id).continent), seen);
    assert.ok(isLoss(end) && seen.length === 3, JSON.stringify(end));
    assert.deepEqual([...new Set(continents)], ['AFR']);
    if (type === 'mc') {
      await page.click('#end-modal [data-act="addhard"]');
      assert.ok(await page.evaluate(() => Store.hardIds().length >= 3), 'missed countries added to hard list');
    }
    await closeEnd();
  }
});

test('continent quiz: other continents dimmed, Oceania re-centred, names hidden', async () => {
  await page.evaluate(c => Game.start(c), baseConfig({ mode: 'continent', continent: 'OCE' }));
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => ({
    center: MapView.getCenter(), dimFR: MapView.record('FR').dimmed, dimAU: MapView.record('AU').dimmed,
    labels: [...document.querySelectorAll('#map .lbl')].filter(l => l.style.display !== 'none').length,
  }));
  assert.deepEqual(info, { center: 150, dimFR: true, dimAU: false, labels: 0 });
  await page.evaluate(() => Game.quit());
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => MapView.getCenter()), 10);
});

test('learning mode only asks unknown countries', async () => {
  await page.evaluate(() => COUNTRIES.filter(c => c.continent === 'SAM').slice(0, 9).forEach(c => Store.setKnown(c.id, true)));
  const { seen, end } = await play(baseConfig({ mode: 'learn', subject: 'name', answer: 'mc', filters: { conts: ['SAM'], excluded: [], excludeKnown: false, onlyHard: false } }));
  const known = await page.evaluate(() => Store.knownIds());
  assert.ok(end.open && seen.length === 3 && !seen.some(id => known.includes(id)), JSON.stringify(seen));
  await closeEnd();
});

test('hard list: only listed countries, repeats without back-to-back, weights drop when correct', async () => {
  await page.evaluate(() => { Store.hardIds().forEach(id => Store.setHard(id, false)); ['NR', 'TV', 'KI'].forEach(id => Store.setHard(id, true)); });
  const before = await page.evaluate(() => Store.hardIds().reduce((s, id) => s + Store.hardWeight(id), 0));
  const { seen, end } = await play(baseConfig({ mode: 'hard', count: 10 }));
  const afterSum = await page.evaluate(() => Store.hardIds().reduce((s, id) => s + Store.hardWeight(id), 0));
  assert.ok(end.open && seen.length === 10 && seen.every(id => ['NR', 'TV', 'KI'].includes(id)), JSON.stringify(seen));
  assert.ok(seen.every((id, i) => i === 0 || seen[i - 1] !== id), 'no immediate repeat');
  assert.ok(afterSum < before, `weights ${before} → ${afterSum}`);
  await closeEnd();
});

test('oceans & seas: win with each answer type, and lose', async () => {
  for (const type of ['click', 'type', 'mc']) {
    const { seen, end } = await play(baseConfig({ mode: 'oceans', subject: 'name', answer: type }));
    assert.ok(isWin(end) && end.missed === 0 && seen.length === 10, `${type}: ${JSON.stringify(end)}`);
    await closeEnd();
  }
  const { end } = await play(baseConfig({ mode: 'oceans', answer: 'click' }), 'lose');
  assert.ok(isLoss(end));
  await closeEnd();
});

test('oceans: a real mouse click on the water counts', async () => {
  await page.evaluate(c => Game.start(c), baseConfig({ mode: 'oceans', answer: 'click' }));
  let ok = false;
  for (let attempt = 0; attempt < 6 && !ok; attempt++) {
    const q = await waitForQuestion();
    await page.waitForTimeout(900);
    const points = await page.evaluate(id => WATERS.find(w => w.id === id).label.map(l => MapView.toScreen(l))
      .filter(([x, y]) => document.elementFromPoint(x, y)?.classList.contains('bg')), q.water);
    if (!points.length) { await page.evaluate(() => Game.onWaterClick([0, 0])); await page.waitForTimeout(500); continue; }
    await page.mouse.click(points[0][0], points[0][1]);
    ok = await page.evaluate(() => document.querySelector('#qcard .q-feedback').classList.contains('ok'));
    break;
  }
  await page.evaluate(() => Game.quit());
  assert.ok(ok);
});

async function dragChipTo(chipId, x, y) {
  const chip = await (await page.$(`#fm-tray [data-chip="${chipId}"]`)).boundingBox();
  await page.mouse.move(chip.x + 20, chip.y + 20);
  await page.mouse.down();
  await page.mouse.move(chip.x + 50, chip.y - 30, { steps: 4 });
  await page.mouse.move(x, y, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(260);
}

test('flag match: drag flags onto names and capitals', async () => {
  for (const subject of ['name', 'capital']) {
    await page.evaluate(c => Game.start(c), baseConfig({ mode: 'flagmatch', subject }));
    await page.waitForTimeout(500);
    for (let i = 0; i < 12; i++) {
      const chip = await page.$('#fm-tray [data-chip]');
      if (!chip || await page.evaluate(() => document.getElementById('end-modal').classList.contains('open'))) break;
      const id = await chip.getAttribute('data-chip');
      const target = await (await page.$(`#fm-list [data-target-id="${id}"]`)).boundingBox();
      await dragChipTo(id, target.x + 30, target.y + target.height / 2);
    }
    await page.waitForTimeout(500);
    const title = await page.evaluate(() => document.querySelector('#end-modal h2')?.textContent || '');
    assert.match(title, /complete/i, subject);
    await closeEnd();
  }
});

test('flag match on the map: real drag, then tap + click', async () => {
  await page.evaluate(c => Game.start(c), baseConfig({ mode: 'flagmatch', subject: 'location', filters: { conts: ['EUR'], excluded: [], excludeKnown: false, onlyHard: false } }));
  await page.waitForTimeout(1300);
  const ids = await page.$$eval('#fm-tray [data-chip]', chips => chips.map(c => c.dataset.chip));
  const visible = await page.evaluate(ids => ids.filter(id => {
    const r = MapView.record(id).pathEl?.getBoundingClientRect();
    return r && r.width > 30 && r.height > 30 && r.y > 120 && r.bottom < 680;
  }), ids);
  assert.ok(visible.length, 'a large country is visible');
  const [x, y] = await page.evaluate(id => MapView.getTransform().apply(MapView.record(id).labelXY), visible[0]);
  await dragChipTo(visible[0], x, y);
  assert.ok(await page.evaluate(id => MapView.record(id).pathEl.classList.contains('matched'), visible[0]), 'dropped on the map');

  for (let i = 0; i < 14; i++) {
    const chip = await page.$('#fm-tray [data-chip]');
    if (!chip || await page.evaluate(() => document.getElementById('end-modal').classList.contains('open'))) break;
    const id = await chip.getAttribute('data-chip');
    await chip.click();
    await clickPlace(id);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(600);
  assert.match(await page.evaluate(() => document.querySelector('#end-modal h2')?.textContent || ''), /complete/i);
  await closeEnd();
});

test('flag match can be lost', async () => {
  await page.evaluate(c => Game.start(c), baseConfig({ mode: 'flagmatch', subject: 'name' }));
  await page.waitForTimeout(400);
  for (let i = 0; i < 3; i++) {
    const chip = await page.$('#fm-tray [data-chip]');
    const id = await chip.getAttribute('data-chip');
    if (!(await chip.getAttribute('class')).includes('sel')) await chip.click();
    await page.click(`#fm-list [data-target-id]:not([data-target-id="${id}"]):not([disabled])`);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(600);
  const end = await page.evaluate(() => ({ title: document.querySelector('#end-modal h2')?.textContent || '', missed: document.querySelectorAll('#end-modal .missed li').length }));
  assert.match(end.title, /lives/i);
  assert.ok(end.missed >= 1);
  await closeEnd();
});

test('hints and skip', async () => {
  await page.evaluate(c => Game.start(c), baseConfig({ answer: 'mc' }));
  const first = await waitForQuestion();
  await page.click('#qcard [data-act="hint"]');
  assert.equal(await page.$$eval('#qcard .q-opt.gone', els => els.length), 2, 'mc hint removes 2 options');
  assert.ok(await page.$eval('#qcard [data-act="hint"]', b => b.disabled), 'only one hint per game');
  await page.click('#qcard [data-act="skip"]');
  await page.waitForTimeout(500);
  const second = await waitForQuestion();
  assert.equal(await page.$$eval('#hud .hearts svg:not(.lost)', els => els.length), 3, 'skip costs no life');
  assert.notEqual(second.country, first.country);
  await page.evaluate(() => Game.quit());

  await page.evaluate(c => Game.start(c), baseConfig({ subject: 'name', answer: 'type' }));
  const q = await waitForQuestion();
  await page.click('#qcard [data-act="hint"]');
  const placeholder = await page.getAttribute('#qcard input', 'placeholder');
  const firstLetter = await page.evaluate(id => countryName(COUNTRY_BY_ID.get(id)).charAt(0), q.country);
  assert.ok(placeholder.startsWith(firstLetter), 'type hint shows the first letter');
  const french = await page.evaluate(id => COUNTRY_BY_ID.get(id).name.fr.toLowerCase(), q.country);
  await page.fill('#qcard input', french);
  await page.press('#qcard input', 'Enter');
  assert.ok(await page.evaluate(() => document.querySelector('#qcard .q-feedback').classList.contains('ok')), 'French name accepted');
  await page.evaluate(() => Game.quit());

  await page.evaluate(c => Game.start(c), baseConfig({ answer: 'click' }));
  await waitForQuestion();
  await page.click('#qcard [data-act="hint"]');
  await page.waitForTimeout(900);
  assert.ok(await page.evaluate(() => MapView.getTransform().k) > 1.5, 'click hint zooms in');
  await page.evaluate(() => Game.quit());
});

test('typed answers: tolerant but never accepts another place', async () => {
  const results = await page.evaluate(() => {
    const c = id => COUNTRY_BY_ID.get(id), w = id => WATERS.find(x => x.id === id);
    return {
      'cote divoire': Answers.isCountry('cote divoire', c('CI')), 'Ivory Coast': Answers.isCountry('Ivory Coast', c('CI')),
      usa: Answers.isCountry('usa', c('US')), 'Etats-Unis': Answers.isCountry('Etats-Unis', c('US')),
      germny: Answers.isCountry('germny', c('DE')), 'st lucia': Answers.isCountry('st lucia', c('LC')),
      'Saint Vincent': Answers.isCountry('Saint Vincent', c('VC')),
      'Niger≠Nigeria': !Answers.isCountry('Niger', c('NG')), 'Iran≠Iraq': !Answers.isCountry('Iran', c('IQ')),
      'Austria≠Australia': !Answers.isCountry('Austria', c('AU')),
      bogota: Answers.isCapital('bogota', c('CO')), 'Pékin': Answers.isCapital('Pékin', c('CN')),
      'la paz': Answers.isCapital('la paz', c('BO')), kyiv: Answers.isCapital('kyiv', c('UA')),
      'Sydney≠Canberra': !Answers.isCapital('Sydney', c('AU')),
      pacific: Answers.isWater('pacific', w('pacific')), 'Océan Pacifique': Answers.isWater('Océan Pacifique', w('pacific')),
      'mer mediterranee': Answers.isWater('mer mediterranee', w('mediterranean')), 'Atlantic≠Pacific': !Answers.isWater('Atlantic', w('pacific')),
    };
  });
  for (const [name, ok] of Object.entries(results)) assert.ok(ok, name);
});

test('setup dialog: start a game, filters, empty hard list', async () => {
  await page.click('[data-nav="play"]');
  await page.click('[data-set="mode"][data-val="continent"]');
  await page.click('[data-set="continent"][data-val="SAM"]');
  await page.click('[data-set="subject"][data-val="capital"]');
  await page.click('[data-set="answer"][data-val="mc"]');
  await page.click('[data-set="count"][data-val="10"]');
  await page.click('#start-btn');
  const q = await waitForQuestion();
  assert.equal(await page.evaluate(id => COUNTRY_BY_ID.get(id).continent, q.country), 'SAM');
  assert.equal((await page.$$('#qcard .q-opt')).length, 4);

  await page.click('[data-lang="fr"]');
  assert.match(await page.innerText('#qcard .q-prompt'), /capitale/i, 'language switch mid-game');
  await page.click('[data-lang="en"]');
  await page.click('#hud [data-act="quit"]');
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => Game.isActive()), false);

  await page.click('[data-nav="play"]');
  await page.click('[data-set="mode"][data-val="world"]');
  await page.evaluate(() => { document.querySelector('#setup-modal details').open = true; });
  for (const id of ['AFR', 'ASI', 'NAM', 'SAM', 'OCE']) await page.click(`[data-filter-continent="${id}"]`);
  await page.fill('.c-search', 'fra');
  await page.click('.c-item:not([style*="none"]) input[data-country="FR"]');
  assert.match(await page.innerText('#pool-line'), /45/, 'Europe minus France');
  await page.click('[data-set="count"][data-val="0"]');
  await page.click('#start-btn');
  await page.waitForTimeout(300);
  assert.match(await page.innerText('#hud'), /\/45/);
  await page.evaluate(() => Game.quit());

  await page.evaluate(() => Store.hardIds().forEach(id => Store.setHard(id, false)));
  await page.click('[data-nav="play"]');
  await page.click('[data-set="mode"][data-val="hard"]');
  assert.ok(await page.$eval('#start-btn', b => b.disabled), 'empty hard list → cannot start');
  await page.keyboard.press('Escape');
});

test('every country opens a full panel in English and French', async () => {
  const bad = await page.evaluate(() => {
    const problems = [];
    for (const lng of ['en', 'fr']) {
      setLanguage(lng);
      for (const c of COUNTRIES) {
        const rec = MapView.record(c.id);
        (rec.pathEl || rec.markerEl).dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const name = document.querySelector('#panel .p-name')?.textContent;
        const history = document.querySelector('#panel .p-sec p')?.textContent || '';
        const facts = document.querySelectorAll('#panel .p-facts li').length;
        const flag = document.querySelector('#panel .p-flag')?.getAttribute('src') || '';
        if (name !== c.name[lng] || history.length < 80 || facts !== 3 || !flag.includes(`/${c.id.toLowerCase()}.svg`)) problems.push(`${lng}:${c.id}`);
        if (rec.isSmall && !rec.markerEl) problems.push(`${c.id}: small without marker`);
      }
    }
    setLanguage('en');
    CountryPanel.close();
    return problems;
  });
  assert.deepEqual(bad, []);
});

test('progress panel and reset', async () => {
  await page.evaluate(() => Store.setKnown('FR', true));
  await page.click('[data-nav="progress"]');
  assert.ok((await page.$$('#progress-modal .cbar')).length >= 10);
  await page.click('#progress-modal [data-act="reset"]');
  await page.click('#confirm-modal [data-act="yes"]');
  assert.equal(await page.evaluate(() => Store.knownIds().length), 0);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas197.v1')).lang), 'en');
  await page.keyboard.press('Escape');
});

test('no console errors', () => {
  assert.deepEqual(errors, []);
});
