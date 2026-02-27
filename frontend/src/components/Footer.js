import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import "../style/components/Footer.css";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footerRow">
        <div className="footerLeft">
          <div className="footerBrand">{t.brand}</div>
          <div className="muted">{t.footerTech}</div>
        </div>

        <div className="footerLinks">
          <Link to="/">{t.home}</Link>

          <Link to="/favorites">{t.favorites}</Link>
        </div>
      </div>
    </footer>
  );
}
