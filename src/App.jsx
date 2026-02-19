import { useState, useEffect, useRef, useCallback } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f5f7fa; --surface: #ffffff; --surface2: #eef1f6; --border: #dce2ee;
  --navy: #0d2257; --navy2: #1a3a8f; --gold: #c9a84c; --gold2: #e8c96a;
  --gold-light: #fdf6e3; --text: #0d1b3e; --muted: #7a8ab0;
  --danger: #c0392b; --safe: #1a7a4a; --safe-bg: #eafaf1;
  --danger-bg: #fdf0ee; --hold-bg: #fdf6e3;
  --fmp: #2563eb;
}

body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; min-height: 100vh; }
.app { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem 4rem; }

.header { background: var(--navy); margin: 0 -1.5rem 2.5rem; padding: 2.2rem 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.header-left h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1.1; }
.header-left h1 span { color: var(--gold2); }
.header-left p { color: #8fa3cc; font-size: 0.82rem; margin-top: 0.4rem; font-weight: 300; }
.header-badge { background: var(--gold); color: var(--navy); font-size: 0.68rem; font-weight: 700; padding: 0.35rem 0.9rem; border-radius: 3px; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }

.card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.6rem; box-shadow: 0 2px 10px rgba(13,34,87,0.06); position: relative; animation: fadeUp 0.4s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.card:nth-child(1){animation-delay:0.05s} .card:nth-child(2){animation-delay:0.10s} .card:nth-child(3){animation-delay:0.15s} .card:nth-child(4){animation-delay:0.20s} .card:nth-child(5){animation-delay:0.25s}
.card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 10px 10px 0 0; }
.card-full { grid-column: 1 / -1; }

.method-tag { display: inline-block; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.25rem; }
.card-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }

.status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; transition: background 0.3s; }
.status-dot.active { background: var(--safe); box-shadow: 0 0 0 3px rgba(26,122,74,0.15); }
.status-dot.inactive { background: var(--border); }

.field { margin-bottom: 0.9rem; position: relative; }
.field label { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 500; color: var(--muted); margin-bottom: 0.3rem; }
.field input { width: 100%; border: 1.5px solid var(--border); border-radius: 6px; padding: 0.5rem 0.8rem; font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-variant-numeric: tabular-nums; color: var(--text); background: var(--surface2); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.field input:focus { border-color: var(--navy2); box-shadow: 0 0 0 3px rgba(26,58,143,0.1); background: #fff; }
.field input[readonly] { opacity: 0.5; background: var(--surface2); cursor: not-allowed; }
.field input.autofilled { border-color: var(--fmp); background: #eff6ff; color: #1e40af; }

.tooltip-wrap { position: relative; display: inline-flex; }
.tooltip-icon { width: 15px; height: 15px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-size: 0.6rem; display: inline-flex; align-items: center; justify-content: center; cursor: help; font-weight: 700; flex-shrink: 0; }
.tooltip-box { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: var(--navy); color: #c8d8f0; font-size: 0.7rem; font-weight: 400; padding: 0.5rem 0.8rem; border-radius: 6px; width: 200px; line-height: 1.5; z-index: 100; pointer-events: none; }
.tooltip-box::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: var(--navy); }
.tooltip-wrap:hover .tooltip-box { display: block; }

.slider-field { margin-bottom: 0.9rem; }
.slider-field label { display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; font-weight: 500; color: var(--muted); margin-bottom: 0.4rem; }
.slider-field label span { font-family: 'Playfair Display', serif; font-size: 0.9rem; font-weight: 700; color: var(--navy); }
.slider-field input[type=range] { width: 100%; accent-color: var(--navy2); cursor: pointer; height: 4px; }

.weights-row { display: flex; gap: 1.2rem; flex-wrap: wrap; margin-top: 0.5rem; }
.weight-chip { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.weight-chip label { font-size: 0.65rem; font-weight: 600; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
.weight-chip input[type=range] { width: 90px; accent-color: var(--navy2); cursor: pointer; }
.weight-chip span { font-size: 0.78rem; font-weight: 600; color: var(--navy2); }

.results-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
@media (max-width: 720px) { .results-grid { grid-template-columns: repeat(2,1fr); } }

.result-box { border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.1rem; background: var(--surface2); transition: transform 0.2s; }
.result-box:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13,34,87,0.08); }
.result-box-label { font-size: 0.65rem; font-weight: 600; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
.result-box-value { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 700; font-variant-numeric: tabular-nums; transition: all 0.4s; }

.verdict-row { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; background: var(--surface2); border: 1.5px solid var(--border); border-radius: 10px; padding: 1.5rem 1.8rem; }
.verdict-label-sm { font-size: 0.68rem; font-weight: 600; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.3rem; }
.verdict-price { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 800; color: var(--navy); line-height: 1; font-variant-numeric: tabular-nums; transition: all 0.4s; }
.verdict-meta { flex: 1; min-width: 200px; }
.verdict-tag { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 1rem; border-radius: 5px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.6rem; }
.tag-buy { background: var(--safe-bg); color: var(--safe); border: 1.5px solid var(--safe); }
.tag-sell { background: var(--danger-bg); color: var(--danger); border: 1.5px solid var(--danger); }
.tag-hold { background: var(--hold-bg); color: #8a6800; border: 1.5px solid var(--gold); }
.tag-neutral { background: var(--surface2); color: var(--muted); border: 1.5px solid var(--border); }

.margin-bar { width: 100%; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 0.4rem; }
.margin-bar-fill { height: 100%; border-radius: 4px; transition: width 0.7s cubic-bezier(0.4,0,0.2,1); }
.margin-bar-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--muted); font-weight: 500; }

@keyframes numberPop { 0% { transform: scale(1.15); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }
.number-animate { animation: numberPop 0.35s ease; }

.chart-wrap { width: 100%; overflow-x: auto; margin-top: 0.5rem; }
canvas { display: block; max-width: 100%; }
.chart-legend { display: flex; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 500; color: var(--muted); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }

.empty-state { text-align: center; padding: 2.5rem 1rem; color: var(--muted); font-size: 0.85rem; }
.divider { border: none; border-top: 1px solid var(--border); margin: 1.2rem 0; }
.footnote { text-align: center; font-size: 0.68rem; color: var(--muted); margin-top: 2.5rem; line-height: 1.8; }

.metric-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.2rem; border-left: 4px solid var(--gold); box-shadow: 0 2px 8px rgba(13,34,87,0.05); animation: fadeUp 0.4s ease both; }
.metric-card-label { font-size: 0.65rem; font-weight: 600; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.3rem; }
.metric-card-value { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--navy); font-variant-numeric: tabular-nums; }
.metric-card-sub { font-size: 0.7rem; color: var(--muted); margin-top: 0.15rem; }

.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border); }
.tab-btn { background: none; border: none; padding: 0.6rem 1.2rem; font-size: 0.8rem; font-weight: 600; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: color 0.2s, border-color 0.2s; border-radius: 4px 4px 0 0; font-family: 'Outfit', sans-serif; }
.tab-btn.active { color: var(--navy); border-bottom-color: var(--gold); }
.tab-btn:hover:not(.active) { color: var(--navy2); background: var(--surface2); }

.scenario-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.2rem; }
@media (max-width: 600px) { .scenario-row { grid-template-columns: 1fr; } }
.scenario-card { border: 1.5px solid var(--border); border-radius: 8px; padding: 1rem; cursor: pointer; transition: all 0.2s; text-align: center; }
.scenario-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13,34,87,0.1); }
.scenario-card.selected { border-color: var(--navy2); background: #f0f4ff; }
.scenario-card-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; color: var(--muted); }
.scenario-card-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.4rem; }
.scenario-card-val { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.scenario-card-sub { font-size: 0.68rem; color: var(--muted); margin-top: 0.2rem; }

.buy-target-row { background: var(--gold-light); border: 1.5px solid var(--gold); border-radius: 8px; padding: 1rem 1.4rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.buy-target-label { font-size: 0.7rem; font-weight: 600; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.2rem; }
.buy-target-price { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: var(--navy); font-variant-numeric: tabular-nums; }
.buy-target-slider { flex: 1; min-width: 200px; }
.buy-target-slider label { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--muted); font-weight: 500; margin-bottom: 0.3rem; }
.buy-target-slider input[type=range] { width: 100%; accent-color: var(--navy); }

.confidence-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.9rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; border: 1.5px solid; }
.conf-high { background: var(--safe-bg); color: var(--safe); border-color: var(--safe); }
.conf-mid { background: var(--hold-bg); color: #8a6800; border-color: var(--gold); }
.conf-low { background: var(--surface2); color: var(--muted); border-color: var(--border); }

.btn-save { background: var(--navy); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 1rem; transition: background 0.2s, transform 0.1s; width: 100%; font-size: 0.9rem; font-family: 'Outfit', sans-serif; }
.btn-save:hover { background: var(--navy2); transform: translateY(-1px); }
.btn-save:active { transform: translateY(0); }

.error-msg { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger); border-radius: 6px; padding: 0.5rem 0.8rem; font-size: 0.75rem; font-weight: 500; margin-top: 0.7rem; display: flex; align-items: center; gap: 0.4rem; }
.success-msg { background: var(--safe-bg); color: var(--safe); border: 1px solid var(--safe); border-radius: 6px; padding: 0.5rem 0.8rem; font-size: 0.75rem; font-weight: 500; margin-top: 0.7rem; display: flex; align-items: center; gap: 0.4rem; }

