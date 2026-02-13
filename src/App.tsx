import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Dashboard } from './components/Dashboard'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme !== null) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [hasUserPreference, setHasUserPreference] = useState(
    () => localStorage.getItem('theme') !== null
  )

  const toggleTheme = () => {
    setIsDark(!isDark)
    setHasUserPreference(true)
  }

  // Apply theme to DOM and save to localStorage only if user has set a preference
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    if (hasUserPreference) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }
  }, [isDark, hasUserPreference])

  // Listen to system theme changes when user hasn't set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!hasUserPreference) {
        setIsDark(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [hasUserPreference])

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 ease-in-out">
        <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 transition-colors duration-500 ease-in-out">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <h1 className="text-2xl font-bold font-mono transition-colors duration-500 ease-in-out">DevTask Flow</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Sun
                  className={`absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out ${
                    isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out ${
                    !isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                  }`}
                />
              </div>
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
