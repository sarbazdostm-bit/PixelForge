// ============================================================
// mst11.js - هندسه مقدس (تصادفی)
// ============================================================

'use strict';

// ========== توابع کمکی ==========
function drawThickCircle(cx, cy, r, color, thickness = 1) {
  for (let angle = 0; angle < 360; angle += 0.5) {
    const rad = angle * Math.PI / 180;
    for (let d = -thickness; d <= thickness; d++) {
      const px = Math.round(cx + (r + d) * Math.cos(rad));
      const py = Math.round(cy + (r + d) * Math.sin(rad));
      if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) {
        setPixel(px, py, color);
      }
    }
  }
}

function drawRegularPolygon(cx, cy, r, sides, color, thickness = 1, rotation = 0) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI + rotation;
    pts.push({
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle))
    });
  }
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    drawLine(pts[i].x, pts[i].y, pts[j].x, pts[j].y, color);
    for (let t = -thickness; t <= thickness; t++) {
      if (t === 0) continue;
      const px1 = pts[i].x + t;
      const py1 = pts[i].y + t;
      const px2 = pts[j].x + t;
      const py2 = pts[j].y + t;
      drawLine(px1, py1, px2, py2, color);
    }
  }
  return pts;
}

function getPointOnCircle(cx, cy, r, angle) {
  return {
    x: Math.round(cx + r * Math.cos(angle)),
    y: Math.round(cy + r * Math.sin(angle))
  };
}

// ============================================================
// ۱. دانه زندگی تصادفی
// ============================================================
function generateSacredSeed(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const radius = randomInt(s(10), Math.min(maxR * 0.4, s(60)));
  const spacing = radius;
  const color = pick(palette);
  const thickness = randomInt(1, 3);
  const numCircles = randomInt(4, 7);
  
  drawThickCircle(cx, cy, radius, color, thickness);
  for (let i = 0; i < numCircles; i++) {
    const angle = (i / numCircles) * 2 * Math.PI + randomFloat(0, 0.5);
    const x = cx + spacing * Math.cos(angle);
    const y = cy + spacing * Math.sin(angle);
    drawThickCircle(x, y, radius * randomFloat(0.7, 1.0), pick(palette), thickness);
  }
  
  const dotColor = pick(palette);
  for (let i = 0; i < numCircles; i++) {
    const angle = (i / numCircles) * 2 * Math.PI + randomFloat(0, 0.5);
    const x = Math.round(cx + spacing * Math.cos(angle));
    const y = Math.round(cy + spacing * Math.sin(angle));
    fillCircle(x, y, Math.max(1, s(3)), dotColor);
  }
  fillCircle(Math.round(cx), Math.round(cy), Math.max(1, s(3)), dotColor);
}

// ============================================================
// ۲. گل زندگی تصادفی
// ============================================================
function generateSacredFlower(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const radius = randomInt(s(8), Math.min(maxR * 0.3, s(50)));
  const spacing = radius;
  const color = pick(palette);
  const thickness = randomInt(1, 2);
  const layers = randomInt(2, 4);
  
  const centers = [{x: cx, y: cy}];
  
  for (let layer = 0; layer < layers; layer++) {
    const count = 6 * (layer + 1);
    const dist = spacing * (layer + 1);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + randomFloat(0, 0.3);
      const x = cx + dist * Math.cos(angle);
      const y = cy + dist * Math.sin(angle);
      let tooClose = false;
      for (const c of centers) {
        const d = Math.sqrt((c.x - x) ** 2 + (c.y - y) ** 2);
        if (d < spacing * 0.3) { tooClose = true; break; }
      }
      if (!tooClose && centers.length < 30) centers.push({x, y});
    }
  }
  
  for (const c of centers) {
    drawThickCircle(c.x, c.y, radius * randomFloat(0.7, 1.0), pick(palette), thickness);
  }
  
  const dotColor = pick(palette);
  for (const c of centers) {
    fillCircle(Math.round(c.x), Math.round(c.y), Math.max(1, s(2)), dotColor);
  }
}

