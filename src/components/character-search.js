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
      form {
        display: flex;
        gap: 0.5rem;
        margin: 1rem 0;
      }
      input {
        flex: 1;
        padding: 0.25rem 0.5rem;
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
