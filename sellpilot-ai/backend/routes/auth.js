const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authRequired, signToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, name, company } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password and name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const password_hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (email, password_hash, name, company) VALUES (?, ?, ?, ?)')
    .run(email.toLowerCase(), password_hash, name, company || null);
  const user = db.prepare('SELECT id, email, name, company, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ token: signToken(user), user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const { password_hash, ...safe } = user;
  res.json({ token: signToken(user), user: safe });
});

router.get('/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT id, email, name, company, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.put('/me', authRequired, (req, res) => {
  const { name, company } = req.body || {};
  db.prepare('UPDATE users SET name = COALESCE(?, name), company = COALESCE(?, company) WHERE id = ?')
    .run(name || null, company || null, req.user.id);
  const user = db.prepare('SELECT id, email, name, company, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

module.exports = router;
