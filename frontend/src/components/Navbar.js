import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import "../style/components/Navbar.css";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* القسم الأيسر - Logo والقوائم */}
        <div className="nav-left">
          <Link to="/" className="logo">
            {t.brand || "MINIMOVIE"}
          </Link>
          
          <div className="nav-links">
            <Link to="/">{t.home || "Accueil"}</Link>
            <Link to="/favorites">{t.favorites || "Favoris"}</Link>
          </div>
        </div>

        {/* القسم الأيمن - البحث واللغة والمستخدم */}
        <div className="nav-right">
          {/* البحث */}
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder={t.search || "Recherche..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>

          {/* اختيار اللغة */}
          <div className="lang-switcher">
            <button 
              className={lang === "fr" ? "active" : ""} 
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <button 
              className={lang === "ar" ? "active" : ""} 
              onClick={() => setLang("ar")}
            >
              AR
            </button>
          </div>

          {/* المستخدم */}
          {user ? (
            <div className="user-menu">
              <span>{user.name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}