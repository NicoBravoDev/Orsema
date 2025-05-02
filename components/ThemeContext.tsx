// components/ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definición de los colores para cada tema
export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  accent: string;
  border: string;
  inputBg: string;
}

// Temas disponibles
export const lightColors: ThemeColors = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  primary: '#4F46E5',      // Indigo 600
  secondary: '#8B5CF6',    // Violeta 500
  success: '#10B981',      // Emerald 500
  danger: '#EF4444',       // Red 500
  warning: '#F59E0B',      // Amber 500
  accent: '#EC4899',       // Pink 500
  border: '#E5E7EB',       // Gray 200
  inputBg: '#F3F4F6',      // Gray 100
};

export const darkColors: ThemeColors = {
  background: '#111827',   // Gray 900
  card: '#1F2937',         // Gray 800
  text: '#F9FAFB',         // Gray 50
  textSecondary: '#9CA3AF', // Gray 400
  primary: '#6366F1',      // Indigo 500
  secondary: '#A78BFA',    // Violet 400
  success: '#34D399',      // Emerald 400
  danger: '#F87171',       // Red 400
  warning: '#FBBF24',      // Amber 400
  accent: '#F472B6',       // Pink 400
  border: '#374151',       // Gray 700
  inputBg: '#1F2937',      // Gray 800
};

// Interfaz del contexto
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

// Crear el contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? darkColors : lightColors;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};