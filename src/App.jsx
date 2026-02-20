import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1 · DESIGN SYSTEM & STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Base */
  --bg:        #F4F2EE;
  --bg2:       #ECEAE4;
  --surface:   #FFFFFF;
  --surface2:  #F8F6F2;
  --surface3:  #EEE9E0;
  --border:    #D8D3C8;
  --border2:   #C8C2B4;

  /* Brand navy / ink */
  --ink:       #0E1420;
  --ink2:      #1C2438;
  --ink3:      #2A3650;
  --ink-light: #7A849A;
  --ink-faint: #B8BDC8;

  /* Gold accent */
  --gold:      #B8922A;
  --gold2:     #D4AA3C;
  --gold3:     #F0CC60;
  --gold-bg:   #FBF5E6;

  /* Signal colors */
  --buy:       #1A6B4A;
  --buy-bg:    #EAF5F0;
  --buy-border:#4CAF80;
  --sell:      #A82020;
  --sell-bg:   #F9ECEC;
  --sell-border:#D45050;
  --hold:      #7A5A10;
  --hold-bg:   #FBF5E0;
  --hold-border:#C9A030;
  --caution:   #8A5000;
  --caution-bg:#FFF3E0;

  /* Chart palette */
  --c1: #0E3A6E;
  --c2: #B8922A;
  --c3: #1A6B4A;
  --c4: #7C2E8A;
  --c5: #A82020;
  --c6: #2A6E8A;

  --shadow-sm:  0 1px 4px rgba(14,20,32,0.06);
  --shadow:     0 4px 16px rgba(14,20,32,0.08);
  --shadow-lg:  0 12px 40px rgba(14,20,32,0.14);
  --shadow-xl:  0 24px 64px rgba(14,20,32,0.18);

  --radius-sm:  4px;
  --radius:     8px;
  --radius-lg:  14px;
  --radius-xl:  20px;
  --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
}

[data-theme="dark"] {
  --bg:        #090D16;
  --bg2:       #0E1420;
  --surface:   #121924;
  --surface2:  #18223A;
  --surface3:  #1E2D4A;
  --border:    #2A3650;
  --border2:   #3A4A68;
  --ink:       #E8EEFF;
  --ink2:      #C0CCEE;
  --ink3:      #8A98BE;
  --ink-light: #6A7898;
  --ink-faint: #3A4668;
  --gold:      #E0C050;
  --gold2:     #D4AA3C;
  --gold3:     #F0CC60;
  --gold-bg:   #1E1800;
  --buy:       #2ECC8A;
  --buy-bg:    #0A2018;
  --buy-border:#1A6B4A;
  --sell:      #E05050;
  --sell-bg:   #200A0A;
  --sell-border:#A82020;
  --hold:      #D4A820;
  --hold-bg:   #1E1400;
  --hold-border:#8A6800;
  --caution:   #E0A030;
  --caution-bg:#1A1000;
  --shadow-sm:  0 1px 4px rgba(0,0,0,0.4);
  --shadow:     0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg:  0 12px 40px rgba(0,0,0,0.6);
  --shadow-xl:  0 24px 64px rgba(0,0,0,0.7);
}

html { scroll-behavior: smooth; font-size: 16px; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Syne', sans-serif;
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
  -webkit-font-smoothing: antialiased;
}

/* ─── LAYOUT ─── */
.app { max-width: 1360px; margin: 0 auto; padding: 0 2rem 6rem; }

/* ─── MASTHEAD ─── */
.masthead {
  background: var(--ink);
  margin: 0 -2rem 3rem;
  padding: 0;
  position: relative;
  overflow: hidden;
}
.masthead-rule {
  height: 3px;
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold3) 50%, transparent 100%);
}
.masthead-inner {
  padding: 2rem 3rem 1.8rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}
.masthead::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 40px,
      rgba(255,255,255,0.012) 40px,
      rgba(255,255,255,0.012) 41px
    );
  pointer-events: none;
}
.masthead-eyebrow {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold2);
  margin-bottom: 0.35rem;
}
.masthead-title {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.05;
}
.masthead-title em {
  font-style: italic;
  color: var(--gold3);
}
.masthead-subtitle {
  color: rgba(255,255,255,0.42);
  font-size: 0.76rem;
  margin-top: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1.8;
}
.masthead-controls {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}
.badge-edition {
  background: linear-gradient(135deg, var(--gold), var(--gold3));
  color: var(--ink);
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.3rem 0.8rem;
  border-radius: 2px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.btn-ghost {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.7);
  padding: 0.42rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.03em;
}
.btn-ghost:hover { background: rgba(255,255,255,0.14); color: #fff; }

/* ─── KPI BAR ─── */
.kpi-bar {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow);
}
@media (max-width: 900px) { .kpi-bar { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 560px) { .kpi-bar { grid-template-columns: repeat(2, 1fr); } }
.kpi-cell {
  padding: 1.1rem 1.3rem;
  border-right: 1px solid var(--border);
  position: relative;
  cursor: default;
  transition: background var(--transition);
}
.kpi-cell:last-child { border-right: none; }
.kpi-cell:hover { background: var(--surface2); }
.kpi-cell::after {
  content: '';
  position: absolute;
  bottom: 0; left: 1.3rem; right: 1.3rem;
  height: 2px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.kpi-cell:hover::after { transform: scaleX(1); }
.kpi-label {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-light);
  margin-bottom: 0.3rem;
}
.kpi-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.18rem;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.kpi-sub {
  font-size: 0.63rem;
  color: var(--ink-light);
  margin-top: 0.2rem;
  font-weight: 500;
}
.kpi-trend { font-size: 0.68rem; font-weight: 700; margin-left: 0.3rem; }
.kpi-trend.up { color: var(--buy); }
.kpi-trend.down { color: var(--sell); }

/* ─── GRID SYSTEM ─── */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.2rem; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.col-full { grid-column: 1 / -1; }
.col-2-3 { grid-column: span 2; }
@media (max-width: 860px) { .grid-2 { grid-template-columns: 1fr; } .grid-3 { grid-template-columns: 1fr; } .grid-4 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .grid-4 { grid-template-columns: 1fr; } }

/* ─── CARDS ─── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.8rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: box-shadow var(--transition), border-color var(--transition);
  animation: cardIn 0.4s ease both;
}
.card:hover { box-shadow: var(--shadow); }
.card-edge {
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}
.card-top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card:nth-child(1) { animation-delay: 0.04s }
.card:nth-child(2) { animation-delay: 0.08s }
.card:nth-child(3) { animation-delay: 0.12s }
.card:nth-child(4) { animation-delay: 0.16s }
.card:nth-child(5) { animation-delay: 0.20s }
.card:nth-child(6) { animation-delay: 0.24s }

/* ─── TYPOGRAPHY ─── */
.eyebrow {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-light);
  margin-bottom: 0.2rem;
}
.card-heading {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.2;
}
.section-heading {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.method-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 0.18rem 0.55rem;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-light);
  margin-bottom: 0.4rem;
}
.signal-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s;
}
.signal-dot.active {
  background: var(--buy);
  box-shadow: 0 0 0 3px rgba(26,107,74,0.18);
  animation: dotPulse 2s ease infinite;
}
.signal-dot.inactive { background: var(--border); }
@keyframes dotPulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(26,107,74,0.18); }
  50%      { box-shadow: 0 0 0 6px rgba(26,107,74,0.06); }
}

/* ─── FORMS ─── */
.field { margin-bottom: 1rem; position: relative; }
.field label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-light);
  margin-bottom: 0.32rem;
}
.field input, .field select, .field textarea {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.58rem 0.85rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.88rem;
  color: var(--ink);
  background: var(--surface2);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  font-variant-numeric: tabular-nums;
}
.field input:focus, .field select:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(184,146,42,0.12);
  background: var(--surface);
}
.field input[readonly] { opacity: 0.38; cursor: not-allowed; pointer-events: none; }
.field input.auto { border-color: var(--c1); background: rgba(14,58,110,0.05); }
[data-theme="dark"] .field input.auto { background: rgba(14,58,110,0.15); }
.field select { cursor: pointer; }
.field-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
.field-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; }
@media (max-width: 560px) { .field-2, .field-3 { grid-template-columns: 1fr; } }

/* ─── SLIDER ─── */
.slider-row { margin-bottom: 0.9rem; }
.slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-light);
  margin-bottom: 0.45rem;
}
.slider-val {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gold);
  background: var(--gold-bg);
  padding: 0.1rem 0.55rem;
  border-radius: 3px;
  border: 1px solid rgba(184,146,42,0.25);
}
input[type=range] {
  width: 100%;
  height: 4px;
  cursor: pointer;
  accent-color: var(--gold);
  border-radius: 2px;
}

/* ─── WEIGHT CHIPS ─── */
.weights-grid {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
}
.weight-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.7rem 0.8rem;
  flex: 1;
  min-width: 68px;
  transition: border-color var(--transition);
}
.weight-chip:has(input:focus-within) { border-color: var(--gold); }
.weight-chip-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-light); }
.weight-chip input[type=range] { width: 100%; }
.weight-chip-val { font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; font-weight: 600; color: var(--gold); }

/* ─── RESULT BOXES ─── */
.method-results {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.7rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 700px) { .method-results { grid-template-columns: repeat(3, 1fr); } }
.mbox {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  transition: all var(--transition);
  cursor: default;
}
.mbox:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: var(--shadow); }
.mbox-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.5rem; }
.mbox-value {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.38rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
  transition: all 0.4s;
}
.mbox-delta { font-size: 0.65rem; margin-top: 0.25rem; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }

/* ─── VERDICT ─── */
.verdict-panel {
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.8rem 2.2rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex-wrap: wrap;
}
.verdict-number {
  font-family: 'Libre Baskerville', serif;
  font-size: 3.4rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.verdict-meta { flex: 1; min-width: 220px; }
.verdict-eyebrow { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.5rem; }
.verdict-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 1.1rem;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-width: 1.5px;
  border-style: solid;
  margin-bottom: 0.8rem;
}
.verdict-tag.buy  { background: var(--buy-bg);  color: var(--buy);  border-color: var(--buy-border); }
.verdict-tag.sell { background: var(--sell-bg); color: var(--sell); border-color: var(--sell-border); }
.verdict-tag.hold { background: var(--hold-bg); color: var(--hold); border-color: var(--hold-border); }
.verdict-tag.neutral { background: var(--surface3); color: var(--ink-light); border-color: var(--border); }

/* ─── MARGIN BAR ─── */
.margin-track {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin: 0.8rem 0 0.35rem;
}
.margin-fill { height: 100%; border-radius: 4px; transition: width 0.7s cubic-bezier(0.4,0,0.2,1); }
.margin-labels { display: flex; justify-content: space-between; font-size: 0.67rem; color: var(--ink-light); font-weight: 600; font-family: 'IBM Plex Mono', monospace; }

/* ─── CONFIDENCE ─── */
.confidence-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.85rem;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  border: 1.5px solid;
  letter-spacing: 0.04em;
}
.conf-high { background: var(--buy-bg);  color: var(--buy);  border-color: var(--buy-border); }
.conf-mid  { background: var(--hold-bg); color: var(--hold); border-color: var(--hold-border); }
.conf-low  { background: var(--surface3); color: var(--ink-light); border-color: var(--border); }

/* ─── ALERTS ─── */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.65rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.73rem;
  font-weight: 600;
  border-width: 1px;
  border-style: solid;
  margin-top: 0.7rem;
  line-height: 1.55;
}
.alert-icon { flex-shrink: 0; }
.alert.err     { background: var(--sell-bg);    color: var(--sell);    border-color: var(--sell-border); }
.alert.success { background: var(--buy-bg);     color: var(--buy);     border-color: var(--buy-border); }
.alert.warn    { background: var(--caution-bg); color: var(--caution); border-color: rgba(138,80,0,0.35); }
.alert.info    { background: rgba(14,58,110,0.06); color: #1C4A8A; border-color: rgba(14,58,110,0.2); }
[data-theme="dark"] .alert.info { color: #60A5FA; background: rgba(14,58,110,0.2); }

/* ─── BUTTONS ─── */
.btn-primary {
  background: var(--ink);
  color: #FFFFFF;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  font-size: 0.84rem;
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.04em;
  transition: all var(--transition);
  box-shadow: 0 2px 8px rgba(14,20,32,0.2);
}
.btn-primary:hover { background: var(--ink2); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(14,20,32,0.3); }
.btn-primary:active { transform: translateY(0); }
.btn-primary.wide { width: 100%; margin-top: 1rem; }
.btn-secondary {
  background: var(--surface2);
  color: var(--ink);
  border: 1.5px solid var(--border);
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.76rem;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.04em;
  transition: all var(--transition);
}
.btn-secondary:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-bg); }
.btn-gold {
  background: linear-gradient(135deg, var(--gold), var(--gold3));
  color: var(--ink);
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 800;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.05em;
  transition: all var(--transition);
  box-shadow: 0 2px 10px rgba(184,146,42,0.3);
}
.btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(184,146,42,0.45); }
.btn-fetch {
  background: var(--c1);
  color: white;
  border: none;
  padding: 0.56rem 1.3rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  font-family: 'Syne', sans-serif;
  transition: all var(--transition);
  height: 40px;
}
.btn-fetch:hover:not(:disabled) { background: #0A2A52; transform: translateY(-1px); }
.btn-fetch:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-danger { background: var(--sell-bg); color: var(--sell); border: 1px solid var(--sell-border); padding: 0.38rem 0.8rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.72rem; font-weight: 700; font-family: 'Syne', sans-serif; transition: all var(--transition); }
.btn-danger:hover { background: #F5D0D0; }

/* ─── TABS ─── */
.tab-rail {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.3rem;
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
}
.tab-btn {
  background: none;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--ink-light);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  white-space: nowrap;
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.tab-btn.active {
  background: var(--ink);
  color: #FFFFFF;
  box-shadow: var(--shadow-sm);
}
.tab-btn:hover:not(.active) { background: var(--surface2); color: var(--ink); }

/* ─── TOOLTIPS ─── */
.tip-wrap { position: relative; display: inline-flex; }
.tip-icon {
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--surface3);
  border: 1px solid var(--border);
  color: var(--ink-light);
  font-size: 0.55rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  font-weight: 800;
  flex-shrink: 0;
}
.tip-box {
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: rgba(232,238,255,0.88);
  font-size: 0.68rem;
  font-weight: 400;
  padding: 0.6rem 0.9rem;
  border-radius: var(--radius);
  width: 220px;
  line-height: 1.6;
  z-index: 500;
  pointer-events: none;
  box-shadow: var(--shadow-lg);
  font-family: 'Syne', sans-serif;
}
.tip-box::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: var(--ink); }
.tip-wrap:hover .tip-box { display: block; }

/* ─── FMP PANEL ─── */
.fmp-panel {
  background: linear-gradient(135deg, rgba(14,58,110,0.05), rgba(14,58,110,0.02));
  border: 1.5px solid rgba(14,58,110,0.2);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.8rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}
.fmp-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--c1), var(--c4), var(--c6));
}
.fmp-title { font-family: 'Libre Baskerville', serif; font-size: 0.95rem; font-weight: 700; color: var(--c1); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
[data-theme="dark"] .fmp-title { color: #60A5FA; }
.fmp-sub { font-size: 0.7rem; color: var(--ink-light); margin-bottom: 1.1rem; line-height: 1.65; }
.fmp-sub a { color: var(--c1); font-weight: 600; text-decoration: none; }
.fmp-sub a:hover { text-decoration: underline; }
.fmp-input-row { display: flex; gap: 0.7rem; align-items: flex-end; flex-wrap: wrap; }
.fmp-input-row .field { flex: 1; min-width: 200px; margin-bottom: 0; }
.fmp-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.8rem; }
.fmp-chip {
  border-radius: 3px;
  font-size: 0.58rem;
  font-weight: 700;
  padding: 0.18rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.fmp-chip.ok { background: var(--buy-bg); color: var(--buy); border: 1px solid var(--buy-border); }
.fmp-chip.miss { background: var(--surface2); color: var(--ink-light); border: 1px solid var(--border); }
.auto-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  background: rgba(14,58,110,0.1);
  color: #1C4A8A;
  border: 1px solid rgba(14,58,110,0.25);
  border-radius: 2px;
  font-size: 0.52rem;
  font-weight: 800;
  padding: 0.08rem 0.35rem;
  margin-left: 0.25rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
[data-theme="dark"] .auto-badge { color: #60A5FA; background: rgba(14,58,110,0.25); }

/* ─── GAUGE ─── */
.gauge-card {
  background: linear-gradient(165deg, #0A1020, #0E1830, #12203A);
  border: 1px solid rgba(184,146,42,0.25);
  border-radius: var(--radius-xl);
  padding: 2rem 2.2rem 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
}
.gauge-card::before {
  content: '';
  position: absolute;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  width: 400px; height: 160px;
  background: radial-gradient(ellipse, rgba(184,146,42,0.06), transparent 70%);
  pointer-events: none;
}
.gauge-eyebrow { font-size: 0.55rem; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(184,146,42,0.65); margin-bottom: 0.2rem; }
.gauge-heading { font-family: 'Libre Baskerville', serif; font-size: 0.92rem; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 1.1rem; font-style: italic; }
.gauge-canvas-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.gauge-center { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); text-align: center; pointer-events: none; white-space: nowrap; }
.gauge-pct { font-family: 'Libre Baskerville', serif; font-size: 2.6rem; font-weight: 700; line-height: 1; letter-spacing: -0.03em; transition: color 0.5s; }
.gauge-pct-label { font-size: 0.55rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 0.1rem; }
.gauge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  padding: 0.42rem 1.4rem;
  border-radius: 50px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1.5px solid;
  transition: all 0.5s;
  font-family: 'Syne', sans-serif;
}
.gauge-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.6rem;
  margin-top: 1.1rem;
  width: 100%;
}
.gauge-metric-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius);
  padding: 0.6rem 0.8rem;
  text-align: center;
}
.gauge-metric-label { font-size: 0.5rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(170,190,230,0.65); margin-bottom: 0.22rem; }
.gauge-metric-val { font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; font-weight: 500; color: rgba(255,255,255,0.9); }

