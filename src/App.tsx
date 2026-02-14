import { useState, useEffect } from 'react'
import { Moon, Sun, CheckSquare } from 'lucide-react'
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
        {/* Minimal Header */}
        <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-xl z-10 transition-colors duration-500">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary rounded-lg p-1.5">
                <CheckSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold tracking-tight">DevTask</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-all duration-200"
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4">
                <Sun
                  className={`absolute inset-0 w-4 h-4 transition-all duration-500 ease-in-out ${
                    isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`absolute inset-0 w-4 h-4 transition-all duration-500 ease-in-out ${
                    !isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-6">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
