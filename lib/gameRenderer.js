import { MAP, TILE_COLORS, GAME_SETTINGS } from './gameConstants';
import { generatePlayerSprite } from './spriteGenerator';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    console.log('GameRenderer initialized with canvas:', {
      width: canvas.width,
      height: canvas.height
    });
    
    // Test render to verify canvas is working
    this.testRender();
  }

  // Test render to verify canvas is working
  testRender() {
    if (!this.ctx) return;
    
    console.log('Performing test render...');
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw a simple test pattern
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(0, 0, 100, 100);
    
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(100, 0, 100, 100);
    
    this.ctx.fillStyle = '#0000ff';
    this.ctx.fillRect(0, 100, 100, 100);
    
    this.ctx.fillStyle = '#ffff00';
    this.ctx.fillRect(100, 100, 100, 100);
    
    console.log('Test render completed');
  }

  // Calculate responsive canvas size
  static calculateCanvasSize() {
    const maxWidth = Math.min(window.innerWidth - 40, GAME_SETTINGS.MAX_CANVAS_WIDTH);
    const maxHeight = Math.min(window.innerHeight - 200, GAME_SETTINGS.MAX_CANVAS_HEIGHT);
    
    // Keep aspect ratio of 20:16 (map tiles)
    const aspectRatio = GAME_SETTINGS.MAP_WIDTH / GAME_SETTINGS.MAP_HEIGHT;
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width: Math.floor(width), height: Math.floor(height) };
  }

  // Clear the canvas
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw the game map
  drawMap(camera, tileSize) {
    if (!this.ctx) return;
    
    console.log('Drawing map with:', { camera, tileSize, canvasSize: { width: this.canvas.width, height: this.canvas.height } });
    
    for (let row = camera.y; row < camera.y + GAME_SETTINGS.MAP_HEIGHT; row++) {
      for (let col = camera.x; col < camera.x + GAME_SETTINGS.MAP_WIDTH; col++) {
        if (row >= 0 && row < MAP.length && col >= 0 && col < MAP[row].length) {
          const tile = MAP[row][col];
          const x = (col - camera.x) * tileSize;
          const y = (row - camera.y) * tileSize;
          
          // Draw base tile
          this.ctx.fillStyle = TILE_COLORS[tile];
          this.ctx.fillRect(x, y, tileSize, tileSize);
          
          // Add texture based on tile type
          this.drawTileTexture(tile, x, y, tileSize);
        }
      }
    }
  }

  // Draw tile textures
  drawTileTexture(tile, x, y, tileSize) {
    if (!this.ctx) return;
    
    if (tile === 2) { // Grass
      this.ctx.fillStyle = '#7cfc00';
      for (let i = 0; i < 3; i++) {
        const grassX = x + Math.random() * tileSize;
        const grassY = y + Math.random() * tileSize;
        this.ctx.fillRect(grassX, grassY, 2, 2);
      }
    } else if (tile === 3) { // Water
      this.ctx.fillStyle = '#87ceeb';
      this.ctx.fillRect(x + 4, y + 4, tileSize - 8, tileSize - 8);
    }
  }

  // Draw other players
  drawOtherPlayers(otherPlayers, camera, tileSize) {
    if (!this.ctx) return;
    
    Object.values(otherPlayers).forEach(({ x, y, direction, colors }) => {
      const screenX = (x - camera.x) * tileSize;
      const screenY = (y - camera.y) * tileSize;
      
      if (screenX >= -tileSize && screenX < this.canvas.width && 
          screenY >= -tileSize && screenY < this.canvas.height) {
        const sprite = generatePlayerSprite(direction || 0, 0, colors);
        this.ctx.drawImage(sprite, screenX, screenY, tileSize, tileSize);
      }
    });
  }

  // Draw local player
  drawLocalPlayer(playerPos, playerDirection, playerAnimation, playerColors, camera, tileSize) {
    if (!this.ctx) return;
    
    const playerScreenX = (playerPos.x - camera.x) * tileSize;
    const playerScreenY = (playerPos.y - camera.y) * tileSize;
    const playerSprite = generatePlayerSprite(playerDirection, playerAnimation, playerColors);
    this.ctx.drawImage(playerSprite, playerScreenX, playerScreenY, tileSize, tileSize);
  }

  // Main render function
  render(gameState) {
    if (!this.ctx || !this.canvas) {
      console.error('Renderer not properly initialized');
      return;
    }
    
    const {
      otherPlayers,
      playerPos,
      playerDirection,
      playerAnimation,
      playerColors,
      camera
    } = gameState;

    console.log('Rendering game state:', {
      playerPos,
      playerDirection,
      camera,
      canvasSize: { width: this.canvas.width, height: this.canvas.height }
    });

    this.clear();

    // Calculate tile size based on canvas size
    const tileSize = Math.min(this.canvas.width / GAME_SETTINGS.MAP_WIDTH, this.canvas.height / GAME_SETTINGS.MAP_HEIGHT);
    
    console.log('Calculated tile size:', tileSize);

    // Draw map
    this.drawMap(camera, tileSize);

    // Draw other players
    this.drawOtherPlayers(otherPlayers, camera, tileSize);

    // Draw local player
    this.drawLocalPlayer(playerPos, playerDirection, playerAnimation, playerColors, camera, tileSize);
  }
} 