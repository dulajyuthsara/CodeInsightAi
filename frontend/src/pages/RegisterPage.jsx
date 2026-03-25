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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8">
              <polyline points="4 6 2 8 4 10"/><polyline points="12 6 14 8 12 10"/>
              <line x1="9" y1="4" x2="7" y2="12"/>
            </svg>
          </div>
          <span style={styles.logoText}>CodeInsight</span>
          <span style={styles.logoBadge}>AI</span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.sub}>Start reviewing code with AI in seconds.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Full name</label>
          <input name="name" type="text" required value={form.name} onChange={handleChange}
            style={styles.input} placeholder="Jane Smith" />

          <label style={styles.label}>Email address</label>
          <input name="email" type="email" autoComplete="email" required
            value={form.email} onChange={handleChange} style={styles.input} placeholder="you@example.com" />

          <label style={styles.label}>Password</label>
          <input name="password" type="password" required value={form.password}
            onChange={handleChange} style={styles.input} placeholder="Min. 6 characters" />

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "var(--bg)", padding: "24px", overflow: "auto",
  },
  card: {
    width: "100%", maxWidth: "380px", background: "var(--surface)",
    border: "1px solid var(--border)", borderRadius: "8px", padding: "32px",
  },
  logoRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" },
  logoIcon: {
    width: "28px", height: "28px", background: "var(--accent)",
    borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: "13px", fontWeight: 600, color: "var(--text)" },
  logoBadge: {
    fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace",
    background: "var(--accent-dim)", color: "var(--accent)",
    border: "1px solid rgba(59,126,255,.2)", padding: "1px 5px", borderRadius: "3px",
  },
  heading: { fontSize: "18px", fontWeight: 600, color: "var(--text)", margin: "0 0 6px" },
  sub: { fontSize: "13px", color: "var(--text-3)", margin: "0 0 24px" },
  errorBox: {
    background: "var(--red-dim)", border: "1px solid rgba(240,79,95,.3)",
    color: "var(--red)", borderRadius: "5px", padding: "9px 12px",
    fontSize: "12.5px", marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: 500, color: "var(--text-2)", marginTop: "10px" },
  input: {
    background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: "5px",
    padding: "8px 11px", fontSize: "13px", color: "var(--text)",
    fontFamily: "'IBM Plex Sans', sans-serif", outline: "none",
  },
  btn: {
    marginTop: "18px", background: "var(--accent)", color: "#fff", border: "none",
    borderRadius: "5px", padding: "9px", fontSize: "13px", fontWeight: 500,
    fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer",
  },
  footer: { fontSize: "12px", color: "var(--text-3)", marginTop: "20px", textAlign: "center" },
  link: { color: "var(--accent)", textDecoration: "none" },
};
