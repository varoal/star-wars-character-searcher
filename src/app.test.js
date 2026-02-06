import { expect, fixture, html, elementUpdated } from '@open-wc/testing';
import './app.js';

describe('star-wars-character-search', () => {
  it('renders the initial idle state accordingly', async () => {
    const el = await fixture(html`<star-wars-character-search></star-wars-character-search>`);
    await elementUpdated(el);
    const main = el.shadowRoot.querySelector('main');
    expect(main).to.exist;
    const list = el.shadowRoot.querySelector('character-list');
    expect(list).to.exist;
    expect(list.state).to.equal('idle');
  });
});
