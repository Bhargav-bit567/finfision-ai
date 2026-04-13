function TradingPanel({ balance, amount, setAmount, duration, setDuration, onTrade, isProcessing, processingDirection }) {
  return (
    <section className="trading-panel" aria-label="Trade configuration">
      <div className="balance-row">
        <span>Practice balance</span>
        <strong>₹{(balance ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong>
      </div>
      <label>
        Investment
        <div className="stepper">
          <button type="button" onClick={() => setAmount((value) => Math.max(10, Number(value) - 10))}>−</button>
          <input value={`₹${amount || 0}`} readOnly aria-label="Investment amount" />
          <button type="button" onClick={() => setAmount((value) => Number(value) + 10)}>+</button>
        </div>
      </label>
      <label>
        Duration
        <div className="stepper">
          <button type="button" onClick={() => setDuration((value) => Math.max(15, value - 15))}>−</button>
          <input value={`${duration}s`} readOnly />
          <button type="button" onClick={() => setDuration((value) => Math.min(3600, value + 15))}>+</button>
        </div>
      </label>
      <div className="profit-row">
        <span>Profit</span>
        <strong>85%</strong>
      </div>
      <button 
        className={`trade-button up ${isProcessing && processingDirection === "up" ? "processing" : ""}`} 
        type="button" 
        onClick={() => onTrade("up")}
        disabled={isProcessing}
      >
        {isProcessing && processingDirection === "up" ? "Executing..." : "↑ UP"}
      </button>
      <button 
        className={`trade-button down ${isProcessing && processingDirection === "down" ? "processing" : ""}`} 
        type="button" 
        onClick={() => onTrade("down")}
        disabled={isProcessing}
      >
        {isProcessing && processingDirection === "down" ? "Executing..." : "↓ DOWN"}
      </button>
      <label className="toggle-row">
        Enable orders
        <input type="checkbox" defaultChecked />
      </label>
    </section>
  );
}

export default TradingPanel;
