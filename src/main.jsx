import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Lazy load the main App component for delayed loading
const App = lazy(() => import('./App.jsx'))

// Anti-fingerprinting: Custom loading component
const AppLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div>Loading application...</div>
  </div>
)

// Function to initialize the app with delayed loading
const initializeApp = () => {
  const container = document.getElementById('app-container')
  if (!container) {
    console.error('Mount point not found')
    return
  }

  const root = createRoot(container)
  root.render(
    <StrictMode>
      <Suspense fallback={<AppLoader />}>
        <App />
      </Suspense>
    </StrictMode>
  )
}

// Anti-fingerprinting: Delay app initialization until user interaction
let appInitialized = false

const delayedInit = () => {
  if (appInitialized) return
  appInitialized = true
  
  // Remove loading text
  const container = document.getElementById('app-container')
  if (container) {
    container.innerHTML = ''
  }
  
  // Initialize the actual app
  initializeApp()
}

// Add event listeners for user interaction
const addInteractionListeners = () => {
  const events = ['click', 'scroll', 'keydown', 'touchstart', 'mousemove']
  
  const handleInteraction = () => {
    events.forEach(event => {
      document.removeEventListener(event, handleInteraction)
    })
    delayedInit()
  }
  
  events.forEach(event => {
    document.addEventListener(event, handleInteraction, { once: true, passive: true })
  })
}

// Initialize interaction listeners after a short delay
setTimeout(() => {
  addInteractionListeners()
  
  // Fallback: auto-initialize after 3 seconds if no interaction
  setTimeout(() => {
    if (!appInitialized) {
      delayedInit()
    }
  }, 3000)
}, 100)
