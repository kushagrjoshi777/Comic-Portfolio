/**
 * world.js — Builds the full illustrated mountain world as SVG
 * The world SVG has a 1000×3600 viewBox (tall vertical world).
 * Base camp at the bottom (~y=3400), summit at the top (~y=50).
 *
 * Visual style: flat-shaded, Cairn-inspired, semi-realistic illustrative.
 * No photos. Consistent SVG palette throughout.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* ── Colour constants ─────────────────────────────────────── */
const C = {
  // Rock / Mountain
  rockBase:   '#BFA07A',
  rockMid:    '#A0845C',
  rockDark:   '#7A6148',
  rockLight:  '#D4B896',
  rockShad:   '#5E4A38',
  moss:       '#7A8C5E',
  mossLight:  '#96AA72',
  lichen:     '#B4A878',

  // Ground
  groundTop:  '#7AAA6A',
  groundMid:  '#5C8A4A',
  groundDark: '#3E6030',
  soil:       '#8B6840',
  soilDark:   '#6B5030',
  path:       '#C4A87A',

  // Foliage
  treeA:      '#4A7A5A',
  treeB:      '#3A6A4A',
  treeC:      '#5A8A6A',
  treeTrunk:  '#6B4226',

  // Camp
  tentRed:    '#D4634A',
  tentBody:   '#C04A38',
  tentShadow: '#8B3020',
  fireOuter:  '#F0963C',
  fireMid:    '#F5C032',
  fireInner:  '#FFFFFF',
  backpack:   '#3A5E8A',

  // Summit
  snow:       '#EFF6FF',
  snowShad:   '#C8DCF0',
  snowLine:   '#D0E4F4',

  // Rope
  rope:       '#E8D44D',
  ropeShad:   '#C4B032',

  // Checkpoint flags
  flag:       '#E8834E',
  flagPole:   '#C4A882',
};

/**
 * Set SVG element attributes from an object.
 */
function attrs(el, obj) {
  for (const [k, v] of Object.entries(obj)) el.setAttribute(k, v);
  return el;
}
function el(tag, obj = {}) { return attrs(document.createElementNS(SVG_NS, tag), obj); }

/**
 * Main entry — populate the world SVG.
 */
export function buildWorld() {
  const svg = document.getElementById('world-svg');
  svg.setAttribute('viewBox', '0 0 1000 3600');
  svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');

  // Append sections from bottom → top
  svg.appendChild(buildBaseCamp());      // y ≈ 3200–3600
  svg.appendChild(buildLowerWall());     // y ≈ 2400–3200
  svg.appendChild(buildMidWall());       // y ≈ 1400–2400
  svg.appendChild(buildUpperWall());     // y ≈  400–1400
  svg.appendChild(buildSummitLedge());   // y ≈    0–400
  svg.appendChild(buildRopeTrail());     // full height
  svg.appendChild(buildCheckpoints());   // flags at checkpoints
}

