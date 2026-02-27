// src/lib/tmdb.js
// Frontend API wrapper -> calls your Express backend endpoints (/api/*)
// Works with CRA proxy: add in frontend/package.json => "proxy": "http://localhost:5000"

const IMG = "https://image.tmdb.org/t/p";

// image helper (TMDB provides images via this base url)
export const imgUrl = (path, size = "w500") =>
  path ? `${IMG}/${size}${path}` : "";

// generic request helper
async function api(path, params = {}) {
  // CRA proxy will forward /api/* to backend
  const url = new URL(path, window.location.origin);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== "") {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString());
  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    // backend returns { message, status }
    throw new Error(data.message || `API ${res.status}`);
  }

  return data;
}

// Movies
export const getTrending = (language = "fr-FR") =>
  api("/api/trending", { lang: language });

export const getTopRated = (language = "fr-FR", page = 1) =>
  api("/api/top-rated", { lang: language, page });

export const searchMovies = (query, language = "fr-FR", page = 1) =>
  api("/api/search", { q: query, lang: language, page });

export const getMovie = (id, language = "fr-FR") =>
  api(`/api/movie/${id}`, { lang: language });