/* ─── HEATMAP ─── */
.heatmap-wrap { overflow-x: auto; border-radius: var(--radius); }
.heatmap-table { border-collapse: separate; border-spacing: 3px; font-size: 0.66rem; width: 100%; }
.heatmap-table th { padding: 0.38rem 0.55rem; color: var(--ink-light); font-weight: 700; text-align: center; white-space: nowrap; font-size: 0.6rem; letter-spacing: 0.08em; }
.heatmap-table td { padding: 0.44rem 0.55rem; text-align: center; border-radius: 4px; font-variant-numeric: tabular-nums; font-weight: 700; font-size: 0.66rem; min-width: 60px; transition: all var(--transition); cursor: pointer; font-family: 'IBM Plex Mono', monospace; }
.heatmap-table td:hover { transform: scale(1.1); box-shadow: var(--shadow); z-index: 10; position: relative; }
.hm-axis { color: var(--ink) !important; font-weight: 800 !important; background: var(--surface2) !important; cursor: default !important; }
.hm-axis:hover { transform: none !important; }

/* ─── SCENARIOS ─── */
.scenario-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.2rem; }
@media (max-width: 560px) { .scenario-grid { grid-template-columns: 1fr; } }
.scenario-card {
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.3rem;
  cursor: pointer;
  transition: all var(--transition);
  text-align: center;
  background: var(--surface);
}
.scenario-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.scenario-card.active { border-color: var(--gold); background: var(--gold-bg); box-shadow: 0 0 0 3px rgba(184,146,42,0.12); }
.scenario-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.35rem; }
.scenario-name { font-family: 'Libre Baskerville', serif; font-size: 0.98rem; font-weight: 700; color: var(--ink); margin-bottom: 0.4rem; }
.scenario-val { font-family: 'Libre Baskerville', serif; font-size: 1.5rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.scenario-sub { font-size: 0.64rem; color: var(--ink-light); margin-top: 0.2rem; }

/* ─── BUY TARGET ─── */
.buy-target-box {
  background: var(--gold-bg);
  border: 1.5px solid rgba(184,146,42,0.4);
  border-radius: var(--radius-lg);
  padding: 1.2rem 1.6rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}
.buy-target-price { font-family: 'Libre Baskerville', serif; font-size: 2.2rem; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }

/* ─── BENCHMARK TABLE ─── */
.bench-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
.bench-table th { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-light); padding: 0.45rem 0.8rem; text-align: left; border-bottom: 2px solid var(--border); }
.bench-table td { padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--border); color: var(--ink); font-variant-numeric: tabular-nums; }
.bench-table tr:last-child td { border-bottom: none; }
.bench-table tr:hover td { background: var(--surface2); }
.bench-highlight { font-weight: 800; }
.bench-highlight td { background: var(--gold-bg) !important; }

/* ─── ANIMATIONS ─── */
@keyframes numPop { from { opacity: 0.4; transform: scale(1.15); } to { opacity: 1; transform: scale(1); } }
.num-animate { animation: numPop 0.35s ease; }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.25); border-top-color: white; border-radius: 50%; animation: spin 0.65s linear infinite; flex-shrink: 0; }
.spinner.dark { border-color: rgba(14,58,110,0.2); border-top-color: var(--c1); }

/* ─── WATCHLIST ─── */
.watchlist { margin-top: 3.5rem; }
.watch-controls { display: flex; gap: 0.7rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.watch-input { flex: 1; min-width: 180px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 0.52rem 0.9rem; background: var(--surface); color: var(--ink); font-family: 'Syne', sans-serif; font-size: 0.82rem; outline: none; transition: border-color var(--transition); }
.watch-input:focus { border-color: var(--gold); }
.watch-select { border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 0.52rem 0.9rem; background: var(--surface); color: var(--ink); font-family: 'Syne', sans-serif; font-size: 0.8rem; outline: none; cursor: pointer; }
.watch-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.1rem 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
  transition: all var(--transition);
  cursor: default;
}
.watch-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--gold); }
.watch-ticker { font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--ink); font-size: 1.05rem; }
.watch-name { color: var(--ink-light); font-size: 0.74rem; margin-top: 0.12rem; }
.watch-val { font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 1rem; font-variant-numeric: tabular-nums; text-align: right; }
.watch-price { color: var(--ink-light); font-size: 0.72rem; text-align: right; }
.portfolio-stats {
  display: flex;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1.2rem;
  box-shadow: var(--shadow-sm);
}
.portfolio-stat { flex: 1; padding: 1rem 1.3rem; border-right: 1px solid var(--border); }
.portfolio-stat:last-child { border-right: none; }
.portfolio-stat-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.25rem; }
.portfolio-stat-val { font-family: 'Libre Baskerville', serif; font-size: 1.3rem; font-weight: 700; color: var(--ink); }

/* ─── CHART ─── */
.chart-wrap { width: 100%; overflow-x: auto; margin-top: 0.6rem; }
.chart-legend { display: flex; gap: 1.3rem; margin-bottom: 0.9rem; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.68rem; font-weight: 600; color: var(--ink-light); }
.legend-dot { width: 9px; height: 9px; border-radius: 50%; }
.legend-line { width: 18px; height: 2px; border-radius: 1px; }
.sparkline-wrap { display: inline-block; vertical-align: middle; margin-left: 0.5rem; }

/* ─── MC ─── */
.mc-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; margin-bottom: 1.2rem; }
@media (max-width: 500px) { .mc-results { grid-template-columns: 1fr 1fr; } }
.mc-box { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.9rem 1rem; text-align: center; }
.mc-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.3rem; }
.mc-val { font-family: 'Libre Baskerville', serif; font-size: 1.3rem; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }

/* ─── COMPARE ─── */
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.compare-row { display: flex; justify-content: space-between; align-items: center; padding: 0.52rem 0; border-bottom: 1px solid var(--border); font-size: 0.78rem; }
.compare-row:last-child { border-bottom: none; }
.compare-key { color: var(--ink-light); font-weight: 500; }
.compare-val { font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; font-size: 0.8rem; }

/* ─── ALTMAN Z SCORE ─── */
.zscore-bar { height: 12px; background: var(--border); border-radius: 6px; overflow: hidden; position: relative; margin: 0.5rem 0; }
.zscore-fill { height: 100%; border-radius: 6px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.zscore-zones { display: flex; font-size: 0.6rem; color: var(--ink-light); justify-content: space-between; }

/* ─── CAPM ─── */
.capm-box { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.2rem; margin-top: 0.5rem; }
.capm-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-light); cursor: pointer; user-select: none; }
.capm-toggle input[type=checkbox] { accent-color: var(--gold); cursor: pointer; width: 14px; height: 14px; }
.capm-result { font-size: 0.72rem; color: var(--c1); font-weight: 600; margin-top: 0.55rem; display: flex; align-items: center; gap: 0.4rem; }
[data-theme="dark"] .capm-result { color: #60A5FA; }

/* ─── EXECUTIVE SUMMARY ─── */
.exec-summary {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
}
.exec-summary-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem; }
.exec-company { font-family: 'Libre Baskerville', serif; font-size: 1.6rem; font-weight: 700; color: var(--ink); }
.exec-ticker { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--ink-light); margin-top: 0.2rem; }
.exec-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.2rem; }
@media (max-width: 700px) { .exec-grid { grid-template-columns: repeat(2, 1fr); } }
.exec-metric { background: var(--surface2); border-radius: var(--radius); padding: 0.9rem 1rem; }
.exec-metric-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.3rem; }
.exec-metric-val { font-family: 'Libre Baskerville', serif; font-size: 1.35rem; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
.exec-narrative { font-size: 0.8rem; color: var(--ink-light); line-height: 1.75; border-top: 1px solid var(--border); padding-top: 1rem; }
.exec-narrative strong { color: var(--ink); }

/* ─── PRICE HISTORY CHART ─── */
.price-bands { background: var(--surface2); border-radius: var(--radius); padding: 0.8rem 1rem; margin-bottom: 1rem; display: flex; gap: 2rem; flex-wrap: wrap; }
.price-band-item { display: flex; flex-direction: column; }
.price-band-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.2rem; }
.price-band-val { font-family: 'IBM Plex Mono', monospace; font-size: 1rem; font-weight: 600; color: var(--ink); }

/* ─── CELL POPUP ─── */
.cell-popup { position: fixed; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 1rem 1.3rem; box-shadow: var(--shadow-xl); z-index: 300; min-width: 200px; pointer-events: none; font-size: 0.78rem; }
.cell-popup-title { font-family: 'Libre Baskerville', serif; font-weight: 700; color: var(--ink); margin-bottom: 0.6rem; font-size: 0.88rem; }
.cell-popup-row { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 0.3rem; color: var(--ink-light); }
.cell-popup-row span:last-child { font-weight: 700; color: var(--ink); font-family: 'IBM Plex Mono', monospace; }

/* ─── WATERFALL ─── */
.waterfall-labels { display: flex; justify-content: space-around; margin-top: 0.35rem; font-size: 0.62rem; color: var(--ink-light); font-weight: 600; font-family: 'IBM Plex Mono', monospace; }

/* ─── RI / NEW MODELS ─── */
.ri-box { background: linear-gradient(135deg, rgba(14,58,110,0.06), rgba(124,46,138,0.04)); border: 1px solid rgba(14,58,110,0.18); border-radius: var(--radius); padding: 0.8rem 1rem; font-size: 0.72rem; font-family: 'IBM Plex Mono', monospace; color: var(--ink-light); margin-top: 0.4rem; }

/* ─── FAIR VALUE BAND ─── */
.fv-band { display: flex; gap: 1rem; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.8rem 1rem; margin-top: 0.8rem; flex-wrap: wrap; }
.fv-band-item { display: flex; flex-direction: column; flex: 1; min-width: 80px; }
.fv-band-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 0.2rem; }
.fv-band-val { font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; font-weight: 600; }

/* ─── FOOTNOTE ─── */
.footnote { text-align: center; font-size: 0.65rem; color: var(--ink-light); margin-top: 3rem; line-height: 2; background: var(--surface); border-radius: var(--radius-lg); padding: 1.4rem; border: 1px solid var(--border); }
hr { border: none; border-top: 1px solid var(--border); margin: 1.2rem 0; }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2 · MATH ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

const FMP_BASE = "https://financialmodelingprep.com/api/v3";

