const express = require('express');
const router = express.Router();

// Safe expression evaluator
const safeEval = (expression) => {
  // Allow only numbers and basic operators
  const allowedChars = /^[0-9+\-*/%().\s]+$/;
  
  if (!allowedChars.test(expression)) {
    throw new Error('Invalid characters in expression');
  }
  
  // Use Function instead of eval for slightly better safety
  try {
    // eslint-disable-next-line no-new-func
    return Function('"use strict"; return (' + expression + ')')();
  } catch (e) {
    throw new Error('Invalid mathematical expression');
  }
};

// Calculate expression
router.post('/calculate', (req, res) => {
  try {
    const { expression } = req.body;

    if (!expression) {
      return res.status(400).json({ error: 'Expression required' });
    }

    const result = safeEval(expression);
    
    if (!isFinite(result)) {
      return res.status(400).json({ error: 'Invalid result' });
    }

    res.json({ expression, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get calculator operations
router.get('/operations', (req, res) => {
  res.json({
    basic: ['+', '-', '*', '/', '%'],
    functions: ['Math.sqrt()', 'Math.pow()', 'Math.abs()', 'Math.sin()', 'Math.cos()', 'Math.tan()']
  });
});

module.exports = router;