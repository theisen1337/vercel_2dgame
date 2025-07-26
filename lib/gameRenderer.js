import { MAP, TILE_COLORS, GAME_SETTINGS } from './gameConstants';
import { generatePlayerSprite } from './spriteGenerator';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
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
    
    return { width, height };
  }

  // Clear the canvas
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw the game map
  drawMap(camera, tileSize) {
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
    const playerScreenX = (playerPos.x - camera.x) * tileSize;
    const playerScreenY = (playerPos.y - camera.y) * tileSize;
    const playerSprite = generatePlayerSprite(playerDirection, playerAnimation, playerColors);
    this.ctx.drawImage(playerSprite, playerScreenX, playerScreenY, tileSize, tileSize);
  }

  // Main render function
  render(gameState) {
    const {
      otherPlayers,
      playerPos,
      playerDirection,
      playerAnimation,
      playerColors,
      camera
    } = gameState;

    this.clear();

    // Calculate tile size based on canvas size
    const tileSize = Math.min(this.canvas.width / GAME_SETTINGS.MAP_WIDTH, this.canvas.height / GAME_SETTINGS.MAP_HEIGHT);

    // Draw map
    this.drawMap(camera, tileSize);

    // Draw other players
    this.drawOtherPlayers(otherPlayers, camera, tileSize);

    // Draw local player
    this.drawLocalPlayer(playerPos, playerDirection, playerAnimation, playerColors, camera, tileSize);
  }
} 