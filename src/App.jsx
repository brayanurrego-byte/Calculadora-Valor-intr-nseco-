import { useState, useEffect, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f7fa;
    --surface: #ffffff;
    --surface2: #eef1f6;
    --border: #dce2ee;
    --navy: #0d2257;
    --navy2: #1a3a8f;
    --gold: #c9a84c;
    --gold2: #e8c96a;
    --gold-light: #fdf6e3;
    --text: #0d1b3e;
    --muted: #7a8ab0;
    --danger: #c0392b;
    --safe: #1a7a4a;
    --safe-bg: #eafaf1;
    --danger-bg: #fdf0ee;
    --hold-bg: #fdf6e3;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 1.5rem 4rem;
  }

  .header {
    background: var(--navy);
    margin: 0 -1.5rem 2.5rem;
    padding: 2.2rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-left h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .header-left h1 span { color: var(--gold2); }

  .header-left p {
    color: #8fa3cc;
    font-size: 0.82rem;
    margin-top: 0.4rem;
    font-weight: 300;
  }

  .header-badge {
    background: var(--gold);
    color: var(--navy);
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.35rem 0.9rem;
    border-radius: 3px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.4rem;
  }

  @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.6rem;
    box-shadow: 0 2px 10px rgba(13,34,87,0.06);
    position: relative;
    animation: fadeUp 0.4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card:nth-child(1) { animation-delay: 0.05s; }
  .card:nth-child(2) { animation-delay: 0.10s; }
  .card:nth-child(3) { animation-delay: 0.15s; }
  .card:nth-child(4) { animation-delay: 0.20s; }
  .card:nth-child(5) { animation-delay: 0.25s; }

  .card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 10px 10px 0 0;
  }

  .card-full { grid-column: 1 / -1; }

  .method-tag {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.25rem;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* METHOD STATUS DOT */
  .status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
    transition: background 0.3s;
  }
  .status-dot.active { background: var(--safe); box-shadow: 0 0 0 3px rgba(26,122,74,0.15); }
  .status-dot.inactive { background: var(--border); }

  .field { margin-bottom: 0.9rem; position: relative; }

  .field label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--muted);
    margin-bottom: 0.3rem;
  }

  .field input {
    width: 100%;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.8rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
    color: var(--text);
    background: var(--surface2);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field input:focus {
    border-color: var(--navy2);
    box-shadow: 0 0 0 3px rgba(26,58,143,0.1);
    background: #fff;
  }

  .field input[readonly] { opacity: 0.5; background: var(--surface2); cursor: not-allowed; }

  /* TOOLTIP */
  .tooltip-wrap { position: relative; display: inline-flex; }
  .tooltip-icon {
    width: 15px; height: 15px;
    border-radius: 50%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    font-weight: 700;
    flex-shrink: 0;
  }
  .tooltip-box {
    display: none;
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--navy);
    color: #c8d8f0;
    font-size: 0.7rem;
    font-weight: 400;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    width: 200px;
    line-height: 1.5;
    z-index: 100;
    pointer-events: none;
    white-space: normal;
  }
  .tooltip-box::after {
    content: '';
    position: absolute;
    top: 100%; left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--navy);
  }
  .tooltip-wrap:hover .tooltip-box { display: block; }

  /* SLIDER FIELD */
  .slider-field { margin-bottom: 0.9rem; }
  .slider-field label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--muted);
    margin-bottom: 0.4rem;
  }
  .slider-field label span {
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--navy);
  }
  .slider-field input[type=range] {
    width: 100%;
    accent-color: var(--navy2);
    cursor: pointer;
    height: 4px;
  }

  .weights-row {
    display: flex;
    gap: 1.2rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .weight-chip { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
  .weight-chip label { font-size: 0.65rem; font-weight: 600; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .weight-chip input[type=range] { width: 90px; accent-color: var(--navy2); cursor: pointer; }
  .weight-chip span { font-size: 0.78rem; font-weight: 600; color: var(--navy2); }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 720px) { .results-grid { grid-template-columns: repeat(2,1fr); } }

  .result-box {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.1rem;
    background: var(--surface2);
    transition: transform 0.2s;
  }
  .result-box:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13,34,87,0.08); }

  .result-box-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .result-box-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.45rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    transition: all 0.4s;
  }

  .verdict-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 1.5rem 1.8rem;
  }

  .verdict-label-sm {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
  }

  .verdict-price {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 800;
    color: var(--navy);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    transition: all 0.4s;
  }

  .verdict-meta { flex: 1; min-width: 200px; }

  .verdict-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 1rem;
    border-radius: 5px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 0.6rem;
  }

  .tag-buy { background: var(--safe-bg); color: var(--safe); border: 1.5px solid var(--safe); }
  .tag-sell { background: var(--danger-bg); color: var(--danger); border: 1.5px solid var(--danger); }
  .tag-hold { background: var(--hold-bg); color: #8a6800; border: 1.5px solid var(--gold); }
  .tag-neutral { background: var(--surface2); color: var(--muted); border: 1.5px solid var(--border); }

  /* GAUGE */
  .gauge-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5rem 0 1rem;
  }
  .gauge-label {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .gauge-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 800;
    margin-top: 0.3rem;
    transition: color 0.4s;
  }
  .gauge-sub {
    font-size: 0.7rem;
    color: var(--muted);
  }

  .margin-bar {
    width: 100%;
    height: 8px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.4rem;
  }

  .margin-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
  }

  .margin-bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--muted);
    font-weight: 500;
  }

  /* ANIMATED NUMBER */
  @keyframes numberPop {
    0%   { transform: scale(1.15); opacity: 0.6; }
    100% { transform: scale(1);    opacity: 1; }
  }
  .number-animate { animation: numberPop 0.35s ease; }

  .chart-wrap { width: 100%; overflow-x: auto; margin-top: 0.5rem; }
  canvas { display: block; max-width: 100%; }

  .chart-legend {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--muted);
  }

  .legend-dot { width: 10px; height: 10px; border-radius: 50%; }

  .empty-state {
    text-align: center;
    padding: 2.5rem 1rem;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .divider { border: none; border-top: 1px solid var(--border); margin: 1.2rem 0; }

  .footnote {
    text-align: center;
    font-size: 0.68rem;
    color: var(--muted);
    margin-top: 2.5rem;
    line-height: 1.8;
  }

  .metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.4rem;
  }

  @media (max-width: 720px) { .metrics-row { grid-template-columns: 1fr 1fr; } }

  .metric-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.2rem;
    border-left: 4px solid var(--gold);
    box-shadow: 0 2px 8px rgba(13,34,87,0.05);
    animation: fadeUp 0.4s ease both;
  }

  .metric-card-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
  }

  .metric-card-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--navy);
    font-variant-numeric: tabular-nums;
  }

  .metric-card-sub {
    font-size: 0.7rem;
    color: var(--muted);
    margin-top: 0.15rem;
  }

  .company-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .company-logo {
    width: 60px; height: 60px;
    border-radius: 12px;
    object-fit: contain;
    background: var(--surface2);
    border: 1px solid var(--border);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }

  /* TABS */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--border);
    padding-bottom: 0;
  }
  .tab-btn {
    background: none;
    border: none;
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: color 0.2s, border-color 0.2s;
    border-radius: 4px 4px 0 0;
  }
  .tab-btn.active {
    color: var(--navy);
    border-bottom-color: var(--gold);
  }
  .tab-btn:hover:not(.active) { color: var(--navy2); background: var(--surface2); }

  /* SCENARIOS */
  .scenario-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.2rem;
  }
  @media (max-width: 600px) { .scenario-row { grid-template-columns: 1fr; } }

  .scenario-card {
    border: 1.5px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  .scenario-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13,34,87,0.1); }
  .scenario-card.selected { border-color: var(--navy2); background: #f0f4ff; }
  .scenario-card-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    color: var(--muted);
  }
  .scenario-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.4rem;
  }
  .scenario-card-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .scenario-card-sub { font-size: 0.68rem; color: var(--muted); margin-top: 0.2rem; }

  /* BUY PRICE TARGET */
  .buy-target-row {
    background: var(--gold-light);
    border: 1.5px solid var(--gold);
    border-radius: 8px;
    padding: 1rem 1.4rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .buy-target-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.2rem;
  }
  .buy-target-price {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--navy);
    font-variant-numeric: tabular-nums;
  }
  .buy-target-slider { flex: 1; min-width: 200px; }
  .buy-target-slider label {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  .buy-target-slider input[type=range] { width: 100%; accent-color: var(--navy); }

  /* CONFIDENCE SCORE */
  .confidence-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.9rem;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    border: 1.5px solid;
  }
  .conf-high { background: var(--safe-bg); color: var(--safe); border-color: var(--safe); }
  .conf-mid  { background: var(--hold-bg); color: #8a6800; border-color: var(--gold); }
  .conf-low  { background: var(--surface2); color: var(--muted); border-color: var(--border); }

  /* SAVE / WATCHLIST */
  .btn-save {
    background: var(--navy);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: background 0.2s, transform 0.1s;
    width: 100%;
    font-size: 0.9rem;
  }
  .btn-save:hover { background: var(--navy2); transform: translateY(-1px); }
  .btn-save:active { transform: translateY(0); }

  /* INLINE ERROR */
  .error-msg {
    background: var(--danger-bg);
    color: var(--danger);
    border: 1px solid var(--danger);
    border-radius: 6px;
    padding: 0.5rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 500;
    margin-top: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .watchlist { margin-top: 3rem; }
  .watchlist-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--navy);
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--border);
    padding-bottom: 0.5rem;
  }

  .watch-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .watch-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13,34,87,0.08); }

  .watch-info { display: flex; align-items: center; gap: 1rem; }
  .watch-ticker { font-weight: 800; color: var(--navy); font-size: 1.1rem; }
  .watch-name { color: var(--muted); font-size: 0.8rem; }
  .watch-numbers { text-align: right; }
  .watch-val { font-weight: 700; color: var(--safe); font-size: 1.1rem; font-variant-numeric: tabular-nums; }
  .watch-price { color: var(--muted); font-size: 0.8rem; font-variant-numeric: tabular-nums; }

  .btn-delete {
    background: var(--danger-bg);
    color: var(--danger);
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: bold;
    margin-left: 1rem;
    transition: background 0.2s;
  }
  .btn-delete:hover { background: #f9d6d2; }

  /* HEATMAP */
  .heatmap-wrap { overflow-x: auto; margin-top: 0.5rem; }
  .heatmap-table { border-collapse: collapse; font-size: 0.7rem; width: 100%; }
  .heatmap-table th {
    padding: 0.3rem 0.5rem;
    color: var(--muted);
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }
  .heatmap-table td {
    padding: 0.35rem 0.5rem;
    text-align: center;
    border-radius: 4px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: 0.68rem;
    min-width: 56px;
    transition: opacity 0.2s;
  }
  .heatmap-table td:hover { opacity: 0.8; outline: 2px solid var(--navy2); }
  .heatmap-axis { color: var(--navy); font-weight: 700 !important; background: var(--surface2); }

  /* RADAR */
  .radar-wrap { display: flex; justify-content: center; margin: 0.5rem 0 1rem; }

  /* COMPARE */
  .compare-section { margin-top: 2rem; }
  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.4rem;
  }
  @media (max-width: 720px) { .compare-grid { grid-template-columns: 1fr; } }
  .compare-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.8rem;
  }
  .compare-row:last-child { border-bottom: none; }
  .compare-key { color: var(--muted); font-weight: 500; }
  .compare-val { font-weight: 700; color: var(--navy); font-variant-numeric: tabular-nums; }

  /* WATERFALL */
  .waterfall-labels {
    display: flex;
    justify-content: space-around;
    margin-top: 0.3rem;
    font-size: 0.65rem;
    color: var(--muted);
    font-weight: 500;
  }

  /* SPARKLINE */
  .sparkline-wrap { display: inline-block; vertical-align: middle; margin-left: 0.5rem; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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
  const terminalCF = cf * (1 + tg);
  const tv = terminalCF / (r - tg);
  const pvTV = tv / Math.pow(1 + r, years);
  return { value: (pv + pvTV) / shares, projections, pvTV, totalPV: pv };
}

