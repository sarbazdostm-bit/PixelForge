// ============================================================
// mst13.js - درخت و جنگل
// ============================================================

'use strict';

// ============================================================
// ۱. درخت کلاسیک
// ============================================================
function generateNatureTree(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const cx = GRID_W / 2;
  const startY = GRID_H - 20;
  const length = randomInt(s(40), s(80));
  const depth = randomInt(5, 8);
  const branchAngle = randomFloat(0.3, 0.7);
  const shrink = randomFloat(0.65, 0.85);
  
  function drawBranch(x, y, len, ang, dep) {
    if (dep < 0 || len < 2) return;
    const endX = x + Math.cos(ang) * len;
    const endY = y + Math.sin(ang) * len;
    const color = pick(palette);
    drawLine(Math.round(x), Math.round(y), Math.round(endX), Math.round(endY), color);
    const nextLen = len * shrink;
    const branches = randomInt(2, 3);
    for (let b = 0; b < branches; b++) {
      const offset = (b - (branches - 1) / 2) * branchAngle * randomFloat(0.7, 1.3);
      drawBranch(endX, endY, nextLen, ang + offset, dep - 1);
    }
    if (rand() < 0.2) {
      drawBranch(endX, endY, nextLen * 0.7, ang, dep - 1);
    }
    // برگ‌های انتهایی
    if (dep <= 2 && rand() < 0.5) {
      const leafColor = pick(palette);
      fillCircle(Math.round(endX), Math.round(endY), randomInt(s(2), s(6)), leafColor);
    }
  }
  
  drawBranch(cx, startY, length, -Math.PI / 2, depth);
  
  // زمین
  const groundColor = pick(palette);
  for (let x = 0; x < GRID_W; x++) {
    const y = GRID_H - randomInt(1, 5);
    setPixel(x, y, groundColor);
  }
}

// ============================================================
// ۲. جنگل
// ============================================================
function generateNatureForest(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  
  const numTrees = randomInt(5, 12);
  for (let t = 0; t < numTrees; t++) {
    const cx = randomInt(20, GRID_W - 20);
    const startY = GRID_H - randomInt(10, 30);
    const length = randomInt(s(20), s(50));
    const depth = randomInt(3, 5);
    const treeColor = pick(palette);
    
    function drawBranch(x, y, len, ang, dep) {
      if (dep < 0 || len < 2) return;
      const endX = x + Math.cos(ang) * len;
      const endY = y + Math.sin(ang) * len;
      drawLine(Math.round(x), Math.round(y), Math.round(endX), Math.round(endY), treeColor);
      const nextLen = len * 0.75;
      const offset = randomFloat(0.3, 0.6);
      drawBranch(endX, endY, nextLen, ang + offset, dep - 1);
      drawBranch(endX, endY, nextLen, ang - offset, dep - 1);
      if (dep <= 1) {
        const leafColor = pick(palette);
        fillCircle(Math.round(endX), Math.round(endY), randomInt(s(2), s(5)), leafColor);
      }
    }
    drawBranch(cx, startY, length, -Math.PI / 2 + randomFloat(-0.2, 0.2), depth);
  }
  
  // زمین
  const groundColor = pick(palette);
  for (let x = 0; x < GRID_W; x++) {
    const y = GRID_H - randomInt(1, 3);
    setPixel(x, y, groundColor);
  }
}