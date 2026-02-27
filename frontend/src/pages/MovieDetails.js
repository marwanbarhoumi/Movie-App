import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovie, imgUrl } from "../lib/tmdb";
import { useLang } from "../i18n/LanguageContext";
import { useFavorites } from "../favorites/FavoritesContext";
import "../style/MovieDetails.css"; 

export default function MovieDetails() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const tmdbLang = lang === "ar" ? "ar-SA" : "fr-FR";

  const { toggleFav, isFav } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setErr("");
    setMovie(null);

    getMovie(id, tmdbLang)
      .then((data) => {
        if (!alive) return;
        setMovie(data);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || "Failed to load movie");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id, tmdbLang]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <div className="loading-text">{t.loading || "Loading..."}</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="error-box">
        <div style={{ marginBottom: 10 }}>{err}</div>
        <Link className="home-link" to="/">
          ⟵ {t.home || "Home"}
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="empty-box">
        <div>{t.noData || "No data available."}</div>
        <Link className="home-link" to="/">
          ⟵ {t.home || "Home"}
        </Link>
      </div>
    );
  }

  const fav = isFav(movie.id);

  return (
    <div className="movie-details-page">
      <div className="details-container">
        <div className="movie-details">
          {/* صورة الفيلم */}
          <div className="movie-poster">
            <img 
              src={imgUrl(movie.poster_path, "w500")} 
              alt={movie.title}
              loading="lazy"
            />
          </div>

          {/* معلومات الفيلم */}
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            
            <div className="movie-meta">
              <div className="movie-rating">
                {movie.vote_average?.toFixed?.(1) ?? "—"}
                <span>/ 10</span>
              </div>
              <div className="movie-release">
                📅 {movie.release_date || t.unknown || "Unknown"}
              </div>
            </div>

            <button
              className={`favorite-btn ${fav ? "fav" : "not-fav"}`}
              onClick={() => toggleFav(movie)}
            >
              {fav ? "★" : "☆"} {fav ? t.favorite : t.addToFavorites || "Add to favorites"}
            </button>

            <p className="movie-overview">
              {movie.overview || t.noOverview || "No overview available."}
            </p>

            {/* معلومات إضافية */}
            <div className="movie-extras">
              {movie.runtime > 0 && (
                <div className="extra-item">
                  <div className="extra-label">{t.duration || "Duration"}</div>
                  <div className="extra-value">{movie.runtime} {t.minutes || "min"}</div>
                </div>
              )}
              
              {movie.genres?.length > 0 && (
                <div className="extra-item">
                  <div className="extra-label">{t.genres || "Genres"}</div>
                  <div className="extra-value">
                    {movie.genres.map(g => g.name).join(", ")}
                  </div>
                </div>
              )}
              
              {movie.status && (
                <div className="extra-item">
                  <div className="extra-label">{t.status || "Status"}</div>
                  <div className="extra-value">{movie.status}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}