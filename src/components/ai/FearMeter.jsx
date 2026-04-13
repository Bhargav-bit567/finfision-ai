function FearMeter({ value }) {
  const getLabel = (val) => {
    const rounded = Math.round(val);
    if (rounded <= 30) return { text: "Calm", color: "#10b981" };
    if (val < 60) return { text: "Alert", color: "#facc15" };
    if (val < 85) return { text: "High Fear", color: "#f97316" };
    return { text: "Panic", color: "#ef4444" };
  };

  const { text, color } = getLabel(value);

  return (
    <section className="fear-panel glass-panel">
      <div className="panel-heading">
        <span>Fear index</span>
        <strong style={{ color }}>{text}</strong>
      </div>
      <div className="fear-gauge" style={{ "--value": `${value}%`, "--color": color }}>
        <span>{Math.round(value)}</span>
      </div>
      <p>{value > 60 ? "Decision rhythm is outside calm range. Focus on strategy." : "Your mental state is stable and focused."}</p>
    </section>
  );
}

export default FearMeter;
