/**
 * designjack — logica dei canali G e B
 *
 * Canale G (pagina autobiografica): blob organici che respirano, adesivi
 * da staccare e spostare, "Cosa faccio" con gli adesivi dei progetti presi
 * dal registro (al clic si apre la scheda).
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

  // "Cosa faccio": per ogni disciplina gli adesivi dei progetti, presi dal registro
  function initProjectStickers(root) {
    const reg = window.PROJECT_REGISTRY || [];
    const short = (t) => String(t).split(' — ')[0];
    root.querySelectorAll('.gx-do-list[data-cat]').forEach((list, li) => {
      const cat = list.getAttribute('data-cat');
      const items = reg.filter((p) => p.category === cat);
      if (!items.length) { list.closest('.gx-do-card').hidden = true; return; }
      list.innerHTML = items.map((p, i) => {
        const r = (((li * 3 + i * 5) % 7) - 3) * 0.9;
        return `<button type="button" class="gx-do-proj" data-proj="${p.id}" style="--r:${r.toFixed(1)}deg" aria-label="Apri il progetto ${short(p.title)}">${short(p.title)}</button>`;
      }).join('');
    });
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.gx-do-proj');
      if (!b) return;
      const p = reg.find((x) => x.id === b.getAttribute('data-proj'));
      if (p && window.openProjectModal) window.openProjectModal(p);
    });
  }

  // Percorso: la barra XP del livello in corso si riempie in base a quanto manca alla fine del corso
  function initLevels(root) {
    root.querySelectorAll('.gx-level[data-start][data-end]').forEach((lv) => {
      const a = new Date(lv.dataset.start).getTime();
      const b = new Date(lv.dataset.end).getTime();
      const k = Math.max(0.04, Math.min(1, (Date.now() - a) / (b - a)));
      const bar = lv.querySelector('.gx-xp i');
      const label = lv.querySelector('.gx-xp-label');
      if (bar) bar.style.setProperty('--p', `${(k * 100).toFixed(1)}%`);
      if (label) label.textContent = `XP ${Math.round(k * 100)}%`;
      const xp = lv.querySelector('.gx-xp');
      if (xp) xp.setAttribute('aria-label', `Corso completato al ${Math.round(k * 100)}%`);
    });
  }

  // Fuori orario: i progetti fatti con un software (es. Blender) diventano cartucce di gioco
  function initGame(root) {
    const box = root.querySelector('.gx-game-list[data-soft]');
    if (!box) return;
    const soft = box.getAttribute('data-soft').toLowerCase();
    const reg = window.PROJECT_REGISTRY || [];
    const items = reg.filter((p) => (p.software || []).some((x) => String(x).toLowerCase().includes(soft)));
    const short = (t) => String(t).split(' — ')[0];
    box.innerHTML = items.map((p, i) => `
      <button type="button" class="gx-cart" data-proj="${p.id}" style="--i:${i}; --r:${((i % 3) - 1) * 2}deg" aria-label="Apri il progetto ${short(p.title)}">
        <span class="gx-cart-img"><img src="${p.coverImage}" alt="" loading="lazy" /></span>
        <span class="gx-cart-name">${short(p.title)}</span>
      </button>`).join('');
    const scoreEl = root.querySelector('.gx-game-score b');
    const screen = root.querySelector('.gx-game-screen');
    let score = 0;
    let raf = 0;
    const addScore = (n) => {
      const from = score;
      score += n;
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 600);
        scoreEl.textContent = String(Math.round(from + (score - from) * k)).padStart(6, '0');
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('.gx-cart');
      if (!b) return;
      addScore(100);
      const p = reg.find((x) => x.id === b.getAttribute('data-proj'));
      if (p && window.openProjectModal) setTimeout(() => window.openProjectModal(p), 160);
    });
    const start = root.querySelector('.gx-game-start');
    if (start) start.addEventListener('click', () => {
      screen.classList.remove('is-started');
      void screen.offsetWidth;
      screen.classList.add('is-started');
      start.textContent = '★ Scegli un gioco';
      addScore(1000);
      const a = audio();
      if (a && a.playBeep) a.playBeep(880, 0.06);
    });
  }

  function initChannelG() {
    const root = document.getElementById('channel-view-g');
    if (!root) return null;
    const drawBlobs = initBlobs(root);
    initStickers(root);
    initProjectStickers(root);
    initLevels(root);
    initGame(root);
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
        checkHero();
      },
      frame(t) {
        tick++;
        if (!reduceMotion && heroVisible && (tick & 1) === 0) drawBlobs(t);
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
    const st = { baseX: 0, y: 0, t: Math.random() * 10, W: 0, H: 0, size: 250, placed: false };

    const measure = () => {
      st.W = site.clientWidth;
      st.H = site.clientHeight;
      st.size = home.offsetWidth || 250;
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

  // ------------------------------------------------------------------
  // Domande frequenti: un secondo avatar risponde nel riquadro sotto di lui
  // ------------------------------------------------------------------
  const FAQ = {
    sito: 'L’ho progettato io e l’ho costruito parlando con un’intelligenza artificiale: io decidevo riferimenti, regole e dettagli, lei scriveva il codice, io provavo e correggevo. Un giro dopo l’altro. Trovi tutta la storia nel progetto designjack!',
    programmi: 'Per la grafica Illustrator, Photoshop e InDesign, per le interfacce Figma, per il 3D Blender. Anche questa testa che ti sta parlando l’ho modellata io in Blender!',
    rgb: 'Come i tre colori della luce di uno schermo. R sono i lavori e i giochi, G racconta chi sono, B è questo mare di contatti. Insieme fanno il sito intero, come rosso, verde e blu insieme fanno il bianco.'
  };
  const FAQ_HELLO = 'Scegli una domanda qui accanto: ti rispondo io!';
  const FAQ_CHAT = [
    'Fammi una domanda, scegline una qui accanto!',
    'Le risposte le scrivo io, giuro.',
    'Altre domande? Scrivimi una mail!'
  ];

  function initFaq() {
    const sec = document.getElementById('bx-faq');
    const box = document.getElementById('bx-faq-avatar');
    const say = document.getElementById('bx-faq-say');
    if (!sec || !box || !say) return;
    const tr = (t) => (window.i18n ? window.i18n.t(t) : t);
    let avatar = null;
    let answered = false;
    say.textContent = tr(FAQ_HELLO);
    window.addEventListener('dj-lang', () => { if (!answered) say.textContent = tr(FAQ_HELLO); });

    const start = () => {
      if (avatar || !window.HeroAvatar || !window.THREE) return;
      avatar = new window.HeroAvatar(box, { bubble: say, autoGreet: false, messages: FAQ_CHAT });
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) start();
          // con le FAQ a schermo l'avatar agganciato in basso si fa da parte
          document.body.classList.toggle('faq-avatar-on', en.isIntersecting);
        });
      }, { threshold: 0.15 }).observe(sec);
    } else {
      start();
    }

    // le bolle decorative non passano sopra il riquadro della risposta: buco nella maschera
    const bubbles = document.getElementById('bx-bubbles');
    const answerBox = sec.querySelector('.bx-faq-box');
    if (bubbles && answerBox) {
      const hole = () => {
        const c = bubbles.getBoundingClientRect(), r = answerBox.getBoundingClientRect();
        if (!c.width || !r.width) return;
        const pad = 30;   // un bordo attorno, per le bolle più grandi
        bubbles.style.setProperty('--hx', `${Math.round(r.left - c.left - pad)}px`);
        bubbles.style.setProperty('--hy', `${Math.round(r.top - c.top - pad)}px`);
        bubbles.style.setProperty('--hw', `${Math.round(r.width + pad * 2)}px`);
        bubbles.style.setProperty('--hh', `${Math.round(r.height + pad * 2)}px`);
        bubbles.classList.add('has-hole');
      };
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(hole);
        ro.observe(bubbles);
        ro.observe(answerBox);
      }
      window.addEventListener('resize', hole);
      hole();
    }

    sec.querySelectorAll('.bx-faq-q').forEach((btn) => {
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        const text = FAQ[btn.dataset.faq];
        if (!text) return;
        start();
        answered = true;
        sec.querySelectorAll('.bx-faq-q').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        if (avatar) {
          avatar.hopVel = 0.05;
          avatar.say(text);          // say() traduce da sé se il sito è in inglese
        } else {
          say.textContent = tr(text);
        }
      });
    });
  }

  function initChannelB() {
    const root = document.getElementById('channel-view-b');
    if (!root) return null;
    const bubbles = document.getElementById('bx-bubbles');
    const fillBubbles = bubbles ? initBubbles(bubbles) : () => {};

    // Copia l'indirizzo: clipboard moderna, con ripiego per i browser che la bloccano
    const copyText = async (text) => {
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('no clipboard');
        // se il permesso resta in sospeso non aspettiamo all'infinito
        await Promise.race([
          navigator.clipboard.writeText(text),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 900))
        ]);
        return true;
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
        return ok;
      }
    };
    root.querySelectorAll('.bx-copy').forEach((btn) => {
      const tip = btn.querySelector('.bx-copy-tip');
      const label = btn.getAttribute('aria-label');
      let timer = 0;
      btn.addEventListener('click', async () => {
        const ok = await copyText(btn.dataset.copy);
        btn.classList.toggle('is-done', ok);
        if (tip) tip.textContent = ok ? 'Copiato!' : btn.dataset.copy;
        btn.setAttribute('aria-label', ok ? 'Indirizzo copiato' : label);
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.classList.remove('is-done');
          if (tip) tip.textContent = 'Copia';
          btn.setAttribute('aria-label', label);
        }, 2000);
      });
    });

    initFaq();

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
        window.location.href = `mailto:jacopofebi27@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
