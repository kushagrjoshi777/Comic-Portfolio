import { gsap } from 'gsap';
import { panelsData } from './modules/panels.js';

class ComicPortfolio {
    constructor() {
        this.currentSpread = 1; 
        this.wrapper = document.querySelector('.spread-wrapper');
        this.dots = document.querySelectorAll('.page-indicator .dot');
        this.prevBtn = document.getElementById('prev-page');
        this.nextBtn = document.getElementById('next-page');
        this.expansionOverlay = document.getElementById('panel-expansion-overlay');
        this.expandedContent = this.expansionOverlay.querySelector('.expanded-content');
        this.closeBtn = document.querySelector('.close-panel');
        this.fxLayer = document.getElementById('fx-layer');

        this.impactWords = ['SKADOOSHH!', 'WAKAAUU!', 'KABOOM!', 'ZAP!', 'WHAM!', 'BAM!'];

        this.init();
    }

    init() {
        this.renderPanels();
        this.bindEvents();
        this.updateNav(true); // Immediate sync
        this.introAnimation();
    }

    renderPanels() {
        panelsData.forEach(data => {
            const pageId = `page-${data.spread}-${data.page}`;
            const pageElement = document.getElementById(pageId);
            if (!pageElement) return;

            let grid = pageElement.querySelector('.panel-grid');
            if (!grid) {
                grid = document.createElement('div');
                grid.className = 'panel-grid';
                pageElement.appendChild(grid);
            }

            const panel = document.createElement('div');
            panel.className = `comic-panel ${data.class}`;
            panel.dataset.id = data.id;

            panel.innerHTML = `
                <div class="panel-overlay-color" style="background: ${data.color}"></div>
                <div class="halftone-bg" style="color: ${data.color}"></div>
                <div class="panel-content">
                    <h2 class="panel-title">${data.title}</h2>
                </div>
            `;

            grid.appendChild(panel);
        });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.goToSpread(this.currentSpread - 1));
        this.nextBtn.addEventListener('click', () => this.goToSpread(this.currentSpread + 1));

        document.querySelectorAll('.comic-panel').forEach(panel => {
            panel.addEventListener('click', () => this.expandPanel(panel));
        });

        this.closeBtn.addEventListener('click', () => this.collapsePanel());

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToSpread(this.currentSpread - 1);
            if (e.key === 'ArrowRight') this.goToSpread(this.currentSpread + 1);
            if (e.key === 'Escape') this.collapsePanel();
        });
    }

    goToSpread(index) {
        if (index < 0 || index > 2 || index === this.currentSpread) return;
        this.currentSpread = index;

        // Animate Wrapper
        gsap.to(this.wrapper, {
            x: `-${index * 100}vw`,
            duration: 0.8,
            ease: "power3.inOut"
        });

        // Page Tilt/Flip effect
        gsap.to(`.comic-spread`, {
            rotationY: (i) => i === index ? 0 : (i < index ? -8 : 8),
            duration: 0.8,
            ease: "power2.out"
        });

        this.updateNav();
    }

    updateNav(immediate = false) {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSpread);
        });

        this.prevBtn.disabled = this.currentSpread === 0;
        this.nextBtn.disabled = this.currentSpread === 2;

        if (immediate) {
            gsap.set(this.wrapper, { x: `-${this.currentSpread * 100}vw` });
        }
    }

    triggerImpact(panel, color) {
        const rect = panel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        gsap.to("#app", {
            x: "random(-10, 10)",
            y: "random(-10, 10)",
            duration: 0.05,
            repeat: 6,
            yoyo: true,
            onComplete: () => gsap.set("#app", { x: 0, y: 0 })
        });

        const word = this.impactWords[Math.floor(Math.random() * this.impactWords.length)];
        const fx = document.createElement('div');
        fx.className = 'impact-fx';
        fx.innerText = word;
        fx.style.color = color || 'var(--clr-accent)';
        fx.style.left = `${centerX - 150}px`;
        fx.style.top = `${centerY - 75}px`;
        this.fxLayer.appendChild(fx);

        gsap.fromTo(fx, 
            { scale: 0, rotation: -20 }, 
            { scale: 1, rotation: -5, duration: 0.3, ease: "back.out(2.5)" }
        );

        gsap.to(fx, {
            opacity: 0,
            y: -150,
            duration: 0.4,
            delay: 0.6,
            onComplete: () => fx.remove()
        });
    }

    expandPanel(panel) {
        const data = panelsData.find(d => d.id === panel.dataset.id);
        this.triggerImpact(panel, data.color);

        this.expandedContent.innerHTML = data.content;
        this.expansionOverlay.style.display = 'flex';
        this.expansionOverlay.style.borderColor = data.color;

        gsap.fromTo(this.expansionOverlay, 
            { opacity: 0, scale: 0.95 }, 
            { opacity: 1, scale: 1, duration: 0.4, ease: "power4.out" }
        );
    }

    collapsePanel() {
        gsap.to(this.expansionOverlay, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            onComplete: () => {
                this.expansionOverlay.style.display = 'none';
            }
        });
    }

    introAnimation() {
        gsap.from(this.wrapper, {
            opacity: 0,
            scale: 0.9,
            duration: 1.2,
            ease: "power3.out"
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ComicPortfolio();
});
