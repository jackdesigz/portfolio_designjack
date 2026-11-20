/**
 * designjack — Layout dedicati ai progetti di Brand Design
 * window.PROJECT_LAYOUTS.ablondi    → Teatro Salone Ablondi (sipario, costruzione, palette, tipografia)
 * window.PROJECT_LAYOUTS.melagoccio → Melagoccio (felpa da girare, figurine, banner a tre post)
 * Ogni layout disegna la pagina e restituisce la funzione di pulizia per la modal.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const zoom = (src, caption) => `class="zoomable-trigger" data-img-src="${src}" data-img-caption="${esc(caption)}"`;

  // Comparsa allo scroll: un controllo a ogni scroll (scheda o pagina), niente IntersectionObserver
  function setupReveal(root, container) {
    const scroller = container.closest('.project-modal-card');
    const items = Array.from(root.querySelectorAll('[data-reveal]'));
    if (reduceMotion()) {
      items.forEach((el) => el.classList.add('is-in'));
      return () => {};
    }
    let ticking = false;
    const check = () => {
      ticking = false;
      if (!root.isConnected) return;
      let top = 0;
      let bottom = window.innerHeight;
      if (scroller) {
        const r = scroller.getBoundingClientRect();
        top = Math.max(top, r.top);
        bottom = Math.min(bottom, r.bottom);
      }
      const h = Math.max(1, bottom - top);
      for (let i = items.length - 1; i >= 0; i--) {
        const r = items[i].getBoundingClientRect();
        if (r.top < bottom - h * 0.1 && r.bottom > top) {
          items[i].classList.add('is-in');
          items.splice(i, 1);
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const timers = [60, 400, 900].map((t) => setTimeout(check, t));
    check();
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      timers.forEach(clearTimeout);
    };
  }

  const head = (prefix, num, title) => `
    <header class="${prefix}-head" data-reveal>
      <span class="${prefix}-num">${num}</span>
      <h3 class="${prefix}-title">${title}</h3>
    </header>`;

  /* ==================================================================
     TEATRO SALONE ABLONDI
     ================================================================== */
  LAYOUTS.ablondi = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const wordmark = (cls = '') => `
      <div class="ab-wordmark ${cls}">
        <span class="ab-ts">TEATRO SALONE</span>
        <span class="ab-name">ABLONDI</span>
      </div>`;
    const steps = g.process || [];
    const colors = g.colors || [];
    const fonts = g.fonts || [];

    container.innerHTML = `
      <div class="ab">

        <!-- SIPARIO: si apre e mostra il marchio sotto l'occhio di bue -->
        <section class="ab-stage" data-reveal>
          <div class="ab-spot" aria-hidden="true"></div>
          <div class="ab-logo">
            <img class="ab-symbol" src="${B}simbolo-black.svg" alt="Simbolo del Teatro Salone Ablondi" />
            ${wordmark()}
          </div>
          <div class="ab-boards" aria-hidden="true"></div>
          <div class="ab-curtain is-left" aria-hidden="true"></div>
          <div class="ab-curtain is-right" aria-hidden="true"></div>
          <div class="ab-valance" aria-hidden="true"></div>
          <span class="ab-stage-cap">${esc(g.stageCaption || 'Si apre il sipario')}</span>
        </section>

        <!-- 01 IL SIMBOLO: dalle prime variazioni alla versione finale -->
        <section class="ab-sec">
          ${head('ab', '01', esc(g.symbolTitle || 'Il simbolo'))}
          ${(g.symbolText || []).map((p) => `<p class="ab-text" data-reveal>${p}</p>`).join('')}
          <div class="ab-process">
            ${steps.map((st, i) => `
              <figure class="ab-step${st.final ? ' is-final' : ''}" data-reveal style="--i:${i};">
                <span class="ab-step-num">${String(i + 1).padStart(2, '0')}</span>
                <div class="ab-step-img"${st.src ? ` ${zoom(B + st.src, st.title)}` : ''}>
                  ${st.src
                    ? `<img src="${B}${st.src}" alt="${esc(st.title)}" loading="lazy" />`
                    : `<img src="${B}simbolo-viola.svg" alt="${esc(st.title)}" />`}
                </div>
                <figcaption><strong>${esc(st.title)}</strong>${st.desc ? `<span>${esc(st.desc)}</span>` : ''}</figcaption>
              </figure>`).join('')}
          </div>
        </section>

        <!-- 02 COSTRUZIONE: proporzioni dalle linee guida, ridisegnate con le guide -->
        <section class="ab-sec ab-build-sec">
          ${head('ab', '02', esc(g.buildTitle || 'Costruzione'))}
          <div class="ab-build" data-reveal>
            <div class="ab-build-logo">
              <span class="ab-guide is-v is-l"></span><span class="ab-guide is-v is-r"></span>
              <img class="ab-symbol" src="${B}simbolo-black.svg" alt="" />
              <div class="ab-wordmark is-guided">
                <span class="ab-ts"><i class="ab-brace is-x">x</i>TEATRO SALONE</span>
                <span class="ab-name"><i class="ab-brace is-y">y</i>ABLONDI</span>
              </div>
            </div>
            <ul class="ab-facts">
              ${(g.facts || []).map((f, i) => `
                <li data-reveal style="--i:${i};"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></li>`).join('')}
            </ul>
          </div>
        </section>

        <!-- 03 PALETTE: quattro colori, il marchio su ognuno -->
        <section class="ab-sec">
          ${head('ab', '03', esc(g.paletteTitle || 'Palette'))}
          <div class="ab-palette">
            ${colors.map((c, i) => `
              <div class="ab-swatch" data-reveal style="--i:${i}; --bg:${c.hex}; --fg:${c.ink};">
                <img src="${B}simbolo-${c.logo}.svg" alt="" />
                ${wordmark('is-small')}
                <div class="ab-swatch-info">
                  <b>${esc(c.hex)}</b>
                  <span>${esc(c.cmyk)}</span>
                  ${c.name ? `<em>${esc(c.name)}</em>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </section>

        <!-- 04 TIPOGRAFIA -->
        <section class="ab-sec">
          ${head('ab', '04', esc(g.typeTitle || 'Tipografia'))}
          <div class="ab-type">
            ${fonts.map((f, i) => `
              <div class="ab-font ${f.cls}" data-reveal style="--i:${i};">
                <span class="ab-font-use">${esc(f.use)}</span>
                <span class="ab-font-aa">Aa</span>
                <span class="ab-font-sample">${esc(f.sample)}</span>
                <span class="ab-font-abc">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789</span>
                <span class="ab-font-name">${esc(f.name)}</span>
              </div>`).join('')}
          </div>
        </section>

        <!-- 05 APPLICAZIONI -->
        ${g.mockup ? `
        <section class="ab-sec ab-apply">
          ${head('ab', '05', esc(g.mockup.title || 'Applicazioni'))}
          ${g.mockup.lead ? `<p class="ab-text" data-reveal>${g.mockup.lead}</p>` : ''}
          <figure class="ab-mockup" data-reveal ${zoom(B + g.mockup.src, g.mockup.caption || '')}>
            <img src="${B}${g.mockup.src}" alt="${esc(g.mockup.alt || '')}" loading="lazy" />
          </figure>
        </section>` : ''}
      </div>
    `;

    return setupReveal(container.querySelector('.ab'), container);
  };

  /* ==================================================================
     MELAGOCCIO
     ================================================================== */
  // sagoma della felpa grigia (fronte con apertura del cappuccio, laccetti e tasca; retro col cappuccio)
  const hoodie = (front) => `
    <svg class="mg-hoodie-svg" viewBox="0 0 400 440" aria-hidden="true">
      <defs>
        <pattern id="mg-melange-${front ? 'f' : 'b'}" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#BDC0C6"/><circle cx="1.5" cy="1.5" r="0.9" fill="#D3D5DA"/><circle cx="4.5" cy="4" r="0.8" fill="#A9ACB3"/>
        </pattern>
      </defs>
      <g stroke="#0B0F14" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
        <path fill="url(#mg-melange-${front ? 'f' : 'b'})" d="M128 78 C110 84 82 92 62 102 C44 112 36 130 32 152 L14 322 C13 332 20 338 30 339 L66 342 C76 343 82 337 83 328 L96 206 L94 410 C94 420 100 426 110 426 L290 426 C300 426 306 420 306 410 L304 206 L317 328 C318 337 324 343 334 342 L370 339 C380 338 387 332 386 322 L368 152 C364 130 356 112 338 102 C318 92 290 84 272 78 C266 36 236 14 200 14 C164 14 134 36 128 78 Z"/>
        <path fill="#A2A5AC" d="M96 396 L304 396 L304 410 C304 420 300 426 290 426 L110 426 C100 426 96 420 96 410 Z"/>
        <path fill="#A2A5AC" d="M16 306 L84 312 L83 328 C82 337 76 343 66 342 L30 339 C20 338 13 332 14 322 Z"/>
        <path fill="#A2A5AC" d="M384 306 L316 312 L317 328 C318 337 324 343 334 342 L370 339 C380 338 387 332 386 322 Z"/>
        ${front ? `
        <path fill="#7E8189" d="M150 92 C150 52 172 34 200 34 C228 34 250 52 250 92 C238 112 220 120 200 120 C180 120 162 112 150 92 Z"/>
        <path fill="none" stroke-width="4" d="M184 120 L180 176 M216 120 L220 176"/>
        <circle cx="180" cy="180" r="5" fill="#0B0F14" stroke="none"/><circle cx="220" cy="180" r="5" fill="#0B0F14" stroke="none"/>
        <path fill="none" stroke-width="5" d="M132 384 L148 300 L252 300 L268 384"/>` : `
        <path fill="none" stroke-width="5" d="M140 84 C150 128 176 150 200 150 C224 150 250 128 260 84"/>
        <path fill="none" stroke-width="4" d="M200 18 L200 150"/>`}
      </g>
    </svg>`;

  LAYOUTS.melagoccio = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const players = g.players || [];
    const colors = g.colors || [];
    const slogan = g.slogan || 'ONE SHOT ✦ ONE SPIKE ✦';
    const patternRows = Array.from({ length: 14 }, (_, i) =>
      `<span style="--row:${i};">${'MELAGOCCIO '.repeat(8)}</span>`).join('');

    container.innerHTML = `
      <div class="mg">

        <!-- HERO: sfondo a scritte come le figurine, logo che ondeggia -->
        <section class="mg-hero">
          <div class="mg-pattern" aria-hidden="true">${patternRows}</div>
          <div class="mg-hero-copy" data-reveal>
            <span class="mg-kicker">${esc(g.kicker || project.category)}</span>
            <h3 class="mg-word"><span>MELA</span><span>GOCCIO</span></h3>
            <p class="mg-lead">${g.lead || ''}</p>
          </div>
          <div class="mg-hero-logo" data-reveal>
            <img src="${B}logo.svg" alt="Logo Melagoccio" />
          </div>
        </section>

        <div class="mg-marquee" aria-hidden="true">
          <div class="mg-marquee-track">${`<span>${esc(slogan)}</span>`.repeat(10)}</div>
        </div>

        <!-- 01 IL BRAND -->
        <section class="mg-sec mg-brand">
          ${head('mg', '01', esc(g.brandTitle || 'Il brand'))}
          <div class="mg-brand-grid">
            <div class="mg-brand-copy">
              ${(g.brandText || []).map((p) => `<p class="mg-text" data-reveal>${p}</p>`).join('')}
              <div class="mg-colors">
                ${colors.map((c, i) => `
                  <span class="mg-color" data-reveal style="--i:${i}; --c:${c.hex}; --t:${c.text || '#0B0F14'};">
                    <b>${esc(c.name)}</b><small>${esc(c.hex)}</small>
                  </span>`).join('')}
              </div>
            </div>
            <div class="mg-mascot" data-reveal ${zoom(B + 'retro.svg', 'La mascotte sul retro della felpa: One shot, one spike')}>
              <img src="${B}retro.svg" alt="La mascotte Melagoccio con pallone e boccale: One shot, one spike" />
            </div>
          </div>
        </section>

        <!-- 02 LA FELPA: si gira tra fronte e retro -->
        <section class="mg-sec mg-hoodie-sec">
          ${head('mg', '02', esc(g.hoodieTitle || 'La felpa'))}
          ${g.hoodieText ? `<p class="mg-text" data-reveal>${g.hoodieText}</p>` : ''}
          <div class="mg-hoodie-wrap" data-reveal>
            <button type="button" class="mg-flip" aria-pressed="false" aria-label="Gira la felpa: mostra il retro">
              <span class="mg-flip-inner">
                <span class="mg-face is-front">
                  ${hoodie(true)}
                  <span class="mg-face-tag">FRONTE</span>
                  <img src="${B}logo.svg" alt="Fronte: il logo sul petto" />
                </span>
                <span class="mg-face is-back">
                  ${hoodie(false)}
                  <span class="mg-face-tag">RETRO</span>
                  <img src="${B}retro.svg" alt="Retro: la mascotte e la scritta One shot, one spike" />
                </span>
              </span>
            </button>
            <span class="mg-flip-hint">Clicca per girarla ↻</span>
          </div>
        </section>

        <!-- 03 LE FIGURINE -->
        <section class="mg-sec mg-cards-sec">
          ${head('mg', '03', esc(g.cardsTitle || 'Le figurine'))}
          ${g.cardsText ? `<p class="mg-text" data-reveal>${g.cardsText}</p>` : ''}
          <div class="mg-deck" data-reveal>
            ${players.map((p, i) => `
              <figure class="mg-card" style="--i:${i}; --n:${players.length};" ${zoom(B + p.src, p.caption || '')}>
                <img src="${B}${p.src}" alt="${esc(p.alt || p.caption || 'Figurina')}" loading="lazy" />
              </figure>`).join('')}
          </div>
        </section>

        <!-- 04 SOCIAL: il banner si compone dai tre post -->
        ${g.banner ? `
        <section class="mg-sec mg-social">
          ${head('mg', '04', esc(g.banner.title || 'Social'))}
          ${g.banner.text ? `<p class="mg-text" data-reveal>${g.banner.text}</p>` : ''}
          <div class="mg-banner" data-reveal ${zoom(B + g.banner.src, g.banner.caption || '')} style="--ar:${g.banner.ratio || 2.08};">
            ${[0, 1, 2].map((k) => `<span class="mg-tile" style="--k:${k}; background-image:url('${B}${g.banner.src}');"></span>`).join('')}
          </div>
        </section>` : ''}
      </div>
    `;

    const root = container.querySelector('.mg');

    // felpa: clic per girarla (e un giro di prova quando compare, per far capire che si gira)
    const flip = root.querySelector('.mg-flip');
    const setFlip = (on) => {
      flip.classList.toggle('is-flipped', on);
      flip.setAttribute('aria-pressed', on ? 'true' : 'false');
      flip.setAttribute('aria-label', on ? 'Gira la felpa: mostra il fronte' : 'Gira la felpa: mostra il retro');
    };
    flip.addEventListener('click', () => {
      setFlip(!flip.classList.contains('is-flipped'));
      if (window.audioEngine && window.audioEngine.playPaperFlutter) window.audioEngine.playPaperFlutter();
    });
    let teased = false;
    const wrap = root.querySelector('.mg-hoodie-wrap');
    const teaseTimers = [];
    const mo = new MutationObserver(() => {
      if (teased || !wrap.classList.contains('is-in') || reduceMotion()) return;
      teased = true;
      teaseTimers.push(setTimeout(() => setFlip(true), 900));
      teaseTimers.push(setTimeout(() => setFlip(false), 2600));
    });
    mo.observe(wrap, { attributes: true, attributeFilter: ['class'] });

    const stopReveal = setupReveal(root, container);
    return () => {
      stopReveal();
      mo.disconnect();
      teaseTimers.forEach(clearTimeout);
    };
  };
})();
