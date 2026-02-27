import { useEffect, useState } from "react";
import { getTrending, getTopRated, imgUrl } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";
import { useLang } from "../i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";  // مهم

export default function Home() {
  const { lang, t } = useLang();
  const tmdbLang = lang === "ar" ? "ar-SA" : "fr-FR";
  const navigate = useNavigate();

  const [tab, setTab] = useState("trending");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fn = tab === "trending" ? getTrending : getTopRated;
    fn(tmdbLang)
      .then((data) => setMovies(data.results || []))
      .finally(() => setLoading(false));
  }, [tab, tmdbLang]);

  const hero = movies[0];

  return (
    <div className="home-page">
      {/* قسم التبويبات الثابت تحت الـ Navbar */}
      <div className="home-tabs-bar">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${tab === "trending" ? "active" : ""}`}
            onClick={() => setTab("trending")}
          >
            {t.trending || "Tendances"}
          </button>
          <button 
            className={`tab-btn ${tab === "top" ? "active" : ""}`}
            onClick={() => setTab("top")}
          >
            {t.topRated || "Les mieux notés"}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      {hero && (
        <div
          className="hero"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.25)), url(${imgUrl(
              hero.backdrop_path,
              "w1280"
            )})`,
          }}
        >
          <div className="heroContent">
            <div className="heroTitle">{hero.title}</div>
            <div className="heroMeta">
              ⭐ {hero.vote_average?.toFixed?.(1) ?? "—"} • {hero.release_date?.slice?.(0,4) || "—"}
            </div>
            <div className="heroOverview">{hero.overview || ""}</div>
            <div className="heroActions">
              <button className="btnPrimary" onClick={() => navigate(`/movie/${hero.id}`)}>
                {t.details || "Details"}
              </button>
              <button className="btnGhost" onClick={() => navigate(`/search?q=${encodeURIComponent(hero.title)}`)}>
                {t.searchSimilar || "Search Similar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* حالة التحميل */}
      {loading && <div className="loading-state">{t.loading || "Loading..."}</div>}

      {/* شبكة الأفلام */}
      <div className="movies-grid">
        {movies.filter(m => m && m.id).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}