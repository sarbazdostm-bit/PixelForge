// ============================================================
// mst9.js - الگوریتم نمادها - با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function generateOccult(palette) {
  const bg = pick(palette);
  for (let i=0; i<pixelData.length; i++) pixelData[i] = bg;

  function drawPentagram(x,y,r,col) {
    const pts=[];
    for (let i=0; i<5; i++) {
      const a=(i*2*Math.PI/5) - Math.PI/2;
      pts.push({x: x+r*Math.cos(a), y: y+r*Math.sin(a)});
    }
    for (let i=0; i<5; i++) {
      const j=(i+2)%5;
      drawLine(pts[i].x, pts[i].y, pts[j].x, pts[j].y, col);
    }
  }

  function drawCrescent(x,y,r,col) {
    for (let a=-Math.PI/2; a<=Math.PI/2; a+=0.03) {
      for (let d=0; d<=r; d++) {
        const px=x+Math.floor(d*Math.cos(a)), py=y+Math.floor(d*Math.sin(a));
        if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
      }
    }
    const r2=r*0.6;
    for (let a=-Math.PI/2; a<=Math.PI/2; a+=0.03) {
      for (let d=0; d<=r2; d++) {
        const px=x+Math.floor(d*Math.cos(a)+r*0.3), py=y+Math.floor(d*Math.sin(a));
        if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,bg);
      }
    }
  }

  function drawCross(x,y,size,col) {
    for (let dx=-size; dx<=size; dx++) if (x+dx>=0&&x+dx<GRID_W) setPixel(x+dx,y,col);
    for (let dy=-size; dy<=size; dy++) if (y+dy>=0&&y+dy<GRID_H) setPixel(x,y+dy,col);
  }

  function drawTriangle(x,y,size,col) {
    for (let dy=-size; dy<=size; dy++) {
      const half=size*(1-Math.abs(dy)/size);
      for (let dx=-half; dx<=half; dx++) {
        const px=x+dx, py=y+dy;
        if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
      }
    }
  }

  function drawSpiral(x,y,col) {
    let angle=0, radius=1;
    while (radius<s(50)) {
      const px=x+Math.floor(radius*Math.cos(angle)), py=y+Math.floor(radius*Math.sin(angle));
      if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
      angle += 0.12; radius += 0.3;
    }
  }

  function drawSunWheel(x,y,r,col) {
    for (let i=0; i<8; i++) {
      const a=i*Math.PI/4;
      for (let d=0; d<=r; d++) {
        const px=x+Math.floor(d*Math.cos(a)), py=y+Math.floor(d*Math.sin(a));
        if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
      }
    }
    drawCircle(x, y, Math.floor(r*0.4), col);
  }

  function drawAnkh(x,y,size,col) {
    drawLine(x, y-size, x, y+size, col);
    drawLine(x-size/2, y, x+size/2, y, col);
    drawCircle(x, y-size/2, size/3, col);
  }

  function drawEye(x,y,r,col) {
    fillCircle(x,y,r,col);
    fillCircle(x+1,y,1,pick(palette));
    fillCircle(x-1,y,1,pick(palette));
  }

  const symbolTypes = [drawPentagram, drawCrescent, drawCross, drawTriangle, drawSpiral, drawSunWheel, drawAnkh, drawEye];
  const numSymbols = randomInt(s(4), s(7));
  for (let cnt=0; cnt<numSymbols; cnt++) {
    const type=pick(symbolTypes);
    const x=randomInt(s(25), GRID_W-s(25)), y=randomInt(s(25), GRID_H-s(25));
    const size=randomInt(s(18), s(48)), color=pick(palette);
    type(x, y, size, color);
  }
  for (let cnt=0; cnt<s(8); cnt++) {
    const x1=randomInt(0,GRID_W), y1=randomInt(0,GRID_H);
    const x2=randomInt(0,GRID_W), y2=randomInt(0,GRID_H);
    const col=pick(palette);
    const steps=Math.max(Math.abs(x2-x1), Math.abs(y2-y1));
    for (let t=0; t<=steps; t++) {
      const frac=steps>0?t/steps:0;
      const px=Math.round(x1+(x2-x1)*frac), py=Math.round(y1+(y2-y1)*frac + s(5)*Math.sin(frac*Math.PI*2));
      if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H) setPixel(px,py,col);
    }
  }
}