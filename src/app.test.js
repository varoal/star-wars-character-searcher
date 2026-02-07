import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import './app.js';

describe('star-wars-character-searcher', () => {
  const mockCharacters = [
    { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male' },
    { name: 'Leia Organa', birth_year: '19BBY', gender: 'female' },
  ];

  it('searches when user types in search input', async () => {
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          count: 2,
          next: null,
          results: mockCharacters,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');
    input.value = '  L  ';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    const list = el.shadowRoot.querySelector('character-list');
    expect(list.state).to.equal('success');
    expect(list.characters).to.have.lengthOf(2);
  });

  it('clears state and resets to idle when user clears search after getting results', async () => {
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          count: 2,
          next: 'https://swapi.dev/api/people/?search=Luke&page=2',
          results: mockCharacters,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');

    input.value = 'Luke';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    let list = el.shadowRoot.querySelector('character-list');
    expect(list.state).to.equal('success');
    expect(list.characters).to.have.lengthOf(2);
    let helper = el.shadowRoot.querySelector('.helper');
    expect(helper.textContent).to.include('First page only');

    input.value = '';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;

    list = el.shadowRoot.querySelector('character-list');
    expect(list.state).to.equal('idle');
    expect(list.characters).to.have.lengthOf(0);
    helper = el.shadowRoot.querySelector('.helper');
    expect(helper).to.not.exist;
  });

  it('shows selected character in detail when user clicks a result', async () => {
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          count: 2,
          next: null,
          results: mockCharacters,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');
    input.value = 'Luke';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    const list = el.shadowRoot.querySelector('character-list');
    const firstButton = list.shadowRoot.querySelector('button');
    firstButton.click();
    await el.updateComplete;

    const detail = el.shadowRoot.querySelector('character-detail');
    const heading = detail.shadowRoot.querySelector('h2');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Luke Skywalker');
  });

  it('clears detail when character-select has no character', async () => {
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          count: 2,
          next: null,
          results: mockCharacters,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');
    input.value = 'Luke';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    const list = el.shadowRoot.querySelector('character-list');
    list.shadowRoot.querySelector('button').click();
    await el.updateComplete;

    el.shadowRoot.querySelector('main').dispatchEvent(
      new CustomEvent('character-select', {
        detail: {},
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    const detail = el.shadowRoot.querySelector('character-detail');
    expect(detail.shadowRoot.querySelector('h2')).to.not.exist;
    expect(detail.shadowRoot.querySelector('.prompt').textContent).to.include(
      'Select a character',
    );
  });

  it('uses cache when same query is searched again (no extra fetch)', async () => {
    let fetchCount = 0;
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () => {
      fetchCount += 1;
      return new Response(
        JSON.stringify({
          count: 2,
          next: null,
          results: mockCharacters,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    };

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');

    input.value = 'Luke';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    expect(fetchCount).to.equal(1);

    input.value = '';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    input.value = 'Luke';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    expect(fetchCount).to.equal(1);
  });

  it('shows empty state when cached result has no characters', async () => {
    let fetchCount = 0;
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () => {
      fetchCount += 1;
      return new Response(
        JSON.stringify({ count: 0, next: null, results: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    };

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');

    input.value = 'nope';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    let list = el.shadowRoot.querySelector('character-list');
    expect(list.state).to.equal('empty');
    expect(list.shadowRoot.querySelector('.list-wrap').textContent).to.include(
      'No characters found',
    );

    input.value = '';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    input.value = 'nope';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    expect(fetchCount).to.equal(1);
    list = el.shadowRoot.querySelector('character-list');
    expect(list.state).to.equal('empty');
  });

  it('shows error when search request fails', async () => {
    const el = await fixture(
      html`<star-wars-character-searcher></star-wars-character-searcher>`,
    );
    window.fetch = async () =>
      new Response('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

    const search = el.shadowRoot.querySelector('character-search');
    const input = search.shadowRoot.querySelector('input');
    input.value = 'Luke';
    input.dispatchEvent(new InputEvent('input'));
    await el.updateComplete;
    await aTimeout(350);

    const list = el.shadowRoot.querySelector('character-list');
    const alert = list.shadowRoot.querySelector('[role="alert"]');
    expect(alert).to.exist;
  });
});
