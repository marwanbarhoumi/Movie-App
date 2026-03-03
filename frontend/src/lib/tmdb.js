// src/lib/tmdb.js
const IMG = "https://image.tmdb.org/t/p";
export const imgUrl = (path, size = "w500") => (path ? `${IMG}/${size}${path}` : "");

// ✅ لازم تحط REACT_APP_API_URL في Vercel
const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

async function api(path, params = {}) {
  if (!API_BASE) {
    throw new Error("Missing REACT_APP_API_URL (set it in Vercel env vars)");
  }

  const p = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE}${p}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== "") url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  const text = await res.text().catch(() => "");
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text?.slice(0, 120) }; }

  if (!res.ok) throw new Error(data.message || `API ${res.status}`);
  return data;
}

export const getTrending = (language = "fr-FR") => api("/api/trending", { lang: language });
export const getTopRated = (language = "fr-FR", page = 1) => api("/api/top-rated", { lang: language, page });
export const searchMovies = (query, language = "fr-FR", page = 1) => api("/api/search", { q: query, lang: language, page });
export const getMovie = (id, language = "fr-FR") => api(`/api/movie/${id}`, { lang: language });