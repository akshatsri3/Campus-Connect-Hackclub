// constants/colors.js
// Central color palette for the entire app.
// Using a consistent palette makes the app look professional and is easy to maintain.

const Colors = {
  // Primary brand color — indigo/purple
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',

  // Accent
  accent: '#EC4899',

  // Category tag colors
  categories: {
    Workshop: { bg: '#EEF2FF', text: '#4F46E5' },
    Meetup: { bg: '#F0FDF4', text: '#16A34A' },
    Talk: { bg: '#FFF7ED', text: '#EA580C' },
    Social: { bg: '#FDF2F8', text: '#C026D3' },
    Competition: { bg: '#FEF2F2', text: '#DC2626' },
    General: { bg: '#F1F5F9', text: '#64748B' },
  },

  // Background colors
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',

  // Text colors
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',

  // Status colors
  success: '#16A34A',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  warning: '#D97706',

  // UI elements
  white: '#FFFFFF',
  border: '#E2E8F0',
  inputBg: '#F8FAFC',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
};

export default Colors;
