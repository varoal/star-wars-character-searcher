import { expect } from '@open-wc/testing';
import { getPeople } from './swapi.js';

describe('getPeople', () => {
  const mockResults = [
    { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male' },
  ];

  it('returns ok and data on success', async () => {
    window.fetch = (async () =>
      new Response(
        JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: mockResults,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    const result = await getPeople('luke');
    expect(result.ok).to.be.true;
    expect(result.data).to.deep.equal(mockResults);
    expect(result.count).to.equal(1);
  });

  it('returns ok: false and error on HTTP error', async () => {
    window.fetch = (async () =>
      new Response('', { status: 500 })
    );
    const result = await getPeople('x');
    expect(result.ok).to.be.false;
    expect(result.error).to.include('500');
  });
});
