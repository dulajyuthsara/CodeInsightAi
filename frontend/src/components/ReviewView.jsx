import { useState, useEffect, useRef } from "react";
import api from "../api/api.js";
import ResultsPanel from "./ResultsPanel.jsx";

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust"];
const EXT_MAP   = { javascript: "js", typescript: "ts", python: "py", java: "java", cpp: "cpp", go: "go", rust: "rs" };

const LOADING_MSGS = [
  "Analyzing code…",
  "Detecting issues…",
  "Reviewing security…",
  "Generating report…",
];

export default function ReviewView({ prefill, onClear }) {
  const [code, setCode]       = useState("");
  const [lang, setLang]       = useState("javascript");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [loadMsg, setLoadMsg] = useState(LOADING_MSGS[0]);
  const [lineCount, setLineCount] = useState(1);
  const taRef  = useRef(null);
  const numRef = useRef(null);
  const timerRef = useRef(null);

  // Load prefilled review from history
  useEffect(() => {
    if (prefill) {
      setCode(prefill.codeSnippet || "");
      setLang(prefill.language || "javascript");
      setResult(prefill.result);
      updateLines(prefill.codeSnippet || "");
      onClear?.();
    }
  }, [prefill]);

  const updateLines = (val) => {
    setLineCount(val.split("\n").length);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    updateLines(e.target.value);
  };

  const syncScroll = () => {
    if (numRef.current && taRef.current) {
      numRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setCode(text);
      updateLines(text);
    };
    reader.readAsText(file);
  };

  const analyze = async () => {
    if (!code.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);

    let i = 0;
    timerRef.current = setInterval(() => {
      setLoadMsg(LOADING_MSGS[i++ % LOADING_MSGS.length]);
    }, 900);

    try {
      const res = await api.post("/review", { code, language: lang });
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const clearAll = () => {
    setCode("");
    setResult(null);
    setError("");
    setLineCount(1);
  };

  const filename = `untitled.${EXT_MAP[lang] || lang}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Topbar */}
      <div style={s.topbar}>
        <span style={s.topbarTitle}>Code Review</span>
        <span style={s.topbarSep}>/</span>
        <span style={s.topbarFile}>{filename}</span>
        <div style={s.topbarActions}>
          <button style={s.btnGhost} onClick={clearAll}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
            Clear
          </button>
          <button style={{ ...s.btnPrimary, opacity: loading || !code.trim() ? 0.45 : 1 }}
            onClick={analyze} disabled={loading || !code.trim()}>
            {loading ? (
              <>
                <span style={s.spinner} />
                {loadMsg}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="4,2 14,8 4,14"/>
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-panel body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Editor */}
        <div style={s.editorPanel}>
          <div style={s.panelHeader}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--text-3)" strokeWidth="1.6">
              <rect x="2" y="2" width="12" height="12" rx="1"/>
              <line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="9" y2="8"/>
              <line x1="5" y1="11" x2="11" y2="11"/>
            </svg>
            <span style={s.panelTitle}>Source Code</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={s.langSelect}>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
            {/* Line numbers */}
            <div ref={numRef} style={s.lineNums}>
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i} style={s.lineNum}>{i + 1}</span>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={taRef}
              value={code}
              onChange={handleCodeChange}
              onScroll={syncScroll}
              spellCheck={false}
              placeholder="Paste your source code here…"
              style={s.textarea}
            />
          </div>

          <div style={s.editorFooter}>
            <span style={s.charCount}>{code.length.toLocaleString()} chars · {lineCount} lines</span>
            <label style={s.uploadLabel}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M8 10V4M5 7l3-3 3 3"/><path d="M3 13h10"/>
              </svg>
              Upload file
              <input type="file" accept=".js,.ts,.py,.java,.cpp,.go,.rs,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        {/* Results */}
        <ResultsPanel result={result} error={error} loading={loading} loadMsg={loadMsg} />
      </div>
    </div>
  );
}

const s = {
  topbar: {
    height: "49px", borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", padding: "0 20px", gap: "10px",
    flexShrink: 0, background: "var(--surface)",
  },
  topbarTitle: { fontSize: "13px", fontWeight: 500, color: "var(--text)" },
  topbarSep:   { color: "var(--text-3)", fontSize: "13px" },
  topbarFile:  { fontSize: "12px", color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" },
  topbarActions: { marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" },
  btnGhost: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500,
    fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer",
    background: "transparent", color: "var(--text-2)",
    border: "1px solid var(--border)",
  },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 500,
    fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer",
    background: "var(--accent)", color: "#fff", border: "none",
  },
  spinner: {
    display: "inline-block", width: "11px", height: "11px",
    border: "1.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin .7s linear infinite",
  },
  editorPanel: {
    width: "52%", borderRight: "1px solid var(--border)",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  panelHeader: {
    padding: "10px 16px", borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
    background: "var(--surface)",
  },
  panelTitle: { fontSize: "12px", fontWeight: 500, color: "var(--text-2)" },
  langSelect: {
    background: "var(--surface-2)", border: "1px solid var(--border)",
    color: "var(--text)", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace",
    padding: "3px 8px", borderRadius: "4px", cursor: "pointer", outline: "none",
    marginLeft: "auto",
  },
  lineNums: {
    width: "44px", background: "var(--surface)", borderRight: "1px solid var(--border)",
    padding: "16px 0", overflowY: "hidden", flexShrink: 0,
    display: "flex", flexDirection: "column",
  },
  lineNum: {
    display: "block", textAlign: "right", paddingRight: "10px",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
    color: "var(--text-3)", lineHeight: "20px", userSelect: "none",
  },
  textarea: {
    flex: 1, background: "var(--bg)", color: "var(--text)",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "12.5px",
    lineHeight: "20px", padding: "16px", overflowY: "auto", tabSize: 2,
  },
  editorFooter: {
    padding: "8px 16px", borderTop: "1px solid var(--border)",
    display: "flex", alignItems: "center", gap: "12px", flexShrink: 0,
    background: "var(--surface)",
  },
  charCount: { fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-3)" },
  uploadLabel: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    fontSize: "11px", color: "var(--text-3)", cursor: "pointer",
    padding: "3px 8px", borderRadius: "4px",
    border: "1px dashed var(--border-2)",
  },
};

// Inject spin keyframe once
if (typeof document !== "undefined" && !document.getElementById("spin-kf")) {
  const style = document.createElement("style");
  style.id = "spin-kf";
  style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(style);
}
