import { supabase } from './supabase';

// Session storage key
const SESSION_KEY = 'rpg_game_session_id';

// Generate a unique session ID
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get session ID from localStorage or generate a new one
export const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

// Save session data to Supabase
export const saveSessionData = async (sessionId, playerData) => {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .upsert({
        session_id: sessionId,
        player_id: playerData.id,
        x: playerData.x,
        y: playerData.y,
        direction: playerData.direction,
        last_updated: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving session data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving session data:', error);
    return false;
  }
};

// Load session data from Supabase
export const loadSessionData = async (sessionId) => {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      console.error('Error loading session data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error loading session data:', error);
    return null;
  }
};

// Clear session data
export const clearSessionData = async (sessionId) => {
  try {
    const { error } = await supabase
      .from('game_sessions')
      .delete()
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error clearing session data:', error);
      return false;
    }
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing session data:', error);
    return false;
  }
};

// Check if session is still valid (within last 24 hours)
export const isSessionValid = (lastUpdated) => {
  if (!lastUpdated) return false;
  
  const lastUpdate = new Date(lastUpdated);
  const now = new Date();
  const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
  
  return hoursDiff < 24;
}; 