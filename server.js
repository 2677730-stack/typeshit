const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TELEGRAM_CUSTOM_MESSAGE = process.env.TELEGRAM_CUSTOM_MESSAGE || 'Новый заказ с сайта VapeTrip';

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

app.get('/api/products', async (req, res) => {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    return res.status(500).json({ error: 'GOOGLE_APPS_SCRIPT_URL is not configured', products: [] });
  }

  try {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.set('action', 'products');
    url.searchParams.set('t', Date.now().toString());

    const response = await fetch(url.toString(), { method: 'GET' });
    const text = await response.text();
    let payload = {};

    try {
      payload = JSON.parse(text);
    } catch {
      payload = { products: [] };
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Apps Script returned an error', details: payload });
    }

    return res.json({ products: Array.isArray(payload.products) ? payload.products : [] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load products', details: error.message, products: [] });
  }
});

app.post('/api/order', async (req, res) => {
  const payload = req.body || {};

  try {
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = [
        TELEGRAM_CUSTOM_MESSAGE,
        '',
        `Дата: ${payload.date || ''}`,
        `Состав: ${payload.orderSummary || ''}`,
        `Сумма: ${payload.total || 0} ₽`,
        `Адрес: ${payload.address || ''}`,
        `Контакт: ${payload.contact || ''}`
      ].join('\n');

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        })
      });
    }

    if (GOOGLE_APPS_SCRIPT_URL) {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'order',
          ...payload
        })
      });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process order', details: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VapeTrip server started on port ${PORT}`);
});
