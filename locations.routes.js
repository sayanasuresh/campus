const express = require('express');
const { getCollection, saveCollection, nextId } = require('../utils/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/locations?category=1&search=library — public
router.get('/', (req, res) => {
  let locations = getCollection('locations');
  const { category, search } = req.query;

  if (category) {
    const categoryId = Number(category);
    locations = locations.filter((l) => l.categoryId === categoryId);
  }

  if (search) {
    const term = String(search).toLowerCase();
    locations = locations.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        (l.description || '').toLowerCase().includes(term) ||
        (l.building || '').toLowerCase().includes(term)
    );
  }

  res.json(locations);
});

// GET /api/locations/:id — public
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const location = getCollection('locations').find((l) => l.id === id);
  if (!location) return res.status(404).json({ error: 'Location not found.' });
  res.json(location);
});

// POST /api/locations — admin only
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, categoryId, lat, lng } = req.body;
  if (!name || !categoryId || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'name, categoryId, lat, and lng are required.' });
  }

  const locations = getCollection('locations');
  const location = {
    id: nextId(locations),
    name,
    categoryId: Number(categoryId),
    lat: Number(lat),
    lng: Number(lng),
    building: req.body.building || '',
    floor: req.body.floor || '',
    hours: req.body.hours || '',
    description: req.body.description || '',
    image: req.body.image || '',
  };
  locations.push(location);
  saveCollection('locations', locations);
  res.status(201).json(location);
});

// PUT /api/locations/:id — admin only
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const locations = getCollection('locations');
  const idx = locations.findIndex((l) => l.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Location not found.' });

  locations[idx] = { ...locations[idx], ...req.body, id };
  saveCollection('locations', locations);
  res.json(locations[idx]);
});

// DELETE /api/locations/:id — admin only
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const locations = getCollection('locations');
  const filtered = locations.filter((l) => l.id !== id);
  if (filtered.length === locations.length) {
    return res.status(404).json({ error: 'Location not found.' });
  }
  saveCollection('locations', filtered);
  res.status(204).send();
});

module.exports = router;
