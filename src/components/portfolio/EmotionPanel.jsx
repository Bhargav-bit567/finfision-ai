import { useBehaviorStore } from "../../store/useBehaviorStore";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const EmotionPanel = () => {
  const { fearScore, fearReason, patterns, disciplineScore, scoreTrend } = useBehaviorStore();
  const confidence = patterns?.confidenceScore || 68;

  const getFearInfo = (val) => {
    if (val < 30) return { label: "Calm", color: "#10b981", bg: "#10b98115" };
    if (val < 60) return { label: "Alert", color: "#facc15", bg: "#facc1515" };
    if (val < 85) return { label: "High Fear", color: "#f97316", bg: "#f9731615" };
    return { label: "Panic", color: "#ef4444", bg: "#ef444415" };
  };

  const getDisciplineInfo = (score) => {
    if (score >= 80) return { label: "High Discipline", color: "#10b981" };
    if (score >= 60) return { label: "Stable", color: "#3b82f6" };
    if (score >= 40) return { label: "Risky", color: "#facc15" };
    return { label: "Critical", color: "#ef4444" };
  };

  const fearInfo = getFearInfo(fearScore);
  const discipline = getDisciplineInfo(disciplineScore);

  return (
    <div className="emotion-panel-wrapper">
      <div className="metric-card glass-card dashboard-card-lift">
        <h3>Fear Score</h3>
        <div className="gauge-container">
          <svg viewBox="0 0 100 50">
            <path d="M 10 45 A 35 35 0 0 1 90 45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
            <motion.path 
              d="M 10 45 A 35 35 0 0 1 90 45" 
              fill="none" 
              stroke={fearInfo.color} 
              strokeWidth="8" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: fearScore / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="gauge-value">
            <span className="number">{fearScore}</span>
            <span className="status" style={{ color: fearInfo.color }}>{fearInfo.label}</span>
          </div>
        </div>
        <div className="fear-reason-badge" style={{ color: fearInfo.color, backgroundColor: fearInfo.bg }}>
           {fearReason}
        </div>
      </div>

      <div className="metric-card glass-card dashboard-card-lift">
        <div className="card-header-with-trend">
          <h3>Discipline Score</h3>
          <div className={`trend-indicator ${scoreTrend}`}>
            {scoreTrend === 'improving' && <TrendingUp size={16} />}
            {scoreTrend === 'declining' && <TrendingDown size={16} />}
            {scoreTrend === 'stable' && <Minus size={16} />}
          </div>
        </div>
        <div className="score-display">
          <div className="score-value" style={{ color: discipline.color }}>
            {disciplineScore}
          </div>
          <div className="score-label" style={{ backgroundColor: `${discipline.color}15`, color: discipline.color }}>
            {discipline.label}
          </div>
        </div>
        <div className="progress-bg score-bar">
          <motion.div 
            className="progress-fill" 
            style={{ backgroundColor: discipline.color }}
            initial={{ width: 0 }}
            animate={{ width: `${disciplineScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      <div className="metric-card glass-card dashboard-card-lift">
        <h3>Decision Confidence</h3>
        <div className="confidence-bar-wrapper">
           <div className="bar-header">
              <span>Expert Consistency</span>
              <span>{confidence}%</span>
           </div>
           <div className="progress-bg">
              <motion.div 
                className="progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
           </div>
           <p className="hint">Based on your recent win/loss consistency.</p>
        </div>
      </div>
    </div>
  );
};

export default EmotionPanel;
