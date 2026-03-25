import { useAuth } from "../context/AuthContext.jsx";

const NavItem = ({ icon, label, count, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "9px",
      padding: "7px 12px", margin: "0 8px", borderRadius: "6px",
      cursor: "pointer", fontSize: "13px", fontWeight: 400,
      color: active ? "var(--accent)" : "var(--text-2)",
      background: active ? "var(--accent-dim)" : "transparent",
      transition: "background .12s, color .12s",
    }}
    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; }}}
    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}}
  >
    <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
    {label}
    {count != null && (
      <span style={{
        marginLeft: "auto", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace",
        background: "var(--surface-2)", color: "var(--text-3)",
        padding: "1px 6px", borderRadius: "3px", border: "1px solid var(--border)",
      }}>{count}</span>
    )}
  </div>
);

const IconCode = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <polyline points="4 6 2 8 4 10"/><polyline points="12 6 14 8 12 10"/>
    <line x1="9" y1="4" x2="7" y2="12"/>
  </svg>
);
const IconHistory = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="8" cy="8" r="6"/><polyline points="8 5 8 8 10 10"/>
  </svg>
);
const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="8" cy="8" r="2.5"/>
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"/>
  </svg>
);
const IconLogout = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6"/>
  </svg>
);

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <aside style={{
      width: "220px", minWidth: "220px",
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div style={{
          width: "28px", height: "28px", background: "var(--accent)",
          borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8">
            <polyline points="4 6 2 8 4 10"/><polyline points="12 6 14 8 12 10"/>
            <line x1="9" y1="4" x2="7" y2="12"/>
          </svg>
        </div>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>CodeInsight</span>
        <span style={{
          fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace",
          background: "var(--accent-dim)", color: "var(--accent)",
          border: "1px solid rgba(59,126,255,.2)", padding: "1px 5px", borderRadius: "3px",
        }}>AI</span>
      </div>

      {/* Nav */}
      <div style={{ padding: "12px 12px 6px", fontSize: "10px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-3)" }}>
        Workspace
      </div>
      <NavItem icon={<IconCode />} label="New Review"  active={activeView === "review"}  onClick={() => setActiveView("review")} />
      <NavItem icon={<IconHistory />} label="History"  active={activeView === "history"} onClick={() => setActiveView("history")} />

      <div style={{ padding: "12px 12px 6px", marginTop: "8px", fontSize: "10px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-3)" }}>
        Account
      </div>
      <NavItem icon={<IconSettings />} label="Preferences" active={false} onClick={() => {}} />

      {/* Footer */}
      <div style={{ marginTop: "auto", padding: "12px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "9px",
          padding: "7px 8px", borderRadius: "6px", cursor: "pointer",
        }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: "linear-gradient(135deg, #3b7eff 0%, #0050d0 100%)",
            fontSize: "11px", fontWeight: 600, display: "flex",
            alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name || "User"}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-3)", textTransform: "capitalize" }}>
              {user?.plan || "free"} plan
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", padding: "2px", borderRadius: "3px",
            }}
          >
            <IconLogout />
          </button>
        </div>
      </div>
    </aside>
  );
}
