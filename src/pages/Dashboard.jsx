import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useBehaviorStore } from "../store/useBehaviorStore";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Compass,
  Repeat,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";

// ─── Market data (mock) ──────────────────────────────────────────
const MARKET_DATA = [
  { symbol: "NIFTY", price: "24,315", change: "+0.8%", pos: true },
  { symbol: "SENSEX", price: "80,428", change: "+1.2%", pos: true },
  { symbol: "BTC", price: "$62,450", change: "+3.1%", pos: true },
  { symbol: "BANK NIFTY", price: "52,145", change: "-0.3%", pos: false },
  { symbol: "GOLD", price: "$2,340", change: "+0.5%", pos: true },
  { symbol: "ETH", price: "$3,120", change: "-1.2%", pos: false },
];

// ─── Quick nav cards ──────────────────────────────────────────────
const QUICK_CARDS = [
  {
    path: "/dashboard/portfolio",
    label: "My Portfolio",
    icon: Wallet,
    desc: "View holdings, P&L and allocation",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.25)",
  },
  {
    path: "/dashboard/analysis",
    label: "Analysis",
    icon: BarChart3,
    desc: "Behavioral intelligence & fear index",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.25)",
  },
  {
    path: "/dashboard/advisor",
    label: "AI Advisor",
    icon: Brain,
    desc: "Get AI-driven trade recommendations",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.25)",
  },
  {
    path: "/dashboard/explore",
    label: "Market Explore",
    icon: Compass,
    desc: "Discover stocks across all sectors",
    color: "#10b981",
    glow: "rgba(16,185,129,0.25)",
  },
  {
    path: "/dashboard/compare",
    label: "Compare",
    icon: Repeat,
    desc: "Side-by-side asset comparison",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    path: "/dashboard/news",
    label: "Financial News",
    icon: Newspaper,
    desc: "Latest market news & sentiment",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
  },
];

