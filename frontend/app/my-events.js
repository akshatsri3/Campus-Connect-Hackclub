// app/my-events.js
// My Events Screen — shows all events the user has registered for, matching the dark theme mockup.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyEvents } from '../services/api';
import Colors from '../constants/colors';

const CATEGORY_IMAGES = {
  Academic: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop&q=80',
  Music: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  Tech: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  Career: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
  Social: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
  Competition: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  General: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
};

function formatEventDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

export default function MyEventsScreen() {
  const router = useRouter();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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
      setError('Could not load your registered events.');
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
    return <LoadingSpinner message="Loading your schedule..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={myEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RegisteredEventCard
              event={item}
              onPress={() => router.push(`/events/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primaryLight}
            />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              {/* Header with squircle badge and title matching mockup */}
              <View style={styles.headerTopRow}>
                <View style={styles.squircleBadge}>
                  <Ionicons name="calendar" size={22} color={Colors.primaryLight} />
                </View>
                <View style={styles.headerTitleGroup}>
                  <Text style={styles.headerTag}>YOUR SCHEDULE</Text>
                  <Text style={styles.headerTitle}>My Events</Text>
                </View>
              </View>

              {/* Counter label: Upcoming (X) */}
              <Text style={styles.upcomingCounter}>
                Upcoming ({myEvents.length})
              </Text>

              {error && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            !error && (
              <View style={styles.emptyContainer}>
                {/* Circular subtle icon */}
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="calendar-outline" size={36} color={Colors.textLight} />
                </View>
                <Text style={styles.emptyTitle}>No registered events yet</Text>
                <Text style={styles.emptySubtext}>
                  Browse the Home tab and register for events to see them here.
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.browseButtonText}>Discover Events</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

// Sleek dark card for registered events
function RegisteredEventCard({ event, onPress }) {
  const category = event.category || 'General';
  const categoryStyle = Colors.categories[category] || Colors.categories.General;
  const imageUrl = event.image_url || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.General;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: imageUrl }} style={styles.cardThumb} />
      <View style={styles.cardBody}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.badgeBg }]}>
          <Text style={[styles.categoryText, { color: categoryStyle.text }]}>
            {category}
          </Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={13} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.metaText} numberOfLines={1}>
            {formatEventDate(event.date)} · {event.time}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.venue}
          </Text>
        </View>
      </View>
      <View style={styles.registeredPill}>
        <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  squircleBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#201A3D',
    borderWidth: 1,
    borderColor: '#362B66',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 1.5,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  upcomingCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 90,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#151928',
    borderWidth: 1,
    borderColor: '#23283E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  browseButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#1E2337',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  registeredPill: {
    paddingLeft: 6,
  },
});
