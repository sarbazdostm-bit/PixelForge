// ============================================================
// mst4.js - الگوریتم‌های هندسی (۹ نوع) - مقیاس‌پذیر
// ============================================================

'use strict';

function getShapeMode() { return randomInt(0, 1); }

function generateGeoCircle(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(10), s(18)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(15), GRID_W - s(15));
    const cy = randomInt(s(15), GRID_H - s(15));
    const r = randomInt(s(15), Math.floor(Math.min(GRID_W, GRID_H) * 0.18));
    const mode = getShapeMode();
    if (mode === 0) {
      for (let angle = 0; angle < 360; angle += 1) {
        const rad = angle * Math.PI / 180;
        for (let d = -1; d <= 1; d++) {
          const px = Math.round(cx + (r + d) * Math.cos(rad));
          const py = Math.round(cy + (r + d) * Math.sin(rad));
          if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H && rand() < 0.7) setPixel(px, py, col);
        }
      }
    } else {
      fillCircle(cx, cy, r, col);
    }
  }
}

function generateGeoRect(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(10), s(18)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(15), GRID_W - s(15));
    const cy = randomInt(s(15), GRID_H - s(15));
    const w = randomInt(s(18), s(60));
    const h = randomInt(s(18), s(60));
    const angle = randomFloat(0, Math.PI * 2);
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const mode = getShapeMode();
    const corners = [{x:-w/2,y:-h/2},{x:w/2,y:-h/2},{x:w/2,y:h/2},{x:-w/2,y:h/2}];
    const rotated = corners.map(p => ({x: cx + Math.round(p.x*cosA - p.y*sinA), y: cy + Math.round(p.x*sinA + p.y*cosA)}));
    if (mode === 0) {
      for (let i = 0; i < 4; i++) {
        const j = (i+1)%4;
        const x1=rotated[i].x, y1=rotated[i].y, x2=rotated[j].x, y2=rotated[j].y;
        const steps = Math.max(Math.abs(x2-x1), Math.abs(y2-y1));
        for (let step=0; step<=steps; step++) {
          const t=steps>0?step/steps:0;
          const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
          if (px>=0 && px<GRID_W && py>=0 && py<GRID_H) setPixel(px,py,col);
        }
      }
    } else {
      for (let dy=-h/2; dy<=h/2; dy++) {
        for (let dx=-w/2; dx<=w/2; dx++) {
          const px=cx+Math.round(dx*cosA - dy*sinA);
          const py=cy+Math.round(dx*sinA + dy*cosA);
          if (px>=0 && px<GRID_W && py>=0 && py<GRID_H && rand()<0.85) setPixel(px,py,col);
        }
      }
    }
  }
}

function generateGeoTriangle(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(10), s(18)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(20), GRID_W - s(20));
    const cy = randomInt(s(20), GRID_H - s(20));
    const size = randomInt(s(24), s(75));
    const mode = getShapeMode();
    const x1=cx, y1=cy-size, x2=cx-size, y2=cy+size, x3=cx+size, y3=cy+size;
    if (mode === 0) {
      const edges = [[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x1,y1]];
      for (let e=0; e<edges.length; e++) {
        const [x1e,y1e,x2e,y2e]=edges[e];
        const steps=Math.max(Math.abs(x2e-x1e),Math.abs(y2e-y1e));
        for (let step=0; step<=steps; step++) {
          const t=steps>0?step/steps:0;
          const px=Math.round(x1e+(x2e-x1e)*t), py=Math.round(y1e+(y2e-y1e)*t);
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
        }
      }
    } else {
      const minX=Math.max(0,Math.floor(Math.min(x1,x2,x3)));
      const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(x1,x2,x3)));
      const minY=Math.max(0,Math.floor(Math.min(y1,y2,y3)));
      const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(y1,y2,y3)));
      for (let y=minY; y<=maxY; y++) {
        let intersections=[];
        const edges=[[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x1,y1]];
        for (let e=0; e<edges.length; e++) {
          const [x1e,y1e,x2e,y2e]=edges[e];
          if ((y1e<=y && y2e>y) || (y2e<=y && y1e>y)) {
            const x=x1e+(y-y1e)*(x2e-x1e)/(y2e-y1e);
            intersections.push(x);
          }
        }
        intersections.sort((a,b)=>a-b);
        for (let i=0; i<intersections.length-1; i+=2) {
          const x1i=Math.max(0,Math.floor(intersections[i]));
          const x2i=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
          for (let x=x1i; x<=x2i; x++) if (rand()<0.8) setPixel(x,y,col);
        }
      }
    }
  }
}