// ============================================================
// ۳. مکعب متاترون تصادفی
// ============================================================
function generateSacredMetatron(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const radius = randomInt(s(15), Math.min(maxR * 0.5, s(80)));
  const numPoints = randomInt(4, 8);
  const color = pick(palette);
  const lineColor = pick(palette);
  const thickness = randomInt(1, 2);
  
  const centers = [{x: cx, y: cy}];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI + randomFloat(0, 0.5);
    centers.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    });
  }
  
  for (const c of centers) {
    drawThickCircle(c.x, c.y, radius * randomFloat(0.6, 1.0), pick(palette), thickness);
  }
  
  for (let i = 0; i < centers.length; i++) {
    for (let j = i + 1; j < centers.length; j++) {
      const dist = Math.sqrt(
        (centers[i].x - centers[j].x) ** 2 +
        (centers[i].y - centers[j].y) ** 2
      );
      if (rand() < 0.3 && dist < radius * 2.5) {
        drawLine(
          Math.round(centers[i].x), Math.round(centers[i].y),
          Math.round(centers[j].x), Math.round(centers[j].y),
          pick(palette)
        );
      }
    }
  }
  
  fillCircle(Math.round(cx), Math.round(cy), Math.max(1, s(4)), pick(palette));
}

// ============================================================
// ۴. میوه زندگی تصادفی
// ============================================================
function generateSacredFruit(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const radius = randomInt(s(10), Math.min(maxR * 0.3, s(45)));
  const spacing = radius;
  const color = pick(palette);
  const thickness = randomInt(1, 2);
  
  const centers = [{x: cx, y: cy}];
  // لایه اول: ۶ دایره
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
    centers.push({
      x: cx + spacing * Math.cos(angle),
      y: cy + spacing * Math.sin(angle)
    });
  }
  // لایه دوم: ۶ دایره بیرونی
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2 + Math.PI / 6;
    centers.push({
      x: cx + spacing * 2 * Math.cos(angle),
      y: cy + spacing * 2 * Math.sin(angle)
    });
  }
  
  for (const c of centers) {
    drawThickCircle(c.x, c.y, radius, pick(palette), thickness);
  }
  
  const dotColor = pick(palette);
  for (const c of centers) {
    fillCircle(Math.round(c.x), Math.round(c.y), Math.max(1, s(2)), dotColor);
  }
}

// ============================================================
// ۵. چنبره تصادفی
// ============================================================
function generateSacredTorus(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const maxRadius = randomInt(s(30), Math.min(maxR * 0.8, s(150)));
  const steps = randomInt(8, 25);
  const numRays = randomInt(6, 16);
  
  for (let r = 2; r < maxRadius; r += randomInt(1, 4)) {
    const progress = r / maxRadius;
    const alpha = Math.sin(progress * Math.PI * randomFloat(1, 3));
    const colorIdx = Math.floor(Math.abs(alpha) * (palette.length - 1));
    const col = palette[Math.min(colorIdx, palette.length - 1)];
    drawThickCircle(cx, cy, r, col, 1);
  }
  
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * 2 * Math.PI + randomFloat(0, 0.5);
    const endX = cx + maxRadius * Math.cos(angle);
    const endY = cy + maxRadius * Math.sin(angle);
    drawLine(Math.round(cx), Math.round(cy), Math.round(endX), Math.round(endY), pick(palette));
  }
}

// ============================================================
// ۶. ستاره چهاروجهی تصادفی
// ============================================================
function generateSacredTetrahedron(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const radius = randomInt(s(20), Math.min(maxR * 0.7, s(120)));
  const numPoints = randomInt(3, 6);
  
  const pts1 = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI + randomFloat(0, 0.3);
    pts1.push({
      x: Math.round(cx + radius * Math.cos(angle)),
      y: Math.round(cy + radius * Math.sin(angle))
    });
  }
  
  const pts2 = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI + Math.PI / numPoints + randomFloat(0, 0.3);
    const r = radius * randomFloat(0.4, 0.8);
    pts2.push({
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle))
    });
  }
  
  const color1 = pick(palette);
  const color2 = pick(palette);
  for (let i = 0; i < numPoints; i++) {
    const j = (i + 1) % numPoints;
    drawLine(pts1[i].x, pts1[i].y, pts1[j].x, pts1[j].y, color1);
    drawLine(pts2[i].x, pts2[i].y, pts2[j].x, pts2[j].y, color2);
  }
  
  for (let i = 0; i < numPoints; i++) {
    for (let j = 0; j < numPoints; j++) {
      if (rand() < 0.15) {
        drawLine(pts1[i].x, pts1[i].y, pts2[j].x, pts2[j].y, pick(palette));
      }
    }
  }
  
  drawThickCircle(cx, cy, radius * randomFloat(0.2, 0.4), pick(palette), 2);
}

