function EmotionTimeline({ data }) {
  const points = data.map((point, index) => `${(index / (data.length - 1)) * 100},${100 - point.value}`).join(" ");

  return (
    <section className="timeline-panel">
      <div className="panel-heading">
        <span>Emotion timeline</span>
        <strong>Live</strong>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Fear trend line">
        <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((point, index) => (
          <circle key={point.label} cx={(index / (data.length - 1)) * 100} cy={100 - point.value} r="1.7" />
        ))}
      </svg>
    </section>
  );
}

export default EmotionTimeline;
