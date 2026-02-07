import { expect, fixture, html } from '@open-wc/testing';
import './character-detail.js';

describe('character-detail', () => {
  const mockCharacter = { name: 'Luke', birth_year: '19BBY', gender: 'male' };

  it('renders a character detail', async () => {
    const el = await fixture(
      html`<character-detail .character=${mockCharacter}></character-detail>`,
    );

    const h2 = el.shadowRoot.querySelector('h2');
    expect(h2).to.exist;
    expect(h2.textContent).to.equal('Luke');

    const text = el.shadowRoot.textContent;
    expect(text).to.include('19BBY');
    expect(text).to.include('male');
  });

  it('renders character selection message', async () => {
    const el = await fixture(
      html`<character-detail .hasResults=${true}></character-detail>`,
    );

    const selectMessage = el.shadowRoot.querySelector('p');
    expect(selectMessage.textContent).to.equal(
      'Select a character to see details.',
    );
    expect(selectMessage).to.exist;
  });
});
