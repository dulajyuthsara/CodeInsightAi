import { useState } from "react";

const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="6 4 10 8 6 12"/>
  </svg>
);

function Section({ label, items, dotColor, badgeColor }) {
  const [open, setOpen] = useState(true);
  if (!items?.length) return null;

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "11px 20px", background: "var(--surface)", border: "none",
          cursor: "pointer", textAlign: "left", color: "var(--text)",
          fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "12px", fontWeight: 500,
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: dotColor, flexShrink: 0 }} />
        {label}
        <span style={{
          marginLeft: "auto", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 400, padding: "1px 6px", borderRadius: "3px",
          color: badgeColor.text, border: `1px solid ${badgeColor.border}`,
          background: badgeColor.bg,
        }}>{items.length}</span>
        <span style={{ color: "var(--text-3)", transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 20px 16px", background: "var(--bg)" }}>
          {items.map((item, i) => (
            <FindingCard key={i} item={item} num={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function FindingCard({ item, num }) {
  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: "6px",
      marginTop: "10px", overflow: "hidden", background: "var(--surface)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px" }}>
        <span style={{
          width: "18px", height: "18px", borderRadius: "3px", background: "var(--surface-2)",
          border: "1px solid var(--border-2)", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace",
          color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{num}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "12.5px", color: "var(--text)", lineHeight: 1.55, margin: 0 }}>{item.text}</p>
          {item.line && (
            <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-3)", margin: "3px 0 0" }}>
              {item.line}
            </p>
          )}
        </div>
      </div>
      {item.fix && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "10px 12px", background: "var(--bg)" }}>
          <div style={{
            fontSize: "10px", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase",
            color: "var(--text-3)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px",
          }}>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Suggested fix
          </div>
          <pre style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", lineHeight: "18px",
            color: "#a8b8d8", background: "#0a0c10", border: "1px solid var(--border)",
            borderRadius: "4px", padding: "10px 12px", overflowX: "auto",
            whiteSpace: "pre", margin: 0,
          }}>{item.fix}</pre>
        </div>
      )}
    </div>
  );
}

export default function ResultsPanel({ result, error, loading, loadMsg }) {
  const scoreClass = (n) => (n >= 7 ? { color: "var(--green)", border: "var(--green)", bg: "var(--green-dim)" }
    : n >= 5 ? { color: "var(--amber)", border: "var(--amber)", bg: "var(--amber-dim)" }
    : { color: "var(--red)", border: "var(--red)", bg: "var(--red-dim)" });

  const redBadge   = { text: "var(--red)",   border: "rgba(240,79,95,.3)",   bg: "var(--red-dim)" };
  const blueBadge  = { text: "var(--accent)", border: "rgba(59,126,255,.3)", bg: "var(--accent-dim)" };
  const greenBadge = { text: "var(--green)",  border: "rgba(52,196,124,.3)", bg: "var(--green-dim)" };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", borderBottom: "1px solid var(--border)",
        background: "var(--surface)", padding: "0 16px", flexShrink: 0,
      }}>
        {["Analysis", "Raw JSON"].map((tab, i) => (
          <div key={tab} style={{
            padding: "10px 14px", fontSize: "12px", fontWeight: 500,
            color: i === 0 ? "var(--text)" : "var(--text-3)",
            borderBottom: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: "-1px", cursor: "pointer",
          }}>{tab}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Loading state */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: "12px",
          }}>
            <div style={{
              width: "28px", height: "28px", border: "2px solid var(--border-2)",
              borderTopColor: "var(--accent)", borderRadius: "50%",
              animation: "spin .7s linear infinite",
            }} />
            <span style={{ fontSize: "12px", color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" }}>
              {loadMsg}
            </span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ padding: "24px 20px" }}>
            <div style={{
              background: "var(--red-dim)", border: "1px solid rgba(240,79,95,.3)",
              color: "var(--red)", borderRadius: "6px", padding: "12px 14px", fontSize: "13px",
            }}>{error}</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !result && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: "10px",
            color: "var(--text-3)", padding: "40px", textAlign: "center",
          }}>
            <div style={{
              width: "40px", height: "40px", border: "1px solid var(--border-2)",
              borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "4px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-2)" }}>No analysis yet</div>
            <div style={{ fontSize: "12px", maxWidth: "220px" }}>
              Paste code and click Analyze to get detailed feedback from the AI reviewer.
            </div>
          </div>
        )}

        {/* Result */}
        {!loading && !error && result && (() => {
          const sc = result.rating;
          const scoreStyle = scoreClass(sc);
          return (
            <>
              {/* Score banner */}
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: "20px",
                background: "var(--surface)", flexShrink: 0,
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
                  flexShrink: 0, border: `2px solid ${scoreStyle.border}`,
                  color: scoreStyle.color, background: scoreStyle.bg,
                }}>
                  {sc}<span style={{ fontSize: "10px", fontWeight: 400 }}>/10</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>Quality Score</div>
                  <div style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", marginTop: "2px" }}>
                    Reviewed {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { val: result.bugs?.length ?? 0, key: "Bugs", color: "var(--red)" },
                    { val: result.security_issues?.length ?? 0, key: "Security", color: "var(--red)" },
                    { val: result.improvements?.length ?? 0, key: "Hints", color: "var(--accent)" },
                  ].map(({ val, key, color }) => (
                    <div key={key} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color }}>{val}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: "1px" }}>{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Section label="Bugs"             items={result.bugs}             dotColor="var(--red)"   badgeColor={redBadge} />
              <Section label="Security Issues"  items={result.security_issues}  dotColor="var(--red)"   badgeColor={redBadge} />
              <Section label="Improvements"     items={result.improvements}     dotColor="var(--accent)" badgeColor={blueBadge} />

              {/* Summary */}
              {result.summary && (
                <div style={{ borderBottom: "1px solid var(--border)" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 20px", background: "var(--surface)",
                    fontSize: "12px", fontWeight: 500, color: "var(--text)",
                  }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "var(--green)", flexShrink: 0 }} />
                    Summary
                  </div>
                  <div style={{ padding: "12px 20px 16px", background: "var(--bg)" }}>
                    <p style={{ fontSize: "12.5px", color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>
                      {result.summary}
                    </p>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
