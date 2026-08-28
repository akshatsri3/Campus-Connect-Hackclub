// app/create-event.js
// Create Event Screen — a form to add a new campus event.

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
import { useRouter } from 'expo-router';
import { createEvent } from '../services/api';
import Colors from '../constants/colors';

// Category options for the picker
const CATEGORIES = ['Workshop', 'Meetup', 'Talk', 'Social', 'Competition', 'General'];

export default function CreateEventScreen() {
  const router = useRouter();

  // Form state — one state object to hold all form fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    category: 'General',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // Field-level validation errors

  // Update a single field in the form
  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  // Validate required fields before submitting
  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Event name is required';
    if (!form.date.trim()) newErrors.date = 'Date is required (e.g., 2026-10-20)';
    if (!form.time.trim()) newErrors.time = 'Time is required (e.g., 02:00 PM)';
    if (!form.venue.trim()) newErrors.venue = 'Venue is required';
    if (!form.organizer.trim()) newErrors.organizer = 'Organizer is required';
    return newErrors;
  }

  async function handleSubmit() {
    // Run validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await createEvent(form);
      Alert.alert('✅ Event Created!', `"${form.title}" has been added successfully.`, [
        {
          text: 'Go to Home',
          onPress: () => router.push('/'),
        },
      ]);

      // Reset the form after creation
      setForm({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        organizer: '',
        category: 'General',
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not create the event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Tip banner */}
          <View style={styles.tipBanner}>
            <Text style={styles.tipText}>
              💡 Fill in the details below to add a new campus event.
            </Text>
          </View>

          {/* Event Name */}
          <FormField
            label="Event Name *"
            placeholder="e.g., Web Dev Bootcamp"
            value={form.title}
            onChangeText={(v) => updateField('title', v)}
            error={errors.title}
          />

          {/* Description */}
          <FormField
            label="Description"
            placeholder="Tell students what this event is about..."
            value={form.description}
            onChangeText={(v) => updateField('description', v)}
            multiline
            numberOfLines={4}
          />

          {/* Date & Time in a row */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FormField
                label="Date *"
                placeholder="2026-10-20"
                value={form.date}
                onChangeText={(v) => updateField('date', v)}
                error={errors.date}
                hint="Format: YYYY-MM-DD"
              />
            </View>
            <View style={styles.halfField}>
              <FormField
                label="Time *"
                placeholder="02:00 PM"
                value={form.time}
                onChangeText={(v) => updateField('time', v)}
                error={errors.time}
              />
            </View>
          </View>

          {/* Venue */}
          <FormField
            label="Venue *"
            placeholder="e.g., CS Lab, Room 204"
            value={form.venue}
            onChangeText={(v) => updateField('venue', v)}
            error={errors.venue}
          />

          {/* Organizer */}
          <FormField
            label="Organizer *"
            placeholder="e.g., HackClub"
            value={form.organizer}
            onChangeText={(v) => updateField('organizer', v)}
            error={errors.organizer}
          />

          {/* Category picker — simple buttons instead of a complex dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryPicker}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryOption,
                    form.category === cat && styles.categoryOptionSelected,
                  ]}
                  onPress={() => updateField('category', cat)}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      form.category === cat && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Creating Event...' : '➕ Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Reusable form field component to avoid repeating input styles
function FormField({ label, error, hint, multiline, numberOfLines, ...inputProps }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError,
        ]}
        placeholderTextColor={Colors.textLight}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...inputProps}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  tipBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tipText: {
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: Colors.error,
  },
  hint: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
