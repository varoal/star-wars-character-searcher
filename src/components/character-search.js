/**
 * Search input for character name. Dispatches a custom event on submit/search.
 *
 * @fires character-search - When the user submits a search (Enter or button).
 *   Detail: { query: string }
 */
import { LitElement, html, css } from 'lit';

export class CharacterSearch extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      form {
        display: flex;
        gap: 0.5rem;
      }
      input {
        flex: 1;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
      }
      input:focus {
        outline: none;
        border-color: #666;
      }
      button {
        padding: 0.5rem 1rem;
        border: 1px solid #666;
        border-radius: 4px;
        background: #f5f5f5;
        font-size: 1rem;
        cursor: pointer;
      }
      button:hover:not(:disabled) {
        background: #eee;
      }
      button:focus {
        outline: none;
        border-color: #333;
      }
    `;
  }

  static get properties() {
    return {
      /** Current input value (controlled from parent if needed). */
      value: { type: String },
      /** Disable input and button while loading. */
      disabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.disabled = false;
  }

  /**
   * Handles input changes and updates the value property.
   * @param {InputEvent} e - Input event from the search field.
   * @private
   */
  _onInput(e) {
    this.value = e.target.value;
  }

  /**
   * Handles form submission, dispatches the character-search event with the query.
   * @param {Event} e - Submit event from the form.
   * @private
   */
  _onSubmit(e) {
    e.preventDefault();
    const query = (this.value || '').trim();
    this.dispatchEvent(
      new CustomEvent('character-search', {
        detail: { query },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <form @submit=${this._onSubmit}>
        <input
          type="search"
          .value=${this.value}
          @input=${this._onInput}
          placeholder="Search by name..."
          ?disabled=${this.disabled}
          aria-label="Search characters by name"
        />
        <button type="submit" ?disabled=${this.disabled}>Search</button>
      </form>
    `;
  }
}

customElements.define('character-search', CharacterSearch);
