import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { loadFavorites, saveFavorites } from "../lib/storage";
import { addFavorite, fetchFavorites, removeFavorite } from "../lib/favoritesApi";
import { useAuth } from "../auth/AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthed } = useAuth();

  // local favorites (for guests)
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [loadingFav, setLoadingFav] = useState(false);

  // save local only when not authed
  useEffect(() => {
    if (!isAuthed) saveFavorites(favorites);
  }, [favorites, isAuthed]);

  // when authed: load favorites from DB + sync local->DB once
  useEffect(() => {
    if (!isAuthed) return;

    let alive = true;
    setLoadingFav(true);

    (async () => {
      try {
        // 1) pull server favorites
        const server = await fetchFavorites(); // { favorites: [...] }
        const serverFavs = server.favorites || [];

        // 2) sync local favorites into server (if any)
        const local = loadFavorites() || [];
        for (const m of local) {
          if (!m?.id) continue;
          // if not in server, add
          const exists = serverFavs.some((x) => x.movieId === m.id);
          if (!exists) {
            try {
              await addFavorite({
                movieId: m.id,
                title: m.title,
                poster_path: m.poster_path,
                release_date: m.release_date,
                vote_average: m.vote_average,
              });
            } catch {
              // ignore duplicates
            }
          }
        }

        // 3) re-fetch after sync
        const after = await fetchFavorites();
        const list = (after.favorites || []).map((f) => ({
          id: f.movieId,
          title: f.title,
          poster_path: f.poster_path,
          release_date: f.release_date,
          vote_average: f.vote_average,
        }));

        if (!alive) return;
        setFavorites(list);

        // 4) clear local cache after sync (optional)
        saveFavorites([]);
      } finally {
        if (!alive) return;
        setLoadingFav(false);
      }
    })();

    return () => { alive = false; };
  }, [isAuthed]);

  const isFav = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const toggleFav = useCallback(
    async (movie) => {
      if (!movie || !movie.id) return;

      const exists = favorites.some((m) => m.id === movie.id);

      // if guest -> local only
      if (!isAuthed) {
        setFavorites((prev) => {
          const ex = prev.some((m) => m.id === movie.id);
          if (ex) return prev.filter((m) => m.id !== movie.id);
          const minimal = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          };
          return [minimal, ...prev];
        });
        return;
      }

      // authed -> DB + state
      try {
        if (exists) {
          await removeFavorite(movie.id);
          setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
        } else {
          await addFavorite({
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          });
          const minimal = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          };
          setFavorites((prev) => [minimal, ...prev]);
        }
      } catch (e) {
        // if token expired etc
        console.error(e);
      }
    },
    [favorites, isAuthed]
  );

  const value = useMemo(
    () => ({ favorites, toggleFav, isFav, loadingFav }),
    [favorites, toggleFav, isFav, loadingFav]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}