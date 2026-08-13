// ============================================================
// mst2.js - توابع کمکی با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function mulberry32(a) {
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function reseed(seed) {
  currentSeed = seed;
  rand = mulberry32(seed);
  seedDisplay.textContent = seed;
}

function randomInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function randomFloat(min, max) { return rand() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

function setPixel(x, y, color) {
  if (x >= 0 && x < GRID_W && y >= 0 && y < GRID_H) {
    const idx = y * GRID_W + x;
    if (idx >= 0 && idx < pixelData.length) pixelData[idx] = color;
  }
}

function render() {
  const ps = PIXEL_SIZE;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const color = pixelData[y * GRID_W + x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * ps, y * ps, ps, ps);
      }
    }
  }
}

function drawLine(x1, y1, x2, y2, color) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i++) {
    const t = steps > 0 ? i / steps : 0;
    const px = Math.round(x1 + (x2 - x1) * t);
    const py = Math.round(y1 + (y2 - y1) * t);
    if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) setPixel(px, py, color);
  }
}

function drawCircle(x, y, r, color, fill = false) {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const dist = dx*dx + dy*dy;
      if (fill ? dist <= r*r : Math.abs(dist - r*r) <= r) {
        const px = x + dx, py = y + dy;
        if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) {
          if (fill || (dx*dx + dy*dy >= (r-1)*(r-1) && dx*dx + dy*dy <= (r+1)*(r+1))) {
            setPixel(px, py, color);
          }
        }
      }
    }
  }
}

function fillCircle(x, y, r, color) { drawCircle(x, y, r, color, true); }