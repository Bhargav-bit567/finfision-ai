export const fetchAIAdvice = async (stockName, behaviorData) => {
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + "/api/ai";
  
  try {
    const response = await fetch(`${API_URL}/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stock: stockName,
        price_change: (Math.random() * 5).toFixed(2), // In a real app, this would come from market data
        volatility: "Medium",
        user_behavior: {
          clickFrequency: behaviorData.fearScore / 10,
          hesitationTime: 2000,
          assetSwitching: 2,
          scrollSpeed: 1000,
          analysisActionRatio: 0.8
        }
      })
    });

    if (!response.ok) throw new Error("API responded with error");
    const data = await response.json();
    
    // Map backend response to frontend format
    return {
      ...data,
      stock: stockName,
      emotionalWarning: data.warning || data.emotional_insight
    };
  } catch (error) {
    console.error("AI Advisor Error:", error);
    throw error;
  }
};
