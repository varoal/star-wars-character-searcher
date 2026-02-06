# Star Wars Character Search

A small frontend assignment built with **Lit** (Web Components) and vanilla JavaScript. Search Star Wars characters by name and view details; data is fetched from [SWAPI](https://swapi.dev/documentation).
> Scope note: This solution intentionally keeps the architecture and styling simple to match the expected ~4h implementation time.
> The search is submit-based for simplicity; adding a debounced "search-as-you-type" flow would be a natural next step.


## Run the app

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (e.g. http://localhost:5173).

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
- **Communication**: Parent passes data via properties; children emit `character-search` and `character-select` custom events.
- **JSDoc**: Used for SWAPI types, service result shape, and custom event contracts.

## Scripts

| Command     | Description        |
|------------|--------------------|
| `npm run dev`    | Start dev server   |
| `npm run build`  | Production build   |
| `npm run preview`| Preview production build |