/* ─────────────────────────── BASE CAMP ─────────────────────────── */
function buildBaseCamp() {
  const g = el('g', { id: 'base-camp' });
  const Y = 3600; // bottom of world

  // Ground terrain
  g.appendChild(el('path', {
    d: `M0,${Y-260} Q120,${Y-320} 280,${Y-280} Q400,${Y-350} 520,${Y-290}
        Q620,${Y-340} 720,${Y-270} Q850,${Y-320} 1000,${Y-280} L1000,${Y} L0,${Y} Z`,
    fill: C.groundDark,
  }));
  g.appendChild(el('path', {
    d: `M0,${Y-230} Q200,${Y-310} 380,${Y-260} Q500,${Y-330} 640,${Y-260}
        Q780,${Y-310} 1000,${Y-250} L1000,${Y} L0,${Y} Z`,
    fill: C.groundMid,
  }));
  g.appendChild(el('path', {
    d: `M0,${Y-190} Q180,${Y-260} 350,${Y-210} Q480,${Y-280} 600,${Y-220}
        Q730,${Y-270} 900,${Y-210} L1000,${Y-200} L1000,${Y} L0,${Y} Z`,
    fill: C.groundTop,
  }));

  // Dirt path toward mountain
  g.appendChild(el('path', {
    d: `M500,${Y-160} Q580,${Y-200} 670,${Y-210} Q750,${Y-220} 820,${Y-230}`,
    fill: 'none', stroke: C.path, 'stroke-width': '18', 'stroke-linecap': 'round', opacity: '0.6',
  }));

  // Far treeline
  for (const [x, h, c] of [[50,180,C.treeB],[130,200,C.treeA],[200,170,C.treeC],
      [680,190,C.treeA],[760,210,C.treeB],[850,180,C.treeC],[920,155,C.treeA]]) {
    g.appendChild(buildTree(x, Y-200, h, c, 0.55));
  }
  // Mid treeline
  for (const [x, h, c] of [[80,230,C.treeA],[160,250,C.treeB],[240,220,C.treeC],
      [600,240,C.treeB],[700,260,C.treeA],[800,220,C.treeC]]) {
    g.appendChild(buildTree(x, Y-210, h, c, 0.78));
  }

  // TENT
  const tx = 220, ty = Y-240;
  const tent = el('g', { id: 'tent' });
  tent.appendChild(el('polygon', {
    points: `${tx},${ty+8} ${tx+55},${ty-70} ${tx+110},${ty+8}`,
    fill: C.tentBody,
  }));
  tent.appendChild(el('polygon', {
    points: `${tx},${ty+8} ${tx+55},${ty-30} ${tx+55},${ty+8}`,
    fill: C.tentShadow, opacity: '0.7',
  }));
  tent.appendChild(el('polygon', {
    points: `${tx+55},${ty-30} ${tx+110},${ty+8} ${tx+55},${ty+8}`,
    fill: C.tentRed, opacity: '0.85',
  }));
  // Tent pole
  tent.appendChild(el('line', {
    x1: tx+55, y1: ty-70, x2: tx+55, y2: ty-85,
    stroke: '#8B7A60', 'stroke-width': '3', 'stroke-linecap': 'round',
  }));
  g.appendChild(tent);

  // CAMPFIRE
  const fx = 340, fy = Y-215;
  const fire = el('g', { id: 'campfire' });
  // Fire glow
  fire.appendChild(el('ellipse', {
    cx: fx, cy: fy+8, rx: 28, ry: 12,
    fill: '#F0963C', opacity: '0.25',
  }));
  // Logs
  fire.appendChild(el('rect', { x: fx-18, y: fy+2, width: 36, height: 6, rx: '3', fill: C.soilDark, transform: `rotate(-15,${fx},${fy+5})` }));
  fire.appendChild(el('rect', { x: fx-18, y: fy+2, width: 36, height: 6, rx: '3', fill: C.soilDark, transform: `rotate(15,${fx},${fy+5})` }));
  // Flames
  fire.appendChild(el('path', { d: `M${fx-8},${fy} Q${fx-4},${fy-20} ${fx},${fy-14} Q${fx+4},${fy-22} ${fx+8},${fy}`, fill: C.fireOuter, id: 'flame-1' }));
  fire.appendChild(el('path', { d: `M${fx-5},${fy} Q${fx},${fy-18} ${fx+5},${fy}`, fill: C.fireMid, id: 'flame-2' }));
  fire.appendChild(el('path', { d: `M${fx-2},${fy} Q${fx},${fy-10} ${fx+2},${fy}`, fill: C.fireInner, opacity: '0.85', id: 'flame-3' }));
  g.appendChild(fire);

  // BACKPACK
  const bx = 280, by = Y-235;
  const bp = el('g');
  bp.appendChild(el('rect', { x: bx, y: by-45, width: 28, height: 40, rx: '5', fill: C.backpack }));
  bp.appendChild(el('rect', { x: bx+2, y: by-43, width: 24, height: 12, rx: '3', fill: '#2A4070' }));
  bp.appendChild(el('rect', { x: bx+10, y: by-22, width: 8, height: 8, rx: '2', fill: C.gold }));
  // Straps
  bp.appendChild(el('line', { x1: bx+5, y1: by-5, x2: bx+5, y2: by+5, stroke: '#2A4070', 'stroke-width': '3', 'stroke-linecap': 'round' }));
  bp.appendChild(el('line', { x1: bx+23, y1: by-5, x2: bx+23, y2: by+5, stroke: '#2A4070', 'stroke-width': '3', 'stroke-linecap': 'round' }));
  g.appendChild(bp);

  // Climbing rope coil near tent
  g.appendChild(el('path', {
    d: `M${tx+120},${Y-220} a18,10 0 1,1 36,0 a14,8 0 1,1 -28,0`,
    fill: 'none', stroke: C.rope, 'stroke-width': '4', 'stroke-linecap': 'round', opacity: '0.85',
  }));

  // Rocks
  for (const [rx, ry, rw, rh] of [[160,Y-198,22,10],[420,Y-200,16,8],[480,Y-196,28,12],[560,Y-193,20,9]]) {
    g.appendChild(el('ellipse', { cx: rx, cy: ry, rx: rw, ry: rh, fill: C.rockDark, opacity: '0.7' }));
  }

  // Wildflowers
  for (const [fx2,fy2] of [[120,Y-226],[150,Y-228],[185,Y-222],[380,Y-222],[410,Y-218],[440,Y-224]]) {
    const col = ['#E87A8A','#7AC8E8','#E8D44D','#C87AE8'][Math.floor(Math.random()*4)];
    g.appendChild(el('circle', { cx: fx2, cy: fy2, r: '4', fill: col, opacity: '0.8' }));
    g.appendChild(el('line', { x1: fx2, y1: fy2, x2: fx2, y2: fy2+10, stroke: C.groundTop, 'stroke-width': '1.5' }));
  }

  return g;
}

