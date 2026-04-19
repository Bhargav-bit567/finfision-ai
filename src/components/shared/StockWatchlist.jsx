import { useEffect, useState } from "react";
import { getWatchlist } from "../../utils/market.js";

function StockWatchlist({ compact = false }) {
  const [items, setItems] = useState(() => getWatchlist());

  useEffect(() => {
    const id = setInterval(() => setItems(getWatchlist()), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={compact ? "watchlist compact" : "watchlist"}>
      <div className="panel-heading">
        <span>Watchlist</span>
        <strong>Live</strong>
      </div>
      {items.map((item) => (
        <div className="watch-row" key={item.name}>
          <span>{item.name}</span>
          <strong>{item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
          <em className={item.change >= 0 ? "positive" : "negative"}>
            {item.change >= 0 ? "+" : ""}
            {item.change}%
          </em>
        </div>
      ))}
    </section>
  );
}

export default StockWatchlist;
