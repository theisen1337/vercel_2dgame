-- Database setup for RPG Adventure Game
-- Run these commands in your Supabase SQL editor

-- Drop existing tables if they exist (be careful with this in production!)
-- DROP TABLE IF EXISTS game_sessions;
-- DROP TABLE IF EXISTS players;

-- Create players table with direction column, colors, and last activity
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction INTEGER DEFAULT 0,
  skin_color TEXT DEFAULT '#ffdbac',
  hair_color TEXT DEFAULT '#8b4513',
  shirt_color TEXT DEFAULT '#4169e1',
  pants_color TEXT DEFAULT '#2f4f4f',
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_sessions table for persistent sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  session_id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction INTEGER DEFAULT 0,
  skin_color TEXT DEFAULT '#ffdbac',
  hair_color TEXT DEFAULT '#8b4513',
  shirt_color TEXT DEFAULT '#4169e1',
  pants_color TEXT DEFAULT '#2f4f4f',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to existing players table if they don't exist
-- (Uncomment these lines if you need to add the columns to an existing table)
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS direction INTEGER DEFAULT 0;
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS skin_color TEXT DEFAULT '#ffdbac';
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS hair_color TEXT DEFAULT '#8b4513';
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS shirt_color TEXT DEFAULT '#4169e1';
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS pants_color TEXT DEFAULT '#2f4f4f';
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Enable Row Level Security (RLS) for real-time functionality
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on game_sessions" ON game_sessions FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for the players table
ALTER PUBLICATION supabase_realtime ADD TABLE players; 