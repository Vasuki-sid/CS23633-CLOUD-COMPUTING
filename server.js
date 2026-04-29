require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/translator', require('./routes/translator'));
app.use('/api/calculator', require('./routes/calculator'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/tools', require('./routes/tools'));

// Serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MyUniMate server running on port ${PORT}`);
});
