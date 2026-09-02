// database.js
// This file sets up our SQLite database using Node.js built-in sqlite module.
// Available in Node.js v22.5+ — no npm install needed!
// The API is very similar to better-sqlite3 (synchronous, prepared statements, etc.)

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// The database file will be created in the backend folder
const DB_PATH = path.join(__dirname, 'campusconnect.db');

// Open (or create) the database file
const db = new DatabaseSync(DB_PATH);

// Enable foreign keys so our table relationships are enforced
db.exec('PRAGMA foreign_keys = ON');

// Create all tables if they don't already exist
function initializeDatabase() {
  // Users table — stores the demo user (Alex)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  // Events table — stores all campus events
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      venue TEXT NOT NULL,
      organizer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    db.exec('ALTER TABLE events ADD COLUMN image_url TEXT');
  } catch (e) {
    // Column already exists
  }

  // Registrations table — tracks who registered for which event
  // UNIQUE(user_id, event_id) prevents the same user from registering twice for one event
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(user_id, event_id)
    )
  `);

  console.log('✅ Database tables ready');
}

module.exports = { db, initializeDatabase };
