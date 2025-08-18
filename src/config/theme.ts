// Map Theme Configuration
// Customize colors, styling, and visual elements

export const mapTheme = {
  // Color palette
  colors: {
    primary: '#3B82F6', // Blue
    secondary: '#F59E0B', // Orange
    success: '#10B981', // Green
    warning: '#F59E0B', // Orange
    danger: '#EF4444', // Red
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    // Venue status colors
    venue: {
      open: '#10B981', // Green for open venues
      happyHour: '#F59E0B', // Orange for active deals
      closed: '#6B7280', // Gray for closed venues
    }
  },

  // Map tile styles
  tiles: {
    // Modern CartoDB Voyager style (default)
    default: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd'
    },
    // Dark theme
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd'
    },
    // Light theme
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd'
    }
  },

  // Marker styling
  markers: {
    size: {
      small: 24,
      medium: 32,
      large: 40
    },
    animation: {
      duration: 300,
      easing: 'ease-out'
    }
  },

  // Popup styling
  popup: {
    maxWidth: 320,
    borderRadius: 12,
    shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: 16
  },

  // Cluster styling
  cluster: {
    colors: {
      low: '#10B981', // Green for few markers
      medium: '#F59E0B', // Orange for medium clusters
      high: '#EF4444' // Red for many markers
    },
    radius: 50,
    maxZoom: 16
  },

  // Controls styling
  controls: {
    borderRadius: 8,
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)'
  }
};

// Dark mode overrides
export const darkModeTheme = {
  ...mapTheme,
  colors: {
    ...mapTheme.colors,
    gray: {
      50: '#111827',
      100: '#1F2937',
      200: '#374151',
      300: '#4B5563',
      400: '#6B7280',
      500: '#9CA3AF',
      600: '#D1D5DB',
      700: '#E5E7EB',
      800: '#F3F4F6',
      900: '#F9FAFB',
    }
  },
  controls: {
    ...mapTheme.controls,
    background: 'rgba(17, 24, 39, 0.95)'
  }
};
