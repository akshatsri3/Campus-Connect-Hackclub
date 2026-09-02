// app/create-event.js
// Create Event Screen — form to add a new campus event, matching the dark theme mockup.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createEvent } from '../services/api';
import Colors from '../constants/colors';

const CATEGORIES = ['Tech', 'Career', 'Academic', 'Music', 'Social', 'Competition'];

export default function CreateEventScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    building: '',
    area: '',
    category: 'Tech',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Event title is required';
    if (!form.date.trim()) newErrors.date = 'Date is required (YYYY-MM-DD)';
    if (!form.time.trim()) newErrors.time = 'Time is required (e.g. 17:00)';
    if (!form.building.trim() && !form.area.trim()) {
      newErrors.venue = 'Please enter a building or area';
    }
    return newErrors;
  }

  async function handleSubmit() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert('Missing Information', 'Please complete the required event details.');
      return;
    }

    setSubmitting(true);
    try {
      const fullVenue = [form.building.trim(), form.area.trim()]
        .filter(Boolean)
        .join(', ');

      await createEvent({
        title: form.title.trim(),
        description: form.description.trim() || `${form.category} event organized on campus.`,
        date: form.date.trim(),
        time: form.time.trim(),
        venue: fullVenue || 'Campus Main Quad',
        organizer: 'Campus Club',
        category: form.category,
      });

      Alert.alert('🎉 Event Created!', `"${form.title}" is now live on CampusConnect.`, [
        {
          text: 'View on Home',
          onPress: () => router.push('/'),
        },
      ]);

      // Reset form
      setForm({
        title: '',
        description: '',
        date: '',
        time: '',
        building: '',
        area: '',
        category: 'Tech',
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header matching leftmost mockup screen */}
          <View style={styles.header}>
            <Text style={styles.headerTag}>POST SOMETHING</Text>
            <Text style={styles.headerTitle}>Create Event</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Event Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Event Title</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Spring Music Festival"
                placeholderTextColor={Colors.textLight}
                value={form.title}
                onChangeText={(v) => updateField('title', v)}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Category selection pills */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pillGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = form.category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        isSelected && styles.catPillSelected,
                      ]}
                      onPress={() => updateField('category', cat)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && styles.catPillTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={[styles.input, errors.date && styles.inputError]}
                  placeholder="2026-10-20"
                  placeholderTextColor={Colors.textLight}
                  value={form.date}
                  onChangeText={(v) => updateField('date', v)}
                />
                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={[styles.input, errors.time && styles.inputError]}
                  placeholder="17:00"
                  placeholderTextColor={Colors.textLight}
                  value={form.time}
                  onChangeText={(v) => updateField('time', v)}
                />
                {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
              </View>
            </View>

            {/* Building */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Building</Text>
              <TextInput
                style={styles.input}
                placeholder="Science Center / CS Building"
                placeholderTextColor={Colors.textLight}
                value={form.building}
                onChangeText={(v) => updateField('building', v)}
              />
            </View>

            {/* Area */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Area / Room</Text>
              <TextInput
                style={styles.input}
                placeholder="Campus Main Quad / Room 101"
                placeholderTextColor={Colors.textLight}
                value={form.area}
                onChangeText={(v) => updateField('area', v)}
              />
              {errors.venue && <Text style={styles.errorText}>{errors.venue}</Text>}
            </View>

            {/* Description (optional) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Details about what to expect, guest speakers, refreshments..."
                placeholderTextColor={Colors.textLight}
                value={form.description}
                onChangeText={(v) => updateField('description', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Ionicons
                name={submitting ? 'hourglass-outline' : 'add-circle'}
                size={20}
                color={Colors.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.submitButtonText}>
                {submitting ? 'Creating Event...' : 'Create Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  formContainer: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    height: 90,
    paddingTop: 12,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catPillTextSelected: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
