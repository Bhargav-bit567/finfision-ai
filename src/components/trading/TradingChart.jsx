import { motion } from "framer-motion";

function scale(value, min, max, height) {
  if (max === min) return height / 2;
  const val = Number.isFinite(value) ? value : (min + max) / 2;
  const result = height - ((val - min) / (max - min)) * height;
  return isNaN(result) ? height / 2 : result;
}

function TradingChart({ candles = [], trades = [] }) {
  const width = 980;
  const height = 520;
  const padding = 34;

  // Defensive check for empty or missing candles
  if (!candles || candles.length === 0) {
    return (
      <div className="chart-canvas flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mb-2 mx-auto"
          />
          <p style={{ color: "var(--text-secondary)" }}>Connecting to Quantum Feed...</p>
        </div>
      </div>
    );
  }

  const prices = candles.flatMap((candle) => [candle.high, candle.low, candle.open, candle.close]).filter(p => typeof p === 'number' && !isNaN(p));
  const min = (prices.length > 0 ? Math.min(...prices) : 5800) - 10;
  const max = (prices.length > 0 ? Math.max(...prices) : 5900) + 10;

  const step = (width - padding * 2) / Math.max(1, candles.length);
  const latest = candles[candles.length - 1];

  // Safe price calculation
  const safeClose = latest?.close ?? (min + max) / 2;
  const priceY = scale(safeClose, min, max, height - padding * 2) + padding;
  const sPriceY = isNaN(priceY) ? padding : priceY;

  return (
    <div className="chart-canvas" role="img" aria-label="Simulated candlestick chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.01" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#chartFill)" rx="12" />

        {/* Grid Lines */}
        {Array.from({ length: 8 }, (_, index) => {
          const y = padding + index * (height - padding * 2) / 7;
          return (
            <line
              key={index}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              className="grid-line"
              style={{ stroke: 'rgba(255,255,255,0.05)', strokeDasharray: '4 4' }}
            />
          );
        })}

        {/* Candles */}
        {candles.map((candle, index) => {
          const x = padding + index * step + step / 2;

          // SAFE VALUES FIRST
          const safeHigh = Number.isFinite(candle.high) ? candle.high : min;
          const safeLow = Number.isFinite(candle.low) ? candle.low : min;
          const safeOpen = Number.isFinite(candle.open) ? candle.open : min;
          const safeClose = Number.isFinite(candle.close) ? candle.close : min;

          // SCALE AFTER SAFETY
          const high = scale(safeHigh, min, max, height - padding * 2) + padding;
          const low = scale(safeLow, min, max, height - padding * 2) + padding;
          const open = scale(safeOpen, min, max, height - padding * 2) + padding;
          const close = scale(safeClose, min, max, height - padding * 2) + padding;

          // DIRECTION FIX
          const up = safeClose >= safeOpen;

          // FINAL SAFE VALUES
          const sX = Number.isFinite(x) ? x : 0;
          const sH = Number.isFinite(high) ? high : 0;
          const sL = Number.isFinite(low) ? low : 0;
          const sO = Number.isFinite(open) ? open : 0;
          const sC = Number.isFinite(close) ? close : 0;
          const sStep = Number.isFinite(step) ? step : 0;
          return (
            <g key={`${candle.time}-${index}`} className={up ? "candle-up" : "candle-down"}>
              {/* Wick */}
              <motion.line
                initial={{ x1: sX, x2: sX, y1: sH, y2: sL }}
                animate={{ x1: sX, x2: sX, y1: sH, y2: sL }}
                transition={{ type: "tween", duration: 0.1 }}
                stroke={up ? "#10b981" : "#ef4444"}
                strokeWidth="1.5"
              />
              {/* Body */}
              <motion.rect
                initial={{
                  x: sX - sStep * 0.25,
                  y: Math.min(sO, sC),
                  width: Math.max(1, sStep * 0.5),
                  height: Math.max(0.5, Math.abs(sO - sC))
                }}
                animate={{
                  x: sX - sStep * 0.25,
                  y: Math.min(sO, sC),
                  width: Math.max(1, sStep * 0.5),
                  height: Math.max(0.5, Math.abs(sO - sC))
                }}
                rx="1"
                fill={up ? "#10b981" : "#ef4444"}
                transition={{ type: "tween", duration: 0.1 }}
              />
            </g>
          );
        })}

        {/* Current Price Line */}
        <motion.line
          initial={{ x1: padding, x2: width - padding, y1: sPriceY, y2: sPriceY }}
          animate={{ x1: padding, x2: width - padding, y1: sPriceY, y2: sPriceY }}
          transition={{ type: "tween", duration: 0.1 }}
          className="current-price-line"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        <motion.g
          initial={{ x: width - padding - 80, y: sPriceY }}
          animate={{ x: width - padding - 80, y: sPriceY }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          <rect x="0" y="-12" width="70" height="24" rx="4" fill="var(--accent-primary)" />
          <text
            x="35"
            y="5"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="600"
          >
            {safeClose.toFixed(2)}
          </text>
        </motion.g>

        {/* Open Trades Markers */}
        {trades
          .filter((trade) => trade.status === "open")
          .map((trade) => {
            const entry = Number.isFinite(trade.entry) ? trade.entry : min;
            const y = scale(entry, min, max, height - padding * 2) + padding;
            const sY = isNaN(y) ? padding : y;
            return (
              <g key={trade.id}>
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={sY}
                  y2={sY}
                  className={trade.direction === "up" ? "entry-up" : "entry-down"}
                  stroke={trade.direction === "up" ? "#10b981" : "#ef4444"}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <circle cx={padding} cy={sY} r="4" fill={trade.direction === "up" ? "#10b981" : "#ef4444"} />
                <text
                  x={padding + 8}
                  y={sY - 6}
                  fill="white"
                  fontSize="10"
                  className="entry-label uppercase opacity-80"
                >
                  {trade.direction} @ {trade.entry.toFixed(2)}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
}

export default TradingChart;

