# Atlas 197 — World Geography Trainer

Learn all **197 countries** — flags, capitals and where they are — on an interactive world map, in **English or French**.

- **Explore** the map: hover a country to see its name, click it for its flag, capital, a short history and 3 key facts.
- **Play** 6 game modes × 3 subjects (country name, capital, location) × 3 answer types (click the map, type, multiple choice).
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
  game.css              HUD, question card, flag match
  modals.css            Setup dialog, end screen, progress, confirm
  responsive.css        Tablet / phone layouts
js/
  main.js               Entry point: loads the map and wires everything together
  config.js             Constants: data URLs, lives/hints/skips, continents
  data/
    countries/*.js      One file per continent — the country data (EN + FR)
    territories.js      Non-quizzable territories, overseas parts, merged shapes
    waters.js           Oceans & seas: names, label positions, rough outlines
  i18n/
    strings.js          All interface text in EN and FR
    i18n.js             t(), current language, name helpers
  core/
    store.js            Saved progress (localStorage) — swap point for a backend
    answers.js          Checks typed answers (aliases, accents, small typos)
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
    progress-panel.js   "My progress" dialog
    components.js       Flag image, toast, modal helpers
    icons.js            Inline SVG icons
  game/
    game.js             Session rules: lives, score, HUD, end screen, map setup
    question-round.js   Click / type / multiple-choice questions
    flag-match.js       Drag & drop flags
    pool.js             Which countries a game uses (filters, hard-list weighting)
tests/
  data.test.mjs         Data integrity (runs in Node)
  e2e.test.mjs          Plays every mode in a headless browser
  helpers.mjs           Static server + browser setup for the tests
```

### How the pieces talk

```
main.js ──► MapView (map)         click on a place ──► CountryPanel (explore)
   │                                               └─► Game (when a game is running)
   ├──► SetupDialog ──onStart(config)──► Game ──► QuestionRound | FlagMatch
   ├──► ProgressPanel
   └──► Store (all saved data), i18n (all text)
```

Modules never reach into each other's DOM: they talk through the small APIs exported at the bottom of each file (`MapView.setState(...)`, `Game.start(config)`, …). `main.js` passes callbacks between them so there are no circular imports.

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
- `e2e.test.mjs` plays every game mode (win and lose), hints, skips, drag & drop, the setup filters, the progress reset, both languages, and opens all 197 country panels.

The end-to-end tests load d3, the map and flags from their CDNs. Without internet, point `ATLAS_OFFLINE_VENDOR` to a folder containing `d3.min.js`, `topojson-client.min.js` and `countries-50m.json`.

## Data sources

- Map shapes: [Natural Earth](https://www.naturalearthdata.com/) 1:50m (public domain) via the [world-atlas](https://github.com/topojson/world-atlas) package, loaded from jsDelivr.
- Flags: [flagcdn.com](https://flagcdn.com).
- Map rendering: [d3](https://d3js.org) v7 and [topojson-client](https://github.com/topojson/topojson-client).
- Country texts were written for this project. Population figures are rounded estimates (~2024).

Continent grouping used by the quizzes: Russia and Cyprus → Europe; Turkey, Georgia, Armenia, Azerbaijan → Asia; Central America and the Caribbean → North America.
