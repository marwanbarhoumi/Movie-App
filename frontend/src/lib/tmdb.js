// src/lib/tmdb.js
const IMG = "https://image.tmdb.org/t/p";
export const imgUrl = (path, size = "w500") => (path ? `${IMG}/${size}${path}` : "");

async function api(path, params = {}) {
  // ✅ لازم path يبدأ بـ /
  const p = path.startsWith("/") ? path : `/${path}`;

  // ✅ نبني query string بطريقة آمنة
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== "") qs.set(k, v);
  });

  const url = `${p}${qs.toString() ? `?${qs.toString()}` : ""}`;

  const res = await fetch(url); // relative URL -> يروح للـ proxy
  const text = await res.text().catch(() => "");
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text?.slice(0, 120) }; }

  if (!res.ok) throw new Error(data.message || `API ${res.status}`);
  return data;
}

export const getTrending = (language = "fr-FR") =>
  api("/api/trending", { lang: language });

export const getTopRated = (language = "fr-FR", page = 1) =>
  api("/api/top-rated", { lang: language, page });

export const searchMovies = (query, language = "fr-FR", page = 1) =>
  api("/api/search", { q: query, lang: language, page });

export const getMovie = (id, language = "fr-FR") =>
  api(`/api/movie/${id}`, { lang: language });