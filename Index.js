// Required packages const express = require('express'); const axios = require('axios'); const TelegramBot = require('node-telegram-bot-api');

// App config const app = express(); const PORT = process.env.PORT || 3000;

// TwelveData API config const API_KEY = '5e6a4d68c9414630a8aa2408bda400d2'; const SYMBOL = 'XAU/USD'; const INTERVAL = '15min';

// Telegram bot config const TELEGRAM_TOKEN = '7976973953:AAHUcmF8HE3sAXXH1gmknJ7AVaDt0DB48w4'; const CHAT_ID = '7976973953'; const bot = new TelegramBot(TELEGRAM_TOKEN);

// Signal generation async function generateSignal() { try { const url = https://api.twelvedata.com/time_series?symbol=${SYMBOL}&interval=${INTERVAL}&apikey=${API_KEY}; const response = await axios.get(url); const data = response.data.values;

if (!data || data.length < 2) throw new Error('Not enough data'); const current = parseFloat(data[0].close); const previous = parseFloat(data[1].close); const direction = current > previous ? 'BUY' : 'SELL'; const sl = (direction === 'BUY' ? current - 5 : current + 5).toFixed(2); const tp = (direction === 'BUY' ? current + 7 : current - 7).toFixed(2); const confidence = Math.abs(current - previous) > 1.5 ? 'High' : 'Medium'; return { signal: direction, entry: current.toFixed(2), sl, tp, timeframe: 'M15', confidence }; 

} catch (err) { console.error('Error generating signal:', err.message); return null; } }

// Send signal to Telegram async function sendSignal() { const signal = await generateSignal(); if (!signal) return;

const message = ✨ *AbrorGold Signal* ✨\n\n + *Signal:* ${signal.signal}\n + *Entry:* ${signal.entry}\n + *SL:* ${signal.sl}\n + *TP:* ${signal.tp}\n + *Timeframe:* ${signal.timeframe}\n + *Confidence:* ${signal.confidence};

bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' }); }

// Periodic signal sending (every 10 min) setInterval(sendSignal, 10 * 60 * 1000);

// HTTP endpoint (optional) app.get('/', async (req, res) => { const signal = await generateSignal(); res.json(signal); });

app.listen(PORT, () => { console.log(AbrorGoldBot server running on port ${PORT}); });

