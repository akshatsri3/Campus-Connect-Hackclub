// app/my-events.js
// My Events Screen — shows all events the demo user (Alex) has registered for.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyEvents } from '../services/api';
import Colors from '../constants/colors';

// Helper: format date
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyEventsScreen() {
  const router = useRouter();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // useFocusEffect re-fetches data whenever this tab comes into focus.
  // This ensures that if you register for an event and switch to this tab, it's up to date.
  useFocusEffect(
    useCallback(() => {
      fetchMyEvents();
    }, [])
  );

  async function fetchMyEvents() {
    try {
      setError(null);
      const data = await getMyEvents();
      setMyEvents(data);
    } catch (err) {
      setError('Could not load your events. Make sure the backend is running!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchMyEvents();
  }

  if (loading) {
    return <LoadingSpinner message="Loading your events..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MyEventCard event={item} onPress={() => router.push(`/events/${item.id}`)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Info banner */}
            <View style={styles.banner}>
              <Text style={styles.bannerText}>👤 Logged in as Alex</Text>
              <Text style={styles.bannerSubtext}>alex@example.com</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>
              🎟️ My Registered Events ({myEvents.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎫</Text>
              <Text style={styles.emptyTitle}>No registrations yet</Text>
              <Text style={styles.emptySubtext}>
                Go to Home and register for events to see them here!
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.browseButtonText}>Browse Events</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
  );
}

// A compact card for the My Events list
function MyEventCard({ event, onPress }) {
  const categoryStyle = Colors.categories[event.category] || Colors.categories.General;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardLeft}>
        <View style={[styles.categoryDot, { backgroundColor: categoryStyle.text }]} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.cardDate}>📅 {formatDate(event.date)} · {event.time}</Text>
          <Text style={styles.cardVenue} numberOfLines={1}>📍 {event.venue}</Text>
        </View>
      </View>
      <View style={styles.registeredBadge}>
        <Text style={styles.registeredText}>✓ Registered</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  banner: {
    backgroundColor: Colors.primary,
    padding: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  bannerSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  cardVenue: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  registeredBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginLeft: 8,
  },
  registeredText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: Colors.errorLight,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
  },
});
