import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openai = null;

// ✅ Safe initialization
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
} else {
  console.log("⚠️ OpenAI API key not found → running in DEMO mode");
}

// 🎯 MAIN FUNCTION
export const getAIAdvice = async (stock, price_change, volatility, user_behavior) => {

  // 🔥 DEMO MODE (NO API KEY)
  if (!openai) {
    return {
      recommendation: "Hold",
      confidence: 65,
      reasoning: "Market conditions are moderate. No strong signal detected.",
      emotional_insight: "You seem slightly reactive. Try to slow down decisions.",
      warning: user_behavior.clickFrequency > 5 ? "You may be panic trading." : null,
      demo: true
    };
  }

  try {
    const prompt = `
      You are a Behavioral Finance Coach. Analyze the following scenario:
      
      STOCK: ${stock}
      PRICE CHANGE: ${price_change}%
      VOLATILITY: ${volatility}
      
      USER BEHAVIOR:
      Rapid Clicks: ${user_behavior.clickFrequency > 5 ? 'High' : 'Normal'}
      Hesitation: ${user_behavior.hesitationTime > 3000 ? 'High' : 'Low'}
      Switching Assets: ${user_behavior.assetSwitching > 3 ? 'High' : 'Low'}
      Scroll: ${user_behavior.scrollSpeed > 2000 ? 'Panic' : 'Normal'}
      Ratio: ${user_behavior.analysisActionRatio}

      Return JSON:
      recommendation, confidence, reasoning, emotional_insight, warning
    `;

    const response = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a behavioral trading coach." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);

  } catch (error) {
    console.error("AI Error:", error);

    // 🔥 FALLBACK EVEN IF API FAILS
    return {
      recommendation: "Hold",
      confidence: 50,
      reasoning: "AI unavailable. Using fallback logic.",
      emotional_insight: "Stay calm and avoid impulsive decisions.",
      warning: null,
      fallback: true
    };
  }
};