'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme as useNextTheme,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  
  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dusk' ? 'day' : 'dusk');
  }, [theme, setTheme]);
  
  return {
    theme: theme as 'day' | 'dusk' | undefined,
    setTheme,
    toggleTheme,
    isDusk: resolvedTheme === 'dusk',
    isDay: resolvedTheme === 'day',
  };
}
