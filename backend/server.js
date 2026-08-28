// server.js
// The main entry point for the CampusConnect backend.
// This file sets up the Express server and starts it.

const express = require('express');
const cors = require('cors');

const { initializeDatabase } = require('./database');
const { seedDatabase } = require('./seed');
const eventsRouter = require('./routes/events');
const registrationsRouter = require('./routes/registrations');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Allow requests from the mobile app (CORS)
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// --- Initialize database on startup ---
initializeDatabase();
seedDatabase();

// --- Routes ---
app.use('/api/events', eventsRouter);
app.use('/api', registrationsRouter);

// Health check route — useful to verify the server is running
app.get('/', (req, res) => {
  res.json({ message: 'CampusConnect API is running! 🎓' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`\n🚀 CampusConnect backend running on http://localhost:${PORT}`);
  console.log(`   Try: http://localhost:${PORT}/api/events\n`);
});
