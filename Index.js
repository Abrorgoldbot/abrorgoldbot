const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = '5e6a4d68c9414630a8aa2408bda400d2';
const SYMBOL = 'XAU/USD';
const INTERVAL = '15min';

async function generateSignal() {
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${SYMBOL}&interval=${INTERVAL}&apikey=${API_KEY}&outputsize=2`;
    const response = await axios.get(url);
    const data = response.data.values;

    if (!data || data.length < 2) {
      throw new Error('Not enough data');
    }

    const current = parseFloat(data[0].close);
    const previous = parseFloat(data[1].close);

    const direction = current > previous ? 'BUY' : 'SELL';
    const sl = (direction === 'BUY' ? current - 5 : current + 5).toFixed(2);
    const tp = (direction === 'BUY' ? current + 7 : current - 7).toFixed(2);
    const confidence = Math.abs(current - previous) > 1 ? 'High' : 'Medium';

    return {
      signal: direction,
      entry: current.toFixed(2),
      sl,
      tp,
      timeframe: 'M15',
      confidence,
    };
  } catch (error) {
    console.error('Error generating signal:', error.message);
    return { error: 'Failed to fetch data from API' };
  }
}

app.get('/', async (req, res) => {
  const signal = await generateSignal();
  res.json(signal);
});

app.listen(PORT, () => {
  console.log(`AbrorGoldBot server running on port ${PORT}`);
});
