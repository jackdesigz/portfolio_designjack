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
    const phases = g.phases || [];
    const punk = g.punk || [];
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
              ${fig('render-2.jpg', 'Il nuovo ciondolo: l’uovo spaccato al posto del globo', 'is-term is-result')}
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
              ${renders.map((r, i) => `<figure class="bw-render-img${i === 0 ? ' is-active' : ''}" ${zoom(B + r.src, r.cap)}><img src="${B}${r.src}" alt="${esc(r.cap)}" loading="lazy" /></figure>`).join('')}
              <span class="bw-render-cap">${esc(renders[0] ? renders[0].cap : '')}</span>
            </div>
            <div class="bw-render-thumbs" role="tablist" aria-label="Viste del ciondolo">
              ${renders.map((r, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}${r.blender ? ' is-blender' : ''}" data-i="${i}"><img src="${B}${r.src}" alt="" loading="lazy" /><span>${esc(r.label)}</span></button>`).join('')}
            </div>
          </div>
        </section>

        <!-- 03 L'ARMOR RING: il Giardino delle delizie dall'alto verso il basso -->
        <section class="bw-sec bw-ring-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">Armor<br>Ring</h3>
            <span class="bw-rule" aria-hidden="true"></span>
          </header>
          <p class="bw-text" data-reveal>${g.ringText || ''}</p>
          <div class="bw-ring" data-reveal>
            <div class="bw-triptych" style="background-image:url('${B}giardino-trittico.jpg');" data-r="0">
              ${realms.map((r, i) => `<button type="button" class="bw-realm${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="${esc(r.name)}"><span>${esc(r.name)}</span></button>`).join('')}
            </div>
            <div class="bw-ring-side">
              <div class="bw-ring-obj">
                <img src="${B}anello.png" alt="L’Armor Ring con il Giardino delle delizie, dall’alto verso il basso" loading="lazy" />
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

        <!-- 04 DA DOVE NASCE: i due autori, in breve -->
        <section class="bw-sec bw-roots-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">Da dove<br>nasce</h3>
            <span class="bw-rule" aria-hidden="true"></span>
            <p class="bw-page">Storia dell’arte moderna</p>
          </header>
          <p class="bw-text" data-reveal>${g.rootsText || ''}</p>
        </section>

        <!-- 04a BOSCH: il creatore di diavoli e le sue tre fasi -->
        <section class="bw-sec bw-bosch-sec">
          <header class="bw-head" data-reveal>
            <h3 class="bw-h">Hieronymus<br>Bosch</h3>
            <span class="bw-rule" aria-hidden="true"></span>
            <p class="bw-page">${esc(g.boschQuote || '')}</p>
          </header>
          <div class="bw-intro">
            <figure class="bw-fig bw-portrait" data-reveal ${zoom(B + 'bosch-ritratto.jpg', 'Ritratto di Hieronymus Bosch')}>
              <img src="${B}bosch-ritratto.jpg" alt="Ritratto di Hieronymus Bosch, incisione" loading="lazy" />
            </figure>
            <div class="bw-intro-text" data-reveal style="--i:1;">
              ${(g.boschText || []).map((t) => `<p>${t}</p>`).join('')}
            </div>
          </div>
          <div class="bw-phases" data-reveal>
            <div class="bw-phase-tabs" role="tablist" aria-label="Le fasi di Bosch">
              ${phases.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}" data-i="${i}"><span>${pad(i + 1)}</span>${esc(p.title)}</button>`).join('')}
            </div>
            ${phases.map((p, i) => `
              <div class="bw-phase${i === 0 ? ' is-active' : ''}" role="tabpanel">
                <div class="bw-phase-copy">
                  <h4>${esc(p.title)}</h4>
                  <p class="bw-phase-sub">${esc(p.sub)}</p>
                  <p>${p.text}</p>
                </div>
                <div class="bw-phase-works">${(p.works || []).map((w) => fig(w.src, w.cap)).join('')}</div>
              </div>`).join('')}
          </div>
        </section>

        <!-- 04b VIVIENNE WESTWOOD: dal punk all'Orb -->
        <section class="bw-sec bw-vw-sec">
          <header class="bw-head is-vw" data-reveal>
            <img class="bw-vw-logo" src="${B}westwood-logo.png" alt="Vivienne Westwood" loading="lazy" />
            <span class="bw-rule" aria-hidden="true"></span>
            <p class="bw-page">la moda e il punk</p>
          </header>
          <ol class="bw-timeline" data-reveal>
            ${punk.map((p, i) => `
              <li class="${i === 0 ? 'is-active' : ''}">
                <button type="button" data-i="${i}"><b>${esc(p.year)}</b><span>${esc(p.title)}</span></button>
              </li>`).join('')}
          </ol>
          <div class="bw-vw" data-reveal>
            <div class="bw-vw-copy" aria-live="polite">
              <p class="bw-vw-year">${esc(punk[0] ? punk[0].year : '')}</p>
              <h4 class="bw-vw-title">${esc(punk[0] ? punk[0].title : '')}</h4>
              <p class="bw-vw-text">${punk[0] ? punk[0].text : ''}</p>
            </div>
            <div class="bw-vw-imgs">
              ${punk.map((p, i) => `<figure class="bw-fig bw-vw-img${i === 0 ? ' is-active' : ''}" ${zoom(B + p.src, p.cap)}><img src="${B}${p.src}" alt="${esc(p.cap)}" loading="lazy" /><figcaption>${esc(p.cap)}</figcaption></figure>`).join('')}
            </div>
          </div>
        </section>

        <footer class="bw-sec bw-refs" data-reveal>
          <h4>Sitografia</h4>
          <ul>${(g.refs || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        </footer>
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

    // ---- le fasi di Bosch
    const phTabs = Array.from(root.querySelectorAll('.bw-phase-tabs button'));
    const phPanels = Array.from(root.querySelectorAll('.bw-phase'));
    phTabs.forEach((b, i) => b.addEventListener('click', () => {
      phTabs.forEach((x, k) => { x.classList.toggle('is-active', k === i); x.setAttribute('aria-selected', String(k === i)); });
      phPanels.forEach((p, k) => p.classList.toggle('is-active', k === i));
    }));

    // ---- Westwood: la linea del tempo
    const tl = Array.from(root.querySelectorAll('.bw-timeline li'));
    const vwImgs = Array.from(root.querySelectorAll('.bw-vw-img'));
    const vYear = root.querySelector('.bw-vw-year');
    const vTitle = root.querySelector('.bw-vw-title');
    const vText = root.querySelector('.bw-vw-text');
    tl.forEach((li, i) => li.querySelector('button').addEventListener('click', () => {
      const p = punk[i];
      tl.forEach((x, k) => x.classList.toggle('is-active', k === i));
      vwImgs.forEach((x, k) => x.classList.toggle('is-active', k === i));
      vYear.textContent = p.year;
      vTitle.textContent = p.title;
      vText.innerHTML = p.text;
    }));

    // ---- render: le viste del ciondolo
    const rThumbs = Array.from(root.querySelectorAll('.bw-render-thumbs button'));
    const rImgs = Array.from(root.querySelectorAll('.bw-render-img'));
    const rCap = root.querySelector('.bw-render-cap');
    rThumbs.forEach((b, i) => b.addEventListener('click', () => {
      rThumbs.forEach((x, k) => { x.classList.toggle('is-active', k === i); x.setAttribute('aria-selected', String(k === i)); });
      rImgs.forEach((x, k) => x.classList.toggle('is-active', k === i));
      rCap.textContent = renders[i].cap;
    }));

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