async function fetchFMPData(ticker, apiKey) {
  const urls = {
    profile: `${FMP_BASE}/profile/${ticker}?apikey=${apiKey}`,
    income: `${FMP_BASE}/income-statement/${ticker}?limit=4&apikey=${apiKey}`,
    cashflow: `${FMP_BASE}/cash-flow-statement/${ticker}?limit=4&apikey=${apiKey}`,
    balance: `${FMP_BASE}/balance-sheet-statement/${ticker}?limit=2&apikey=${apiKey}`,
    keyMetrics: `${FMP_BASE}/key-metrics/${ticker}?limit=2&apikey=${apiKey}`,
    quote: `${FMP_BASE}/quote/${ticker}?apikey=${apiKey}`,
    dividends: `${FMP_BASE}/historical-price-full/stock_dividend/${ticker}?apikey=${apiKey}`,
    ratios: `${FMP_BASE}/ratios/${ticker}?limit=1&apikey=${apiKey}`,
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
  try { const p = raw.profile?.[0]; if (p) { parsed.companyName = p.companyName || ""; parsed.currentPrice = p.price ? String(p.price) : ""; parsed.shares = p.sharesOutstanding ? String((p.sharesOutstanding/1e6).toFixed(2)) : ""; parsed.beta = p.beta ? String(p.beta.toFixed(2)) : "1.0"; parsed.sector = p.sector || ""; loaded.companyName=!!p.companyName; loaded.currentPrice=!!p.price; loaded.shares=!!p.sharesOutstanding; loaded.beta=!!p.beta; } } catch{}
  try { const q = raw.quote?.[0]; if (q?.price && !parsed.currentPrice) { parsed.currentPrice=String(q.price); loaded.currentPrice=true; } } catch{}
  try { const cf=raw.cashflow; if(cf?.length>0){ const fcfs=cf.slice(0,4).map(y=>y.freeCashFlow).filter(v=>typeof v==="number"&&!isNaN(v)); if(fcfs.length>0){parsed.fcf=String((fcfs.reduce((a,b)=>a+b,0)/fcfs.length/1e6).toFixed(1)); loaded.fcf=true;} } } catch{}
  try { const inc=raw.income; if(inc?.length>0){ const i0=inc[0]; parsed.eps=i0.eps?String(i0.eps.toFixed(2)):""; parsed.ebitda=i0.ebitda?String((i0.ebitda/1e6).toFixed(1)):""; parsed.revenue=i0.revenue?String((i0.revenue/1e6).toFixed(1)):""; loaded.eps=!!i0.eps; loaded.ebitda=!!i0.ebitda; loaded.revenue=!!i0.revenue;
    if(inc.length>=2){ const r0=inc[0].revenue,r1=inc[1].revenue; if(r0&&r1&&r1>0){parsed.growthRate=String(Math.round(Math.abs((r0-r1)/r1)*100)); loaded.growthRate=true;} } } } catch{}
  try { const bal=raw.balance; if(bal?.length>0){ const b=bal[0]; parsed.debt=b.totalDebt?String((b.totalDebt/1e6).toFixed(1)):"0"; parsed.cash=b.cashAndCashEquivalents?String((b.cashAndCashEquivalents/1e6).toFixed(1)):"0"; parsed.totalEquity=b.totalStockholdersEquity?String((b.totalStockholdersEquity/1e6).toFixed(1)):""; parsed.totalAssets=b.totalAssets?String((b.totalAssets/1e6).toFixed(1)):""; parsed.currentAssets=b.totalCurrentAssets?String((b.totalCurrentAssets/1e6).toFixed(1)):""; parsed.currentLiabilities=b.totalCurrentLiabilities?String((b.totalCurrentLiabilities/1e6).toFixed(1)):""; parsed.bookValue=(b.totalStockholdersEquity&&raw.profile?.[0]?.sharesOutstanding)?String((b.totalStockholdersEquity/raw.profile[0].sharesOutstanding).toFixed(2)):""; loaded.debt=!!b.totalDebt; loaded.cash=!!b.cashAndCashEquivalents; loaded.bookValue=!!parsed.bookValue; loaded.totalEquity=!!b.totalStockholdersEquity; loaded.totalAssets=!!b.totalAssets; } } catch{}
  try { const km=raw.keyMetrics?.[0]; if(km){ if(km.peRatio&&!isNaN(km.peRatio)&&km.peRatio>0&&km.peRatio<200){parsed.peTarget=String(Math.round(km.peRatio)); loaded.peTarget=true;} if(km.enterpriseValueOverEBITDA&&!isNaN(km.enterpriseValueOverEBITDA)&&km.enterpriseValueOverEBITDA>0&&km.enterpriseValueOverEBITDA<80){parsed.evMultiple=String(km.enterpriseValueOverEBITDA.toFixed(1)); loaded.evMultiple=true;} if(km.roe&&!isNaN(km.roe)){parsed.roe=String((km.roe*100).toFixed(1)); loaded.roe=true;} if(km.roic&&!isNaN(km.roic)){parsed.roic=String((km.roic*100).toFixed(1)); loaded.roic=true;} if(km.netDebtToEBITDA&&!isNaN(km.netDebtToEBITDA)){parsed.netDebtEbitda=String(km.netDebtToEBITDA.toFixed(2)); loaded.netDebtEbitda=true;} } } catch{}
  try { const r=raw.ratios?.[0]; if(r){ if(r.returnOnEquity&&!isNaN(r.returnOnEquity)&&!loaded.roe){parsed.roe=String((r.returnOnEquity*100).toFixed(1)); loaded.roe=true;} if(r.priceToFreeCashFlowsRatio&&!isNaN(r.priceToFreeCashFlowsRatio)){parsed.pfcf=String(r.priceToFreeCashFlowsRatio.toFixed(1)); loaded.pfcf=true;} } } catch{}
  try { const divs=raw.dividends?.historical; if(divs?.length>=2){ const recent=divs.slice(0,4); const annualDiv=recent.reduce((a,b)=>a+(b.dividend||0),0); if(annualDiv>0){parsed.annualDividend=String(annualDiv.toFixed(3)); loaded.annualDividend=true;} } } catch{}
  return {parsed,loaded};
}

// ─── VALUATION MODELS ───

const pf = v => parseFloat(v) || 0;

// DCF
function calcDCF({fcf, growthRate, terminalGrowth, discountRate, years, shares}) {
  if (!fcf || !shares || !discountRate || discountRate <= terminalGrowth) return { value: null, projections: [], pvTV: null, totalPV: null };
  const g=growthRate/100, r=discountRate/100, tg=terminalGrowth/100;
  let pv=0, cf=fcf; const projections=[];
  for (let i=1; i<=years; i++) { cf *= (1+g); const pvCF = cf / Math.pow(1+r,i); pv += pvCF; projections.push({ year: i, fcf: cf, pvFCF: pvCF }); }
  const tv = cf*(1+tg)/(r-tg); const pvTV = tv/Math.pow(1+r,years);
  return { value: (pv+pvTV)/shares, projections, pvTV, totalPV: pv };
}

// Graham Number
const calcGraham = ({eps, bookValue}) => eps > 0 && bookValue > 0 ? Math.sqrt(22.5 * eps * bookValue) : null;

// P/E
const calcPE = ({eps, peTarget}) => eps && peTarget ? eps * peTarget : null;

// EV/EBITDA
const calcEV = ({ebitda, evMultiple, debt, cash, shares}) =>
  ebitda && evMultiple && shares ? (ebitda * evMultiple - (debt||0) + (cash||0)) / shares : null;

// DDM (Gordon Growth)
const calcDDM = ({annualDividend, dividendGrowth, discountRate}) => {
  const dg=dividendGrowth/100, r=discountRate/100;
  if (!annualDividend || r <= dg) return null;
  return annualDividend * (1+dg) / (r-dg);
};

// Residual Income Model
const calcRI = ({bookValue, eps, roe, costOfEquity, years=10}) => {
  if (!bookValue || !eps || !costOfEquity) return null;
  const r = costOfEquity/100;
  const roePct = (roe || (eps/bookValue*100)) / 100;
  let bv = bookValue, pv = 0;
  for (let i=1; i<=years; i++) {
    const ri = bv * (roePct - r);
    pv += ri / Math.pow(1+r, i);
    bv += eps * (1 - 0.3);
  }
  const tv = bv * (roePct - r) / r / Math.pow(1+r, years);
  return bookValue + pv + tv;
};

// Price/FCF
const calcPFCF = ({fcf, pfcfTarget, shares}) =>
  fcf && pfcfTarget && shares ? (fcf * pfcfTarget) / shares : null;

// CAPM
const calcCAPM = ({riskFree, beta, marketPremium}) =>
  (parseFloat(riskFree)||2.5) + (parseFloat(beta)||1.0) * (parseFloat(marketPremium)||6.0);

// Altman Z-Score (simplified public companies)
const calcAltman = ({workingCapital, totalAssets, retainedEarnings, ebit, marketCap, totalDebt, revenue, totalEquity}) => {
  if (!totalAssets || totalAssets <= 0) return null;
  const x1 = (workingCapital||0) / totalAssets;
  const x2 = (retainedEarnings||0) / totalAssets;
  const x3 = (ebit||0) / totalAssets;
  const x4 = (marketCap||0) / Math.max(totalDebt||1, 1);
  const x5 = (revenue||0) / totalAssets;
  return 1.2*x1 + 1.4*x2 + 3.3*x3 + 0.6*x4 + x5;
};

// Weighted average
function weightedAvg(pairs) {
  let sum=0, wsum=0;
  pairs.forEach(([v,w]) => { if (v !== null && v > 0 && w > 0) { sum += v*w; wsum += w; } });
  return wsum > 0 ? sum/wsum : null;
}

// Format helpers
const fmt = n => (n===null||n===undefined||isNaN(n)) ? "—" : "$"+Number(n).toFixed(2);
const fmtM = n => n === null ? "—" : "$"+(Number(n)>=1000?(Number(n)/1000).toFixed(1)+"B":Number(n).toFixed(0)+"M");
const pct = n => { if (n===null||n===undefined) return "—"; const v=Math.round(n); return (v>0?"+":"")+v+"%"; };

// Confidence
function confidenceScore(vals) {
  const active = vals.filter(v => v !== null && v > 0);
  if (active.length < 2) return { score: 0, label: "Insuficientes datos", cls: "conf-low", cv: null };
  const mean = active.reduce((a,b) => a+b, 0) / active.length;
  const variance = active.reduce((acc,v) => acc + Math.pow(v-mean,2), 0) / active.length;
  const cv = Math.sqrt(variance) / mean * 100;
  const score = Math.max(0, Math.min(10, Math.round((1-cv/100)*10)));
  const note = cv > 35 ? "Alta dispersión: revisa supuestos de cada modelo" : cv > 15 ? "Dispersión moderada: ajusta tasas de crecimiento" : "Alta consistencia entre modelos — señal robusta";
  if (score >= 7) return { score, label: `Alta consistencia (${score}/10)`, cls: "conf-high", cv: cv.toFixed(1), note };
  if (score >= 4) return { score, label: `Consistencia media (${score}/10)`, cls: "conf-mid", cv: cv.toFixed(1), note };
  return { score, label: `Baja consistencia (${score}/10)`, cls: "conf-low", cv: cv.toFixed(1), note };
}

// Fair value band
function fairValueBand(methods) {
  const active = methods.filter(v => v !== null && v > 0);
  if (!active.length) return null;
  active.sort((a,b) => a-b);
  return { low: active[0], high: active[active.length-1], mid: active[Math.floor(active.length/2)] };
}

// Monte Carlo
function runMonteCarlo({fcf, growthRate, discountRate, terminalGrowth, years, shares, iterations=2000}) {
  if (!fcf || !shares) return null;
  const results = [];
  for (let i=0; i<iterations; i++) {
    const g = Math.max(0, growthRate + (Math.random()-0.5)*growthRate*0.65);
    const r = Math.max(discountRate*0.55, discountRate + (Math.random()-0.5)*discountRate*0.5);
    const tg = Math.max(0, Math.min(terminalGrowth*1.5, terminalGrowth + (Math.random()-0.5)*2));
    const res = calcDCF({ fcf, growthRate: g, terminalGrowth: tg, discountRate: r, years, shares });
    if (res.value && res.value > 0 && res.value < fcf*250) results.push(res.value);
  }
  if (!results.length) return null;
  results.sort((a,b) => a-b);
  const n = results.length;
  const mn=results[0], mx=results[n-1], bins=32, range=mx-mn||1;
  const counts = new Array(bins).fill(0);
  results.forEach(v => { const b = Math.min(bins-1, Math.floor((v-mn)/range*bins)); counts[b]++; });
  return {
    p10: results[Math.floor(n*0.1)], p25: results[Math.floor(n*0.25)],
    p50: results[Math.floor(n*0.5)], p75: results[Math.floor(n*0.75)],
    p90: results[Math.floor(n*0.9)],
    mean: results.reduce((a,b)=>a+b,0)/n,
    histogram: { counts, min: mn, max: mx, binWidth: range/bins },
    raw: results,
  };
}

// Sector benchmarks
const SECTORS = {
  "Tecnología":    { pe: 28, ev: 20, growth: 15, wacc: 9,  pfcf: 25, desc: "Software, hardware, semiconductores" },
  "Salud":         { pe: 22, ev: 14, growth: 10, wacc: 8,  pfcf: 22, desc: "Farma, biotech, dispositivos médicos" },
  "Finanzas":      { pe: 13, ev: 11, growth: 7,  wacc: 10, pfcf: 14, desc: "Bancos, seguros, servicios financieros" },
  "Consumo":       { pe: 20, ev: 13, growth: 8,  wacc: 8,  pfcf: 18, desc: "Bienes de consumo, retail, marcas" },
  "Energía":       { pe: 12, ev: 8,  growth: 5,  wacc: 11, pfcf: 11, desc: "Petróleo, gas, renovables" },
  "Industria":     { pe: 18, ev: 12, growth: 7,  wacc: 9,  pfcf: 17, desc: "Manufactura, transporte, defensa" },
  "Inmobiliario":  { pe: 40, ev: 18, growth: 4,  wacc: 7,  pfcf: 30, desc: "REITs, propiedades comerciales" },
  "Utilidades":    { pe: 17, ev: 10, growth: 3,  wacc: 7,  pfcf: 15, desc: "Electricidad, agua, gas" },
  "Materiales":    { pe: 15, ev: 9,  growth: 6,  wacc: 9,  pfcf: 13, desc: "Minería, químicos, construcción" },
  "Telecom":       { pe: 14, ev: 7,  growth: 4,  wacc: 8,  pfcf: 12, desc: "Telecomunicaciones, media" },
  "S&P 500 (Prom)":{ pe: 21, ev: 14, growth: 8,  wacc: 9,  pfcf: 20, desc: "Promedio del mercado amplio" },
};

const SCENARIOS = [
  { key: "bear",  name: "Pesimista",  icon: "🐻", growthMult: 0.60, discAdd: 2.5,  termMult: 0.70, peMult: 0.72, evMult: 0.78, color: "#A82020" },
  { key: "base",  name: "Base",       icon: "⚖️", growthMult: 1.00, discAdd: 0,    termMult: 1.00, peMult: 1.00, evMult: 1.00, color: "#B8922A" },
  { key: "bull",  name: "Optimista",  icon: "🐂", growthMult: 1.40, discAdd: -1.5, termMult: 1.30, peMult: 1.25, evMult: 1.22, color: "#1A6B4A" },
];

const FIELD_LABELS = {
  companyName:"Empresa",currentPrice:"Precio",shares:"Acciones (M)",fcf:"FCF (M$)",
  eps:"EPS",ebitda:"EBITDA (M$)",debt:"Deuda (M$)",cash:"Efectivo (M$)",
  bookValue:"Book Value",peTarget:"P/E obj",evMultiple:"EV/EBITDA",
  growthRate:"Crec.%",beta:"Beta",annualDividend:"Dividendo",
  roe:"ROE%",roic:"ROIC%",revenue:"Revenue (M$)",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PART 3 · CANVAS DRAWING
// ═══════════════════════════════════════════════════════════════════════════════

function drawGauge(canvas, marginPct) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = 340, H = 210;
  canvas.width = W*dpr; canvas.height = H*dpr;
  canvas.style.width = W+"px"; canvas.style.height = H+"px";
  ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
  const cx=W/2, cy=H-30, R=128, thick=28, inner=R-thick;
  // Shadow
  ctx.save(); ctx.shadowColor="rgba(0,0,0,0.7)"; ctx.shadowBlur=22;
  ctx.beginPath(); ctx.arc(cx,cy,R+4,Math.PI,2*Math.PI); ctx.arc(cx,cy,inner-4,2*Math.PI,Math.PI,true); ctx.closePath();
  ctx.fillStyle="rgba(0,0,0,0.4)"; ctx.fill(); ctx.restore();
  // Track
  ctx.beginPath(); ctx.arc(cx,cy,R,Math.PI,2*Math.PI); ctx.arc(cx,cy,inner,2*Math.PI,Math.PI,true); ctx.closePath();
  ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fill();
  // Zones
  const zones = [
    { from:0, to:0.22, a:"#8B1A1A", b:"#C0392B" },
    { from:0.22, to:0.42, a:"#A05000", b:"#E07020" },
    { from:0.42, to:0.60, a:"#A08000", b:"#D4B030" },
    { from:0.60, to:0.78, a:"#1A5A36", b:"#2ECC71" },
    { from:0.78, to:1.0, a:"#0A4A3A", b:"#1ABC9C" },
  ];
  zones.forEach(z => {
    const sa=Math.PI+z.from*Math.PI, ea=Math.PI+z.to*Math.PI;
    const grad = ctx.createLinearGradient(cx+(inner+thick*0.3)*Math.cos(sa), cy+(inner+thick*0.3)*Math.sin(sa), cx+(inner+thick*0.3)*Math.cos(ea), cy+(inner+thick*0.3)*Math.sin(ea));
    grad.addColorStop(0, z.a); grad.addColorStop(1, z.b);
    ctx.beginPath(); ctx.arc(cx,cy,R,sa,ea); ctx.arc(cx,cy,inner,ea,sa,true); ctx.closePath(); ctx.fillStyle=grad; ctx.fill();
  });
  // Gloss
  const gloss = ctx.createLinearGradient(0,cy-R,0,cy-inner);
  gloss.addColorStop(0,"rgba(255,255,255,0.12)"); gloss.addColorStop(1,"rgba(255,255,255,0)");
  ctx.beginPath(); ctx.arc(cx,cy,R,Math.PI,2*Math.PI); ctx.arc(cx,cy,inner,2*Math.PI,Math.PI,true); ctx.closePath(); ctx.fillStyle=gloss; ctx.fill();
  // Ticks
  [-50,-25,0,25,50,75,100].forEach(val => {
    const norm=(val+50)/150, angle=Math.PI+norm*Math.PI;
    ctx.beginPath(); ctx.moveTo(cx+(R+8)*Math.cos(angle),cy+(R+8)*Math.sin(angle));
    ctx.lineTo(cx+(R+3)*Math.cos(angle),cy+(R+3)*Math.sin(angle));
    ctx.strokeStyle="rgba(255,255,255,0.6)"; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle="rgba(180,200,240,0.7)"; ctx.font="500 7.5px 'Syne',sans-serif";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(val+"%", cx+(R+20)*Math.cos(angle), cy+(R+20)*Math.sin(angle));
  });
  // Hub bg
  ctx.beginPath(); ctx.arc(cx,cy,inner-2,0,Math.PI*2); ctx.fillStyle="#0A1020"; ctx.fill();
  // Needle
  const clamped=Math.max(-50,Math.min(100,marginPct??-50));
  const norm=(clamped+50)/150, nAngle=Math.PI+norm*Math.PI;
  const glowColor=clamped>50?"#1ABC9C":clamped>25?"#2ECC71":clamped>0?"#D4B030":clamped>-25?"#E07020":"#E74C3C";
  const glowX=cx+(inner+thick/2)*Math.cos(nAngle), glowY=cy+(inner+thick/2)*Math.sin(nAngle);
  const gG=ctx.createRadialGradient(glowX,glowY,0,glowX,glowY,35);
  gG.addColorStop(0,glowColor+"66"); gG.addColorStop(1,"transparent");
  ctx.beginPath(); ctx.arc(glowX,glowY,35,0,Math.PI*2); ctx.fillStyle=gG; ctx.fill();
  ctx.save(); ctx.translate(cx,cy); ctx.shadowColor="rgba(0,0,0,0.9)"; ctx.shadowBlur=12;
  const nLen=inner-7; ctx.rotate(nAngle-Math.PI);
  const nG=ctx.createLinearGradient(-2,0,2,0); nG.addColorStop(0,"rgba(255,255,255,0.3)"); nG.addColorStop(0.5,"#FFFFFF"); nG.addColorStop(1,"rgba(200,210,255,0.4)");
  ctx.beginPath(); ctx.moveTo(-1.5,8); ctx.lineTo(-2.5,-nLen*0.6); ctx.lineTo(0,-nLen); ctx.lineTo(2.5,-nLen*0.6); ctx.lineTo(1.5,8); ctx.closePath();
  ctx.fillStyle=nG; ctx.fill(); ctx.restore();
  // Hub
  const hubG=ctx.createRadialGradient(cx-1,cy-1,0,cx,cy,13);
  hubG.addColorStop(0,"#4060A0"); hubG.addColorStop(0.5,"#1C3080"); hubG.addColorStop(1,"#0A1840");
  ctx.beginPath(); ctx.arc(cx,cy,13,0,Math.PI*2); ctx.fillStyle=hubG; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,13,0,Math.PI*2); ctx.strokeStyle="rgba(255,255,255,0.18)"; ctx.lineWidth=1.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,3.5,0,Math.PI*2); ctx.fillStyle="#D4B030"; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,1.5,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
  // Labels
  ctx.font="600 7px 'Syne',sans-serif"; ctx.textBaseline="top";
  ctx.fillStyle="rgba(192,57,43,0.85)"; ctx.textAlign="left"; ctx.fillText("SOBREVALORADA",cx-R+2,cy+10);
  ctx.fillStyle="rgba(26,188,156,0.85)"; ctx.textAlign="right"; ctx.fillText("SUBVALORADA",cx+R-2,cy+10);
}

