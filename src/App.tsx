import { useState, useEffect } from 'react'
import { Moon, Sun, Zap } from 'lucide-react'
import { Dashboard } from './components/Dashboard'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme !== null) return savedTheme === 'dark'
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
    root.classList.toggle('dark', isDark)
    if (hasUserPreference) localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark, hasUserPreference])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => { if (!hasUserPreference) setIsDark(e.matches) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [hasUserPreference])

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight">DevTask</span>
                <span className="text-[10px] text-muted-foreground ml-1.5 hidden sm:inline">Flow</span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl hover:bg-accent transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4">
                <Sun className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
                <Moon className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${!isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
              </div>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