.watchlist { margin-top: 3rem; }
.watchlist-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--navy); margin-bottom: 1rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
.watch-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; transition: transform 0.2s, box-shadow 0.2s; }
.watch-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13,34,87,0.08); }
.watch-info { display: flex; align-items: center; gap: 1rem; }
.watch-ticker { font-weight: 800; color: var(--navy); font-size: 1.1rem; }
.watch-name { color: var(--muted); font-size: 0.8rem; }
.watch-numbers { text-align: right; }
.watch-val { font-weight: 700; color: var(--safe); font-size: 1.1rem; font-variant-numeric: tabular-nums; }
.watch-price { color: var(--muted); font-size: 0.8rem; font-variant-numeric: tabular-nums; }
.btn-delete { background: var(--danger-bg); color: var(--danger); border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: bold; margin-left: 1rem; transition: background 0.2s; }
.btn-delete:hover { background: #f9d6d2; }

.heatmap-wrap { overflow-x: auto; margin-top: 0.5rem; }
.heatmap-table { border-collapse: collapse; font-size: 0.7rem; width: 100%; }
.heatmap-table th { padding: 0.3rem 0.5rem; color: var(--muted); font-weight: 600; text-align: center; white-space: nowrap; }
.heatmap-table td { padding: 0.35rem 0.5rem; text-align: center; border-radius: 4px; font-variant-numeric: tabular-nums; font-weight: 600; font-size: 0.68rem; min-width: 56px; transition: opacity 0.2s; }
.heatmap-table td:hover { opacity: 0.8; outline: 2px solid var(--navy2); }
.heatmap-axis { color: var(--navy); font-weight: 700 !important; background: var(--surface2); }

.radar-wrap { display: flex; justify-content: center; margin: 0.5rem 0 1rem; }

.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }
@media (max-width: 720px) { .compare-grid { grid-template-columns: 1fr; } }
.compare-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border); font-size: 0.8rem; }
.compare-row:last-child { border-bottom: none; }
.compare-key { color: var(--muted); font-weight: 500; }
.compare-val { font-weight: 700; color: var(--navy); font-variant-numeric: tabular-nums; }

.sparkline-wrap { display: inline-block; vertical-align: middle; margin-left: 0.5rem; }
.waterfall-labels { display: flex; justify-content: space-around; margin-top: 0.3rem; font-size: 0.65rem; color: var(--muted); font-weight: 500; }

