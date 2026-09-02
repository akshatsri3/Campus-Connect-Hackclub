// app/index.js
// Home Screen — Discover events with search, featured banner, category pills, and upcoming event list.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEvents } from '../services/api';
import Colors from '../constants/colors';

const CATEGORIES = ['All', 'Music', 'Tech', 'Career', 'Academic', 'Social', 'Competition'];

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setError(null);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError('Could not connect to backend. Please ensure the server is running on localhost:5000.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchEvents();
  }

  // Filter events based on search query and category pill
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.venue && event.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner message="Discovering events..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header Content & List */}
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
              tintColor={Colors.primaryLight}
            />
          }
          ListHeaderComponent={
            <View style={styles.headerComponent}>
              {/* Screen Title Header */}
              <View style={styles.titleSection}>
                <Text style={styles.brandTag}>CAMPUSCONNECT</Text>
                <Text style={styles.screenTitle}>Discover events</Text>
              </View>

              {/* Search Bar */}
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search events, venues..."
                  placeholderTextColor={Colors.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close-circle" size={18} color={Colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Error banner if backend call failed */}
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={fetchEvents} style={styles.retryBadge}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Featured Highlight Banner */}
              <View style={styles.heroBanner}>
                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle}>This semester's hottest</Text>
                  <Text style={styles.heroSubtitle}>
                    Browse {events.length} events across campus
                  </Text>
                </View>
                <View style={styles.sparkleIconWrapper}>
                  <Ionicons name="sparkles" size={24} color="#FFFFFF" />
                </View>
              </View>

              {/* Browse by Category */}
              <View style={styles.categorySection}>
                <Text style={styles.categoryHeader}>Browse by category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryPillsContainer}
                >
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryPill,
                          isSelected && styles.categoryPillActive,
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.categoryPillText,
                            isSelected && styles.categoryPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Upcoming Events Section Header */}
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primaryLight} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>
                  {searchQuery || selectedCategory !== 'All'
                    ? `Matching Events (${filteredEvents.length})`
                    : 'Upcoming events'}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={32} color={Colors.textLight} />
              </View>
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? `No events match "${searchQuery}"`
                  : `No events in ${selectedCategory} category yet.`}
              </Text>
              {(searchQuery.length > 0 || selectedCategory !== 'All') && (
                <TouchableOpacity
                  style={styles.resetFiltersButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  <Text style={styles.resetFiltersText}>Show all events</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
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
    paddingBottom: 28,
  },
  headerComponent: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  titleSection: {
    marginBottom: 16,
  },
  brandTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.white,
  },
  heroBanner: {
    backgroundColor: '#5C54E5',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#5C54E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  heroContent: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  sparkleIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  categoryPillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 14,
    gap: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#FCA5A5',
  },
  retryBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  resetFiltersButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  resetFiltersText: {
    color: Colors.primaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
});
