// ============================================================
// mst12.js - طلسم‌ها و سیجیل‌ها (دایره‌ای)
// ============================================================

'use strict';

// توابع کمکی (در صورت عدم وجود در mst2)
if (typeof drawThickCircle === 'undefined') {
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
}

if (typeof getPointOnCircle === 'undefined') {
  function getPointOnCircle(cx, cy, r, angle) {
    return {
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle))
    };
  }
}

// ============================================================
// ۱. سیجیل تصادفی (دایره‌ای)
// ============================================================
function generateSigilRandom(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  const color = pick(palette);
  
  drawThickCircle(cx, cy, r, color, randomInt(1, 3));
  
  const numLines = randomInt(6, 16);
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * 2 * Math.PI + randomFloat(0, 0.1);
    const p1 = getPointOnCircle(cx, cy, r * randomFloat(0.2, 0.5), angle);
    const p2 = getPointOnCircle(cx, cy, r * randomFloat(0.7, 0.95), angle + randomFloat(-0.1, 0.1));
    drawLine(p1.x, p1.y, p2.x, p2.y, pick(palette));
  }
  
  const numDots = randomInt(8, 24);
  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * 2 * Math.PI + randomFloat(0, 0.1);
    const p = getPointOnCircle(cx, cy, r * randomFloat(0.5, 0.95), angle);
    fillCircle(p.x, p.y, randomInt(s(1), s(4)), pick(palette));
  }
  
  fillCircle(cx, cy, randomInt(s(3), s(8)), pick(palette));
}

// ============================================================
// ۲. سیجیل آشوب (دایره‌ای)
// ============================================================
function generateSigilChaos(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  const color = pick(palette);
  
  drawThickCircle(cx, cy, r, color, randomInt(1, 2));
  drawThickCircle(cx, cy, r * 0.7, pick(palette), randomInt(1, 2));
  drawThickCircle(cx, cy, r * 0.4, pick(palette), randomInt(1, 2));
  
  const numCurves = randomInt(4, 10);
  for (let i = 0; i < numCurves; i++) {
    const angle1 = randomFloat(0, Math.PI * 2);
    const angle2 = angle1 + randomFloat(0.5, 2);
    const p1 = getPointOnCircle(cx, cy, r * randomFloat(0.3, 0.6), angle1);
    const p2 = getPointOnCircle(cx, cy, r * randomFloat(0.3, 0.6), angle2);
    const color2 = pick(palette);
    const steps = randomInt(10, 30);
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const px = Math.round(p1.x + (p2.x - p1.x) * t + Math.sin(t * randomFloat(5, 15)) * randomFloat(5, 15));
      const py = Math.round(p1.y + (p2.y - p1.y) * t + Math.cos(t * randomFloat(5, 15)) * randomFloat(5, 15));
      if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) {
        setPixel(px, py, color2);
      }
    }
  }
  
  for (let i = 0; i < randomInt(10, 25); i++) {
    const angle = randomFloat(0, Math.PI * 2);
    const dist = r * randomFloat(0.1, 0.95);
    const p = getPointOnCircle(cx, cy, dist, angle);
    fillCircle(p.x, p.y, randomInt(s(1), s(3)), pick(palette));
  }
  
  fillCircle(cx, cy, randomInt(s(3), s(6)), pick(palette));
}

// ============================================================
// ۳. طلسم محافظتی (دایره‌ای)
// ============================================================
function generateSigilProtect(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  const color = pick(palette);
  
  drawThickCircle(cx, cy, r, color, randomInt(2, 4));
  drawThickCircle(cx, cy, r * 0.85, pick(palette), randomInt(1, 2));
  drawThickCircle(cx, cy, r * 0.3, pick(palette), randomInt(1, 2));
  
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
    const p = getPointOnCircle(cx, cy, r * 0.7, angle);
    pts.push(p);
  }
  for (let i = 0; i < 5; i++) {
    const j = (i + 2) % 5;
    drawLine(pts[i].x, pts[i].y, pts[j].x, pts[j].y, pick(palette));
  }
  
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI + randomFloat(0, 0.1);
    const p = getPointOnCircle(cx, cy, r * 0.92, angle);
    if (rand() < 0.5) {
      fillCircle(p.x, p.y, randomInt(s(2), s(5)), pick(palette));
    } else {
      drawLine(p.x - s(5), p.y - s(5), p.x + s(5), p.y + s(5), pick(palette));
      drawLine(p.x - s(5), p.y + s(5), p.x + s(5), p.y - s(5), pick(palette));
    }
  }
  
  fillCircle(cx, cy, randomInt(s(4), s(8)), pick(palette));
}

