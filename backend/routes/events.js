// routes/events.js
// All event-related API routes

const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/events
// Returns all events with the count of how many people registered
router.get('/', (req, res) => {
  const events = db.prepare(`
    SELECT 
      events.*,
      COUNT(registrations.id) AS registered_count
    FROM events
    LEFT JOIN registrations ON events.id = registrations.event_id
    GROUP BY events.id
    ORDER BY events.date ASC
  `).all();

  res.json(events);
});

// GET /api/events/:id
// Returns a single event by ID, with registration count
router.get('/:id', (req, res) => {
  const event = db.prepare(`
    SELECT 
      events.*,
      COUNT(registrations.id) AS registered_count
    FROM events
    LEFT JOIN registrations ON events.id = registrations.event_id
    WHERE events.id = ?
    GROUP BY events.id
  `).get(req.params.id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(event);
});

// POST /api/events
// Creates a new event
router.post('/', (req, res) => {
  const { title, description, date, time, venue, organizer, category, image_url } = req.body;

  // Basic validation — all required fields must be present
  if (!title || !date || !time || !venue || !organizer) {
    return res.status(400).json({ error: 'title, date, time, venue, and organizer are required' });
  }

  const result = db.prepare(`
    INSERT INTO events (title, description, date, time, venue, organizer, category, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, description || '', date, time, venue, organizer, category || 'General', image_url || null);

  // Fetch and return the newly created event
  const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newEvent);
});

module.exports = router;
