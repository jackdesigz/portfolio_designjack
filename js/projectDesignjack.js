/**
 * designjack — Layout dedicato al sito stesso (Web Design)
 * window.PROJECT_LAYOUTS.designjack → come è nato il portfolio: design, cultura visiva e
 * intelligenza artificiale. Il logo cambia stile come nei tre canali, il moodboard si esplora
 * per zone, i tre canali si confrontano (e si possono anche attivare davvero), il processo
 * passo per passo, le parti del sito.
 */
(function () {
  'use strict';

  const LAYOUTS = (window.PROJECT_LAYOUTS = window.PROJECT_LAYOUTS || {});
  const KIT = window.ProjectKit || {};
  const esc = KIT.esc || ((s) => String(s == null ? '' : s));
  const zoom = KIT.zoom || (() => '');
  const setupReveal = KIT.setupReveal || (() => () => {});
  const reduceMotion = KIT.reduceMotion || (() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const CH = ['r', 'g', 'b'];

  const logo = () => `
    <span class="dj-logo" aria-label="designjack">
      <span class="dj-logo-v is-r" aria-hidden="true"><b>design</b><i>jack</i></span>
      <span class="dj-logo-v is-g" aria-hidden="true"><b>design</b><i>jack</i></span>
      <span class="dj-logo-v is-b" aria-hidden="true"><b>design</b><i>jack</i></span>
    </span>`;

  LAYOUTS.designjack = function (container, project) {
    const g = project.gallery || {};
    const B = g.base || '';
    const venn = g.venn || {};
    const zones = g.zones || [];
    const channels = g.channels || [];
    const steps = g.steps || [];
    const features = g.features || [];
    const cleanups = [];

    container.innerHTML = `
      <div class="dj is-r">

        <!-- APERTURA: il nome resta, lo stile cambia (R, G, B) -->
        <section class="dj-hero">
          <div class="dj-bands" aria-hidden="true">${CH.map((c) => `<i class="is-${c}"></i>`).join('')}</div>
          <div class="dj-hero-copy">
            <p class="dj-kicker" data-reveal>${esc(g.kicker || '')}</p>
            <h3 class="dj-hero-logo" data-reveal style="--i:1;">${logo()}</h3>
            <p class="dj-hero-title" data-reveal style="--i:2;">${g.heroTitle || ''}</p>
            <p class="dj-lead" data-reveal style="--i:3;">${g.lead || ''}</p>
            <div class="dj-switch" role="group" aria-label="Stile del logo" data-reveal style="--i:4;">
              ${CH.map((c) => `<button type="button" data-ch="${c}" class="${c === 'r' ? 'is-active' : ''}" aria-pressed="${c === 'r'}">${c.toUpperCase()}</button>`).join('')}
            </div>
          </div>
        </section>

        <!-- 01 DESIGN × CULTURA VISIVA × AI -->
        <section class="dj-sec dj-venn-sec">
          <header class="dj-head" data-reveal><span class="dj-num">01</span><h3 class="dj-h">${esc(g.vennTitle || '')}</h3></header>
          <div class="dj-venn">
            <svg class="dj-venn-svg" viewBox="0 0 400 370" role="group" aria-label="Design, cultura visiva e intelligenza artificiale" data-reveal>
              <g class="dj-vc is-design" data-k="design" tabindex="0" role="button" aria-label="${esc(venn.design ? venn.design.title : 'Design')}"><circle cx="140" cy="140" r="112"/><text x="92" y="108">${esc(venn.design ? venn.design.title : '')}</text></g>
              <g class="dj-vc is-culture" data-k="culture" tabindex="0" role="button" aria-label="${esc(venn.culture ? venn.culture.title : 'Cultura visiva')}"><circle cx="260" cy="140" r="112"/><text x="308" y="108">${esc(venn.culture ? venn.culture.title : '')}</text></g>
              <g class="dj-vc is-ai" data-k="ai" tabindex="0" role="button" aria-label="${esc(venn.ai ? venn.ai.title : 'AI')}"><circle cx="200" cy="244" r="112"/><text x="200" y="318">${esc(venn.ai ? venn.ai.title : '')}</text></g>
              <g class="dj-vcenter" data-k="center" tabindex="0" role="button" aria-label="${esc(venn.center ? venn.center.title : 'designjack')}"><circle cx="200" cy="176" r="34"/><text x="200" y="181">dj</text></g>
            </svg>
            <div class="dj-venn-copy" data-reveal style="--i:1;" aria-live="polite">
              <p class="dj-label">Tocca un cerchio</p>
              <h4 class="dj-venn-title">${esc(venn.center ? venn.center.title : '')}</h4>
              <p class="dj-venn-text">${venn.center ? venn.center.text : ''}</p>
            </div>
          </div>
        </section>

        <!-- 02 IL MOODBOARD: quattro famiglie di immagini, tre canali -->
        <section class="dj-sec dj-mood-sec">
          <header class="dj-head" data-reveal><span class="dj-num">02</span><h3 class="dj-h">${esc(g.moodTitle || 'Il moodboard')}</h3></header>
          <p class="dj-text" data-reveal>${g.moodText || ''}</p>
          <div class="dj-mood" data-reveal>
            <div class="dj-mood-img">
              <img src="${B}moodboard.jpg" alt="Il moodboard del sito: schermi e arcade, manifesti Bauhaus, verdi organici e graffiti, blu d'acqua e bolle" loading="lazy" />
              ${zones.map((z, i) => `<button type="button" class="dj-zone is-${z.ch}" style="left:${z.x}%; top:${z.y}%; width:${z.w}%; height:${z.h}%;" data-i="${i}" aria-label="${esc(z.title)}"><span>${esc(z.ch.toUpperCase())}</span></button>`).join('')}
            </div>
            <div class="dj-mood-copy" aria-live="polite">
              <p class="dj-label">Passa sulle zone</p>
              <h4 class="dj-mood-title">${esc(zones[0] ? zones[0].title : '')}</h4>
              <p class="dj-mood-text">${zones[0] ? zones[0].text : ''}</p>
            </div>
          </div>
        </section>

        <!-- 03 TRE CANALI -->
        <section class="dj-sec dj-ch-sec">
          <header class="dj-head" data-reveal><span class="dj-num">03</span><h3 class="dj-h">${esc(g.channelsTitle || 'Tre canali')}</h3></header>
          <div class="dj-ch-tabs" role="tablist" aria-label="Canali del sito" data-reveal>
            ${channels.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="is-${c.key}${i === 0 ? ' is-active' : ''}" data-i="${i}"><b>${c.key.toUpperCase()}</b><span>${esc(c.name)}</span></button>`).join('')}
          </div>
          <div class="dj-ch" data-reveal>
            <div class="dj-browser">
              <div class="dj-browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>designjack — <em class="dj-ch-url">${esc(channels[0] ? channels[0].name : '')}</em></span></div>
              <div class="dj-shots">
                ${channels.map((c, i) => `<figure class="dj-shot${i === 0 ? ' is-active' : ''}" ${zoom(B + c.shot, c.name)}><img src="${B}${c.shot}" alt="Il canale ${esc(c.name)}" loading="lazy" /></figure>`).join('')}
              </div>
            </div>
            <div class="dj-ch-copy" aria-live="polite">
              <h4 class="dj-ch-name">${esc(channels[0] ? channels[0].name : '')}</h4>
              <p class="dj-ch-text">${channels[0] ? channels[0].text : ''}</p>
              <p class="dj-ch-refs">${channels[0] ? esc(channels[0].refs) : ''}</p>
              <figure class="dj-ch-more" ${channels[0] ? zoom(B + channels[0].more, channels[0].name) : ''}><img src="${B}${channels[0] ? channels[0].more : ''}" alt="" loading="lazy" /></figure>
              <button type="button" class="dj-live">Prova dal vivo: passa al canale <b>${channels[0] ? channels[0].key.toUpperCase() : 'R'}</b></button>
            </div>
          </div>
        </section>

        <!-- 04 COME L'HO COSTRUITO -->
        <section class="dj-sec dj-steps-sec">
          <header class="dj-head" data-reveal><span class="dj-num">04</span><h3 class="dj-h">${esc(g.stepsTitle || 'Come l’ho costruito')}</h3></header>
          <ol class="dj-steps" data-reveal>
            ${steps.map((s, i) => `
              <li class="dj-step${i === 0 ? ' is-active' : ''}">
                <button type="button" data-i="${i}" aria-expanded="${i === 0}">
                  <span class="dj-step-n">${String(i + 1).padStart(2, '0')}</span>
                  <span class="dj-step-who is-${esc(s.who)}">${esc(s.whoLabel || '')}</span>
                  <span class="dj-step-title">${esc(s.title)}</span>
                </button>
                <p>${s.text}</p>
              </li>`).join('')}
          </ol>
        </section>

        <!-- 05 DENTRO IL SITO -->
        <section class="dj-sec dj-feat-sec">
          <header class="dj-head" data-reveal><span class="dj-num">05</span><h3 class="dj-h">${esc(g.featuresTitle || 'Dentro il sito')}</h3></header>
          <div class="dj-feats">
            ${features.map((f, i) => `
              <figure class="dj-feat" data-reveal style="--i:${i % 3};" ${zoom(B + f.src, f.title)}>
                <div class="dj-feat-img"><img src="${B}${f.src}" alt="${esc(f.title)}" loading="lazy" /></div>
                <figcaption><b>${esc(f.title)}</b><span>${f.text}</span></figcaption>
              </figure>`).join('')}
          </div>
          <div class="dj-stack" data-reveal>
            <p class="dj-label">Fatto con</p>
            <ul>${(g.stack || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          </div>
        </section>
      </div>
    `;

    const root = container.querySelector('.dj');

    // ---- logo: cambia stile da solo, oppure con i pulsanti R G B
    const swBtns = Array.from(root.querySelectorAll('.dj-switch button'));
    let chI = 0;
    let auto = 0;
    const setLogo = (c) => {
      CH.forEach((k) => root.classList.toggle(`is-${k}`, k === c));
      swBtns.forEach((b) => { const on = b.dataset.ch === c; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      chI = CH.indexOf(c);
    };
    const startAuto = () => {
      clearInterval(auto);
      if (reduceMotion()) return;
      auto = setInterval(() => { if (root.isConnected) setLogo(CH[(chI + 1) % 3]); }, 2400);
    };
    swBtns.forEach((b) => b.addEventListener('click', () => { setLogo(b.dataset.ch); startAuto(); }));
    root.querySelectorAll('.dj-bands i').forEach((band, i) => band.addEventListener('pointerenter', () => { setLogo(CH[i]); startAuto(); }));
    startAuto();
    cleanups.push(() => clearInterval(auto));

    // ---- diagramma: un cerchio alla volta
    const vTitle = root.querySelector('.dj-venn-title');
    const vText = root.querySelector('.dj-venn-text');
    const vEls = Array.from(root.querySelectorAll('.dj-venn-svg [data-k]'));
    const showVenn = (k) => {
      const v = venn[k];
      if (!v) return;
      vEls.forEach((el) => el.classList.toggle('is-active', el.dataset.k === k));
      root.querySelector('.dj-venn').setAttribute('data-k', k);
      vTitle.textContent = v.title;
      vText.innerHTML = v.text;
    };
    vEls.forEach((el) => {
      el.addEventListener('click', () => showVenn(el.dataset.k));
      el.addEventListener('pointerenter', () => showVenn(el.dataset.k));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showVenn(el.dataset.k); } });
    });
    showVenn('center');

    // ---- moodboard: le zone si accendono
    const mood = root.querySelector('.dj-mood');
    const zBtns = Array.from(root.querySelectorAll('.dj-zone'));
    const mTitle = root.querySelector('.dj-mood-title');
    const mText = root.querySelector('.dj-mood-text');
    const showZone = (i) => {
      const z = zones[i];
      zBtns.forEach((b, k) => b.classList.toggle('is-active', k === i));
      mood.classList.add('has-zone');
      mood.setAttribute('data-ch', z.ch);
      mTitle.textContent = z.title;
      mText.innerHTML = z.text;
    };
    zBtns.forEach((b, i) => {
      b.addEventListener('pointerenter', () => showZone(i));
      b.addEventListener('focus', () => showZone(i));
      b.addEventListener('click', () => showZone(i));
    });
    mood.querySelector('.dj-mood-img').addEventListener('pointerleave', () => mood.classList.remove('has-zone'));

    // ---- canali
    const cTabs = Array.from(root.querySelectorAll('.dj-ch-tabs button'));
    const shots = Array.from(root.querySelectorAll('.dj-shot'));
    const cName = root.querySelector('.dj-ch-name');
    const cText = root.querySelector('.dj-ch-text');
    const cRefs = root.querySelector('.dj-ch-refs');
    const cUrl = root.querySelector('.dj-ch-url');
    const cMore = root.querySelector('.dj-ch-more');
    const live = root.querySelector('.dj-live');
    const chSec = root.querySelector('.dj-ch-sec');
    let cur = 0;
    const showCh = (i) => {
      cur = i;
      const c = channels[i];
      cTabs.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', String(k === i)); });
      shots.forEach((s, k) => s.classList.toggle('is-active', k === i));
      chSec.setAttribute('data-ch', c.key);
      cName.textContent = c.name;
      cUrl.textContent = c.name;
      cText.innerHTML = c.text;
      cRefs.textContent = c.refs || '';
      cMore.querySelector('img').src = B + c.more;
      cMore.setAttribute('data-img-src', B + c.more);
      cMore.setAttribute('data-img-caption', c.name);
      live.querySelector('b').textContent = c.key.toUpperCase();
    };
    cTabs.forEach((b, i) => b.addEventListener('click', () => showCh(i)));
    showCh(0);
    // passa davvero al canale: la parte in alto della scheda (e il sito sotto) cambia stile
    live.addEventListener('click', () => {
      const c = channels[cur];
      if (window.switchChannel) window.switchChannel(c.key.toUpperCase());
      live.classList.add('is-done');
      setTimeout(() => live.classList.remove('is-done'), 1200);
    });

    // ---- processo: un passo aperto alla volta
    const stepEls = Array.from(root.querySelectorAll('.dj-step'));
    stepEls.forEach((li) => li.querySelector('button').addEventListener('click', () => {
      stepEls.forEach((x) => { const on = x === li; x.classList.toggle('is-active', on); x.querySelector('button').setAttribute('aria-expanded', String(on)); });
    }));

    cleanups.push(setupReveal(root, container));
    return () => cleanups.forEach((fn) => fn && fn());
  };
})();
