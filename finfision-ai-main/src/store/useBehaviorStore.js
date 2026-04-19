import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getStreak = (trades, status) => {
  let streak = 0;
  for (let index = trades.length - 1; index >= 0; index -= 1) {
    if (trades[index].status !== status) break;
    streak += 1;
  }
  return streak;
};

const buildFearAnalysis = (state, nextTrades = state.trades) => {
  const now = Date.now();
  const closedTrades = nextTrades.filter((trade) => trade.status === 'won' || trade.status === 'lost');
  const openTrades = nextTrades.filter((trade) => trade.status === 'open');
  const recentClosed = closedTrades.slice(-6);
  const lastTrade = closedTrades[closedTrades.length - 1];

  const lossStreak = getStreak(closedTrades, 'lost');
  const winStreak = getStreak(closedTrades, 'won');
  const losses = recentClosed.filter((trade) => trade.status === 'lost').length;
  const wins = recentClosed.filter((trade) => trade.status === 'won').length;
  const impulseCount = recentClosed.filter((trade) => trade.behaviorFlags?.includes('impulse') || trade.decisionMs < 2200).length;
  const warningIgnores = state.behavioralEvents.filter((event) => event.type === 'warning_ignored').slice(-3).length;
  const revengeCount = recentClosed.filter((trade) => trade.behaviorFlags?.includes('revenge')).length + warningIgnores;
  const averageDecisionMs = recentClosed.length
    ? recentClosed.reduce((sum, trade) => sum + (trade.decisionMs || 4500), 0) / recentClosed.length
    : 5000;
  const totalClosedPayout = closedTrades.reduce((sum, trade) => sum + (trade.payout || 0), 0);
  const drawdownPercent = Math.max(0, (-totalClosedPayout / Math.max(1, state.sessionStartValue)) * 100);
  const openExposure = openTrades.reduce((sum, trade) => sum + (trade.amount || 0), 0);
  const exposurePercent = (openExposure / Math.max(1, state.balance + openExposure)) * 100;
  const timeSinceLastTrade = lastTrade ? (now - (lastTrade.createdAt || now)) / 1000 : 999;

  const drivers = [
    {
      key: 'loss_streak',
      label: lossStreak > 1 ? `${lossStreak} losses in a row` : 'Recent losses',
      points: lossStreak * 12 + Math.max(0, losses - wins) * 4,
    },
    {
      key: 'speed',
      label: averageDecisionMs < 2500 ? 'Fast entries' : 'Decision speed',
      points: averageDecisionMs < 1800 ? 18 : averageDecisionMs < 3000 ? 10 : averageDecisionMs > 9000 ? 4 : 0,
    },
    {
      key: 'impulse',
      label: 'Impulse signals',
      points: impulseCount * 7,
    },
    {
      key: 'revenge',
      label: 'Warning overrides',
      points: revengeCount * 9,
    },
    {
      key: 'overchecking',
      label: 'Overchecking',
      points: Math.max(0, state.interactionCount - 7) * 2.1,
    },
    {
      key: 'exposure',
      label: 'Open exposure',
      points: openTrades.length * 5 + exposurePercent * 0.45,
    },
    {
      key: 'drawdown',
      label: 'Session drawdown',
      points: drawdownPercent * 18,
    }
  ]
    .map((driver) => ({ ...driver, points: Math.round(clamp(driver.points, 0, 28)) }))
    .filter((driver) => driver.points > 0)
    .sort((a, b) => b.points - a.points);

  const calmCredit = clamp((timeSinceLastTrade - 45) / 18, 0, 18) + (winStreak >= 2 ? Math.min(12, winStreak * 4) : 0);
  const base = 22;
  const driverPoints = drivers.reduce((sum, driver) => sum + driver.points, 0);
  const score = Math.round(clamp(base + driverPoints - calmCredit, 8, 100));
  const primary = drivers[0];

  let label = 'Calm';
  if (score >= 85) label = 'Panic';
  else if (score >= 65) label = 'High Fear';
  else if (score >= 36) label = 'Alert';

  const reason = primary ? primary.label : winStreak >= 2 ? 'Controlled recovery' : 'Calm baseline';
  const result = score >= 70
    ? 'Risk of emotional entries is high. Reduce size or wait for one full candle.'
    : score >= 40
      ? 'Some pressure is present. Use a checklist before the next order.'
      : 'Behavior is steady. Keep the same sizing and pacing.';

  return {
    score,
    label,
    reason,
    result,
    drivers: drivers.slice(0, 4),
    stats: {
      recentTrades: recentClosed.length,
      lossStreak,
      winStreak,
      averageDecisionSeconds: Number((averageDecisionMs / 1000).toFixed(1)),
      openTrades: openTrades.length,
      drawdownPercent: Number(drawdownPercent.toFixed(2)),
      interactionCount: state.interactionCount,
    },
    updatedAt: now,
  };
};

