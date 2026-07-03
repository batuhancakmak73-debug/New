const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}-${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});

function serialize(product) {
  return { ...product, images: product.images ? JSON.parse(product.images) : [] };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json(rows.map(serialize));
});

router.post('/', upload.array('images', 10), (req, res) => {
  const { name, brand, category, condition, quantity, location, retail_price, cost_price, specs, notes } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Product name is required' });
  const images = (req.files || []).map((f) => f.filename);
  const result = db
    .prepare(
      `INSERT INTO products (user_id, name, brand, category, condition, quantity, location, retail_price, cost_price, specs, notes, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id, name, brand || null, category || null, condition || null,
      parseInt(quantity, 10) || 1, location || null,
      retail_price ? parseFloat(retail_price) : null,
      cost_price ? parseFloat(cost_price) : null,
      specs || null, notes || null, JSON.stringify(images)
    );
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(serialize(product));
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(serialize(product));
});

router.put('/:id', upload.array('images', 10), (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const b = req.body || {};
  let images = product.images ? JSON.parse(product.images) : [];
  if (b.existing_images !== undefined) {
    try { images = JSON.parse(b.existing_images); } catch { /* keep current */ }
  }
  images = images.concat((req.files || []).map((f) => f.filename));
  db.prepare(
    `UPDATE products SET name = ?, brand = ?, category = ?, condition = ?, quantity = ?, location = ?,
     retail_price = ?, cost_price = ?, specs = ?, notes = ?, images = ? WHERE id = ?`
  ).run(
    b.name ?? product.name, b.brand ?? product.brand, b.category ?? product.category,
    b.condition ?? product.condition,
    b.quantity !== undefined ? parseInt(b.quantity, 10) || 1 : product.quantity,
    b.location ?? product.location,
    b.retail_price !== undefined ? parseFloat(b.retail_price) || null : product.retail_price,
    b.cost_price !== undefined ? parseFloat(b.cost_price) || null : product.cost_price,
    b.specs ?? product.specs, b.notes ?? product.notes, JSON.stringify(images), product.id
  );
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(product.id);
  res.json(serialize(updated));
});

router.delete('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  db.prepare('DELETE FROM products WHERE id = ?').run(product.id);
  res.json({ success: true });
});

module.exports = router;
