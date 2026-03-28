import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
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

        <h1 className="auth-heading">Sign in to your account</h1>
        <p className="auth-sub">Welcome back. Enter your credentials to continue.</p>

        {error && (
          <div style={{
            background: "var(--red-dim)", border: "1px solid rgba(240,79,95,.3)",
            color: "var(--red)", borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px",
            marginBottom: "16px"
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="lang-select" // Reusing styling for inputs
              style={{ padding: "10px 12px", width: "100%", fontSize: "13px" }}
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="lang-select"
              style={{ padding: "10px 12px", width: "100%", fontSize: "13px" }}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "10px", marginTop: "12px" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
