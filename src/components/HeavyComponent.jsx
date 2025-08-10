import React from 'react'

// Example of a "heavy" component that gets loaded dynamically
const HeavyComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>🎯 Advanced Features Loaded!</h3>
      <p>This component was loaded dynamically to avoid fingerprinting.</p>
      <p>It could contain heavy libraries, analytics, or other resources.</p>
      <div style={{ marginTop: '15px' }}>
        <button style={{ 
          padding: '10px 20px', 
          marginRight: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Feature A
        </button>
        <button style={{ 
          padding: '10px 20px', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Feature B
        </button>
      </div>
    </div>
  )
}

export default HeavyComponent
