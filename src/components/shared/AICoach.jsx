import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, ChevronUp, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { getBehaviorData, trackInteraction } from '../../utils/behaviorTracker';

const AICoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quickTip, setQuickTip] = useState(null);

  // Periodic behavior checking for "Quick Tips"
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getBehaviorData();
      
      if (data.clickFrequency > 8) {
        setQuickTip("Slow down! Rapid clicking often leads to impulsive mistakes.");
      } else if (data.scrollSpeed > 3000) {
        setQuickTip("Feeling impatient? Take a deep breath before your next action.");
      } else if (data.assetSwitching > 5) {
        setQuickTip("Analysis paralysis detected. Try focusing on one asset for 2 minutes.");
      } else {
        setQuickTip(null);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchFullAdvice = async () => {
    setLoading(true);
    try {
      // Mocking current stock context for now
      const payload = {
        stock: "NVIDIA (NVDA)",
        price_change: 2.4,
        volatility: "High",
        user_behavior: getBehaviorData()
      };

      const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/ai';
      console.log(`Fetching AI advice from: ${API_URL}/advice`);
      
      const response = await fetch(`${API_URL}/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Backend offline');
      const data = await response.json();
      setAdvice(data);
    } catch (err) {
      console.warn('Backend fetch failed, using mock advice');
      setAdvice({
        recommendation: "Hold",
        confidence: 85,
        reasoning: "Your current interaction patterns show high engagement without panic. This is usually the best state for objective decision-making.",
        emotional_insight: "You're demonstrating disciplined observation. Keep this pace.",
        warning: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-coach-wrapper">
      <AnimatePresence>
        {quickTip && !isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="quick-tip-bubble"
          >
            <AlertCircle size={16} />
            {quickTip}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={`ai-coach-widget ${isOpen ? 'open' : ''}`}
        layout
      >
        <button 
          className="coach-toggle" 
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) fetchFullAdvice();
          }}
        >
          {isOpen ? <X size={20} /> : <Brain size={24} />}
          {!isOpen && <span className="coach-pulse" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="coach-panel"
            >
              <div className="panel-header">
                <Sparkles size={18} />
                <span>Behavioral Insights</span>
              </div>
              
              <div className="panel-content">
                {loading ? (
                  <div className="coach-loading">
                    <div className="thinking-blob"></div>
                    <p>Analyzing your behavior...</p>
                  </div>
                ) : advice ? (
                  <div className="advice-details">
                    <div className="advice-box rec">
                      <label>AI Recommendation</label>
                      <strong>{advice.recommendation}</strong>
                      <span className="confidence-label">{advice.confidence}% Confidence</span>
                    </div>

                    <div className="advice-box insight">
                      <MessageSquare size={14} />
                      <p>{advice.emotional_insight}</p>
                    </div>

                    {advice.warning && (
                      <div className="advice-box warning">
                        <AlertCircle size={14} />
                        <p>{advice.warning}</p>
                      </div>
                    )}

                    <div className="reasoning-text">
                      <label>Technical Reasoning</label>
                      <p>{advice.reasoning}</p>
                    </div>

                    <button className="refresh-btn" onClick={fetchFullAdvice}>
                      Refresh Analysis
                    </button>
                  </div>
                ) : (
                  <p>Initializing...</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AICoach;