function drawDCFChart(canvas, projections, isDark) {
  if (!canvas || !projections?.length) return;
  const ctx = canvas.getContext("2d"), dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth||700, H=280;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.height=H+"px";
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  const pad={top:20,right:25,bottom:48,left:72};
  const cW=W-pad.left-pad.right, cH=H-pad.top-pad.bottom, n=projections.length;
  const maxVal=Math.max(...projections.map(d=>d.fcf))*1.18;
  const xS=i=>pad.left+(n>1?(i/(n-1))*cW:cW/2);
  const yS=v=>pad.top+cH-(v/maxVal)*cH;
  const grid=isDark?"rgba(255,255,255,0.06)":"rgba(14,20,32,0.07)";
  const text=isDark?"#6A7898":"#7A849A";
  const line=isDark?"#4A6A9A":"#0E1420";
  // Grid
  for(let i=0;i<=4;i++){const y=pad.top+(cH/4)*i; ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1; ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+cW,y); ctx.stroke();}
  // FCF bars
  const bW=Math.min(cW/n*0.42,36);
  projections.forEach((d,i)=>{
    const x=xS(i), bH=(d.fcf/maxVal)*cH, bY=pad.top+cH-bH;
    const g=ctx.createLinearGradient(0,bY,0,pad.top+cH);
    g.addColorStop(0,isDark?"rgba(212,170,60,0.8)":"rgba(184,146,42,0.85)");
    g.addColorStop(1,isDark?"rgba(212,170,60,0.1)":"rgba(184,146,42,0.1)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x-bW/2,bY,bW,bH,[3,3,0,0]); ctx.fill();
  });
  // PV line
  if(n>1){
    ctx.beginPath(); ctx.strokeStyle=line; ctx.lineWidth=2.5; ctx.lineJoin="round";
    projections.forEach((d,i)=>{const x=xS(i),y=yS(d.pvFCF); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.stroke();
    // Area
    ctx.beginPath();
    projections.forEach((d,i)=>{const x=xS(i),y=yS(d.pvFCF); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.lineTo(xS(n-1),pad.top+cH); ctx.lineTo(xS(0),pad.top+cH); ctx.closePath();
    const aG=ctx.createLinearGradient(0,pad.top,0,pad.top+cH);
    aG.addColorStop(0,isDark?"rgba(74,106,154,0.25)":"rgba(14,20,32,0.08)"); aG.addColorStop(1,"transparent");
    ctx.fillStyle=aG; ctx.fill();
  }
  // Dots
  projections.forEach((d,i)=>{
    const x=xS(i),y=yS(d.pvFCF);
    ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fillStyle=line; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,2.2,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
  });
  // Axis labels
  ctx.fillStyle=text; ctx.font="10px 'IBM Plex Mono',monospace"; ctx.textAlign="center";
  projections.forEach((d,i)=>{if(n<=8||i%2===0) ctx.fillText("Año "+d.year,xS(i),H-10);});
  ctx.textAlign="right";
  for(let i=0;i<=4;i++){const v=(maxVal/4)*(4-i),y=pad.top+(cH/4)*i; ctx.fillStyle=text; ctx.font="9.5px 'IBM Plex Mono',monospace"; ctx.fillText(v>=1000?(v/1000).toFixed(1)+"B":v.toFixed(0)+"M",pad.left-8,y+4);}
}

function drawRadarChart(canvas, vals, isDark) {
  if (!canvas) return;
  const ctx=canvas.getContext("2d"), dpr=window.devicePixelRatio||1;
  const W=270,H=250;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+"px"; canvas.style.height=H+"px";
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  const labels=["DCF","Graham","P/E","EV/EBITDA","DDM","RI","P/FCF"];
  const n=labels.length, active=vals.filter(v=>v!==null&&v>0);
  const grid=isDark?"rgba(255,255,255,0.07)":"rgba(14,20,32,0.08)";
  const text=isDark?"#8898BE":"#0E1420";
  if(active.length<2){ctx.fillStyle=isDark?"#6A7898":"#7A849A"; ctx.font="11px 'Syne'"; ctx.textAlign="center"; ctx.fillText("Mín. 2 métodos para radar",W/2,H/2); return;}
  const maxVal=Math.max(...active)*1.3;
  const cx=W/2, cy=H/2+10, r=85;
  // Grid rings
  for(let ring=1;ring<=4;ring++){
    ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1;
    for(let i=0;i<n;i++){const a=(2*Math.PI*i/n)-Math.PI/2; const rx=cx+(r*ring/4)*Math.cos(a),ry=cy+(r*ring/4)*Math.sin(a); i===0?ctx.moveTo(rx,ry):ctx.lineTo(rx,ry);}
    ctx.closePath(); ctx.stroke();
  }
  for(let i=0;i<n;i++){const a=(2*Math.PI*i/n)-Math.PI/2; ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1; ctx.moveTo(cx,cy); ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)); ctx.stroke();}
  // Polygon
  ctx.beginPath();
  vals.forEach((v,i)=>{const ratio=(v!==null&&v>0)?Math.min(v/maxVal,1):0; const a=(2*Math.PI*i/n)-Math.PI/2; i===0?ctx.moveTo(cx+r*ratio*Math.cos(a),cy+r*ratio*Math.sin(a)):ctx.lineTo(cx+r*ratio*Math.cos(a),cy+r*ratio*Math.sin(a));});
  ctx.closePath();
  const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
  grad.addColorStop(0,isDark?"rgba(74,106,154,0.4)":"rgba(14,20,32,0.15)"); grad.addColorStop(1,isDark?"rgba(74,106,154,0.1)":"rgba(14,20,32,0.04)");
  ctx.fillStyle=grad; ctx.fill(); ctx.strokeStyle=isDark?"#4A6A9A":"#0E1420"; ctx.lineWidth=2.5; ctx.stroke();
  // Dots
  vals.forEach((v,i)=>{const ratio=(v!==null&&v>0)?Math.min(v/maxVal,1):0; const a=(2*Math.PI*i/n)-Math.PI/2; ctx.beginPath(); ctx.arc(cx+r*ratio*Math.cos(a),cy+r*ratio*Math.sin(a),5,0,Math.PI*2); ctx.fillStyle="#B8922A"; ctx.fill(); ctx.beginPath(); ctx.arc(cx+r*ratio*Math.cos(a),cy+r*ratio*Math.sin(a),2,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();});
  // Labels
  ctx.fillStyle=text; ctx.font="600 9.5px 'Syne'"; ctx.textAlign="center";
  for(let i=0;i<n;i++){const a=(2*Math.PI*i/n)-Math.PI/2; ctx.fillText(labels[i],cx+(r+18)*Math.cos(a),cy+(r+18)*Math.sin(a)+3);}
}

function drawWaterfall(canvas, {totalPV, pvTV, shares}, isDark) {
  if (!canvas||!totalPV||!pvTV||!shares) return;
  const ctx=canvas.getContext("2d"), dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth||400, H=200;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.height=H+"px";
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  const pvOps=totalPV/shares, pvTer=pvTV/shares, total=pvOps+pvTer;
  const pad={top:16,right:20,bottom:38,left:58};
  const cW=W-pad.left-pad.right, cH=H-pad.top-pad.bottom, maxV=total*1.22;
  const bars=[{l:"FCF Ops.",v:pvOps,color:"#0E3A6E",start:0},{l:"TV Terminal",v:pvTer,color:"#B8922A",start:pvOps},{l:"Total",v:total,color:"#1A6B4A",start:0,final:true}];
  const bW=Math.min(cW/4,60), sp=cW/bars.length;
  const text=isDark?"#6A7898":"#7A849A", grid=isDark?"rgba(255,255,255,0.06)":"rgba(14,20,32,0.07)";
  for(let i=0;i<=4;i++){const v=(maxV/4)*(4-i),y=pad.top+(cH/4)*i; ctx.fillStyle=text; ctx.font="9px 'IBM Plex Mono',monospace"; ctx.textAlign="right"; ctx.fillText("$"+v.toFixed(0),pad.left-6,y+3); ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1; ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+cW,y); ctx.stroke();}
  bars.forEach((bar,i)=>{
    const x=pad.left+sp*i+(sp-bW)/2, sY=pad.top+cH-(bar.start+bar.v)/maxV*cH, bH=(bar.v/maxV)*cH;
    const g=ctx.createLinearGradient(0,sY,0,sY+bH); g.addColorStop(0,bar.color); g.addColorStop(1,bar.color+"88");
    ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x,sY,bW,bH,[3,3,0,0]); ctx.fill();
    if(!bar.final&&i<bars.length-1){ctx.setLineDash([3,3]); ctx.beginPath(); ctx.strokeStyle="#999"; ctx.lineWidth=1; ctx.moveTo(x+bW,sY); ctx.lineTo(pad.left+sp*(i+1)+(sp-bW)/2,sY); ctx.stroke(); ctx.setLineDash([]);}
    ctx.fillStyle=bar.color; ctx.font="bold 8.5px 'IBM Plex Mono',monospace"; ctx.textAlign="center"; ctx.fillText("$"+bar.v.toFixed(1),x+bW/2,sY-4);
    ctx.fillStyle=text; ctx.font="9px 'Syne',monospace"; ctx.fillText(bar.l,x+bW/2,H-8);
  });
}

function drawHistogram(canvas, mc, cp, isDark) {
  if (!canvas||!mc) return;
  const ctx=canvas.getContext("2d"), dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth||500, H=190;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.height=H+"px";
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  const {counts,min,binWidth}=mc.histogram, maxC=Math.max(...counts);
  const pad={top:18,right:22,bottom:34,left:52};
  const cW=W-pad.left-pad.right, cH=H-pad.top-pad.bottom, n=counts.length;
  const bW=cW/n, text=isDark?"#6A7898":"#7A849A", grid=isDark?"rgba(255,255,255,0.06)":"rgba(14,20,32,0.07)";
  for(let i=0;i<=4;i++){const y=pad.top+(cH/4)*i; ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1; ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+cW,y); ctx.stroke();}
  counts.forEach((c,i)=>{
    const bH=maxC>0?(c/maxC)*cH:0, bY=pad.top+cH-bH, bVal=min+i*binWidth;
    const isCP=cp&&bVal<=cp&&cp<=bVal+binWidth;
    const isP50=Math.abs(bVal-mc.p50)<binWidth;
    const col=isCP?"#E74C3C":isP50?"#B8922A":isDark?"#1C3A6A":"#0E1420";
    ctx.fillStyle=col+(isCP||isP50?"EE":"99"); ctx.beginPath(); ctx.roundRect(pad.left+i*bW+1,bY,bW-2,bH,[2,2,0,0]); ctx.fill();
  });
  // Percentile lines
  [[mc.p10,"#E74C3C","P10"],[mc.p50,"#B8922A","P50"],[mc.p90,"#1A6B4A","P90"]].forEach(([v,c,l])=>{
    const x=pad.left+((v-min)/(mc.max-min))*cW;
    ctx.beginPath(); ctx.strokeStyle=c; ctx.lineWidth=1.5; ctx.setLineDash([4,3]); ctx.moveTo(x,pad.top); ctx.lineTo(x,pad.top+cH); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=c; ctx.font="bold 8.5px 'Syne',sans-serif"; ctx.textAlign="center"; ctx.fillText(l,x,pad.top-4);
  });
  // X axis
  ctx.fillStyle=text; ctx.font="8.5px 'IBM Plex Mono',monospace"; ctx.textAlign="right";
  for(let i=0;i<=4;i++){const v=(maxC/4)*(4-i),y=pad.top+(cH/4)*i; ctx.fillText(Math.round(v),pad.left-5,y+4);}
  [0,0.25,0.5,0.75,1].forEach(f=>{const val=min+f*(mc.max-min),x=pad.left+f*cW; ctx.fillStyle=text; ctx.font="8.5px 'IBM Plex Mono',monospace"; ctx.textAlign="center"; ctx.fillText("$"+val.toFixed(0),x,H-6);});
}

function drawBridgeChart(canvas, methods, labels, isDark) {
  if (!canvas) return;
  const ctx=canvas.getContext("2d"), dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth||600, H=200;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.height=H+"px";
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  const vals=methods.filter(v=>v!==null&&v>0);
  if(!vals.length) return;
  const pad={top:16,right:20,bottom:40,left:60};
  const cW=W-pad.left-pad.right, cH=H-pad.top-pad.bottom;
  const mn=Math.min(...vals)*0.88, mx=Math.max(...vals)*1.12;
  const yS=v=>pad.top+cH-((v-mn)/(mx-mn))*cH;
  const colors=["#0E3A6E","#B8922A","#1A6B4A","#7C2E8A","#A82020","#2A6E8A","#5A4A00"];
  const text=isDark?"#6A7898":"#7A849A", grid=isDark?"rgba(255,255,255,0.06)":"rgba(14,20,32,0.07)";
  const filteredMethods=[], filteredLabels=[];
  methods.forEach((v,i)=>{if(v!==null&&v>0){filteredMethods.push(v); filteredLabels.push(labels[i]);}});
  const n=filteredMethods.length, sp=cW/n;
  // Grid
  for(let i=0;i<=4;i++){const v=mn+(mx-mn)/4*(4-i),y=yS(v); ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1; ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+cW,y); ctx.stroke(); ctx.fillStyle=text; ctx.font="8.5px 'IBM Plex Mono'"; ctx.textAlign="right"; ctx.fillText("$"+v.toFixed(0),pad.left-6,y+4);}
  // Bars
  const bW=Math.min(sp*0.55,44);
  filteredMethods.forEach((v,i)=>{
    const x=pad.left+sp*i+sp/2, bH=(v-mn)/(mx-mn)*cH, bY=yS(v), col=colors[i%colors.length];
    const g=ctx.createLinearGradient(0,bY,0,pad.top+cH); g.addColorStop(0,col); g.addColorStop(1,col+"55");
    ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x-bW/2,bY,bW,bH,[4,4,0,0]); ctx.fill();
    ctx.fillStyle=col; ctx.font="bold 9px 'IBM Plex Mono'"; ctx.textAlign="center"; ctx.fillText("$"+v.toFixed(0),x,bY-5);
    ctx.fillStyle=text; ctx.font="8px 'Syne'"; ctx.fillText(filteredLabels[i],x,H-6);
  });
  // Connecting line
  if(n>1){ctx.beginPath(); ctx.strokeStyle=isDark?"rgba(255,255,255,0.15)":"rgba(14,20,32,0.12)"; ctx.lineWidth=1; ctx.setLineDash([3,4]); filteredMethods.forEach((v,i)=>{const x=pad.left+sp*i+sp/2,y=yS(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}); ctx.stroke(); ctx.setLineDash([]);}
}

function drawSparkline(canvas, history) {
  if (!canvas||history.length<2) return;
  const ctx=canvas.getContext("2d"), dpr=window.devicePixelRatio||1;
  const W=64,H=26;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+"px"; canvas.style.height=H+"px";
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  const mn=Math.min(...history), mx=Math.max(...history), range=mx-mn||1;
  const up=history[history.length-1]>=history[0];
  ctx.beginPath(); ctx.strokeStyle=up?"#1A6B4A":"#A82020"; ctx.lineWidth=1.8; ctx.lineJoin="round";
  history.forEach((v,i)=>{const x=(i/(history.length-1))*W,y=H-((v-mn)/range)*(H-3)-1.5; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 4 · COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Tip({ text }) {
  return (
    <span className="tip-wrap">
      <span className="tip-icon">i</span>
      <span className="tip-box">{text}</span>
    </span>
  );
}

function NumVal({ value, format=fmt }) {
  const [key, setKey] = useState(0);
  const prev = useRef(value);
  useEffect(() => { if (prev.current !== value) { setKey(k=>k+1); prev.current=value; } }, [value]);
  return <span key={key} className="num-animate">{format(value)}</span>;
}

function GaugeChart({ marginPct, intrinsic, price, upside }) {
  const ref = useRef(null);
  useEffect(() => { drawGauge(ref.current, marginPct); }, [marginPct]);
  const c = marginPct === null ? null : Math.max(-50, Math.min(100, marginPct));
  const color = c===null?"#7A849A":c>50?"#1ABC9C":c>25?"#2ECC71":c>0?"#D4B030":c>-25?"#E07020":"#E74C3C";
  const verdict = c===null?"Ingresa precio actual":c>50?"Fuertemente Subvalorada":c>25?"Subvalorada — Comprar":c>5?"Precio Justo — Mantener":c>-15?"Levemente Cara":"Sobrevalorada — Cuidado";
  return (
    <div className="gauge-card">
      <div className="gauge-eyebrow">Análisis de Valoración</div>
      <div className="gauge-heading">Velocímetro de Margen de Seguridad</div>
      <div className="gauge-canvas-wrap">
        <canvas ref={ref} />
        <div className="gauge-center">
          <div className="gauge-pct" style={{ color }}>{pct(marginPct)}</div>
          <div className="gauge-pct-label" style={{ color: color+"88" }}>Margen de seguridad</div>
        </div>
      </div>
      <div className="gauge-pill" style={{ color, borderColor: color, background: color+"1A" }}>
        {c===null?"○":c>25?"▲ ":c>0?"◆ ":"▼ "}{verdict}
      </div>
      <div className="gauge-metrics">
        {[["Valor Intrínseco",fmt(intrinsic)],["Precio Mercado",fmt(price)],["Potencial Alzada",pct(upside)]].map(([l,v])=>(
          <div key={l} className="gauge-metric-box">
            <div className="gauge-metric-label">{l}</div>
            <div className="gauge-metric-val">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DCFChartComp({ projections, isDark }) {
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) drawDCFChart(ref.current,projections,isDark); },[projections,isDark]);
  useEffect(()=>{ if(!ref.current) return; const ro=new ResizeObserver(()=>drawDCFChart(ref.current,projections,isDark)); ro.observe(ref.current.parentElement); return()=>ro.disconnect(); },[projections,isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{width:"100%"}}/></div>;
}

function RadarComp({ vals, isDark }) {
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) drawRadarChart(ref.current,vals,isDark); },[vals,isDark]);
  return <div style={{display:"flex",justifyContent:"center",margin:"0.5rem 0 1rem"}}><canvas ref={ref}/></div>;
}

function WaterfallComp({ totalPV, pvTV, shares, isDark }) {
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) drawWaterfall(ref.current,{totalPV,pvTV,shares},isDark); },[totalPV,pvTV,shares,isDark]);
  useEffect(()=>{ if(!ref.current) return; const ro=new ResizeObserver(()=>drawWaterfall(ref.current,{totalPV,pvTV,shares},isDark)); ro.observe(ref.current.parentElement); return()=>ro.disconnect(); },[totalPV,pvTV,shares,isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{width:"100%"}}/></div>;
}

function HistogramComp({ mc, cp, isDark }) {
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) drawHistogram(ref.current,mc,cp,isDark); },[mc,cp,isDark]);
  useEffect(()=>{ if(!ref.current) return; const ro=new ResizeObserver(()=>drawHistogram(ref.current,mc,cp,isDark)); ro.observe(ref.current.parentElement); return()=>ro.disconnect(); },[mc,cp,isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{width:"100%"}}/></div>;
}

