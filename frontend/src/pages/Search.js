import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchMovies } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import { useLang } from "../i18n/LanguageContext";
import "../style/Search.css";  // <--- أضف هذا السطر

export default function Search() {
  const { lang, t } = useLang();
  const tmdbLang = lang === "ar" ? "ar-SA" : "fr-FR";

  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const page = Number(params.get("page") || "1");

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // اقتراحات بحث شائعة
  const popularSearches = ["Avengers", "Star Wars", "Harry Potter", "Inception", "The Godfather"];

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setMovies([]);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setErr("");

    searchMovies(query, tmdbLang, page)
      .then((data) => {
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      })
      .catch((e) => setErr(e.message || "Error"))
      .finally(() => setLoading(false));
  }, [q, tmdbLang, page]);

  const setPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query.trim()) {
      setParams({ q: query });
    }
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="search-page">
      {/* رأس صفحة البحث */}
      <div className="search-header">
        <h1>{t.search || "Search"}</h1>
        {q && (
          <div className="search-info">
            {t.resultsFor || "Results for"}: <b>"{q}"</b>
            <span className="page-indicator">
              {page}/{totalPages}
            </span>
          </div>
        )}
      </div>

      {/* شريط البحث المتقدم */}
      <form onSubmit={handleSearch} className="search-bar-advanced">
        <input
          type="text"
          name="search"
          placeholder={t.searchPlaceholder || "Search for movies..."}
          defaultValue={q}
        />
        <button type="submit">
          {t.search || "Search"}
        </button>
      </form>

      {/* حالة التحميل */}
      {loading && (
        <div className="search-loading">
          <div className="loading-spinner-small"></div>
          {t.loading || "Searching..."}
        </div>
      )}

      {/* رسالة الخطأ */}
      {err && <div className="search-error">{err}</div>}

      {/* حالة عدم وجود بحث */}
      {!q && !loading && (
        <div className="empty-search">
          <div className="empty-icon">🔍</div>
          <h2>{t.searchForMovies || "Search for movies"}</h2>
          <p>{t.searchDescription || "Find your favorite movies, actors, and more!"}</p>
          
          {/* اقتراحات بحث شائعة */}
          <div className="popular-searches">
            {popularSearches.map((term) => (
              <Link
                key={term}
                to={`?q=${encodeURIComponent(term)}`}
                className="popular-search-tag"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* نتائج البحث */}
      {q && !loading && movies.length > 0 && (
        <div className="search-results-grid">
          {movies
            .filter((m) => m && m.id)
            .map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
        </div>
      )}

      {/* حالة عدم وجود نتائج */}
      {q && !loading && movies.length === 0 && !err && (
        <div className="no-results">
          <div className="no-results-icon">😕</div>
          <h3>{t.noResults || "No results found"}</h3>
          <p>{t.tryDifferent || "Try different keywords"}</p>
        </div>
      )}

      {/* أزرار التنقل بين الصفحات */}
      {q && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={!canPrev}
            onClick={() => setPage(page - 1)}
          >
            ← {t.prev || "Previous"}
          </button>
          
          <span className="pagination-info">
            {t.page || "Page"} <b>{page}</b> / {totalPages}
          </span>
          
          <button
            className="pagination-btn"
            disabled={!canNext}
            onClick={() => setPage(page + 1)}
          >
            {t.next || "Next"} →
          </button>
        </div>
      )}
    </div>
  );
}