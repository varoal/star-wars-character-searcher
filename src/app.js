/**
 * Star Wars Character Search app shell: orchestrates search, list, and detail.
 * Owns UI state and calls the SWAPI service. Communicates with children via props and custom events.
 */
import { LitElement, html, css } from 'lit';
import { getPeople } from './services/swapi.js';
import { UI_STATE } from './lib/ui-states.js';
import './components/character-search.js';
import './components/character-list.js';
import './components/character-detail.js';

export class StarWarsCharacterSearch extends LitElement {
  static get styles() {
    return css`
      main {
        font-family: system-ui, sans-serif;
        max-width: 40rem;
        margin: 2rem auto;
        padding: 0 1.5rem;
      }
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1.25rem 0;
        color: #1a1a1a;
      }
      character-search {
        display: block;
        margin-bottom: 1.5rem;
      }
      character-list {
        display: block;
        margin-bottom: 1.5rem;
      }
      character-detail {
        display: block;
      }
      .helper {
        margin: 0 0 1.5rem 0;
        font-size: 0.85rem;
        color: #666;
      }
    `;
  }

  static get properties() {
    return {
      /** Current search query. */
      _query: { type: String, state: true },
      /** First-page results from SWAPI for the current query. */
      _characters: { type: Array, state: true },
      /** Currently selected character. */
      _selected: { type: Object, state: true },
      /** One of UI_STATE (idle, loading, success, empty, error). */
      _uiState: { type: String, state: true },
      /** User-facing error message when _uiState is error. */
      _errorMessage: { type: String, state: true },
      /** True when the API response included a next-page URL. */
      _hasNextPage: { type: Boolean, state: true },
      /** Total match count from API (all pages); used for "Showing X of Y". */
      _totalCount: { type: Number, state: true },
      /** In-memory cache: key = normalized query, value = { data, hasNext, count }. */
      _searchCache: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this._query = '';
    this._characters = [];
    this._selected = null;
    this._uiState = UI_STATE.IDLE;
    this._errorMessage = '';
    this._hasNextPage = false;
    this._totalCount = 0;
    this._searchCache = {};
  }

  /**
   * @param {CustomEvent<{ query: string }>} e
   */
  _onSearch(e) {
    const query = String(e.detail?.query ?? '').trim();
    this._query = query;
    this._selected = null;
    if (query === '') {
      this._characters = [];
      this._uiState = UI_STATE.IDLE;
      this._errorMessage = '';
      this._hasNextPage = false;
      this._totalCount = 0;
      return;
    }
    this._runSearch(query);
  }

  /**
   * @param {CustomEvent<{ character: import('./services/swapi.js').SwapiPerson }>} e
   */
  _onSelect(e) {
    this._selected = e.detail?.character ?? null;
  }

  /**
   * Fetches people for the given query (cache hit skips API), updates list state.
   * @param {string} query
   */
  async _runSearch(query) {
    const key = query.toLowerCase();
    const cached = this._searchCache[key];
    if (cached !== undefined) {
      this._characters = cached.data;
      this._uiState = cached.data.length ? UI_STATE.SUCCESS : UI_STATE.EMPTY;
      this._errorMessage = '';
      this._hasNextPage = cached.hasNext;
      this._totalCount = cached.count ?? 0;
      return;
    }

    this._uiState = UI_STATE.LOADING;
    this._errorMessage = '';
    this._hasNextPage = false;
    this._totalCount = 0;

    const result = await getPeople(query);

    if (!result.ok) {
      this._uiState = UI_STATE.ERROR;
      this._errorMessage = result.error || 'Request failed';
      this._characters = [];
      return;
    }

    const data = result.data || [];
    const hasNext = Boolean(result.hasNext);
    const count = typeof result.count === 'number' ? result.count : data.length;
    this._searchCache[key] = { data, hasNext, count };
    this._characters = data;
    this._uiState = data.length ? UI_STATE.SUCCESS : UI_STATE.EMPTY;
    this._hasNextPage = hasNext;
    this._totalCount = count;
  }

  render() {
    return html`
      <main
        @character-search=${this._onSearch}
        @character-select=${this._onSelect}
      >
        <h1>Star Wars Character Search</h1>

        <character-search></character-search>

        <character-list
          .characters=${this._characters}
          .state=${this._uiState}
          .errorMessage=${this._errorMessage}
        ></character-list>
        ${this._characters.length
          ? html`
              <p class="helper">
                Showing ${this._characters.length} of ${this._totalCount} result${this._totalCount === 1 ? '' : 's'}.
                ${this._hasNextPage ? ' First page only.' : ''}
              </p>
            `
          : ''}

        <character-detail
          .character=${this._selected}
          .hasResults=${this._characters.length > 0}
        ></character-detail>
      </main>
    `;
  }
}

customElements.define('star-wars-character-search', StarWarsCharacterSearch);
