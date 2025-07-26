# RPG Adventure Game

A modern 2D top-down RPG game built with Next.js and Supabase for real-time multiplayer functionality.

## Features

### 🎮 Game Mechanics
- **8-Directional Movement**: Full directional control using WASD, arrow keys, and diagonal movement (Q, E, Z, C)
- **Animated Player Sprites**: Programmatically generated character sprites with walking animations
- **Camera System**: Smooth camera following that keeps the player centered
- **Collision Detection**: Proper wall and obstacle collision

### 🗺️ World Design
- **Doubled Map Size**: 40x40 tile world (previously 20x15)
- **RPG Tileset**: Multiple tile types including:
  - Walls (dark green)
  - Paths (brown)
  - Grass (light green with texture)
  - Water (blue with depth effect)
- **Larger Playable Area**: More space to explore and interact

### 🎨 Visual Improvements
- **Pixel-Perfect Rendering**: Crisp, retro-style graphics
- **Dynamic Lighting**: Enhanced visual depth with shadows and highlights
- **Smooth Animations**: 4-frame walking animation cycle
- **Modern UI**: Clean, RPG-style interface with game information

### 🌐 Multiplayer Features
- **Real-time Synchronization**: Player positions sync across all clients
- **Direction Tracking**: Player facing direction is shared
- **Live Updates**: See other players move in real-time
- **Session Management**: Persistent sessions with automatic save/restore
- **Cross-Browser Persistence**: Return to the same position when reopening the game

## Controls

- **WASD** or **Arrow Keys**: Basic movement
- **Q**: Move up-left
- **E**: Move up-right  
- **Z**: Move down-left
- **C**: Move down-right

## Technical Stack

- **Frontend**: Next.js, React
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Graphics**: HTML5 Canvas with programmatic sprite generation
- **Styling**: CSS with pixel-perfect rendering

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Supabase database with the required tables:
   ```sql
   -- Players table for real-time multiplayer
   CREATE TABLE players (
     id TEXT PRIMARY KEY,
     x INTEGER NOT NULL,
     y INTEGER NOT NULL,
     direction INTEGER DEFAULT 0
   );
   
   -- Game sessions table for persistent sessions
   CREATE TABLE game_sessions (
     session_id TEXT PRIMARY KEY,
     player_id TEXT NOT NULL,
     x INTEGER NOT NULL,
     y INTEGER NOT NULL,
     direction INTEGER DEFAULT 0,
     last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. Configure your Supabase credentials in `lib/supabase.js`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Architecture

The game uses a component-based architecture with:
- **Game Component**: Main game logic and rendering
- **Session Manager**: Handles session persistence and restoration
- **Canvas Rendering**: Efficient 2D graphics with camera system
- **State Management**: React hooks for player and world state
- **Real-time Sync**: Supabase subscriptions for multiplayer
- **Local Storage**: Browser-based session ID persistence

## Future Enhancements

- Inventory system
- NPCs and quests
- Combat mechanics
- Sound effects and music
- More tile types and environments
- Character customization 
5. Your live game will be available at `https://your-vercel-app.vercel.app`. 