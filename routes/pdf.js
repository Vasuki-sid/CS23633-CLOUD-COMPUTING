const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Extract text from PDF
router.post('/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    const data = await pdfParse(req.file.buffer);

    res.json({
      pages: data.numpages,
      text: data.text,
      version: data.version
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    res.status(500).json({ error: 'PDF extraction failed', details: error.message });
  }
});

module.exports = router;