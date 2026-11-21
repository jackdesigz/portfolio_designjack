/**
 * designjack — Layout dedicati ai progetti di Editorial Design
 * window.PROJECT_LAYOUTS.mao       → MAO Museo d'Arte Orientale (catalogo, gabbia 7×5, campagna OOH)
 * window.PROJECT_LAYOUTS.decoder   → Decoder (rivista cyberpunk: glitch, indice da terminale, duotoni)
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

  const pageList = (base, n) => Array.from({ length: n }, (_, i) => `${base}pages/${pad2(i + 1)}.jpg`);

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
          <div class="mao-ooh-grid">
            ${ooh.map((m, i) => `
              <figure class="mao-ooh-item is-${m.size || 'm'}" data-reveal style="--i:${i % 4};" ${zoom(B + m.src, m.title)}>
                <img src="${B}${m.src}" alt="${esc(m.alt || m.title)}" loading="lazy" />
                <figcaption><strong>${esc(m.kind || '')}</strong> ${esc(m.title || '')}</figcaption>
              </figure>`).join('')}
          </div>
        </section>
      </div>
    `;

    const root = container.querySelector('.mao');

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

  /* ------------------------------------------------------------------
     Testo che si "decodifica": caratteri a caso che si fissano da
     sinistra a destra. Parte quando l'elemento riceve .is-in.
     ------------------------------------------------------------------ */
  const GLYPHS = '▓▒░<>/\\_-=+*#01ABCDEFX§¤';
  function scramble(el, duration = 1400) {
    const final = el.getAttribute('data-final') || el.textContent;
    if (reduceMotion()) { el.textContent = final; return () => {}; }
    // un carattere per span: la lettera vera resta (invisibile) e tiene il posto,
    // sopra scorre il carattere a caso, così le righe non si muovono
    el.textContent = '';
    const spans = [];
    for (const ch of final) {
      if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
      const sp = document.createElement('span');
      sp.className = 'sc is-noise';
      sp.textContent = ch;
      el.appendChild(sp);
      spans.push(sp);
    }
    let raf = 0;
    let frame = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / duration);
      const fixed = Math.floor(spans.length * k);
      frame++;
      for (let i = 0; i < spans.length; i++) {
        const sp = spans[i];
        if (i < fixed) {
          if (sp.classList.contains('is-noise')) sp.classList.remove('is-noise');
        } else if (frame % 2 === 0) {
          sp.setAttribute('data-n', GLYPHS[(Math.random() * GLYPHS.length) | 0]);
        }
      }
      if (k < 1) raf = requestAnimationFrame(tick);
      else el.textContent = final;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); el.textContent = final; };
  }
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
     DECODER — rivista cyberpunk
     Nero, testata rossa, duotoni; Anton (al posto di Druk), Michroma,
     Monobloco per indice e terminale.
     ================================================================== */
  LAYOUTS.decoder = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const idx = g.index || [];
    const duo = g.duo || [];
    const cleanups = [];
    const pagesUrl = pageList(B, g.pages || 32);

    container.innerHTML = `
      <div class="dc">

        <!-- APERTURA: testata glitch, sottotitolo che si decodifica, copertina -->
        <section class="dc-hero">
          <div class="dc-hero-copy">
            <p class="dc-tag" data-reveal>${esc(g.tag || '')}</p>
            <h3 class="dc-title" data-text="DECODER" data-reveal>DECODER</h3>
            <p class="dc-sub" data-reveal style="--i:1;"><span class="dc-scramble" data-final="${esc(g.subtitle || '')}">${esc(g.subtitle || '')}</span></p>
            <p class="dc-lead" data-reveal style="--i:2;">${g.lead || ''}</p>
            <p class="dc-status" data-reveal style="--i:3;"><span>&gt; decodifica</span> <b class="dc-pct">000%</b><i class="dc-bar"><i></i></i></p>
          </div>
          <figure class="dc-cover" data-reveal style="--i:1;" ${zoom(B + 'cover.jpg', 'Decoder — la copertina')}>
            <img src="${B}cover.jpg" alt="La copertina di Decoder: la testata rossa sopra un volto in bianco e nero" />
            <span class="dc-glitch-a" style="background-image:url('${B}cover.jpg');" aria-hidden="true"></span>
            <span class="dc-glitch-b" style="background-image:url('${B}cover.jpg');" aria-hidden="true"></span>
          </figure>
        </section>

        <!-- 01 INDICE: come un terminale; ogni voce apre la rivista a quella pagina -->
        <section class="dc-sec dc-index-sec">
          <header class="dc-head" data-reveal><span class="dc-num">01</span><h3 class="dc-h">${esc(g.indexTitle || 'Indice')}</h3></header>
          <ol class="dc-index">
            ${idx.map((it, i) => `
              <li data-reveal style="--i:${i}; --c:${it.c};">
                <button type="button" data-page="${it.p}">
                  <span class="dc-ix-n">${pad2(i + 1)}</span>
                  <span class="dc-ix-t">${esc(it.t)}</span>
                  <span class="dc-ix-dots" aria-hidden="true"></span>
                  <span class="dc-ix-p">${pad2(it.p)}</span>
                </button>
              </li>`).join('')}
          </ol>
        </section>

        <!-- 02 LA RIVISTA, dentro un monitor -->
        <section class="dc-sec dc-reader-sec">
          <header class="dc-head" data-reveal><span class="dc-num">02</span><h3 class="dc-h">${esc(g.readerTitle || 'Sfoglia la rivista')}</h3></header>
          <div class="dc-monitor" data-reveal>
            <div class="dc-monitor-bar"><span>DECODER_STAMPA.PDF</span><span class="dc-monitor-page">PAG 01</span></div>
            <div class="dc-reader"></div>
          </div>
        </section>

        <!-- 03 DUOTONI -->
        <section class="dc-sec dc-duo-sec">
          <header class="dc-head" data-reveal><span class="dc-num">03</span><h3 class="dc-h">${esc(g.duoTitle || 'Un colore per ogni opera')}</h3></header>
          <p class="dc-text" data-reveal>${g.duoText || ''}</p>
          <div class="dc-duo">
            ${duo.map((d, i) => `
              <figure class="dc-tile" data-reveal style="--i:${i % 4}; --c:${d.c};" ${zoom(pagesUrl[d.page - 1], `Decoder — ${d.title}`)}>
                <img src="${pagesUrl[d.page - 1]}" alt="Pagina ${d.page}: ${esc(d.title)}" loading="lazy" />
                <figcaption><b>${esc(d.title)}</b><code>${esc(d.c)}</code></figcaption>
              </figure>`).join('')}
          </div>
        </section>

        <!-- 04 DECODIFICARE -->
        <section class="dc-sec dc-decode-sec">
          <header class="dc-head" data-reveal><span class="dc-num">04</span><h3 class="dc-h">${esc(g.decodeTitle || 'Decodificare')}</h3></header>
          <blockquote class="dc-quote" data-reveal><span class="dc-scramble" data-final="${esc(g.decodeQuote || '')}">${esc(g.decodeQuote || '')}</span></blockquote>
          <div class="dc-decode-text">
            ${(g.decodeText || []).map((t, i) => `<p class="dc-text" data-reveal style="--i:${i};">${t}</p>`).join('')}
          </div>
        </section>
      </div>
    `;

    const root = container.querySelector('.dc');

    // testi che si decodificano quando compaiono
    root.querySelectorAll('.dc-scramble').forEach((el) => {
      let stop = () => {};
      cleanups.push(onReveal(el, () => { stop = scramble(el, el.closest('.dc-quote') ? 2200 : 1300); }));
      cleanups.push(() => stop());
    });

    // percentuale di decodifica nell'apertura
    const pct = root.querySelector('.dc-pct');
    const status = root.querySelector('.dc-status');
    let pctRaf = 0;
    cleanups.push(onReveal(pct, () => {
      if (reduceMotion()) { pct.textContent = '100%'; status.classList.add('is-done'); return; }
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1800);
        pct.textContent = `${String(Math.round(k * 100)).padStart(3, '0')}%`;
        status.style.setProperty('--k', k.toFixed(3));
        if (k < 1) pctRaf = requestAnimationFrame(tick);
        else status.classList.add('is-done');
      };
      pctRaf = requestAnimationFrame(tick);
    }));
    cleanups.push(() => cancelAnimationFrame(pctRaf));

    // la rivista
    const pageLabel = root.querySelector('.dc-monitor-page');
    const ixBtns = Array.from(root.querySelectorAll('.dc-index button'));
    const fb = createFlipbook(root.querySelector('.dc-reader'), {
      pages: pagesUrl,
      ratio: 860 / 1206,
      title: 'Decoder',
      maxHeight: 0.7,
      onChange(p) {
        pageLabel.textContent = `PAG ${pad2(p + 1)}`;
        let cur = -1;
        idx.forEach((it, k) => { if (p + 1 >= it.p - 1) cur = k; });
        ixBtns.forEach((b, k) => b.classList.toggle('is-current', k === cur));
      }
    });
    cleanups.push(() => fb.destroy());

    // l'indice apre la rivista alla pagina giusta e ci porta lì
    const monitor = root.querySelector('.dc-monitor');
    ixBtns.forEach((b) => b.addEventListener('click', () => {
      fb.goPage(Number(b.dataset.page) - 1);
      const card = container.closest('.project-modal-card');
      if (card) {
        const top = monitor.getBoundingClientRect().top - card.getBoundingClientRect().top + card.scrollTop - 24;
        card.scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
    }));

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
    const pagesUrl = pageList(B, g.pages || 82);
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
          <blockquote class="mt-quote" data-reveal>${esc(g.travelQuote || '')}</blockquote>
          <div class="mt-travel">
            ${travel.map((src, i) => `<figure class="mt-trip is-${i}" data-reveal style="--i:${i % 3};" ${zoom(B + src, `Viaggio — ${i + 1}`)}><img src="${B}${src}" alt="Paesaggio di montagna ${i + 1}" loading="lazy" /></figure>`).join('')}
            <span class="mt-word is-a" aria-hidden="true">Viaggio</span>
            <span class="mt-word is-b" aria-hidden="true">Vastità</span>
            <span class="mt-word is-c" aria-hidden="true">Proporzione</span>
          </div>
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
    root.querySelectorAll('.mt-contents button').forEach((b) => b.addEventListener('click', () => {
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

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };
})();