// ============================================================
// ۷. یانترا تصادفی
// ============================================================
function generateSacredSri(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const maxRadius = randomInt(s(30), Math.min(maxR * 0.8, s(150)));
  
  const numSquares = randomInt(3, 7);
  for (let i = 0; i < numSquares; i++) {
    const size = maxRadius * (1 - i * 0.12) * randomFloat(0.8, 1.0);
    const half = size / 2;
    const col = pick(palette);
    const corners = [
      {x: cx - half, y: cy - half},
      {x: cx + half, y: cy - half},
      {x: cx + half, y: cy + half},
      {x: cx - half, y: cy + half}
    ];
    for (let j = 0; j < 4; j++) {
      const k = (j + 1) % 4;
      drawLine(corners[j].x, corners[j].y, corners[k].x, corners[k].y, col);
    }
  }
  
  const numTriangles = randomInt(3, 8);
  for (let i = 0; i < numTriangles; i++) {
    const angle = (i / numTriangles) * Math.PI + randomFloat(0, 0.5);
    const r = maxRadius * randomFloat(0.5, 0.9);
    const pts = [];
    for (let j = 0; j < 3; j++) {
      const a = angle + (j / 3) * 2 * Math.PI;
      pts.push({
        x: Math.round(cx + r * Math.cos(a)),
        y: Math.round(cy + r * Math.sin(a))
      });
    }
    const col = pick(palette);
    for (let j = 0; j < 3; j++) {
      const k = (j + 1) % 3;
      drawLine(pts[j].x, pts[j].y, pts[k].x, pts[k].y, col);
    }
  }
  
  drawThickCircle(cx, cy, maxRadius * randomFloat(0.1, 0.3), pick(palette), randomInt(1, 3));
  fillCircle(Math.round(cx), Math.round(cy), randomInt(s(3), s(8)), pick(palette));
}

// ============================================================
// ۸. ترکیبی مقدس تصادفی
// ============================================================
function generateSacredCombined(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const numPatterns = randomInt(2, 4);
  const patterns = ['seed', 'flower', 'metatron', 'torus', 'tetrahedron', 'sri'];
  const used = [];
  for (let i = 0; i < numPatterns; i++) {
    const p = pick(patterns);
    if (!used.includes(p)) used.push(p);
    if (used.length >= patterns.length) break;
  }
  
  const cols = Math.ceil(Math.sqrt(used.length));
  const rows = Math.ceil(used.length / cols);
  const cellW = GRID_W / cols;
  const cellH = GRID_H / rows;
  
  const mainData = pixelData;
  
  for (let idx = 0; idx < used.length; idx++) {
    const type = used[idx];
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const cx2 = col * cellW + cellW / 2;
    const cy2 = row * cellH + cellH / 2;
    const maxR2 = Math.min(cellW, cellH) * 0.35;
    const tempPalette = [];
    for (let i = 0; i < randomInt(3, 6); i++) {
      tempPalette.push(pick(palette));
    }
    
    const tempData = new Array(GRID_W * GRID_H);
    for (let i = 0; i < tempData.length; i++) tempData[i] = bg;
    const oldData = pixelData;
    pixelData = tempData;
    
    switch(type) {
      case 'seed': generateSacredSeed(tempPalette); break;
      case 'flower': generateSacredFlower(tempPalette); break;
      case 'metatron': generateSacredMetatron(tempPalette); break;
      case 'torus': generateSacredTorus(tempPalette); break;
      case 'tetrahedron': generateSacredTetrahedron(tempPalette); break;
      case 'sri': generateSacredSri(tempPalette); break;
    }
    
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const color = pixelData[y * GRID_W + x];
        if (color && color !== bg) {
          mainData[y * GRID_W + x] = color;
        }
      }
    }
    pixelData = mainData;
  }
}