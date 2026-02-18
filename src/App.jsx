import { useState, useEffect, useRef } from "react";

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
  }

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
  }

  .field { margin-bottom: 0.9rem; }

  .field label {
    display: block;
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
  }

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
  }

  .metric-card-sub {
    font-size: 0.7rem;
    color: var(--muted);
    margin-top: 0.15rem;
  }
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

// ─── CHART ────────────────────────────────────────────────────────────────────

function DCFChart({ projections }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !projections || projections.length === 0) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 700;
    const H = 260;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 20, right: 20, bottom: 40, left: 65 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const n = projections.length;
    const maxFCF = Math.max(...projections.map(d => d.fcf));
    const maxVal = maxFCF * 1.15;

    const xScale = (i) => pad.left + (i / (n - 1 || 1)) * chartW;
    const yScale = (v) => pad.top + chartH - (v / maxVal) * chartH;

    // Grid
    ctx.strokeStyle = "#dce2ee";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    }

    // FCF Bars
    const barW = Math.min(chartW / n * 0.45, 32);
    projections.forEach((d, i) => {
      const x = xScale(i);
      const bH = (d.fcf / maxVal) * chartH;
      const bY = pad.top + chartH - bH;
      const grad = ctx.createLinearGradient(0, bY, 0, pad.top + chartH);
      grad.addColorStop(0, "rgba(201,168,76,0.85)");
      grad.addColorStop(1, "rgba(201,168,76,0.2)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x - barW / 2, bY, barW, bH, [3, 3, 0, 0]);
      ctx.fill();
    });

    // PV line
    ctx.beginPath();
    ctx.strokeStyle = "#0d2257";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    projections.forEach((d, i) => {
      const x = xScale(i), y = yScale(d.pvFCF);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    projections.forEach((d, i) => {
      const x = xScale(i), y = yScale(d.pvFCF);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#0d2257"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.fill();
    });

    // X labels
    ctx.fillStyle = "#7a8ab0";
    ctx.font = "500 11px Inter, sans-serif";
    ctx.textAlign = "center";
    projections.forEach((d, i) => {
      if (n <= 6 || i % 2 === 0)
        ctx.fillText(`Y${d.year}`, xScale(i), H - 10);
    });

    // Y labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = (maxVal / 4) * (4 - i);
      const y = pad.top + (chartH / 4) * i;
      ctx.fillText(v >= 1000 ? (v / 1000).toFixed(1) + "B" : v.toFixed(0) + "M", pad.left - 8, y + 4);
    }
  }, [projections]);

  return <canvas ref={ref} style={{ width: "100%" }} />;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
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

  const dcfResult = calcDCF({
    fcf: p(fcf), growthRate: p(growthRate), terminalGrowth: p(terminalGrowth),
    discountRate: p(discountRate), years: p(years), shares: p(shares)
  });
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

  const getVerdict = () => {
    if (marginPct === null) return { label: "Ingresa precio actual para el veredicto", cls: "tag-neutral", icon: "○" };
    if (marginPct > 25) return { label: "Subvalorada — Oportunidad de compra", cls: "tag-buy", icon: "↑" };
    if (marginPct > 0) return { label: "Precio justo — Mantener posición", cls: "tag-hold", icon: "→" };
    return { label: "Sobrevalorada — Evaluar riesgo", cls: "tag-sell", icon: "↓" };
  };

  const verdict = getVerdict();
  const barColor = marginPct > 25 ? "#1a7a4a" : marginPct > 0 ? "#c9a84c" : "#c0392b";
  const barWidth = marginPct !== null ? Math.min(Math.max(marginPct, 0), 100) : 0;

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

        {/* METRICS SUMMARY */}
        {hasResult && (
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-card-label">Valor Intrínseco Ponderado</div>
              <div className="metric-card-value">{fmt(intrinsic)}</div>
              <div className="metric-card-sub">{activeMethods} método{activeMethods !== 1 ? "s" : ""} activo{activeMethods !== 1 ? "s" : ""}</div>
            </div>
            <div className="metric-card" style={{ borderLeftColor: marginPct > 25 ? "#1a7a4a" : marginPct > 0 ? "#c9a84c" : "#c0392b" }}>
              <div className="metric-card-label">Margen de Seguridad</div>
              <div className="metric-card-value" style={{ color: marginPct > 0 ? "#1a7a4a" : "#c0392b" }}>
                {pct(marginPct)}
              </div>
              <div className="metric-card-sub">vs. precio de mercado</div>
            </div>
            <div className="metric-card" style={{ borderLeftColor: upside > 0 ? "#1a3a8f" : "#c0392b" }}>
              <div className="metric-card-label">Potencial Alcista</div>
              <div className="metric-card-value" style={{ color: upside > 0 ? "#1a3a8f" : "#c0392b" }}>
                {pct(upside)}
              </div>
              <div className="metric-card-sub">desde el precio actual</div>
            </div>
          </div>
        )}

        <div className="grid">

          {/* METHOD 1: DCF */}
          <div className="card">
            <div className="card-accent" style={{ background: "var(--navy)" }} />
            <div className="method-tag">Método 01</div>
            <div className="card-title">Flujo de Caja Descontado (DCF)</div>
            <div className="field"><label>Flujo de Caja Libre — FCF (millones $)</label>
              <input value={fcf} onChange={e => setFcf(e.target.value)} placeholder="ej. 5000" /></div>
            <div className="field"><label>Tasa de crecimiento anual (%)</label>
              <input value={growthRate} onChange={e => setGrowthRate(e.target.value)} placeholder="ej. 10" /></div>
            <div className="field"><label>Crecimiento terminal / perpetuo (%)</label>
              <input value={terminalGrowth} onChange={e => setTerminalGrowth(e.target.value)} placeholder="ej. 3" /></div>
            <div className="field"><label>Tasa de descuento / WACC (%)</label>
              <input value={discountRate} onChange={e => setDiscountRate(e.target.value)} placeholder="ej. 10" /></div>
            <div className="field"><label>Años de proyección</label>
              <input value={years} onChange={e => setYears(e.target.value)} placeholder="ej. 10" /></div>
            <div className="field"><label>Acciones en circulación (millones)</label>
              <input value={shares} onChange={e => setShares(e.target.value)} placeholder="ej. 1000" /></div>
          </div>

          {/* METHOD 2 + 3 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            <div className="card">
              <div className="card-accent" style={{ background: "var(--gold)" }} />
              <div className="method-tag">Método 02</div>
              <div className="card-title">Graham Number</div>
              <div className="field"><label>EPS — Ganancias por acción ($)</label>
                <input value={eps} onChange={e => setEps(e.target.value)} placeholder="ej. 6.50" /></div>
              <div className="field"><label>Valor en libros por acción (Book Value $)</label>
                <input value={bookValue} onChange={e => setBookValue(e.target.value)} placeholder="ej. 20.00" /></div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                Fórmula: √(22.5 × EPS × Book Value)
              </div>
            </div>

            <div className="card">
              <div className="card-accent" style={{ background: "var(--navy2)" }} />
              <div className="method-tag">Método 03</div>
              <div className="card-title">Múltiplo P/E</div>
              <div className="field"><label>EPS — (compartido con Graham)</label>
                <input value={eps} readOnly /></div>
              <div className="field"><label>P/E objetivo o histórico del sector</label>
                <input value={peTarget} onChange={e => setPeTarget(e.target.value)} placeholder="ej. 15" /></div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                Fórmula: EPS × P/E objetivo
              </div>
            </div>
          </div>

          {/* METHOD 4 */}
          <div className="card">
            <div className="card-accent" style={{ background: "linear-gradient(90deg, var(--navy), var(--gold))" }} />
            <div className="method-tag">Método 04</div>
            <div className="card-title">EV / EBITDA</div>
            <div className="field"><label>EBITDA (millones $)</label>
              <input value={ebitda} onChange={e => setEbitda(e.target.value)} placeholder="ej. 8000" /></div>
            <div className="field"><label>Múltiplo EV/EBITDA del sector</label>
              <input value={evMultiple} onChange={e => setEvMultiple(e.target.value)} placeholder="ej. 10" /></div>
            <div className="field"><label>Deuda total (millones $)</label>
              <input value={debt} onChange={e => setDebt(e.target.value)} placeholder="ej. 2000" /></div>
            <div className="field"><label>Efectivo y equivalentes (millones $)</label>
              <input value={cash} onChange={e => setCash(e.target.value)} placeholder="ej. 1500" /></div>
            <div className="field"><label>Acciones en circulación (compartido)</label>
              <input value={shares} readOnly /></div>
          </div>

          {/* PRICE + WEIGHTS */}
          <div className="card">
            <div className="card-accent" style={{ background: "var(--gold)" }} />
            <div className="method-tag">Comparación de Mercado</div>
            <div className="card-title">Precio Actual & Ponderación</div>
            <div className="field"><label>Precio actual de mercado por acción ($)</label>
              <input value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} placeholder="ej. 150.00" /></div>
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

          {/* FINAL RESULT */}
          <div className="card card-full">
            <div className="card-accent" style={{ background: "linear-gradient(90deg, var(--navy), var(--navy2), var(--gold))" }} />
            <div className="method-tag">Resultado Consolidado</div>
            <div className="card-title">Valoración Multi-Método</div>

            <div className="results-grid">
              {[
                ["DCF", dcfVal, "#0d2257"],
                ["Graham Number", grahamVal, "#9a7820"],
                ["Múltiplo P/E", peVal, "#1a3a8f"],
                ["EV / EBITDA", evVal, "#5a3a00"],
              ].map(([label, val, color]) => (
                <div className="result-box" key={label}>
                  <div className="result-box-label">{label}</div>
                  <div className="result-box-value" style={{ color }}>{fmt(val)}</div>
                </div>
              ))}
            </div>

            {hasResult ? (
              <div className="verdict-row">
                <div>
                  <div className="verdict-label-sm">Valor Intrínseco Ponderado</div>
                  <div className="verdict-price">{fmt(intrinsic)}</div>
                </div>
                <div className="verdict-meta">
                  <div className={`verdict-tag ${verdict.cls}`}>
                    <span>{verdict.icon}</span>{verdict.label}
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
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>◈</div>
                Completa al menos un método para ver la valoración consolidada
              </div>
            )}
          </div>

          {/* DCF CHART */}
          {dcfResult.projections && dcfResult.projections.length > 0 && (
            <div className="card card-full">
              <div className="card-accent" style={{ background: "var(--navy)" }} />
              <div className="method-tag">Análisis Visual — DCF</div>
              <div className="card-title">Proyección de Flujos de Caja</div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#c9a84c" }} />
                  FCF Proyectado (nominal)
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#0d2257" }} />
                  Valor Presente del FCF
                </div>
                {dcfResult.pvTV && (
                  <div className="legend-item" style={{ marginLeft: "auto" }}>
                    Valor Terminal (PV): <b style={{ color: "var(--navy)", marginLeft: "0.3rem" }}>
                      ${(dcfResult.pvTV * p(shares)).toFixed(0)}M
                    </b>
                  </div>
                )}
              </div>
              <div className="chart-wrap">
                <DCFChart projections={dcfResult.projections} />
              </div>
              <div style={{ display: "flex", gap: "2.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>PV Flujos operativos: </span>
                  <b style={{ color: "var(--navy)", fontSize: "0.88rem" }}>${(dcfResult.totalPV * p(shares)).toFixed(0)}M</b>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>PV Valor Terminal: </span>
                  <b style={{ color: "var(--gold)", fontSize: "0.88rem" }}>${(dcfResult.pvTV * p(shares)).toFixed(0)}M</b>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Valor intrínseco DCF: </span>
                  <b style={{ color: "var(--navy)", fontSize: "0.88rem" }}>{fmt(dcfVal)}</b>
                </div>
              </div>
            </div>
          )}

        </div>

        <p className="footnote">
          Esta herramienta es exclusivamente informativa. Los resultados dependen de los supuestos ingresados.<br />
          No constituye asesoría financiera. Realiza siempre tu propio análisis antes de tomar decisiones de inversión.
        </p>
      </div>
    </>
  );
}
