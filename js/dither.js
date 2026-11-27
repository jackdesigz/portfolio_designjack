/**
 * designjack — Motore di dithering Bayer (Canale R)
 *
 * 1. PENNELLO NELL'HERO
 *    Muovendo il cursore nella finestra "CHI SONO", una scia retinata (matrice
 *    di Bayer 8×8) rivela una composizione Bauhaus nascosta sotto la carta.
 *    La scia si richiude da sola dopo qualche istante.
 *
 * 2. FOGLI SUL FILO IN 1-BIT
 *    Per ogni foglio viene calcolata una versione a 1 bit (inchiostro su carta)
 *    dell'immagine o della grafica. In hover viene svelata con una scansione
 *    dall'alto.
 */
(function () {
  'use strict';

  const BAYER8 = [
    0, 32, 8, 40, 2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44, 4, 36, 14, 46, 6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47, 7, 39, 13, 45, 5, 37,
    63, 31, 55, 23, 61, 29, 53, 21
  ].map(v => (v + 0.5) / 64);

  const PAL = {
    paper: [247, 241, 228],
    ink: [21, 20, 19],
    red: [217, 61, 42],
    yellow: [238, 168, 36],
    blue: [29, 53, 87]
  };

  const reduceMotion = !!((window.djReduceMotion && window.djReduceMotion()));

  // ------------------------------------------------------------------
  // 1. Pennello dither nell'hero
  // ------------------------------------------------------------------
  class HeroDitherBrush {
    constructor(windowEl) {
      this.win = windowEl;
      this.body = windowEl.querySelector('.window-body') || windowEl;
      this.cell = 3;                       // lato di un "pixel" del retino, in px CSS
      this.radius = 78;                    // raggio del pennello, in px CSS
      this.decay = 0.55;                   // velocità con cui la scia si richiude (al secondo)

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'hero-dither-layer';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.body.insertBefore(this.canvas, this.body.firstChild);
      this.ctx = this.canvas.getContext('2d');

      this.readout = document.createElement('div');
      this.readout.className = 'hero-dither-readout';
      this.readout.setAttribute('aria-hidden', 'true');
      this.readout.innerHTML = '<span>X:<b>0000</b></span><span>Y:<b>0000</b></span><span>BAYER 8×8 · 1-BIT</span>';
      this.body.appendChild(this.readout);
      this.rx = this.readout.querySelectorAll('b')[0];
      this.ry = this.readout.querySelectorAll('b')[1];

      this.active = false;
      this.last = 0;
      this.prev = null;
      this.resize();
      if ('ResizeObserver' in window) {
        let raf = 0;
        new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => this.resize()); }).observe(this.body);
      } else {
        window.addEventListener('resize', () => this.resize());
      }
      this.body.addEventListener('pointermove', (e) => this.onMove(e));
      this.body.addEventListener('pointerleave', () => { this.prev = null; });
      this.tick = this.tick.bind(this);
    }

    resize() {
      const r = this.body.getBoundingClientRect();
      if (!r.width || !r.height) return;
      this.cssW = r.width; this.cssH = r.height;
      this.cols = Math.ceil(r.width / this.cell);
      this.rows = Math.ceil(r.height / this.cell);
      this.canvas.width = this.cols;
      this.canvas.height = this.rows;
      this.mask = new Float32Array(this.cols * this.rows);
      this.img = this.ctx.createImageData(this.cols, this.rows);
      this.buildArt();
    }

    // Composizione nascosta: manifesto Bauhaus disegnato su un canvas a bassa risoluzione.
    // Ogni cella memorizza un colore e una "densità di inchiostro" per il retino.
    buildArt() {
      const W = this.cols, H = this.rows;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const g = c.getContext('2d');
      const u = Math.min(W, H);

      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);           // nero = niente inchiostro

      // grande sole rosso con sfumatura (diventa retino ai bordi)
      const cx = W * 0.62, cy = H * 0.52, R = u * 0.62;
      let gr = g.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
      gr.addColorStop(0, 'rgb(217,61,42)'); gr.addColorStop(0.75, 'rgb(217,61,42)'); gr.addColorStop(1, 'rgba(217,61,42,0.35)');
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();

      // blocco blu notte
      g.fillStyle = 'rgb(29,53,87)'; g.fillRect(W * 0.08, H * 0.18, W * 0.22, H * 0.62);
      // rettangolo senape
      g.fillStyle = 'rgb(238,168,36)'; g.fillRect(W * 0.26, H * 0.56, W * 0.2, H * 0.32);
      // mezzo disco nero
      g.fillStyle = 'rgb(21,20,19)'; g.beginPath(); g.arc(W * 0.46, H * 0.56, u * 0.32, -Math.PI / 2, Math.PI / 2); g.fill();
      // triangolo nero
      g.beginPath(); g.moveTo(W * 0.78, H * 0.08); g.lineTo(W * 0.95, H * 0.42); g.lineTo(W * 0.7, H * 0.36); g.closePath(); g.fill();
      // arco senape
      g.strokeStyle = 'rgb(238,168,36)'; g.lineWidth = u * 0.06;
      g.beginPath(); g.arc(cx, cy, R * 1.22, Math.PI * 1.05, Math.PI * 1.55); g.stroke();
      // tratteggio verticale (hatching)
      g.fillStyle = 'rgba(21,20,19,0.55)';
      for (let x = W * 0.84; x < W * 0.95; x += 3) g.fillRect(x, H * 0.5, 1, H * 0.4);
      // filetti orizzontali
      g.fillStyle = 'rgb(21,20,19)';
      g.fillRect(W * 0.04, H * 0.86, W * 0.6, 1);
      g.fillRect(W * 0.5, H * 0.14, W * 0.46, 1);
      // piccoli cerchi
      g.beginPath(); g.arc(W * 0.14, H * 0.1, u * 0.05, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgb(238,168,36)'; g.beginPath(); g.arc(W * 0.9, H * 0.88, u * 0.045, 0, Math.PI * 2); g.fill();

      const d = g.getImageData(0, 0, W, H).data;
      this.artColor = new Uint8Array(W * H * 3);
      this.artDensity = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) {
        const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2], a = d[i * 4 + 3] / 255;
        if (r + gg + b < 8) { this.artDensity[i] = 0; continue; }
        // colore della palette più vicino
        let best = PAL.ink, bd = 1e9;
        for (const k of ['red', 'yellow', 'blue', 'ink']) {
          const p = PAL[k];
          const dd = (p[0] - r) * (p[0] - r) + (p[1] - gg) * (p[1] - gg) + (p[2] - b) * (p[2] - b);
          if (dd < bd) { bd = dd; best = p; }
        }
        this.artColor[i * 3] = best[0]; this.artColor[i * 3 + 1] = best[1]; this.artColor[i * 3 + 2] = best[2];
        // l'inchiostro pieno vale 1; le zone tenui diventano retino
        const lum = Math.max(r, gg, b) / 255;
        this.artDensity[i] = Math.min(1, a * (0.55 + lum * 0.6));
      }
      // fondo: un velo di punti d'inchiostro ovunque, così la scia si vede anche sul vuoto
      this.baseDensity = 0.13;
    }

    onMove(e) {
      if (!this.mask) return;
      const r = this.body.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      this.rx.textContent = String(Math.max(0, Math.round(x))).padStart(4, '0');
      this.ry.textContent = String(Math.max(0, Math.round(y))).padStart(4, '0');
      // stampa lungo il segmento dall'ultima posizione, così la scia è continua
      const p0 = this.prev || { x, y };
      const dist = Math.hypot(x - p0.x, y - p0.y);
      const steps = Math.max(1, Math.ceil(dist / (this.radius * 0.35)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        this.stamp(p0.x + (x - p0.x) * t, p0.y + (y - p0.y) * t);
      }
      this.prev = { x, y };
      if (!this.active) { this.active = true; this.last = performance.now(); requestAnimationFrame(this.tick); }
    }

    stamp(px, py) {
      const C = this.cell, cols = this.cols, rows = this.rows, rad = this.radius / C;
      const cx = px / C, cy = py / C;
      const x0 = Math.max(0, Math.floor(cx - rad)), x1 = Math.min(cols - 1, Math.ceil(cx + rad));
      const y0 = Math.max(0, Math.floor(cy - rad)), y1 = Math.min(rows - 1, Math.ceil(cy + rad));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x - cx, y - cy) / rad;
          if (d >= 1) continue;
          const v = (1 - d * d) * 0.55;
          const i = y * cols + x;
          if (this.mask[i] < 1) this.mask[i] = Math.min(1, this.mask[i] + v);
        }
      }
    }

    tick(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      const m = this.mask, cols = this.cols, rows = this.rows, data = this.img.data;
      const dec = this.decay * dt * (reduceMotion ? 3 : 1);
      let alive = false;
      for (let y = 0; y < rows; y++) {
        const by = (y & 7) << 3;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x, o = i * 4;
          let v = m[i];
          if (v <= 0) { if (data[o + 3]) data[o + 3] = 0; continue; }
          v -= dec; if (v < 0) v = 0; m[i] = v;
          alive = alive || v > 0;
          const thr = BAYER8[by + (x & 7)];
          // la scia rivela l'arte (o il velo di fondo) con una soglia di Bayer
          const dens = this.artDensity[i];
          if (dens > 0 && dens * Math.min(1, v * 1.6) > thr) {
            data[o] = this.artColor[i * 3]; data[o + 1] = this.artColor[i * 3 + 1]; data[o + 2] = this.artColor[i * 3 + 2]; data[o + 3] = 255;
          } else if (this.baseDensity * v * 2 > thr) {
            data[o] = PAL.ink[0]; data[o + 1] = PAL.ink[1]; data[o + 2] = PAL.ink[2]; data[o + 3] = 200;
          } else {
            data[o + 3] = 0;
          }
        }
      }
      this.ctx.putImageData(this.img, 0, 0);
      if (alive) requestAnimationFrame(this.tick); else this.active = false;
    }
  }

  // ------------------------------------------------------------------
  // 2. Fogli sul filo in 1-bit
  // ------------------------------------------------------------------
  function ditherSource(source, w, h) {
    // w, h: risoluzione del retino (una cella = 2 px sul foglio)
    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    const tctx = tmp.getContext('2d', { willReadFrequently: true });
    const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
    if (!sw || !sh) return null;
    // stesso ritaglio "cover" usato dal foglio
    const ar = sw / sh, tr = w / h;
    let sx = 0, sy = 0, cw = sw, chh = sh;
    if (ar > tr) { cw = sh * tr; sx = (sw - cw) / 2; } else { chh = sw / tr; sy = (sh - chh) / 2; }
    tctx.drawImage(source, sx, sy, cw, chh, 0, 0, w, h);
    let src;
    try { src = tctx.getImageData(0, 0, w, h); } catch (e) { return null; }
    const d = src.data;
    // luminanza + contrasto automatico
    const lum = new Float32Array(w * h);
    let lo = 1, hi = 0;
    for (let i = 0; i < w * h; i++) {
      const l = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
      lum[i] = l; if (l < lo) lo = l; if (l > hi) hi = l;
    }
    const span = Math.max(0.15, hi - lo);
    const out = tctx.createImageData(w, h), o = out.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let l = (lum[i] - lo) / span;
        l = Math.pow(Math.min(1, Math.max(0, l)), 0.9);
        const on = l < BAYER8[((y & 7) << 3) + (x & 7)];   // scuro → inchiostro
        const p = on ? PAL.ink : PAL.paper;
        o[i * 4] = p[0]; o[i * 4 + 1] = p[1]; o[i * 4 + 2] = p[2]; o[i * 4 + 3] = 255;
      }
    }
    tctx.putImageData(out, 0, 0);
    return tmp;
  }

  function enhanceSheet(sheet) {
    if (sheet.dataset.dither === '1') return;
    const wrap = sheet.querySelector('.sheet-media-wrapper');
    const media = sheet.querySelector('.sheet-photo-media, .sheet-photo-canvas');
    if (!wrap || !media) return;
    sheet.dataset.dither = '1';

    const build = () => {
      const W = 162, H = 220;                 // il foglio è 324×440
      const dith = ditherSource(media, W, H);
      if (!dith) return;
      const cv = document.createElement('canvas');
      cv.className = 'sheet-dither-canvas';
      cv.width = W; cv.height = H;
      cv.getContext('2d').drawImage(dith, 0, 0);
      cv.setAttribute('aria-hidden', 'true');
      wrap.appendChild(cv);
    };

    if (media.tagName === 'IMG') {
      if (media.complete && media.naturalWidth) build();
      else media.addEventListener('load', build, { once: true });
    } else {
      // la grafica del canvas viene disegnata subito dopo la creazione del foglio
      requestAnimationFrame(build);
    }
  }

  function watchSheets() {
    const track = document.getElementById('hanging-wire-track');
    if (!track) return;
    const run = () => track.querySelectorAll('.hanging-sheet').forEach(enhanceSheet);
    run();
    new MutationObserver(run).observe(track, { childList: true });
  }

  window.initDitherEngines = function () {
    // Il pennello dither nell'hero è disattivato: resta solo l'effetto 1-bit sui fogli del filo
    watchSheets();
  };
})();
