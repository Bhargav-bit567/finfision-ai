import StockWatchlist from "../shared/StockWatchlist.jsx";
import LiveNewsTicker from "../shared/LiveNewsTicker.jsx";

function DashboardPreview({ onOpenTrading }) {
  return (
    <section className="dashboard-preview reveal">
      <div className="preview-copy">
        <p className="eyebrow">Live workspace preview</p>
        <h2>Fear is costing you more than the market ever will.</h2>
        <p>Use a simulated market surface with fast candles, UP/DOWN practice trades, AI interventions, and a news tape.</p>
        <button className="primary-button magnetic" type="button" onClick={onOpenTrading}>
          Open trading desk
        </button>
      </div>
      <div className="preview-terminal">
        <div className="terminal-chart">
          {Array.from({ length: 32 }, (_, index) => (
            <i
              key={index}
              className={index % 3 === 0 ? "down" : "up"}
              style={{ "--height": `${24 + ((index * 13) % 74)}%` }}
            />
          ))}
        </div>
        <StockWatchlist compact />
        <LiveNewsTicker compact />
      </div>
    </section>
  );
}

export default DashboardPreview;
