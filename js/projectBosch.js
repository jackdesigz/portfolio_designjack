/**
 * designjack — Layout dedicato a Hieronymus Bosch × Vivienne Westwood (Graphic Design)
 * window.PROJECT_LAYOUTS.bosch → progetto d'esame di Storia dell'arte moderna:
 * prima la mia produzione (il concept, il ciondolo Orb con l'uovo spaccato modellato e
 * renderizzato in Blender, l'Armor Ring), poi in breve da dove nasce: Bosch e Westwood.
 * Stile della presentazione: grigio caldo e avorio, titoli sottili ad alto contrasto
 * (Italiana al posto di DreamAvenue), testi in Poppins.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const KIT = window.ProjectKit || {};
  const esc = KIT.esc || ((s) => String(s == null ? '' : s));
  const zoom = KIT.zoom || (() => '');
  const setupReveal = KIT.setupReveal || (() => () => {});
  const reduceMotion = KIT.reduceMotion || (() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pad = (n) => String(n).padStart(2, '0');

  LAYOUTS.bosch = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const renders = g.renders || [];
    const realms = g.realms || [];
    const cleanups = [];
    const fig = (src, cap, cls = '') => `
      <figure class="bw-fig ${cls}" ${zoom(B + src, cap)}>
        <img src="${B}${src}" alt="${esc(cap)}" loading="lazy" />
        <figcaption>${esc(cap)}</figcaption>
      </figure>`;

    container.innerHTML = `
      <div class="bw">

        <!-- APERTURA: il ciondolo renderizzato in Blender, a tutta pagina -->
        <section class="bw-hero">
          <div class="bw-hero-render" aria-hidden="true" style="background-image:url('${B}render-1.jpg');"></div>
          <div class="bw-hero-card" data-reveal>
            <h3 class="bw-hero-title">
              <span class="bw-hero-bosch">Hieronymus<br>Bosch</span>
              <span class="bw-x" aria-hidden="true">×</span>
              <img class="bw-hero-vw" src="${B}westwood-logo.png" alt="Vivienne Westwood" />
            </h3>
            <p class="bw-hero-sub">${esc(g.kicker || '')}</p>
          </div>
          <p class="bw-hint" aria-hidden="true">${esc(g.heroNote || '')}</p>
        </section>

        <!-- 01 L'IDEA: l'Orb più l'uovo di Bosch -->
        <section class="bw-sec bw-idea-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">L’idea</h3>
            <span class="bw-rule" aria-hidden="true"></span>
            <p class="bw-page">@jacopo.febi</p>
          </header>
          <div class="bw-idea">
            <div class="bw-idea-text" data-reveal>${(g.ideaText || []).map((t) => `<p>${t}</p>`).join('')}</div>
            <div class="bw-equation" data-reveal style="--i:1;">
              ${fig('orb.jpg', 'The Orb, il simbolo di Vivienne Westwood', 'is-term')}
              <span class="bw-op" aria-hidden="true">+</span>
              ${fig('uovo-bosch.jpg', 'L’uomo-albero con l’uovo spaccato, dal Giardino delle delizie', 'is-term')}
              <span class="bw-op" aria-hidden="true">=</span>
              ${fig('render-1.jpg', 'Il nuovo ciondolo: l’uovo spaccato al posto del globo', 'is-term is-result')}
            </div>
          </div>
        </section>

        <!-- 02 IL CIONDOLO IN 3D: modellato e renderizzato in Blender -->
        <section class="bw-sec bw-3d-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">Il ciondolo<br>in 3D</h3>
            <span class="bw-rule" aria-hidden="true"></span>
            <p class="bw-page bw-blender-tag">Blender</p>
          </header>
          <p class="bw-text" data-reveal>${g.renderText || ''}</p>
          <div class="bw-render" data-reveal>
            <div class="bw-render-stage">
              ${renders.map((r, i) => `<figure class="bw-render-img${i === renders.length - 1 ? ' is-active' : ''}" ${zoom(B + r.src, r.cap)}><img src="${B}${r.src}" alt="${esc(r.cap)}" loading="lazy" /></figure>`).join('')}
              <span class="bw-render-cap"><b class="bw-render-step">${esc(renders.length ? renders[renders.length - 1].label : '')}</b> ${esc(renders.length ? renders[renders.length - 1].cap : '')}</span>
            </div>
            <ol class="bw-steps" aria-label="Dal file Blender al render finale">
              ${renders.map((r, i) => `
                <li class="${i === renders.length - 1 ? 'is-active is-final' : ''}">
                  <button type="button" data-i="${i}" aria-pressed="${i === renders.length - 1}">
                    <img src="${B}${r.src}" alt="" loading="lazy" />
                    <span><b>${String(i + 1).padStart(2, '0')}</b> ${esc(r.label)}</span>
                  </button>
                </li>`).join('')}
            </ol>
            <button type="button" class="bw-play">▶ Guarda il processo</button>
          </div>
        </section>

        <!-- 03 L'ARMOR RING: il Giardino delle delizie dall'alto verso il basso -->
        <section class="bw-sec bw-ring-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">Armor<br>Ring</h3>
            <span class="bw-rule" aria-hidden="true"></span>
          </header>
          <p class="bw-text" data-reveal>${g.ringText || ''}</p>
          <div class="bw-ring" data-reveal data-r="0">
            <div class="bw-ring-obj">
              <img src="${B}anello.png" alt="L’Armor Ring con il Giardino delle delizie, dall’alto verso il basso" loading="lazy" />
            </div>
            <div class="bw-ring-side">
              <div class="bw-triptych" style="background-image:url('${B}giardino-trittico.jpg');" data-r="0">
                ${realms.map((r, i) => `<button type="button" class="bw-realm${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="${esc(r.name)}"><span>${esc(r.name)}</span></button>`).join('')}
              </div>
              <div class="bw-realm-copy" aria-live="polite">
                <p class="bw-realm-n">${pad(1)} / ${pad(realms.length)}</p>
                <h4 class="bw-realm-name">${esc(realms[0] ? realms[0].name : '')}</h4>
                <p class="bw-realm-text">${realms[0] ? realms[0].text : ''}</p>
              </div>
            </div>
          </div>
          <div class="bw-ring-photos">
            ${fig('anello-scatola.jpg', 'Il mockup dell’Armor Ring', '')}
            ${fig('anello-dito.jpg', 'L’Armor Ring originale di Vivienne Westwood', '')}
          </div>
        </section>

        <!-- 04 DA DOVE NASCE: Bosch e Westwood, una pagina per uno -->
        <section class="bw-sec bw-roots-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">Da dove<br>nasce</h3>
            <span class="bw-rule" aria-hidden="true"></span>
            <p class="bw-page">Storia dell’arte moderna</p>
          </header>
          <p class="bw-text" data-reveal>${g.rootsText || ''}</p>
          <div class="bw-diptych">
            ${(g.authors || []).map((a, k) => `
              <article class="bw-author is-${esc(a.key)}" data-reveal style="--i:${k};">
                <header class="bw-author-head">
                  ${a.logo ? `<img class="bw-author-logo" src="${B}${a.logo}" alt="${esc(a.name)}" loading="lazy" />` : `<h4 class="bw-author-name">${a.name}</h4>`}
                  <p class="bw-author-sub">${esc(a.sub)}</p>
                </header>
                <div class="bw-author-main">
                  <figure class="bw-fig bw-author-img" ${zoom(B + a.img.src, a.img.cap)}><img src="${B}${a.img.src}" alt="${esc(a.img.cap)}" loading="lazy" /></figure>
                  <div class="bw-author-copy">
                    <p>${a.text}</p>
                    <ul class="bw-author-points">${(a.points || []).map((pt) => `<li>${pt}</li>`).join('')}</ul>
                  </div>
                </div>
                <div class="bw-author-works">
                  ${(a.works || []).map((w) => `<figure class="bw-fig" ${zoom(B + w.src, w.cap)}><img src="${B}${w.src}" alt="${esc(w.cap)}" loading="lazy" /><figcaption>${esc(w.cap)}</figcaption></figure>`).join('')}
                </div>
              </article>`).join('<span class="bw-diptych-x" aria-hidden="true">×</span>')}
          </div>
        </section>

      </div>
    `;

    const root = container.querySelector('.bw');

    // ---- apertura: il render si sposta appena seguendo il puntatore
    const hero = root.querySelector('.bw-hero');
    const render = root.querySelector('.bw-hero-render');
    let hRaf = 0;
    let hEv = null;
    const drift = () => {
      hRaf = 0;
      if (!hEv) { render.style.transform = ''; return; }
      const r = hero.getBoundingClientRect();
      const x = (hEv.clientX - r.left) / r.width - 0.5;
      const y = (hEv.clientY - r.top) / r.height - 0.5;
      render.style.transform = `scale(1.08) translate(${(-x * 3).toFixed(2)}%, ${(-y * 3).toFixed(2)}%)`;
    };
    if (!reduceMotion()) {
      hero.addEventListener('pointermove', (e) => { hEv = e; if (!hRaf) hRaf = requestAnimationFrame(drift); });
      hero.addEventListener('pointerleave', () => { hEv = null; if (!hRaf) hRaf = requestAnimationFrame(drift); });
    }
    cleanups.push(() => cancelAnimationFrame(hRaf));

    // ---- render: i passi dal file Blender al render finale; "Guarda il processo" li scorre da solo
    const steps = Array.from(root.querySelectorAll('.bw-steps li'));
    const rImgs = Array.from(root.querySelectorAll('.bw-render-img'));
    const rCap = root.querySelector('.bw-render-cap');
    const playBtn = root.querySelector('.bw-play');
    let playT = 0;
    const showStep = (i) => {
      steps.forEach((li, k) => { li.classList.toggle('is-active', k === i); li.classList.toggle('is-done', k < i); li.querySelector('button').setAttribute('aria-pressed', String(k === i)); });
      rImgs.forEach((x, k) => x.classList.toggle('is-active', k === i));
      rCap.innerHTML = `<b class="bw-render-step">${esc(renders[i].label)}</b> ${esc(renders[i].cap)}`;
    };
    const stop = () => { clearTimeout(playT); playT = 0; playBtn.classList.remove('is-on'); playBtn.textContent = '▶ Guarda il processo'; };
    steps.forEach((li, i) => li.querySelector('button').addEventListener('click', () => { stop(); showStep(i); }));
    playBtn.addEventListener('click', () => {
      if (playT) { stop(); return; }
      playBtn.classList.add('is-on');
      playBtn.textContent = '■ Ferma';
      let i = 0;
      const next = () => {
        showStep(i);
        if (i >= renders.length - 1) { playT = 0; playBtn.classList.remove('is-on'); playBtn.textContent = '↻ Rivedi il processo'; return; }
        i += 1;
        playT = setTimeout(next, reduceMotion() ? 600 : 1700);
      };
      next();
    });
    cleanups.push(() => clearTimeout(playT));

    // ---- anello: i tre regni del trittico, dall'alto verso il basso
    const realmBtns = Array.from(root.querySelectorAll('.bw-realm'));
    const trip = root.querySelector('.bw-triptych');
    const ring = root.querySelector('.bw-ring');
    const rN = root.querySelector('.bw-realm-n');
    const rName = root.querySelector('.bw-realm-name');
    const rText = root.querySelector('.bw-realm-text');
    const showRealm = (i) => {
      const r = realms[i];
      realmBtns.forEach((b, k) => b.classList.toggle('is-active', k === i));
      trip.setAttribute('data-r', String(i));
      ring.setAttribute('data-r', String(i));
      rN.textContent = `${pad(i + 1)} / ${pad(realms.length)}`;
      rName.textContent = r.name;
      rText.innerHTML = r.text;
    };
    realmBtns.forEach((b, i) => {
      b.addEventListener('click', () => showRealm(i));
      b.addEventListener('pointerenter', () => showRealm(i));
    });
    showRealm(0);

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };
})();
