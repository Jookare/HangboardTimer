export const palette = {
  // Base colors
  white: '#ffffff',
  black: '#000000',
  dark: '#202020',

  // Background colors, 2 levels
  bg: '#f2f2f2',
  bg_light: '#ffffff',

  // Accent colors (used for workout card borders / icons)
  green: '#a0c49d',
  yellow: '#ff9f10',
  red: '#fb6069',
  purple: '#8375ce',
  blue: '#7ccbd2',

  // Tab bar
  active: '#000000',
  inactive: '#a9a9a9',

  // Neutrals
  gray: '#f6f6f6',
  light: '#e0e0e0',
  subtitle: '#595252',

  // Timer phase colors
  phaseHang: '#4ade80',
  phasePrep: '#fcd34d',
  phaseRepRest: '#f87171',
  phaseSetRest: '#f87171',
  phaseComplete: '#38bdf8',

  // Switch colors
  switchOn: '#17b26a',
  switchOff: '#d0d5dd',
};

// Resolve a named color scheme for workout cards.
export const getColorScheme = (scheme) => {
  const base = {
    subtitleColor: palette.subtitle,
    titleColor: palette.black,
    background: palette.white,
  };

  const borders = {
    green: palette.green,
    yellow: palette.yellow,
    blue: palette.blue,
    red: palette.red,
    purple: palette.purple,
    dark: palette.dark,
    white: palette.light,
  };

  return { ...base, border: borders[scheme] ?? palette.gray };
};

// Predefined shadows (iOS shadow* + Android elevation)
export const shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.41,
    elevation: 2,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
};
