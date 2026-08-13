// ============================================================
// mst3.js - الگوریتم‌های موج (۶ نوع) - مقیاس‌پذیر
// ============================================================

'use strict';

function generateWaveSin(palette) {
  const bgColor = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bgColor;
  const numLines = randomInt(s(6), s(12));
  const cycles = randomInt(s(6), s(12));
  const phase = randomFloat(0, 6.28);
  const amplitude = randomInt(s(30), s(75));
  const spacing = Math.floor(GRID_H / (numLines + 1));
  const startY = spacing;
  const lineWidth = randomInt(1, 3);

  for (let line = 0; line < numLines; line++) {
    const centerY = startY + line * spacing + randomInt(-s(4), s(4));
    const lineColor = pick(palette);
    for (let x = 0; x < GRID_W; x++) {
      const t = x / GRID_W;
      const angle = t * cycles * 2 * Math.PI + phase + line * 0.7;
      const sinVal = Math.sin(angle);
      const y = Math.round(centerY + sinVal * amplitude);
      for (let dy = -lineWidth; dy <= lineWidth; dy++) {
        const py = y + dy;
        if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
      }
    }
    for (let x = 0; x < GRID_W - 1; x++) {
      const t1 = x / GRID_W, t2 = (x + 1) / GRID_W;
      const sinVal1 = Math.sin(t1 * cycles * 2 * Math.PI + phase + line * 0.7);
      const sinVal2 = Math.sin(t2 * cycles * 2 * Math.PI + phase + line * 0.7);
      const y1 = Math.round(centerY + sinVal1 * amplitude);
      const y2 = Math.round(centerY + sinVal2 * amplitude);
      const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        for (let dy = -lineWidth; dy <= lineWidth; dy++) {
          const py = y + dy;
          if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
        }
      }
    }
  }
}

function generateWaveTriangle(palette) {
  const bgColor = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bgColor;
  const lineColor = pick(palette);
  const lineWidth = 1;
  const rows = randomInt(s(5), s(8));
  const rowHeight = GRID_H / rows;
  const trianglesPerRow = randomInt(s(4), s(8));
  const pointsPerTriangle = 2;
  const totalPoints = trianglesPerRow * pointsPerTriangle;
  const amplitudes = [];
  for (let r = 0; r < rows; r++) amplitudes.push(randomInt(s(30), s(60)));
  const spacing = GRID_W / totalPoints;

  function drawThinLine(x1, y1, x2, y2, color) {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    if (steps === 0) { if (x1 >= 0 && x1 < GRID_W && y1 >= 0 && y1 < GRID_H) setPixel(x1, y1, color); return; }
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = Math.round(x1 + (x2 - x1) * t);
      const py = Math.round(y1 + (y2 - y1) * t);
      if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) setPixel(px, py, color);
    }
  }

  for (let r = 0; r < rows; r++) {
    const centerY = rowHeight * (r + 0.5);
    const amp = amplitudes[r];
    const points = [];
    for (let i = 0; i < totalPoints; i++) {
      const x = i * spacing;
      let yOffset = (r % 2 === 0) ? ((i % 2 === 0) ? -amp : amp) : ((i % 2 === 0) ? amp : -amp);
      points.push({ x: Math.round(x), y: Math.round(centerY + yOffset) });
    }
    points.push({ x: GRID_W - 1, y: (r % 2 === 0) ? Math.round(centerY - amp) : Math.round(centerY + amp) });
    for (let i = 0; i < points.length - 1; i++) {
      drawThinLine(points[i].x, points[i].y, points[i+1].x, points[i+1].y, lineColor);
    }
  }
}

