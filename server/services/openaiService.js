import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAIAdvice = async (stock, price_change, volatility, user_behavior) => {
  try {
    const prompt = `
      You are a Behavioral Finance Coach. Analyze the following scenario and provide advice:
      
      STOCK DATA:
      - Stock: ${stock}
      - Price Change: ${price_change}%
      - Current Volatility: ${volatility}
      
      USER BEHAVIOR DATA:
      - Rapid Clicks: ${user_behavior.clickFrequency > 5 ? 'High' : 'Normal'}
      - Hesitation: ${user_behavior.hesitationTime > 3000 ? 'High' : 'Low'}
      - Switching Assets: ${user_behavior.assetSwitching > 3 ? 'Substantial' : 'Low'}
      - Scroll Behavior: ${user_behavior.scrollSpeed > 2000 ? 'Impaticent/Panic' : 'Normal'}
      - Analysis vs Action Ratio: ${user_behavior.analysisActionRatio}
      
      Generate a JSON response with the following keys:
      - recommendation (string)
      - confidence (number 0-100)
      - reasoning (string)
      - emotional_insight (string addressing their behavior)
      - warning (string if they show panic patterns, else null)
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [
        { role: "system", content: "You are a professional investment coach specializing in behavioral psychology." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Service Error:', error);
    throw new Error('Failed to fetch AI advice');
  }
};
