import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './character-list.js';

describe('character-list', () => {
  const mockCharacters = [
    { name: 'Luke Skywalker', birth_year: '19BBY' },
    { name: 'Leia Organa', birth_year: '19BBY' },
  ];

  it('renders idle state with prompt', async () => {
    const el = await fixture(
      html`<character-list .state=${'idle'} .characters=${[]}></character-list>`
    );
    const p = el.shadowRoot.querySelector('p[role="status"]');
    expect(p).to.exist;
    expect(p.textContent).to.include('Enter a name and click Search');
  });

  it('renders empty state with no results message', async () => {
    const el = await fixture(
      html`<character-list .state=${'empty'} .characters=${[]}></character-list>`
    );
    const p = el.shadowRoot.querySelector('p[role="status"]');
    expect(p).to.exist;
    expect(p.textContent).to.include('No characters found');
  });

  it('renders loading state with spinner', async () => {
    const el = await fixture(
      html`<character-list .state=${'loading'} .characters=${[]}></character-list>`
    );
    const spinner = el.shadowRoot.querySelector('.spinner');
    expect(spinner).to.exist;
    const loading = el.shadowRoot.querySelector('div[role="status"]');
    expect(loading.textContent).to.include('Loading');
  });

  it('renders error state with custom error message', async () => {
    const el = await fixture(
      html`<character-list
        .state=${'error'}
        .characters=${[]}
        .errorMessage=${'Network failed'}
      ></character-list>`
    );
    const alert = el.shadowRoot.querySelector('div[role="alert"]');
    expect(alert).to.exist;
    expect(alert.textContent).to.include('Network failed');
    expect(alert.textContent).to.include('You can try another search');
  });

  it('renders error state with fallback message', async () => {
    const el = await fixture(
      html`<character-list
        .state=${'error'}
        .characters=${[]}
        .errorMessage=${''}
      ></character-list>`
    );
    const alert = el.shadowRoot.querySelector('div[role="alert"]');
    expect(alert).to.exist;
    expect(alert.textContent).to.include('Something went wrong');
  });

  it('renders character list with buttons', async () => {
    const el = await fixture(
      html`<character-list .state=${'success'} .characters=${mockCharacters}></character-list>`
    );
    const buttons = [...el.shadowRoot.querySelectorAll('button')];
    expect(buttons).to.have.lengthOf(2);
    expect(buttons[0].textContent).to.include('Luke Skywalker');
    expect(buttons[1].textContent).to.include('Leia Organa');
  });

  it('dispatches character-select event on button click', async () => {
    const el = await fixture(
      html`<character-list .state=${'success'} .characters=${mockCharacters}></character-list>`
    );
    const listener = oneEvent(el, 'character-select');

    const firstButton = el.shadowRoot.querySelector('button');
    expect(firstButton).to.exist;
    firstButton.click();

    const event = await listener;
    expect(event.detail.character).to.deep.equal(mockCharacters[0]);
  });
});
