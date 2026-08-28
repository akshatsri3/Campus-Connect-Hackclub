// app/index.js
// Home Screen — shows all upcoming events with a search bar.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEvents } from '../services/api';
import Colors from '../constants/colors';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);         // All events from the server
  const [searchQuery, setSearchQuery] = useState(''); // What the user typed in search
  const [loading, setLoading] = useState(true);     // Show spinner while fetching
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [error, setError] = useState(null);         // Error message if fetch fails

  // Fetch events when the screen first loads
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setError(null);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError('Could not load events. Make sure the backend is running!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Pull-to-refresh handler
  function handleRefresh() {
    setRefreshing(true);
    fetchEvents();
  }

  // Filter events based on the search query (simple title match)
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show spinner while initially loading
  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <View style={styles.container}>
      {/* Welcome message */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeText}>👋 Welcome, Alex!</Text>
        <Text style={styles.welcomeSubtext}>Discover events happening on campus</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {/* Clear button — shows only when there's text */}
        {searchQuery.length > 0 && (
          <Text style={styles.clearButton} onPress={() => setSearchQuery('')}>
            ✕
          </Text>
        )}
      </View>

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Events list */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
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
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : '📅 Upcoming Events'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? `No events match "${searchQuery}"`
                : 'No upcoming events right now. Check back later!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  welcomeBanner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 46,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  clearButton: {
    fontSize: 14,
    color: Colors.textLight,
    paddingLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.errorLight,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.error,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
