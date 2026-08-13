// ============================================================
// mst1.js - تنظیمات با عرض و ارتفاع مجزا + تابع s سراسری
// ============================================================

'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');
const rerollBtn = document.getElementById('rerollBtn');
const styleSelect = document.getElementById('styleSelect');
const paletteSelect = document.getElementById('paletteSelect');
const stats = document.getElementById('stats');
const seedDisplay = document.getElementById('seedDisplay');
const algoName = document.getElementById('algoName');
const gridWidthSelect = document.getElementById('gridWidthSelect');
const gridHeightSelect = document.getElementById('gridHeightSelect');
const pixelSizeSelect = document.getElementById('pixelSizeSelect');

let GRID_W = 300;
let GRID_H = 300;
let GRID_SIZE = 300; // بزرگترین بعد برای مقیاس‌پذیری
let PIXEL_SIZE = 2;
let CANVAS_W = GRID_W * PIXEL_SIZE;
let CANVAS_H = GRID_H * PIXEL_SIZE;

let currentSeed = 0;
let pixelData = [];
let rand = null;

// ========== تابع مقیاس‌پذیری (همیشه در دسترس) ==========
function s(val) {
  const base = 300;
  const ratio = GRID_SIZE / base;
  return Math.max(1, Math.round(val * ratio));
}
// 👇 این خط تابع رو به صورت سراسری در دسترس همه قرار میده
window.s = s;

const palettes = {
  sunset: ['#ff6b6b','#feca57','#ff9ff3','#f368e0','#ee5a24','#ff9f43','#feca57','#ff6b6b'],
  ocean: ['#48dbfb','#0abde3','#10ac84','#01a3a4','#54a0ff','#2e86de','#1dd1a1','#00d2d3'],
  forest: ['#2ecc71','#27ae60','#1abc9c','#16a085','#2c3e50','#34495e','#7f8c8d','#95a5a6'],
  neon: ['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff','#ff8800','#8800ff'],
  pastel: ['#ffb8b8','#b8d4ff','#b8ffb8','#ffd4b8','#e8b8ff','#b8ffff','#ffb8e8','#d4b8ff'],
  mono: ['#111','#333','#555','#777','#999','#bbb','#ddd','#fff'],
  vintage: ['#8b5a2b','#d4a373','#fae1dd','#b8a99a','#6b4f3c','#a67c52','#d9c5b2','#e3d5c0'],
  dark: ['#0a0a0a','#1a0a0a','#2d0505','#4a0808','#6a0a0a','#8a0a0a','#aa0a0a','#cc0a0a']
};

function getPaletteColors(name) {
  if (name === 'random') {
    const keys = Object.keys(palettes);
    return palettes[keys[Math.floor(Math.random() * keys.length)]];
  }
  return palettes[name] || palettes.sunset;
}

function setDimensions(w, h, pixel) {
  GRID_W = Math.min(400, Math.max(10, parseInt(w) || 300));
  GRID_H = Math.min(400, Math.max(10, parseInt(h) || 300));
  GRID_SIZE = Math.max(GRID_W, GRID_H);
  PIXEL_SIZE = Math.min(5, Math.max(1, parseInt(pixel) || 2));
  CANVAS_W = GRID_W * PIXEL_SIZE;
  CANVAS_H = GRID_H * PIXEL_SIZE;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  canvas.style.width = Math.min(600, CANVAS_W) + 'px';
  canvas.style.height = Math.min(600, CANVAS_H) + 'px';
  stats.textContent = `${GRID_W}×${GRID_H} · ${PIXEL_SIZE}px`;
  pixelData = new Array(GRID_W * GRID_H);
  if (rand === null) {
    reseed(Math.floor(Math.random() * 2147483647));
  }
}
