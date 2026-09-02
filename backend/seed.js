// seed.js
// This file inserts initial data into the database matching the design mockup.

const { db } = require('./database');

function seedDatabase(forceRefresh = false) {
  // --- Insert demo user ---
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('alex@example.com');

  if (!existingUser) {
    db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run('Alex', 'alex@example.com');
    console.log('✅ Demo user created: Alex (alex@example.com)');
  } else {
    console.log('ℹ️  Demo user already exists');
  }

  // --- Insert sample events ---
  const existingEvents = db.prepare('SELECT COUNT(*) as count FROM events').get();

  if (existingEvents.count === 0 || forceRefresh) {
    if (forceRefresh) {
      db.prepare('DELETE FROM registrations').run();
      db.prepare('DELETE FROM events').run();
    }

    const insertEvent = db.prepare(`
      INSERT INTO events (title, description, date, time, venue, organizer, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleEvents = [
      {
        title: 'Guest Lecture: The Future of AI',
        description: 'Explore generative artificial intelligence, neural architectures, and how AI agents are transforming research and industry with distinguished guest speakers.',
        date: '2026-04-09',
        time: '6:30 PM – 8:00 PM',
        venue: 'Science Center Auditorium',
        organizer: 'Computer Science Dept.',
        category: 'Academic',
        image_url: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop&q=80',
      },
      {
        title: 'Spring Music Festival',
        description: 'Annual campus outdoor concert featuring 6 student bands, food trucks, light shows, and acoustic performances under the stars.',
        date: '2026-04-18',
        time: '5:00 PM – 10:00 PM',
        venue: 'Campus Main Quad',
        organizer: 'Student Council',
        category: 'Music',
        image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      },
      {
        title: 'App Craft 2026: Mobile Workshop',
        description: 'A hands-on workshop where students build full-stack mobile applications from scratch using React Native, Expo, and Node.js.',
        date: '2026-04-22',
        time: '10:00 AM – 2:00 PM',
        venue: 'CS Building, Room 101',
        organizer: 'HackClub',
        category: 'Tech',
        image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      },
      {
        title: 'Tech & Startup Career Fair',
        description: 'Connect with 40+ leading tech startups, engineering firms, and alumni recruiters. Bring your resume and portfolio!',
        date: '2026-04-28',
        time: '11:00 AM – 4:00 PM',
        venue: 'Student Union Grand Ballroom',
        organizer: 'Career Services',
        category: 'Career',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      },
      {
        title: 'Campus Esports Championship',
        description: 'Compete in Valorant, Rocket League, and Smash Ultimate for campus glory and sponsored prize pools. Live commentary and snacks!',
        date: '2026-05-02',
        time: '1:00 PM – 7:00 PM',
        venue: 'Recreation Center, Arena',
        organizer: 'Gaming Society',
        category: 'Competition',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      },
      {
        title: 'Sunset Mixer & Game Night',
        description: 'Relax before midterms with board games, pizza, music, and casual networking with fellow students across departments.',
        date: '2026-05-08',
        time: '6:00 PM – 9:00 PM',
        venue: 'Student Center Lawn',
        organizer: 'HackClub',
        category: 'Social',
        image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
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
        event.category,
        event.image_url
      );
    }

    console.log(`✅ Sample events seeded (${sampleEvents.length} events)`);
  } else {
    console.log(`ℹ️  Events already exist (${existingEvents.count} events in database)`);
  }
}

module.exports = { seedDatabase };
