/**
 * designjack — Avatar 3D low-poly (Three.js r128)
 *
 * La testa è il ritratto low-poly di riferimento (assets/avatar/jacopo-avatar.png)
 * montato come texture su un rilievo 3D: la mesh ha la profondità di una testa
 * (cranio, viso, naso, orbite), quindi ruota e segue il cursore con parallasse vera.
 *
 * Animazioni sopra la texture:
 * - battito di palpebre (patch color pelle sopra gli occhi)
 * - bocca che si apre mentre parla (mandibola che scende + interno bocca scuro)
 * - fluttuazione, rotazione verso il cursore, giro a molla trascinandola
 *
 * La versione interamente procedurale precedente è in archive/heroAvatar-procedurale.js
 */

(function () {
  // Dimensioni della texture ritagliata e della mesh
  const TEX_W = 728;
  const TEX_H = 833;
  const MESH_W = 2.0;
  const MESH_H = MESH_W * TEX_H / TEX_W;

  // Punti di riferimento sul ritratto (pixel della texture)
  const L = {
    eyeL: { x: 337, y: 409, w: 142, h: 46 },
    eyeR: { x: 578, y: 414, w: 114, h: 44 },
    mouth: { x: 459, y: 661, w: 215 }
  };
  const COLORS = { lid: 0xd6a787, lash: 0x2a1a12, mouth: 0x4a1f1a };
  const MOUTH_V = L.mouth.y / TEX_H;
  const MOUTH_U = L.mouth.x / TEX_W;

  const MESSAGES = [
    'Ciao! Sono Jacopo “Jack” Febi.',
    'Disegno grafica, interfacce e cose in 3D.',
    'Sfoglia i progetti appesi al filo qui sotto.',
    'Oppure pesca una capsula dalla claw machine!',
    'Psst… trascinami per farmi girare la testa.'
  ];

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function smooth(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  // Profondità del rilievo in funzione delle coordinate della texture (u →, v ↓)
  function depth(u, v) {
    const e = 1 - ((u - 0.56) / 0.54) ** 2 - ((v - 0.52) / 0.58) ** 2;
    let z = 0.62 * Math.sqrt(Math.max(0, e));                       // volume della testa
    const f = 1 - ((u - 0.63) / 0.29) ** 2 - ((v - 0.66) / 0.38) ** 2;
    z += 0.14 * Math.max(0, f);                                      // il viso sporge dai capelli
    const ridgeU = 0.605 + 0.17 * (v - 0.5);                         // dorso del naso
    const along = smooth(0.47, 0.69, v) * (v < 0.7 ? 1 : Math.exp(-((v - 0.7) ** 2) / (2 * 0.018 ** 2)));
    z += 0.17 * Math.exp(-((u - ridgeU) ** 2) / (2 * 0.04 ** 2)) * along;
    for (const eye of [L.eyeL, L.eyeR]) {                            // orbite
      const du = u - eye.x / TEX_W, dv = v - eye.y / TEX_H;
      z -= 0.035 * Math.exp(-(du * du + dv * dv * 2) / (2 * 0.05 ** 2));
    }
    z += 0.03 * Math.exp(-(((u - 0.63) / 0.12) ** 2 + ((v - 0.8) / 0.04) ** 2)); // labbra
    return z;
  }

  const toMesh = (px, py) => new THREE.Vector3((px / TEX_W - 0.5) * MESH_W, (0.5 - py / TEX_H) * MESH_H, 0);

  // Profondità massima in un rettangolo di texture: le patch piatte devono stare davanti al rilievo
  function maxDepth(cx, cy, w, h) {
    let m = 0;
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 4; j++) {
        const px = cx - w / 2 + (w * i) / 6, py = cy - h / 2 + (h * j) / 4;
        m = Math.max(m, depth(px / TEX_W, py / TEX_H));
      }
    }
    return m;
  }

  class HeroAvatar {
    constructor(container, opts = {}) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      if (!this.container) return;
      this.bubble = opts.bubble || null;
      this.textureUrl = opts.texture || window.AVATAR_TEXTURE || 'assets/avatar/jacopo-avatar.png';
      this.messages = opts.messages || MESSAGES;
      this.autoGreet = opts.autoGreet !== false;
      this.clickHandler = null;       // se restituisce false, il clic non fa parlare l'avatar
      this.pixel = 2;                 // lato del "pixel" CRT in px CSS

      this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this.spin = 0;
      this.spinVel = 0;
      this.hop = 0;
      this.hopVel = 0;
      this.drag = null;
      this.blink = { t: 0, next: 1.5 + Math.random() * 2, closing: 0 };
      this.talk = { open: 0, target: 0, applied: -1 };
      this.msgIndex = 0;
      this.typing = null;
      this.hideTimer = null;
      this.visible = true;
      this.clock = new THREE.Clock();

      this.init();
    }

    init() {
      const w = this.container.clientWidth || 360;
      const h = this.container.clientHeight || 340;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(28, w / h, 0.1, 50);
      this.camera.position.set(0, -0.14, 5.5);

      // niente antialias: la scena passa dal buffer pixelato (vedi buildPost), quindi non si vedrebbe,
      // e con l'antialias ogni ridimensionamento (aggancio in basso a sinistra) costava ~200 ms
      this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);
      this.buildPost(w, h);

      // La texture ha già la sua luce dipinta: qui solo una leggera variazione girando
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const key = new THREE.DirectionalLight(0xffffff, 0.3);
      key.position.set(-1, 1.5, 4);
      this.scene.add(key);

      this.root = new THREE.Group();
      this.head = new THREE.Group();
      this.root.add(this.head);
      this.scene.add(this.root);

      new THREE.TextureLoader().load(this.textureUrl, (tex) => this.buildHead(tex));
      this.buildShadow();
      this.setupEvents();
      this.animate();
    }

    buildHead(tex) {
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const geo = new THREE.PlaneGeometry(MESH_W, MESH_H, 60, 70);
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      this.jaw = [];
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i), v = 1 - uv.getY(i);
        pos.setZ(i, depth(u, v));
        // vertici che scendono con la mandibola quando parla
        const wgt = smooth(MOUTH_V - 0.004, MOUTH_V + 0.03, v) * Math.exp(-(((u - MOUTH_U) / 0.3) ** 2));
        if (wgt > 0.01) this.jaw.push([i, pos.getY(i), wgt]);
      }
      geo.computeVertexNormals();
      this.faceGeo = geo;

      const mat = new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide });
      this.face = new THREE.Mesh(geo, mat);
      this.head.add(this.face);

      // Palpebre per il battito di ciglia
      const lidMat = new THREE.MeshBasicMaterial({ color: COLORS.lid });
      const lashMat = new THREE.MeshBasicMaterial({ color: COLORS.lash });
      this.lids = [L.eyeL, L.eyeR].map((e) => {
        const wm = (e.w / TEX_W) * MESH_W * 1.1;
        const hm = (e.h / TEX_H) * MESH_H * 1.35;
        const pivot = new THREE.Group();
        pivot.position.copy(toMesh(e.x, e.y - e.h * 0.62));
        pivot.position.z = maxDepth(e.x, e.y, e.w * 1.1, e.h * 1.4) + 0.012;
        const lid = new THREE.Mesh(new THREE.CircleGeometry(0.5, 14), lidMat);
        lid.scale.set(wm, hm, 1);
        lid.position.y = -hm / 2;
        const lidHolder = new THREE.Group();
        lidHolder.add(lid);
        const lash = new THREE.Mesh(new THREE.PlaneGeometry(wm * 0.92, 0.014), lashMat);
        lash.position.z = 0.002;
        pivot.add(lidHolder, lash);
        pivot.visible = false;
        this.head.add(pivot);
        return { pivot, lidHolder, lash, hm };
      });

      // Interno della bocca
      const mw = (L.mouth.w / TEX_W) * MESH_W * 0.62;
      this.mouthPivot = new THREE.Group();
      this.mouthPivot.position.copy(toMesh(L.mouth.x, L.mouth.y + 2));
      this.mouthPivot.position.z = maxDepth(L.mouth.x, L.mouth.y, L.mouth.w * 0.7, 40) + 0.01;
      this.mouthHole = new THREE.Mesh(new THREE.CircleGeometry(0.5, 12), new THREE.MeshBasicMaterial({ color: COLORS.mouth }));
      this.mouthHole.scale.set(mw, 0.001, 1);
      this.mouthPivot.add(this.mouthHole);
      this.mouthPivot.visible = false;
      this.head.add(this.mouthPivot);
    }

    buildShadow() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, 'rgba(21,20,19,0.3)');
      grd.addColorStop(1, 'rgba(21,20,19,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 64, 64);
      this.shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.2),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
      );
      this.shadow.rotation.x = -Math.PI / 2;
      this.shadow.position.y = -MESH_H / 2 - 0.12;
      this.scene.add(this.shadow);
    }

    /* ------------------------------------------------------------------ */
    /* Fumetto                                                              */
    /* ------------------------------------------------------------------ */
    say(text, opts = {}) {
      if (!this.bubble || !text) return;
      clearInterval(this.typing);
      clearTimeout(this.hideTimer);
      this.bubble.hidden = false;
      this.bubble.classList.remove('pop');
      void this.bubble.offsetWidth;
      this.bubble.classList.add('pop');
      this.bubble.textContent = '';
      let i = 0;
      this.typing = setInterval(() => {
        i++;
        this.bubble.textContent = text.slice(0, i);
        const ch = text[i - 1] || '';
        this.talk.target = /[aeiouàèéìòù]/i.test(ch) ? 1 : /[\s.,!?…]/.test(ch) ? 0 : 0.45;
        if (!opts.quiet && i % 3 === 0 && window.audioEngine && window.audioEngine.playBeep) {
          window.audioEngine.playBeep(520 + Math.random() * 160, 0.025, 'square');
        }
        if (i >= text.length) {
          clearInterval(this.typing);
          this.typing = null;
          this.talk.target = 0;
          if (opts.autoHide) {
            this.hideTimer = setTimeout(() => { this.bubble.hidden = true; }, opts.autoHide);
          }
        }
      }, 34);
    }

    // Sorpresa (easter egg del Konami code): salto secco, sussulto, bocca aperta,
    // occhi spalancati (niente battito di ciglia finché dura)
    surprise(duration = 1.1) {
      this.hideBubble();
      this.hopVel = 0.11;
      this.shock = duration;
      this.spinVel += (Math.random() < 0.5 ? -1 : 1) * 0.05;
      this.blink.closing = 0;
      this.blink.t = 0;
      this.blink.next = duration + 1.5;
      this.talk.target = 0.85;
      clearTimeout(this.shockTimer);
      this.shockTimer = setTimeout(() => { if (!this.typing) this.talk.target = 0; }, duration * 1000);
    }

    hideBubble() {
      clearInterval(this.typing);
      clearTimeout(this.hideTimer);
      this.typing = null;
      this.talk.target = 0;
      if (this.bubble) this.bubble.hidden = true;
    }

    nextMessage() {
      this.say(this.messages[this.msgIndex % this.messages.length]);
      this.msgIndex++;
    }

    setMessages(list) {
      if (!list || !list.length || list === this.messages) return;
      this.messages = list;
      this.msgIndex = 0;
    }

    /* ------------------------------------------------------------------ */
    /* Filtro CRT pixelato e leggermente tinto (rosso R, verde G, blu B)    */
    /* ------------------------------------------------------------------ */
    buildPost(w, h) {
      this.rt = new THREE.WebGLRenderTarget(2, 2, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
      });
      this.postScene = new THREE.Scene();
      this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.postMat = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: this.rt.texture },
          uTint: { value: new THREE.Vector3(1, 1, 1) },
          uMix: { value: 0 },
          uBlock: { value: 2 }
        },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: [
          'uniform sampler2D tDiffuse; uniform vec3 uTint; uniform float uMix; uniform float uBlock;',
          'varying vec2 vUv;',
          'void main(){',
          '  vec4 c = texture2D(tDiffuse, vUv);',
          '  float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));',
          '  vec3 col = mix(c.rgb, l * uTint * 1.3, uMix);',
          // scanline: l'ultima riga di ogni "pixel" è più scura
          '  float row = mod(gl_FragCoord.y, uBlock);',
          '  col *= row < max(1.0, uBlock * 0.3) ? 0.8 : 1.0;',
          // maschera RGB a colonne, appena accennata
          '  float k = mod(floor(gl_FragCoord.x), 3.0);',
          '  col *= k < 1.0 ? vec3(1.05, 0.97, 0.97) : (k < 2.0 ? vec3(0.97, 1.05, 0.97) : vec3(0.97, 0.97, 1.05));',
          '  gl_FragColor = vec4(min(col, vec3(c.a)), c.a);',
          '}'
        ].join('\n'),
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending
      });
      this.postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMat));
      this.resizePost(w, h);
    }

    resizePost(w, h) {
      if (!this.rt) return;
      this.rt.setSize(Math.max(1, Math.ceil(w / this.pixel)), Math.max(1, Math.ceil(h / this.pixel)));
      this.postMat.uniforms.uBlock.value = this.pixel * this.renderer.getPixelRatio();
    }

    // In tutti i canali: solo pixel e scanline, senza tinta di colore.
    // (per ridare una tinta a un canale basta alzare il suo mix, es. 0.26)
    setTint(channel) {
      const tints = {
        r: { c: [1, 1, 1], mix: 0 },
        g: { c: [1, 1, 1], mix: 0 },
        b: { c: [1, 1, 1], mix: 0 }
      };
      const t = tints[channel] || tints.r;
      if (!this.postMat) return;
      this.postMat.uniforms.uTint.value.set(t.c[0], t.c[1], t.c[2]);
      this.postMat.uniforms.uMix.value = t.mix;
    }

    draw() {
      if (!this.rt) {
        this.renderer.render(this.scene, this.camera);
        return;
      }
      this.renderer.setRenderTarget(this.rt);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(null);
      this.renderer.clear();
      this.renderer.render(this.postScene, this.postCam);
    }

    /* ------------------------------------------------------------------ */
    /* Eventi                                                               */
    /* ------------------------------------------------------------------ */
    onResize() {
      if (!this.container || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w <= 0 || h <= 0) return;
      // il ResizeObserver richiama dopo l'aggancio con la stessa misura: niente lavoro doppio
      if (w === this.lastW && h === this.lastH) return;
      this.lastW = w;
      this.lastH = h;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.resizePost(w, h);
      this.draw();
    }

    setupEvents() {
      if ('ResizeObserver' in window) {
        new ResizeObserver(() => this.onResize()).observe(this.container);
      } else {
        window.addEventListener('resize', () => this.onResize());
      }

      const track = (x, y) => {
        const r = this.container.getBoundingClientRect();
        if (!r.width) return;
        this.mouse.tx = clamp((x - (r.left + r.width / 2)) / (r.width / 2), -2, 2);
        this.mouse.ty = clamp((y - (r.top + r.height / 2)) / (r.height / 2), -2, 2);
      };

      window.addEventListener('pointermove', (e) => {
        track(e.clientX, e.clientY);
        if (this.drag) {
          const dx = e.clientX - this.drag.x;
          this.drag.moved += Math.abs(dx);
          this.spin = clamp(this.spin + dx * 0.006, -0.75, 0.75);
          this.drag.x = e.clientX;
        }
      });

      this.container.addEventListener('pointerdown', (e) => {
        this.drag = { x: e.clientX, moved: 0 };
        track(e.clientX, e.clientY);
      });

      window.addEventListener('pointerup', () => {
        if (!this.drag) return;
        const clicked = this.drag.moved < 6;
        this.drag = null;
        if (clicked && this.clickHandler && this.clickHandler() === false) return;
        if (clicked) {
          this.hopVel = 0.05;
          this.blink.closing = 1;
          if (window.audioEngine && window.audioEngine.playSpringPop) window.audioEngine.playSpringPop();
          this.nextMessage();
        }
      });

      if ('IntersectionObserver' in window) {
        let greeted = false;
        new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            this.visible = en.isIntersecting;
            if (en.isIntersecting && !greeted && this.autoGreet) {
              greeted = true;
              setTimeout(() => this.nextMessage(), 900);
            }
          });
        }, { threshold: 0.2 }).observe(this.container);
      } else if (this.autoGreet) {
        setTimeout(() => this.nextMessage(), 900);
      }
    }

    /* ------------------------------------------------------------------ */
    /* Animazione                                                           */
    /* ------------------------------------------------------------------ */
    animate() {
      requestAnimationFrame(() => this.animate());
      const dt = Math.min(0.05, this.clock.getDelta());
      if (!this.visible || document.hidden) return;
      const t = this.clock.elapsedTime;

      const m = this.mouse;
      m.x += (m.tx - m.x) * 0.07;
      m.y += (m.ty - m.y) * 0.07;

      if (!this.drag) {
        this.spinVel += -this.spin * 0.02;
        this.spinVel *= 0.88;
        this.spin += this.spinVel;
      }

      // saltello quando lo clicchi
      this.hopVel -= this.hop * 0.08 + this.hopVel * 0.12;
      this.hop += this.hopVel;

      this.root.position.y = Math.sin(t * 1.4) * 0.05 + this.hop;
      // sussulto della sorpresa: tremolio che si spegne
      if (this.shock > 0) {
        this.shock = Math.max(0, this.shock - dt);
        const k = Math.min(1, this.shock * 2);
        this.root.position.x = Math.sin(t * 70) * 0.03 * k;
      } else if (this.root.position.x !== 0) {
        this.root.position.x = 0;
      }
      this.root.rotation.z = Math.sin(t * 0.9) * 0.02;
      this.head.rotation.y = clamp(this.spin + clamp(m.x, -1.2, 1.2) * 0.36, -0.85, 0.85);
      this.head.rotation.x = clamp(m.y, -1.2, 1.2) * 0.16 + Math.sin(t * 1.1) * 0.015;
      if (this.shadow) {
        const s = 1 - this.root.position.y * 0.6;
        this.shadow.scale.set(s, s, s);
      }

      // Battito di ciglia
      const b = this.blink;
      b.t += dt;
      if (b.t > b.next) { b.closing = 1; b.t = 0; b.next = 2.2 + Math.random() * 3.5; }
      b.closing = Math.max(0, b.closing - dt * 7);
      const close = Math.sin(Math.min(1, b.closing) * Math.PI);
      if (this.lids) {
        this.lids.forEach((l) => {
          l.pivot.visible = close > 0.02;
          l.lidHolder.scale.y = Math.max(0.001, close);
          l.lash.position.y = -l.hm * close;
        });
      }

      // Bocca che parla
      const tk = this.talk;
      tk.open += (tk.target - tk.open) * 0.35;
      if (this.faceGeo && Math.abs(tk.open - tk.applied) > 0.002) {
        const pos = this.faceGeo.attributes.position;
        const drop = tk.open * 0.045;
        for (const [i, y0, w] of this.jaw) pos.setY(i, y0 - drop * w);
        pos.needsUpdate = true;
        tk.applied = tk.open;
        this.mouthPivot.visible = tk.open > 0.03;
        this.mouthHole.scale.y = Math.max(0.001, tk.open * 0.06);
        this.mouthHole.position.y = -tk.open * 0.018;
      }

      this.draw();
    }
  }

  window.HeroAvatar = HeroAvatar;
  window.initHeroAvatar = function () {
    const viewport = document.getElementById('avatar-viewport');
    if (!viewport) return;
    const pilot = viewport.closest('.avatar-pilot');
    window.heroAvatar = new HeroAvatar(viewport, {
      bubble: pilot ? pilot.querySelector('.avatar-bubble') : null,
      autoGreet: !(window.AvatarPilot && pilot)   // con il pilota il saluto dipende dal canale
    });
    window.heroSphere = window.heroAvatar;   // compatibilità con main.js (onResize)
    if (window.AvatarPilot && pilot) window.avatarPilot = new window.AvatarPilot(pilot, window.heroAvatar);
  };
})();
