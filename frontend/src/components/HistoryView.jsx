import { useEffect, useState } from "react";
import api from "../api/api.js";

export default function HistoryView({ onOpen }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/review")
      .then((res) => setReviews(res.data))
      .catch(() => setError("Could not load history."))
      .finally(() => setLoading(false));
  }, []);

  const deleteReview = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/review/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Could not delete review.");
    }
  };

  const scoreClass = (n) =>
    n >= 7 ? "score-high" : n >= 5 ? "score-mid" : "score-low";

  return (
    <div className="main">
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Review History</span>
        <span className="topbar-sep">/</span>
        <span className="topbar-sub">
          {reviews.length} reviews
        </span>
      </div>

      <div className="content" style={{ display: "block", overflowY: "auto", padding: "20px" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", color: "var(--text-3)", fontSize: "13px" }}>
            Loading…
          </div>
        )}

        {!loading && error && (
          <div style={{
            background: "var(--red-dim)", border: "1px solid rgba(240,79,95,.3)",
            color: "var(--red)", borderRadius: "6px", padding: "12px 14px", fontSize: "13px",
          }}>{error}</div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/>
              </svg>
            </div>
            <div className="empty-title">No reviews yet</div>
            <div className="empty-desc">Your analyzed code reviews will appear here.</div>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {reviews.map((review) => {
              const rating = review.result?.rating;
              const scClass = scoreClass(rating);

              return (
                <div
                  key={review._id}
                  onClick={() => onOpen(review)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "6px", padding: "14px 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "14px",
                    transition: "border-color .12s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-2)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {/* Score */}
                  <div className={`score-circle ${scClass}`} style={{ width: "38px", height: "38px", fontSize: "13px" }}>
                    {rating ?? "–"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <span style={{
                        fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace",
                        color: "var(--accent)", background: "var(--accent-dim)",
                        border: "1px solid rgba(59,126,255,.2)", padding: "1px 6px", borderRadius: "3px",
                      }}>{review.language}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {" · "}
                        {new Date(review.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div style={{
                      fontSize: "12px", color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {review.codeSnippet?.split("\n")[0] || "—"}
                    </div>
                  </div>

                  <button
                    onClick={(e) => deleteReview(review._id, e)}
                    title="Delete"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-3)", padding: "4px", borderRadius: "4px", flexShrink: 0,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-3)"}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <polyline points="3 4 13 4"/><path d="M5 4V2h6v2"/><path d="M6 7v5M10 7v5"/><rect x="4" y="4" width="8" height="10" rx="1"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
