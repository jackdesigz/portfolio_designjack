/**
 * designjack — Avatar "pilota"
 *
 * Un solo avatar che cambia "casa" a seconda del canale:
 * - R: nella hero. Scrollando oltre vola in basso a sinistra; la X lo rimanda
 *   a casa finché non ci torni, poi al prossimo scroll si riaggancia.
 * - G: al posto della foglia accanto al manifesto. Stesso comportamento di R.
 * - B: intrappolato in una bolla. Cliccando la bolla scoppia, lui ringrazia e
 *   va in basso a sinistra; la X lo rimette nella bolla e il ciclo ricomincia.
 *
 * Mentre è visibile commenta ciò su cui passi il cursore.
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
    ['#channel-btn-r', 'Canale R: lavori e giochi.'],
    ['#channel-btn-g', 'Canale G: il mio lato organico e street.'],
    ['#channel-btn-b', 'Canale B: contatti. Scrivimi!'],
    ['#hud-audio-toggle', 'Accendi l’audio: i bip sono la mia voce.'],
    ['.music-player', 'Ho collaborato con Ikigai alle grafiche di questi singoli.'],
    ['.hero-cta-btn.primary', 'I progetti stesi ad asciugare sul filo.'],
    ['a[href="#claw2d-window"]', 'La claw machine! Io ci perdo sempre.'],
    ['#btn-wire-scroll-left', 'Torna indietro, c’era roba bella.'],
    ['#btn-wire-scroll-right', 'Avanti, il filo continua.'],
    ['#btn-open-full-catalog', 'Tutto l’archivio, in griglia.'],
    ['#nav-open-catalog', 'Tutti i miei progetti, in un clic.'],
    // Catalogo completo
    ['.insta-project-card', (el) => {
      const t = el.querySelector('.insta-overlay-title');
      const name = t ? t.textContent.trim() : '';
      const lines = name
        ? [`“${name}”: cliccalo, c’è la scheda.`, `“${name}”: uno dei miei preferiti.`, `“${name}”: ci ho messo il cuore.`]
        : ['Cliccalo, c’è la scheda completa.'];
      return lines[Math.floor(Math.random() * lines.length)];
    }],
    ['.insta-filter-pill', (el) => {
      const f = el.getAttribute('data-filter') || 'all';
      return f === 'all' ? 'Tutto quanto, senza filtri.' : `Solo ${f}? Si illuminano quelli giusti.`;
    }],
    ['#btn-close-full-catalog', 'Già finito? Torniamo al filo.'],
    ['#claw2d-drop', 'Ora! Pesca!'],
    ['#claw2d-left, #claw2d-right', 'Mira bene, sopra la capsula.'],
    ['#claw2d-section', 'Ogni capsula è un progetto. Prova!'],
    ['.hero-title', 'Prima l’idea, poi la forma. Poi si gioca.'],
    // Canale G
    ['.gx-sticker', 'Staccalo pure, tanto si riattacca.'],
    ['.gx-can', 'Scegli il tuo verde.'],
    ['#gx-wall-clean', 'Davvero? Era un capolavoro.'],
    ['#gx-spray-canvas', 'Tieni premuto e spruzza!'],
    ['a[href="#gx-wall"]', 'Bomboletta pronta, si va al muro.'],
    ['.gx-paper', 'Il mio manifesto. Breve, ma sincero.'],
    // Canale B
    ['.bx-mail-pill', 'Scrivimi, rispondo davvero.'],
    ['.bx-copy', 'Copia e incolla, facile.'],
    ['#bx-bottle-form', 'Scrivi pure, leggo tutto.'],
    ['#btn-open-flute', 'Il flauto magico… prova a suonarlo.'],
    ['.bx-bubble', 'Quella è vuota. La mia era più grande!'],
    ['a[href="#bx-depths"]', 'Trattieni il fiato!']
  ];
  const SELECTOR = COMMENTS.map((c) => c[0]).join(',');

  // Frasi quando lo clicchi, diverse per canale
  const MESSAGES = {
    r: [
      'Ciao! Sono Jacopo “Jack” Febi.',
      'Disegno grafica, interfacce e cose in 3D.',
      'Sfoglia i progetti appesi al filo qui sotto.',
      'Oppure pesca una capsula dalla claw machine!',
      'Psst… trascinami per farmi girare la testa.'
    ],
    g: [
      'Benvenuto nel mio lato fuori orario.',
      'Organico, ma crudo. Come piace a me.',
      'Più giù c’è un muro libero: spruzza!',
      'Gli adesivi in alto si staccano davvero.'
    ],
    b: [
      'Scrivimi pure, rispondo davvero.',
      'Il messaggio in bottiglia arriva dritto da me.',
      'Il flauto ti porta in un altro canale.',
      'Glu glu… tranquillo, qui fuori respiro.'
    ]
  };
  const GREETING = {
    r: null,                                   // usa la prima frase di MESSAGES.r
    g: 'Ehi, sei arrivato nel mio lato verde.',
    b: 'Aiuto! Sono intrappolato in una bolla… mi liberi?'
  };
  const THANKS = ['Grazie! Mi hai liberato!', 'Finalmente aria! Grazie mille!', 'Glu… cioè, grazie davvero!'];
  const RETRAPPED = 'Ok, torno nella mia bolla. Liberami quando vuoi!';

  class AvatarPilot {
    constructor(pilot, avatar) {
      this.pilot = pilot;
      this.avatar = avatar;
      this.homes = {
        r: document.querySelector('[data-avatar-home="r"]') || pilot.parentElement,
        g: document.querySelector('[data-avatar-home="g"]'),
        b: document.querySelector('[data-avatar-home="b"]')
      };
      this.channel = null;
      this.home = null;
      this.docked = false;
      this.dismissed = false;
      this.trapped = false;
      this.greeted = {};
      this.lastTarget = null;
      this.lastCommentAt = 0;
      this.closeBtn = pilot.querySelector('.avatar-close');

      // in B il clic sull'avatar intrappolato fa scoppiare la bolla
      this.avatar.clickHandler = () => {
        if (this.trapped && !this.docked) {
          this.free();
          return false;
        }
        return true;
      };

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.dismiss();
        });
        // il click sulla X non deve contare come click sull'avatar
        this.closeBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
      }

      this.goHome(this.currentChannel());
      new MutationObserver(() => {
        const ch = this.currentChannel();
        if (ch !== this.channel) this.goHome(ch);
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

      this.watchScroll();
      this.watchHover();
    }

    currentChannel() {
      const c = document.body.classList;
      if (c.contains('channel-g-active')) return 'g';
      if (c.contains('channel-b-active')) return 'b';
      return 'r';
    }

    // Cambio canale: l'avatar si sposta nella casa del nuovo canale, senza animazione
    goHome(ch) {
      this.channel = ch;
      this.home = this.homes[ch] || this.homes.r;
      this.docked = false;
      this.dismissed = false;
      this.pilot.classList.remove('is-docked');
      this.home.appendChild(this.pilot);
      this.setTrapped(ch === 'b');
      this.avatar.hideBubble();
      this.avatar.setTint(ch);
      this.avatar.setMessages(MESSAGES[ch]);
      this.avatar.onResize();
      // cambio stile dal catalogo: l'avatar resta agganciato sopra al catalogo
      if (this.pinned) {
        if (this.trapped) this.setTrapped(false);
        this.dockedBeforePin = false;
        document.body.appendChild(this.pilot);
        this.pilot.classList.add('is-docked');
        this.docked = true;
        return;
      }
      this.queueCheck && this.queueCheck();
    }

    setTrapped(trapped) {
      this.trapped = trapped;
      this.pilot.classList.toggle('is-trapped', trapped);
      if (this.homes.b) this.homes.b.classList.toggle('is-trapped', trapped);
    }

    // Scoppia la bolla: ringrazia e vola in basso a sinistra
    free() {
      const bubbleHome = this.homes.b;
      this.setTrapped(false);
      if (bubbleHome) bubbleHome.classList.add('is-popping');
      const a = window.audioEngine;
      if (a && a.playWaterDrop) a.playWaterDrop();
      setTimeout(() => {
        if (bubbleHome) bubbleHome.classList.remove('is-popping');
        if (this.trapped || this.channel !== 'b') return;   // rimesso in bolla o cambiato canale nel frattempo
        this.setDocked(true);
        this.avatar.hopVel = 0.06;
        this.avatar.say(THANKS[Math.floor(Math.random() * THANKS.length)]);
      }, 280);
    }

    // Controllo a ogni scroll (un calcolo per frame). In R e G si aggancia quando
    // la casa è quasi tutta sopra lo schermo e torna al suo posto quando riappare.
    // In B si muove solo con il clic sulla bolla e con la X.
    watchScroll() {
      let queued = false;
      const check = () => {
        queued = false;
        const r = this.home.getBoundingClientRect();
        if (!r.height) { this.slotVisible = false; return; }
        const vh = window.innerHeight;
        this.slotVisible = r.bottom > 0 && r.top < vh;
        const visiblePart = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height;

        if (!this.docked && visiblePart > 0.55 && !this.greeted[this.channel]) {
          this.greeted[this.channel] = true;
          const ch = this.channel;
          setTimeout(() => {
            // niente saluto se nel frattempo è cambiato canale, si è agganciato o è stato liberato
            if (this.channel !== ch || this.docked || (ch === 'b' && !this.trapped)) return;
            const g = GREETING[ch];
            if (g) this.avatar.say(g);
            else this.avatar.nextMessage();
          }, 700);
        }

        if (this.channel === 'b' || this.pinned) return;
        if (r.top < 0 && visiblePart < 0.3) {
          if (!this.dismissed) this.setDocked(true);
        } else if (visiblePart >= 0.45) {
          this.setDocked(false);
          // tornati a casa: la X vale solo fino a qui, al prossimo scroll si riaggancia
          this.dismissed = false;
        }
      };
      this.queueCheck = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(check);
      };
      window.addEventListener('scroll', this.queueCheck, { passive: true });
      window.addEventListener('resize', this.queueCheck);
      this.queueCheck();
    }

    setDocked(docked) {
      if (docked === this.docked) return;
      const first = this.pilot.getBoundingClientRect();
      this.docked = docked;
      if (docked) {
        document.body.appendChild(this.pilot);
        this.pilot.classList.add('is-docked');
      } else {
        this.home.appendChild(this.pilot);
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

    // Catalogo a schermo intero: l'avatar si aggancia in basso a sinistra e resta lì
    // sopra al catalogo; alla chiusura torna com'era.
    pin(on) {
      if (on === !!this.pinned) return;
      this.pinned = on;
      document.body.classList.toggle('avatar-pinned', on);
      if (on) {
        this.dockedBeforePin = this.docked;
        if (this.trapped) this.setTrapped(false);
        if (!this.docked) this.setDocked(true);
        this.lastTarget = null;
        this.avatar.say((window.matchMedia && window.matchMedia('(hover: none)').matches) ? 'Ecco tutto l’archivio. Tocca un progetto!' : 'Ecco tutto l’archivio. Passa sopra ai progetti!', { autoHide: 3200 });
      } else {
        if (!this.dockedBeforePin) this.setDocked(false);
        if (this.channel === 'b' && !this.docked) this.setTrapped(true);
        this.queueCheck && this.queueCheck();
      }
    }

    dismiss() {
      if (this.pinned) return;
      if (this.channel === 'b') {
        // avvisa la bolla prima del rientro, così si riposiziona prima dell'animazione
        if (this.homes.b) this.homes.b.dispatchEvent(new CustomEvent('avatar-home:before-return'));
        this.setDocked(false);
        this.setTrapped(true);
        this.avatar.say(RETRAPPED, { autoHide: 3500 });
        return;
      }
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
        // intrappolato non commenta (chiede aiuto e basta), tranne che sulla musica
        const isMusic = el.matches('.music-player');
        if (this.trapped && !isMusic) return;
        const now = performance.now();
        if (now - this.lastCommentAt < 900) return;
        const entry = COMMENTS.find(([sel]) => el.matches(sel));
        if (!entry) return;
        const text = typeof entry[1] === 'function' ? entry[1](el) : entry[1];
        this.lastTarget = el;
        this.lastCommentAt = now;
        this.avatar.say(text, { quiet: true, autoHide: isMusic ? 4200 : 3200 });
      });
    }
  }

  window.AvatarPilot = AvatarPilot;
})();
