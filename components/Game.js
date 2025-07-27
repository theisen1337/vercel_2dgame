import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getSessionId, saveSessionData, loadSessionData, isSessionValid } from '../lib/sessionManager';
import { GameRenderer } from '../lib/gameRenderer';
import { GameInput } from '../lib/gameInput';
import { MultiplayerManager } from '../lib/multiplayerManager';
import { DEFAULT_PLAYER_COLORS, GAME_SETTINGS } from '../lib/gameConstants';
import CharacterCustomization from './CharacterCustomization';
import DisconnectScreen from './DisconnectScreen';
import LoadingScreen from './LoadingScreen';
import GameUI from './GameUI';

export default function Game() {
  // Refs
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const inputRef = useRef(null);
  const multiplayerRef = useRef(null);

  // State
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [playerDirection, setPlayerDirection] = useState(0);
  const [playerAnimation, setPlayerAnimation] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState({});
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [playerColors, setPlayerColors] = useState(DEFAULT_PLAYER_COLORS);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 512 });

  // Initialize session and load saved data
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const currentSessionId = getSessionId();
        setSessionId(currentSessionId);
        
        const newClientId = currentSessionId;
        setClientId(newClientId);
        
        const sessionData = await loadSessionData(currentSessionId);
        
        if (sessionData && isSessionValid(sessionData.last_updated)) {
          setPlayerPos({ x: sessionData.x, y: sessionData.y });
          setPlayerDirection(sessionData.direction || 0);
          if (sessionData.colors) {
            setPlayerColors(sessionData.colors);
          }
          setSessionInfo({
            message: 'Welcome back! Your previous position has been restored.',
            type: 'success',
            sessionId: currentSessionId
          });
        } else {
          setSessionInfo({
            message: 'New session started. Welcome to the RPG Adventure!',
            type: 'info',
            sessionId: currentSessionId
          });
        }

        // Persist initial session data
        await saveSessionData(currentSessionId, {
          id: newClientId,
          x: sessionData && isSessionValid(sessionData.last_updated) ? sessionData.x : 1,
          y: sessionData && isSessionValid(sessionData.last_updated) ? sessionData.y : 1,
          direction: sessionData && isSessionValid(sessionData.last_updated) ? sessionData.direction || 0 : 0,
          colors: sessionData && sessionData.colors ? sessionData.colors : DEFAULT_PLAYER_COLORS
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing session:', error);
        setIsLoading(false);
      }
    };
    
    initializeSession();
  }, []);

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const newSize = GameRenderer.calculateCanvasSize();
      setCanvasSize(newSize);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Initialize renderer when loading completes or canvas size changes
  useEffect(() => {
    if (!isLoading && canvasRef.current && canvasSize.width > 0 && canvasSize.height > 0) {
      // Set canvas size
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;
      
      // Initialize renderer if not already
      if (!rendererRef.current) {
        rendererRef.current = new GameRenderer(canvasRef.current);
      }
      
      // Force initial render
      rendererRef.current.render({
        otherPlayers,
        playerPos,
        playerDirection,
        playerAnimation,
        playerColors,
        camera
      });
    }
  }, [canvasSize, isLoading]);

  // Initialize multiplayer when clientId is ready
  useEffect(() => {
    if (clientId && !multiplayerRef.current) {
      multiplayerRef.current = new MultiplayerManager(clientId, setOtherPlayers);
      
      // Initialize player in database
      multiplayerRef.current.initializePlayer({
        x: playerPos.x,
        y: playerPos.y,
        direction: playerDirection,
        colors: playerColors
      });
      
      // Initialize multiplayer
      multiplayerRef.current.initialize();
    }
  }, [clientId]);

  // Update player data in database when position/colors change
  useEffect(() => {
    if (multiplayerRef.current && clientId) {
      multiplayerRef.current.initializePlayer({
        x: playerPos.x,
        y: playerPos.y,
        direction: playerDirection,
        colors: playerColors
      });
    }
  }, [clientId, playerPos, playerDirection, playerColors]);

  // Save session data whenever position changes (backup)
  useEffect(() => {
    if (sessionId && clientId && !isLoading) {
      saveSessionData(sessionId, {
        id: clientId,
        x: playerPos.x,
        y: playerPos.y,
        direction: playerDirection,
        colors: playerColors
      });
    }
  }, [sessionId, clientId, playerPos.x, playerPos.y, playerDirection, playerColors, isLoading]);

  // Initialize input handler
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = new GameInput(
        handleMove,
        handleDisconnect,
        () => setShowCustomization(true)
      );
    }
    
    inputRef.current.start();
    return () => inputRef.current?.stop();
  }, []);

  // Animation loop
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPlayerAnimation(prev => (prev + 1) % 4);
    }, GAME_SETTINGS.ANIMATION_SPEED);

    return () => clearInterval(animationInterval);
  }, []);

  // Update camera to follow player
  useEffect(() => {
    const newCameraX = Math.max(0, Math.min(playerPos.x - 10, 20));
    const newCameraY = Math.max(0, Math.min(playerPos.y - 8, 24));
    setCamera({ x: newCameraX, y: newCameraY });
  }, [playerPos]);

  // Handle movement
  const handleMove = useCallback((direction) => {
    setPlayerPos(pos => {
      const newPos = GameInput.calculateNewPosition(pos, direction);
      
      if (GameInput.isWalkable(newPos.x, newPos.y)) {
        setPlayerDirection(direction);
        
        // Update multiplayer
        multiplayerRef.current?.updatePlayerPosition(newPos.x, newPos.y, direction);
        
        // Save session data with the NEW position
        if (sessionId) {
          saveSessionData(sessionId, {
            id: clientId,
            x: newPos.x,
            y: newPos.y,
            direction,
            colors: playerColors
          });
        }
        
        return newPos;
      }
      return pos;
    });
  }, [sessionId, clientId, playerColors]);

  // Handle character customization save
  const handleCustomizationSave = useCallback(async (newColors) => {
    setPlayerColors(newColors);
    
    // Update multiplayer
    multiplayerRef.current?.updatePlayerColors(newColors);
    
    // Update session data
    if (sessionId) {
      await saveSessionData(sessionId, {
        id: clientId,
        x: playerPos.x,
        y: playerPos.y,
        direction: playerDirection,
        colors: newColors
      });
    }
  }, [sessionId, clientId, playerPos, playerDirection]);

  // Handle disconnect/reconnect
  const handleDisconnect = useCallback(() => {
    setIsDisconnected(true);
    multiplayerRef.current?.removePlayer();
  }, []);

  const handleReconnect = useCallback(async () => {
    setIsDisconnected(false);
    setIsLoading(true);
    
    const currentSessionId = getSessionId();
    const newClientId = currentSessionId;
    setClientId(newClientId);
    
    // Cleanup old multiplayer
    multiplayerRef.current?.cleanup();
    
    // Create new multiplayer manager
    multiplayerRef.current = new MultiplayerManager(newClientId, setOtherPlayers);
    multiplayerRef.current.initializePlayer({
      x: playerPos.x,
      y: playerPos.y,
      direction: playerDirection,
      colors: playerColors
    });
    multiplayerRef.current.initialize();
    
    setIsLoading(false);
  }, [playerPos, playerDirection, playerColors]);

  // Render game when state changes
  useEffect(() => {
    if (!isLoading && rendererRef.current && canvasRef.current) {
      rendererRef.current.render({
        otherPlayers,
        playerPos,
        playerDirection,
        playerAnimation,
        playerColors,
        camera
      });
    }
  }, [otherPlayers, playerPos, playerDirection, playerAnimation, playerColors, camera, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      multiplayerRef.current?.cleanup();
      multiplayerRef.current?.removePlayer();
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <GameUI
        sessionInfo={sessionInfo}
        playerPos={playerPos}
        playerDirection={playerDirection}
        canvasSize={canvasSize}
        onCanvasRef={canvasRef}
      />

      {/* Character Customization Modal */}
      <CharacterCustomization
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        onSave={handleCustomizationSave}
        currentColors={playerColors}
      />

      {/* Disconnect Screen */}
      <DisconnectScreen
        isVisible={isDisconnected}
        onReconnect={handleReconnect}
      />
    </>
  );
} 