function generateGeoHexagon(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(8), s(14)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(20), GRID_W - s(20));
    const cy = randomInt(s(20), GRID_H - s(20));
    const size = randomInt(s(24), s(66));
    const mode = getShapeMode();
    const pts = [];
    for (let i=0; i<6; i++) {
      const a=(i/6)*2*Math.PI - Math.PI/2;
      pts.push({x: cx + size*Math.cos(a), y: cy + size*Math.sin(a)});
    }
    if (mode === 0) {
      for (let i=0; i<6; i++) {
        const j=(i+1)%6;
        const x1=Math.round(pts[i].x), y1=Math.round(pts[i].y);
        const x2=Math.round(pts[j].x), y2=Math.round(pts[j].y);
        const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
        for (let step=0; step<=steps; step++) {
          const t=steps>0?step/steps:0;
          const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
        }
      }
    } else {
      const minX=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.x))));
      const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(...pts.map(p=>p.x))));
      const minY=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.y))));
      const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(...pts.map(p=>p.y))));
      for (let y=minY; y<=maxY; y++) {
        let intersections=[];
        for (let i=0; i<6; i++) {
          const j=(i+1)%6;
          const p1=pts[i], p2=pts[j];
          if ((p1.y<=y && p2.y>y) || (p2.y<=y && p1.y>y)) {
            const x=p1.x+(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y);
            intersections.push(x);
          }
        }
        intersections.sort((a,b)=>a-b);
        for (let i=0; i<intersections.length-1; i+=2) {
          const x1=Math.max(0,Math.floor(intersections[i]));
          const x2=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
          for (let x=x1; x<=x2; x++) if (rand()<0.7) setPixel(x,y,col);
        }
      }
    }
  }
}

function generateGeoStar(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(10), s(18)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(20), GRID_W - s(20));
    const cy = randomInt(s(20), GRID_H - s(20));
    const size = randomInt(s(24), s(66));
    const numPoints = randomInt(4, 6);
    const mode = getShapeMode();
    const pts = [];
    for (let i=0; i<numPoints*2; i++) {
      const a=(i/(numPoints*2))*2*Math.PI - Math.PI/2;
      const r=(i%2===0)?size:size*0.4;
      pts.push({x: cx + r*Math.cos(a), y: cy + r*Math.sin(a)});
    }
    if (mode === 0) {
      for (let i=0; i<pts.length; i++) {
        const j=(i+1)%pts.length;
        const x1=Math.round(pts[i].x), y1=Math.round(pts[i].y);
        const x2=Math.round(pts[j].x), y2=Math.round(pts[j].y);
        const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
        for (let step=0; step<=steps; step++) {
          const t=steps>0?step/steps:0;
          const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
        }
      }
    } else {
      const minX=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.x))));
      const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(...pts.map(p=>p.x))));
      const minY=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.y))));
      const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(...pts.map(p=>p.y))));
      for (let y=minY; y<=maxY; y++) {
        let intersections=[];
        for (let i=0; i<pts.length; i++) {
          const j=(i+1)%pts.length;
          const p1=pts[i], p2=pts[j];
          if ((p1.y<=y && p2.y>y) || (p2.y<=y && p1.y>y)) {
            const x=p1.x+(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y);
            intersections.push(x);
          }
        }
        intersections.sort((a,b)=>a-b);
        for (let i=0; i<intersections.length-1; i+=2) {
          const x1=Math.max(0,Math.floor(intersections[i]));
          const x2=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
          for (let x=x1; x<=x2; x++) if (rand()<0.7) setPixel(x,y,col);
        }
      }
    }
  }
}