function generateWaveSquare(palette) {
  const bgColor = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bgColor;
  const numLines = randomInt(s(6), s(12));
  const cycles = randomInt(s(6), s(12));
  const phase = randomFloat(0, 6.28);
  const amplitude = randomInt(s(30), s(75));
  const lineWidth = randomInt(1, 2);
  const spacing = Math.floor(GRID_H / (numLines + 1));
  const startY = spacing;

  for (let line = 0; line < numLines; line++) {
    const centerY = startY + line * spacing + randomInt(-s(4), s(4));
    const lineColor = pick(palette);
    for (let x = 0; x < GRID_W; x++) {
      const t = x / GRID_W;
      const angle = t * cycles * 2 * Math.PI + phase + line * 0.7;
      const squareVal = Math.sin(angle) >= 0 ? 1 : -1;
      const y = Math.round(centerY + squareVal * amplitude);
      for (let dy = -lineWidth; dy <= lineWidth; dy++) {
        const py = y + dy;
        if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
      }
    }
    for (let x = 0; x < GRID_W - 1; x++) {
      const t1 = x / GRID_W, t2 = (x + 1) / GRID_W;
      const angle1 = t1 * cycles * 2 * Math.PI + phase + line * 0.7;
      const angle2 = t2 * cycles * 2 * Math.PI + phase + line * 0.7;
      const sqVal1 = Math.sin(angle1) >= 0 ? 1 : -1;
      const sqVal2 = Math.sin(angle2) >= 0 ? 1 : -1;
      const y1 = Math.round(centerY + sqVal1 * amplitude);
      const y2 = Math.round(centerY + sqVal2 * amplitude);
      const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        for (let dy = -lineWidth; dy <= lineWidth; dy++) {
          const py = y + dy;
          if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
        }
      }
    }
  }
}

function generateWaveSawtooth(palette) {
  const bgColor = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bgColor;
  const numLines = randomInt(s(6), s(12));
  const cycles = randomInt(s(6), s(12));
  const phase = randomFloat(0, 6.28);
  const amplitude = randomInt(s(30), s(75));
  const lineWidth = randomInt(1, 2);
  const spacing = Math.floor(GRID_H / (numLines + 1));
  const startY = spacing;

  for (let line = 0; line < numLines; line++) {
    const centerY = startY + line * spacing + randomInt(-s(4), s(4));
    const lineColor = pick(palette);
    for (let x = 0; x < GRID_W; x++) {
      const t = x / GRID_W;
      const angle = t * cycles * 2 * Math.PI + phase + line * 0.7;
      let normAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const sawVal = (normAngle / Math.PI - 1);
      const y = Math.round(centerY + sawVal * amplitude);
      for (let dy = -lineWidth; dy <= lineWidth; dy++) {
        const py = y + dy;
        if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
      }
    }
    for (let x = 0; x < GRID_W - 1; x++) {
      const t1 = x / GRID_W, t2 = (x + 1) / GRID_W;
      const angle1 = t1 * cycles * 2 * Math.PI + phase + line * 0.7;
      const angle2 = t2 * cycles * 2 * Math.PI + phase + line * 0.7;
      let normAngle1 = ((angle1 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      let normAngle2 = ((angle2 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const sawVal1 = (normAngle1 / Math.PI - 1);
      const sawVal2 = (normAngle2 / Math.PI - 1);
      const y1 = Math.round(centerY + sawVal1 * amplitude);
      const y2 = Math.round(centerY + sawVal2 * amplitude);
      const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        for (let dy = -lineWidth; dy <= lineWidth; dy++) {
          const py = y + dy;
          if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
        }
      }
    }
  }
}

function generateWavePulse(palette) {
  const bgColor = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bgColor;
  const numPulses = randomInt(2, 4);
  const amplitude = randomInt(s(45), s(90));

  for (let p = 0; p < numPulses; p++) {
    const centerX = randomInt(s(40), GRID_W - s(40));
    const centerY = randomInt(s(40), GRID_H - s(40));
    const power = randomFloat(0.7, 1.3);
    const pulseColor = pick(palette);
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const dx = x - centerX, dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > Math.max(GRID_W, GRID_H) * 0.5) continue;
        const pulseRadius = s(6);
        const isPulse = dist < pulseRadius;
        const waveFreq = randomFloat(0.02, 0.06);
        const wavePhase = randomFloat(0, 6.28);
        const waveValue = Math.sin(dist * waveFreq * 2 * Math.PI + wavePhase);
        const damping = Math.exp(-dist * 0.01);
        const dampedWave = waveValue * damping * amplitude * 0.5;
        let finalValue = isPulse ? amplitude * power * (1 - dist / (pulseRadius * 2)) : dampedWave;
        const yPos = Math.round(centerY + finalValue);
        let color = isPulse ? pulseColor : palette[Math.min(Math.floor(((dampedWave / amplitude + 1) / 2) * (palette.length - 1)), palette.length - 1)];
        if (x >= 0 && x < GRID_W && yPos >= 0 && yPos < GRID_H) setPixel(x, yPos, color);
      }
    }
    const numRings = randomInt(s(6), s(12));
    for (let ring = 0; ring < numRings; ring++) {
      const radius = ring * randomInt(s(15), s(30)) + s(15);
      const ringColor = pick(palette);
      for (let angle = 0; angle < 360; angle += 1) {
        const rad = angle * Math.PI / 180;
        const x = Math.round(centerX + radius * Math.cos(rad));
        const y = Math.round(centerY + radius * Math.sin(rad));
        if (x >= 0 && x < GRID_W && y >= 0 && y < GRID_H && rand() < 0.3) setPixel(x, y, ringColor);
      }
    }
  }
}

