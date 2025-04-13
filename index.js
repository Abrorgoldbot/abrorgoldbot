import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// TwelveData API sozlamalari
const API_KEY = process.env.API_KEY;
const SYMBOL = 'XAU/USD';
const INTERVAL = '15min';

// Telegram bot sozlamalari
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Signal generatsiya qilish
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
      confidence,
    };
  } catch (err) {
    console.error('Signal generation error:', err);
    return null;
  }
}

// Telegramga signal yuborish
async function sendSignalToTelegram(signal) {
  if (!signal) return;

  const message = `
🔔 *AbrorGold Signal*
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
    parse_mode: 'Markdown',
  });
}

// Web endpoint orqali signal yuborish
app.get('/', async (req, res) => {
  const signal = await generateSignal();
  await sendSignalToTelegram(signal);
  res.json(signal);
});

app.listen(PORT, () => {
  console.log(`AbrorGoldBot server running on port ${PORT}`);
});
