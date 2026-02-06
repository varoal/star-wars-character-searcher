/**
 * SWAPI (Star Wars API) service. Centralizes data fetching and error handling.
 * Base URL and search parameter follow the official docs.
 * @see https://swapi.dev/documentation
 */

/** Base URL for all API requests. */
const SWAPI_BASE = "https://swapi.dev/api/";

/**
 * Person object returned by SWAPI.
 * This typedef documents only the subset of fields consumed by the app.
 * @typedef {Object} SwapiPerson
 * @property {string} name
 * @property {string} birth_year
 * @property {string} gender
 */

/**
 * Result of a people search. Use `ok` to distinguish success from failure.
 * @typedef {Object} PeopleSearchResult
 * @property {boolean} ok - True if the request succeeded and response was valid.
 * @property {SwapiPerson[]} [data] - Present when ok is true (may be empty).
 * @property {string} [error] - Present when ok is false; user-facing message.
 */

/**
 * Fetches people from SWAPI. Uses the documented `search` query parameter;
 * the API does case-insensitive partial matching.
 * @param {string} search - Search query (e.g. name). Empty returns first page of people.
 * @returns {Promise<PeopleSearchResult>}
 */
export async function getPeople(search) {
  const url = new URL("people", SWAPI_BASE);
  if (search && String(search).trim()) {
    url.searchParams.set("search", String(search).trim());
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Request failed: ${res.status} ${res.statusText}`,
      };
    }

    const json = await res.json();

    if (!json || !Array.isArray(json.results)) {
      return {
        ok: false,
        error: "Invalid response from server",
      };
    }

    return {
      ok: true,
      data: json.results,
    };
  } catch (e) {
    const message = e && e.message ? e.message : "Network or request error";
    return {
      ok: false,
      error: message,
    };
  }
}
