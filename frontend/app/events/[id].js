// app/events/[id].js
// Event Details Screen — shows full info about one event with hero cover image and registration.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getEvent, registerForEvent, checkRegistration } from '../../services/api';
import Colors from '../../constants/colors';

const CATEGORY_IMAGES = {
  Academic: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop&q=80',
  Music: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  Tech: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  Career: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
  Social: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
  Competition: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  General: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
};

function formatDetailDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  async function loadEventDetails() {
    try {
      setError(null);
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
      setEvent((prev) => ({
        ...prev,
        registered_count: (prev.registered_count || 0) + 1,
      }));
      Alert.alert('🎉 Registered!', 'You have successfully reserved your spot for this event.');
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Could not register. Please try again.');
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.errorSafe}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Event Not Found</Text>
          <Text style={styles.errorSubtext}>{error || 'This event does not exist.'}</Text>
          <TouchableOpacity style={styles.backButtonCenter} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const category = event.category || 'General';
  const categoryStyle = Colors.categories[category] || Colors.categories.General;
  const imageUrl = event.image_url || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.General;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Cover Image */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          {/* Back button overlay */}
          <SafeAreaView style={styles.backButtonSafeArea} edges={['top']}>
            <TouchableOpacity
              style={styles.floatingBackButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Category Pill overlaid on image */}
          <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.bg }]}>
            <Text style={[styles.categoryText, { color: categoryStyle.text }]}>
              {category}
            </Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Organizer row */}
          <View style={styles.organizerRow}>
            <Ionicons name="person-circle-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.organizerText}>
              Organized by <Text style={{ color: Colors.white, fontWeight: '700' }}>{event.organizer}</Text>
            </Text>
          </View>

          {/* Info cards */}
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primaryLight} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDetailDate(event.date)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={18} color={Colors.primaryLight} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-outline" size={18} color={Colors.primaryLight} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{event.venue}</Text>
              </View>
            </View>
          </View>

          {/* Attendees */}
          <View style={styles.attendeesCard}>
            <Ionicons name="people-outline" size={20} color={Colors.primaryLight} style={{ marginRight: 10 }} />
            <Text style={styles.attendeesText}>
              <Text style={{ fontWeight: '800', color: Colors.white }}>{event.registered_count || 0}</Text> students registered
            </Text>
          </View>

          {/* About Section */}
          {event.description ? (
            <View style={styles.aboutCard}>
              <Text style={styles.aboutHeader}>About this event</Text>
              <Text style={styles.aboutBody}>{event.description}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        {isRegistered ? (
          <View style={styles.registeredBanner}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
            <Text style={styles.registeredBannerText}>You're registered for this event!</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.registerButton, registering && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={registering}
            activeOpacity={0.85}
          >
            <Ionicons
              name={registering ? 'hourglass-outline' : 'ticket-outline'}
              size={20}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.registerButtonText}>
              {registering ? 'Registering...' : 'Register for Event'}
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroImageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: '#1E2337',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 14, 23, 0.35)',
  },
  backButtonSafeArea: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 10,
  },
  floatingBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 14, 23, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  body: {
    padding: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 30,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  organizerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTexts: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  attendeesCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 14,
  },
  attendeesText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  aboutCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  aboutHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  aboutBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B0E17',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
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
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  registeredBannerText: {
    color: Colors.success,
    fontSize: 15,
    fontWeight: '700',
  },
  errorSafe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  backButtonCenter: {
    marginTop: 12,
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
