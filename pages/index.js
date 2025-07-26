import React from 'react';
import Game from '../components/Game';

export default function Home() {
  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      backgroundColor: '#2d4a3e',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Game />
    </div>
  );
} 