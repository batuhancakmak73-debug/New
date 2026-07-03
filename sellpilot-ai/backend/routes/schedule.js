const express = require('express');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db
    .prepare(
      `SELECT sp.*, l.title AS listing_title, p.name AS product_name
       FROM scheduled_posts sp
       JOIN listings l ON l.id = sp.listing_id
       JOIN products p ON p.id = l.product_id
       WHERE p.user_id = ?
       ORDER BY sp.scheduled_date ASC`
    )
    .all(req.user.id);
  res.json(rows);
});

router.post('/', (req, res) => {
  const { listing_id, platform, scheduled_date } = req.body || {};
  if (!listing_id || !scheduled_date) {
    return res.status(400).json({ error: 'listing_id and scheduled_date are required' });
  }
  const listing = db
    .prepare(
      `SELECT l.* FROM listings l JOIN products p ON p.id = l.product_id
       WHERE l.id = ? AND p.user_id = ?`
    )
    .get(listing_id, req.user.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const result = db
    .prepare('INSERT INTO scheduled_posts (listing_id, platform, scheduled_date) VALUES (?, ?, ?)')
    .run(listing_id, platform || listing.platform, scheduled_date);
  db.prepare("UPDATE listings SET status = 'scheduled', scheduled_date = ? WHERE id = ?").run(scheduled_date, listing_id);
  res.status(201).json(db.prepare('SELECT * FROM scheduled_posts WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const post = db
    .prepare(
      `SELECT sp.* FROM scheduled_posts sp
       JOIN listings l ON l.id = sp.listing_id
       JOIN products p ON p.id = l.product_id
       WHERE sp.id = ? AND p.user_id = ?`
    )
    .get(req.params.id, req.user.id);
  if (!post) return res.status(404).json({ error: 'Scheduled post not found' });
  const b = req.body || {};
  db.prepare('UPDATE scheduled_posts SET scheduled_date = ?, status = ? WHERE id = ?')
    .run(b.scheduled_date ?? post.scheduled_date, b.status ?? post.status, post.id);
  if (b.scheduled_date) {
    db.prepare('UPDATE listings SET scheduled_date = ? WHERE id = ?').run(b.scheduled_date, post.listing_id);
  }
  if (b.status === 'cancelled') {
    db.prepare("UPDATE listings SET status = 'draft', scheduled_date = NULL WHERE id = ?").run(post.listing_id);
  }
  res.json(db.prepare('SELECT * FROM scheduled_posts WHERE id = ?').get(post.id));
});

module.exports = router;
