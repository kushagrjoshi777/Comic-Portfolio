export const panelsData = [
    /* ── SPREAD 0: THE BEGINNING (Left) ── */
    {
        id: 'childhood',
        title: 'EARLY GEAR',
        spread: 0,
        page: 'left',
        class: 'p-left',
        color: '#ff00ff',
        content: `<div class="caption-box">Every hero starts somewhere. For me, it was a beige box and a dial-up modem.</div>`
    },
    {
        id: 'education',
        title: 'THE ACADEMY',
        spread: 0,
        page: 'right',
        class: 'p-top',
        color: '#00ffff',
        content: `<div class="caption-box">Mastering the arts of Computer Science and Visual Design.</div>`
    },

    /* ── SPREAD 1: THE HERO (Home) ── */
    {
        id: 'intro',
        title: 'ALEX CRESTWOOD!',
        spread: 1,
        page: 'left',
        class: 'p-full',
        color: 'var(--clr-intro)',
        content: `
            <h1 class="comic-text-large">I AM THE DEVELOPER!</h1>
            <div class="caption-box">Building the next generation of interactive web experiences with pixels and caffeine.</div>
            <div class="speech-bubble">"Expect the unexpected!"</div>
        `
    },
    {
        id: 'skills',
        title: 'SUPER POWERS',
        spread: 1,
        page: 'right',
        class: 'p-top',
        color: 'var(--clr-skills)',
        content: `
            <div class="skills-layout">
                <div class="stat-bar"><span class="label">GSAP</span><div class="bar" style="width: 98%; background: var(--clr-skills)"></div></div>
                <div class="stat-bar"><span class="label">REACT</span><div class="bar" style="width: 90%; background: var(--clr-skills)"></div></div>
                <div class="stat-bar"><span class="label">THREE.JS</span><div class="bar" style="width: 85%; background: var(--clr-skills)"></div></div>
            </div>
        `
    },
    {
        id: 'top-proj',
        title: 'TOP SECRET',
        spread: 1,
        page: 'right',
        class: 'p-bot',
        color: 'var(--clr-projects)',
        content: `<div class="caption-box">Confidential projects that pushed the boundaries of the browser.</div>`
    },

    /* ── SPREAD 2: THE FUTURE (Right) ── */
    {
        id: 'experience',
        title: 'BATTLE LOG',
        spread: 2,
        page: 'left',
        class: 'p-left',
        color: 'var(--clr-exp)',
        content: `<div class="timeline-comic"><div class="t-item"><strong>2024</strong> Lead Dev @ Future Corp</div></div>`
    },
    {
        id: 'contact',
        title: 'CALL TO ACTION',
        spread: 2,
        page: 'right',
        class: 'p-full',
        color: 'var(--clr-contact)',
        content: `
            <h2 class="comic-text-large">JOIN FORCES?</h2>
            <a href="mailto:alex@hero.com" class="cta-bubble">SEND SIGNAL</a>
        `
    }
];
