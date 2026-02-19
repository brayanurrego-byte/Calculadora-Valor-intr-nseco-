import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Chart from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configuración de Firebase (reemplaza con tus credenciales reales)
const firebaseConfig = {
  apiKey: "AIzaSyDdummyKeyReplaceMe",
  authDomain: "valor-intrinseco.firebaseapp.com",
  projectId: "valor-intrinseco",
  storageBucket: "valor-intrinseco.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:dummyappid"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// API Keys (en producción, usa process.env)
const ALPHA_VANTAGE_KEY = "demo"; // Reemplaza
const FMP_KEY_DEFAULT = ""; // Usuario ingresa

// ─── APIs Adicionales ─────────────────────────────────────────────────────────
async function fetchStockPrice(ticker) {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`);
    const data = await res.json();
    return parseFloat(data["Global Quote"]?.["05. price"]) || null;
  } catch (e) {
    console.error("Error fetching price:", e);
    return null;
  }
}

async function fetchExchangeRate() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    return data.rates.COP || 4000;
  } catch (e) {
    return 4000;
  }
}

const FMP_BASE = "https://financialmodelingprep.com/api/v3";
async function fetchFMPData(ticker, apiKey) {
  const urls = {
    profile: `${FMP_BASE}/profile/${ticker}?apikey=${apiKey}`,
    income: `${FMP_BASE}/income-statement/${ticker}?limit=1&apikey=${apiKey}`,
    cashflow: `${FMP_BASE}/cash-flow-statement/${ticker}?limit=3&apikey=${apiKey}`,
    balance: `${FMP_BASE}/balance-sheet-statement/${ticker}?limit=1&apikey=${apiKey}`,
    keyMetrics: `${FMP_BASE}/key-metrics/${ticker}?limit=1&apikey=${apiKey}`,
    quote: `${FMP_BASE}/quote/${ticker}?apikey=${apiKey}`,
    dividends: `${FMP_BASE}/historical-price-full/stock_dividend/${ticker}?apikey=${apiKey}`,
    peers: `${FMP_BASE}/peers/${ticker}?apikey=${apiKey}`, // Nuevo para benchmarks
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
      parsed.beta = profile.beta || 1;
      loaded.companyName = !!profile.companyName;
      loaded.currentPrice = !!profile.price;
      loaded.shares = !!profile.sharesOutstanding;
      loaded.beta = !!profile.beta;
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
  try {
    const div = raw.dividends?.historical?.[0];
    if (div) { parsed.dividend = div.adjDividend ? String(div.adjDividend) : ""; loaded.dividend = !!div.adjDividend; }
  } catch {}
  return { parsed, loaded };
}
// ─── MATH HELPERS ─────────────────────────────────────────────────────────────
function calcDCF({ fcf, growthRate, terminalGrowth, discountRate, years, shares, inflation = 0 }) {
  if (!fcf || !shares || discountRate <= terminalGrowth || fcf <= 0 || shares <= 0 || growthRate > discountRate) return { value: null, projections: [], pvTV: null, totalPV: null, error: growthRate > discountRate ? "Advertencia: Crecimiento insostenible (mayor que WACC)." : "Parámetros inválidos: verifica FCF > 0, shares > 0 y WACC > crecimiento terminal." };
  const g = (growthRate / 100) + (inflation / 100), r = discountRate / 100, tg = (terminalGrowth / 100) + (inflation / 100);
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
const calcGraham = ({ eps, bookValue }) => (eps > 0 && bookValue > 0) ? Math.sqrt(22.5 * eps * bookValue) : null;
const calcPE = ({ eps, peTarget }) => (eps > 0 && peTarget > 0) ? eps * peTarget : null;
const calcEV = ({ ebitda, evMultiple, debt, cash, shares }) => (ebitda > 0 && evMultiple > 0 && shares > 0) ? (ebitda * evMultiple - (debt || 0) + (cash || 0)) / shares : null;
const calcDDM = ({ dividend, growthRate, discountRate }) => (dividend > 0 && discountRate > growthRate) ? dividend * (1 + growthRate / 100) / (discountRate / 100 - growthRate / 100) : null;
const calcCAPM = ({ riskFree = 4, beta = 1, marketPremium = 7 }) => riskFree + beta * marketPremium;
function monteCarloSimulation(baseParams, simulations = 1000) {
  const results = [];
  for (let i = 0; i < simulations; i++) {
    const params = {
      ...baseParams,
      growthRate: baseParams.growthRate + (Math.random() - 0.5) * 5,
      discountRate: baseParams.discountRate + (Math.random() - 0.5) * 2,
      fcf: baseParams.fcf * (1 + (Math.random() - 0.5) * 0.1),
    };
    const result = calcDCF(params);
    if (result.value) results.push(result.value);
  }
  if (results.length === 0) return { p10: null, p50: null, p90: null, distribution: [] };
  results.sort((a, b) => a - b);
  return {
    p10: results[Math.floor(results.length * 0.1)],
    p50: results[Math.floor(results.length * 0.5)],
    p90: results[Math.floor(results.length * 0.9)],
    distribution: results,
  };
}
function weightedAvg(pairs) {
  let sum = 0, wsum = 0;
  pairs.forEach(([v, w]) => { if (v !== null && v > 0 && w > 0) { sum += v * w; wsum += w; } });
  return wsum > 0 ? sum / wsum : null;
}
const fmt = (n, locale = 'en-US', currency = 'USD') => (n === null || n === undefined || isNaN(n)) ? "—" : new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
const pct = (n, locale = 'en-US') => { if (n === null || n === undefined) return "—"; const v = Math.round(n); return new Intl.NumberFormat(locale, { style: 'percent', signDisplay: 'exceptZero' }).format(v / 100); };
const p = (v) => parseFloat(v) || 0;
function confidenceScore(vals) {
  const active = vals.filter(v => v !== null && v > 0);
  if (active.length < 2) return { score: 0, label: "Insuficiente", cls: "conf-low", cv: null };
  const mean = active.reduce((a, b) => a + b, 0) / active.length;
  const variance = active.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / active.length;
  const cv = (Math.sqrt(variance) / mean) * 100;
  const score = Math.max(0, Math.min(10, Math.round((1 - cv / 100) * 10)));
  let suggestion = "";
  if (cv > 20) suggestion = "Ajusta suposiciones para reducir variabilidad.";
  if (score >= 7) return { score, label: `Alta consistencia (${score}/10)`, cls: "conf-high", cv, suggestion };
  if (score >= 4) return { score, label: `Consistencia media (${score}/10)`, cls: "conf-mid", cv, suggestion };
  return { score, label: `Baja consistencia (${score}/10)`, cls: "conf-low", cv, suggestion };
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
// ─── PREMIUM GAUGE COMPONENT ──────────────────────────────────────────────────
function PremiumGauge({ marginPct, intrinsic, marketPrice, upside }) {
  const canvasRef = useRef(null);
  useEffect(() => { drawPremiumGauge(canvasRef.current, marginPct); }, [marginPct]);
  // ... (igual, pero con Chart.js si quieres reemplazar canvas)
  return ( /* igual */ );
}
// ─── DCF CHART con Chart.js ───────────────────────────────────────────────────
function DCFChart({ projections, scenarioProjections = [] }) {
  const data = {
    labels: projections.map(p => `Y${p.year}`),
    datasets: [
      {
        type: "bar",
        label: "FCF Proyectado",
        data: projections.map(p => p.fcf),
        backgroundColor: "rgba(201,168,76,0.85)",
      },
      {
        type: "line",
        label: "PV del FCF",
        data: projections.map(p => p.pvFCF),
        borderColor: "#0d2257",
        tension: 0.1,
      },
      {
        type: "line",
        label: "Escenario Optimista",
        data: scenarioProjections.map(p => p.pvFCF),
        borderColor: "#1a7a4a",
        tension: 0.1,
      },
    ],
  };
  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } },
      zoom: { zoom: { wheel: { enabled: true }, mode: "x" } },
    },
    scales: { y: { ticks: { callback: (v) => fmt(v, 'en-US', 'USD') } } },
  };
  return <Chart type="bar" data={data} options={options} />;
}
// ─── RADAR CHART con Chart.js ────────────────────────────────────────────────
function RadarChart({ dcf, graham, pe, ev, benchmarks = { dcf: 100, graham: 80, pe: 15, ev: 10 } }) {
  const data = {
    labels: ["DCF", "Graham", "P/E", "EV/EBITDA"],
    datasets: [
      { label: "Tu Valoración", data: [dcf, graham, pe, ev], backgroundColor: "rgba(13,34,87,0.15)", borderColor: "#0d2257" },
      { label: "Benchmark S&P", data: [benchmarks.dcf, benchmarks.graham, benchmarks.pe, benchmarks.ev], backgroundColor: "rgba(201,168,76,0.2)", borderColor: "#c9a84c" },
    ],
  };
  const options = {
    responsive: true,
    animation: { duration: 1000 },
    scales: { r: { pointLabels: { font: { size: 10 } } } },
  };
  return <Chart type="radar" data={data} options={options} />;
}
// ─── WATERFALL CHART con Chart.js (usando bar con stacking) ──────────────────
function WaterfallChart({ totalPV, pvTV, shares }) {
  const pvOps = totalPV / shares;
  const pvTer = pvTV / shares;
  const total = pvOps + pvTer;
  const data = {
    labels: ["PV Flujos Op.", "PV Terminal", "Total"],
    datasets: [{
      label: "Valor",
      data: [pvOps, pvTer, total],
      backgroundColor: [pvOps > 0 ? "#0d2257" : "#c0392b", pvTer > 0 ? "#c9a84c" : "#c0392b", total > 0 ? "#1a7a4a" : "#c0392b"],
    }],
  };
  const options = {
    responsive: true,
    plugins: { tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } } },
  };
  return <Chart type="bar" data={data} options={options} />;
}
// ─── HEATMAP con Chart.js (usando scatter con colors) ────────────────────────
function SensitivityHeatmap({ fcf, terminalGrowth, shares, currentPrice, onCellClick }) {
  // ... (generar data como array de points con colors basados en heatColor)
  const data = {
    datasets: [{
      label: "Sensibilidad",
      data: /* array de {x: growth, y: wacc, value: val, margin} */,
      backgroundColor: /* based on heatColor */,
    }],
  };
  const options = {
    responsive: true,
    plugins: { tooltip: { enabled: true } },
    scales: { x: { type: "linear" }, y: { type: "linear" } },
    onClick: (e, elements) => {
      if (elements.length) onCellClick(elements[0].element.$context.raw);
    },
  };
  return <Chart type="scatter" data={data} options={options} />;
}
// ─── MONTE CARLO HISTOGRAM ───────────────────────────────────────────────────
function MonteCarloChart({ distribution }) {
  const bins = 20;
  const hist = new Array(bins).fill(0);
  const min = Math.min(...distribution);
  const max = Math.max(...distribution);
  const binSize = (max - min) / bins;
  distribution.forEach(v => {
    const bin = Math.min(bins - 1, Math.floor((v - min) / binSize));
    hist[bin]++;
  });
  const data = {
    labels: new Array(bins).fill(0).map((_, i) => fmt(min + i * binSize)),
    datasets: [{ label: "Distribución", data: hist, backgroundColor: "#1a7a4a" }],
  };
  return <Chart type="bar" data={data} options={{ responsive: true }} />;
}
// ─── OTROS COMPONENTES (Tip, AnimatedValue, FMPPanel, etc. iguales o con pequeños ajustes para dark mode)

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Simulado
  const [auditLog, setAuditLog] = useState([]); // Para trail
  // ... (todo el estado original + nuevos: inflation, riskFree, marketPremium, beta, dividend, searchTerm, sortBy)
  const [peers, setPeers] = useState([]); // Para benchmarks

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      setIsPremium(true); // Simulado para pro
    }
  }, [user]);

  const logChange = (change) => setAuditLog(prev => [...prev, { timestamp: new Date().toLocaleString(), ...change }]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    logChange({ field: setter.name, value: e.target.value });
  };

  // Fetch Peers para benchmarks
  const fetchPeers = useCallback(async () => {
    if (fmpKey && ticker) {
      const raw = await fetchFMPData(ticker, fmpKey);
      const peerTickers = raw.peers?.[0] || [];
      const peerData = await Promise.all(peerTickers.slice(0, 3).map(p => fetchFMPData(p, fmpKey)));
      // Procesar para benchmarks (e.g., avg P/E)
      setPeers(peerData);
    }
  }, [ticker, fmpKey]);

  // ... (resto de lógica: fetchPrices, exchangeRate, dcfResult con nuevos params, ddmVal, monteCarlo, intrinsic con wDDM)

  const scenarioProjections = useMemo(() => {
    // Calcular para optimista, etc.
    return []; // Implementar basado en SCENARIOS
  }, [/* deps */]);

  // Export PDF
  const exportPDF = useCallback(() => {
    const pdf = new jsPDF();
    html2canvas(document.querySelector(".app")).then(canvas => {
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
      pdf.addPage();
      pdf.text("Audit Trail", 10, 10);
      auditLog.forEach((log, i) => pdf.text(`${log.timestamp}: ${log.field} = ${log.value}`, 10, 20 + i * 10));
      pdf.save("valor-intrinseco-report.pdf");
    });
  }, [auditLog]);

  // Alert simulado
  const setupAlerts = useCallback(() => {
    if (marginPct > 30) alert("Alerta: Margen >30% - Oportunidad!");
  }, [marginPct]);

  // Estilos expandidos con dark mode
  const styles = `
:root {
  --bg: #f5f7fa; --surface: #ffffff; --surface2: #eef1f6; --border: #dce2ee;
  --navy: #0d2257; --navy2: #1a3a8f; --gold: #c9a84c; --gold2: #e8c96a;
  --gold-light: #fdf6e3; --text: #0d1b3e; --muted: #7a8ab0;
  --danger: #c0392b; --safe: #1a7a4a; --safe-bg: #eafaf1;
  --danger-bg: #fdf0ee; --hold-bg: #fdf6e3;
  --fmp: #2563eb;
}
.dark-mode {
  --bg: #0d1528; --surface: #141d35; --surface2: #1a3a8f; --border: #3b82f6;
  --text: #e8f0ff; --muted: #8fa3cc;
  --navy: #e8f0ff; --navy2: #c8d8f0; --gold: #fdf6e3; --gold2: #c9a84c;
  --gold-light: #8a6800; --safe: #2ecc71; --danger: #e74c3c;
}
body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; min-height: 100vh; }
.app { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem 4rem; }
/* ... (resto de estilos original, ajustados para dark mode donde necesario) */
.disclaimer { font-size: 0.7rem; color: var(--muted); text-align: center; margin-top: 2rem; }
.logo { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 1.5rem; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="logo">Valor Intrínseco</div>
          <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
          <LoginButton user={user} setUser={setUser} />
        </div>
        {/* Dashboard */}
        <div className="dashboard">
          <h2>Bienvenido, {user ? user.displayName : "Inversor"}</h2>
          <p>Ingresa un ticker para empezar o explora tu watchlist.</p>
          {/* Quick stats */}
        </div>
        {/* Tabs expandidos */}
        {/* Métodos con nuevos inputs para inflation, riskFree, beta, dividend */}
        <div className="field">
          <label>Inflación (%)</label>
          <input value={inflation} onChange={handleInputChange(setInflation)} type="number" />
        </div>
        {/* Similar para CAPM inputs */}
        {/* Resultados con benchmarks */}
        <div>Tu P/E vs Sector: {/* calc from peers */}</div>
        {/* Gráficos nuevos */}
        <DCFChart projections={dcfResult.projections} scenarioProjections={scenarioProjections} />
        <RadarChart dcf={dcfVal} graham={grahamVal} pe={peVal} ev={evVal} benchmarks={{ /* from peers */ }} />
        <WaterfallChart totalPV={dcfResult.totalPV} pvTV={dcfResult.pvTV} shares={p(shares)} />
        <SensitivityHeatmap /* ... */ onCellClick={(cell) => alert(`Breakdown: Val = ${cell.value}`)} />
        <MonteCarloChart distribution={monteCarlo.distribution} />
        {/* Watchlist con search/sort */}
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..." />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="margin">Por Margen</option>
          <option value="intrinsic">Por Valor</option>
        </select>
        {filteredWatchlist.map(item => ( /* render */ ))}
        {/* Export y Alerts */}
        <button onClick={exportPDF}>Exportar PDF</button>
        <button onClick={setupAlerts}>Configurar Alerts</button>
        {/* Audit Trail */}
        <div className="audit">
          <h3>Audit Trail</h3>
          {auditLog.map(log => <p key={log.timestamp}>{log.timestamp}: {log.field} cambiado a {log.value}</p>)}
        </div>
        {/* Disclaimer */}
        <p className="disclaimer">Disclaimer: No es consejo financiero. Consulta profesionales. Todos los derechos reservados.</p>
      </div>
    </>
  );
}
