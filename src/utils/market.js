const baseSymbols = [
  ["NIFTY 50", 22418.65, 0.42],
  ["SENSEX", 73820.11, -0.18],
  ["BANKNIFTY", 48125.4, 0.31],
  ["ASIA IDX", 5874.58, 0.2],
  ["BTC-INR", 5849000, -0.72],
];

export function generateCandles(count = 64) {
  const candles = [];
  let close = 5874.58;

  for (let index = 0; index < count; index += 1) {
    const wave = Math.sin(index * 0.44) * 9 + Math.cos(index * 0.19) * 6;
    const open = close;
    close = Math.max(5600, open + wave + ((index % 5) - 2) * 1.8);
    const high = Math.max(open, close) + 8 + (index % 4) * 2.3;
    const low = Math.min(open, close) - 8 - (index % 3) * 2.6;
    candles.push({ index, open, high, low, close, time: Date.now() - (count - index) * 1400 });
  }

  return candles;
}

export function nextCandle(last, index) {
  const pulse = Math.sin(index * 0.58) * 10 + Math.cos(index * 0.27) * 5;
  const open = last.close;
  const close = Math.max(5600, open + pulse + ((index % 7) - 3) * 1.2);
  const high = Math.max(open, close) + 7 + (index % 5) * 1.8;
  const low = Math.min(open, close) - 7 - (index % 4) * 1.6;
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
