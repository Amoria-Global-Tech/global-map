'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  mounted: boolean;
}

const defaultContext: ThemeContextType = {
  theme: 'dark',
  resolvedTheme: 'dark',
  toggleTheme: () => {},
  mounted: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
