import { useState, useEffect } from "react";
import { useBehaviorStore } from "../../store/useBehaviorStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const AIInsights = () => {
  const { trades, fearScore, fearAnalysis, interactionCount } = useBehaviorStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getInsights = () => {
    const insights = [];

    const closedTrades = trades.filter(t => t.status !== 'open');
    if (closedTrades.length >= 2) {
      const last = closedTrades[closedTrades.length - 1];
      if (last.status === 'lost' && trades[trades.length - 1]?.amount > last.amount) {
        insights.push({
          type: "warning",
          title: "Revenge Trading Detected",
          message: "You increased your trade size after a loss. This is a common behavioral trap called 'loss chasing'."
        });
      }
    }

    if (fearScore > 75) {
      insights.push({
        type: "caution",
        title: "Emotional Volatility",
        message: fearAnalysis?.result || "Your fear index is critical. Consider taking a 5-minute break to reset your decision-making baseline."
      });
    }

    if (fearAnalysis?.drivers?.length) {
      const topDriver = fearAnalysis.drivers[0];
      insights.push({
        type: fearScore > 65 ? "warning" : "info",
        title: `Fear Driver: ${topDriver.label}`,
        message: `This is currently adding ${topDriver.points} pressure points to your fear index.`
      });
    }

    if (interactionCount > 15) {
       insights.push({
          type: "info",
          title: "Over-analysis",
          message: "High interaction count detected. You might be over-thinking or 'fiddling' with the UI instead of following a strategy."
       });
    }

    const recentStatuses = closedTrades.slice(-3).map(t => t.status);
    if (recentStatuses.every(s => s === 'won') && recentStatuses.length === 3) {
      insights.push({
        type: "positive",
        title: "Discipline Check",
        message: "You're on a 3-trade win streak. Avoid the temptation to over-leverage out of over-confidence."
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "info",
        title: "System Ready",
        message: "Watching your behavior patterns. Execute your trades naturally to populate AI insights."
      });
    }

    return insights;
  };

  const insights = getInsights();

  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [insights.length]);

  // Ensure index is valid
  const safeIndex = currentIndex >= insights.length ? 0 : currentIndex;
  const currentInsight = insights[safeIndex];

  return (
    <div className="portfolio-insights glass-card dashboard-card-lift">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Live AI Feedback</h3>
        <Sparkles size={16} color="#8b5cf6" />
      </div>
      <div className="insights-list" style={{ minHeight: '120px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentInsight.title}
            className={`insight-item ${currentInsight.type}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', width: '100%' }}
          >
            <div className="insight-icon" />
            <div className="insight-content">
              <h4>{currentInsight.title}</h4>
              <p>{currentInsight.message}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '1rem', justifyContent: 'center' }}>
        {insights.map((_, idx) => (
          <div 
            key={idx} 
            style={{ 
              width: '6px', height: '6px', borderRadius: '50%', 
              background: idx === safeIndex ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s'
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
