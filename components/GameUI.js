import React from 'react';

const GameUI = ({ 
  sessionInfo, 
  playerPos, 
  playerDirection, 
  canvasSize, 
  onCanvasRef 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '10px',
      padding: '20px',
      backgroundColor: '#2d4a3e',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#90ee90', margin: 0 }}>RPG Adventure</h1>
      
      {/* Session Info */}
      {sessionInfo && (
        <div style={{ 
          color: sessionInfo.type === 'success' ? '#90ee90' : '#87ceeb',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '5px',
          maxWidth: '400px'
        }}>
          <p style={{ margin: 0 }}>{sessionInfo.message}</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
            Session ID: {sessionInfo.sessionId?.substring(0, 8)}...
          </p>
        </div>
      )}
      
      <div style={{ 
        border: '3px solid #8b7355', 
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        <canvas
          ref={onCanvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ display: 'block' }}
        />
      </div>
      
      <div style={{ color: '#90ee90', textAlign: 'center' }}>
        <p>Use WASD or Arrow Keys to move</p>
        <p>Q, E, Z, C for diagonal movement</p>
        <p>Ctrl+C to customize character | Escape to disconnect</p>
        <p>Position: ({playerPos.x}, {playerPos.y}) | Direction: {playerDirection}</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Session saved automatically. Close and reopen to continue where you left off!
        </p>
      </div>
    </div>
  );
};

export default GameUI; 