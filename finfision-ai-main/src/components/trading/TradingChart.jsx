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
  const leftRail = 26;
  const chartTop = 34;
  const chartBottom = 30;
  const plotLeft = padding + leftRail;
  const plotRight = width - padding;
  const plotTop = padding + chartTop;
  const plotBottom = height - padding - chartBottom;
  const plotHeight = plotBottom - plotTop;

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

  const step = (plotRight - plotLeft) / Math.max(1, candles.length);
  const latest = candles[candles.length - 1];

  // Safe price calculation
  const safeClose = latest?.close ?? (min + max) / 2;
  const priceY = scale(safeClose, min, max, plotHeight) + plotTop;
  const sPriceY = isNaN(priceY) ? plotTop : priceY;
  const previous = candles[candles.length - 2]?.close ?? safeClose;
  const liveMove = safeClose - previous;

  return (
    <div className="chart-canvas" role="img" aria-label="Simulated candlestick chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="deepGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="#121722" rx="4" />
        <rect width={width} height={height} fill="url(#chartFill)" rx="4" />
        <rect x="0" y="0" width={leftRail} height={height} fill="#0d1119" opacity="0.92" />
        <rect x="0" y="0" width={width} height={chartTop} fill="#171c27" opacity="0.74" />
        <line x1={leftRail} x2={leftRail} y1="0" y2={height} stroke="rgba(255,255,255,0.08)" />
        <line x1="0" x2={width} y1={chartTop} y2={chartTop} stroke="rgba(255,255,255,0.07)" />

        <g className="chart-toolbar">
          <text x="10" y="21" fill="#94a3b8" fontSize="10">S&P 500 - mini Futures - 5 - CME</text>
          <text x="144" y="21" fill={liveMove >= 0 ? "#22d3ee" : "#a855f7"} fontSize="10">
            O {safeClose.toFixed(2)} H {max.toFixed(2)} L {min.toFixed(2)} C {safeClose.toFixed(2)}
          </text>
          {["+", "/", "-", "=", "[]", "|", "P", "^", "~", "fx", "mag", "grid"].map((item, index) => (
            <text key={item} x={360 + index * 25} y="21" fill="rgba(226,232,240,0.62)" fontSize="11">
              {item}
            </text>
          ))}
        </g>

        <g className="chart-left-tools">
          {["=", "M", ">", "F", "+", "Q", "fx", "A", "T", "B", "C"].map((item, index) => (
            <text key={`${item}-${index}`} x="8" y={52 + index * 32} fill="rgba(226,232,240,0.5)" fontSize="12">
              {item}
            </text>
          ))}
        </g>

        {/* Grid Lines */}
        {Array.from({ length: 9 }, (_, index) => {
          const y = plotTop + index * plotHeight / 8;
          return (
            <line
              key={`h-${index}`}
              x1={plotLeft}
              x2={plotRight}
              y1={y}
              y2={y}
              className="grid-line"
              style={{ stroke: 'rgba(255,255,255,0.055)' }}
            />
          );
        })}
        {Array.from({ length: 12 }, (_, index) => {
          const x = plotLeft + index * (plotRight - plotLeft) / 11;
          return (
            <line
              key={`v-${index}`}
              x1={x}
              x2={x}
              y1={chartTop}
              y2={height}
              className="grid-line"
              style={{ stroke: 'rgba(255,255,255,0.045)' }}
            />
          );
        })}

        {/* Candles */}
        {candles.map((candle, index) => {
          const x = plotLeft + index * step + step / 2;

          // SAFE VALUES FIRST
          const safeHigh = Number.isFinite(candle.high) ? candle.high : min;
          const safeLow = Number.isFinite(candle.low) ? candle.low : min;
          const safeOpen = Number.isFinite(candle.open) ? candle.open : min;
          const safeClose = Number.isFinite(candle.close) ? candle.close : min;

          // SCALE AFTER SAFETY
          const high = scale(safeHigh, min, max, plotHeight) + plotTop;
          const low = scale(safeLow, min, max, plotHeight) + plotTop;
          const open = scale(safeOpen, min, max, plotHeight) + plotTop;
          const close = scale(safeClose, min, max, plotHeight) + plotTop;

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
            <g key={`${candle.time}-${index}`} className={up ? "candle-up chart-cyan" : "candle-down chart-purple"} filter="url(#glow)">
              {/* Wick */}
              <motion.line
                initial={{ x1: sX, x2: sX, y1: sH, y2: sL }}
                animate={{ x1: sX, x2: sX, y1: sH, y2: sL }}
                transition={{ type: "tween", duration: 0.1 }}
                stroke={up ? "#22d3ee" : "#8b35d8"}
                strokeWidth="1.5"
                strokeOpacity="0.8"
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
                fill={up ? "#22d3ee" : "#8b35d8"}
                fillOpacity="0.95"
                transition={{ type: "tween", duration: 0.1 }}
              />
            </g>
          );
        })}

        {/* Current Price Line */}
        <motion.line
          initial={{ x1: plotLeft, x2: plotRight, y1: sPriceY, y2: sPriceY }}
          animate={{ x1: plotLeft, x2: plotRight, y1: sPriceY, y2: sPriceY }}
          transition={{ type: "tween", duration: 0.1 }}
          className="current-price-line"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        <motion.g
          initial={{ x: plotRight - 86, y: sPriceY }}
          animate={{ x: plotRight - 86, y: sPriceY }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          <rect x="0" y="-12" width="74" height="24" rx="2" fill={liveMove >= 0 ? "#22d3ee" : "#f59e0b"} filter="url(#deepGlow)" />
          <text
            x="37"
            y="5"
            textAnchor="middle"
            fill="#020617"
            fontSize="12"
            fontWeight="800"
          >
            {safeClose.toFixed(2)}
          </text>
        </motion.g>

        <g className="chart-price-axis">
          {Array.from({ length: 8 }, (_, index) => {
            const price = max - index * (max - min) / 7;
            const y = plotTop + index * plotHeight / 7;
            return (
              <text key={`p-${index}`} x={plotRight + 8} y={y + 4} fill="rgba(226,232,240,0.7)" fontSize="10">
                {price.toFixed(0)}
              </text>
            );
          })}
        </g>

        {/* Open Trades Markers */}
        {trades
          .filter((trade) => trade.status === "open")
          .map((trade) => {
            const entry = Number.isFinite(trade.entry) ? trade.entry : min;
            const y = scale(entry, min, max, plotHeight) + plotTop;
            const sY = isNaN(y) ? plotTop : y;
            return (
              <g key={trade.id}>
                <line
                  x1={plotLeft}
                  x2={plotRight}
                  y1={sY}
                  y2={sY}
                  className={trade.direction === "up" ? "entry-up" : "entry-down"}
                  stroke={trade.direction === "up" ? "#06b6d4" : "#a855f7"}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <circle cx={plotLeft} cy={sY} r="4" fill={trade.direction === "up" ? "#22d3ee" : "#8b35d8"} />
                <text
                  x={plotLeft + 8}
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
