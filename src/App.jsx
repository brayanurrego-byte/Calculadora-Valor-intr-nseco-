import React, { useState, useEffect, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. DESIGN SYSTEM & CSS (Editorial meets Bloomberg)
// ═══════════════════════════════════════════════════════════════════════════════

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

:root {
  /* LIGHT MODE (Editorial Luxury) */
  --bg-color: #F8F7F4;
  --surface-color: #FFFFFF;
  --surface-secondary: #F0EFEA;
  --text-main: #111111;
  --text-muted: #555555;
  --border-color: #DCD8D0;
  --accent-color: #0F2D52; /* Deep Editorial Blue */
  --accent-gold: #B8860B;
  --danger: #D93025;
  --success: #0F9D58;
  --warning: #F4B400;
  --terminal-bg: #111111;
  --terminal-text: #00FF41;

  /* Typography */
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

[data-theme="dark"] {
  /* DARK MODE (Bloomberg Terminal) */
  --bg-color: #0A0A0A;
  --surface-color: #141414;
  --surface-secondary: #1F1F1F;
  --text-main: #EAEAEA;
  --text-muted: #888888;
  --border-color: #2A2A2A;
  --accent-color: #3B82F6;
  --accent-gold: #D4AF37;
  --danger: #FF4444;
  --success: #00C853;
  --terminal-bg: #000000;
  --terminal-text: #00FF41;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: var(--font-sans);
  line-height: 1.5;
  transition: background-color 0.3s, color 0.3s;
  -webkit-font-smoothing: antialiased;
}

.app-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid var(--text-main);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.brand h1 {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}

.brand p {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  display: flex;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
  border-radius: 4px;
  overflow: hidden;
}

.search-box input {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 1rem;
  outline: none;
  width: 200px;
  text-transform: uppercase;
}

.btn {
  background: var(--surface-secondary);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover {
  background: var(--border-color);
}

.btn-primary {
  background: var(--text-main);
  color: var(--bg-color);
  border-color: var(--text-main);
}

.btn-primary:hover {
  background: var(--text-muted);
}

/* Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 3fr 5fr 3fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1200px) {
  .dashboard-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

/* Panel Common */
.panel {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.panel-header {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.panel-header .subtitle {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: normal;
  text-transform: uppercase;
}

/* Typography Helpers */
.mono-data { font-family: var(--font-mono); font-weight: 500; }
.text-success { color: var(--success); }
.text-danger { color: var(--danger); }
.text-warning { color: var(--warning); }
.text-muted { color: var(--text-muted); }

/* Key Value Rows */
.kv-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border-color);
  font-size: 0.9rem;
}
.kv-row:last-child { border-bottom: none; }
.kv-label { color: var(--text-muted); }
.kv-val { font-family: var(--font-mono); font-weight: 600; }

/* Score Widgets */
.score-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  border: 3px solid;
}
.score-excellent { border-color: var(--success); color: var(--success); }
.score-average { border-color: var(--warning); color: var(--warning); }
.score-poor { border-color: var(--danger); color: var(--danger); }

.quality-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* DCF Engine Styles */
.dcf-stage-inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: var(--surface-secondary);
  padding: 1rem;
  border-radius: 4px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.input-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
}
.input-wrapper {
  display: flex;
  align-items: center;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  padding: 0.25rem 0.5rem;
}
.input-wrapper input {
  border: none;
  background: transparent;
  width: 100%;
  font-family: var(--font-mono);
  color: var(--text-main);
  outline: none;
  font-size: 1rem;
}
.input-wrapper span {
  font-family: var(--font-mono);
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Valuation Result Box */
.valuation-result {
  background: var(--terminal-bg);
  color: var(--terminal-text);
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
}

.valuation-result::before {
  content: "TERMINAL OUTPUT";
  position: absolute;
  top: 5px;
  left: 10px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  opacity: 0.5;
}

.val-price {
  font-family: var(--font-mono);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  margin: 1rem 0;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

.val-margin {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin-top: 0.5rem;
}
.val-margin.undervalued { background: rgba(0, 200, 83, 0.2); color: #00FF41; border: 1px solid #00FF41; }
.val-margin.overvalued { background: rgba(255, 68, 68, 0.2); color: #FF4444; border: 1px solid #FF4444; }

/* Alerts Engine */
.alert-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  border-left: 4px solid;
  background: var(--surface-secondary);
}
.alert-danger { border-left-color: var(--danger); }
.alert-warning { border-left-color: var(--warning); }
.alert-success { border-left-color: var(--success); }

.alert-icon { font-size: 1.2rem; }

/* PDF Print Styles */
@media print {
  body { background: white; color: black; }
  .controls, .header .search-box { display: none; }
  .dashboard-grid { display: block; }
  .panel { break-inside: avoid; border: 1px solid #ccc; box-shadow: none; margin-bottom: 20px; }
  .valuation-result { background: white; color: black; border: 2px solid black; }
  .val-margin.undervalued { background: white; color: black; border: 1px solid black; }
  .val-margin.overvalued { background: white; color: black; border: 1px dashed black; }
}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MOCK DATA (Institutional Grade)
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_DATA = {
  MSFT: {
    quote: { price: 415.50, marketCap: 3090000000000, sharesOutstanding: 7430000000, name: "Microsoft Corporation" },
    profile: { industry: "Software—Infrastructure", sector: "Technology", beta: 1.15, description: "Develops, licenses, and supports software, services, devices, and solutions worldwide." },
    // Index 0: TTM/Current Year, Index 1: Previous Year
    income: [
      { netIncome: 82536000000, operatingIncome: 104539000000, interestExpense: 2063000000, revenue: 227583000000, grossProfit: 157334000000 },
      { netIncome: 72738000000, operatingIncome: 88523000000, interestExpense: 1950000000, revenue: 211915000000, grossProfit: 146052000000 }
    ],
    balance: [
      { totalAssets: 411976000000, totalLiabilities: 205753000000, totalDebt: 79970000000, cashAndEquivalents: 143951000000, totalCurrentAssets: 184257000000, totalCurrentLiabilities: 104149000000, retainedEarnings: 90000000000 },
      { totalAssets: 364840000000, totalLiabilities: 198298000000, totalDebt: 61270000000, cashAndEquivalents: 104749000000, totalCurrentAssets: 169684000000, totalCurrentLiabilities: 95082000000, retainedEarnings: 84000000000 }
    ],
    cashflow: [
      { operatingCashFlow: 102647000000, capitalExpenditure: -33826000000, freeCashFlow: 68821000000 },
      { operatingCashFlow: 89035000000, capitalExpenditure: -23886000000, freeCashFlow: 65149000000 }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ICONS (Inline SVGs to guarantee rendering without dependencies)
// ═══════════════════════════════════════════════════════════════════════════════
const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Printer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>,
  AlertTriangle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  CheckCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
};

// Formatter Helpers
const fmtPct = (val) => `${(val * 100).toFixed(2)}%`;
const fmtCur = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
const fmtNum = (val) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(val);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MAIN APPLICATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [ticker, setTicker] = useState("MSFT");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState(null);

  // DCF Inputs State
  const [dcfInputs, setDcfInputs] = useState({
    wacc: 0.085,         // 8.5%
    stage1Years: 5,
    stage1Growth: 0.15,  // 15% Hipercrecimiento
    stage2Years: 5,
    stage2Growth: 0.08,  // 8% Desaceleración
    terminalGrowth: 0.025 // 2.5% Terminal (Inflación)
  });

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Simulate Data Fetch (Using Mock Data for robustness)
  useEffect(() => {
    // In a real app, this calls FMP API. Here we load our ultra-detailed mock.
    if (MOCK_DATA[ticker]) {
      setData(MOCK_DATA[ticker]);
    } else {
      setData(MOCK_DATA["MSFT"]); // Fallback
    }
  }, [ticker]);

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    if(searchInput) setTicker(searchInput.toUpperCase());
  };

  const handlePrint = () => window.print();

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. FINANCIAL ENGINES & ALGORITHMS
  // ═══════════════════════════════════════════════════════════════════════════════

  const engine = useMemo(() => {
    if (!data) return null;

    const currInc = data.income[0];
    const prevInc = data.income[1];
    const currBal = data.balance[0];
    const prevBal = data.balance[1];
    const currCF = data.cashflow[0];
    const prevCF = data.cashflow[1];
    const quote = data.quote;

    // --- BASE METRICS ---
    const shares = quote.sharesOutstanding;
    const price = quote.price;
    const currentFCF = currCF.freeCashFlow;
    const netDebt = currBal.totalDebt - currBal.cashAndEquivalents;
    const ebitda = currInc.operatingIncome + (currCF.operatingCashFlow - currInc.netIncome); // Simplified EBITDA prox

    // --- 1. 3-STAGE DCF ALGORITHM ---
    let pvFcfs = 0;
    let projectedFcf = currentFCF;
    const { wacc, stage1Years, stage1Growth, stage2Years, stage2Growth, terminalGrowth } = dcfInputs;

    // Stage 1: Hipercrecimiento
    for (let i = 1; i <= stage1Years; i++) {
      projectedFcf *= (1 + stage1Growth);
      pvFcfs += projectedFcf / Math.pow(1 + wacc, i);
    }
    // Stage 2: Desaceleración
    for (let i = 1; i <= stage2Years; i++) {
      projectedFcf *= (1 + stage2Growth);
      pvFcfs += projectedFcf / Math.pow(1 + wacc, stage1Years + i);
    }
    // Stage 3: Terminal Value
    const terminalValue = (projectedFcf * (1 + terminalGrowth)) / (wacc - terminalGrowth);
    const pvTerminal = terminalValue / Math.pow(1 + wacc, stage1Years + stage2Years);

    const enterpriseValue = pvFcfs + pvTerminal;
    const equityValue = enterpriseValue - netDebt;
    const intrinsicValue = equityValue / shares;
    const marginOfSafety = ((intrinsicValue - price) / intrinsicValue) * 100;

    // --- 2. REVERSE DCF (Búsqueda Binaria) ---
    // ¿Qué crecimiento de Etapa 1 asume el mercado al precio actual? (Asumiendo stage2 y terminal fijos)
    const calculateDCFPrice = (testGrowth) => {
      let testFcf = currentFCF;
      let testPv = 0;
      for (let i = 1; i <= stage1Years; i++) {
        testFcf *= (1 + testGrowth);
        testPv += testFcf / Math.pow(1 + wacc, i);
      }
      for (let i = 1; i <= stage2Years; i++) {
        testFcf *= (1 + stage2Growth);
        testPv += testFcf / Math.pow(1 + wacc, stage1Years + i);
      }
      const tv = (testFcf * (1 + terminalGrowth)) / (wacc - terminalGrowth);
      const pvTv = tv / Math.pow(1 + wacc, stage1Years + stage2Years);
      return ((testPv + pvTv - netDebt) / shares);
    };

    let low = -0.2, high = 1.0, impliedGrowth = 0;
    for (let i = 0; i < 20; i++) { // 20 iteraciones para convergencia
      let mid = (low + high) / 2;
      let impliedPrice = calculateDCFPrice(mid);
      if (impliedPrice > price) high = mid;
      else low = mid;
      impliedGrowth = mid;
    }

    // --- 3. PIOTROSki F-SCORE (Calidad Contable) ---
    let fScore = 0;
    const roaCurr = currInc.netIncome / currBal.totalAssets;
    const roaPrev = prevInc.netIncome / prevBal.totalAssets;
    const cfoCurr = currCF.operatingCashFlow;
    
    if (roaCurr > 0) fScore++; // 1. ROA positivo
    if (cfoCurr > 0) fScore++; // 2. CFO positivo
    if (roaCurr > roaPrev) fScore++; // 3. ROA creciente
    if (cfoCurr > currInc.netIncome) fScore++; // 4. CFO > Net Income (Calidad de ganancias)
    
    const levCurr = currBal.totalDebt / currBal.totalAssets;
    const levPrev = prevBal.totalDebt / prevBal.totalAssets;
    if (levCurr < levPrev) fScore++; // 5. Deuda disminuyendo
    
    const crCurr = currBal.totalCurrentAssets / currBal.totalCurrentLiabilities;
    const crPrev = prevBal.totalCurrentAssets / prevBal.totalCurrentLiabilities;
    if (crCurr > crPrev) fScore++; // 6. Liquidez mejorando
    
    // Asumimos shares no diluidos si no cambian drásticamente (mock: fScore++)
    fScore++; // 7. Dilución (simplificado para mock)
    
    const gmCurr = currInc.grossProfit / currInc.revenue;
    const gmPrev = prevInc.grossProfit / prevInc.revenue;
    if (gmCurr > gmPrev) fScore++; // 8. Margen bruto expandiéndose
    
    const atCurr = currInc.revenue / currBal.totalAssets;
    const atPrev = prevInc.revenue / prevBal.totalAssets;
    if (atCurr > atPrev) fScore++; // 9. Rotación de activos mejorando

    // --- 4. ALTMAN Z-SCORE (Riesgo de Quiebra) ---
    const workingCapital = currBal.totalCurrentAssets - currBal.totalCurrentLiabilities;
    const A = workingCapital / currBal.totalAssets;
    const B = currBal.retainedEarnings / currBal.totalAssets;
    const C = currInc.operatingIncome / currBal.totalAssets; // EBIT / Total Assets
    const D = quote.marketCap / currBal.totalLiabilities;
    const E = currInc.revenue / currBal.totalAssets;
    const zScore = (1.2 * A) + (1.4 * B) + (3.3 * C) + (0.6 * D) + (1.0 * E);

    // --- 5. ROIC & DEBT METRICS ---
    const investedCapital = currBal.totalDebt + quote.marketCap; // Simplified IC
    const nopat = currInc.operatingIncome * 0.8; // Assume 20% tax rate
    const roic = nopat / investedCapital;
    const interestCoverage = currInc.operatingIncome / currInc.interestExpense;
    const netDebtEbitda = netDebt / ebitda;

    return {
      intrinsicValue,
      marginOfSafety,
      impliedGrowth,
      fScore,
      zScore,
      roic,
      interestCoverage,
      netDebtEbitda,
      currentFCF,
      ebitda,
      netDebt
    };
  }, [data, dcfInputs]);

  // --- 6. RISK ALERT ENGINE ---
  const alerts = useMemo(() => {
    if (!engine) return [];
    let msgs = [];
    
    // Inputs Validation
    if (dcfInputs.terminalGrowth >= dcfInputs.wacc) {
      msgs.push({ type: "danger", text: "Matemáticamente Inválido: El crecimiento terminal es igual o mayor al WACC. La fórmula DCF se rompe." });
    }
    if (dcfInputs.stage1Growth > 0.25) {
      msgs.push({ type: "warning", text: `Supuesto Agresivo: Asumes hipercrecimiento >25%. Históricamente, solo el 4% de las empresas mantienen esto por 5 años.` });
    }
    
    // Business Quality Validation
    if (engine.fScore < 4) {
      msgs.push({ type: "danger", text: `Bandera Roja Contable: Piotroski F-Score de ${engine.fScore}/9. Riesgo fundamental alto en operaciones base.` });
    } else if (engine.fScore >= 7) {
      msgs.push({ type: "success", text: `Fuerte Calidad Contable: Piotroski F-Score de ${engine.fScore}/9. El negocio genera valor operativamente.` });
    }

    if (engine.roic < dcfInputs.wacc) {
      msgs.push({ type: "warning", text: `Destrucción de Valor: El ROIC (${fmtPct(engine.roic)}) es menor al costo de capital (${fmtPct(dcfInputs.wacc)}). No hay foso defensivo (Moat).` });
    }

    // Debt Validation
    if (engine.zScore < 1.8) {
      msgs.push({ type: "danger", text: `Riesgo de Insolvencia: Altman Z-Score de ${engine.zScore.toFixed(2)}. Alta probabilidad de estrés financiero.` });
    }
    if (engine.netDebtEbitda > 4) {
      msgs.push({ type: "danger", text: `Apalancamiento Excesivo: Deuda Neta / EBITDA de ${engine.netDebtEbitda.toFixed(1)}x superando márgenes seguros.` });
    }

    // Market Implication
    if (engine.impliedGrowth > dcfInputs.stage1Growth * 1.5) {
      msgs.push({ type: "warning", text: `Mercado Euforico: El precio actual descuenta un crecimiento del ${fmtPct(engine.impliedGrowth)}, mucho mayor a tu proyección.` });
    }

    return msgs;
  }, [engine, dcfInputs]);

  // Handlers for Inputs
  const handleInputChange = (field, value) => {
    setDcfInputs(prev => ({ ...prev, [field]: parseFloat(value) / 100 })); // Convert % to decimal
  };


  if (!data || !engine) return <div style={{padding: "2rem", fontFamily: "monospace"}}>Iniciando Motor Cuantitativo...</div>;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-container">
        
        {/* --- HEADER --- */}
        <header className="header">
          <div className="brand">
            <h1>Valor Intrínseco Pro</h1>
            <p>Institutional Grade Equity Valuation Engine</p>
          </div>
          <div className="controls">
            <form onSubmit={handleSearch} className="search-box">
              <Icons.Search />
              <input 
                type="text" 
                placeholder="Ticker (ej. AAPL)" 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
            <button className="btn" onClick={handlePrint} title="Exportar a PDF">
              <Icons.Printer /> PDF
            </button>
            <button className="btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </header>

        {/* --- MAIN GRID --- */}
        <div className="dashboard-grid">
          
          {/* COLUMN 1: Profile & Quality */}
          <div className="col-left">
            <div className="panel" style={{marginBottom: "1.5rem"}}>
              <div className="panel-header">
                {data.quote.name}
                <span className="subtitle">{ticker} • {data.profile.sector}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Precio Actual</span>
                <span className="kv-val" style={{fontSize: "1.2rem"}}>{fmtCur(data.quote.price)}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Market Cap</span>
                <span className="kv-val">{fmtNum(data.quote.marketCap)}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Beta</span>
                <span className="kv-val">{data.profile.beta.toFixed(2)}</span>
              </div>
            </div>

            <div className="panel" style={{marginBottom: "1.5rem"}}>
              <div className="panel-header">Calidad del Negocio</div>
              <div className="quality-grid">
                <div style={{textAlign: "center"}}>
                  <div className={`score-circle ${engine.fScore >= 7 ? 'score-excellent' : engine.fScore >= 4 ? 'score-average' : 'score-poor'}`} style={{margin: "0 auto 0.5rem"}}>
                    {engine.fScore}
                  </div>
                  <div className="kv-label" style={{fontSize: "0.75rem"}}>Piotroski F-Score</div>
                </div>
                <div style={{textAlign: "center"}}>
                  <div className={`score-circle ${engine.roic > dcfInputs.wacc ? 'score-excellent' : 'score-poor'}`} style={{margin: "0 auto 0.5rem", fontSize: "1rem"}}>
                    {fmtPct(engine.roic)}
                  </div>
                  <div className="kv-label" style={{fontSize: "0.75rem"}}>ROIC (Moat)</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">Análisis de Deuda</div>
              <div className="kv-row">
                <span className="kv-label">Altman Z-Score</span>
                <span className={`kv-val ${engine.zScore > 2.99 ? 'text-success' : 'text-danger'}`}>
                  {engine.zScore.toFixed(2)} {engine.zScore > 2.99 ? '(Seguro)' : '(Riesgo)'}
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Cobertura Intereses</span>
                <span className="kv-val">{engine.interestCoverage.toFixed(1)}x</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Deuda Neta / EBITDA</span>
                <span className="kv-val">{engine.netDebtEbitda.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: 3-Stage DCF Engine */}
          <div className="col-center">
            <div className="panel" style={{height: "100%"}}>
              <div className="panel-header">
                Motor DCF Avanzado (3 Etapas)
                <span className="subtitle">Flujo de Caja Libre TTM: {fmtNum(engine.currentFCF)}</span>
              </div>

              <div className="dcf-stage-inputs">
                <div className="input-group">
                  <label>WACC (Descuento)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.1" value={(dcfInputs.wacc * 100).toFixed(1)} onChange={(e) => handleInputChange('wacc', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
                <div className="input-group">
                  <label>Crec. Terminal</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.1" value={(dcfInputs.terminalGrowth * 100).toFixed(1)} onChange={(e) => handleInputChange('terminalGrowth', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
              </div>

              <div className="dcf-stage-inputs" style={{background: "transparent", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--accent-color)"}}>
                <div className="input-group">
                  <label>Stage 1: Años</label>
                  <div className="input-wrapper">
                    <input type="number" value={dcfInputs.stage1Years} onChange={(e) => setDcfInputs({...dcfInputs, stage1Years: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="input-group" style={{gridColumn: "span 2"}}>
                  <label>Crecimiento Stage 1</label>
                  <div className="input-wrapper">
                    <input type="number" step="1" value={(dcfInputs.stage1Growth * 100).toFixed(1)} onChange={(e) => handleInputChange('stage1Growth', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
              </div>

              <div className="dcf-stage-inputs" style={{background: "transparent", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--accent-gold)"}}>
                <div className="input-group">
                  <label>Stage 2: Años</label>
                  <div className="input-wrapper">
                    <input type="number" value={dcfInputs.stage2Years} onChange={(e) => setDcfInputs({...dcfInputs, stage2Years: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="input-group" style={{gridColumn: "span 2"}}>
                  <label>Crecimiento Stage 2</label>
                  <div className="input-wrapper">
                    <input type="number" step="1" value={(dcfInputs.stage2Growth * 100).toFixed(1)} onChange={(e) => handleInputChange('stage2Growth', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
              </div>

              {/* Resultado Valuation */}
              <div className="valuation-result">
                <div style={{color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase"}}>Valor Intrínseco Estimado</div>
                <div className="val-price">{fmtCur(engine.intrinsicValue)}</div>
                
                <div className={`val-margin ${engine.marginOfSafety > 0 ? 'undervalued' : 'overvalued'}`}>
                  {engine.marginOfSafety > 0 ? 'SUBVALORADA' : 'SOBREVALORADA'} por {Math.abs(engine.marginOfSafety).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Reverse DCF & Risk Engine */}
          <div className="col-right">
            
            <div className="panel" style={{marginBottom: "1.5rem", background: "var(--surface-secondary)"}}>
              <div className="panel-header">
                Ingeniería Inversa (Mercado)
              </div>
              <p style={{fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem"}}>
                Al precio actual de <strong>{fmtCur(data.quote.price)}</strong>, el mercado asume el siguiente crecimiento para la Etapa 1:
              </p>
              <div style={{fontSize: "2rem", fontFamily: "var(--font-mono)", fontWeight: "700", textAlign: "center", color: "var(--accent-color)"}}>
                {fmtPct(engine.impliedGrowth)}
              </div>
              <div style={{textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem"}}>
                vs Tu Proyección: {fmtPct(dcfInputs.stage1Growth)}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header" style={{borderBottom: "none", marginBottom: "0.5rem"}}>
                Risk Engine Alerts
              </div>
              
              {alerts.length === 0 ? (
                <div className="alert-item alert-success">
                  <Icons.CheckCircle />
                  <div>Todos los supuestos están dentro de parámetros lógicos y seguros.</div>
                </div>
              ) : (
                alerts.map((al, idx) => (
                  <div key={idx} className={`alert-item alert-${al.type}`}>
                    <div style={{marginTop: "2px"}}>
                      {al.type === 'danger' ? <Icons.AlertTriangle /> : <Icons.Info />}
                    </div>
                    <div>{al.text}</div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
