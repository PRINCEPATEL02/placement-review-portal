import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Import global styles
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
