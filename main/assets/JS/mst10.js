// ============================================================
// mst10.js - کنترل‌ها، رویدادها و راه‌اندازی - با عرض و ارتفاع مجزا
// ============================================================

'use strict';

function generateArt(style, paletteName, seed) {
    if (seed === undefined) seed = Math.floor(Math.random() * 2147483647);
    reseed(seed);
    pixelData = new Array(GRID_W * GRID_H);

    const paletteColors = getPaletteColors(paletteName);
    let selectedStyle = style;

    if (style === 'random') {
        const allStyles = [
            'wave_sin', 'wave_triangle', 'wave_square', 'wave_sawtooth', 'wave_pulse', 'wave_combined',
            'geo_circle', 'geo_rect', 'geo_triangle', 'geo_hexagon', 'geo_star', 'geo_ellipse', 'geo_diamond', 'geo_polygon', 'geo_combined',
            'fractal_tree', 'fractal_pitie', 'fractal_koch', 'fractal_sierpinski', 'fractal_combined',
            'noise', 'tiles', 'gradient', 'abstract',
            'nature_tree', 'nature_forest',
            'horror', 'masonic', 'sacred_random'
        ];
        selectedStyle = pick(allStyles);
    }

    switch (selectedStyle) {
        case 'wave_sin': generateWaveSin(paletteColors); break;
        case 'wave_triangle': generateWaveTriangle(paletteColors); break;
        case 'wave_square': generateWaveSquare(paletteColors); break;
        case 'wave_sawtooth': generateWaveSawtooth(paletteColors); break;
        case 'wave_pulse': generateWavePulse(paletteColors); break;
        case 'wave_combined': generateWaveCombined(paletteColors); break;
        case 'geo_circle': generateGeoCircle(paletteColors); break;
        case 'geo_rect': generateGeoRect(paletteColors); break;
        case 'geo_triangle': generateGeoTriangle(paletteColors); break;
        case 'geo_hexagon': generateGeoHexagon(paletteColors); break;
        case 'geo_star': generateGeoStar(paletteColors); break;
        case 'geo_ellipse': generateGeoEllipse(paletteColors); break;
        case 'geo_diamond': generateGeoDiamond(paletteColors); break;
        case 'geo_polygon': generateGeoPolygon(paletteColors); break;
        case 'geo_combined': generateGeoCombined(paletteColors); break;
        case 'fractal_tree': generateFractalTree(paletteColors); break;
        case 'fractal_pitie': generateFractalPitie(paletteColors); break;
        case 'fractal_koch': generateFractalKoch(paletteColors); break;
        case 'fractal_sierpinski': generateFractalSierpinski(paletteColors); break;
        case 'fractal_combined': generateFractalCombined(paletteColors); break;
        case 'noise': generateNoise(paletteColors); break;
        case 'tiles': generateTiles(paletteColors); break;
        case 'gradient': generateGradient(paletteColors); break;
        case 'abstract': generateAbstract(paletteColors); break;
        case 'nature_tree': generateNatureTree(paletteColors); break;
        case 'nature_forest': generateNatureForest(paletteColors); break;
        case 'horror': generateHorror(paletteColors); break;
        case 'masonic': generateMasonic(paletteColors); break;
        case 'sacred_random': generateSacredRandom(paletteColors); break;
        default: generateWaveSin(paletteColors);
    }

    const styleNames = {
        wave_sin: 'موج سینوسی',
        wave_triangle: 'موج مثلثی',
        wave_square: 'موج مربعی',
        wave_sawtooth: 'موج دندانه‌ای',
        wave_pulse: 'موج پالس',
        wave_combined: 'موج ترکیبی',
        geo_circle: 'دایره',
        geo_rect: 'مستطیل',
        geo_triangle: 'مثلث',
        geo_hexagon: 'شش‌ضلعی',
        geo_star: 'ستاره',
        geo_ellipse: 'بیضی',
        geo_diamond: 'لوزی',
        geo_polygon: 'چندضلعی',
        geo_combined: 'هندسی ترکیبی',
        fractal_tree: 'درخت کلاسیک',
        fractal_pitie: 'درخت پیتی',
        fractal_koch: 'برف‌دانه کخ',
        fractal_sierpinski: 'مثلث سرپینسکی',
        fractal_combined: 'فراکتال ترکیبی',
        noise: 'نویز',
        tiles: 'کاشی',
        gradient: 'گرادیان',
        abstract: 'انتزاعی',
        nature_tree: '🌳 درخت کلاسیک',
        nature_forest: '🌲 جنگل',
        horror: 'ترسناک',
        masonic: 'فراماسونری',
        sacred_random: '🔮 نمادها'
    };
    algoName.textContent = 'الگوریتم: ' + (styleNames[selectedStyle] || selectedStyle);
    render();
    saveState(style, paletteName, seed);
    
    // ============================================================
    // تولید پرامپت انگلیسی برای هوش مصنوعی
    // ============================================================
    var promptText = generatePrompt(style, paletteName, selectedStyle, paletteColors);
    var promptField = document.getElementById('promptText');
    if (promptField) {
        promptField.value = promptText;
    }
}

