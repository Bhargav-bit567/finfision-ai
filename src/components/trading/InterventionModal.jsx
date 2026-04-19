import { motion } from "framer-motion";
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const InterventionModal = ({ isOpen, type, tier, disciplineLow, onProceed, onCancel }) => {
  const [cooldown, setCooldown] = useState(0);
  const [showOptionalCooldown, setShowOptionalCooldown] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCooldown(0);
      setShowOptionalCooldown(false);
      return;
    }

    // Tier 4: Forced 10s delay
    // Tier 2-3: Optional or short delay
    if (tier === 4 && disciplineLow) {
      setCooldown(10);
    } else if (tier === 3) {
      setShowOptionalCooldown(true);
    } else if (tier === 2) {
      setCooldown(3);
    }

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, tier, disciplineLow]);

  if (!isOpen) return null;

  const content = {
    panic_moderate: {
      title: "Atmospheric Alert",
      msg: "The market atmosphere is shifting. Your interaction patterns suggest you might be feeling the heat.",
      advice: "Take a deep breath. Verify your indicators before committing.",
      icon: <AlertTriangle size={32} />,
      risk: "medium"
    },
    panic_strong: {
      title: "High Pressure Warning",
      msg: "Your fear metrics are reaching high zones. Decisions made here often lead to erratic sizing.",
      advice: "Consider a 10s cooldown to reset your pulse. You're still in control.",
      icon: <ShieldAlert size={32} />,
      risk: "high"
    },
    panic_critical: {
      title: "Psychological Checkpoint",
      msg: "Fear levels are extreme. Your discipline score is currently lower than optimal for this volatility.",
      advice: "A forced 10s reflection is active. Focus on your breathing and strategy.",
      icon: <AlertTriangle size={32} className="pulse-red" />,
      risk: "critical"
    },
    revenge: {
      title: "Recovery Drive Detected",
      msg: "After consecutive losses, the urge to 'win it back' is a powerful bias.",
      advice: "Step back. Focus on the next best execution, not the previous loss.",
      icon: <ShieldAlert size={32} />,
      risk: "high"
    }
  }[type] || {
    title: "Systemic Check-in",
    msg: "Just a gentle reminder to stay centered with your goals.",
    advice: "Every trade is a new opportunity to practice discipline.",
    icon: <CheckCircle2 size={32} />,
    risk: "neutral"
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className={`intervention-modal glass-panel risk-${content.risk}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="intervention-icon">
          {content.icon}
        </div>
        
        <h2>{content.title}</h2>
        <p>{content.msg}</p>
        
        <div className="advice-box glass-panel" style={{ padding: '1rem', marginBottom: '2rem', background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
           <strong>Advisor Tip:</strong> {content.advice}
        </div>

        <div className="intervention-actions">
          {tier === 3 && showOptionalCooldown && cooldown === 0 && (
            <button 
              className="btn-cooldown" 
              onClick={() => {
                setCooldown(10);
                setShowOptionalCooldown(false);
              }}
            >
              Suggested 10s Reflection
            </button>
          )}

          <button 
            className="btn-proceed" 
            onClick={() => onProceed(cooldown > 0 ? 'delayed_proceed' : 'immediate_proceed')}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Forced Reflection (${cooldown}s)` : "Confirm & Execute"}
          </button>
          
          <button className="btn-cancel" onClick={() => onCancel()}>
            Step Away
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InterventionModal;
