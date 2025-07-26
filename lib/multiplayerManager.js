import { supabase } from './supabase';
import { GAME_SETTINGS, DEFAULT_PLAYER_COLORS } from './gameConstants';

export class MultiplayerManager {
  constructor(clientId, onPlayersUpdate) {
    this.clientId = clientId;
    this.onPlayersUpdate = onPlayersUpdate;
    this.subscription = null;
  }

  // Initialize multiplayer functionality
  async initialize() {
    await this.fetchExistingPlayers();
    this.setupRealtimeSubscription();
  }

  // Fetch existing players and filter out inactive ones
  async fetchExistingPlayers() {
    console.log('[MultiplayerManager] Fetching existing players');
    const { data } = await supabase.from('players').select('*');
    console.log('[MultiplayerManager] Existing players data:', data);
    const others = {};
    const now = new Date();
    
    data.forEach(rec => {
      if (rec.id !== this.clientId) {
        const lastActivity = new Date(rec.last_activity);
        const timeDiff = (now - lastActivity) / 1000; // seconds
        console.log(
          `[MultiplayerManager] Checking player ${rec.id}, last_activity=${rec.last_activity}, timeDiff=${timeDiff}`
        );
        
        // Only include players active in the last timeout period
        if (timeDiff <= GAME_SETTINGS.INACTIVITY_TIMEOUT) {
          others[rec.id] = this.formatPlayerData(rec);
        }
      }
    });
    
    console.log('[MultiplayerManager] Filtered other players:', others);
    this.onPlayersUpdate(others);
  }

  // Setup realtime subscription
  setupRealtimeSubscription() {
    this.subscription = supabase
      .channel('players-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' }, ({ new: rec }) => {
        this.handlePlayerChange(rec, 'INSERT');
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players' }, ({ new: rec }) => {
        this.handlePlayerChange(rec, 'UPDATE');
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'players' }, ({ old: rec }) => {
        this.handlePlayerRemove(rec.id);
      })
      .subscribe();
  }

  // Handle player changes (insert/update)
  handlePlayerChange(rec, eventType) {
    console.log(
      `[MultiplayerManager] Received ${eventType} for player ${rec.id}`,
      rec
    );
    if (rec.id === this.clientId) return;

    const now = new Date();
    const lastActivity = new Date(rec.last_activity);
    const timeDiff = (now - lastActivity) / 1000;
    
    if (timeDiff <= GAME_SETTINGS.INACTIVITY_TIMEOUT) {
      this.onPlayersUpdate(prev => ({
        ...prev,
        [rec.id]: this.formatPlayerData(rec)
      }));
    } else {
      // Remove inactive player
      this.handlePlayerRemove(rec.id);
    }
  }

  // Handle player removal
  handlePlayerRemove(playerId) {
    this.onPlayersUpdate(prev => {
      const next = { ...prev };
      delete next[playerId];
      return next;
    });
  }

  // Format player data from database record
  formatPlayerData(rec) {
    return {
      x: rec.x,
      y: rec.y,
      direction: rec.direction || 0,
      colors: {
        skin: rec.skin_color || DEFAULT_PLAYER_COLORS.skin,
        hair: rec.hair_color || DEFAULT_PLAYER_COLORS.hair,
        shirt: rec.shirt_color || DEFAULT_PLAYER_COLORS.shirt,
        pants: rec.pants_color || DEFAULT_PLAYER_COLORS.pants
      }
    };
  }

  // Update player position and activity
  async updatePlayerPosition(x, y, direction) {
    if (!this.clientId) return;

    const { error } = await supabase.from('players').upsert({
      id: this.clientId,
      x,
      y,
      direction,
      last_activity: new Date().toISOString()
    });

    if (error) {
      console.error('Error updating player position:', error);
    }
  }

  // Update player colors
  async updatePlayerColors(colors) {
    if (!this.clientId) return;

    const { error } = await supabase.from('players').upsert({
      id: this.clientId,
      skin_color: colors.skin,
      hair_color: colors.hair,
      shirt_color: colors.shirt,
      pants_color: colors.pants,
      last_activity: new Date().toISOString()
    });

    if (error) {
      console.error('Error updating player colors:', error);
    }
  }

  // Initialize player in database
  async initializePlayer(playerData) {
    if (!this.clientId) return;

    const { error } = await supabase.from('players').upsert({
      id: this.clientId,
      x: playerData.x,
      y: playerData.y,
      direction: playerData.direction,
      skin_color: playerData.colors.skin,
      hair_color: playerData.colors.hair,
      shirt_color: playerData.colors.shirt,
      pants_color: playerData.colors.pants,
      last_activity: new Date().toISOString()
    });

    if (error) {
      console.error('Error initializing player:', error);
    }
  }

  // Remove player from database
  async removePlayer() {
    if (!this.clientId) return;

    const { error } = await supabase.from('players').delete().eq('id', this.clientId);
    if (error) {
      console.error('Error removing player:', error);
    }
  }

  // Cleanup subscription
  cleanup() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }
  }
} 