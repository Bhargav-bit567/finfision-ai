function AssetSelector({ price, change }) {
  const positive = change >= 0;

  return (
    <div className="asset-selector">
      <button type="button" aria-label="Add Asia Composite Index to watchlist">★</button>
      <div>
        <span>Asia Composite Index</span>
        <strong>{(price || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
      </div>
      <em className={positive ? "positive" : "negative"}>
        {positive ? "+" : ""}
        {(change || 0).toFixed(2)} pts
      </em>
    </div>
  );
}

export default AssetSelector;
