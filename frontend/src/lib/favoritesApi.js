import { api } from "./apiClient";

export const fetchFavorites = () => api("/api/favorites");

export const addFavorite = (fav) =>
  api("/api/favorites", { method: "POST", body: fav });

export const removeFavorite = (movieId) =>
  api(`/api/favorites/${movieId}`, { method: "DELETE" });