const calcGraham = ({ eps, bookValue }) =>
  eps > 0 && bookValue > 0 ? Math.sqrt(22.5 * eps * bookValue) : null;

const calcPE = ({ eps, peTarget }) =>
  eps && peTarget ? eps * peTarget : null;

const calcEV = ({ ebitda, evMultiple, debt, cash, shares }) =>
  ebitda && evMultiple && shares
    ? (ebitda * evMultiple - (debt || 0) + (cash || 0)) / shares
    : null;

function weightedAvg(pairs) {
  let sum = 0, wsum = 0;
  pairs.forEach(([v, w]) => { if (v !== null && v > 0 && w > 0) { sum += v * w; wsum += w; } });
  return wsum > 0 ? sum / wsum : null;
}

const fmt = (n) => (n === null || isNaN(n)) ? "—" : "$" + n.toFixed(2);
const pct = (n) => { if (n === null) return "—"; const v = Math.round(n); return (v > 0 ? "+" : "") + v + "%"; };
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
  useEffect(() => {
    if (prevRef.current !== value) { setKey(k => k + 1); prevRef.current = value; }
  }, [value]);
  return <span key={key} className="number-animate">{format(value)}</span>;
}

// ─── DCF CHART ────────────────────────────────────────────────────────────────
function DCFChart({ projections }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !projections || projections.length === 0) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 700;
    const H = 260;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 20, right: 20, bottom: 40, left: 65 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const n = projections.length;
    const maxFCF = Math.max(...projections.map(d => d.fcf));
    const maxVal = maxFCF * 1.15;
    const xScale = (i) => pad.left + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
    const yScale = (v) => pad.top + chartH - (v / maxVal) * chartH;

    ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    }

    const barW = Math.min(chartW / n * 0.45, 32);
    projections.forEach((d, i) => {
      const x = xScale(i);
      const bH = (d.fcf / maxVal) * chartH;
      const bY = pad.top + chartH - bH;
      const grad = ctx.createLinearGradient(0, bY, 0, pad.top + chartH);
      grad.addColorStop(0, "rgba(201,168,76,0.85)"); grad.addColorStop(1, "rgba(201,168,76,0.2)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(x - barW / 2, bY, barW, bH, [3, 3, 0, 0]); ctx.fill();
    });

    if (n > 1) {
      ctx.beginPath(); ctx.strokeStyle = "#0d2257"; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
      projections.forEach((d, i) => {
        const x = xScale(i), y = yScale(d.pvFCF);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    projections.forEach((d, i) => {
      const x = xScale(i), y = yScale(d.pvFCF);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#0d2257"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.fill();
    });

    ctx.fillStyle = "#7a8ab0"; ctx.font = "500 11px Inter, sans-serif"; ctx.textAlign = "center";
    projections.forEach((d, i) => { if (n <= 6 || i % 2 === 0) ctx.fillText(`Y${d.year}`, xScale(i), H - 10); });

    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = (maxVal / 4) * (4 - i);
      const y = pad.top + (chartH / 4) * i;
      ctx.fillText(v >= 1000 ? (v / 1000).toFixed(1) + "B" : v.toFixed(0) + "M", pad.left - 8, y + 4);
    }
  }, [projections]);

  return <canvas ref={ref} style={{ width: "100%" }} />;
}

