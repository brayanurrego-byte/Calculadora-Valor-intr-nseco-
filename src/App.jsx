import { useState, useEffect, useRef, useCallback } from "react";

// PART 1: STYLES + MATH UTILITIES

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f5f7fa; --surface: #ffffff; --surface2: #eef1f6; --surface3: #e4e9f4;
  --border: #dce2ee; --navy: #0d2257; --navy2: #1a3a8f; --navy3: #0a1a45;
  --gold: #c9a84c; --gold2: #e8c96a; --gold-light: #fdf6e3;
  --text: #0d1b3e; --muted: #7a8ab0; --muted2: #9aabcc;
  --danger: #c0392b; --safe: #1a7a4a; --safe-bg: #eafaf1;
  --danger-bg: #fdf0ee; --hold-bg: #fdf6e3; --fmp: #2563eb;
  --shadow: 0 4px 24px rgba(13,34,87,0.10);
  --shadow-lg: 0 8px 40px rgba(13,34,87,0.15);
  --radius: 12px; --radius-sm: 7px;
  --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
}

[data-theme="dark"] {
  --bg: #080e1f; --surface: #0f1a35; --surface2: #141f3a; --surface3: #1a2848;
  --border: #1e2e55; --navy: #4a7fd4; --navy2: #6ea0e8; --navy3: #2a4a8f;
  --gold: #e8c96a; --gold2: #f5df8f; --gold-light: #2a2000;
  --text: #e8f0ff; --muted: #8fa3cc; --muted2: #6a82aa;
  --danger: #e74c3c; --safe: #2ecc71; --safe-bg: #0a2a1a;
  --danger-bg: #2a0a08; --hold-bg: #1a1500; --fmp: #60a5fa;
  --shadow: 0 4px 24px rgba(0,0,0,0.4); --shadow-lg: 0 8px 40px rgba(0,0,0,0.5);
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; min-height: 100vh; transition: background var(--transition), color var(--transition); }

/* ── LAYOUT ── */
.app { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem 5rem; }