/* ─────────────────────────── TREE HELPER ─────────────────── */
function buildTree(x, y, h, col, opacity = 1) {
  const g = el('g', { opacity: String(opacity) });
  const w = h * 0.55;
  // Trunk
  g.appendChild(el('rect', { x: x - 4, y: y - 30, width: 8, height: 30, rx: '3', fill: C.treeTrunk }));
  // Layers
  g.appendChild(el('polygon', { points: `${x},${y-h} ${x-w*0.5},${y-h*0.42} ${x+w*0.5},${y-h*0.42}`, fill: col }));
  g.appendChild(el('polygon', { points: `${x},${y-h*0.7} ${x-w*0.65},${y-h*0.28} ${x+w*0.65},${y-h*0.28}`, fill: col }));
  g.appendChild(el('polygon', { points: `${x},${y-h*0.42} ${x-w*0.8},${y-h*0.10} ${x+w*0.8},${y-h*0.10}`, fill: col }));
  // Shadow
  g.appendChild(el('polygon', { points: `${x},${y-h*0.7} ${x},${y-h*0.28} ${x+w*0.65},${y-h*0.28}`, fill: 'rgba(0,0,0,0.12)' }));
  return g;
}

/* ─────────────────────────── LOWER WALL (y 2400–3200) ────── */
function buildLowerWall() {
  const g = el('g', { id: 'lower-wall' });
  const Y0 = 3200, Y1 = 2400;

  // Main cliff face
  g.appendChild(el('path', {
    d: `M540,${Y0} Q560,${Y0-80} 580,${Y0-200} Q570,${Y0-400} 600,${Y0-500}
        Q620,${Y0-650} 590,${Y1+50} Q610,${Y1} 600,${Y1}
        L1000,${Y1} L1000,${Y0} Z`,
    fill: C.rockBase,
  }));

  // Rock face shading / stratification
  addRockStrata(g, 540, Y0, 600, Y1, 1000);

  // Cracks and features
  addCracks(g, 600, Y1, 1000, Y0, 12);

  // Moss patches (lower section has more moisture)
  for (const [mx,my,mw,mh] of [[620,Y0-120,45,18],[680,Y0-250,60,22],[710,Y0-400,38,15],[760,Y1+180,50,20]]) {
    g.appendChild(el('ellipse', { cx: mx, cy: my, rx: mw, ry: mh, fill: C.moss, opacity: '0.5' }));
  }

  // Left edge - where wall meets sky (jagged silhouette)
  g.appendChild(buildWallEdge(Y1, Y0, 520, 570));

  return g;
}

