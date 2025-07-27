-- Fix RLS Policies for RPG Game
-- Run this in your Supabase SQL Editor

-- First, disable RLS temporarily to clean up
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow all operations on players" ON players;
DROP POLICY IF EXISTS "Allow all operations on game_sessions" ON game_sessions;

-- Re-enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create new policies that allow all operations
CREATE POLICY "Allow all operations on players" ON players 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on game_sessions" ON game_sessions 
FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for the players table
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('players', 'game_sessions'); 