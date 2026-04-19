import * as openaiService from '../services/openaiService.js';

export const getAdvice = async (req, res) => {
  const { stock, price_change, volatility, user_behavior } = req.body;

  if (!stock || price_change === undefined || !volatility || !user_behavior) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const advice = await openaiService.getAIAdvice(
      stock,
      price_change,
      volatility,
      user_behavior
    );
    res.json(advice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
