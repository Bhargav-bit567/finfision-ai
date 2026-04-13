import { motion } from "framer-motion";

/**
 * A minimalist sparkline chart for stock cards
 */
export const Sparkline = ({ data, color = "#10b981", height = 40, width = 120 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * step,
    y: height - ((val - min) / range) * height
  }));

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <motion.path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Glow effect */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "blur(4px)", opacity: 0.3 }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
};

/**
 * A larger comparison chart for two stocks
 */
export const ComparisonChart = ({ stockA, stockB, height = 300 }) => {
  const allValues = [...stockA.sparkline, ...stockB.sparkline];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  
  const generatePath = (data, width) => {
    const step = width / (data.length - 1);
    const points = data.map((val, i) => ({
      x: i * step,
      y: height - ((val - min) / range) * height
    }));
    return `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
  };

  return (
    <div className="comparison-chart-container" style={{ width: "100%", height }}>
      <svg width="100%" height="100%" viewBox={`0 0 800 ${height}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="0"
            y1={height * p}
            x2="800"
            y2={height * p}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Stock B Area & Line */}
        <motion.path
          d={generatePath(stockB.sparkline, 800)}
          fill="none"
          stroke="#ec4899"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.path
          d={`${generatePath(stockB.sparkline, 800)} L 800,${height} L 0,${height} Z`}
          fill="url(#gradB)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        {/* Stock A Area & Line */}
        <motion.path
          d={generatePath(stockA.sparkline, 800)}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.path
          d={`${generatePath(stockA.sparkline, 800)} L 800,${height} L 0,${height} Z`}
          fill="url(#gradA)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </svg>
    </div>
  );
};
