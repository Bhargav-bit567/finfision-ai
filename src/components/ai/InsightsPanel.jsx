function getInsights(fearScore, trades, interactionCount) {
  const losses = trades.filter((trade) => trade.status === "lost").length;
  const open = trades.filter((trade) => trade.status === "open").length;
  const quickTrades = trades.slice(-3).length >= 3;

  if (fearScore > 70) {
    return [
      "Detected elevated stress. Take one full candle before the next entry.",
      losses > 0 ? "Loss response is raising the index. Review the setup, not the outcome." : "Decision pressure is high before results arrive.",
    ];
  }

  if (quickTrades || open > 2) {
    return ["You have a fast trading cluster. Reduce speed and keep sizing stable.", "A 30-second pause can prevent revenge entries."];
  }

  if (interactionCount > 10) {
    return ["Chart checking is elevated. Pick one signal and write the reason before clicking.", "Hesitation can be useful when it becomes a checklist."];
  }

  return ["Good rhythm. Your sizing and execution pace look consistent.", "Keep holding trades to expiry and review the entry point afterward."];
}

function InsightsPanel({ fearScore, trades, interactionCount }) {
  const insights = getInsights(fearScore, trades, interactionCount);

  return (
    <section className="insights-panel">
      <div className="panel-heading">
        <span>AI coach</span>
        <strong>{trades.length} trades</strong>
      </div>
      {insights.map((insight) => (
        <p key={insight}>{insight}</p>
      ))}
      <div className="achievement-chip">Milestone: steady sizing streak</div>
    </section>
  );
}

export default InsightsPanel;
