import { useBehaviorStore } from "../../store/useBehaviorStore";
import { motion } from "framer-motion";

const TradeHistory = () => {
  const { trades } = useBehaviorStore();

  const recentTrades = [...trades].reverse().slice(0, 10);

  return (
    <div className="trade-history-panel glass-card">
      <div className="panel-header">
        <h3>Recent Trade Activity</h3>
        <span>Last 10 trades</span>
      </div>

      <div className="history-list">
        {recentTrades.length === 0 ? (
          <div className="empty-state">No trades recorded in this session.</div>
        ) : (
          recentTrades.map((trade, i) => (
            <motion.div 
              key={trade.id}
              className={`trade-item ${trade.status}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="trade-main">
                <span className={`direction ${trade.direction}`}>{trade.direction.toUpperCase()}</span>
                <span className="asset">${trade.entry.toLocaleString()}</span>
              </div>
              <div className="trade-details">
                <span className="amount">${trade.amount}</span>
                <span className={`status-badge ${trade.status}`}>
                  {trade.status === 'open' ? `${trade.remaining}s` : (trade.payout >= 0 ? `+$${trade.payout}` : `-$${Math.abs(trade.payout)}`)}
                </span>
              </div>
              <div className="trade-time">
                {new Date(trade.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
