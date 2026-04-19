import { motion } from "framer-motion";

const headlines = [
  "RBI keeps liquidity stance steady as markets await earnings",
  "Tech shares lead Asia session while volatility cools",
  "Energy names recover after two-day pullback",
  "Analysts flag disciplined sizing as retail participation rises",
  "Institutional flow indicates accumulation at support zones",
];

function LiveNewsTicker({ compact = false }) {
  return (
    <div className={compact ? "news-ticker compact" : "news-ticker"} aria-label="Financial news ticker">
      <div className="news-label">
        <span className="pulse-dot" />
        LIVE
      </div>
      <div className="ticker-viewport">
        <motion.div 
          className="ticker-track"
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {headlines.concat(headlines).map((headline, index) => (
            <span key={`${headline}-${index}`} className="ticker-item">
              <span className="separator">/</span>
              {headline}
            </span>
          ))}
        </motion.div>
        <div className="ticker-fade-left" />
        <div className="ticker-fade-right" />
      </div>
    </div>
  );
}

export default LiveNewsTicker;

