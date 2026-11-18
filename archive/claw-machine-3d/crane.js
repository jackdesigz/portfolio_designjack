/**
 * designjack — Claw Machine (vista 3D e regia di gioco)
 *
 * La fisica vive in clawPhysics.js: qui si costruisce la macchina, si leggono i
 * comandi e si sincronizzano le mesh con la simulazione a ogni fotogramma.
 *
 *  - cabinato Bauhaus (rosso / crema / blu / giallo) con insegna a lampadine,
 *    vetri riflettenti, plancia con joystick e pulsante animati
 *  - capsule gashapon bicolori con il gettone del progetto all'interno
 *  - luce di mira sotto il carrello: diventa verde quando l'artiglio è in asse
 *  - riflessi da environment map generata in scena, ombre e bloom HDR
 *  - trascina sul vetro per girare attorno alla macchina e giudicare la profondità
 */
(function () {
  'use strict';

  const FLOOR_Y = 1.3;        // quota del fondo vasca nel mondo
  const GLASS_H = 3.36;       // altezza della teca
  const FRAME = 0.16;

  const COL = {
    red: 0xD93D2A, redDeep: 0xA82A16, yellow: 0xEEA824, navy: 0x1D3557,
    blue: 0x2B62C9, cream: 0xEEE6D3, ink: 0x151413, white: 0xFFFFFF
  };
  const CAPSULE_COLORS = { red: 0xD2381F, yellow: 0xF0A51C, blue: 0x2B62C9, green: 0x18A58F, purple: 0x6E36C9 };
  const FILLER_COLORS = [0xEEE6D3, 0xEEA824, 0xD93D2A, 0x2B62C9, 0xEEE6D3, 0x151413];

  const STATUS = {
    ready: 'PRONTO — MUOVI E PESCA',
    drop: 'DISCESA…',
    close: 'PRESA…',
    gripOk: 'AGGANCIATA!',
    gripNo: 'A VUOTO…',
    carry: 'VERSO LO SCIVOLO',
    miss: 'MANCATA — RIPROVA',
    slip: 'SCIVOLATA! RIPROVA',
    filler: 'SOLO UNA PALLINA — RIPROVA',
    win: 'CAPSULA VINTA!',
    refill: 'NUOVO CARICO DI CAPSULE'
  };

  // ------------------------------------------------------------------
  // Utilità di geometria e texture
  // ------------------------------------------------------------------
  function roundedRectShape(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    r = Math.max(0.001, Math.min(r, w / 2, h / 2));
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  // Parallelepipedo con spigoli verticali raccordati e bordi smussati, centrato nell'origine
  // hole = { x0, x1, z0, z1 } apre un pozzo verticale passante (usato per lo scivolo)
  function roundedBox(w, h, d, r, bevel, hole) {
    if (bevel === undefined) bevel = Math.min(0.035, h * 0.25, r * 0.5);
    const shape = roundedRectShape(w - 2 * bevel, d - 2 * bevel, Math.max(0.001, r - bevel));
    if (hole) {
      const p = new THREE.Path();
      p.moveTo(hole.x0, -hole.z1); p.lineTo(hole.x1, -hole.z1); p.lineTo(hole.x1, -hole.z0); p.lineTo(hole.x0, -hole.z0); p.closePath();
      shape.holes.push(p);
    }
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: h - 2 * bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel,
      bevelSegments: 3, curveSegments: 10
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -h / 2 + bevel, 0);
    return g;
  }

  // Pannello piatto con angoli raccordati, rivolto verso +z
  function roundedPanel(w, h, depth, r) {
    const g = new THREE.ExtrudeGeometry(roundedRectShape(w, h, r), { depth: depth, bevelEnabled: false, curveSegments: 10 });
    return g;
  }

  function canvasTexture(w, h, draw) {
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    draw(cv.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    return tex;
  }

  function hex(c) { return '#' + ('000000' + c.toString(16)).slice(-6); }

  function hdr(colorHex, k) {
    const c = new THREE.Color(colorHex);
    c.convertSRGBToLinear();
    c.multiplyScalar(k);
    return c;
  }

  function tokenGeometry(name, s) {
    const n = (name || '').toLowerCase();
    if (n.indexOf('torus knot') >= 0) return new THREE.TorusKnotGeometry(s * 0.55, s * 0.2, 56, 8);
    if (n.indexOf('torus') >= 0) return new THREE.TorusGeometry(s * 0.66, s * 0.27, 14, 30);
    if (n.indexOf('cube') >= 0) return new THREE.BoxGeometry(s * 1.15, s * 1.15, s * 1.15);
    if (n.indexOf('octahedron') >= 0) return new THREE.OctahedronGeometry(s * 1.05);
    if (n.indexOf('icosahedron') >= 0) return new THREE.IcosahedronGeometry(s);
    if (n.indexOf('double pyramid') >= 0) { const g = new THREE.OctahedronGeometry(s * 0.85); g.scale(1, 1.45, 1); return g; }
    if (n.indexOf('tetrahedron') >= 0) return new THREE.TetrahedronGeometry(s * 1.2);
    if (n.indexOf('truncated cone') >= 0) return new THREE.CylinderGeometry(s * 0.45, s * 0.9, s * 1.35, 24);
    if (n.indexOf('cylinder') >= 0) return new THREE.CylinderGeometry(s * 0.72, s * 0.72, s * 1.25, 6);
    if (n.indexOf('star') >= 0) { const g = new THREE.OctahedronGeometry(s * 0.6, 0); g.scale(1.7, 0.7, 1.7); return g; }
    if (n.indexOf('prism') >= 0) return new THREE.CylinderGeometry(s * 0.85, s * 0.85, s * 1.2, 3);
    return new THREE.DodecahedronGeometry(s);
  }

  // ------------------------------------------------------------------
  class ClawMachine {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container || !window.THREE || !window.ClawPhysics) return;

      this.sim = new ClawPhysics.Sim();
      this.sim.listener = (type, data) => this.onSimEvent(type, data);
      this.cfg = this.sim.cfg;
      this.IN_X = this.cfg.hx; this.IN_Z = this.cfg.hz;
      this.OX = this.IN_X + FRAME; this.OZ = this.IN_Z + FRAME;

      this.width = this.container.clientWidth || 960;
      this.height = this.container.clientHeight || 620;
      this.reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      this.keys = { up: false, down: false, left: false, right: false };
      this.entities = new Map();        // body.id → { body, mesh, token, project }
      this.spawnQueue = [];
      this.spawnTimer = 0;
      this.respawns = [];
      this.collected = new Set();
      this.pendingWin = null;
      this.armed = false;               // true dopo il primo assestamento: da lì in poi una capsula nello scivolo è un premio
      this.armTimer = 0;
      this.started = false;
      this.visible = false;
      this.inFocus = false;
      this.userActive = false;
      this.time = 0;
      this.last = 0;
      this.statusTimer = 0;
      this.dropPress = 0;
      this.celebrate = 0;
      this.confetti = null;
      this.orbit = { yaw: 0.36, pitch: 0.2, tyaw: 0.36, tpitch: 0.2, drag: null };
      this.perf = { frames: 0, acc: 0, level: 0 };

      this.setupRenderer();
      this.buildEnvironment();
      this.buildMaterials();
      this.buildRoom();
      this.buildCabinet();
      this.buildPit();
      this.buildGantryAndClaw();
      this.setupLights();
      this.setupPostFX();
      this.buildHUD();
      this.setupEvents();
      this.updateCamera(0);
      this.syncClaw(0.016);
      this.setStatus(STATUS.ready, true);

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    // ----------------------------------------------------------------
    // Renderer, ambiente, materiali
    // ----------------------------------------------------------------
    setupRenderer() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.5, 80);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.9;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.touchAction = 'pan-y';
      this.renderer.domElement.style.cursor = 'grab';

      this.scene.background = canvasTexture(16, 256, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#171333'); g.addColorStop(0.55, '#0e0c1f'); g.addColorStop(1, '#07060d');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      });
      this.scene.fog = new THREE.Fog(0x0a0916, 22, 46);

      this.root = new THREE.Group();          // tutto ciò che appartiene alla macchina (coordinate mondo)
      this.scene.add(this.root);
      this.play = new THREE.Group();          // coordinate della simulazione: fondo vasca a y = 0
      this.play.position.y = FLOOR_Y;
      this.root.add(this.play);
    }

    // Environment map generata da una piccola "sala posa": softbox colorati per i riflessi su cromature e plastiche
    buildEnvironment() {
      const env = new THREE.Scene();
      const room = new THREE.Mesh(new THREE.BoxGeometry(40, 24, 40), new THREE.MeshBasicMaterial({ color: 0x06060c, side: THREE.BackSide }));
      env.add(room);
      const box = (w, h, color, k, pos, rot) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: hdr(color, k), side: THREE.DoubleSide }));
        m.position.set(pos[0], pos[1], pos[2]);
        m.rotation.set(rot[0], rot[1], rot[2]);
        env.add(m);
      };
      box(10, 5, 0xfff2dc, 1.9, [0, 10, 3], [Math.PI / 2, 0, 0]);          // softbox zenitale caldo
      box(3, 10, 0xff3355, 2.2, [-13, 3, -2], [0, Math.PI / 2, 0]);        // lama rossa a sinistra
      box(3, 10, 0x3a7bff, 2.6, [13, 3, -2], [0, -Math.PI / 2, 0]);        // lama blu a destra
      box(9, 3, 0xffffff, 0.9, [0, 5, 14], [0, Math.PI, 0]);               // riempimento frontale
      box(4, 1.5, 0xffb703, 1.8, [4, 7, -13], [0, 0, 0]);                  // accento giallo sul fondo
      const pm = new THREE.PMREMGenerator(this.renderer);
      this.envMap = pm.fromScene(env, 0.03).texture;
      this.scene.environment = this.envMap;
      pm.dispose();
      env.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    }

    buildMaterials() {
      const P = (o) => new THREE.MeshPhysicalMaterial(o);
      const S = (o) => new THREE.MeshStandardMaterial(o);
      this.mat = {
        red: P({ color: 0xBF2E17, roughness: 0.27, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 0.9 }),
        cream: P({ color: 0xE8DCC2, roughness: 0.45, metalness: 0.0, clearcoat: 0.6, clearcoatRoughness: 0.18, envMapIntensity: 0.7 }),
        navy: P({ color: COL.navy, roughness: 0.38, metalness: 0.05, clearcoat: 0.8, clearcoatRoughness: 0.12 }),
        yellow: P({ color: COL.yellow, roughness: 0.3, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08 }),
        blue: P({ color: COL.blue, roughness: 0.3, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08 }),
        chrome: S({ color: 0xe4e9f2, roughness: 0.14, metalness: 1.0, envMapIntensity: 1.35 }),
        steel: S({ color: 0xaab2c0, roughness: 0.34, metalness: 1.0, envMapIntensity: 1.0 }),
        rubber: S({ color: 0x121218, roughness: 0.85, metalness: 0.0 }),
        dark: S({ color: 0x0e0e16, roughness: 0.6, metalness: 0.2 }),
        // Vetro: velo quasi invisibile + strato additivo di soli riflessi
        glass: S({ color: 0xcfe6ff, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide }),
        glassShine: S({ color: 0x000000, roughness: 0.03, metalness: 1.0, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: 1.2 }),
        acrylic: S({ color: 0xffe9a8, roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
        dome: S({ color: 0xffffff, roughness: 0.06, metalness: 0.0, transparent: true, opacity: 0.15, depthWrite: false }),
        domeShine: S({ color: 0x000000, roughness: 0.05, metalness: 1.0, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: 1.3 }),
        seam: S({ color: 0xffffff, roughness: 0.35, metalness: 0.0 }),
      };
      this.glow = (colorHex, k) => new THREE.MeshBasicMaterial({ color: hdr(colorHex, k), toneMapped: false });
      this.neon = (r, g, b) => { const m = new THREE.MeshBasicMaterial({ toneMapped: false }); m.color.setRGB(r, g, b); return m; };
      this.glowTex = canvasTexture(128, 128, (c) => {
        const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.42)');
        g.addColorStop(0.6, 'rgba(255,255,255,0.1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g; c.fillRect(0, 0, 128, 128);
      });
    }

    mesh(geo, mat, x, y, z, parent, shadow) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x || 0, y || 0, z || 0);
      if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
      (parent || this.root).add(m);
      return m;
    }

    halo(colorHex, size, opacity, x, y, z, parent) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({
        map: this.glowTex, color: colorHex, transparent: true, opacity: opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false
      }));
      m.position.set(x, y, z);
      (parent || this.scene).add(m);
      return m;
    }

    // ----------------------------------------------------------------
    // Sala giochi: pavimento lucido, parete con neon Bauhaus, pulviscolo luminoso
    // ----------------------------------------------------------------
    buildRoom() {
      const floorTex = canvasTexture(512, 512, (c, w, h) => {
        const g = c.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
        g.addColorStop(0, '#2a2640'); g.addColorStop(0.45, '#151226'); g.addColorStop(1, '#07060d');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      });
      const floor = new THREE.Mesh(new THREE.CircleGeometry(26, 64), new THREE.MeshStandardMaterial({
        map: floorTex, roughness: 0.3, metalness: 0.3, envMapIntensity: 0.35
      }));
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.scene.add(floor);

      const wall = new THREE.Mesh(new THREE.PlaneGeometry(180, 22), new THREE.MeshStandardMaterial({ color: 0x0c0a18, roughness: 0.95, metalness: 0, envMapIntensity: 0.1 }));
      wall.position.set(0, 9, -7.2);
      this.scene.add(wall);

      // Neon: cerchio rosso, triangolo giallo, quadrato blu
      const wz = -7.0;
      const tube = (pts, closed, mat) => {
        const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], 0)), closed, 'catmullrom', 0.0);
        return new THREE.Mesh(new THREE.TubeGeometry(curve, pts.length * 14, 0.05, 8, closed), mat);
      };
      const circle = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.05, 8, 72), this.neon(2.7, 0.42, 0.16));
      circle.position.set(-4.9, 5.0, wz);
      this.scene.add(circle);
      this.halo(0xff4a22, 6.5, 0.2, -4.9, 5.0, wz - 0.05);

      const tri = tube([[0, 1.25], [1.3, -0.95], [-1.3, -0.95]], true, this.neon(2.3, 1.25, 0.12));
      tri.position.set(4.7, 5.9, wz);
      this.scene.add(tri);
      this.halo(0xffa600, 6, 0.16, 4.7, 5.7, wz - 0.05);

      const sq = tube([[-0.85, 0.85], [0.85, 0.85], [0.85, -0.85], [-0.85, -0.85]], true, this.neon(0.22, 0.62, 2.7));
      sq.position.set(5.7, 2.5, wz);
      sq.rotation.z = 0.2;
      this.scene.add(sq);
      this.halo(0x2f6bff, 5.5, 0.22, 5.7, 2.5, wz - 0.05);

      // riflessi colorati dei neon sul pavimento
      const pool = (colorHex, x, z, s, o) => {
        const p = this.halo(colorHex, s, o, x, 0.012, z);
        p.rotation.x = -Math.PI / 2;
      };
      pool(0xff4a22, -4.9, -4.6, 8, 0.1);
      pool(0x2f6bff, 5.6, -4.6, 8, 0.11);

      // pulviscolo / bokeh
      const N = 46, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
      const pal = [new THREE.Color(0xff5a6e), new THREE.Color(0xffc94d), new THREE.Color(0x6fa2ff), new THREE.Color(0xf4f1e8)];
      this.dustSeed = [];
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() * 2 - 1) * 13;
        pos[i * 3 + 1] = 0.6 + Math.random() * 8.5;
        pos[i * 3 + 2] = -6.2 + Math.random() * 4.6;
        const c = pal[i % pal.length];
        const k = 0.18 + Math.random() * 0.4;
        col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
        this.dustSeed.push(Math.random() * 6.28);
      }
      const dg = new THREE.BufferGeometry();
      dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      dg.setAttribute('color', new THREE.BufferAttribute(col, 3));
      this.dust = new THREE.Points(dg, new THREE.PointsMaterial({
        map: this.glowTex, size: 0.55, vertexColors: true, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: false
      }));
      this.scene.add(this.dust);
    }

    // ----------------------------------------------------------------
    // Cabinato
    // ----------------------------------------------------------------
    buildCabinet() {
      const M = this.mat, OX = this.OX, OZ = this.OZ, IN_X = this.IN_X, IN_Z = this.IN_Z;
      const frontZ = OZ + 0.08;

      // --- Basamento
      this.mesh(roundedBox(2 * OX + 0.02, 0.14, 2 * OZ + 0.02, 0.2), M.rubber, 0, 0.07, 0);
      const chh = this.cfg.chute;
      const shaft = { x0: chh.x0 - 0.012, x1: chh.x1 + 0.012, z0: chh.z0 - 0.012, z1: chh.z1 + 0.012 };
      this.mesh(roundedBox(2 * OX + 0.16, 1.13, 2 * OZ + 0.16, 0.26, undefined, shaft), M.red, 0, 0.705, 0);
      this.mesh(roundedBox(2 * OX + 0.2, 0.06, 2 * OZ + 0.2, 0.28, 0.02), M.cream, 0, 0.36, 0);
      this.mesh(roundedBox(2 * OX + 0.22, 0.08, 2 * OZ + 0.22, 0.29, 0.025, shaft), M.cream, 0, 1.245, 0);
      // filo di luce sotto il bordo superiore del basamento
      this.mesh(roundedBox(2 * OX + 0.19, 0.022, 2 * OZ + 0.19, 0.275, 0), this.glow(0xffd98a, 1.7), 0, 1.19, 0, null, false);

      // emblema cerchio / triangolo / quadrato sul frontale
      const ez = frontZ + 0.012;
      const emb = (geo, mat, x, rotZ) => { const m = this.mesh(geo, mat, x, 0.74, ez, null, false); if (rotZ) m.rotation.z = rotZ; return m; };
      emb(new THREE.CircleGeometry(0.15, 40), M.cream, -0.86);
      emb(new THREE.CircleGeometry(0.18, 3), M.yellow, -0.5, Math.PI / 2).position.y = 0.72;
      emb(new THREE.PlaneGeometry(0.27, 0.27), M.navy, -0.14);

      // --- Sportello e vaschetta premi (sotto lo scivolo)
      const ch = this.cfg.chute;
      const binX = (ch.x0 + ch.x1) / 2;
      this.binX = binX;
      const doorTex = canvasTexture(256, 160, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#050509'); g.addColorStop(1, '#3a2a05');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
        c.fillStyle = 'rgba(255,183,3,0.9)';
        for (let i = 0; i < 3; i++) {
          const cx = w / 2 + (i - 1) * 54, cy = 62;
          c.beginPath(); c.moveTo(cx - 16, cy - 12); c.lineTo(cx + 16, cy - 12); c.lineTo(cx, cy + 14); c.closePath(); c.fill();
        }
      });
      const doorFrame = this.mesh(roundedPanel(1.1, 0.7, 0.04, 0.1), M.cream, binX, 0.78, frontZ - 0.005);
      doorFrame.castShadow = false;
      this.mesh(new THREE.PlaneGeometry(0.94, 0.54), new THREE.MeshBasicMaterial({ map: doorTex }), binX, 0.78, frontZ + 0.04, null, false);
      const binD = 0.66, binW = 1.1;
      this.mesh(roundedBox(binW, 0.06, binD, 0.1, 0.02), M.cream, binX, 0.36, frontZ + binD / 2 - 0.04);
      this.mesh(roundedBox(binW, 0.2, 0.06, 0.03, 0.015), M.cream, binX, 0.48, frontZ + binD - 0.07);
      this.mesh(new THREE.BoxGeometry(0.05, 0.2, binD - 0.08), M.cream, binX - binW / 2 + 0.025, 0.48, frontZ + binD / 2 - 0.06);
      this.mesh(new THREE.BoxGeometry(0.05, 0.2, binD - 0.08), M.cream, binX + binW / 2 - 0.025, 0.48, frontZ + binD / 2 - 0.06);
      this.binRest = new THREE.Vector3(binX, 0.39 + 0.27 - FLOOR_Y, frontZ + binD / 2 - 0.06);
      const label = canvasTexture(512, 96, (c, w, h) => {
        c.fillStyle = hex(COL.navy); c.fillRect(0, 0, w, h);
        c.fillStyle = hex(COL.cream); c.font = '900 54px Montserrat, "Arial Black", sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('PREMI', w / 2 - 30, h / 2 + 3);
        c.fillStyle = hex(COL.yellow);
        c.beginPath(); c.moveTo(w / 2 + 96, 30); c.lineTo(w / 2 + 140, 30); c.lineTo(w / 2 + 118, 68); c.closePath(); c.fill();
      });
      this.mesh(new THREE.PlaneGeometry(0.9, 0.17), new THREE.MeshBasicMaterial({ map: label }), binX, 1.12, frontZ + 0.012, null, false).material.toneMapped = true;
      this.binLight = new THREE.PointLight(0xffc04d, 0.8, 1.5, 2);
      this.binLight.position.set(binX, 0.95, frontZ + 0.36);
      this.root.add(this.binLight);

      // --- Plancia comandi (davanti, a destra)
      const deck = new THREE.Group();
      deck.position.set(1.02, 1.07, frontZ + 0.36);
      deck.rotation.x = 0.15;
      this.root.add(deck);
      this.mesh(roundedBox(2.62, 0.1, 0.92, 0.16, 0.03), M.cream, 0, -0.08, 0, deck);
      this.mesh(roundedBox(2.5, 0.2, 0.8, 0.14), M.navy, 0, 0.02, 0, deck);
      this.mesh(roundedBox(0.14, 0.42, 0.5, 0.05), M.cream, -1.12, -0.3, -0.16, deck);
      this.mesh(roundedBox(0.14, 0.42, 0.5, 0.05), M.cream, 1.12, -0.3, -0.16, deck);
      const deckTex = canvasTexture(1024, 300, (c, w, h) => {
        c.fillStyle = hex(COL.navy); c.fillRect(0, 0, w, h);
        c.strokeStyle = 'rgba(244,241,232,0.9)'; c.lineWidth = 5;
        c.strokeRect(20, 20, w - 40, h - 40);
        c.fillStyle = 'rgba(244,241,232,0.95)';
        c.font = '800 34px Montserrat, "Arial Black", sans-serif'; c.textAlign = 'center';
        c.fillText('MUOVI', 262, 270);
        c.fillText('PESCA', 762, 270);
        // frecce attorno al joystick
        const arrow = (x, y, a) => { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(0, -16); c.lineTo(14, 8); c.lineTo(-14, 8); c.closePath(); c.fill(); c.restore(); };
        c.fillStyle = hex(COL.yellow);
        arrow(262, 52, 0); arrow(262, 212, Math.PI); arrow(150, 132, -Math.PI / 2); arrow(374, 132, Math.PI / 2);
        c.strokeStyle = hex(COL.red); c.lineWidth = 10;
        c.beginPath(); c.arc(762, 132, 92, 0, Math.PI * 2); c.stroke();
        c.fillStyle = 'rgba(244,241,232,0.5)'; c.font = '700 22px "JetBrains Mono", monospace';
        c.fillText('WASD · SPAZIO', 512, 150);
      });
      const decal = this.mesh(new THREE.PlaneGeometry(2.3, 0.67), new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.4 }), 0, 0.123, 0, deck, false);
      decal.rotation.x = -Math.PI / 2;
      decal.receiveShadow = true;

      // joystick
      const jx = -0.5615;
      this.mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.035, 28), M.chrome, jx, 0.14, 0, deck);
      this.mesh(new THREE.CylinderGeometry(0.055, 0.125, 0.1, 24), M.rubber, jx, 0.2, 0, deck);
      this.stick = new THREE.Group();
      this.stick.position.set(jx, 0.2, 0);
      deck.add(this.stick);
      this.mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.34, 14), M.chrome, 0, 0.17, 0, this.stick);
      this.mesh(new THREE.SphereGeometry(0.115, 28, 20), M.red, 0, 0.37, 0, this.stick);
      // pulsante di pesca
      const bx = 0.5615;
      this.mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.05, 32), M.chrome, bx, 0.145, 0, deck);
      this.dropMat = new THREE.MeshStandardMaterial({ color: COL.red, roughness: 0.25, metalness: 0.0, emissive: new THREE.Color(0xff3a1a), emissiveIntensity: 0.6 });
      const cap = new THREE.SphereGeometry(0.165, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2);
      cap.scale(1, 0.5, 1);
      this.dropCap = this.mesh(cap, this.dropMat, bx, 0.165, 0, deck);
      this.dropCapY = 0.165;

      // gettoniera
      const coinTex = canvasTexture(512, 200, (c, w, h) => {
        c.fillStyle = '#12121a'; c.fillRect(0, 0, w, h);
        c.fillStyle = '#05050a'; c.fillRect(70, 60, 16, 80); c.fillRect(126, 60, 16, 80);
        c.strokeStyle = '#5a5f70'; c.lineWidth = 4; c.strokeRect(52, 42, 110, 116);
        c.fillStyle = hex(COL.yellow); c.font = '800 40px Montserrat, "Arial Black", sans-serif'; c.textAlign = 'left';
        c.fillText('GIOCO', 210, 92); c.fillText('LIBERO', 210, 142);
        c.fillStyle = 'rgba(244,241,232,0.55)'; c.font = '600 20px "JetBrains Mono", monospace';
        c.fillText('∞ CREDITI', 212, 176);
      });
      this.mesh(roundedPanel(1.36, 0.56, 0.035, 0.07), M.steel, 1.25, 0.6, frontZ - 0.005).castShadow = false;
      this.mesh(new THREE.PlaneGeometry(1.24, 0.46), new THREE.MeshStandardMaterial({ map: coinTex, roughness: 0.5 }), 1.25, 0.6, frontZ + 0.034, null, false);

      // --- Teca: soglia, montanti, cornice superiore
      const pl = this.play;
      const sill = (w, d, x, z, y, h) => this.mesh(new THREE.BoxGeometry(w, h, d), M.cream, x, y, z, pl);
      sill(2 * OX, FRAME, 0, IN_Z + FRAME / 2, 0.06, 0.14); sill(2 * OX, FRAME, 0, -IN_Z - FRAME / 2, 0.06, 0.14);
      sill(FRAME, 2 * IN_Z, IN_X + FRAME / 2, 0, 0.06, 0.14); sill(FRAME, 2 * IN_Z, -IN_X - FRAME / 2, 0, 0.06, 0.14);
      sill(2 * OX, FRAME, 0, IN_Z + FRAME / 2, GLASS_H - 0.07, 0.14); sill(2 * OX, FRAME, 0, -IN_Z - FRAME / 2, GLASS_H - 0.07, 0.14);
      sill(FRAME, 2 * IN_Z, IN_X + FRAME / 2, 0, GLASS_H - 0.07, 0.14); sill(FRAME, 2 * IN_Z, -IN_X - FRAME / 2, 0, GLASS_H - 0.07, 0.14);
      const postGeo = new THREE.CylinderGeometry(0.1, 0.1, GLASS_H, 24);
      const collarGeo = new THREE.CylinderGeometry(0.128, 0.128, 0.07, 24);
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => {
        const px = sx * (IN_X + 0.07), pz = sz * (IN_Z + 0.07);
        this.mesh(postGeo, M.cream, px, GLASS_H / 2, pz, pl);
        this.mesh(collarGeo, M.chrome, px, 0.17, pz, pl);
        this.mesh(collarGeo, M.chrome, px, GLASS_H - 0.17, pz, pl);
      });

      // vetri (davanti e fianchi) e fondale illustrato
      const gh = GLASS_H - 0.26, gy = GLASS_H / 2;
      const glass = (w, x, z, ry) => {
        [M.glass, M.glassShine].forEach(mat => {
          const m = this.mesh(new THREE.PlaneGeometry(w, gh), mat, x, gy, z, pl, false);
          m.rotation.y = ry; m.renderOrder = 10;
        });
      };
      glass(2 * IN_X, 0, IN_Z + 0.02, 0);
      glass(2 * IN_Z, -IN_X - 0.02, 0, -Math.PI / 2);
      glass(2 * IN_Z, IN_X + 0.02, 0, Math.PI / 2);

      this.mesh(new THREE.BoxGeometry(2 * OX, GLASS_H, 0.1), M.red, 0, GLASS_H / 2, -IN_Z - 0.09, pl);
      const art = canvasTexture(1024, 780, (c, w, h) => this.drawBackdrop(c, w, h));
      this.mesh(new THREE.PlaneGeometry(2 * IN_X, GLASS_H), new THREE.MeshStandardMaterial({
        map: art, roughness: 0.6, metalness: 0.0, emissive: 0xffffff, emissiveMap: art, emissiveIntensity: 0.12, envMapIntensity: 0.3
      }), 0, GLASS_H / 2, -IN_Z - 0.03, pl, false).receiveShadow = true;

      // soffitto con strisce LED
      this.mesh(new THREE.BoxGeometry(2 * IN_X, 0.06, 2 * IN_Z), M.navy, 0, GLASS_H - 0.17, 0, pl, false);
      const led = this.glow(0xfff0d0, 2.4);
      this.mesh(new THREE.BoxGeometry(2 * IN_X - 0.5, 0.025, 0.045), led, 0, GLASS_H - 0.21, IN_Z - 0.12, pl, false);
      this.mesh(new THREE.BoxGeometry(2 * IN_X - 0.5, 0.025, 0.045), led, 0, GLASS_H - 0.21, -IN_Z + 0.12, pl, false);

      // --- Testata con insegna e lampadine
      const headY = GLASS_H + 0.46, headZ = OZ + 0.12;
      this.mesh(roundedBox(2 * OX + 0.24, 0.92, 2 * OZ + 0.24, 0.3), M.red, 0, headY, 0, pl);
      this.mesh(roundedBox(2 * OX + 0.3, 0.07, 2 * OZ + 0.3, 0.32, 0.02), M.cream, 0, GLASS_H + 0.06, 0, pl);
      this.mesh(roundedBox(2 * OX + 0.3, 0.07, 2 * OZ + 0.3, 0.32, 0.02), M.cream, 0, GLASS_H + 0.88, 0, pl);
      this.mesh(roundedPanel(4.14, 0.74, 0.035, 0.14), M.yellow, 0, headY, headZ - 0.005, pl).castShadow = false;
      this.signCanvas = document.createElement('canvas');
      this.signCanvas.width = 1280; this.signCanvas.height = 176;
      this.signTex = new THREE.CanvasTexture(this.signCanvas);
      this.signTex.encoding = THREE.sRGBEncoding; this.signTex.anisotropy = 8;
      this.drawSign();
      this.signMat = new THREE.MeshBasicMaterial({ map: this.signTex, toneMapped: false });
      this.signMat.color.setScalar(1.35);
      this.mesh(new THREE.PlaneGeometry(3.64, 0.5), this.signMat, 0, headY, headZ + 0.036, pl, false);
      if (document.fonts && document.fonts.load) {
        Promise.all([document.fonts.load('900 80px Montserrat'), document.fonts.load('700 30px "JetBrains Mono"')])
          .then(() => { this.drawSign(); this.signTex.needsUpdate = true; }).catch(() => {});
      }

      // lampadine a inseguimento attorno all'insegna
      const pts = [];
      const bw = 3.9, bh = 0.62, stepB = 0.205;
      for (let x = -bw / 2; x <= bw / 2 + 1e-3; x += stepB) { pts.push([x, bh / 2]); }
      for (let y = bh / 2 - stepB; y >= -bh / 2 + stepB - 1e-3; y -= stepB) { pts.push([bw / 2, y]); }
      for (let x = bw / 2; x >= -bw / 2 - 1e-3; x -= stepB) { pts.push([x, -bh / 2]); }
      for (let y = -bh / 2 + stepB; y <= bh / 2 - stepB + 1e-3; y += stepB) { pts.push([-bw / 2, y]); }
      this.bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.046, 12, 10), new THREE.MeshBasicMaterial({ toneMapped: false }), pts.length);
      const dummy = new THREE.Object3D();
      pts.forEach((p, i) => {
        dummy.position.set(p[0], headY + p[1], headZ + 0.05);
        dummy.updateMatrix();
        this.bulbs.setMatrixAt(i, dummy.matrix);
        this.bulbs.setColorAt(i, new THREE.Color(1, 1, 1));
      });
      this.bulbCount = pts.length;
      this.bulbOn = hdr(0xffc94d, 3.2);
      this.bulbAlt = hdr(0xff5a2a, 3.0);
      this.bulbOff = hdr(0x7a4a12, 1.0);
      this.bulbTmp = new THREE.Color();
      pl.add(this.bulbs);

      // tre solidi in cima: la firma Bauhaus
      const topY = GLASS_H + 0.92;
      this.mesh(new THREE.CylinderGeometry(1.5, 1.56, 0.08, 48), M.cream, 0, topY + 0.04, 0, pl);
      this.topper = new THREE.Group();
      this.topper.position.set(0, topY + 0.08, 0);
      pl.add(this.topper);
      this.mesh(new THREE.SphereGeometry(0.32, 36, 24), M.cream, -0.86, 0.32, 0, this.topper);
      this.mesh(new THREE.ConeGeometry(0.34, 0.72, 4), M.yellow, 0, 0.36, 0, this.topper).rotation.y = Math.PI / 4;
      this.mesh(roundedBox(0.52, 0.52, 0.52, 0.05), M.blue, 0.86, 0.26, 0, this.topper).rotation.y = 0.5;
    }

    drawSign() {
      const cv = this.signCanvas, c = cv.getContext('2d'), w = cv.width, h = cv.height;
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#12040a'); g.addColorStop(0.5, '#070308'); g.addColorStop(1, '#12040a');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(255,183,3,0.10)';
      for (let x = 8; x < w; x += 10) for (let y = 8; y < h; y += 10) c.fillRect(x, y, 3, 3);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = '900 104px Montserrat, "Arial Black", sans-serif';
      c.shadowColor = '#ff5a2a'; c.shadowBlur = 26;
      c.fillStyle = '#ffe9c2';
      c.fillText('JACK’S CLAW', w / 2 - 232, h / 2 + 6);
      c.shadowBlur = 0;
      // tre forme accanto al titolo
      const sx = w / 2 + 196;
      c.fillStyle = '#ff5a2a'; c.beginPath(); c.arc(sx, h / 2, 34, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffc233'; c.beginPath(); c.moveTo(sx + 96, h / 2 - 36); c.lineTo(sx + 136, h / 2 + 34); c.lineTo(sx + 56, h / 2 + 34); c.closePath(); c.fill();
      c.fillStyle = '#4d94ff'; c.fillRect(sx + 160, h / 2 - 32, 64, 64);
      c.fillStyle = '#ffc233'; c.font = '700 30px "JetBrains Mono", monospace'; c.textAlign = 'left';
      c.fillText('PESCA UN', sx + 252, h / 2 - 20);
      c.fillText('PROGETTO', sx + 252, h / 2 + 22);
    }

    drawBackdrop(c, w, h) {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#22346a'); g.addColorStop(0.6, '#1a2550'); g.addColorStop(1, '#131a3a');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      // raggi
      c.save(); c.translate(w * 0.5, h * 0.98);
      for (let i = 0; i < 26; i++) {
        c.fillStyle = i % 2 ? 'rgba(244,241,232,0.055)' : 'rgba(244,241,232,0.0)';
        c.beginPath(); c.moveTo(0, 0);
        const a0 = Math.PI + (i / 26) * Math.PI, a1 = Math.PI + ((i + 1) / 26) * Math.PI;
        c.arc(0, 0, w, a0, a1); c.closePath(); c.fill();
      }
      c.restore();
      // sole rosso con mezzatinta
      c.fillStyle = '#d93d2a'; c.beginPath(); c.arc(w * 0.3, h * 0.42, 190, 0, Math.PI * 2); c.fill();
      c.save(); c.beginPath(); c.arc(w * 0.3, h * 0.42, 190, 0, Math.PI * 2); c.clip();
      c.fillStyle = 'rgba(20,10,40,0.28)';
      for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? 8 : 0; x < w; x += 16) {
        const rr = Math.max(0, (y - h * 0.3) / (h * 0.4)) * 6;
        if (rr > 0.4) { c.beginPath(); c.arc(x, y, rr, 0, Math.PI * 2); c.fill(); }
      }
      c.restore();
      // triangolo giallo e quadrato blu
      c.fillStyle = '#eea824'; c.beginPath(); c.moveTo(w * 0.62, h * 0.2); c.lineTo(w * 0.82, h * 0.62); c.lineTo(w * 0.46, h * 0.62); c.closePath(); c.fill();
      c.fillStyle = '#3a86ff'; c.save(); c.translate(w * 0.84, h * 0.3); c.rotate(0.22); c.fillRect(-70, -70, 140, 140); c.restore();
      // archi e linee
      c.strokeStyle = 'rgba(244,241,232,0.85)'; c.lineWidth = 6;
      c.beginPath(); c.arc(w * 0.3, h * 0.42, 240, -Math.PI * 0.75, -Math.PI * 0.15); c.stroke();
      c.lineWidth = 4;
      for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(w * 0.06 + i * 16, h * 0.78); c.lineTo(w * 0.14 + i * 16, h * 0.66); c.stroke(); }
      c.fillStyle = 'rgba(244,241,232,0.55)';
      for (let y = 0; y < 5; y++) for (let x = 0; x < 9; x++) { c.beginPath(); c.arc(w * 0.72 + x * 22, h * 0.72 + y * 22, 3, 0, Math.PI * 2); c.fill(); }
    }

    // ----------------------------------------------------------------
    // Vasca: fondo sagomato, scivolo, paratie
    // ----------------------------------------------------------------
    buildPit() {
      const sim = this.sim, cfg = this.cfg, ch = cfg.chute, pl = this.play, IN_X = this.IN_X, IN_Z = this.IN_Z;
      const t = ch.wallT;

      // griglia con linee coincidenti con i bordi della buca
      const axis = (a, b, cuts, n) => {
        const out = [];
        const marks = [a].concat(cuts.filter(v => v > a && v < b)).concat([b]).sort((p, q) => p - q);
        for (let i = 0; i < marks.length - 1; i++) {
          const seg = Math.max(1, Math.round((marks[i + 1] - marks[i]) / ((b - a) / n)));
          for (let k = 0; k < seg; k++) out.push(marks[i] + (marks[i + 1] - marks[i]) * k / seg);
        }
        out.push(b);
        return out;
      };
      const xs = axis(-IN_X, IN_X, [ch.x1, ch.x1 + t, -IN_X + cfg.rimRamp.w, IN_X - cfg.rimRamp.w, ch.x1 + t + cfg.chuteRamp.w], 72);
      const zs = axis(-IN_Z, IN_Z, [ch.z0 - t, ch.z0, -IN_Z + cfg.rimRamp.w, IN_Z - cfg.rimRamp.w, ch.z0 - t - cfg.chuteRamp.w], 52);
      const pos = [], uv = [], idx = [];
      for (let j = 0; j < zs.length; j++) for (let i = 0; i < xs.length; i++) {
        // sul bordo delle paratie si campiona appena fuori, così la rampa arriva piena fino al muro
        let sx = xs[i], sz = zs[j];
        if (sx <= ch.x1 + t + 1e-6 && sz >= ch.z0 - t - 1e-6) {
          if (Math.abs(sz - (ch.z0 - t)) < 1e-6) sz -= 1e-4; else sx = ch.x1 + t + 1e-4;
        }
        const h = Math.max(0, sim.floorAt(sx, sz));
        pos.push(xs[i], h, zs[j]);
        uv.push((xs[i] + IN_X) / (2 * IN_X), 1 - (zs[j] + IN_Z) / (2 * IN_Z));
      }
      const W = xs.length;
      for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < W - 1; i++) {
        const cx = (xs[i] + xs[i + 1]) / 2, cz = (zs[j] + zs[j + 1]) / 2;
        if (cx < ch.x1 + t && cz > ch.z0 - t) continue;      // buca e paratie
        const a = j * W + i, b = a + 1, c = a + W, d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
      const fg = new THREE.BufferGeometry();
      fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      fg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      fg.setIndex(idx);
      fg.computeVertexNormals();
      const floorTex = canvasTexture(1024, 720, (c, w, h) => {
        c.fillStyle = '#121d3a'; c.fillRect(0, 0, w, h);
        c.fillStyle = 'rgba(244,241,232,0.10)';
        for (let y = 14; y < h; y += 28) for (let x = 14; x < w; x += 28) { c.beginPath(); c.arc(x, y, 3.2, 0, Math.PI * 2); c.fill(); }
        c.strokeStyle = 'rgba(255,183,3,0.5)'; c.lineWidth = 10;
        c.beginPath(); c.arc(w * 0.62, h * 0.5, 210, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = 'rgba(230,57,70,0.55)'; c.lineWidth = 10;
        c.beginPath(); c.arc(w * 0.62, h * 0.5, 120, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = 'rgba(244,241,232,0.3)'; c.lineWidth = 5;
        c.beginPath(); c.moveTo(w * 0.62 - 260, h * 0.5); c.lineTo(w * 0.62 + 260, h * 0.5); c.moveTo(w * 0.62, h * 0.5 - 260); c.lineTo(w * 0.62, h * 0.5 + 260); c.stroke();
        // bordo più chiaro dove il fondo sale
        c.strokeStyle = 'rgba(244,241,232,0.16)'; c.lineWidth = 2 * (cfg.rimRamp.w / (2 * IN_X)) * w;
        c.strokeRect(0, 0, w, h);
      });
      const floor = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.5, metalness: 0.05, envMapIntensity: 0.35 }));
      floor.receiveShadow = true;
      pl.add(floor);

      // pozzo dello scivolo
      const hazard = canvasTexture(256, 256, (c, w, h) => {
        c.fillStyle = '#101018'; c.fillRect(0, 0, w, h);
        c.fillStyle = '#c98f00';
        for (let i = -4; i < 8; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64 + 32, 0); c.lineTo(i * 64 + 32 + h, h); c.lineTo(i * 64 + h, h); c.closePath(); c.fill(); }
      });
      const hw = ch.x1 - ch.x0, hd = ch.z1 - ch.z0, hcx = (ch.x0 + ch.x1) / 2, hcz = (ch.z0 + ch.z1) / 2;
      this.chuteCenter = new THREE.Vector3(hcx, 0, hcz);
      this.mesh(new THREE.BoxGeometry(hw, ch.depth, hd), new THREE.MeshStandardMaterial({ map: hazard, side: THREE.BackSide, roughness: 0.6 }), hcx, -ch.depth / 2 + 0.001, hcz, pl, false);
      this.chuteLight = new THREE.PointLight(0xffb703, 0.6, 2.0, 2);
      this.chuteLight.position.set(hcx, -0.35, hcz);
      pl.add(this.chuteLight);

      // paratie in acrilico con bordo luminoso
      this.chuteEdge = this.glow(0xffc233, 2.6);
      sim.boxes.forEach(b => {
        const w = b.x1 - b.x0, d = b.z1 - b.z0;
        const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
        const wall = this.mesh(new THREE.BoxGeometry(w, ch.wallH, d), this.mat.acrylic, cx, ch.wallH / 2, cz, pl, false);
        wall.renderOrder = 5;
        this.mesh(new THREE.BoxGeometry(w + 0.012, 0.022, d + 0.012), this.chuteEdge, cx, ch.wallH + 0.011, cz, pl, false);
      });

      // capsule e palline condivise
      const R = 0.27;
      this.capGeo = {
        bottom: new THREE.SphereGeometry(R, 40, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        top: new THREE.SphereGeometry(R, 40, 18, 0, Math.PI * 2, 0, Math.PI / 2),
        seam: new THREE.CylinderGeometry(R + 0.008, R + 0.008, 0.04, 40, 1, true),
        plate: new THREE.CircleGeometry(R * 0.965, 40),
        filler: new THREE.SphereGeometry(1, 28, 20)
      };
      this.capMats = {}; this.plateMats = {};
      Object.keys(CAPSULE_COLORS).forEach(k => {
        this.capMats[k] = new THREE.MeshPhysicalMaterial({ color: CAPSULE_COLORS[k], roughness: 0.16, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.0 });
        this.plateMats[k] = new THREE.MeshStandardMaterial({ color: new THREE.Color(CAPSULE_COLORS[k]).multiplyScalar(0.42), roughness: 0.7, metalness: 0.0, envMapIntensity: 0.3 });
      });
      this.fillerMats = FILLER_COLORS.map(c => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.22, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.2 }));
    }

    makeCapsule(project) {
      const g = new THREE.Group(), G = this.capGeo, M = this.mat;
      const key = CAPSULE_COLORS[project.capsuleColor] ? project.capsuleColor : 'red';
      const bottom = new THREE.Mesh(G.bottom, this.capMats[key]);
      bottom.castShadow = true; bottom.receiveShadow = true;
      g.add(bottom);
      const plate = new THREE.Mesh(G.plate, this.plateMats[key]);
      plate.rotation.x = -Math.PI / 2; plate.position.y = 0.002;
      g.add(plate);
      const seam = new THREE.Mesh(G.seam, M.seam);
      g.add(seam);
      const token = new THREE.Mesh(tokenGeometry(project.shapeName, 0.105), new THREE.MeshStandardMaterial({
        color: 0xf2efe6, roughness: 0.3, metalness: 0.15, envMapIntensity: 1.0,
        flatShading: true
      }));
      token.position.y = 0.125;
      token.castShadow = true;
      g.add(token);
      const dome = new THREE.Mesh(G.top, M.dome); dome.renderOrder = 3; g.add(dome);
      const shine = new THREE.Mesh(G.top, M.domeShine); shine.renderOrder = 4; shine.scale.setScalar(1.003); g.add(shine);
      const shadowCaster = new THREE.Mesh(G.top, new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
      shadowCaster.castShadow = true; shadowCaster.renderOrder = -1;
      g.add(shadowCaster);
      return { group: g, token: token };
    }

    queueRain(capsulesOnly) {
      const projects = (window.PROJECT_REGISTRY || []).filter(p => !this.collected.has(p.id));
      projects.forEach(p => this.spawnQueue.push({ kind: 'capsule', r: 0.27, project: p }));
      if (!capsulesOnly) for (let i = 0; i < 9; i++) this.spawnQueue.push({ kind: 'filler', r: 0.115 + Math.random() * 0.04, color: i });
      // ordine casuale
      for (let i = this.spawnQueue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const tmp = this.spawnQueue[i]; this.spawnQueue[i] = this.spawnQueue[j]; this.spawnQueue[j] = tmp; }
      this.armed = false; this.armTimer = 0;
    }

    spawnNext() {
      const spec = this.spawnQueue.shift();
      const p = this.sim.dropPoint(Math.random);
      const a = Math.random() * 6.28, ha = Math.random() * 3.14;
      const body = this.sim.addBody({
        kind: spec.kind, r: spec.r, x: p.x, y: p.y, z: p.z, vy: -1.2,
        wx: (Math.random() - 0.5) * 6, wz: (Math.random() - 0.5) * 6,
        q: [Math.sin(ha / 2) * Math.cos(a), 0, Math.sin(ha / 2) * Math.sin(a), Math.cos(ha / 2)]
      });
      let mesh, token = null;
      if (spec.kind === 'capsule') {
        const c = this.makeCapsule(spec.project);
        mesh = c.group; token = c.token;
      } else {
        mesh = new THREE.Mesh(this.capGeo.filler, this.fillerMats[spec.color % this.fillerMats.length]);
        mesh.scale.setScalar(spec.r);
        mesh.castShadow = true; mesh.receiveShadow = true;
      }
      this.play.add(mesh);
      this.entities.set(body.id, { body: body, mesh: mesh, token: token, project: spec.project || null });
    }

    // ----------------------------------------------------------------
    // Carroponte e artiglio
    // ----------------------------------------------------------------
    buildGantryAndClaw() {
      const M = this.mat, pl = this.play, IN_X = this.IN_X, IN_Z = this.IN_Z, ry = this.cfg.railY;
      const railX = IN_X - 0.14;

      // binari fissi lungo z
      [-railX, railX].forEach(x => {
        const r = this.mesh(new THREE.CylinderGeometry(0.035, 0.035, 2 * IN_Z - 0.1, 14), M.chrome, x, ry + 0.07, 0, pl);
        r.rotation.x = Math.PI / 2;
        this.mesh(new THREE.BoxGeometry(0.1, 0.14, 0.12), M.steel, x, ry + 0.13, IN_Z - 0.1, pl);
        this.mesh(new THREE.BoxGeometry(0.1, 0.14, 0.12), M.steel, x, ry + 0.13, -IN_Z + 0.1, pl);
      });

      // ponte mobile (z)
      this.bridge = new THREE.Group();
      this.bridge.position.y = ry + 0.07;
      pl.add(this.bridge);
      [-0.11, 0.11].forEach(z => {
        const r = this.mesh(new THREE.CylinderGeometry(0.028, 0.028, 2 * railX, 12), M.chrome, 0, 0, z, this.bridge);
        r.rotation.z = Math.PI / 2;
      });
      [-railX, railX].forEach(x => this.mesh(roundedBox(0.16, 0.13, 0.4, 0.04), M.red, x, 0, 0, this.bridge));

      // carrello (x)
      this.carriage = new THREE.Group();
      this.carriage.position.y = ry;
      pl.add(this.carriage);
      this.mesh(roundedBox(0.56, 0.16, 0.44, 0.07), M.cream, 0, 0.07, 0, this.carriage);
      this.mesh(roundedBox(0.2, 0.14, 0.22, 0.04), M.red, 0.16, 0.2, 0, this.carriage);
      this.spool = this.mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.2, 20), M.chrome, -0.08, 0.2, 0, this.carriage);
      this.spool.rotation.z = Math.PI / 2;
      this.mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), M.steel, -0.19, 0.2, 0, this.carriage).rotation.z = Math.PI / 2;
      this.mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), M.steel, 0.03, 0.2, 0, this.carriage).rotation.z = Math.PI / 2;
      this.statusLed = this.mesh(new THREE.SphereGeometry(0.026, 12, 10), this.glow(0x58e000, 2.4), 0.21, 0.12, 0.225, this.carriage, false);
      // faretto di mira
      this.mesh(new THREE.CylinderGeometry(0.075, 0.11, 0.09, 20), M.rubber, 0.17, -0.045, 0.1, this.carriage);
      this.lampLens = this.mesh(new THREE.CircleGeometry(0.085, 20), this.glow(0xfff2c8, 3.0), 0.17, -0.092, 0.1, this.carriage, false);
      this.lampLens.rotation.x = Math.PI / 2;

      // cavo
      this.cable = this.mesh(new THREE.CylinderGeometry(0.011, 0.011, 1, 8), M.steel, 0, 0, 0, pl);
      this.cable.castShadow = false;

      // artiglio
      const g = this.sim.geo;
      this.claw = new THREE.Group();
      pl.add(this.claw);
      this.mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 8), M.steel, 0, 0.34, 0, this.claw);
      this.mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 18), M.steel, 0, 0.27, 0, this.claw);
      this.mesh(new THREE.SphereGeometry(0.135, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.red, 0, 0.14, 0, this.claw);
      this.mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.2, 28), M.chrome, 0, 0.04, 0, this.claw);
      this.mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 28), M.yellow, 0, 0.1, 0, this.claw);
      this.mesh(new THREE.CylinderGeometry(0.165, 0.15, 0.06, 28), M.steel, 0, -0.07, 0, this.claw);
      this.mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 14), M.steel, 0, -0.12, 0, this.claw);
      this.mesh(new THREE.CylinderGeometry(g.palmR, g.palmR - 0.02, 0.035, 28), M.rubber, 0, g.palmY + 0.0175, 0, this.claw);

      this.clawSpin = new THREE.Group();
      this.claw.add(this.clawSpin);
      const profile = [[0, 0], g.elbow, g.tip, g.hook];
      // dito: tubo d'acciaio piegato + snodo + puntale in gomma
      const path = new THREE.CurvePath();
      const v = profile.map(p => new THREE.Vector3(p[0], p[1], 0));
      path.add(new THREE.LineCurve3(v[0], v[1].clone().lerp(v[0], 0.12)));
      path.add(new THREE.QuadraticBezierCurve3(v[1].clone().lerp(v[0], 0.12), v[1], v[1].clone().lerp(v[2], 0.1)));
      path.add(new THREE.LineCurve3(v[1].clone().lerp(v[2], 0.1), v[2].clone().lerp(v[1], 0.12)));
      path.add(new THREE.QuadraticBezierCurve3(v[2].clone().lerp(v[1], 0.12), v[2], v[3]));
      const fingerGeo = new THREE.TubeGeometry(path, 40, 0.03, 10, false);
      this.fingerPivots = [];
      g.azimuth.forEach(az => {
        const root = new THREE.Group();
        root.rotation.y = -az;
        this.clawSpin.add(root);
        // staffa dello snodo
        this.mesh(new THREE.BoxGeometry(0.1, 0.05, 0.075), M.steel, g.pivotR - 0.03, g.pivotY, 0, root);
        const pivot = new THREE.Group();
        pivot.position.set(g.pivotR, g.pivotY, 0);
        root.add(pivot);
        this.mesh(fingerGeo, M.chrome, 0, 0, 0, pivot);
        const pin = this.mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.11, 14), M.yellow, 0, 0, 0, pivot);
        pin.rotation.x = Math.PI / 2;
        this.mesh(new THREE.SphereGeometry(0.04, 14, 12), M.chrome, g.elbow[0], g.elbow[1], 0, pivot);
        this.mesh(new THREE.SphereGeometry(0.047, 16, 12), M.rubber, g.hook[0], g.hook[1], 0, pivot);
        this.fingerPivots.push(pivot);
      });

      // mirino a terra
      this.reticleMat = new THREE.MeshBasicMaterial({ color: hdr(0xffc233, 2.2), transparent: true, opacity: 0.9, toneMapped: false, depthWrite: false, side: THREE.DoubleSide });
      this.reticle = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.325, 56), this.reticleMat);
      ring.rotation.x = -Math.PI / 2;
      this.reticle.add(ring);
      for (let i = 0; i < 4; i++) {
        const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.022), this.reticleMat);
        tick.rotation.x = -Math.PI / 2;
        const a = i * Math.PI / 2;
        tick.position.set(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4);
        tick.rotation.z = -a;
        this.reticle.add(tick);
      }
      pl.add(this.reticle);
      this.retGold = hdr(0xffc233, 2.2);
      this.retGreen = hdr(0x4dff7a, 2.4);
    }

    // ----------------------------------------------------------------
    // Luci e post-produzione
    // ----------------------------------------------------------------
    setupLights() {
      this.scene.add(new THREE.HemisphereLight(0x9aa6ff, 0x1c0e14, 0.2));

      const key = new THREE.DirectionalLight(0xfff0dc, 0.8);
      key.position.set(5.5, 11, 8.5);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.left = -5.5; key.shadow.camera.right = 5.5;
      key.shadow.camera.top = 7; key.shadow.camera.bottom = -3;
      key.shadow.camera.near = 4; key.shadow.camera.far = 26;
      key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02;
      key.shadow.radius = 3;
      key.target.position.set(0, 2.2, 0);
      this.scene.add(key); this.scene.add(key.target);
      this.keyLight = key;

      // luce interna della teca
      const inner = new THREE.PointLight(0xfff1d6, 0.85, 7.5, 1.6);
      inner.position.set(0, GLASS_H - 0.5, 0.3);
      this.play.add(inner);
      this.innerLight = inner;

      // controluce colorati (in linea con i neon)
      const rimR = new THREE.PointLight(0xff5530, 0.4, 13, 1.8); rimR.position.set(-6.5, 4.5, -5.5); this.scene.add(rimR);
      const rimB = new THREE.PointLight(0x3a7bff, 0.45, 13, 1.8); rimB.position.set(7, 3.5, -5.5); this.scene.add(rimB);

      // faretto di mira: segue il carrello, illumina e proietta l'ombra dell'artiglio
      const spot = new THREE.SpotLight(0xfff2c8, 1.5, 6, 0.24, 0.6, 1.2);
      spot.castShadow = true;
      spot.shadow.mapSize.set(1024, 1024);
      spot.shadow.camera.near = 0.3; spot.shadow.camera.far = 5;
      spot.shadow.bias = -0.002;
      this.play.add(spot);
      this.aimTarget = new THREE.Object3D();
      this.play.add(this.aimTarget);
      spot.target = this.aimTarget;
      this.aimSpot = spot;
      this.aimWarm = new THREE.Color(0xfff2c8);
      this.aimGreen = new THREE.Color(0x9dffb0);
    }

    setupPostFX() {
      this.composer = null;
      const r = this.renderer, gl2 = r.capabilities.isWebGL2;
      if (!THREE.EffectComposer || !THREE.UnrealBloomPass || !THREE.RenderPass) return;
      const floatOk = gl2 ? !!r.extensions.get('EXT_color_buffer_float') : !!(r.extensions.get('OES_texture_half_float') && r.extensions.get('EXT_color_buffer_half_float'));
      if (!floatOk) return;
      try {
        const size = r.getDrawingBufferSize(new THREE.Vector2());
        const opts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, type: THREE.HalfFloatType };
        const target = (gl2 && THREE.WebGLMultisampleRenderTarget) ? new THREE.WebGLMultisampleRenderTarget(size.x, size.y, opts) : new THREE.WebGLRenderTarget(size.x, size.y, opts);
        if (target.isWebGLMultisampleRenderTarget) target.samples = 4;
        this.composer = new THREE.EffectComposer(r, target);
        this.composer.setPixelRatio(this.pixelRatio);
        this.composer.setSize(this.width, this.height);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        this.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(this.width, this.height), 0.7, 0.6, 1.0);   // soglia 1: brillano solo le sorgenti HDR
        this.bloom.basic.toneMapped = false;     // il tone mapping è già applicato nel RenderPass
        this.composer.addPass(this.bloom);
      } catch (e) {
        console.warn('Claw machine: bloom non disponibile, uso il rendering diretto.', e);
        this.composer = null;
      }
    }

    // ----------------------------------------------------------------
    // HUD e comandi
    // ----------------------------------------------------------------
    buildHUD() {
      const stage = this.container.parentElement;
      if (!stage) return;
      const old = stage.querySelector('.crane-hud');
      if (old) old.remove();
      const hud = document.createElement('div');
      hud.className = 'crane-hud';
      hud.innerHTML =
        '<div class="crane-status" id="crane-status-hud" role="status" aria-live="polite"></div>' +
        '<div class="crane-collection" aria-label="Capsule vinte"></div>' +
        '<div class="crane-orbit-hint">Trascina per girare attorno alla macchina</div>';
      stage.appendChild(hud);
      this.statusEl = hud.querySelector('.crane-status');
      this.collectionEl = hud.querySelector('.crane-collection');
      this.hintEl = hud.querySelector('.crane-orbit-hint');
      this.dots = new Map();
      (window.PROJECT_REGISTRY || []).forEach(p => {
        const d = document.createElement('span');
        d.className = 'crane-dot';
        d.style.setProperty('--dot', hex(CAPSULE_COLORS[p.capsuleColor] || COL.red));
        d.title = p.title;
        this.collectionEl.appendChild(d);
        this.dots.set(p.id, d);
      });
    }

    setStatus(text, sticky) {
      if (!this.statusEl) return;
      this.statusEl.textContent = text;
      this.statusEl.classList.add('visible');
      this.statusTimer = sticky ? 3.2 : 2.6;
    }

    updateStatusUI(text) { this.setStatus(text); }

    isInteractive() {
      if (!this.visible || !this.started) return false;
      const viewR = document.getElementById('channel-view-r');
      if (viewR && !viewR.classList.contains('active')) return false;
      if (document.querySelector('.modal-overlay.active, .fullscreen-catalog-modal.active, .flute-modal-overlay.open')) return false;
      if (window.claw2d && window.claw2d.hasFocus()) return false;   // la macchina 2D è al centro dello schermo
      return true;
    }

    setupEvents() {
      window.addEventListener('resize', () => this.onResize());

      const map = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
      window.addEventListener('keydown', (e) => {
        this.userActive = true;
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (!this.isInteractive() || !this.inFocus) return;
        if (map[e.code]) {
          if (!this.keys[map[e.code]] && window.audioEngine) window.audioEngine.playJoystickClack();
          this.keys[map[e.code]] = true;
          e.preventDefault();
        } else if (e.code === 'Space' || e.code === 'Enter') {
          // Spazio e Invio restano a pulsanti e link fuori dalla macchina
          if ((tag === 'BUTTON' || tag === 'A') && !(e.target.closest && e.target.closest('.crane-standalone-stage'))) return;
          e.preventDefault();
          if (!e.repeat) this.pressDrop();
        }
      });
      window.addEventListener('keyup', (e) => { if (map[e.code]) this.keys[map[e.code]] = false; });
      window.addEventListener('blur', () => { this.keys.up = this.keys.down = this.keys.left = this.keys.right = false; });

      const bind = (id, key) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const on = (e) => {
          e.preventDefault();
          this.userActive = true;
          this.keys[key] = true;
          btn.classList.add('held');
          if (btn.setPointerCapture && e.pointerId !== undefined) { try { btn.setPointerCapture(e.pointerId); } catch (err) {} }
          if (window.audioEngine) window.audioEngine.playJoystickClack();
        };
        const off = () => { this.keys[key] = false; btn.classList.remove('held'); };
        btn.addEventListener('pointerdown', on);
        btn.addEventListener('pointerup', off);
        btn.addEventListener('pointercancel', off);
        btn.addEventListener('lostpointercapture', off);
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
      };
      bind('crane-btn-up', 'up'); bind('crane-btn-down', 'down'); bind('crane-btn-left', 'left'); bind('crane-btn-right', 'right');
      this.dropBtn = document.getElementById('crane-btn-drop');
      if (this.dropBtn) this.dropBtn.addEventListener('click', () => { this.userActive = true; this.pressDrop(); });

      // orbita della camera trascinando sul vetro
      const el = this.renderer.domElement, o = this.orbit;
      el.addEventListener('pointerdown', (e) => {
        this.userActive = true;
        o.drag = { x: e.clientX, y: e.clientY, yaw: o.tyaw, pitch: o.tpitch, touch: e.pointerType === 'touch' };
        el.style.cursor = 'grabbing';
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
      });
      el.addEventListener('pointermove', (e) => {
        if (!o.drag) return;
        o.tyaw = THREE.MathUtils.clamp(o.drag.yaw - (e.clientX - o.drag.x) * 0.006, -0.8, 0.8);
        if (!o.drag.touch) o.tpitch = THREE.MathUtils.clamp(o.drag.pitch + (e.clientY - o.drag.y) * 0.004, 0.04, 0.62);
        if (this.hintEl && Math.abs(e.clientX - o.drag.x) > 12) this.hintEl.classList.add('gone');
      });
      const end = () => { o.drag = null; el.style.cursor = 'grab'; };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(en => { this.visible = en.isIntersecting && en.intersectionRatio > 0.05; this.inFocus = en.intersectionRatio > 0.45; });
        }, { threshold: [0, 0.05, 0.25, 0.45, 0.6, 0.8] });
        io.observe(this.container);
      } else {
        this.visible = true; this.inFocus = true;
      }
    }

    pressDrop() {
      if (!this.isInteractive() || this.pendingWin || !this.armed) return;
      if (this.sim.pressDrop()) {
        this.dropPress = 1;
        if (window.audioEngine) window.audioEngine.playClawDrop();
      }
    }

    onResize() {
      if (!this.container || !this.renderer) return;
      const w = this.container.clientWidth, h = this.container.clientHeight;
      if (!w || !h) return;
      this.width = w; this.height = h;
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(w, h);
      if (this.composer) { this.composer.setPixelRatio(this.pixelRatio); this.composer.setSize(w, h); }
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    // ----------------------------------------------------------------
    // Eventi della simulazione
    // ----------------------------------------------------------------
    onSimEvent(type, data) {
      const A = this.userActive ? window.audioEngine : null;
      switch (type) {
        case 'state':
          if (data === 'DROP') this.setStatus(STATUS.drop);
          else if (data === 'CLOSE') this.setStatus(STATUS.close);
          else if (data === 'CARRY') this.setStatus(STATUS.carry);
          break;
        case 'landed': if (A && A.playClack) A.playClack(0.5); break;
        case 'grip':
          this.setStatus(data ? STATUS.gripOk : STATUS.gripNo);
          if (A) A.playGrab();
          break;
        case 'miss': this.setStatus(STATUS.miss, true); if (A && A.playMiss) A.playMiss(); break;
        case 'slip': this.setStatus(STATUS.slip, true); if (A && A.playMiss) A.playMiss(); break;
        case 'release': if (A) A.playTick(); break;
        case 'ready': if (!this.pendingWin) this.setStatus(STATUS.ready, true); break;
        case 'chute': this.onChute(data); break;
      }
    }

    onChute(body) {
      const ent = this.entities.get(body.id);
      if (!ent) return;
      if (this.armed && body.kind === 'capsule' && !this.pendingWin && ent.project) {
        // premio!
        this.pendingWin = { ent: ent, t: 0, opened: false, from: ent.mesh.position.clone(), spin: new THREE.Vector3(6 + Math.random() * 3, 0, (Math.random() - 0.5) * 4) };
        this.collected.add(ent.project.id);
        const dot = this.dots && this.dots.get(ent.project.id);
        if (dot) dot.classList.add('won');
        this.setStatus(STATUS.win, true);
        this.celebrate = 2.2;
        this.spawnConfetti();
        if (this.userActive && window.audioEngine) {
          if (window.audioEngine.playWin) window.audioEngine.playWin(); else window.audioEngine.playChuteDrop();
        }
        return;
      }
      // tutto il resto torna nella vasca dall'alto
      if (this.armed && body.kind === 'filler') this.setStatus(STATUS.filler, true);
      ent.mesh.visible = false;
      this.respawns.push({ ent: ent, t: 0.7 });
    }

    spawnConfetti() {
      if (this.reducedMotion) return;
      const N = 90;
      const geo = new THREE.PlaneGeometry(0.07, 0.11);
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false });
      const im = new THREE.InstancedMesh(geo, mat, N);
      const pal = [hdr(COL.red, 1.6), hdr(COL.yellow, 1.6), hdr(COL.blue, 1.8), hdr(COL.cream, 1.3)];
      const parts = [];
      for (let i = 0; i < N; i++) {
        im.setColorAt(i, pal[i % pal.length]);
        const a = Math.random() * Math.PI * 2, s = 1.2 + Math.random() * 2.6;
        parts.push({
          p: new THREE.Vector3(this.binX + (Math.random() - 0.5) * 0.5, 1.0, this.OZ + 0.5),
          v: new THREE.Vector3(Math.cos(a) * s * 0.8, 3.2 + Math.random() * 3.4, 0.6 + Math.abs(Math.sin(a)) * s),
          r: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
          w: new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14)
        });
      }
      if (this.confetti) { this.root.remove(this.confetti.mesh); this.confetti.mesh.geometry.dispose(); this.confetti.mesh.material.dispose(); }
      this.root.add(im);
      this.confetti = { mesh: im, parts: parts, t: 0, dummy: new THREE.Object3D() };
    }

    // Chiamato dal modal quando si chiude la capsula vinta
    resetForNewGame() {
      if (this.pendingWin) {
        const ent = this.pendingWin.ent;
        this.play.remove(ent.mesh);
        this.entities.delete(ent.body.id);
        const i = this.sim.bodies.indexOf(ent.body);
        if (i >= 0) this.sim.bodies.splice(i, 1);
        this.pendingWin = null;
      }
      this.keys.up = this.keys.down = this.keys.left = this.keys.right = false;
      let left = 0;
      this.entities.forEach(e => { if (e.project) left++; });
      if (left === 0 && !this.spawnQueue.length) {
        this.collected.clear();
        if (this.dots) this.dots.forEach(d => d.classList.remove('won'));
        this.queueRain(true);
        this.setStatus(STATUS.refill, true);
      } else {
        this.setStatus(STATUS.ready, true);
      }
    }

    // ----------------------------------------------------------------
    // Ciclo principale
    // ----------------------------------------------------------------
    loop(now) {
      requestAnimationFrame(this.loop);
      const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 0.016);
      this.last = now;
      if (!this.visible || document.hidden || !this.container.clientWidth) return;
      if (this.container.clientWidth !== this.width || this.container.clientHeight !== this.height) this.onResize();

      if (!this.started) {
        this.started = true;
        this.queueRain(false);
      }
      this.time += dt;
      this.update(dt);

      const t0 = performance.now();
      if (this.composer) this.composer.render(dt); else this.renderer.render(this.scene, this.camera);
      this.watchPerformance(dt, performance.now() - t0);
    }

    // Se la macchina non regge, si rinuncia prima al bloom, poi alla risoluzione piena
    watchPerformance(dt) {
      const p = this.perf;
      if (p.level >= 2 || this.time < 2.5) return;
      p.frames++; p.acc += dt;
      if (p.frames < 90) return;
      const avg = p.acc / p.frames;
      p.frames = 0; p.acc = 0;
      if (avg > 0.034) {
        p.level++;
        if (p.level === 1 && this.composer) { this.composer = null; }
        else { p.level = 2; this.pixelRatio = 1; this.keyLight.shadow.mapSize.set(1024, 1024); if (this.keyLight.shadow.map) { this.keyLight.shadow.map.dispose(); this.keyLight.shadow.map = null; } this.onResize(); }
      }
    }

    update(dt) {
      const sim = this.sim, c = sim.claw;

      // pioggia di capsule e rientri
      if (this.spawnQueue.length) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) { this.spawnNext(); this.spawnTimer = 0.1; }
      } else if (!this.armed) {
        this.armTimer += dt;
        if ((this.armTimer > 0.6 && sim.allAsleep()) || this.armTimer > 5) this.armed = true;
      }
      for (let i = this.respawns.length - 1; i >= 0; i--) {
        const r = this.respawns[i];
        r.t -= dt;
        if (r.t <= 0) {
          const p = sim.dropPoint(Math.random);
          sim.respawn(r.ent.body, p.x, p.y, p.z);
          r.ent.mesh.visible = true;
          this.respawns.splice(i, 1);
        }
      }

      // comandi → simulazione
      const interactive = this.isInteractive() && !this.pendingWin;
      sim.input.x = interactive ? (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0) : 0;
      sim.input.z = interactive ? (this.keys.down ? 1 : 0) - (this.keys.up ? 1 : 0) : 0;
      sim.update(dt);

      // suoni
      const A = this.userActive ? window.audioEngine : null;
      if (A) {
        if (A.setMotor) A.setMotor(c.moving);
        if (A.playClack) for (let i = 0; i < sim.impacts.length && i < 3; i++) A.playClack(Math.min(1, sim.impacts[i].speed / 5));
      }

      // corpi
      this.entities.forEach(e => {
        if (this.pendingWin && this.pendingWin.ent === e) return;
        const b = e.body;
        if (!b.active) return;
        e.mesh.position.set(b.x, b.y, b.z);
        e.mesh.quaternion.set(b.qx, b.qy, b.qz, b.qw);
        if (e.token) e.token.rotation.y += dt * 1.1;
      });

      this.syncClaw(dt);
      this.updateWin(dt);
      this.updateDecor(dt);
      this.updateCamera(dt);

      if (this.statusEl && this.statusTimer > 0) {
        this.statusTimer -= dt;
        if (this.statusTimer <= 0 && c.state === 'IDLE') this.statusEl.classList.remove('visible');
        else if (this.statusTimer <= 0) this.statusTimer = 0.2;
      }
      if (this.dropBtn) {
        const ready = c.state === 'IDLE' && this.armed && !this.pendingWin;
        if (this.dropBtn.disabled === ready) { this.dropBtn.disabled = !ready; this.dropBtn.classList.toggle('busy', !ready); }
      }
    }

    syncClaw(dt) {
      const sim = this.sim, c = sim.claw, ry = this.cfg.railY;
      this.bridge.position.z = c.cz;
      this.carriage.position.set(c.cx, ry, c.cz);

      // artiglio orientato lungo il cavo
      if (!this._m) { this._m = new THREE.Matrix4(); this._vx = new THREE.Vector3(); this._vy = new THREE.Vector3(); this._vz = new THREE.Vector3(); this._up = new THREE.Vector3(0, 1, 0); this._a = new THREE.Vector3(); this._b = new THREE.Vector3(); }
      this._vx.set(c.ex[0], c.ex[1], c.ex[2]); this._vy.set(c.ey[0], c.ey[1], c.ey[2]); this._vz.set(c.ez[0], c.ez[1], c.ez[2]);
      this._m.makeBasis(this._vx, this._vy, this._vz);
      this.claw.quaternion.setFromRotationMatrix(this._m);
      this.claw.position.set(c.hub.x, c.hub.y, c.hub.z);
      this.clawSpin.rotation.y = -c.psi;
      for (let i = 0; i < 3; i++) this.fingerPivots[i].rotation.z = c.theta;

      // cavo dal tamburo all'occhiello
      this._a.set(c.cx - 0.08, ry + 0.12, c.cz);
      this._b.set(c.hub.x + c.ey[0] * 0.42, c.hub.y + c.ey[1] * 0.42, c.hub.z + c.ey[2] * 0.42);
      const len = this._a.distanceTo(this._b);
      this.cable.position.copy(this._a).add(this._b).multiplyScalar(0.5);
      this.cable.scale.set(1, Math.max(0.02, len), 1);
      this.cable.quaternion.setFromUnitVectors(this._up, this._b.clone().sub(this._a).normalize());

      // luce di mira e mirino
      const aim = sim.aim();
      const locked = aim.body && aim.dist < 0.15 && c.state === 'IDLE';
      this.aimSpot.position.set(c.cx + 0.17, ry - 0.1, c.cz + 0.1);
      this.aimTarget.position.set(c.hub.x, 0, c.hub.z);
      this.aimSpot.color.lerp(locked ? this.aimGreen : this.aimWarm, Math.min(1, dt * 10));
      const fh = sim.floorAt(c.hub.x, c.hub.z);
      const show = fh > -1 && (c.state === 'IDLE' || c.state === 'DROP');
      this.reticle.visible = show;
      if (show) {
        this.reticle.position.set(c.hub.x, fh + 0.014, c.hub.z);
        const pulse = locked ? 1 + Math.sin(this.time * 9) * 0.06 : 1;
        this.reticle.scale.setScalar(pulse);
        this.reticle.rotation.y = this.time * 0.6;
        this.reticleMat.color.lerp(locked ? this.retGreen : this.retGold, Math.min(1, dt * 12));
        this.reticleMat.opacity = c.state === 'IDLE' ? 0.9 : 0.45;
      }
      this.statusLed.material.color.copy(c.state === 'IDLE' ? this.retGreen : this.retGold);

      // joystick e pulsante sulla plancia
      const tx = -sim.input.x * 0.36, tz = sim.input.z * 0.36, k = Math.min(1, dt * 16);
      this.stick.rotation.z += (tx - this.stick.rotation.z) * k;
      this.stick.rotation.x += (tz - this.stick.rotation.x) * k;
      this.dropPress = Math.max(0, this.dropPress - dt * 4);
      this.dropCap.position.y = this.dropCapY - this.dropPress * 0.035;
      const ready = c.state === 'IDLE' && this.armed && !this.pendingWin;
      this.dropMat.emissiveIntensity = ready ? 0.9 + Math.sin(this.time * 4.2) * 0.55 : 0.12;
    }

    // La capsula vinta rotola fuori dallo sportello nella vaschetta, poi si apre la scheda
    updateWin(dt) {
      const w = this.pendingWin;
      if (!w) return;
      w.t += dt;
      const m = w.ent.mesh, rest = this.binRest;
      const inside = new THREE.Vector3(rest.x, rest.y + 0.1, this.OZ - 0.35);
      const T1 = 0.32, T2 = 0.75;
      if (w.t < T1) {
        const k = w.t / T1;
        m.position.lerpVectors(w.from, inside, k * k);
      } else if (w.t < T2) {
        const k = (w.t - T1) / (T2 - T1);
        m.position.lerpVectors(inside, rest, 1 - (1 - k) * (1 - k));
        m.position.y += Math.sin(k * Math.PI) * 0.16;
      } else {
        const k = Math.min(1, (w.t - T2) / 0.4);
        m.position.copy(rest);
        m.position.y += Math.abs(Math.sin(k * Math.PI * 2)) * 0.05 * (1 - k);
      }
      if (w.t < T2 + 0.4) {
        const slow = w.t < T2 ? 1 : Math.max(0, 1 - (w.t - T2) / 0.4);
        m.rotateX(w.spin.x * dt * slow); m.rotateZ(w.spin.z * dt * slow);
      }
      if (!w.opened && w.t > 1.45) {
        w.opened = true;
        window.clawPrizeOwner = this;
        if (window.openCapsuleModal) window.openCapsuleModal(w.ent.project);
      }
      // se il modal non esiste o non si apre, la partita non deve restare bloccata
      if (w.opened && w.t > 2.6 && !document.querySelector('.modal-overlay.active')) this.resetForNewGame();
    }

    updateDecor(dt) {
      const t = this.time, fast = this.celebrate > 0;
      if (this.celebrate > 0) this.celebrate -= dt;

      // lampadine: inseguimento, più rapido e bicolore quando si vince
      const step = Math.floor(t * (fast ? 16 : 5.5));
      if (step !== this._bulbStep) {
        this._bulbStep = step;
        for (let i = 0; i < this.bulbCount; i++) {
          const ph = (i + step) % 4;
          let col = this.bulbOff;
          if (fast) col = ((i + step) % 2) ? this.bulbOn : this.bulbAlt;
          else if (ph === 0 || ph === 1) col = this.bulbOn;
          else if (ph === 2) col = this.bulbTmp.copy(this.bulbOn).multiplyScalar(0.3);
          this.bulbs.setColorAt(i, col);
        }
        this.bulbs.instanceColor.needsUpdate = true;
      }
      this.signMat.color.setScalar(fast ? 1.5 + Math.sin(t * 22) * 0.35 : 1.3 + Math.sin(t * 1.7) * 0.06);
      this.chuteLight.intensity = 0.55 + Math.sin(t * 3.1) * 0.15 + (fast ? 1.0 : 0);
      this.binLight.intensity = this.pendingWin ? 2.2 : 0.8;
      this.innerLight.intensity = 0.85 + (fast ? Math.sin(t * 20) * 0.2 : 0);
      if (!this.reducedMotion) this.topper.rotation.y = Math.sin(t * 0.4) * 0.12;

      // pulviscolo
      if (!this.reducedMotion && this.dust) {
        const p = this.dust.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
          p.array[i * 3 + 1] += dt * (0.06 + (i % 5) * 0.012);
          p.array[i * 3] += Math.sin(t * 0.3 + this.dustSeed[i]) * dt * 0.05;
          if (p.array[i * 3 + 1] > 9.4) p.array[i * 3 + 1] = 0.5;
        }
        p.needsUpdate = true;
      }

      // coriandoli
      const cf = this.confetti;
      if (cf) {
        cf.t += dt;
        cf.parts.forEach((q, i) => {
          q.v.y -= 9.5 * dt; q.v.multiplyScalar(1 - 1.4 * dt);
          q.p.addScaledVector(q.v, dt);
          if (q.p.y < 0.03) { q.p.y = 0.03; q.v.set(0, 0, 0); q.w.set(0, 0, 0); }
          q.r.addScaledVector(q.w, dt);
          cf.dummy.position.copy(q.p);
          cf.dummy.rotation.set(q.r.x, q.r.y, q.r.z);
          const s = cf.t > 3.4 ? Math.max(0, 1 - (cf.t - 3.4) / 0.8) : 1;
          cf.dummy.scale.setScalar(s);
          cf.dummy.updateMatrix();
          cf.mesh.setMatrixAt(i, cf.dummy.matrix);
        });
        cf.mesh.instanceMatrix.needsUpdate = true;
        if (cf.t > 4.2) { this.root.remove(cf.mesh); cf.mesh.geometry.dispose(); cf.mesh.material.dispose(); this.confetti = null; }
      }
    }

    updateCamera(dt) {
      const o = this.orbit, cam = this.camera;
      const k = dt > 0 ? Math.min(1, dt * 7) : 1;
      o.yaw += (o.tyaw - o.yaw) * k;
      o.pitch += (o.tpitch - o.pitch) * k;
      const sway = (this.reducedMotion || o.drag) ? 0 : Math.sin(this.time * 0.22) * 0.035;

      // inquadratura: la macchina deve entrare sia in altezza sia in larghezza
      const aspect = this.width / Math.max(1, this.height);
      const fov = aspect < 0.9 ? 40 : 30;
      if (cam.fov !== fov || cam.aspect !== aspect) { cam.fov = fov; cam.aspect = aspect; cam.updateProjectionMatrix(); }
      const half = Math.tan(THREE.MathUtils.degToRad(fov / 2));
      const dist = Math.max(3.75 / half, 3.5 / (half * aspect)) + 1.2;
      const target = this._target || (this._target = new THREE.Vector3(0, 3.25, 0.15));
      const yaw = o.yaw + sway, cp = Math.cos(o.pitch);
      cam.position.set(target.x + Math.sin(yaw) * cp * dist, target.y + Math.sin(o.pitch) * dist, target.z + Math.cos(yaw) * cp * dist);
      cam.lookAt(target);
    }
  }

  window.initCraneMachine = function () {
    try {
      window.craneMachine = new ClawMachine('crane-canvas-container');
    } catch (e) {
      console.error('Claw machine: inizializzazione fallita', e);
    }
  };
})();
