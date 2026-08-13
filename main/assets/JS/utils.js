// ============================================================
// utils.js - توابع کمکی مشترک و بهینه‌شده (بدون تغییر)
// ============================================================
'use strict';

const colorCache = new Map();

function getRGB(color) {
  if (colorCache.has(color)) return colorCache.get(color);
  const temp = document.createElement('div');
  temp.style.color = color;
  temp.style.display = 'none';
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  const rgb = computed.match(/\d+/g);
  if (rgb) {
    const result = rgb.map(Number);
    colorCache.set(color, result);
    return result;
  }
  return [0, 0, 0];
}

function drawLineFast(x1, y1, x2, y2, color) {
  const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    if (x1 >= 0 && x1 < GRID_SIZE && y1 >= 0 && y1 < GRID_SIZE) setPixel(x1, y1, color);
    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x1 += sx; }
    if (e2 < dx) { err += dx; y1 += sy; }
  }
}

function drawCircleFast(cx, cy, r, color, fill = false) {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const dist = x*x + y*y;
      if (fill ? dist <= r*r : Math.abs(dist - r*r) <= r) {
        const px = cx + x, py = cy + y;
        if (px >= 0 && px < GRID_SIZE && py >= 0 && py < GRID_SIZE) {
          if (fill || (dist >= (r-1)*(r-1) && dist <= (r+1)*(r+1))) {
            setPixel(px, py, color);
          }
        }
      }
    }
  }
}

function fillCircleFast(cx, cy, r, color) {
  drawCircleFast(cx, cy, r, color, true);
}