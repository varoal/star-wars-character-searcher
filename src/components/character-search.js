/**
 * Search input for character name. Dispatches character-search on input (debounced) and on Enter.
 *
 * @fires character-search - On input change (debounced ~300ms) or Enter. Detail: { query: string }
 */
import { LitElement, html, css } from 'lit';

const DEBOUNCE_MS = 300;

export class CharacterSearch extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      input:focus {
        outline: none;
        border-color: #666;
      }
    `;
  }

  static get properties() {
    return {
      /** Current input value. */
      value: { type: String },
      /** Timeout id from setTimeout; cleared on next input or Enter to cancel pending search. */
      _debounceId: { type: Number, state: true },
    };
  }

  constructor() {
    super();
    this.value = '';
    this._debounceId = 0;
  }

  _emitSearch(query) {
    this.dispatchEvent(
      new CustomEvent('character-search', {
        detail: { query },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onInput(e) {
    this.value = e.target.value;
    const query = (this.value || '').trim();
    clearTimeout(this._debounceId);
    if (query === '') {
      this._emitSearch('');
      return;
    }
    this._debounceId = window.setTimeout(() => {
      this._emitSearch(query);
    }, DEBOUNCE_MS);
  }

  _onSubmit(e) {
    e.preventDefault();
    clearTimeout(this._debounceId);
    this._debounceId = 0;
    this._emitSearch((this.value || '').trim());
  }

  render() {
    return html`
      <form @submit=${this._onSubmit}>
        <input
          type="search"
          .value=${this.value}
          @input=${this._onInput}
          placeholder="Search by name..."
          aria-label="Search characters by name"
        />
      </form>
    `;
  }
}

customElements.define('character-search', CharacterSearch);
