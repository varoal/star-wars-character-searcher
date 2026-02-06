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
      ul {
        list-style: none;
        margin: 1rem 0;
        padding: 0;
      }
      li {
        margin-bottom: 0.25rem;
      }
      button {
        width: 100%;
        text-align: left;
        padding: 0.25rem 0.5rem;
      }
      .error {
        color: #c00;
        margin: 1rem 0;
      }
      .loading {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem 0;
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

  render() {
    if (this.state === 'loading') {
      return html`
        <div class="loading" role="status">
          <span class="spinner" aria-hidden="true"></span>
          <span>Loading…</span>
        </div>
      `;
    }
    if (this.state === 'error') {
      return html`
        <div role="alert" class="error">
          <p>
            <strong>${this.errorMessage || 'Something went wrong.'}</strong>
          </p>
          <p>You can try another search.</p>
        </div>
      `;
    }
    if (this.state === 'idle') {
      return html`
        <p role="status">Enter a name and click Search to find characters.</p>
      `;
    }
    if (this.state === 'empty' || !this.characters.length) {
      return html`
        <p role="status">No characters found. Try a different name.</p>
      `;
    }

    return html`
      <ul>
        ${this.characters.map(
          (c) => html`
            <li>
              <button
                type="button"
                @click=${() => this._select(c)}
                data-name="${c.name}"
              >
                ${c.name} — ${c.birth_year}
              </button>
            </li>
          `,
        )}
      </ul>
    `;
  }
}

customElements.define('character-list', CharacterList);
