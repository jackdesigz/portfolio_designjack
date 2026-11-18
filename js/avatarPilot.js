/**
 * designjack — Avatar "pilota"
 *
 * - Nella hero l'avatar sta al suo posto, senza finestra.
 * - Quando la hero esce dallo schermo vola in basso a sinistra e resta lì.
 * - Mentre è visibile commenta ciò su cui passi il cursore.
 * - Passandoci sopra compare una X: cliccandola torna al suo posto nella hero
 *   e smette di seguirti finché non torni in cima: da lì, al prossimo scroll, si riaggancia.
 *
 * Nota: #main-app ha un transform (curvatura CRT), che romperebbe position:fixed.
 * Per questo, quando è agganciato, l'avatar viene spostato direttamente nel <body>.
 */

(function () {
  // Commenti al passaggio del cursore: il primo selettore che corrisponde vince.
  // Qualsiasi elemento può averne uno suo con l'attributo data-avatar-say="...".
  const COMMENTS = [
    ['[data-avatar-say]', (el) => el.getAttribute('data-avatar-say')],
    ['.hanging-sheet', (el) => {
      const t = el.querySelector('[class*="title"]');
      const name = t ? t.textContent.trim() : '';
      return name ? `“${name}”: questo mi piace parecchio.` : 'Questo progetto mi piace parecchio.';
    }],
    ['.brand-logo-container', 'Quello sono io, in versione logo.'],
    ['#channel-btn-r', 'Canale R: lavori e giochi. Sei già qui.'],
    ['#channel-btn-g', 'Canale G: il mio lato organico e street.'],
    ['#channel-btn-b', 'Canale B: contatti. Scrivimi!'],
    ['#hud-audio-toggle', 'Accendi l’audio: i bip sono la mia voce.'],
    ['.hero-cta-btn.primary', 'I progetti stesi ad asciugare sul filo.'],
    ['a[href="#claw2d-window"]', 'La claw machine! Io ci perdo sempre.'],
    ['#btn-wire-scroll-left', 'Torna indietro, c’era roba bella.'],
    ['#btn-wire-scroll-right', 'Avanti, il filo continua.'],
    ['#btn-open-full-catalog', 'Tutto l’archivio, in griglia.'],
    ['#claw2d-drop', 'Ora! Pesca!'],
    ['#claw2d-left, #claw2d-right', 'Mira bene, sopra la capsula.'],
    ['#claw2d-section', 'Ogni capsula è un progetto. Prova!'],
    ['.channel-b-email-pill', 'Scrivimi, rispondo davvero.'],
    ['#btn-open-flute', 'Il flauto magico… prova a suonarlo.'],
    ['.hero-title', 'La forma segue la funzione. Sempre.']
  ];
  const SELECTOR = COMMENTS.map((c) => c[0]).join(',');

  class AvatarPilot {
    constructor(pilot, avatar) {
      this.pilot = pilot;
      this.avatar = avatar;
      this.slot = pilot.parentElement;
      this.docked = false;
      this.dismissed = false;
      this.lastTarget = null;
      this.lastCommentAt = 0;
      this.closeBtn = pilot.querySelector('.avatar-close');

      this.watchSlot();
      this.watchHover();
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.dismiss();
        });
        // il click sulla X non deve contare come click sull'avatar
        this.closeBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
      }
    }

    // Controllo a ogni scroll (un calcolo per frame): si aggancia quando
    // la hero è quasi tutta sopra lo schermo, torna al suo posto quando riappare.
    watchSlot() {
      let queued = false;
      const check = () => {
        queued = false;
        const r = this.slot.getBoundingClientRect();
        if (!r.height) { this.slotVisible = false; return; }   // canale R nascosto
        const vh = window.innerHeight;
        this.slotVisible = r.bottom > 0 && r.top < vh;
        const visiblePart = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height;
        if (r.top < 0 && visiblePart < 0.3) {
          if (!this.dismissed) this.setDocked(true);
        } else if (visiblePart >= 0.45) {
          this.setDocked(false);
          // tornati alla hero: la X vale solo fino a qui, al prossimo scroll si riaggancia
          this.dismissed = false;
        }
      };
      const queue = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(check);
      };
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      queue();
    }

    setDocked(docked) {
      if (docked === this.docked) return;
      const first = this.pilot.getBoundingClientRect();
      this.docked = docked;
      if (docked) {
        document.body.appendChild(this.pilot);
        this.pilot.classList.add('is-docked');
      } else {
        this.slot.appendChild(this.pilot);
        this.pilot.classList.remove('is-docked');
      }
      this.avatar.hideBubble();
      this.avatar.onResize();
      this.flip(first);
      if (window.audioEngine && window.audioEngine.playBeep) {
        window.audioEngine.playBeep(docked ? 760 : 520, 0.05, 'triangle');
      }
    }

    // Animazione FLIP: dal vecchio rettangolo al nuovo
    flip(first) {
      const last = this.pilot.getBoundingClientRect();
      if (!first.width || !last.width || !this.pilot.animate) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const s = first.width / last.width;
      this.pilot.animate([
        { transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${s})` },
        { transformOrigin: '0 0', transform: 'none' }
      ], { duration: 560, easing: 'cubic-bezier(.2, .9, .25, 1.12)' });
    }

    dismiss() {
      this.dismissed = true;
      this.setDocked(false);
    }

    canComment() {
      if (this.docked) return true;
      return !!this.slotVisible;
    }

    watchHover() {
      document.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'touch') return;
        const el = e.target.closest && e.target.closest(SELECTOR);
        if (!el || el === this.lastTarget || this.pilot.contains(el)) return;
        if (!this.canComment()) return;
        const now = performance.now();
        if (now - this.lastCommentAt < 900) return;
        const entry = COMMENTS.find(([sel]) => el.matches(sel));
        if (!entry) return;
        const text = typeof entry[1] === 'function' ? entry[1](el) : entry[1];
        this.lastTarget = el;
        this.lastCommentAt = now;
        this.avatar.say(text, { quiet: true, autoHide: 3200 });
      });
    }
  }

  window.AvatarPilot = AvatarPilot;
})();
