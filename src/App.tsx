import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function App() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border px-6 py-4">
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
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">Welcome to DevTask Flow</h2>
            <p className="text-muted-foreground text-lg mb-8">
              A modern task management app built for developers
            </p>
            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-4">Setup Instructions</h3>
              <ol className="text-left space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Create a Supabase project</li>
                <li>Run the SQL schema from <code className="bg-muted px-1 rounded">supabase/schema.sql</code></li>
                <li>Update <code className="bg-muted px-1 rounded">.env.local</code> with your credentials</li>
                <li>Run <code className="bg-muted px-1 rounded">npm run dev</code></li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
