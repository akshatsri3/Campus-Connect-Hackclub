# 🎓 CampusConnect

A beginner-friendly full-stack mobile application for college students to discover and register for campus events.

Built for the **App Craft** workshop — designed to be simple, readable, and easy to explain in a live workshop setting.

---

## 📱 What Does It Do?

CampusConnect lets students:

1. **Browse** upcoming campus events on the Home screen
2. **Search** events by title
3. **View** full event details (date, time, venue, description, organizer)
4. **Register** for events with a single tap
5. **See** all their registered events in "My Events"
6. **Create** new campus events through a simple form

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Mobile App** | React Native + Expo | Build iOS/Android apps with JavaScript |
| **Navigation** | Expo Router | File-based routing, like Next.js but for mobile |
| **Styling** | React Native StyleSheet | Built-in — no extra libraries needed |
| **Backend** | Node.js + Express.js | Simple, fast REST API server |
| **Database** | SQLite (node:sqlite) | Lightweight file-based database — no setup needed |
| **HTTP Client** | fetch (built-in) | No Axios or other libraries needed |

---

## 📋 Requirements

Before you begin, make sure you have:

- **Node.js** v22.5 or newer — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **Expo Go** app on your phone — search "Expo Go" on App Store or Google Play
- **Git** (optional but recommended)

Check your Node.js version:
```bash
node --version
# Should print v22.x.x or higher
```

---

## 📂 Project Structure

```
CampusConnect/
│
├── frontend/                    # React Native / Expo app
│   ├── app/
│   │   ├── _layout.js           # Root layout — sets up tab navigation
│   │   ├── index.js             # 🏠 Home screen
│   │   ├── my-events.js         # 🎟️ My Events screen
│   │   ├── create-event.js      # ➕ Create Event screen
│   │   └── events/
│   │       └── [id].js          # Event Details screen (dynamic route)
│   │
│   ├── components/
│   │   ├── EventCard.js         # Reusable event card UI
│   │   └── LoadingSpinner.js    # Simple loading indicator
│   │
│   ├── services/
│   │   └── api.js               # All API calls in one place
│   │
│   ├── constants/
│   │   └── colors.js            # Color palette
│   │
│   ├── .env                     # API base URL (change for physical phone)
│   └── package.json
│
├── backend/
│   ├── server.js                # Express server — entry point
│   ├── database.js              # DB connection + table creation
│   ├── seed.js                  # Insert demo user + sample events
│   ├── routes/
│   │   ├── events.js            # GET/POST event endpoints
│   │   └── registrations.js     # Register + My Events endpoints
│   └── package.json
│
├── README.md                    # This file
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/campusconnect.git
cd campusconnect
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Running the Project

### Start the Backend

```bash
cd backend
npm start
```

You should see:

```
✅ Database tables ready
✅ Demo user created: Alex (alex@example.com)
✅ Sample events seeded (5 events)

🚀 CampusConnect backend running on http://localhost:5000
   Try: http://localhost:5000/api/events
```

Visit http://localhost:5000/api/events in your browser to confirm it's working.

### Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

This will start the Expo development server and show a QR code.

---

## 📱 Running on Your Phone

### Same Wi-Fi Requirement

Your phone and computer **must be on the same Wi-Fi network** for the app to communicate with the backend.

### Why `localhost` Doesn't Work on a Physical Phone

When you run the backend on your computer, `localhost` refers to your computer's own address. But when your phone tries to connect to `localhost`, it looks for a server running on the phone itself — which doesn't exist!

Instead, you need to use your **computer's local IP address** (like `192.168.1.45`) so the phone can find your computer over the network.

### Step-by-Step Setup for Physical Phone

**Step 1: Find your computer's local IP address**

- **Windows**: Open Command Prompt → type `ipconfig` → look for `IPv4 Address` under your Wi-Fi adapter
- **Mac**: Open Terminal → type `ifconfig` → look for `inet` under `en0`
- **Linux**: Open Terminal → type `ip addr show`

Your IP will look like: `192.168.1.45`

**Step 2: Update the `.env` file in the frontend folder**

Open `frontend/.env` and change:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

To your computer's actual IP:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.45:5000
```

**Step 3: Start the backend** (as shown above)

**Step 4: Start Expo**

```bash
cd frontend
npm start
```

**Step 5: Open in Expo Go**

- Open the **Expo Go** app on your phone
- Scan the QR code shown in your terminal
- The app will load on your phone!

---

## 🔌 Environment Variables

### `EXPO_PUBLIC_API_URL`

The base URL for the backend API.

| Scenario | Value |
|----------|-------|
| Running on Android Emulator | `http://10.0.2.2:5000` |
| Running on iOS Simulator | `http://localhost:5000` |
| Running on physical phone | `http://YOUR_COMPUTER_IP:5000` |

Set it in `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.45:5000
```

> **Note:** Variables starting with `EXPO_PUBLIC_` are automatically available in your React Native code as `process.env.EXPO_PUBLIC_API_URL`.

---

## 📡 API Documentation

Base URL: `http://localhost:5000`

### Events

#### `GET /api/events`
Returns all events, ordered by date. Each event includes a `registered_count`.

