# Star Wars Character Searcher

Take-home frontend assignment: **Lit** (Web Components) and vanilla JavaScript. Search Star Wars characters by name and view details; data from [SWAPI](https://swapi.dev/documentation). Architecture and styling kept simple to fit the intended scope (~4h).

## Trade-offs

- **Pagination**: SWAPI supports pagination, but the app intentionally shows results from the first page only. There is no next or previous UI or pagination logic, in order to keep the scope focused on the core search, list, and detail flow. When the API response includes a next value, the UI displays a small helper message indicating that more results exist and that only the first page is being shown (“Showing X of Y results”).
- **Tests**: The project includes a small set of tests using @open-wc/testing and @web/test-runner. The goal is to validate real user-facing behavior rather than testing internal implementation details. Tests can be run with `npm run test`.
- **Cache & debounce**: A small in-memory cache and a ~300ms debounce on the search input are included. This avoids unnecessary API calls and keeps the input responsive, without adding extra libraries or persistence (for example, no localStorage).
- **Data mapping**: A `SwapiPerson` type is defined, but API responses are currently consumed directly without an explicit mapping layer. This keeps the service lightweight for a small project at the cost of coupling the UI more directly to the SWAPI response format.

## Run the app

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (e.g. [http://localhost:5173](http://localhost:5173)).

## File structure

```
src/
├── components/
│   ├── character-search.js      # Search input with debounce, emits character-search
│   ├── character-search.test.js # Behavior tests
│   ├── character-list.js        # Results list and UI state rendering
│   ├── character-list.test.js   # UI tests
│   ├── character-detail.js      # Inline character detail view
│   └── character-detail.test.js # UI tests
├── lib/
│   └── ui-states.js             # Shared UI state constants
├── services/
│   ├── swapi.js                 # SWAPI access and error handling
│   └── swapi.test.js            # Service tests with mocked fetch
├── app.js                       # Root component, owns state and orchestrates the flow
├── app.test.js                  # Behavior tests for main user flows
└── main.js                      # Entry point

```

- **Data & errors**: All SWAPI access goes through `services/swapi.js`. UI states (idle, loading, success, empty, error) are explicit.
- **Cache & debounce**: In-memory cache lives in the app root. Search runs on input change with a simple ~300ms debounce in `character-search`.
- **Communication**: Parent passes data via properties; children emit `character-search` and `character-select` custom events.
- **JSDoc**: JSDoc comments are used where they add value to the developer experience, mainly to document service return values, and the custom events shared between components.

## Scripts

| Command              | Description                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`        | Start dev server                                                                                                                |
| `npm run build`      | Production build                                                                                                                |
| `npm run preview`    | Preview production build                                                                                                        |
| `npm run test`       | Run headless tests with coverage. Generates a coverage report at `coverage/lcov-report/index.html` (open in a browser to view). |
| `npm run test:watch` | Run tests in watch mode                                                                                                         |
