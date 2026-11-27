/**
 * i18n.js — italiano / inglese per tutto il sito.
 *
 * Il sito è scritto in italiano. Quando è attivo l'inglese, ogni testo della pagina
 * (nodi di testo e attributi come title, aria-label, alt, placeholder) viene cercato nel
 * dizionario js/i18n-en.js e sostituito. Un MutationObserver traduce anche quello che i
 * vari script aggiungono dopo: pagine progetto, fumetti dell'avatar, messaggi, catalogo.
 * Tornando all'italiano si rimette il testo originale, salvato nodo per nodo.
 *
 * Per i testi disegnati su canvas o scritti lettera per lettera, gli script chiamano
 * window.i18n.t('testo italiano') prima di usarli.
 *
 * API: window.i18n = { lang, t(str), set(lang), toggle() }
 *       evento 'dj-lang' su window con detail.lang a ogni cambio.
 */
(function () {
  'use strict';

  const DICT = new Map(Object.entries(window.I18N_EN || {}));
  const RULES = window.I18N_EN_RULES || [];
  const ATTRS = ['title', 'aria-label', 'alt', 'placeholder'];
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);
  const STORE = 'dj-lang';

  const norm = (s) => s.replace(/\s+/g, ' ').trim();

  // Traduzione di una stringa (già normalizzata o no): dizionario, poi regole con parti variabili
  function lookup(str) {
    const key = norm(str);
    if (!key) return null;
    if (DICT.has(key)) return DICT.get(key);
    for (const [re, rep] of RULES) {
      const m = key.match(re);
      if (m) return typeof rep === 'function' ? rep(m, t) : key.replace(re, rep);
    }
    return null;
  }
  function t(str) {
    if (lang !== 'en' || str == null) return str;
    const out = lookup(String(str));
    return out == null ? str : out;
  }

  // ---- lingua iniziale: scelta salvata, altrimenti quella del browser
  let saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) { saved = null; }
  const browserIt = /^it\b/i.test((navigator.languages && navigator.languages[0]) || navigator.language || 'it');
  let lang = saved === 'en' || saved === 'it' ? saved : (browserIt ? 'it' : 'en');

  // ---- memoria degli originali
  const textOrig = new WeakMap();   // nodo di testo -> { it, en }
  const attrOrig = new WeakMap();   // elemento -> { attr: { it, en } }

  const skipped = (el) => !el || SKIP_TAGS.has(el.tagName) || (el.closest && el.closest('[data-i18n-skip]'));

  function translateText(node) {
    const p = node.parentElement;
    if (skipped(p)) return;
    const data = node.data;
    const rec = textOrig.get(node);
    if (rec && data === rec.en) return;                // è già la nostra traduzione
    const m = data.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2]) return;
    const en = lookup(m[2]);
    if (en == null) { if (rec) textOrig.delete(node); return; }
    const out = m[1] + en + m[3];
    textOrig.set(node, { it: data, en: out });
    if (out !== data) node.data = out;
  }

  function translateAttrs(el) {
    // gli attributi si traducono anche su textarea & co.: si salta solo [data-i18n-skip]
    if (!el || (el.closest && el.closest('[data-i18n-skip]'))) return;
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const v = el.getAttribute(a);
      let recs = attrOrig.get(el);
      const rec = recs && recs[a];
      if (rec && v === rec.en) continue;
      const en = lookup(v);
      if (en == null) continue;
      if (!recs) { recs = {}; attrOrig.set(el, recs); }
      recs[a] = { it: v, en };
      if (en !== v) el.setAttribute(a, en);
    }
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { translateText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    const el = root.nodeType === 9 ? root.documentElement : root;
    if (el.nodeType === 1) translateAttrs(el);
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) translateText(n);
      else translateAttrs(n);
    }
  }

  function restoreTree(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n = root;
    do {
      if (n.nodeType === 3) {
        const rec = textOrig.get(n);
        if (rec && n.data === rec.en) n.data = rec.it;
        textOrig.delete(n);
      } else if (n.nodeType === 1) {
        const recs = attrOrig.get(n);
        if (recs) {
          for (const a in recs) if (n.getAttribute(a) === recs[a].en) n.setAttribute(a, recs[a].it);
          attrOrig.delete(n);
        }
      }
    } while ((n = w.nextNode()));
  }

  // ---- osservatore: traduce quello che arriva dopo (solo in inglese)
  let busy = false;
  const mo = new MutationObserver((list) => {
    if (lang !== 'en' || busy) return;
    busy = true;
    for (const m of list) {
      if (m.type === 'characterData') translateText(m.target);
      else if (m.type === 'attributes') translateAttrs(m.target);
      else m.addedNodes.forEach(translateTree);
    }
    busy = false;
  });
  const watch = () => mo.observe(document.documentElement, {
    subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS
  });

  // ---- pulsante IT / EN
  function paintToggle() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.querySelectorAll('[data-lang]').forEach((s) => s.classList.toggle('is-on', s.dataset.lang === lang));
      btn.setAttribute('aria-label', lang === 'en' ? 'Language: English. Passa all’italiano' : 'Lingua: italiano. Switch to English');
      btn.setAttribute('title', lang === 'en' ? 'Passa all’italiano' : 'Switch to English');
    });
  }

  function set(next) {
    if (next !== 'it' && next !== 'en') return;
    const changed = next !== lang;
    lang = next;
    try { localStorage.setItem(STORE, lang); } catch (e) { /* niente memoria: va bene lo stesso */ }
    busy = true;
    if (lang === 'en') translateTree(document.documentElement);
    else restoreTree(document.documentElement);
    busy = false;
    mo.takeRecords();
    paintToggle();
    if (changed) window.dispatchEvent(new CustomEvent('dj-lang', { detail: { lang } }));
  }

  window.i18n = {
    get lang() { return lang; },
    t,
    set,
    toggle() { set(lang === 'en' ? 'it' : 'en'); }
  };

  // avvio: il DOM statico è già tutto lì (lo script sta in fondo al body)
  function boot() {
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => window.i18n.toggle());
    });
    if (lang === 'en') translateTree(document.documentElement);
    paintToggle();
    watch();
    initHint();
  }

  // ---- fumetto d'avviso: alla prima visita, finita l'intro, indica il pulsante IT / EN.
  //      Una volta sola per visitatore; si chiude da solo, con la X o cambiando lingua.
  const HINT = 'dj-lang-hint';
  function initHint() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    try { if (localStorage.getItem(HINT)) return; } catch (e) { /* nessuna memoria: lo mostriamo */ }

    let tries = 0;
    const waitIntro = () => {
      const pre = document.getElementById('preloader');
      const introOn = pre && pre.style.display !== 'none' && getComputedStyle(pre).display !== 'none';
      if (introOn && tries++ < 60) { setTimeout(waitIntro, 300); return; }
      setTimeout(() => showHint(btn), 900);
    };
    waitIntro();
  }

  function showHint(langBtn) {
    // su telefono la lingua sta nel menu ☰: il fumetto indica quello
    const menuBtn = document.getElementById('nav-menu-toggle');
    const inMenu = !!(menuBtn && menuBtn.offsetParent && getComputedStyle(menuBtn).display !== 'none');
    const btn = inMenu ? menuBtn : langBtn;
    if (!btn.offsetParent) return;                       // pulsante nascosto: niente fumetto
    try { localStorage.setItem(HINT, '1'); } catch (e) { /* va bene lo stesso */ }

    const en = lang === 'en';
    const title = inMenu ? (en ? 'Language is in this menu' : 'La lingua è in questo menu')
                         : (en ? 'You can switch language here' : 'Puoi cambiare lingua da qui');
    const sub = inMenu ? (en ? 'Passa all’italiano da qui' : 'Switch to English from here')
                       : (en ? 'Passa all’italiano con un clic' : 'Switch to English with one click');
    const hint = document.createElement('div');
    hint.className = 'lang-hint';
    hint.setAttribute('role', 'status');
    hint.setAttribute('data-i18n-skip', '');
    hint.innerHTML =
      '<svg class="lh-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/></svg>' +
      '<span class="lh-txt"><b>' + title + '</b>' +
      '<small>' + sub + '</small></span>' +
      '<button type="button" class="lh-close" aria-label="' + (en ? 'Close' : 'Chiudi') + '">×</button>';
    document.body.appendChild(hint);
    btn.classList.add('is-hinted');

    const place = () => {
      const r = btn.getBoundingClientRect();
      const w = hint.offsetWidth;
      const cx = r.left + r.width / 2;
      const left = Math.max(8, Math.min(window.innerWidth - w - 8, cx - w / 2));
      hint.style.top = Math.round(r.bottom + 13) + 'px';
      hint.style.left = Math.round(left) + 'px';
      hint.style.setProperty('--ax', Math.round(cx - left) + 'px');
    };
    place();
    requestAnimationFrame(() => hint.classList.add('is-in'));
    window.addEventListener('resize', place);

    let gone = false;
    const close = () => {
      if (gone) return;
      gone = true;
      clearTimeout(timer);
      window.removeEventListener('resize', place);
      btn.removeEventListener('click', close);
      btn.classList.remove('is-hinted');
      hint.classList.remove('is-in');
      setTimeout(() => hint.remove(), 350);
    };
    const timer = setTimeout(close, 8000);
    hint.querySelector('.lh-close').addEventListener('click', close);
    btn.addEventListener('click', close);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
