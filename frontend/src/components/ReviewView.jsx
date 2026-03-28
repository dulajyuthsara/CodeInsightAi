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

  useEffect(() => {
    if (prefill) {
      setCode(prefill.codeSnippet || "");
      setLang(prefill.language || "javascript");
      setResult(prefill.result);
      updateLines(prefill.codeSnippet || "");
      onClear?.();
    }
  }, [prefill, onClear]);

  const updateLines = (val) => {
    const lines = val.split("\n").length;
    setLineCount(lines === 0 ? 1 : lines);
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
      setLoadMsg(LOADING_MSGS[++i % LOADING_MSGS.length]);
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
    <div className="main">
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Code Review</span>
        <span className="topbar-sep">/</span>
        <span className="topbar-sub">{filename}</span>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={clearAll}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
            Clear
          </button>
          <button className="btn btn-ghost" disabled={!result}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 2h8a1 1 0 011 1v11l-4-2-4 2V3a1 1 0 011-1z"/>
            </svg>
            Save
          </button>
          <button 
            className="btn btn-primary" 
            onClick={analyze} 
            disabled={loading || !code.trim()}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="4,2 14,8 4,14"/>
            </svg>
            Analyze
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content" style={{ position: "relative" }}>
        
        {/* Loading overlay */}
        <div className={`loading-overlay ${loading ? "active" : ""}`}>
          <div className="spinner"></div>
          <span className="loading-text">{loadMsg}</span>
        </div>

        {/* Editor Panel */}
        <div className="editor-panel">
          <div className="panel-header">
            <svg style={{ width: "13px", height: "13px", color: "var(--text-3)" }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="2" width="12" height="12" rx="1"/>
              <line x1="5" y1="5" x2="11" y2="5"/>
              <line x1="5" y1="8" x2="9" y2="8"/>
              <line x1="5" y1="11" x2="11" y2="11"/>
            </svg>
            <span className="panel-title">Source Code</span>
            <select 
              className="lang-select" 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              style={{ marginLeft: "auto" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="editor-wrap">
            <div className="line-nums" ref={numRef}>
              {Array.from({ length: lineCount }, (_, i) => (
                <span className="line-num" key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              id="codeInput"
              ref={taRef}
              spellCheck="false"
              placeholder="Paste your source code here…"
              value={code}
              onChange={handleCodeChange}
              onScroll={syncScroll}
            ></textarea>
          </div>

          <div className="editor-footer">
            <span className="char-count">{code.length.toLocaleString()} chars · {lineCount} lines</span>
            <label className="upload-label" htmlFor="fileInput">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M8 10V4M5 7l3-3 3 3"/><path d="M3 13h10"/>
              </svg>
              Upload file
            </label>
            <input 
              type="file" 
              id="fileInput" 
              accept=".js,.ts,.py,.java,.cpp,.go,.rs,.txt" 
              onChange={handleFileUpload} 
              style={{ display: "none" }} 
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <ResultsPanel result={result} error={error} />
        </div>

      </div>
    </div>
  );
}
