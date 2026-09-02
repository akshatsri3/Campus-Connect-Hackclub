// components/EventCard.js
// Modern dark card component matching the mockup with cover image and overlaid category badge.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

// Helper: format date from "2026-04-09" to "Thu, Apr 9"
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

export default function EventCard({ event }) {
  const router = useRouter();

  const category = event.category || 'General';
  const categoryStyle = Colors.categories[category] || Colors.categories.General;
  const imageUrl = event.image_url || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.General;

  function handlePress() {
    router.push(`/events/${event.id}`);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.88}>
      {/* Event Cover Image with Overlaid Badge */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageGradientOverlay} />

        {/* Category Badge placed on the bottom-left of image as in mockup */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.bg }]}>
          <Text style={[styles.categoryText, { color: categoryStyle.text }]}>
            {category}
          </Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Date and Time */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} style={styles.infoIcon} />
          <Text style={styles.infoText} numberOfLines={1}>
            {formatEventDate(event.date)} · {event.time}
          </Text>
        </View>

        {/* Venue */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} style={styles.infoIcon} />
          <Text style={styles.infoText} numberOfLines={1}>
            {event.venue}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 155,
    position: 'relative',
    backgroundColor: '#1E2337',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 14, 23, 0.25)',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  content: {
    padding: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 7,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    fontWeight: '500',
  },
});
