import { useState } from "react";

const ChevronIcon = ({ open }) => (
  <svg 
    className={`chevron ${open ? "open" : ""}`} 
    viewBox="0 0 16 16" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8"
  >
    <polyline points="6 4 10 8 6 12"/>
  </svg>
);

function Section({ label, items, dotClass, badgeClass }) {
  const [open, setOpen] = useState(true);
  if (!items?.length) return null;

  return (
    <div className="section-block">
      <button className="section-toggle" onClick={() => setOpen(!open)}>
        <span className={`section-dot ${dotClass}`}></span>
        {label}
        <span className={`section-badge ${badgeClass}`}>{items.length}</span>
        <ChevronIcon open={open} />
      </button>

      <div className={`section-body ${open ? "open" : ""}`}>
        {items.map((item, i) => (
          <FindingCard key={i} item={item} num={i + 1} />
        ))}
      </div>
    </div>
  );
}

function FindingCard({ item, num }) {
  return (
    <div className="finding-card">
      <div className="finding-header">
        <span className="finding-num">{num}</span>
        <div style={{ flex: 1 }}>
          <p className="finding-text" style={{ margin: 0 }}>{item.text}</p>
          {item.line && (
            <p className="finding-line" style={{ margin: "3px 0 0" }}>
              {item.line}
            </p>
          )}
        </div>
      </div>
      {item.fix && (
        <div className="code-suggestion">
          <div className="code-suggestion-label">Suggested fix</div>
          <pre className="code-block" style={{ margin: 0 }}>{item.fix}</pre>
        </div>
      )}
    </div>
  );
}

export default function ResultsPanel({ result, error }) {
  const [activeTab, setActiveTab] = useState("Analysis");

  const scoreClass = (n) => (
      n >= 7 ? "score-high"
    : n >= 5 ? "score-mid"
    : "score-low"
  );

  return (
    <>
      {/* Tab bar */}
      <div className="tab-bar">
        {["Analysis", "Diff View", "Raw JSON"].map((tab) => (
          <div 
            key={tab} 
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="results-body">
        {/* Error state */}
        {error && (
          <div style={{ padding: "24px 20px" }}>
            <div style={{
              background: "var(--red-dim)", border: "1px solid rgba(240,79,95,.3)",
              color: "var(--red)", borderRadius: "6px", padding: "12px 14px", fontSize: "13px",
            }}>{error}</div>
          </div>
        )}

        {/* Empty state */}
        {!error && !result && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div className="empty-title">No analysis yet</div>
            <div className="empty-desc">
              Paste code and click Analyze to get detailed feedback from the AI reviewer.
            </div>
          </div>
        )}

        {/* Result */}
        {!error && result && activeTab === "Analysis" && (() => {
          const sc = result.rating;
          return (
            <>
              {/* Score banner */}
              <div className="score-banner">
                <div className={`score-circle ${scoreClass(sc)}`}>
                  {sc}<span style={{ fontSize: "10px", fontWeight: 400 }}>/10</span>
                </div>
                <div className="score-meta">
                  <div className="score-label">Quality Score</div>
                  <div className="score-sub">
                    Reviewed {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="score-stats">
                  {[
                    { val: result.bugs?.length ?? 0, key: "Bugs", colorClass: "stat-red" },
                    { val: result.security_issues?.length ?? 0, key: "Security", colorClass: "stat-red" },
                    { val: result.improvements?.length ?? 0, key: "Hints", colorClass: "stat-blue" },
                  ].map(({ val, key, colorClass }) => (
                    <div key={key} className="stat-item">
                      <div className={`stat-val ${colorClass}`}>{val}</div>
                      <div className="stat-key">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Section label="Bugs"             items={result.bugs}             dotClass="dot-red"   badgeClass="badge-red" />
              <Section label="Security Issues"  items={result.security_issues}  dotClass="dot-red"   badgeClass="badge-red" />
              <Section label="Improvements"     items={result.improvements}     dotClass="dot-blue"  badgeClass="badge-blue" />

              {/* Summary */}
              {result.summary && (
                <div className="section-block">
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 20px", background: "var(--surface)",
                    fontSize: "12px", fontWeight: 500, color: "var(--text)",
                  }}>
                    <span className="section-dot dot-green" />
                    Summary
                  </div>
                  <div style={{ padding: "12px 20px 16px", background: "var(--bg)" }}>
                    <p className="summary-text" style={{ paddingTop: 0, margin: 0 }}>
                      {result.summary}
                    </p>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* Raw JSON tab content */}
        {!error && result && activeTab !== "Analysis" && (
           <div style={{ padding: "20px" }}>
             <pre className="code-block" style={{ margin: 0 }}>
               {JSON.stringify(result, null, 2)}
             </pre>
           </div>
        )}

      </div>
    </>
  );
}

