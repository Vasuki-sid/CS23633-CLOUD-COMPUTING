const express = require('express');
const router = express.Router();

// Get all available tools
router.get('/list', (req, res) => {
  const tools = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Welcome & tool overview' },
    { id: 'storage', name: 'Cloud Storage', icon: '☁️', description: 'Upload & manage files' },
    { id: 'translator', name: 'Translator', icon: '🌐', description: 'Multi-language translation' },
    { id: 'calculator', name: 'Calculator', icon: '🧮', description: 'Basic & scientific math' },
    { id: 'todo', name: 'To-Do List', icon: '✓', description: 'Task management' },
    { id: 'notes', name: 'Notes', icon: '📝', description: 'Create & save notes' },
    { id: 'converter', name: 'Unit Converter', icon: '📏', description: 'Convert units' },
    { id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏱️', description: 'Focus timer' },
    { id: 'wordcount', name: 'Word Counter', icon: '📄', description: 'Count text stats' },
    { id: 'pdf', name: 'PDF Extractor', icon: '📕', description: 'Extract PDF text' },
    { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Preferences & config' }
  ];

  res.json({ tools });
});

module.exports = router;