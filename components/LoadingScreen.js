import React from 'react';

const LoadingScreen = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#2d4a3e',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#90ee90', margin: 0 }}>RPG Adventure</h1>
      <div style={{ color: '#90ee90', textAlign: 'center' }}>
        <p>Loading your session...</p>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid #90ee90', 
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen; 