// ============================================================
// ۴. طلسم عشق (دایره‌ای)
// ============================================================
function generateSigilLove(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  const color = pick(palette);
  
  drawThickCircle(cx, cy, r, color, randomInt(1, 3));
  drawThickCircle(cx, cy, r * 0.6, pick(palette), randomInt(1, 2));
  
  const numHearts = randomInt(6, 12);
  for (let i = 0; i < numHearts; i++) {
    const angle = (i / numHearts) * 2 * Math.PI + randomFloat(0, 0.1);
    const dist = r * randomFloat(0.4, 0.9);
    const p = getPointOnCircle(cx, cy, dist, angle);
    const size = randomInt(s(3), s(12));
    const color2 = pick(palette);
    const pts = [];
    for (let t = 0; t <= 360; t += 6) {
      const rad = t * Math.PI / 180;
      const px = p.x + size * 0.3 * (16 * Math.pow(Math.sin(rad), 3));
      const py = p.y - size * 0.3 * (13 * Math.cos(rad) - 5 * Math.cos(2*rad) - 2 * Math.cos(3*rad) - Math.cos(4*rad));
      pts.push({x: Math.round(px), y: Math.round(py)});
    }
    for (let j = 0; j < pts.length - 1; j++) {
      drawLine(pts[j].x, pts[j].y, pts[j+1].x, pts[j+1].y, color2);
    }
  }
  
  for (let i = 0; i < randomInt(3, 6); i++) {
    const angle1 = randomFloat(0, Math.PI * 2);
    const angle2 = angle1 + randomFloat(1, 2.5);
    const p1 = getPointOnCircle(cx, cy, r * randomFloat(0.3, 0.5), angle1);
    const p2 = getPointOnCircle(cx, cy, r * randomFloat(0.3, 0.5), angle2);
    const color2 = pick(palette);
    const steps = randomInt(15, 30);
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const px = Math.round(p1.x + (p2.x - p1.x) * t + Math.sin(t * 4) * 8);
      const py = Math.round(p1.y + (p2.y - p1.y) * t + Math.cos(t * 3) * 8);
      if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) {
        setPixel(px, py, color2);
      }
    }
  }
  
  fillCircle(cx, cy, randomInt(s(3), s(6)), pick(palette));
}

// ============================================================
// ۵. طلسم ثروت (دایره‌ای)
// ============================================================
function generateSigilWealth(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  const color = pick(palette);
  
  drawThickCircle(cx, cy, r, color, randomInt(2, 4));
  drawThickCircle(cx, cy, r * 0.5, pick(palette), randomInt(1, 2));
  
  const numDiamonds = randomInt(6, 12);
  for (let i = 0; i < numDiamonds; i++) {
    const angle = (i / numDiamonds) * 2 * Math.PI + randomFloat(0, 0.1);
    const dist = r * randomFloat(0.3, 0.9);
    const p = getPointOnCircle(cx, cy, dist, angle);
    const size = randomInt(s(4), s(16));
    const color2 = pick(palette);
    const pts = [
      {x: p.x, y: p.y - size},
      {x: p.x + size, y: p.y},
      {x: p.x, y: p.y + size},
      {x: p.x - size, y: p.y}
    ];
    for (let j = 0; j < 4; j++) {
      const k = (j + 1) % 4;
      drawLine(pts[j].x, pts[j].y, pts[k].x, pts[k].y, color2);
    }
  }
  
  for (let i = 0; i < randomInt(3, 6); i++) {
    const angle1 = randomFloat(0, Math.PI * 2);
    const angle2 = angle1 + randomFloat(0.5, 1.5);
    const p1 = getPointOnCircle(cx, cy, r * randomFloat(0.2, 0.4), angle1);
    const p2 = getPointOnCircle(cx, cy, r * randomFloat(0.2, 0.4), angle2);
    const color2 = pick(palette);
    const segments = randomInt(3, 6);
    for (let seg = 0; seg < segments; seg++) {
      const t1 = seg / segments;
      const t2 = (seg + 1) / segments;
      const px1 = Math.round(p1.x + (p2.x - p1.x) * t1 + randomInt(-5, 5));
      const py1 = Math.round(p1.y + (p2.y - p1.y) * t1 + randomInt(-5, 5));
      const px2 = Math.round(p1.x + (p2.x - p1.x) * t2 + randomInt(-5, 5));
      const py2 = Math.round(p1.y + (p2.y - p1.y) * t2 + randomInt(-5, 5));
      drawLine(px1, py1, px2, py2, color2);
    }
  }
  
  fillCircle(cx, cy, randomInt(s(4), s(8)), pick(palette));
}

