const express = require('express');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

function mask(value) {
  if (!value) return null;
  return value.length <= 4 ? '••••' : `••••${value.slice(-4)}`;
}

function serialize(row) {
  return {
    id: row.id,
    platform: row.platform,
    username: row.username,
    api_key: mask(row.api_key),
    api_secret: mask(row.api_secret),
    access_token: mask(row.access_token),
    is_connected: row.is_connected,
    created_at: row.created_at,
  };
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM marketplace_credentials WHERE user_id = ?').all(req.user.id);
  res.json(rows.map(serialize));
});

router.post('/', (req, res) => {
  const { platform, username, api_key, api_secret, access_token, is_connected } = req.body || {};
  if (!platform) return res.status(400).json({ error: 'platform is required' });
  const existing = db
    .prepare('SELECT * FROM marketplace_credentials WHERE user_id = ? AND platform = ?')
    .get(req.user.id, platform);
  if (existing) {
    db.prepare(
      `UPDATE marketplace_credentials SET username = ?, api_key = ?, api_secret = ?, access_token = ?, is_connected = ? WHERE id = ?`
    ).run(
      username ?? existing.username,
      api_key ?? existing.api_key,
      api_secret ?? existing.api_secret,
      access_token ?? existing.access_token,
      is_connected !== undefined ? (is_connected ? 1 : 0) : existing.is_connected,
      existing.id
    );
    return res.json(serialize(db.prepare('SELECT * FROM marketplace_credentials WHERE id = ?').get(existing.id)));
  }
  const result = db
    .prepare(
      `INSERT INTO marketplace_credentials (user_id, platform, username, api_key, api_secret, access_token, is_connected)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, platform, username || null, api_key || null, api_secret || null, access_token || null, is_connected ? 1 : 0);
  res.status(201).json(serialize(db.prepare('SELECT * FROM marketplace_credentials WHERE id = ?').get(result.lastInsertRowid)));
});

router.post('/:id/test', (req, res) => {
  const row = db
    .prepare('SELECT * FROM marketplace_credentials WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Credentials not found' });
  // Real marketplace APIs are out of scope; validate that credentials exist.
  const ok = Boolean(row.username && (row.api_key || row.access_token));
  res.json({ success: ok, message: ok ? 'Connection looks good' : 'Missing username or API key/token' });
});

router.delete('/:id', (req, res) => {
  const row = db
    .prepare('SELECT id FROM marketplace_credentials WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Credentials not found' });
  db.prepare('DELETE FROM marketplace_credentials WHERE id = ?').run(row.id);
  res.json({ success: true });
});

module.exports = router;
