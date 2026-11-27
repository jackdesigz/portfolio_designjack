/**
 * navMenu.js — menu a tendina della barra in alto, solo su telefono.
 *
 * Sotto i 760 px nella barra restano il logo, i canali R / G / B e il pulsante ☰.
 * Catalogo, lingua e audio passano nel pannello #nav-menu che si apre da lì.
 * Il pannello si chiude toccando fuori, con Esc, cambiando canale o aprendo il catalogo;
 * lingua e audio invece lo lasciano aperto, così si vede subito il cambio.
 */
(function () {
  'use strict';

  const btn = document.getElementById('nav-menu-toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  const phone = window.matchMedia('(max-width: 760px)');
  const say = (it) => (window.i18n ? window.i18n.t(it) : it);
  let open = false;

  function label() {
    btn.setAttribute('aria-label', say(open ? 'Chiudi il menu' : 'Apri il menu'));
  }

  function set(next) {
    if (next === open) return;
    open = next;
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-menu-open', open);
    label();
    if (window.audioEngine && window.audioEngine.playBeep) {
      window.audioEngine.playBeep(open ? 660 : 440, 0.04, 'triangle');
    }
    if (open) {
      const first = menu.querySelector('button, a');
      if (first) first.focus({ preventScroll: true });
    }
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    set(!open);
  });

  // fuori dal pannello: si chiude
  document.addEventListener('pointerdown', (e) => {
    if (open && !menu.contains(e.target) && !btn.contains(e.target)) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) { set(false); btn.focus(); }
  });

  // il catalogo apre una schermata intera: il menu si chiude
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-catalog]')) set(false);
  });
  document.querySelectorAll('.channel-tab').forEach((t) => t.addEventListener('click', () => set(false)));

  // tornando su schermo largo il pannello non deve restare "aperto"
  const onChange = () => { if (!phone.matches) set(false); };
  if (phone.addEventListener) phone.addEventListener('change', onChange);
  else if (phone.addListener) phone.addListener(onChange);

  window.addEventListener('dj-lang', label);
  label();

  window.navMenu = { open: () => set(true), close: () => set(false), get isOpen() { return open; } };
})();
