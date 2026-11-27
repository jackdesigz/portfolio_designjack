/**
 * designjack — Layout dedicato al progetto "Campari Champ-AR"
 * Registra window.PROJECT_LAYOUTS.champar(container, project): disegna la pagina
 * (hero con la scatola che sbuca, storia, packaging, showcase, campagna sui telefoni)
 * e in fondo il mini gioco endless "salta le arance". Restituisce una funzione di pulizia
 * che la modal chiama quando si chiude o cambia progetto.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const reduceMotion = () => (window.djReduceMotion && window.djReduceMotion());
  // il font pixel non ha l'apostrofo tipografico: uso quello dritto nei titoli
  const px = (s) => esc(s).replace(/[’‘]/g, "'");
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ------------------------------------------------------------------
     PAGINA
     ------------------------------------------------------------------ */
  function render(container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const head = (num, title) => `
      <header class="cz-head">
        <span class="cz-num cz-pixel">${num}</span>
        <h3 class="cz-title cz-pixel">${title.replace(/[’‘]/g, "'")}</h3>
      </header>`;
    const sprite = (kind, extra = '') => `<span class="cz-sprite cz-sprite-${kind} ${extra}" aria-hidden="true"></span>`;
    const zoom = (src, caption) => `class="zoomable-trigger" data-img-src="${src}" data-img-caption="${esc(caption)}"`;

    const hero = g.hero || {};
    const story = g.story || {};
    const pack = g.packaging || {};
    const show = g.showcase || {};
    const campaign = g.campaign || [];
    const game = g.game || {};

    container.innerHTML = `
      <div class="champar" style="--cz-base: url('${B}');">

        <!-- HERO: la scatola sbuca dal pavimento, lo spiritello spunta da dietro -->
        <section class="cz-hero">
          <div class="cz-hero-copy">
            <span class="cz-kicker">${esc(hero.kicker || project.category)}</span>
            <h3 class="cz-logo cz-pixel"><span>CAMPARI</span><em>CHAMP-AR</em></h3>
            <p class="cz-hero-lead">${hero.lead || ''}</p>
            <div class="cz-hero-actions">
              <button type="button" class="cz-coin cz-pixel" data-cz-goto="game">▶ INSERT COIN</button>
              <span class="cz-challenge cz-pixel">${esc(hero.tagline || 'Accetti la sfida?')}</span>
            </div>
          </div>
          <div class="cz-hero-stage">
            ${sprite('spirit', 'cz-peek-spirit cz-reveal')}
            <div class="cz-box-wrap cz-reveal">
              <img class="cz-box" src="${B}box.png" alt="La scatola Campari Champ-AR in 3D" loading="lazy" />
            </div>
          </div>
          <div class="cz-hero-floor" aria-hidden="true">
            ${sprite('player', 'cz-floor-runner')}
            <img class="cz-floor-orange" src="${B}orange.png" alt="" />
          </div>
        </section>

        <!-- 01 STORIA + CAST -->
        <section class="cz-sec cz-story">
          ${head('01', esc(story.title || 'La storia'))}
          <div class="cz-story-grid">
            <div class="cz-story-copy">
              ${(story.paragraphs || []).map((p) => `<p class="cz-text">${p}</p>`).join('')}
            </div>
            <div class="cz-cast">
              ${(story.cast || []).map((c, i) => `
                <article class="cz-card cz-reveal" style="--i:${i};">
                  <div class="cz-card-screen">
                    ${c.sprite === 'orange'
                      ? `<img class="cz-card-orange" src="${B}orange.png" alt="" />`
                      : sprite(c.sprite)}
                  </div>
                  <h4 class="cz-pixel">${px(c.name)}</h4>
                  <p>${c.text}</p>
                </article>`).join('')}
            </div>
          </div>
        </section>

        <!-- 02 PACKAGING: il fronte sbuca dal bordo, l'eroe spunta da dietro -->
        <section class="cz-sec cz-pack">
          <div class="cz-face-col">
            ${sprite('player', 'cz-peek-player cz-reveal')}
            <div class="cz-face-wrap cz-reveal">
              <img ${zoom(`${B}face.jpg`, pack.faceCaption || 'Il fronte del packaging')} src="${B}face.jpg" alt="Il fronte del packaging Campari Champ-AR" loading="lazy" />
            </div>
          </div>
          <div class="cz-pack-copy">
            ${head('02', esc(pack.title || 'Il packaging'))}
            ${(pack.paragraphs || []).map((p) => `<p class="cz-text">${p}</p>`).join('')}
            ${pack.aestheticsTitle ? `<h4 class="cz-sub cz-pixel">${px(pack.aestheticsTitle)}</h4>` : ''}
            ${(pack.aesthetics || []).map((p) => `<p class="cz-text">${p}</p>`).join('')}
            ${pack.fonts ? `
              <div class="cz-fonts">
                ${pack.fonts.map((f) => `
                  <div class="cz-font-card cz-reveal">
                    <span class="cz-font-use">${esc(f.use)}</span>
                    <span class="cz-font-sample ${f.pixel ? 'cz-pixel' : ''}">AaBb</span>
                    <span class="cz-font-name">${esc(f.name)}</span>
                  </div>`).join('')}
              </div>` : ''}
          </div>
        </section>

        <!-- 03 SHOWCASE: i tre lati del packaging -->
        <section class="cz-sec cz-showcase">
          ${head('03', esc(show.title || 'Showcase'))}
          ${show.lead ? `<p class="cz-text cz-lead">${show.lead}</p>` : ''}
          <figure class="cz-show cz-reveal">
            <img class="cz-show-orange cz-show-orange-a" src="${B}orange.png" alt="" aria-hidden="true" />
            <img class="cz-show-orange cz-show-orange-b" src="${B}orange.png" alt="" aria-hidden="true" />
            <div ${zoom(`${B}${show.src || 'showcase.jpg'}`, show.caption || 'Showcase del packaging')}>
              <img class="cz-show-img" src="${B}${show.src || 'showcase.jpg'}" alt="${esc(show.alt || 'I tre lati del packaging Campari Champ-AR')}" loading="lazy" />
            </div>
            ${show.caption ? `<figcaption>${esc(show.caption)}</figcaption>` : ''}
          </figure>
        </section>

        <!-- 04 CAMPAGNA SUI TELEFONI -->
        <section class="cz-sec cz-campaign">
          ${head('04', esc(g.campaignTitle || 'La campagna'))}
          ${g.campaignLead ? `<p class="cz-text cz-lead">${g.campaignLead}</p>` : ''}
          <div class="cz-steps">
            ${campaign.map((st, i) => `
              <article class="cz-step${i % 2 ? ' is-flip' : ''}">
                <div class="cz-step-copy">
                  <span class="cz-step-num cz-pixel">${String(i + 1).padStart(2, '0')}</span>
                  <h4 class="cz-pixel">${px(st.title)}</h4>
                  <p class="cz-text">${st.text}</p>
                </div>
                <div class="cz-phones" data-count="${st.phones.length}">
                  ${st.oranges ? `
                    <img class="cz-phone-orange cz-po-a" src="${B}orange.png" alt="" aria-hidden="true" />
                    <img class="cz-phone-orange cz-po-b" src="${B}orange.png" alt="" aria-hidden="true" />` : ''}
                  ${st.phones.map((ph, k) => `
                    <div class="cz-phone cz-reveal" style="--i:${k};" ${zoom(`${B}${ph.src}`, ph.caption || st.title)}>
                      <img src="${B}${ph.src}" alt="${esc(ph.alt || ph.caption || st.title)}" loading="lazy" />
                    </div>`).join('')}
                </div>
              </article>`).join('')}
          </div>
        </section>

        <!-- 05 GIOCO -->
        <section class="cz-sec cz-game" data-cz-target="game">
          ${head('05', esc(game.title || 'Gioca'))}
          ${game.lead ? `<p class="cz-text cz-lead">${game.lead}</p>` : ''}
          <div class="cz-cabinet">
            <div class="cz-screen">
              <canvas class="cz-canvas" aria-label="Mini gioco: salta le arance lanciate dallo spiritello"></canvas>
              <div class="cz-hud cz-pixel" aria-live="polite">
                <span>PUNTI <b data-cz-score>0</b></span>
                <span>RECORD <b data-cz-best>0</b></span>
              </div>
            </div>
            <div class="cz-panel">
              <button type="button" class="cz-jump" data-avatar-say="Salta le arance e riprenditi il Campari!">
                <span class="cz-pixel">SALTA</span>
              </button>
              <p class="cz-hint">Spazio o ↑ per saltare.<br>Tieni premuto per saltare più in alto.</p>
            </div>
          </div>
          ${g.repo ? `
            <a class="project-download-link cz-repo" href="${g.repo.href}" target="_blank" rel="noopener">
              <span class="dl-icon" aria-hidden="true">↗</span>
              <span class="dl-text"><strong>${esc(g.repo.label)}</strong>${g.repo.meta ? `<small>${esc(g.repo.meta)}</small>` : ''}</span>
            </a>` : ''}
        </section>
      </div>
    `;

    const root = container.querySelector('.champar');
    const scroller = container.closest('.project-modal-card') || null;
    const cleanups = [];

    const runner = new ChamparRunner(root.querySelector('.cz-cabinet'), B);
    cleanups.push(() => runner.destroy());

    // Un solo controllo, a ogni scroll (di qualunque contenitore) e resize:
    // fa comparire gli elementi con rimbalzo, muove la scatola in parallasse
    // e dice al gioco se è in vista. Funziona sia se scorre la scheda sia la pagina.
    const reveals = Array.from(root.querySelectorAll('.cz-reveal'));
    const box = root.querySelector('.cz-box-wrap');
    const screen = root.querySelector('.cz-screen');
    const still = reduceMotion();
    if (still) reveals.forEach((el) => el.classList.add('is-in'));

    const viewport = () => {
      let top = 0;
      let bottom = window.innerHeight;
      if (scroller) {
        const sr = scroller.getBoundingClientRect();
        top = Math.max(top, sr.top);
        bottom = Math.min(bottom, sr.bottom);
      }
      return { top, bottom, h: Math.max(1, bottom - top) };
    };

    let ticking = false;
    const check = () => {
      ticking = false;
      if (!root.isConnected) return;
      const vp = viewport();
      if (!still) {
        for (let i = reveals.length - 1; i >= 0; i--) {
          const r = reveals[i].getBoundingClientRect();
          if (r.top < vp.bottom - vp.h * 0.08 && r.bottom > vp.top) {
            reveals[i].classList.add('is-in');
            reveals.splice(i, 1);
          }
        }
        if (box) {
          const rr = root.getBoundingClientRect();
          const p = Math.max(-1, Math.min(1, (vp.top + vp.h * 0.5 - rr.top) / vp.h));
          box.style.setProperty('--cz-par', `${(p * -38).toFixed(1)}px`);
        }
      }
      if (screen) {
        const r = screen.getBoundingClientRect();
        runner.setVisible(r.bottom > vp.top && r.top < vp.bottom && r.height > 0);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // la scheda si apre con un'animazione: ricontrollo dopo che si è assestata
    const timers = [60, 400, 900].map((t) => setTimeout(check, t));
    check();
    cleanups.push(() => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      timers.forEach(clearTimeout);
    });

    // "INSERT COIN" porta al gioco
    const goto = root.querySelector('[data-cz-goto="game"]');
    const gameSec = root.querySelector('[data-cz-target="game"]');
    if (goto && gameSec) {
      goto.addEventListener('click', () => {
        gameSec.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
        setTimeout(() => {
          const j = gameSec.querySelector('.cz-jump');
          if (j) j.focus({ preventScroll: true });
        }, reduceMotion() ? 0 : 650);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }

  /* ------------------------------------------------------------------
     GIOCO: endless runner — l'eroe salta le arance lanciate dallo spiritello
     Mondo logico alto 280 unità, scalato sull'altezza reale del canvas.
     ------------------------------------------------------------------ */
  const LH = 280;
  const GROUND = 226;
  const GRAV = 2000;
  const JUMP_V = -650;
  const JUMP_CUT = -290;
  const PLAYER = { x: 52, size: 100 };     // frame 128 px disegnati a 100
  const SPIRIT_SIZE = 104;
  const ORANGE_R = 15;
  const BEST_KEY = 'dj-champar-best';
  const FONT = '"Upheaval", "Press Start 2P", monospace';

  class ChamparRunner {
    constructor(cabinet, base) {
      this.cab = cabinet;
      this.screen = cabinet.querySelector('.cz-screen');
      this.canvas = cabinet.querySelector('.cz-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.btn = cabinet.querySelector('.cz-jump');
      cabinet.czRunner = this; // comodo per il debug da console
      this.scoreEl = cabinet.querySelector('[data-cz-score]');
      this.bestEl = cabinet.querySelector('[data-cz-best]');

      this.state = 'idle';
      this.visible = false;
      this.raf = 0;
      this.last = 0;
      this.t = 0;
      this.best = this.readBest();
      this.bestEl.textContent = this.best;
      this.reset();

      this.img = {};
      const load = (k, f) => new Promise((res) => {
        const im = new Image();
        im.onload = () => res();
        im.onerror = () => res();
        im.src = base + f;
        this.img[k] = im;
      });
      Promise.all([
        load('player', 'player-run.png'),
        load('spirit', 'spiritello.png'),
        load('orange', 'orange.png')
      ]).then(() => this.draw());
      if (document.fonts && document.fonts.load) {
        document.fonts.load(`20px ${FONT}`).then(() => this.draw()).catch(() => {});
      }

      this.bind();
      this.resize();
    }

    readBest() {
      try { return parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { return 0; }
    }

    saveBest() {
      try { localStorage.setItem(BEST_KEY, String(this.best)); } catch (e) { /* niente */ }
    }

    beep(f, d, type) {
      if (window.audioEngine && window.audioEngine.playBeep) window.audioEngine.playBeep(f, d, type);
    }

    reset() {
      this.score = 0;
      this.speed = 250;
      this.py = GROUND;            // y dei piedi
      this.vy = 0;
      this.onGround = true;
      this.holding = false;
      this.buffer = 0;             // salto premuto appena prima di atterrare
      this.oranges = [];
      this.popups = [];
      this.scroll = 0;
      this.nextThrow = 1.1;
      this.pairPending = 0;
      this.spiritFrame = 0;
      this.spiritTimer = 0;
      this.newRecord = false;
      if (this.scoreEl) this.scoreEl.textContent = '0';
    }

    bind() {
      const down = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        this.btn.classList.add('is-down');
        this.press();
      };
      const up = () => {
        this.btn.classList.remove('is-down');
        this.release();
      };
      const keyBtn = (e) => {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat) { this.btn.classList.add('is-down'); this.press(); }
        }
      };
      const keyBtnUp = (e) => {
        if (e.code === 'Space' || e.key === 'Enter') { e.stopPropagation(); up(); }
      };
      const keyDoc = (e) => {
        if (this.state !== 'running' || !this.visible) return;
        if (e.code !== 'Space' && e.key !== 'ArrowUp') return;
        const tag = (e.target && e.target.tagName) || '';
        if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
        e.preventDefault();
        if (!e.repeat) this.press();
      };
      const keyDocUp = (e) => {
        if (e.code === 'Space' || e.key === 'ArrowUp') this.release();
      };
      const tapCanvas = (e) => {
        if (this.state !== 'running') return;
        e.preventDefault();
        this.press();
      };
      const onVis = () => this.sync();

      this.btn.addEventListener('pointerdown', down);
      this.btn.addEventListener('pointerup', up);
      this.btn.addEventListener('pointercancel', up);
      this.btn.addEventListener('pointerleave', up);
      this.btn.addEventListener('keydown', keyBtn);
      this.btn.addEventListener('keyup', keyBtnUp);
      this.btn.addEventListener('contextmenu', (e) => e.preventDefault());
      this.canvas.addEventListener('pointerdown', tapCanvas);
      this.canvas.addEventListener('pointerup', up);
      document.addEventListener('keydown', keyDoc);
      document.addEventListener('keyup', keyDocUp);
      document.addEventListener('visibilitychange', onVis);

      this.ro = 'ResizeObserver' in window ? new ResizeObserver(() => this.resize()) : null;
      if (this.ro) this.ro.observe(this.screen);

      this.unbind = () => {
        document.removeEventListener('keydown', keyDoc);
        document.removeEventListener('keyup', keyDocUp);
        document.removeEventListener('visibilitychange', onVis);
        if (this.ro) this.ro.disconnect();
      };
    }

    resize() {
      const w = this.screen.clientWidth || 600;
      const h = this.canvas.clientHeight || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.s = h / LH;
      this.dpr = dpr;
      this.LW = w / this.s;
      this.draw();
    }

    setVisible(v) {
      if (v === this.visible) return;
      this.visible = v;
      this.sync();
    }

    // il ciclo gira solo quando si sta giocando, la scheda è visibile e il gioco è in vista
    sync() {
      // in attesa gira lo stesso (piano) per far respirare spiritello e scritta lampeggiante
      const shouldRun = (this.state === 'running' || this.state === 'idle') && this.visible && !document.hidden;
      if (shouldRun && !this.raf) {
        this.last = performance.now();
        this.raf = requestAnimationFrame((t) => this.loop(t));
      } else if (!shouldRun && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
        this.draw();
      }
    }

    press() {
      if (this.state === 'idle' || (this.state === 'over' && performance.now() - this.overAt > 450)) {
        this.start();
        return;
      }
      if (this.state !== 'running') return;
      this.holding = true;
      if (this.onGround) this.jump();
      else this.buffer = 0.12;
    }

    release() {
      this.holding = false;
      if (this.state === 'running' && this.vy < JUMP_CUT) this.vy = JUMP_CUT;
    }

    jump() {
      this.vy = JUMP_V;
      this.onGround = false;
      this.buffer = 0;
      this.beep(660, 0.045, 'square');
    }

    start() {
      this.reset();
      this.state = 'running';
      this.cab.classList.add('is-playing');
      this.cab.classList.remove('is-over');
      this.holding = true;
      this.jump();
      this.sync();
    }

    gameOver() {
      this.state = 'over';
      this.overAt = performance.now();
      this.cab.classList.remove('is-playing');
      this.cab.classList.add('is-over');
      this.screen.classList.remove('is-hit');
      void this.screen.offsetWidth;
      this.screen.classList.add('is-hit');
      if (this.score > this.best) {
        this.best = this.score;
        this.newRecord = true;
        this.bestEl.textContent = this.best;
        this.saveBest();
      }
      this.beep(150, 0.25, 'sawtooth');
      this.sync();
      this.draw();
    }

    throwOrange() {
      const sx = this.LW - 86; // la mano con l'arancia, ora che lo spiritello guarda a sinistra
      this.oranges.push({
        x: sx,
        y: GROUND - 150,
        vy: -80,
        a: 0,
        landed: false,
        passed: false
      });
      this.spiritFrame = 1;
      this.spiritTimer = 0.16;
    }

    loop(now) {
      this.raf = 0;
      const dt = Math.min(0.033, (now - this.last) / 1000);
      this.last = now;
      if (this.state === 'running') this.update(dt);
      else this.t += dt;
      this.draw();
      if ((this.state === 'running' || this.state === 'idle') && this.visible && !document.hidden) {
        this.raf = requestAnimationFrame((t) => this.loop(t));
      }
    }

    update(dt) {
      this.t += dt;
      this.speed = Math.min(560, 250 + this.score * 8);
      this.scroll += this.speed * dt;

      // giocatore
      if (!this.onGround) {
        this.vy += GRAV * dt;
        this.py += this.vy * dt;
        if (this.py >= GROUND) {
          this.py = GROUND;
          this.vy = 0;
          this.onGround = true;
          if (this.buffer > 0) this.jump();
        }
      }
      if (this.buffer > 0) this.buffer -= dt;

      // spiritello: lancia, poi torna in posa con l'arancia in mano
      if (this.spiritTimer > 0) {
        this.spiritTimer -= dt;
        if (this.spiritTimer <= 0) {
          if (this.spiritFrame === 1) { this.spiritFrame = 2; this.spiritTimer = 0.28; } else this.spiritFrame = 0;
        }
      }

      this.nextThrow -= dt;
      if (this.pairPending > 0) {
        this.pairPending -= dt;
        if (this.pairPending <= 0) this.throwOrange();
      }
      if (this.nextThrow <= 0) {
        this.throwOrange();
        if (this.score >= 6 && Math.random() < 0.22) this.pairPending = 0.14;
        const minGap = 230 + this.speed * 0.45;
        this.nextThrow = (minGap + Math.random() * 280) / this.speed + (this.pairPending ? 0.14 : 0);
      }

      // arance: cadono, rimbalzano una volta e rotolano verso sinistra
      const hb = this.hitbox();
      for (let i = this.oranges.length - 1; i >= 0; i--) {
        const o = this.oranges[i];
        o.x -= this.speed * dt;
        if (!o.landed || o.vy !== 0) {
          o.vy += GRAV * dt;
          o.y += o.vy * dt;
          if (o.y + ORANGE_R >= GROUND) {
            o.y = GROUND - ORANGE_R;
            if (o.vy > 160) o.vy = -o.vy * 0.32; else o.vy = 0;
            o.landed = true;
          }
        }
        o.a -= (this.speed * dt) / ORANGE_R;

        // collisione cerchio / rettangolo
        const cx = Math.max(hb.x, Math.min(o.x, hb.x + hb.w));
        const cy = Math.max(hb.y, Math.min(o.y, hb.y + hb.h));
        const dx = o.x - cx;
        const dy = o.y - cy;
        if (dx * dx + dy * dy < (ORANGE_R * 0.82) ** 2) {
          this.gameOver();
          return;
        }

        if (!o.passed && o.x + ORANGE_R < hb.x) {
          o.passed = true;
          this.score += 1;
          this.scoreEl.textContent = this.score;
          this.popups.push({ x: o.x, y: GROUND - 70, life: 0.7 });
          if (this.score % 10 === 0) this.beep(1180, 0.06, 'square');
          else this.beep(990, 0.025, 'square');
        }
        if (o.x < -ORANGE_R * 2) this.oranges.splice(i, 1);
      }

      for (let i = this.popups.length - 1; i >= 0; i--) {
        const p = this.popups[i];
        p.life -= dt;
        p.y -= 40 * dt;
        if (p.life <= 0) this.popups.splice(i, 1);
      }
    }

    hitbox() {
      // area piena del personaggio nel frame, un po' ristretta per essere giusti
      const k = PLAYER.size / 128;
      const top = this.py - 86 * k;
      return { x: PLAYER.x + 14 * k, y: top + 22 * k, w: 52 * k, h: 60 * k };
    }

    /* ---------- disegno ---------- */
    draw() {
      const c = this.ctx;
      if (!c || !this.s) return;
      const W = this.LW;
      c.setTransform(this.dpr * this.s, 0, 0, this.dpr * this.s, 0, 0);
      c.imageSmoothingEnabled = false;

      // fondo
      c.fillStyle = '#2D2D2D';
      c.fillRect(0, 0, W, LH);

      // sfondo in parallasse: travi rosse inclinate, come sul packaging
      const par = this.scroll * 0.25;
      const tile = 360;
      c.save();
      c.globalAlpha = 0.22;
      for (let x = -((par % tile) + tile); x < W + tile; x += tile) {
        c.save();
        c.translate(x, 70);
        c.rotate(-0.06);
        c.fillStyle = '#EC2027';
        c.fillRect(0, 0, 230, 12);
        c.restore();
        c.save();
        c.translate(x + 120, 178);
        c.rotate(0.05);
        c.fillStyle = '#EC2027';
        c.fillRect(0, 0, 210, 10);
        c.restore();
      }
      c.restore();

      // pavimento: trave rossa con tacche che scorrono
      c.fillStyle = '#EC2027';
      c.fillRect(0, GROUND, W, 16);
      c.fillStyle = '#B5161C';
      c.fillRect(0, GROUND + 12, W, 4);
      c.fillStyle = 'rgba(255,255,255,0.18)';
      const notch = 28;
      for (let x = -(this.scroll % notch); x < W; x += notch) c.fillRect(x, GROUND + 4, 10, 3);
      c.fillStyle = '#1F1F1F';
      c.fillRect(0, GROUND + 16, W, LH - GROUND - 16);

      // spiritello (fluttua a destra)
      const sp = this.img.spirit;
      if (sp && sp.complete && sp.naturalWidth) {
        const bob = Math.sin(this.t * 3.2) * 4;
        const k = SPIRIT_SIZE / 128;
        const fx = this.state === 'running' ? this.spiritFrame : (Math.floor(this.t * 2) % 2 ? 2 : 0);
        // lo sprite guarda a destra: lo giro perché guardi l'eroe, a sinistra
        c.save();
        c.translate(W - 4, GROUND - 126 * k - 34 + bob);
        c.scale(-1, 1);
        c.drawImage(sp, fx * 128, 0, 128, 128, 0, 0, SPIRIT_SIZE, SPIRIT_SIZE);
        c.restore();
      }

      // arance
      const or = this.img.orange;
      this.oranges.forEach((o) => {
        if (!or || !or.complete) return;
        c.save();
        c.translate(o.x, o.y);
        c.rotate(o.a);
        c.drawImage(or, -ORANGE_R, -ORANGE_R, ORANGE_R * 2, ORANGE_R * 2);
        c.restore();
      });

      // eroe: 4 frame di corsa, fermo sul primo quando è in aria o in attesa
      const pl = this.img.player;
      if (pl && pl.complete && pl.naturalWidth) {
        const k = PLAYER.size / 128;
        let f = 0;
        if (this.state === 'running' && this.onGround) f = Math.floor(this.t * (8 + this.speed / 60)) % 4;
        else if (this.state === 'running') f = 2;
        c.drawImage(pl, f * 128, 0, 128, 128, PLAYER.x, this.py - 86 * k, PLAYER.size, PLAYER.size);
      }

      // +1
      c.textAlign = 'center';
      c.font = `16px ${FONT}`;
      this.popups.forEach((p) => {
        c.globalAlpha = Math.max(0, p.life / 0.7);
        c.fillStyle = '#FFD252';
        c.fillText('+1', p.x, p.y);
      });
      c.globalAlpha = 1;

      // schermate di attesa / game over
      if (this.state === 'idle') {
        this.banner('PREMI SALTA', 'Salta le arance e recupera il Campari', W);
      } else if (this.state === 'over') {
        c.fillStyle = 'rgba(20,20,20,0.62)';
        c.fillRect(0, 0, W, LH);
        this.banner('GAME OVER', `${this.newRecord ? 'NUOVO RECORD! ' : ''}${this.score} PUNTI · SALTA per riprovare`, W, true);
      }
    }

    banner(title, sub, W, over) {
      const c = this.ctx;
      if (window.i18n) { title = window.i18n.t(title); sub = window.i18n.t(sub); }
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const big = Math.min(46, W / 9);
      c.font = `${big}px ${FONT}`;
      c.fillStyle = '#151515';
      c.fillText(title, W / 2 + 3, 92 + 3);
      c.fillStyle = over ? '#EC2027' : '#FFFFFF';
      c.fillText(title, W / 2, 92);
      c.font = `${Math.min(17, W / 26)}px ${FONT}`;
      c.fillStyle = '#FFD252';
      if (over || Math.floor(this.t * 2) % 2 === 0 || this.state !== 'idle') c.fillText(sub, W / 2, 132);
      c.textBaseline = 'alphabetic';
    }

    destroy() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.state = 'dead';
      if (this.unbind) this.unbind();
    }
  }

  LAYOUTS.champar = render;
})();
