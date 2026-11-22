/**
 * designjack — Layout dedicati ai progetti di Editorial Design
 * window.PROJECT_LAYOUTS.mao       → MAO Museo d'Arte Orientale (catalogo, gabbia 7×5, campagna OOH)
 * window.PROJECT_LAYOUTS.decoder   → Decoder (rivista cyberpunk come fanzine punk: cut-up, micropunti, un’opera uno stile)
 * window.PROJECT_LAYOUTS.modartech → Modartech (magazine di fotografia: schemi di luce, foto vs AI)
 *
 * Tutti e tre hanno un lettore sfogliabile (createFlipbook) con le pagine vere della pubblicazione.
 * Ogni layout disegna la pagina e restituisce la funzione di pulizia per la modal.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const KIT = window.ProjectKit || {};
  const reduceMotion = KIT.reduceMotion || (() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const esc = KIT.esc || ((s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const zoom = KIT.zoom || ((src, caption) => `class="zoomable-trigger" data-img-src="${src}" data-img-caption="${esc(caption)}"`);
  const setupReveal = KIT.setupReveal || (() => () => {});
  const pad2 = (n) => String(n).padStart(2, '0');

  // l'elemento è (almeno in parte) visibile dentro la scheda progetto?
  function inView(el) {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    const scroller = el.closest('.project-modal-card');
    let top = 0;
    let bottom = window.innerHeight;
    if (scroller) {
      const s = scroller.getBoundingClientRect();
      top = Math.max(top, s.top);
      bottom = Math.min(bottom, s.bottom);
    }
    return r.bottom > top + 60 && r.top < bottom - 60;
  }

  /* ==================================================================
     LETTORE SFOGLIABILE
     pagine: array di URL (una per facciata). La copertina sta da sola a
     destra, poi le doppie pagine (pari a sinistra, dispari a destra).
     Su schermi stretti si legge una pagina alla volta.
     ================================================================== */
  function createFlipbook(root, opts) {
    const pages = opts.pages || [];
    const N = pages.length;
    const ratio = opts.ratio || 0.7; // larghezza / altezza di una pagina
    const label = opts.label || 'Pagina';
    const maxH = opts.maxHeight || 0.74; // frazione dell'altezza della finestra
    const cache = new Map();
    const lastSpread = Math.floor(N / 2);

    root.classList.add('fb');
    root.innerHTML = `
      <div class="fb-stage">
        <div class="fb-book">
          <div class="fb-half fb-l"><img alt="" draggable="false" /></div>
          <div class="fb-half fb-r"><img alt="" draggable="false" /></div>
          <div class="fb-spine" aria-hidden="true"></div>
          <div class="fb-leaf" aria-hidden="true">
            <div class="fb-face fb-front"><img alt="" draggable="false" /></div>
            <div class="fb-face fb-back"><img alt="" draggable="false" /></div>
          </div>
        </div>
      </div>
      <div class="fb-bar">
        <button type="button" class="fb-btn fb-prev" aria-label="Pagina precedente"><span aria-hidden="true">←</span></button>
        <input type="range" class="fb-range" min="0" value="0" aria-label="Scorri le pagine" />
        <span class="fb-count" aria-live="polite"></span>
        <button type="button" class="fb-btn fb-zoom zoomable-trigger" data-img-src="" data-img-caption="" aria-label="Ingrandisci la pagina"><span aria-hidden="true">⤢</span></button>
        <button type="button" class="fb-btn fb-next" aria-label="Pagina successiva"><span aria-hidden="true">→</span></button>
      </div>`;

    const stage = root.querySelector('.fb-stage');
    const book = root.querySelector('.fb-book');
    const halfL = root.querySelector('.fb-l');
    const halfR = root.querySelector('.fb-r');
    const imgL = halfL.querySelector('img');
    const imgR = halfR.querySelector('img');
    const leaf = root.querySelector('.fb-leaf');
    const front = leaf.querySelector('.fb-front img');
    const back = leaf.querySelector('.fb-back img');
    const range = root.querySelector('.fb-range');
    const count = root.querySelector('.fb-count');
    const zoomBtn = root.querySelector('.fb-zoom');
    const prevBtn = root.querySelector('.fb-prev');
    const nextBtn = root.querySelector('.fb-next');

    let single = false;
    let spread = 0; // modalità doppia
    let page = 0; // modalità singola
    let busy = false;
    let doneTimer = 0;

    const preload = (i) => {
      if (i < 0 || i >= N || cache.has(i)) return;
      const im = new Image();
      im.decoding = 'async';
      im.src = pages[i];
      cache.set(i, im);
    };
    const setImg = (img, i) => {
      const host = img.parentElement;
      if (i == null || i < 0 || i >= N) {
        host.classList.add('is-empty');
        img.removeAttribute('src');
        return;
      }
      host.classList.remove('is-empty');
      if (img.getAttribute('src') !== pages[i]) img.src = pages[i];
      img.alt = `${label} ${i + 1}`;
    };
    const L = (s) => (s === 0 ? null : 2 * s - 1);
    const R = (s) => (2 * s < N ? 2 * s : null);

    function layout() {
      const w = stage.clientWidth || root.clientWidth || 600;
      const hMax = Math.max(260, window.innerHeight * maxH);
      const wasSingle = single;
      single = w / 2 / ratio < 200 || w < 560;
      let bw;
      let bh;
      if (single) {
        bw = Math.min(w, hMax * ratio);
        bh = bw / ratio;
      } else {
        bw = Math.min(w, hMax * ratio * 2);
        bh = bw / (ratio * 2);
      }
      book.style.width = `${Math.round(bw)}px`;
      book.style.height = `${Math.round(bh)}px`;
      root.classList.toggle('is-single', single);
      if (wasSingle !== single) {
        // passa da una modalità all'altra restando sulla stessa pagina
        if (single) page = spread === 0 ? 0 : L(spread);
        else spread = page === 0 ? 0 : Math.floor((page + 1) / 2);
        render();
      }
    }

    function render() {
      finish();
      if (single) {
        range.max = String(N - 1);
        range.value = String(page);
        halfL.classList.add('is-empty');
        setImg(imgR, page);
        book.classList.remove('is-cover', 'is-end');
        count.textContent = `${pad2(page + 1)} / ${pad2(N)}`;
        prevBtn.disabled = page <= 0;
        nextBtn.disabled = page >= N - 1;
        for (let k = page - 1; k <= page + 2; k++) preload(k);
      } else {
        range.max = String(lastSpread);
        range.value = String(spread);
        setImg(imgL, L(spread));
        setImg(imgR, R(spread));
        book.classList.toggle('is-cover', spread === 0);
        book.classList.toggle('is-end', R(spread) == null && spread > 0);
        const a = L(spread);
        const b = R(spread);
        const nums = [a, b].filter((x) => x != null).map((x) => pad2(x + 1));
        count.textContent = `${nums.join('–')} / ${pad2(N)}`;
        prevBtn.disabled = spread <= 0;
        nextBtn.disabled = spread >= lastSpread;
        for (let k = L(spread) - 2; k <= (R(spread) || 0) + 4; k++) preload(k);
      }
      const zi = single ? page : (R(spread) != null ? R(spread) : L(spread));
      zoomBtn.setAttribute('data-img-src', pages[zi] || '');
      zoomBtn.setAttribute('data-img-caption', `${opts.title || ''} — ${label.toLowerCase()} ${zi + 1}`);
      if (opts.onChange) opts.onChange(single ? page : Math.max(0, L(spread) || 0));
    }

    function finish() {
      clearTimeout(doneTimer);
      leaf.className = 'fb-leaf';
      leaf.style.transform = '';
      busy = false;
    }

    // girata animata: dir = +1 avanti, -1 indietro
    function turn(dir) {
      if (busy) return;
      if (single) {
        const to = page + dir;
        if (to < 0 || to >= N) return;
        if (reduceMotion()) { page = to; render(); return; }
        busy = true;
        if (dir > 0) {
          setImg(front, page);
          setImg(imgR, to);
          leaf.className = 'fb-leaf is-single-out';
        } else {
          setImg(front, to);
          leaf.className = 'fb-leaf is-single-in';
        }
        requestAnimationFrame(() => requestAnimationFrame(() => leaf.classList.add('is-go')));
        doneTimer = setTimeout(() => { page = to; busy = false; render(); }, 620);
        return;
      }
      const to = spread + dir;
      if (to < 0 || to > lastSpread) return;
      if (reduceMotion()) { spread = to; render(); return; }
      busy = true;
      if (dir > 0) {
        setImg(front, R(spread));
        setImg(back, L(to));
        setImg(imgR, R(to));
        leaf.className = 'fb-leaf is-fwd';
      } else {
        setImg(front, L(spread));
        setImg(back, R(to));
        setImg(imgL, L(to));
        leaf.className = 'fb-leaf is-back';
      }
      book.classList.toggle('is-cover', to === 0);
      book.classList.toggle('is-end', R(to) == null && to > 0);
      requestAnimationFrame(() => requestAnimationFrame(() => leaf.classList.add('is-go')));
      doneTimer = setTimeout(() => { spread = to; busy = false; render(); }, 860);
    }

    function goPage(p) {
      p = Math.max(0, Math.min(N - 1, p));
      if (single) page = p;
      else spread = p === 0 ? 0 : Math.floor((p + 1) / 2);
      book.classList.add('is-jump');
      render();
      setTimeout(() => book.classList.remove('is-jump'), 380);
    }

    // comandi
    prevBtn.addEventListener('click', () => turn(-1));
    nextBtn.addEventListener('click', () => turn(1));
    range.addEventListener('input', () => {
      const v = Number(range.value);
      if (single) goPage(v);
      else goPage(v === 0 ? 0 : 2 * v - 1);
    });
    let swiped = false;
    book.addEventListener('click', (e) => {
      // dopo uno swipe il browser manda anche un clic: non deve girare due volte
      if (swiped) { swiped = false; return; }
      const r = book.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      turn(x < (single ? 0.35 : 0.5) ? -1 : 1);
    });
    let sx = null;
    let sy = 0;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; swiped = false; }, { passive: true });
    stage.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiped = true;
        setTimeout(() => { swiped = false; }, 400);
        turn(dx < 0 ? 1 : -1);
      }
    }, { passive: true });

    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (document.activeElement === range) return;
      const lb = document.getElementById('project-lightbox');
      if (lb && lb.classList.contains('active')) return;
      if (!inView(book)) return;
      e.preventDefault();
      turn(e.key === 'ArrowLeft' ? -1 : 1);
    };
    window.addEventListener('keydown', onKey);

    let ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => layout());
      ro.observe(stage);
    } else {
      window.addEventListener('resize', layout);
    }
    layout();
    render();

    return {
      goPage,
      destroy() {
        clearTimeout(doneTimer);
        window.removeEventListener('keydown', onKey);
        if (ro) ro.disconnect();
        else window.removeEventListener('resize', layout);
      }
    };
  }

  const pageList = (base, n, v) => Array.from({ length: n }, (_, i) => `${base}pages/${pad2(i + 1)}.jpg${v ? `?v=${v}` : ''}`);

  /* ==================================================================
     MAO — MUSEO D'ARTE ORIENTALE
     Bianco riso, Rosso "MAO", inchiostro; Gill Sans e Rotis Semi Serif.
     ================================================================== */
  LAYOUTS.mao = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const principles = g.principles || [];
    const chapters = g.chapters || [];
    const colors = g.colors || [];
    const ooh = g.ooh || [];
    const cleanups = [];

    // gabbia: doppia pagina 35 × 25 (unità = mm), canone di Van de Graaf + moduli 7 × 5
    const W = 350;
    const H = 250;
    const tb = (x0) => ({ x: x0, y: H / 9, w: (6 * W) / 9, h: (6 * H) / 9 });
    const blocks = [tb((2 * W) / 9), tb(W + W / 9)];
    const gut = 4;
    const mods = [];
    blocks.forEach((b, bi) => {
      const mw = (b.w - 6 * gut) / 7;
      const mh = (b.h - 4 * gut) / 5;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
          const order = bi * 35 + r * 7 + c;
          mods.push(`<rect class="mao-g-mod" style="--i:${order};" x="${(b.x + c * (mw + gut)).toFixed(1)}" y="${(b.y + r * (mh + gut)).toFixed(1)}" width="${mw.toFixed(1)}" height="${mh.toFixed(1)}"/>`);
        }
      }
    });
    const lead = 4.06; // 11,5 pt in mm
    const baselines = [];
    for (let y = blocks[0].y + lead; y < blocks[0].y + blocks[0].h; y += lead) {
      baselines.push(`<line x1="${blocks[0].x}" x2="${blocks[0].x + blocks[0].w}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
      baselines.push(`<line x1="${blocks[1].x}" x2="${blocks[1].x + blocks[1].w}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
    }
    const gridSvg = `
      <svg class="mao-grid-svg" viewBox="-6 -6 ${2 * W + 12} ${H + 12}" role="img" aria-label="Costruzione della gabbia: canone di Van de Graaf e moduli 7 per 5">
        <rect class="mao-g-page" x="0" y="0" width="${W}" height="${H}"/>
        <rect class="mao-g-page" x="${W}" y="0" width="${W}" height="${H}"/>
        <g class="mao-g-base">${baselines.join('')}</g>
        <g class="mao-g-diag">
          <line style="--d:0" x1="0" y1="0" x2="${2 * W}" y2="${H}"/>
          <line style="--d:1" x1="${2 * W}" y1="0" x2="0" y2="${H}"/>
          <line style="--d:2" x1="0" y1="${H}" x2="${W}" y2="0"/>
          <line style="--d:3" x1="${2 * W}" y1="${H}" x2="${W}" y2="0"/>
        </g>
        <g class="mao-g-mods">${mods.join('')}</g>
        ${blocks.map((b) => `<rect class="mao-g-block" x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}"/>`).join('')}
        <line class="mao-g-spine" x1="${W}" y1="-6" x2="${W}" y2="${H + 6}"/>
      </svg>`;

    const kanjiMask = (n, extra = '') => `style="${extra}-webkit-mask-image:url('${B}kanji-${n}.png');mask-image:url('${B}kanji-${n}.png');"`;

    container.innerHTML = `
      <div class="mao">

        <!-- APERTURA: kanji in grigio, fascia rossa e il Kongo Rikishi che la attraversa -->
        <section class="mao-hero">
          <div class="mao-hero-kanji" aria-hidden="true">
            ${[1, 2, 3, 4].map((n) => `<span class="mao-kj" ${kanjiMask(n, `--i:${n};`)}></span>`).join('')}
          </div>
          <div class="mao-hero-copy" data-reveal>
            <img class="mao-logo" src="${B}logo.png" alt="MAO museo d’arte orientale — il museo, le opere, l’idea" />
            <p class="mao-kicker">${esc(g.kicker || '')}</p>
            <p class="mao-lead">${g.lead || ''}</p>
            <dl class="mao-facts">
              ${(g.facts || []).map((f) => `<div><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('')}
            </dl>
          </div>
          <div class="mao-hero-art" aria-hidden="true">
            <span class="mao-band"></span>
            <img class="mao-statue" src="${B}kongo-rikishi.png" alt="" />
          </div>
        </section>

        <!-- 01 IL CONCEPT: quattro principi zen -->
        <section class="mao-sec mao-concept">
          <header class="mao-head" data-reveal><span class="mao-num">01</span><h3 class="mao-h">${esc(g.conceptTitle || 'Il concept')}</h3></header>
          <div class="mao-concept-intro" data-reveal>
            ${(g.conceptText || []).map((p) => `<p>${p}</p>`).join('')}
          </div>
          <div class="mao-principles" role="tablist" aria-label="I quattro principi">
            ${principles.map((p, i) => `
              <button type="button" class="mao-pr${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0}" data-i="${i}" data-reveal style="--i:${i};">
                <span class="mao-pr-kanji" ${kanjiMask(i + 1)} aria-hidden="true"></span>
                <span class="mao-pr-name"><em>“${esc(p.jp)}”</em> ${esc(p.it)}</span>
              </button>`).join('')}
          </div>
          <div class="mao-pr-panel" role="tabpanel" aria-live="polite" data-reveal>
            ${principles.map((p, i) => `<p class="mao-pr-text${i === 0 ? ' is-active' : ''}" data-i="${i}">${p.text}</p>`).join('')}
          </div>
        </section>

        <!-- 02 LA GABBIA: costruzione disegnata dal vivo -->
        <section class="mao-sec mao-grid">
          <header class="mao-head" data-reveal><span class="mao-num">02</span><h3 class="mao-h">${esc(g.gridTitle || 'La gabbia')}</h3></header>
          <div class="mao-grid-wrap">
            <figure class="mao-grid-fig" data-reveal>
              ${gridSvg}
              <figcaption>
                <span><i class="sw-diag"></i>Canone di Van de Graaf</span>
                <span><i class="sw-mod"></i>Moduli quadrati 7 × 5</span>
                <span><i class="sw-base"></i>Baseline grid, 11,5 pt</span>
              </figcaption>
            </figure>
            <div class="mao-grid-copy" data-reveal>
              ${(g.gridText || []).map((p) => `<p>${p}</p>`).join('')}
              <ul class="mao-grid-nums">
                ${(g.gridNumbers || []).map((n) => `<li><strong>${esc(n.v)}</strong><span>${esc(n.k)}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        </section>

        <!-- 03 IL CATALOGO: sfogliabile, con i capitoli -->
        <section class="mao-sec mao-book">
          <header class="mao-head" data-reveal><span class="mao-num">03</span><h3 class="mao-h">${esc(g.bookTitle || 'Il catalogo')}</h3></header>
          <p class="mao-text" data-reveal>${g.bookText || ''}</p>
          <nav class="mao-chapters" aria-label="Capitoli del catalogo" data-reveal>
            ${chapters.map((c) => `<button type="button" class="mao-ch" data-page="${c.page}"><b>${pad2(c.page)}</b>${esc(c.title)}</button>`).join('')}
          </nav>
          <div class="mao-reader" data-reveal></div>
          <img class="mao-samurai" src="${B}samurai.png" alt="" aria-hidden="true" loading="lazy" />
        </section>

        <!-- 04 IL COLORE -->
        <section class="mao-sec mao-colors-sec">
          <header class="mao-head" data-reveal><span class="mao-num">04</span><h3 class="mao-h">${esc(g.colorsTitle || 'Il colore')}</h3></header>
          <div class="mao-colors">
            ${colors.map((c, i) => `
              <div class="mao-color" data-reveal style="--i:${i}; --c:${c.hex}; --t:${c.ink || '#000'}; --w:${c.weight || 1};">
                <strong>${esc(c.name)}</strong>
                <span>${esc(c.note || '')}</span>
                <code>${esc(c.cmyk)}<br>${esc(c.hex)}</code>
              </div>`).join('')}
          </div>
        </section>

        <!-- 05 TIPOGRAFIA -->
        <section class="mao-sec mao-type">
          <header class="mao-head" data-reveal><span class="mao-num">05</span><h3 class="mao-h">${esc(g.typeTitle || 'Tipografia')}</h3></header>
          <div class="mao-fonts">
            ${(g.fonts || []).map((f, i) => `
              <article class="mao-font mao-font-${i}" data-reveal style="--i:${i};">
                <span class="mao-font-aa" aria-hidden="true">Aa</span>
                <h4>${esc(f.name)}</h4>
                <p class="mao-font-sample">${f.sample}</p>
                <p class="mao-font-note">${f.note}</p>
              </article>`).join('')}
          </div>
        </section>

        <!-- 06 FUORI DAL MUSEO: campagna -->
        <section class="mao-sec mao-ooh">
          <header class="mao-head" data-reveal><span class="mao-num">06</span><h3 class="mao-h">${esc(g.oohTitle || 'La campagna')}</h3></header>
          <p class="mao-text" data-reveal>${g.oohText || ''}</p>
          <figure class="mao-banner" data-reveal ${zoom(B + 'banner.jpg', 'Banner orizzontale')}>
            <img src="${B}banner.jpg" alt="Il banner orizzontale del MAO: logo, Kongo Rikishi e orari delle collezioni permanenti" loading="lazy" />
          </figure>
          ${g.poster ? `
          <div class="mao-poster-row">
            <figure class="mao-poster" data-reveal style="--ar:${g.poster.ratio};" ${zoom(B + g.poster.src, g.poster.title)}>
              <img src="${B}${g.poster.src}" alt="${esc(g.poster.alt || g.poster.title)}" loading="lazy" />
            </figure>
            ${g.totem ? `<figure class="mao-poster is-totem" data-reveal style="--i:1; --ar:${g.totem.ratio};" ${zoom(B + g.totem.src, g.totem.title)}>
              <img src="${B}${g.totem.src}" alt="${esc(g.totem.alt || g.totem.title)}" loading="lazy" />
            </figure>` : ''}
            <div class="mao-poster-copy" data-reveal style="--i:2;">
              ${[g.poster, g.totem].filter(Boolean).map((m) => `
                <div class="mao-poster-note">
                  <p class="mao-kind">${esc(m.kind)}</p>
                  <h4>${esc(m.title)}</h4>
                  <p>${m.text}</p>
                </div>`).join('')}
            </div>
          </div>` : ''}
          ${g.insta ? `
          <div class="mao-ig" data-reveal>
            <div class="mao-ig-copy">
              <p class="mao-kind">${esc(g.insta.kind)}</p>
              <h4>${esc(g.insta.title)}</h4>
              <p>${g.insta.text}</p>
              <div class="mao-ig-tabs" role="group" aria-label="Scegli il post">
                <button type="button" class="is-active" aria-pressed="true" data-i="-1">Tutti</button>
                ${(g.insta.posts || []).map((pt, i) => `<button type="button" aria-pressed="false" data-i="${i}">${esc(pt.name)}</button>`).join('')}
              </div>
            </div>
            <div class="mao-ig-view" style="--ar:${g.insta.ratio};">
              <img src="${B}${g.insta.src}" alt="${esc(g.insta.alt || g.insta.title)}" loading="lazy" />
              <span class="mao-ig-hint" aria-hidden="true">clicca un post</span>
            </div>
          </div>` : ''}
          <div class="mao-ooh-rows">
            ${[ooh.slice(0, 2), ooh.slice(2)].filter((r) => r.length).map((row) => `
              <div class="mao-ooh-row">
                ${row.map((m, i) => `
                  <figure class="mao-ooh-item" data-reveal style="--i:${i}; --ar:${m.ratio || 1.4};" ${zoom(B + m.src, m.title)}>
                    <img src="${B}${m.src}" alt="${esc(m.alt || m.title)}" loading="lazy" />
                    <figcaption><strong>${esc(m.kind || '')}</strong> ${esc(m.title || '')}</figcaption>
                  </figure>`).join('')}
              </div>`).join('')}
          </div>
        </section>
      </div>
    `;

    const root = container.querySelector('.mao');

    // Instagram: si sceglie un post e la vista si avvicina fino a leggerlo
    const ig = root.querySelector('.mao-ig');
    if (ig && g.insta) {
      const posts = g.insta.posts || [];
      const view = ig.querySelector('.mao-ig-view');
      const img = view.querySelector('img');
      const btns = Array.from(ig.querySelectorAll('.mao-ig-tabs button'));
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      let cur = -1;
      const show = (i) => {
        cur = i;
        const p = posts[i];
        if (!p) {
          img.style.transform = 'translate(0%, 0%) scale(1)';
        } else {
          const s = Math.min(3.2, Math.min(100 / p.w, 100 / p.h) * 0.94);
          const tx = clamp(50 - s * (p.x + p.w / 2), 100 - 100 * s, 0);
          const ty = clamp(50 - s * (p.y + p.h / 2), 100 - 100 * s, 0);
          img.style.transform = `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${s.toFixed(3)})`;
        }
        view.classList.toggle('is-zoomed', !!p);
        btns.forEach((b) => { const on = Number(b.dataset.i) === i; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      };
      btns.forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.i))));
      // clic sulla foto: da lontano apre il post sotto il puntatore, da vicino torna a tutti
      view.addEventListener('click', (e) => {
        if (cur !== -1) { show(-1); return; }
        const r = view.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        const hit = posts.findIndex((p) => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h);
        if (hit !== -1) show(hit);
      });
    }

    // principi: un pannello alla volta
    const prBtns = Array.from(root.querySelectorAll('.mao-pr'));
    const prTexts = Array.from(root.querySelectorAll('.mao-pr-text'));
    const pick = (i) => {
      prBtns.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', String(k === i)); });
      prTexts.forEach((t, k) => t.classList.toggle('is-active', k === i));
    };
    prBtns.forEach((b, i) => {
      b.addEventListener('click', () => pick(i));
      b.addEventListener('mouseenter', () => pick(i));
      b.addEventListener('focus', () => pick(i));
    });

    // catalogo sfogliabile
    const chBtns = Array.from(root.querySelectorAll('.mao-ch'));
    const fb = createFlipbook(root.querySelector('.mao-reader'), {
      pages: pageList(B, g.pages || 36),
      ratio: 1100 / 785,
      title: 'Catalogo MAO',
      maxHeight: 0.6,
      onChange(p) {
        let cur = -1;
        chapters.forEach((c, k) => { if (p + 1 >= c.page) cur = k; });
        chBtns.forEach((b, k) => b.classList.toggle('is-current', k === cur));
      }
    });
    cleanups.push(() => fb.destroy());
    chBtns.forEach((b) => b.addEventListener('click', () => fb.goPage(Number(b.dataset.page) - 1)));

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };

  // esegue fn(el) la prima volta che el (o il suo antenato con data-reveal) riceve .is-in
  function onReveal(el, fn) {
    const host = el.closest('[data-reveal]') || el;
    if (host.classList.contains('is-in')) { fn(el); return () => {}; }
    const mo = new MutationObserver(() => {
      if (host.classList.contains('is-in')) { mo.disconnect(); fn(el); }
    });
    mo.observe(host, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }

  /* ==================================================================
     DECODER — rivista cyberpunk, impaginata come una fanzine punk
     Fotocopie strappate, nastro adesivo, lettere ritagliate, timbri.
     Ogni opera ha il suo stile (colore, carattere, fondo), come nella
     rivista. Anton (al posto di Druk), Special Elite, Permanent Marker,
     Monobloco per numeri e didascalie.
     ================================================================== */

  // numeri pseudo-casuali ripetibili: ogni pezzo di carta è strappato sempre allo stesso modo
  function seeded(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  // bordo strappato: poligono frastagliato sui lati scelti (t r b l)
  function torn(seed, amp = 6, sides = 'trbl') {
    const r = seeded(seed);
    const off = (side) => (sides.includes(side) ? (r() * amp).toFixed(1) : '0');
    const step = () => 2.5 + r() * 5.5;
    const pts = [];
    for (let x = 0; x < 100; x += step()) pts.push(`${x.toFixed(1)}% ${off('t')}px`);
    for (let y = 0; y < 100; y += step()) pts.push(`calc(100% - ${off('r')}px) ${y.toFixed(1)}%`);
    for (let x = 100; x > 0; x -= step()) pts.push(`${x.toFixed(1)}% calc(100% - ${off('b')}px)`);
    for (let y = 100; y > 0; y -= step()) pts.push(`${off('l')}px ${y.toFixed(1)}%`);
    return `polygon(${pts.join(',')})`;
  }

  // lettere ritagliate dai giornali, una diversa dall'altra
  const RANSOM = [
    { f: "'Anton', sans-serif", bg: '#E53232', fg: '#F2EEE3' },
    { f: "'UnifrakturMaguntia', serif", bg: '#F2EEE3', fg: '#111111' },
    { f: "'Special Elite', 'Courier New', monospace", bg: '#F3E600', fg: '#111111' },
    { f: "'Anton', sans-serif", bg: '#111111', fg: '#F2EEE3' },
    { f: "'Playfair Display', Georgia, serif", bg: '#CFCBC0', fg: '#C21F1F', it: true },
    { f: "'Permanent Marker', cursive", bg: '#F2EEE3', fg: '#111111' },
    { f: "'Michroma', sans-serif", bg: '#E53232', fg: '#111111' },
    { f: "'Bungee Shade', sans-serif", bg: '#F2EEE3', fg: '#111111' },
    { f: "'Monobloco', 'Courier New', monospace", bg: '#4871B4', fg: '#F2EEE3' }
  ];
  function ransom(text, seed) {
    const r = seeded(seed);
    let k = Math.floor(r() * RANSOM.length);
    let i = -1;
    // le lettere di una parola restano insieme: si va a capo solo tra le parole
    return text.split(' ').map((word) => `<span class="dc-rw">${Array.from(word).map((ch) => {
      i += 1;
      k = (k + 1 + Math.floor(r() * 3)) % RANSOM.length;
      const s = RANSOM[k];
      const rot = ((r() - 0.5) * 14).toFixed(1);
      const lift = ((r() - 0.5) * 0.16).toFixed(2);
      const size = (0.86 + r() * 0.28).toFixed(2);
      return `<span class="dc-rl" aria-hidden="true" style="--i:${i}; --r:${rot}deg; --y:${lift}em; --s:${size}; --bg:${s.bg}; --fg:${s.fg}; --font-main:${s.f};${s.it ? ' font-style:italic; font-weight:700;' : ''} clip-path:${torn(seed * 31 + i, 3)};">${esc(ch)}</span>`;
    }).join('')}</span>`).join('<span class="dc-rl-sp"> </span>');
  }

  LAYOUTS.decoder = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const idx = g.index || [];
    const works = g.works || [];
    const cuts = g.cutLines || [];
    const cleanups = [];
    const pagesUrl = pageList(B, g.pages || 32);
    const head = (n, t, extra = '') => `<header class="dc-head" data-reveal${extra}><span class="dc-num">${n}</span><h3 class="dc-h" style="clip-path:${torn(Number(n) * 17, 4)};">${esc(t)}</h3></header>`;
    const tape = (cls) => `<span class="dc-tape ${cls}" style="clip-path:${torn(cls.length * 13 + 5, 3, 'lr')};" aria-hidden="true"></span>`;

    container.innerHTML = `
      <div class="dc">
        <svg class="dc-defs" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id="dc-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/>
          </filter>
        </svg>

        <!-- APERTURA: testata a lettere ritagliate, copertina fotocopiata e incollata -->
        <section class="dc-hero">
          <div class="dc-hero-copy">
            <p class="dc-stamp" data-reveal>${esc(g.stamp || '')}</p>
            <h3 class="dc-title" data-reveal><span>DECODER</span></h3>
            <p class="dc-marker" data-reveal style="--i:2;">${esc(g.subtitle || '')}</p>
            <div class="dc-strip" data-reveal style="--i:3; clip-path:${torn(11, 5)};"><p>${g.lead || ''}</p></div>
          </div>
          <figure class="dc-cover" data-reveal style="--i:1;" ${zoom(B + 'cover.jpg', 'Decoder — la copertina')}>
            <img src="${B}cover.jpg" alt="La copertina di Decoder: la testata rossa sopra un volto in bianco e nero" style="clip-path:${torn(5, 9)};" />
            ${tape('is-tl')}${tape('is-br')}
            <span class="dc-cover-stamp" aria-hidden="true">Stampa</span>
          </figure>
        </section>

        <!-- 01 LA RIVISTA, con l'indice ad adesivi -->
        <section class="dc-sec dc-read-sec">
          ${head('01', g.readerTitle || 'Sfoglia la rivista')}
          <ol class="dc-stickers" aria-label="${esc(g.indexTitle || 'Indice')}">
            ${idx.map((it, i) => `
              <li data-reveal style="--i:${i % 5};">
                <button type="button" data-page="${it.p}" style="--c:${it.c}; --r:${(((i * 37) % 9) - 4) * 0.8}deg; clip-path:${torn(70 + i, 3)};">
                  <b>${pad2(it.p)}</b><span>${esc(it.t)}</span>
                </button>
              </li>`).join('')}
          </ol>
          <div class="dc-board" data-reveal>
            ${tape('is-tl')}${tape('is-tr')}
            <div class="dc-reader"></div>
            <span class="dc-pagetag" aria-hidden="true">pag. 01</span>
          </div>
        </section>

        <!-- 02 TAGLIA IL CODICE: il cut-up di Burroughs -->
        <section class="dc-sec dc-cut-sec">
          ${head('02', g.cutTitle || 'Taglia il codice')}
          <div class="dc-cut">
            <div class="dc-cut-copy" data-reveal>
              ${(g.cutText || []).map((t) => `<p class="dc-text">${t}</p>`).join('')}
              <figure class="dc-cut-film" ${zoom(B + 'ed-decoder-film.jpg', g.cutCaption || 'Decoder, il film')}>
                <img src="${B}ed-decoder-film.jpg" alt="${esc(g.cutCaption || 'Due fotogrammi del film Decoder')}" loading="lazy" style="clip-path:${torn(21, 6)};" />
              </figure>
            </div>
            <div class="dc-cut-desk" data-reveal style="--i:1;">
              <div class="dc-cut-lines">
                ${cuts.map((t, i) => `<span class="dc-cut-line" data-i="${i}" style="clip-path:${torn(40 + i, 4, 'lr')};">${esc(t)}</span>`).join('')}
              </div>
              <button type="button" class="dc-cut-btn"><span aria-hidden="true">✂</span> <em>Taglia e rimescola</em></button>
            </div>
          </div>
        </section>

        <!-- 03 SAPEVI CHE: impaginata come la pagina 9, ma si stampa e si decodifica -->
        <section class="dc-sec dc-dots-sec">
          <div class="dc-p9">
            <div class="dc-p9-copy" data-reveal>
              <h3 class="dc-p9-title"><span class="dc-p9-num">03 //</span> ${esc(g.dotsTitle || 'Sapevi che...')}</h3>
              <div class="dc-p9-cols" lang="it">
                ${(g.dotsText || []).map((t) => `<p>${t}</p>`).join('')}
              </div>
              <div class="dc-hud">
                <svg class="dc-hud-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H90 L100 14 V100 H0 Z"/></svg>
                <span class="dc-hud-tab" aria-hidden="true"></span>
                <p class="dc-hud-head">MIC // Machine Identification Code</p>
                <dl class="dc-hud-data">
                  <div><dt>Seriale</dt><dd data-k="serial">····-····-··</dd></div>
                  <div><dt>Data</dt><dd data-k="date">··/··/····</dd></div>
                  <div><dt>Ora</dt><dd data-k="time">··:··:··</dd></div>
                </dl>
                <div class="dc-hud-bar" aria-hidden="true"><i></i></div>
                <p class="dc-hud-status" aria-live="polite">in attesa di stampa</p>
                <button type="button" class="dc-hud-btn">▶ Stampa</button>
                <span class="dc-hud-page" aria-hidden="true">9</span>
              </div>
            </div>
            <div class="dc-p9-machine" data-reveal style="--i:1;">
              <div class="dc-p9-slot">
                <div class="dc-sheet" style="--mx:50%; --my:40%;">
                  <div class="dc-sheet-print">
                    <p class="dc-sheet-kicker">Decoder // pag. 9</p>
                    <p class="dc-sheet-big">${esc(g.dotsSheet || '')}</p>
                    <p class="dc-sheet-small">E la tecnologia che usi ogni giorno sa più cose di te di quanto immagini.</p>
                  </div>
                  <div class="dc-uv" aria-hidden="true"></div>
                  <span class="dc-uv-tip" aria-hidden="true">passa la luce blu</span>
                </div>
              </div>
              <img class="dc-p9-printer" src="${B}ed-stampante.png" alt="La stampante della pagina 9, in bianco e nero" loading="lazy" />
            </div>
            <img class="dc-p9-chevron" src="${B}ed-chevron.jpg" alt="" aria-hidden="true" loading="lazy" />
          </div>
        </section>

        <!-- 04 UN'OPERA, UNO STILE -->
        <section class="dc-sec dc-works-sec">
          ${head('04', g.worksTitle || 'Un’opera, uno stile')}
          <p class="dc-text dc-works-text" data-reveal>${g.worksText || ''}</p>
          <div class="dc-works-tabs" role="tablist" aria-label="Le opere" data-reveal>
            ${works.map((w, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}" data-i="${i}" style="--c:${w.c}; --r:${(((i * 53) % 7) - 3) * 0.9}deg; clip-path:${torn(90 + i, 3)};">${esc(w.title)}</button>`).join('')}
          </div>
          <div class="dc-stage" data-reveal aria-live="polite"></div>
        </section>

        <!-- CHIUSURA: No Future -->
        <section class="dc-sec dc-outro">
          <div class="dc-outro-bg" aria-hidden="true" style="background-image:url('${B}ed-volto.jpg');"></div>
          <p class="dc-nofuture" data-reveal aria-label="${esc((g.outroWords || []).join(' '))}">
            <span class="dc-nf-no">${esc((g.outroWords || ['No'])[0])}<svg class="dc-nf-strike" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M4 38 C 50 20, 120 46, 196 18 M 10 46 C 70 30, 130 52, 192 30"/></svg></span>
            <span class="dc-nf-future">${esc((g.outroWords || ['', 'Future'])[1])}</span>
          </p>
          <p class="dc-outro-text" data-reveal style="--i:1; clip-path:${torn(99, 5)};">${g.outroText || ''}</p>
        </section>
      </div>
    `;

    const root = container.querySelector('.dc');
    const card = container.closest('.project-modal-card');
    const scrollToEl = (el) => {
      if (!card) return;
      const top = el.getBoundingClientRect().top - card.getBoundingClientRect().top + card.scrollTop - 24;
      card.scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
    };

    // ---- la rivista + indice ad adesivi
    const board = root.querySelector('.dc-board');
    const pageTag = root.querySelector('.dc-pagetag');
    const stickers = Array.from(root.querySelectorAll('.dc-stickers button'));
    const fb = createFlipbook(root.querySelector('.dc-reader'), {
      pages: pagesUrl,
      ratio: 860 / 1206,
      title: 'Decoder',
      maxHeight: 0.7,
      onChange(p) {
        pageTag.textContent = `pag. ${pad2(p + 1)}`;
        let cur = -1;
        idx.forEach((it, k) => { if (p + 1 >= it.p - 1) cur = k; });
        stickers.forEach((b, k) => b.classList.toggle('is-current', k === cur));
      }
    });
    cleanups.push(() => fb.destroy());
    const openAt = (page) => { fb.goPage(page - 1); scrollToEl(board); };
    stickers.forEach((b) => b.addEventListener('click', () => openAt(Number(b.dataset.page))));

    // ---- cut-up: le strisce si tagliano e si rimescolano (FLIP)
    const desk = root.querySelector('.dc-cut-lines');
    const cutBtn = root.querySelector('.dc-cut-btn');
    if (desk && cutBtn) {
      const lines = Array.from(desk.children);
      let shuffled = false;
      let round = 0;
      const place = (order, rots) => {
        const before = new Map(lines.map((l) => [l, l.getBoundingClientRect()]));
        order.forEach((l) => desk.appendChild(l));
        lines.forEach((l, k) => {
          const a = before.get(l);
          const b = l.getBoundingClientRect();
          const rot = rots ? rots[k] : 0;
          l.style.transition = 'none';
          l.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px) rotate(${l.dataset.rot || 0}deg)`;
          l.dataset.rot = String(rot);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            l.style.transition = reduceMotion() ? 'none' : `transform 0.7s cubic-bezier(0.3, 1.3, 0.5, 1) ${(k * 0.03).toFixed(2)}s`;
            l.style.transform = `rotate(${rot}deg)`;
          }));
        });
      };
      cutBtn.addEventListener('click', () => {
        round += 1;
        if (!shuffled) {
          const r = seeded(round * 977 + 13);
          let order;
          do {
            order = lines.slice();
            for (let k = order.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [order[k], order[j]] = [order[j], order[k]]; }
          } while (order.every((l, k) => l === lines[k]));
          place(order, lines.map(() => ((r() - 0.5) * 9).toFixed(1)));
          cutBtn.querySelector('em').textContent = 'Ricomponi';
          desk.classList.add('is-cut');
        } else {
          place(lines, null);
          cutBtn.querySelector('em').textContent = 'Taglia e rimescola';
          desk.classList.remove('is-cut');
        }
        shuffled = !shuffled;
      });
    }

    // ---- sapevi che: si stampa il foglio, la luce blu scopre i micropunti
    //      e il riquadro decodifica numero di serie, data e ora della stampa
    const sheet = root.querySelector('.dc-sheet');
    const machine = root.querySelector('.dc-p9-machine');
    const hud = root.querySelector('.dc-hud');
    if (sheet && machine && hud) {
      // matrice 15 × 8 come quella delle stampanti: alcuni punti sì, altri no
      const r = seeded(2017);
      const cell = 9;
      let dots = '';
      for (let y = 0; y < 8; y++) for (let x = 0; x < 15; x++) {
        if (y === 0 || x === 0 || r() > 0.62) dots += `<circle cx="${x * cell + 5}" cy="${y * cell + 5}" r="1.5"/>`;
      }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${15 * cell + 22}" height="${8 * cell + 22}"><g fill="#FFE94A">${dots}</g></svg>`;
      sheet.style.setProperty('--dots', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);

      const fields = {
        serial: hud.querySelector('[data-k="serial"]'),
        date: hud.querySelector('[data-k="date"]'),
        time: hud.querySelector('[data-k="time"]')
      };
      const bar = hud.querySelector('.dc-hud-bar i');
      const status = hud.querySelector('.dc-hud-status');
      const btn = hud.querySelector('.dc-hud-btn');
      const hex = (n) => Math.floor(seeded(n)() * 65536).toString(16).toUpperCase().padStart(4, '0');
      let target = null;
      let progress = 0;
      let printed = false;
      let printT = 0;
      const mask = (txt, k) => txt.split('').map((ch, i) => (i < k || /[-/: ]/.test(ch) ? ch : '·')).join('');
      const paint = () => {
        if (!target) return;
        Object.keys(fields).forEach((key, row) => {
          // le righe si decodificano una dopo l'altra
          const p = Math.max(0, Math.min(1, progress * 3 - row));
          fields[key].textContent = mask(target[key], Math.round(p * target[key].length));
        });
        bar.style.transform = `scaleX(${progress.toFixed(3)})`;
        if (progress >= 1) {
          status.textContent = 'decodificato: la stampante ha firmato il foglio';
          hud.classList.add('is-done');
        } else {
          status.textContent = `decodifica ${String(Math.floor(progress * 100)).padStart(3, '0')}%`;
        }
      };
      const print = () => {
        const now = new Date();
        const two = (n) => String(n).padStart(2, '0');
        target = {
          serial: `${hex(now.getTime() % 9973)}-${hex(now.getMinutes() + 7)}-${two(now.getSeconds())}`,
          date: `${two(now.getDate())}/${two(now.getMonth() + 1)}/${now.getFullYear()}`,
          time: `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`
        };
        progress = 0;
        hud.classList.remove('is-done');
        machine.classList.remove('is-printed');
        void machine.offsetWidth;
        machine.classList.add('is-printing');
        status.textContent = 'stampa in corso…';
        btn.textContent = '↻ Ristampa';
        printed = false;
        clearTimeout(printT);
        printT = setTimeout(() => {
          machine.classList.remove('is-printing');
          machine.classList.add('is-printed');
          printed = true;
          paint();
        }, reduceMotion() ? 0 : 2300);
        Object.values(fields).forEach((f) => { f.textContent = f.textContent.replace(/[0-9A-F]/g, '·'); });
        bar.style.transform = 'scaleX(0)';
      };
      btn.addEventListener('click', print);
      cleanups.push(() => clearTimeout(printT));

      // la luce: segue il puntatore; più la muovi sul foglio, più il codice si decodifica
      let hover = false;
      let raf = 0;
      let last = null;
      const set = (x, y) => {
        if (printed && last) {
          const d = Math.hypot(x - last.x, y - last.y);
          progress = Math.min(1, progress + d / (sheet.clientWidth * (hover ? 5 : 9)));
          paint();
        }
        last = { x, y };
        sheet.style.setProperty('--mx', `${x}px`);
        sheet.style.setProperty('--my', `${y}px`);
      };
      const onMove = (e) => {
        const b = sheet.getBoundingClientRect();
        if (!hover) last = null;
        hover = true;
        sheet.classList.add('is-lit');
        set(e.clientX - b.left, e.clientY - b.top);
      };
      const onLeave = () => { hover = false; last = null; };
      sheet.addEventListener('pointermove', onMove);
      sheet.addEventListener('pointerdown', onMove);
      sheet.addEventListener('pointerleave', onLeave);
      // da sola, la luce gira piano sul foglio per far capire il gioco
      const t0 = performance.now();
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        if (hover || !printed || !inView(sheet)) return;
        const b = sheet.getBoundingClientRect();
        const t = (now - t0) / 1000;
        set(b.width * (0.5 + 0.3 * Math.sin(t * 0.7)), b.height * (0.5 + 0.28 * Math.sin(t * 1.1 + 1)));
        sheet.classList.add('is-lit');
      };
      // la prima stampa parte da sola quando la sezione entra in vista
      cleanups.push(onReveal(machine, () => {
        if (reduceMotion()) {
          print();
          progress = 1;
          sheet.classList.add('is-lit');
          setTimeout(paint, 0);
          return;
        }
        const t = setTimeout(print, 500);
        cleanups.push(() => clearTimeout(t));
        raf = requestAnimationFrame(loop);
      }));
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    // ---- le opere: ogni scelta rifà la scena con lo stile di quell'opera
    const stage = root.querySelector('.dc-stage');
    const tabs = Array.from(root.querySelectorAll('.dc-works-tabs button'));
    let swapT = 0;
    const renderWork = (i, animate) => {
      const w = works[i];
      if (!w) return;
      const pages = w.pages[0] === w.pages[1] ? `${w.pages[0]}` : `${w.pages[0]}–${w.pages[1]}`;
      const draw = () => {
        stage.className = `dc-stage is-${w.key}${stage.classList.contains('is-in') ? ' is-in' : ''}`;
        stage.style.setProperty('--c', w.c);
        stage.innerHTML = `
          <div class="dc-st-bg" aria-hidden="true"></div>
          <div class="dc-st-art">
            <figure class="dc-paste is-a" style="--ar:${w.ar || 0.72};" ${zoom(B + w.img, `${w.title} — Decoder, pag. ${pages}`)}>
              <img src="${B}${w.img}" alt="${esc(w.title)}: dalla rivista, pag. ${pages}" style="clip-path:${torn(i * 7 + 1, 7)};" />
              ${tape('is-tl')}
            </figure>
            ${w.img2 ? `<figure class="dc-paste is-b" style="--ar:${w.ar2 || 1};" ${zoom(B + w.img2, `${w.title} — Decoder`)}><img src="${B}${w.img2}" alt="${esc(w.title)}: un’altra immagine dalla rivista" style="clip-path:${torn(i * 7 + 3, 6)};" />${tape('is-tr')}</figure>` : ''}
          </div>
          <div class="dc-st-copy">
            <p class="dc-st-kicker">${esc(w.kicker)}</p>
            <h4 class="dc-st-title" data-text="${esc(w.title)}">${w.key === 'johnny' ? ransom(w.title.toUpperCase(), 9) : esc(w.title)}</h4>
            <blockquote class="dc-st-quote" style="clip-path:${torn(i * 7 + 5, 5)};"><p>${w.quote}</p><cite>Decoder, pag. ${pages}</cite></blockquote>
            <button type="button" class="dc-st-open" data-page="${w.pages[0]}">Apri la rivista a pag. ${w.pages[0]} <span aria-hidden="true">→</span></button>
          </div>`;
        stage.querySelector('.dc-st-open').addEventListener('click', () => openAt(w.pages[0]));
      };
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', String(k === i)); });
      clearTimeout(swapT);
      if (!animate || reduceMotion()) { draw(); return; }
      // cambio come una fotocopia: lampo bianco, poi la nuova pagina
      stage.classList.add('is-swap');
      swapT = setTimeout(() => { draw(); stage.classList.add('is-swap-in'); swapT = setTimeout(() => stage.classList.remove('is-swap', 'is-swap-in'), 420); }, 170);
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => renderWork(i, true)));
    renderWork(0, false);
    cleanups.push(() => clearTimeout(swapT));

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };

  /* ==================================================================
     MODARTECH — magazine di fotografia
     Pastelli per sezione (pesca, rosa, menta, salvia), barre rosse,
     titoli in Boldark, testi in un serif (Cormorant al posto di Canela).
     ================================================================== */
  LAYOUTS.modartech = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const contents = g.contents || [];
    const lights = g.lights || [];
    const pairs = g.aiPairs || [];
    const sets = g.portraitSets || [];
    const sena = g.sena || [];
    const travel = g.travel || [];
    const cleanups = [];
    const pagesUrl = pageList(B, g.pages || 82, 2); // v2: pagine di sinistra ritagliate di nuovo
    const bars = (cls) => `<span class="mt-bars ${cls}" aria-hidden="true"><i></i><i></i></span>`;

    // schema visto dall'alto: soggetto al centro, fotocamera in basso, luce che si sposta
    const plan = `
      <svg class="mt-plan" viewBox="-110 -112 220 236" role="img" aria-label="Lo schema di luce visto dall’alto">
        <line class="mt-plan-wall" x1="-100" y1="-100" x2="100" y2="-100"/>
        <text class="mt-plan-label" x="0" y="-104" text-anchor="middle">fondale</text>
        <g class="mt-refl">
          <g class="mt-refl-rot">
            <polygon class="mt-refl-beam" points=""/>
            <rect class="mt-refl-panel" x="-4" y="-22" width="8" height="44" rx="2"/>
          </g>
          <text class="mt-plan-label" x="58" y="64" text-anchor="middle">pannello</text>
        </g>
        <g class="mt-rig">
          <g class="mt-beam"><polygon points="0,-7 100,-17 100,17 0,7"/></g>
          <g class="mt-lamp"><rect x="-7" y="-16" width="12" height="32" rx="2"/><rect class="mt-lamp-face" x="4" y="-14" width="4" height="28"/></g>
          <text class="mt-plan-label mt-lamp-tag" x="0" y="3" text-anchor="middle">luce</text>
        </g>
        <g class="mt-subject">
          <circle r="15"/>
          <path d="M -5 13 L 0 21 L 5 13 Z"/>
        </g>
        <g class="mt-camera" transform="translate(0 96)">
          <rect x="-15" y="-7" width="30" height="18" rx="3"/>
          <rect x="-6" y="-14" width="12" height="8" rx="2"/>
          <text class="mt-plan-label" x="0" y="25" text-anchor="middle">fotocamera</text>
        </g>
      </svg>`;

    container.innerHTML = `
      <div class="mt">

        <!-- APERTURA: testata, contenuti e copertina -->
        <section class="mt-hero">
          <div class="mt-stripes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="mt-hero-copy">
            <p class="mt-kicker" data-reveal>${esc(g.kicker || '')}</p>
            <h3 class="mt-mast" data-reveal style="--i:1;">MODARTECH</h3>
            <p class="mt-lead" data-reveal style="--i:2;">${g.lead || ''}</p>
            <div class="mt-contents" data-reveal style="--i:3;">
              <h4>${esc(g.contentsTitle || 'Contenuti')}</h4>
              <ol>
                ${contents.map((c) => `<li><button type="button" data-page="${c.p}"><span>${esc(c.t)}</span><b>${c.p}</b></button></li>`).join('')}
              </ol>
            </div>
          </div>
          <figure class="mt-cover" data-reveal style="--i:2;" ${zoom(B + 'cover.jpg', 'Modartech — la copertina')}>
            <img src="${B}cover.jpg" alt="La copertina del magazine Modartech: un ritratto in bianco e nero" />
          </figure>
        </section>

        <!-- 01 SFOGLIA -->
        <section class="mt-sec mt-read">
          <header class="mt-head" data-reveal><span class="mt-num">01</span><h3 class="mt-h">Sfoglia il magazine</h3></header>
          <div class="mt-reader" data-reveal></div>
        </section>

        <!-- 02 SCHEMI DI ILLUMINAZIONE -->
        <section class="mt-sec mt-light-sec">
          ${bars('is-a')}${bars('is-b')}
          <header class="mt-head" data-reveal><span class="mt-num">02</span><h3 class="mt-h">${esc(g.lightTitle || 'Schemi di illuminazione')}</h3></header>
          <p class="mt-text" data-reveal>${g.lightText || ''}</p>
          <div class="mt-light">
            <div class="mt-light-photo" data-reveal>
              ${lights.map((l, i) => `<img class="${i === 0 ? 'is-active' : ''}" src="${B}${l.src}" alt="Ritratto con luce ${esc(l.name.toLowerCase())}" loading="${i === 0 ? 'eager' : 'lazy'}" />`).join('')}
              <span class="mt-light-name" aria-hidden="true">${esc(lights[0] ? lights[0].name : '')}</span>
            </div>
            <div class="mt-light-side" data-reveal style="--i:1;">
              <div class="mt-light-tabs" role="tablist" aria-label="Schemi di luce">
                ${lights.map((l, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}" data-i="${i}">${esc(l.name)}</button>`).join('')}
              </div>
              ${plan}
              <p class="mt-light-text" aria-live="polite">${lights[0] ? lights[0].text : ''}</p>
            </div>
          </div>
        </section>

        <!-- 03 ORIGINALE O AI -->
        ${pairs.length ? `
        <section class="mt-sec mt-ai-sec">
          <header class="mt-head" data-reveal><span class="mt-num">03</span><h3 class="mt-h">${esc(g.aiTitle || 'Originale o AI?')}</h3></header>
          <div class="mt-ai">
            <div class="mt-ai-copy" data-reveal>
              ${(g.aiText || []).map((t) => `<p class="mt-text">${t}</p>`).join('')}
              <div class="mt-ai-pick" role="tablist" aria-label="Coppie di foto">
                ${pairs.map((pr, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}" data-i="${i}"><img src="${B}${pr.a}" alt="" loading="lazy" /><span>Coppia ${i + 1}</span></button>`).join('')}
              </div>
            </div>
            <div class="mt-compare" data-reveal style="--p:50%; --ar:${pairs[0].ratio};">
              <img class="mt-cmp-a" src="${B}${pairs[0].a}" alt="Foto originale" />
              <img class="mt-cmp-b" src="${B}${pairs[0].b}" alt="La stessa foto rifatta con l’intelligenza artificiale" />
              <span class="mt-cmp-line" aria-hidden="true"><i>⟷</i></span>
              <span class="mt-cmp-tag is-a">Foto originale</span>
              <span class="mt-cmp-tag is-b">Intelligenza artificiale</span>
              <input type="range" min="0" max="100" value="50" aria-label="Sposta il confronto tra foto originale e intelligenza artificiale" />
            </div>
          </div>
        </section>` : ''}

        <!-- 04 RITRATTI -->
        <section class="mt-sec mt-portrait-sec">
          <header class="mt-head" data-reveal><span class="mt-num">04</span><h3 class="mt-h">${esc(g.portraitTitle || 'Il ritratto')}</h3></header>
          <p class="mt-text" data-reveal>${g.portraitText || ''}</p>
          <div class="mt-sets">
            ${sets.map((st, si) => `
              <div class="mt-set" data-reveal style="--i:${si};">
                <h4 class="mt-set-name">${esc(st.name)}</h4>
                <div class="mt-set-imgs">
                  ${st.imgs.map((im, k) => `<figure class="mt-shot is-${k}" ${zoom(B + im, `${st.name} — ritratto ${k + 1}`)}><img src="${B}${im}" alt="Ritratto, ${esc(st.name.toLowerCase())} ${k + 1}" loading="lazy" /></figure>`).join('')}
                </div>
              </div>`).join('')}
          </div>
        </section>

        <!-- 05 #MADEINSENA -->
        ${sena.length ? `
        <section class="mt-sec mt-sena-sec">
          <header class="mt-head" data-reveal><span class="mt-num">05</span><h3 class="mt-h">${esc(g.senaTitle || '#MADEINSENA')}</h3></header>
          <p class="mt-text" data-reveal>${g.senaText || ''}</p>
          <div class="mt-sena" data-reveal>
            <div class="mt-sena-track" tabindex="0" aria-label="Le pagine della campagna, scorrono in orizzontale">
              ${sena.map((src, i) => `<figure class="mt-sena-item" ${zoom(B + src, `#MADEINSENA — ${i + 1}`)}><img src="${B}${src}" alt="Pagina ${i + 1} della campagna Sena, artigiani del cappello" loading="lazy" /></figure>`).join('')}
            </div>
            <div class="mt-sena-nav">
              <button type="button" class="mt-sena-prev" aria-label="Indietro">←</button>
              <span class="mt-sena-count">01 / ${pad2(sena.length)}</span>
              <button type="button" class="mt-sena-next" aria-label="Avanti">→</button>
            </div>
          </div>
        </section>` : ''}

        <!-- 06 VIAGGIO -->
        ${travel.length ? `
        <section class="mt-sec mt-travel-sec">
          <header class="mt-head" data-reveal><span class="mt-num">06</span><h3 class="mt-h">${esc(g.travelTitle || 'Viaggio')}</h3></header>
          <p class="mt-text" data-reveal>${g.travelText || ''}</p>
          ${travel.map((ch, ci) => `
            <article class="mt-chap is-${ci}">
              <h4 class="mt-big" data-reveal><span>${esc(ch.word)}</span></h4>
              <div class="mt-chap-text" data-reveal style="--i:1;">
                <p>${ch.text}</p>
                ${ch.pages ? `<button type="button" class="mt-chap-go" data-page="${ch.pages[0]}">Sfoglia le pagine ${ch.pages.join('–')} <span aria-hidden="true">↗</span></button>` : ''}
              </div>
              ${ch.imgs.map((im, k) => `<figure class="mt-trip is-${k}" data-reveal style="--i:${k + 1};" ${zoom(B + im.src, `${ch.word} — foto ${k + 1}`)}><img src="${B}${im.src}" alt="${esc(im.alt)}" loading="lazy" /></figure>`).join('')}
            </article>`).join('')}
        </section>` : ''}
      </div>
    `;

    const root = container.querySelector('.mt');

    // magazine sfogliabile + indice dei contenuti
    const fb = createFlipbook(root.querySelector('.mt-reader'), {
      pages: pagesUrl,
      ratio: 860 / 1216,
      title: 'Modartech',
      maxHeight: 0.72
    });
    cleanups.push(() => fb.destroy());
    const reader = root.querySelector('.mt-reader');
    root.querySelectorAll('.mt-contents button, .mt-chap-go').forEach((b) => b.addEventListener('click', () => {
      fb.goPage(Number(b.dataset.page) - 1);
      const card = container.closest('.project-modal-card');
      if (card) {
        const top = reader.getBoundingClientRect().top - card.getBoundingClientRect().top + card.scrollTop - 30;
        card.scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
    }));

    // schemi di luce
    const rig = root.querySelector('.mt-rig');
    const svg = root.querySelector('.mt-plan');
    const photos = Array.from(root.querySelectorAll('.mt-light-photo img'));
    const tabs = Array.from(root.querySelectorAll('.mt-light-tabs button'));
    const lightText = root.querySelector('.mt-light-text');
    const lightName = root.querySelector('.mt-light-name');
    const refl = { x: 58, y: 30 };
    const reflBeam = root.querySelector('.mt-refl-beam');
    const reflGroup = root.querySelector('.mt-refl-rot');
    if (reflGroup) {
      reflGroup.setAttribute('transform', `translate(${refl.x} ${refl.y}) rotate(${(Math.atan2(-refl.y, -refl.x) * 180) / Math.PI + 180})`);
      const d = Math.hypot(refl.x, refl.y) - 16;
      reflBeam.setAttribute('points', `-4,-18 ${-d},-8 ${-d},8 -4,18`);
    }
    let angle = 0;
    const setLight = (i) => {
      const l = lights[i];
      if (!l) return;
      const x = l.x;
      const y = l.y;
      let a = (Math.atan2(-y, -x) * 180) / Math.PI;
      // gira dalla parte più corta
      while (a - angle > 180) a -= 360;
      while (a - angle < -180) a += 360;
      angle = a;
      const dist = Math.hypot(x, y);
      rig.style.setProperty('--x', `${x}px`);
      rig.style.setProperty('--y', `${y}px`);
      rig.style.setProperty('--a', `${a}deg`);
      rig.style.setProperty('--s', Math.max(0.05, (dist - 18) / 100).toFixed(3));
      // l'etichetta "luce" sta dalla parte opposta al soggetto, mai sul fascio
      const ux = dist ? x / dist : 0;
      const uy = dist ? y / dist : 1;
      rig.style.setProperty('--tx', `${(ux * 30).toFixed(1)}px`);
      rig.style.setProperty('--ty', `${(uy * 26).toFixed(1)}px`);
      svg.classList.toggle('is-high', !!l.high);
      svg.classList.toggle('has-refl', !!l.reflector);
      svg.classList.toggle('is-back', y < 0);
      photos.forEach((ph, k) => ph.classList.toggle('is-active', k === i));
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', String(k === i)); });
      lightText.innerHTML = l.text;
      lightName.textContent = l.name;
      lightName.classList.remove('is-pop');
      void lightName.offsetWidth;
      lightName.classList.add('is-pop');
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => setLight(i)));
    if (lights.length) setLight(0);

    // confronto originale / AI
    const cmp = root.querySelector('.mt-compare');
    if (cmp) {
      const range = cmp.querySelector('input');
      const imgA = cmp.querySelector('.mt-cmp-a');
      const imgB = cmp.querySelector('.mt-cmp-b');
      const onInput = () => cmp.style.setProperty('--p', `${range.value}%`);
      range.addEventListener('input', onInput);
      const picks = Array.from(root.querySelectorAll('.mt-ai-pick button'));
      picks.forEach((b, i) => b.addEventListener('click', () => {
        const pr = pairs[i];
        imgA.src = B + pr.a;
        imgB.src = B + pr.b;
        cmp.style.setProperty('--ar', pr.ratio);
        range.value = '50';
        onInput();
        picks.forEach((x, k) => { x.classList.toggle('is-active', k === i); x.setAttribute('aria-selected', String(k === i)); });
      }));
      // al primo ingresso la linea fa vedere che si può spostare
      cleanups.push(onReveal(cmp, () => {
        if (reduceMotion()) return;
        cmp.classList.add('is-hint');
        const t = setTimeout(() => cmp.classList.remove('is-hint'), 1900);
        cleanups.push(() => clearTimeout(t));
      }));
    }

    // campagna Sena: scorrimento orizzontale con frecce
    const track = root.querySelector('.mt-sena-track');
    if (track) {
      const items = Array.from(track.children);
      const count = root.querySelector('.mt-sena-count');
      const current = () => {
        const l = track.scrollLeft;
        let best = 0;
        items.forEach((it, k) => { if (Math.abs(it.offsetLeft - track.offsetLeft - l) < Math.abs(items[best].offsetLeft - track.offsetLeft - l)) best = k; });
        return best;
      };
      const go = (dir) => {
        const k = Math.max(0, Math.min(items.length - 1, current() + dir));
        track.scrollTo({ left: items[k].offsetLeft - track.offsetLeft, behavior: reduceMotion() ? 'auto' : 'smooth' });
      };
      root.querySelector('.mt-sena-prev').addEventListener('click', () => go(-1));
      root.querySelector('.mt-sena-next').addEventListener('click', () => go(1));
      let tk = false;
      const onScroll = () => {
        if (tk) return;
        tk = true;
        requestAnimationFrame(() => { tk = false; count.textContent = `${pad2(current() + 1)} / ${pad2(items.length)}`; });
      };
      track.addEventListener('scroll', onScroll, { passive: true });
    }

    // viaggio: le tre parole riempiono la loro colonna, come nel magazine
    const bigs = Array.from(root.querySelectorAll('.mt-big'));
    const fitBigs = () => bigs.forEach((h) => {
      const span = h.firstElementChild;
      h.style.fontSize = '100px';
      const w = span.getBoundingClientRect().width;
      const target = h.clientWidth;
      if (w && target) h.style.fontSize = `${Math.min(420, (100 * target) / w) * 0.995}px`;
    });
    if (bigs.length) {
      fitBigs();
      if (document.fonts && document.fonts.load) document.fonts.load('100px Boldark').then(fitBigs).catch(() => {});
      // si ricalcola solo se cambia la larghezza delle colonne, e al frame dopo:
      // cambiare la dimensione del testo dentro l'osservatore creerebbe un ciclo
      let lastW = '';
      let fitRaf = 0;
      const ro = new ResizeObserver(() => {
        const w = bigs.map((h) => h.clientWidth).join(',');
        if (w === lastW) return;
        lastW = w;
        cancelAnimationFrame(fitRaf);
        fitRaf = requestAnimationFrame(fitBigs);
      });
      bigs.forEach((h) => ro.observe(h));
      cleanups.push(() => cancelAnimationFrame(fitRaf));
      cleanups.push(() => ro.disconnect());
    }

    // viaggio: le foto scorrono un poco più lente della pagina
    const trips = Array.from(root.querySelectorAll('.mt-chap .mt-trip'));
    const scroller = container.closest('.project-modal-card');
    if (trips.length && scroller && !reduceMotion()) {
      let ticking = false;
      const parallax = () => {
        ticking = false;
        const vh = scroller.clientHeight;
        const top0 = scroller.getBoundingClientRect().top;
        trips.forEach((f) => {
          const r = f.getBoundingClientRect();
          if (r.bottom < top0 - 50 || r.top > top0 + vh + 50) return;
          const k = (r.top + r.height / 2 - top0 - vh / 2) / vh;
          f.style.setProperty('--py', `${(k * -7).toFixed(2)}%`);
        });
      };
      const onScrollP = () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } };
      scroller.addEventListener('scroll', onScrollP, { passive: true });
      parallax();
      cleanups.push(() => scroller.removeEventListener('scroll', onScrollP));
    }

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };
})();
