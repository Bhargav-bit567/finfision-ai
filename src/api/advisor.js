/**
 * Mock API service for AI Advice
 * In production, this would be a real fetch to /ai/advice
 */
export const fetchAIAdvice = async (stockName, behaviorData) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 2200));

  // Determine advice based on fear index and stock
  const { fearScore, confidenceScore } = behaviorData;

  // Realistic response structure
  return {
    stock: stockName,
    recommendation: fearScore > 65 ? "Avoid" : confidenceScore > 75 ? "Buy" : "Hold",
    confidence: Math.round(70 + Math.random() * 25),
    reasoning: fearScore > 65 
      ? "Current market sentiment and your recent hesitation patterns suggest a high risk of panic selling. It's better to wait for a clearer trend."
      : "The underlying asset shows strong recovery potential, and your decision timing has been disciplined. A small position entry is statistically sound.",
    emotionalWarning: fearScore > 60 
      ? "Warning: Your recent interaction speed suggests elevated anxiety. Consider activating 'Calm Mode' before placing this trade."
      : "Your emotional state appears stable. Maintain your current process.",
    timestamp: new Date().toISOString()
  };
};
