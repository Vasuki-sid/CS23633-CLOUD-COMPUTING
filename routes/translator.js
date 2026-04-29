const express = require('express');
const axios = require('axios');
const router = express.Router();

const TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
const TRANSLATOR_ENDPOINT = process.env.AZURE_TRANSLATOR_ENDPOINT;
const TRANSLATOR_REGION = process.env.AZURE_TRANSLATOR_REGION || process.env.AZURE_TRANSLATOR_LOCATION;

// Supported languages
const LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh-Hans': 'Chinese (Simplified)',
  'ar': 'Arabic',
  'hi': 'Hindi'
};

// Translate text
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language required' });
    }

    if (!TRANSLATOR_KEY || !TRANSLATOR_ENDPOINT || !TRANSLATOR_REGION) {
      return res.status(500).json({ error: 'Translation service not configured' });
    }

    const params = new URLSearchParams();
    params.append('api-version', '3.0');
    if (sourceLanguage && sourceLanguage !== 'auto') {
      params.append('from', sourceLanguage);
    }
    params.append('to', targetLanguage);

    const response = await axios({
      baseURL: TRANSLATOR_ENDPOINT,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': TRANSLATOR_REGION,
        'Content-Type': 'application/json'
      },
      params,
      data: [{ Text: text }]
    });

    const translatedText = response.data[0]?.translations?.[0]?.text;
    res.json({ translatedText, sourceLanguage, targetLanguage });
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  res.json(LANGUAGES);
});

module.exports = router;