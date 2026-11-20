/**
 * designjack — Easter egg del Konami code
 * ↑ ↑ ↓ ↓ ← → ← → B A (da tastiera) oppure, su telefono, gli stessi swipe
 * seguiti da due tap: l'avatar si spaventa, gli compare sopra il punto
 * esclamativo e parte il suono di allarme.
 * Immagine e suono: assets/Immagini/alert.png, assets/sfx/.
 */
(function () {
  'use strict';

  const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const TOUCH_SEQ = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'tap', 'tap'];
  // percorsi con le maiuscole esatte delle cartelle: sul server contano
  const IMG = 'assets/Immagini/alert.png';
  const SFX = 'assets/sfx/Metal%20Gear%20Solid%20Alert%20Sound%20Effect.mp3';
  const SHOW_MS = 1500;
  const COOLDOWN_MS = 2600;
  const LINES = [
    'Eh?! Chi c’è?… Ah, sei tu. Conosci i codici, eh?',
    'Mi hai scoperto! Pensavo di essere nascosto bene.',
    'Allarme! …ok, falso allarme. Bel colpo.'
  ];

  let keys = [];
  let swipes = [];
  let busy = false;
  let sound = null;
  let lineIdx = 0;

  const matches = (hist, seq) => hist.length === seq.length && hist.every((k, i) => k === seq[i]);

  /* ---------- tastiera ---------- */
  // tasto fisico (e.code) per B e A: funziona con qualsiasi layout, maiuscole o Bloc Maiusc
  const CODE = { ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', KeyB: 'b', KeyA: 'a' };

  // in fase di cattura su window: arriva prima di qualunque altro script della pagina
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    const t = e.target;
    // nei campi di testo si scrive, non si fanno codici (lo slider del volume invece va bene)
    if (t && (t.isContentEditable || /^(TEXTAREA|SELECT)$/.test(t.tagName) ||
      (t.tagName === 'INPUT' && !/^(range|checkbox|radio|button)$/i.test(t.type)))) return;
    const k = CODE[e.code] || (e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key);
    keys.push(k);
    if (keys.length > SEQ.length) keys.shift();
    if (matches(keys, SEQ)) {
      keys = [];
      trigger();
    }
  }, true);

  /* ---------- touch: swipe + due tap ---------- */
  let start = null;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { start = null; return; }
    const p = e.touches[0];
    start = { x: p.clientX, y: p.clientY, t: performance.now() };
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!start) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    const dt = performance.now() - start.t;
    start = null;
    let g = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && dt < 300) g = 'tap';
    else if (dt < 700 && Math.max(Math.abs(dx), Math.abs(dy)) > 40) {
      g = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    }
    if (!g) return;
    swipes.push(g);
    if (swipes.length > TOUCH_SEQ.length) swipes.shift();
    if (matches(swipes, TOUCH_SEQ)) {
      swipes = [];
      trigger();
    }
  }, { passive: true });

  /* ---------- la scena ---------- */
  function playAlert() {
    if (window.audioEngine && window.audioEngine.muted) return;
    try {
      if (!sound) {
        sound = new Audio(SFX);
        sound.preload = 'auto';
      }
      sound.currentTime = 0;
      sound.volume = 0.75;
      const pr = sound.play();
      if (pr && pr.catch) pr.catch(() => {});
    } catch (e) { /* niente audio: resta la scena */ }

    // abbassa la musica mentre suona l'allarme
    const mp = window.musicPlayer && window.musicPlayer.audio;
    if (mp && !mp.paused) {
      const vol = mp.volume;
      mp.volume = vol * 0.25;
      setTimeout(() => { mp.volume = vol; }, 1400);
    }
  }

  // l'avatar è a schermo? (nella hero, agganciato in basso o nella bolla del canale B)
  function onScreen(el) {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }

  function showMark(host, floating) {
    const mark = document.createElement('img');
    mark.src = IMG;
    mark.alt = '';
    mark.setAttribute('aria-hidden', 'true');
    mark.className = floating ? 'mgs-alert is-floating' : 'mgs-alert';
    host.appendChild(mark);
    // forza il primo stato, poi parte l'animazione
    void mark.offsetWidth;
    mark.classList.add('is-on');
    setTimeout(() => mark.remove(), SHOW_MS + 100);
  }

  function trigger() {
    if (busy) return;
    busy = true;
    setTimeout(() => { busy = false; }, COOLDOWN_MS);

    const pilot = window.avatarPilot;
    const avatar = window.heroAvatar;
    let host = pilot ? pilot.pilot : document.querySelector('.avatar-pilot');

    // se l'avatar non si vede (scrollato via o chiuso con la X) lo richiamo in basso a sinistra
    if (pilot && host && !onScreen(host) && !pilot.trapped && !document.body.classList.contains('modal-open')) {
      pilot.dismissed = false;
      if (pilot.setDocked) pilot.setDocked(true);
    }
    const visible = onScreen(host);

    playAlert();
    if (visible) {
      showMark(host, false);
      if (avatar && avatar.surprise) avatar.surprise(1.1);
      setTimeout(() => {
        if (avatar && avatar.say) avatar.say(LINES[lineIdx++ % LINES.length], { autoHide: 3600 });
      }, SHOW_MS - 150);
    } else {
      // avatar coperto (per esempio da una scheda aperta): il punto esclamativo compare al centro
      showMark(document.body, true);
    }
  }

  window.konamiAlert = trigger; // comodo per provarlo dalla console
  console.info('designjack: easter egg pronto (↑ ↑ ↓ ↓ ← → ← → B A)');
})();
