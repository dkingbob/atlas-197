# Atlas 197 — World Geography Trainer

Learn all **197 countries** — flags, capitals and where they are — on an interactive world map, in **English or French**.

- **Explore** the map: hover a country to see its name, click it for its flag, capital, a short history and 3 key facts.
- **Play** 6 game modes × 3 subjects (country name, capital, location) × 3 answer types (click the map, type, multiple choice).
- **Flags**: a flag pops up — write (or say, with the microphone) the country. *Practice* is endless with "show answer" and a letters hint; *Game* has 3 lives and 1 hint.
- **Facts**: read clues and guess the country (or its capital). *Normal* starts with the 3 key facts; *Hard* starts with 3 historical facts out of 20+ per country. Ask for more clues — each one costs points.
- **Capitals** display button (top right, next to *Names*): shows a dot and the name of every capital city on the map.
- **Capitals** button (in the menu): games only about capitals, including **Capital pin** (click where the city is — points by distance).
- **Endless (∞) or custom** number of questions in every quiz.
- **Study**: learn new countries for good. See the flag on the map → write the name → later, recall it from memory on a gray map (name, location, capital) → mistakes must be corrected and come back until you know them. Learned countries return for review after 1, 2, 4, 8… days (spaced repetition). Before the new countries you can choose a **recap**: a quiz on everything seen, or an automatic slideshow (map + flag + name, read aloud if you want) with a 0.75× – 4× speed slider. At the end, a **Final test** redoes the whole session in one go, from memory, with no second try: a mistake shows the answer (the place you clicked in red, the right country with its flag) and moves on.
- **Rush**: timed rounds — name as many countries as you can before the clock runs out. 5 types: *flag on the map*, *flag only*, *capitals*, *map hunt*, *survival*.
- **Party**: play Rush with up to 4 friends. The host picks the settings, everyone gets the same countries, live scoreboard, final ranking. Share a 5-letter room code or an invite link.
- **5 difficulty levels** (easy → very hard). Harder countries are worth more points (10 / 15 / 20 / 30 / 50) and every mode can be filtered by level.
- **Forgiving typing**: English or French, accents optional, typos and spellings that *sound* right are accepted ("Filipines", "Djibuti", "Kazakstan") — but never a different country ("Niger" ≠ Nigeria).
- **Track progress**: mark countries as known, keep a "hard list" that comes back more often, see your accuracy per subject.
- **Time on Atlas** (in *Progress*): this session, today, total and days used. Only active time counts — a quiet stretch of 5+ minutes is removed entirely.
- Explore: click a gray country to see its flag, click it again to put it back to gray.
- **Game memory**: games start with what you haven't been asked for a while, so they don't repeat. Clear it, or back up / restore all progress as a file, from *Progress*.

No framework, no build step: plain HTML, CSS and JavaScript modules.

---

## Run it locally

ES modules don't load from `file://`, so serve the folder with any static server:

```bash
npx serve .            # or: npm start
# or
python3 -m http.server 3000
```

Then open <http://localhost:3000>.

## Deploy on Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com/new), **Import** the repository.
3. Framework preset: **Other**. Leave build and output settings empty.
4. **Deploy.** Every push to `main` redeploys automatically.

`vercel.json` adds clean URLs and a few security headers. `.vercelignore` keeps tests and tooling out of the deployment.

---

## Project structure

