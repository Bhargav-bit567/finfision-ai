import { useBehaviorStore } from "../../store/useBehaviorStore";
import { motion } from "framer-motion";

const HoldingsList = () => {
  const { holdings } = useBehaviorStore();

  return (
    <div className="holdings-panel glass-card">
      <div className="panel-header">
        <h3>Current Holdings</h3>
        <span>{holdings.length} Assets</span>
      </div>
      
      <div className="table-wrapper">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>Current</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((stock, i) => {
              const pl = (stock.currentPrice - stock.avgPrice) * stock.qty;
              const plPercent = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
              
              return (
                <motion.tr 
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="asset-cell">
                    <div className="symbol">{stock.symbol}</div>
                    <div className="name">{stock.name}</div>
                  </td>
                  <td>{stock.qty}</td>
                  <td>₹{stock.avgPrice.toLocaleString("en-IN")}</td>
                  <td className={stock.currentPrice >= stock.avgPrice ? "positive" : "negative"}>
                    ₹{stock.currentPrice.toLocaleString("en-IN")}
                  </td>
                  <td className={pl >= 0 ? "positive" : "negative"}>
                    <div className="pl-val">₹{pl.toLocaleString("en-IN")}</div>
                    <div className="pl-pct">{pl >= 0 ? "+" : ""}{plPercent.toFixed(2)}%</div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsList;
