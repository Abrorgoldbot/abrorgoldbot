const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

function generateSignal() {
  const directions = ['BUY', 'SELL'];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const entry = (2350 + Math.random() * 10).toFixed(2);
  const sl = (entry - 5).toFixed(2);
  const tp = (parseFloat(entry) + 7).toFixed(2);
  const confidence = ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];

  return {
    signal: direction,
    entry,
    sl,
    tp,
    timeframe: 'M15',
    confidence,
  };
}

app.get('/', (req, res) => {
  const signal = generateSignal();
  res.json(signal);
});

app.listen(PORT, () => {
  console.log(`AbrorGoldBot server running on port ${PORT}`);
});
