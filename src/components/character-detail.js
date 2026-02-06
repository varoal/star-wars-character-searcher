/**
 * Inline detail view for a single character (name, birth year, gender).
 * Renders nothing when no character is selected.
 */

import { LitElement, html, css } from 'lit';

export class CharacterDetail extends LitElement {
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
      .prompt {
        padding: 1rem;
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 6px;
      }
      section {
        padding: 1rem;
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 6px;
      }
      h2 {
        margin: 0 0 0.75rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a1a1a;
      }
      dl {
        margin: 0;
      }
      dt {
        font-size: 0.8rem;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        margin-top: 0.5rem;
      }
      dt:first-of-type {
        margin-top: 0;
      }
      dd {
        margin: 0.15rem 0 0 0;
        font-size: 1rem;
        color: #1a1a1a;
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
      return html`<p class="prompt" aria-live="polite">Select a character to see details.</p>`;
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