// ============================================================
// تولید پرامپت انگلیسی برای هوش مصنوعی
// ============================================================
function generatePrompt(style, paletteName, selectedStyle, paletteColors) {
    var styleNames = {
        wave_sin: 'smooth sine wave pattern with flowing curves',
        wave_triangle: 'sharp triangle wave pattern with zigzag lines',
        wave_square: 'square wave pattern with stepped blocks',
        wave_sawtooth: 'sawtooth wave pattern with sharp drops',
        wave_pulse: 'pulse wave pattern like ripples in water',
        wave_combined: 'combined wave pattern mixing different wave types',
        geo_circle: 'geometric circles in various sizes',
        geo_rect: 'geometric rectangles and squares',
        geo_triangle: 'geometric triangles in different orientations',
        geo_hexagon: 'geometric hexagons honeycomb style',
        geo_star: 'geometric stars with sharp points',
        geo_ellipse: 'geometric ellipses and ovals',
        geo_diamond: 'geometric diamonds and rhombuses',
        geo_polygon: 'geometric polygons with multiple sides',
        geo_combined: 'combined geometric shapes and patterns',
        fractal_tree: 'classic fractal tree branching pattern',
        fractal_pitie: 'Pitie fractal tree with organic growth',
        fractal_koch: 'Koch snowflake fractal pattern',
        fractal_sierpinski: 'Sierpinski triangle fractal',
        fractal_combined: 'combined fractal patterns and structures',
        noise: 'random noise texture and organic patterns',
        tiles: 'tiled patterns with repeating designs',
        gradient: 'smooth color gradient transitions',
        abstract: 'abstract artistic composition with free forms',
        nature_tree: 'natural tree with branches and leaves',
        nature_forest: 'forest with multiple trees and nature elements',
        horror: 'horror themed creatures with multiple eyes and arms',
        masonic: 'masonic symbols and mysterious geometric patterns',
        sacred_random: 'sacred symbols and mystical geometric patterns'
    };

    var paletteNames = {
        random: 'random colors',
        sunset: 'sunset colors (orange, red, pink, warm tones)',
        ocean: 'ocean colors (blue, teal, cyan, deep blue)',
        forest: 'forest colors (green, brown, dark earthy tones)',
        neon: 'neon colors (bright, vibrant, glowing colors)',
        pastel: 'pastel colors (soft, gentle, muted tones)',
        mono: 'monochrome (black, white, grayscale)',
        vintage: 'vintage colors (warm, faded, retro tones)',
        dark: 'dark colors (deep, moody, shadowy tones)'
    };

    var styleDesc = styleNames[selectedStyle] || selectedStyle;
    var paletteDesc = paletteNames[paletteName] || paletteName;
    var colorsList = paletteColors.join(', ');
    
    var prompt = 'Create a pixel art image with dimensions ' + GRID_W + 'x' + GRID_H + ' pixels. ' +
                 'Style: ' + styleDesc + '. ' +
                 'Color palette: ' + paletteDesc + ' with colors: ' + colorsList + '. ' +
                 'The image should be high quality with detailed pixel art. ' +
                 'Please generate a similar or improved version of this pixel art. ' +
                 'Keep the pixel art aesthetic and maintain the same artistic style.';

    return prompt;
}

// ============================================================
// کپی پرامپت در کلیپ‌بورد
// ============================================================
function copyPrompt() {
    var promptField = document.getElementById('promptText');
    if (!promptField) {
        showToast('⚠️ Error: Prompt field not found');
        return;
    }
    
    var prompt = promptField.value;
    if (!prompt || prompt.trim() === '') {
        showToast('⚠️ Please generate an artwork first!');
        return;
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prompt).then(function() {
            showToast('✅ Prompt copied!');
        }).catch(function() {
            fallbackCopy(prompt);
        });
    } else {
        fallbackCopy(prompt);
    }
}

