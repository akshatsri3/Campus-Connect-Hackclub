// constants/colors.js
// Central color palette for the dark obsidian & violet theme.

const Colors = {
  // Primary brand color — vibrant violet/indigo
  primary: '#7C3AED',
  primaryLight: '#8B5CF6',
  primaryDark: '#5B21B6',

  // Accent
  accent: '#A78BFA',
  bannerBg: '#5C54E5',

  // Category tag colors (dark background + vibrant text matching UI mockup)
  categories: {
    Academic: { bg: '#064E3B', text: '#34D399', badgeBg: 'rgba(52, 211, 153, 0.2)' },
    Music: { bg: '#4C1D95', text: '#C4B5FD', badgeBg: 'rgba(196, 181, 253, 0.2)' },
    Tech: { bg: '#1E3A8A', text: '#93C5FD', badgeBg: 'rgba(147, 197, 253, 0.2)' },
    Career: { bg: '#78350F', text: '#FCD34D', badgeBg: 'rgba(252, 211, 77, 0.2)' },
    Social: { bg: '#831843', text: '#F472B6', badgeBg: 'rgba(244, 114, 182, 0.2)' },
    Competition: { bg: '#7F1D1D', text: '#FCA5A5', badgeBg: 'rgba(252, 165, 165, 0.2)' },
    General: { bg: '#1E293B', text: '#94A3B8', badgeBg: 'rgba(148, 163, 184, 0.2)' },
  },

  // Background colors
  background: '#0B0E17',
  card: '#151928',
  cardBorder: '#23283E',

  // Text colors
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textLight: '#64748B',

  // Status colors
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.15)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  warning: '#F59E0B',

  // UI elements
  white: '#FFFFFF',
  border: '#23283E',
  inputBg: '#161B2E',
  inputBorder: '#282E47',
  tabBar: '#0B0E17',
  tabBarBorder: '#1A1E2F',
  tabBarActive: '#8B5CF6',
  tabBarInactive: '#64748B',
};

export default Colors;