/* ── FMP PANEL ── */
.fmp-panel { background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border: 1.5px solid #93c5fd; border-radius: 10px; padding: 1.4rem; margin-bottom: 1.4rem; position: relative; overflow: hidden; }
.fmp-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--fmp), #7c3aed); }
.fmp-panel-title { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #1e40af; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
.fmp-panel-sub { font-size: 0.72rem; color: #3b82f6; margin-bottom: 1rem; line-height: 1.5; }
.fmp-panel-sub a { color: var(--fmp); font-weight: 600; text-decoration: none; }
.fmp-panel-sub a:hover { text-decoration: underline; }
.fmp-input-row { display: flex; gap: 0.7rem; align-items: flex-end; flex-wrap: wrap; }
.fmp-input-row .field { flex: 1; min-width: 200px; margin-bottom: 0; }
.fmp-input-row .field input { font-family: 'DM Mono', monospace; letter-spacing: 0.05em; background: white; border-color: #93c5fd; }
.fmp-input-row .field input:focus { border-color: var(--fmp); box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
.btn-fetch { background: var(--fmp); color: white; border: none; padding: 0.52rem 1.3rem; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; height: 38px; font-family: 'Outfit', sans-serif; }
.btn-fetch:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
.btn-fetch:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-fetch-clear { background: var(--surface2); color: var(--muted); border: 1.5px solid var(--border); padding: 0.52rem 1rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; height: 38px; white-space: nowrap; font-family: 'Outfit', sans-serif; }
.btn-fetch-clear:hover { background: var(--danger-bg); color: var(--danger); border-color: var(--danger); }
.fmp-status { margin-top: 0.8rem; font-size: 0.74rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.fmp-status.loading { color: var(--fmp); } .fmp-status.ok { color: var(--safe); } .fmp-status.err { color: var(--danger); }
.fmp-loaded-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.7rem; }
.fmp-chip { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; border-radius: 4px; font-size: 0.63rem; font-weight: 700; padding: 0.2rem 0.5rem; display: flex; align-items: center; gap: 0.3rem; }
.fmp-chip.ok { background: var(--safe-bg); color: var(--safe); border-color: #6ee7b7; }
.fmp-chip.miss { background: var(--surface2); color: var(--muted); border-color: var(--border); }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(37,99,235,0.2); border-top-color: var(--fmp); border-radius: 50%; animation: spin 0.7s linear infinite; }
.autofill-badge { display: inline-flex; align-items: center; gap: 0.3rem; background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; border-radius: 3px; font-size: 0.58rem; font-weight: 700; padding: 0.1rem 0.4rem; margin-left: 0.4rem; vertical-align: middle; letter-spacing: 0.05em; }

/* ── PREMIUM GAUGE (dark card) ── */
.gauge-dark-card {
  background: linear-gradient(160deg, #141d35 0%, #0d1528 60%, #101826 100%);
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: 16px;
  padding: 1.8rem 2rem 1.4rem;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.gauge-dark-card::before {
  content: '';
  position: absolute;
  top: -50px; left: 50%;
  transform: translateX(-50%);
  width: 280px; height: 100px;
  background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.gauge-dark-title {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8fa3cc;
  margin-bottom: 0.2rem;
}
.gauge-dark-heading {
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
  font-weight: 800;
  color: #e8f0ff;
  margin-bottom: 1rem;
}
.gauge-canvas-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauge-center-overlay {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
}
.gauge-pct-big {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  transition: color 0.5s ease;
}
.gauge-pct-label {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: 0.1rem;
  transition: color 0.5s ease;
}
.gauge-verdict-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.8rem;
  padding: 0.4rem 1.2rem;
  border-radius: 50px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1.5px solid;
  transition: all 0.5s ease;
  font-family: 'Outfit', sans-serif;
}
.gauge-mini-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.6rem;
  margin-top: 1rem;
  width: 100%;
}
.gauge-mini-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  padding: 0.55rem 0.7rem;
  text-align: center;
}
.gauge-mini-label {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8fa3cc;
  margin-bottom: 0.2rem;
}
.gauge-mini-val {
  font-family: 'DM Mono', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  color: #e8f0ff;
}
`;

// ─── FMP API ─────────────────────────────────────────────────────────────────
const FMP_BASE = "https://financialmodelingprep.com/api/v3";

async function fetchFMPData(ticker, apiKey) {
  const urls = {
    profile:    `${FMP_BASE}/profile/${ticker}?apikey=${apiKey}`,
    income:     `${FMP_BASE}/income-statement/${ticker}?limit=1&apikey=${apiKey}`,
    cashflow:   `${FMP_BASE}/cash-flow-statement/${ticker}?limit=3&apikey=${apiKey}`,
    balance:    `${FMP_BASE}/balance-sheet-statement/${ticker}?limit=1&apikey=${apiKey}`,
    keyMetrics: `${FMP_BASE}/key-metrics/${ticker}?limit=1&apikey=${apiKey}`,
    quote:      `${FMP_BASE}/quote/${ticker}?apikey=${apiKey}`,
  };
  const results = await Promise.allSettled(
    Object.entries(urls).map(([key, url]) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json().then(data => ({ key, data })); })
    )
  );
  const out = {};
  results.forEach(r => { if (r.status === "fulfilled") out[r.value.key] = r.value.data; });
  return out;
}

function parseFMPData(raw) {
  const parsed = {}, loaded = {};
  try {
    const profile = raw.profile?.[0];
    if (profile) {
      parsed.companyName = profile.companyName || "";
      parsed.currentPrice = profile.price ? String(profile.price) : "";
      parsed.shares = profile.sharesOutstanding ? String((profile.sharesOutstanding / 1e6).toFixed(2)) : "";
      loaded.companyName = !!profile.companyName;
      loaded.currentPrice = !!profile.price;
      loaded.shares = !!profile.sharesOutstanding;
    }
  } catch {}
  try {
    const quote = raw.quote?.[0];
    if (quote?.price && !parsed.currentPrice) { parsed.currentPrice = String(quote.price); loaded.currentPrice = true; }
  } catch {}
  try {
    const cf = raw.cashflow;
    if (cf?.length > 0) {
      const fcfs = cf.slice(0, 3).map(y => y.freeCashFlow).filter(v => typeof v === "number" && !isNaN(v));
      if (fcfs.length > 0) { parsed.fcf = String((fcfs.reduce((a, b) => a + b, 0) / fcfs.length / 1e6).toFixed(1)); loaded.fcf = true; }
    }
  } catch {}
  try {
    const inc = raw.income?.[0];
    if (inc) { parsed.eps = inc.eps ? String(inc.eps.toFixed(2)) : ""; parsed.ebitda = inc.ebitda ? String((inc.ebitda / 1e6).toFixed(1)) : ""; loaded.eps = !!inc.eps; loaded.ebitda = !!inc.ebitda; }
  } catch {}
  try {
    const bal = raw.balance?.[0];
    if (bal) {
      parsed.debt = bal.totalDebt ? String((bal.totalDebt / 1e6).toFixed(1)) : "0";
      parsed.cash = bal.cashAndCashEquivalents ? String((bal.cashAndCashEquivalents / 1e6).toFixed(1)) : "0";
      parsed.bookValue = (bal.totalStockholdersEquity && raw.profile?.[0]?.sharesOutstanding) ? String((bal.totalStockholdersEquity / raw.profile[0].sharesOutstanding).toFixed(2)) : "";
      loaded.debt = !!bal.totalDebt; loaded.cash = !!bal.cashAndCashEquivalents; loaded.bookValue = !!parsed.bookValue;
    }
  } catch {}
  try {
    const km = raw.keyMetrics?.[0];
    if (km) {
      if (km.peRatio && !isNaN(km.peRatio) && km.peRatio > 0 && km.peRatio < 100) { parsed.peTarget = String(Math.round(km.peRatio)); loaded.peTarget = true; }
      if (km.enterpriseValueOverEBITDA && !isNaN(km.enterpriseValueOverEBITDA) && km.enterpriseValueOverEBITDA > 0 && km.enterpriseValueOverEBITDA < 80) { parsed.evMultiple = String(km.enterpriseValueOverEBITDA.toFixed(1)); loaded.evMultiple = true; }
      if (km.revenueGrowth && !isNaN(km.revenueGrowth)) { const g = Math.round(Math.abs(km.revenueGrowth) * 100); if (g >= 1 && g <= 50) { parsed.growthRate = String(g); loaded.growthRate = true; } }
    }
  } catch {}
  return { parsed, loaded };
}

// ─── MATH HELPERS ─────────────────────────────────────────────────────────────
function calcDCF({ fcf, growthRate, terminalGrowth, discountRate, years, shares }) {
  if (!fcf || !shares || !discountRate || discountRate <= terminalGrowth)
    return { value: null, projections: [], pvTV: null, totalPV: null };
  const g = growthRate / 100, r = discountRate / 100, tg = terminalGrowth / 100;
  let pv = 0, cf = fcf;
  const projections = [];
  for (let i = 1; i <= years; i++) {
    cf *= (1 + g);
    const pvCF = cf / Math.pow(1 + r, i);
    pv += pvCF;
    projections.push({ year: i, fcf: cf, pvFCF: pvCF });
  }
  const tv = cf * (1 + tg) / (r - tg);
  const pvTV = tv / Math.pow(1 + r, years);
  return { value: (pv + pvTV) / shares, projections, pvTV, totalPV: pv };
}
const calcGraham = ({ eps, bookValue }) => eps > 0 && bookValue > 0 ? Math.sqrt(22.5 * eps * bookValue) : null;
const calcPE = ({ eps, peTarget }) => eps && peTarget ? eps * peTarget : null;
const calcEV = ({ ebitda, evMultiple, debt, cash, shares }) =>
  ebitda && evMultiple && shares ? (ebitda * evMultiple - (debt || 0) + (cash || 0)) / shares : null;
function weightedAvg(pairs) {
  let sum = 0, wsum = 0;
  pairs.forEach(([v, w]) => { if (v !== null && v > 0 && w > 0) { sum += v * w; wsum += w; } });
  return wsum > 0 ? sum / wsum : null;
}
const fmt = (n) => (n === null || n === undefined || isNaN(n)) ? "—" : "$" + Number(n).toFixed(2);
const pct = (n) => { if (n === null || n === undefined) return "—"; const v = Math.round(n); return (v > 0 ? "+" : "") + v + "%"; };
const p = (v) => parseFloat(v) || 0;
function confidenceScore(vals) {
  const active = vals.filter(v => v !== null && v > 0);
  if (active.length < 2) return { score: 0, label: "Insuficiente", cls: "conf-low" };
  const mean = active.reduce((a, b) => a + b, 0) / active.length;
  const variance = active.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / active.length;
  const cv = Math.sqrt(variance) / mean;
  const score = Math.max(0, Math.min(10, Math.round((1 - cv) * 10)));
  if (score >= 7) return { score, label: `Alta consistencia (${score}/10)`, cls: "conf-high" };
  if (score >= 4) return { score, label: `Consistencia media (${score}/10)`, cls: "conf-mid" };
  return { score, label: `Baja consistencia (${score}/10)`, cls: "conf-low" };
}

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────
function Tip({ text }) {
  return (
    <span className="tooltip-wrap">
      <span className="tooltip-icon">i</span>
      <span className="tooltip-box">{text}</span>
    </span>
  );
}

// ─── ANIMATED NUMBER ──────────────────────────────────────────────────────────
function AnimatedValue({ value, format = fmt }) {
  const [key, setKey] = useState(0);
  const prevRef = useRef(value);
  useEffect(() => { if (prevRef.current !== value) { setKey(k => k + 1); prevRef.current = value; } }, [value]);
  return <span key={key} className="number-animate">{format(value)}</span>;
}

// ─── PREMIUM GAUGE DRAW ───────────────────────────────────────────────────────
function drawPremiumGauge(canvas, marginPct) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = 320, H = 200;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H - 28, R = 118, thickness = 26, innerR = R - thickness;
  const startAngle = Math.PI, endAngle = 2 * Math.PI;

  // Shadow behind arc
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.arc(cx, cy, R + 3, startAngle, endAngle);
  ctx.arc(cx, cy, innerR - 3, endAngle, startAngle, true);
  ctx.closePath(); ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fill();
  ctx.restore();

  // Track
  ctx.beginPath(); ctx.arc(cx, cy, R, startAngle, endAngle);
  ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
  ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.fill();

  // Colored zones
  const zones = [
    { from: 0,    to: 0.28, colorA: "#c0392b", colorB: "#e74c3c" },
    { from: 0.28, to: 0.48, colorA: "#e67e22", colorB: "#f39c12" },
    { from: 0.48, to: 0.68, colorA: "#f1c40f", colorB: "#e8c96a" },
    { from: 0.68, to: 0.84, colorA: "#2ecc71", colorB: "#27ae60" },
    { from: 0.84, to: 1.0,  colorA: "#1abc9c", colorB: "#16a085" },
  ];
  zones.forEach(z => {
    const sa = startAngle + z.from * Math.PI, ea = startAngle + z.to * Math.PI;
    const gx1 = cx + (innerR + thickness * 0.3) * Math.cos(sa), gy1 = cy + (innerR + thickness * 0.3) * Math.sin(sa);
    const gx2 = cx + (innerR + thickness * 0.3) * Math.cos(ea), gy2 = cy + (innerR + thickness * 0.3) * Math.sin(ea);
    const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
    grad.addColorStop(0, z.colorA); grad.addColorStop(1, z.colorB);
    ctx.beginPath(); ctx.arc(cx, cy, R, sa, ea);
    ctx.arc(cx, cy, innerR, ea, sa, true); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
  });

  // Gloss
  const glossGrad = ctx.createLinearGradient(0, cy - R, 0, cy - innerR);
  glossGrad.addColorStop(0, "rgba(255,255,255,0.15)"); glossGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath(); ctx.arc(cx, cy, R, startAngle, endAngle);
  ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
  ctx.closePath(); ctx.fillStyle = glossGrad; ctx.fill();

  // Ticks
  const tickVals = [-50, -25, 0, 25, 50, 75, 100];
  tickVals.forEach(val => {
    const norm = (val + 50) / 150;
    const angle = startAngle + norm * Math.PI;
    const isMain = true;
    ctx.beginPath();
    ctx.moveTo(cx + (R + 7) * Math.cos(angle), cy + (R + 7) * Math.sin(angle));
    ctx.lineTo(cx + (R + 2) * Math.cos(angle), cy + (R + 2) * Math.sin(angle));
    ctx.strokeStyle = "rgba(255,255,255,0.65)"; ctx.lineWidth = 1.5; ctx.stroke();
    const labelR = R + 19;
    ctx.fillStyle = "rgba(180,200,240,0.7)";
    ctx.font = `500 8px 'Outfit', sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(val + "%", cx + labelR * Math.cos(angle), cy + labelR * Math.sin(angle));
  });

  // Inner dark fill
  ctx.beginPath(); ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2);
  ctx.fillStyle = "#0c1220"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke();

  // Active glow
  const clamped = Math.max(-50, Math.min(100, marginPct ?? -50));
  const norm = (clamped + 50) / 150;
  const needleAngle = startAngle + norm * Math.PI;
  const glowColor = clamped > 50 ? "#1abc9c" : clamped > 25 ? "#27ae60" : clamped > 0 ? "#e8c96a" : clamped > -25 ? "#e67e22" : "#e74c3c";
  const glowX = cx + (innerR + thickness / 2) * Math.cos(needleAngle);
  const glowY = cy + (innerR + thickness / 2) * Math.sin(needleAngle);
  const glowGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 32);
  glowGrad.addColorStop(0, glowColor + "55"); glowGrad.addColorStop(1, "transparent");
  ctx.beginPath(); ctx.arc(glowX, glowY, 32, 0, Math.PI * 2);
  ctx.fillStyle = glowGrad; ctx.fill();

  // Needle
  ctx.save(); ctx.translate(cx, cy);
  ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2;
  const needleLen = innerR - 6;
  ctx.rotate(needleAngle - Math.PI);
  const nGrad = ctx.createLinearGradient(-3, 0, 3, 0);
  nGrad.addColorStop(0, "rgba(255,255,255,0.25)"); nGrad.addColorStop(0.4, "#ffffff");
  nGrad.addColorStop(0.6, "#e0e8ff"); nGrad.addColorStop(1, "rgba(200,210,255,0.35)");
  ctx.beginPath();
  ctx.moveTo(-1.5, 8); ctx.lineTo(-3, -needleLen * 0.6);
  ctx.lineTo(0, -needleLen); ctx.lineTo(3, -needleLen * 0.6); ctx.lineTo(1.5, 8);
  ctx.closePath(); ctx.fillStyle = nGrad; ctx.fill();
  ctx.restore();

  // Hub
  const hubGrad = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 14);
  hubGrad.addColorStop(0, "#4a6fa5"); hubGrad.addColorStop(0.5, "#1a3a8f"); hubGrad.addColorStop(1, "#0d2257");
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fillStyle = hubGrad; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = "#e8c96a"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 1.5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();

  // Zone labels
  ctx.font = `600 8px 'Outfit', sans-serif`; ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(231,76,60,0.8)"; ctx.textAlign = "left"; ctx.fillText("SOBREVALORADA", cx - R + 2, cy + 12);
  ctx.fillStyle = "rgba(26,188,156,0.8)"; ctx.textAlign = "right"; ctx.fillText("SUBVALORADA", cx + R - 2, cy + 12);
}