function fallbackCopy(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('✅ Prompt copied!');
    } catch (e) {
        showToast('❌ Failed to copy');
    }
    document.body.removeChild(textArea);
}

function saveState(style, palette, seed) {
    try {
        localStorage.setItem('pixelArt_style', style);
        localStorage.setItem('pixelArt_palette', palette);
        localStorage.setItem('pixelArt_seed', String(seed));
    } catch(e) {}
}

function loadState() {
    try {
        var style = localStorage.getItem('pixelArt_style');
        var palette = localStorage.getItem('pixelArt_palette');
        var seed = parseInt(localStorage.getItem('pixelArt_seed'), 10);
        return { style: style, palette: palette, seed: isNaN(seed) ? null : seed };
    } catch(e) { return {}; }
}

// ============================================================
// تابع ذخیره PNG - با پشتیبانی از Android WebView
// ============================================================
function exportPNG() {
    render();
    var dataUrl = canvas.toDataURL('image/png');
    
    if (window.Android) {
        window.Android.saveImage(dataUrl);
        showToast('✅ Saving...');
    } else {
        var link = document.createElement('a');
        link.download = 'pixelart_' + currentSeed + '_' + Date.now() + '.png';
        link.href = dataUrl;
        link.click();
        showToast('✅ Image saved');
    }
}

// ============================================================
// تابع نمایش پیام
// ============================================================
function showToast(message) {
    if (window.Android) {
        window.Android.showToast(message);
        return;
    }
    
    var toast = document.getElementById('toastMessage');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastMessage';
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:12px 28px;border-radius:30px;font-size:14px;z-index:999;opacity:0;transition:opacity 0.4s ease;pointer-events:none;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.style.opacity = '0';
    }, 2500);
}

function generateWithSettings() {
    var style = styleSelect.value;
    var palette = paletteSelect.value;
    generateArt(style, palette, Math.floor(Math.random() * 2147483647));
}

function reroll() {
    var style = styleSelect.value;
    var palette = paletteSelect.value;
    generateArt(style, palette, Math.floor(Math.random() * 2147483647));
}

function updateDimensionsAndGenerate() {
    var w = parseInt(gridWidthSelect.value) || 300;
    var h = parseInt(gridHeightSelect.value) || 300;
    var pixel = parseInt(pixelSizeSelect.value) || 2;
    setDimensions(w, h, pixel);
    generateWithSettings();
}

// ---- Events ----
generateBtn.addEventListener('click', generateWithSettings);
rerollBtn.addEventListener('click', reroll);
exportBtn.addEventListener('click', exportPNG);

var copyBtn = document.getElementById('copyPromptBtn');
if (copyBtn) {
    copyBtn.addEventListener('click', copyPrompt);
}

styleSelect.addEventListener('change', generateWithSettings);
paletteSelect.addEventListener('change', generateWithSettings);
gridWidthSelect.addEventListener('change', updateDimensionsAndGenerate);
gridHeightSelect.addEventListener('change', updateDimensionsAndGenerate);
pixelSizeSelect.addEventListener('change', updateDimensionsAndGenerate);

document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        generateWithSettings();
    }
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        reroll();
    }
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        exportPNG();
    }
});

// ---- Initial ----
var saved = loadState();
if (saved.style && saved.palette) {
    styleSelect.value = saved.style;
    paletteSelect.value = saved.palette;
    var seed = saved.seed !== null ? saved.seed : Math.floor(Math.random() * 2147483647);
    setDimensions(300, 300, 2);
    generateArt(saved.style, saved.palette, seed);
} else {
    setDimensions(300, 300, 2);
    generateArt('random', 'random', Math.floor(Math.random() * 2147483647));
    styleSelect.value = 'random';
    paletteSelect.value = 'random';
}

console.log('🎨 مولد هنر پیکسلی با ابعاد مستطیلی (عرض و ارتفاع جداگانه)');
console.log('〰️ موجی (۶ نوع) · 🔷 هندسی (۹ نوع) · 🌿 فراکتال (۵ نوع) · 🎨 سایر (۴ نوع)');
console.log('🌳 طبیعت (۲ نوع) · 👻 ویژه (۳ نوع)');
console.log('📐 محدوده ابعاد: ۱۰ تا ۴۰۰ پیکسل در هر بعد');