/* ── HEADER ── */
.header {
  background: linear-gradient(135deg, #070f22 0%, #0d2257 50%, #0f1e4a 100%);
  margin: 0 -1.5rem 2.5rem; padding: 0;
  position: relative; overflow: hidden;
}
.header-inner { padding: 2.4rem 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; position: relative; z-index: 1; }
.header::before {
  content: ''; position: absolute; top: -40%; right: -10%; width: 600px; height: 400px;
  background: radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.header::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
}
.header-left h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.7rem, 4vw, 2.6rem); font-weight: 900; color: #fff; letter-spacing: -0.03em; line-height: 1.05; }
.header-left h1 span { color: var(--gold2); background: linear-gradient(90deg, #e8c96a, #f5df8f); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.header-left p { color: #8fa3cc; font-size: 0.82rem; margin-top: 0.45rem; font-weight: 300; letter-spacing: 0.02em; }
.header-right { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
.header-badge { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: var(--navy3); font-size: 0.65rem; font-weight: 800; padding: 0.35rem 1rem; border-radius: 3px; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; box-shadow: 0 2px 8px rgba(201,168,76,0.35); }
.btn-theme { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #e8f0ff; padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all var(--transition); font-family: 'Outfit', sans-serif; }
.btn-theme:hover { background: rgba(255,255,255,0.15); }

/* ── GRID ── */
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.2rem; }
@media (max-width: 800px) { .grid { grid-template-columns: 1fr; } .grid-3 { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .grid-3 { grid-template-columns: 1fr 1fr; } }

/* ── CARDS ── */
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.7rem; box-shadow: var(--shadow); position: relative;
  animation: fadeUp 0.45s ease both; transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
}
.card:hover { box-shadow: var(--shadow-lg); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.card:nth-child(1){animation-delay:0.05s} .card:nth-child(2){animation-delay:0.10s}
.card:nth-child(3){animation-delay:0.15s} .card:nth-child(4){animation-delay:0.20s}
.card:nth-child(5){animation-delay:0.25s} .card:nth-child(6){animation-delay:0.30s}
.card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: var(--radius) var(--radius) 0 0; }
.card-full { grid-column: 1 / -1; }

/* ── TYPOGRAPHY ── */
.method-tag { display: inline-block; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.2rem; }
.card-title { font-family: 'Playfair Display', serif; font-size: 1.08rem; font-weight: 700; color: var(--text); margin-bottom: 1.3rem; display: flex; align-items: center; gap: 0.5rem; }
.section-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 800; color: var(--text); margin-bottom: 1.2rem; padding-bottom: 0.6rem; border-bottom: 2px solid var(--border); display: flex; align-items: center; gap: 0.6rem; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; transition: background 0.3s; }
.status-dot.active { background: var(--safe); box-shadow: 0 0 0 3px rgba(26,122,74,0.18); }
.status-dot.inactive { background: var(--border); }

/* ── FORM ── */
.field { margin-bottom: 0.9rem; position: relative; }
.field label { display: flex; align-items: center; gap: 0.35rem; font-size: 0.71rem; font-weight: 600; color: var(--muted); margin-bottom: 0.28rem; text-transform: uppercase; letter-spacing: 0.06em; }
.field input, .field select {
  width: 100%; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  padding: 0.52rem 0.85rem; font-family: 'Outfit', sans-serif; font-size: 0.88rem;
  font-variant-numeric: tabular-nums; color: var(--text); background: var(--surface2);
  outline: none; transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
}
.field input:focus, .field select:focus { border-color: var(--navy2); box-shadow: 0 0 0 3px rgba(26,58,143,0.12); background: var(--surface); }
.field input[readonly] { opacity: 0.45; cursor: not-allowed; }
.field input.autofilled { border-color: var(--fmp); background: rgba(37,99,235,0.06); }
.field select { cursor: pointer; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
@media (max-width: 600px) { .field-row { grid-template-columns: 1fr; } }

/* ── SLIDERS ── */
.slider-field { margin-bottom: 0.9rem; }
.slider-label { display: flex; align-items: center; justify-content: space-between; font-size: 0.71rem; font-weight: 600; color: var(--muted); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.06em; }
.slider-label span { font-family: 'DM Mono', monospace; font-size: 0.92rem; font-weight: 500; color: var(--text); background: var(--surface2); padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid var(--border); }
input[type=range] { width: 100%; accent-color: var(--navy2); cursor: pointer; height: 4px; }

/* ── WEIGHTS ── */
.weights-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; }
.weight-chip { display: flex; flex-direction: column; align-items: center; gap: 0.22rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0.6rem 0.8rem; flex: 1; min-width: 70px; }
.weight-chip label { font-size: 0.6rem; font-weight: 700; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
.weight-chip input[type=range] { width: 100%; }
.weight-chip span { font-family: 'DM Mono', monospace; font-size: 0.8rem; font-weight: 500; color: var(--navy2); }

/* ── RESULT BOXES ── */
.results-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
@media (max-width: 720px) { .results-grid { grid-template-columns: repeat(2,1fr); } }
.result-box { border: 1px solid var(--border); border-radius: 9px; padding: 1rem 1.1rem; background: var(--surface2); transition: transform var(--transition), box-shadow var(--transition); cursor: default; }
.result-box:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(13,34,87,0.1); }
.result-box-label { font-size: 0.62rem; font-weight: 700; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
.result-box-value { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; font-variant-numeric: tabular-nums; transition: all 0.4s; }

/* ── VERDICT ── */
.verdict-row { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; background: var(--surface2); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 1.5rem 1.8rem; }
.verdict-price { font-family: 'Playfair Display', serif; font-size: 3.2rem; font-weight: 900; color: var(--text); line-height: 1; font-variant-numeric: tabular-nums; transition: all 0.4s; }
.verdict-label-sm { font-size: 0.65rem; font-weight: 700; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.3rem; }
.verdict-meta { flex: 1; min-width: 200px; }
.verdict-tag { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 1rem; border-radius: 5px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.6rem; }
.tag-buy { background: var(--safe-bg); color: var(--safe); border: 1.5px solid var(--safe); }
.tag-sell { background: var(--danger-bg); color: var(--danger); border: 1.5px solid var(--danger); }
.tag-hold { background: var(--hold-bg); color: #8a6800; border: 1.5px solid var(--gold); }
.tag-neutral { background: var(--surface2); color: var(--muted); border: 1.5px solid var(--border); }

/* ── MARGIN BAR ── */
.margin-bar { width: 100%; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 0.4rem; }
.margin-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.margin-bar-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--muted); font-weight: 500; }

/* ── ANIMATIONS ── */
@keyframes numberPop { 0% { transform: scale(1.18) translateY(-2px); opacity: 0.5; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
.number-animate { animation: numberPop 0.38s ease; }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(37,99,235,0.2); border-top-color: var(--fmp); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

/* ── TABS ── */
.tabs { display: flex; gap: 0.3rem; margin-bottom: 1.8rem; border-bottom: 2px solid var(--border); overflow-x: auto; }
.tab-btn { background: none; border: none; padding: 0.65rem 1.3rem; font-size: 0.78rem; font-weight: 700; color: var(--muted); cursor: pointer; border-bottom: 2.5px solid transparent; margin-bottom: -2px; transition: color var(--transition), border-color var(--transition), background var(--transition); border-radius: 6px 6px 0 0; font-family: 'Outfit', sans-serif; white-space: nowrap; letter-spacing: 0.02em; }
.tab-btn.active { color: var(--text); border-bottom-color: var(--gold); }
.tab-btn:hover:not(.active) { color: var(--navy2); background: var(--surface2); }

/* ── TOOLTIPS ── */
.tooltip-wrap { position: relative; display: inline-flex; }
.tooltip-icon { width: 15px; height: 15px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.58rem; display: inline-flex; align-items: center; justify-content: center; cursor: help; font-weight: 800; flex-shrink: 0; }
.tooltip-box { display: none; position: absolute; bottom: calc(100% + 7px); left: 50%; transform: translateX(-50%); background: var(--navy3); color: #c8d8f0; font-size: 0.7rem; font-weight: 400; padding: 0.55rem 0.85rem; border-radius: 7px; width: 210px; line-height: 1.55; z-index: 200; pointer-events: none; box-shadow: 0 8px 24px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); }
.tooltip-box::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: var(--navy3); }
.tooltip-wrap:hover .tooltip-box { display: block; }

/* ── SCENARIOS ── */
.scenario-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.2rem; }
@media (max-width: 600px) { .scenario-row { grid-template-columns: 1fr; } }
.scenario-card { border: 1.5px solid var(--border); border-radius: 9px; padding: 1.1rem; cursor: pointer; transition: all var(--transition); text-align: center; background: var(--surface); }
.scenario-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(13,34,87,0.12); }
.scenario-card.selected { border-color: var(--navy2); background: rgba(26,58,143,0.06); box-shadow: 0 0 0 3px rgba(26,58,143,0.1); }
.scenario-card-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.35rem; color: var(--muted); }
.scenario-card-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 0.35rem; }
.scenario-card-val { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.scenario-card-sub { font-size: 0.67rem; color: var(--muted); margin-top: 0.2rem; }

/* ── BUY TARGET ── */
.buy-target-row { background: var(--gold-light); border: 1.5px solid var(--gold); border-radius: 9px; padding: 1rem 1.4rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.buy-target-price { font-family: 'Playfair Display', serif; font-size: 2.1rem; font-weight: 900; color: var(--text); font-variant-numeric: tabular-nums; }

/* ── CONFIDENCE ── */
.confidence-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.9rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; border: 1.5px solid; }
.conf-high { background: var(--safe-bg); color: var(--safe); border-color: var(--safe); }
.conf-mid { background: var(--hold-bg); color: #8a6800; border-color: var(--gold); }
.conf-low { background: var(--surface2); color: var(--muted); border-color: var(--border); }

/* ── BUTTONS ── */
.btn-primary { background: linear-gradient(135deg, var(--navy), var(--navy2)); color: white; border: none; padding: 0.8rem 1.6rem; border-radius: 7px; font-weight: 700; cursor: pointer; transition: all var(--transition); font-size: 0.9rem; font-family: 'Outfit', sans-serif; box-shadow: 0 3px 12px rgba(13,34,87,0.25); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,34,87,0.35); }
.btn-primary:active { transform: translateY(0); }
.btn-save { width: 100%; margin-top: 1rem; }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1.5px solid var(--border); padding: 0.52rem 1.1rem; border-radius: 7px; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all var(--transition); font-family: 'Outfit', sans-serif; }
.btn-secondary:hover { background: var(--surface3); border-color: var(--navy2); color: var(--navy2); }
.btn-danger { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger); padding: 0.4rem 0.9rem; border-radius: 5px; cursor: pointer; font-size: 0.75rem; font-weight: 700; transition: background var(--transition); font-family: 'Outfit', sans-serif; }
.btn-danger:hover { background: #f9d6d2; }

/* ── MESSAGES ── */
.error-msg { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger); border-radius: 7px; padding: 0.55rem 0.85rem; font-size: 0.75rem; font-weight: 600; margin-top: 0.7rem; display: flex; align-items: center; gap: 0.4rem; }
.success-msg { background: var(--safe-bg); color: var(--safe); border: 1px solid var(--safe); border-radius: 7px; padding: 0.55rem 0.85rem; font-size: 0.75rem; font-weight: 600; margin-top: 0.7rem; display: flex; align-items: center; gap: 0.4rem; }
.warning-msg { background: var(--hold-bg); color: #7a5800; border: 1px solid var(--gold); border-radius: 7px; padding: 0.55rem 0.85rem; font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem; display: flex; align-items: flex-start; gap: 0.4rem; }
[data-theme="dark"] .warning-msg { color: #e8c96a; }

/* ── FMP PANEL ── */
.fmp-panel { background: linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(124,58,237,0.05) 100%); border: 1.5px solid rgba(147,197,253,0.4); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.6rem; position: relative; overflow: hidden; }
.fmp-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--fmp), #7c3aed, #06b6d4); }
.fmp-panel-title { font-family: 'Playfair Display', serif; font-size: 0.98rem; font-weight: 700; color: #1e40af; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
[data-theme="dark"] .fmp-panel-title { color: #60a5fa; }
.fmp-panel-sub { font-size: 0.72rem; color: #3b82f6; margin-bottom: 1rem; line-height: 1.55; }
.fmp-panel-sub a { color: var(--fmp); font-weight: 600; text-decoration: none; }
.fmp-panel-sub a:hover { text-decoration: underline; }
.fmp-input-row { display: flex; gap: 0.7rem; align-items: flex-end; flex-wrap: wrap; }
.fmp-input-row .field { flex: 1; min-width: 180px; margin-bottom: 0; }
.btn-fetch { background: var(--fmp); color: white; border: none; padding: 0.52rem 1.3rem; border-radius: 7px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all var(--transition); display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; height: 38px; font-family: 'Outfit', sans-serif; box-shadow: 0 2px 8px rgba(37,99,235,0.3); }
.btn-fetch:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
.btn-fetch:disabled { opacity: 0.6; cursor: not-allowed; }
.fmp-status { margin-top: 0.8rem; font-size: 0.74rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.fmp-status.loading { color: var(--fmp); }
.fmp-status.ok { color: var(--safe); }
.fmp-status.err { color: var(--danger); }
.fmp-loaded-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.7rem; }
.fmp-chip { border-radius: 5px; font-size: 0.62rem; font-weight: 700; padding: 0.2rem 0.55rem; display: flex; align-items: center; gap: 0.25rem; }
.fmp-chip.ok { background: var(--safe-bg); color: var(--safe); border: 1px solid; border-color: rgba(26,122,74,0.3); }
.fmp-chip.miss { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
.autofill-badge { display: inline-flex; align-items: center; gap: 0.25rem; background: rgba(37,99,235,0.1); color: #1d4ed8; border: 1px solid rgba(37,99,235,0.3); border-radius: 3px; font-size: 0.56rem; font-weight: 800; padding: 0.1rem 0.38rem; margin-left: 0.3rem; vertical-align: middle; letter-spacing: 0.06em; }
[data-theme="dark"] .autofill-badge { color: #60a5fa; background: rgba(37,99,235,0.2); }

/* ── GAUGE ── */
.gauge-dark-card { background: linear-gradient(160deg, #141d35 0%, #0d1528 60%, #101826 100%); border: 1px solid rgba(201,168,76,0.2); border-radius: 16px; padding: 1.8rem 2rem 1.4rem; box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06); display: flex; flex-direction: column; align-items: center; position: relative; overflow: hidden; }
.gauge-dark-card::before { content: ''; position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 280px; height: 100px; background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%); pointer-events: none; }
.gauge-dark-title { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8fa3cc; margin-bottom: 0.2rem; }
.gauge-dark-heading { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 800; color: #e8f0ff; margin-bottom: 1rem; }
.gauge-canvas-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.gauge-center-overlay { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); text-align: center; pointer-events: none; white-space: nowrap; }
.gauge-pct-big { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.03em; transition: color 0.5s ease; }
.gauge-pct-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 0.1rem; }
.gauge-verdict-pill { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.9rem; padding: 0.4rem 1.3rem; border-radius: 50px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; border: 1.5px solid; transition: all 0.5s ease; font-family: 'Outfit', sans-serif; }
.gauge-mini-metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem; margin-top: 1rem; width: 100%; }
.gauge-mini-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 0.55rem 0.7rem; text-align: center; }
.gauge-mini-label { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #8fa3cc; margin-bottom: 0.2rem; }
.gauge-mini-val { font-family: 'DM Mono', monospace; font-size: 0.88rem; font-weight: 500; color: #e8f0ff; }

/* ── HEATMAP ── */
.heatmap-wrap { overflow-x: auto; margin-top: 0.5rem; border-radius: 8px; }
.heatmap-table { border-collapse: separate; border-spacing: 3px; font-size: 0.68rem; width: 100%; }
.heatmap-table th { padding: 0.35rem 0.5rem; color: var(--muted); font-weight: 700; text-align: center; white-space: nowrap; font-size: 0.65rem; letter-spacing: 0.05em; }
.heatmap-table td { padding: 0.42rem 0.5rem; text-align: center; border-radius: 5px; font-variant-numeric: tabular-nums; font-weight: 700; font-size: 0.68rem; min-width: 58px; transition: all var(--transition); cursor: pointer; }
.heatmap-table td:hover { transform: scale(1.08); box-shadow: 0 3px 10px rgba(0,0,0,0.15); z-index: 10; position: relative; }
.heatmap-axis { color: var(--text) !important; font-weight: 800 !important; background: var(--surface2) !important; cursor: default !important; }
.heatmap-axis:hover { transform: none !important; box-shadow: none !important; }

/* ── WATCHLIST ── */
.watchlist { margin-top: 3rem; }
.watchlist-controls { display: flex; gap: 0.8rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.watchlist-search { flex: 1; min-width: 180px; border: 1.5px solid var(--border); border-radius: 7px; padding: 0.5rem 0.85rem; background: var(--surface); color: var(--text); font-family: 'Outfit', sans-serif; font-size: 0.85rem; outline: none; transition: border-color var(--transition); }
.watchlist-search:focus { border-color: var(--navy2); }
.watchlist-sort { border: 1.5px solid var(--border); border-radius: 7px; padding: 0.5rem 0.85rem; background: var(--surface); color: var(--text); font-family: 'Outfit', sans-serif; font-size: 0.82rem; outline: none; cursor: pointer; }
.watch-card { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 1rem 1.2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; transition: all var(--transition); }
.watch-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,34,87,0.1); border-color: var(--navy2); }
.watch-ticker { font-weight: 800; color: var(--text); font-size: 1.1rem; font-family: 'DM Mono', monospace; }
.watch-name { color: var(--muted); font-size: 0.78rem; margin-top: 0.15rem; }
.watch-numbers { text-align: right; }
.watch-val { font-weight: 700; font-size: 1.1rem; font-variant-numeric: tabular-nums; font-family: 'DM Mono', monospace; }
.watch-price { color: var(--muted); font-size: 0.78rem; font-variant-numeric: tabular-nums; }
.portfolio-bar { background: var(--surface2); border: 1px solid var(--border); border-radius: 9px; padding: 1rem 1.4rem; margin-bottom: 1.2rem; display: flex; gap: 2rem; flex-wrap: wrap; }
.portfolio-stat { display: flex; flex-direction: column; }
.portfolio-stat-label { font-size: 0.62rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
.portfolio-stat-val { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: var(--text); }

/* ── SPARKLINE ── */
.sparkline-wrap { display: inline-block; vertical-align: middle; margin-left: 0.5rem; }

/* ── CHART ── */
.chart-wrap { width: 100%; overflow-x: auto; margin-top: 0.5rem; }
.chart-legend { display: flex; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 600; color: var(--muted); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-line { width: 18px; height: 2.5px; border-radius: 2px; }
.empty-state { text-align: center; padding: 2.8rem 1rem; color: var(--muted); font-size: 0.85rem; }
.empty-icon { font-size: 2.2rem; margin-bottom: 0.6rem; display: block; }

/* ── METRIC CARDS ── */
.metric-card { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 1rem 1.2rem; border-left: 4px solid var(--gold); box-shadow: 0 2px 10px rgba(13,34,87,0.05); animation: fadeUp 0.4s ease both; }
.metric-card-label { font-size: 0.62rem; font-weight: 700; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.25rem; }
.metric-card-value { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
.metric-card-sub { font-size: 0.68rem; color: var(--muted); margin-top: 0.15rem; }

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; max-width: 540px; width: 100%; box-shadow: var(--shadow-lg); animation: slideUp 0.3s ease; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 800; color: var(--text); margin-bottom: 1rem; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--muted); font-size: 1.2rem; cursor: pointer; padding: 0.3rem; border-radius: 4px; }
.modal-close:hover { color: var(--text); background: var(--surface2); }

/* ── MONTE CARLO ── */
.mc-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; margin-bottom: 1rem; }
@media (max-width: 500px) { .mc-results { grid-template-columns: 1fr 1fr; } }
.mc-box { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0.8rem 1rem; text-align: center; }
.mc-label { font-size: 0.6rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
.mc-val { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; }

/* ── BENCHMARKS ── */
.benchmark-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
.benchmark-table th { font-size: 0.62rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; padding: 0.4rem 0.7rem; text-align: left; border-bottom: 1.5px solid var(--border); }
.benchmark-table td { padding: 0.5rem 0.7rem; border-bottom: 1px solid var(--border); color: var(--text); font-variant-numeric: tabular-nums; }
.benchmark-table tr:last-child td { border-bottom: none; }
.benchmark-table tr:hover td { background: var(--surface2); }
.benchmark-highlight { font-weight: 800; color: var(--navy2); background: rgba(26,58,143,0.06) !important; }
[data-theme="dark"] .benchmark-highlight { color: var(--gold2); }

/* ── COMPARE GRID ── */
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }
@media (max-width: 720px) { .compare-grid { grid-template-columns: 1fr; } }
.compare-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border); font-size: 0.8rem; }
.compare-row:last-child { border-bottom: none; }
.compare-key { color: var(--muted); font-weight: 500; }
.compare-val { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; font-family: 'DM Mono', monospace; font-size: 0.82rem; }

/* ── EXPORT BTN ── */
.export-row { display: flex; gap: 0.7rem; margin-bottom: 1rem; flex-wrap: wrap; }
.btn-export { background: var(--surface2); color: var(--text); border: 1.5px solid var(--border); padding: 0.5rem 1.1rem; border-radius: 7px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all var(--transition); font-family: 'Outfit', sans-serif; display: flex; align-items: center; gap: 0.4rem; }
.btn-export:hover { background: var(--navy); color: white; border-color: var(--navy); transform: translateY(-1px); }

/* ── CAPM SECTION ── */
.capm-panel { background: var(--surface2); border: 1px solid var(--border); border-radius: 9px; padding: 1rem 1.2rem; margin-top: 0.5rem; }
.capm-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; font-weight: 700; color: var(--muted); cursor: pointer; user-select: none; margin-bottom: 0; text-transform: uppercase; letter-spacing: 0.08em; }
.capm-toggle input[type=checkbox] { accent-color: var(--navy2); cursor: pointer; width: 15px; height: 15px; }
.capm-fields { margin-top: 0.8rem; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.7rem; }
@media (max-width: 500px) { .capm-fields { grid-template-columns: 1fr 1fr; } }
.capm-result { font-size: 0.75rem; font-weight: 600; color: var(--fmp); margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem; }

/* ── DDM SECTION ── */
.ddm-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }

/* ── DIVIDER ── */
hr { border: none; border-top: 1px solid var(--border); margin: 1.2rem 0; }

/* ── FOOTNOTE ── */
.footnote { text-align: center; font-size: 0.68rem; color: var(--muted); margin-top: 2.5rem; line-height: 1.9; background: var(--surface2); border-radius: 9px; padding: 1.2rem; border: 1px solid var(--border); }

/* ── WATERFALL LABELS ── */
.waterfall-labels { display: flex; justify-content: space-around; margin-top: 0.3rem; font-size: 0.65rem; color: var(--muted); font-weight: 600; font-family: 'DM Mono', monospace; }

/* ── SENSITIVITY CELL POPUP ── */
.cell-popup { position: fixed; background: var(--surface); border: 1.5px solid var(--border); border-radius: 9px; padding: 1rem 1.2rem; box-shadow: var(--shadow-lg); z-index: 300; min-width: 200px; pointer-events: none; font-size: 0.78rem; }
.cell-popup-title { font-family: 'Playfair Display', serif; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; font-size: 0.9rem; }
.cell-popup-row { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 0.3rem; color: var(--muted); }
.cell-popup-row span:last-child { font-weight: 700; color: var(--text); font-family: 'DM Mono', monospace; }

/* ── HISTOGRAM ── */
.histogram-bar-wrap { display: flex; align-items: flex-end; gap: 2px; height: 80px; margin-top: 0.5rem; }
.histogram-bar { background: linear-gradient(180deg, var(--navy2), var(--navy)); border-radius: 2px 2px 0 0; min-width: 4px; transition: height 0.6s ease; flex: 1; }
.histogram-bar.current { background: linear-gradient(180deg, var(--gold), var(--gold2)); }
`;
// PART 2: MATH + API + HELPERS

const FMP_BASE = "https://financialmodelingprep.com/api/v3";

async function fetchFMPData(ticker, apiKey) {
  const urls = {
    profile: `${FMP_BASE}/profile/${ticker}?apikey=${apiKey}`,
    income: `${FMP_BASE}/income-statement/${ticker}?limit=3&apikey=${apiKey}`,
    cashflow: `${FMP_BASE}/cash-flow-statement/${ticker}?limit=3&apikey=${apiKey}`,
    balance: `${FMP_BASE}/balance-sheet-statement/${ticker}?limit=1&apikey=${apiKey}`,
    keyMetrics: `${FMP_BASE}/key-metrics/${ticker}?limit=1&apikey=${apiKey}`,
    quote: `${FMP_BASE}/quote/${ticker}?apikey=${apiKey}`,
    dividends: `${FMP_BASE}/historical-price-full/stock_dividend/${ticker}?apikey=${apiKey}`,
  };
  const results = await Promise.allSettled(
    Object.entries(urls).map(([key, url]) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(d => ({ key, data: d })); })
    )
  );
  const out = {};
  results.forEach(r => { if (r.status === "fulfilled") out[r.value.key] = r.value.data; });
  return out;
}

function parseFMPData(raw) {
  const parsed = {}, loaded = {};
  try { const p = raw.profile?.[0]; if (p) { parsed.companyName = p.companyName || ""; parsed.currentPrice = p.price ? String(p.price) : ""; parsed.shares = p.sharesOutstanding ? String((p.sharesOutstanding/1e6).toFixed(2)) : ""; parsed.beta = p.beta ? String(p.beta.toFixed(2)) : "1.0"; loaded.companyName=!!p.companyName; loaded.currentPrice=!!p.price; loaded.shares=!!p.sharesOutstanding; loaded.beta=!!p.beta; } } catch{}
  try { const q = raw.quote?.[0]; if (q?.price && !parsed.currentPrice) { parsed.currentPrice=String(q.price); loaded.currentPrice=true; } } catch{}
  try { const cf=raw.cashflow; if(cf?.length>0){ const fcfs=cf.slice(0,3).map(y=>y.freeCashFlow).filter(v=>typeof v==="number"&&!isNaN(v)); if(fcfs.length>0){parsed.fcf=String((fcfs.reduce((a,b)=>a+b,0)/fcfs.length/1e6).toFixed(1)); loaded.fcf=true;} } } catch{}
  try { const inc=raw.income?.[0]; if(inc){parsed.eps=inc.eps?String(inc.eps.toFixed(2)):""; parsed.ebitda=inc.ebitda?String((inc.ebitda/1e6).toFixed(1)):""; loaded.eps=!!inc.eps; loaded.ebitda=!!inc.ebitda;} } catch{}
  try { const bal=raw.balance?.[0]; if(bal){parsed.debt=bal.totalDebt?String((bal.totalDebt/1e6).toFixed(1)):"0"; parsed.cash=bal.cashAndCashEquivalents?String((bal.cashAndCashEquivalents/1e6).toFixed(1)):"0"; parsed.bookValue=(bal.totalStockholdersEquity&&raw.profile?.[0]?.sharesOutstanding)?String((bal.totalStockholdersEquity/raw.profile[0].sharesOutstanding).toFixed(2)):""; loaded.debt=!!bal.totalDebt; loaded.cash=!!bal.cashAndCashEquivalents; loaded.bookValue=!!parsed.bookValue;} } catch{}
  try { const km=raw.keyMetrics?.[0]; if(km){ if(km.peRatio&&!isNaN(km.peRatio)&&km.peRatio>0&&km.peRatio<200){parsed.peTarget=String(Math.round(km.peRatio)); loaded.peTarget=true;} if(km.enterpriseValueOverEBITDA&&!isNaN(km.enterpriseValueOverEBITDA)&&km.enterpriseValueOverEBITDA>0&&km.enterpriseValueOverEBITDA<80){parsed.evMultiple=String(km.enterpriseValueOverEBITDA.toFixed(1)); loaded.evMultiple=true;} if(km.revenueGrowth&&!isNaN(km.revenueGrowth)){const g=Math.round(Math.abs(km.revenueGrowth)*100); if(g>=1&&g<=50){parsed.growthRate=String(g); loaded.growthRate=true;}} } } catch{}
  try { const divs=raw.dividends?.historical; if(divs?.length>=2){ const recent=divs.slice(0,4); const annualDiv=recent.reduce((a,b)=>a+(b.dividend||0),0); if(annualDiv>0){parsed.annualDividend=String(annualDiv.toFixed(3)); loaded.annualDividend=true;} } } catch{}
  return {parsed,loaded};
}

// ── MATH HELPERS ──
function calcDCF({fcf,growthRate,terminalGrowth,discountRate,years,shares}){
  if(!fcf||!shares||!discountRate||discountRate<=terminalGrowth) return {value:null,projections:[],pvTV:null,totalPV:null};
  const g=growthRate/100,r=discountRate/100,tg=terminalGrowth/100;
  let pv=0,cf=fcf; const projections=[];
  for(let i=1;i<=years;i++){ cf*=(1+g); const pvCF=cf/Math.pow(1+r,i); pv+=pvCF; projections.push({year:i,fcf:cf,pvFCF:pvCF}); }
  const tv=cf*(1+tg)/(r-tg); const pvTV=tv/Math.pow(1+r,years);
  return {value:(pv+pvTV)/shares,projections,pvTV,totalPV:pv};
}

const calcGraham=({eps,bookValue})=>eps>0&&bookValue>0?Math.sqrt(22.5*eps*bookValue):null;
const calcPE=({eps,peTarget})=>eps&&peTarget?eps*peTarget:null;
const calcEV=({ebitda,evMultiple,debt,cash,shares})=>ebitda&&evMultiple&&shares?(ebitda*evMultiple-(debt||0)+(cash||0))/shares:null;
const calcDDM=({annualDividend,dividendGrowth,discountRate})=>{
  const dg=dividendGrowth/100,r=discountRate/100;
  if(!annualDividend||r<=dg) return null;
  const nextDiv=annualDividend*(1+dg);
  return nextDiv/(r-dg);
};
const calcCAPM=({riskFree,beta,marketPremium})=>{
  const rf=parseFloat(riskFree)||2.5, b=parseFloat(beta)||1.0, mp=parseFloat(marketPremium)||6.0;
  return rf+b*mp;
};

function weightedAvg(pairs){
  let sum=0,wsum=0;
  pairs.forEach(([v,w])=>{if(v!==null&&v>0&&w>0){sum+=v*w;wsum+=w;}});
  return wsum>0?sum/wsum:null;
}

const fmt=(n)=>(n===null||n===undefined||isNaN(n))?"—":"$"+Number(n).toFixed(2);
const pct=(n)=>{if(n===null||n===undefined)return"—"; const v=Math.round(n); return(v>0?"+":"")+v+"%";};
const p=(v)=>parseFloat(v)||0;

function confidenceScore(vals){
  const active=vals.filter(v=>v!==null&&v>0);
  if(active.length<2) return {score:0,label:"Insuficiente datos",cls:"conf-low",cv:null};
  const mean=active.reduce((a,b)=>a+b,0)/active.length;
  const variance=active.reduce((acc,v)=>acc+Math.pow(v-mean,2),0)/active.length;
  const cv=Math.sqrt(variance)/mean*100;
  const score=Math.max(0,Math.min(10,Math.round((1-cv/100)*10)));
  const suggestion=cv>30?"Amplia dispersión: considera revisar supuestos":cv>15?"Dispersión media: ajusta growth si necesario":"Alta consistencia entre métodos";
  if(score>=7) return {score,label:`Alta consistencia (${score}/10)`,cls:"conf-high",cv:cv.toFixed(1),suggestion};
  if(score>=4) return {score,label:`Consistencia media (${score}/10)`,cls:"conf-mid",cv:cv.toFixed(1),suggestion};
  return {score,label:`Baja consistencia (${score}/10)`,cls:"conf-low",cv:cv.toFixed(1),suggestion};
}

// ── MONTE CARLO ──
function runMonteCarlo({fcf,growthRate,discountRate,terminalGrowth,years,shares,iterations=1500}){
  if(!fcf||!shares) return null;
  const results=[];
  for(let i=0;i<iterations;i++){
    const g=Math.max(0,growthRate+(Math.random()-0.5)*growthRate*0.6);
    const r=Math.max(discountRate*0.6,discountRate+(Math.random()-0.5)*discountRate*0.5);
    const tg=Math.max(0,Math.min(terminalGrowth*1.5,terminalGrowth+(Math.random()-0.5)*1.5));
    const res=calcDCF({fcf,growthRate:g,terminalGrowth:tg,discountRate:r,years,shares});
    if(res.value&&res.value>0&&res.value<fcf*200) results.push(res.value);
  }
  if(results.length===0) return null;
  results.sort((a,b)=>a-b);
  const n=results.length;
  return {
    p10:results[Math.floor(n*0.10)], p25:results[Math.floor(n*0.25)],
    p50:results[Math.floor(n*0.50)], p75:results[Math.floor(n*0.75)],
    p90:results[Math.floor(n*0.90)],
    mean:results.reduce((a,b)=>a+b,0)/n,
    histogram:buildHistogram(results,30),
    raw:results,
  };
}

function buildHistogram(data,bins){
  const mn=data[0],mx=data[data.length-1],range=mx-mn||1;
  const counts=new Array(bins).fill(0);
  data.forEach(v=>{ const b=Math.min(bins-1,Math.floor((v-mn)/range*bins)); counts[b]++; });
  return {counts,min:mn,max:mx,binWidth:range/bins};
}

// ── SECTOR BENCHMARKS ──
const SECTOR_BENCHMARKS = {
  "Tecnología":    {pe:28,ev:20,growth:15,wacc:9,description:"Software, hardware, semiconductores"},
  "Salud":         {pe:22,ev:14,growth:10,wacc:8,description:"Farmacéuticas, biotecnología, dispositivos"},
  "Finanzas":      {pe:13,ev:11,growth:7,wacc:10,description:"Bancos, seguros, servicios financieros"},
  "Consumo":       {pe:20,ev:13,growth:8,wacc:8,description:"Bienes de consumo, retail"},
  "Energía":       {pe:12,ev:8,growth:5,wacc:11,description:"Petróleo, gas, renovables"},
  "Industria":     {pe:18,ev:12,growth:7,wacc:9,description:"Manufactura, transporte, defensa"},
  "Inmobiliario":  {pe:40,ev:18,growth:4,wacc:7,description:"REITs, propiedades comerciales"},
  "Utilidades":    {pe:17,ev:10,growth:3,wacc:7,description:"Electricidad, agua, gas"},
  "Materiales":    {pe:15,ev:9,growth:6,wacc:9,description:"Minería, químicos, construcción"},
  "Telecom":       {pe:14,ev:7,growth:4,wacc:8,description:"Telecomunicaciones, media"},
  "S&P 500 (Prom)":{pe:21,ev:14,growth:8,wacc:9,description:"Promedio del mercado"},
};

const SCENARIOS=[
  {key:"conservador",name:"Conservador",icon:"🛡️",growthMult:0.65,discountAdd:2.5,terminalMult:0.75,peTargetMult:0.78,evMult:0.82,color:"#e74c3c"},
  {key:"base",name:"Base",icon:"⚖️",growthMult:1,discountAdd:0,terminalMult:1,peTargetMult:1,evMult:1,color:"#c9a84c"},
  {key:"optimista",name:"Optimista",icon:"🚀",growthMult:1.35,discountAdd:-1.5,terminalMult:1.25,peTargetMult:1.22,evMult:1.18,color:"#1a7a4a"},
];

const FIELD_LABELS={companyName:"Nombre empresa",currentPrice:"Precio actual",shares:"Acciones (M)",fcf:"FCF (M$)",eps:"EPS",ebitda:"EBITDA (M$)",debt:"Deuda (M$)",cash:"Efectivo (M$)",bookValue:"Book Value/acción",peTarget:"P/E objetivo",evMultiple:"EV/EBITDA múltiplo",growthRate:"Tasa crecimiento%",beta:"Beta",annualDividend:"Dividendo anual"};
// PART 3: CANVAS DRAWING FUNCTIONS

function drawPremiumGauge(canvas, marginPct) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = 320, H = 200;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H - 28, R = 118, thickness = 26, innerR = R - thickness;
  const startAngle = Math.PI, endAngle = 2 * Math.PI;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.arc(cx,cy,R+3,startAngle,endAngle); ctx.arc(cx,cy,innerR-3,endAngle,startAngle,true); ctx.closePath(); ctx.fillStyle="rgba(0,0,0,0.35)"; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.arc(cx,cy,R,startAngle,endAngle); ctx.arc(cx,cy,innerR,endAngle,startAngle,true); ctx.closePath(); ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fill();
  const zones=[{from:0,to:0.28,colorA:"#c0392b",colorB:"#e74c3c"},{from:0.28,to:0.48,colorA:"#e67e22",colorB:"#f39c12"},{from:0.48,to:0.68,colorA:"#f1c40f",colorB:"#e8c96a"},{from:0.68,to:0.84,colorA:"#2ecc71",colorB:"#27ae60"},{from:0.84,to:1.0,colorA:"#1abc9c",colorB:"#16a085"}];
  zones.forEach(z=>{
    const sa=startAngle+z.from*Math.PI,ea=startAngle+z.to*Math.PI;
    const gx1=cx+(innerR+thickness*0.3)*Math.cos(sa),gy1=cy+(innerR+thickness*0.3)*Math.sin(sa);
    const gx2=cx+(innerR+thickness*0.3)*Math.cos(ea),gy2=cy+(innerR+thickness*0.3)*Math.sin(ea);
    const grad=ctx.createLinearGradient(gx1,gy1,gx2,gy2); grad.addColorStop(0,z.colorA); grad.addColorStop(1,z.colorB);
    ctx.beginPath(); ctx.arc(cx,cy,R,sa,ea); ctx.arc(cx,cy,innerR,ea,sa,true); ctx.closePath(); ctx.fillStyle=grad; ctx.fill();
  });
  const glossGrad=ctx.createLinearGradient(0,cy-R,0,cy-innerR); glossGrad.addColorStop(0,"rgba(255,255,255,0.15)"); glossGrad.addColorStop(1,"rgba(255,255,255,0)");
  ctx.beginPath(); ctx.arc(cx,cy,R,startAngle,endAngle); ctx.arc(cx,cy,innerR,endAngle,startAngle,true); ctx.closePath(); ctx.fillStyle=glossGrad; ctx.fill();
  [-50,-25,0,25,50,75,100].forEach(val=>{
    const norm=(val+50)/150,angle=startAngle+norm*Math.PI;
    ctx.beginPath(); ctx.moveTo(cx+(R+7)*Math.cos(angle),cy+(R+7)*Math.sin(angle)); ctx.lineTo(cx+(R+2)*Math.cos(angle),cy+(R+2)*Math.sin(angle)); ctx.strokeStyle="rgba(255,255,255,0.65)"; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle="rgba(180,200,240,0.7)"; ctx.font="500 8px 'Outfit',sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(val+"%",cx+(R+19)*Math.cos(angle),cy+(R+19)*Math.sin(angle));
  });
  ctx.beginPath(); ctx.arc(cx,cy,innerR-1,0,Math.PI*2); ctx.fillStyle="#0c1220"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,innerR-1,0,Math.PI*2); ctx.strokeStyle="rgba(255,255,255,0.05)"; ctx.lineWidth=1; ctx.stroke();
  const clamped=Math.max(-50,Math.min(100,marginPct??-50));
  const norm=(clamped+50)/150,needleAngle=startAngle+norm*Math.PI;
  const glowColor=clamped>50?"#1abc9c":clamped>25?"#27ae60":clamped>0?"#e8c96a":clamped>-25?"#e67e22":"#e74c3c";
  const glowX=cx+(innerR+thickness/2)*Math.cos(needleAngle),glowY=cy+(innerR+thickness/2)*Math.sin(needleAngle);
  const glowGrad=ctx.createRadialGradient(glowX,glowY,0,glowX,glowY,32); glowGrad.addColorStop(0,glowColor+"55"); glowGrad.addColorStop(1,"transparent");
  ctx.beginPath(); ctx.arc(glowX,glowY,32,0,Math.PI*2); ctx.fillStyle=glowGrad; ctx.fill();
  ctx.save(); ctx.translate(cx,cy); ctx.shadowColor="rgba(0,0,0,0.8)"; ctx.shadowBlur=10; ctx.shadowOffsetY=2;
  const needleLen=innerR-6; ctx.rotate(needleAngle-Math.PI);
  const nGrad=ctx.createLinearGradient(-3,0,3,0); nGrad.addColorStop(0,"rgba(255,255,255,0.25)"); nGrad.addColorStop(0.4,"#ffffff"); nGrad.addColorStop(0.6,"#e0e8ff"); nGrad.addColorStop(1,"rgba(200,210,255,0.35)");
  ctx.beginPath(); ctx.moveTo(-1.5,8); ctx.lineTo(-3,-needleLen*0.6); ctx.lineTo(0,-needleLen); ctx.lineTo(3,-needleLen*0.6); ctx.lineTo(1.5,8); ctx.closePath(); ctx.fillStyle=nGrad; ctx.fill(); ctx.restore();
  const hubGrad=ctx.createRadialGradient(cx-2,cy-2,0,cx,cy,14); hubGrad.addColorStop(0,"#4a6fa5"); hubGrad.addColorStop(0.5,"#1a3a8f"); hubGrad.addColorStop(1,"#0d2257");
  ctx.beginPath(); ctx.arc(cx,cy,14,0,Math.PI*2); ctx.fillStyle=hubGrad; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,14,0,Math.PI*2); ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle="#e8c96a"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,1.5,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
  ctx.font="600 8px 'Outfit',sans-serif"; ctx.textBaseline="top";
  ctx.fillStyle="rgba(231,76,60,0.8)"; ctx.textAlign="left"; ctx.fillText("SOBREVALORADA",cx-R+2,cy+12);
  ctx.fillStyle="rgba(26,188,156,0.8)"; ctx.textAlign="right"; ctx.fillText("SUBVALORADA",cx+R-2,cy+12);
}

function drawDCFChart(canvas, projections, isDark) {
  if (!canvas || !projections?.length) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 700, H = 260;
  canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = H + "px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const pad = { top: 20, right: 20, bottom: 42, left: 68 };
  const chartW = W - pad.left - pad.right, chartH = H - pad.top - pad.bottom;
  const n = projections.length;
  const maxVal = Math.max(...projections.map(d => d.fcf)) * 1.15;
  const xScale = i => pad.left + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  const yScale = v => pad.top + chartH - (v / maxVal) * chartH;
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "#dce2ee";
  const textColor = isDark ? "#8fa3cc" : "#7a8ab0";
  const lineColor = isDark ? "#6ea0e8" : "#0d2257";
  ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const y = pad.top + (chartH / 4) * i; ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke(); }
  const barW = Math.min(chartW / n * 0.45, 34);
  projections.forEach((d, i) => {
    const x = xScale(i), bH = (d.fcf / maxVal) * chartH, bY = pad.top + chartH - bH;
    const grad = ctx.createLinearGradient(0, bY, 0, pad.top + chartH);
    grad.addColorStop(0, "rgba(201,168,76,0.9)"); grad.addColorStop(1, "rgba(201,168,76,0.15)");
    ctx.fillStyle = grad; ctx.beginPath(); ctx.roundRect(x - barW / 2, bY, barW, bH, [3,3,0,0]); ctx.fill();
  });
  if (n > 1) {
    ctx.beginPath(); ctx.strokeStyle = lineColor; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
    projections.forEach((d, i) => { const x = xScale(i), y = yScale(d.pvFCF); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
  }
  projections.forEach((d, i) => {
    const x = xScale(i), y = yScale(d.pvFCF);
    ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fillStyle = lineColor; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
  });
  ctx.fillStyle = textColor; ctx.font = "500 11px 'Outfit',sans-serif"; ctx.textAlign = "center";
  projections.forEach((d, i) => { if (n <= 7 || i % 2 === 0) ctx.fillText("Y" + d.year, xScale(i), H - 10); });
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) { const v = (maxVal / 4) * (4 - i), y = pad.top + (chartH / 4) * i; ctx.fillStyle = textColor; ctx.fillText(v >= 1000 ? (v / 1000).toFixed(1) + "B" : v.toFixed(0) + "M", pad.left - 8, y + 4); }
}

function drawRadarChart(canvas, {dcf, graham, pe, ev, ddm}, isDark) {
  const ref = canvas; if (!ref) return;
  const ctx = ref.getContext("2d");
  const W = 260, H = 240, dpr = window.devicePixelRatio || 1;
  ref.width = W * dpr; ref.height = H * dpr; ref.style.width = W + "px"; ref.style.height = H + "px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const vals = [dcf, graham, pe, ev, ddm];
  const labels = ["DCF", "Graham", "P/E", "EV/EBITDA", "DDM"];
  const active = vals.filter(v => v !== null && v > 0);
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#dce2ee";
  const textColor = isDark ? "#8fa3cc" : "#0d2257";
  if (active.length < 2) {
    ctx.fillStyle = isDark ? "#8fa3cc" : "#7a8ab0"; ctx.font = "12px 'Outfit'"; ctx.textAlign = "center"; ctx.fillText("Completa al menos 2 métodos", W/2, H/2); return;
  }
  const maxVal = Math.max(...active) * 1.25, cx = W/2, cy = H/2+8, r = 82, n = 5;
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath(); ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) { const angle = (2*Math.PI*i/n) - Math.PI/2; const x = cx + (r*ring/4)*Math.cos(angle), y = cy + (r*ring/4)*Math.sin(angle); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
    ctx.closePath(); ctx.stroke();
  }
  for (let i = 0; i < n; i++) { const angle = (2*Math.PI*i/n) - Math.PI/2; ctx.beginPath(); ctx.strokeStyle=gridColor; ctx.lineWidth=1; ctx.moveTo(cx,cy); ctx.lineTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle)); ctx.stroke(); }
  ctx.beginPath();
  vals.forEach((v,i) => {
    const ratio = (v!==null&&v>0)?Math.min(v/maxVal,1):0; const angle=(2*Math.PI*i/n)-Math.PI/2;
    const x=cx+r*ratio*Math.cos(angle),y=cy+r*ratio*Math.sin(angle); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath(); ctx.fillStyle=isDark?"rgba(110,160,232,0.18)":"rgba(13,34,87,0.12)"; ctx.fill(); ctx.strokeStyle=isDark?"#6ea0e8":"#0d2257"; ctx.lineWidth=2.5; ctx.stroke();
  vals.forEach((v,i) => {
    const ratio=(v!==null&&v>0)?Math.min(v/maxVal,1):0; const angle=(2*Math.PI*i/n)-Math.PI/2;
    const x=cx+r*ratio*Math.cos(angle),y=cy+r*ratio*Math.sin(angle);
    ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fillStyle="#c9a84c"; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
  });
  ctx.fillStyle=textColor; ctx.font="600 10px 'Outfit'"; ctx.textAlign="center";
  for (let i=0;i<n;i++) { const angle=(2*Math.PI*i/n)-Math.PI/2; const lr=r+20; ctx.fillText(labels[i],cx+lr*Math.cos(angle),cy+lr*Math.sin(angle)+4); }
}

function drawWaterfallChart(canvas, {totalPV, pvTV, shares}, isDark) {
  const ref = canvas; if (!ref || !totalPV || !pvTV || !shares) return;
  const ctx = ref.getContext("2d");
  const W = ref.offsetWidth || 400, H = 200, dpr = window.devicePixelRatio || 1;
  ref.width = W * dpr; ref.height = H * dpr; ref.style.height = H + "px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const pvOps = totalPV/shares, pvTer = pvTV/shares, total = pvOps + pvTer;
  const pad = {top:15,right:20,bottom:35,left:55};
  const chartW=W-pad.left-pad.right, chartH=H-pad.top-pad.bottom, maxV=total*1.18;
  const bars=[{label:"PV Ops.",value:pvOps,color:"#0d2257",start:0},{label:"PV Terminal",value:pvTer,color:"#c9a84c",start:pvOps},{label:"Total",value:total,color:"#1a7a4a",start:0,isFinal:true}];
  const bW=Math.min(chartW/4,62), spacing=chartW/bars.length;
  const textColor=isDark?"#8fa3cc":"#7a8ab0"; const gridColor=isDark?"rgba(255,255,255,0.07)":"#dce2ee";
  for(let i=0;i<=4;i++){const v=(maxV/4)*(4-i),y=pad.top+(chartH/4)*i; ctx.fillStyle=textColor; ctx.font="10px 'Outfit'"; ctx.textAlign="right"; ctx.fillText("$"+v.toFixed(0),pad.left-6,y+3); ctx.beginPath(); ctx.strokeStyle=gridColor; ctx.lineWidth=1; ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+chartW,y); ctx.stroke();}
  bars.forEach((bar,i)=>{
    const x=pad.left+spacing*i+(spacing-bW)/2; const startY=pad.top+chartH-(bar.start+bar.value)/maxV*chartH; const barH=(bar.value/maxV)*chartH;
    const grad=ctx.createLinearGradient(0,startY,0,startY+barH); grad.addColorStop(0,bar.color); grad.addColorStop(1,bar.color+"88");
    ctx.fillStyle=grad; ctx.beginPath(); ctx.roundRect(x,startY,bW,barH,[3,3,0,0]); ctx.fill();
    if(!bar.isFinal&&i<bars.length-1){ctx.setLineDash([3,3]);ctx.beginPath();ctx.strokeStyle="#aaa";ctx.lineWidth=1;ctx.moveTo(x+bW,startY);ctx.lineTo(pad.left+spacing*(i+1)+(spacing-bW)/2,startY);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle=bar.color; ctx.font="bold 9px 'Outfit'"; ctx.textAlign="center"; ctx.fillText("$"+bar.value.toFixed(1),x+bW/2,startY-4);
    ctx.fillStyle=textColor; ctx.font="9px 'Outfit'"; ctx.fillText(bar.label,x+bW/2,H-8);
  });
}

function drawSparkline(canvas, history) {
  if (!canvas || history.length < 2) return;
  const ctx = canvas.getContext("2d");
  const W = 60, H = 24, dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const mn = Math.min(...history), mx = Math.max(...history), range = mx - mn || 1;
  const up = history[history.length - 1] >= history[0];
  ctx.beginPath(); ctx.strokeStyle = up ? "#1a7a4a" : "#c0392b"; ctx.lineWidth = 1.8; ctx.lineJoin = "round";
  history.forEach((v, i) => { const x = (i / (history.length - 1)) * W, y = H - ((v - mn) / range) * (H - 2) - 1; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.stroke();
}

function drawHistogram(canvas, mcResult, currentPrice, isDark) {
  if (!canvas || !mcResult) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 500, H = 180;
  canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = H + "px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const { counts, min, binWidth } = mcResult.histogram;
  const maxCount = Math.max(...counts);
  const pad = { top: 15, right: 20, bottom: 32, left: 50 };
  const chartW = W - pad.left - pad.right, chartH = H - pad.top - pad.bottom;
  const n = counts.length;
  const barW = chartW / n;
  const textColor = isDark ? "#8fa3cc" : "#7a8ab0";
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "#dce2ee";
  for (let i = 0; i <= 4; i++) { const y = pad.top + (chartH / 4) * i; ctx.beginPath(); ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke(); }
  counts.forEach((c, i) => {
    const bH = maxCount > 0 ? (c / maxCount) * chartH : 0;
    const bVal = min + i * binWidth;
    const bY = pad.top + chartH - bH;
    const isCurrentBin = currentPrice && bVal <= currentPrice && currentPrice <= bVal + binWidth;
    const isP50Bin = Math.abs(bVal - mcResult.p50) < binWidth;
    const color = isCurrentBin ? "#e74c3c" : isP50Bin ? "#c9a84c" : isDark ? "#3a5a9a" : "#0d2257";
    ctx.fillStyle = color + "cc";
    ctx.beginPath(); ctx.roundRect(pad.left + i * barW + 1, bY, barW - 2, bH, [2,2,0,0]); ctx.fill();
  });
  [mcResult.p10, mcResult.p50, mcResult.p90].forEach((v, i) => {
    const x = pad.left + ((v - min) / (mcResult.max - min)) * chartW;
    const colors = ["#e74c3c", "#c9a84c", "#1a7a4a"];
    const labels = ["P10", "P50", "P90"];
    ctx.beginPath(); ctx.strokeStyle = colors[i]; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + chartH); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = colors[i]; ctx.font = "bold 9px 'Outfit'"; ctx.textAlign = "center";
    ctx.fillText(labels[i], x, pad.top - 3);
  });
  ctx.fillStyle = textColor; ctx.font = "10px 'Outfit'"; ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) { const v = (maxCount / 4) * (4 - i), y = pad.top + (chartH / 4) * i; ctx.fillText(Math.round(v), pad.left - 5, y + 4); }
  [0, 0.25, 0.5, 0.75, 1.0].forEach(f => {
    const val = min + f * (mcResult.max - min);
    const x = pad.left + f * chartW;
    ctx.fillStyle = textColor; ctx.font = "9px 'DM Mono',monospace"; ctx.textAlign = "center";
    ctx.fillText("$" + val.toFixed(0), x, H - 6);
  });
}
// PART 4: REACT COMPONENTS

// ── TIP ──
function Tip({ text }) {
  return (
    <span className="tooltip-wrap">
      <span className="tooltip-icon">i</span>
      <span className="tooltip-box">{text}</span>
    </span>
  );
}

// ── ANIMATED VALUE ──
function AnimatedValue({ value, format = fmt }) {
  const [key, setKey] = useState(0);
  const prevRef = useRef(value);
  useEffect(() => { if (prevRef.current !== value) { setKey(k => k + 1); prevRef.current = value; } }, [value]);
  return <span key={key} className="number-animate">{format(value)}</span>;
}

// ── PREMIUM GAUGE ──
function PremiumGauge({ marginPct, intrinsic, marketPrice, upside }) {
  const canvasRef = useRef(null);
  useEffect(() => { drawPremiumGauge(canvasRef.current, marginPct); }, [marginPct]);
  const clamped = Math.max(-50, Math.min(100, marginPct ?? 0));
  const color = clamped > 50 ? "#1abc9c" : clamped > 25 ? "#27ae60" : clamped > 0 ? "#e8c96a" : clamped > -25 ? "#e67e22" : "#e74c3c";
  const verdict = clamped > 50 ? { label: "Fuertemente Subvalorada", icon: "▲▲" } : clamped > 25 ? { label: "Subvalorada — Comprar", icon: "▲" } : clamped > 5 ? { label: "Precio Justo — Mantener", icon: "◆" } : clamped > -15 ? { label: "Levemente Cara", icon: "▼" } : { label: "Sobrevalorada — Cuidado", icon: "▼▼" };
  return (
    <div className="gauge-dark-card">
      <div className="gauge-dark-title">Análisis de Valoración</div>
      <div className="gauge-dark-heading">Velocímetro de Margen de Seguridad</div>
      <div className="gauge-canvas-wrap">
        <canvas ref={canvasRef} />
        <div className="gauge-center-overlay">
          <div className="gauge-pct-big" style={{ color }}>{pct(marginPct)}</div>
          <div className="gauge-pct-label" style={{ color: color + "99" }}>Margen de seguridad</div>
        </div>
      </div>
      <div className="gauge-verdict-pill" style={{ color, borderColor: color, background: color + "18" }}>
        {verdict.icon} {verdict.label}
      </div>
      <div className="gauge-mini-metrics">
        {[["Valor Intrínseco", fmt(intrinsic)], ["Precio Mercado", fmt(marketPrice)], ["Potencial Alzada", pct(upside)]].map(([label, val]) => (
          <div key={label} className="gauge-mini-box"><div className="gauge-mini-label">{label}</div><div className="gauge-mini-val">{val}</div></div>
        ))}
      </div>
    </div>
  );
}

// ── DCF CHART ──
function DCFChart({ projections, isDark }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) drawDCFChart(ref.current, projections, isDark); }, [projections, isDark]);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => { if (ref.current) drawDCFChart(ref.current, projections, isDark); });
    ro.observe(ref.current.parentElement);
    return () => ro.disconnect();
  }, [projections, isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{ width: "100%" }} /></div>;
}

// ── RADAR CHART ──
function RadarChart({ dcf, graham, pe, ev, ddm, isDark }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) drawRadarChart(ref.current, { dcf, graham, pe, ev, ddm }, isDark); }, [dcf, graham, pe, ev, ddm, isDark]);
  return <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem 0 1rem" }}><canvas ref={ref} /></div>;
}

// ── WATERFALL CHART ──
function WaterfallChart({ totalPV, pvTV, shares, isDark }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) drawWaterfallChart(ref.current, { totalPV, pvTV, shares }, isDark); }, [totalPV, pvTV, shares, isDark]);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => { if (ref.current) drawWaterfallChart(ref.current, { totalPV, pvTV, shares }, isDark); });
    ro.observe(ref.current.parentElement);
    return () => ro.disconnect();
  }, [totalPV, pvTV, shares, isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{ width: "100%" }} /></div>;
}

// ── SPARKLINE ──
function Sparkline({ history }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) drawSparkline(ref.current, history); }, [history]);
  return <span className="sparkline-wrap"><canvas ref={ref} /></span>;
}

// ── HISTOGRAM (Monte Carlo) ──
function MCHistogram({ mcResult, currentPrice, isDark }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) drawHistogram(ref.current, mcResult, currentPrice, isDark); }, [mcResult, currentPrice, isDark]);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => { if (ref.current) drawHistogram(ref.current, mcResult, currentPrice, isDark); });
    ro.observe(ref.current.parentElement);
    return () => ro.disconnect();
  }, [mcResult, currentPrice, isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{ width: "100%" }} /></div>;
}

// ── FMP PANEL ──
function FMPPanel({ ticker, onDataLoaded, fmpKey, setFmpKey }) {
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loadedFields, setLoadedFields] = useState({});
  const [hasData, setHasData] = useState(false);
  const handleFetch = async () => {
    if (!ticker) { setStatus("err"); setErrMsg("Ingresa un Ticker antes de autocompletar."); return; }
    if (!fmpKey) { setStatus("err"); setErrMsg("Ingresa tu API key de FMP."); return; }
    setStatus("loading"); setErrMsg("");
    try {
      const raw = await fetchFMPData(ticker.toUpperCase(), fmpKey.trim());
      if (raw.profile?.["Error Message"] || (Array.isArray(raw.profile) && raw.profile.length === 0)) throw new Error("Ticker no encontrado o API key inválida.");
      const { parsed, loaded } = parseFMPData(raw);
      onDataLoaded(parsed); setLoadedFields(loaded); setStatus("ok"); setHasData(true);
    } catch (e) { setStatus("err"); setErrMsg(e.message || "Error al conectar con FMP."); }
  };
  const handleClear = () => {
    setStatus(null); setLoadedFields({}); setHasData(false); setErrMsg("");
    onDataLoaded({ companyName:"",currentPrice:"",shares:"",fcf:"",eps:"",ebitda:"",debt:"0",cash:"0",bookValue:"",peTarget:"15",evMultiple:"10",growthRate:"10",beta:"1.0",annualDividend:"" });
  };
  return (
    <div className="fmp-panel">
      <div className="fmp-panel-title">⚡ Autocompletar con Financial Modeling Prep</div>
      <div className="fmp-panel-sub">Obtén tu API key gratuita en <a href="https://financialmodelingprep.com" target="_blank" rel="noopener noreferrer">financialmodelingprep.com</a>. Plan gratuito: ~250 req/día. Carga FCF, EPS, EBITDA, Beta, Dividendos y más.</div>
      <div className="fmp-input-row">
        <div className="field"><label>API Key de FMP</label><input value={fmpKey} onChange={e => setFmpKey(e.target.value)} placeholder="Tu API key..." autoComplete="off" type="password" /></div>
        <button className="btn-fetch" onClick={handleFetch} disabled={status === "loading"}>
          {status === "loading" ? <><div className="spinner" /> Cargando...</> : <>📡 Autocompletar</>}
        </button>
        {hasData && <button className="btn-secondary" onClick={handleClear} style={{ height: 38 }}>✕ Limpiar</button>}
      </div>
      {status === "loading" && <div className="fmp-status loading"><div className="spinner" /> Consultando FCF, EPS, EBITDA, Beta, Dividendos...</div>}
      {status === "err" && <div className="fmp-status err">⚠ {errMsg}</div>}
      {status === "ok" && (
        <>
          <div className="fmp-status ok">✓ Datos cargados. Revisa y ajusta los valores si es necesario.</div>
          <div className="fmp-loaded-chips">
            {Object.entries(FIELD_LABELS).map(([key, label]) => (
              <span key={key} className={`fmp-chip ${loadedFields[key] ? "ok" : "miss"}`}>{loadedFields[key] ? "✓" : "—"} {label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── HEATMAP ──
function SensitivityHeatmap({ fcf, terminalGrowth, shares, currentPrice }) {
  const [popup, setPopup] = useState(null);
  const waccRange = [6, 7, 8, 9, 10, 11, 12];
  const growthRange = [5, 7, 10, 12, 15, 18, 20];
  const cp = p(currentPrice);
  function heatColor(margin) {
    if (margin > 40) return { bg: "#1a7a4a", text: "#fff" };
    if (margin > 20) return { bg: "#27ae60", text: "#fff" };
    if (margin > 8) return { bg: "#a8e6c3", text: "#1a3a2a" };
    if (margin > -8) return { bg: "#f9f3e3", text: "#6a5000" };
    if (margin > -25) return { bg: "#f5c6c2", text: "#5a1a1a" };
    return { bg: "#c0392b", text: "#fff" };
  }
  if (!fcf || !shares) return <div className="empty-state"><span className="empty-icon">🗺️</span>Completa el FCF y las acciones en el método DCF.</div>;
  return (
    <div>
      <div className="heatmap-wrap">
        <table className="heatmap-table">
          <thead><tr>
            <th style={{ textAlign: "left" }}>WACC% ↓ / Crecim.% →</th>
            {growthRange.map(g => <th key={g}>{g}%</th>)}
          </tr></thead>
          <tbody>
            {waccRange.map(wacc => (
              <tr key={wacc}>
                <td className="heatmap-axis">{wacc}%</td>
                {growthRange.map(growth => {
                  if (growth >= wacc) {
                    const res = calcDCF({ fcf: p(fcf), growthRate: growth, terminalGrowth: p(terminalGrowth), discountRate: wacc, years: 10, shares: p(shares) });
                    const val = res.value; const margin = val && cp > 0 ? ((val - cp) / val) * 100 : null;
                    const { bg, text } = heatColor(margin);
                    return (
                      <td key={growth} style={{ background: bg, color: text, cursor: "pointer" }}
                        onClick={e => setPopup({ val, margin, wacc, growth, x: e.clientX, y: e.clientY })}>
                        {fmt(val)}
                      </td>
                    );
                  }
                  return <td key={growth} style={{ background: "var(--surface2)", color: "var(--border)" }}>—</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.6rem", display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
        {[["#1a7a4a","#fff",">40% margen"],["#27ae60","#fff","20-40%"],["#a8e6c3","#1a3a2a","8-20%"],["#f9f3e3","#6a5000","±8%"],["#f5c6c2","#5a1a1a","-8 a -25%"],["#c0392b","#fff","<-25%"]].map(([bg,c,label])=>(
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: 12, height: 12, background: bg, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
            <span>{label}</span>
          </span>
        ))}
      </div>
      {popup && (
        <div className="cell-popup" style={{ left: Math.min(popup.x + 12, window.innerWidth - 220), top: popup.y + 8 }}>
          <div className="cell-popup-title">Desglose WACC {popup.wacc}% / Crecim. {popup.growth}%</div>
          <div className="cell-popup-row"><span>Valor intrínseco:</span><span>{fmt(popup.val)}</span></div>
          <div className="cell-popup-row"><span>Precio mercado:</span><span>{fmt(cp || null)}</span></div>
          <div className="cell-popup-row"><span>Margen de seguridad:</span><span style={{ color: (popup.margin||0) > 0 ? "var(--safe)" : "var(--danger)" }}>{pct(popup.margin)}</span></div>
          <div style={{ fontSize: "0.63rem", color: "var(--muted)", marginTop: "0.4rem" }}>Click fuera para cerrar</div>
          <button style={{ position:"absolute",top:"0.4rem",right:"0.5rem",background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",color:"var(--muted)" }} onClick={() => setPopup(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

// ── BENCHMARK TABLE ──
function BenchmarkTable({ sector, peTarget, evMultiple, growthRate, discountRate }) {
  const bench = SECTOR_BENCHMARKS[sector];
  if (!bench) return null;
  const rows = [
    { label: "P/E objetivo", user: peTarget ? p(peTarget) : null, bench: bench.pe, unit: "×" },
    { label: "EV/EBITDA", user: evMultiple ? p(evMultiple) : null, bench: bench.ev, unit: "×" },
    { label: "Crecimiento", user: growthRate ? p(growthRate) : null, bench: bench.growth, unit: "%" },
    { label: "WACC", user: discountRate ? p(discountRate) : null, bench: bench.wacc, unit: "%" },
  ];
  return (
    <div style={{ marginTop: "0.8rem" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Vs. Sector: {sector}</div>
      <table className="benchmark-table">
        <thead><tr><th>Métrica</th><th>Tu valor</th><th>Promedio sector</th><th>Diferencia</th></tr></thead>
        <tbody>
          {rows.map(r => {
            const diff = r.user !== null ? r.user - r.bench : null;
            const diffColor = diff === null ? "var(--muted)" : Math.abs(diff) < 2 ? "var(--safe)" : diff > 0 ? "#e67e22" : "#e74c3c";
            return (
              <tr key={r.label} className={r.label === "P/E objetivo" ? "benchmark-highlight" : ""}>
                <td>{r.label}</td>
                <td style={{ fontFamily: "DM Mono" }}>{r.user !== null ? r.user.toFixed(1) + r.unit : "—"}</td>
                <td style={{ fontFamily: "DM Mono", color: "var(--muted)" }}>{r.bench}{r.unit}</td>
                <td style={{ fontFamily: "DM Mono", color: diffColor, fontWeight: 700 }}>{diff !== null ? (diff > 0 ? "+" : "") + diff.toFixed(1) + r.unit : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ fontSize: "0.67rem", color: "var(--muted)", marginTop: "0.4rem" }}>{bench.description}</div>
    </div>
  );
}
// PART 5: MAIN APP

export default function App() {
  // ── THEME ──
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => { document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light"); }, [darkMode]);

  // ── CORE STATE ──
  const [ticker, setTicker] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("S&P 500 (Prom)");
  const [fmpKey, setFmpKey] = useState("");
  const [autofilled, setAutofilled] = useState({});
  const [activeTab, setActiveTab] = useState("metodos");
  const [selectedScenario, setSelectedScenario] = useState("base");
  const [buyMarginTarget, setBuyMarginTarget] = useState(30);
  const [saveError, setSaveError] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // ── INPUTS ──
  const [fcf, setFcf] = useState("");
  const [growthRate, setGrowthRate] = useState("10");
  const [terminalGrowth, setTerminalGrowth] = useState("3");
  const [discountRate, setDiscountRate] = useState("10");
  const [years, setYears] = useState("10");
  const [shares, setShares] = useState("");
  const [eps, setEps] = useState("");
  const [bookValue, setBookValue] = useState("");
  const [peTarget, setPeTarget] = useState("15");
  const [ebitda, setEbitda] = useState("");
  const [evMultiple, setEvMultiple] = useState("10");
  const [debt, setDebt] = useState("0");
  const [cash, setCash] = useState("0");
  const [currentPrice, setCurrentPrice] = useState("");
  const [annualDividend, setAnnualDividend] = useState("");
  const [dividendGrowth, setDividendGrowth] = useState("4");
  const [beta, setBeta] = useState("1.0");

  // ── CAPM ──
  const [useCAPM, setUseCAPM] = useState(false);
  const [riskFree, setRiskFree] = useState("4.3");
  const [marketPremium, setMarketPremium] = useState("6.0");

  // ── WEIGHTS ──
  const [wDCF, setWDCF] = useState(30);
  const [wGraham, setWGraham] = useState(20);
  const [wPE, setWPE] = useState(20);
  const [wEV, setWEV] = useState(20);
  const [wDDM, setWDDM] = useState(10);

  // ── COMPARE ──
  const [comp, setComp] = useState({ ticker:"",fcf:"",shares:"",growthRate:"10",terminalGrowth:"3",discountRate:"10",eps:"",bookValue:"",peTarget:"15",ebitda:"",evMultiple:"10",debt:"0",cash:"0",currentPrice:"",annualDividend:"",dividendGrowth:"4" });

  // ── WATCHLIST ──
  const [savedValuations, setSavedValuations] = useState([]);
  const [watchSearch, setWatchSearch] = useState("");
  const [watchSort, setWatchSort] = useState("date");
  useEffect(() => { window.__watchlist = window.__watchlist || []; setSavedValuations(window.__watchlist); }, []);
  const persistWatchlist = list => { window.__watchlist = list; setSavedValuations(list); };

  // ── MONTE CARLO STATE ──
  const [mcRunning, setMcRunning] = useState(false);
  const [mcResult, setMcResult] = useState(null);

  // ── FMP DATA HANDLER ──
  const handleFMPData = useCallback(data => {
    const track = {};
    const set = (key, setter, val) => { if (val !== undefined) { setter(val); track[key] = !!val; } };
    set("companyName", setCompanyName, data.companyName);
    set("currentPrice", setCurrentPrice, data.currentPrice);
    set("shares", setShares, data.shares);
    set("fcf", setFcf, data.fcf);
    set("eps", setEps, data.eps);
    set("ebitda", setEbitda, data.ebitda);
    set("debt", setDebt, data.debt);
    set("cash", setCash, data.cash);
    set("bookValue", setBookValue, data.bookValue);
    set("peTarget", setPeTarget, data.peTarget);
    set("evMultiple", setEvMultiple, data.evMultiple);
    set("growthRate", setGrowthRate, data.growthRate);
    set("beta", setBeta, data.beta);
    set("annualDividend", setAnnualDividend, data.annualDividend);
    setAutofilled(track);
  }, []);

  // ── CAPM COMPUTED WACC ──
  const capmWACC = useCAPM ? calcCAPM({ riskFree, beta, marketPremium }).toFixed(1) : null;
  const effectiveWACC = useCAPM && capmWACC ? capmWACC : discountRate;

  // ── CALCULATIONS ──
  const dcfResult = calcDCF({ fcf: p(fcf), growthRate: p(growthRate), terminalGrowth: p(terminalGrowth), discountRate: p(effectiveWACC), years: p(years), shares: p(shares) });
  const dcfVal = dcfResult.value;
  const grahamVal = calcGraham({ eps: p(eps), bookValue: p(bookValue) });
  const peVal = calcPE({ eps: p(eps), peTarget: p(peTarget) });
  const evVal = calcEV({ ebitda: p(ebitda), evMultiple: p(evMultiple), debt: p(debt), cash: p(cash), shares: p(shares) });
  const ddmVal = calcDDM({ annualDividend: p(annualDividend), dividendGrowth: p(dividendGrowth), discountRate: p(effectiveWACC) });
  const intrinsic = weightedAvg([[dcfVal, wDCF], [grahamVal, wGraham], [peVal, wPE], [evVal, wEV], [ddmVal, wDDM]]);
  const hasResult = intrinsic !== null;
  const cp = p(currentPrice);
  const marginPct = hasResult && cp > 0 ? ((intrinsic - cp) / intrinsic) * 100 : null;
  const upside = hasResult && cp > 0 ? ((intrinsic / cp - 1) * 100) : null;
  const activeMethods = [dcfVal, grahamVal, peVal, evVal, ddmVal].filter(v => v !== null).length;
  const conf = confidenceScore([dcfVal, grahamVal, peVal, evVal, ddmVal]);
  const buyTarget = hasResult ? intrinsic * (1 - buyMarginTarget / 100) : null;

  // ── GROWTH > WACC WARNING ──
  const growthWACCWarning = p(growthRate) >= p(effectiveWACC);
  const terminalGrowthWarning = p(terminalGrowth) >= p(effectiveWACC);

  // ── SCENARIOS ──
  const scenarioValues = SCENARIOS.map(s => {
    const g = p(growthRate) * s.growthMult, d = Math.max(p(effectiveWACC) + s.discountAdd, 1), tg = p(terminalGrowth) * s.terminalMult;
    const dcf = calcDCF({ fcf: p(fcf), growthRate: g, terminalGrowth: tg, discountRate: d, years: p(years), shares: p(shares) }).value;
    const gr = calcGraham({ eps: p(eps), bookValue: p(bookValue) });
    const pe = calcPE({ eps: p(eps), peTarget: p(peTarget) * s.peTargetMult });
    const ev = calcEV({ ebitda: p(ebitda), evMultiple: p(evMultiple) * s.evMult, debt: p(debt), cash: p(cash), shares: p(shares) });
    const ddm = calcDDM({ annualDividend: p(annualDividend), dividendGrowth: p(dividendGrowth) * s.growthMult, discountRate: d });
    const iv = weightedAvg([[dcf, wDCF], [gr, wGraham], [pe, wPE], [ev, wEV], [ddm, wDDM]]);
    const m = iv && cp > 0 ? ((iv - cp) / iv) * 100 : null;
    return { ...s, iv, margin: m };
  });

  // ── COMPARE CALCS ──
  const compEWACC = comp.discountRate;
  const compDCF = calcDCF({ fcf: p(comp.fcf), growthRate: p(comp.growthRate), terminalGrowth: p(comp.terminalGrowth), discountRate: p(compEWACC), years: 10, shares: p(comp.shares) }).value;
  const compGraham = calcGraham({ eps: p(comp.eps), bookValue: p(comp.bookValue) });
  const compPE = calcPE({ eps: p(comp.eps), peTarget: p(comp.peTarget) });
  const compEV = calcEV({ ebitda: p(comp.ebitda), evMultiple: p(comp.evMultiple), debt: p(comp.debt), cash: p(comp.cash), shares: p(comp.shares) });
  const compDDM = calcDDM({ annualDividend: p(comp.annualDividend), dividendGrowth: p(comp.dividendGrowth), discountRate: p(compEWACC) });
  const compIntrinsic = weightedAvg([[compDCF, wDCF], [compGraham, wGraham], [compPE, wPE], [compEV, wEV], [compDDM, wDDM]]);
  const compCP = p(comp.currentPrice);
  const compMargin = compIntrinsic && compCP > 0 ? ((compIntrinsic - compCP) / compIntrinsic) * 100 : null;

  // ── VERDICT ──
  const getVerdict = m => {
    if (m === null) return { label: "Ingresa precio actual para el veredicto", cls: "tag-neutral", icon: "○" };
    if (m > 25) return { label: "Subvalorada — Oportunidad de compra", cls: "tag-buy", icon: "↑" };
    if (m > 0) return { label: "Precio justo — Mantener posición", cls: "tag-hold", icon: "→" };
    return { label: "Sobrevalorada — Evaluar riesgo", cls: "tag-sell", icon: "↓" };
  };
  const verdict = getVerdict(marginPct);
  const barColor = (marginPct ?? 0) > 25 ? "#1a7a4a" : (marginPct ?? 0) > 0 ? "#c9a84c" : "#c0392b";

  // ── MONTE CARLO ──
  const runMC = useCallback(() => {
    if (!fcf || !shares) return;
    setMcRunning(true);
    setTimeout(() => {
      const res = runMonteCarlo({ fcf: p(fcf), growthRate: p(growthRate), discountRate: p(effectiveWACC), terminalGrowth: p(terminalGrowth), years: p(years), shares: p(shares), iterations: 2000 });
      setMcResult(res);
      setMcRunning(false);
    }, 80);
  }, [fcf, growthRate, effectiveWACC, terminalGrowth, years, shares]);

  // ── SAVE ──
  const handleSave = () => {
    if (!ticker) { setSaveError("Ingresa el Ticker de la empresa (ej. AAPL)."); return; }
    if (!hasResult) { setSaveError("Completa al menos un método de valoración."); return; }
    setSaveError("");
    const existing = window.__watchlist || [];
    const history = existing.filter(i => i.ticker === ticker.toUpperCase()).map(i => i.intrinsic);
    persistWatchlist([{ id: Date.now(), ticker: ticker.toUpperCase(), companyName: companyName || ticker.toUpperCase(), intrinsic, price: cp, margin: marginPct, history: [...history, intrinsic], sector }, ...existing]);
    setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2200);
  };
  const handleDelete = id => persistWatchlist((window.__watchlist || []).filter(i => i.id !== id));

  // ── WATCHLIST FILTER/SORT ──
  const filteredWatchlist = savedValuations
    .filter(i => !watchSearch || i.ticker.includes(watchSearch.toUpperCase()) || i.companyName?.toLowerCase().includes(watchSearch.toLowerCase()))
    .sort((a, b) => {
      if (watchSort === "margin") return (b.margin ?? -999) - (a.margin ?? -999);
      if (watchSort === "value") return (b.intrinsic ?? 0) - (a.intrinsic ?? 0);
      return b.id - a.id;
    });

  // ── PORTFOLIO STATS ──
  const portfolioValue = savedValuations.reduce((s, i) => s + (i.intrinsic || 0), 0);
  const portfolioAvgMargin = savedValuations.length > 0 ? savedValuations.reduce((s, i) => s + (i.margin || 0), 0) / savedValuations.length : null;
  const buyCount = savedValuations.filter(i => (i.margin || 0) > 25).length;

  const af = key => autofilled[key] ? "autofilled" : "";

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-inner">
            <div className="header-left">
              <h1>Valor <span>Intrínseco</span></h1>
              <p>Plataforma profesional de valoración fundamental · DCF · Graham · P/E · EV/EBITDA · DDM · Monte Carlo</p>
            </div>
            <div className="header-right">
              <div className="header-badge">Pro Edition</div>
              <button className="btn-theme" onClick={() => setDarkMode(d => !d)}>{darkMode ? "☀️ Claro" : "🌙 Oscuro"}</button>
            </div>
          </div>
        </div>

        {/* ── FMP PANEL ── */}
        <FMPPanel ticker={ticker} onDataLoaded={handleFMPData} fmpKey={fmpKey} setFmpKey={setFmpKey} />

        {/* ── EMPRESA + RESUMEN ── */}
        <div className="grid" style={{ marginBottom: "1.5rem" }}>
          <div className="card">
            <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#1a3a8f)" }} />
            <div className="method-tag">Identificación</div>
            <div className="card-title">🏢 Empresa & Configuración</div>
            <div className="field-row">
              <div className="field">
                <label>Ticker / Símbolo</label>
                <input value={ticker} onChange={e => { setTicker(e.target.value); setSaveError(""); }} placeholder="AAPL" maxLength={7} style={{ textTransform: "uppercase", fontWeight: 800, fontSize: "1.1rem", fontFamily: "DM Mono, monospace", letterSpacing: "0.05em" }} />
              </div>
              <div className="field">
                <label>Nombre de Empresa {autofilled.companyName && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("companyName")} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Apple Inc." />
              </div>
            </div>
            <div className="field">
              <label>Sector <Tip text="Selecciona el sector para comparar tus múltiplos con el promedio del mercado." /></label>
              <select value={sector} onChange={e => setSector(e.target.value)}>
                {Object.entries(SECTOR_BENCHMARKS).map(([k]) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
              <button className="btn-secondary" onClick={() => setCompareMode(m => !m)}>
                {compareMode ? "✕ Cerrar Comparador" : "⇄ Comparar Empresas"}
              </button>
            </div>
          </div>

          {hasResult ? (
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#c9a84c,#e8c96a)" }} />
              <div className="method-tag">Resumen</div>
              <div className="card-title">📊 Resumen Rápido · {activeMethods} métodos activos</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                {[["Valor Intrínseco", fmt(intrinsic), activeMethods + " métodos ponderados"], ["Margen Seguridad", pct(marginPct), "vs. precio de mercado"], ["Precio de Entrada", fmt(buyTarget), "margen " + buyMarginTarget + "%"], ["Potencial Alcista", pct(upside), "desde precio actual"]].map(([l, v, s]) => (
                  <div key={l} className="metric-card">
                    <div className="metric-card-label">{l}</div>
                    <div className="metric-card-value">{v}</div>
                    <div className="metric-card-sub">{s}</div>
                  </div>
                ))}
              </div>
              {conf.cv && <div className="warning-msg" style={{ marginTop: "0.8rem" }}>📐 CV: {conf.cv}% — {conf.suggestion}</div>}
            </div>
          ) : (
            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="empty-state"><span className="empty-icon">◈</span>Completa al menos un método de valoración para ver el resumen</div>
            </div>
          )}
        </div>

        {/* ── TABS ── */}
        <div className="tabs">
          {[["metodos","📐 Métodos"],["graficas","📈 Gráficas"],["montecarlo","🎲 Monte Carlo"],["escenarios","🎭 Escenarios"],["heatmap","🗺️ Sensibilidad"],["benchmarks","📊 Benchmarks"]].map(([k, l]) => (
            <button key={k} className={`tab-btn ${activeTab === k ? "active" : ""}`} onClick={() => setActiveTab(k)}>{l}</button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TAB: MÉTODOS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "metodos" && (
          <div className="grid">

            {/* DCF */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#2563eb)" }} />
              <div className="method-tag">Método 01</div>
              <div className="card-title"><span className={`status-dot ${dcfVal ? "active" : "inactive"}`} />Flujo de Caja Descontado (DCF)</div>
              <div className="field">
                <label>FCF (M$) — Promedio 3 años {autofilled.fcf && <span className="autofill-badge">FMP</span>} <Tip text="Flujo de caja libre promedio en millones. Usa el promedio de 3 años para mayor estabilidad." /></label>
                <input className={af("fcf")} value={fcf} onChange={e => setFcf(e.target.value)} placeholder="ej. 5000" type="number" />
              </div>
              <div className="slider-field">
                <div className="slider-label">Tasa de crecimiento anual {autofilled.growthRate && <span className="autofill-badge">FMP</span>} <Tip text="Tasa de crecimiento esperada del FCF durante el período proyectado." /><span>{growthRate}%</span></div>
                <input type="range" min="1" max="35" value={growthRate} onChange={e => setGrowthRate(e.target.value)} />
              </div>
              <div className="slider-field">
                <div className="slider-label">Crecimiento terminal (TV) <Tip text="Tasa de crecimiento perpetuo post-proyección. Estándar: 2-3%. Nunca > WACC." /><span>{terminalGrowth}%</span></div>
                <input type="range" min="1" max="5" step="0.5" value={terminalGrowth} onChange={e => setTerminalGrowth(e.target.value)} />
              </div>

              {/* CAPM */}
              <div className="capm-panel">
                <label className="capm-toggle">
                  <input type="checkbox" checked={useCAPM} onChange={e => setUseCAPM(e.target.checked)} />
                  🧮 Calcular WACC via CAPM {useCAPM && <span className="autofill-badge" style={{ background: "rgba(26,122,74,0.1)", color: "var(--safe)", borderColor: "rgba(26,122,74,0.3)" }}>ACTIVO</span>}
                </label>
                {useCAPM ? (
                  <div className="capm-fields">
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>Risk-Free Rate % <Tip text="Tasa libre de riesgo. US Treasury 10Y actual ~4.3%" /></label>
                      <input value={riskFree} onChange={e => setRiskFree(e.target.value)} type="number" step="0.1" placeholder="4.3" />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>Beta {autofilled.beta && <span className="autofill-badge">FMP</span>}</label>
                      <input className={af("beta")} value={beta} onChange={e => setBeta(e.target.value)} type="number" step="0.1" placeholder="1.0" />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label>Prima de Mercado % <Tip text="Rentabilidad adicional del mercado sobre el RF. Histórico S&P: ~6%" /></label>
                      <input value={marketPremium} onChange={e => setMarketPremium(e.target.value)} type="number" step="0.1" placeholder="6.0" />
                    </div>
                  </div>
                ) : null}
                {useCAPM && capmWACC && <div className="capm-result">✓ WACC calculado por CAPM: <strong>{capmWACC}%</strong> = {riskFree}% + {beta}β × {marketPremium}%</div>}
              </div>

              {!useCAPM && (
                <div className="slider-field" style={{ marginTop: "0.7rem" }}>
                  <div className="slider-label">WACC — Tasa de descuento <Tip text="Costo promedio ponderado del capital. Activa CAPM para calcularlo automáticamente." /><span>{discountRate}%</span></div>
                  <input type="range" min="4" max="20" value={discountRate} onChange={e => setDiscountRate(e.target.value)} />
                </div>
              )}

              {growthWACCWarning && <div className="warning-msg">⚠️ Crecimiento ({growthRate}%) ≥ WACC ({effectiveWACC}%): tasas insostenibles a largo plazo.</div>}
              {terminalGrowthWarning && <div className="warning-msg">⚠️ Crecimiento terminal ({terminalGrowth}%) ≥ WACC: causa valor negativo o infinito.</div>}

              <div className="slider-field" style={{ marginTop: "0.7rem" }}>
                <div className="slider-label">Años de proyección <Tip text="Horizonte temporal. 10 años es el estándar de la industria." /><span>{years} años</span></div>
                <input type="range" min="5" max="15" value={years} onChange={e => setYears(e.target.value)} />
              </div>
              <div className="field">
                <label>Acciones en circulación (M) {autofilled.shares && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("shares")} value={shares} onChange={e => setShares(e.target.value)} placeholder="ej. 1000" type="number" />
              </div>
              {dcfVal && <div className="success-msg">✓ DCF: {fmt(dcfVal)}</div>}
            </div>

            {/* GRAHAM + PE + DDM */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              <div className="card">
                <div className="card-accent" style={{ background: "linear-gradient(90deg,#9a7820,#c9a84c)" }} />
                <div className="method-tag">Método 02</div>
                <div className="card-title"><span className={`status-dot ${grahamVal ? "active" : "inactive"}`} />Graham Number</div>
                <div className="field-row">
                  <div className="field">
                    <label>EPS ($) {autofilled.eps && <span className="autofill-badge">FMP</span>} <Tip text="Earnings Per Share del último año fiscal." /></label>
                    <input className={af("eps")} value={eps} onChange={e => setEps(e.target.value)} placeholder="ej. 6.50" type="number" />
                  </div>
                  <div className="field">
                    <label>Book Value/acción ($) {autofilled.bookValue && <span className="autofill-badge">FMP</span>} <Tip text="Valor en libros por acción = Patrimonio / Acciones." /></label>
                    <input className={af("bookValue")} value={bookValue} onChange={e => setBookValue(e.target.value)} placeholder="ej. 20.00" type="number" />
                  </div>
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", background: "var(--surface2)", padding: "0.4rem 0.7rem", borderRadius: "5px", fontFamily: "DM Mono" }}>√(22.5 × EPS × Book Value)</div>
                {grahamVal && <div className="success-msg" style={{ marginTop: "0.7rem" }}>✓ Graham: {fmt(grahamVal)}</div>}
              </div>

              <div className="card">
                <div className="card-accent" style={{ background: "linear-gradient(90deg,#1a3a8f,#3b82f6)" }} />
                <div className="method-tag">Método 03</div>
                <div className="card-title"><span className={`status-dot ${peVal ? "active" : "inactive"}`} />Múltiplo P/E</div>
                <div className="field"><label style={{ color: "var(--muted)" }}>EPS — compartido con Graham</label><input value={eps} readOnly /></div>
                <div className="slider-field">
                  <div className="slider-label">P/E objetivo del sector {autofilled.peTarget && <span className="autofill-badge">FMP</span>} <Tip text="P/E razonable para el sector. Ver pestaña Benchmarks." /><span>{peTarget}×</span></div>
                  <input type="range" min="5" max="60" value={peTarget} onChange={e => setPeTarget(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", background: "var(--surface2)", padding: "0.4rem 0.7rem", borderRadius: "5px", fontFamily: "DM Mono" }}>EPS × P/E objetivo</div>
                {peVal && <div className="success-msg" style={{ marginTop: "0.7rem" }}>✓ P/E: {fmt(peVal)}</div>}
              </div>

              {/* DDM */}
              <div className="card">
                <div className="card-accent" style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
                <div className="method-tag">Método 05 — Nuevo</div>
                <div className="card-title"><span className={`status-dot ${ddmVal ? "active" : "inactive"}`} />Dividend Discount Model (DDM)</div>
                <div className="field-row">
                  <div className="field">
                    <label>Dividendo anual ($) {autofilled.annualDividend && <span className="autofill-badge">FMP</span>} <Tip text="Dividendo anual total por acción. Se carga automáticamente desde FMP." /></label>
                    <input className={af("annualDividend")} value={annualDividend} onChange={e => setAnnualDividend(e.target.value)} placeholder="ej. 0.96" type="number" step="0.01" />
                  </div>
                  <div className="field">
                    <label>Crecimiento dividendo (%) <Tip text="Tasa de crecimiento esperada del dividendo. Debe ser menor que el WACC." /></label>
                    <input value={dividendGrowth} onChange={e => setDividendGrowth(e.target.value)} placeholder="ej. 4" type="number" step="0.5" />
                  </div>
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", background: "var(--surface2)", padding: "0.4rem 0.7rem", borderRadius: "5px", fontFamily: "DM Mono" }}>Div × (1+g) / (WACC - g)   · Solo para empresas con dividendos</div>
                {!annualDividend && <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.5rem" }}>💡 Usa FMP para cargar dividendos históricos automáticamente.</div>}
                {ddmVal && <div className="success-msg" style={{ marginTop: "0.7rem" }}>✓ DDM: {fmt(ddmVal)}</div>}
              </div>
            </div>

            {/* EV/EBITDA */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#5a3a00,#c9a84c)" }} />
              <div className="method-tag">Método 04</div>
              <div className="card-title"><span className={`status-dot ${evVal ? "active" : "inactive"}`} />EV / EBITDA</div>
              <div className="field-row">
                <div className="field">
                  <label>EBITDA (M$) {autofilled.ebitda && <span className="autofill-badge">FMP</span>}</label>
                  <input className={af("ebitda")} value={ebitda} onChange={e => setEbitda(e.target.value)} placeholder="ej. 8000" type="number" />
                </div>
                <div className="field" style={{ display: "flex", flexDirection: "column" }}>
                  <label>Múltiplo EV/EBITDA {autofilled.evMultiple && <span className="autofill-badge">FMP</span>} <Tip text="Múltiplo típico del sector. S&P500: 10-15×. Ver Benchmarks." /></label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input className={af("evMultiple")} value={evMultiple} onChange={e => setEvMultiple(e.target.value)} placeholder="10" type="number" />
                    <span style={{ fontFamily: "DM Mono", fontSize: "0.9rem", color: "var(--muted)", fontWeight: 600 }}>×</span>
                  </div>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Deuda total (M$) {autofilled.debt && <span className="autofill-badge">FMP</span>}</label>
                  <input className={af("debt")} value={debt} onChange={e => setDebt(e.target.value)} placeholder="ej. 2000" type="number" />
                </div>
                <div className="field">
                  <label>Efectivo (M$) {autofilled.cash && <span className="autofill-badge">FMP</span>}</label>
                  <input className={af("cash")} value={cash} onChange={e => setCash(e.target.value)} placeholder="ej. 1500" type="number" />
                </div>
              </div>
              <div className="field"><label style={{ color: "var(--muted)" }}>Acciones — compartido con DCF</label><input value={shares} readOnly /></div>
              {evVal && <div className="success-msg">✓ EV/EBITDA: {fmt(evVal)}</div>}
            </div>

            {/* PRECIO + PESOS */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#c9a84c,#1a7a4a)" }} />
              <div className="method-tag">Precio & Ponderación</div>
              <div className="card-title">⚖️ Precio & Ponderación</div>
              <div className="field">
                <label>Precio actual de mercado ($) {autofilled.currentPrice && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("currentPrice")} value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} placeholder="ej. 150.00" type="number" />
              </div>
              <hr />
              <div style={{ fontSize: "0.71rem", color: "var(--muted)", marginBottom: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Peso de cada método</div>
              <div className="weights-row">
                {[["DCF", wDCF, setWDCF], ["Graham", wGraham, setWGraham], ["P/E", wPE, setWPE], ["EV", wEV, setWEV], ["DDM", wDDM, setWDDM]].map(([n, v, s]) => (
                  <div key={n} className="weight-chip">
                    <label>{n}</label>
                    <input type="range" min="0" max="100" value={v} onChange={e => s(Number(e.target.value))} />
                    <span>{v}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RESULTADO CONSOLIDADO */}
            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#c9a84c,#1a7a4a)" }} />
              <div className="method-tag">Resultado Consolidado</div>
              <div className="card-title">🎯 Resultado Consolidado · {activeMethods} métodos activos</div>
              <div className="results-grid">
                {[["DCF", dcfVal, "#0d2257"], ["Graham Number", grahamVal, "#9a7820"], ["Múltiplo P/E", peVal, "#1a3a8f"], ["EV / EBITDA", evVal, "#5a3a00"], ["DDM", ddmVal, "#7c3aed"]].map(([l, v, c]) => (
                  <div key={l} className="result-box">
                    <div className="result-box-label">{l}</div>
                    <div className="result-box-value" style={{ color: v ? c : "var(--muted)" }}><AnimatedValue value={v} /></div>
                  </div>
                ))}
              </div>
              {hasResult ? (
                <>
                  <div className="buy-target-row">
                    <div>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>Precio máximo de entrada</div>
                      <div className="buy-target-price"><AnimatedValue value={buyTarget} /></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div className="slider-label">Margen deseado <span>{buyMarginTarget}%</span></div>
                      <input type="range" min="5" max="50" value={buyMarginTarget} onChange={e => setBuyMarginTarget(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="verdict-row">
                    <div>
                      <div className="verdict-label-sm">Valor Intrínseco Ponderado</div>
                      <div className="verdict-price"><AnimatedValue value={intrinsic} /></div>
                    </div>
                    <div className="verdict-meta">
                      <div className={`verdict-tag ${verdict.cls}`}>{verdict.icon} {verdict.label}</div>
                      <div><span className={`confidence-badge ${conf.cls}`}>◆ {conf.label}</span></div>
                      {cp > 0 && (
                        <>
                          <div className="margin-bar" style={{ marginTop: "0.8rem" }}>
                            <div className="margin-bar-fill" style={{ width: Math.max(0, Math.min(100, marginPct)) + "%", background: barColor }} />
                          </div>
                          <div className="margin-bar-labels"><span>Margen: {pct(marginPct)}</span><span>Mercado: {fmt(cp)}</span></div>
                        </>
                      )}
                    </div>
                  </div>
                  {saveError && <div className="error-msg">⚠ {saveError}</div>}
                  {savedMsg && <div className="success-msg">✓ Guardado en Watchlist</div>}
                  <button className="btn-primary btn-save" onClick={handleSave}>＋ Guardar {ticker || "empresa"} en Watchlist</button>
                </>
              ) : (
                <div className="empty-state"><span className="empty-icon">◈</span>Completa al menos un método para ver la valoración consolidada</div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: GRÁFICAS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "graficas" && (
          <div className="grid">
            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#c9a84c)" }} />
              <div className="card-title">🎚️ Velocímetro de Margen de Seguridad</div>
              <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                <PremiumGauge marginPct={marginPct} intrinsic={intrinsic} marketPrice={cp || null} upside={upside} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>El velocímetro muestra el margen de seguridad entre el valor intrínseco ponderado y el precio de mercado.</div>
                  {[["🔴","Sobrevalorada — precio supera el valor intrínseco"],["🟠","Levemente cara — poco margen disponible"],["🟡","Precio justo — mantener posición"],["🟢","Subvalorada — margen de seguridad positivo"],["🩵","Fuerte descuento — oportunidad clara de compra"]].map(([ic,d]) => (
                    <div key={ic} style={{ display:"flex",gap:"0.5rem",marginBottom:"0.5rem",fontSize:"0.75rem" }}><span>{ic}</span><span style={{color:"var(--muted)"}}>{d}</span></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#c9a84c)" }} />
              <div className="card-title">🔷 Radar de Métodos</div>
              <RadarChart dcf={dcfVal} graham={grahamVal} pe={peVal} ev={evVal} ddm={ddmVal} isDark={darkMode} />
              <div style={{ fontSize: "0.68rem", color: "var(--muted)", textAlign: "center" }}>Polígono más regular = mayor consistencia entre métodos</div>
            </div>

            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#1a7a4a,#c9a84c)" }} />
              <div className="card-title">🌊 Cascada DCF — Composición del Valor</div>
              {dcfResult.totalPV ? (
                <>
                  <WaterfallChart totalPV={dcfResult.totalPV} pvTV={dcfResult.pvTV} shares={p(shares)} isDark={darkMode} />
                  <div className="waterfall-labels">
                    <span>Ops: {fmt(dcfResult.totalPV / p(shares))}</span>
                    <span>Terminal: {fmt(dcfResult.pvTV / p(shares))}</span>
                    <span style={{ color: "var(--safe)", fontWeight: 800 }}>Total: {fmt(dcfVal)}</span>
                  </div>
                </>
              ) : <div className="empty-state"><span className="empty-icon">🌊</span>Completa el método DCF para ver la cascada.</div>}
            </div>

            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#1a3a8f)" }} />
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot" style={{ background: "#c9a84c" }} />FCF Proyectado</span>
                <span className="legend-item"><span className="legend-line" style={{ background: darkMode ? "#6ea0e8" : "#0d2257" }} />Valor Presente FCF</span>
              </div>
              <div className="card-title">📈 Proyección DCF · {years} años</div>
              {dcfResult.projections.length > 0 ? <DCFChart projections={dcfResult.projections} isDark={darkMode} /> : <div className="empty-state"><span className="empty-icon">📈</span>Completa el método DCF.</div>}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: MONTE CARLO
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "montecarlo" && (
          <div className="grid">
            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#7c3aed,#c9a84c,#1a7a4a)" }} />
              <div className="card-title">🎲 Simulación Monte Carlo — Análisis de Riesgo</div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1.2rem", lineHeight: 1.7, maxWidth: 680 }}>
                Simula <strong style={{ color: "var(--text)" }}>2,000 escenarios</strong> variando aleatoriamente el crecimiento, WACC y crecimiento terminal dentro de rangos realistas (±30-50%). Muestra la distribución de posibles valores intrínsecos con percentiles P10/P50/P90.
              </div>
              {!fcf || !shares ? (
                <div className="empty-state"><span className="empty-icon">🎲</span>Completa FCF y Acciones en circulación en el método DCF para ejecutar la simulación.</div>
              ) : (
                <>
                  <button className="btn-primary" onClick={runMC} disabled={mcRunning} style={{ width: "auto", marginBottom: "1.2rem" }}>
                    {mcRunning ? <><div className="spinner" style={{ borderTopColor: "white" }} /> Simulando 2,000 escenarios...</> : "▶ Ejecutar Simulación Monte Carlo"}
                  </button>
                  {mcResult && (
                    <>
                      <div className="mc-results">
                        {[["P10 (Pesimista)", mcResult.p10], ["P25", mcResult.p25], ["P50 (Mediana)", mcResult.p50], ["Media", mcResult.mean], ["P75", mcResult.p75], ["P90 (Optimista)", mcResult.p90]].map(([l, v]) => (
                          <div key={l} className="mc-box">
                            <div className="mc-label">{l}</div>
                            <div className="mc-val" style={{ color: v > cp && cp > 0 ? "var(--safe)" : v < cp && cp > 0 ? "var(--danger)" : "var(--text)" }}>{fmt(v)}</div>
                          </div>
                        ))}
                      </div>
                      {cp > 0 && (
                        <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 9, padding: "0.8rem 1.2rem", marginBottom: "1rem", fontSize: "0.78rem", color: "var(--muted)" }}>
                          <strong style={{ color: "var(--text)" }}>Probabilidad de subvaloración:</strong>&nbsp;
                          <span style={{ color: "var(--safe)", fontWeight: 700 }}>
                            {(mcResult.raw.filter(v => v > cp).length / mcResult.raw.length * 100).toFixed(1)}%
                          </span>
                          &nbsp;de escenarios muestran el precio actual ({fmt(cp)}) bajo el valor intrínseco estimado.
                        </div>
                      )}
                      <div className="card-title" style={{ fontSize: "0.9rem", marginBottom: "0.6rem" }}>Distribución de Valores Intrínsecos</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                        <span style={{ color: "#e74c3c" }}>── P10</span> &nbsp;
                        <span style={{ color: "#c9a84c" }}>── P50 (mediana)</span> &nbsp;
                        <span style={{ color: "#1a7a4a" }}>── P90</span> &nbsp;
                        {cp > 0 && <span style={{ color: "#e74c3c" }}>  🔴 Precio actual</span>}
                      </div>
                      <MCHistogram mcResult={mcResult} currentPrice={cp} isDark={darkMode} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: ESCENARIOS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "escenarios" && (
          <div>
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#c9a84c,#1a7a4a)" }} />
              <div className="card-title">🎭 Análisis de Escenarios — Conservador · Base · Optimista</div>
              <div className="scenario-row">
                {scenarioValues.map(s => (
                  <div key={s.key} className={`scenario-card ${selectedScenario === s.key ? "selected" : ""}`} onClick={() => setSelectedScenario(s.key)}>
                    <div className="scenario-card-label">{s.icon} {s.key}</div>
                    <div className="scenario-card-name">{s.name}</div>
                    <div className="scenario-card-val" style={{ color: s.iv ? (s.margin > 0 ? "var(--safe)" : "var(--danger)") : "var(--muted)" }}>{fmt(s.iv)}</div>
                    <div className="scenario-card-sub">Margen: {pct(s.margin)}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.5rem" }}>Los escenarios ajustan crecimiento (×0.65/1/1.35), WACC (±1.5-2.5pp) y múltiplos sectoriales automáticamente.</div>
            </div>

            {compareMode && (
              <div className="card">
                <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#c9a84c)" }} />
                <div className="card-title">⇄ Comparador de Empresas</div>
                <div className="compare-grid">
                  <div>
                    <div style={{ fontFamily: "DM Mono", fontWeight: 800, color: "var(--text)", marginBottom: "0.8rem", fontSize: "1rem" }}>{ticker || "Empresa A"}</div>
                    {[["Valor Intrínseco", fmt(intrinsic)], ["Precio Mercado", fmt(cp)], ["Margen Seguridad", pct(marginPct)], ["Potencial Alcista", pct(upside)], ["DCF", fmt(dcfVal)], ["Graham", fmt(grahamVal)], ["P/E", fmt(peVal)], ["EV/EBITDA", fmt(evVal)], ["DDM", fmt(ddmVal)]].map(([k, v]) => (
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--text)" }}>Empresa B</span>
                      <input value={comp.ticker} onChange={e => setComp(c => ({...c, ticker: e.target.value}))} placeholder="Ticker" style={{ width: 80, border: "1px solid var(--border)", borderRadius: 5, padding: "0.25rem 0.5rem", fontSize: "0.88rem", fontWeight: 800, textTransform: "uppercase", fontFamily: "DM Mono", background: "var(--surface)", color: "var(--text)" }} />
                    </div>
                    {[["FCF (M$)","fcf"],["Acciones (M)","shares"],["Crec.%","growthRate"],["WACC%","discountRate"],["EPS","eps"],["Book Val","bookValue"],["P/E obj","peTarget"],["EBITDA","ebitda"],["Divid.($)","annualDividend"]].map(([l,k]) => (
                      <div key={k} className="compare-row">
                        <span className="compare-key">{l}</span>
                        <input value={comp[k]||""} onChange={e => setComp(c=>({...c,[k]:e.target.value}))} type="number" placeholder="—" style={{ width: 100, border: "1px solid var(--border)", borderRadius: 5, padding: "0.28rem 0.5rem", fontSize: "0.8rem", background: "var(--surface2)", textAlign: "right", fontFamily: "DM Mono", color: "var(--text)" }} />
                      </div>
                    ))}
                    <hr style={{ marginTop: "0.5rem" }} />
                    {[["Valor Intrínseco", fmt(compIntrinsic)], ["Precio Mercado", fmt(compCP)], ["Margen Seguridad", pct(compMargin)], ["Potencial Alcista", compIntrinsic && compCP > 0 ? pct((compIntrinsic/compCP-1)*100) : "—"], ["DCF", fmt(compDCF)], ["Graham", fmt(compGraham)], ["P/E", fmt(compPE)], ["EV/EBITDA", fmt(compEV)], ["DDM", fmt(compDDM)]].map(([k,v]) => (
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: HEATMAP
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "heatmap" && (
          <div className="card card-full">
            <div className="card-accent" style={{ background: "linear-gradient(90deg,#1a7a4a,#c0392b)" }} />
            <div className="card-title">🗺️ Mapa de Sensibilidad — WACC vs. Crecimiento</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>Cada celda muestra el valor intrínseco DCF para una combinación de WACC y tasa de crecimiento. <strong style={{ color: "var(--text)" }}>Haz click en una celda</strong> para ver el desglose detallado.</div>
            <SensitivityHeatmap fcf={fcf} terminalGrowth={terminalGrowth} shares={shares} currentPrice={currentPrice} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB: BENCHMARKS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "benchmarks" && (
          <div className="grid">
            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#c9a84c)" }} />
              <div className="card-title">📊 Benchmarks Sectoriales — {sector}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1.2rem" }}>Compara tus múltiplos y supuestos con el promedio histórico del sector seleccionado. Cambia el sector en la sección Empresa.</div>
              <BenchmarkTable sector={sector} peTarget={peTarget} evMultiple={evMultiple} growthRate={growthRate} discountRate={effectiveWACC} />
            </div>

            <div className="card card-full" style={{ marginTop: "1rem" }}>
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#c9a84c,#1a7a4a)" }} />
              <div className="card-title">🌐 Comparativa Global de Sectores</div>
              <div style={{ overflowX: "auto" }}>
                <table className="benchmark-table">
                  <thead>
                    <tr>
                      <th>Sector</th><th>P/E prom.</th><th>EV/EBITDA</th><th>Crec. %</th><th>WACC %</th><th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(SECTOR_BENCHMARKS).map(([name, data]) => (
                      <tr key={name} className={name === sector ? "benchmark-highlight" : ""}>
                        <td style={{ fontWeight: 700 }}>{name === sector ? "★ " : ""}{name}</td>
                        <td style={{ fontFamily: "DM Mono" }}>{data.pe}×</td>
                        <td style={{ fontFamily: "DM Mono" }}>{data.ev}×</td>
                        <td style={{ fontFamily: "DM Mono" }}>{data.growth}%</td>
                        <td style={{ fontFamily: "DM Mono" }}>{data.wacc}%</td>
                        <td style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{data.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.7rem" }}>★ = Sector seleccionado actualmente. Fuente: promedios históricos S&P 500 por sector.</div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            WATCHLIST
        ═══════════════════════════════════════════════════════════════════ */}
        {savedValuations.length > 0 && (
          <div className="watchlist">
            <div className="section-title">📋 Watchlist & Portfolio</div>

            {savedValuations.length >= 2 && (
              <div className="portfolio-bar">
                <div className="portfolio-stat">
                  <div className="portfolio-stat-label">Empresas en watchlist</div>
                  <div className="portfolio-stat-val">{savedValuations.length}</div>
                </div>
                <div className="portfolio-stat">
                  <div className="portfolio-stat-label">Valor intrínseco total</div>
                  <div className="portfolio-stat-val">{fmt(portfolioValue)}</div>
                </div>
                <div className="portfolio-stat">
                  <div className="portfolio-stat-label">Margen promedio</div>
                  <div className="portfolio-stat-val" style={{ color: (portfolioAvgMargin??0) > 0 ? "var(--safe)" : "var(--danger)" }}>{pct(portfolioAvgMargin)}</div>
                </div>
                <div className="portfolio-stat">
                  <div className="portfolio-stat-label">Oportunidades de compra</div>
                  <div className="portfolio-stat-val" style={{ color: "var(--safe)" }}>{buyCount} {buyCount === 1 ? "empresa" : "empresas"}</div>
                </div>
              </div>
            )}

            <div className="watchlist-controls">
              <input className="watchlist-search" placeholder="🔍  Buscar por ticker o nombre..." value={watchSearch} onChange={e => setWatchSearch(e.target.value)} />
              <select className="watchlist-sort" value={watchSort} onChange={e => setWatchSort(e.target.value)}>
                <option value="date">⟳ Más reciente</option>
                <option value="margin">↑ Mayor margen</option>
                <option value="value">$ Mayor valor</option>
              </select>
            </div>

            {filteredWatchlist.map(item => (
              <div key={item.id} className="watch-card">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="watch-ticker">{item.ticker}</span>
                      {item.history?.length > 1 && <Sparkline history={item.history} />}
                    </div>
                    <div className="watch-name">{item.companyName}{item.sector ? " · " + item.sector : ""}</div>
                  </div>
                </div>
                <div className="watch-numbers">
                  <div className="watch-val" style={{ color: (item.margin??0) > 25 ? "var(--safe)" : (item.margin??0) > 0 ? "#c9a84c" : "var(--danger)" }}>{fmt(item.intrinsic)}</div>
                  <div className="watch-price">Precio: {fmt(item.price)}&nbsp;<span style={{ color: (item.margin??0) > 0 ? "var(--safe)" : "var(--danger)", fontWeight: 700 }}>({pct(item.margin)})</span></div>
                  <span className={`confidence-badge ${(item.margin??0)>25?"conf-high":(item.margin??0)>0?"conf-mid":"conf-low"}`} style={{ fontSize: "0.62rem", marginTop: "0.3rem" }}>
                    {(item.margin??0)>25?"▲ COMPRAR":(item.margin??0)>0?"◆ MANTENER":"▼ CARO"}
                  </span>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(item.id)}>✕</button>
              </div>
            ))}
            {filteredWatchlist.length === 0 && watchSearch && (
              <div className="empty-state"><span className="empty-icon">🔍</span>No se encontraron resultados para "{watchSearch}"</div>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="footnote">
          <strong>Valor Intrínseco Pro</strong> — Plataforma de análisis fundamental multi-método<br />
          Datos vía Financial Modeling Prep API &nbsp;·&nbsp; 5 métodos de valoración &nbsp;·&nbsp; Simulación Monte Carlo &nbsp;·&nbsp; Benchmarks sectoriales<br />
          <strong>⚠️ Aviso legal:</strong> Esta herramienta es <em>exclusivamente informativa</em>. Los resultados dependen enteramente de los supuestos ingresados y no garantizan retornos futuros. <strong>No constituye asesoría financiera ni recomendación de inversión.</strong> Consulta siempre con un asesor financiero certificado antes de tomar decisiones de inversión. · © 2025
        </div>

      </div>
    </>
  );
}
