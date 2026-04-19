import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/trading/Sidebar.jsx";
import AssetSelector from "../components/trading/AssetSelector.jsx";
import TradingChart from "../components/trading/TradingChart.jsx";
import TradingPanel from "../components/trading/TradingPanel.jsx";
import FearMeter from "../components/ai/FearMeter.jsx";
import EmotionTimeline from "../components/ai/EmotionTimeline.jsx";
import InsightsPanel from "../components/ai/InsightsPanel.jsx";
import InterventionModal from "../components/trading/InterventionModal.jsx";
import LiveNewsTicker from "../components/shared/LiveNewsTicker.jsx";
import StockWatchlist from "../components/shared/StockWatchlist.jsx";
import { generateCandles, nextCandle, seededTimeline } from "../utils/market.js";
import { useBehaviorStore } from "../store/useBehaviorStore.js";

function getTradeResultInsight(trade, latestPrice) {
  const entry = Number.isFinite(trade.entry) ? trade.entry : latestPrice;
  const exit = Number.isFinite(latestPrice) ? latestPrice : entry;
  const move = exit - entry;
  const againstDirection = trade.direction === "up" ? move < 0 : move > 0;
  const absoluteMove = Math.abs(move);
  const directionLabel = trade.direction === "up" ? "UP" : "DOWN";

  if (!againstDirection) {
    return `Good read. Price closed ${absoluteMove.toFixed(2)} points in favor of your ${directionLabel} entry.`;
  }

  if (trade.behaviorFlags?.includes("revenge")) {
    return "AI suggestion: This loss looks like revenge timing. Wait for one clean candle after a loss before entering again.";
  }

  if (trade.behaviorFlags?.includes("impulse") || trade.decisionMs < 2000) {
    return "AI suggestion: You entered too fast. The price moved against your call before confirmation formed.";
  }

  if (absoluteMove < Math.max(1.2, entry * 0.00045)) {
    return "AI suggestion: The loss was close. Avoid entering near flat movement unless the next candle has clear momentum.";
  }

  return `AI suggestion: Your ${directionLabel} call lost because price closed ${absoluteMove.toFixed(2)} points the other way. Check trend direction before the next entry.`;
}

function TradeResultCard({ result }) {
  if (!result) return null;

  const won = result.status === "won";

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`trade-result-card ${won ? "won" : "lost"}`}
      aria-live="polite"
    >
      <div className="trade-result-head">
        <span>{won ? "Result: Profit" : "Result: Loss"}</span>
        <strong>{result.payout >= 0 ? "+" : "-"}₹{Math.abs(result.payout).toLocaleString("en-IN")}</strong>
      </div>
      <div className="trade-result-meta">
        <span>{result.direction.toUpperCase()}</span>
        <span>Entry {result.entry.toFixed(2)}</span>
        <span>Exit {result.exit.toFixed(2)}</span>
      </div>
      <p>{result.insight}</p>
    </motion.section>
  );
}

