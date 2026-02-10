import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { Providers } from './components/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </Providers>
  </StrictMode>,
)