function BridgeComp({ methods, labels, isDark }) {
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) drawBridgeChart(ref.current,methods,labels,isDark); },[methods,labels,isDark]);
  useEffect(()=>{ if(!ref.current) return; const ro=new ResizeObserver(()=>drawBridgeChart(ref.current,methods,labels,isDark)); ro.observe(ref.current.parentElement); return()=>ro.disconnect(); },[methods,labels,isDark]);
  return <div className="chart-wrap"><canvas ref={ref} style={{width:"100%"}}/></div>;
}

function Sparkline({ history }) {
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current) drawSparkline(ref.current,history); },[history]);
  return <span className="sparkline-wrap"><canvas ref={ref}/></span>;
}

// FMP Panel
function FMPPanel({ ticker, onData, fmpKey, setFmpKey }) {
  const [status, setStatus]=useState(null);
  const [err, setErr]=useState("");
  const [loaded, setLoaded]=useState({});
  const [hasData, setHasData]=useState(false);

  const fetch = async () => {
    if (!ticker) { setStatus("err"); setErr("Ingresa un Ticker antes de autocompletar."); return; }
    if (!fmpKey) { setStatus("err"); setErr("Ingresa tu API key de FMP."); return; }
    setStatus("loading"); setErr("");
    try {
      const raw = await fetchFMPData(ticker.toUpperCase(), fmpKey.trim());
      if (raw.profile?.["Error Message"]||(Array.isArray(raw.profile)&&raw.profile.length===0)) throw new Error("Ticker no encontrado o API key inválida.");
      const {parsed,loaded:ld}=parseFMPData(raw);
      onData(parsed); setLoaded(ld); setStatus("ok"); setHasData(true);
    } catch(e) { setStatus("err"); setErr(e.message||"Error al conectar con FMP."); }
  };

  const clear=()=>{setStatus(null);setLoaded({});setHasData(false);setErr(""); onData({companyName:"",currentPrice:"",shares:"",fcf:"",eps:"",ebitda:"",debt:"0",cash:"0",bookValue:"",peTarget:"15",evMultiple:"10",growthRate:"10",beta:"1.0",annualDividend:"",roe:"",revenue:""});};

  return (
    <div className="fmp-panel">
      <div className="fmp-title">⚡ Autocompletar con Financial Modeling Prep</div>
      <div className="fmp-sub">API gratuita: ~250 solicitudes/día en <a href="https://financialmodelingprep.com" target="_blank" rel="noopener noreferrer">financialmodelingprep.com</a>. Carga FCF, EPS, EBITDA, ROE, Dividendos, Beta y más automáticamente.</div>
      <div className="fmp-input-row">
        <div className="field"><label>API Key</label><input value={fmpKey} onChange={e=>setFmpKey(e.target.value)} placeholder="Tu API key de FMP..." type="password" autoComplete="off"/></div>
        <button className="btn-fetch" onClick={fetch} disabled={status==="loading"}>
          {status==="loading"?<><div className="spinner"/>Cargando...</>:<>📡 Autocompletar</>}
        </button>
        {hasData&&<button className="btn-secondary" onClick={clear} style={{height:40}}>✕ Limpiar</button>}
      </div>
      {status==="err"&&<div className="alert err" style={{marginTop:"0.7rem"}}><span className="alert-icon">⚠</span>{err}</div>}
      {status==="ok"&&(
        <>
          <div className="alert success" style={{marginTop:"0.7rem"}}><span className="alert-icon">✓</span>Datos cargados correctamente. Revisa y ajusta los valores si es necesario.</div>
          <div className="fmp-chips">
            {Object.entries(FIELD_LABELS).map(([key,label])=>(
              <span key={key} className={`fmp-chip ${loaded[key]?"ok":"miss"}`}>{loaded[key]?"✓":"—"} {label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Heatmap
function SensitivityHeatmap({ fcf, terminalGrowth, shares, currentPrice }) {
  const [popup, setPopup]=useState(null);
  const waccR=[6,7,8,9,10,11,12], growR=[5,7,10,12,15,18,20];
  const cp=pf(currentPrice);
  function heatColor(m) {
    if(m>40) return{bg:"#1A6B4A",tx:"#fff"};
    if(m>20) return{bg:"#2ECC71",tx:"#fff"};
    if(m>8) return{bg:"#A8E6C3",tx:"#1A3A2A"};
    if(m>-8) return{bg:"#F5F0D8",tx:"#6A5000"};
    if(m>-25) return{bg:"#F5C6C2",tx:"#5A1A1A"};
    return{bg:"#C0392B",tx:"#fff"};
  }
  if(!fcf||!shares) return <div style={{textAlign:"center",padding:"2.5rem",color:"var(--ink-light)"}}>Completa FCF y Acciones (M) en el método DCF para ver el mapa de sensibilidad.</div>;
  return (
    <div>
      <div className="heatmap-wrap">
        <table className="heatmap-table">
          <thead><tr><th style={{textAlign:"left"}}>WACC↓ / Crec.→</th>{growR.map(g=><th key={g}>{g}%</th>)}</tr></thead>
          <tbody>
            {waccR.map(wacc=>(
              <tr key={wacc}>
                <td className="hm-axis">{wacc}%</td>
                {growR.map(growth=>{
                  if(growth>=wacc){
                    const res=calcDCF({fcf:pf(fcf),growthRate:growth,terminalGrowth:pf(terminalGrowth),discountRate:wacc,years:10,shares:pf(shares)});
                    const val=res.value, m=val&&cp>0?((val-cp)/val)*100:null;
                    const{bg,tx}=heatColor(m??0);
                    return <td key={growth} style={{background:bg,color:tx}} onClick={e=>setPopup({val,m,wacc,growth,x:e.clientX,y:e.clientY})}>{fmt(val)}</td>;
                  }
                  return <td key={growth} style={{background:"var(--surface2)",color:"var(--border)"}}>—</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:"0.9rem",flexWrap:"wrap",marginTop:"0.7rem",fontSize:"0.65rem",color:"var(--ink-light)"}}>
        {[["#1A6B4A","#fff",">40%"],["#2ECC71","#fff","20-40%"],["#A8E6C3","#1A3A2A","8-20%"],["#F5F0D8","#6A5000","±8%"],["#F5C6C2","#5A1A1A","-8 a -25%"],["#C0392B","#fff","<-25%"]].map(([bg,c,l])=>(
          <span key={l} style={{display:"flex",alignItems:"center",gap:"0.3rem"}}><span style={{width:11,height:11,background:bg,borderRadius:2,display:"inline-block"}}/><span>{l}</span></span>
        ))}
      </div>
      {popup&&(
        <div className="cell-popup" style={{left:Math.min(popup.x+12,window.innerWidth-215),top:popup.y+8}}>
          <div className="cell-popup-title">WACC {popup.wacc}% · Crecimiento {popup.growth}%</div>
          <div className="cell-popup-row"><span>Valor intrínseco:</span><span>{fmt(popup.val)}</span></div>
          <div className="cell-popup-row"><span>Precio mercado:</span><span>{fmt(cp||null)}</span></div>
          <div className="cell-popup-row"><span>Margen seguridad:</span><span style={{color:(popup.m||0)>0?"var(--buy)":"var(--sell)"}}>{pct(popup.m)}</span></div>
          <button style={{position:"absolute",top:"0.4rem",right:"0.5rem",background:"none",border:"none",cursor:"pointer",fontSize:"0.85rem",color:"var(--ink-light)"}} onClick={()=>setPopup(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

// Benchmark Table
function BenchmarkTable({ sector, peTarget, evMultiple, growthRate, discountRate }) {
  const bench=SECTORS[sector]; if(!bench) return null;
  const rows=[
    {l:"P/E objetivo",u:peTarget?pf(peTarget):null,b:bench.pe,unit:"×"},
    {l:"EV/EBITDA",u:evMultiple?pf(evMultiple):null,b:bench.ev,unit:"×"},
    {l:"P/FCF estimado",u:null,b:bench.pfcf,unit:"×"},
    {l:"Crecimiento",u:growthRate?pf(growthRate):null,b:bench.growth,unit:"%"},
    {l:"WACC",u:discountRate?pf(discountRate):null,b:bench.wacc,unit:"%"},
  ];
  return (
    <div>
      <div style={{fontSize:"0.65rem",fontWeight:700,color:"var(--ink-light)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>Vs. Sector: {sector} — {bench.desc}</div>
      <table className="bench-table">
        <thead><tr><th>Métrica</th><th>Tu valor</th><th>Promedio sector</th><th>Diferencia</th></tr></thead>
        <tbody>
          {rows.map(r=>{
            const diff=r.u!==null?r.u-r.b:null;
            const dc=diff===null?"var(--ink-light)":Math.abs(diff)<2?"var(--buy)":diff>0?"#E07020":"#E74C3C";
            return (
              <tr key={r.l}>
                <td style={{fontWeight:600}}>{r.l}</td>
                <td style={{fontFamily:"IBM Plex Mono",fontWeight:700}}>{r.u!==null?r.u.toFixed(1)+r.unit:"—"}</td>
                <td style={{fontFamily:"IBM Plex Mono",color:"var(--ink-light)"}}>{r.b}{r.unit}</td>
                <td style={{fontFamily:"IBM Plex Mono",color:dc,fontWeight:700}}>{diff!==null?(diff>0?"+":"")+diff.toFixed(1)+r.unit:"—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Executive Summary narrative
function generateNarrative({ticker,companyName,intrinsic,currentPrice,marginPct,activeMethods,verdict,conf,dcfVal,grahamVal,peVal,evVal,ddmVal,riVal,growthRate,discountRate,sector}) {
  if (!intrinsic) return null;
  const name=companyName||ticker||"la empresa";
  const cp=pf(currentPrice);
  const upside=cp>0?((intrinsic/cp-1)*100):null;
  let narrative=`El análisis multi-método de <strong>${name}</strong> arroja un valor intrínseco ponderado de <strong>${fmt(intrinsic)}</strong>, basado en <strong>${activeMethods} modelo${activeMethods>1?"s":""} activo${activeMethods>1?"s":""}</strong>.`;
  if(cp>0){
    if((marginPct||0)>25) narrative+=` Con el precio actual en ${fmt(cp)}, la acción cotiza con un <strong>descuento del ${Math.round(marginPct||0)}%</strong> respecto al valor calculado, representando un potencial de upside de <strong>${pct(upside)}</strong>. Señal de compra.`;
    else if((marginPct||0)>0) narrative+=` Con el precio actual en ${fmt(cp)}, existe un margen de seguridad positivo del ${Math.round(marginPct||0)}%, pero por debajo del umbral del 25% que típicamente se considera atractivo.`;
    else narrative+=` Con el precio actual en ${fmt(cp)}, la acción cotiza por <strong>encima del valor intrínseco calculado</strong> en un ${Math.abs(Math.round(marginPct||0))}%. Se recomienda cautela.`;
  }
  if(conf.cv) narrative+=` La consistencia entre modelos es <strong>${conf.cls==="conf-high"?"alta":"moderada"}</strong> (CV: ${conf.cv}%), lo que ${conf.cls==="conf-high"?"refuerza":"modera"} la confianza en la estimación.`;
  return narrative;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 5 · MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [dark, setDark]=useState(false);
  useEffect(()=>{ document.documentElement.setAttribute("data-theme",dark?"dark":"light"); },[dark]);

  // Config
  const [ticker,setTicker]=useState("");
  const [companyName,setCompanyName]=useState("");
  const [sector,setSector]=useState("S&P 500 (Prom)");
  const [fmpKey,setFmpKey]=useState("");
  const [autofilled,setAutofilled]=useState({});
  const [activeTab,setActiveTab]=useState("modelos");
  const [selScenario,setSelScenario]=useState("base");
  const [buyMargin,setBuyMargin]=useState(30);
  const [saveErr,setSaveErr]=useState("");
  const [savedMsg,setSavedMsg]=useState(false);
  const [compareMode,setCompareMode]=useState(false);

  // Core inputs
  const [fcf,setFcf]=useState("");
  const [growthRate,setGrowthRate]=useState("10");
  const [terminalGrowth,setTerminalGrowth]=useState("3");
  const [discountRate,setDiscountRate]=useState("10");
  const [years,setYears]=useState("10");
  const [shares,setShares]=useState("");
  const [eps,setEps]=useState("");
  const [bookValue,setBookValue]=useState("");
  const [peTarget,setPeTarget]=useState("15");
  const [ebitda,setEbitda]=useState("");
  const [evMultiple,setEvMultiple]=useState("10");
  const [debt,setDebt]=useState("0");
  const [cash,setCash]=useState("0");
  const [currentPrice,setCurrentPrice]=useState("");
  const [annualDividend,setAnnualDividend]=useState("");
  const [dividendGrowth,setDividendGrowth]=useState("4");
  const [beta,setBeta]=useState("1.0");
  const [roe,setRoe]=useState("");
  const [pfcfTarget,setPfcfTarget]=useState("20");
  const [costOfEquity,setCostOfEquity]=useState("10");
  const [revenue,setRevenue]=useState("");

  // CAPM
  const [useCAPM,setUseCAPM]=useState(false);
  const [riskFree,setRiskFree]=useState("4.3");
  const [marketPremium,setMarketPremium]=useState("6.0");

  // Weights (7 methods)
  const [wDCF,setWDCF]=useState(28);
  const [wGraham,setWGraham]=useState(18);
  const [wPE,setWPE]=useState(16);
  const [wEV,setWEV]=useState(16);
  const [wDDM,setWDDM]=useState(8);
  const [wRI,setWRI]=useState(8);
  const [wPFCF,setWPFCF]=useState(6);

  // Compare
  const [comp,setComp]=useState({ticker:"",fcf:"",shares:"",growthRate:"10",terminalGrowth:"3",discountRate:"10",eps:"",bookValue:"",peTarget:"15",ebitda:"",evMultiple:"10",debt:"0",cash:"0",currentPrice:"",annualDividend:"",dividendGrowth:"4"});

  // Watchlist
  const [savedVals,setSavedVals]=useState([]);
  const [watchSearch,setWatchSearch]=useState("");
  const [watchSort,setWatchSort]=useState("date");
  useEffect(()=>{ window.__wl=window.__wl||[]; setSavedVals(window.__wl); },[]);
  const persistWL=list=>{ window.__wl=list; setSavedVals(list); };

  // Monte Carlo
  const [mcRunning,setMcRunning]=useState(false);
  const [mcResult,setMcResult]=useState(null);

  // FMP handler
  const handleFMPData=useCallback(data=>{
    const track={};
    const s=(k,setter,val)=>{ if(val!==undefined){setter(val); track[k]=!!val;} };
    s("companyName",setCompanyName,data.companyName);
    s("currentPrice",setCurrentPrice,data.currentPrice);
    s("shares",setShares,data.shares);
    s("fcf",setFcf,data.fcf);
    s("eps",setEps,data.eps);
    s("ebitda",setEbitda,data.ebitda);
    s("debt",setDebt,data.debt);
    s("cash",setCash,data.cash);
    s("bookValue",setBookValue,data.bookValue);
    s("peTarget",setPeTarget,data.peTarget);
    s("evMultiple",setEvMultiple,data.evMultiple);
    s("growthRate",setGrowthRate,data.growthRate);
    s("beta",setBeta,data.beta);
    s("annualDividend",setAnnualDividend,data.annualDividend);
    s("roe",setRoe,data.roe);
    s("revenue",setRevenue,data.revenue);
    setAutofilled(track);
  },[]);

  // CAPM WACC
  const capmWACC=useCAPM?calcCAPM({riskFree,beta,marketPremium}).toFixed(1):null;
  const effWACC=useCAPM&&capmWACC?capmWACC:discountRate;

  // Calculations
  const dcfRes=calcDCF({fcf:pf(fcf),growthRate:pf(growthRate),terminalGrowth:pf(terminalGrowth),discountRate:pf(effWACC),years:pf(years),shares:pf(shares)});
  const dcfVal=dcfRes.value;
  const grahamVal=calcGraham({eps:pf(eps),bookValue:pf(bookValue)});
  const peVal=calcPE({eps:pf(eps),peTarget:pf(peTarget)});
  const evVal=calcEV({ebitda:pf(ebitda),evMultiple:pf(evMultiple),debt:pf(debt),cash:pf(cash),shares:pf(shares)});
  const ddmVal=calcDDM({annualDividend:pf(annualDividend),dividendGrowth:pf(dividendGrowth),discountRate:pf(effWACC)});
  const riVal=calcRI({bookValue:pf(bookValue),eps:pf(eps),roe:pf(roe),costOfEquity:pf(costOfEquity),years:pf(years)});
  const pfcfVal=calcPFCF({fcf:pf(fcf),pfcfTarget:pf(pfcfTarget),shares:pf(shares)});

  const intrinsic=weightedAvg([[dcfVal,wDCF],[grahamVal,wGraham],[peVal,wPE],[evVal,wEV],[ddmVal,wDDM],[riVal,wRI],[pfcfVal,wPFCF]]);
  const hasResult=intrinsic!==null;
  const cp=pf(currentPrice);
  const marginPct=hasResult&&cp>0?((intrinsic-cp)/intrinsic)*100:null;
  const upside=hasResult&&cp>0?((intrinsic/cp-1)*100):null;
  const activeMethods=[dcfVal,grahamVal,peVal,evVal,ddmVal,riVal,pfcfVal].filter(v=>v!==null).length;
  const conf=confidenceScore([dcfVal,grahamVal,peVal,evVal,ddmVal,riVal,pfcfVal]);
  const buyTarget=hasResult?intrinsic*(1-buyMargin/100):null;
  const band=fairValueBand([dcfVal,grahamVal,peVal,evVal,ddmVal,riVal,pfcfVal]);

  const growthWarn=pf(growthRate)>=pf(effWACC);
  const terminalWarn=pf(terminalGrowth)>=pf(effWACC);

  // Scenarios
  const scenarios=SCENARIOS.map(s=>{
    const g=pf(growthRate)*s.growthMult, d=Math.max(pf(effWACC)+s.discAdd,1), tg=pf(terminalGrowth)*s.termMult;
    const sdcf=calcDCF({fcf:pf(fcf),growthRate:g,terminalGrowth:tg,discountRate:d,years:pf(years),shares:pf(shares)}).value;
    const sgr=grahamVal, spe=calcPE({eps:pf(eps),peTarget:pf(peTarget)*s.peMult}), sev=calcEV({ebitda:pf(ebitda),evMultiple:pf(evMultiple)*s.evMult,debt:pf(debt),cash:pf(cash),shares:pf(shares)});
    const sddm=calcDDM({annualDividend:pf(annualDividend),dividendGrowth:pf(dividendGrowth)*s.growthMult,discountRate:d});
    const sri=calcRI({bookValue:pf(bookValue),eps:pf(eps),roe:pf(roe),costOfEquity:pf(costOfEquity)*s.peMult});
    const iv=weightedAvg([[sdcf,wDCF],[sgr,wGraham],[spe,wPE],[sev,wEV],[sddm,wDDM],[sri,wRI]]);
    const m=iv&&cp>0?((iv-cp)/iv)*100:null;
    return {...s,iv,m};
  });

  // Compare
  const compDCF=calcDCF({fcf:pf(comp.fcf),growthRate:pf(comp.growthRate),terminalGrowth:pf(comp.terminalGrowth),discountRate:pf(comp.discountRate),years:10,shares:pf(comp.shares)}).value;
  const compGr=calcGraham({eps:pf(comp.eps),bookValue:pf(comp.bookValue)});
  const compPE=calcPE({eps:pf(comp.eps),peTarget:pf(comp.peTarget)});
  const compEV=calcEV({ebitda:pf(comp.ebitda),evMultiple:pf(comp.evMultiple),debt:pf(comp.debt),cash:pf(comp.cash),shares:pf(comp.shares)});
  const compDDM=calcDDM({annualDividend:pf(comp.annualDividend),dividendGrowth:pf(comp.dividendGrowth),discountRate:pf(comp.discountRate)});
  const compIV=weightedAvg([[compDCF,wDCF],[compGr,wGraham],[compPE,wPE],[compEV,wEV],[compDDM,wDDM]]);
  const compCP=pf(comp.currentPrice);
  const compM=compIV&&compCP>0?((compIV-compCP)/compIV)*100:null;

  // Verdict
  const getVerdict=m=>{
    if(m===null) return{label:"Ingresa precio actual",cls:"neutral",icon:"○"};
    if(m>25) return{label:"Subvalorada — Comprar",cls:"buy",icon:"▲"};
    if(m>0) return{label:"Precio justo — Mantener",cls:"hold",icon:"◆"};
    return{label:"Sobrevalorada — Cautela",cls:"sell",icon:"▼"};
  };
  const verdict=getVerdict(marginPct);
  const barColor=(marginPct??0)>25?"var(--buy)":(marginPct??0)>0?"var(--gold)":"var(--sell)";

  // Monte Carlo
  const runMC=useCallback(()=>{
    if(!fcf||!shares) return;
    setMcRunning(true);
    setTimeout(()=>{
      const res=runMonteCarlo({fcf:pf(fcf),growthRate:pf(growthRate),discountRate:pf(effWACC),terminalGrowth:pf(terminalGrowth),years:pf(years),shares:pf(shares),iterations:2500});
      setMcResult(res); setMcRunning(false);
    },100);
  },[fcf,growthRate,effWACC,terminalGrowth,years,shares]);

  // Altman Z (simplified — needs inputs)
  const wc=(pf(currentPrice)-0)*pf(shares); // simplified, use market cap as proxy
  const marketCap=cp*pf(shares);
  const totalAssets=pf(revenue)*1.5; // rough proxy if not loaded
  const altmanZ=null; // Only show when we have proper data

  // Save
  const handleSave=()=>{
    if(!ticker){setSaveErr("Ingresa el Ticker de la empresa."); return;}
    if(!hasResult){setSaveErr("Completa al menos un método de valoración."); return;}
    setSaveErr("");
    const ex=window.__wl||[];
    const hist=ex.filter(i=>i.ticker===ticker.toUpperCase()).map(i=>i.intrinsic);
    persistWL([{id:Date.now(),ticker:ticker.toUpperCase(),companyName:companyName||ticker.toUpperCase(),intrinsic,price:cp,margin:marginPct,history:[...hist,intrinsic],sector},...ex]);
    setSavedMsg(true); setTimeout(()=>setSavedMsg(false),2500);
  };
  const handleDelete=id=>persistWL((window.__wl||[]).filter(i=>i.id!==id));

  const filtered=savedVals
    .filter(i=>!watchSearch||i.ticker.includes(watchSearch.toUpperCase())||i.companyName?.toLowerCase().includes(watchSearch.toLowerCase()))
    .sort((a,b)=>watchSort==="margin"?(b.margin??-999)-(a.margin??-999):watchSort==="value"?(b.intrinsic??0)-(a.intrinsic??0):b.id-a.id);

  const portValue=savedVals.reduce((s,i)=>s+(i.intrinsic||0),0);
  const portAvgMargin=savedVals.length>0?savedVals.reduce((s,i)=>s+(i.margin||0),0)/savedVals.length:null;
  const buyCount=savedVals.filter(i=>(i.margin||0)>25).length;

  const af=k=>autofilled[k]?"auto":"";

  const narrative=hasResult?generateNarrative({ticker,companyName,intrinsic,currentPrice,marginPct,activeMethods,verdict,conf,dcfVal,grahamVal,peVal,evVal,ddmVal,riVal,growthRate,discountRate:effWACC,sector}):null;

  const ALL_METHODS=[dcfVal,grahamVal,peVal,evVal,ddmVal,riVal,pfcfVal];
  const ALL_LABELS=["DCF","Graham","P/E","EV/EBITDA","DDM","Rsd. Income","P/FCF"];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* MASTHEAD */}
        <div className="masthead">
          <div className="masthead-rule"/>
          <div className="masthead-inner">
            <div>
              <div className="masthead-eyebrow">Plataforma de Análisis Fundamental</div>
              <div className="masthead-title">Valor <em>Intrínseco</em></div>
              <div className="masthead-subtitle">
                DCF · Graham · P/E · EV/EBITDA · DDM · Renta Residual · P/FCF · Monte Carlo<br/>
                7 modelos cuantitativos · Benchmarks sectoriales · Análisis de sensibilidad
              </div>
            </div>
            <div className="masthead-controls">
              <span className="badge-edition">Pro Edition</span>
              <button className="btn-ghost" onClick={()=>setDark(d=>!d)}>{dark?"☀ Modo Claro":"☾ Modo Oscuro"}</button>
            </div>
          </div>
        </div>

        {/* FMP */}
        <FMPPanel ticker={ticker} onData={handleFMPData} fmpKey={fmpKey} setFmpKey={setFmpKey}/>

        {/* KPI BAR */}
        {hasResult&&(
          <div className="kpi-bar">
            {[
              ["Valor Intrínseco",fmt(intrinsic),"Ponderado, "+activeMethods+" modelos"],
              ["Margen Seguridad",pct(marginPct),cp>0?"vs. precio mercado":"—"],
              ["Precio de Entrada",fmt(buyTarget),"Con margen "+buyMargin+"%"],
              ["Potencial Alcista",pct(upside),cp>0?"desde precio actual":"—"],
              ["Consistencia",conf.label.split("(")[0].trim(),"CV: "+(conf.cv||"—")+"%"],
              ["Modelos Activos",activeMethods+" / 7","métodos de valoración"],
            ].map(([l,v,s])=>(
              <div key={l} className="kpi-cell">
                <div className="kpi-label">{l}</div>
                <div className="kpi-value">{v}</div>
                <div className="kpi-sub">{s}</div>
              </div>
            ))}
          </div>
        )}

        {/* EXEC SUMMARY */}
        {hasResult&&narrative&&(
          <div className="exec-summary">
            <div className="exec-summary-header">
              <div>
                <div className="exec-company">{companyName||ticker||"Empresa"}</div>
                <div className="exec-ticker">{ticker?ticker.toUpperCase():""}{sector?" · "+sector:""}</div>
              </div>
              <div className={`verdict-tag ${verdict.cls}`} style={{fontSize:"0.78rem",padding:"0.5rem 1.2rem"}}>
                {verdict.icon} {verdict.label}
              </div>
            </div>
            {band&&(
              <div className="exec-grid">
                <div className="exec-metric"><div className="exec-metric-label">Rango Bajo</div><div className="exec-metric-val" style={{color:"var(--sell)"}}>{fmt(band.low)}</div></div>
                <div className="exec-metric"><div className="exec-metric-label">Valor Central</div><div className="exec-metric-val">{fmt(intrinsic)}</div></div>
                <div className="exec-metric"><div className="exec-metric-label">Rango Alto</div><div className="exec-metric-val" style={{color:"var(--buy)"}}>{fmt(band.high)}</div></div>
                <div className="exec-metric"><div className="exec-metric-label">Precio Actual</div><div className="exec-metric-val">{fmt(cp||null)}</div></div>
              </div>
            )}
            <div className="exec-narrative" dangerouslySetInnerHTML={{__html:narrative}}/>
          </div>
        )}

        {/* EMPRESA CONFIG */}
        <div className="grid-2" style={{marginBottom:"1.5rem"}}>
          <div className="card">
            <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--ink3))"}}/>
            <div className="eyebrow">Identificación</div>
            <div className="card-heading">🏢 Empresa & Configuración</div>
            <div className="field-2">
              <div className="field"><label>Ticker / Símbolo</label><input value={ticker} onChange={e=>{setTicker(e.target.value);setSaveErr("");}} placeholder="AAPL" maxLength={8} style={{textTransform:"uppercase",fontWeight:700,fontSize:"1.1rem",letterSpacing:"0.06em"}}/></div>
              <div className="field"><label>Nombre empresa {autofilled.companyName&&<span className="auto-badge">FMP</span>}</label><input className={af("companyName")} value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Apple Inc."/></div>
            </div>
            <div className="field">
              <label>Sector <Tip text="Selecciona el sector para comparar tus supuestos con promedios históricos del mercado."/></label>
              <select value={sector} onChange={e=>setSector(e.target.value)}>
                {Object.keys(SECTORS).map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <button className="btn-secondary" style={{marginTop:"0.2rem"}} onClick={()=>setCompareMode(m=>!m)}>
              {compareMode?"✕ Cerrar comparador":"⇄ Comparar dos empresas"}
            </button>
          </div>
          <div className="card">
            <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--gold),var(--gold3))"}}/>
            <div className="eyebrow">Parámetros de Precio</div>
            <div className="card-heading">💰 Precio & Ponderación</div>
            <div className="field"><label>Precio de mercado actual ($) {autofilled.currentPrice&&<span className="auto-badge">FMP</span>}</label><input className={af("currentPrice")} value={currentPrice} onChange={e=>setCurrentPrice(e.target.value)} placeholder="150.00" type="number"/></div>
            <hr/>
            <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:"0.6rem"}}>Peso de cada modelo (suma no necesita ser 100)</div>
            <div className="weights-grid">
              {[["DCF",wDCF,setWDCF],["Graham",wGraham,setWGraham],["P/E",wPE,setWPE],["EV",wEV,setWEV],["DDM",wDDM,setWDDM],["RI",wRI,setWRI],["P/FCF",wPFCF,setWPFCF]].map(([n,v,s])=>(
                <div key={n} className="weight-chip">
                  <span className="weight-chip-label">{n}</span>
                  <input type="range" min="0" max="50" value={v} onChange={e=>s(Number(e.target.value))}/>
                  <span className="weight-chip-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tab-rail">
          {[["modelos","📐 Modelos"],["graficas","📈 Gráficas"],["bridge","🌉 Comparativa"],["montecarlo","🎲 Monte Carlo"],["escenarios","🎭 Escenarios"],["heatmap","🗺️ Sensibilidad"],["benchmarks","📊 Benchmarks"]].map(([k,l])=>(
            <button key={k} className={`tab-btn ${activeTab===k?"active":""}`} onClick={()=>setActiveTab(k)}>{l}</button>
          ))}
        </div>

        {/* ════════════ TAB: MODELOS ════════════ */}
        {activeTab==="modelos"&&(
          <div className="grid-2">

            {/* DCF */}
            <div className="card">
              <div className="card-edge" style={{background:"linear-gradient(180deg,#0E3A6E,#2A6E8A)"}}/>
              <div className="method-pill">Modelo 01 · Flujo de Caja</div>
              <div className="card-heading"><span className={`signal-dot ${dcfVal?"active":"inactive"}`}/>Flujo de Caja Descontado (DCF)</div>
              <div className="field"><label>FCF promedio 3-4 años (Millones $) {autofilled.fcf&&<span className="auto-badge">FMP</span>} <Tip text="Free Cash Flow promedio. FMP calcula el promedio de 4 años automáticamente. Usa cifras reales, no ajustadas."/></label><input className={af("fcf")} value={fcf} onChange={e=>setFcf(e.target.value)} placeholder="ej. 5,000" type="number"/></div>
              <div className="slider-row">
                <div className="slider-header">Tasa de crecimiento anual {autofilled.growthRate&&<span className="auto-badge">FMP</span>} <Tip text="CAGR esperado del FCF. FMP usa el crecimiento de ingresos YoY como proxy."/><span className="slider-val">{growthRate}%</span></div>
                <input type="range" min="1" max="35" value={growthRate} onChange={e=>setGrowthRate(e.target.value)}/>
              </div>
              <div className="slider-row">
                <div className="slider-header">Crecimiento terminal (TV) <Tip text="Tasa de crecimiento a perpetuidad post-proyección. Estándar: 2-3%. Nunca debe superar el WACC."/><span className="slider-val">{terminalGrowth}%</span></div>
                <input type="range" min="1" max="5" step="0.5" value={terminalGrowth} onChange={e=>setTerminalGrowth(e.target.value)}/>
              </div>
              {/* CAPM */}
              <div className="capm-box">
                <label className="capm-toggle"><input type="checkbox" checked={useCAPM} onChange={e=>setUseCAPM(e.target.checked)}/> Calcular WACC via CAPM {useCAPM&&<span className="auto-badge" style={{background:"rgba(26,107,74,0.12)",color:"var(--buy)",borderColor:"var(--buy-border)"}}>ACTIVO</span>}</label>
                {useCAPM&&(
                  <div className="field-3" style={{marginTop:"0.8rem"}}>
                    <div className="field" style={{marginBottom:0}}><label>Risk-Free % <Tip text="US Treasury 10Y actual ~4.3%"/></label><input value={riskFree} onChange={e=>setRiskFree(e.target.value)} type="number" step="0.1" placeholder="4.3"/></div>
                    <div className="field" style={{marginBottom:0}}><label>Beta {autofilled.beta&&<span className="auto-badge">FMP</span>}</label><input className={af("beta")} value={beta} onChange={e=>setBeta(e.target.value)} type="number" step="0.05" placeholder="1.0"/></div>
                    <div className="field" style={{marginBottom:0}}><label>Prima mercado % <Tip text="Equity Risk Premium histórico S&P: ~6%"/></label><input value={marketPremium} onChange={e=>setMarketPremium(e.target.value)} type="number" step="0.1" placeholder="6.0"/></div>
                  </div>
                )}
                {useCAPM&&capmWACC&&<div className="capm-result">✓ WACC = {riskFree}% + {beta}β × {marketPremium}% = <strong>{capmWACC}%</strong></div>}
              </div>
              {!useCAPM&&(
                <div className="slider-row" style={{marginTop:"0.8rem"}}>
                  <div className="slider-header">WACC / Tasa de descuento <Tip text="Activa CAPM para calcularlo con precisión basada en Beta y primas de mercado."/><span className="slider-val">{discountRate}%</span></div>
                  <input type="range" min="4" max="20" value={discountRate} onChange={e=>setDiscountRate(e.target.value)}/>
                </div>
              )}
              {growthWarn&&<div className="alert warn"><span className="alert-icon">⚠</span>Crecimiento ({growthRate}%) ≥ WACC ({effWACC}%): insostenible a largo plazo.</div>}
              {terminalWarn&&<div className="alert warn"><span className="alert-icon">⚠</span>Crecimiento terminal ({terminalGrowth}%) ≥ WACC: produce valor negativo o infinito.</div>}
              <div className="slider-row" style={{marginTop:"0.8rem"}}>
                <div className="slider-header">Horizonte de proyección <Tip text="10 años es el estándar de la industria. Usa 5 para high-growth en etapas tempranas."/><span className="slider-val">{years} años</span></div>
                <input type="range" min="5" max="15" value={years} onChange={e=>setYears(e.target.value)}/>
              </div>
              <div className="field"><label>Acciones en circulación (Millones) {autofilled.shares&&<span className="auto-badge">FMP</span>}</label><input className={af("shares")} value={shares} onChange={e=>setShares(e.target.value)} placeholder="ej. 1,000" type="number"/></div>
              {dcfVal&&<div className="alert success"><span>✓</span>DCF: {fmt(dcfVal)}{dcfRes.pvTV&&shares?` · TV/acción: ${fmt(dcfRes.pvTV/pf(shares))}`:""}</div>}
            </div>

            {/* Graham + P/E */}
            <div style={{display:"flex",flexDirection:"column",gap:"1.4rem"}}>
              <div className="card">
                <div className="card-edge" style={{background:"linear-gradient(180deg,#B8922A,#D4B030)"}}/>
                <div className="method-pill">Modelo 02 · Número de Graham</div>
                <div className="card-heading"><span className={`signal-dot ${grahamVal?"active":"inactive"}`}/>Graham Number</div>
                <div className="field-2">
                  <div className="field"><label>EPS ($) {autofilled.eps&&<span className="auto-badge">FMP</span>} <Tip text="Earnings Per Share del último año fiscal completo."/></label><input className={af("eps")} value={eps} onChange={e=>setEps(e.target.value)} placeholder="6.50" type="number"/></div>
                  <div className="field"><label>Book Value / acción ($) {autofilled.bookValue&&<span className="auto-badge">FMP</span>} <Tip text="Valor en libros por acción = Patrimonio neto / Acciones en circulación."/></label><input className={af("bookValue")} value={bookValue} onChange={e=>setBookValue(e.target.value)} placeholder="20.00" type="number"/></div>
                </div>
                <div className="ri-box">√(22.5 × EPS × Book Value) — Fórmula original Benjamin Graham</div>
                {grahamVal&&<div className="alert success" style={{marginTop:"0.6rem"}}><span>✓</span>Graham Number: {fmt(grahamVal)}</div>}
              </div>

              <div className="card">
                <div className="card-edge" style={{background:"linear-gradient(180deg,#1C3080,#3A60B8)"}}/>
                <div className="method-pill">Modelo 03 · Múltiplo P/E</div>
                <div className="card-heading"><span className={`signal-dot ${peVal?"active":"inactive"}`}/>Valoración por P/E</div>
                <div className="field"><label style={{color:"var(--ink-light)"}}>EPS — compartido con Graham</label><input value={eps} readOnly/></div>
                <div className="slider-row">
                  <div className="slider-header">P/E objetivo del sector {autofilled.peTarget&&<span className="auto-badge">FMP</span>} <Tip text="P/E normalizado del sector. Revisa la pestaña Benchmarks para referencias históricas."/><span className="slider-val">{peTarget}×</span></div>
                  <input type="range" min="5" max="65" value={peTarget} onChange={e=>setPeTarget(e.target.value)}/>
                </div>
                <div className="ri-box">EPS × P/E objetivo — Valora por múltiplo de ganancias</div>
                {peVal&&<div className="alert success" style={{marginTop:"0.6rem"}}><span>✓</span>P/E: {fmt(peVal)}</div>}
              </div>
            </div>

            {/* EV/EBITDA */}
            <div className="card">
              <div className="card-edge" style={{background:"linear-gradient(180deg,#5A3A00,#B8922A)"}}/>
              <div className="method-pill">Modelo 04 · Enterprise Value</div>
              <div className="card-heading"><span className={`signal-dot ${evVal?"active":"inactive"}`}/>EV / EBITDA</div>
              <div className="field-2">
                <div className="field"><label>EBITDA (M$) {autofilled.ebitda&&<span className="auto-badge">FMP</span>}</label><input className={af("ebitda")} value={ebitda} onChange={e=>setEbitda(e.target.value)} placeholder="ej. 8,000" type="number"/></div>
                <div className="field"><label>Múltiplo EV/EBITDA {autofilled.evMultiple&&<span className="auto-badge">FMP</span>} <Tip text="S&P500: 10-15×. Tecnología: 15-25×. Ver benchmarks sectoriales."/></label><input className={af("evMultiple")} value={evMultiple} onChange={e=>setEvMultiple(e.target.value)} placeholder="10" type="number"/></div>
              </div>
              <div className="field-2">
                <div className="field"><label>Deuda total (M$) {autofilled.debt&&<span className="auto-badge">FMP</span>}</label><input className={af("debt")} value={debt} onChange={e=>setDebt(e.target.value)} placeholder="ej. 2,000" type="number"/></div>
                <div className="field"><label>Efectivo & equivalentes (M$) {autofilled.cash&&<span className="auto-badge">FMP</span>}</label><input className={af("cash")} value={cash} onChange={e=>setCash(e.target.value)} placeholder="ej. 1,500" type="number"/></div>
              </div>
              <div className="field"><label style={{color:"var(--ink-light)"}}>Acciones (M) — compartidas con DCF</label><input value={shares} readOnly/></div>
              <div className="ri-box">(EBITDA × Múltiplo − Deuda + Efectivo) / Acciones</div>
              {evVal&&<div className="alert success"><span>✓</span>EV/EBITDA: {fmt(evVal)}</div>}
            </div>

            {/* DDM + RI + P/FCF */}
            <div style={{display:"flex",flexDirection:"column",gap:"1.4rem"}}>
              <div className="card">
                <div className="card-edge" style={{background:"linear-gradient(180deg,#7C2E8A,#A850C8)"}}/>
                <div className="method-pill">Modelo 05 · Gordon Growth</div>
                <div className="card-heading"><span className={`signal-dot ${ddmVal?"active":"inactive"}`}/>Dividend Discount Model (DDM)</div>
                <div className="field-2">
                  <div className="field"><label>Dividendo anual ($) {autofilled.annualDividend&&<span className="auto-badge">FMP</span>} <Tip text="FMP calcula la suma de dividendos de los últimos 4 trimestres automáticamente."/></label><input className={af("annualDividend")} value={annualDividend} onChange={e=>setAnnualDividend(e.target.value)} placeholder="ej. 0.96" type="number" step="0.01"/></div>
                  <div className="field"><label>Crecimiento dividendo %</label><input value={dividendGrowth} onChange={e=>setDividendGrowth(e.target.value)} placeholder="4" type="number" step="0.5"/></div>
                </div>
                <div className="ri-box">Div × (1+g) / (WACC − g) — Solo empresas que pagan dividendos</div>
                {!annualDividend&&<div className="alert info" style={{marginTop:"0.5rem"}}><span>ℹ</span>Usa FMP para cargar dividendos históricos automáticamente.</div>}
                {ddmVal&&<div className="alert success" style={{marginTop:"0.6rem"}}><span>✓</span>DDM: {fmt(ddmVal)}</div>}
              </div>

              <div className="card">
                <div className="card-edge" style={{background:"linear-gradient(180deg,#1A6B4A,#2ECC71)"}}/>
                <div className="method-pill">Modelo 06 · Renta Residual — Nuevo</div>
                <div className="card-heading"><span className={`signal-dot ${riVal?"active":"inactive"}`}/>Residual Income Model (RI)</div>
                <div className="field-2">
                  <div className="field"><label>ROE (%) {autofilled.roe&&<span className="auto-badge">FMP</span>} <Tip text="Return on Equity. Si está vacío, se calcula como EPS/Book Value."/></label><input className={af("roe")} value={roe} onChange={e=>setRoe(e.target.value)} placeholder="ej. 18" type="number"/></div>
                  <div className="field"><label>Costo de capital (Ke) % <Tip text="Expected return del accionista. Generalmente igual al WACC o ligeramente mayor."/></label><input value={costOfEquity} onChange={e=>setCostOfEquity(e.target.value)} placeholder="10" type="number"/></div>
                </div>
                <div className="ri-box">BV + Σ[BV × (ROE−Ke)/(1+Ke)^t] + TV — Modelo de Residual Income de Ohlson</div>
                {!bookValue&&!eps&&<div className="alert info" style={{marginTop:"0.5rem"}}><span>ℹ</span>Requiere Book Value/acción y EPS del modelo Graham.</div>}
                {riVal&&<div className="alert success" style={{marginTop:"0.6rem"}}><span>✓</span>Residual Income: {fmt(riVal)}</div>}
              </div>

              <div className="card">
                <div className="card-edge" style={{background:"linear-gradient(180deg,#2A6E8A,#50A8C8)"}}/>
                <div className="method-pill">Modelo 07 · Price / FCF — Nuevo</div>
                <div className="card-heading"><span className={`signal-dot ${pfcfVal?"active":"inactive"}`}/>Valoración Price/FCF</div>
                <div className="slider-row">
                  <div className="slider-header">Múltiplo P/FCF objetivo {autofilled.pfcf&&<span className="auto-badge">FMP</span>} <Tip text="Comparable a P/E pero usando FCF. Evita distorsiones contables. Tecnología: 20-30×."/><span className="slider-val">{pfcfTarget}×</span></div>
                  <input type="range" min="5" max="60" value={pfcfTarget} onChange={e=>setPfcfTarget(e.target.value)}/>
                </div>
                <div className="field"><label style={{color:"var(--ink-light)"}}>FCF & Acciones — compartidos con DCF</label><input value={fcf?fcf+" M$ FCF · "+shares+" M acc.":""} readOnly placeholder="Completa DCF primero"/></div>
                <div className="ri-box">(FCF × Múltiplo P/FCF) / Acciones en circulación</div>
                {pfcfVal&&<div className="alert success"><span>✓</span>P/FCF: {fmt(pfcfVal)}</div>}
              </div>
            </div>

            {/* RESULTADO CONSOLIDADO */}
            <div className="card col-full">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--gold),var(--buy))"}}/>
              <div className="eyebrow">Resultado Consolidado · {activeMethods} de 7 modelos activos</div>
              <div className="card-heading">🎯 Valoración Ponderada Final</div>
              <div className="method-results">
                {[["DCF",dcfVal,"#0E3A6E"],["Graham",grahamVal,"#B8922A"],["P/E",peVal,"#1C3080"],["EV/EBITDA",evVal,"#5A3A00"],["DDM",ddmVal,"#7C2E8A"],["Rsd. Income",riVal,"#1A6B4A"],["P/FCF",pfcfVal,"#2A6E8A"]].map(([l,v,c])=>{
                  const d=v&&cp>0?((v-cp)/cp)*100:null;
                  return (
                    <div key={l} className="mbox">
                      <div className="mbox-label">{l}</div>
                      <div className="mbox-value" style={{color:v?c:"var(--ink-light)"}}><NumVal value={v}/></div>
                      {d!==null&&<div className="mbox-delta" style={{color:d>0?"var(--buy)":"var(--sell)"}}>{d>0?"+":""}{d.toFixed(1)}% vs. mercado</div>}
                    </div>
                  );
                })}
              </div>

              {/* Fair Value Band */}
              {band&&(
                <div className="fv-band">
                  <div className="fv-band-item"><div className="fv-band-label">Rango Bajo (peor modelo)</div><div className="fv-band-val" style={{color:"var(--sell)"}}>{fmt(band.low)}</div></div>
                  <div className="fv-band-item"><div className="fv-band-label">Valor Central (mediana)</div><div className="fv-band-val">{fmt(band.mid)}</div></div>
                  <div className="fv-band-item"><div className="fv-band-label">Intrínseco Ponderado</div><div className="fv-band-val" style={{color:"var(--gold)"}}>{fmt(intrinsic)}</div></div>
                  <div className="fv-band-item"><div className="fv-band-label">Rango Alto (mejor modelo)</div><div className="fv-band-val" style={{color:"var(--buy)"}}>{fmt(band.high)}</div></div>
                </div>
              )}

              {hasResult?(
                <>
                  <div className="buy-target-box" style={{marginTop:"1rem"}}>
                    <div>
                      <div style={{fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:"0.25rem"}}>Precio máximo de entrada</div>
                      <div className="buy-target-price"><NumVal value={buyTarget}/></div>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <div className="slider-header">Margen de seguridad deseado <span className="slider-val">{buyMargin}%</span></div>
                      <input type="range" min="5" max="50" value={buyMargin} onChange={e=>setBuyMargin(Number(e.target.value))}/>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:"0.62rem",color:"var(--ink-light)",marginBottom:"0.2rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>Upside potencial</div>
                      <div style={{fontFamily:"IBM Plex Mono",fontSize:"1.4rem",fontWeight:700,color:(upside||0)>0?"var(--buy)":"var(--sell)"}}>{pct(upside)}</div>
                    </div>
                  </div>

                  <div className="verdict-panel">
                    <div>
                      <div className="verdict-eyebrow">Valor Intrínseco Ponderado</div>
                      <div className="verdict-number"><NumVal value={intrinsic}/></div>
                    </div>
                    <div className="verdict-meta">
                      <div className={`verdict-tag ${verdict.cls}`}>{verdict.icon} {verdict.label}</div>
                      <div><span className={`confidence-badge ${conf.cls}`}>◆ {conf.label}</span></div>
                      {conf.note&&<div style={{fontSize:"0.68rem",color:"var(--ink-light)",marginTop:"0.5rem"}}>{conf.note}</div>}
                      {cp>0&&(
                        <>
                          <div className="margin-track" style={{marginTop:"1rem"}}>
                            <div className="margin-fill" style={{width:Math.max(0,Math.min(100,marginPct??0))+"%",background:barColor}}/>
                          </div>
                          <div className="margin-labels"><span>Margen: {pct(marginPct)}</span><span>Precio: {fmt(cp)}</span><span>Valor: {fmt(intrinsic)}</span></div>
                        </>
                      )}
                    </div>
                  </div>
                  {saveErr&&<div className="alert err" style={{marginTop:"0.8rem"}}><span>⚠</span>{saveErr}</div>}
                  {savedMsg&&<div className="alert success" style={{marginTop:"0.8rem"}}><span>✓</span>Guardado exitosamente en la Watchlist</div>}
                  <button className="btn-primary wide" onClick={handleSave}>＋ Guardar {ticker||"empresa"} en Watchlist</button>
                </>
              ):(
                <div style={{textAlign:"center",padding:"2.5rem",color:"var(--ink-light)"}}>Completa al menos un modelo de valoración para ver el resultado consolidado.</div>
              )}
            </div>
          </div>
        )}

        {/* ════════════ TAB: GRÁFICAS ════════════ */}
        {activeTab==="graficas"&&(
          <div className="grid-2">
            <div className="card col-full">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--gold))"}}/>
              <div className="card-heading">🎚️ Velocímetro de Margen de Seguridad</div>
              <div style={{display:"flex",gap:"2.5rem",flexWrap:"wrap",alignItems:"flex-start"}}>
                <GaugeChart marginPct={marginPct} intrinsic={intrinsic} price={cp||null} upside={upside}/>
                <div style={{flex:1,minWidth:220}}>
                  <div style={{fontSize:"0.78rem",color:"var(--ink-light)",lineHeight:1.75,marginBottom:"1rem"}}>El velocímetro muestra el margen de seguridad entre el valor intrínseco ponderado y el precio de mercado actual. Un margen positivo indica que la acción cotiza con descuento.</div>
                  {[["🔴","Sobrevalorada: precio superior al valor intrínseco"],["🟠","Levemente cara: margen negativo pero acotado"],["🟡","Precio justo: dentro del rango de valor razonable"],["🟢","Subvalorada: descuento >25% — señal de compra"],["🩵","Fuerte descuento >50% — oportunidad excepcional"]].map(([ic,d])=>(
                    <div key={ic} style={{display:"flex",gap:"0.5rem",marginBottom:"0.45rem",fontSize:"0.73rem"}}><span style={{flexShrink:0}}>{ic}</span><span style={{color:"var(--ink-light)"}}>{d}</span></div>
                  ))}
                  {band&&(
                    <div className="fv-band" style={{marginTop:"1rem"}}>
                      <div className="fv-band-item"><div className="fv-band-label">Rango bajo</div><div className="fv-band-val" style={{color:"var(--sell)"}}>{fmt(band.low)}</div></div>
                      <div className="fv-band-item"><div className="fv-band-label">Central</div><div className="fv-band-val">{fmt(intrinsic)}</div></div>
                      <div className="fv-band-item"><div className="fv-band-label">Rango alto</div><div className="fv-band-val" style={{color:"var(--buy)"}}>{fmt(band.high)}</div></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--c6))"}}/>
              <div className="card-heading">🔷 Radar Multi-Modelo</div>
              <RadarComp vals={ALL_METHODS} isDark={dark}/>
              <div style={{fontSize:"0.68rem",color:"var(--ink-light)",textAlign:"center"}}>Polígono más regular = mayor consistencia entre modelos. El área refleja la solidez del análisis.</div>
            </div>

            <div className="card">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--buy),var(--gold))"}}/>
              <div className="card-heading">🌊 Cascada DCF — Composición del Valor</div>
              {dcfRes.totalPV?(
                <>
                  <WaterfallComp totalPV={dcfRes.totalPV} pvTV={dcfRes.pvTV} shares={pf(shares)} isDark={dark}/>
                  <div className="waterfall-labels">
                    <span>FCF Ops: {fmt(dcfRes.totalPV/pf(shares))}</span>
                    <span>TV: {fmt(dcfRes.pvTV/pf(shares))}</span>
                    <span style={{color:"var(--buy)",fontWeight:800}}>Total: {fmt(dcfVal)}</span>
                  </div>
                  <div style={{marginTop:"0.8rem",fontSize:"0.7rem",color:"var(--ink-light)"}}>
                    El valor terminal representa <strong style={{color:"var(--ink)"}}>{dcfVal?Math.round(dcfRes.pvTV/pf(shares)/dcfVal*100):0}%</strong> del valor intrínseco DCF total. Valores >70% indican alta sensibilidad al WACC terminal.
                  </div>
                </>
              ):<div style={{textAlign:"center",padding:"2rem",color:"var(--ink-light)"}}>Completa el modelo DCF para ver la cascada de valor.</div>}
            </div>

            <div className="card col-full">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--ink3))"}}/>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot" style={{background:"var(--gold)"}}/> FCF Proyectado (barras)</span>
                <span className="legend-item"><span className="legend-line" style={{background:dark?"#4A6A9A":"#0E1420"}}/> PV del FCF (línea)</span>
              </div>
              <div className="card-heading">📈 Proyección DCF · {years} años</div>
              {dcfRes.projections.length>0?<DCFChartComp projections={dcfRes.projections} isDark={dark}/>:<div style={{textAlign:"center",padding:"2rem",color:"var(--ink-light)"}}>Completa el modelo DCF.</div>}
            </div>
          </div>
        )}

        {/* ════════════ TAB: BRIDGE ════════════ */}
        {activeTab==="bridge"&&(
          <div className="grid-2">
            <div className="card col-full">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--gold),var(--buy),var(--c4))"}}/>
              <div className="card-heading">🌉 Comparativa entre Modelos — Bridge Chart</div>
              <div style={{fontSize:"0.76rem",color:"var(--ink-light)",marginBottom:"1.2rem",lineHeight:1.7}}>Visualiza el rango de valoración de cada modelo activo. La dispersión entre barras refleja el nivel de incertidumbre en los supuestos utilizados. Modelos con valores similares refuerzan la señal de inversión.</div>
              {activeMethods>=2?(
                <BridgeComp methods={ALL_METHODS} labels={ALL_LABELS} isDark={dark}/>
              ):<div style={{textAlign:"center",padding:"2rem",color:"var(--ink-light)"}}>Activa al menos 2 modelos de valoración para ver la comparativa.</div>}
            </div>

            {compareMode&&(
              <div className="card col-full">
                <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--gold))"}}/>
                <div className="card-heading">⇄ Comparador de Empresas</div>
                <div className="compare-grid">
                  <div>
                    <div style={{fontFamily:"IBM Plex Mono",fontWeight:800,color:"var(--ink)",marginBottom:"1rem",fontSize:"1.1rem"}}>{ticker||"Empresa A"}</div>
                    {[["Valor Intrínseco",fmt(intrinsic)],["Precio",fmt(cp)],["Margen",pct(marginPct)],["Upside",pct(upside)],["DCF",fmt(dcfVal)],["Graham",fmt(grahamVal)],["P/E",fmt(peVal)],["EV/EBITDA",fmt(evVal)],["DDM",fmt(ddmVal)],["RI",fmt(riVal)],["P/FCF",fmt(pfcfVal)]].map(([k,v])=>(
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"1rem"}}>
                      <span style={{fontWeight:700,color:"var(--ink)"}}>Empresa B</span>
                      <input value={comp.ticker} onChange={e=>setComp(c=>({...c,ticker:e.target.value}))} placeholder="Ticker" style={{width:80,border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"0.25rem 0.5rem",fontSize:"0.9rem",fontWeight:800,textTransform:"uppercase",fontFamily:"IBM Plex Mono",background:"var(--surface)",color:"var(--ink)"}}/>
                    </div>
                    {[["FCF (M$)","fcf"],["Acciones (M)","shares"],["Crec.%","growthRate"],["WACC%","discountRate"],["EPS","eps"],["Book Val","bookValue"],["P/E obj","peTarget"],["EBITDA","ebitda"],["Divid.($)","annualDividend"],["Div.Crec%","dividendGrowth"],["EV/EBITDA","evMultiple"]].map(([l,k])=>(
                      <div key={k} className="compare-row">
                        <span className="compare-key">{l}</span>
                        <input value={comp[k]||""} onChange={e=>setComp(c=>({...c,[k]:e.target.value}))} type="number" placeholder="—" style={{width:110,border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"0.3rem 0.55rem",fontSize:"0.8rem",background:"var(--surface2)",textAlign:"right",fontFamily:"IBM Plex Mono",color:"var(--ink)"}}/>
                      </div>
                    ))}
                    <hr/>
                    {[["Valor Intrínseco",fmt(compIV)],["Precio",fmt(compCP)],["Margen",pct(compM)],["Upside",compIV&&compCP>0?pct((compIV/compCP-1)*100):"—"],["DCF",fmt(compDCF)],["Graham",fmt(compGr)],["P/E",fmt(compPE)],["EV/EBITDA",fmt(compEV)],["DDM",fmt(compDDM)]].map(([k,v])=>(
                      <div key={k} className="compare-row"><span className="compare-key">{k}</span><span className="compare-val">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ TAB: MONTE CARLO ════════════ */}
        {activeTab==="montecarlo"&&(
          <div className="grid-2">
            <div className="card col-full">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,#7C2E8A,#B8922A,#1A6B4A)"}}/>
              <div className="card-heading">🎲 Simulación Monte Carlo — Distribución de Riesgo</div>
              <div style={{fontSize:"0.78rem",color:"var(--ink-light)",marginBottom:"1.4rem",lineHeight:1.75,maxWidth:720}}>
                Ejecuta <strong style={{color:"var(--ink)"}}>2,500 escenarios</strong> variando aleatoriamente el crecimiento (±65%), el WACC (±50%) y el crecimiento terminal (±2pp) con distribuciones aleatorias. Produce la distribución completa de posibles valores intrínsecos con percentiles clave.
              </div>
              {!fcf||!shares?(
                <div className="alert warn"><span>⚠</span>Completa FCF y Acciones en circulación en el modelo DCF para ejecutar la simulación Monte Carlo.</div>
              ):(
                <>
                  <button className="btn-gold" onClick={runMC} disabled={mcRunning} style={{marginBottom:"1.3rem"}}>
                    {mcRunning?<><div className="spinner dark"/>Simulando 2,500 escenarios...</>:"▶ Ejecutar Simulación Monte Carlo"}
                  </button>
                  {mcResult&&(
                    <>
                      <div className="mc-results">
                        {[["P10 — Pesimista",mcResult.p10],["P25",mcResult.p25],["P50 — Mediana",mcResult.p50],["Media ponderada",mcResult.mean],["P75",mcResult.p75],["P90 — Optimista",mcResult.p90]].map(([l,v])=>(
                          <div key={l} className="mc-box">
                            <div className="mc-label">{l}</div>
                            <div className="mc-val" style={{color:v>cp&&cp>0?"var(--buy)":v<cp&&cp>0?"var(--sell)":"var(--ink)"}}>{fmt(v)}</div>
                          </div>
                        ))}
                      </div>
                      {cp>0&&(
                        <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"0.9rem 1.2rem",marginBottom:"1rem",fontSize:"0.78rem",color:"var(--ink-light)",lineHeight:1.7}}>
                          <strong style={{color:"var(--ink)"}}>Probabilidad de estar subvalorada al precio actual ({fmt(cp)}):</strong>&nbsp;
                          <strong style={{color:"var(--buy)",fontSize:"1rem"}}>{(mcResult.raw.filter(v=>v>cp).length/mcResult.raw.length*100).toFixed(1)}%</strong> de los 2,500 escenarios muestran un valor intrínseco superior al precio actual.
                          &nbsp;Rango P10–P90: {fmt(mcResult.p10)} — {fmt(mcResult.p90)}.
                        </div>
                      )}
                      <div className="card-heading" style={{fontSize:"0.9rem",marginBottom:"0.6rem"}}>Distribución de Valores Intrínsecos</div>
                      <div style={{fontSize:"0.68rem",color:"var(--ink-light)",marginBottom:"0.6rem"}}>
                        <span style={{color:"#E74C3C"}}>── P10 (pesimista)</span>&nbsp;&nbsp;
                        <span style={{color:"#B8922A"}}>── P50 (mediana)</span>&nbsp;&nbsp;
                        <span style={{color:"#1A6B4A"}}>── P90 (optimista)</span>&nbsp;&nbsp;
                        {cp>0&&<span style={{color:"#E74C3C"}}>🔴 barra roja = precio actual</span>}
                      </div>
                      <HistogramComp mc={mcResult} cp={cp} isDark={dark}/>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ════════════ TAB: ESCENARIOS ════════════ */}
        {activeTab==="escenarios"&&(
          <div>
            <div className="card" style={{marginBottom:"1.5rem"}}>
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--sell),var(--gold),var(--buy))"}}/>
              <div className="card-heading">🎭 Análisis de Escenarios — Pesimista · Base · Optimista</div>
              <div className="scenario-grid">
                {scenarios.map(s=>(
                  <div key={s.key} className={`scenario-card ${selScenario===s.key?"active":""}`} onClick={()=>setSelScenario(s.key)}>
                    <div className="scenario-label">{s.icon} {s.key}</div>
                    <div className="scenario-name">{s.name}</div>
                    <div className="scenario-val" style={{color:s.iv?(s.m>0?"var(--buy)":"var(--sell)"):"var(--ink-light)"}}>{fmt(s.iv)}</div>
                    <div className="scenario-sub">Margen: {pct(s.m)}</div>
                    {s.iv&&cp>0&&<div className="scenario-sub">Upside: {pct((s.iv/cp-1)*100)}</div>}
                  </div>
                ))}
              </div>
              <div style={{fontSize:"0.7rem",color:"var(--ink-light)",lineHeight:1.75}}>
                Los escenarios ajustan automáticamente el crecimiento (×{SCENARIOS[0].growthMult}/{SCENARIOS[1].growthMult}/{SCENARIOS[2].growthMult}), WACC ({SCENARIOS[0].discAdd>0?"+":""}{SCENARIOS[0].discAdd}/{SCENARIOS[1].discAdd}/{SCENARIOS[2].discAdd}pp) y múltiplos sectoriales.
              </div>
            </div>
          </div>
        )}

        {/* ════════════ TAB: HEATMAP ════════════ */}
        {activeTab==="heatmap"&&(
          <div className="card col-full">
            <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--buy),var(--sell))"}}/>
            <div className="card-heading">🗺️ Mapa de Sensibilidad — WACC vs. Crecimiento (DCF)</div>
            <div style={{fontSize:"0.75rem",color:"var(--ink-light)",marginBottom:"1.1rem",lineHeight:1.7}}>Cada celda muestra el valor intrínseco DCF para una combinación específica de WACC y tasa de crecimiento del FCF. <strong style={{color:"var(--ink)"}}>Haz clic en cualquier celda</strong> para ver el desglose completo. Las celdas de la diagonal están inhabilitadas (crecimiento ≥ WACC).</div>
            <SensitivityHeatmap fcf={fcf} terminalGrowth={terminalGrowth} shares={shares} currentPrice={currentPrice}/>
          </div>
        )}

        {/* ════════════ TAB: BENCHMARKS ════════════ */}
        {activeTab==="benchmarks"&&(
          <div className="grid-2">
            <div className="card col-full">
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--ink),var(--gold))"}}/>
              <div className="card-heading">📊 Benchmarks Sectoriales — {sector}</div>
              <div style={{fontSize:"0.75rem",color:"var(--ink-light)",marginBottom:"1.2rem"}}>Compara tus múltiplos y supuestos con promedios históricos del sector seleccionado. Una diferencia positiva indica que usas supuestos más agresivos que el mercado.</div>
              <BenchmarkTable sector={sector} peTarget={peTarget} evMultiple={evMultiple} growthRate={growthRate} discountRate={effWACC}/>
            </div>

            <div className="card col-full" style={{marginTop:"0.3rem"}}>
              <div className="card-top-bar" style={{background:"linear-gradient(90deg,var(--gold),var(--buy))"}}/>
              <div className="card-heading">🌐 Comparativa Global de Sectores</div>
              <div style={{overflowX:"auto"}}>
                <table className="bench-table">
                  <thead><tr><th>Sector</th><th>P/E</th><th>EV/EBITDA</th><th>P/FCF</th><th>Crec.%</th><th>WACC%</th><th>Descripción</th></tr></thead>
                  <tbody>
                    {Object.entries(SECTORS).map(([name,data])=>(
                      <tr key={name} className={name===sector?"bench-highlight":""}>
                        <td style={{fontWeight:700}}>{name===sector?"★ ":""}{name}</td>
                        <td style={{fontFamily:"IBM Plex Mono"}}>{data.pe}×</td>
                        <td style={{fontFamily:"IBM Plex Mono"}}>{data.ev}×</td>
                        <td style={{fontFamily:"IBM Plex Mono"}}>{data.pfcf}×</td>
                        <td style={{fontFamily:"IBM Plex Mono"}}>{data.growth}%</td>
                        <td style={{fontFamily:"IBM Plex Mono"}}>{data.wacc}%</td>
                        <td style={{fontSize:"0.7rem",color:"var(--ink-light)"}}>{data.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{fontSize:"0.65rem",color:"var(--ink-light)",marginTop:"0.8rem"}}>★ = Sector activo. Fuente: promedios históricos S&P 500 por sector (2015-2024).</div>
            </div>
          </div>
        )}

        {/* WATCHLIST */}
        {savedVals.length>0&&(
          <div className="watchlist">
            <div className="section-heading">📋 Watchlist & Portfolio</div>
            {savedVals.length>=2&&(
              <div className="portfolio-stats">
                {[["Empresas",""+savedVals.length],["Valor total",fmtM(portValue)],["Margen promedio",pct(portAvgMargin)],["Señales compra",""+buyCount]].map(([l,v])=>(
                  <div key={l} className="portfolio-stat">
                    <div className="portfolio-stat-label">{l}</div>
                    <div className="portfolio-stat-val">{v}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="watch-controls">
              <input className="watch-input" placeholder="🔍 Buscar ticker o empresa..." value={watchSearch} onChange={e=>setWatchSearch(e.target.value)}/>
              <select className="watch-select" value={watchSort} onChange={e=>setWatchSort(e.target.value)}>
                <option value="date">⟳ Más reciente</option>
                <option value="margin">↑ Mayor margen</option>
                <option value="value">$ Mayor valor</option>
              </select>
            </div>
            {filtered.map(item=>(
              <div key={item.id} className="watch-card">
                <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center"}}>
                      <span className="watch-ticker">{item.ticker}</span>
                      {item.history?.length>1&&<Sparkline history={item.history}/>}
                    </div>
                    <div className="watch-name">{item.companyName}{item.sector?" · "+item.sector:""}</div>
                  </div>
                </div>
                <div>
                  <div className="watch-val" style={{color:(item.margin??0)>25?"var(--buy)":(item.margin??0)>0?"var(--gold)":"var(--sell)"}}>{fmt(item.intrinsic)}</div>
                  <div className="watch-price">Precio: {fmt(item.price)} <span style={{color:(item.margin??0)>0?"var(--buy)":"var(--sell)",fontWeight:700}}>({pct(item.margin)})</span></div>
                  <span className={`confidence-badge ${(item.margin??0)>25?"conf-high":(item.margin??0)>0?"conf-mid":"conf-low"}`} style={{fontSize:"0.6rem",marginTop:"0.35rem",display:"inline-flex"}}>
                    {(item.margin??0)>25?"▲ COMPRAR":(item.margin??0)>0?"◆ MANTENER":"▼ CARO"}
                  </span>
                </div>
                <button className="btn-danger" onClick={()=>handleDelete(item.id)}>✕</button>
              </div>
            ))}
            {filtered.length===0&&watchSearch&&<div style={{textAlign:"center",padding:"2rem",color:"var(--ink-light)"}}>Sin resultados para "{watchSearch}"</div>}
          </div>
        )}

        {/* FOOTER */}
        <div className="footnote">
          <strong>Valor Intrínseco Pro</strong> — Plataforma profesional de análisis fundamental multi-método<br/>
          7 modelos cuantitativos · Monte Carlo 2,500 iteraciones · Benchmarks sectoriales · Sensibilidad WACC/Crecimiento<br/>
          Datos en tiempo real vía Financial Modeling Prep API · Tipografía: Libre Baskerville, IBM Plex Mono, Syne<br/>
          <strong>⚠ Aviso legal:</strong> Esta herramienta es <em>exclusivamente informativa</em>. Los resultados dependen de los supuestos ingresados y no garantizan rentabilidad futura. <strong>No constituye asesoría financiera ni recomendación de inversión.</strong> Consulta a un asesor certificado antes de tomar decisiones. · © 2026
        </div>

      </div>
    </>
  );
}
