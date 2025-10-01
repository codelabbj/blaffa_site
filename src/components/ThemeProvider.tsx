'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define your theme types
export type ThemeMode = 'light' | 'dark';

// Define theme colors and values
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  s_text: string;
  d_text: string;
  sl_background: string;
  s_background: string;
  c_background: string;
  a_background: string;
  text: string;
  accent: string;
  hover: string;
}

export interface ThemeValues {
  borderRadius: string;
  fontSizes: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  values: ThemeValues;
}

// Define your theme configurations
const themes: Record<ThemeMode, Theme> = {
  light: {
    mode: 'light',
    colors: {
      primary: '#0070f3',
      secondary: '#0ea5e9',
      s_text: 'text-blue-600',
      d_text: 'text-slate-900',
      s_background: 'from-slate-100/80 to-slate-200/80',
      sl_background: 'bg-slate-100',
      c_background: 'bg-slate-100/50',
      a_background: 'from-slate-100 via-blue-100 to-slate-50',
      background: 'bg-slate-50',
      text: '#1f2937',
      accent: '#8b5cf6',
      hover: 'hover:bg-gray-100'
    },
    values: {
      borderRadius: '0.5rem',
      fontSizes: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
      },
      spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem',
      },
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#0ea5e9',
      s_text: 'text-blue-300',
      d_text: 'text-slate-300',
      s_background: 'from-slate-800/80 to-slate-700/80',
      sl_background: 'bg-slate-900',
      c_background: 'bg-slate-800/50',
      a_background: 'from-slate-900 via-blue-900 to-slate-800',
      background: 'bg-slate-800',
      text: '#f9fafb',
      accent: '#a78bfa',
      hover: 'hover:bg-gray-700'
    },
    values: {
      borderRadius: '0.5rem',
      fontSizes: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
      },
      spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem',
      },
    },
  },
};

// Create context
interface ThemeContextType {
  theme: Theme;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a provider component
// export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // Initialize with system preference or default to light
//   const [themeMode, setThemeMode] = useState<ThemeMode>('light');
//   const [mounted, setMounted] = useState(false);

  
  
//   useEffect(() => {
//     // Check for system preference and localStorage on client-side
//     const savedTheme = localStorage.getItem('theme') as ThemeMode;
    
//     if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
//       setThemeMode(savedTheme);
//     } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setThemeMode('dark');
//     }
//   }, []);

//   useEffect(() => {
//     // Apply theme CSS variables to document root when theme changes
//     const root = document.documentElement;
//     const currentTheme = themes[themeMode];
    
//     // Apply color variables
//     Object.entries(currentTheme.colors).forEach(([key, value]) => {
//       root.style.setProperty(`--color-${key}`, value);
//     });
    
//     // Apply other theme values
//     root.style.setProperty('--border-radius', currentTheme.values.borderRadius);
    
//     // Apply font sizes
//     Object.entries(currentTheme.values.fontSizes).forEach(([key, value]) => {
//       root.style.setProperty(`--font-size-${key}`, value);
//     });
    
//     // Apply spacing
//     Object.entries(currentTheme.values.spacing).forEach(([key, value]) => {
//       root.style.setProperty(`--spacing-${key}`, value);
//     });
    
//     // Set data attribute for CSS selectors
//     document.documentElement.setAttribute('data-theme', themeMode);
    
//     // Save to localStorage
//     localStorage.setItem('theme', themeMode);
//   }, [themeMode]);

//   const setTheme = (mode: ThemeMode) => {
//     setThemeMode(mode);
//   };

//   const toggleTheme = () => {
//     setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme: themes[themeMode], setTheme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Set theme mode and save to localStorage
  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    if (typeof window !== 'undefined' && mounted) {
      localStorage.setItem('theme', mode);
      applyTheme(mode);
    }
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(themeMode === 'light' ? 'dark' : 'light');
  };

  // Apply theme to document
  const applyTheme = (mode: ThemeMode) => {
    if (typeof window === 'undefined') return; // Guard for SSR
    
    const root = document.documentElement;
    const currentTheme = themes[mode];
    
    // Guard against undefined theme
    if (!currentTheme || !currentTheme.colors || !currentTheme.values) {
      console.warn(`Theme '${mode}' not found or incomplete`);
      return;
    }
    
    // Apply color variables
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
    
    // Apply other theme values
    root.style.setProperty('--border-radius', currentTheme.values.borderRadius);
    
    // Apply font sizes
    Object.entries(currentTheme.values.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    // Apply spacing
    Object.entries(currentTheme.values.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', mode);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as ThemeMode : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setThemeMode(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) { // Only auto-update if user hasn't set a preference
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeMode(newTheme);
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Don't render theme-dependent content until we know the theme
  if (!mounted) {
    return null;
  }

  // Ensure we have a valid theme before rendering
  const currentTheme = themes[themeMode];
  if (!currentTheme) {
    console.error(`Invalid theme mode: ${themeMode}`);
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, toggleTheme }}>
      <div className={`${themeMode}-theme`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};