// ─── PREMIUM GAUGE COMPONENT ──────────────────────────────────────────────────
function PremiumGauge({ marginPct, intrinsic, marketPrice, upside }) {
  const canvasRef = useRef(null);
  useEffect(() => { drawPremiumGauge(canvasRef.current, marginPct); }, [marginPct]);

  const clamped = Math.max(-50, Math.min(100, marginPct ?? 0));
  const color = clamped > 50 ? "#1abc9c" : clamped > 25 ? "#27ae60" : clamped > 0 ? "#e8c96a" : clamped > -25 ? "#e67e22" : "#e74c3c";
  const verdict =
    clamped > 50  ? { label: "Fuertemente Subvalorada", icon: "▲▲" } :
    clamped > 25  ? { label: "Subvalorada — Comprar",   icon: "▲"  } :
    clamped > 5   ? { label: "Precio Justo — Mantener", icon: "◆"  } :
    clamped > -15 ? { label: "Levemente Cara",          icon: "▼"  } :
                    { label: "Sobrevalorada — Cuidado",  icon: "▼▼" };

  return (
    <div className="gauge-dark-card">
      <div className="gauge-dark-title">Análisis de Valoración</div>
      <div className="gauge-dark-heading">Velocímetro de Margen de Seguridad</div>
      <div className="gauge-canvas-wrap">
        <canvas ref={canvasRef} />
        <div className="gauge-center-overlay">
          <div className="gauge-pct-big" style={{ color }}>{pct(marginPct)}</div>
          <div className="gauge-pct-label" style={{ color: color + "aa" }}>Margen de seguridad</div>
        </div>
      </div>
      <div className="gauge-verdict-pill" style={{ background: color + "18", borderColor: color + "55", color }}>
        <span>{verdict.icon}</span>{verdict.label}
      </div>
      <div className="gauge-mini-metrics">
        {[["Valor Intrínseco", fmt(intrinsic)], ["Precio Mercado", fmt(marketPrice)], ["Potencial Alzada", pct(upside)]].map(([label, val]) => (
          <div key={label} className="gauge-mini-box">
            <div className="gauge-mini-label">{label}</div>
            <div className="gauge-mini-val">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DCF CHART ────────────────────────────────────────────────────────────────
function DCFChart({ projections }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !projections?.length) return;
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 700, H = 260;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
    const pad = { top: 20, right: 20, bottom: 40, left: 65 };
    const chartW = W - pad.left - pad.right, chartH = H - pad.top - pad.bottom;
    const n = projections.length;
    const maxVal = Math.max(...projections.map(d => d.fcf)) * 1.15;
    const xScale = (i) => pad.left + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
    const yScale = (v) => pad.top + chartH - (v / maxVal) * chartH;
    ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = pad.top + (chartH / 4) * i; ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke(); }
    const barW = Math.min(chartW / n * 0.45, 32);
    projections.forEach((d, i) => {
      const x = xScale(i), bH = (d.fcf / maxVal) * chartH, bY = pad.top + chartH - bH;
      const grad = ctx.createLinearGradient(0, bY, 0, pad.top + chartH);
      grad.addColorStop(0, "rgba(201,168,76,0.85)"); grad.addColorStop(1, "rgba(201,168,76,0.2)");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.roundRect(x - barW / 2, bY, barW, bH, [3, 3, 0, 0]); ctx.fill();
    });
    if (n > 1) {
      ctx.beginPath(); ctx.strokeStyle = "#0d2257"; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
      projections.forEach((d, i) => { const x = xScale(i), y = yScale(d.pvFCF); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
    }
    projections.forEach((d, i) => {
      const x = xScale(i), y = yScale(d.pvFCF);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = "#0d2257"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
    });
    ctx.fillStyle = "#7a8ab0"; ctx.font = "500 11px 'Outfit', sans-serif"; ctx.textAlign = "center";
    projections.forEach((d, i) => { if (n <= 6 || i % 2 === 0) ctx.fillText(`Y${d.year}`, xScale(i), H - 10); });
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) { const v = (maxVal / 4) * (4 - i), y = pad.top + (chartH / 4) * i; ctx.fillText(v >= 1000 ? (v / 1000).toFixed(1) + "B" : v.toFixed(0) + "M", pad.left - 8, y + 4); }
  }, [projections]);
  return <div className="chart-wrap"><canvas ref={ref} style={{ width: "100%" }} /></div>;
}

// ─── RADAR ────────────────────────────────────────────────────────────────────
function RadarChart({ dcf, graham, pe, ev }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 240, H = 220, dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
    const vals = [dcf, graham, pe, ev], labels = ["DCF", "Graham", "P/E", "EV/EBITDA"];
    const active = vals.filter(v => v !== null && v > 0);
    if (active.length < 2) { ctx.fillStyle = "#7a8ab0"; ctx.font = "12px 'Outfit'"; ctx.textAlign = "center"; ctx.fillText("Completa al menos 2 métodos", W / 2, H / 2); return; }
    const maxVal = Math.max(...active) * 1.2, cx = W / 2, cy = H / 2 + 10, r = 80, n = 4;
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath(); ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1;
      for (let i = 0; i < n; i++) { const angle = (2 * Math.PI * i / n) - Math.PI / 2; const x = cx + (r * ring / 4) * Math.cos(angle), y = cy + (r * ring / 4) * Math.sin(angle); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.closePath(); ctx.stroke();
    }
    for (let i = 0; i < n; i++) { const angle = (2 * Math.PI * i / n) - Math.PI / 2; ctx.beginPath(); ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1; ctx.moveTo(cx, cy); ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle)); ctx.stroke(); }
    ctx.beginPath();
    vals.forEach((v, i) => { const ratio = (v !== null && v > 0) ? Math.min(v / maxVal, 1) : 0; const angle = (2 * Math.PI * i / n) - Math.PI / 2; const x = cx + r * ratio * Math.cos(angle), y = cy + r * ratio * Math.sin(angle); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.closePath(); ctx.fillStyle = "rgba(13,34,87,0.15)"; ctx.fill(); ctx.strokeStyle = "#0d2257"; ctx.lineWidth = 2; ctx.stroke();
    vals.forEach((v, i) => { const ratio = (v !== null && v > 0) ? Math.min(v / maxVal, 1) : 0; const angle = (2 * Math.PI * i / n) - Math.PI / 2; const x = cx + r * ratio * Math.cos(angle), y = cy + r * ratio * Math.sin(angle); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = "#c9a84c"; ctx.fill(); });
    ctx.fillStyle = "#0d2257"; ctx.font = "600 10px 'Outfit'"; ctx.textAlign = "center";
    for (let i = 0; i < n; i++) { const angle = (2 * Math.PI * i / n) - Math.PI / 2; ctx.fillText(labels[i], cx + (r + 18) * Math.cos(angle), cy + (r + 18) * Math.sin(angle) + 4); }
  }, [dcf, graham, pe, ev]);
  return <div className="radar-wrap"><canvas ref={ref} /></div>;
}

