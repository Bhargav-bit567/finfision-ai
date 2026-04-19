import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Zap, BarChart3, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { stocks } from "../utils/stockData";
import { ComparisonChart } from "../components/shared/StockCharts";


const Compare = () => {
  const [stockA, setStockA] = useState(stocks[0]);
  const [stockB, setStockB] = useState(stocks[1]);

  const betterMetrics = {
    change: stockA.change > stockB.change ? "stockA" : "stockB",
    growth: stockA.growth > stockB.growth ? "stockA" : "stockB",
    risk: stockA.riskScore < stockB.riskScore ? "stockA" : "stockB", // Lower risk is "better"
  };

  return (
    <>
      <div className="compare-container">
        <header className="compare-header">
          <span className="eyebrow">Side-by-side analysis</span>
          <h1>Compare Assets</h1>
          <p>Analyze performance metrics and behavioral signals between two assets.</p>
        </header>

        <div className="selection-area">
          <StockSelector 
            label="First Asset" 
            selected={stockA} 
            others={stocks} 
            onChange={setStockA} 
            color="#8b5cf6"
          />
          <div className="vs-badge">VS</div>
          <StockSelector 
            label="Second Asset" 
            selected={stockB} 
            others={stocks} 
            onChange={setStockB} 
            color="#ec4899"
          />
        </div>

        <section className="chart-section">
          <div className="chart-header">
            <h3>Relative Trend Analysis</h3>
            <div className="chart-legend">
              <span className="legend-item"><i style={{background: "#8b5cf6"}}></i> {stockA.symbol}</span>
              <span className="legend-item"><i style={{background: "#ec4899"}}></i> {stockB.symbol}</span>
            </div>
          </div>
          <ComparisonChart stockA={stockA} stockB={stockB} />
        </section>

        <div className="metrics-grid">
          <MetricRow 
            label="Daily Change" 
            icon={<Zap size={18} />}
            valA={`${stockA.change}%`}
            valB={`${stockB.change}%`}
            winner={betterMetrics.change}
            isPositiveA={stockA.change >= 0}
            isPositiveB={stockB.change >= 0}
          />
          <MetricRow 
            label="Annual Growth" 
            icon={<TrendingUp size={18} />}
            valA={`${stockA.growth}%`}
            valB={`${stockB.growth}%`}
            winner={betterMetrics.growth}
            isPositiveA={stockA.growth >= 0}
            isPositiveB={stockB.growth >= 0}
          />
          <MetricRow 
            label="Volatility Score" 
            icon={<BarChart3 size={18} />}
            valA={stockA.riskScore}
            valB={stockB.riskScore}
            winner={betterMetrics.risk}
            isLowerBetter={true}
          />
          <div className="risk-insight-panel">
            <AlertCircle size={20} />
            <div>
              <h4>Decision Insight</h4>
              <p>
                {stockA.riskScore < stockB.riskScore 
                  ? `${stockA.symbol} offers a more stable behavioral profile compared to ${stockB.symbol}.` 
                  : `${stockB.symbol} exhibits lower statistical variance in current market conditions.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StockSelector = ({ label, selected, others, onChange, color }) => {
  return (
    <div className="stock-selector-card" style={{ borderLeft: `4px solid ${color}` }}>
      <label>{label}</label>
      <div className="select-wrapper">
        <select 
          value={selected.symbol} 
          onChange={(e) => onChange(others.find(s => s.symbol === e.target.value))}
        >
          {others.map(s => (
            <option key={s.symbol} value={s.symbol}>{s.name} ({s.symbol})</option>
          ))}
        </select>
        <ChevronDown size={18} />
      </div>
      <div className="selector-preview">
        <span className="current-price">₹{selected.price.toLocaleString("en-IN")}</span>
        <span className="sector-pill">{selected.sector}</span>
      </div>
    </div>
  );
};

const MetricRow = ({ label, icon, valA, valB, winner, isPositiveA, isPositiveB, isLowerBetter = false }) => {
  return (
    <div className="metric-compare-row">
      <div className="metric-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="metric-values">
        <div className={`val-box ${winner === "stockA" ? "winner" : ""}`}>
          <span className={isPositiveA !== undefined ? (isPositiveA ? "positive" : "negative") : ""}>
            {valA}
          </span>
          {winner === "stockA" && <div className="win-indicator" />}
        </div>
        <div className={`val-box ${winner === "stockB" ? "winner" : ""}`}>
          <span className={isPositiveB !== undefined ? (isPositiveB ? "positive" : "negative") : ""}>
            {valB}
          </span>
          {winner === "stockB" && <div className="win-indicator" />}
        </div>
      </div>
    </div>
  );
};

export default Compare;
