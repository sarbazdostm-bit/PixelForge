// ============================================================
// mst5.js - الگوریتم‌های فراکتال (۵ نوع) - با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function generateFractalTree(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const startX = GRID_W / 2, startY = GRID_H - s(6);
  const length = randomInt(s(40), s(84));
  const angle = -Math.PI / 2;
  const depth = randomInt(5, 8);
  const branchAngle = randomFloat(0.3, 0.9);
  const shrink = randomFloat(0.65, 0.85);
  function drawBranch(x, y, len, ang, dep) {
    if (dep < 0 || len < 1) return;
    const endX = x + Math.cos(ang) * len, endY = y + Math.sin(ang) * len;
    const col = pick(palette);
    for (let i = -1; i <= 1; i++) {
      const px = x + i * Math.cos(ang + Math.PI / 2) * 0.5;
      const py = y + i * Math.sin(ang + Math.PI / 2) * 0.5;
      const ex = endX + i * Math.cos(ang + Math.PI / 2) * 0.5;
      const ey = endY + i * Math.sin(ang + Math.PI / 2) * 0.5;
      drawLine(px, py, ex, ey, col);
    }
    const nextLen = len * shrink;
    const branches = randomInt(2, 3);
    for (let b = 0; b < branches; b++) {
      const offset = (b - (branches - 1) / 2) * branchAngle * randomFloat(0.7, 1.3);
      drawBranch(endX, endY, nextLen, ang + offset, dep - 1);
    }
    if (rand() < 0.3) drawBranch(endX, endY, nextLen * 0.8, ang, dep - 1);
  }
  drawBranch(startX, startY, length, angle, depth);
}

function generateFractalPitie(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const startX = GRID_W / 2, startY = GRID_H - s(6);
  const length = randomInt(s(30), s(60));
  const angle = -Math.PI / 2;
  const depth = randomInt(4, 6);
  const branchAngle = randomFloat(0.5, 1.2);
  const shrink = randomFloat(0.7, 0.9);
  function drawBranch(x, y, len, ang, dep) {
    if (dep < 0 || len < 1) return;
    const endX = x + Math.cos(ang) * len, endY = y + Math.sin(ang) * len;
    const col = pick(palette);
    for (let i = -1; i <= 1; i++) {
      const px = x + i * Math.cos(ang + Math.PI / 2) * 0.7;
      const py = y + i * Math.sin(ang + Math.PI / 2) * 0.7;
      const ex = endX + i * Math.cos(ang + Math.PI / 2) * 0.7;
      const ey = endY + i * Math.sin(ang + Math.PI / 2) * 0.7;
      drawLine(px, py, ex, ey, col);
    }
    const nextLen = len * shrink;
    const branches = randomInt(2, 4);
    for (let b = 0; b < branches; b++) {
      const offset = (b - (branches - 1) / 2) * branchAngle * randomFloat(0.8, 1.2);
      drawBranch(endX, endY, nextLen, ang + offset, dep - 1);
    }
  }
  drawBranch(startX, startY, length, angle, depth);
}

function generateFractalKoch(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const cx = GRID_W / 2, cy = GRID_H / 2;
  const size = randomInt(s(60), s(120));
  const depth = randomInt(3, 5);
  function kochLine(x1, y1, x2, y2, dep, col) {
    if (dep === 0) { drawLine(x1, y1, x2, y2, col); return; }
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const third = len / 3;
    const ang = Math.atan2(dy, dx);
    const p1x = x1 + dx / 3, p1y = y1 + dy / 3;
    const p2x = x1 + dx * 2 / 3, p2y = y1 + dy * 2 / 3;
    const px = p1x + third * Math.cos(ang - Math.PI / 3);
    const py = p1y + third * Math.sin(ang - Math.PI / 3);
    kochLine(x1, y1, p1x, p1y, dep - 1, col);
    kochLine(p1x, p1y, px, py, dep - 1, col);
    kochLine(px, py, p2x, p2y, dep - 1, col);
    kochLine(p2x, p2y, x2, y2, dep - 1, col);
  }
  const col = pick(palette);
  const pts = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * 2 * Math.PI - Math.PI / 2;
    pts.push({ x: cx + size * Math.cos(a), y: cy + size * Math.sin(a) });
  }
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3;
    kochLine(pts[i].x, pts[i].y, pts[j].x, pts[j].y, depth, col);
  }
}