/* ─────────────────────────── MID WALL (y 1400–2400) ─────── */
function buildMidWall() {
  const g = el('g', { id: 'mid-wall' });
  const Y0 = 2430, Y1 = 1400;

  g.appendChild(el('path', {
    d: `M510,${Y0} Q540,${Y0-100} 560,${Y0-250} Q550,${Y0-450} 570,${Y1+100}
        Q560,${Y1} 550,${Y1}
        L1000,${Y1} L1000,${Y0} Z`,
    fill: C.rockMid,
  }));

  addRockStrata(g, 510, Y0, 550, Y1, 1000);
  addCracks(g, 560, Y1, 1000, Y0, 10);

  // Ledges (rest spots)
  g.appendChild(buildLedge(620, 2100, 110, 18)); // checkpoint 2
  g.appendChild(buildLedge(680, 1700, 90,  16)); // checkpoint 3

  // Lichen patches (mid section, drier)
  for (const [lx,ly] of [[630,2000],[700,1900],[750,1800],[620,1650]]) {
    g.appendChild(el('ellipse', { cx: lx, cy: ly, rx: '30', ry: '10', fill: C.lichen, opacity: '0.4' }));
  }

  g.appendChild(buildWallEdge(Y1, Y0, 490, 545));

  return g;
}

/* ─────────────────────────── UPPER WALL (y 400–1400) ──────── */
function buildUpperWall() {
  const g = el('g', { id: 'upper-wall' });
  const Y0 = 1430, Y1 = 400;

  g.appendChild(el('path', {
    d: `M480,${Y0} Q510,${Y0-100} 530,${Y0-300} Q520,${Y0-500} 530,${Y1+100}
        Q520,${Y1} 510,${Y1}
        L1000,${Y1} L1000,${Y0} Z`,
    fill: C.rockLight,
  }));

  addRockStrata(g, 480, Y0, 530, Y1, 1000);
  addCracks(g, 530, Y1, 1000, Y0, 8);

  // Upper ledge - near summit
  g.appendChild(buildLedge(580, 800, 120, 20)); // checkpoint 4

  // Sparse, wind-beaten plants near top
  for (const [px,py] of [[560,1200],[610,1100],[580,950],[630,850]]) {
    addSmallPlant(g, px, py);
  }

  g.appendChild(buildWallEdge(Y1, Y0, 460, 510));

  return g;
}

/* ─────────────────────────── SUMMIT LEDGE (y 0–400) ────────── */
function buildSummitLedge() {
  const g = el('g', { id: 'summit' });

  // Snow-capped peak rocks
  g.appendChild(el('path', {
    d: `M400,400 Q450,350 500,380 Q550,320 600,350 Q650,280 700,300
        Q750,240 800,260 Q850,200 900,230 Q950,180 1000,200 L1000,0 L0,0 L0,400 Z`,
    fill: C.rockBase,
  }));

  // Snow layer
  g.appendChild(el('path', {
    d: `M430,380 Q480,330 530,355 Q575,295 625,325 Q675,260 730,285
        Q780,225 840,248 Q895,192 950,215 Q980,200 1000,205 L1000,0 L0,0 L0,400 Z`,
    fill: C.snow,
  }));
  // Snow shadow
  g.appendChild(el('path', {
    d: `M480,365 Q530,318 575,340 Q620,280 675,305
        L675,330 Q620,310 575,360 Q530,340 480,365 Z`,
    fill: C.snowShad, opacity: '0.6',
  }));

  // Summit flag
  g.appendChild(el('line', { x1: '700', y1: '290', x2: '700', y2: '200', stroke: C.flagPole, 'stroke-width': '4', 'stroke-linecap': 'round' }));
  g.appendChild(el('polygon', { points: '700,200 740,215 700,230', fill: C.flag }));

  // "SUMMIT" rock label (optional flavor)
  const txt = el('text', { x: '720', y: '270', 'font-size': '22', fill: 'rgba(255,255,255,0.35)', 'font-weight': '700', 'letter-spacing': '4', 'font-family': 'Outfit, sans-serif' });
  txt.textContent = 'SUMMIT';
  g.appendChild(txt);

  return g;
}

