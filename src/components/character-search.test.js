import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './character-search.js';

describe('character-search', () => {
  it('emits character-search with empty query when value cleared', async () => {
    const el = await fixture(html`<character-search></character-search>`);
    const listener = oneEvent(el, 'character-search');

    const input = el.shadowRoot.querySelector('input');
    input.value = '';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    const event = await listener;
    expect(event.detail.query).to.equal('');
  });

  it('emits character-search with trimmed query after debounce', async () => {
    const el = await fixture(html`<character-search></character-search>`);
    const listener = oneEvent(el, 'character-search');

    const input = el.shadowRoot.querySelector('input');
    input.value = '  Luke  ';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;

    await new Promise((resolve) => setTimeout(resolve, 350));

    const event = await listener;
    expect(event.detail.query).to.equal('Luke');
  });

  it('emits character-search immediately on form submit', async () => {
    const el = await fixture(html`<character-search></character-search>`);
    const listener = oneEvent(el, 'character-search');

    const form = el.shadowRoot.querySelector('form');
    el.value = 'Leia';
    await el.updateComplete;
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true }));
    await el.updateComplete;

    const event = await listener;
    expect(event.detail.query).to.equal('Leia');
  });
});