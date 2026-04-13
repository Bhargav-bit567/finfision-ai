import { useBehaviorStore } from "../../store/useBehaviorStore";
import { motion } from "framer-motion";
import CountUp from "../shared/CountUp";

const generateSparkline = (trend, count = 10) => {
  let pts = [];
  let y = 15;
  for (let i = 0; i < count; i++) {
    pts.push(`${(i / (count - 1)) * 100},${y}`);
    const move = (Math.random() - 0.5) * 8;
    y = Math.max(2, Math.min(28, y + (trend === 'pos' ? -move - 1 : move + 1))); 
  }
  return pts.join(" ");
};

const PortfolioSummary = () => {
  const { balance, holdings } = useBehaviorStore();

  const equityValue = holdings.reduce((acc, stock) => acc + stock.qty * stock.currentPrice, 0);
  const totalValue = balance + equityValue;
  const initialValue = 10000 + holdings.reduce((acc, stock) => acc + stock.qty * stock.avgPrice, 0);
  const totalPL = totalValue - initialValue;
  const plPercentage = (totalPL / initialValue) * 100;

  const stats = [
    { label: "Wallet Balance", value: balance, prefix: "$", sub: "Available to trade" },
    { label: "Equity Value", value: equityValue, prefix: "$", sub: `${holdings.length} Assets` },
    { label: "Total Net Worth", value: totalValue, prefix: "$", sub: "Portfolio + Cash", highlight: true },
    { 
      label: "Total P/L", 
      value: Math.abs(totalPL), 
      prefix: totalPL >= 0 ? "+$" : "-$", 
      sub: `${plPercentage.toFixed(2)}%`,
      trend: totalPL >= 0 ? "positive" : "negative"
    }
  ];

  return (
    <div className="portfolio-summary-grid">
      {stats.map((stat, i) => {
        const isPos = stat.trend !== "negative";
        const sparkPts = generateSparkline(isPos ? 'pos' : 'neg');

        return (
          <motion.div 
            key={stat.label}
            className={`summary-card dashboard-card-lift ${stat.highlight ? 'highlight' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="label">{stat.label}</span>
            <strong className={`value ${stat.trend || ''}`}>
              <CountUp value={stat.value} prefix={stat.prefix} decimals={stat.label === "Total P/L" ? 2 : 0} />
            </strong>
            <span className={`sub ${stat.trend || ''}`}>{stat.sub}</span>
            
            <svg className="sparkline-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
               <path 
                 className={isPos ? "sparkline-path-pos" : "sparkline-path-neg"} 
                 d={`M ${sparkPts}`} 
               />
               <path 
                 d={`M 0 30 L 0 ${sparkPts.split(',')[1]} L ${sparkPts} L 100 30 Z`} 
                 fill={isPos ? "url(#fade-pos)" : "url(#fade-neg)"} 
                 opacity="0.2" 
                 stroke="none" 
               />
               <defs>
                 <linearGradient id="fade-pos" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#10b981" />
                   <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
                 <linearGradient id="fade-neg" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#ef4444" />
                   <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
               </defs>
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PortfolioSummary;