// ─── WATERFALL ────────────────────────────────────────────────────────────────
function WaterfallChart({ totalPV, pvTV, shares }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !totalPV || !pvTV || !shares) return;
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth || 400, H = 200, dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
    const pvOps = totalPV / shares, pvTer = pvTV / shares, total = pvOps + pvTer;
    const pad = { top: 15, right: 20, bottom: 35, left: 55 };
    const chartW = W - pad.left - pad.right, chartH = H - pad.top - pad.bottom;
    const maxV = total * 1.15;
    const bars = [
      { label: "PV Flujos Op.", value: pvOps, color: "#0d2257", start: 0 },
      { label: "PV Terminal", value: pvTer, color: "#c9a84c", start: pvOps },
      { label: "Total", value: total, color: "#1a7a4a", start: 0, isFinal: true },
    ];
    const bW = Math.min(chartW / 4, 60), spacing = chartW / bars.length;
    ctx.fillStyle = "#7a8ab0"; ctx.font = "10px 'Outfit'"; ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = (maxV / 4) * (4 - i), y = pad.top + (chartH / 4) * i;
      ctx.fillText("$" + v.toFixed(0), pad.left - 6, y + 3);
      ctx.beginPath(); ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1; ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    }
    bars.forEach((bar, i) => {
      const x = pad.left + spacing * i + (spacing - bW) / 2;
      const startY = pad.top + chartH - (bar.start + bar.value) / maxV * chartH;
      const barH = (bar.value / maxV) * chartH;
      const grad = ctx.createLinearGradient(0, startY, 0, startY + barH);
      grad.addColorStop(0, bar.color); grad.addColorStop(1, bar.color + "88");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.roundRect(x, startY, bW, barH, [3, 3, 0, 0]); ctx.fill();
      if (!bar.isFinal && i < bars.length - 1) { ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1; ctx.moveTo(x + bW, startY); ctx.lineTo(pad.left + spacing * (i + 1) + (spacing - bW) / 2, startY); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = bar.color; ctx.font = "bold 9px 'Outfit'"; ctx.textAlign = "center"; ctx.fillText("$" + bar.value.toFixed(1), x + bW / 2, startY - 4);
      ctx.fillStyle = "#7a8ab0"; ctx.font = "9px 'Outfit'"; ctx.fillText(bar.label, x + bW / 2, H - 8);
    });
  }, [totalPV, pvTV, shares]);
  return <div className="chart-wrap"><canvas ref={ref} style={{ width: "100%" }} /></div>;
}

