const express = require('express');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const { status, platform } = req.query;
  let sql = 'SELECT * FROM leads WHERE user_id = ?';
  const params = [req.user.id];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (platform) { sql += ' AND platform = ?'; params.push(platform); }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.post('/', (req, res) => {
  const b = req.body || {};
  if (!b.name) return res.status(400).json({ error: 'Lead name is required' });
  const result = db
    .prepare(
      `INSERT INTO leads (user_id, name, email, phone, location, product_interest, platform, budget, status, notes, last_contact, follow_up_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id, b.name, b.email || null, b.phone || null, b.location || null,
      b.product_interest || null, b.platform || null, b.budget || null,
      b.status || 'new', b.notes || null, b.last_contact || null, b.follow_up_date || null
    );
  res.status(201).json(db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const b = req.body || {};
  db.prepare(
    `UPDATE leads SET name = ?, email = ?, phone = ?, location = ?, product_interest = ?, platform = ?,
     budget = ?, status = ?, notes = ?, last_contact = ?, follow_up_date = ? WHERE id = ?`
  ).run(
    b.name ?? lead.name, b.email ?? lead.email, b.phone ?? lead.phone, b.location ?? lead.location,
    b.product_interest ?? lead.product_interest, b.platform ?? lead.platform, b.budget ?? lead.budget,
    b.status ?? lead.status, b.notes ?? lead.notes, b.last_contact ?? lead.last_contact,
    b.follow_up_date ?? lead.follow_up_date, lead.id
  );
  res.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(lead.id));
});

router.delete('/:id', (req, res) => {
  const lead = db.prepare('SELECT id FROM leads WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  db.prepare('DELETE FROM leads WHERE id = ?').run(lead.id);
  res.json({ success: true });
});

module.exports = router;
