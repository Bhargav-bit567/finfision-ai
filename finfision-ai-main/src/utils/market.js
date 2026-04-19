const baseSymbols = [
  ["NIFTY 50", 22418.65, 0.42],
  ["SENSEX", 73820.11, -0.18],
  ["BANKNIFTY", 48125.4, 0.31],
  ["RELIANCE", 2954.58, 0.25],
  ["TCS", 3950.00, -0.72],
];

export function generateCandles(count = 72) {
  const candles = [];
  let close = 2954.58; // Reliance base price

  for (let index = 0; index < count; index += 1) {
    // Multi-cycle waves for realistic pattern recognition
    const macro = Math.sin(index * 0.08) * 25;
    const meso = Math.cos(index * 0.25) * 12;
    const micro = Math.sin(index * 0.6) * 5;
    const noise = (Math.random() - 0.5) * 4;
    
    const open = close;
    // We want the changes to be incremental
    const delta = (macro / 15) + (meso / 8) + (micro / 4) + noise;
    close = Math.max(2500, open + delta);
    
    const high = Math.max(open, close) + Math.random() * 6;
    const low = Math.min(open, close) - Math.random() * 6;
    
    candles.push({ 
      index, 
      open, 
      high, 
      low, 
      close, 
      time: Date.now() - (count - index) * 1400 
    });
  }

  return candles;
}

export function nextCandle(last, index) {
  // Endless regime model: trend changes slowly, while each candle keeps small
  // random movement so the practice feed never repeats a fixed pattern.
  const regime = Math.sin(index * 0.031) * 4.5;
  const cycle = Math.sin(index * 0.16) * 9;
  const counterCycle = Math.cos(index * 0.47) * 4.5;
  const momentum = (last.close - last.open) * 0.36;
  const random = (Math.random() - 0.5) * 7;
  const shock = Math.random() > 0.94 ? (Math.random() - 0.5) * 18 : 0;
  
  const open = last.close;
  const close = Math.max(2500, open + regime + (cycle / 5) + (counterCycle / 3) + momentum + random + shock);
  
  const wickBoost = Math.abs(shock) * 0.35;
  const high = Math.max(open, close) + Math.random() * 5 + wickBoost;
  const low = Math.min(open, close) - Math.random() * 5 - wickBoost;
  
  return { index, open, high, low, close, time: Date.now() };
}

export function seededTimeline(seed) {
  return Array.from({ length: 18 }, (_, index) => ({
    label: `${index + 1}`,
    value: Math.max(4, Math.min(96, seed + Math.sin(index * 0.88) * 14 - (17 - index) * 1.2)),
  }));
}

export function getWatchlist() {
  return baseSymbols.map(([name, price, change], index) => ({
    name,
    price,
    change: Number((change + Math.sin(Date.now() / 40000 + index) * 0.18).toFixed(2)),
  }));
}
