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
        padding: 0 1rem;
      }
    `;
  }

  static get properties() {
    return {
      _query: { type: String, state: true },
      _characters: { type: Array, state: true },
      _selected: { type: Object, state: true },
      _uiState: { type: String, state: true },
      _errorMessage: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this._query = '';
    this._characters = [];
    this._selected = null;
    this._uiState = UI_STATE.IDLE;
    this._errorMessage = '';
  }

  /**
   * @param {CustomEvent<{ query: string }>} e
   */
  _onSearch(e) {
    const query = e.detail?.query ?? '';
    this._query = query;
    this._selected = null;
    this._runSearch(query);
  }

  /**
   * @param {CustomEvent<{ character: import('./services/swapi.js').SwapiPerson }>} e
   */
  _onSelect(e) {
    this._selected = e.detail?.character ?? null;
  }

  /**
   * Fetches people for the given query and updates list state (characters, uiState, errorMessage).
   * @param {string} query
   */
  async _runSearch(query) {
    this._uiState = UI_STATE.LOADING;
    this._errorMessage = '';

    const result = await getPeople(query);

    if (!result.ok) {
      this._uiState = UI_STATE.ERROR;
      this._errorMessage = result.error || 'Request failed';
      this._characters = [];
      return;
    }

    const data = result.data || [];
    this._characters = data;
    this._uiState = data.length ? UI_STATE.SUCCESS : UI_STATE.EMPTY;
  }

  render() {
    const loading = this._uiState === UI_STATE.LOADING;

    return html`
      <main
        @character-search=${this._onSearch}
        @character-select=${this._onSelect}
      >
        <h1>Star Wars Character Search</h1>

        <character-search ?disabled=${loading}></character-search>

        <character-list
          .characters=${this._characters}
          .state=${this._uiState}
          .errorMessage=${this._errorMessage}
        ></character-list>

        <character-detail
          .character=${this._selected}
          .hasResults=${this._characters.length > 0}
        ></character-detail>
      </main>
    `;
  }
}

customElements.define('star-wars-character-search', StarWarsCharacterSearch);
