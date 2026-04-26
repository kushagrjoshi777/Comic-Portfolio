/**
 * character.js — SVG climbing character with state machine
 *
 * States:
 *   IDLE       → sitting at camp, breathing
 *   PREPARE    → standing, chalk hands
 *   CLIMBING   → alternating limb animation (GSAP loop)
 *   REST       → paused at ledge, looking up
 *   SUMMIT     → arms raised
 *
 * The character is drawn in a 200×320 viewBox.
 * All moveable parts are <g> elements with stable IDs.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* ── Palette ─────────────────────────────────────────────── */
const C = {
  skin:    '#D4956B',
  skinDk:  '#B87A50',
  helmet:  '#E8D44D',
  helmetS: '#C4B032',
  shirt:   '#E07A5F',
  shirtDk: '#C05A40',
  pants:   '#4A72A8',
  pantsDk: '#2A5080',
  shoe:    '#2A2A2A',
  shoeSol: '#3A3A3A',
  harness: '#444',
  chalk:   '#F4EEE0',
  rope:    '#E8D44D',
  ropeDk:  '#C4B032',
  chalkBag:'#E05040',
};

function el(tag, attrs = {}) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}
function g(id, children = []) {
  const e = el('g', { id });
  children.forEach(c => e.appendChild(c));
  return e;
}

