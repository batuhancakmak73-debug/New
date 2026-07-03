const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

require('./database');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/credentials', require('./routes/credentials'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Real marketplace posting (eBay / Facebook Page) is implemented in the hosted
// backend (supabase/functions/api); the local dev server only stubs it.
const { authRequired } = require('./middleware/auth');
app.post('/api/publish', authRequired, (req, res) => {
  res.status(501).json({ error: 'Auto-posting runs on the hosted backend — use the deployed app' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SellPilot AI backend running on http://localhost:${PORT}`);
});
