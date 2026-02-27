import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import "../style/components/Footer.css";

export default function Footer() {
  const { t } = useLang();  // ✅ استخدمنا t فقط
  const year = new Date().getFullYear();

  // أيقونات التواصل الاجتماعي
  const socialIcons = [
    { icon: "📘", url: "#", name: "Facebook" },
    { icon: "🐦", url: "#", name: "Twitter" },
    { icon: "📷", url: "#", name: "Instagram" },
    { icon: "▶️", url: "#", name: "YouTube" }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ===== القسم الأول: الشعار والوصف ===== */}
        <div className="footer-section">
          <div className="footer-brand">{t.brand || "MiniMovie"}</div>
          <p className="footer-description">
            {t.footerDescription || "Your ultimate destination for movies and entertainment. Discover, explore, and enjoy thousands of films."}
          </p>
          
          {/* أيقونات التواصل الاجتماعي */}
          <div className="footer-social">
            {socialIcons.map((social, index) => (
              <a 
                key={index}
                href={social.url}
                className="social-icon"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ===== القسم الثاني: روابط سريعة ===== */}
        <div className="footer-section">
          <h4 className="footer-title">{t.quickLinks || "Quick Links"}</h4>
          <ul className="footer-links">
            <li><Link to="/">{t.home || "Home"}</Link></li>
            <li><Link to="/favorites">{t.favorites || "Favorites"}</Link></li>
            <li><Link to="/search">{t.search || "Search"}</Link></li>
            <li><Link to="/trending">{t.trending || "Trending"}</Link></li>
          </ul>
        </div>

        {/* ===== القسم الثالث: المساعدة ===== */}
        <div className="footer-section">
          <h4 className="footer-title">{t.help || "Help"}</h4>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">{t.contact || "Contact Us"}</Link></li>
            <li><Link to="/support">{t.support || "Support"}</Link></li>
            <li><Link to="/feedback">{t.feedback || "Feedback"}</Link></li>
          </ul>
        </div>

        {/* ===== القسم الرابع: معلومات قانونية ===== */}
        <div className="footer-section">
          <h4 className="footer-title">{t.legal || "Legal"}</h4>
          <ul className="footer-links">
            <li><Link to="/terms">{t.terms || "Terms of Service"}</Link></li>
            <li><Link to="/privacy">{t.privacy || "Privacy Policy"}</Link></li>
            <li><Link to="/cookies">{t.cookies || "Cookie Policy"}</Link></li>
          </ul>
        </div>
      </div>

      {/* ===== القسم السفلي: حقوق النشر ===== */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          <span>© {year} {t.brand || "MiniMovie"}</span>
          <span className="separator">•</span>
          <span>{t.rights || "All rights reserved"}</span>
        </div>
        
        <div className="footer-bottom-links">
          <Link to="/terms">{t.terms || "Terms"}</Link>
          <Link to="/privacy">{t.privacy || "Privacy"}</Link>
          <Link to="/cookies">{t.cookies || "Cookies"}</Link>
        </div>
      </div>
    </footer>
  );
}