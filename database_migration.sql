-- Migration script to add missing columns to existing players table
-- Run this in your Supabase SQL editor to fix the PGRST204 error

-- Add direction column if it doesn't exist
ALTER TABLE players ADD COLUMN IF NOT EXISTS direction INTEGER DEFAULT 0;

-- Add color columns if they don't exist
ALTER TABLE players ADD COLUMN IF NOT EXISTS skin_color TEXT DEFAULT '#ffdbac';
ALTER TABLE players ADD COLUMN IF NOT EXISTS hair_color TEXT DEFAULT '#8b4513';
ALTER TABLE players ADD COLUMN IF NOT EXISTS shirt_color TEXT DEFAULT '#4169e1';
ALTER TABLE players ADD COLUMN IF NOT EXISTS pants_color TEXT DEFAULT '#2f4f4f';

-- Add last_activity column if it doesn't exist
ALTER TABLE players ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have default values
UPDATE players SET 
  direction = COALESCE(direction, 0),
  skin_color = COALESCE(skin_color, '#ffdbac'),
  hair_color = COALESCE(hair_color, '#8b4513'),
  shirt_color = COALESCE(shirt_color, '#4169e1'),
  pants_color = COALESCE(pants_color, '#2f4f4f'),
  last_activity = COALESCE(last_activity, NOW())
WHERE direction IS NULL 
   OR skin_color IS NULL 
   OR hair_color IS NULL 
   OR shirt_color IS NULL 
   OR pants_color IS NULL 
   OR last_activity IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position; 