// ─── RADAR CHART ──────────────────────────────────────────────────────────────
function RadarChart({ dcf, graham, pe, ev }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 240, H = 220;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const vals = [dcf, graham, pe, ev];
    const labels = ["DCF", "Graham", "P/E", "EV/EBITDA"];
    const active = vals.filter(v => v !== null && v > 0);
    if (active.length < 2) {
      ctx.fillStyle = "#7a8ab0"; ctx.font = "12px Inter"; ctx.textAlign = "center";
      ctx.fillText("Completa al menos 2 métodos", W / 2, H / 2); return;
    }
    const maxVal = Math.max(...active) * 1.2;
    const cx = W / 2, cy = H / 2 + 10, r = 80;
    const n = 4;

    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath(); ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i / n) - Math.PI / 2;
        const x = cx + (r * ring / 4) * Math.cos(angle);
        const y = cy + (r * ring / 4) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke();
    }

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      ctx.beginPath(); ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.stroke();
    }

    ctx.beginPath();
    vals.forEach((v, i) => {
      const ratio = (v !== null && v > 0) ? Math.min(v / maxVal, 1) : 0;
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(13,34,87,0.15)"; ctx.fill();
    ctx.strokeStyle = "#0d2257"; ctx.lineWidth = 2; ctx.stroke();

    vals.forEach((v, i) => {
      const ratio = (v !== null && v > 0) ? Math.min(v / maxVal, 1) : 0;
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#c9a84c"; ctx.fill();
    });

    ctx.fillStyle = "#0d2257"; ctx.font = "600 10px Inter"; ctx.textAlign = "center";
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const lx = cx + (r + 18) * Math.cos(angle);
      const ly = cy + (r + 18) * Math.sin(angle);
      ctx.fillText(labels[i], lx, ly + 4);
    }
  }, [dcf, graham, pe, ev]);

  return <div className="radar-wrap"><canvas ref={ref} /></div>;
}