export function buildCharacter() {
  const svg = document.getElementById('climber-svg');
  // Clear and rebuild
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // ── Defs ──────────────────────────────────────────────── //
  const defs = el('defs');

  // Rope gradient
  const ropeGrad = el('linearGradient', { id: 'rope-grad', x1: '0', y1: '0', x2: '0', y2: '1' });
  ropeGrad.appendChild(el('stop', { offset: '0%',   'stop-color': C.ropeDk }));
  ropeGrad.appendChild(el('stop', { offset: '100%', 'stop-color': C.rope }));
  defs.appendChild(ropeGrad);
  svg.appendChild(defs);

  // ── Rope dangling below ──────────────────────────────── //
  const ropeEl = el('path', {
    id: 'char-rope',
    d: 'M 100 230 Q 90 260 100 290 Q 108 310 100 320',
    fill: 'none', stroke: 'url(#rope-grad)', 'stroke-width': '3.5',
    'stroke-dasharray': '10 6', 'stroke-linecap': 'round',
    opacity: '0.7',
  });
  svg.appendChild(ropeEl);

  // ── Far (left) leg ───────────────────────────────────── //
  const legL = el('g', { id: 'leg-l', style: 'transform-origin: 94px 220px' });
  // Upper leg
  legL.appendChild(el('path', {
    d: 'M 94 220 Q 78 238 72 260',
    fill: 'none', stroke: C.pantsDk, 'stroke-width': '16', 'stroke-linecap': 'round',
  }));
  // Lower leg
  legL.appendChild(el('path', {
    d: 'M 72 260 Q 66 278 60 290',
    fill: 'none', stroke: C.pants, 'stroke-width': '14', 'stroke-linecap': 'round',
  }));
  // Shoe
  legL.appendChild(el('ellipse', { cx: '56', cy: '294', rx: '14', ry: '7', fill: C.shoe }));
  svg.appendChild(legL);

  // ── Far (left) arm ───────────────────────────────────── //
  const armL = el('g', { id: 'arm-l', style: 'transform-origin: 86px 148px' });
  armL.appendChild(el('path', {
    d: 'M 86 148 Q 68 162 58 182',
    fill: 'none', stroke: C.skinDk, 'stroke-width': '13', 'stroke-linecap': 'round',
  }));
  // Hand
  armL.appendChild(el('circle', { cx: '55', cy: '186', r: '9', fill: C.skinDk }));
  svg.appendChild(armL);

  // ── Torso / Body ─────────────────────────────────────── //
  const body = el('g', { id: 'char-body' });
  // Main torso
  body.appendChild(el('path', {
    d: 'M 80 145 Q 82 175 84 215 Q 100 220 116 215 Q 118 175 120 145 Z',
    fill: C.shirt,
  }));
  // Chest shadow
  body.appendChild(el('path', {
    d: 'M 100 145 Q 100 175 100 215 Q 116 210 116 145 Z',
    fill: C.shirtDk, opacity: '0.45',
  }));
  // Harness straps
  body.appendChild(el('path', {
    d: 'M 84 175 Q 100 180 116 175', fill: 'none', stroke: C.harness, 'stroke-width': '3',
  }));
  body.appendChild(el('path', {
    d: 'M 88 160 Q 100 165 112 160', fill: 'none', stroke: C.harness, 'stroke-width': '2.5',
  }));
  // Chalk bag
  body.appendChild(el('rect', { x: '116', y: '175', width: '14', height: '18', rx: '4', fill: C.chalkBag }));
  body.appendChild(el('rect', { x: '118', y: '177', width: '10', height: '6', rx: '2', fill: C.chalk, opacity: '0.6' }));
  svg.appendChild(body);

  // ── Near (right) leg ─────────────────────────────────── //
  const legR = el('g', { id: 'leg-r', style: 'transform-origin: 106px 220px' });
  legR.appendChild(el('path', {
    d: 'M 106 220 Q 122 238 128 262',
    fill: 'none', stroke: C.pants, 'stroke-width': '16', 'stroke-linecap': 'round',
  }));
  legR.appendChild(el('path', {
    d: 'M 128 262 Q 134 278 140 292',
    fill: 'none', stroke: C.pantsDk, 'stroke-width': '14', 'stroke-linecap': 'round',
  }));
  legR.appendChild(el('ellipse', { cx: '144', cy: '296', rx: '14', ry: '7', fill: C.shoeSol }));
  svg.appendChild(legR);

  // ── Near (right) arm ─────────────────────────────────── //
  const armR = el('g', { id: 'arm-r', style: 'transform-origin: 114px 148px' });
  armR.appendChild(el('path', {
    d: 'M 114 148 Q 136 130 148 112',
    fill: 'none', stroke: C.skin, 'stroke-width': '14', 'stroke-linecap': 'round',
  }));
  armR.appendChild(el('circle', { cx: '151', cy: '108', r: '10', fill: C.skin }));
  svg.appendChild(armR);

  // ── Head ─────────────────────────────────────────────── //
  const head = el('g', { id: 'char-head', style: 'transform-origin: 100px 118px' });
  // Head shape
  head.appendChild(el('ellipse', { cx: '100', cy: '122', rx: '26', ry: '28', fill: C.skin }));
  // Helmet
  head.appendChild(el('path', {
    d: 'M 74 118 Q 74 90 100 88 Q 126 90 126 118 Z',
    fill: C.helmet,
  }));
  head.appendChild(el('path', {
    d: 'M 74 118 L 126 118', fill: 'none', stroke: C.helmetS, 'stroke-width': '3',
  }));
  // Helmet highlight
  head.appendChild(el('ellipse', { cx: '90', cy: '97', rx: '10', ry: '4', fill: 'rgba(255,255,255,0.25)', transform: 'rotate(-15,90,97)' }));
  // Eye
  head.appendChild(el('circle', { cx: '112', cy: '124', r: '4', fill: '#1A1A1A' }));
  head.appendChild(el('circle', { cx: '113', cy: '122.5', r: '1.5', fill: 'rgba(255,255,255,0.7)' }));
  // Smile (visible in SUMMIT state)
  head.appendChild(el('path', {
    id: 'char-smile', d: 'M 106 132 Q 112 137 118 132',
    fill: 'none', stroke: C.skinDk, 'stroke-width': '2',
    'stroke-linecap': 'round', opacity: '0',
  }));
  svg.appendChild(head);

  return {
    svg,
    armR:  document.getElementById('arm-r'),
    armL:  document.getElementById('arm-l'),
    legR:  document.getElementById('leg-r'),
    legL:  document.getElementById('leg-l'),
    head:  document.getElementById('char-head'),
    body:  document.getElementById('char-body'),
    rope:  document.getElementById('char-rope'),
    smile: document.getElementById('char-smile'),
  };
}