```
index.html              Page markup (header, map, panels, dialogs)
favicon.svg
css/
  base.css              Design tokens (colours, fonts), reset, buttons
  map.css               Map, markers, labels, highlight layer, tooltip
  layout.css            Top bar, zoom buttons, legend, loader, toast
  panel.css             Country panel (explore mode)
  game.css              HUD, question card, flag match, rush card, scoreboard
  modals.css            Setup dialog, end screen, progress, confirm, party
  responsive.css        Tablet / phone layouts
js/
  main.js               Entry point: loads the map and wires everything together
  config.js             Constants: data URLs, lives/hints/skips, party, continents
  data/
    countries/*.js      One file per continent — the country data (EN + FR)
    facts/history-*.js  6 historical facts per country (EN + FR), for the Facts game
    facts/stats.js      GENERATED numbers & names (area, population, highest point…) — see tools/
    difficulty.js       Level 1–5 of every country and the points per level
    territories.js      Non-quizzable territories, overseas parts, merged shapes
    waters.js           Oceans & seas: names, label positions, rough outlines
  i18n/
    strings.js          All interface text in EN and FR
    i18n.js             t(), current language, name helpers
  core/
    store.js            Saved progress (localStorage) — swap point for a backend
    answers.js          Checks typed answers (aliases, accents, typos, sound-alikes)
    phonetic.js         Sound-alike key for EN/FR spellings
    speech.js           Speak / listen (Web Speech API)
    activity.js         Active time on the site (idle stretches removed)
    utils.js            Small helpers
  map/
    map-view.js         The map: drawing, zoom, labels, hover, public API
    map-data.js         Turns the TopoJSON into one record per country/territory
    flags.js            Flag fills (SVG patterns sized to each shape)
    highlight-layer.js  Hover lift, pulsing target and pins, on a separate layer
    water-shapes.js     Ocean/sea outlines → GeoJSON
    polylabel.js        Best label position inside a shape
  ui/
    country-panel.js    Explore panel
    setup-dialog.js     "Start a game" dialog and filters
    rush-settings.js    Rush settings form (shared by solo setup and party lobby)
    study-settings.js   Study settings form (deck, new per session, capitals, recap)
    form.js             Small declarative settings forms
    mode-forms.js       Settings of Flags, Facts and Capital pin (uses form.js)
    speed-slider.js     The stepped, smooth speed slider (recap slideshow)
    party-dialog.js     Party: create/join a room, lobby, countdown, results
    progress-panel.js   "My progress" dialog
    components.js       Flag image, toast, modal helpers
    icons.js            Inline SVG icons
  game/
    game.js             Session rules: lives, score, HUD, end screen, map setup
    question-round.js   Click / type / multiple-choice questions
    flag-match.js       Drag & drop flags
    pool.js             Which countries a game uses (filters, hard-list weighting)
    study.js            Study mode: see → write → recall → fix (active recall)
    srs.js              Spaced repetition: Leitner boxes + in-session queue (pure logic)
    rush.js             Timed Rush rounds (solo and party)
    recap.js            Study recap slideshow
    final-test.js       Final test at the end of a Study session
    flag-quiz.js        Flags mode (practice / game)
    facts.js            Facts mode (clues → country or capital)
    facts-pool.js       All clues for a country, with its names hidden
    capital-pin.js      Capital pin mode (distance scoring)
  net/
    peer-transport.js   PeerJS (WebRTC) loading and connections
    lobby.js            Party room: players, settings, start, scores, results
tools/
  build-stats.mjs       Rebuilds js/data/facts/stats.js from the CIA World Factbook + mledoze/countries
  facts-map.mjs         Rebuilds tools/factbook-map.json (which Factbook file is which country)
  factbook-map.json     Which Factbook file is which country
tests/
  data.test.mjs         Data integrity (runs in Node)
  e2e.test.mjs          Plays every mode in a headless browser
  answers.test.mjs      Typed-answer matching (runs in Node)
  rush.test.mjs         Every Rush type, scoring, hints, timer
  srs.test.mjs          Spaced-repetition scheduling (runs in Node)
  study.test.mjs        Study mode: see, write, recall, fix, reviews
  party.test.mjs        4 browsers in one room (+ a refused 5th)
  flags.test.mjs        Flags mode, endless & custom counts, game memory, backup
  facts.test.mjs        20+ clues per country, names never shown (runs in Node)
  facts-game.test.mjs   Facts game in the browser
  capitals.test.mjs     Capitals button and capital pin
  recap.test.mjs        Study recap: quiz first, slideshow and speed slider
  final-test.test.mjs   Final test after a Study session
  activity.test.mjs     Active time, click-again-to-gray, smooth wheel zoom
  peer-server.mjs       Local signaling server used by party.test.mjs
  helpers.mjs           Static server + browser setup for the tests
```

### How the pieces talk

```
main.js ──► MapView (map)         click on a place ──► CountryPanel (explore)
   │                                               └─► Game (when a game is running)
   ├──► SetupDialog ──onStart(config)──► Game ──► QuestionRound | FlagMatch
   │      (Play / Capitals)          ├──► Rush (timed modes)
   │                                 ├──► Study ──► Recap (slideshow)
   │                                 └──► FlagQuiz | Facts | CapitalPin (own screens)
   ├──► PartyDialog ──► Lobby (net/) ◄──WebRTC──► other players
   │         └──────► Rush (same countries for everyone)
   ├──► ProgressPanel
   └──► Store (all saved data), i18n (all text)
```

Modules never reach into each other's DOM: they talk through the small APIs exported at the bottom of each file (`MapView.setState(...)`, `Game.start(config)`, …). `main.js` passes callbacks between them so there are no circular imports.

### How Study mode helps you remember

| Technique | In the app |
|---|---|
| Active recall | You type the name and click the place from memory, with the map fully gray |
| Generation | You write each new name once while you look at it |
| Spacing | A new country is asked again only after other ones, with growing gaps (2 → 3 → 6 questions) |
| Mastery before moving on | Each new country must be recalled right twice; a mistake resets that |
| Immediate correction | After a mistake you must write / click the right answer before going on |
| Discrimination | Writing another country's name shows both flags side by side ("You wrote Niger: that's this flag") |
| Elaboration | Capital, neighbours (computed from the map borders) and a memorable fact for each country |
| Chunking + interleaving | At most 4 new countries at a time, mixed with reviews; easy → hard, grouped by region |
| Spaced repetition | Leitner boxes: right → 1, 2, 4, 8, 16, 32, 64 days; wrong → back to tomorrow |

Saved per country in `Store` (`srs` field). The scheduling is in `js/game/srs.js` and is covered by `tests/srs.test.mjs`.

### How Party works (no game server)