// ─── GAUGE ────────────────────────────────────────────────────────────────────
function Gauge({ marginPct }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 220, H = 130;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H - 10, r = 90;
    const startAngle = Math.PI, endAngle = 2 * Math.PI;

    const zones = [
      { from: 0, to: 0.33, color: "#e8504a" },
      { from: 0.33, to: 0.6, color: "#c9a84c" },
      { from: 0.6, to: 1, color: "#1a7a4a" },
    ];
    zones.forEach(z => {
      const sa = startAngle + z.from * Math.PI;
      const ea = startAngle + z.to * Math.PI;
      ctx.beginPath(); ctx.arc(cx, cy, r, sa, ea);
      ctx.arc(cx, cy, r - 18, ea, sa, true);
      ctx.closePath(); ctx.fillStyle = z.color; ctx.fill();
    });

    ctx.beginPath(); ctx.arc(cx, cy, r - 18, startAngle, endAngle);
    ctx.arc(cx, cy, r - 19, endAngle, startAngle, true);
    ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill();

    const clamped = Math.max(-50, Math.min(100, marginPct ?? -50));
    const norm = (clamped + 50) / 150;
    const needleAngle = Math.PI + norm * Math.PI;
    const nx = cx + (r - 8) * Math.cos(needleAngle);
    const ny = cy + (r - 8) * Math.sin(needleAngle);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
    ctx.strokeStyle = "#0d2257"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#0d2257"; ctx.fill();

    ctx.fillStyle = "#7a8ab0"; ctx.font = "500 9px Inter"; ctx.textAlign = "left";
    ctx.fillText("Sobre-\nval.", cx - r + 2, cy - 4);
    ctx.textAlign = "right";
    ctx.fillText("Sub-\nval.", cx + r - 2, cy - 4);
  }, [marginPct]);

  return <canvas ref={ref} />;
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

  if (!fcf || !shares) return (
    <div className="empty-state">Completa el FCF y las acciones en el método DCF para ver el mapa de sensibilidad.</div>
  );

  return (
    <div className="heatmap-wrap">
      <table className="heatmap-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingRight: "0.5rem" }}>
              Crecim.% →<br />WACC% ↓
            </th>
            {growthRange.map(g => <th key={g}>{g}%</th>)}
          </tr>
        </thead>
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
                  return (
                    <td key={growth} style={{ background: bg, color: text }} title={`Valor: ${fmt(val)} | Margen: ${pct(margin)}`}>
                      {fmt(val)}
                    </td>
                  );
                }
                return <td key={growth} style={{ background: "#f5f7fa", color: "#ccc" }}>—</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "0.5rem" }}>
        🟢 Subvalorada &nbsp; 🟡 Precio justo &nbsp; 🔴 Sobrevalorada. Hover sobre celda para detalles.
      </div>
    </div>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ history }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || history.length < 2) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const W = 60, H = 24;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    const mn = Math.min(...history), mx = Math.max(...history);
    const range = mx - mn || 1;
    const xS = (i) => (i / (history.length - 1)) * W;
    const yS = (v) => H - ((v - mn) / range) * (H - 2) - 1;
    ctx.beginPath(); ctx.strokeStyle = "#1a7a4a"; ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    history.forEach((v, i) => i === 0 ? ctx.moveTo(xS(i), yS(v)) : ctx.lineTo(xS(i), yS(v)));
    ctx.stroke();
  }, [history]);
  return <span className="sparkline-wrap"><canvas ref={ref} /></span>;
}

// ─── WATERFALL CHART ─────────────────────────────────────────────────────────
function WaterfallChart({ totalPV, pvTV, shares }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !totalPV || !pvTV || !shares) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth || 400;
    const H = 200;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pvOps = totalPV / shares;
    const pvTer = pvTV / shares;
    const total = pvOps + pvTer;

    const pad = { top: 15, right: 20, bottom: 35, left: 55 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const maxV = total * 1.15;

    const bars = [
      { label: "PV Flujos Op.", value: pvOps, color: "#0d2257", start: 0 },
      { label: "PV Terminal", value: pvTer, color: "#c9a84c", start: pvOps },
      { label: "Total", value: total, color: "#1a7a4a", start: 0, isFinal: true },
    ];

    const bW = Math.min(chartW / 4, 60);
    const spacing = chartW / bars.length;

    ctx.fillStyle = "#7a8ab0"; ctx.font = "10px Inter"; ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = (maxV / 4) * (4 - i);
      const y = pad.top + (chartH / 4) * i;
      ctx.fillText("$" + v.toFixed(0), pad.left - 6, y + 3);
      ctx.beginPath(); ctx.strokeStyle = "#dce2ee"; ctx.lineWidth = 1;
      ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    }

    bars.forEach((bar, i) => {
      const x = pad.left + spacing * i + (spacing - bW) / 2;
      const startY = pad.top + chartH - (bar.start + bar.value) / maxV * chartH;
      const barH = (bar.value / maxV) * chartH;
      const grad = ctx.createLinearGradient(0, startY, 0, startY + barH);
      grad.addColorStop(0, bar.color);
      grad.addColorStop(1, bar.color + "88");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(x, startY, bW, barH, [3, 3, 0, 0]); ctx.fill();

      if (!bar.isFinal && i < bars.length - 1) {
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
        ctx.moveTo(x + bW, startY); ctx.lineTo(pad.left + spacing * (i + 1) + (spacing - bW) / 2, startY);
        ctx.stroke(); ctx.setLineDash([]);
      }

      ctx.fillStyle = bar.color; ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
      ctx.fillText("$" + (bar.value).toFixed(1), x + bW / 2, startY - 4);
      ctx.fillStyle = "#7a8ab0"; ctx.font = "9px Inter";
      ctx.fillText(bar.label, x + bW / 2, H - 8);
    });
  }, [totalPV, pvTV, shares]);

  return <canvas ref={ref} style={{ width: "100%" }} />;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const SCENARIOS = [
  { key: "conservador", name: "Conservador", growthMult: 0.7, discountAdd: 2, terminalMult: 0.8, peTargetMult: 0.8, evMult: 0.85 },
  { key: "base",        name: "Base",        growthMult: 1,   discountAdd: 0, terminalMult: 1,   peTargetMult: 1,   evMult: 1 },
  { key: "optimista",   name: "Optimista",   growthMult: 1.3, discountAdd: -1.5, terminalMult: 1.2, peTargetMult: 1.2, evMult: 1.15 },
];