function generateGeoEllipse(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(8), s(14)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(20), GRID_W - s(20));
    const cy = randomInt(s(20), GRID_H - s(20));
    const rx = randomInt(s(24), s(75));
    const ry = randomInt(s(15), s(54));
    const angle = randomFloat(0, Math.PI);
    const cosA=Math.cos(angle), sinA=Math.sin(angle);
    const mode = getShapeMode();
    if (mode === 0) {
      for (let a2=0; a2<360; a2+=1) {
        const rad=a2*Math.PI/180;
        for (let d=-1; d<=1; d++) {
          const ex=cx+(rx+d)*Math.cos(rad), ey=cy+(ry+d)*Math.sin(rad);
          const ex2=cx+(ex-cx)*cosA - (ey-cy)*sinA;
          const ey2=cy+(ex-cx)*sinA + (ey-cy)*cosA;
          const px=Math.round(ex2), py=Math.round(ey2);
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.5) setPixel(px,py,col);
        }
      }
    } else {
      for (let dy=-ry; dy<=ry; dy++) {
        for (let dx=-rx; dx<=rx; dx++) {
          const rx2=dx*cosA - dy*sinA;
          const ry2=dx*sinA + dy*cosA;
          if ((rx2*rx2)/(rx*rx) + (ry2*ry2)/(ry*ry) <= 1 && rand()<0.85) {
            const px=cx+dx, py=cy+dy;
            if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
          }
        }
      }
    }
  }
}

function generateGeoDiamond(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(12), s(22)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(15), GRID_W - s(15));
    const cy = randomInt(s(15), GRID_H - s(15));
    const size = randomInt(s(18), s(66));
    const mode = getShapeMode();
    if (mode === 0) {
      const corners = [{x:cx,y:cy-size},{x:cx+size,y:cy},{x:cx,y:cy+size},{x:cx-size,y:cy}];
      for (let i=0; i<4; i++) {
        const j=(i+1)%4;
        const x1=corners[i].x, y1=corners[i].y, x2=corners[j].x, y2=corners[j].y;
        const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
        for (let step=0; step<=steps; step++) {
          const t=steps>0?step/steps:0;
          const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
        }
      }
    } else {
      for (let dy=-size; dy<=size; dy++) {
        const half=size*(1-Math.abs(dy)/size);
        for (let dx=-half; dx<=half; dx++) {
          const px=cx+dx, py=cy+dy;
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.7) setPixel(px,py,col);
        }
      }
    }
  }
}

function generateGeoPolygon(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  for (let cnt = 0; cnt < randomInt(s(8), s(12)); cnt++) {
    const col = pick(palette);
    const cx = randomInt(s(20), GRID_W - s(20));
    const cy = randomInt(s(20), GRID_H - s(20));
    const size = randomInt(s(30), s(75));
    const numSides = randomInt(5, 10);
    const mode = getShapeMode();
    const pts = [];
    for (let i=0; i<numSides; i++) {
      const a=(i/numSides)*2*Math.PI + randomFloat(-0.15,0.15);
      const r=size*randomFloat(0.8,1.0);
      pts.push({x: cx + r*Math.cos(a), y: cy + r*Math.sin(a)});
    }
    if (mode === 0) {
      for (let i=0; i<pts.length; i++) {
        const j=(i+1)%pts.length;
        const x1=Math.round(pts[i].x), y1=Math.round(pts[i].y);
        const x2=Math.round(pts[j].x), y2=Math.round(pts[j].y);
        const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
        for (let step=0; step<=steps; step++) {
          const t=steps>0?step/steps:0;
          const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
          if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
        }
      }
    } else {
      const minX=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.x))));
      const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(...pts.map(p=>p.x))));
      const minY=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.y))));
      const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(...pts.map(p=>p.y))));
      for (let y=minY; y<=maxY; y++) {
        let intersections=[];
        for (let i=0; i<numSides; i++) {
          const j=(i+1)%numSides;
          const p1=pts[i], p2=pts[j];
          if ((p1.y<=y && p2.y>y) || (p2.y<=y && p1.y>y)) {
            const x=p1.x+(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y);
            intersections.push(x);
          }
        }
        intersections.sort((a,b)=>a-b);
        for (let i=0; i<intersections.length-1; i+=2) {
          const x1=Math.max(0,Math.floor(intersections[i]));
          const x2=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
          for (let x=x1; x<=x2; x++) if (rand()<0.85) setPixel(x,y,col);
        }
      }
    }
  }
}

