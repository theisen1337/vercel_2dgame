import React from 'react';

const DisconnectScreen = ({ onReconnect, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#2d4a3e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      gap: '30px'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '40px',
        borderRadius: '15px',
        border: '3px solid #8b7355',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h1 style={{ color: '#90ee90', marginBottom: '20px' }}>
          Connection Lost
        </h1>
        
        <div style={{ color: '#90ee90', marginBottom: '30px' }}>
          <p>You have been disconnected from the game.</p>
          <p>Your progress has been saved and you can reconnect anytime.</p>
        </div>
        
        <button
          onClick={onReconnect}
          style={{
            padding: '15px 30px',
            backgroundColor: '#90ee90',
            color: '#2d4a3e',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#7cfc00';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#90ee90';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Reconnect to Game
        </button>
        
        <div style={{ 
          color: '#87ceeb', 
          fontSize: '14px', 
          marginTop: '20px',
          fontStyle: 'italic'
        }}>
          <p>Press the button above to rejoin the adventure!</p>
        </div>
      </div>
    </div>
  );
};

export default DisconnectScreen; 