export default function App() {
  const [ticker, setTicker] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [savedValuations, setSavedValuations] = useState([]);
  const [saveError, setSaveError] = useState("");
  const [activeTab, setActiveTab] = useState("metodos");
  const [selectedScenario, setSelectedScenario] = useState("base");
  const [buyMarginTarget, setBuyMarginTarget] = useState(30);

  // Compare
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

  // Persistent state using in-memory storage (no localStorage)
  useEffect(() => {
    window.__watchlist = window.__watchlist || [];
    setSavedValuations(window.__watchlist);
  }, []);

  const persistWatchlist = (list) => {
    window.__watchlist = list;
    setSavedValuations(list);
  };

  // ─── CALCS ──────────────────────────────────────────────────────────────────
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

  // BUY PRICE TARGET
  const buyTarget = hasResult ? intrinsic * (1 - buyMarginTarget / 100) : null;

  // SCENARIOS
  const scenarioValues = SCENARIOS.map(s => {
    const g = p(growthRate) * s.growthMult;
    const d = Math.max(p(discountRate) + s.discountAdd, 1);
    const tg = p(terminalGrowth) * s.terminalMult;
    const dcf = calcDCF({ fcf: p(fcf), growthRate: g, terminalGrowth: tg, discountRate: d, years: p(years), shares: p(shares) }).value;
    const gr = calcGraham({ eps: p(eps), bookValue: p(bookValue) });
    const pe = calcPE({ eps: p(eps), peTarget: p(peTarget) * s.peTargetMult });
    const ev = calcEV({ ebitda: p(ebitda), evMultiple: p(evMultiple) * s.evMult, debt: p(debt), cash: p(cash), shares: p(shares) });
    const iv = weightedAvg([[dcf, wDCF], [gr, wGraham], [pe, wPE], [ev, wEV]]);
    const m = iv && cp > 0 ? ((iv - cp) / iv) * 100 : null;
    return { ...s, iv, margin: m };
  });

  // COMPARE
  const compDCF = calcDCF({ fcf: p(comp.fcf), growthRate: p(comp.growthRate), terminalGrowth: p(comp.terminalGrowth), discountRate: p(comp.discountRate), years: 10, shares: p(comp.shares) }).value;
  const compGraham = calcGraham({ eps: p(comp.eps), bookValue: p(comp.bookValue) });
  const compPE = calcPE({ eps: p(comp.eps), peTarget: p(comp.peTarget) });
  const compEV = calcEV({ ebitda: p(comp.ebitda), evMultiple: p(comp.evMultiple), debt: p(comp.debt), cash: p(comp.cash), shares: p(comp.shares) });
  const compIntrinsic = weightedAvg([[compDCF, wDCF], [compGraham, wGraham], [compPE, wPE], [compEV, wEV]]);
  const compCP = p(comp.currentPrice);
  const compMargin = compIntrinsic && compCP > 0 ? ((compIntrinsic - compCP) / compIntrinsic) * 100 : null;

  const getVerdict = (m) => {
    if (m === null) return { label: "Ingresa precio actual para el veredicto", cls: "tag-neutral", icon: "○" };
    if (m > 25)    return { label: "Subvalorada — Oportunidad de compra", cls: "tag-buy", icon: "↑" };
    if (m > 0)     return { label: "Precio justo — Mantener posición", cls: "tag-hold", icon: "→" };
    return { label: "Sobrevalorada — Evaluar riesgo", cls: "tag-sell", icon: "↓" };
  };

  const verdict = getVerdict(marginPct);
  const barColor = marginPct > 25 ? "#1a7a4a" : marginPct > 0 ? "#c9a84c" : "#c0392b";
  const barWidth = marginPct !== null ? Math.min(Math.max(marginPct, 0), 100) : 0;

  const handleSaveValuation = () => {
    if (!ticker) { setSaveError("Por favor, ingresa el Ticker de la empresa (ej. AAPL)."); return; }
    if (!hasResult) { setSaveError("Completa al menos un método de valoración para guardar."); return; }
    setSaveError("");
    const existing = window.__watchlist || [];
    const tickerHistory = existing.filter(i => i.ticker === ticker.toUpperCase()).map(i => i.intrinsic);
    const newItem = {
      id: Date.now(), ticker: ticker.toUpperCase(), companyName: companyName || ticker.toUpperCase(),
      intrinsic, price: cp, margin: marginPct, history: [...tickerHistory, intrinsic]
    };
    persistWatchlist([newItem, ...existing]);
  };

  const handleDeleteValuation = (id) => {
    persistWatchlist((window.__watchlist || []).filter(item => item.id !== id));
  };

  const logoUrl = ticker
    ? `https://ui-avatars.com/api/?name=${ticker}&background=0D2257&color=fff&font-size=0.4&rounded=true&bold=true`
    : `https://ui-avatars.com/api/?name=?&background=eef1f6&color=7a8ab0&rounded=true`;

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <h1>Calculadora de <span>Valor Intrínseco</span></h1>
            <p>Análisis fundamental multi-método con margen de seguridad integrado</p>
          </div>
          <span className="header-badge">Uso Profesional</span>
        </header>

        {/* EMPRESA */}
        <div className="card card-full" style={{ marginBottom: "1.5rem" }}>
          <div className="company-header">
            <img src={logoUrl} alt="Logo" className="company-logo" />
            <div style={{ flex: 1, display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div className="field" style={{ flex: 1, minWidth: "150px", margin: 0 }}>
                <label>Símbolo / Ticker <Tip text="Código bursátil de la empresa, ej. AAPL para Apple, MSFT para Microsoft." /></label>
                <input value={ticker} onChange={e => { setTicker(e.target.value); setSaveError(""); }} placeholder="AAPL" maxLength={6} style={{ textTransform: "uppercase", fontWeight: "bold" }} />
              </div>
              <div className="field" style={{ flex: 2, minWidth: "200px", margin: 0 }}>
                <label>Nombre de la Empresa</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Apple Inc." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexShrink: 0 }}>
                <button
                  onClick={() => setCompareMode(m => !m)}
                  style={{ background: compareMode ? "var(--navy)" : "var(--surface2)", color: compareMode ? "#fff" : "var(--navy)", border: "1.5px solid var(--border)", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s" }}
                >
                  {compareMode ? "✕ Cerrar comparador" : "⇄ Comparar empresas"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS */}
        {hasResult && (
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-card-label">Valor Intrínseco Ponderado</div>
              <div className="metric-card-value"><AnimatedValue value={intrinsic} /></div>
              <div className="metric-card-sub">{activeMethods} método{activeMethods !== 1 ? "s" : ""} activo{activeMethods !== 1 ? "s" : ""} · <span className={`confidence-badge ${conf.cls}`} style={{ fontSize: "0.62rem", padding: "0.1rem 0.5rem" }}>{conf.label}</span></div>
            </div>
            <div className="metric-card" style={{ borderLeftColor: marginPct > 25 ? "#1a7a4a" : marginPct > 0 ? "#c9a84c" : "#c0392b" }}>
              <div className="metric-card-label">Margen de Seguridad</div>
              <div className="metric-card-value" style={{ color: marginPct > 0 ? "#1a7a4a" : "#c0392b" }}>
                <AnimatedValue value={marginPct} format={pct} />
              </div>
              <div className="metric-card-sub">vs. precio de mercado</div>
            </div>
            <div className="metric-card" style={{ borderLeftColor: upside > 0 ? "#1a3a8f" : "#c0392b" }}>
              <div className="metric-card-label">Potencial Alcista</div>
              <div className="metric-card-value" style={{ color: upside > 0 ? "#1a3a8f" : "#c0392b" }}>
                <AnimatedValue value={upside} format={pct} />
              </div>
              <div className="metric-card-sub">desde el precio actual</div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="tabs">
          {[["metodos", "Métodos de Valoración"], ["graficas", "Gráficas & Análisis"], ["escenarios", "Escenarios"], ["heatmap", "Mapa de Sensibilidad"]].map(([key, label]) => (
            <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        {/* ── TAB: MÉTODOS ── */}
        {activeTab === "metodos" && (
          <div className="grid">
            {/* METHOD 1: DCF */}
            <div className="card">
              <div className="card-accent" style={{ background: "var(--navy)" }} />
              <div className="method-tag">Método 01</div>
              <div className="card-title">
                <span className={`status-dot ${dcfVal ? "active" : "inactive"}`} />
                Flujo de Caja Descontado (DCF)
              </div>
              <div className="field">
                <label>FCF — Flujo de Caja Libre (M$) <Tip text="El dinero que genera la empresa después de gastos operativos e inversiones. Se encuentra en el estado de flujo de caja." /></label>
                <input value={fcf} onChange={e => setFcf(e.target.value)} placeholder="ej. 5000" type="number" />
              </div>
              <div className="slider-field">
                <label>Tasa de crecimiento anual (%) <span>{growthRate}%</span></label>
                <input type="range" min="0" max="40" step="0.5" value={growthRate} onChange={e => setGrowthRate(e.target.value)} />
              </div>
              <div className="slider-field">
                <label>Crecimiento terminal (%) <Tip text="Tasa a la que crecerá la empresa a perpetuidad. Suele ser 2-4%, similar al crecimiento del PIB." /> <span>{terminalGrowth}%</span></label>
                <input type="range" min="0" max="8" step="0.25" value={terminalGrowth} onChange={e => setTerminalGrowth(e.target.value)} />
              </div>
              <div className="slider-field">
                <label>WACC — Tasa de descuento (%) <Tip text="Costo promedio ponderado del capital. Refleja el riesgo de la empresa. Típicamente entre 8-12%." /> <span>{discountRate}%</span></label>
                <input type="range" min="1" max="25" step="0.5" value={discountRate} onChange={e => setDiscountRate(e.target.value)} />
              </div>
              <div className="slider-field">
                <label>Años de proyección <span>{years} años</span></label>
                <input type="range" min="3" max="20" step="1" value={years} onChange={e => setYears(e.target.value)} />
              </div>
              <div className="field">
                <label>Acciones en circulación (M) <Tip text="Número total de acciones emitidas por la empresa, en millones. Disponible en la sección de datos financieros básicos." /></label>
                <input value={shares} onChange={e => setShares(e.target.value)} placeholder="ej. 1000" type="number" />
              </div>
              {dcfVal && <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.8rem", background: "var(--surface2)", borderRadius: "6px", fontSize: "0.75rem", color: "var(--navy)", fontWeight: 600 }}>
                Valor DCF: <AnimatedValue value={dcfVal} />
              </div>}
            </div>

            {/* METHOD 2 + 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              <div className="card">
                <div className="card-accent" style={{ background: "var(--gold)" }} />
                <div className="method-tag">Método 02</div>
                <div className="card-title">
                  <span className={`status-dot ${grahamVal ? "active" : "inactive"}`} />
                  Graham Number
                </div>
                <div className="field">
                  <label>EPS — Ganancias por acción ($) <Tip text="Beneficio neto dividido entre las acciones en circulación. En el estado de resultados." /></label>
                  <input value={eps} onChange={e => setEps(e.target.value)} placeholder="ej. 6.50" type="number" />
                </div>
                <div className="field">
                  <label>Book Value por acción ($) <Tip text="Activos menos pasivos dividido entre acciones. Representa el valor contable real de la empresa." /></label>
                  <input value={bookValue} onChange={e => setBookValue(e.target.value)} placeholder="ej. 20.00" type="number" />
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                  Fórmula: √(22.5 × EPS × Book Value)
                </div>
                {grahamVal && <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.8rem", background: "var(--gold-light)", borderRadius: "6px", fontSize: "0.75rem", color: "var(--navy)", fontWeight: 600 }}>
                  Valor Graham: <AnimatedValue value={grahamVal} />
                </div>}
              </div>

              <div className="card">
                <div className="card-accent" style={{ background: "var(--navy2)" }} />
                <div className="method-tag">Método 03</div>
                <div className="card-title">
                  <span className={`status-dot ${peVal ? "active" : "inactive"}`} />
                  Múltiplo P/E
                </div>
                <div className="field">
                  <label>EPS — (compartido con Graham)</label>
                  <input value={eps} readOnly />
                </div>
                <div className="slider-field">
                  <label>P/E objetivo del sector <Tip text="Ratio precio/ganancias histórico del sector. Para tecnología suele ser 20-30, para utilidades 12-18." /> <span>{peTarget}×</span></label>
                  <input type="range" min="5" max="60" step="0.5" value={peTarget} onChange={e => setPeTarget(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>Fórmula: EPS × P/E objetivo</div>
                {peVal && <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.8rem", background: "#f0f4ff", borderRadius: "6px", fontSize: "0.75rem", color: "var(--navy)", fontWeight: 600 }}>
                  Valor P/E: <AnimatedValue value={peVal} />
                </div>}
              </div>
            </div>

            {/* METHOD 4 */}
            <div className="card">
              <div className="card-accent" style={{ background: "linear-gradient(90deg, var(--navy), var(--gold))" }} />
              <div className="method-tag">Método 04</div>
              <div className="card-title">
                <span className={`status-dot ${evVal ? "active" : "inactive"}`} />
                EV / EBITDA
              </div>
              <div className="field">
                <label>EBITDA (M$) <Tip text="Ganancias antes de intereses, impuestos, depreciación y amortización. Mide la rentabilidad operativa pura." /></label>
                <input value={ebitda} onChange={e => setEbitda(e.target.value)} placeholder="ej. 8000" type="number" />
              </div>
              <div className="slider-field">
                <label>Múltiplo EV/EBITDA del sector <Tip text="Múltiplo al que cotizan empresas comparables. Tecnología: 15-25x, Industria: 8-12x, Utilities: 6-10x." /> <span>{evMultiple}×</span></label>
                <input type="range" min="3" max="40" step="0.5" value={evMultiple} onChange={e => setEvMultiple(e.target.value)} />
              </div>
              <div className="field">
                <label>Deuda total (M$) <Tip text="Suma de deuda a corto y largo plazo. En el balance general." /></label>
                <input value={debt} onChange={e => setDebt(e.target.value)} placeholder="ej. 2000" type="number" />
              </div>
              <div className="field">
                <label>Efectivo y equivalentes (M$) <Tip text="Dinero disponible en caja e inversiones de corto plazo. En el balance general." /></label>
                <input value={cash} onChange={e => setCash(e.target.value)} placeholder="ej. 1500" type="number" />
              </div>
              <div className="field">
                <label>Acciones en circulación (M) — compartido</label>
                <input value={shares} readOnly />
              </div>
              {evVal && <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.8rem", background: "#fdf6e3", borderRadius: "6px", fontSize: "0.75rem", color: "var(--navy)", fontWeight: 600 }}>
                Valor EV/EBITDA: <AnimatedValue value={evVal} />
              </div>}
            </div>

            {/* PRICE + WEIGHTS */}
            <div className="card">
              <div className="card-accent" style={{ background: "var(--gold)" }} />
              <div className="method-tag">Comparación de Mercado</div>
              <div className="card-title">Precio Actual & Ponderación</div>
              <div className="field">
                <label>Precio actual de mercado ($) <Tip text="Precio al que cotiza actualmente la acción en bolsa." /></label>
                <input value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} placeholder="ej. 150.00" type="number" />
              </div>
              <hr className="divider" />
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Peso de cada método en el resultado final
              </div>
              <div className="weights-row">
                {[["DCF", wDCF, setWDCF], ["Graham", wGraham, setWGraham], ["P/E", wPE, setWPE], ["EV/EBITDA", wEV, setWEV]].map(([name, val, setter]) => (
                  <div className="weight-chip" key={name}>
                    <label>{name}</label>
                    <input type="range" min="0" max="100" value={val} onChange={e => setter(Number(e.target.value))} />
                    <span>{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RESULT */}
            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg, var(--navy), var(--navy2), var(--gold))" }} />
              <div className="method-tag">Resultado Consolidado</div>
              <div className="card-title">Valoración Multi-Método</div>

              <div className="results-grid">
                {[["DCF", dcfVal, "#0d2257"], ["Graham Number", grahamVal, "#9a7820"], ["Múltiplo P/E", peVal, "#1a3a8f"], ["EV / EBITDA", evVal, "#5a3a00"]].map(([label, val, color]) => (
                  <div className="result-box" key={label}>
                    <div className="result-box-label">{label}</div>
                    <div className="result-box-value" style={{ color }}><AnimatedValue value={val} /></div>
                  </div>
                ))}
              </div>

              {hasResult ? (
                <>
                  {/* BUY TARGET */}
                  <div className="buy-target-row">
                    <div>
                      <div className="buy-target-label">Precio máximo de entrada</div>
                      <div className="buy-target-price"><AnimatedValue value={buyTarget} /></div>
                      <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.2rem" }}>con {buyMarginTarget}% margen de seguridad</div>
                    </div>
                    <div className="buy-target-slider">
                      <label>Margen deseado <span style={{ fontWeight: 700, color: "var(--navy)" }}>{buyMarginTarget}%</span></label>
                      <input type="range" min="5" max="60" value={buyMarginTarget} onChange={e => setBuyMarginTarget(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="verdict-row">
                    <div>
                      <div className="verdict-label-sm">Valor Intrínseco Ponderado</div>
                      <div className="verdict-price"><AnimatedValue value={intrinsic} /></div>
                    </div>
                    <div className="verdict-meta">
                      <div className={`verdict-tag ${verdict.cls}`}>
                        <span>{verdict.icon}</span>{verdict.label}
                      </div>
                      <div style={{ marginBottom: "0.4rem" }}>
                        <span className={`confidence-badge ${conf.cls}`}>{conf.label}</span>
                      </div>
                      {cp > 0 && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <div className="margin-bar">
                            <div className="margin-bar-fill" style={{ width: `${barWidth}%`, background: barColor }} />
                          </div>
                          <div className="margin-bar-labels">
                            <span>Margen de seguridad: <b style={{ color: barColor }}>{pct(marginPct)}</b></span>
                            <span>Precio mercado: <b>{fmt(cp)}</b></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {saveError && <div className="error-msg">⚠ {saveError}</div>}
                  <button className="btn-save" onClick={handleSaveValuation}>
                    + Guardar valoración de {ticker || "empresa"} en Watchlist
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>◈</div>
                  Completa al menos un método para ver la valoración consolidada
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: GRÁFICAS ── */}
        {activeTab === "graficas" && (
          <div className="grid">
            <div className="card card-full">
              <div className="card-accent" style={{ background: "var(--navy)" }} />
              <div className="method-tag">Velocímetro</div>
              <div className="card-title">Gauge de Margen de Seguridad</div>
              <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Gauge marginPct={marginPct} />
                <div className="gauge-value" style={{ color: marginPct > 25 ? "#1a7a4a" : marginPct > 0 ? "#c9a84c" : "#c0392b" }}>
                  {marginPct !== null ? pct(marginPct) : "—"}
                </div>
                <div className="gauge-sub">Margen de seguridad actual</div>
              </div>
            </div>

            <div className="card">
              <div className="card-accent" style={{ background: "var(--gold)" }} />
              <div className="method-tag">Polígono de Valoración</div>
              <div className="card-title">Radar de Métodos</div>
              <RadarChart dcf={dcfVal} graham={grahamVal} pe={peVal} ev={evVal} />
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center" }}>
                Un polígono más regular indica mayor consistencia entre métodos
              </div>
            </div>

            <div className="card">
              <div className="card-accent" style={{ background: "var(--navy2)" }} />
              <div className="method-tag">Cascada DCF</div>
              <div className="card-title">Waterfall — Composición del Valor</div>
              {dcfResult.totalPV ? (
                <>
                  <div className="chart-wrap">
                    <WaterfallChart totalPV={dcfResult.totalPV} pvTV={dcfResult.pvTV} shares={p(shares)} />
                  </div>
                  <div className="waterfall-labels">
                    <span>PV Ops: <b>{fmt(dcfResult.totalPV / p(shares))}</b></span>
                    <span>PV Terminal: <b>{fmt(dcfResult.pvTV / p(shares))}</b></span>
                    <span>Total: <b>{fmt(dcfVal)}</b></span>
                  </div>
                </>
              ) : (
                <div className="empty-state">Completa el método DCF para ver la composición del valor.</div>
              )}
            </div>

            <div className="card card-full">
              <div className="card-accent" style={{ background: "linear-gradient(90deg,var(--navy),var(--gold))" }} />
              <div className="method-tag">Proyección DCF</div>
              <div className="card-title">Flujos de Caja Proyectados</div>
              <div className="chart-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: "var(--gold)" }} /><span>FCF Proyectado (barras)</span></div>
                <div className="legend-item"><div className="legend-dot" style={{ background: "var(--navy)" }} /><span>PV del FCF (línea)</span></div>
              </div>
              <div className="chart-wrap">
                {dcfResult.projections.length > 0
                  ? <DCFChart projections={dcfResult.projections} />
                  : <div className="empty-state">Completa el método DCF para ver la proyección.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ESCENARIOS ── */}
        {activeTab === "escenarios" && (
          <div>
            <div className="card card-full" style={{ marginBottom: "1.4rem" }}>
              <div className="card-accent" style={{ background: "var(--gold)" }} />
              <div className="method-tag">Análisis de Escenarios</div>
              <div className="card-title">Conservador · Base · Optimista</div>
              <div className="scenario-row">
                {scenarioValues.map((s) => (
                  <div key={s.key} className={`scenario-card ${selectedScenario === s.key ? "selected" : ""}`} onClick={() => setSelectedScenario(s.key)}>
                    <div className="scenario-card-label">{s.key}</div>
                    <div className="scenario-card-name">{s.name}</div>
                    <div className="scenario-card-val" style={{ color: s.iv ? (s.margin > 0 ? "var(--safe)" : "var(--danger)") : "var(--muted)" }}>
                      {fmt(s.iv)}
                    </div>
                    <div className="scenario-card-sub">Margen: <b>{pct(s.margin)}</b></div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                Los escenarios ajustan automáticamente las tasas de crecimiento, WACC y múltiplos. Haz clic en un escenario para seleccionarlo.
              </div>
            </div>

            {compareMode && (
              <div className="card card-full" style={{ marginBottom: "1.4rem" }}>
                <div className="card-accent" style={{ background: "linear-gradient(90deg, var(--navy), var(--gold))" }} />
                <div className="method-tag">Comparador</div>
                <div className="card-title">Comparación lado a lado</div>
                <div className="compare-grid">
                  {/* Col A */}
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.8rem", fontSize: "0.9rem" }}>{ticker || "Empresa A"}</div>
                    {[["Valor Intrínseco", fmt(intrinsic)], ["Precio Mercado", fmt(cp)], ["Margen de Seguridad", pct(marginPct)], ["Potencial Alcista", pct(upside)], ["DCF", fmt(dcfVal)], ["Graham", fmt(grahamVal)], ["P/E", fmt(peVal)], ["EV/EBITDA", fmt(evVal)]].map(([k, v]) => (
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                  {/* Col B */}
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.8rem", fontSize: "0.9rem" }}>Empresa B — <input value={comp.ticker} onChange={e => setComp(c => ({ ...c, ticker: e.target.value }))} placeholder="Ticker" style={{ width: "80px", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.2rem 0.4rem", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.8rem" }}>
                      {[["FCF (M$)", "fcf"], ["Acciones (M)", "shares"], ["Crecim.%", "growthRate"], ["WACC%", "discountRate"], ["EPS", "eps"], ["Book Val", "bookValue"], ["P/E obj", "peTarget"], ["EBITDA", "ebitda"]].map(([label, key]) => (
                        <div key={key} style={{ fontSize: "0.72rem" }}>
                          <label style={{ color: "var(--muted)", display: "block", marginBottom: "0.2rem" }}>{label}</label>
                          <input value={comp[key]} onChange={e => setComp(c => ({ ...c, [key]: e.target.value }))} type="number" placeholder="—" style={{ width: "100%", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.3rem 0.5rem", fontSize: "0.8rem", background: "var(--surface2)" }} />
                        </div>
                      ))}
                    </div>
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
            <div className="card-accent" style={{ background: "linear-gradient(90deg, var(--navy), var(--navy2), var(--gold))" }} />
            <div className="method-tag">Análisis de Sensibilidad</div>
            <div className="card-title">Mapa de Calor — WACC vs. Tasa de Crecimiento</div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1rem" }}>
              Cada celda muestra el valor intrínseco DCF bajo diferentes combinaciones de WACC y crecimiento. El color indica el margen de seguridad respecto al precio actual ingresado.
            </p>
            <SensitivityHeatmap fcf={fcf} terminalGrowth={terminalGrowth} shares={shares} currentPrice={currentPrice} />
          </div>
        )}

        {/* WATCHLIST */}
        {savedValuations.length > 0 && (
          <div className="watchlist">
            <h2 className="watchlist-title">Tus Valoraciones Guardadas (Watchlist)</h2>
            {savedValuations.map((item) => (
              <div className="watch-card" key={item.id}>
                <div className="watch-info">
                  <img src={`https://ui-avatars.com/api/?name=${item.ticker}&background=0D2257&color=fff&rounded=true&bold=true`} alt="logo" style={{ width: "45px", height: "45px", borderRadius: "50%" }} />
                  <div>
                    <div className="watch-ticker">
                      {item.ticker}
                      {item.history && item.history.length > 1 && <Sparkline history={item.history} />}
                    </div>
                    <div className="watch-name">{item.companyName}</div>
                  </div>
                </div>
                <div className="watch-numbers">
                  <div className="watch-val">Valor: {fmt(item.intrinsic)}</div>
                  <div className="watch-price">
                    Precio: {fmt(item.price)}
                    <span style={{ color: item.margin > 0 ? "var(--safe)" : "var(--danger)", marginLeft: "0.5rem", fontWeight: "bold" }}>
                      ({pct(item.margin)})
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className={`confidence-badge ${item.margin > 25 ? "conf-high" : item.margin > 0 ? "conf-mid" : "conf-low"}`} style={{ fontSize: "0.65rem" }}>
                    {item.margin > 25 ? "COMPRAR" : item.margin > 0 ? "MANTENER" : "CARO"}
                  </span>
                  <button className="btn-delete" onClick={() => handleDeleteValuation(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="footnote">
          Esta herramienta es exclusivamente informativa. Los resultados dependen de los supuestos ingresados.<br />
          No constituye asesoría financiera. Realiza siempre tu propio análisis antes de tomar decisiones de inversión.
        </p>
      </div>
    </>
  );
}
