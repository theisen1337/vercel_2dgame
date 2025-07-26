import React, { useRef, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getSessionId, saveSessionData, loadSessionData, clearSessionData, isSessionValid } from '../lib/sessionManager';

const TILE_SIZE = 32;
const SPRITE_SIZE = 32;

// Doubled map size with RPG-style layout
const MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,1,0],
  [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Tile types: 0=wall, 1=path, 2=grass, 3=water
const TILE_COLORS = {
  0: '#2d4a3e', // Dark green wall
  1: '#8b7355', // Brown path
  2: '#90ee90', // Light green grass
  3: '#4682b4'  // Steel blue water
};

export default function Game() {
  const canvasRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [playerDirection, setPlayerDirection] = useState(0); // 0-7 for 8 directions
  const [playerAnimation, setPlayerAnimation] = useState(0); // 0-3 for animation frames
  const [sessionId, setSessionId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState({});
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);

  // Generate player sprite for 8 directions
  const generatePlayerSprite = (direction, animationFrame) => {
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_SIZE;
    canvas.height = SPRITE_SIZE;
    const ctx = canvas.getContext('2d');

    // Base colors
    const skinColor = '#ffdbac';
    const hairColor = '#8b4513';
    const shirtColor = '#4169e1';
    const pantsColor = '#2f4f4f';
    const shoeColor = '#000000';

    // Draw base character
    ctx.fillStyle = skinColor;
    ctx.fillRect(12, 8, 8, 8); // Head

    // Hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(11, 6, 10, 4);

    // Body
    ctx.fillStyle = shirtColor;
    ctx.fillRect(10, 16, 12, 8);

    // Arms based on direction
    if (direction === 0) { // Down
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 1) { // Down-left
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 2) { // Left
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 3) { // Up-left
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 4) { // Up
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 5) { // Up-right
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 6) { // Right
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    } else if (direction === 7) { // Down-right
      ctx.fillRect(6, 18, 4, 6);
      ctx.fillRect(22, 18, 4, 6);
    }

    // Legs with animation
    ctx.fillStyle = pantsColor;
    if (animationFrame === 0 || animationFrame === 2) {
      ctx.fillRect(10, 24, 4, 8);
      ctx.fillRect(18, 24, 4, 8);
    } else {
      ctx.fillRect(8, 24, 4, 8);
      ctx.fillRect(20, 24, 4, 8);
    }

    // Shoes
    ctx.fillStyle = shoeColor;
    if (animationFrame === 0 || animationFrame === 2) {
      ctx.fillRect(10, 32, 4, 2);
      ctx.fillRect(18, 32, 4, 2);
    } else {
      ctx.fillRect(8, 32, 4, 2);
      ctx.fillRect(20, 32, 4, 2);
    }

    return canvas;
  };

  // Initialize session and load saved data
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Get or create session ID
        const currentSessionId = getSessionId();
        setSessionId(currentSessionId);
        
        // Generate client ID for this session
        const newClientId = `${currentSessionId}-${Date.now()}`;
        setClientId(newClientId);
        
        // Try to load existing session data
        const sessionData = await loadSessionData(currentSessionId);
        
        if (sessionData && isSessionValid(sessionData.last_updated)) {
          // Restore player position and direction from saved session
          setPlayerPos({ x: sessionData.x, y: sessionData.y });
          setPlayerDirection(sessionData.direction || 0);
          setSessionInfo({
            message: 'Welcome back! Your previous position has been restored.',
            type: 'success'
          });
        } else {
          // New session or expired session
          setSessionInfo({
            message: 'New session started. Welcome to the RPG Adventure!',
            type: 'info'
          });
        }
        
        // Initialize player in database
        const { data, error } = await supabase.from('players').upsert({ 
          id: newClientId, 
          x: playerPos.x, 
          y: playerPos.y,
          direction: playerDirection 
        });
        
        if (error) {
          console.error('Error initializing player:', error);
        }
        
        // Save session data
        await saveSessionData(currentSessionId, {
          id: newClientId,
          x: playerPos.x,
          y: playerPos.y,
          direction: playerDirection
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing session:', error);
        setIsLoading(false);
      }
    };
    
    initializeSession();
  }, []);

  // Multiplayer functionality - fetch and subscribe to other players
  useEffect(() => {
    if (!clientId) return;
    
    // Fetch existing players
    supabase.from('players').select('*').then(({ data }) => {
      const others = {};
      data.forEach(rec => {
        if (rec.id !== clientId) others[rec.id] = { 
          x: rec.x, 
          y: rec.y, 
          direction: rec.direction || 0 
        };
      });
      setOtherPlayers(others);
    });

    // Subscribe to table changes
    const subscription = supabase
      .channel('players-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' }, ({ new: rec }) => {
        if (rec.id !== clientId) setOtherPlayers(prev => ({ 
          ...prev, 
          [rec.id]: { x: rec.x, y: rec.y, direction: rec.direction || 0 } 
        }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players' }, ({ new: rec }) => {
        if (rec.id !== clientId) setOtherPlayers(prev => ({ 
          ...prev, 
          [rec.id]: { x: rec.x, y: rec.y, direction: rec.direction || 0 } 
        }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'players' }, ({ old: rec }) => {
        setOtherPlayers(prev => { const next = { ...prev }; delete next[rec.id]; return next; });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      // Remove our record on exit
      if (clientId) {
        supabase.from('players').delete().eq('id', clientId);
      }
    };
  }, [clientId]);

  // Animation loop
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPlayerAnimation(prev => (prev + 1) % 4);
    }, 200);

    return () => clearInterval(animationInterval);
  }, []);

  // Update camera to follow player
  useEffect(() => {
    const newCameraX = Math.max(0, Math.min(playerPos.x - 10, MAP[0].length - 20));
    const newCameraY = Math.max(0, Math.min(playerPos.y - 8, MAP.length - 16));
    setCamera({ x: newCameraX, y: newCameraY });
  }, [playerPos]);

  // Draw function with improved graphics
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map with camera offset
    for (let row = camera.y; row < camera.y + 16; row++) {
      for (let col = camera.x; col < camera.x + 20; col++) {
        if (row >= 0 && row < MAP.length && col >= 0 && col < MAP[row].length) {
          const tile = MAP[row][col];
          const x = (col - camera.x) * TILE_SIZE;
          const y = (row - camera.y) * TILE_SIZE;
          
          // Draw base tile
          ctx.fillStyle = TILE_COLORS[tile];
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          
          // Add texture based on tile type
          if (tile === 2) { // Grass
            ctx.fillStyle = '#7cfc00';
            for (let i = 0; i < 3; i++) {
              const grassX = x + Math.random() * TILE_SIZE;
              const grassY = y + Math.random() * TILE_SIZE;
              ctx.fillRect(grassX, grassY, 2, 2);
            }
          } else if (tile === 3) { // Water
            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          }
        }
      }
    }

    // Draw other players
    Object.values(otherPlayers).forEach(({ x, y, direction }) => {
      const screenX = (x - camera.x) * TILE_SIZE;
      const screenY = (y - camera.y) * TILE_SIZE;
      
      if (screenX >= -TILE_SIZE && screenX < canvas.width && 
          screenY >= -TILE_SIZE && screenY < canvas.height) {
        const sprite = generatePlayerSprite(direction || 0, 0);
        ctx.drawImage(sprite, screenX, screenY);
      }
    });

    // Draw local player
    const playerScreenX = (playerPos.x - camera.x) * TILE_SIZE;
    const playerScreenY = (playerPos.y - camera.y) * TILE_SIZE;
    const playerSprite = generatePlayerSprite(playerDirection, playerAnimation);
    ctx.drawImage(playerSprite, playerScreenX, playerScreenY);
  };

  // Redraw when positions update
  useEffect(() => { draw(); }, [playerPos, otherPlayers, playerDirection, playerAnimation, camera]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPos(pos => {
        let { x, y } = pos;
        let newDirection = playerDirection;
        let moved = false;

        // 8-directional movement
        if (e.key === 'ArrowUp' || e.key === 'w') {
          y = Math.max(0, y - 1);
          newDirection = 4; // Up
          moved = true;
        }
        if (e.key === 'ArrowDown' || e.key === 's') {
          y = Math.min(MAP.length - 1, y + 1);
          newDirection = 0; // Down
          moved = true;
        }
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          x = Math.max(0, x - 1);
          newDirection = 2; // Left
          moved = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd') {
          x = Math.min(MAP[0].length - 1, x + 1);
          newDirection = 6; // Right
          moved = true;
        }

        // Diagonal movement
        if (e.key === 'q') {
          x = Math.max(0, x - 1);
          y = Math.max(0, y - 1);
          newDirection = 3; // Up-left
          moved = true;
        }
        if (e.key === 'e') {
          x = Math.min(MAP[0].length - 1, x + 1);
          y = Math.max(0, y - 1);
          newDirection = 5; // Up-right
          moved = true;
        }
        if (e.key === 'z') {
          x = Math.max(0, x - 1);
          y = Math.min(MAP.length - 1, y + 1);
          newDirection = 1; // Down-left
          moved = true;
        }
        if (e.key === 'c') {
          x = Math.min(MAP[0].length - 1, x + 1);
          y = Math.min(MAP.length - 1, y + 1);
          newDirection = 7; // Down-right
          moved = true;
        }

        // Check if new position is walkable
        if (MAP[y][x] !== 0) {
          if (moved) {
            setPlayerDirection(newDirection);
            // Update position in DB
            supabase.from('players').upsert({ 
              id: clientId, 
              x, 
              y, 
              direction: newDirection 
            }).then(({ data, error }) => {
              if (error) console.error('Supabase move upsert error:', error);
            });
            
            // Save session data
            if (sessionId) {
              saveSessionData(sessionId, {
                id: clientId,
                x,
                y,
                direction: newDirection
              });
            }
          }
          return { x, y };
        }
        return pos;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    draw();
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [playerDirection]);

  if (isLoading) {
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
  }

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
            Session ID: {sessionId?.substring(0, 8)}...
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
          ref={canvasRef}
          width={20 * TILE_SIZE}
          height={16 * TILE_SIZE}
          style={{ display: 'block' }}
        />
      </div>
      <div style={{ color: '#90ee90', textAlign: 'center' }}>
        <p>Use WASD or Arrow Keys to move</p>
        <p>Q, E, Z, C for diagonal movement</p>
        <p>Position: ({playerPos.x}, {playerPos.y}) | Direction: {playerDirection}</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Session saved automatically. Close and reopen to continue where you left off!
        </p>
      </div>
    </div>
  );
} 