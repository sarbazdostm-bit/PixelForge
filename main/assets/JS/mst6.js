// ============================================================
// mst6.js - نویز، کاشی، گرادیان، انتزاعی - با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function generateNoise(palette) {
  const freq = randomFloat(0.01, 0.05);
  const octaves = randomInt(3, 6);
  function hash(x,y) { let h = x*374761393 + y*668265263; h = (h^(h>>13))*1274126177; h = h^(h>>16); return (h&0x7fffffff)/0x7fffffff; }
  function smoothNoise(x,y,f) {
    const ix=Math.floor(x*f), iy=Math.floor(y*f), fx=x*f-ix, fy=y*f-iy;
    const sx=fx*fx*(3-2*fx), sy=fy*fy*(3-2*fy);
    const v00=hash(ix,iy), v10=hash(ix+1,iy), v01=hash(ix,iy+1), v11=hash(ix+1,iy+1);
    const v0=v00+(v10-v00)*sx, v1=v01+(v11-v01)*sx;
    return v0+(v1-v0)*sy;
  }
  let minVal=Infinity, maxVal=-Infinity, noiseMap=[];
  for (let y=0; y<GRID_H; y++) for (let x=0; x<GRID_W; x++) {
    let val=0, amp=1, freqMul=1;
    for (let o=0; o<octaves; o++) { val += amp*smoothNoise(x,y,freq*freqMul); amp*=0.5; freqMul*=2; }
    if (val<minVal) minVal=val; if (val>maxVal) maxVal=val; noiseMap.push(val);
  }
  const range=maxVal-minVal || 1;
  for (let i=0; i<noiseMap.length; i++) {
    const norm=(noiseMap[i]-minVal)/range;
    const idx=Math.floor(norm*(palette.length-1));
    pixelData[i]=palette[Math.min(idx, palette.length-1)];
  }
}

function generateTiles(palette) {
  const tileSize = randomInt(s(15), s(45));
  const numPatterns = randomInt(4, 8);
  for (let y=0; y<GRID_H; y++) for (let x=0; x<GRID_W; x++) {
    const tx=Math.floor(x/tileSize), ty=Math.floor(y/tileSize);
    const lx=x%tileSize, ly=y%tileSize;
    const seedVal=(tx*7919+ty*104729)&0xffff;
    const localRand=mulberry32(seedVal+currentSeed);
    const patternIdx=Math.floor(localRand()*numPatterns);
    let colorIdx=0;
    if (patternIdx===0) colorIdx=(lx+ly)%palette.length;
    else if (patternIdx===1) colorIdx=((lx%2)^(ly%2))?0:1;
    else if (patternIdx===2) colorIdx=(lx%3)%palette.length;
    else if (patternIdx===3) colorIdx=(ly%4)%palette.length;
    else if (patternIdx===4) colorIdx=localRand()<0.3?Math.floor(localRand()*palette.length):0;
    else { const cx=tileSize/2, cy=tileSize/2; const dist=Math.sqrt((lx-cx)**2+(ly-cy)**2); colorIdx=Math.floor(dist/(tileSize/2)*(palette.length-1))%palette.length; }
    setPixel(x,y, palette[colorIdx % palette.length]);
  }
}

function generateGradient(palette) {
  const mode=randomInt(0,3), cx=GRID_W/2, cy=GRID_H/2;
  for (let y=0; y<GRID_H; y++) for (let x=0; x<GRID_W; x++) {
    let t=0;
    if (mode===0) t=x/GRID_W;
    else if (mode===1) t=y/GRID_H;
    else if (mode===2) t=Math.sqrt((x-cx)**2+(y-cy)**2)/Math.sqrt(cx*cx+cy*cy);
    else t=(x+y)/(GRID_W+GRID_H);
    t=Math.min(1,Math.max(0,t));
    const idx=Math.floor(t*(palette.length-1));
    setPixel(x,y, palette[idx % palette.length]);
  }
}

function generateAbstract(palette) {
  const bg=pick(palette);
  for (let i=0; i<pixelData.length; i++) pixelData[i]=bg;
  for (let b=0; b<randomInt(s(8), s(22)); b++) {
    const cx=randomInt(0,GRID_W-1), cy=randomInt(0,GRID_H-1);
    const radius=randomInt(s(12), Math.floor(Math.min(GRID_W,GRID_H)*0.3));
    const col=pick(palette), density=randomFloat(0.4,0.9);
    for (let y=Math.max(0,cy-radius); y<Math.min(GRID_H,cy+radius); y++) {
      for (let x=Math.max(0,cx-radius); x<Math.min(GRID_W,cx+radius); x++) {
        const dist=Math.sqrt((x-cx)**2+(y-cy)**2);
        if (dist<radius && rand()<(1-dist/radius)*density) setPixel(x,y,col);
      }
    }
  }
  for (let l=0; l<randomInt(s(7), s(18)); l++) {
    const x1=randomInt(0,GRID_W-1), y1=randomInt(0,GRID_H-1);
    const x2=randomInt(0,GRID_W-1), y2=randomInt(0,GRID_H-1);
    const col=pick(palette);
    const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
    for (let s=0; s<=steps; s++) {
      const t=steps>0?s/steps:0;
      const px=Math.round(x1+(x2-x1)*t), py=Math.round(y1+(y2-y1)*t);
      if (px>=0&&px<GRID_W&&py>=0&&py<GRID_H&&rand()<0.7) setPixel(px,py,col);
    }
  }
}