function generateWaveCombined(palette) {
  const bgColor = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bgColor;
  const numLines = randomInt(s(6), s(12));
  const cycles = randomInt(s(6), s(12));
  const phase = randomFloat(0, 6.28);
  const amplitude = randomInt(s(30), s(75));
  const lineWidth = randomInt(1, 2);
  const spacing = Math.floor(GRID_H / (numLines + 1));
  const startY = spacing;

  for (let line = 0; line < numLines; line++) {
    const centerY = startY + line * spacing + randomInt(-s(4), s(4));
    const lineColor = pick(palette);
    for (let x = 0; x < GRID_W; x++) {
      const t = x / GRID_W;
      const angle = t * cycles * 2 * Math.PI + phase + line * 0.7;
      const combinedVal = (Math.sin(angle) * 0.4 + (2 / Math.PI) * Math.asin(Math.sin(angle * 0.7)) * 0.3 + (Math.sin(angle * 1.3) >= 0 ? 0.3 : -0.3));
      const y = Math.round(centerY + combinedVal * amplitude);
      for (let dy = -lineWidth; dy <= lineWidth; dy++) {
        const py = y + dy;
        if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
      }
    }
    for (let x = 0; x < GRID_W - 1; x++) {
      const t1 = x / GRID_W, t2 = (x + 1) / GRID_W;
      const angle1 = t1 * cycles * 2 * Math.PI + phase + line * 0.7;
      const angle2 = t2 * cycles * 2 * Math.PI + phase + line * 0.7;
      const combinedVal1 = (Math.sin(angle1) * 0.4 + (2 / Math.PI) * Math.asin(Math.sin(angle1 * 0.7)) * 0.3 + (Math.sin(angle1 * 1.3) >= 0 ? 0.3 : -0.3));
      const combinedVal2 = (Math.sin(angle2) * 0.4 + (2 / Math.PI) * Math.asin(Math.sin(angle2 * 0.7)) * 0.3 + (Math.sin(angle2 * 1.3) >= 0 ? 0.3 : -0.3));
      const y1 = Math.round(centerY + combinedVal1 * amplitude);
      const y2 = Math.round(centerY + combinedVal2 * amplitude);
      const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        for (let dy = -lineWidth; dy <= lineWidth; dy++) {
          const py = y + dy;
          if (py >= 0 && py < GRID_H) setPixel(x, py, lineColor);
        }
      }
    }
  }
}