export const useBehaviorStore = create(
  persist(
    (set, get) => ({
      // --- Basic Wallet ---
      balance: 100000,

      // --- Trading History ---
      trades: [],

      // --- Behavioral Metrics ---
      fearScore: 30,
      fearReason: 'Market Baseline',
      fearAnalysis: {
        score: 30,
        label: 'Calm',
        reason: 'Market Baseline',
        result: 'Behavior is steady. Keep the same sizing and pacing.',
        drivers: [],
        stats: {
          recentTrades: 0,
          lossStreak: 0,
          winStreak: 0,
          averageDecisionSeconds: 5,
          openTrades: 0,
          drawdownPercent: 0,
          interactionCount: 0,
        },
        updatedAt: Date.now(),
      },
      lastFearUpdate: Date.now(),
      sessionStartValue: 100000,
      interactionCount: 0,
      decisionStartedAt: Date.now(),

      // --- Pattern Recognition State ---
      patterns: {
        confidenceScore: 68,
        decisionSpeed: 4.5,
        overcheckingCount: 0,
        lastInteractionType: 'normal'
      },

      // --- Behavioral Event Log ---
      behavioralEvents: [],
      disciplineScore: 100,
      previousScore: 100,
      scoreTrend: 'stable',

      // --- Portfolio ---
      holdings: [],

      // --- Actions ---
      setBalance: (update) => set((state) => ({
        balance: typeof update === 'function' ? update(state.balance) : update
      })),

      recordInteraction: () => {
        const state = get();
        const now = Date.now();
        // Throttle state updates to once every 1000ms to prevent re-render loops
        if (!state.lastInteractionAt || now - state.lastInteractionAt > 1000) {
          set((state) => ({
            interactionCount: Math.min(50, state.interactionCount + 1),
            lastInteractionAt: now
          }));
        }
      },

      resetDecisionClock: () => set({
        decisionStartedAt: Date.now(),
        interactionCount: 0
      }),

      updateFearScore: () => set((state) => {
        const now = Date.now();
        const analysis = buildFearAnalysis(state);

        return {
          fearScore: analysis.score,
          fearReason: analysis.reason,
          fearAnalysis: analysis,
          lastFearUpdate: now
        };
      }),

      logIntervention: (type, context, userResponse) => set((state) => ({
        behavioralEvents: [...state.behavioralEvents, {
          id: `int-${Date.now()}`,
          type: 'intervention_log',
          interventionType: type,
          fearAtTime: state.fearScore,
          disciplineAtTime: state.disciplineScore,
          context,
          userResponse,
          timestamp: Date.now()
        }]
      })),

      addTrade: (trade) => set((state) => {
        const newTrade = { ...trade, id: Date.now() };
        const newTrades = [...state.trades, newTrade];
        const analysis = buildFearAnalysis(state, newTrades);

        let updatedHoldings = [...state.holdings];

        const existing = updatedHoldings.find(h => h.symbol === trade.symbol);

        if (existing) {
          // 🧠 update existing stock
          const totalQty = existing.qty + trade.qty;
          const totalCost =
            existing.qty * existing.avgPrice + trade.qty * trade.price;

          existing.qty = totalQty;
          existing.avgPrice = totalCost / totalQty;
          existing.currentPrice = trade.price;
        } else {
          // 🆕 add new stock
          updatedHoldings.push({
            symbol: trade.symbol,
            name: trade.name || trade.symbol,
            qty: trade.qty,
            avgPrice: trade.price,
            currentPrice: trade.price,
            sector: "Simulated"
          });
        }

        return {
          trades: newTrades,
          holdings: updatedHoldings,
          balance: state.balance - trade.qty * trade.price,
          fearScore: analysis.score,
          fearReason: analysis.reason,
          fearAnalysis: analysis,
        };
      }),

      updateTrade: (id, updates) => set((state) => {
        const newTrades = state.trades.map(t => t.id === id ? { ...t, ...updates } : t);
        const trade = newTrades.find(t => t.id === id);
        const analysis = buildFearAnalysis(state, newTrades);

        if (!trade || (updates.status !== 'won' && updates.status !== 'lost')) {
          return {
            trades: newTrades,
            fearScore: analysis.score,
            fearReason: analysis.reason,
            fearAnalysis: analysis,
          };
        }

        // Outcome-based score updates
        const prevScore = state.disciplineScore;
        let scoreDelta = updates.status === 'won' ? 5 : -10;

        let nextScore = Math.min(100, Math.max(20, prevScore + scoreDelta));
        const trend = nextScore > prevScore ? 'improving' : nextScore < prevScore ? 'declining' : 'stable';

        const wins = newTrades.filter(t => t.status === 'won').length;
        const winRate = newTrades.length > 0 ? (wins / newTrades.length) * 100 : 68;

        return {
          trades: newTrades,
          disciplineScore: nextScore,
          previousScore: prevScore,
          scoreTrend: trend,
          fearScore: analysis.score,
          fearReason: analysis.reason,
          fearAnalysis: analysis,
          patterns: {
            ...state.patterns,
            confidenceScore: Math.round(isNaN(winRate) ? 68 : winRate),
            decisionSpeed: analysis.stats.averageDecisionSeconds,
            overcheckingCount: analysis.stats.interactionCount,
            lastInteractionType: analysis.reason,
          }
        };
      }),

      setPattern: (key, value) => set((state) => ({
        patterns: { ...state.patterns, [key]: value }
      })),

      recordEvent: (type, condition, context) => set((state) => {
        const generateId = () => {
          if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
          return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        };

        const event = {
          id: generateId(),
          type,
          condition,
          timestamp: Date.now(),
          context
        };

        const newEvents = [...state.behavioralEvents, event];
        const prevScore = state.disciplineScore;

        // Penalty for ignoring warnings
        let scoreDelta = 0;
        if (type === 'warning_ignored') {
          scoreDelta = -8;
        }

        let nextScore = prevScore + scoreDelta;
        if (isNaN(nextScore)) nextScore = prevScore;
        nextScore = Math.min(100, Math.max(20, nextScore));

        const trend = nextScore > prevScore ? 'improving' : nextScore < prevScore ? 'declining' : 'stable';
        const analysis = buildFearAnalysis({ ...state, behavioralEvents: newEvents });

        return {
          behavioralEvents: newEvents,
          disciplineScore: nextScore,
          previousScore: prevScore,
          scoreTrend: trend,
          fearScore: analysis.score,
          fearReason: analysis.reason,
          fearAnalysis: analysis,
        };
      }),

      setHoldings: (holdings) => set({ holdings }),
    }),
    {
      name: 'finfision-behavior-storage',
      partialize: (state) => ({
        // only keep minimal data
        balance: state.balance,
        fearScore: state.fearScore,
        fearReason: state.fearReason,
        fearAnalysis: state.fearAnalysis,
        disciplineScore: state.disciplineScore,
        previousScore: state.previousScore,
        scoreTrend: state.scoreTrend,
        patterns: state.patterns,
      })
    }
  )
);