Players connect **directly to each other** over WebRTC using [PeerJS](https://peerjs.com). The free PeerJS cloud is only used for the handshake, so the site stays fully static on Vercel.

- The **host's browser is the referee** (star topology): it keeps the player list, picks the countries, collects scores and sends the results.
- The room code `ABCDE` is the host's PeerJS id `atlas197-ABCDE`; the invite link is `/?room=ABCDE`.
- Messages are listed at the top of `js/net/lobby.js`. Max 4 players (`CONFIG.PARTY_MAX_PLAYERS`).
- If the host leaves, the room closes. On very strict networks a direct connection can fail; switching network (e.g. phone hotspot) usually fixes it.

### Why the map is smooth

The map holds ~240 detailed country shapes. Redrawing them is the expensive part, so:

1. **Zoom/pan preview** — while you drag, scroll or pinch, the already-drawn map is moved as one GPU layer (`#map-layer`, a CSS transform). Nothing is redrawn. When the gesture settles (60 ms), the real transform is applied once and the map is redrawn crisp (`map-view.js` → `preview()` / `commit()`).
2. **Highlight layer** — hover "lift" and the pulsing outline of a game target are drawn on a separate transparent SVG (`highlight-layer.js`). Changing anything inside the main map would repaint all shapes; this layer only repaints one copied shape.
3. **No animation inside the main map SVG** — see the rule at the top of `css/map.css`.
4. **No backdrop blur** on the floating panels — it would be recomputed every frame while the map moves underneath.

Measured in headless Chromium while dragging the map: ~23 fps before → steady 60 fps after (18 → 60 fps with flags on).

---

## Editing content

**Fix or improve a country** — edit its entry in `js/data/countries/<continent>.js`. Each file starts with a description of the fields. Keep `history` to 3–5 sentences and `keyFacts` to exactly 3 items in both languages (the tests check this).

**Change a country's difficulty** — move its id to another list in `js/data/difficulty.js` (points per level are there too).

**Accept another spelling in typed answers** — add it to the country's `aliases` (or `capitalAliases`).

**Change interface text** — `js/i18n/strings.js`. Every key must exist in both `en` and `fr`.

**Add a language** — add a block to `strings.js`, add `{ xx: ... }` names to the data files, and a button in the language switch in `index.html`.

**Gameplay numbers** (lives, hints, skips, marker size threshold) — `js/config.js`.

**Facts game clues** — historical facts are in `js/data/facts/history-<region>.js` (6 per country, EN + FR; the country's name is hidden automatically). Numbers come from `stats.js`, which is generated:

```bash
git clone --depth 1 https://github.com/factbook/factbook.json /tmp/factbook
git clone --depth 1 https://github.com/mledoze/countries /tmp/countries
node tools/build-stats.mjs /tmp/factbook /tmp/countries
```

## Saved progress and a future backend

Everything the app saves goes through `js/core/store.js` (language, display preferences, known countries, hard list with weights, per-country statistics, study cards, game memory).

Progress is saved **per web address**: `atlas-197.vercel.app` and a Vercel preview address such as `atlas-197-abc123.vercel.app` do not share it (the app shows a warning on other addresses). *Progress › Back up* downloads everything as a file; *Restore* loads it back on any device. It currently uses `localStorage`. To add user accounts later, implement an adapter with `load()` and `save(state)` and call `Store.setAdapter(...)` — no other file needs to change. The comment at the top of `store.js` shows an example.

## Tests

```bash
npm install
npx playwright install chromium   # first time only
npm test
```

- `data.test.mjs` checks the data: 197 countries, unique ids, complete EN/FR texts, 3 facts each.
- `answers.test.mjs` checks typo / sound-alike tolerance and that no country is ever accepted for another one.
- `rush.test.mjs` plays every Rush type; `party.test.mjs` runs a 4-player party through a local signaling server.
- `e2e.test.mjs` plays every game mode (win and lose), hints, skips, drag & drop, the setup filters, the progress reset, both languages, and opens all 197 country panels.

The end-to-end tests load d3, the map and flags from their CDNs. Without internet, point `ATLAS_OFFLINE_VENDOR` to a folder containing `d3.min.js`, `topojson-client.min.js`, `countries-50m.json` and `peerjs.min.js`.

## Data sources

- Map shapes: [Natural Earth](https://www.naturalearthdata.com/) 1:50m (public domain) via the [world-atlas](https://github.com/topojson/world-atlas) package, loaded from jsDelivr.
- Flags: [flagcdn.com](https://flagcdn.com).
- Map rendering: [d3](https://d3js.org) v7 and [topojson-client](https://github.com/topojson/topojson-client).
- Country texts and historical facts were written for this project. Population figures in the panels are rounded estimates (~2024).
- Facts-game numbers (area, population, highest point, independence, anthem, capital coordinates…): [CIA World Factbook](https://www.cia.gov/the-world-factbook/) (public domain, via [factbook.json](https://github.com/factbook/factbook.json)) and [mledoze/countries](https://github.com/mledoze/countries) (ODbL) for currencies, languages, phone codes and web domains.

Continent grouping used by the quizzes: Russia and Cyprus → Europe; Turkey, Georgia, Armenia, Azerbaijan → Asia; Central America and the Caribbean → North America.
