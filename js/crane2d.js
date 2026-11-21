/**
 * designjack — Claw Machine 2D a tutta pagina
 *
 * Seconda macchina del Canale R: la fisica è in clawPhysics2D.js, qui si
 * disegna la scena su canvas (stile manifesto Bauhaus su carta) e si gestiscono
 * comandi, premi e HUD. Funziona come la macchina 3D: mira, presa reale,
 * scivolo, vaschetta e scheda del progetto.
 */
(function () {
  'use strict';

  const INK = '#151413', PAPER = '#F7F1E4', PAPER_D = '#E2D6BD';
  const RED = '#D93D2A', YEL = '#EEA824', BLU = '#1D3557', GREEN = '#3CCB6E';
  const CAP = { red: '#D2381F', yellow: '#F0A51C', blue: '#2B62C9', green: '#18A58F', purple: '#6E36C9' };

  // nella macchina ci sono solo i progetti veri: quelli con un'immagine per la capsula
  const clawProjects = () => {
    const all = window.PROJECT_REGISTRY || [];
    const real = all.filter(p => p.capsuleImage);
    return real.length ? real : all;
  };

  // immagini delle capsule, caricate una volta sola
  const capImages = new Map();
  const capImage = (p) => {
    if (!p || !p.capsuleImage) return null;
    let im = capImages.get(p.id);
    if (!im) {
      im = new Image();
      im.src = p.capsuleImage;
      capImages.set(p.id, im);
    }
    return im.complete && im.naturalWidth ? im : null;
  };
  const FILL = ['#EEE6D3', '#EEA824', '#D93D2A', '#2B62C9', '#151413', '#EEE6D3'];

  const STATUS = {
    ready: 'PRONTO — MUOVI E PESCA', drop: 'DISCESA…', close: 'PRESA…', gripOk: 'AGGANCIATA!', gripNo: 'A VUOTO…',
    carry: 'VERSO LO SCIVOLO', miss: 'MANCATA — RIPROVA', slip: 'SCIVOLATA! RIPROVA',
    filler: 'SOLO UNA PALLINA — RIPROVA', win: 'CAPSULA VINTA!', refill: 'NUOVO CARICO DI CAPSULE'
  };

  const clamp = (v, a, b) => (v < a ? a : (v > b ? b : v));

  class ClawMachine2D {
    constructor(section) {
      this.section = section;
      this.canvas = section.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.sim = new ClawPhysics2D.Sim2D();
      this.sim.listener = (t, d) => this.onSimEvent(t, d);
      this.geo = this.sim.geo;

      this.keys = { left: false, right: false };
      this.ents = new Map();
      this.queue = [];
      this.spawnT = 0;
      this.respawns = [];
      this.collected = new Set();
      this.pendingWin = null;
      this.armed = false;
      this.armT = 0;
      this.started = false;
      this.visible = false;
      this.userActive = false;
      this.time = 0;
      this.last = 0;
      this.celebrate = 0;
      this.dropPress = 0;
      this.statusT = 0;
      this.confetti = [];
      this.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      this.statusEl = section.querySelector('.claw2d-status');
      this.collectionEl = section.querySelector('.claw2d-collection');
      this.dropBtn = section.querySelector('#claw2d-drop');
      this.buildCollection();
      this.resize();
      this.setupEvents();
      this.setStatus(STATUS.ready, true);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.buildBackground());

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    // ----------------------------------------------------------------
    // Layout: la vasca occupa tutta la larghezza della sezione
    // ----------------------------------------------------------------
    resize() {
      const w = this.section.clientWidth, h = this.section.clientHeight;
      if (!w || !h) return;
      this.cssW = w; this.cssH = h;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(w * this.dpr);
      this.canvas.height = Math.round(h * this.dpr);

      const narrow = w < 700;
      this.mh = clamp(h * 0.1, narrow ? 58 : 66, 104);          // insegna in alto
      this.dh = clamp(h * 0.15, narrow ? 116 : 104, 150);       // plancia in basso
      const playTop = this.mh, playBottom = h - this.dh;
      this.yMax = this.sim.cfg.railY + 0.75;
      this.yMin = -1.0;
      // la vasca deve restare larga almeno 7,6 unità (altrimenti le capsule si incastrano):
      // su schermi stretti la scena si rimpicciolisce e lo spazio in alto diventa parete di fondo
      this.S = Math.min((playBottom - playTop) / (this.yMax - this.yMin), w / 7.6);
      this.Y0 = playBottom + this.yMin * this.S;                 // y schermo del fondo vasca
      this.playTop = playTop; this.playBottom = playBottom;
      this.sim.setWidth(w / this.S);
      this.chutePx = this.sim.cfg.chute.x1 * this.S;
      this.section.style.setProperty('--claw2d-chute', Math.round(this.chutePx + this.sim.cfg.chute.wallT * this.S) + 'px');
      this.section.style.setProperty('--claw2d-marquee', Math.round(this.mh) + 'px');
      this.section.style.setProperty('--claw2d-deck', Math.round(this.dh) + 'px');
      this.buildBackground();
    }

    sx(x) { return x * this.S; }
    sy(y) { return this.Y0 - y * this.S; }

    // Sfondo statico: parete di fondo, fondo vasca, scivolo, insegna e plancia
    buildBackground() {
      if (!this.cssW) return;
      const W = this.cssW, H = this.cssH, dpr = this.dpr, S = this.S, cfg = this.sim.cfg, ch = cfg.chute;
      const bg = this.bg || (this.bg = document.createElement('canvas'));
      bg.width = Math.round(W * dpr); bg.height = Math.round(H * dpr);
      const g = bg.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      // --- parete di fondo: manifesto Bauhaus su blu notte
      g.fillStyle = BLU; g.fillRect(0, this.mh, W, this.playBottom - this.mh);
      const wallH = this.Y0 - this.mh;
      if (W < 560) {
        // telefono: composizione più leggera, le forme non si deformano sul formato alto e stretto
        g.fillStyle = 'rgba(247,241,228,0.07)';
        for (let yy = this.mh + 14; yy < this.playBottom; yy += 22) {
          for (let xx = 11; xx < W; xx += 22) g.fillRect(xx, yy, 2, 2);
        }
        const r = W * 0.46;
        g.fillStyle = RED; g.beginPath(); g.moveTo(W, this.mh); g.arc(W, this.mh, r, Math.PI / 2, Math.PI); g.closePath(); g.fill();
        g.strokeStyle = PAPER; g.lineWidth = 2;
        g.beginPath(); g.arc(W, this.mh, r * 1.18, Math.PI * 0.55, Math.PI * 0.95); g.stroke();
        g.fillStyle = YEL; g.fillRect(0, this.mh + wallH * 0.62, W * 0.62, 8);
        g.fillStyle = INK; g.beginPath(); g.arc(W * 0.16, this.mh + wallH * 0.2, 9, 0, Math.PI * 2); g.fill();
        g.save(); g.translate(W * 0.8, this.mh + wallH * 0.74); g.rotate(0.25);
        g.strokeStyle = PAPER; g.lineWidth = 2; g.strokeRect(-11, -11, 22, 22); g.restore();
        g.fillStyle = 'rgba(247,241,228,0.3)';
        g.fillRect(W * 0.08, this.mh + wallH * 0.12, W * 0.3, 1.5);
      } else {
      const cx = W * 0.64, cy = this.mh + (this.Y0 - this.mh) * 0.48, R = Math.min(W * 0.26, (this.Y0 - this.mh) * 0.44);
      g.fillStyle = RED; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
      g.strokeStyle = PAPER; g.lineWidth = 3;
      g.beginPath(); g.arc(cx, cy, R * 1.22, Math.PI * 1.08, Math.PI * 1.62); g.stroke();
      g.fillStyle = YEL;
      g.beginPath(); g.moveTo(W * 0.3, this.Y0 - (this.Y0 - this.mh) * 0.18); g.lineTo(W * 0.44, this.mh + (this.Y0 - this.mh) * 0.22); g.lineTo(W * 0.52, this.Y0 - (this.Y0 - this.mh) * 0.18); g.closePath(); g.fill();
      g.strokeStyle = PAPER; g.lineWidth = 2;
      g.save(); g.translate(W * 0.86, this.mh + (this.Y0 - this.mh) * 0.3); g.rotate(0.2); g.strokeRect(-R * 0.32, -R * 0.32, R * 0.64, R * 0.64); g.restore();
      g.fillStyle = INK; g.beginPath(); g.arc(W * 0.18, this.mh + (this.Y0 - this.mh) * 0.25, R * 0.12, 0, Math.PI * 2); g.fill();
      // filetti
      g.fillStyle = 'rgba(247,241,228,0.35)';
      g.fillRect(W * 0.06, this.mh + (this.Y0 - this.mh) * 0.14, W * 0.32, 1.5);
      g.fillRect(W * 0.58, this.Y0 - (this.Y0 - this.mh) * 0.08, W * 0.38, 1.5);
      }

      // --- fondo vasca (con le rampe) e soletta
      const floorY = (x) => this.sy(Math.max(0, this.sim.floorAt(x)));
      const xStart = this.sx(ch.x1 + ch.wallT);
      g.fillStyle = PAPER_D;
      g.beginPath(); g.moveTo(xStart, this.playBottom + 2);
      for (let px = xStart; px <= W; px += 3) g.lineTo(px, floorY(px / S));
      g.lineTo(W, floorY(cfg.W - 1e-4)); g.lineTo(W, this.playBottom + 2); g.closePath(); g.fill();
      g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.moveTo(xStart, floorY(ch.x1 + ch.wallT + 1e-4));
      for (let px = xStart; px <= W; px += 3) g.lineTo(px, floorY(px / S));
      g.stroke();

      // --- pozzo dello scivolo (attraversa soletta e plancia)
      const hx = this.chutePx;
      g.fillStyle = '#0B0A0A'; g.fillRect(0, this.Y0, hx, H - this.Y0);
      // bocca con strisce di pericolo
      g.save(); g.beginPath(); g.rect(0, this.Y0, hx, 12); g.clip();
      g.fillStyle = YEL; g.fillRect(0, this.Y0, hx, 12);
      g.fillStyle = INK;
      for (let x = -20; x < hx + 20; x += 18) { g.beginPath(); g.moveTo(x, this.Y0); g.lineTo(x + 9, this.Y0); g.lineTo(x + 21, this.Y0 + 12); g.lineTo(x + 12, this.Y0 + 12); g.closePath(); g.fill(); }
      g.restore();
      g.fillStyle = 'rgba(238,168,36,0.85)'; g.font = '700 11px "Jost", "Helvetica Neue", Arial, sans-serif'; g.textAlign = 'center';
      g.save(); g.translate(hx / 2, (this.Y0 + this.playBottom) / 2 + 8); g.fillText('PREMI ↓', 0, 4); g.restore();

      // --- paratia in acrilico
      const bx0 = this.sx(ch.x1), bx1 = this.sx(ch.x1 + ch.wallT), byTop = this.sy(ch.wallH);
      g.fillStyle = YEL; g.fillRect(bx0, byTop, bx1 - bx0, this.playBottom - byTop);
      g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(bx0, byTop, bx1 - bx0, this.playBottom - byTop);

      // --- plancia in basso: crema con bordo
      const dTop = this.playBottom;
      g.fillStyle = INK; g.fillRect(hx, dTop, W - hx, H - dTop);
      g.fillStyle = PAPER; g.fillRect(0, dTop - 2, W, 4);
      // vaschetta dei premi
      const tw = Math.min(hx - 14, S * 1.9), tx = (hx - tw) / 2, ty = H - Math.min(this.dh * 0.5, S * 0.95) - 10;
      this.tray = { x: tx, y: ty, w: tw, h: H - 10 - ty };
      g.fillStyle = '#211E1B'; g.fillRect(tx, ty, tw, this.tray.h);
      g.fillStyle = PAPER; g.fillRect(tx - 4, H - 14, tw + 8, 6);
      g.strokeStyle = PAPER; g.lineWidth = 2; g.strokeRect(tx, ty, tw, this.tray.h);

      // --- binario del carrello
      const ry = this.sy(cfg.railY) - 12;
      g.fillStyle = INK; g.fillRect(0, ry - 5, W, 10);
      g.fillStyle = PAPER;
      for (let x = 24; x < W; x += 96) { g.beginPath(); g.arc(x, ry, 2.2, 0, Math.PI * 2); g.fill(); }

      // --- insegna
      g.fillStyle = RED; g.fillRect(0, 0, W, this.mh);
      g.fillStyle = INK; g.fillRect(0, this.mh - 4, W, 4);
      const fs = Math.round(this.mh * 0.46);
      g.font = `700 ${fs}px "Jost", "Helvetica Neue", Arial, sans-serif`;
      g.textAlign = 'left'; g.textBaseline = 'middle';
      const tX = Math.max(18, W * 0.03), tY = this.mh * 0.46;
      g.fillStyle = PAPER; g.fillText("JACK'S CLAW", tX, tY);
      const tw2 = g.measureText("JACK'S CLAW").width;
      const sx0 = tX + tw2 + fs * 0.6, sz = fs * 0.62;
      if (sx0 + sz * 4.4 < W - 120 || W > 760) {
        g.fillStyle = YEL; g.beginPath(); g.arc(sx0 + sz / 2, tY, sz / 2, 0, Math.PI * 2); g.fill();
        g.fillStyle = PAPER; g.beginPath(); g.moveTo(sx0 + sz * 1.9, tY - sz / 2); g.lineTo(sx0 + sz * 2.45, tY + sz / 2); g.lineTo(sx0 + sz * 1.35, tY + sz / 2); g.closePath(); g.fill();
        g.fillStyle = BLU; g.fillRect(sx0 + sz * 2.8, tY - sz / 2, sz, sz);
      }
      if (W > 560) {
        g.font = '700 12px "Jost", "Helvetica Neue", Arial, sans-serif'; g.textAlign = 'right';
        g.fillStyle = PAPER; g.fillText('PESCA UN PROGETTO', W - Math.max(18, W * 0.03), tY);
      }
      // lampadine: posizioni (disegnate a ogni fotogramma)
      this.bulbs = [];
      const by = this.mh - 13;
      for (let x = 14; x < W - 8; x += 26) this.bulbs.push(x);
      this.bulbY = by;
    }

    // ----------------------------------------------------------------
    // HUD e comandi
    // ----------------------------------------------------------------
    buildCollection() {
      this.dots = new Map();
      if (!this.collectionEl) return;
      this.collectionEl.innerHTML = '';
      clawProjects().forEach(p => {
        capImage(p); // precarica
        const d = document.createElement('span');
        d.className = 'claw2d-dot';
        d.style.setProperty('--dot', CAP[p.capsuleColor] || RED);
        d.title = p.title;
        this.collectionEl.appendChild(d);
        this.dots.set(p.id, d);
      });
    }

    setStatus(text, sticky) {
      if (!this.statusEl) return;
      // durante la consegna di un premio resta visibile "CAPSULA VINTA!"
      if (this.pendingWin && text !== STATUS.win) return;
      this.statusEl.textContent = text;
      this.statusEl.classList.add('visible');
      this.statusT = sticky ? 3.2 : 2.6;
    }

    hasFocus() {
      if (!this.visible) return false;
      const r = this.section.getBoundingClientRect(), mid = window.innerHeight / 2;
      return r.top <= mid && r.bottom >= mid;
    }

    isInteractive() {
      if (!this.started) return false;
      const viewR = document.getElementById('channel-view-r');
      if (viewR && !viewR.classList.contains('active')) return false;
      if (document.querySelector('.modal-overlay.active, .fullscreen-catalog-modal.active, .flute-modal-overlay.open')) return false;
      return this.hasFocus();
    }

    setupEvents() {
      window.addEventListener('resize', () => { this.resizePending = true; });
      if ('ResizeObserver' in window) new ResizeObserver(() => { this.resizePending = true; }).observe(this.section);

      const map = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
      window.addEventListener('keydown', (e) => {
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) return;
        if (!this.isInteractive()) return;
        this.userActive = true;
        if (map[e.code]) {
          if (!this.keys[map[e.code]] && window.audioEngine) window.audioEngine.playJoystickClack();
          this.keys[map[e.code]] = true;
          e.preventDefault();
        } else if (e.code === 'Space' || e.code === 'Enter') {
          if ((tag === 'BUTTON' || tag === 'A') && !(e.target.closest && e.target.closest('#claw2d-section'))) return;
          e.preventDefault();
          if (!e.repeat) this.pressDrop();
        } else if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'KeyW' || e.code === 'KeyS') {
          // in 2D non c'è profondità: le frecce su/giù non fanno scorrere la pagina mentre si gioca
          e.preventDefault();
        }
      });
      window.addEventListener('keyup', (e) => { if (map[e.code]) this.keys[map[e.code]] = false; });
      window.addEventListener('blur', () => { this.keys.left = this.keys.right = false; });

      const bind = (id, key) => {
        const btn = this.section.querySelector('#' + id);
        if (!btn) return;
        const on = (e) => {
          e.preventDefault();
          this.userActive = true;
          this.keys[key] = true;
          btn.classList.add('held');
          try { btn.setPointerCapture(e.pointerId); } catch (err) {}
          if (window.audioEngine) window.audioEngine.playJoystickClack();
        };
        const off = () => { this.keys[key] = false; btn.classList.remove('held'); };
        btn.addEventListener('pointerdown', on);
        btn.addEventListener('pointerup', off);
        btn.addEventListener('pointercancel', off);
        btn.addEventListener('lostpointercapture', off);
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
      };
      bind('claw2d-left', 'left');
      bind('claw2d-right', 'right');
      if (this.dropBtn) this.dropBtn.addEventListener('click', () => { this.userActive = true; this.pressDrop(true); });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver((en) => { en.forEach(x => { this.visible = x.isIntersecting; }); }, { threshold: [0, 0.01] }).observe(this.section);
      } else {
        this.visible = true;
      }
    }

    pressDrop(fromButton) {
      if (this.pendingWin || !this.armed || !this.started) return;
      if (!fromButton && !this.isInteractive()) return;
      if (this.sim.pressDrop()) {
        this.dropPress = 1;
        if (window.audioEngine) window.audioEngine.playClawDrop();
      }
    }

    // ----------------------------------------------------------------
    // Popolamento della vasca
    // ----------------------------------------------------------------
    inPit() {
      const ids = new Set();
      this.ents.forEach(e => { if (e.project) ids.add(e.project.id); });
      this.queue.forEach(q => { if (q.project) ids.add(q.project.id); });
      return ids;
    }

    topUp(withFillers) {
      const cap = this.sim.capacity();
      const present = this.inPit();
      let capsNow = 0;
      this.ents.forEach(e => { if (e.project) capsNow++; });
      capsNow += this.queue.filter(q => q.kind === 'capsule').length;
      const free = clawProjects().filter(p => !this.collected.has(p.id) && !present.has(p.id));
      for (let i = free.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [free[i], free[j]] = [free[j], free[i]]; }
      const add = Math.max(0, Math.min(free.length, cap.capsules - capsNow));
      for (let i = 0; i < add; i++) this.queue.push({ kind: 'capsule', r: 0.55, project: free[i] });
      if (withFillers) for (let i = 0; i < cap.fillers; i++) this.queue.push({ kind: 'filler', r: 0.22 + Math.random() * 0.09, color: i });
      for (let i = this.queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]]; }
      if (this.queue.length) { this.armed = false; this.armT = 0; }
    }

    spawnNext() {
      const q = this.queue.shift();
      const p = this.sim.dropPoint(Math.random);
      const body = this.sim.addBody({ kind: q.kind, r: q.r, x: p.x, y: p.y, vy: -2.4, w: (Math.random() - 0.5) * 8, a: Math.random() * 6.28 });
      this.ents.set(body.id, { body, project: q.project || null, color: q.kind === 'filler' ? FILL[q.color % FILL.length] : null, visible: true });
    }

    // ----------------------------------------------------------------
    // Eventi della simulazione
    // ----------------------------------------------------------------
    onSimEvent(type, data) {
      const A = this.userActive ? window.audioEngine : null;
      switch (type) {
        case 'state':
          if (data === 'DROP') this.setStatus(STATUS.drop);
          else if (data === 'CLOSE') this.setStatus(STATUS.close);
          else if (data === 'CARRY') this.setStatus(STATUS.carry);
          break;
        case 'landed': if (A && A.playClack) A.playClack(0.5); break;
        case 'grip': this.setStatus(data ? STATUS.gripOk : STATUS.gripNo); if (A) A.playGrab(); break;
        case 'miss': this.setStatus(STATUS.miss, true); if (A && A.playMiss) A.playMiss(); break;
        case 'slip': this.setStatus(STATUS.slip, true); if (A && A.playMiss) A.playMiss(); break;
        case 'release': if (A) A.playTick(); break;
        case 'ready': if (!this.pendingWin) this.setStatus(STATUS.ready, true); break;
        case 'chute': this.onChute(data); break;
      }
    }

    onChute(body) {
      const e = this.ents.get(body.id);
      if (!e) return;
      if (this.armed && e.project && !this.pendingWin) {
        this.pendingWin = { e, t: 0, opened: false, x: this.sx(body.x), y: this.sy(body.y), a: body.a };
        this.collected.add(e.project.id);
        const dot = this.dots.get(e.project.id);
        if (dot) dot.classList.add('won');
        this.setStatus(STATUS.win, true);
        this.celebrate = 2.2;
        this.spawnConfetti();
        if (this.userActive && window.audioEngine) (window.audioEngine.playWin || window.audioEngine.playChuteDrop).call(window.audioEngine);
        return;
      }
      if (this.armed && !e.project) this.setStatus(STATUS.filler, true);
      e.visible = false;
      this.respawns.push({ e, t: 0.7 });
    }

    spawnConfetti() {
      if (this.reduced) return;
      const cols = [RED, YEL, '#3E6FC4', PAPER];
      const x0 = this.chutePx / 2, y0 = this.playBottom;
      for (let i = 0; i < 110; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6, s = 280 + Math.random() * 520;
        this.confetti.push({ x: x0, y: y0, vx: Math.cos(a) * s + 120, vy: Math.sin(a) * s, r: Math.random() * 6, w: (Math.random() - 0.5) * 16, c: cols[i % 4], t: 0 });
      }
    }

    // Chiamato dal modal della capsula quando si torna a giocare
    resetForNewGame() {
      if (this.pendingWin) {
        const b = this.pendingWin.e.body;
        this.ents.delete(b.id);
        const i = this.sim.bodies.indexOf(b);
        if (i >= 0) this.sim.bodies.splice(i, 1);
        this.pendingWin = null;
      }
      this.keys.left = this.keys.right = false;
      const all = clawProjects().length;
      if (this.collected.size >= all) {
        this.collected.clear();
        this.dots.forEach(d => d.classList.remove('won'));
        this.setStatus(STATUS.refill, true);
      } else {
        this.setStatus(STATUS.ready, true);
      }
      this.topUp(false);
    }

    // ----------------------------------------------------------------
    // Ciclo
    // ----------------------------------------------------------------
    loop(now) {
      requestAnimationFrame(this.loop);
      const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 0.016);
      this.last = now;
      if (!this.visible || document.hidden) return;
      const viewR = document.getElementById('channel-view-r');
      if (viewR && !viewR.classList.contains('active')) return;
      if (this.resizePending || this.section.clientWidth !== this.cssW || this.section.clientHeight !== this.cssH) { this.resizePending = false; this.resize(); }
      if (!this.cssW) return;
      if (!this.started) { this.started = true; this.topUp(true); }
      this.time += dt;
      this.update(dt);
      this.draw();
    }

    update(dt) {
      const sim = this.sim, c = sim.claw;
      if (this.queue.length) {
        this.spawnT -= dt;
        if (this.spawnT <= 0) { this.spawnNext(); this.spawnT = 0.11; }
      } else if (!this.armed) {
        this.armT += dt;
        if ((this.armT > 0.6 && sim.allAsleep()) || this.armT > 5) this.armed = true;
      }
      for (let i = this.respawns.length - 1; i >= 0; i--) {
        const r = this.respawns[i];
        r.t -= dt;
        if (r.t <= 0) { const p = sim.dropPoint(Math.random); sim.respawn(r.e.body, p.x, p.y); r.e.visible = true; this.respawns.splice(i, 1); }
      }

      const live = this.isInteractive() && !this.pendingWin;
      sim.input = live ? (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0) : 0;
      sim.update(dt);

      const A = this.userActive ? window.audioEngine : null;
      if (A && this.hasFocus()) {
        if (A.setMotor) A.setMotor(c.moving);
        if (A.playClack) for (let i = 0; i < sim.impacts.length && i < 3; i++) A.playClack(Math.min(1, sim.impacts[i].speed / 10));
      }

      if (this.pendingWin) {
        const w = this.pendingWin;
        w.t += dt;
        if (!w.opened && w.t > 1.3) {
          w.opened = true;
          window.clawPrizeOwner = this;
          if (window.openCapsuleModal) window.openCapsuleModal(w.e.project);
        }
        if (w.opened && w.t > 2.6 && !document.querySelector('.modal-overlay.active')) {
          if (window.clawPrizeOwner === this) window.clawPrizeOwner = null;
          this.resetForNewGame();
        }
      }

      if (this.celebrate > 0) this.celebrate -= dt;
      this.dropPress = Math.max(0, this.dropPress - dt * 4);
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const p = this.confetti[i];
        p.t += dt; p.vy += 900 * dt; p.vx *= 1 - 1.2 * dt; p.vy *= 1 - 0.8 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.w * dt;
        if (p.t > 3.5 || p.y > this.cssH + 20) this.confetti.splice(i, 1);
      }

      if (this.statusEl && this.statusT > 0) {
        this.statusT -= dt;
        if (this.statusT <= 0 && c.state === 'IDLE') this.statusEl.classList.remove('visible');
        else if (this.statusT <= 0) this.statusT = 0.2;
      }
      if (this.dropBtn) {
        const ready = c.state === 'IDLE' && this.armed && !this.pendingWin;
        if (this.dropBtn.disabled === ready) { this.dropBtn.disabled = !ready; this.dropBtn.classList.toggle('busy', !ready); }
      }
    }

    // ----------------------------------------------------------------
    // Disegno
    // ----------------------------------------------------------------
    draw() {
      const g = this.ctx, dpr = this.dpr, S = this.S, sim = this.sim, c = sim.claw;
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (this.bg) g.drawImage(this.bg, 0, 0);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      // lampadine dell'insegna
      const fast = this.celebrate > 0, step = Math.floor(this.time * (fast ? 16 : 5));
      this.bulbs.forEach((x, i) => {
        const on = fast ? (i + step) % 2 === 0 : (i + step) % 4 < 2;
        g.fillStyle = on ? (fast && i % 2 ? PAPER : YEL) : '#7A2A1C';
        g.beginPath(); g.arc(x, this.bulbY, 4.2, 0, Math.PI * 2); g.fill();
      });

      // mirino e linea di mira
      const aim = sim.aim();
      const locked = aim.body && aim.dist < 0.3 && c.state === 'IDLE';
      const fh = sim.floorAt(c.hub.x);
      if ((c.state === 'IDLE' || c.state === 'DROP') && fh > -1) {
        const x = this.sx(c.hub.x), yTop = this.sy(c.hub.y + this.geo.palmY - 0.1), yF = this.sy(fh);
        g.strokeStyle = locked ? GREEN : 'rgba(247,241,228,0.55)';
        g.lineWidth = 1.5; g.setLineDash([6, 7]);
        g.beginPath(); g.moveTo(x, yTop); g.lineTo(x, yF); g.stroke(); g.setLineDash([]);
        const rw = 0.7 * S, k = locked ? 1 + Math.sin(this.time * 9) * 0.06 : 1;
        g.lineWidth = 3; g.strokeStyle = locked ? GREEN : YEL;
        g.beginPath();
        g.moveTo(x - rw * k, yF - 8); g.lineTo(x - rw * k, yF + 2); g.lineTo(x - rw * k + 12, yF + 2);
        g.moveTo(x + rw * k, yF - 8); g.lineTo(x + rw * k, yF + 2); g.lineTo(x + rw * k - 12, yF + 2);
        g.stroke();
      }

      // corpi
      const list = [];
      this.ents.forEach(e => { if (e.visible && e.body.active) list.push(e); });
      list.forEach(e => this.drawBody(e, this.sx(e.body.x), this.sy(e.body.y), e.body.a));

      // capsula vinta che cade nella vaschetta
      if (this.pendingWin) {
        const w = this.pendingWin, tr = this.tray;
        const tx = tr.x + tr.w / 2, ty = tr.y + tr.h - 0.55 * S - 4;
        const k = Math.min(1, w.t / 0.45);
        const y = w.y + (ty - w.y) * k * k;
        const bounce = w.t > 0.45 ? Math.abs(Math.sin((w.t - 0.45) * 9)) * 10 * Math.max(0, 1 - (w.t - 0.45) * 1.6) : 0;
        this.drawBody(w.e, tx, y - bounce, w.a + w.t * 4 * Math.max(0, 1 - w.t / 1.2));
      }

      this.drawClaw(g, c);

      // coriandoli
      this.confetti.forEach(p => {
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-4, -6, 8, 12); g.restore();
      });

      // velo per il bagliore della vittoria
    }

    drawBody(e, x, y, a) {
      const g = this.ctx, r = e.body.r * this.S;
      g.save(); g.translate(x, y); g.rotate(-a);
      if (!e.project) {
        g.fillStyle = e.color; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
        g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
        g.restore(); return;
      }
      const col = CAP[e.project.capsuleColor] || RED;
      const img = capImage(e.project);
      if (img) {
        // capsula trasparente con dentro l'immagine del progetto, come un adesivo tondo;
        // la metà inferiore è plastica colorata semitrasparente
        g.fillStyle = PAPER; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
        g.save();
        g.beginPath(); g.arc(0, 0, r * 0.94, 0, Math.PI * 2); g.clip();
        // l'immagine resta dritta mentre il guscio rotola: si legge sempre
        g.rotate(a);
        g.drawImage(img, -r * 0.94, -r * 0.94, r * 1.88, r * 1.88);
        g.restore();
        g.save();
        g.globalAlpha = 0.3;
        g.fillStyle = col; g.beginPath(); g.arc(0, 0, r, 0, Math.PI); g.closePath(); g.fill();
        g.restore();
        // riflesso sulla cupola
        g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = Math.max(1.5, r * 0.09); g.lineCap = 'round';
        g.beginPath(); g.arc(0, 0, r * 0.72, Math.PI * 1.15, Math.PI * 1.45); g.stroke();
        g.lineCap = 'butt';
        g.fillStyle = col; g.fillRect(-r, -r * 0.05, r * 2, r * 0.1);
      } else {
        // metà inferiore colorata, metà superiore trasparente
        g.fillStyle = col; g.beginPath(); g.arc(0, 0, r, 0, Math.PI); g.closePath(); g.fill();
        g.fillStyle = PAPER; g.beginPath(); g.arc(0, 0, r, Math.PI, Math.PI * 2); g.closePath(); g.fill();
        // gettone del progetto dentro la cupola
        this.drawToken(g, e.project.shapeName, 0, -r * 0.42, r * 0.3, col);
        g.fillStyle = INK; g.fillRect(-r, -r * 0.05, r * 2, r * 0.1);
      }
      g.strokeStyle = INK; g.lineWidth = 2.2;
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.stroke();
      g.restore();
    }

    drawToken(g, name, x, y, s, fill) {
      const n = (name || '').toLowerCase();
      g.save(); g.translate(x, y);
      g.fillStyle = fill || PAPER; g.strokeStyle = INK; g.lineWidth = 1.6;
      g.beginPath();
      if (n.indexOf('cube') >= 0 || n.indexOf('cylinder') >= 0) g.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
      else if (n.indexOf('torus') >= 0) { g.arc(0, 0, s * 0.8, 0, Math.PI * 2); g.moveTo(s * 0.35, 0); g.arc(0, 0, s * 0.35, 0, Math.PI * 2, true); }
      else if (n.indexOf('tetra') >= 0 || n.indexOf('prism') >= 0 || n.indexOf('cone') >= 0) { g.moveTo(0, -s); g.lineTo(s * 0.9, s * 0.7); g.lineTo(-s * 0.9, s * 0.7); g.closePath(); }
      else if (n.indexOf('octa') >= 0 || n.indexOf('pyramid') >= 0) { g.moveTo(0, -s); g.lineTo(s * 0.75, 0); g.lineTo(0, s); g.lineTo(-s * 0.75, 0); g.closePath(); }
      else if (n.indexOf('star') >= 0) { for (let i = 0; i < 10; i++) { const rr = i % 2 ? s * 0.42 : s; const aa = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } g.closePath(); }
      else { for (let i = 0; i < 6; i++) { const aa = i * Math.PI / 3; g.lineTo(Math.cos(aa) * s * 0.85, Math.sin(aa) * s * 0.85); } g.closePath(); }
      g.fill('evenodd'); g.stroke();
      g.restore();
    }

    drawClaw(g, c) {
      const S = this.S, geo = this.geo, sim = this.sim;
      const ry = this.sy(sim.cfg.railY) - 12;
      const cx = this.sx(c.cx);
      // carrello sul binario
      g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = 2.5;
      g.fillRect(cx - 34, ry - 14, 68, 26); g.strokeRect(cx - 34, ry - 14, 68, 26);
      g.fillStyle = RED; g.fillRect(cx + 8, ry - 9, 18, 10);
      g.fillStyle = c.state === 'IDLE' ? GREEN : YEL; g.beginPath(); g.arc(cx - 20, ry - 1, 4, 0, Math.PI * 2); g.fill();
      // cavo
      const hx = this.sx(c.hub.x), hy = this.sy(c.hub.y);
      const ex = c.ex, ey = c.ey;
      const topX = hx + ey[0] * 0.55 * S, topY = hy - ey[1] * 0.55 * S;
      g.strokeStyle = INK; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(cx, ry + 12); g.lineTo(topX, topY); g.stroke();

      // dita: profilo ruotato attorno al perno, nello spazio dell'artiglio
      const ct = Math.cos(c.theta), st = Math.sin(c.theta);
      const pts = [[0, 0], geo.elbow, geo.tip, geo.hook];
      const toScreen = (side, p) => {
        const rho = geo.pivotR + p[0] * ct - p[1] * st;
        const yy = geo.pivotY + p[1] * ct + p[0] * st;
        const wx = c.hub.x + ex[0] * side * rho + ey[0] * yy;
        const wy = c.hub.y + ex[1] * side * rho + ey[1] * yy;
        return [this.sx(wx), this.sy(wy)];
      };
      [-1, 1].forEach(side => {
        const p = pts.map(q => toScreen(side, q));
        g.lineJoin = 'round'; g.lineCap = 'round';
        g.strokeStyle = INK; g.lineWidth = geo.rf * 2 * S + 3;
        g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.stroke();
        g.strokeStyle = PAPER; g.lineWidth = Math.max(2, geo.rf * 2 * S - 3);
        g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.stroke();
        g.fillStyle = YEL; g.strokeStyle = INK; g.lineWidth = 2;
        g.beginPath(); g.arc(p[0][0], p[0][1], geo.rf * S * 0.9, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = INK; g.beginPath(); g.arc(p[3][0], p[3][1], geo.rf * S * 0.95, 0, Math.PI * 2); g.fill();
      });
      g.lineCap = 'butt';

      // mozzo: cupola rossa, fascia crema, palmo nero
      g.save(); g.translate(hx, hy); g.rotate(Math.atan2(ey[0], ey[1]));
      const hw = 0.36 * S;
      g.fillStyle = RED; g.strokeStyle = INK; g.lineWidth = 2.5;
      g.beginPath(); g.arc(0, -0.16 * S, hw, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = PAPER; g.fillRect(-hw, -0.18 * S, hw * 2, 0.22 * S); g.strokeRect(-hw, -0.18 * S, hw * 2, 0.22 * S);
      g.fillStyle = YEL; g.fillRect(-hw, -0.12 * S, hw * 2, 0.06 * S);
      g.fillStyle = INK; g.fillRect(-geo.palmHW * S, -geo.palmY * S - 0.05 * S, geo.palmHW * 2 * S, 0.1 * S);
      g.restore();
    }
  }

  window.initClaw2D = function () {
    const sec = document.getElementById('claw2d-section');
    if (!sec || !window.ClawPhysics2D) return;
    try { window.claw2d = new ClawMachine2D(sec); } catch (e) { console.error('Claw 2D: inizializzazione fallita', e); }
  };
})();
