# Atlas 197 — World Geography Trainer

Learn all **197 countries** — flags, capitals and where they are — on an interactive world map, in **English or French**.

- **Explore** the map: hover a country to see its name, click it for its flag, capital, a short history and 3 key facts.
- **Play** 6 game modes × 3 subjects (country name, capital, location) × 3 answer types (click the map, type, multiple choice).
- **Rush**: timed rounds — name as many countries as you can before the clock runs out. 5 types: *flag on the map*, *flag only*, *capitals*, *map hunt*, *survival*.
- **Party**: play Rush with up to 4 friends. The host picks the settings, everyone gets the same countries, live scoreboard, final ranking. Share a 5-letter room code or an invite link.
- **5 difficulty levels** (easy → very hard). Harder countries are worth more points (10 / 15 / 20 / 30 / 50) and every mode can be filtered by level.
- **Forgiving typing**: English or French, accents optional, typos and spellings that *sound* right are accepted ("Filipines", "Djibuti", "Kazakstan") — but never a different country ("Niger" ≠ Nigeria).
- **Track progress**: mark countries as known, keep a "hard list" that comes back more often, see your accuracy per subject.

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
    utils.js            Small helpers
  map/
    map-view.js         The map: drawing, zoom, labels, hover, public API
    map-data.js         Turns the TopoJSON into one record per country/territory
    flags.js            Flag fills (SVG patterns sized to each shape)
    highlight-layer.js  Hover lift + pulsing target, on a separate layer
    water-shapes.js     Ocean/sea outlines → GeoJSON
    polylabel.js        Best label position inside a shape
  ui/
    country-panel.js    Explore panel
    setup-dialog.js     "Start a game" dialog and filters
    rush-settings.js    Rush settings form (shared by solo setup and party lobby)
    party-dialog.js     Party: create/join a room, lobby, countdown, results
    progress-panel.js   "My progress" dialog
    components.js       Flag image, toast, modal helpers
    icons.js            Inline SVG icons
  game/
    game.js             Session rules: lives, score, HUD, end screen, map setup
    question-round.js   Click / type / multiple-choice questions
    flag-match.js       Drag & drop flags
    pool.js             Which countries a game uses (filters, hard-list weighting)
    rush.js             Timed Rush rounds (solo and party)
  net/
    peer-transport.js   PeerJS (WebRTC) loading and connections
    lobby.js            Party room: players, settings, start, scores, results
tests/
  data.test.mjs         Data integrity (runs in Node)
  e2e.test.mjs          Plays every mode in a headless browser
  answers.test.mjs      Typed-answer matching (runs in Node)
  rush.test.mjs         Every Rush type, scoring, hints, timer
  party.test.mjs        4 browsers in one room (+ a refused 5th)
  peer-server.mjs       Local signaling server used by party.test.mjs
  helpers.mjs           Static server + browser setup for the tests
```

### How the pieces talk

```
main.js ──► MapView (map)         click on a place ──► CountryPanel (explore)
   │                                               └─► Game (when a game is running)
   ├──► SetupDialog ──onStart(config)──► Game ──► QuestionRound | FlagMatch
   │                                 └──► Rush (timed modes)
   ├──► PartyDialog ──► Lobby (net/) ◄──WebRTC──► other players
   │         └──────► Rush (same countries for everyone)
   ├──► ProgressPanel
   └──► Store (all saved data), i18n (all text)
```

Modules never reach into each other's DOM: they talk through the small APIs exported at the bottom of each file (`MapView.setState(...)`, `Game.start(config)`, …). `main.js` passes callbacks between them so there are no circular imports.

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

## Saved progress and a future backend

Everything the app saves goes through `js/core/store.js` (language, display preferences, known countries, hard list with weights, per-country statistics). It currently uses `localStorage`. To add user accounts later, implement an adapter with `load()` and `save(state)` and call `Store.setAdapter(...)` — no other file needs to change. The comment at the top of `store.js` shows an example.

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
- Country texts were written for this project. Population figures are rounded estimates (~2024).

Continent grouping used by the quizzes: Russia and Cyprus → Europe; Turkey, Georgia, Armenia, Azerbaijan → Asia; Central America and the Caribbean → North America.
