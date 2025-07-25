import React, { useRef, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TILE_SIZE = 32;
const MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
  [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
  [0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

export default function Game() {
  const canvasRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const channelRef = useRef(null);
  const clientIdRef = useRef(`${Date.now()}-${Math.random()}`);
  const [otherPlayers, setOtherPlayers] = useState({});

  // Subscribe to Supabase Realtime channel for player positions
  useEffect(() => {
    const ch = supabase.channel('game-channel');
    channelRef.current = ch;
    ch.on('broadcast', { event: 'position' }, ({ payload }) => {
      const { id, x, y } = payload;
      if (id === clientIdRef.current) return;
      setOtherPlayers(prev => ({ ...prev, [id]: { x, y } }));
    });
    ch.subscribe();
    return () => { ch.unsubscribe(); };
  }, []);

  // Draw function: include other players
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw map
    for (let row = 0; row < MAP.length; row++) {
      for (let col = 0; col < MAP[row].length; col++) {
        const tile = MAP[row][col];
        ctx.fillStyle = tile === 0 ? '#228B22' : '#8B4513';
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // draw other players
    Object.values(otherPlayers).forEach(({ x, y }) => {
      ctx.fillStyle = 'blue';
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // draw local player
    ctx.fillStyle = 'red';
    ctx.fillRect(playerPos.x * TILE_SIZE, playerPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  };

  // Redraw when positions update
  useEffect(() => { draw(); }, [playerPos, otherPlayers]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPos(pos => {
        let { x, y } = pos;
        if (e.key === 'ArrowUp') y = Math.max(0, y - 1);
        if (e.key === 'ArrowDown') y = Math.min(MAP.length - 1, y + 1);
        if (e.key === 'ArrowLeft') x = Math.max(0, x - 1);
        if (e.key === 'ArrowRight') x = Math.min(MAP[0].length - 1, x + 1);
        if (MAP[y][x] === 1) return pos;
        const newPos = { x, y };
        // Broadcast new position
        channelRef.current.send({
          type: 'broadcast',
          event: 'position',
          payload: { id: clientIdRef.current, x, y },
        });
        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    draw();
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={MAP[0].length * TILE_SIZE}
      height={MAP.length * TILE_SIZE}
      style={{ border: '1px solid black' }}
    />
  );
} 