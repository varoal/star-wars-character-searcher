import { expect, fixture, html } from '@open-wc/testing';
import './character-list.js';

describe('character-list', () => {
  it('shows list and dispatches character-select on click', async () => {
    const chars = [{ name: 'Luke', birth_year: '19BBY', gender: 'male' }];
    const el = await fixture(html`
      <character-list .state=${'success'} .characters=${chars}></character-list>
    `);
    let detail;
    el.addEventListener('character-select', (e) => (detail = e.detail));
    const btn = el.shadowRoot.querySelector('button');
    expect(btn).to.exist;
    btn.click();
    expect(detail.character.name).to.equal('Luke');
  });
});
