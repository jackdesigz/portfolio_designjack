/**
 * designjack — Layout dedicato a Gelato di Piazza (Brand Design)
 * window.PROJECT_LAYOUTS.gelato → marchio di una gelateria artigianale a Sesto Fiorentino:
 * moodboard, percorso del logo, marchio ricolorabile con la costruzione, palette a palline
 * di gelato, pattern di uccellini che si girano, coppette e grembiule, il sito (slider e
 * wireframe a confronto).
 * Il logo è disegnato in SVG dai tracciati originali (Asset 1.svg); "DI PIAZZA" è stato
 * convertito in tracciati dal DIN Condensed Bold, così è identico su ogni computer.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const KIT = window.ProjectKit || {};
  const esc = KIT.esc || ((s) => String(s == null ? '' : s));
  const zoom = KIT.zoom || (() => '');
  const setupReveal = KIT.setupReveal || (() => () => {});
  const reduceMotion = KIT.reduceMotion || (() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const GEO = {"word":["M143.6,23.75c0-3.91.68-7.37,2.05-10.37,1.37-3,3.18-5.5,5.46-7.51,2.18-1.91,4.66-3.36,7.44-4.37,2.77-1,5.57-1.5,8.39-1.5s5.62.5,8.39,1.5c2.77,1,5.3,2.46,7.57,4.37,2.18,2,3.96,4.5,5.32,7.51,1.36,3,2.05,6.46,2.05,10.37v4.91h-13.92v-4.91c0-3.36-.93-5.85-2.8-7.44-1.87-1.59-4.07-2.39-6.62-2.39s-4.75.8-6.62,2.39c-1.87,1.59-2.8,4.07-2.8,7.44v132.82c0,3.37.93,5.85,2.8,7.44,1.86,1.59,4.07,2.39,6.62,2.39s4.75-.8,6.62-2.39c1.86-1.59,2.8-4.07,2.8-7.44v-18.29h-11.05v-12.28h24.98v30.57c0,4.09-.68,7.6-2.05,10.51-1.37,2.91-3.14,5.32-5.32,7.23-2.28,2-4.8,3.5-7.57,4.5-2.78,1-5.57,1.5-8.39,1.5s-5.62-.5-8.39-1.5c-2.78-1-5.25-2.5-7.44-4.5-2.28-1.91-4.09-4.32-5.46-7.23-1.36-2.91-2.05-6.41-2.05-10.51V23.75Z","M176.26,115.26V41.44h31.52v9.95h-20.94v21.67h18.25v9.95h-18.25v21.67h20.94v10.58h-31.52Z","M214.62,115.26V41.44h10.58v63.25h20.94v10.58h-31.52Z","M248.21,115.26l16.49-73.82h8.81l16.49,73.82h-10.58l-3.11-15.86h-14.41l-3.11,15.86h-10.58ZM274.34,89.44l-5.18-26.75h-.21l-5.18,26.75h10.58Z","M296.43,115.26v-63.87h-12.23v-9.95h35.04v9.95h-12.23v63.87h-10.58Z","M322.03,58.86c0-2.97.52-5.6,1.56-7.88,1.04-2.28,2.42-4.18,4.15-5.7,1.66-1.45,3.54-2.56,5.65-3.32,2.11-.76,4.23-1.14,6.38-1.14s4.27.38,6.38,1.14c2.11.76,4.03,1.87,5.75,3.32,1.66,1.52,3.01,3.42,4.04,5.7,1.04,2.28,1.56,4.91,1.56,7.88v38.98c0,3.11-.52,5.77-1.56,7.98-1.04,2.21-2.38,4.04-4.04,5.5-1.73,1.52-3.65,2.66-5.75,3.42-2.11.76-4.24,1.14-6.38,1.14s-4.27-.38-6.38-1.14c-2.11-.76-3.99-1.9-5.65-3.42-1.73-1.45-3.11-3.28-4.15-5.5-1.04-2.21-1.56-4.87-1.56-7.98v-38.98ZM332.61,97.84c0,2.56.71,4.44,2.13,5.65,1.42,1.21,3.09,1.81,5.03,1.81s3.61-.6,5.03-1.81c1.42-1.21,2.13-3.09,2.13-5.65v-38.98c0-2.56-.71-4.44-2.13-5.65-1.42-1.21-3.09-1.81-5.03-1.81s-3.61.61-5.03,1.81c-1.42,1.21-2.13,3.09-2.13,5.65v38.98Z"],"di":"M2.56 -0.00L2.56 -37.91L10.59 -37.91Q15.28 -37.91 17.70 -35.35Q20.12 -32.80 20.12 -28.11L20.12 -10.38Q20.12 -5.06 17.54 -2.53Q14.96 -0.00 10.12 -0.00ZM7.99 -32.80L7.99 -5.11L10.49 -5.11Q12.78 -5.11 13.74 -6.26Q14.69 -7.40 14.69 -9.85L14.69 -28.11Q14.69 -30.35 13.79 -31.57Q12.88 -32.80 10.49 -32.80ZM25.40 -0.00L25.40 -37.91L30.83 -37.91L30.83 -0.00ZM46.00 -0.00L46.00 -37.91L54.15 -37.91Q56.38 -37.91 58.08 -37.32Q59.79 -36.74 61.17 -35.24Q62.56 -33.75 63.09 -31.76Q63.62 -29.76 63.62 -26.35Q63.62 -23.80 63.33 -22.04Q63.04 -20.28 62.08 -18.74Q60.96 -16.88 59.10 -15.84Q57.23 -14.80 54.20 -14.80L51.43 -14.80L51.43 -0.00ZM51.43 -32.80L51.43 -19.91L54.04 -19.91Q55.69 -19.91 56.59 -20.39Q57.50 -20.87 57.93 -21.72Q58.35 -22.52 58.43 -23.69Q58.51 -24.86 58.51 -26.30Q58.51 -27.63 58.46 -28.83Q58.40 -30.03 57.98 -30.93Q57.55 -31.84 56.70 -32.32Q55.85 -32.80 54.25 -32.80ZM67.83 -0.00L67.83 -37.91L73.26 -37.91L73.26 -0.00ZM89.50 -13.26L86.83 -26.99L86.73 -26.99L84.07 -13.26ZM76.08 -0.00L84.55 -37.91L89.07 -37.91L97.54 -0.00L92.11 -0.00L90.51 -8.15L83.11 -8.15L81.51 -0.00ZM98.44 -0.00L98.44 -4.79L108.66 -32.80L98.97 -32.80L98.97 -37.91L114.57 -37.91L114.57 -33.59L104.14 -5.11L114.57 -5.11L114.57 -0.00ZM116.17 -0.00L116.17 -4.79L126.39 -32.80L116.70 -32.80L116.70 -37.91L132.30 -37.91L132.30 -33.59L121.87 -5.11L132.30 -5.11L132.30 -0.00ZM146.62 -13.26L143.96 -26.99L143.85 -26.99L141.19 -13.26ZM133.21 -0.00L141.67 -37.91L146.20 -37.91L154.66 -0.00L149.23 -0.00L147.63 -8.15L140.23 -8.15L138.64 -0.00Z","body":"M95.79,51.94v17.01c0,2.26-.1,4.48-.29,6.65-2.04,22.81-15.17,40.35-46.71,40.35S2.89,96.68,1.86,72.26c-.08-1.8,1.34-3.31,3.14-3.31h42.66v-17.01c0-12.93,10.58-23.5,23.5-23.5h1.14c12.93,0,23.5,10.58,23.5,23.5Z","wing":"M75.11,83.38c0,9.58-10.2,14.23-26.29,14.23h0c-26.44,0-35.18-12.74-35.18-28.47h40.24c16.09,0,21.23,4.65,21.23,14.24Z","beak":"95.79 45.53 112.31 51.99 96.02 59.45","leg":[44.38,100.19,15.13,51.68],"eye":[72.6,45.53,4.76]};

  // ---------- il marchio in SVG ----------
  const bird = () => `
    <g class="gp-l-bird">
      <polyline class="gp-l-beak" points="${GEO.beak}"/>
      <rect class="gp-l-leg" x="${GEO.leg[0]}" y="${GEO.leg[1]}" width="${GEO.leg[2]}" height="${GEO.leg[3]}" rx="2" ry="2"/>
      <path class="gp-l-body" d="${GEO.body}"/>
      <circle class="gp-l-eye" cx="${GEO.eye[0]}" cy="${GEO.eye[1]}" r="${GEO.eye[2]}"/>
      <path class="gp-l-wing" d="${GEO.wing}"/>
    </g>`;
  // linee guida della costruzione (come la pagina della presentazione):
  // il corpo è un semicerchio, la testa un altro, la zampa un rettangolo
  const guides = () => `
    <g class="gp-l-guides" aria-hidden="true">
      <circle cx="48.82" cy="68.95" r="46.96"/>
      <circle cx="72.04" cy="52.19" r="23.75"/>
      <line x1="-6" y1="68.95" x2="104" y2="68.95"/>
      <line x1="48.29" y1="20" x2="48.29" y2="160"/>
      <circle cx="72.6" cy="45.53" r="9"/>
    </g>`;
  const logoSVG = (cls = '', label = 'Gelato di Piazza') => `
    <svg class="gp-logo ${cls}" viewBox="-3 -3 364 190" role="img" aria-label="${esc(label)}">
      ${guides()}
      ${bird()}
      <g class="gp-l-word">${GEO.word.map((d) => `<path d="${d}"/>`).join('')}</g>
      <path class="gp-l-di" transform="translate(202.09 166.96)" d="${GEO.di}"/>
    </svg>`;
  const birdSVG = (cls = '') => `
    <svg class="gp-logo gp-birdonly ${cls}" viewBox="-2 25 118 131" aria-hidden="true">${bird()}</svg>`;

  // colate di gelato: il bordo del blu sale a dita tonde e scende a gocce tonde
  function dripPath(W, H, top, seed) {
    let t = seed || 7;
    const rnd = () => { t = (t * 9301 + 49297) % 233280; return t / 233280; };
    let x = 0;
    let d = `M0 ${H} L0 ${top + 20}`;
    while (x < W) {
      const wf = 12 + rnd() * 14;
      const rf = wf / 2;
      const tf = top + rnd() * 14;
      d += ` L${x.toFixed(1)} ${(tf + rf).toFixed(1)} A${rf.toFixed(1)} ${rf.toFixed(1)} 0 0 1 ${(x + wf).toFixed(1)} ${(tf + rf).toFixed(1)}`;
      x += wf;
      if (x >= W) break;
      const wd = 34 + rnd() * 30;
      const rd = wd / 2;
      const dd = top + 64 + rnd() * (H - top - 92);
      d += ` L${x.toFixed(1)} ${(dd - rd).toFixed(1)} A${rd.toFixed(1)} ${rd.toFixed(1)} 0 0 0 ${(x + wd).toFixed(1)} ${(dd - rd).toFixed(1)}`;
      x += wd;
    }
    d += ` L${W} ${top + 20} L${W} ${H} Z`;
    return d;
  }
  const drips = (cls, seed) => `
    <svg class="gp-drips ${cls || ''}" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="${dripPath(1200, 200, 10, seed)}"/>
    </svg>`;

  LAYOUTS.gelato = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const steps = g.steps || [];
    const colors = g.colors || [];
    const fonts = g.fonts || [];
    const versions = g.versions || [];
    const banners = g.banners || [];
    const cleanups = [];

    container.innerHTML = `
      <div class="gp">

        <!-- APERTURA: il marchio su crema, l'uccellino guarda il puntatore, sotto cola il gelato -->
        <section class="gp-hero">
          <div class="gp-hero-copy">
            <p class="gp-kicker" data-reveal>${esc(g.kicker || '')}</p>
            <div class="gp-hero-logo" data-reveal style="--i:1;">${logoSVG('is-hero')}</div>
            <p class="gp-lead" data-reveal style="--i:2;">${g.lead || ''}</p>
          </div>
          ${drips('is-hero', 11)}
        </section>

        <!-- 01 MOODBOARD -->
        <section class="gp-sec gp-mood-sec">
          <header class="gp-head" data-reveal><span class="gp-num">01</span><h3 class="gp-h">${esc(g.moodTitle || 'Il moodboard')}</h3></header>
          <div class="gp-mood">
            <p class="gp-text" data-reveal>${g.moodText || ''}</p>
            <figure class="gp-mood-img" data-reveal style="--i:1;" ${zoom(B + 'moodboard.jpg', 'Gelato di Piazza — il moodboard')}>
              <img src="${B}moodboard.jpg" alt="Il moodboard: la torre e la piazza di Sesto Fiorentino, una spirale blu, la crema di gelato, un martin pescatore, un cono a tre gusti" loading="lazy" />
            </figure>
          </div>
        </section>

        <!-- 02 DALLA STATUA ALL'UCCELLINO: il percorso del logo -->
        <section class="gp-sec gp-steps-sec">
          ${drips('is-top', 23)}
          <header class="gp-head" data-reveal><span class="gp-num">02</span><h3 class="gp-h">${esc(g.stepsTitle || 'Il percorso')}</h3></header>
          <div class="gp-steps" data-reveal>
            <ol class="gp-steps-tabs" role="tablist" aria-label="Le tappe del logo">
              ${steps.map((s, i) => `<li><button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}" data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(s.title)}</span></button></li>`).join('')}
            </ol>
            <div class="gp-steps-view">
              <div class="gp-steps-stage">
                ${steps.map((s, i) => `<figure class="gp-step-img${i === 0 ? ' is-active' : ''}" ${zoom(B + s.src, s.title)}><img src="${B}${s.src}" alt="${esc(s.alt || s.title)}" loading="lazy" /></figure>`).join('')}
              </div>
              <div class="gp-steps-text">
                <p class="gp-steps-count"><span class="gp-steps-n">01</span> / ${String(steps.length).padStart(2, '0')}</p>
                <h4 class="gp-steps-title">${esc(steps[0] ? steps[0].title : '')}</h4>
                <p class="gp-steps-desc">${steps[0] ? steps[0].text : ''}</p>
                <div class="gp-steps-nav">
                  <button type="button" class="gp-arrow is-prev" aria-label="Tappa precedente">←</button>
                  <button type="button" class="gp-arrow is-next" aria-label="Tappa successiva">→</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 03 IL MARCHIO: versioni di colore e costruzione -->
        <section class="gp-sec gp-mark-sec">
          <header class="gp-head" data-reveal><span class="gp-num">03</span><h3 class="gp-h">${esc(g.markTitle || 'Il marchio')}</h3></header>
          <p class="gp-text" data-reveal>${g.markText || ''}</p>
          <div class="gp-mark" data-reveal>
            <div class="gp-mark-stage is-v-${esc(versions[0] ? versions[0].key : 'crema')}">
              ${logoSVG('is-mark')}
            </div>
            <div class="gp-mark-side">
              <p class="gp-label">Versioni</p>
              <div class="gp-mark-tabs" role="radiogroup" aria-label="Versione del marchio">
                ${versions.map((v, i) => `<button type="button" role="radio" aria-checked="${i === 0}" class="${i === 0 ? 'is-active' : ''}" data-v="${esc(v.key)}" style="--sw:${v.bg};"><i aria-hidden="true"></i>${esc(v.name)}</button>`).join('')}
              </div>
              <button type="button" class="gp-build-btn" aria-pressed="false"><span aria-hidden="true">◎</span> Mostra la costruzione</button>
              <p class="gp-mark-note">${g.buildText || ''}</p>
              <div class="gp-icons" aria-label="L’uccellino da solo, come icona">
                <span class="gp-icon is-crema">${birdSVG()}</span>
                <span class="gp-icon is-inv">${birdSVG()}</span>
                <span class="gp-icon is-nero">${birdSVG()}</span>
                <span class="gp-icon is-grigio">${birdSVG()}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 04 COLORI E CARATTERI: tre palline di gelato -->
        <section class="gp-sec gp-pal-sec">
          <header class="gp-head" data-reveal><span class="gp-num">04</span><h3 class="gp-h">${esc(g.paletteTitle || 'Colori e caratteri')}</h3></header>
          <div class="gp-pal">
            <div class="gp-cone" data-reveal>
              <div class="gp-scoops">
                ${colors.slice(0, 3).map((c, i) => `<button type="button" class="gp-scoop" style="--c:${c.hex}; --ink:${c.ink || '#2A2B2A'}; --i:${i};" data-hex="${c.hex}" aria-label="${esc(c.name)} ${c.hex}: copia il colore"><span class="gp-scoop-name">${esc(c.name)}</span><span class="gp-scoop-hex">${c.hex}</span></button>`).join('')}
              </div>
              <svg class="gp-cone-svg" viewBox="0 0 200 230" aria-hidden="true">
                <path d="M8 10 L100 222 L192 10 Z"/>
                <path class="gp-cone-grid" d="M30 10 L118 212 M62 10 L132 172 M94 10 L148 135 M126 10 L163 98 M158 10 L178 58 M170 10 L82 212 M138 10 L68 172 M106 10 L52 135 M74 10 L37 98 M42 10 L22 58"/>
              </svg>
              <p class="gp-copied" aria-live="polite"></p>
            </div>
            <div class="gp-pal-list" data-reveal style="--i:1;">
              ${colors.map((c) => `
                <div class="gp-pal-row">
                  <span class="gp-pal-chip" style="--c:${c.hex};"></span>
                  <div><b>${esc(c.name)}</b><span>${c.hex} · ${esc(c.rgb || '')}</span><em>${esc(c.use || '')}</em></div>
                </div>`).join('')}
              <div class="gp-fonts">
                ${fonts.map((f) => `
                  <div class="gp-font ${f.cls || ''}">
                    <p class="gp-label">${esc(f.use)}</p>
                    <p class="gp-font-sample">${esc(f.sample)}</p>
                    <p class="gp-font-name">${esc(f.name)}</p>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- 05 IL PATTERN: gli uccellini si girano a guardarti -->
        <section class="gp-pattern-sec">
          <div class="gp-pattern" aria-label="Il pattern di uccellini: passaci sopra, si girano a guardarti">
            <div class="gp-pattern-grid"></div>
            <div class="gp-pattern-card" data-reveal>
              <span class="gp-num">05</span>
              <h3 class="gp-h">${esc(g.patternTitle || 'Il pattern')}</h3>
              <p class="gp-text">${g.patternText || ''}</p>
            </div>
          </div>
          <div class="gp-sec gp-apps">
            <figure class="gp-app is-wide" data-reveal ${zoom(B + 'mockup-grembiule.jpg', 'Grembiule e coppette')}>
              <img src="${B}mockup-grembiule.jpg" alt="Il grembiule crema con il pattern di uccellini e il marchio, accanto alle coppette blu e crema" loading="lazy" />
              <figcaption>Grembiule e coppette</figcaption>
            </figure>
            <figure class="gp-app" data-reveal style="--i:1;" ${zoom(B + 'coppetta.jpg', 'La coppetta')}>
              <img src="${B}coppetta.jpg" alt="Una coppetta bianca con il pattern di uccellini e il marchio" loading="lazy" />
              <figcaption>La coppetta</figcaption>
            </figure>
            <figure class="gp-app" data-reveal style="--i:2;" ${zoom(B + 'coppetta-acqua.jpg', 'La coppetta, variante acqua')}>
              <img src="${B}coppetta-acqua.jpg" alt="La coppetta in una variante con il fondo azzurro acqua" loading="lazy" />
              <figcaption>Variante acqua</figcaption>
            </figure>
          </div>
        </section>

        <!-- 06 IL SITO: la home con lo slider vero, poi wireframe e mockup a confronto -->
        <section class="gp-sec gp-site-sec">
          <header class="gp-head" data-reveal><span class="gp-num">06</span><h3 class="gp-h">${esc(g.siteTitle || 'Il sito')}</h3></header>
          <p class="gp-text" data-reveal>${g.siteText || ''}</p>
          <div class="gp-browser" data-reveal>
            <div class="gp-browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>gelatodipiazza.it</span></div>
            <div class="gp-site">
              <div class="gp-site-head">
                <span class="gp-site-logo">${logoSVG('is-site', 'Gelato di Piazza')}</span>
                <span class="gp-site-social" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              </div>
              <nav class="gp-site-menu" aria-label="Menu del sito (prototipo)">${(g.menu || []).map((m) => `<span>${esc(m)}</span>`).join('')}</nav>
              <div class="gp-slider" aria-roledescription="carosello" aria-label="Banner del sito">
                <div class="gp-slides">
                  ${banners.map((b, i) => `<img class="gp-slide${i === 0 ? ' is-active' : ''}" src="${B}${b.src}" alt="${esc(b.alt)}" ${i ? 'loading="lazy"' : ''} />`).join('')}
                </div>
                <button type="button" class="gp-slide-btn is-prev" aria-label="Banner precedente">←</button>
                <button type="button" class="gp-slide-btn is-next" aria-label="Banner successivo">→</button>
                <div class="gp-slide-dots">${banners.map((b, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" data-i="${i}" aria-label="Banner ${i + 1}"></button>`).join('')}</div>
              </div>
              <div class="gp-site-box">
                <h4>${esc(g.siteBoxTitle || '')}</h4>
                <p>${g.siteBoxText || ''}</p>
                <div class="gp-site-cta"><span>${esc(g.siteHours || '')}</span><button type="button" class="gp-site-btn">Prenota Ora</button></div>
                <p class="gp-site-toast" aria-live="polite"></p>
              </div>
            </div>
          </div>

          <h4 class="gp-sub" data-reveal>${esc(g.compareTitle || 'Dal wireframe al mockup')}</h4>
          <div class="gp-compare" data-reveal style="--p:50%;">
            <img class="gp-cmp-a" src="${B}sito-mockup.jpg" alt="Il mockup della home: logo, menu, banner con la colata, testo e pulsante Prenota Ora" loading="lazy" />
            <img class="gp-cmp-b" src="${B}sito-wireframe.jpg" alt="Il wireframe della home: logo, menu, banner, titolo, paragrafo, pulsante e piè di pagina" loading="lazy" />
            <span class="gp-cmp-line" aria-hidden="true"><i>⟷</i></span>
            <span class="gp-cmp-tag is-b">Wireframe</span>
            <span class="gp-cmp-tag is-a">Mockup</span>
            <input type="range" min="0" max="100" value="50" aria-label="Sposta il confronto tra wireframe e mockup" />
          </div>
        </section>

        ${drips('is-end', 41)}
      </div>
    `;

    const root = container.querySelector('.gp');

    // ---- apertura: l'occhio segue il puntatore, al clic l'uccellino saltella
    const heroLogo = root.querySelector('.gp-logo.is-hero');
    const eye = heroLogo.querySelector('.gp-l-eye');
    const heroBird = heroLogo.querySelector('.gp-l-bird');
    const hero = root.querySelector('.gp-hero');
    // l'occhio si sposta molto di più (fino a 7 unità del disegno: resta dentro la testa),
    // con un piccolo rimbalzo; da fermo si guarda intorno da solo e ogni tanto sbatte le palpebre
    const EYE_MAX = 7;
    const setEye = (x, y) => { eye.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`; };
    let lastMove = 0;
    const look = (e) => {
      lastMove = performance.now();
      const r = heroLogo.getBoundingClientRect();
      const k = r.width / 364;
      const ex = r.left + (GEO.eye[0] + 3) * k;
      const ey = r.top + (GEO.eye[1] + 3) * k;
      const a = Math.atan2(e.clientY - ey, e.clientX - ex);
      const dist = Math.min(1, Math.hypot(e.clientX - ex, e.clientY - ey) / 90);
      setEye(Math.cos(a) * EYE_MAX * dist, Math.sin(a) * EYE_MAX * 0.85 * dist);
    };
    hero.addEventListener('pointermove', look);
    hero.addEventListener('pointerleave', () => { lastMove = 0; setEye(0, 0); });
    const blink = () => {
      eye.classList.remove('is-blink');
      void eye.getBoundingClientRect();
      eye.classList.add('is-blink');
    };
    eye.addEventListener('animationend', () => eye.classList.remove('is-blink'));
    if (!reduceMotion()) {
      let idleT = 0;
      const idle = () => {
        // se il puntatore è fermo da un po', l'uccellino si guarda intorno
        if (performance.now() - lastMove > 1800) {
          const a = Math.random() * Math.PI * 2;
          const d = Math.random() < 0.25 ? 0 : 0.6 + Math.random() * 0.4;
          setEye(Math.cos(a) * EYE_MAX * d, Math.sin(a) * EYE_MAX * 0.85 * d);
        }
        if (Math.random() < 0.35) blink();
        idleT = setTimeout(idle, 1100 + Math.random() * 1500);
      };
      idleT = setTimeout(idle, 900);
      cleanups.push(() => clearTimeout(idleT));
    }
    const hop = (b) => {
      b.classList.remove('is-hop');
      void b.getBoundingClientRect();
      b.classList.add('is-hop');
    };
    heroBird.addEventListener('click', () => hop(heroBird));
    heroBird.addEventListener('animationend', () => heroBird.classList.remove('is-hop'));

    // ---- percorso del logo: tappe con frecce e linguette
    const stepTabs = Array.from(root.querySelectorAll('.gp-steps-tabs button'));
    const stepImgs = Array.from(root.querySelectorAll('.gp-step-img'));
    const stepN = root.querySelector('.gp-steps-n');
    const stepTitle = root.querySelector('.gp-steps-title');
    const stepDesc = root.querySelector('.gp-steps-desc');
    let cur = 0;
    const showStep = (i) => {
      cur = (i + steps.length) % steps.length;
      const s = steps[cur];
      stepTabs.forEach((b, k) => { b.classList.toggle('is-active', k === cur); b.setAttribute('aria-selected', String(k === cur)); });
      stepImgs.forEach((f, k) => f.classList.toggle('is-active', k === cur));
      stepN.textContent = String(cur + 1).padStart(2, '0');
      stepTitle.textContent = s.title;
      stepDesc.innerHTML = s.text;
    };
    stepTabs.forEach((b, i) => b.addEventListener('click', () => showStep(i)));
    root.querySelector('.gp-steps .is-prev').addEventListener('click', () => showStep(cur - 1));
    root.querySelector('.gp-steps .is-next').addEventListener('click', () => showStep(cur + 1));

    // ---- marchio: versioni e costruzione
    const markStage = root.querySelector('.gp-mark-stage');
    const vBtns = Array.from(root.querySelectorAll('.gp-mark-tabs button'));
    vBtns.forEach((b) => b.addEventListener('click', () => {
      versions.forEach((v) => markStage.classList.remove(`is-v-${v.key}`));
      markStage.classList.add(`is-v-${b.dataset.v}`);
      vBtns.forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', String(x === b)); });
    }));
    const buildBtn = root.querySelector('.gp-build-btn');
    buildBtn.addEventListener('click', () => {
      const on = !markStage.classList.contains('is-build');
      markStage.classList.toggle('is-build', on);
      buildBtn.setAttribute('aria-pressed', String(on));
      buildBtn.lastChild.textContent = on ? ' Nascondi la costruzione' : ' Mostra la costruzione';
    });

    // ---- palette: una pallina copia il suo colore
    const copied = root.querySelector('.gp-copied');
    let copyT = 0;
    root.querySelectorAll('.gp-scoop').forEach((s) => s.addEventListener('click', () => {
      const hex = s.dataset.hex;
      const done = () => {
        copied.textContent = `${hex} copiato!`;
        copied.classList.add('is-on');
        clearTimeout(copyT);
        copyT = setTimeout(() => copied.classList.remove('is-on'), 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(hex).then(done, done);
      else done();
      hop(s);
    }));
    root.querySelectorAll('.gp-scoop').forEach((s) => s.addEventListener('animationend', () => s.classList.remove('is-hop')));
    cleanups.push(() => clearTimeout(copyT));

    // ---- pattern: una griglia di uccellini; quelli vicini al puntatore si girano e saltano
    const grid = root.querySelector('.gp-pattern-grid');
    const patternBox = root.querySelector('.gp-pattern');
    let cells = [];
    const buildGrid = () => {
      const w = patternBox.clientWidth;
      const h = patternBox.clientHeight;
      const step = Math.max(92, Math.min(150, w / 9));
      const cols = Math.ceil(w / step) + 2;
      const rows = Math.ceil(h / (step * 0.82)) + 2;
      let html = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c - 0.5) * step + (r % 2 ? step / 2 : 0);
          const y = (r - 0.6) * step * 0.82;
          html += `<span class="gp-pbird" style="left:${x.toFixed(0)}px; top:${y.toFixed(0)}px; width:${(step * 0.78).toFixed(0)}px;">${birdSVG()}</span>`;
        }
      }
      grid.innerHTML = html;
      cells = Array.from(grid.children).map((el) => ({ el, x: 0, y: 0 }));
      const gb = grid.getBoundingClientRect();
      cells.forEach((c) => {
        const r = c.el.getBoundingClientRect();
        c.x = r.left - gb.left + r.width / 2;
        c.y = r.top - gb.top + r.height / 2;
      });
    };
    buildGrid();
    let lastW = patternBox.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(patternBox.clientWidth - lastW) < 2) return;
      lastW = patternBox.clientWidth;
      buildGrid();
    });
    ro.observe(patternBox);
    cleanups.push(() => ro.disconnect());
    let pRaf = 0;
    let pEv = null;
    const pMove = () => {
      pRaf = 0;
      if (!pEv) return;
      const gb = grid.getBoundingClientRect();
      const px = pEv.clientX - gb.left;
      const py = pEv.clientY - gb.top;
      cells.forEach((c) => {
        const near = Math.hypot(c.x - px, c.y - py) < 150;
        // si girano verso il puntatore: lo guardano
        c.el.classList.toggle('is-look', near);
        c.el.classList.toggle('is-left', near && px < c.x);
      });
    };
    patternBox.addEventListener('pointermove', (e) => { pEv = e; if (!pRaf) pRaf = requestAnimationFrame(pMove); });
    patternBox.addEventListener('pointerleave', () => { pEv = null; cells.forEach((c) => c.el.classList.remove('is-look', 'is-left')); });
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.gp-pbird');
      if (b) hop(b);
    });
    grid.addEventListener('animationend', (e) => { const b = e.target.closest('.gp-pbird'); if (b) b.classList.remove('is-hop'); });
    cleanups.push(() => cancelAnimationFrame(pRaf));

    // ---- sito: slider dei banner come nella home (frecce, puntini, avanza da solo)
    const slides = Array.from(root.querySelectorAll('.gp-slide'));
    const dots = Array.from(root.querySelectorAll('.gp-slide-dots button'));
    let si = 0;
    let auto = 0;
    const showSlide = (i, user) => {
      si = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === si));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === si));
      if (user) restart();
    };
    const slider = root.querySelector('.gp-slider');
    const restart = () => {
      clearInterval(auto);
      if (reduceMotion()) return;
      auto = setInterval(() => { if (slider.isConnected && !slider.matches(':hover')) showSlide(si + 1); }, 4200);
    };
    root.querySelector('.gp-slide-btn.is-prev').addEventListener('click', () => showSlide(si - 1, true));
    root.querySelector('.gp-slide-btn.is-next').addEventListener('click', () => showSlide(si + 1, true));
    dots.forEach((d, k) => d.addEventListener('click', () => showSlide(k, true)));
    restart();
    cleanups.push(() => clearInterval(auto));
    const toast = root.querySelector('.gp-site-toast');
    let toastT = 0;
    root.querySelector('.gp-site-btn').addEventListener('click', () => {
      toast.textContent = 'È un prototipo: qui si prenoterebbe il gelato.';
      toast.classList.add('is-on');
      clearTimeout(toastT);
      toastT = setTimeout(() => toast.classList.remove('is-on'), 2400);
    });
    cleanups.push(() => clearTimeout(toastT));

    // ---- wireframe / mockup: la linea si trascina
    const cmp = root.querySelector('.gp-compare');
    const range = cmp.querySelector('input');
    range.addEventListener('input', () => cmp.style.setProperty('--p', `${range.value}%`));

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };
})();