function Trading() {
  const navigate = useNavigate();
  const [candles, setCandles] = useState(() => generateCandles(72));
  const [amount, setAmount] = useState(70);
  const [duration, setDuration] = useState(60);
  const [latestResult, setLatestResult] = useState(null);

  // --- Store State ---
  const {
    balance, setBalance,
    trades, addTrade, updateTrade,
    fearScore, updateFearScore,
    disciplineScore,
    decisionStartedAt, resetDecisionClock,
    interactionCount, recordInteraction,
    recordEvent, logIntervention
  } = useBehaviorStore();

  const [intervention, setIntervention] = useState({ open: false, type: null, pendingDirection: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDirection, setProcessingDirection] = useState(null);

  // Market Ticker simulation
  const ticksRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      ticksRef.current += 1;
      setCandles((current) => {
        if (!current || current.length === 0) return generateCandles(72);

        const lastCandle = { ...current[current.length - 1] };

        // Add random micro-volatility to the current close for a "live" feel
        const noise = (Math.random() - 0.5) * 3.5;
        lastCandle.close = Math.max(2500, (lastCandle.close || 2954.58) + noise);
        lastCandle.high = Math.max(lastCandle.high, lastCandle.close);
        lastCandle.low = Math.min(lastCandle.low, lastCandle.close);

        const newCandles = [...current];
        newCandles[newCandles.length - 1] = lastCandle;

        // Form a new candle organically every ~2.4 seconds (16 ticks)
        if (ticksRef.current % 16 === 0) {
          const next = nextCandle(lastCandle, current.length);
          return [...newCandles.slice(-90), next];
        }

        return newCandles;
      });
    }, 150);
    return () => clearInterval(id);
  }, []);

  const tradesRef = useRef(trades);

  useEffect(() => {
    tradesRef.current = trades;
  }, [trades]);

  const currentPriceRef = useRef(2954.58);
  const currentPrice = candles[candles.length - 1]?.close ?? 2954.58;
  const previousPrice = candles[candles.length - 2]?.close ?? currentPrice;
  const change = currentPrice - previousPrice;

  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  // Trade Resolution Timer
  useEffect(() => {
    const id = setInterval(() => {
      // Use refs to get latest values without triggering re-runs or having stale closures
      const latestPrice = currentPriceRef.current;
      const currentTrades = tradesRef.current;

      if (currentTrades.length === 0) return;

      currentTrades.forEach((trade) => {
        if (trade.status !== "open") return;

        const remaining = Math.max(0, Math.ceil((trade.expiresAt - Date.now()) / 1000));

        if (remaining > 0) {
          updateTrade(trade.id, { remaining });
          return;
        }

        const won = trade.direction === "up" ? latestPrice >= trade.entry : latestPrice <= trade.entry;
        const payout = won ? Math.round(trade.amount * 0.85) : -trade.amount;
        const resolvedTrade = {
          ...trade,
          status: won ? "won" : "lost",
          remaining: 0,
          exit: latestPrice,
          payout,
          insight: getTradeResultInsight(trade, latestPrice)
        };

        setBalance(prev => Math.max(0, prev + (won ? trade.amount + payout : 0)));
        updateFearScore();
        updateTrade(trade.id, {
          status: resolvedTrade.status,
          remaining: resolvedTrade.remaining,
          exit: resolvedTrade.exit,
          payout: resolvedTrade.payout
        });
        setLatestResult(resolvedTrade);
      });
    }, 1000);

    return () => clearInterval(id);
  }, [setBalance, updateFearScore, updateTrade]);
  const timeline = useMemo(() => seededTimeline(fearScore), [fearScore]);

  const executeTrade = (direction, isForced = false) => {
    const decisionMs = Date.now() - decisionStartedAt;
    const flags = [];
    if (intervention.type) flags.push(intervention.type);

    // Explicit impulsivity check if not already flagged
    if (decisionMs < 2000) flags.push('impulse');

    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };
    addTrade({
      id: generateId(),

      // 🔥 ADD THIS (REAL STOCK DATA)
      symbol: "RELIANCE",
      name: "Reliance Industries",
      qty: amount / currentPrice,
      price: currentPrice,

      // 🔥 EXISTING DATA (DON'T REMOVE)
      direction,
      amount,
      entry: currentPrice,
      createdAt: Date.now(),
      expiresAt: Date.now() + duration * 1000,
      remaining: duration,
      status: "open",
      decisionMs,
      behaviorFlags: flags
    });

    if (isForced && intervention.type) {
      recordEvent('warning_ignored', intervention.type, {
        amount,
        fearScore,
        decisionMs
      });
    }

    resetDecisionClock();
    setIntervention({ open: false, type: null, pendingDirection: null, tier: null });
  };

  const placeTrade = (direction) => {
    if (isProcessing) return;
    setProcessingDirection(direction);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessingDirection(null);

      updateFearScore();

      // CRITICAL: Get latest fearScore from store state immediately to avoid stale React closures
      const latestFear = useBehaviorStore.getState().fearScore;
      const latestDiscipline = useBehaviorStore.getState().disciplineScore;

      const decisionMs = Date.now() - decisionStartedAt;

      // Thresholds shift down by 10 if discipline is low (< 50)
      const shift = latestDiscipline < 50 ? 10 : 0;

      const isRevenge = (trades.length >= 2 && trades.slice(-2).every((trade) => trade.status === "lost")) && decisionMs < 3000;

      // Tiers
      const tier4 = latestFear >= (90 - shift);
      const tier3 = latestFear >= (85 - shift);
      const tier2 = latestFear >= (70 - shift);

      let type = null;
      if (isRevenge) type = "revenge";
      else if (tier4) type = "panic_critical";
      else if (tier3) type = "panic_strong";
      else if (tier2) type = "panic_moderate";

      if (type) {
        setIntervention({
          open: true,
          type,
          pendingDirection: direction,
          tier: tier4 ? 4 : tier3 ? 3 : 2
        });
        return;
      }

      executeTrade(direction);
    }, 600); // Simulated execution ingestion delay
  };

  const closedTrades = trades.filter((trade) => trade.status !== "open");
  const wins = closedTrades.filter((trade) => trade.status === "won").length;
  const winRate = closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : 0;

  return (
    <div className="trading-app" onClick={recordInteraction}>
      <Sidebar onBack={() => navigate("/")} />
      <div className="trading-workspace">
        <LiveNewsTicker />
        <div className="trading-topbar">
          <AssetSelector price={currentPrice} change={change} />
          <div className="session-stats">
            <span>Win rate {winRate}%</span>
            <span>{trades.filter((trade) => trade.status === "open").length} open</span>
          </div>
        </div>
        <section className="trading-grid">
          <div className="chart-stage">
            <TradingChart candles={candles} trades={trades} />
            <div className="timeframe-row" aria-label="Time frame selector">
              {["5s", "1m", "5m", "15m", "1h", "4h", "1d"].map((frame) => (
                <button key={frame} type="button" className={frame === "5s" ? "active" : ""}>
                  {frame}
                </button>
              ))}
            </div>
            <div className="status-bar">
              <span>{trades.filter((trade) => trade.status === "open").length} / 12 active trades</span>
              <span>Market simulation live</span>
              <button type="button">•••</button>
            </div>
          </div>
          <aside className="right-rail">
            <TradingPanel
              balance={balance}
              amount={amount}
              setAmount={setAmount}
              duration={duration}
              setDuration={setDuration}
              onTrade={placeTrade}
              isProcessing={isProcessing}
              processingDirection={processingDirection}
            />
            <TradeResultCard result={latestResult} />

            {/* Tier 1: Soft Warning */}
            {fearScore >= (disciplineScore < 50 ? 50 : 60) && fearScore < (disciplineScore < 50 ? 60 : 70) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="soft-warning-banner glass-panel"
              >
                <div className="warning-content">
                  <span className="dot" />
                  <p>AI Note: You're showing signs of hesitation. Stay focused.</p>
                </div>
              </motion.div>
            )}

            <FearMeter value={fearScore} />
            <EmotionTimeline data={timeline} />
            <InsightsPanel fearScore={fearScore} trades={trades} interactionCount={interactionCount} />
            <StockWatchlist />
          </aside>
        </section>
      </div>

      <InterventionModal
        isOpen={intervention.open}
        type={intervention.type}
        tier={intervention.tier}
        disciplineLow={disciplineScore < 50}
        onProceed={(response) => {
          logIntervention(intervention.type, `Tier ${intervention.tier}`, response);
          executeTrade(intervention.pendingDirection, true);
        }}
        onCancel={() => {
          logIntervention(intervention.type, `Tier ${intervention.tier}`, 'cancelled');
          resetDecisionClock();
          setIntervention({ open: false, type: null, pendingDirection: null, tier: null });
        }}
      />
    </div>
  );
}

export default Trading;
