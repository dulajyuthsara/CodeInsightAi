import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar({ activeView, setActiveView, historyCount = 0 }) {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "JD";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="4 6 2 8 4 10"/><polyline points="12 6 14 8 12 10"/>
            <line x1="9" y1="4" x2="7" y2="12"/>
          </svg>
        </div>
        <span className="logo-text">CodeInsight</span>
        <span className="logo-badge">AI</span>
      </div>

      {/* Nav */}
      <div className="sidebar-section">Workspace</div>
      
      <div 
        className={`nav-item ${activeView === "review" ? "active" : ""}`}
        onClick={() => setActiveView("review")}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 3h12v2H2zM2 7h8v2H2zM2 11h10v2H2z"/>
        </svg>
        New Review
      </div>

      <div 
        className={`nav-item ${activeView === "history" ? "active" : ""}`}
        onClick={() => setActiveView("history")}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8" cy="8" r="6"/><polyline points="8 5 8 8 10 10"/>
        </svg>
        History
        {historyCount > 0 && <span className="nav-count">{historyCount}</span>}
      </div>

      <div className="nav-item">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="7" cy="7" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/>
        </svg>
        Browse Repos
      </div>

      <div className="sidebar-section" style={{ marginTop: "8px" }}>Settings</div>
      
      <div className="nav-item">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8" cy="8" r="2.5"/>
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
        </svg>
        Preferences
      </div>

      <div className="nav-item">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 3v4l3 1.5"/>
        </svg>
        API Usage
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-row" onClick={logout} title="Click to Sign out">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-plan" style={{ textTransform: "capitalize" }}>{user?.plan || "Free"} Plan</div>
          </div>
          <svg style={{ width: "12px", height: "12px", color: "var(--text-3)" }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}
