// contexts/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Theme colors
  const theme = {
    // Background colors
    background: isDark ? '#0f172a' : '#F8F3FF',
    card: isDark ? '#1e293b' : '#fff',
    headerBg: isDark ? '#1e293b' : '#fff',
    
    // Text colors
    text: isDark ? '#f1f5f9' : '#1e293b',
    textSecondary: isDark ? '#cbd5e1' : '#64748b',
    textTertiary: isDark ? '#94a3b8' : '#94a3b8',
    
    // Primary colors
    primary: isDark ? '#A3C4F3' : '#7C83FD',
    primaryLight: isDark ? '#E0D7FF' : '#F8F3FF',
    
    // Border colors
    border: isDark ? '#334155' : '#e2e8f0',
    borderLight: isDark ? '#475569' : '#f1f5f9',
    
    // Status colors
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    
    // Icon colors
    icon: isDark ? '#cbd5e1' : '#7C83FD',
    iconSecondary: isDark ? '#94a3b8' : '#64748b',
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};