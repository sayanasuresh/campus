const express = require('express');
const { getCollection, saveCollection, nextId } = require('../utils/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/events — public. Joins the venue location so the frontend can
// jump straight to it on the map without a second request.
router.get('/', (req, res) => {
  const events = getCollection('events');
  const locations = getCollection('locations');

  const withVenue = events.map((event) => ({
    ...event,
    location: locations.find((l) => l.id === event.locationId) || null,
  }));

  res.json(withVenue);
});

// GET /api/events/:id — public
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const event = getCollection('events').find((e) => e.id === id);
  if (!event) return res.status(404).json({ error: 'Event not found.' });

  const location = getCollection('locations').find((l) => l.id === event.locationId) || null;
  res.json({ ...event, location });
});

// POST /api/events — admin only
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { title, locationId, date } = req.body;
  if (!title || !locationId || !date) {
    return res.status(400).json({ error: 'title, locationId, and date are required.' });
  }

  const events = getCollection('events');
  const event = {
    id: nextId(events),
    title,
    locationId: Number(locationId),
    date,
    time: req.body.time || '',
    description: req.body.description || '',
  };
  events.push(event);
  saveCollection('events', events);
  res.status(201).json(event);
});

// PUT /api/events/:id — admin only
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const events = getCollection('events');
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found.' });

  events[idx] = { ...events[idx], ...req.body, id };
  saveCollection('events', events);
  res.json(events[idx]);
});

// DELETE /api/events/:id — admin only
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const events = getCollection('events');
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) {
    return res.status(404).json({ error: 'Event not found.' });
  }
  saveCollection('events', filtered);
  res.status(204).send();
});

module.exports = router;
