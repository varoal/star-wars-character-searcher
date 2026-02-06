# Star Wars Character Search

Take-home frontend assignment: **Lit** (Web Components) and vanilla JavaScript. Search Star Wars characters by name and view details; data from [SWAPI](https://swapi.dev/documentation). Architecture and styling kept simple to fit the intended scope (~4h).

## Trade-offs

- **Pagination**: SWAPI supports pagination; this app shows the first page only. No “next/previous” UI or logic—keeps scope focused on search, list, and detail. Helper text (“First page of results only”) appears only when the API indicates more pages exist.
- **Tests**: Next step would be adding a small test setup (e.g. OpenWC + test runner).
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
│   └── character-detail.js # Inline detail (name, birth year, gender)
├── services/
│   └── swapi.js            # getPeople(search) — fetch + error handling
└── lib/
    └── ui-states.js        # UI_STATE: idle, loading, success, empty, error
```

- **Data & errors**: All SWAPI access goes through `services/swapi.js`. UI states (idle, loading, success, empty, error) are explicit and drive list/detail messaging.
- **Cache & debounce**: In-memory cache lives in the app root. Search runs on input change with a simple ~300ms debounce in `character-search` (no extra libs).
- **Communication**: Parent passes data via properties; children emit `character-search` and `character-select` custom events.
- **JSDoc**: Used for SWAPI types, service result shape, and custom event contracts.

## Scripts


| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |


