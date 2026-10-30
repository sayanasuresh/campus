const express = require('express');
const { getCollection, saveCollection, nextId } = require('../utils/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories — public
router.get('/', (req, res) => {
  res.json(getCollection('categories'));
});

// POST /api/categories — admin only
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required.' });

  const categories = getCollection('categories');
  const category = { id: nextId(categories), name, icon: icon || 'map-pin', color: color || '#3E7C74' };
  categories.push(category);
  saveCollection('categories', categories);
  res.status(201).json(category);
});

// PUT /api/categories/:id — admin only
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const categories = getCollection('categories');
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found.' });

  categories[idx] = { ...categories[idx], ...req.body, id };
  saveCollection('categories', categories);
  res.json(categories[idx]);
});

// DELETE /api/categories/:id — admin only
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const categories = getCollection('categories');
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) {
    return res.status(404).json({ error: 'Category not found.' });
  }
  saveCollection('categories', filtered);
  res.status(204).send();
});

module.exports = router;