// ============================================================
// ۶. طلسم سلامتی (دایره‌ای)
// ============================================================
function generateSigilHealth(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  const color = pick(palette);
  
  drawThickCircle(cx, cy, r, color, randomInt(2, 4));
  drawThickCircle(cx, cy, r * 0.4, pick(palette), randomInt(1, 2));
  
  const numCrosses = randomInt(6, 14);
  for (let i = 0; i < numCrosses; i++) {
    const angle = (i / numCrosses) * 2 * Math.PI + randomFloat(0, 0.1);
    const dist = r * randomFloat(0.3, 0.9);
    const p = getPointOnCircle(cx, cy, dist, angle);
    const size = randomInt(s(3), s(10));
    const color2 = pick(palette);
    drawLine(p.x, p.y - size, p.x, p.y + size, color2);
    drawLine(p.x - size, p.y, p.x + size, p.y, color2);
  }
  
  for (let i = 0; i < randomInt(3, 6); i++) {
    const angle1 = randomFloat(0, Math.PI * 2);
    const angle2 = angle1 + randomFloat(1, 2);
    const p1 = getPointOnCircle(cx, cy, r * randomFloat(0.2, 0.4), angle1);
    const p2 = getPointOnCircle(cx, cy, r * randomFloat(0.2, 0.4), angle2);
    const color2 = pick(palette);
    const steps = randomInt(15, 30);
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const px = Math.round(p1.x + (p2.x - p1.x) * t + Math.sin(t * 4) * 8);
      const py = Math.round(p1.y + (p2.y - p1.y) * t + Math.cos(t * 3) * 8);
      if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) {
        setPixel(px, py, color2);
      }
    }
  }
  
  fillCircle(cx, cy, randomInt(s(4), s(8)), pick(palette));
}

// ============================================================
// ۷. ختم ترکیبی (دایره‌ای)
// ============================================================
function generateKhatmCombined(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.8;
  
  const numCircles = randomInt(3, 6);
  for (let i = 0; i < numCircles; i++) {
    const radius = r * (1 - i * 0.12);
    drawThickCircle(cx, cy, radius, pick(palette), randomInt(1, 2));
  }
  
  for (let i = 0; i < randomInt(8, 16); i++) {
    const angle = (i / 14) * 2 * Math.PI + randomFloat(0, 0.1);
    const dist = r * randomFloat(0.4, 0.95);
    const p = getPointOnCircle(cx, cy, dist, angle);
    fillCircle(p.x, p.y, randomInt(s(2), s(5)), pick(palette));
  }
  
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI + randomFloat(0, 0.05);
    const p1 = getPointOnCircle(cx, cy, r * 0.3, angle);
    const p2 = getPointOnCircle(cx, cy, r * 0.7, angle + Math.PI / 8);
    drawLine(p1.x, p1.y, p2.x, p2.y, pick(palette));
  }
  
  drawLine(cx, cy - r * 0.7, cx, cy + r * 0.7, pick(palette));
  drawLine(cx - r * 0.7, cy, cx + r * 0.7, cy, pick(palette));
  
  fillCircle(cx, cy, randomInt(s(4), s(8)), pick(palette));
}

// ============================================================
// ۸. ختم دایره‌ای
// ============================================================
function generateKhatmCircle(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const cy = GRID_H / 2;
  const maxR = Math.min(GRID_W, GRID_H) * 0.4;
  const r = maxR * 0.85;
  
  const numCircles = randomInt(4, 8);
  for (let i = 0; i < numCircles; i++) {
    const radius = r * (1 - i * 0.1);
    drawThickCircle(cx, cy, radius, pick(palette), randomInt(1, 3));
  }
  
  const numRays = randomInt(8, 16);
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * 2 * Math.PI + randomFloat(0, 0.05);
    const p = getPointOnCircle(cx, cy, r * 0.95, angle);
    drawLine(cx, cy, p.x, p.y, pick(palette));
  }
  
  for (let i = 0; i < randomInt(12, 24); i++) {
    const angle = (i / 20) * 2 * Math.PI + randomFloat(0, 0.05);
    const dist = r * randomFloat(0.3, 0.95);
    const p = getPointOnCircle(cx, cy, dist, angle);
    fillCircle(p.x, p.y, randomInt(s(1), s(4)), pick(palette));
  }
  
  drawThickCircle(cx, cy, r * 0.15, pick(palette), randomInt(2, 4));
  fillCircle(cx, cy, randomInt(s(4), s(10)), pick(palette));
}

// ============================================================
// تابع کمکی برای انتخاب تصادفی از بین همه
// ============================================================
function generateSacredRandom(palette) {
  const types = [
    generateSacredSeed, generateSacredFlower, generateSacredMetatron,
    generateSacredFruit, generateSacredTorus, generateSacredTetrahedron,
    generateSacredSri, generateSacredCombined,
    generateSigilRandom, generateSigilChaos, generateSigilProtect,
    generateSigilLove, generateSigilWealth, generateSigilHealth,
    generateKhatmCombined, generateKhatmCircle
  ];
  const selected = pick(types);
  selected(palette);
}