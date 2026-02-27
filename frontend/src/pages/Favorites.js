import { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../favorites/FavoritesContext";
import { useLang } from "../i18n/LanguageContext";
import "../style/Favorites.css";  // <--- أضف هذا السطر

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();
  const { t } = useLang();
  const [filter, setFilter] = useState("all"); // all, recent, rating

  // حساب بعض الإحصائيات
  const totalFavorites = favorites.length;
  const averageRating = favorites.length > 0 
    ? (favorites.reduce((acc, movie) => acc + (movie.vote_average || 0), 0) / favorites.length).toFixed(1)
    : 0;

  // ترتيب الأفلام حسب الفلتر
  const getFilteredMovies = () => {
    let sorted = [...favorites];
    if (filter === "recent") {
      sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (filter === "rating") {
      sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }
    return sorted;
  };

  const filteredMovies = getFilteredMovies();

  return (
    <div className="favorites-page">
      {/* رأس الصفحة */}
      <div className="favorites-header">
        <div className="header-left">
          <h1>{t.favorites || "My Favorites"}</h1>
          <div className="items-count">
            {totalFavorites} {t.items || "items"}
            {totalFavorites > 0 && <span>{totalFavorites}</span>}
          </div>
        </div>

        {/* خيارات التصفية */}
        {totalFavorites > 0 && (
          <div className="filter-options">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              {t.all || "All"}
            </button>
            <button 
              className={`filter-btn ${filter === "recent" ? "active" : ""}`}
              onClick={() => setFilter("recent")}
            >
              {t.recent || "Recent"}
            </button>
            <button 
              className={`filter-btn ${filter === "rating" ? "active" : ""}`}
              onClick={() => setFilter("rating")}
            >
              {t.topRated || "Top Rated"}
            </button>
          </div>
        )}
      </div>

      {/* إحصائيات سريعة (إذا فيه أفلام) */}
      {totalFavorites > 0 && (
        <div className="favorites-stats">
          <div className="stat-card">
            <div className="stat-value">{totalFavorites}</div>
            <div className="stat-label">{t.totalMovies || "Total Movies"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">⭐ {averageRating}</div>
            <div className="stat-label">{t.averageRating || "Average Rating"}</div>
          </div>
        </div>
      )}

      {/* خيارات إضافية (إذا فيه أفلام) */}
      {totalFavorites > 0 && (
        <div className="favorites-actions">
          <button 
            className="action-btn danger"
            onClick={clearFavorites}
          >
            🗑️ {t.clearAll || "Clear All"}
          </button>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      {totalFavorites === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">🎬</div>
          <h2>{t.noFavorites || "No favorites yet"}</h2>
          <p>{t.addSomeMovies || "Start adding some movies to your collection!"}</p>
          <Link to="/" className="browse-btn">
            {t.browseMovies || "Browse Movies"}
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredMovies
            .filter((m) => m && m.id)
            .map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
        </div>
      )}
    </div>
  );
}