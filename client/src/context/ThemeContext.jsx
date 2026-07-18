import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const ACCENT_COLORS = {
  purple: { primary: '#8B5CF6', hover: '#7C3AED', cyan: '#06B6D4' },
  blue: { primary: '#3B82F6', hover: '#2563EB', cyan: '#06B6D4' },
  green: { primary: '#10B981', hover: '#059669', cyan: '#34D399' },
  orange: { primary: '#F97316', hover: '#EA580C', cyan: '#FB923C' },
  pink: { primary: '#EC4899', hover: '#DB2777', cyan: '#F472B6' },
  cyan: { primary: '#06B6D4', hover: '#0891B2', cyan: '#22D3EE' },
}

export { ACCENT_COLORS }

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [accent, setAccent] = useState(localStorage.getItem('accent') || 'purple')
  const [uiStyle, setUiStyle] = useState(localStorage.getItem('uiStyle') || 'premium')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const colors = ACCENT_COLORS[accent] || ACCENT_COLORS.purple
    const root = document.documentElement
    root.style.setProperty('--accent-purple', colors.primary)
    root.style.setProperty('--accent-cyan', colors.cyan)
    localStorage.setItem('accent', accent)
  }, [accent])

  useEffect(() => {
    const root = document.documentElement
    // Pehle saari style classes hata do
    root.classList.remove('ui-simple', 'ui-glass', 'ui-premium')
    // Naya style add karo
    root.classList.add(`ui-${uiStyle}`)
    localStorage.setItem('uiStyle', uiStyle)
  }, [uiStyle])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent, uiStyle, setUiStyle, ACCENT_COLORS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export default ThemeContext