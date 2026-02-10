import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Dashboard } from './components/Dashboard'

function App() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

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
