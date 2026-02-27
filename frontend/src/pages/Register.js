import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import "../style/Register.css";  // <--- أضف هذا السطر

export default function Register() {
  const { register } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // دالة حساب قوة كلمة المرور
  const getPasswordStrength = () => {
    const pass = form.password;
    if (!pass) return { strength: 0, text: "" };
    if (pass.length < 6) return { strength: 1, text: t.weak || "Weak" };
    if (pass.length < 10) return { strength: 2, text: t.medium || "Medium" };
    return { strength: 3, text: t.strong || "Strong" };
  };

  const passwordStrength = getPasswordStrength();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErr(t.acceptTerms || "Please accept terms and conditions");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      await register(form);
      nav("/favorites");
    } catch (e2) {
      setErr(e2.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* شعار التطبيق */}
        <div className="register-logo">
          <Link to="/">{t.brand || "MINIMOVIE"}</Link>
        </div>

        <h1>{t.registerTitle || "Create Account"}</h1>

        {/* رسالة الخطأ */}
        {err && <div className="error-message">{err}</div>}

        {/* نموذج التسجيل */}
        <form onSubmit={onSubmit} className="register-form">
          <div className="form-group">
            <label>{t.name || "Full Name"}</label>
            <input
              type="text"
              name="name"
              className="register-input"
              placeholder={t.namePlaceholder || "Enter your name"}
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.email || "Email"}</label>
            <input
              type="email"
              name="email"
              className="register-input"
              placeholder={t.emailPlaceholder || "Enter your email"}
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.password || "Password"}</label>
            <input
              type="password"
              name="password"
              className="register-input"
              placeholder={t.passwordPlaceholder || "Create a password"}
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
            />
            
            {/* مؤشر قوة كلمة المرور */}
            {form.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className={`strength-fill ${
                      passwordStrength.strength === 1 ? "weak" : 
                      passwordStrength.strength === 2 ? "medium" : 
                      passwordStrength.strength === 3 ? "strong" : ""
                    }`}
                  ></div>
                </div>
                <span className="strength-text">{passwordStrength.text}</span>
              </div>
            )}
          </div>

          {/* شروط كلمة المرور */}
          {form.password && (
            <div className="password-rules">
              <div className={`password-rule ${form.password.length >= 6 ? "valid" : ""}`}>
                <i>{form.password.length >= 6 ? "✓" : "○"}</i>
                <span>{t.min6Chars || "At least 6 characters"}</span>
              </div>
              <div className={`password-rule ${/[A-Z]/.test(form.password) ? "valid" : ""}`}>
                <i>{/[A-Z]/.test(form.password) ? "✓" : "○"}</i>
                <span>{t.oneUppercase || "One uppercase letter"}</span>
              </div>
              <div className={`password-rule ${/[0-9]/.test(form.password) ? "valid" : ""}`}>
                <i>{/[0-9]/.test(form.password) ? "✓" : "○"}</i>
                <span>{t.oneNumber || "One number"}</span>
              </div>
            </div>
          )}

          {/* شروط الاستخدام */}
          <label className="terms">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              {t.acceptTerms || "I accept the"}{" "}
              <Link to="/terms">{t.termsConditions || "Terms & Conditions"}</Link>
            </span>
          </label>

          <button 
            type="submit" 
            className={`register-button ${loading ? "loading" : ""}`}
            disabled={loading || !acceptTerms || form.password.length < 6}
          >
            {loading ? "" : (t.createAccount || "Create account")}
          </button>
        </form>

        {/* رابط تسجيل الدخول */}
        <div className="register-footer">
          <span>{t.haveAccount || "Already have an account?"}</span>
          <Link to="/login">{t.login || "Sign In"}</Link>
        </div>
      </div>
    </div>
  );
}