import { useBehaviorStore } from "../../store/useBehaviorStore";
import { motion } from "framer-motion";

const AllocationChart = () => {
  const { holdings } = useBehaviorStore();
  
  const sectors = holdings.reduce((acc, item) => {
    acc[item.sector] = (acc[item.sector] || 0) + (item.qty * item.currentPrice);
    return acc;
  }, {});

  const totalValue = Object.values(sectors).reduce((a, b) => a + b, 0);
  
  if (totalValue === 0) {
    return (
      <div className="allocation-chart-container empty-state">
        <h3>Asset Allocation</h3>
        <p>No active holdings to display.</p>
      </div>
    );
  }

  const data = Object.entries(sectors).map(([name, value]) => ({
    name,
    value,
    percent: (value / totalValue) * 100
  }));

  const radius = 80;
  const strokeWidth = 14;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const colors = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#facc15"];

  return (
    <div className="allocation-chart-container">
      <h3>Asset Allocation</h3>
      <div className="chart-wrapper">
        <svg viewBox="0 0 200 200">
          {data.map((item, i) => {
            const offset = (cumulativePercent / 100) * circumference;
            const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
            cumulativePercent += item.percent;

            return (
              <motion.circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
          <text x={center} y={center} textAnchor="middle" dy=".3em" className="chart-center-text">
            {holdings.length} Assets
          </text>
        </svg>
        
        <div className="legend">
          {data.map((item, i) => (
            <div key={item.name} className="legend-item">
              <span className="dot" style={{ background: colors[i % colors.length] }}></span>
              <span className="name">{item.name}</span>
              <span className="percent">{item.percent.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationChart;
