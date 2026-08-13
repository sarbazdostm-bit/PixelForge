// ============================================================
// mst7.js - الگوریتم ترسناک - با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function generateHorror(palette) {
  const bg = pick(palette);
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = bg;
  const numCreatures = randomInt(1, 3);
  for (let c=0; c<numCreatures; c++) {
    const ox = randomInt(s(20), GRID_W - s(20));
    const oy = randomInt(s(20), GRID_H - s(20));
    const size = randomInt(s(40), s(80));
    const bodyColor = pick(palette);
    for (let y=oy-size; y<oy+size; y++) {
      for (let x=ox-Math.floor(size*0.7); x<ox+Math.floor(size*0.7); x++) {
        const dx=(x-ox)/(size*0.7), dy=(y-oy)/size;
        if (dx*dx+dy*dy <= 1 && rand()<0.8) setPixel(x,y,bodyColor);
      }
    }
    const numEyes = randomInt(4, 8);
    const eyeColors = [pick(palette), pick(palette), pick(palette)];
    for (let e=0; e<numEyes; e++) {
      const angle=rand()*2*Math.PI, dist=randomFloat(0.2,0.7)*size;
      const ex=ox+Math.floor(dist*Math.cos(angle)), ey=oy+Math.floor(dist*Math.sin(angle));
      const eyeR=randomInt(s(3), s(6)), eyeColor=pick(eyeColors);
      fillCircle(ex, ey, eyeR, eyeColor);
      fillCircle(ex+randomInt(-1,1), ey+randomInt(-1,1), 1, '#ff0000');
    }
    const mouthColor=pick(palette), mouthW=Math.floor(size*0.6), mouthY=oy+Math.floor(size*0.3);
    for (let x=ox-mouthW/2; x<ox+mouthW/2; x++) {
      const dy=Math.floor(Math.sin((x-ox)/(mouthW/2)*Math.PI)*s(4) + s(2));
      setPixel(x, mouthY+dy, mouthColor);
      if (rand()<0.2) { setPixel(x, mouthY+dy-s(2), '#cccccc'); setPixel(x+1, mouthY+dy-s(3), '#cccccc'); }
    }
    const numArms = randomInt(s(5), s(10));
    for (let a=0; a<numArms; a++) {
      const angle=rand()*2*Math.PI, len=randomInt(size, size*2);
      const endX=ox+Math.floor(len*Math.cos(angle)), endY=oy+Math.floor(len*Math.sin(angle));
      const armColor=pick(palette);
      drawLine(ox+Math.floor(size*0.4*Math.cos(angle)), oy+Math.floor(size*0.4*Math.sin(angle)), endX, endY, armColor);
      for (let f=-2; f<=2; f++) {
        const fx=endX+Math.floor(f*Math.cos(angle+0.5)), fy=endY+Math.floor(f*Math.sin(angle+0.5));
        if (fx>=0&&fx<GRID_W&&fy>=0&&fy<GRID_H) setPixel(fx,fy,'#cc0000');
      }
    }
    const bloodColor=pick(palette);
    for (let i=0; i<s(30); i++) {
      const bx=ox+randomInt(-size,size), by=oy+randomInt(-size,size);
      if (bx>=0&&bx<GRID_W&&by>=0&&by<GRID_H&&rand()<0.5) setPixel(bx,by,bloodColor);
    }
  }
  for (let i=0; i<s(15); i++) {
    const ex=randomInt(s(10), GRID_W-s(10)), ey=randomInt(s(10), GRID_H-s(10));
    const eyeR=randomInt(s(2), s(4)), eyeColor=pick(palette);
    fillCircle(ex, ey, eyeR, eyeColor);
    setPixel(ex+1, ey, '#ff0000');
  }
}