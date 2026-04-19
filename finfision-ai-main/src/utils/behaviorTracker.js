/**
 * Modular Behavioral Tracker for Finfision
 * Tracks user interactions to calculate a "Fear Score" and provide data to the AI Coach.
 */

let signals = {
  clickFrequency: 0,
  hesitationTime: 0,
  assetSwitching: 0,
  repetitiveChecking: {},
  tradeSizeInconsistency: 0,
  earlyExits: 0,
  analysisTime: 0,
  scrollSpeed: 0,
  hoverDuration: 0,
  sessionLength: 0,
};

let lastClickTime = Date.now();
let lastScrollPos = 0;
let lastScrollTime = Date.now();
let lastAsset = null;
let hoverStartTime = 0;
let entryTime = Date.now();

export const trackInteraction = (type, data = {}) => {
  const now = Date.now();

  switch (type) {
    case 'click':
      const delta = now - lastClickTime;
      if (delta < 500) signals.clickFrequency++;
      else signals.clickFrequency = Math.max(0, signals.clickFrequency - 1);
      lastClickTime = now;
      break;

    case 'asset_view':
      if (data.symbol === lastAsset) {
        signals.repetitiveChecking[data.symbol] = (signals.repetitiveChecking[data.symbol] || 0) + 1;
      } else {
        signals.assetSwitching++;
      }
      lastAsset = data.symbol;
      break;

    case 'scroll':
      const scrollDelta = Math.abs(window.scrollY - lastScrollPos);
      const timeDelta = now - lastScrollTime;
      if (timeDelta > 0) {
        const speed = (scrollDelta / timeDelta) * 1000; // px/sec
        signals.scrollSpeed = speed;
      }
      lastScrollPos = window.scrollY;
      lastScrollTime = now;
      break;

    case 'hover_start':
      hoverStartTime = now;
      break;

    case 'hover_end':
      if (hoverStartTime > 0) {
        signals.hoverDuration += (now - hoverStartTime);
        hoverStartTime = 0;
      }
      break;

    case 'trade_size':
      // Simplified: if current size > 2x previous size after a loss (mocked)
      if (data.current > data.previous * 2) {
        signals.tradeSizeInconsistency++;
      }
      break;

    default:
      break;
  }
};

export const getBehaviorData = () => {
  signals.sessionLength = (Date.now() - entryTime) / 1000;
  return { ...signals };
};

export const resetSignals = () => {
  signals = {
    clickFrequency: 0,
    hesitationTime: 0,
    assetSwitching: 0,
    repetitiveChecking: {},
    tradeSizeInconsistency: 0,
    earlyExits: 0,
    analysisTime: 0,
    scrollSpeed: 0,
    hoverDuration: 0,
    sessionLength: 0,
  };
};

// Global Listeners for simple signals
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => trackInteraction('click'));
  window.addEventListener('scroll', () => trackInteraction('scroll'));
}
