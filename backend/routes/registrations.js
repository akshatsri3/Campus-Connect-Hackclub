// routes/registrations.js
// Routes for registering users for events and viewing their registered events

const express = require('express');
const router = express.Router();
const { db } = require('../database');

// POST /api/events/:id/register
// Registers the demo user (id=1) for an event
// Body: { userId: 1 }
router.post('/events/:id/register', (req, res) => {
  const eventId = req.params.id;
  const userId = req.body.userId || 1; // Default to demo user

  // Make sure the event exists
  const event = db.prepare('SELECT id FROM events WHERE id = ?').get(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Try to insert the registration
  // The UNIQUE constraint on (user_id, event_id) will throw an error if already registered
  try {
    db.prepare(`
      INSERT INTO registrations (user_id, event_id) VALUES (?, ?)
    `).run(userId, eventId);

    res.status(201).json({ message: 'Successfully registered for the event!' });
  } catch (error) {
    // SQLite throws an error when the UNIQUE constraint is violated
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'You are already registered for this event' });
    }
    // Any other unexpected error
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
});

// GET /api/users/:id/events
// Returns all events that a specific user has registered for
router.get('/users/:id/events', (req, res) => {
  const userId = req.params.id;

  const registeredEvents = db.prepare(`
    SELECT 
      events.*,
      registrations.created_at AS registered_at
    FROM registrations
    JOIN events ON registrations.event_id = events.id
    WHERE registrations.user_id = ?
    ORDER BY events.date ASC
  `).all(userId);

  res.json(registeredEvents);
});

// GET /api/events/:id/check-registration
// Checks if the demo user is registered for a specific event
router.get('/events/:id/check-registration', (req, res) => {
  const eventId = req.params.id;
  const userId = req.query.userId || 1;

  const registration = db.prepare(`
    SELECT id FROM registrations WHERE user_id = ? AND event_id = ?
  `).get(userId, eventId);

  res.json({ isRegistered: !!registration });
});

module.exports = router;
