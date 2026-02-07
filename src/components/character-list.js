/**
 * List of characters (name, birth year). Emits when a character is selected.
 *
 * @fires character-select - When the user selects a character.
 *   Detail: { character: SwapiPerson } (see services/swapi.js)
 */

import { LitElement, html, css } from 'lit';

export class CharacterList extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      p {
        margin: 0;
        color: #555;
        font-size: 0.95rem;
      }
      .list-wrap {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 6px;
        padding: 0.75rem;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        margin-bottom: 0.375rem;
      }
      li:last-child {
        margin-bottom: 0;
      }
      button {
        width: 100%;
        text-align: left;
        padding: 0.5rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 4px;
        background: #fff;
        font-size: 1rem;
        cursor: pointer;
        display: block;
      }
      button:hover {
        background: #eee;
        border-color: #e0e0e0;
      }
      button:focus {
        outline: 2px solid #666;
        outline-offset: 2px;
      }
      .error {
        color: #b00;
        margin: 0;
        padding: 0.75rem;
        background: #fef5f5;
        border: 1px solid #f0d0d0;
        border-radius: 6px;
      }
      .error p {
        margin: 0 0 0.25rem 0;
        color: inherit;
      }
      .error p:last-child {
        margin-bottom: 0;
        font-size: 0.9rem;
      }
      .loading {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        padding: 0.75rem;
        color: #555;
      }
      .spinner {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid #ddd;
        border-top-color: #333;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;
  }

  static get properties() {
    return {
      /** List of SWAPI person objects to display. */
      characters: { type: Array },
      /** One of UI_STATE.* (idle, loading, success, empty, error). */
      state: { type: String },
      /** Optional error message when state is 'error'. */
      errorMessage: { type: String },
    };
  }

  constructor() {
    super();
    this.characters = [];
    this.state = 'idle';
    this.errorMessage = '';
  }

  /**
   * Emits character-select event with the selected character.
   * @param {import('../services/swapi.js').SwapiPerson} character
   * @private
   */
  _select(character) {
    this.dispatchEvent(
      new CustomEvent('character-select', {
        detail: { character },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Maps state to corresponding render method.
   * @private
   */
  get _stateRenderers() {
    return {
      loading: () => this._renderLoading(),
      error: () => this._renderError(),
      idle: () => this._renderIdle(),
      empty: () => this._renderEmpty(),
    };
  }

  /**
   * Renders the appropriate UI based on the current state.
   * @private
   */
  _renderContent() {
    const renderer =
      this._stateRenderers[this.state] || (() => this._renderList());
    return renderer();
  }

  /**
   * Renders loading spinner.
   * @private
   */
  _renderLoading() {
    return html`
      <div class="loading" role="status">
        <span class="spinner" aria-hidden="true"></span>
        <span>Loading…</span>
      </div>
    `;
  }

  /**
   * Renders error message.
   * @private
   */
  _renderError() {
    return html`
      <div role="alert" class="error">
        <p>
          <strong>${this.errorMessage || 'Something went wrong.'}</strong>
        </p>
        <p>You can try another search.</p>
      </div>
    `;
  }

  /**
   * Renders idle prompt.
   * @private
   */
  _renderIdle() {
    return html`
      <p role="status" class="list-wrap">
        Enter a name and click Search to find characters.
      </p>
    `;
  }

  /**
   * Renders empty state message.
   * @private
   */
  _renderEmpty() {
    return html`
      <p role="status" class="list-wrap">
        No characters found. Try a different name.
      </p>
    `;
  }

  /**
   * Renders the character list.
   * @private
   */
  _renderList() {
    return html`
      <div class="list-wrap">
        <ul>
          ${this.characters.map(
            (c) => html`
              <li>
                <button type="button" @click=${() => this._select(c)}>
                  ${c.name}
                </button>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }

  render() {
    return this._renderContent();
  }
}

customElements.define('character-list', CharacterList);
