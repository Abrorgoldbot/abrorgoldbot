async function sendSignalToTelegram(signal) {
  ...
}

  const message = `
📢 *AbrorGold Signal*
*Direction:* ${signal.signal}
*Entry:* ${signal.entry}
*SL:* ${signal.sl}
*TP:* ${signal.tp}
*Timeframe:* ${signal.timeframe}
*Confidence:* ${signal.confidence}
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });
}const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// TwelveData API sozlamalari
const API_KEY = '5e6a4d68c9414630a8aa2408bda400d2';
const SYMBOL = 'XAU/USD';
const INTERVAL = '15min';

// Telegram bot sozlamalari
const TELEGRAM_BOT_TOKEN = '7976973953:AAHUcmF8HE3sAXXH1gmknJ7AVaDt0DB48w4';
const CHAT_ID = '7976973953';

async function generateSignal() {
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${SYMBOL}&interval=${INTERVAL}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    const data = response.data.values;

    if (!data || data.length < 2) throw new Error('Not enough data');

    const current = parseFloat(data[0].close);
    const previous = parseFloat(data[1].close);

    const direction = current > previous ? 'BUY' : 'SELL';
    const sl = (direction === 'BUY' ? current - 5 : current + 5).toFixed(2);
    const tp = (direction === 'BUY' ? current + 7 : current - 7).toFixed(2);
    const confidence = Math.abs(current - previous).toFixed(2);

    return {
      signal: direction,
      entry: current.toFixed(2),
      sl,
      tp,
      timeframe: 'M15',
      confidence
    };
  } catch (err) {
    console.error('Signal generation error:', err);
    return null;
  }
}

async function sendSignalToTelegram(signal) {
  if (!signal) return;

  const message = `
📢 *AbrorGold Signal*
*Direction:* ${signal.signal}
*Entry:* ${signal.entry}
*SL:* ${signal.sl}
*TP:* ${signal.tp}
*Timeframe:* ${signal.timeframe}
*Confidence:* ${signal.confidence}
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });
}

app.get('/', async (req, res) => {
  const signal = await generateSignal();
  await sendSignalToTelegram(signal);
  res.json(signal);
});

app.listen(PORT, () => {
  console.log(`AbrorGoldBot server running on port ${PORT}`);
});
