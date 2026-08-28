// services/api.js
// All API calls to the backend live here.
// 
// We use EXPO_PUBLIC_API_URL from the .env file as the base URL.
// This makes it easy to switch between localhost (emulator) and your computer's LAN IP (physical phone).

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// Demo user — no login/auth needed, we just pretend user id=1 is logged in
const DEMO_USER_ID = 1;

// --- Helper function ---
// A simple wrapper around fetch that handles errors in one place
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  // If the response is not OK (e.g., 400, 404, 500), throw an error with the message
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// --- Event API functions ---

// Get all events
export async function getEvents() {
  return apiFetch('/api/events');
}

// Get a single event by its ID
export async function getEvent(id) {
  return apiFetch(`/api/events/${id}`);
}

// Create a new event
export async function createEvent(eventData) {
  return apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

// --- Registration API functions ---

// Register the demo user for an event
export async function registerForEvent(eventId) {
  return apiFetch(`/api/events/${eventId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userId: DEMO_USER_ID }),
  });
}

// Get all events the demo user has registered for
export async function getMyEvents() {
  return apiFetch(`/api/users/${DEMO_USER_ID}/events`);
}

// Check if the demo user is already registered for an event
export async function checkRegistration(eventId) {
  return apiFetch(`/api/events/${eventId}/check-registration?userId=${DEMO_USER_ID}`);
}
