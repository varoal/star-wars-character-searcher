/**
 * Inline detail view for a single character (name, birth year, gender).
 * Renders nothing when no character is selected.
 */

import { LitElement, html, css } from 'lit';

export class CharacterDetail extends LitElement {
  static get styles() {
    return css`
      section {
        margin-top: 1rem;
      }
      dl {
        margin: 0.5rem 0;
      }
      dt {
        font-weight: bold;
        margin-top: 0.5rem;
      }
      dd {
        margin-left: 0;
      }
    `;
  }

  static get properties() {
    return {
      /** Selected character or null when none selected. */
      character: { type: Object },
      /** True when there are list results to select; shows "Select a character" prompt. */
      hasResults: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.character = null;
    this.hasResults = false;
  }

  render() {
    if (!this.character) {
      if (!this.hasResults) {
        return html``;
      }
      return html`<p aria-live="polite">Select a character to see details.</p>`;
    }

    const { name, birth_year, gender } = this.character;
    return html`
      <section aria-label="Character details">
        <h2>${name}</h2>
        <dl>
          <dt>Birth year</dt>
          <dd>${birth_year}</dd>
          <dt>Gender</dt>
          <dd>${gender}</dd>
        </dl>
      </section>
    `;
  }
}

customElements.define('character-detail', CharacterDetail);
