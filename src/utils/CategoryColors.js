/**
 * 🎨 CATEGORY COLORS SYSTEM
 * 
 * Each category gets its own unique color scheme
 * Applied to word cards for visual categorization
 */

// Category color mapping
export const categoryColors = {
  // Religious & Divine
  'Divine Names': {
    primary: '#9c27b0',      // Purple
    light: '#e1bee7',
    dark: '#7b1fa2',
    gradient: 'linear-gradient(135deg, #9c27b0, #ba68c8)'
  },
  'Faith': {
    primary: '#3f51b5',      // Indigo
    light: '#c5cae9',
    dark: '#303f9f',
    gradient: 'linear-gradient(135deg, #3f51b5, #5c6bc0)'
  },
  'Worship': {
    primary: '#673ab7',      // Deep Purple
    light: '#d1c4e9',
    dark: '#512da8',
    gradient: 'linear-gradient(135deg, #673ab7, #7e57c2)'
  },
  'Prophets': {
    primary: '#ff9800',      // Orange
    light: '#ffe0b2',
    dark: '#f57c00',
    gradient: 'linear-gradient(135deg, #ff9800, #ffa726)'
  },
  'Angels': {
    primary: '#00bcd4',      // Cyan
    light: '#b2ebf2',
    dark: '#0097a7',
    gradient: 'linear-gradient(135deg, #00bcd4, #26c6da)'
  },

  // Actions & Concepts
  'Common Verbs': {
    primary: '#4caf50',      // Green
    light: '#c8e6c9',
    dark: '#388e3c',
    gradient: 'linear-gradient(135deg, #4caf50, #66bb6a)'
  },
  'Actions': {
    primary: '#8bc34a',      // Light Green
    light: '#dcedc8',
    dark: '#689f38',
    gradient: 'linear-gradient(135deg, #8bc34a, #9ccc65)'
  },
  'States': {
    primary: '#009688',      // Teal
    light: '#b2dfdb',
    dark: '#00796b',
    gradient: 'linear-gradient(135deg, #009688, #26a69a)'
  },

  // Language Elements
  'Common Nouns': {
    primary: '#2196f3',      // Blue
    light: '#bbdefb',
    dark: '#1976d2',
    gradient: 'linear-gradient(135deg, #2196f3, #42a5f5)'
  },
  'Pronouns': {
    primary: '#03a9f4',      // Light Blue
    light: '#b3e5fc',
    dark: '#0277bd',
    gradient: 'linear-gradient(135deg, #03a9f4, #29b6f6)'
  },
  'Descriptive': {
    primary: '#00acc1',      // Dark Cyan
    light: '#b2ebf2',
    dark: '#00838f',
    gradient: 'linear-gradient(135deg, #00acc1, #26c6da)'
  },
  'Particles': {
    primary: '#0097a7',      // Dark Teal
    light: '#b2dfdb',
    dark: '#00838f',
    gradient: 'linear-gradient(135deg, #0097a7, #00acc1)'
  },

  // Nature & World
  'Nature': {
    primary: '#4caf50',      // Green
    light: '#c8e6c9',
    dark: '#388e3c',
    gradient: 'linear-gradient(135deg, #4caf50, #66bb6a)'
  },
  'Creation': {
    primary: '#8bc34a',      // Light Green
    light: '#dcedc8',
    dark: '#689f38',
    gradient: 'linear-gradient(135deg, #8bc34a, #9ccc65)'
  },
  'Body Parts': {
    primary: '#ff5722',      // Deep Orange
    light: '#ffccbc',
    dark: '#e64a19',
    gradient: 'linear-gradient(135deg, #ff5722, #ff7043)'
  },

  // Society & Relations
  'People': {
    primary: '#ff9800',      // Orange
    light: '#ffe0b2',
    dark: '#f57c00',
    gradient: 'linear-gradient(135deg, #ff9800, #ffa726)'
  },
  'Family': {
    primary: '#ff6f00',      // Amber
    light: '#ffe082',
    dark: '#f57c00',
    gradient: 'linear-gradient(135deg, #ff6f00, #ff8f00)'
  },

  // Concepts & Abstract
  'Moral Qualities': {
    primary: '#e91e63',      // Pink
    light: '#f8bbd0',
    dark: '#c2185b',
    gradient: 'linear-gradient(135deg, #e91e63, #ec407a)'
  },
  'Islamic Concepts': {
    primary: '#9c27b0',      // Purple
    light: '#e1bee7',
    dark: '#7b1fa2',
    gradient: 'linear-gradient(135deg, #9c27b0, #ab47bc)'
  },
  'Afterlife': {
    primary: '#673ab7',      // Deep Purple
    light: '#d1c4e9',
    dark: '#512da8',
    gradient: 'linear-gradient(135deg, #673ab7, #7e57c2)'
  },

  // Time & Space
  'Time': {
    primary: '#795548',      // Brown
    light: '#d7ccc8',
    dark: '#5d4037',
    gradient: 'linear-gradient(135deg, #795548, #8d6e63)'
  },
  'Numbers': {
    primary: '#607d8b',      // Blue Grey
    light: '#cfd8dc',
    dark: '#455a64',
    gradient: 'linear-gradient(135deg, #607d8b, #78909c)'
  },

  // Default/Fallback
  'All': {
    primary: '#0d7377',      // Default teal
    light: '#b2dfdb',
    dark: '#00796b',
    gradient: 'linear-gradient(135deg, #0d7377, #14ffec)'
  }
};

// Helper function to get category color
export function getCategoryColor(category) {
  return categoryColors[category] || categoryColors['All'];
}

// Helper to get contrasting text color
export function getTextColor(category) {
  const darkCategories = [
    'Divine Names', 'Faith', 'Worship', 'Prophets',
    'Common Verbs', 'Actions', 'States', 'Common Nouns',
    'Pronouns', 'Descriptive', 'Particles', 'Nature',
    'Creation', 'Body Parts', 'People', 'Family',
    'Moral Qualities', 'Islamic Concepts', 'Afterlife',
    'Time', 'Numbers'
  ];
  
  return darkCategories.includes(category) ? '#ffffff' : '#000000';
}