import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Dashboard } from './components/Dashboard'

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then fallback to system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme !== null) {
      return savedTheme === 'dark'
    }
    // Use system preference if no saved theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Apply theme to DOM and save to localStorage
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('theme') === null) {
        setIsDark(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <h1 className="text-2xl font-bold font-mono">DevTask Flow</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