function generateFractalSierpinski(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const cx = GRID_W / 2, cy = GRID_H / 2 + s(10);
  const size = randomInt(s(100), s(160));
  const depth = randomInt(5, 7);
  function fillTriangle(x, y, sz, color) {
    const x1 = x, y1 = y - sz, x2 = x - sz, y2 = y + sz, x3 = x + sz, y3 = y + sz;
    const minX = Math.max(0, Math.floor(Math.min(x1, x2, x3)));
    const maxX = Math.min(GRID_W - 1, Math.ceil(Math.max(x1, x2, x3)));
    const minY = Math.max(0, Math.floor(Math.min(y1, y2, y3)));
    const maxY = Math.min(GRID_H - 1, Math.ceil(Math.max(y1, y2, y3)));
    for (let yPos = minY; yPos <= maxY; yPos++) {
      let intersections = [];
      const edges = [[x1, y1, x2, y2], [x2, y2, x3, y3], [x3, y3, x1, y1]];
      for (let e = 0; e < edges.length; e++) {
        const [x1e, y1e, x2e, y2e] = edges[e];
        if ((y1e <= yPos && y2e > yPos) || (y2e <= yPos && y1e > yPos)) {
          const xPos = x1e + (yPos - y1e) * (x2e - x1e) / (y2e - y1e);
          intersections.push(xPos);
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i < intersections.length - 1; i += 2) {
        const x1i = Math.max(0, Math.floor(intersections[i]));
        const x2i = Math.min(GRID_W - 1, Math.ceil(intersections[i + 1]));
        for (let xPos = x1i; xPos <= x2i; xPos++) setPixel(xPos, yPos, color);
      }
    }
  }
  function sierpinski(x, y, sz, dep) {
    if (dep === 0) { fillTriangle(x, y, sz, pick(palette)); return; }
    const half = sz / 2;
    sierpinski(x, y - half, half, dep - 1);
    sierpinski(x - half, y + half, half, dep - 1);
    sierpinski(x + half, y + half, half, dep - 1);
  }
  sierpinski(cx, cy, size, depth);
}

function generateFractalCombined(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const numFractals = randomInt(2, 4);
  const types = [];
  const fractalTypes = ['tree', 'circle', 'spiral', 'sierpinski', 'koch'];
  for (let i = 0; i < numFractals; i++) {
    const type = fractalTypes[randomInt(0, fractalTypes.length - 1)];
    if (!types.includes(type)) types.push(type);
  }
  if (types.length === 1) {
    const newType = fractalTypes[randomInt(0, fractalTypes.length - 1)];
    if (!types.includes(newType)) types.push(newType);
  }
  function drawTree(x, y, len, ang, dep, color) {
    if (dep === 0 || len < 2) return;
    const endX = x + Math.cos(ang) * len, endY = y + Math.sin(ang) * len;
    drawLine(Math.round(x), Math.round(y), Math.round(endX), Math.round(endY), color);
    const nextLen = len * 0.7;
    drawTree(endX, endY, nextLen, ang - 0.5, dep - 1, color);
    drawTree(endX, endY, nextLen, ang + 0.5, dep - 1, color);
  }
  function drawCircleFractal(x, y, r, dep, color) {
    if (dep === 0 || r < s(5)) { drawCircle(x, y, r, color); return; }
    drawCircle(x, y, r, color);
    const nextR = r * 0.5;
    drawCircleFractal(x - r, y, nextR, dep - 1, color);
    drawCircleFractal(x + r, y, nextR, dep - 1, color);
    drawCircleFractal(x, y - r, nextR, dep - 1, color);
    drawCircleFractal(x, y + r, nextR, dep - 1, color);
  }
  function drawSpiral(x, y, radius, ang, dep, color) {
    if (dep === 0 || radius < s(3)) return;
    const steps = s(30);
    let lastX = x, lastY = y;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const currentAngle = ang + t * 1.5;
      const currentRadius = radius * (1 - t * 0.1);
      const px = Math.round(x + Math.cos(currentAngle) * currentRadius);
      const py = Math.round(y + Math.sin(currentAngle) * currentRadius);
      if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) {
        drawLine(lastX, lastY, px, py, color);
        lastX = px; lastY = py;
      }
    }
    const nextR = radius * 0.7;
    const endX = x + Math.cos(ang + 1.5) * radius * 0.7;
    const endY = y + Math.sin(ang + 1.5) * radius * 0.7;
    drawSpiral(endX, endY, nextR, ang + 1.5, dep - 1, color);
    drawSpiral(endX, endY, nextR, ang - 0.5, dep - 1, color);
  }
  function drawSierpinski(x, y, sz, dep, color) {
    if (dep === 0 || sz < s(5)) {
      const x1 = x, y1 = y - sz, x2 = x - sz, y2 = y + sz, x3 = x + sz, y3 = y + sz;
      const edges = [[x1, y1, x2, y2], [x2, y2, x3, y3], [x3, y3, x1, y1]];
      for (let e = 0; e < edges.length; e++) {
        const [x1e, y1e, x2e, y2e] = edges[e];
        const steps = Math.max(Math.abs(x2e - x1e), Math.abs(y2e - y1e));
        for (let step = 0; step <= steps; step++) {
          const t = steps > 0 ? step / steps : 0;
          const px = Math.round(x1e + (x2e - x1e) * t), py = Math.round(y1e + (y2e - y1e) * t);
          if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) setPixel(px, py, color);
        }
      }
      return;
    }
    const half = sz / 2;
    drawSierpinski(x, y - half, half, dep - 1, color);
    drawSierpinski(x - half, y + half, half, dep - 1, color);
    drawSierpinski(x + half, y + half, half, dep - 1, color);
  }
  function drawKoch(x1, y1, x2, y2, dep, color) {
    if (dep === 0) { drawLine(Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2), color); return; }
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const third = len / 3;
    const ang = Math.atan2(dy, dx);
    const p1x = x1 + dx / 3, p1y = y1 + dy / 3;
    const p2x = x1 + dx * 2 / 3, p2y = y1 + dy * 2 / 3;
    const px = p1x + third * Math.cos(ang - Math.PI / 3);
    const py = p1y + third * Math.sin(ang - Math.PI / 3);
    drawKoch(x1, y1, p1x, p1y, dep - 1, color);
    drawKoch(p1x, p1y, px, py, dep - 1, color);
    drawKoch(px, py, p2x, p2y, dep - 1, color);
    drawKoch(p2x, p2y, x2, y2, dep - 1, color);
  }

  const cols = Math.ceil(Math.sqrt(types.length));
  const rows = Math.ceil(types.length / cols);
  const cellWidth = GRID_W / cols;
  const cellHeight = GRID_H / rows;
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const col = i % cols, row = Math.floor(i / cols);
    const cx = col * cellWidth + cellWidth / 2;
    const cy = row * cellHeight + cellHeight / 2;
    const size = Math.min(cellWidth, cellHeight) * 0.35;
    const color = pick(palette);
    const depth = randomInt(4, 6);
    switch (type) {
      case 'tree': drawTree(cx, cy + size * 0.3, size * 1.8, -Math.PI / 2, depth, color); break;
      case 'circle': drawCircleFractal(cx, cy, size * 0.6, depth, color); break;
      case 'spiral': drawSpiral(cx, cy, size * 0.8, 0, depth, color); break;
      case 'sierpinski': drawSierpinski(cx, cy, size * 0.7, depth, color); break;
      case 'koch':
        const pts = [];
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * 2 * Math.PI - Math.PI / 2;
          pts.push({ x: cx + size * 0.7 * Math.cos(a), y: cy + size * 0.7 * Math.sin(a) });
        }
        for (let i = 0; i < 3; i++) {
          const j = (i + 1) % 3;
          drawKoch(pts[i].x, pts[i].y, pts[j].x, pts[j].y, depth, color);
        }
        break;
    }
  }
}