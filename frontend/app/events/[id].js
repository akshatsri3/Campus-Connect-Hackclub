// app/events/[id].js
// Event Details Screen — shows full info about one event + registration button.
// The [id] in the filename means Expo Router passes the id from the URL as a parameter.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getEvent, registerForEvent, checkRegistration } from '../../services/api';
import Colors from '../../constants/colors';

// Helper: format date from "2026-09-15" to "Monday, September 15, 2026"
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get the event id from the URL
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false); // Loading state for register button
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  async function loadEventDetails() {
    try {
      setError(null);

      // Fetch event details and registration status at the same time
      const [eventData, registrationStatus] = await Promise.all([
        getEvent(id),
        checkRegistration(id),
      ]);

      setEvent(eventData);
      setIsRegistered(registrationStatus.isRegistered);
    } catch (err) {
      setError(err.message || 'Could not load event details.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setRegistering(true);
    try {
      await registerForEvent(id);
      setIsRegistered(true);

      // Update the registration count shown on screen
      setEvent((prev) => ({
        ...prev,
        registered_count: (prev.registered_count || 0) + 1,
      }));

      Alert.alert('🎉 Registered!', 'You have successfully registered for this event.');
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Could not register. Please try again.');
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadEventDetails}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorTitle}>Event Not Found</Text>
        <Text style={styles.errorText}>This event does not exist.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryStyle = Colors.categories[event.category] || Colors.categories.General;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header section with gradient-like background */}
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.categoryText}>{event.category || 'General'}</Text>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.organizer}>by {event.organizer}</Text>
      </View>

      {/* Details cards */}
      <View style={styles.detailsContainer}>
        {/* Date & Time card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>⏰</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{event.time}</Text>
            </View>
          </View>
        </View>

        {/* Venue card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>{event.venue}</Text>
            </View>
          </View>
        </View>

        {/* Registration count */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Registered</Text>
              <Text style={styles.detailValue}>
                {event.registered_count || 0} students
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {event.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>About this Event</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        )}

        {/* Register button */}
        {isRegistered ? (
          <View style={styles.registeredBanner}>
            <Text style={styles.registeredIcon}>✓</Text>
            <Text style={styles.registeredText}>You are registered for this event!</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.registerButton, registering && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={registering}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>
              {registering ? 'Registering...' : '🎟️ Register for Event'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 30,
    marginBottom: 8,
  },
  organizer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  detailsContainer: {
    padding: 16,
  },
  detailCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 14,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  descriptionCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  registeredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#86EFAC',
    gap: 10,
  },
  registeredIcon: {
    fontSize: 22,
    color: Colors.success,
  },
  registeredText: {
    fontSize: 15,
    color: Colors.success,
    fontWeight: '600',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
});
