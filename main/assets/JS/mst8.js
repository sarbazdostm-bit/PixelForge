// ============================================================
// mst8.js - الگوریتم فراماسونری - با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function generateMasonic(palette) {
  const bg = pick(palette);
  for (let i=0; i<pixelData.length; i++) pixelData[i] = bg;
  const cx=Math.floor(GRID_W/2), cy=Math.floor(GRID_H/2);
  for (let layer=0; layer<6; layer++) {
    const size = s(30) + layer*s(21) + randomInt(-s(5), s(5));
    const color = pick(palette);
    const offsetX=randomInt(-s(8), s(8)), offsetY=randomInt(-s(8), s(8));
    for (let y=cy-size+offsetY; y<=cy+size+offsetY; y++) {
      const half = (y - (cy-size+offsetY)) * (size/(size*2));
      const x1 = cx - Math.floor(half) + offsetX, x2 = cx + Math.floor(half) + offsetX;
      for (let x=x1; x<=x2; x++) {
        if (x>=0&&x<GRID_W&&y>=0&&y<GRID_H&&rand()<0.6) setPixel(x,y,color);
      }
    }
  }
  for (let cnt=0; cnt<s(10); cnt++) {
    const ex = cx+randomInt(-s(40), s(40)), ey = cy+randomInt(-s(40), s(40));
    const r = randomInt(s(4), s(8)), eyeColor = pick(palette);
    fillCircle(ex, ey, r, eyeColor);
    setPixel(ex+1, ey, pick(palette)); setPixel(ex-1, ey, pick(palette));
    const rayColor=pick(palette);
    for (let a=0; a<8; a++) {
      const angle=a*Math.PI/4;
      for (let d=1; d<=r*1.5; d++) {
        const px=ex+Math.floor(d*Math.cos(angle)), py=ey+Math.floor(d*Math.sin(angle));
        if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.3) setPixel(px,py,rayColor);
      }
    }
  }
  for (let r=s(15); r<s(70); r+=randomInt(s(8), s(15))) {
    const color=pick(palette);
    drawCircle(cx, cy, r, color);
  }
  for (let cnt=0; cnt<s(10); cnt++) {
    const sx=randomInt(s(15), GRID_W-s(15)), sy=randomInt(s(15), GRID_H-s(15));
    const starSize=randomInt(s(6), s(15)), color=pick(palette);
    const pts=[];
    for (let i=0; i<5; i++) {
      const a=(i*2*Math.PI/5) - Math.PI/2;
      pts.push({x: sx+starSize*Math.cos(a), y: sy+starSize*Math.sin(a)});
    }
    for (let i=0; i<5; i++) {
      const j=(i+2)%5;
      drawLine(pts[i].x, pts[i].y, pts[j].x, pts[j].y, color);
    }
  }
  for (let cnt=0; cnt<s(8); cnt++) {
    const y=randomInt(s(10), GRID_H-s(10)), color=pick(palette);
    for (let x=s(10); x<GRID_W-s(10); x++) {
      if (rand()<0.2) setPixel(x, y+randomInt(-s(3), s(3)), color);
    }
  }
}