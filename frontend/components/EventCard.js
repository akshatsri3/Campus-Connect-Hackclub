// components/EventCard.js
// A reusable card component that displays a single event in the event list.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';

// Helper: format date from "2026-09-15" to "Sep 15, 2026"
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EventCard({ event }) {
  const router = useRouter();

  // Get category color from our palette, fallback to General
  const categoryStyle = Colors.categories[event.category] || Colors.categories.General;

  function handlePress() {
    router.push(`/events/${event.id}`);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.bg }]}>
        <Text style={[styles.categoryText, { color: categoryStyle.text }]}>
          {event.category || 'General'}
        </Text>
      </View>

      {/* Event title */}
      <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

      {/* Date and time row */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📅</Text>
        <Text style={styles.infoText}>{formatDate(event.date)} · {event.time}</Text>
      </View>

      {/* Venue row */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📍</Text>
        <Text style={styles.infoText} numberOfLines={1}>{event.venue}</Text>
      </View>

      {/* Footer: organizer + registration count */}
      <View style={styles.footer}>
        <View style={styles.organizerRow}>
          <Text style={styles.infoIcon}>👤</Text>
          <Text style={styles.organizerText} numberOfLines={1}>{event.organizer}</Text>
        </View>
        <View style={styles.registeredBadge}>
          <Text style={styles.registeredText}>
            {event.registered_count || 0} registered
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    lineHeight: 23,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  registeredBadge: {
    backgroundColor: Colors.categories.General.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  registeredText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
