import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs[0].msg : err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="sidebar-logo" style={{ border: "none", padding: "0 0 24px" }}>
          <div className="logo-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8">
              <polyline points="4 6 2 8 4 10"/><polyline points="12 6 14 8 12 10"/>
              <line x1="9" y1="4" x2="7" y2="12"/>
            </svg>
          </div>
          <span className="logo-text" style={{ fontSize: "16px" }}>CodeInsight</span>
          <span className="logo-badge">AI</span>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Start reviewing code with AI in seconds.</p>

        {error && (
          <div style={{
            background: "var(--red-dim)", border: "1px solid rgba(240,79,95,.3)",
            color: "var(--red)", borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px",
            marginBottom: "16px"
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input name="name" type="text" required value={form.name} onChange={handleChange}
              className="lang-select" style={{ padding: "10px 12px", width: "100%", fontSize: "13px" }}
              placeholder="Jane Smith" />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" autoComplete="email" required
              value={form.email} onChange={handleChange}
              className="lang-select" style={{ padding: "10px 12px", width: "100%", fontSize: "13px" }}
              placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" required value={form.password}
              onChange={handleChange}
              className="lang-select" style={{ padding: "10px 12px", width: "100%", fontSize: "13px" }}
              placeholder="Min. 6 characters" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "10px", marginTop: "12px" }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