function generateGeoCombined(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const numShapes = randomInt(s(8), s(14));
  for (let sh = 0; sh < numShapes; sh++) {
    const shapeType = randomInt(0, 7);
    const col = pick(palette);
    const cx = randomInt(s(20), GRID_W - s(20));
    const cy = randomInt(s(20), GRID_H - s(20));
    const size = randomInt(s(24), s(66));
    const mode = getShapeMode();

    switch (shapeType) {
      case 0: {
        const r = size * 0.7;
        if (mode === 0) {
          for (let angle = 0; angle < 360; angle += 1) {
            const rad = angle * Math.PI / 180;
            const px = Math.round(cx + r * Math.cos(rad));
            const py = Math.round(cy + r * Math.sin(rad));
            if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) setPixel(px, py, col);
          }
        } else {
          fillCircle(cx, cy, r, col);
        }
        const starCol = pick(palette);
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * 2 * Math.PI - Math.PI / 2;
          const radius = (i % 2 === 0) ? size * 0.5 : size * 0.2;
          pts.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
        }
        for (let i = 0; i < pts.length; i++) {
          const j = (i + 1) % pts.length;
          const x1 = Math.round(pts[i].x), y1 = Math.round(pts[i].y);
          const x2 = Math.round(pts[j].x), y2 = Math.round(pts[j].y);
          const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
          for (let step = 0; step <= steps; step++) {
            const t = steps > 0 ? step / steps : 0;
            const px = Math.round(x1 + (x2 - x1) * t);
            const py = Math.round(y1 + (y2 - y1) * t);
            if (px >= 0 && px < GRID_W && py >= 0 && py < GRID_H) setPixel(px, py, starCol);
          }
        }
        break;
      }
      case 1: {
        const w = size * 1.2, h = size * 0.8;
        const angle = randomFloat(0, Math.PI * 2);
        const cosA = Math.cos(angle), sinA = Math.sin(angle);
        if (mode === 0) {
          const corners = [{x:-w/2,y:-h/2},{x:w/2,y:-h/2},{x:w/2,y:h/2},{x:-w/2,y:h/2}];
          const rotated = corners.map(p => ({x: cx + Math.round(p.x*cosA - p.y*sinA), y: cy + Math.round(p.x*sinA + p.y*cosA)}));
          for (let i = 0; i < 4; i++) {
            const j = (i+1)%4;
            const x1=rotated[i].x, y1=rotated[i].y, x2=rotated[j].x, y2=rotated[j].y;
            const steps = Math.max(Math.abs(x2-x1), Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0 && px<GRID_W && py>=0 && py<GRID_H) setPixel(px,py,col);
            }
          }
        } else {
          for (let dy=-h/2; dy<=h/2; dy++) {
            for (let dx=-w/2; dx<=w/2; dx++) {
              const px=cx+Math.round(dx*cosA - dy*sinA);
              const py=cy+Math.round(dx*sinA + dy*cosA);
              if (px>=0 && px<GRID_W && py>=0 && py<GRID_H && rand()<0.7) setPixel(px,py,col);
            }
          }
        }
        const triCol = pick(palette);
        const x1 = cx, y1 = cy - size * 0.6;
        const x2 = cx - size * 0.6, y2 = cy + size * 0.6;
        const x3 = cx + size * 0.6, y3 = cy + size * 0.6;
        const minX = Math.max(0, Math.floor(Math.min(x1, x2, x3)));
        const maxX = Math.min(GRID_W - 1, Math.ceil(Math.max(x1, x2, x3)));
        const minY = Math.max(0, Math.floor(Math.min(y1, y2, y3)));
        const maxY = Math.min(GRID_H - 1, Math.ceil(Math.max(y1, y2, y3)));
        for (let y = minY; y <= maxY; y++) {
          let intersections = [];
          const edges = [[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x1,y1]];
          for (let e=0; e<edges.length; e++) {
            const [x1e,y1e,x2e,y2e]=edges[e];
            if ((y1e<=y && y2e>y) || (y2e<=y && y1e>y)) {
              const x = x1e + (y - y1e) * (x2e - x1e) / (y2e - y1e);
              intersections.push(x);
            }
          }
          intersections.sort((a,b)=>a-b);
          for (let i=0; i<intersections.length-1; i+=2) {
            const x1i=Math.max(0,Math.floor(intersections[i]));
            const x2i=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
            for (let x=x1i; x<=x2i; x++) if (rand()<0.7) setPixel(x,y,triCol);
          }
        }
        break;
      }
      case 2: {
        const pts = [];
        for (let i=0; i<6; i++) {
          const angle=(i/6)*2*Math.PI - Math.PI/2;
          pts.push({x: cx+size*Math.cos(angle), y: cy+size*Math.sin(angle)});
        }
        if (mode === 0) {
          for (let i=0; i<6; i++) {
            const j=(i+1)%6;
            const x1=Math.round(pts[i].x), y1=Math.round(pts[i].y);
            const x2=Math.round(pts[j].x), y2=Math.round(pts[j].y);
            const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
            }
          }
        } else {
          const minX=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.x))));
          const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(...pts.map(p=>p.x))));
          const minY=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.y))));
          const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(...pts.map(p=>p.y))));
          for (let y=minY; y<=maxY; y++) {
            let intersections=[];
            for (let i=0; i<6; i++) {
              const j=(i+1)%6;
              const p1=pts[i], p2=pts[j];
              if ((p1.y<=y && p2.y>y) || (p2.y<=y && p1.y>y)) {
                const x=p1.x+(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y);
                intersections.push(x);
              }
            }
            intersections.sort((a,b)=>a-b);
            for (let i=0; i<intersections.length-1; i+=2) {
              const x1=Math.max(0,Math.floor(intersections[i]));
              const x2=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
              for (let x=x1; x<=x2; x++) if (rand()<0.6) setPixel(x,y,col);
            }
          }
        }
        const diaCol = pick(palette);
        const diaSize = size * 0.5;
        if (mode === 0) {
          const corners = [{x:cx,y:cy-diaSize},{x:cx+diaSize,y:cy},{x:cx,y:cy+diaSize},{x:cx-diaSize,y:cy}];
          for (let i=0; i<4; i++) {
            const j=(i+1)%4;
            const x1=corners[i].x, y1=corners[i].y, x2=corners[j].x, y2=corners[j].y;
            const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,diaCol);
            }
          }
        } else {
          for (let dy=-diaSize; dy<=diaSize; dy++) {
            const half=diaSize*(1-Math.abs(dy)/diaSize);
            for (let dx=-half; dx<=half; dx++) {
              const px=cx+dx, py=cy+dy;
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.6) setPixel(px,py,diaCol);
            }
          }
        }
        break;
      }
      case 3: {
        const rx = size * 0.8, ry = size * 0.5;
        const angle = randomFloat(0, Math.PI);
        const cosA=Math.cos(angle), sinA=Math.sin(angle);
        if (mode === 0) {
          for (let a2=0; a2<360; a2+=1) {
            const rad=a2*Math.PI/180;
            const ex=cx+rx*Math.cos(rad), ey=cy+ry*Math.sin(rad);
            const ex2=cx+(ex-cx)*cosA-(ey-cy)*sinA;
            const ey2=cy+(ex-cx)*sinA+(ey-cy)*cosA;
            const px=Math.round(ex2), py=Math.round(ey2);
            if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
          }
        } else {
          for (let dy=-ry; dy<=ry; dy++) {
            for (let dx=-rx; dx<=rx; dx++) {
              const rx2=dx*cosA - dy*sinA;
              const ry2=dx*sinA + dy*cosA;
              if ((rx2*rx2)/(rx*rx)+(ry2*ry2)/(ry*ry)<=1 && rand()<0.7) {
                const px=cx+dx, py=cy+dy;
                if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
              }
            }
          }
        }
        const starCol = pick(palette);
        const pts = [];
        for (let i=0; i<10; i++) {
          const a=(i/10)*2*Math.PI - Math.PI/2;
          const r=(i%2===0)?size*0.4:size*0.15;
          pts.push({x: cx+r*Math.cos(a), y: cy+r*Math.sin(a)});
        }
        for (let i=0; i<pts.length; i++) {
          const j=(i+1)%pts.length;
          const x1=Math.round(pts[i].x), y1=Math.round(pts[i].y);
          const x2=Math.round(pts[j].x), y2=Math.round(pts[j].y);
          const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
          for (let step=0; step<=steps; step++) {
            const t=steps>0?step/steps:0;
            const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
            if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,starCol);
          }
        }
        break;
      }
      case 4: {
        const x1=cx, y1=cy-size, x2=cx-size, y2=cy+size, x3=cx+size, y3=cy+size;
        if (mode === 0) {
          const edges=[[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x1,y1]];
          for (let e=0; e<edges.length; e++) {
            const [x1e,y1e,x2e,y2e]=edges[e];
            const steps=Math.max(Math.abs(x2e-x1e),Math.abs(y2e-y1e));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1e+(x2e-x1e)*t), py=Math.round(y1e+(y2e-y1e)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
            }
          }
        } else {
          const minX=Math.max(0,Math.floor(Math.min(x1,x2,x3)));
          const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(x1,x2,x3)));
          const minY=Math.max(0,Math.floor(Math.min(y1,y2,y3)));
          const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(y1,y2,y3)));
          for (let y=minY; y<=maxY; y++) {
            let intersections=[];
            const edges=[[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x1,y1]];
            for (let e=0; e<edges.length; e++) {
              const [x1e,y1e,x2e,y2e]=edges[e];
              if ((y1e<=y && y2e>y) || (y2e<=y && y1e>y)) {
                const x=x1e+(y-y1e)*(x2e-x1e)/(y2e-y1e);
                intersections.push(x);
              }
            }
            intersections.sort((a,b)=>a-b);
            for (let i=0; i<intersections.length-1; i+=2) {
              const x1i=Math.max(0,Math.floor(intersections[i]));
              const x2i=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
              for (let x=x1i; x<=x2i; x++) if (rand()<0.7) setPixel(x,y,col);
            }
          }
        }
        const circleCol=pick(palette);
        const r=size*0.35;
        if (mode===0) {
          for (let angle=0; angle<360; angle+=1) {
            const rad=angle*Math.PI/180;
            const px=Math.round(cx+r*Math.cos(rad));
            const py=Math.round(cy+size*0.2+r*Math.sin(rad));
            if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,circleCol);
          }
        } else {
          fillCircle(cx, cy+size*0.2, r, circleCol);
        }
        break;
      }
      case 5: {
        const diaSize = size * 0.8;
        if (mode === 0) {
          const corners = [{x:cx,y:cy-diaSize},{x:cx+diaSize,y:cy},{x:cx,y:cy+diaSize},{x:cx-diaSize,y:cy}];
          for (let i=0; i<4; i++) {
            const j=(i+1)%4;
            const x1=corners[i].x, y1=corners[i].y, x2=corners[j].x, y2=corners[j].y;
            const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
            }
          }
        } else {
          for (let dy=-diaSize; dy<=diaSize; dy++) {
            const half=diaSize*(1-Math.abs(dy)/diaSize);
            for (let dx=-half; dx<=half; dx++) {
              const px=cx+dx, py=cy+dy;
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.6) setPixel(px,py,col);
            }
          }
        }
        const rectCol=pick(palette);
        const w=size*0.5, h=size*0.5;
        const angle=randomFloat(0,Math.PI*2);
        const cosA=Math.cos(angle), sinA=Math.sin(angle);
        if (mode===0) {
          const corners=[{x:-w/2,y:-h/2},{x:w/2,y:-h/2},{x:w/2,y:h/2},{x:-w/2,y:h/2}];
          const rotated=corners.map(p=>({x:cx+Math.round(p.x*cosA-p.y*sinA), y:cy+Math.round(p.x*sinA+p.y*cosA)}));
          for (let i=0; i<4; i++) {
            const j=(i+1)%4;
            const x1=rotated[i].x, y1=rotated[i].y, x2=rotated[j].x, y2=rotated[j].y;
            const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,rectCol);
            }
          }
        } else {
          for (let dy=-h/2; dy<=h/2; dy++) {
            for (let dx=-w/2; dx<=w/2; dx++) {
              const px=cx+Math.round(dx*cosA-dy*sinA);
              const py=cy+Math.round(dx*sinA+dy*cosA);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.7) setPixel(px,py,rectCol);
            }
          }
        }
        break;
      }
      case 6: {
        const hexPts=[];
        for (let i=0; i<6; i++) {
          const angle=(i/6)*2*Math.PI - Math.PI/2;
          hexPts.push({x: cx+size*Math.cos(angle), y: cy+size*Math.sin(angle)});
        }
        if (mode===0) {
          for (let i=0; i<6; i++) {
            const j=(i+1)%6;
            const x1=Math.round(hexPts[i].x), y1=Math.round(hexPts[i].y);
            const x2=Math.round(hexPts[j].x), y2=Math.round(hexPts[j].y);
            const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
            }
          }
        } else {
          const minX=Math.max(0,Math.floor(Math.min(...hexPts.map(p=>p.x))));
          const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(...hexPts.map(p=>p.x))));
          const minY=Math.max(0,Math.floor(Math.min(...hexPts.map(p=>p.y))));
          const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(...hexPts.map(p=>p.y))));
          for (let y=minY; y<=maxY; y++) {
            let intersections=[];
            for (let i=0; i<6; i++) {
              const j=(i+1)%6;
              const p1=hexPts[i], p2=hexPts[j];
              if ((p1.y<=y && p2.y>y) || (p2.y<=y && p1.y>y)) {
                const x=p1.x+(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y);
                intersections.push(x);
              }
            }
            intersections.sort((a,b)=>a-b);
            for (let i=0; i<intersections.length-1; i+=2) {
              const x1=Math.max(0,Math.floor(intersections[i]));
              const x2=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
              for (let x=x1; x<=x2; x++) if (rand()<0.6) setPixel(x,y,col);
            }
          }
        }
        const starCol=pick(palette);
        const pts=[];
        for (let i=0; i<10; i++) {
          const angle=(i/10)*2*Math.PI - Math.PI/2;
          const radius=(i%2===0)?size*0.5:size*0.2;
          pts.push({x: cx+radius*Math.cos(angle), y: cy+radius*Math.sin(angle)});
        }
        for (let i=0; i<pts.length; i++) {
          const j=(i+1)%pts.length;
          const x1=Math.round(pts[i].x), y1=Math.round(pts[i].y);
          const x2=Math.round(pts[j].x), y2=Math.round(pts[j].y);
          const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
          for (let step=0; step<=steps; step++) {
            const t=steps>0?step/steps:0;
            const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
            if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,starCol);
          }
        }
        break;
      }
      case 7: {
        const numSides=randomInt(5,8);
        const polyPts=[];
        for (let i=0; i<numSides; i++) {
          const a=(i/numSides)*2*Math.PI + randomFloat(-0.15,0.15);
          const r=size*randomFloat(0.8,1.0);
          polyPts.push({x: cx+r*Math.cos(a), y: cy+r*Math.sin(a)});
        }
        if (mode===0) {
          for (let i=0; i<polyPts.length; i++) {
            const j=(i+1)%polyPts.length;
            const x1=Math.round(polyPts[i].x), y1=Math.round(polyPts[i].y);
            const x2=Math.round(polyPts[j].x), y2=Math.round(polyPts[j].y);
            const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
            for (let step=0; step<=steps; step++) {
              const t=steps>0?step/steps:0;
              const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
              if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
            }
          }
        } else {
          const minX=Math.max(0,Math.floor(Math.min(...polyPts.map(p=>p.x))));
          const maxX=Math.min(GRID_W-1,Math.ceil(Math.max(...polyPts.map(p=>p.x))));
          const minY=Math.max(0,Math.floor(Math.min(...polyPts.map(p=>p.y))));
          const maxY=Math.min(GRID_H-1,Math.ceil(Math.max(...polyPts.map(p=>p.y))));
          for (let y=minY; y<=maxY; y++) {
            let intersections=[];
            for (let i=0; i<numSides; i++) {
              const j=(i+1)%numSides;
              const p1=polyPts[i], p2=polyPts[j];
              if ((p1.y<=y && p2.y>y) || (p2.y<=y && p1.y>y)) {
                const x=p1.x+(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y);
                intersections.push(x);
              }
            }
            intersections.sort((a,b)=>a-b);
            for (let i=0; i<intersections.length-1; i+=2) {
              const x1=Math.max(0,Math.floor(intersections[i]));
              const x2=Math.min(GRID_W-1,Math.ceil(intersections[i+1]));
              for (let x=x1; x<=x2; x++) if (rand()<0.7) setPixel(x,y,col);
            }
          }
        }
        const circleCol=pick(palette);
        const r=size*0.35;
        if (mode===0) {
          for (let angle=0; angle<360; angle+=1) {
            const rad=angle*Math.PI/180;
            const px=Math.round(cx+r*Math.cos(rad));
            const py=Math.round(cy+r*Math.sin(rad));
            if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,circleCol);
          }
        } else {
          fillCircle(cx, cy, r, circleCol);
        }
        break;
      }
    }
  }
}