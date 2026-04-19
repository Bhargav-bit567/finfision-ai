import { motion } from "framer-motion";
import { useBehaviorStore } from "../store/useBehaviorStore";
import { BarChart3, Clock, Zap, Target, MousePointer2 } from "lucide-react";

const Insights = () => {
  const { fearScore, patterns, trades } = useBehaviorStore();

  const metrics = [
    { 
      label: "Decision Speed", 
      value: `${(patterns?.decisionSpeed || 0).toFixed(1)}s`, 
      icon: <Clock size={20} />,
      desc: "Avg time before trade confirm"
    },
    { 
      label: "Confidence Score", 
      value: `${patterns?.confidenceScore || 0}%`, 
      icon: <Target size={20} />,
      desc: "Based on win rate & stability"
    },
    { 
      label: "Interaction Intensity", 
      value: patterns?.overcheckingCount || 0, 
      icon: <MousePointer2 size={20} />,
      desc: "Frequency of price checks"
    },
    { 
      label: "Total Trades", 
      value: trades.length, 
      icon: <Zap size={20} />,
      desc: "Career trade history"
    }
  ];

  return (
    <div className="insights-page">
      <header className="page-header">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="advisor-icon-wrapper"
        >
          <BarChart3 size={48} className="glow-icon" />
        </motion.div>
        <h1>Behavioral Intelligence</h1>
        <p>Analyzing your psychological edge in the markets</p>
      </header>

      <div className="insights-grid">
        {/* Fear Score Card */}
        <motion.div 
          className="insight-card glass-panel main-index"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="index-display">
            <div className="index-circle">
              <svg viewBox="0 0 100 100" className="progress-svg">
                <circle cx="50" cy="50" r="45" className="bg" />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  className="fg"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: fearScore / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="index-content">
                <span className="index-number">{Math.round(fearScore)}%</span>
                <span className="index-label">Fear Score</span>
              </div>
            </div>
          </div>
          <div className="index-info">
            <h3>{fearScore > 60 ? 'Extreme Anxiety' : fearScore > 40 ? 'Moderate Caution' : 'Confident Stance'}</h3>
            <p>Your current trading behavior aligns with {Math.round(fearScore)}% market anxiety. Your decision speed is {(patterns?.decisionSpeed || 0) > 5 ? 'measured' : 'impulsive'}.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-subgrid">
          {metrics.map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="stat-card glass-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-header">
                <div className="stat-icon-box">{stat.icon}</div>
                <span className="stat-value">{stat.value}</span>
              </div>
              <div className="stat-footer">
                <span className="stat-label">{stat.label}</span>
                <p className="stat-desc">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pattern Analysis */}
      <motion.section 
        className="pattern-analysis glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Recent Decision Patterns</h2>
        <div className="pattern-tags">
          {(patterns?.decisionSpeed || 0) < 3 && <span className="tag impulsive">Impulsive Entries</span>}
          {(patterns?.overcheckingCount || 0) > 5 && <span className="tag anxious">Over-checking Bias</span>}
          {fearScore < 30 && <span className="tag calm">Calm Executions</span>}
          <span className="tag active">Active Monitoring</span>
        </div>
        <div className="chart-placeholder">
          <div className="graph-line">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <motion.div 
                key={i} 
                className="graph-bar" 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.8 + i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Insights;
