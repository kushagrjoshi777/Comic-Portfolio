/**
 * sections.js — Portfolio content cards
 * Cards are positioned absolutely and revealed/hidden by the timeline.
 */

const SECTIONS = [
  {
    id: 'intro',
    cls: 'intro',
    html: `
      <h1>Alex<br>Crestwood</h1>
      <p class="tagline">Developer · Climber · Builder</p>
      <a href="#" class="cta">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        Begin the climb
      </a>
    `,
  },
  {
    id: 'about',
    num: '01',
    title: 'About Me',
    sub: 'The Journey',
    html: `
      <p>I'm a full-stack developer who finds clarity at altitude. Five years building
      production web experiences — from high-traffic dashboards to interactive
      visualisations — and I apply the same problem-solving patience I learned on the rock.</p>
      <p style="margin-top:.9rem">Every route has a sequence. So does every codebase.</p>
    `,
  },
  {
    id: 'skills',
    num: '02',
    title: 'Toolkit',
    sub: 'Skills & Technologies',
    html: `
      <div class="skills-grid">
        <span class="skill">JavaScript</span>
        <span class="skill">TypeScript</span>
        <span class="skill">React</span>
        <span class="skill">Node.js</span>
        <span class="skill">GSAP</span>
        <span class="skill">Three.js</span>
        <span class="skill">Python</span>
        <span class="skill">PostgreSQL</span>
        <span class="skill">Docker</span>
        <span class="skill">AWS</span>
        <span class="skill">Figma</span>
        <span class="skill">WebGL</span>
      </div>
    `,
  },
  {
    id: 'projects',
    num: '03',
    title: 'Projects',
    sub: 'Selected Work',
    html: `
      <div class="proj">
        <h3>Summit Tracker</h3>
        <div class="proj-tech">React · MapboxGL · Node.js</div>
        <p>Real-time climbing route tracker with 3D terrain and social beta sharing.</p>
      </div>
      <div class="proj">
        <h3>Weatherpeak</h3>
        <div class="proj-tech">TypeScript · D3.js · Python</div>
        <p>Mountain weather dashboard with ML-powered summit-window forecasts.</p>
      </div>
      <div class="proj">
        <h3>Crag Social</h3>
        <div class="proj-tech">Next.js · GraphQL · PostgreSQL</div>
        <p>Community platform for climbers to log routes, share beta, find partners.</p>
      </div>
    `,
  },
  {
    id: 'experience',
    num: '04',
    title: 'Experience',
    sub: 'Career Path',
    html: `
      <div class="exp">
        <h3>Senior Frontend Engineer</h3>
        <div class="period">Altitude Labs · 2022 — Present</div>
        <p>Leading interactive data visualisation for fintech clients. 3M+ daily users.</p>
      </div>
      <div class="exp">
        <h3>Full-Stack Developer</h3>
        <div class="period">Basecamp Digital · 2019 — 2022</div>
        <p>Built and scaled web apps serving 50K+ DAU. Reduced load time by 65%.</p>
      </div>
      <div class="exp">
        <h3>Junior Developer</h3>
        <div class="period">Trail Studios · 2017 — 2019</div>
        <p>E-commerce, CMS integrations, and the beginning of a craft.</p>
      </div>
    `,
  },
  {
    id: 'contact',
    num: '05',
    title: 'Contact',
    sub: 'Get in Touch',
    html: `
      <p>Interested in working together? Reach out — I'm always open to interesting projects.</p>
      <div class="contact-links">
        <a class="c-link" href="mailto:alex@crestwood.dev">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          alex@crestwood.dev
        </a>
        <a class="c-link" href="https://github.com" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          github.com/alexcrestwood
        </a>
        <a class="c-link" href="https://linkedin.com" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          linkedin.com/in/alexcrestwood
        </a>
      </div>
    `,
  },
];

/**
 * Build and append all section cards to #cards-container.
 * Returns an array of DOM elements for GSAP targeting.
 */
export function buildSections() {
  const container = document.getElementById('cards-container');
  const cards = [];

  SECTIONS.forEach(s => {
    const card = document.createElement('div');
    card.className = `s-card ${s.cls || ''}`.trim();
    card.id = `card-${s.id}`;

    let inner = '';
    if (s.num)   inner += `<div class="s-card__num">${s.num}</div>`;
    if (s.title) inner += `<h2>${s.title}</h2>`;
    if (s.sub)   inner += `<div class="s-card__sub">${s.sub}</div>`;
    inner += s.html;

    card.innerHTML = inner;
    container.appendChild(card);
    cards.push(card);
  });

  return cards;
}
