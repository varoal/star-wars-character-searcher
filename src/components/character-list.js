/**
 * List of characters (name, birth year). Emits when a character is selected.
 *
 * @fires character-select - When the user selects a character.
 *   Detail: { character: SwapiPerson }
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
    `;
  }

  static get properties() {
    return {
      /** List of SWAPI person objects to display. */
      characters: { type: Array },
      /** One of UI_STATE.* for loading/empty/error. */
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
   * Dispatches a `character-select` event with the given character as detail.
   * @param {import('../services/swapi.js').SwapiPerson} character
   */
  _select(character) {
    debugger
    this.dispatchEvent(
      new CustomEvent('character-select', {
        detail: { character },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (this.state === 'loading') {
      return html`<p role="status" aria-live="polite">Loading…</p>`;
    }
    if (this.state === 'error') {
      return html`
        <p role="alert" class="error">
          ${this.errorMessage || 'Something went wrong.'}
        </p>
      `;
    }
    if (this.state === 'empty' || !this.characters.length) {
      return html`<p role="status">No characters found.</p>`;
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
          `
        )}
      </ul>
    `;
  }
}

customElements.define('character-list', CharacterList);
