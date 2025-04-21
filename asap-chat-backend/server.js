const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Smart in-memory cache
const cache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute cache (you can increase to 5 mins = 5 * 60 * 1000)

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const cacheKey = JSON.stringify(messages);

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.response);
      }
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/openai/gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = response.data;
    cache.set(cacheKey, {
      timestamp: Date.now(),
      response: responseData,
    });

    res.json(responseData);
  } catch (error) {
    console.error('Chat error:', error.message || error);
    res.status(500).json({ error: 'Failed to get response from OpenRouter' });
  }
});

app.listen(port, () => {
  console.log(`ASAP Chat Agent running on http://localhost:${port}`);
});