// ─── HEATMAP ──────────────────────────────────────────────────────────────────
function SensitivityHeatmap({ fcf, terminalGrowth, shares, currentPrice }) {
  const waccRange = [6, 7, 8, 9, 10, 11, 12];
  const growthRange = [5, 7, 10, 12, 15, 18, 20];
  const cp = p(currentPrice);
  function heatColor(margin) {
    if (margin > 40) return { bg: "#1a7a4a", text: "#fff" };
    if (margin > 20) return { bg: "#2ecc71", text: "#fff" };
    if (margin > 5)  return { bg: "#a8e6c3", text: "#1a3a2a" };
    if (margin > -5) return { bg: "#f9f3e3", text: "#6a5000" };
    if (margin > -20) return { bg: "#f5c6c2", text: "#5a1a1a" };
    return { bg: "#c0392b", text: "#fff" };
  }
  if (!fcf || !shares) return <div className="empty-state">Completa el FCF y las acciones en el método DCF para ver el mapa de sensibilidad.</div>;
  return (
    <div className="heatmap-wrap">
      <table className="heatmap-table">
        <thead><tr><th className="heatmap-axis">WACC% ↓ / Crecim.% →</th>{growthRange.map(g => <th key={g}>{g}%</th>)}</tr></thead>
        <tbody>
          {waccRange.map(wacc => (
            <tr key={wacc}>
              <td className="heatmap-axis">{wacc}%</td>
              {growthRange.map(growth => {
                if (growth >= wacc) {
                  const result = calcDCF({ fcf: p(fcf), growthRate: growth, terminalGrowth: p(terminalGrowth), discountRate: wacc, years: 10, shares: p(shares) });
                  const val = result.value;
                  const margin = val && cp > 0 ? ((val - cp) / val) * 100 : null;
                  const { bg, text } = heatColor(margin);
                  return <td key={growth} style={{ background: bg, color: text }}>{fmt(val)}</td>;
                }
                return <td key={growth} style={{ background: "#f5f7fa", color: "#bbb" }}>—</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.7rem" }}>🟢 Subvalorada &nbsp;🟡 Precio justo &nbsp;🔴 Sobrevalorada</p>
    </div>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ history }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || history.length < 2) return;
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const W = 60, H = 24, dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
    const mn = Math.min(...history), mx = Math.max(...history), range = mx - mn || 1;
    ctx.beginPath(); ctx.strokeStyle = "#1a7a4a"; ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    history.forEach((v, i) => { const x = (i / (history.length - 1)) * W, y = H - ((v - mn) / range) * (H - 2) - 1; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
  }, [history]);
  return <div className="sparkline-wrap"><canvas ref={ref} /></div>;
}

// ─── FMP PANEL ────────────────────────────────────────────────────────────────
const FIELD_LABELS = {
  companyName: "Nombre empresa", currentPrice: "Precio actual", shares: "Acciones (M)",
  fcf: "FCF (M$)", eps: "EPS", ebitda: "EBITDA (M$)", debt: "Deuda (M$)",
  cash: "Efectivo (M$)", bookValue: "Book Value/acción", peTarget: "P/E objetivo",
  evMultiple: "EV/EBITDA múltiplo", growthRate: "Tasa crecimiento%"
};

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
    onDataLoaded({ companyName: "", currentPrice: "", shares: "", fcf: "", eps: "", ebitda: "", debt: "0", cash: "0", bookValue: "", peTarget: "15", evMultiple: "10", growthRate: "10" });
  };

  return (
    <div className="fmp-panel">
      <div className="fmp-panel-title">⚡ Autocompletar con Financial Modeling Prep</div>
      <p className="fmp-panel-sub">Obtén tu API key gratuita en <a href="https://financialmodelingprep.com/developer/docs" target="_blank" rel="noreferrer">financialmodelingprep.com</a>. Plan gratuito: ~250 solicitudes/día.</p>
      <div className="fmp-input-row">
        <div className="field" style={{ flex: 2 }}>
          <label>API Key de FMP</label>
          <input type="password" value={fmpKey} onChange={e => setFmpKey(e.target.value)} placeholder="Tu API key..." autoComplete="off" />
        </div>
        <button className="btn-fetch" onClick={handleFetch} disabled={status === "loading"}>
          {status === "loading" ? <><div className="spinner" /> Cargando...</> : <><span>📡</span> Autocompletar</>}
        </button>
        {hasData && <button className="btn-fetch-clear" onClick={handleClear}>✕ Limpiar</button>}
      </div>
      {status === "loading" && <div className="fmp-status loading"><div className="spinner" /> Consultando FCF, EPS, EBITDA, deuda, precio...</div>}
      {status === "err" && <div className="fmp-status err">⚠ {errMsg}</div>}
      {status === "ok" && (
        <>
          <div className="fmp-status ok">✓ Datos cargados correctamente. Revisa y ajusta si es necesario.</div>
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

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
const SCENARIOS = [
  { key: "conservador", name: "Conservador", growthMult: 0.7, discountAdd: 2, terminalMult: 0.8, peTargetMult: 0.8, evMult: 0.85 },
  { key: "base",        name: "Base",        growthMult: 1,   discountAdd: 0, terminalMult: 1,   peTargetMult: 1,   evMult: 1    },
  { key: "optimista",   name: "Optimista",   growthMult: 1.3, discountAdd: -1.5, terminalMult: 1.2, peTargetMult: 1.2, evMult: 1.15 },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [ticker, setTicker] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [savedValuations, setSavedValuations] = useState([]);
  const [saveError, setSaveError] = useState("");
  const [activeTab, setActiveTab] = useState("metodos");
  const [selectedScenario, setSelectedScenario] = useState("base");
  const [buyMarginTarget, setBuyMarginTarget] = useState(30);
  const [fmpKey, setFmpKey] = useState("");
  const [autofilled, setAutofilled] = useState({});
  const [compareMode, setCompareMode] = useState(false);
  const [comp, setComp] = useState({ ticker: "", name: "", fcf: "", shares: "", growthRate: "10", terminalGrowth: "3", discountRate: "10", eps: "", bookValue: "", peTarget: "15", ebitda: "", evMultiple: "10", debt: "0", cash: "0", currentPrice: "" });

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
  const [wDCF, setWDCF] = useState(35);
  const [wGraham, setWGraham] = useState(25);
  const [wPE, setWPE] = useState(20);
  const [wEV, setWEV] = useState(20);

  useEffect(() => { window.__watchlist = window.__watchlist || []; setSavedValuations(window.__watchlist); }, []);
  const persistWatchlist = (list) => { window.__watchlist = list; setSavedValuations(list); };

  const handleFMPData = useCallback((data) => {
    const track = {};
    if (data.companyName !== undefined) { setCompanyName(data.companyName); track.companyName = true; }
    if (data.currentPrice !== undefined) { setCurrentPrice(data.currentPrice); track.currentPrice = !!data.currentPrice; }
    if (data.shares !== undefined) { setShares(data.shares); track.shares = !!data.shares; }
    if (data.fcf !== undefined) { setFcf(data.fcf); track.fcf = !!data.fcf; }
    if (data.eps !== undefined) { setEps(data.eps); track.eps = !!data.eps; }
    if (data.ebitda !== undefined) { setEbitda(data.ebitda); track.ebitda = !!data.ebitda; }
    if (data.debt !== undefined) { setDebt(data.debt); track.debt = true; }
    if (data.cash !== undefined) { setCash(data.cash); track.cash = true; }
    if (data.bookValue !== undefined) { setBookValue(data.bookValue); track.bookValue = !!data.bookValue; }
    if (data.peTarget !== undefined) { setPeTarget(data.peTarget); track.peTarget = !!data.peTarget; }
    if (data.evMultiple !== undefined) { setEvMultiple(data.evMultiple); track.evMultiple = !!data.evMultiple; }
    if (data.growthRate !== undefined) { setGrowthRate(data.growthRate); track.growthRate = !!data.growthRate; }
    setAutofilled(track);
  }, []);

  // ── CALCS ─────────────────────────────────────────────────────────────────
  const dcfResult = calcDCF({ fcf: p(fcf), growthRate: p(growthRate), terminalGrowth: p(terminalGrowth), discountRate: p(discountRate), years: p(years), shares: p(shares) });
  const dcfVal = dcfResult.value;
  const grahamVal = calcGraham({ eps: p(eps), bookValue: p(bookValue) });
  const peVal = calcPE({ eps: p(eps), peTarget: p(peTarget) });
  const evVal = calcEV({ ebitda: p(ebitda), evMultiple: p(evMultiple), debt: p(debt), cash: p(cash), shares: p(shares) });
  const intrinsic = weightedAvg([[dcfVal, wDCF], [grahamVal, wGraham], [peVal, wPE], [evVal, wEV]]);
  const hasResult = intrinsic !== null;
  const cp = p(currentPrice);
  const marginPct = hasResult && cp > 0 ? ((intrinsic - cp) / intrinsic) * 100 : null;
  const upside = hasResult && cp > 0 ? ((intrinsic / cp - 1) * 100) : null;
  const activeMethods = [[dcfVal], [grahamVal], [peVal], [evVal]].filter(([v]) => v !== null).length;
  const conf = confidenceScore([dcfVal, grahamVal, peVal, evVal]);
  const buyTarget = hasResult ? intrinsic * (1 - buyMarginTarget / 100) : null;

  const scenarioValues = SCENARIOS.map(s => {
    const g = p(growthRate) * s.growthMult, d = Math.max(p(discountRate) + s.discountAdd, 1), tg = p(terminalGrowth) * s.terminalMult;
    const dcf = calcDCF({ fcf: p(fcf), growthRate: g, terminalGrowth: tg, discountRate: d, years: p(years), shares: p(shares) }).value;
    const gr = calcGraham({ eps: p(eps), bookValue: p(bookValue) });
    const pe = calcPE({ eps: p(eps), peTarget: p(peTarget) * s.peTargetMult });
    const ev = calcEV({ ebitda: p(ebitda), evMultiple: p(evMultiple) * s.evMult, debt: p(debt), cash: p(cash), shares: p(shares) });
    const iv = weightedAvg([[dcf, wDCF], [gr, wGraham], [pe, wPE], [ev, wEV]]);
    const m = iv && cp > 0 ? ((iv - cp) / iv) * 100 : null;
    return { ...s, iv, margin: m };
  });

  const compDCF = calcDCF({ fcf: p(comp.fcf), growthRate: p(comp.growthRate), terminalGrowth: p(comp.terminalGrowth), discountRate: p(comp.discountRate), years: 10, shares: p(comp.shares) }).value;
  const compGraham = calcGraham({ eps: p(comp.eps), bookValue: p(comp.bookValue) });
  const compPE = calcPE({ eps: p(comp.eps), peTarget: p(comp.peTarget) });
  const compEV = calcEV({ ebitda: p(comp.ebitda), evMultiple: p(comp.evMultiple), debt: p(comp.debt), cash: p(comp.cash), shares: p(comp.shares) });
  const compIntrinsic = weightedAvg([[compDCF, wDCF], [compGraham, wGraham], [compPE, wPE], [compEV, wEV]]);
  const compCP = p(comp.currentPrice);
  const compMargin = compIntrinsic && compCP > 0 ? ((compIntrinsic - compCP) / compIntrinsic) * 100 : null;

  const getVerdict = (m) => {
    if (m === null) return { label: "Ingresa precio actual para el veredicto", cls: "tag-neutral", icon: "○" };
    if (m > 25) return { label: "Subvalorada — Oportunidad de compra", cls: "tag-buy", icon: "↑" };
    if (m > 0)  return { label: "Precio justo — Mantener posición", cls: "tag-hold", icon: "→" };
    return { label: "Sobrevalorada — Evaluar riesgo", cls: "tag-sell", icon: "↓" };
  };
  const verdict = getVerdict(marginPct);
  const barWidth = marginPct !== null ? Math.min(Math.max(marginPct, 0), 100) : 0;
  const barColor = marginPct > 25 ? "#1a7a4a" : marginPct > 0 ? "#c9a84c" : "#c0392b";

  const handleSaveValuation = () => {
    if (!ticker) { setSaveError("Por favor, ingresa el Ticker de la empresa (ej. AAPL)."); return; }
    if (!hasResult) { setSaveError("Completa al menos un método de valoración para guardar."); return; }
    setSaveError("");
    const existing = window.__watchlist || [];
    const tickerHistory = existing.filter(i => i.ticker === ticker.toUpperCase()).map(i => i.intrinsic);
    const newItem = { id: Date.now(), ticker: ticker.toUpperCase(), companyName: companyName || ticker.toUpperCase(), intrinsic, price: cp, margin: marginPct, history: [...tickerHistory, intrinsic] };
    persistWatchlist([newItem, ...existing]);
  };
  const handleDeleteValuation = (id) => persistWatchlist((window.__watchlist || []).filter(item => item.id !== id));
  const af = (key) => autofilled[key] ? "autofilled" : "";

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>Valor <span>Intrínseco</span></h1>
            <p>Análisis fundamental multi-método con margen de seguridad integrado</p>
          </div>
          <span className="header-badge">Uso Profesional</span>
        </div>

        {/* FMP PANEL */}
        <FMPPanel ticker={ticker} onDataLoaded={handleFMPData} fmpKey={fmpKey} setFmpKey={setFmpKey} />

        {/* EMPRESA + RESUMEN */}
        <div className="grid" style={{ marginBottom: "1.4rem" }}>
          <div className="card">
            <div className="card-accent" style={{ background: "linear-gradient(90deg,var(--navy),var(--navy2))" }} />
            <div className="card-title">🏢 Identificación</div>
            <div className="field">
              <label>Símbolo / Ticker</label>
              <input value={ticker} onChange={e => { setTicker(e.target.value); setSaveError(""); }} placeholder="AAPL" maxLength={6} style={{ textTransform: "uppercase", fontWeight: "bold" }} />
            </div>
            <div className="field">
              <label>Nombre de la Empresa {autofilled.companyName && <span className="autofill-badge">FMP</span>}</label>
              <input className={af("companyName")} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Apple Inc." />
            </div>
            <button onClick={() => setCompareMode(m => !m)} style={{ background: compareMode ? "var(--navy)" : "var(--surface2)", color: compareMode ? "#fff" : "var(--navy)", border: "1.5px solid var(--border)", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s", marginTop: "0.5rem", fontFamily: "Outfit, sans-serif" }}>
              {compareMode ? "✕ Cerrar comparador" : "⇄ Comparar empresas"}
            </button>
          </div>

          {hasResult ? (
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,var(--gold),var(--gold2))" }} />
              <div className="card-title">📊 Resumen Rápido</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                {[
                  ["Valor Intrínseco", fmt(intrinsic), activeMethods + " métodos activos"],
                  ["Margen de Seguridad", pct(marginPct), "vs. precio mercado"],
                  ["Precio de Entrada", fmt(buyTarget), `con ${buyMarginTarget}% margen`],
                  ["Potencial Alcista", pct(upside), "desde precio actual"],
                ].map(([label, val, sub]) => (
                  <div key={label} className="metric-card" style={{ margin: 0 }}>
                    <div className="metric-card-label">{label}</div>
                    <div className="metric-card-value" style={{ fontSize: "1.1rem" }}>{val}</div>
                    <div className="metric-card-sub">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="empty-state"><div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>◈</div>Completa al menos un método de valoración para ver el resumen</div>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="tabs">
          {[["metodos", "Métodos de Valoración"], ["graficas", "Gráficas & Análisis"], ["escenarios", "Escenarios"], ["heatmap", "Mapa de Sensibilidad"]].map(([key, label]) => (
            <button key={key} className={`tab-btn${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        {/* ── TAB: MÉTODOS ── */}
        {activeTab === "metodos" && (
          <div className="grid">
            {/* DCF */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#0d2257,#1a3a8f)" }} />
              <span className="method-tag">Método 01</span>
              <div className="card-title"><span className={`status-dot ${dcfVal ? "active" : "inactive"}`} />Flujo de Caja Descontado (DCF)</div>
              <div className="field">
                <label>FCF — Flujo de Caja Libre (M$) {autofilled.fcf && <span className="autofill-badge">FMP</span>} <Tip text="FCF promedio últimos 3 años." /></label>
                <input className={af("fcf")} value={fcf} onChange={e => setFcf(e.target.value)} placeholder="ej. 5000" type="number" />
              </div>
              <div className="slider-field">
                <label>Tasa de crecimiento anual (%) {autofilled.growthRate && <span className="autofill-badge">FMP</span>}<span>{growthRate}%</span></label>
                <input type="range" min="1" max="30" value={growthRate} onChange={e => setGrowthRate(e.target.value)} />
              </div>
              <div className="slider-field">
                <label>Crecimiento terminal (%)<span>{terminalGrowth}%</span></label>
                <input type="range" min="0.5" max="5" step="0.5" value={terminalGrowth} onChange={e => setTerminalGrowth(e.target.value)} />
              </div>
              <div className="slider-field">
                <label>WACC — Tasa de descuento (%) <Tip text="Weighted Average Cost of Capital." /><span>{discountRate}%</span></label>
                <input type="range" min="5" max="20" value={discountRate} onChange={e => setDiscountRate(e.target.value)} />
              </div>
              <div className="slider-field">
                <label>Años de proyección<span>{years} años</span></label>
                <input type="range" min="5" max="15" value={years} onChange={e => setYears(e.target.value)} />
              </div>
              <div className="field">
                <label>Acciones en circulación (M) {autofilled.shares && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("shares")} value={shares} onChange={e => setShares(e.target.value)} placeholder="ej. 1000" type="number" />
              </div>
              {dcfVal && <div className="success-msg">✓ Valor DCF: <strong>{fmt(dcfVal)}</strong></div>}
            </div>

            {/* GRAHAM + PE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              <div className="card">
                <div className="card-accent" style={{ background: "linear-gradient(90deg,#9a7820,#c9a84c)" }} />
                <span className="method-tag">Método 02</span>
                <div className="card-title"><span className={`status-dot ${grahamVal ? "active" : "inactive"}`} />Graham Number</div>
                <div className="field">
                  <label>EPS — Ganancias por acción ($) {autofilled.eps && <span className="autofill-badge">FMP</span>}</label>
                  <input className={af("eps")} value={eps} onChange={e => setEps(e.target.value)} placeholder="ej. 6.50" type="number" />
                </div>
                <div className="field">
                  <label>Book Value por acción ($) {autofilled.bookValue && <span className="autofill-badge">FMP</span>} <Tip text="Patrimonio neto / Acciones en circulación." /></label>
                  <input className={af("bookValue")} value={bookValue} onChange={e => setBookValue(e.target.value)} placeholder="ej. 20.00" type="number" />
                </div>
                <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Fórmula: √(22.5 × EPS × Book Value)</p>
                {grahamVal && <div className="success-msg" style={{ marginTop: "0.7rem" }}>✓ Valor Graham: <strong>{fmt(grahamVal)}</strong></div>}
              </div>
              <div className="card">
                <div className="card-accent" style={{ background: "linear-gradient(90deg,#1a3a8f,#3b82f6)" }} />
                <span className="method-tag">Método 03</span>
                <div className="card-title"><span className={`status-dot ${peVal ? "active" : "inactive"}`} />Múltiplo P/E</div>
                <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.8rem" }}>EPS — compartido con Graham</p>
                <div className="slider-field">
                  <label>P/E objetivo del sector {autofilled.peTarget && <span className="autofill-badge">FMP</span>}<span>{peTarget}×</span></label>
                  <input type="range" min="5" max="50" value={peTarget} onChange={e => setPeTarget(e.target.value)} />
                </div>
                <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Fórmula: EPS × P/E objetivo</p>
                {peVal && <div className="success-msg" style={{ marginTop: "0.7rem" }}>✓ Valor P/E: <strong>{fmt(peVal)}</strong></div>}
              </div>
            </div>

            {/* EV/EBITDA */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,#5a3a00,#c9a84c)" }} />
              <span className="method-tag">Método 04</span>
              <div className="card-title"><span className={`status-dot ${evVal ? "active" : "inactive"}`} />EV / EBITDA</div>
              <div className="field">
                <label>EBITDA (M$) {autofilled.ebitda && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("ebitda")} value={ebitda} onChange={e => setEbitda(e.target.value)} placeholder="ej. 8000" type="number" />
              </div>
              <div className="slider-field">
                <label>Múltiplo EV/EBITDA {autofilled.evMultiple && <span className="autofill-badge">FMP</span>}<span>{evMultiple}×</span></label>
                <input type="range" min="3" max="40" step="0.5" value={evMultiple} onChange={e => setEvMultiple(e.target.value)} />
              </div>
              <div className="field">
                <label>Deuda total (M$) {autofilled.debt && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("debt")} value={debt} onChange={e => setDebt(e.target.value)} placeholder="ej. 2000" type="number" />
              </div>
              <div className="field">
                <label>Efectivo y equivalentes (M$) {autofilled.cash && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("cash")} value={cash} onChange={e => setCash(e.target.value)} placeholder="ej. 1500" type="number" />
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Acciones en circulación — compartido con DCF</p>
              {evVal && <div className="success-msg" style={{ marginTop: "0.7rem" }}>✓ Valor EV/EBITDA: <strong>{fmt(evVal)}</strong></div>}
            </div>

            {/* PRECIO + PESOS */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,var(--gold),var(--gold2))" }} />
              <div className="card-title">⚖️ Precio & Ponderación</div>
              <div className="field">
                <label>Precio actual de mercado ($) {autofilled.currentPrice && <span className="autofill-badge">FMP</span>}</label>
                <input className={af("currentPrice")} value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} placeholder="ej. 150.00" type="number" />
              </div>
              <hr className="divider" />
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.8rem", fontWeight: 500 }}>Peso de cada método en el resultado final</p>
              <div className="weights-row">
                {[["DCF", wDCF, setWDCF], ["Graham", wGraham, setWGraham], ["P/E", wPE, setWPE], ["EV/EBITDA", wEV, setWEV]].map(([name, val, setter]) => (
                  <div key={name} className="weight-chip">
                    <label>{name}</label>
                    <input type="range" min="0" max="100" value={val} onChange={e => setter(Number(e.target.value))} />
                    <span>{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RESULTADO CONSOLIDADO */}
            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,var(--gold),var(--navy))" }} />
              <div className="card-title">🎯 Resultado Consolidado</div>
              <div className="results-grid">
                {[["DCF", dcfVal, "#0d2257"], ["Graham Number", grahamVal, "#9a7820"], ["Múltiplo P/E", peVal, "#1a3a8f"], ["EV / EBITDA", evVal, "#5a3a00"]].map(([label, val, color]) => (
                  <div key={label} className="result-box">
                    <div className="result-box-label">{label}</div>
                    <div className="result-box-value" style={{ color }}><AnimatedValue value={val} /></div>
                  </div>
                ))}
              </div>
              {hasResult ? (
                <>
                  <div className="buy-target-row">
                    <div>
                      <div className="buy-target-label">Precio máximo de entrada</div>
                      <div className="buy-target-price"><AnimatedValue value={buyTarget} /></div>
                    </div>
                    <div className="buy-target-slider">
                      <label>Margen deseado <span>{buyMarginTarget}%</span></label>
                      <input type="range" min="5" max="60" value={buyMarginTarget} onChange={e => setBuyMarginTarget(Number(e.target.value))} />
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
                        <div style={{ marginTop: "0.8rem" }}>
                          <div className="margin-bar"><div className="margin-bar-fill" style={{ width: barWidth + "%", background: barColor }} /></div>
                          <div className="margin-bar-labels"><span>Margen: {pct(marginPct)}</span><span>Mercado: {fmt(cp)}</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {saveError && <div className="error-msg">⚠ {saveError}</div>}
                  <button className="btn-save" onClick={handleSaveValuation}>+ Guardar valoración de {ticker || "empresa"} en Watchlist</button>
                </>
              ) : (
                <div className="empty-state"><div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>◈</div>Completa al menos un método para ver la valoración consolidada</div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: GRÁFICAS ── */}
        {activeTab === "graficas" && (
          <div className="grid">

            {/* ★ PREMIUM GAUGE — ocupa columna completa arriba ★ */}
            <div className="card-full" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4rem", alignItems: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.6rem", boxShadow: "0 2px 10px rgba(13,34,87,0.06)" }}>
              <PremiumGauge marginPct={marginPct} intrinsic={intrinsic} marketPrice={cp || null} upside={upside} />
              <div>
                <div className="card-title" style={{ marginBottom: "0.8rem" }}>🎚️ Velocímetro de Margen de Seguridad</div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  El velocímetro muestra visualmente qué tan subvalorada o sobrevalorada está la acción según tu valoración ponderada. Mientras más a la derecha apunte la aguja, mayor el margen de seguridad disponible.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  {[
                    ["🔴 Rojo", "Sobrevalorada — Precio sobre el valor"],
                    ["🟠 Naranja", "Levemente cara — Poco margen"],
                    ["🟡 Dorado", "Precio justo — Mantener"],
                    ["🟢 Verde", "Subvalorada — Oportunidad"],
                    ["🩵 Esmeralda", "Fuerte descuento — Compra clara"],
                  ].map(([color, desc]) => (
                    <div key={color} style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", gap: "0.4rem" }}>
                      <span>{color}</span><span>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RADAR */}
            <div className="card">
              <div className="card-title">🔷 Polígono de Valoración</div>
              <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.8rem", textAlign: "center" }}>Radar de Métodos</p>
              <RadarChart dcf={dcfVal} graham={grahamVal} pe={peVal} ev={evVal} />
              <p style={{ fontSize: "0.7rem", color: "var(--muted)", textAlign: "center" }}>Un polígono más regular indica mayor consistencia entre métodos</p>
            </div>

            {/* WATERFALL */}
            <div className="card">
              <div className="card-title">🌊 Cascada DCF</div>
              <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.8rem" }}>Composición del Valor</p>
              {dcfResult.totalPV ? (
                <>
                  <WaterfallChart totalPV={dcfResult.totalPV} pvTV={dcfResult.pvTV} shares={p(shares)} />
                  <div className="waterfall-labels">
                    <span>PV Ops: {fmt(dcfResult.totalPV / p(shares))}</span>
                    <span>PV Terminal: {fmt(dcfResult.pvTV / p(shares))}</span>
                    <span>Total: {fmt(dcfVal)}</span>
                  </div>
                </>
              ) : (
                <div className="empty-state">Completa el método DCF para ver la composición del valor.</div>
              )}
            </div>

            {/* DCF CHART */}
            <div className="card card-full">
              <div className="card-title">📈 Proyección DCF</div>
              <div className="chart-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: "#c9a84c" }} /><span>FCF Proyectado (barras)</span></div>
                <div className="legend-item"><div className="legend-dot" style={{ background: "#0d2257" }} /><span>PV del FCF (línea)</span></div>
              </div>
              {dcfResult.projections.length > 0
                ? <DCFChart projections={dcfResult.projections} />
                : <div className="empty-state">Completa el método DCF para ver la proyección.</div>}
            </div>
          </div>
        )}

        {/* ── TAB: ESCENARIOS ── */}
        {activeTab === "escenarios" && (
          <div className="card card-full" style={{ marginBottom: "1.4rem" }}>
            <div className="card-title">🎭 Análisis de Escenarios</div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1.2rem" }}>Conservador · Base · Optimista</p>
            <div className="scenario-row">
              {scenarioValues.map((s) => (
                <div key={s.key} className={`scenario-card${selectedScenario === s.key ? " selected" : ""}`} onClick={() => setSelectedScenario(s.key)}>
                  <div className="scenario-card-label">{s.key}</div>
                  <div className="scenario-card-name">{s.name}</div>
                  <div className="scenario-card-val" style={{ color: s.iv ? (s.margin > 0 ? "var(--safe)" : "var(--danger)") : "var(--muted)" }}>{fmt(s.iv)}</div>
                  <div className="scenario-card-sub">Margen: {pct(s.margin)}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Los escenarios ajustan automáticamente las tasas de crecimiento, WACC y múltiplos.</p>
            {compareMode && (
              <div style={{ marginTop: "2rem" }}>
                <div className="card-title">⇄ Comparador</div>
                <div className="compare-grid" style={{ marginTop: "1rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.8rem" }}>{ticker || "Empresa A"}</div>
                    {[["Valor Intrínseco", fmt(intrinsic)], ["Precio Mercado", fmt(cp)], ["Margen de Seguridad", pct(marginPct)], ["Potencial Alcista", pct(upside)], ["DCF", fmt(dcfVal)], ["Graham", fmt(grahamVal)], ["P/E", fmt(peVal)], ["EV/EBITDA", fmt(evVal)]].map(([k, v]) => (
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--navy)" }}>Empresa B</span>
                      <input value={comp.ticker} onChange={e => setComp(c => ({ ...c, ticker: e.target.value }))} placeholder="Ticker" style={{ width: "80px", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.2rem 0.4rem", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", fontFamily: "Outfit, sans-serif" }} />
                    </div>
                    {[["FCF (M$)", "fcf"], ["Acciones (M)", "shares"], ["Crecim.%", "growthRate"], ["WACC%", "discountRate"], ["EPS", "eps"], ["Book Val", "bookValue"], ["P/E obj", "peTarget"], ["EBITDA", "ebitda"]].map(([label, key]) => (
                      <div key={key} className="compare-row">
                        <span className="compare-key">{label}</span>
                        <input value={comp[key]} onChange={e => setComp(c => ({ ...c, [key]: e.target.value }))} type="number" placeholder="—" style={{ width: "100px", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.3rem 0.5rem", fontSize: "0.8rem", background: "var(--surface2)", textAlign: "right", fontFamily: "DM Mono, monospace" }} />
                      </div>
                    ))}
                    <hr className="divider" />
                    {[["Valor Intrínseco", fmt(compIntrinsic)], ["Precio Mercado", fmt(compCP)], ["Margen de Seguridad", pct(compMargin)], ["Potencial Alcista", compIntrinsic && compCP > 0 ? pct((compIntrinsic / compCP - 1) * 100) : "—"], ["DCF", fmt(compDCF)], ["Graham", fmt(compGraham)], ["P/E", fmt(compPE)], ["EV/EBITDA", fmt(compEV)]].map(([k, v]) => (
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: HEATMAP ── */}
        {activeTab === "heatmap" && (
          <div className="card card-full">
            <div className="card-title">🗺️ Análisis de Sensibilidad</div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1rem" }}>Mapa de Calor — WACC vs. Tasa de Crecimiento. Cada celda muestra el valor intrínseco DCF.</p>
            <SensitivityHeatmap fcf={fcf} terminalGrowth={terminalGrowth} shares={shares} currentPrice={currentPrice} />
          </div>
        )}

        {/* WATCHLIST */}
        {savedValuations.length > 0 && (
          <div className="watchlist">
            <div className="watchlist-title">📋 Tus Valoraciones Guardadas</div>
            {savedValuations.map((item) => (
              <div key={item.id} className="watch-card">
                <div className="watch-info">
                  <div>
                    <div className="watch-ticker">{item.ticker} {item.history?.length > 1 && <Sparkline history={item.history} />}</div>
                    <div className="watch-name">{item.companyName}</div>
                  </div>
                </div>
                <div className="watch-numbers">
                  <div className="watch-val">{fmt(item.intrinsic)}</div>
                  <div className="watch-price">Precio: {fmt(item.price)} <span style={{ color: item.margin > 0 ? "var(--safe)" : "var(--danger)", marginLeft: "0.3rem", fontWeight: "bold" }}>({pct(item.margin)})</span></div>
                  <span className={`confidence-badge ${item.margin > 25 ? "conf-high" : item.margin > 0 ? "conf-mid" : "conf-low"}`} style={{ fontSize: "0.65rem", marginTop: "0.3rem" }}>
                    {item.margin > 25 ? "COMPRAR" : item.margin > 0 ? "MANTENER" : "CARO"}
                  </span>
                </div>
                <button className="btn-delete" onClick={() => handleDeleteValuation(item.id)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <p className="footnote">
          Datos obtenidos vía Financial Modeling Prep API · Esta herramienta es exclusivamente informativa.<br />
          Los resultados dependen de los supuestos ingresados. No constituye asesoría financiera.
        </p>
      </div>
    </>
  );
}
