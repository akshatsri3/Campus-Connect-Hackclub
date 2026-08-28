// seed.js
// This file inserts initial data into the database.
// It checks if data already exists before inserting, so it's safe to run multiple times.

const { db } = require('./database');

function seedDatabase() {
  // --- Insert demo user ---
  // We check if the user already exists so we don't duplicate on every server restart
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('alex@example.com');

  if (!existingUser) {
    db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run('Alex', 'alex@example.com');
    console.log('✅ Demo user created: Alex (alex@example.com)');
  } else {
    console.log('ℹ️  Demo user already exists');
  }

  // --- Insert sample events ---
  const existingEvents = db.prepare('SELECT COUNT(*) as count FROM events').get();

  if (existingEvents.count === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (title, description, date, time, venue, organizer, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleEvents = [
      {
        title: 'App Craft 2026',
        description: 'A hands-on workshop where students learn to build mobile apps from scratch using React Native and Expo. Perfect for beginners who want to get into mobile development!',
        date: '2026-09-15',
        time: '10:00 AM',
        venue: 'CS Building, Room 101',
        organizer: 'HackClub',
        category: 'Workshop',
      },
      {
        title: 'HackClub Meetup',
        description: 'Monthly meetup for all tech enthusiasts on campus. Share your projects, get feedback, and collaborate with fellow developers. Refreshments will be provided!',
        date: '2026-09-20',
        time: '06:00 PM',
        venue: 'Student Center, Hall B',
        organizer: 'HackClub',
        category: 'Meetup',
      },
      {
        title: 'Tech Talk: AI & Machine Learning',
        description: 'Join us for an exciting talk by industry experts on the latest trends in AI and Machine Learning. Learn how ML is changing the world and how you can get started.',
        date: '2026-09-25',
        time: '02:00 PM',
        venue: 'Auditorium A',
        organizer: 'Tech Society',
        category: 'Talk',
      },
      {
        title: 'Gaming Night',
        description: 'Unwind after a long week with fellow students! We have gaming setups for PC, PS5, and Switch. Bring your friends and enjoy a fun evening of friendly competition.',
        date: '2026-10-01',
        time: '07:00 PM',
        venue: 'Recreation Center',
        organizer: 'Gaming Club',
        category: 'Social',
      },
      {
        title: 'Coding Contest',
        description: 'Test your problem-solving skills in our annual coding contest! Compete individually or in teams of up to 3. Prizes for top 3 teams. Registration closes 2 days before the event.',
        date: '2026-10-10',
        time: '09:00 AM',
        venue: 'CS Lab, 2nd Floor',
        organizer: 'Computer Science Dept.',
        category: 'Competition',
      },
    ];

    for (const event of sampleEvents) {
      insertEvent.run(
        event.title,
        event.description,
        event.date,
        event.time,
        event.venue,
        event.organizer,
        event.category
      );
    }

    console.log('✅ Sample events seeded (5 events)');
  } else {
    console.log(`ℹ️  Events already exist (${existingEvents.count} events in database)`);
  }
}

module.exports = { seedDatabase };
