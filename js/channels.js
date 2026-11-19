/**
 * designjack — logica dei canali G e B
 *
 * Canale G ("febi"): blob organici che respirano, adesivi da staccare e
 * spostare, muro libero da dipingere con la bomboletta (con colature).
 * Canale B ("Frutiger Marine"): bolle che salgono e scoppiano, copia
 * dell'indirizzo email, "messaggio in bottiglia" che prepara una mail.
 *
 * Le animazioni girano solo mentre il canale è attivo (classe sul body).
 */

(function () {
  const isActive = (ch) => document.body.classList.contains(`channel-${ch}-active`);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audio = () => window.audioEngine || null;

  /* ================================================================== */
  /* CANALE G                                                             */
  /* ================================================================== */

  // Blob morbido: punti attorno a un centro con raggio che oscilla, chiusi con Catmull-Rom
  function blobPath(cx, cy, r, t, seed) {
    const n = 7;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + seed;
      const k = 1 + 0.16 * Math.sin(t * 0.55 + seed + i * 1.7) + 0.09 * Math.sin(t * 0.31 + seed * 2 + i * 2.9);
      pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k * 0.86]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  }

  function initBlobs(root) {
    const blobs = Array.from(root.querySelectorAll('[data-blob]')).map((el) => {
      const [cx, cy, r, seed] = el.dataset.blob.split(',').map(Number);
      return { el, cx, cy, r, seed };
    });
    const draw = (t) => blobs.forEach((b) => b.el.setAttribute('d', blobPath(b.cx, b.cy, b.r, t, b.seed)));
    draw(0);
    return draw;
  }

  function initStickers(root) {
    let z = 10;
    root.querySelectorAll('[data-drag]').forEach((el) => {
      let start = null;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        start = {
          x: e.clientX,
          y: e.clientY,
          dx: parseFloat(el.style.getPropertyValue('--dx')) || 0,
          dy: parseFloat(el.style.getPropertyValue('--dy')) || 0
        };
        el.style.zIndex = ++z;
        el.classList.add('is-lifted');
        const a = audio();
        if (a && a.playPaperFlutter) a.playPaperFlutter();
      });
      el.addEventListener('pointermove', (e) => {
        if (!start) return;
        el.style.setProperty('--dx', `${start.dx + e.clientX - start.x}px`);
        el.style.setProperty('--dy', `${start.dy + e.clientY - start.y}px`);
      });
      const drop = () => {
        if (!start) return;
        start = null;
        el.classList.remove('is-lifted');
      };
      el.addEventListener('pointerup', drop);
      el.addEventListener('pointercancel', drop);
    });
  }

  class SprayWall {
    constructor(canvas, ui) {
      this.canvas = canvas;
      this.wall = canvas.parentElement;
      this.ctx = canvas.getContext('2d');
      this.color = '#B8F23A';
      this.size = 30;
      this.drips = [];
      this.pointer = null;
      this.lastSound = 0;
      this.dpr = 1;

      ui.cans.forEach((btn) => btn.addEventListener('click', () => {
        ui.cans.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-checked', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-checked', 'true');
        this.color = btn.dataset.color;
      }));
      if (ui.size) ui.size.addEventListener('input', () => { this.size = Number(ui.size.value); });
      if (ui.clean) ui.clean.addEventListener('click', () => this.clean());

      canvas.addEventListener('pointerdown', (e) => this.down(e));
      canvas.addEventListener('pointermove', (e) => this.move(e));
      canvas.addEventListener('pointerup', () => this.up());
      canvas.addEventListener('pointercancel', () => this.up());
      if ('ResizeObserver' in window) new ResizeObserver(() => this.resize()).observe(canvas);
      this.resize();
    }

    resize() {
      const r = this.canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (w === this.canvas.width && h === this.canvas.height) return;
      // conserva il disegno quando il muro cambia dimensione
      let keep = null;
      if (this.canvas.width && this.canvas.height) {
        keep = document.createElement('canvas');
        keep.width = this.canvas.width;
        keep.height = this.canvas.height;
        keep.getContext('2d').drawImage(this.canvas, 0, 0);
      }
      this.canvas.width = w;
      this.canvas.height = h;
      this.dpr = dpr;
      if (keep) this.ctx.drawImage(keep, 0, 0, w, h);
    }

    pos(e) {
      const r = this.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * this.dpr, y: (e.clientY - r.top) * this.dpr };
    }

    down(e) {
      e.preventDefault();
      this.canvas.setPointerCapture(e.pointerId);
      const p = this.pos(e);
      this.pointer = { ...p, still: 0, last: performance.now() };
      this.wall.classList.add('has-paint');
      this.sound(true);
      this.stamp(p.x, p.y);
    }

    move(e) {
      if (!this.pointer) return;
      const p = this.pos(e);
      const dx = p.x - this.pointer.x, dy = p.y - this.pointer.y;
      const dist = Math.hypot(dx, dy);
      const step = Math.max(2, this.size * this.dpr * 0.22);
      const n = Math.max(1, Math.floor(dist / step));
      for (let i = 1; i <= n; i++) this.stamp(this.pointer.x + (dx * i) / n, this.pointer.y + (dy * i) / n);
      if (dist > 4 * this.dpr) this.pointer.still = 0;
      this.pointer.x = p.x;
      this.pointer.y = p.y;
      this.sound(false);
    }

    up() {
      this.pointer = null;
    }

    sound(force) {
      const now = performance.now();
      if (!force && now - this.lastSound < 650) return;
      this.lastSound = now;
      const a = audio();
      if (a && a.playSprayCan) a.playSprayCan();
    }

    // Un colpo di bomboletta: nebbia morbida + puntini più densi al centro
    stamp(x, y) {
      const ctx = this.ctx;
      const r = this.size * this.dpr;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.05;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      const dots = Math.round(this.size * 1.3);
      for (let i = 0; i < dots; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = r * Math.pow(Math.random(), 1.7);
        const s = (Math.random() * 1.6 + 0.6) * this.dpr;
        ctx.globalAlpha = 0.35 + Math.random() * 0.5;
        ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, s, s);
      }
      ctx.globalAlpha = 1;
      if (this.pointer) {
        this.pointer.still += 1;
        // fermo nello stesso punto: la vernice si accumula e cola
        if (this.pointer.still > 14 && Math.random() < 0.12 && this.drips.length < 40) {
          this.drips.push({
            x: x + (Math.random() - 0.5) * r * 0.6,
            y: y + r * 0.25,
            v: (1.2 + Math.random() * 1.6) * this.dpr,
            w: (2 + Math.random() * 3) * this.dpr,
            left: (40 + Math.random() * 120) * this.dpr,
            color: this.color
          });
        }
      }
    }

    tick() {
      if (!this.drips.length) return;
      const ctx = this.ctx;
      ctx.lineCap = 'round';
      this.drips = this.drips.filter((d) => {
        const step = Math.min(d.v, d.left);
        ctx.strokeStyle = d.color;
        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + step);
        ctx.stroke();
        d.y += step;
        d.left -= step;
        d.v *= 0.985;
        d.w *= 0.997;
        return d.left > 0.5 && d.v > 0.15;
      });
    }

    clean() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drips = [];
      this.wall.classList.remove('has-paint');
      const a = audio();
      if (a && a.playWaterDrop) a.playWaterDrop();
    }
  }

  function initChannelG() {
    const root = document.getElementById('channel-view-g');
    if (!root) return null;
    const drawBlobs = initBlobs(root);
    initStickers(root);
    const canvas = document.getElementById('gx-spray-canvas');
    const wall = canvas ? new SprayWall(canvas, {
      cans: Array.from(root.querySelectorAll('.gx-can')),
      size: document.getElementById('gx-spray-size'),
      clean: document.getElementById('gx-wall-clean')
    }) : null;
    // i blob si muovono lentamente: 30 fps e solo con l'hero a schermo
    // (controllo legato allo scroll: una lettura per evento, non per frame)
    let heroVisible = true;
    let tick = 0;
    let queued = false;
    const hero = root.querySelector('.gx-hero');
    const checkHero = () => {
      queued = false;
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      heroVisible = r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    };
    const queueHero = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(checkHero);
    };
    window.addEventListener('scroll', queueHero, { passive: true });
    window.addEventListener('resize', queueHero);
    return {
      onShow() {
        if (wall) wall.resize();
        checkHero();
      },
      frame(t) {
        tick++;
        if (!reduceMotion && heroVisible && (tick & 1) === 0) drawBlobs(t);
        if (wall) wall.tick();
      }
    };
  }

  /* ================================================================== */
  /* CANALE B                                                             */
  /* ================================================================== */

  // Bolle su tutta la pagina B: partono dal fondale e risalgono fino al cielo.
  // Velocità costante (non durata fissa), così restano lente anche su una pagina alta.
  function initBubbles(container) {
    const spawn = (initial) => {
      const b = document.createElement('span');
      b.className = 'bx-bubble';
      const size = Math.round(8 + Math.random() * 44);
      const rise = (container.clientHeight || 3000) + 200;
      const speed = 45 + Math.random() * 45;            // px al secondo
      const dur = (rise / speed).toFixed(1);
      b.style.width = b.style.height = `${size}px`;
      b.style.left = `${(2 + Math.random() * 96).toFixed(1)}%`;
      b.style.setProperty('--rise', `${rise}px`);
      b.style.animationDuration = `${dur}s, ${(2 + Math.random() * 3).toFixed(1)}s`;
      b.style.animationDelay = `${initial ? (-Math.random() * dur).toFixed(1) : 0}s, 0s`;
      const pop = () => {
        if (b.classList.contains('is-popping')) return;
        b.classList.add('is-popping');
        const a = audio();
        if (a && a.playWaterDrop) a.playWaterDrop();
        setTimeout(() => { b.remove(); spawn(false); }, 220);
      };
      b.addEventListener('pointerenter', pop);
      b.addEventListener('click', pop);
      container.appendChild(b);
    };
    return () => {
      if (container.childElementCount || reduceMotion) return;
      const h = container.clientHeight || 3000;
      const count = Math.max(24, Math.min(70, Math.round(h / 1000 * 15)));
      for (let i = 0; i < count; i++) spawn(true);
    };
  }

  // La bolla con dentro l'avatar: sale lenta insieme alle altre, oscillando, su tutta
  // la pagina B. Quando esce dalla parte di pagina che stai guardando riappare dal
  // basso dello schermo, così la incontri spesso. Si muove finché l'avatar è
  // intrappolato (classe .is-trapped, gestita da avatarPilot.js).
  function initAvatarBubble(root) {
    const home = root.querySelector('.avatar-home--bubble');
    const site = root.querySelector('.bx-site');
    if (!home || !site) return { onShow() {}, frame() {} };
    const st = { baseX: 0, y: 0, t: Math.random() * 10, W: 0, H: 0, size: 190, placed: false };

    const measure = () => {
      st.W = site.clientWidth;
      st.H = site.clientHeight;
      st.size = home.offsetWidth || 190;
    };
    const pickX = () => {
      const min = st.W * 0.05;
      const max = Math.max(min, st.W * 0.95 - st.size);
      st.baseX = min + Math.random() * (max - min);
    };
    const apply = () => {
      const x = st.baseX + Math.sin(st.t * 0.7) * 26;
      home.style.transform = `translate3d(${x.toFixed(1)}px, ${st.y.toFixed(1)}px, 0)`;
    };
    // parte di pagina visibile, in coordinate di .bx-site (letta ogni mezzo secondo e allo scroll)
    const view = { top: 0, bottom: 0 };
    let queued = false;
    const readView = () => {
      queued = false;
      const r = site.getBoundingClientRect();
      view.top = -r.top;
      view.bottom = window.innerHeight - r.top;
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(readView);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', () => { measure(); queue(); });

    const enterFromBottom = () => {
      pickX();
      st.y = Math.min(st.H - st.size, view.bottom + 20);
    };

    // Rimesso in bolla con la X: riappare in basso nella parte visibile e riparte
    home.addEventListener('avatar-home:before-return', () => {
      measure();
      readView();
      pickX();
      st.y = Math.max(0, Math.min(st.H - st.size, view.bottom - st.size - 40));
      apply();
    });

    return {
      onShow() {
        measure();
        readView();
        if (!st.placed) {
          st.placed = true;
          pickX();
          st.y = Math.max(0, Math.min(st.H - st.size, view.bottom * 0.62));
        }
        apply();
      },
      frame(dt) {
        st.since = (st.since || 0) + dt;
        if (st.since > 0.5) {
          st.since = 0;
          readView();
        }
        if (reduceMotion || !home.classList.contains('is-trapped')) return;
        st.t += dt;
        st.y -= 34 * dt;
        // uscita sopra la parte visibile (o rimasta molto sotto): rientra dal basso dello schermo
        if (st.y + st.size < view.top - 20 || st.y > view.bottom + 400) {
          measure();
          enterFromBottom();
        }
        apply();
      }
    };
  }

  function initChannelB() {
    const root = document.getElementById('channel-view-b');
    if (!root) return null;
    const bubbles = document.getElementById('bx-bubbles');
    const fillBubbles = bubbles ? initBubbles(bubbles) : () => {};

    root.querySelectorAll('.bx-copy').forEach((btn) => {
      const label = btn.textContent;
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          btn.textContent = 'Copiato ✓';
        } catch (err) {
          btn.textContent = btn.dataset.copy;
        }
        setTimeout(() => { btn.textContent = label; }, 1800);
      });
    });

    const form = document.getElementById('bx-bottle-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const message = String(data.get('message') || '').trim();
        if (!message) return;
        const subject = `Messaggio in bottiglia${name ? ` da ${name}` : ''}`;
        const body = name ? `${message}\n\n— ${name}` : message;
        const a = audio();
        if (a && a.playWaterDrop) a.playWaterDrop();
        window.location.href = `mailto:jacopo@designjack.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }

    const avatarBubble = initAvatarBubble(root);
    return {
      onShow() {
        fillBubbles();
        avatarBubble.onShow();
      },
      frame(t, dt) { avatarBubble.frame(dt); }
    };
  }

  /* ================================================================== */
  /* Avvio e ciclo condiviso                                              */
  /* ================================================================== */

  function boot() {
    const g = initChannelG();
    const b = initChannelB();
    let gShown = false, bShown = false;

    const sync = () => {
      const gOn = isActive('g'), bOn = isActive('b');
      if (gOn && !gShown && g) requestAnimationFrame(() => g.onShow());
      if (bOn && !bShown && b) b.onShow();
      gShown = gOn;
      bShown = bOn;
    };
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    sync();

    let last = 0;
    const loop = (ms) => {
      requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0;
      last = ms;
      if (document.hidden) return;
      if (gShown && g) g.frame(ms / 1000);
      if (bShown && b) b.frame(ms / 1000, dt);
    };
    requestAnimationFrame(loop);

    window.channelsGB = { g, b };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
