import { MAP, GAME_SETTINGS } from './gameConstants';

export class GameInput {
  constructor(onMove, onDisconnect, onCustomize) {
    this.onMove = onMove;
    this.onDisconnect = onDisconnect;
    this.onCustomize = onCustomize;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Start listening for input
  start() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  // Stop listening for input
  stop() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // Handle keyboard input
  handleKeyDown(e) {
    // Handle disconnect with Escape key
    if (e.key === 'Escape') {
      this.onDisconnect();
      return;
    }
    
    // Handle customization with 'C' key
    if (e.key === 'c' && e.ctrlKey) {
      this.onCustomize();
      return;
    }

    // Handle movement
    this.handleMovement(e);
  }

  // Handle movement input
  handleMovement(e) {
    let direction = null;
    let moved = false;

    // 8-directional movement
    if (e.key === 'ArrowUp' || e.key === 'w') {
      direction = 4; // Up
      moved = true;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      direction = 0; // Down
      moved = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      direction = 2; // Left
      moved = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      direction = 6; // Right
      moved = true;
    } else if (e.key === 'q') {
      direction = 3; // Up-left
      moved = true;
    } else if (e.key === 'e') {
      direction = 5; // Up-right
      moved = true;
    } else if (e.key === 'z') {
      direction = 1; // Down-left
      moved = true;
    } else if (e.key === 'c') {
      direction = 7; // Down-right
      moved = true;
    }

    if (moved && direction !== null) {
      this.onMove(direction);
    }
  }

  // Calculate new position based on direction
  static calculateNewPosition(currentPos, direction) {
    let { x, y } = currentPos;

    switch (direction) {
      case 0: // Down
        y = Math.min(MAP.length - 1, y + 1);
        break;
      case 1: // Down-left
        x = Math.max(0, x - 1);
        y = Math.min(MAP.length - 1, y + 1);
        break;
      case 2: // Left
        x = Math.max(0, x - 1);
        break;
      case 3: // Up-left
        x = Math.max(0, x - 1);
        y = Math.max(0, y - 1);
        break;
      case 4: // Up
        y = Math.max(0, y - 1);
        break;
      case 5: // Up-right
        x = Math.min(MAP[0].length - 1, x + 1);
        y = Math.max(0, y - 1);
        break;
      case 6: // Right
        x = Math.min(MAP[0].length - 1, x + 1);
        break;
      case 7: // Down-right
        x = Math.min(MAP[0].length - 1, x + 1);
        y = Math.min(MAP.length - 1, y + 1);
        break;
    }

    return { x, y };
  }

  // Check if position is walkable
  static isWalkable(x, y) {
    return MAP[y] && MAP[y][x] !== 0;
  }
} 