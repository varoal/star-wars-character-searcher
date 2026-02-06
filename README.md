# Star Wars Character Search

Take-home frontend assignment: **Lit** (Web Components) and vanilla JavaScript. Search Star Wars characters by name and view details; data from [SWAPI](https://swapi.dev/documentation). Architecture and styling kept simple to fit the intended scope (~4h).

## Trade-offs

- **Pagination**: SWAPI supports pagination; this app shows the first page only. No “next/previous” UI or logic—keeps scope focused on search, list, and detail. Helper text (“First page of results only”) appears only when the API indicates more pages exist.
- **Tests**: @open-wc/testing + @web/test-runner (Puppeteer/Chromium). Minimal coverage: **service** (getPeople with mocked fetch—success, error), **character-list** (idle message + list click dispatches `character-select`), and **app** (initial render shows idle state). Run with `npm run test`.
- **Cache & debounce**: A small in-memory cache (plain object keyed by normalized query) and an inline ~300ms debounce on the search input are included. Both are minimal (no extra libraries), reduce API calls, and keep the input responsive; cache is not persisted (e.g. no localStorage).

## Run the app

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (e.g. [http://localhost:5173](http://localhost:5173)).

## File structure

```
src/
├── main.js                 # Entry: registers <star-wars-character-search>
├── app.js                  # Root: StarWarsCharacterSearch, owns state, wires search/list/detail
├── components/
│   ├── character-search.js # Search input; dispatches character-search
│   ├── character-list.js   # Results list; dispatches character-select
│   ├── character-list.test.js # list characters and dispatches selection
│   └── character-detail.js # Inline detail (name, birth year, gender)
├── services/
│   ├── swapi.js            # getPeople(search) — fetch + error handling
│   └── swapi.test.js       # getPeople with mocked fetch
├── app.test.js             # idle state
└── lib/
    └── ui-states.js        # UI_STATE: idle, loading, success, empty, error
```

- **Data & errors**: All SWAPI access goes through `services/swapi.js`. UI states (idle, loading, success, empty, error) are explicit.
- **Cache & debounce**: In-memory cache lives in the app root. Search runs on input change with a simple ~300ms debounce in `character-search` (no extra libs).
- **Communication**: Parent passes data via properties; children emit `character-search` and `character-select` custom events.
- **JSDoc**: Used for SWAPI types, service result shape, and custom event contracts.

## Scripts


| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start dev server         |
| `npm run build`      | Production build         |
| `npm run preview`    | Preview production build |
| `npm run test`       | Run tests (headless)     |
| `npm run test:watch` | Run tests in watch mode  |