**Response:**
```json
[
  {
    "id": 1,
    "title": "App Craft 2026",
    "description": "...",
    "date": "2026-09-15",
    "time": "10:00 AM",
    "venue": "CS Building, Room 101",
    "organizer": "HackClub",
    "category": "Workshop",
    "registered_count": 3
  }
]
```

---

#### `GET /api/events/:id`
Returns a single event by ID.

**Example:** `GET /api/events/1`

---

#### `POST /api/events`
Creates a new event.

**Request body:**
```json
{
  "title": "New Event",
  "description": "A fun event",
  "date": "2026-10-15",
  "time": "03:00 PM",
  "venue": "Main Hall",
  "organizer": "Student Council",
  "category": "Social"
}
```

**Required fields:** `title`, `date`, `time`, `venue`, `organizer`

---

### Registrations

#### `POST /api/events/:id/register`
Registers a user for an event.

**Request body:**
```json
{ "userId": 1 }
```

**Success (201):**
```json
{ "message": "Successfully registered for the event!" }
```

**If already registered (409):**
```json
{ "error": "You are already registered for this event" }
```

---

#### `GET /api/users/:id/events`
Returns all events a user has registered for.

**Example:** `GET /api/users/1/events`

---

#### `GET /api/events/:id/check-registration?userId=1`
Returns whether the user is registered for the event.

**Response:**
```json
{ "isRegistered": true }
```

---

## 🗄️ Database

The database file is `backend/campusconnect.db`. It is created automatically when you start the backend.

### Tables

#### `users`
Stores app users. In this workshop, there is only one demo user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Auto-generated unique ID |
| `name` | TEXT | User's name |
| `email` | TEXT | User's email (must be unique) |

#### `events`
Stores all campus events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Auto-generated unique ID |
| `title` | TEXT | Event name |
| `description` | TEXT | What the event is about |
| `date` | TEXT | Date in YYYY-MM-DD format |
| `time` | TEXT | Time as a string (e.g., "10:00 AM") |
| `venue` | TEXT | Where the event is held |
| `organizer` | TEXT | Who is organizing it |
| `category` | TEXT | Workshop, Talk, Meetup, etc. |
| `created_at` | DATETIME | When the record was created |

#### `registrations`
Tracks which user registered for which event. A user can only register once per event.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Auto-generated unique ID |
| `user_id` | INTEGER | Foreign key → users.id |
| `event_id` | INTEGER | Foreign key → events.id |
| `created_at` | DATETIME | When the registration was made |

The `UNIQUE(user_id, event_id)` constraint in this table prevents duplicate registrations at the database level.

---

## 🎯 Workshop Checkpoints

The project is structured conceptually as 8 checkpoints:

### Checkpoint 1 — Basic Expo App + Navigation
- Created the Expo project
- Set up Expo Router with bottom tab navigation
- Three tabs: Home, My Events, Create Event

### Checkpoint 2 — Event Cards + Event Details
- Built the `EventCard` component
- Created the Event Details screen with dynamic routing (`/events/[id]`)
- Added static placeholder data

### Checkpoint 3 — Backend + Express API
- Set up the Node.js + Express backend
- Created routes for events and registrations
- Tested API endpoints manually in the browser

### Checkpoint 4 — SQLite Database + Seeded Events
- Connected the backend to SQLite using `node:sqlite`
- Created the three database tables
- Seeded 5 sample events and the demo user

### Checkpoint 5 — Frontend Connected to Backend
- Created `services/api.js` with all fetch functions
- Connected the Home screen to the real `/api/events` endpoint
- Added loading and error states

### Checkpoint 6 — Registration Functionality
- Connected Event Details to the backend
- Implemented the Register button
- Added duplicate registration prevention (both backend UNIQUE constraint and UI feedback)
- My Events tab shows real registered events

### Checkpoint 7 — Create Event Functionality
- Built the Create Event form
- Connected it to `POST /api/events`
- Added basic form validation
- New event appears on Home after creation

### Checkpoint 8 — Search + Polish
- Added search bar with live filtering
- Added pull-to-refresh
- Added empty states for all screens
- Improved loading states and error messages
- Final UI polish

---

## 👤 Demo User

Since this project doesn't have authentication, a demo user is hardcoded:

```
ID:    1
Name:  Alex
Email: alex@example.com
```

The app automatically uses this user for registrations. When you tap "Register", it sends `{ userId: 1 }` to the backend.

---

## 🐛 Troubleshooting

**Backend won't start**
- Make sure you're in the `backend/` folder
- Make sure Node.js v22.5+ is installed: `node --version`

**"Could not load events" on Home screen**
- Make sure the backend is running: `cd backend && npm start`
- If on a physical phone, make sure `EXPO_PUBLIC_API_URL` is set to your LAN IP, not `localhost`

**"You are already registered" error**
- This is expected! The app prevents duplicate registrations.

**Expo app not loading**
- Make sure your phone and computer are on the same Wi-Fi network
- Try pressing `r` in the Expo terminal to reload

---

## 📄 License

MIT — feel free to use this project for learning and workshops.
