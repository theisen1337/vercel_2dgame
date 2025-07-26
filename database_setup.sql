-- Database setup for RPG Adventure Game
-- Run these commands in your Supabase SQL editor

-- Drop existing tables if they exist (be careful with this in production!)
-- DROP TABLE IF EXISTS game_sessions;
-- DROP TABLE IF EXISTS players;

-- Create players table with direction column
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction INTEGER DEFAULT 0
);

-- Create game_sessions table for persistent sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  session_id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add direction column to existing players table if it doesn't exist
-- (Uncomment the line below if you need to add the direction column to an existing table)
-- ALTER TABLE players ADD COLUMN IF NOT EXISTS direction INTEGER DEFAULT 0;

-- Enable Row Level Security (RLS) for real-time functionality
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_sessions" ON game_sessions FOR ALL USING (true); 