// ─── Mini sparkline ──────────────────────────────────────────────
function MiniSparkline({ positive }) {
  const pts = positive
    ? "0,28 16,24 32,20 48,22 64,14 80,10 100,6"
    : "0,6 16,10 32,14 48,12 64,20 80,24 100,28";
  const color = positive ? "#10b981" : "#ef4444";
  return (
    <svg viewBox="0 0 100 34" className="mkt-sparkline" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Live clock ──────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span className="db-live-clock">
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { balance, holdings, fearScore, disciplineScore, trades, scoreTrend } = useBehaviorStore();

  const equityValue = holdings.reduce((a, s) => a + s.qty * s.currentPrice, 0);
  const totalValue = balance + equityValue;
  const initialValue = 10000 + holdings.reduce((a, s) => a + s.qty * s.avgPrice, 0);
  const totalPL = totalValue - initialValue;
  const plPct = ((totalPL / initialValue) * 100).toFixed(2);
  const isGain = totalPL >= 0;

  // Recent trades (last 5)
  const recentTrades = [...trades].reverse().slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name
    ? user.name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="db-overview">
      {/* ── Hero greeting ── */}
      <motion.div
        className="db-greeting"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="db-greeting-left">
          <p className="db-greeting-sub">{greeting()},</p>
          <h1 className="db-greeting-name">{userName} 👋</h1>
          <p className="db-greeting-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            &nbsp;·&nbsp;
            <LiveClock />
          </p>
        </div>
        <div className="db-greeting-right">
          <motion.button
            className="db-launch-terminal-btn"
            onClick={() => navigate("/trade")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <TrendingUp size={16} />
            Launch Terminal
          </motion.button>
        </div>
      </motion.div>

      {/* ── Market ticker strip ── */}
      <div className="db-ticker-strip">
        {MARKET_DATA.map((m, i) => (
          <motion.div
            key={m.symbol}
            className="db-ticker-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="db-ticker-symbol">{m.symbol}</span>
            <span className="db-ticker-price">{m.price}</span>
            <span className={`db-ticker-change ${m.pos ? "pos" : "neg"}`}>
              {m.pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {m.change}
            </span>
            <MiniSparkline positive={m.pos} />
          </motion.div>
        ))}
      </div>

      {/* ── Stats row ── */}
      <div className="db-stats-row">
        {[
          {
            label: "Total Net Worth",
            value: `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
            sub: "Portfolio + Cash",
            icon: Wallet,
            accent: "#8b5cf6",
            delay: 0,
          },
          {
            label: "Total P / L",
            value: `${isGain ? "+" : "-"}$${Math.abs(totalPL).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}`,
            sub: `${plPct}% since start`,
            icon: isGain ? TrendingUp : TrendingDown,
            accent: isGain ? "#10b981" : "#ef4444",
            delay: 0.08,
          },
          {
            label: "Fear Score",
            value: `${Math.round(fearScore)}%`,
            sub:
              fearScore > 60 ? "Extreme Anxiety" : fearScore > 40 ? "Moderate Caution" : "Confident Stance",
            icon: AlertTriangle,
            accent: fearScore > 60 ? "#ef4444" : fearScore > 40 ? "#f59e0b" : "#10b981",
            delay: 0.16,
          },
          {
            label: "Discipline Score",
            value: `${disciplineScore}%`,
            sub:
              scoreTrend === "improving"
                ? "↑ Improving"
                : scoreTrend === "declining"
                ? "↓ Declining"
                : "Stable",
            icon: ShieldCheck,
            accent: disciplineScore >= 80 ? "#10b981" : disciplineScore >= 60 ? "#f59e0b" : "#ef4444",
            delay: 0.24,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              className="db-stat-card"
              style={{ "--accent": s.accent }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: s.delay, duration: 0.45 }}
            >
              <div className="db-stat-icon" style={{ background: `${s.accent}22`, color: s.accent }}>
                <Icon size={20} />
              </div>
              <div className="db-stat-body">
                <span className="db-stat-label">{s.label}</span>
                <strong className="db-stat-value" style={{ color: s.accent }}>
                  {s.value}
                </strong>
                <span className="db-stat-sub">{s.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main content: Quick Nav Cards + Recent Activity ── */}
      <div className="db-main-grid">
        {/* Quick Nav Cards */}
        <div>
          <h2 className="db-section-title">
            <LayoutDashboard size={18} /> Quick Access
          </h2>
          <div className="db-quick-grid">
            {QUICK_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.path}
                  className="db-quick-card"
                  style={{ "--card-color": card.color, "--card-glow": card.glow }}
                  onClick={() => navigate(card.path)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="db-quick-icon">
                    <Icon size={22} />
                  </div>
                  <div className="db-quick-body">
                    <span className="db-quick-label">{card.label}</span>
                    <p className="db-quick-desc">{card.desc}</p>
                  </div>
                  <ArrowUpRight size={16} className="db-quick-arrow" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right column: Holdings + Recent Trades */}
        <div className="db-right-col">
          {/* Holdings */}
          <div className="db-panel">
            <div className="db-panel-header">
              <h3><Activity size={16} /> Holdings</h3>
              <button className="db-panel-link" onClick={() => navigate("/dashboard/portfolio")}>
                View all <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="db-holdings-list">
              {holdings.length === 0 && (
                <p className="db-empty-msg">No holdings yet. Start trading!</p>
              )}
              {holdings.map((h) => {
                const pl = (h.currentPrice - h.avgPrice) * h.qty;
                const plPct = (((h.currentPrice - h.avgPrice) / h.avgPrice) * 100).toFixed(2);
                const pos = pl >= 0;
                return (
                  <div key={h.symbol} className="db-holding-row">
                    <div className="db-holding-avatar" style={{ background: pos ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)" }}>
                      {h.symbol.charAt(0)}
                    </div>
                    <div className="db-holding-info">
                      <span className="db-holding-sym">{h.symbol}</span>
                      <span className="db-holding-name">{h.name}</span>
                    </div>
                    <div className="db-holding-right">
                      <span className="db-holding-val">
                        ${(h.currentPrice * h.qty).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </span>
                      <span className={`db-holding-pl ${pos ? "pos" : "neg"}`}>
                        {pos ? "+" : ""}{plPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="db-panel">
            <div className="db-panel-header">
              <h3><Clock size={16} /> Recent Activity</h3>
              <button className="db-panel-link" onClick={() => navigate("/dashboard/portfolio")}>
                View all <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="db-trades-list">
              {recentTrades.length === 0 && (
                <p className="db-empty-msg">No trades yet. Head to the Terminal!</p>
              )}
              {recentTrades.map((t, i) => (
                <div key={t.id ?? i} className="db-trade-row">
                  <div className={`db-trade-badge ${t.type === "buy" ? "buy" : "sell"}`}>
                    {t.type === "buy" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                  <div className="db-trade-info">
                    <span className="db-trade-sym">{t.symbol}</span>
                    <span className="db-trade-time">
                      {new Date(t.timestamp || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="db-trade-amount">
                    <span>${(t.amount ?? 0).toLocaleString()}</span>
                    <span className={`db-trade-status status-${t.status ?? "open"}`}>
                      {t.status ?? "open"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Tip */}
          <motion.div
            className="db-tip-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="db-tip-icon">
              <Zap size={20} />
            </div>
            <div>
              <p className="db-tip-title">Behavioral Insight</p>
              <p className="db-tip-body">
                {fearScore > 60
                  ? "Your fear score is elevated. Consider taking a break before your next trade."
                  : fearScore > 40
                  ? "Moderate anxiety detected. Review your plan before executing new positions."
                  : "You're in a calm state — ideal for disciplined decision-making. Great work!"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
