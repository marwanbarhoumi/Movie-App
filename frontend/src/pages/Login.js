import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import "../style/Login.css";  

export default function Login() {
  const { login } = useAuth();
  const { t } = useLang();

  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/favorites";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-card">
        {/* شعار التطبيق */}
        <div className="auth-logo">
          <Link to="/">{t.brand || "MINIMOVIE"}</Link>
        </div>

        <h1>{t.authLoginTitle || "Sign In"}</h1>

        {/* رسالة الخطأ */}
        {err && <div className="error-message">{err}</div>}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label>{t.authEmail || "Email"}</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder={t.authEmailPlaceholder || "Enter your email"}
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.authPassword || "Password"}</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder={t.authPasswordPlaceholder || "Enter your password"}
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          {/* خيارات إضافية */}
          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>{t.rememberMe || "Remember me"}</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              {t.forgotPassword || "Forgot password?"}
            </Link>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "" : (t.authLoginBtn || "Sign In")}
          </button>
        </form>

        {/* رابط إنشاء حساب جديد */}
        <div className="auth-footer">
          <span>{t.authNoAccount || "New to MINIMOVIE?"}</span>
          <Link to="/register">{t.authCreateOne || "Create an account"}</Link>
        </div>
      </div>
    </div>
  );
}