/* ─────────────────────────── ROPE TRAIL ─────────────────── */
function buildRopeTrail() {
  const g = el('g', { id: 'rope-trail', opacity: '0.6' });
  // A continuous rope running from top to bottom along the right edge
  g.appendChild(el('path', {
    id: 'rope-path',
    d: `M700,350 Q720,600 690,900 Q720,1200 700,1500
        Q720,1800 695,2100 Q715,2400 700,2700
        Q720,3000 695,3200 Q710,3400 700,3550`,
    fill: 'none',
    stroke: C.rope,
    'stroke-width': '3.5',
    'stroke-dasharray': '12 8',
    'stroke-linecap': 'round',
  }));
  return g;
}

/* ─────────────────────────── CHECKPOINTS ────────────────── */
function buildCheckpoints() {
  const g = el('g', { id: 'checkpoints' });
  // Small glow orbs at each scroll checkpoint
  for (const [cx, cy, id] of [
    [670, 2720, 'cp1'],
    [710, 2100, 'cp2'],
    [730, 1700, 'cp3'],
    [700, 800,  'cp4'],
  ]) {
    const glow = el('circle', {
      id, cx, cy, r: '12',
      fill: C.gold, opacity: '0.5',
      class: 'cp-glow',
    });
    g.appendChild(glow);
  }
  return g;
}

/* ─────────────────────────── HELPERS ────────────────────── */
function buildLedge(x, y, w, h) {
  const g = el('g');
  // Top surface (lighter)
  g.appendChild(el('path', {
    d: `M${x},${y} Q${x+w*0.5},${y-h*0.4} ${x+w},${y} L${x+w},${y+h} Q${x+w*0.5},${y+h*1.2} ${x},${y+h} Z`,
    fill: C.rockLight,
  }));
  // Shadow underside
  g.appendChild(el('path', {
    d: `M${x},${y+h} Q${x+w*0.5},${y+h*1.2} ${x+w},${y+h} L${x+w},${y+h+8} L${x},${y+h+8} Z`,
    fill: C.rockShad, opacity: '0.6',
  }));
  return g;
}

function buildWallEdge(yTop, yBot, xMin, xMax) {
  // Jagged irregular left edge of cliff
  const pts = [];
  const numPts = Math.floor((yBot - yTop) / 60);
  pts.push([xMax, yTop]);
  for (let i = 0; i <= numPts; i++) {
    const y = yTop + (i / numPts) * (yBot - yTop);
    const x = xMin + Math.sin(i * 2.5) * (xMax - xMin) * 0.5 + (xMax - xMin) * 0.5;
    pts.push([x, y]);
  }
  pts.push([xMin, yBot]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  return el('path', { d, fill: 'rgba(0,0,0,0.08)' });
}

function addRockStrata(g, xLeft, yBot, xRight, yTop, xEnd) {
  // Horizontal stratification lines (rock layers)
  const count = Math.floor((yBot - yTop) / 80);
  for (let i = 0; i < count; i++) {
    const y = yTop + (i / count) * (yBot - yTop) + 40;
    const x0 = xLeft + (Math.sin(i * 1.8) * 20);
    g.appendChild(el('path', {
      d: `M${x0},${y} Q${(xLeft + xEnd) / 2},${y + 15} ${xEnd},${y}`,
      fill: 'none',
      stroke: 'rgba(0,0,0,0.07)',
      'stroke-width': '2',
    }));
  }
}

function addCracks(g, xLeft, yTop, xRight, yBot, count) {
  for (let i = 0; i < count; i++) {
    const x = xLeft + Math.random() * (xRight - xLeft) * 0.6;
    const y = yTop  + Math.random() * (yBot - yTop);
    const len = 30 + Math.random() * 70;
    const ang = -70 + Math.random() * 20;
    const rad = ang * Math.PI / 180;
    g.appendChild(el('line', {
      x1: x, y1: y,
      x2: x + Math.cos(rad) * len,
      y2: y + Math.sin(rad) * len,
      stroke: C.rockShad,
      'stroke-width': '1.5',
      opacity: String(0.3 + Math.random() * 0.3),
      'stroke-linecap': 'round',
    }));
  }
}

function addSmallPlant(g, x, y) {
  for (let i = -1; i <= 1; i++) {
    g.appendChild(el('path', {
      d: `M${x},${y} Q${x + i*12},${y-20} ${x + i*8},${y-28}`,
      fill: 'none', stroke: C.mossLight,
      'stroke-width': '2', 'stroke-linecap': 'round', opacity: '0.55',
    }));
  }
}
