const express = require('express');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

function ownedListing(id, userId) {
  return db
    .prepare(
      `SELECT l.* FROM listings l JOIN products p ON p.id = l.product_id
       WHERE l.id = ? AND p.user_id = ?`
    )
    .get(id, userId);
}

router.get('/', (req, res) => {
  const { platform, status, product_id } = req.query;
  let sql = `SELECT l.*, p.name AS product_name, p.images AS product_images
             FROM listings l JOIN products p ON p.id = l.product_id
             WHERE p.user_id = ?`;
  const params = [req.user.id];
  if (platform) { sql += ' AND l.platform = ?'; params.push(platform); }
  if (status) { sql += ' AND l.status = ?'; params.push(status); }
  if (product_id) { sql += ' AND l.product_id = ?'; params.push(product_id); }
  sql += ' ORDER BY l.created_at DESC';
  const rows = db.prepare(sql).all(...params).map((r) => ({
    ...r,
    product_images: r.product_images ? JSON.parse(r.product_images) : [],
  }));
  res.json(rows);
});

router.post('/', (req, res) => {
  const { product_id, platform, title, description, price, status, scheduled_date } = req.body || {};
  if (!product_id || !platform) return res.status(400).json({ error: 'product_id and platform are required' });
  const product = db.prepare('SELECT id FROM products WHERE id = ? AND user_id = ?').get(product_id, req.user.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const result = db
    .prepare(
      'INSERT INTO listings (product_id, platform, title, description, price, status, scheduled_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(product_id, platform, title || null, description || null, price ?? null, status || 'draft', scheduled_date || null);
  res.status(201).json(db.prepare('SELECT * FROM listings WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const listing = ownedListing(req.params.id, req.user.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const b = req.body || {};
  db.prepare(
    `UPDATE listings SET title = ?, description = ?, price = ?, status = ?, scheduled_date = ?, published_url = ? WHERE id = ?`
  ).run(
    b.title ?? listing.title,
    b.description ?? listing.description,
    b.price ?? listing.price,
    b.status ?? listing.status,
    b.scheduled_date ?? listing.scheduled_date,
    b.published_url ?? listing.published_url,
    listing.id
  );
  res.json(db.prepare('SELECT * FROM listings WHERE id = ?').get(listing.id));
});

router.delete('/:id', (req, res) => {
  const listing = ownedListing(req.params.id, req.user.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  db.prepare('DELETE FROM listings WHERE id = ?').run(listing.id);
  res.json({ success: true });
});

module.exports = router;
