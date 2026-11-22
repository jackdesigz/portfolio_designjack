/**
 * designjack — Music player (in alto a destra)
 * Un disco con la copertina gira incastrato nel bordo destro dello schermo;
 * in hover esce un po' e compaiono i comandi (play/pausa, brani, volume).
 * I singoli sono di Ikigai, con grafiche di designjack (cartella Musica/).
 *
 * - La musica parte appena entri, a volume basso (DEFAULT_VOLUME) e con dissolvenza.
 *   Se il browser blocca l'audio prima di un'interazione (Chrome/Safari di solito lo
 *   fanno), il brano parte in muto (il disco gira) e il suono arriva in dissolvenza
 *   al primo clic, tasto o tocco. AUTOSTART = false per disattivare.
 * - Il pannello si vede solo in hover: dopo un clic il focus viene tolto ai comandi,
 *   così il player non resta aperto. Da tastiera resta aperto finché il focus è dentro.
 * - Il file audio si scarica solo quando serve (preload="none").
 */
(function () {
  'use strict';

  const AUTOSTART = true;
  const DEFAULT_VOLUME = 0.22;
  const DIR = 'Musica/Yugen%3Akokotsu/';
  // nomi dei file esattamente come sono su disco ("Yūgen" è salvato in forma decomposta)
  const TRACKS = [
    { title: 'Yūgen (幽玄)', file: 'Yūgen (幽玄).mp3' },
    { title: 'Kōkotsu (恍惚)', file: 'Kōkotsu (恍惚).mp3' }
  ];
  const STORE = 'dj-music';

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function writeStore(patch) {
    try { localStorage.setItem(STORE, JSON.stringify(Object.assign(readStore(), patch))); } catch (e) { /* niente */ }
  }

  function init() {
    const root = document.getElementById('music-player');
    if (!root) return;

    const $ = (id) => document.getElementById(id);
    const disc = $('mp-disc');
    const playBtn = $('mp-play');
    const muteBtn = $('mp-mute');
    const volume = $('mp-volume');
    const titleEl = $('mp-title');
    const indexEl = $('mp-index');
    const progress = $('mp-progress');
    const fill = $('mp-progress-fill');

    const saved = readStore();
    const audio = new Audio();
    audio.preload = 'none';
    let index = Number.isInteger(saved.track) && saved.track < TRACKS.length ? saved.track : 0;
    let loaded = -1;
    let fadeRaf = 0;

    let swallowToggle = false;
    // il volume scelto resta; muto e pausa delle visite precedenti no: si riparte sempre
    audio.volume = typeof saved.volume === 'number' ? saved.volume : DEFAULT_VOLUME;
    volume.value = audio.volume;

    function setTrack(i) {
      index = (i + TRACKS.length) % TRACKS.length;
      titleEl.textContent = TRACKS[index].title;
      indexEl.textContent = `${index + 1}/${TRACKS.length}`;
      fill.style.transform = 'scaleX(0)';
      writeStore({ track: index });
    }

    function load() {
      if (loaded === index) return;
      audio.src = DIR + encodeURIComponent(TRACKS[index].file);
      loaded = index;
    }

    function syncUI() {
      const playing = !audio.paused;
      root.classList.toggle('is-playing', playing);
      playBtn.setAttribute('aria-label', playing ? 'Metti in pausa' : 'Riproduci');
      const silent = audio.muted || audio.volume === 0;
      root.classList.toggle('is-muted', silent);
      muteBtn.setAttribute('aria-label', silent ? 'Riattiva audio della musica' : 'Disattiva audio della musica');
      volume.style.setProperty('--vol', `${(audio.muted ? 0 : audio.volume) * 100}%`);
    }

    // breve dissolvenza in entrata, per non spaventare nessuno
    function fadeIn(target) {
      cancelAnimationFrame(fadeRaf);
      const start = performance.now();
      audio.volume = 0;
      const step = (t) => {
        // il tempo del frame può essere di poco precedente a start: senza il max il volume
        // diventava negativo, il browser lanciava un errore e la musica restava muta
        const k = Math.max(0, Math.min(1, (t - start) / 1200));
        audio.volume = target * k;
        if (k < 1) fadeRaf = requestAnimationFrame(step);
      };
      fadeRaf = requestAnimationFrame(step);
    }

    function play(fade) {
      load();
      const target = Number(volume.value);
      const p = audio.play();
      if (fade) fadeIn(target);
      if (p && p.catch) p.catch(() => syncUI());
    }

    function pause() {
      cancelAnimationFrame(fadeRaf);
      audio.volume = Number(volume.value);
      audio.pause();
    }

    function toggle() {
      // il clic che ha appena acceso l'audio non deve anche metterlo in pausa
      if (swallowToggle) { swallowToggle = false; return; }
      if (audio.paused) {
        play(false);
      } else {
        pause();
      }
    }

    function skip(dir) {
      const wasPlaying = !audio.paused;
      setTrack(index + dir);
      load();
      if (wasPlaying) play(false);
    }

    playBtn.addEventListener('click', toggle);
    $('mp-prev').addEventListener('click', () => {
      // come i lettori veri: se il brano è già avanti, "indietro" lo riavvolge
      if (audio.currentTime > 3) audio.currentTime = 0;
      else skip(-1);
    });
    $('mp-next').addEventListener('click', () => skip(1));

    // sui dispositivi senza hover il primo tocco apre il pannello, il disco poi fa play/pausa
    const noHover = window.matchMedia('(hover: none)');
    disc.addEventListener('click', () => {
      if (noHover.matches && !root.classList.contains('is-open')) {
        root.classList.add('is-open');
        return;
      }
      toggle();
    });
    document.addEventListener('pointerdown', (e) => {
      if (!root.contains(e.target)) root.classList.remove('is-open');
    });
    // col mouse il focus non deve tenere aperto il pannello: si chiude appena esci
    root.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') return;
      const a = document.activeElement;
      if (a && root.contains(a) && a.blur) a.blur();
    });

    muteBtn.addEventListener('click', () => {
      if (audio.volume === 0) {
        audio.volume = DEFAULT_VOLUME;
        volume.value = DEFAULT_VOLUME;
        audio.muted = false;
      } else {
        audio.muted = !audio.muted;
      }
      writeStore({ muted: audio.muted, volume: audio.volume });
    });
    volume.addEventListener('input', () => {
      cancelAnimationFrame(fadeRaf);
      audio.volume = Number(volume.value);
      if (audio.volume > 0) audio.muted = false;
      writeStore({ volume: audio.volume, muted: audio.muted });
    });

    // barra di avanzamento: clic o frecce per spostarsi
    function seekTo(ratio) {
      if (!audio.duration) return;
      audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    }
    progress.addEventListener('click', (e) => {
      const r = progress.getBoundingClientRect();
      seekTo((e.clientX - r.left) / r.width);
    });
    progress.addEventListener('keydown', (e) => {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
    });
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const k = audio.currentTime / audio.duration;
      fill.style.transform = `scaleX(${k})`;
      progress.setAttribute('aria-valuenow', String(Math.round(k * 100)));
    });

    audio.addEventListener('ended', () => { setTrack(index + 1); play(false); });

    // ---------- note che escono dal disco mentre la musica si sente ----------
    // così chi scorre il sito capisce da dove arriva il suono. Stile per canale (CSS).
    const notesBox = document.getElementById('mp-notes');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const GLYPHS = {
      // R: teste quadrate, bandierine geometriche (Bauhaus)
      r: [
        'M12 3h2v4.5l5 2.5v3l-5-2.5V20H8v-5h4z',
        'M8 6l12-3v17h-6v-5h4V8.2L10 10.2V20H4v-5h4z'
      ],
      // G e B: note tonde
      round: [
        'M12 3h2c.3 2.6 2.4 3.8 4.2 5.4 1.6 1.4 1.7 3.6.6 5.2.3-2.3-1.5-3.9-4.8-4.6v8.5c0 2.2-2.3 3.8-4.7 3.5-2.2-.3-3.5-2-2.8-3.7.7-1.8 3.1-2.9 5.5-2.3z',
        'M8 6.5l11.6-3v12.6c0 1.9-2 3.3-4 3.1-1.9-.2-3-1.6-2.4-3.1.6-1.5 2.6-2.5 4.8-2.1V8.6l-8.4 2.2v7.3c0 1.9-2 3.3-4 3.1-1.9-.2-3-1.6-2.4-3.1.6-1.5 2.6-2.5 4.8-2.1z'
      ]
    };
    const MAX_NOTES = 7;
    let alive = 0;
    let noteTimer = 0;

    function currentChannel() {
      const c = document.body.classList;
      return c.contains('channel-g-active') ? 'g' : c.contains('channel-b-active') ? 'b' : 'r';
    }

    function spawnNote() {
      if (!notesBox || audio.paused || audio.muted || audio.volume < 0.02) return;
      if (document.hidden || reduceMotion.matches || alive >= MAX_NOTES) return;
      const ch = currentChannel();
      const set = ch === 'r' ? GLYPHS.r : GLYPHS.round;
      const el = document.createElement('span');
      el.className = 'mp-note';
      el.dataset.v = String(Math.floor(Math.random() * 3));
      el.innerHTML = `<svg viewBox="0 0 24 24"><path d="${set[Math.random() < 0.6 ? 0 : 1]}"/></svg>`;
      // verso sinistra, un po' su o giù (sopra c'è la barra); in B salgono come bolle
      const dx = -(60 + Math.random() * 90);
      const dy = ch === 'b' ? -(10 + Math.random() * 40) : -40 + Math.random() * 75;
      const size = ch === 'b' ? 26 + Math.random() * 10 : 19 + Math.random() * 10;
      el.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      el.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      el.style.setProperty('--r', `${(-35 + Math.random() * 70).toFixed(0)}deg`);
      el.style.setProperty('--s', `${size.toFixed(0)}px`);
      let gone = false;
      const remove = () => {
        if (gone) return;
        gone = true;
        el.remove();
        alive -= 1;
      };
      el.addEventListener('animationend', remove, { once: true });
      setTimeout(remove, 4000); // nel caso l'animazione non parta
      notesBox.appendChild(el);
      alive += 1;
    }

    function scheduleNotes() {
      clearTimeout(noteTimer);
      if (audio.paused) return;
      spawnNote();
      noteTimer = setTimeout(scheduleNotes, 480 + Math.random() * 520);
    }
    audio.addEventListener('playing', scheduleNotes);
    audio.addEventListener('pause', () => clearTimeout(noteTimer));
    ['play', 'pause', 'volumechange'].forEach((ev) => audio.addEventListener(ev, syncUI));

    // avvio automatico appena entri
    function autostart() {
      const target = Number(volume.value);
      load();
      audio.volume = 0;
      const p = audio.play();
      if (!p || !p.then) { fadeIn(target); return; }
      p.then(() => fadeIn(target)).catch(() => {
        // audio bloccato dal browser: parte in muto (il disco gira), il suono arriva al primo gesto
        audio.muted = true;
        audio.volume = target;
        audio.play().catch(() => {});
        waitForGesture();
      });
    }
    function waitForGesture() {
      const events = ['pointerdown', 'keydown', 'touchend'];
      const kick = (e) => {
        events.forEach((ev) => document.removeEventListener(ev, kick, true));
        if (window.audioEngine && window.audioEngine.muted) return;
        const t = e.target && e.target.closest ? e.target : null;
        // muto e volume decidono da soli
        if (t && t.closest('#mp-mute, #mp-volume')) return;
        if (t && t.closest('#mp-play, #mp-disc')) {
          swallowToggle = true;
          setTimeout(() => { swallowToggle = false; }, 800);
        }
        audio.muted = false;
        if (audio.paused) load();
        audio.play().catch(() => {});
        fadeIn(Number(volume.value));
      };
      events.forEach((ev) => document.addEventListener(ev, kick, true));
    }

    setTrack(index);
    syncUI();
    if (AUTOSTART) autostart();
    // playTrack: le pagine dei progetti (es. la collaborazione con Ikigai) fanno partire un brano preciso
    const playTrack = (i) => {
      if (i !== index) { setTrack(i); load(); }
      play(false);
    };
    window.musicPlayer = {
      audio, play: () => play(false), pause, toggle, next: () => skip(1), prev: () => skip(-1),
      playTrack, current: () => index, tracks: TRACKS.map((t) => t.title)
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
