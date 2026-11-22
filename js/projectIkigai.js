/**
 * designjack — Layout dedicato a Ikigai × designjack (Collaborations)
 * window.PROJECT_LAYOUTS.ikigai → copertina e Canvas per Spotify dei singoli Yūgen e Kōkotsu.
 * La musica è la stessa del player del sito (js/musicPlayer.js): i pulsanti di questa
 * pagina lo comandano con window.musicPlayer.playTrack(i), così non partono due audio insieme.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const KIT = window.ProjectKit || {};
  const esc = KIT.esc || ((s) => String(s == null ? '' : s));
  const zoom = KIT.zoom || (() => '');
  const setupReveal = KIT.setupReveal || (() => () => {});
  const reduceMotion = KIT.reduceMotion || (() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const fmt = (s) => {
    if (!Number.isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  LAYOUTS.ikigai = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const tracks = g.tracks || [];
    const spots = g.spots || [];
    const cleanups = [];

    container.innerHTML = `
      <div class="ik">

        <!-- APERTURA: la copertina si inclina seguendo il puntatore, dietro fluttuano forme cromate -->
        <section class="ik-hero">
          <div class="ik-blobs" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="ik-peaks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <div class="ik-hero-copy">
            <p class="ik-kicker" data-reveal>${esc(g.kicker || '')}</p>
            <h3 class="ik-title" data-reveal style="--i:1;">
              ${tracks.map((t) => `<span class="ik-title-row"><b>${esc(t.title)}</b><em lang="ja">${esc(t.kanji)}</em></span>`).join('')}
            </h3>
            <p class="ik-lead" data-reveal style="--i:2;">${g.lead || ''}</p>
            <p class="ik-credit" data-reveal style="--i:3;">${esc(g.credit || '')}</p>
          </div>
          <div class="ik-cover-wrap" data-reveal style="--i:1;">
            <figure class="ik-cover" ${zoom(B + 'cover.jpg', 'Yūgen / Kōkotsu — la copertina')}>
              <img src="${B}cover.jpg" alt="La copertina: un personaggio low-poly con un mantello a pixel in un deserto rosso, sotto nuvole di cromo liquido" />
              <span class="ik-sheen" aria-hidden="true"></span>
            </figure>
          </div>
        </section>

        <!-- 01 ASCOLTA: il Canvas di Spotify in un telefono; il play comanda il player del sito -->
        <section class="ik-sec ik-listen-sec">
          <header class="ik-head" data-reveal><span class="ik-num">01</span><h3 class="ik-h">${esc(g.listenTitle || 'Ascolta')}</h3></header>
          <div class="ik-listen">
            <div class="ik-phone" data-reveal>
              <video class="ik-canvas" src="${B}canvas.mp4" poster="${B}canvas-poster.jpg" muted loop playsinline preload="metadata" aria-label="Il Canvas per Spotify: la camera gira piano attorno al personaggio"></video>
              <div class="ik-ui">
                <p class="ik-ui-top"><span>${esc(g.artist || 'Ikigai')}</span></p>
                <div class="ik-ui-bottom">
                  <p class="ik-ui-title"><b class="ik-now">${esc(tracks[0] ? tracks[0].title : '')}</b><span>${esc(g.artist || 'Ikigai')}</span></p>
                  <div class="ik-ui-bar"><i class="ik-ui-fill"></i></div>
                  <p class="ik-ui-time"><span class="ik-t-cur">0:00</span><span class="ik-t-dur">0:00</span></p>
                  <div class="ik-ui-ctrl">
                    <button type="button" class="ik-ctrl ik-prev" aria-label="Brano precedente">⏮</button>
                    <button type="button" class="ik-ctrl ik-play" aria-label="Riproduci">▶</button>
                    <button type="button" class="ik-ctrl ik-next" aria-label="Brano successivo">⏭</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="ik-listen-copy" data-reveal style="--i:1;">
              <p class="ik-text">${g.listenText || ''}</p>
              <div class="ik-tracks">
                ${tracks.map((t, i) => `
                  <button type="button" class="ik-track" data-i="${i}">
                    <span class="ik-track-kanji" lang="ja" aria-hidden="true">${esc(t.kanji)}</span>
                    <span class="ik-track-name"><b>${esc(t.title)}</b><small>${esc(t.reading || '')}</small></span>
                    <span class="ik-track-state" aria-hidden="true">▶</span>
                  </button>`).join('')}
              </div>
              <p class="ik-note">${esc(g.listenNote || '')}</p>
            </div>
          </div>
        </section>

        <!-- 02 LA COPERTINA: punti da toccare sull'immagine -->
        <section class="ik-sec ik-cover-sec">
          <header class="ik-head" data-reveal><span class="ik-num">02</span><h3 class="ik-h">${esc(g.coverTitle || 'La copertina')}</h3></header>
          <div class="ik-spots">
            <div class="ik-spots-img" data-reveal>
              <img src="${B}cover.jpg" alt="La copertina, con i punti da esplorare" loading="lazy" />
              ${spots.map((s, i) => `<button type="button" class="ik-spot${i === 0 ? ' is-active' : ''}" style="left:${s.x}%; top:${s.y}%;" data-i="${i}" aria-label="${esc(s.title)}"><span>${i + 1}</span></button>`).join('')}
            </div>
            <div class="ik-spots-copy" data-reveal style="--i:1;" aria-live="polite">
              <p class="ik-spot-n">01 / ${String(spots.length).padStart(2, '0')}</p>
              <h4 class="ik-spot-title">${esc(spots[0] ? spots[0].title : '')}</h4>
              <p class="ik-spot-text">${spots[0] ? spots[0].text : ''}</p>
            </div>
          </div>
        </section>

        <!-- 03 DUE PAROLE: i titoli sono parole giapponesi -->
        <section class="ik-sec ik-words-sec">
          <header class="ik-head" data-reveal><span class="ik-num">03</span><h3 class="ik-h">${esc(g.wordsTitle || 'Due parole')}</h3></header>
          <div class="ik-words">
            ${tracks.map((t, i) => `
              <article class="ik-word" data-reveal style="--i:${i};">
                <p class="ik-word-kanji" lang="ja">${esc(t.kanji)}</p>
                <h4>${esc(t.title)} <small>${esc(t.reading || '')}</small></h4>
                <p>${t.meaning || ''}</p>
                <button type="button" class="ik-word-play" data-i="${i}">▶ Ascolta ${esc(t.title)}</button>
              </article>`).join('')}
          </div>
        </section>
      </div>
    `;

    const root = container.querySelector('.ik');

    // ---- apertura: la copertina si inclina verso il puntatore
    const hero = root.querySelector('.ik-hero');
    const cover = root.querySelector('.ik-cover');
    if (!reduceMotion()) {
      let raf = 0;
      let ev = null;
      const tilt = () => {
        raf = 0;
        if (!ev) { cover.style.transform = ''; return; }
        const r = cover.getBoundingClientRect();
        const x = (ev.clientX - (r.left + r.width / 2)) / r.width;
        const y = (ev.clientY - (r.top + r.height / 2)) / r.height;
        cover.style.transform = `rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 14).toFixed(2)}deg)`;
        cover.style.setProperty('--sx', `${(50 + x * 60).toFixed(1)}%`);
        cover.style.setProperty('--sy', `${(50 + y * 60).toFixed(1)}%`);
      };
      hero.addEventListener('pointermove', (e) => { ev = e; if (!raf) raf = requestAnimationFrame(tilt); });
      hero.addEventListener('pointerleave', () => { ev = null; if (!raf) raf = requestAnimationFrame(tilt); });
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    // ---- ascolta: il telefono comanda il player del sito
    const video = root.querySelector('.ik-canvas');
    const playBtn = root.querySelector('.ik-play');
    const nowEl = root.querySelector('.ik-now');
    const fill = root.querySelector('.ik-ui-fill');
    const tCur = root.querySelector('.ik-t-cur');
    const tDur = root.querySelector('.ik-t-dur');
    const trackBtns = Array.from(root.querySelectorAll('.ik-track'));
    const mp = () => window.musicPlayer || null;
    const sync = () => {
      const p = mp();
      if (!p || !p.audio) return;
      const a = p.audio;
      const i = typeof p.current === 'function' ? p.current() : 0;
      const playing = !a.paused;
      nowEl.textContent = tracks[i] ? tracks[i].title : '';
      playBtn.textContent = playing ? '⏸' : '▶';
      playBtn.setAttribute('aria-label', playing ? 'Pausa' : 'Riproduci');
      trackBtns.forEach((b, k) => {
        const on = k === i && playing;
        b.classList.toggle('is-playing', on);
        b.querySelector('.ik-track-state').textContent = on ? '⏸' : '▶';
      });
      root.classList.toggle('is-playing', playing);
      const d = a.duration;
      tCur.textContent = fmt(a.currentTime);
      tDur.textContent = fmt(d);
      fill.style.transform = `scaleX(${d ? (a.currentTime / d).toFixed(4) : 0})`;
    };
    const playIndex = (i) => {
      const p = mp();
      if (!p) return;
      const cur = typeof p.current === 'function' ? p.current() : -1;
      if (cur === i && p.audio && !p.audio.paused) { p.pause(); return; }
      if (typeof p.playTrack === 'function') p.playTrack(i);
      else p.play();
    };
    playBtn.addEventListener('click', () => {
      const p = mp();
      if (p) p.toggle();
    });
    root.querySelector('.ik-prev').addEventListener('click', () => { const p = mp(); if (p) p.prev(); });
    root.querySelector('.ik-next').addEventListener('click', () => { const p = mp(); if (p) p.next(); });
    trackBtns.forEach((b) => b.addEventListener('click', () => playIndex(Number(b.dataset.i))));
    root.querySelectorAll('.ik-word-play').forEach((b) => b.addEventListener('click', () => {
      playIndex(Number(b.dataset.i));
      const sec = root.querySelector('.ik-listen-sec');
      const card = container.closest('.project-modal-card');
      if (card && sec) {
        const top = sec.getBoundingClientRect().top - card.getBoundingClientRect().top + card.scrollTop - 20;
        card.scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
    }));
    const audio = mp() && mp().audio;
    if (audio) {
      const evs = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended', 'emptied'];
      evs.forEach((e) => audio.addEventListener(e, sync));
      cleanups.push(() => evs.forEach((e) => audio.removeEventListener(e, sync)));
      sync();
    } else {
      root.classList.add('no-player');
    }
    // il video gira solo quando il telefono è a schermo (e mai con le animazioni ridotte)
    if (!reduceMotion()) {
      const card = container.closest('.project-modal-card');
      const check = () => {
        const r = video.getBoundingClientRect();
        const vh = window.innerHeight;
        const on = r.bottom > 0 && r.top < vh;
        if (on && video.paused) { const pr = video.play(); if (pr && pr.catch) pr.catch(() => {}); }
        if (!on && !video.paused) video.pause();
      };
      const onScroll = () => requestAnimationFrame(check);
      (card || window).addEventListener('scroll', onScroll, { passive: true });
      const t = setTimeout(check, 400);
      cleanups.push(() => { (card || window).removeEventListener('scroll', onScroll); clearTimeout(t); video.pause(); });
    } else {
      video.controls = true;
      cleanups.push(() => video.pause());
    }

    // ---- copertina: punti
    const spotBtns = Array.from(root.querySelectorAll('.ik-spot'));
    const spotN = root.querySelector('.ik-spot-n');
    const spotTitle = root.querySelector('.ik-spot-title');
    const spotText = root.querySelector('.ik-spot-text');
    const showSpot = (i) => {
      const s = spots[i];
      spotBtns.forEach((b, k) => b.classList.toggle('is-active', k === i));
      spotN.textContent = `${String(i + 1).padStart(2, '0')} / ${String(spots.length).padStart(2, '0')}`;
      spotTitle.textContent = s.title;
      spotText.innerHTML = s.text;
    };
    spotBtns.forEach((b, i) => {
      b.addEventListener('click', () => showSpot(i));
      b.addEventListener('pointerenter', () => showSpot(i));
    });

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };
})();
