import { SPRITE_SIZE, DEFAULT_PLAYER_COLORS } from './gameConstants';

// Generate player sprite for 8 directions with custom colors
export const generatePlayerSprite = (direction, animationFrame, colors = DEFAULT_PLAYER_COLORS) => {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;
  const ctx = canvas.getContext('2d');

  // Use provided colors or default
  const skinColor = colors.skin || DEFAULT_PLAYER_COLORS.skin;
  const hairColor = colors.hair || DEFAULT_PLAYER_COLORS.hair;
  const shirtColor = colors.shirt || DEFAULT_PLAYER_COLORS.shirt;
  const pantsColor = colors.pants || DEFAULT_PLAYER_COLORS.pants;
  const shoeColor = '#000000';

  // Draw base character
  ctx.fillStyle = skinColor;
  ctx.fillRect(12, 8, 8, 8); // Head

  // Hair
  ctx.fillStyle = hairColor;
  ctx.fillRect(11, 6, 10, 4);

  // Body
  ctx.fillStyle = shirtColor;
  ctx.fillRect(10, 16, 12, 8);

  // Arms based on direction
  if (direction === 0) { // Down
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 1) { // Down-left
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 2) { // Left
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 3) { // Up-left
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 4) { // Up
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 5) { // Up-right
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 6) { // Right
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  } else if (direction === 7) { // Down-right
    ctx.fillRect(6, 18, 4, 6);
    ctx.fillRect(22, 18, 4, 6);
  }

  // Legs with animation
  ctx.fillStyle = pantsColor;
  if (animationFrame === 0 || animationFrame === 2) {
    ctx.fillRect(10, 24, 4, 8);
    ctx.fillRect(18, 24, 4, 8);
  } else {
    ctx.fillRect(8, 24, 4, 8);
    ctx.fillRect(20, 24, 4, 8);
  }

  // Shoes
  ctx.fillStyle = shoeColor;
  if (animationFrame === 0 || animationFrame === 2) {
    ctx.fillRect(10, 32, 4, 2);
    ctx.fillRect(18, 32, 4, 2);
  } else {
    ctx.fillRect(8, 32, 4, 2);
    ctx.fillRect(20, 32, 4, 2);
  }

  return canvas;
}; 