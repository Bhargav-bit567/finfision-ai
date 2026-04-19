import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Search, Loader2 } from "lucide-react";
import { useBehaviorStore } from "../store/useBehaviorStore";
import { fetchAIAdvice } from "../api/advisor";

const AIAdvisor = () => {
  const [stock, setStock] = useState("");
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fearScore, patterns, disciplineScore, scoreTrend, behavioralEvents } = useBehaviorStore();

  const handleGetAdvice = async (e) => {
    e.preventDefault();
    if (!stock) return;

    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const response = await fetchAIAdvice(stock, { 
        fearScore, 
        confidenceScore: patterns?.confidenceScore || 68
      });
      setAdvice(response);
    } catch (err) {
      setError("Failed to reach the AI engine. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-page">
        <header className="page-header">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="advisor-icon-wrapper"
          >
            <Brain size={48} className="glow-icon" />
          </motion.div>
          <h1>Systemic Advisor</h1>
          <p>AI-driven coaching tailored to your behavioral patterns</p>
        </header>

        <section className="advisor-search-section">
          <form className="advisor-form" onSubmit={handleGetAdvice}>
            <div className="input-glass-group">
              <Search className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Enter stock name (e.g. RELIANCE, BTC)"
                value={stock}
                onChange={(e) => setStock(e.target.value.toUpperCase())}
              />
              <button 
                type="submit" 
                className="advisor-submit-btn" 
                disabled={loading || !stock}
              >
                {loading ? <Loader2 className="spin" /> : "Consult AI"}
              </button>
            </div>
          </form>
        </section>
        
        <section className="discipline-pulse glass-panel">
          <div className="pulse-header">
            <h3>Discipline Pulse</h3>
            <div className={`discipline-badge-group`}>
              <div className={`score-trend-mini ${scoreTrend}`}>
                {scoreTrend === 'improving' && <TrendingUp size={14} />}
                {scoreTrend === 'declining' && <TrendingDown size={14} />}
              </div>
              <div className={`discipline-score-large ${disciplineScore >= 80 ? 'high' : disciplineScore >= 60 ? 'stable' : disciplineScore >= 40 ? 'risky' : 'critical'}`}>
                {disciplineScore}%
              </div>
            </div>
          </div>
          
          <div className="discipline-status-bar">
            <div className="status-label">
              Status: <span>{disciplineScore >= 80 ? 'High Discipline' : disciplineScore >= 60 ? 'Stable' : disciplineScore >= 40 ? 'Risky' : 'Critical'}</span>
            </div>
          </div>

          <p className="pulse-desc">Adhering to your trading plan and maintaining emotional distance from market volatility.</p>
          
          <div className="event-timeline">
            {behavioralEvents.length === 0 ? (
              <div className="empty-events">
                <CheckCircle className="text-green-500" size={24} />
                <p>No behavioral infractions detected today. Great focus!</p>
              </div>
            ) : (
              behavioralEvents.slice().reverse().slice(0, 5).map((event) => (
                <div key={event.id} className="behavior-event-card">
                  <div className={`event-type-icon type-${event.type}`}>
                    {event.type === 'warning_ignored' ? <AlertTriangle size={16} /> : <Brain size={16} />}
                  </div>
                  <div className="event-details">
                    <h4>{event.condition === 'revenge' ? 'Revenge Trade' : 
                         event.condition === 'impulse' ? 'Impulsive Action' : 
                         event.condition === 'panic' ? 'Volatility Pressure' : 
                         event.interventionType === 'panic_critical' ? 'Critical Intervention' : 'Observation Noted'}</h4>
                    <p>{event.type === 'penalty' ? 'Discipline score decreased' : event.type === 'warning_ignored' ? 'Proceeded anyway' : 'Observation noted'} • {new Date(event.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-state"
            >
              <div className="thinking-blob" />
              <p>Analyzing market context & your behavior...</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-card"
            >
              <AlertTriangle className="error-icon" />
              <p>{error}</p>
            </motion.div>
          )}

          {advice && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="advice-result-container"
            >
              <div className="advice-main-card glass-panel">
                <div className="advice-header">
                  <div className="advice-title">
                    <p className="eyebrow">Recommendation for {advice.stock}</p>
                    <h2 className={`recommend-text ${advice.recommendation.toLowerCase()}`}>
                      {advice.recommendation}
                    </h2>
                  </div>
                  <div className="confidence-stat">
                    <span>{advice.confidence}%</span>
                    <p>Confidence</p>
                  </div>
                </div>

                <div className="confidence-track">
                  <motion.div 
                    className="confidence-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${advice.confidence}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                <div className="advice-body">
                  <div className="reasoning-block">
                    <TrendingUp className="block-icon" size={20} />
                    <p>{advice.reasoning}</p>
                  </div>

                  <motion.div 
                    className={`warning-block ${fearScore > 60 ? 'critical' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AlertTriangle className="block-icon" size={20} />
                    <span>{advice.emotionalWarning}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default AIAdvisor;
