import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBehaviorStore = create(
  persist(
    (set, get) => ({
      // --- Basic Wallet ---
      balance: 10000,

      // --- Trading History ---
      trades: [],

      // --- Behavioral Metrics ---
      fearScore: 30,
      fearReason: 'Market Baseline',
      lastFearUpdate: Date.now(),
      sessionStartValue: 10000,
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
        const timePassed = (now - state.lastFearUpdate) / 1000;

        // 1. Decay: 1 point every 30s of "calm"
        let decay = 0;
        if (timePassed > 30) {
          decay = Math.floor(timePassed / 30);
        }

        // 2. Behavioral Signals (60% weight)
        let behavioralPoints = 0;
        let behaviorReason = '';

        // Rapid clicking / Moving
        if (state.interactionCount > 8) {
          behavioralPoints += Math.min(50, state.interactionCount * 2);
          behaviorReason = 'High interaction frequency';
        }

        // Fast decision making (impulsivity)
        const lastTrade = state.trades[state.trades.length - 1];
        if (lastTrade?.behaviorFlags?.includes('impulse')) {
          behavioralPoints += 15;
          behaviorReason = 'Impulsive trading detected';
        }

        // 3. Market Changes (40% weight)
        let marketPoints = 0;
        let marketReason = '';

        const equityValue = state.holdings.reduce((acc, stock) => acc + stock.qty * stock.currentPrice, 0);
        const totalValue = state.balance + equityValue;
        const pLDrop = ((state.sessionStartValue - totalValue) / state.sessionStartValue) * 100;

        if (pLDrop > 1) {
          marketPoints += Math.min(40, Math.floor(pLDrop * 5));
          marketReason = 'Portfolio volatility pressure';
        }

        const recentLosses = state.trades.slice(-3).filter(t => t.status === 'lost').length;
        if (recentLosses > 0) {
          marketPoints += recentLosses * 10;
          marketReason = marketReason || 'Recent trade drawbacks';
        }

        // Fusion
        let calculatedScore = (state.fearScore - decay) + (behavioralPoints * 0.6) + (marketPoints * 0.4);

        // Safety check
        if (isNaN(calculatedScore)) calculatedScore = state.fearScore;
        const newScore = Math.min(100, Math.max(10, calculatedScore));

        return {
          fearScore: Math.round(newScore),
          fearReason: behaviorReason || marketReason || 'Emotional Baseline',
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
          balance: state.balance - trade.qty * trade.price
        };
      }),

      updateTrade: (id, updates) => set((state) => {
        const newTrades = state.trades.map(t => t.id === id ? { ...t, ...updates } : t);
        const trade = newTrades.find(t => t.id === id);

        if (!trade || (updates.status !== 'won' && updates.status !== 'lost')) {
          return { trades: newTrades };
        }

        // Outcome-based score updates
        const prevScore = state.disciplineScore;
        let scoreDelta = updates.status === 'won' ? 5 : -10;

        let nextScore = Math.min(100, Math.max(20, prevScore + scoreDelta));
        const trend = nextScore > prevScore ? 'improving' : nextScore < prevScore ? 'declining' : 'stable';

        const wins = newTrades.filter(t => t.status === 'won').length;
        const winRate = newTrades.length > 0 ? (wins / newTrades.length) * 100 : 68;

        const fearDelta = updates.status === 'won' ? -10 : 15;
        let finalFearScore = state.fearScore + fearDelta;
        if (isNaN(finalFearScore)) finalFearScore = state.fearScore;

        return {
          trades: newTrades,
          disciplineScore: nextScore,
          previousScore: prevScore,
          scoreTrend: trend,
          fearScore: Math.min(100, Math.max(10, finalFearScore)),
          patterns: {
            ...state.patterns,
            confidenceScore: Math.round(isNaN(winRate) ? 68 : winRate)
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

        return {
          behavioralEvents: newEvents,
          disciplineScore: nextScore,
          previousScore: prevScore,
          scoreTrend: trend
        };
      }),

      setHoldings: (holdings) => set({ holdings }),
    }),
    {
      name: 'finfision-behavior-storage',
      partialize: (state) => ({
        // only keep minimal data
        balance: state.balance
      })
    }
  )
);
