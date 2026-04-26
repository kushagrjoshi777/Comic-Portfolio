/**
 * sky.js — Animated sky: stars (fade), clouds, sun, birds
 * Pure SVG. All animations driven by rAF or CSS.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs = {}) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

/* ─────────────────────────── CLOUDS ─────────────────────── */
const CLOUD_DATA_FAR = [
  { y: 80,  w: 220, h: 55,  delay: 0    },
  { y: 160, w: 160, h: 40,  delay: -42  },
  { y: 240, w: 190, h: 48,  delay: -85  },
  { y: 110, w: 130, h: 34,  delay: -26  },
  { y: 290, w: 240, h: 56,  delay: -110 },
];

const CLOUD_DATA_NEAR = [
  { y: 60,  w: 280, h: 70,  delay: 0   },
  { y: 190, w: 240, h: 60,  delay: -25 },
  { y: 130, w: 200, h: 50,  delay: -50 },
  { y: 320, w: 260, h: 65,  delay: -75 },
];

export function buildClouds() {
  buildCloudLayer('clouds-far-svg',  CLOUD_DATA_FAR,  80,  0.55, 'far');
  buildCloudLayer('clouds-near-svg', CLOUD_DATA_NEAR, 50,  0.80, 'near');
}

function buildCloudLayer(svgId, data, dur, opacity, prefix) {
  const svg = document.getElementById(svgId);

  data.forEach(({ y, w, h, delay }, i) => {
    const cloud = el('g', {
      class: 'cloud-group',
      style: `animation: cloud-drift-${prefix} ${dur + i*6}s ${delay}s linear infinite`,
      opacity: String(opacity),
    });

    // Base ellipse
    cloud.appendChild(el('ellipse', {
      cx: w/2, cy: h * 0.7,
      rx: w/2, ry: h * 0.45,
      fill: '#FFFFFF',
    }));
    // Top puff
    cloud.appendChild(el('ellipse', {
      cx: w * 0.38, cy: h * 0.45,
      rx: w * 0.28, ry: h * 0.52,
      fill: '#FFFFFF',
    }));
    cloud.appendChild(el('ellipse', {
      cx: w * 0.62, cy: h * 0.50,
      rx: w * 0.22, ry: h * 0.45,
      fill: '#F8F8FF',
    }));
    // Shadow underside
    cloud.appendChild(el('ellipse', {
      cx: w/2, cy: h * 0.72,
      rx: w * 0.45, ry: h * 0.2,
      fill: '#C8D8EC',
      opacity: '0.45',
    }));
    // Place at y position
    cloud.setAttribute('transform', `translate(-${w}, ${y})`);
    svg.appendChild(cloud);
  });

  // Inject keyframes
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes cloud-drift-far {
      from { transform: translateX(-120px); }
      to   { transform: translateX(calc(100vw + 400px)); }
    }
    @keyframes cloud-drift-near {
      from { transform: translateX(-160px); }
      to   { transform: translateX(calc(100vw + 500px)); }
    }
    .cloud-group {
      will-change: transform;
    }
  `;
  document.head.appendChild(styleTag);
}

/* ─────────────────────────── BIRDS ─────────────────────── */
const BIRD_DATA = [
  { y: 90,  delay: 4,   dur: 15 },
  { y: 200, delay: 12,  dur: 19 },
  { y: 140, delay: 25,  dur: 14 },
  { y: 310, delay: 38,  dur: 20 },
  { y: 60,  delay: 52,  dur: 17 },
  { y: 260, delay: 66,  dur: 16 },
];

export function buildBirds() {
  const svg = document.getElementById('birds-svg');

  BIRD_DATA.forEach(({ y, delay, dur }, i) => {
    const g = el('g', {
      style: `animation: bird-fly ${dur}s ${delay}s linear infinite`,
      transform: `translate(-50, ${y})`,
    });

    // V-shaped wing pair (two arcs)
    g.appendChild(el('path', {
      id: `bird-wings-${i}`,
      d: 'M 0 5 Q 8 0 16 5 Q 24 0 32 5',
      fill: 'none', stroke: '#2A3550',
      'stroke-width': '2', 'stroke-linecap': 'round',
    }));

    svg.appendChild(g);

    // Per-bird flap animation (slightly different timing)
    const style = document.createElement('style');
    style.textContent = `
      #bird-wings-${i} {
        animation: bird-flap ${0.55 + i*0.05}s ${delay * 0.3}s ease-in-out infinite;
        transform-origin: center;
      }
      @keyframes bird-flap {
        0%,100% { transform: scaleY(1); }
        50%     { transform: scaleY(-0.4) translateY(-2px); }
      }
    `;
    document.head.appendChild(style);
  });

  // Common bird flight keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bird-fly {
      0%   { transform: translateX(-60px); opacity: 0; }
      4%   { opacity: 0.6; }
      92%  { opacity: 0.6; }
      100% { transform: translateX(calc(100vw + 60px)); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────── SKY COLOUR SHIFT ─────────────── */
/**
 * Drives sky gradient and sun position based on progress (0–1).
 * Called from the main animation loop.
 */
export function updateSky(progress) {
  const topStop = document.getElementById('sky-top');
  const midStop = document.getElementById('sky-mid');
  const botStop = document.getElementById('sky-bot');
  const sun     = document.getElementById('sun');
  const sunDisc = document.getElementById('sun-disc');

  if (!topStop) return;

  // Interpolate sky per progress
  // 0 → dawn blue, 0.5 → bright day, 1 → higher altitude cooler
  const lerp = (a, b, t) => a + (b - a) * t;

  // sky-top: darkens slightly as we go higher
  const topH = lerp(210, 195, progress);
  const topS = lerp(65,  75,  progress);
  const topL = lerp(38,  32,  progress);
  topStop.setAttribute('stop-color', `hsl(${topH},${topS}%,${topL}%)`);

  const midH = lerp(205, 200, progress);
  const midL = lerp(58,  52,  progress);
  midStop.setAttribute('stop-color', `hsl(${midH},70%,${midL}%)`);

  const botL = lerp(72, 60, progress);
  botStop.setAttribute('stop-color', `hsl(200,65%,${botL}%)`);

  // Sun rises as progress increases
  if (sun && sunDisc) {
    const sunY = 80 - progress * 60;  // rises from 80 → 20
    sun.setAttribute('cy', sunY);
    sunDisc.setAttribute('cy', sunY);
  }
}
