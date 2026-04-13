import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Card = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`dashboard-card ${className}`}
  >
    {children}
  </motion.div>
);

const LineChart = ({ color, points }) => (
  <svg viewBox="0 0 200 80" className="mini-chart">
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 1 }}
      d={`M 0 60 ${points.map((p, i) => `L ${i * 20} ${60 - p}`).join(" ")}`}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d={`M 0 60 ${points.map((p, i) => `L ${i * 20} ${60 - p}`).join(" ")} L 180 80 L 0 80 Z`}
      fill={`url(#grad-${color.replace("#", "")})`}
      opacity="0.2"
    />
    <defs>
      <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </svg>
);

const HeroDashboard = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="hero-dashboard-container">
      {/* Background Glow */}
      <div className="dashboard-glow" />

      {/* Main Stats Card */}
      <Card className="card-main" delay={0.2}>
        <div className="card-header">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Statistics</p>
            <h3>Total users</h3>
          </div>
          <div className="stat-value">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              325k
            </motion.span>
            <span className="trend up">↗ 12%</span>
          </div>
        </div>
        <LineChart color="#06b6d4" points={[10, 25, 15, 40, 30, 50, 45, 60, 55, 70]} />
      </Card>

      {/* Sentiment / Gauge Card */}
      <Card className="card-sentiment" delay={0.4}>
        <div className="gauge-container">
          <svg viewBox="0 0 100 100" className="gauge-svg">
            <circle cx="50" cy="50" r="45" className="gauge-bg" />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              className="gauge-progress"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.72 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </svg>
          <div className="gauge-content">
            <span className="gauge-label">Fear Index</span>
            <span className="gauge-value">72%</span>
          </div>
        </div>
      </Card>

      {/* Market Ticker Card */}
      <Card className="card-ticker" delay={0.6}>
        <div className="ticker-item">
          <span className="symbol">BTC-INR</span>
          <span className="price">₹58,49,000</span>
          <span className="change down">-0.9%</span>
        </div>
        <div className="ticker-item">
          <span className="symbol">NIFTY 50</span>
          <span className="price">22,418.6</span>
          <span className="change up">+0.5%</span>
        </div>
      </Card>

      {/* Floating User Avatars or Social proof element inside dashboard */}
      <Card className="card-social" delay={0.8}>
        <div className="avatar-group">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="avatar-circle" style={{ backgroundColor: `hsl(${idx * 40 + 200}, 70%, 60%)` }}>
              {String.fromCharCode(64 + idx)}
            </div>
          ))}
          <span className="plus-more">+1k</span>
        </div>
        <p>10,000+ active practice sessions</p>
      </Card>
      
      {/* Visual Depth Elements */}
      <motion.div 
        className="floating-dot"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: '10%', right: '10%', background: '#ec4899' }}
      />
      <motion.div 
        className="floating-dot"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ bottom: '20%', left: '5%', background: '#8b5cf6' }}
      />
    </div>
  );
};

export default HeroDashboard;
