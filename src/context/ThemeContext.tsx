/**
 * ThemeContext.tsx
 *
 * Implements React Context API as required by the assignment.
 * Manages UI theme preferences, accessible across all components.
 *
 * Architecture:
 *   - Zustand  →  server/async state (auth, patients, notifications)
 *   - Context  →  UI/client state (theme, preferences, locale)
 *   This mirrors real-world patterns where multiple state tools coexist.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type Density = 'comfortable' | 'compact'
type AccentColor = 'blue' | 'green' | 'purple'

interface ThemeState {
  density: Density
  accentColor: AccentColor
  animationsEnabled: boolean
}

interface ThemeContextType extends ThemeState {
  setDensity: (d: Density) => void
  setAccentColor: (c: AccentColor) => void
  toggleAnimations: () => void
}

const ACCENT_MAP: Record<AccentColor, string> = {
  blue:   '#4f8ef7',
  green:  '#22d3a5',
  purple: '#a78bfa',
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>({
    density: 'comfortable',
    accentColor: 'blue',
    animationsEnabled: true,
  })

  const setDensity = useCallback((density: Density) => {
    setTheme(prev => ({ ...prev, density }))
    document.documentElement.style.setProperty(
      '--spacing-base',
      density === 'compact' ? '14px' : '20px'
    )
  }, [])

  const setAccentColor = useCallback((accentColor: AccentColor) => {
    setTheme(prev => ({ ...prev, accentColor }))
    document.documentElement.style.setProperty('--accent', ACCENT_MAP[accentColor])
  }, [])

  const toggleAnimations = useCallback(() => {
    setTheme(prev => {
      const next = !prev.animationsEnabled
      document.documentElement.style.setProperty('--transition', next ? 'all 0.2s cubic-bezier(0.4,0,0.2,1)' : 'none')
      return { ...prev, animationsEnabled: next }
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ ...theme, setDensity, setAccentColor, toggleAnimations }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
