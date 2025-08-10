import React, { useEffect, useState } from 'react'
import { clientSideBotDetection } from '../utils/botDetection'

const AntiFingerprint = () => {
  const [isSecure, setIsSecure] = useState(false)
  const [botCheck, setBotCheck] = useState(null)

  useEffect(() => {
    // Perform client-side bot detection
    const detection = clientSideBotDetection()
    setBotCheck(detection)
    
    // Only proceed if not detected as bot
    if (!detection.isLikelyBot) {
      setIsSecure(true)
      
      // Additional obfuscation techniques
      const obfuscateConsole = () => {
        const noop = () => {}
        if (typeof window !== 'undefined') {
          window.console.clear = noop
          window.console.log = noop
          window.console.info = noop
          window.console.warn = noop
        }
      }
      
      // Disable common inspection methods
      const disableInspection = () => {
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault())
        
        // Disable common keyboard shortcuts
        document.addEventListener('keydown', (e) => {
          // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C
          if (e.key === 'F12' || 
              (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
              (e.ctrlKey && e.key === 'u')) {
            e.preventDefault()
            return false
          }
        })
      }
      
      // Only apply these measures for real users
      setTimeout(() => {
        obfuscateConsole()
        disableInspection()
      }, 1000)
    }
    
    // Anti-debugging measures
    const detectDevTools = () => {
      let devtools = false
      const detectDevToolsOpen = () => {
        const threshold = 160
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          devtools = true
        }
      }
      
      setInterval(detectDevToolsOpen, 500)
      return devtools
    }
    
    detectDevTools()
    
  }, [])

  // Don't render anything suspicious if bot detected
  if (botCheck?.isLikelyBot) {
    return (
      <div style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
        <p>Standard web page loaded successfully.</p>
      </div>
    )
  }

  return isSecure ? (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      fontSize: '10px', 
      color: '#999',
      background: 'rgba(240,240,240,0.8)',
      padding: '5px',
      borderRadius: '3px'
    }}>
      🔒 Secure Mode Active
    </div>
  ) : null
}

export default AntiFingerprint
