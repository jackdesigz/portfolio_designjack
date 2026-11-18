/**
 * designjack — Avatar 3D low-poly (Three.js r128)
 *
 * Testa fluttuante a facce piatte di Jacopo, costruita proceduralmente
 * (nessun modello esterno): capelli shag mossi con frangia, occhiali tondi,
 * dilatatore nero all'orecchio, filo di barba.
 *
 * Comportamento:
 * - fluttua e segue il cursore con testa e sguardo
 * - sbatte le palpebre
 * - trascinandola gira su se stessa e torna frontale con una molla
 * - cliccandola parla: fumetto con testo a macchina da scrivere e bocca animata
 */

(function () {
  const PALETTE = {
    skin: 0xeab894,
    stubble: 0xd29f80,
    hair: 0x2b1d15,
    hairLight: 0x3e2b1f,
    brow: 0x22170f,
    lips: 0xd6927e,
    mouth: 0x3a1512,
    eyeWhite: 0xefe5d8,
    iris: 0x3a2313,
    pupil: 0x0d0a08,
    lash: 0x1c130d,
    frame: 0x141414,
    plug: 0x111111
  };

  const MESSAGES = [
    'Ciao! Sono Jacopo, designjack.',
    'Disegno grafica, interfacce e cose in 3D.',
    'Sfoglia i progetti appesi al filo qui sotto.',
    'Oppure pesca una capsula dalla claw machine!',
    'Psst… trascinami per farmi girare la testa.'
  ];

  // Rumore deterministico: stessa posizione → stesso valore (niente crepe nelle cuciture)
  function hash3(x, y, z) {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  }
  const q = (n) => Math.round(n * 1000) / 1000;

  function deform(geo, fn) {
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      fn(v);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    return geo;
  }

  // Colore per faccia (look low-poly): fn(centroide, colore, indiceFaccia)
  function colorFaces(geo, fn) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    const cen = new THREE.Vector3();
    for (let i = 0; i < pos.count; i += 3) {
      cen.set(
        (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3,
        (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3,
        (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3
      );
      fn(cen, c, i / 3);
      for (let k = 0; k < 3; k++) {
        colors[(i + k) * 3] = c.r;
        colors[(i + k) * 3 + 1] = c.g;
        colors[(i + k) * 3 + 2] = c.b;
      }
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }

  function flatMat(color, extra) {
    return new THREE.MeshStandardMaterial(Object.assign({
      color, flatShading: true, roughness: 0.85, metalness: 0
    }, extra || {}));
  }

  class HeroAvatar {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;

      this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this.spin = 0;
      this.spinVel = 0;
      this.drag = null;
      this.blink = { t: 0, next: 1.5 + Math.random() * 2, closing: 0 };
      this.talk = { open: 0, target: 0 };
      this.mood = 0;           // 0 neutro → 1 sorpreso (sopracciglia alzate)
      this.msgIndex = 0;
      this.typing = null;
      this.visible = true;
      this.clock = new THREE.Clock();
      this.ray = new THREE.Raycaster();

      this.init();
    }

    init() {
      const w = this.container.clientWidth || 360;
      const h = this.container.clientHeight || 320;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 50);
      this.camera.position.set(-0.62, 0.12, 6.9);   // testa spostata a destra: a sinistra c'è il fumetto

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);

      // Luci morbide e piatte, da gioco DS: poco contrasto, sfaccettature leggibili
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8c7c6e, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 0.42);
      key.position.set(-1.5, 2, 5);
      this.scene.add(key);
      const fill = new THREE.DirectionalLight(0xffe2b8, 0.18);
      fill.position.set(3, -1, 3);
      this.scene.add(fill);
      const rim = new THREE.DirectionalLight(0xcfd8e8, 0.15);
      rim.position.set(2, 2, -4);
      this.scene.add(rim);

      this.root = new THREE.Group();   // fluttuazione
      this.head = new THREE.Group();   // rotazione testa
      this.root.add(this.head);
      this.scene.add(this.root);

      this.buildSkull();
      this.buildFace();
      this.buildHair();
      this.buildGlasses();
      this.buildShadow();

      this.buildBubble();
      this.setupEvents();
      this.animate();
    }

    /* ------------------------------------------------------------------ */
    /* Cranio e viso                                                       */
    /* ------------------------------------------------------------------ */
    buildSkull() {
      const geo = new THREE.SphereGeometry(1, 16, 12);
      deform(geo, (v) => {
        const ux = v.x, uy = v.y, uz = v.z;
        let X = ux * 0.8, Y = uy * 1.24, Z = uz * 0.95;
        if (uz < 0) Z *= 1.06;                        // nuca
        if (uy < 0.15) {                              // mandibola che si stringe
          const t = Math.min(1, (0.15 - uy) / 1.15);
          X *= 1 - 0.3 * t * t;
          if (uz < 0) Z *= 1 - 0.55 * t;
        }
        if (uy < 0 && uz > 0) {                       // mento in avanti, viso lungo
          Z *= 1 + 0.55 * Math.pow(-uy, 1.6);
        }
        if (Y < -1.16) Y = -1.16 + (Y + 1.16) * 0.4;     // base del mento piatta
        if (uz > 0) {
          Z *= 0.93;
          // zigomi
          X *= 1 + 0.05 * Math.exp(-((uy + 0.05) ** 2) / 0.03) * uz;
          // arcata sopraccigliare
          Z += 0.035 * Math.exp(-((Y - 0.3) ** 2) / 0.012) * uz ** 4;
          // orbite
          for (const s of [-1, 1]) {
            const d2 = (X - s * 0.3) ** 2 + (Y - 0.1) ** 2;
            Z -= 0.05 * Math.exp(-d2 / 0.014) * uz;
          }
        }
        v.set(X, Y, Z);
      });

      const skin = new THREE.Color(PALETTE.skin);
      const stub = new THREE.Color(PALETTE.stubble);
      const g = colorFaces(geo, (p, c) => {
        c.copy(skin);
        // filo di barba: baffetto e mento
        const moustache = Math.abs(p.x) < 0.24 && p.y < -0.44 && p.y > -0.56 && p.z > 0.5;
        const chin = p.y < -0.82 && p.z > 0.25 && Math.abs(p.x) < 0.42;
        const jaw = p.y < -0.6 && p.z > 0 && Math.abs(p.x) > 0.36;
        if (moustache || chin) c.lerp(stub, 0.25);
        else if (jaw) c.lerp(stub, 0.12);
        const j = (hash3(q(p.x), q(p.y), q(p.z)) - 0.5) * 0.07;
        c.offsetHSL(0, 0, j);
      });

      this.skull = new THREE.Mesh(g, flatMat(0xffffff, { vertexColors: true, roughness: 0.75 }));
      this.head.add(this.skull);
      this.skull.updateMatrixWorld(true);
    }

    surfZ(x, y) {
      this.ray.set(new THREE.Vector3(x, y, 5), new THREE.Vector3(0, 0, -1));
      const hit = this.ray.intersectObject(this.skull);
      return hit.length ? hit[0].point.z : 0.4;
    }

    surfX(side, y, z) {
      this.ray.set(new THREE.Vector3(side * 5, y, z), new THREE.Vector3(-side, 0, 0));
      const hit = this.ray.intersectObject(this.skull);
      return hit.length ? hit[0].point.x : side * 0.8;
    }

    buildFace() {
      const skinMat = flatMat(PALETTE.skin, { roughness: 0.75 });
      this.eyeY = 0.1;
      this.eyeX = 0.31;
      this.eyes = [];

      // Occhi: bulbo schiacciato + iride + palpebra superiore (un po' socchiusa)
      for (const s of [-1, 1]) {
        const x = s * this.eyeX;
        const z = this.surfZ(x, this.eyeY);
        const eye = new THREE.Group();
        eye.position.set(x, this.eyeY, z - 0.02);
        const shape = new THREE.Group();
        shape.scale.set(1.35, 0.62, 0.42);
        eye.add(shape);

        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), flatMat(PALETTE.eyeWhite, { roughness: 0.4 }));
        shape.add(ball);

        const front = 0.14 * 0.42 + 0.004;
        const iris = new THREE.Group();
        iris.position.z = front;
        const irisDisc = new THREE.Mesh(new THREE.CircleGeometry(0.088, 8), new THREE.MeshBasicMaterial({ color: PALETTE.iris }));
        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.04, 8), new THREE.MeshBasicMaterial({ color: PALETTE.pupil }));
        pupil.position.z = 0.002;
        const glint = new THREE.Mesh(new THREE.CircleGeometry(0.014, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        glint.position.set(-0.022, 0.022, 0.004);
        iris.add(irisDisc, pupil, glint);
        eye.add(iris);

        const lidPivot = new THREE.Group();
        shape.add(lidPivot);
        const lid = new THREE.Mesh(
          new THREE.SphereGeometry(0.152, 12, 5, 0, Math.PI * 2, 0, Math.PI / 2),
          skinMat
        );
        const lash = new THREE.Mesh(
          new THREE.TorusGeometry(0.152, 0.026, 4, 10, Math.PI),
          flatMat(PALETTE.lash)
        );
        lash.rotation.x = Math.PI / 2;
        lidPivot.add(lid, lash);

        // palpebra inferiore sottile
        const lower = new THREE.Mesh(
          new THREE.SphereGeometry(0.148, 12, 3, 0, Math.PI * 2, Math.PI * 0.72, Math.PI * 0.28),
          skinMat
        );
        shape.add(lower);

        this.head.add(eye);
        this.eyes.push({ group: eye, iris, lidPivot });
      }

      // Sopracciglia folte e dritte
      this.brows = [];
      for (const s of [-1, 1]) {
        const x = s * 0.32;
        const y = 0.32;
        const browGeo = deform(new THREE.BoxGeometry(0.4, 0.09, 0.06, 2, 1, 1), (v) => {
          if (v.x * s > 0.1) { v.y = v.y * 0.45 - 0.025; }   // coda sottile e più bassa
          else if (v.x * s < -0.1) { v.y *= 1.1; }
        });
        const brow = new THREE.Mesh(browGeo, flatMat(PALETTE.brow));
        brow.position.set(x, y, this.surfZ(x, y) + 0.005);
        brow.rotation.set(-0.15, s * 0.32, -s * 0.03);
        brow.userData.baseY = y;
        this.head.add(brow);
        this.brows.push(brow);
      }

      // Naso lungo e dritto (poliedro su misura)
      const zTop = this.surfZ(0, 0.18);
      const zMid = this.surfZ(0, -0.08);
      const zTip = this.surfZ(0, -0.36);
      const zW = this.surfZ(0.15, -0.4);
      const P = {
        T: [0, 0.18, zTop + 0.01],
        M: [0, -0.06, zMid + 0.15],
        Lm: [-0.08, -0.08, this.surfZ(-0.08, -0.08) + 0.02],
        Rm: [0.08, -0.08, this.surfZ(0.08, -0.08) + 0.02],
        Tip: [0, -0.35, zTip + 0.21],
        U: [0, -0.43, zTip + 0.09],
        Lw: [-0.165, -0.4, zW + 0.03],
        Rw: [0.165, -0.4, zW + 0.03]
      };
      const faces = [
        ['T', 'Lm', 'M'], ['T', 'M', 'Rm'],
        ['Lm', 'Tip', 'M'], ['M', 'Tip', 'Rm'],
        ['Lm', 'Lw', 'Tip'], ['Rm', 'Tip', 'Rw'],
        ['Lw', 'U', 'Tip'], ['Rw', 'Tip', 'U']
      ];
      const arr = [];
      faces.forEach((f) => f.forEach((k) => arr.push(...P[k])));
      const noseGeo = new THREE.BufferGeometry();
      noseGeo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      noseGeo.computeVertexNormals();
      this.head.add(new THREE.Mesh(noseGeo, flatMat(PALETTE.skin, { side: THREE.DoubleSide, roughness: 0.75 })));

      // Bocca: labbra piene, leggero mezzo sorriso storto
      const mouthY = -0.66;
      const mz = this.surfZ(0, mouthY);
      this.mouth = new THREE.Group();
      this.mouth.position.set(0, mouthY, mz - 0.01);
      this.mouth.rotation.z = 0.06;
      const lipMat = flatMat(PALETTE.lips, { roughness: 0.6 });

      const inner = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 4), flatMat(PALETTE.mouth));
      inner.scale.set(2.0, 0.22, 0.35);
      inner.position.z = 0.0;
      this.mouthInner = inner;

      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 4), lipMat);
      upper.scale.set(2.3, 0.34, 0.55);
      upper.position.set(0, 0.035, 0.0);

      const lower = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 4), lipMat);
      lower.scale.set(2.05, 0.46, 0.6);
      lower.position.set(0, -0.04, 0.005);
      this.lowerLip = lower;

      this.mouth.add(inner, upper, lower);
      this.head.add(this.mouth);

      // Orecchie (quella a sinistra dello schermo è scoperta e ha il dilatatore)
      for (const s of [-1, 1]) {
        const y = -0.12, z = -0.05;
        const x = this.surfX(s, y, z);
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.21, 7, 5), flatMat(0xd99f84, { roughness: 0.75 }));
        ear.scale.set(0.42, 1, 0.68);
        ear.position.set(x + s * 0.05, y, z);
        ear.rotation.y = s * -0.35;
        this.head.add(ear);
        if (s === -1) {
          // dilatatore: ottagono nero pieno sul lobo
          const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8), flatMat(PALETTE.plug, { roughness: 0.5 }));
          plug.position.set(x - 0.11, y - 0.15, z + 0.04);
          plug.rotation.set(0, -0.35, Math.PI / 2);
          this.head.add(plug);
        }
      }
    }

    /* ------------------------------------------------------------------ */
    /* Capelli: calotta deformata + ciocche a cono                          */
    /* ------------------------------------------------------------------ */
    buildHair() {
      const thetaMax = Math.PI * 0.8;
      const lastY = Math.cos(thetaMax);
      const geo = new THREE.SphereGeometry(1, 16, 11, 0, Math.PI * 2, 0, thetaMax);
      deform(geo, (v) => {
        const ux = v.x, uy = v.y, uz = v.z;
        const n = hash3(q(ux), q(uy), q(uz));
        const r = 1 + (n - 0.5) * 0.12;
        let X = ux * 1.08 * r, Y = uy * 1.34 * r + 0.06, Z = uz * 1.12 * r;
        if (uz < 0) Z *= 1.05;
        if (uy < -0.15) {                             // punte che si aprono (shag)
          const t = (-0.15 - uy) / 0.66;
          X *= 1 + 0.42 * t * t;
          Z *= 1 + 0.18 * t * t;
        }
        if (uy < lastY + 0.01) Y -= n > 0.5 ? 0.16 : 0.0;   // ciocche irregolari

        // il viso resta scoperto sotto la linea della frangia
        let inside = uz > 0.3 && Y < 0.6 + 0.12 * Math.abs(ux);
        // lato sinistro (schermo): capelli dietro l'orecchio
        if (ux < -0.35 && Y < 0.12 && uz > -0.28) inside = true;
        // lato destro: ciocche davanti, ma non sopra la guancia
        if (ux > 0.35 && Y < 0.2 && uz > 0.12) inside = true;
        if (inside) { X *= 0.5; Y *= 0.7; Z *= 0.45; }
        v.set(X, Y, Z);
      });

      const base = new THREE.Color(PALETTE.hair);
      const light = new THREE.Color(PALETTE.hairLight);
      const g = colorFaces(geo, (p, c, i) => {
        c.copy(base).lerp(light, hash3(i * 0.37, 1.3, 2.1) * 0.8);
      });
      this.hairMat = flatMat(0xffffff, { vertexColors: true, side: THREE.DoubleSide, roughness: 0.9 });
      const shell = new THREE.Mesh(g, this.hairMat);
      this.head.add(shell);

      const lockMatA = flatMat(PALETTE.hair, { roughness: 0.9 });
      const lockMatB = flatMat(PALETTE.hairLight, { roughness: 0.9 });
      const up = new THREE.Vector3(0, 1, 0);
      const addLock = (root, tip, radius, flat, seed) => {
        const dir = new THREE.Vector3().subVectors(tip, root);
        const len = dir.length();
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(radius, len, 4, 1),
          hash3(seed, 2, 3) > 0.5 ? lockMatA : lockMatB
        );
        const holder = new THREE.Group();
        holder.position.copy(root).add(tip).multiplyScalar(0.5);
        holder.quaternion.setFromUnitVectors(up, dir.normalize());
        cone.scale.set(1, 1, flat);
        cone.rotation.y = hash3(seed, 5, 7) * Math.PI;
        holder.add(cone);
        this.head.add(holder);
      };

      // Frangia mossa: ciocche che scendono fin sulle sopracciglia, spinte di lato
      const bangs = [-0.62, -0.45, -0.3, -0.12, 0.04, 0.17, 0.33, 0.5, 0.64];
      bangs.forEach((x, i) => {
        const rootY = 0.72;
        const tipY = 0.3 + hash3(i, 1, 1) * 0.16 + (Math.abs(x) > 0.45 ? 0.06 : 0);
        const tipX = x + 0.1 + (hash3(i, 2, 2) - 0.5) * 0.12;
        const root = new THREE.Vector3(x, rootY, this.surfZ(x * 0.9, rootY) + 0.12);
        const tip = new THREE.Vector3(tipX, tipY, this.surfZ(tipX * 0.95, tipY) + 0.04);
        addLock(root, tip, 0.075 + hash3(i, 3, 3) * 0.045, 0.35, i);
      });

      // Ciocche lunghe che scendono fino al collo e si aprono in fuori
      const ring = 18;
      for (let i = 0; i < ring; i++) {
        const a = (i / ring) * Math.PI * 2;
        const sx = Math.sin(a), sz = Math.cos(a);
        if (sz > 0.15) continue;                       // niente davanti al viso
        if (sx < -0.3 && sz > -0.35) continue;         // orecchio scoperto
        const root = new THREE.Vector3(sx * 0.98, -0.35, sz * 1.08);
        const len = 0.55 + hash3(i, 4, 4) * 0.3;
        const tip = new THREE.Vector3(sx * (1.25 + hash3(i, 6, 1) * 0.15), -0.35 - len, sz * 1.25);
        addLock(root, tip, 0.2, 0.5, 20 + i);
      }
      // ciocca che incornicia il viso a destra (schermo)
      addLock(new THREE.Vector3(0.74, 0.4, 0.22), new THREE.Vector3(0.82, -0.7, 0.12), 0.13, 0.6, 51);
      addLock(new THREE.Vector3(0.84, 0.0, 0.05), new THREE.Vector3(1.0, -0.95, 0.0), 0.2, 0.5, 52);

      // ciuffi spettinati in cima
      const tufts = [[-0.35, 1.28, 0.25], [0.15, 1.36, 0.1], [0.5, 1.2, -0.1], [-0.1, 1.3, -0.45], [0.3, 1.25, 0.45]];
      tufts.forEach((t, i) => {
        const root = new THREE.Vector3(t[0] * 0.8, t[1] - 0.2, t[2] * 0.8);
        const tip = new THREE.Vector3(t[0] * 1.15, t[1] + 0.02, t[2] * 1.2 + 0.08);
        addLock(root, tip, 0.18, 0.55, 60 + i);
      });
    }

    /* ------------------------------------------------------------------ */
    /* Occhiali tondi                                                       */
    /* ------------------------------------------------------------------ */
    buildGlasses() {
      const mat = flatMat(PALETTE.frame, { roughness: 0.6, metalness: 0 });
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xdfeaf5, transparent: true, opacity: 0.04, depthWrite: false });
      const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false });
      const R = 0.245;
      const zRim = this.surfZ(this.eyeX, this.eyeY) + 0.13;
      const y = this.eyeY + 0.01;
      this.glasses = new THREE.Group();

      for (const s of [-1, 1]) {
        const cx = s * (this.eyeX + 0.02);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.012, 4, 12), mat);
        rim.position.set(cx, y, zRim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(R, 12), lensMat);
        lens.position.set(cx, y, zRim - 0.005);
        const glint = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.22), glintMat);
        glint.position.set(cx - 0.06, y + 0.04, zRim + 0.002);
        glint.rotation.z = -0.7;
        this.glasses.add(rim, lens, glint);

        // asta verso l'orecchio
        const from = new THREE.Vector3(s * (this.eyeX + 0.02 + R), y + 0.02, zRim - 0.02);
        const earX = this.surfX(s, y, -0.05);
        const to = new THREE.Vector3(earX + s * 0.04, y - 0.04, -0.12);
        const len = from.distanceTo(to);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, len), mat);
        arm.position.copy(from).add(to).multiplyScalar(0.5);
        arm.lookAt(to.clone().applyMatrix4(this.head.matrixWorld));
        this.glasses.add(arm);
      }
      // ponte ad arco
      const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.011, 4, 6, Math.PI), mat);
      bridge.position.set(0, y + 0.02, zRim + 0.005);
      bridge.scale.set(1, 0.6, 1);
      this.glasses.add(bridge);
      this.head.add(this.glasses);
    }

    buildShadow() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, 'rgba(21,20,19,0.35)');
      grd.addColorStop(1, 'rgba(21,20,19,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      this.shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 2.4),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
      );
      this.shadow.rotation.x = -Math.PI / 2;
      this.shadow.position.y = -1.95;
      this.scene.add(this.shadow);
    }

    /* ------------------------------------------------------------------ */
    /* Fumetto                                                              */
    /* ------------------------------------------------------------------ */
    buildBubble() {
      const host = this.container.parentElement;
      if (!host) return;
      this.bubble = document.createElement('div');
      this.bubble.className = 'avatar-bubble';
      this.bubble.setAttribute('aria-live', 'polite');
      this.bubble.hidden = true;
      host.appendChild(this.bubble);
    }

    say(text) {
      if (!this.bubble) return;
      clearInterval(this.typing);
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
        if (i % 3 === 0 && window.audioEngine && window.audioEngine.playBeep) {
          window.audioEngine.playBeep(520 + Math.random() * 160, 0.025, 'square');
        }
        if (i >= text.length) {
          clearInterval(this.typing);
          this.typing = null;
          this.talk.target = 0;
        }
      }, 38);
    }

    nextMessage() {
      this.say(MESSAGES[this.msgIndex % MESSAGES.length]);
      this.msgIndex++;
    }

    /* ------------------------------------------------------------------ */
    /* Eventi                                                               */
    /* ------------------------------------------------------------------ */
    onResize() {
      if (!this.container || !this.renderer) return;
      const w = this.container.clientWidth || 360;
      const h = this.container.clientHeight || 320;
      if (w <= 0 || h <= 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.renderer.render(this.scene, this.camera);
    }

    setupEvents() {
      window.addEventListener('resize', () => this.onResize());

      const track = (x, y) => {
        const r = this.container.getBoundingClientRect();
        this.mouse.tx = Math.max(-1.5, Math.min(1.5, (x - (r.left + r.width / 2)) / (r.width / 2)));
        this.mouse.ty = Math.max(-1.5, Math.min(1.5, (y - (r.top + r.height / 2)) / (r.height / 2)));
      };

      window.addEventListener('pointermove', (e) => {
        track(e.clientX, e.clientY);
        if (this.drag) {
          const dx = e.clientX - this.drag.x;
          this.drag.moved += Math.abs(dx);
          this.spinVel = dx * 0.012;
          this.spin += dx * 0.012;
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
        if (clicked) {
          this.mood = 1;
          this.blink.closing = 1;
          if (window.audioEngine && window.audioEngine.playSpringPop) window.audioEngine.playSpringPop();
          this.nextMessage();
        }
      });

      // Saluto la prima volta che la testa entra in vista; pausa quando è fuori schermo
      if ('IntersectionObserver' in window) {
        let greeted = false;
        new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            this.visible = en.isIntersecting;
            if (en.isIntersecting && !greeted) {
              greeted = true;
              setTimeout(() => this.nextMessage(), 900);
            }
          });
        }, { threshold: 0.4 }).observe(this.container);
      } else {
        setTimeout(() => this.nextMessage(), 900);
      }
    }

    /* ------------------------------------------------------------------ */
    /* Animazione                                                           */
    /* ------------------------------------------------------------------ */
    animate() {
      requestAnimationFrame(() => this.animate());
      const dt = Math.min(0.05, this.clock.getDelta());
      if (!this.visible) return;
      const t = this.clock.elapsedTime;

      const m = this.mouse;
      m.x += (m.tx - m.x) * 0.07;
      m.y += (m.ty - m.y) * 0.07;

      // Rotazione: molla che riporta la testa frontale dopo il giro
      if (!this.drag) {
        const target = Math.round(this.spin / (Math.PI * 2)) * Math.PI * 2;
        this.spinVel += (target - this.spin) * 0.012;
        this.spinVel *= 0.93;
        this.spin += this.spinVel;
      }

      this.root.position.y = Math.sin(t * 1.4) * 0.07;
      this.root.rotation.z = Math.sin(t * 0.9) * 0.025;
      this.head.rotation.y = this.spin + m.x * 0.42;
      this.head.rotation.x = m.y * 0.2 + Math.sin(t * 1.1) * 0.02;
      if (this.shadow) {
        const s = 1 - this.root.position.y * 0.6;
        this.shadow.scale.set(s, s, s);
      }

      // Sguardo
      const lookX = Math.max(-1, Math.min(1, m.x)) * 0.045;
      const lookY = -Math.max(-1, Math.min(1, m.y)) * 0.02;
      this.eyes.forEach((e) => e.iris.position.set(lookX, lookY, e.iris.position.z));

      // Battito di ciglia
      const b = this.blink;
      b.t += dt;
      if (b.t > b.next) { b.closing = 1; b.t = 0; b.next = 2 + Math.random() * 3.5; }
      b.closing = Math.max(0, b.closing - dt * 7);
      const lidBase = 0.3 - this.mood * 0.2;           // palpebre un po' pesanti
      const lid = lidBase + (Math.PI / 2 - lidBase) * Math.sin(Math.min(1, b.closing) * Math.PI);
      this.eyes.forEach((e) => { e.lidPivot.rotation.x = lid; });

      // Sopracciglia (si alzano quando lo clicchi)
      this.mood = Math.max(0, this.mood - dt * 0.6);
      this.brows.forEach((br) => { br.position.y = br.userData.baseY + this.mood * 0.06; });

      // Bocca che parla
      this.talk.open += (this.talk.target - this.talk.open) * 0.35;
      const o = this.talk.open;
      this.lowerLip.position.y = -0.04 - o * 0.06;
      this.mouthInner.scale.y = 0.25 + o * 0.9;
      this.mouthInner.position.y = -o * 0.03;

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.HeroAvatar = HeroAvatar;
  window.initHeroAvatar = function () {
    window.heroAvatar = new HeroAvatar('hero-sphere-viewport');
    window.heroSphere = window.heroAvatar;   // compatibilità con main.js (onResize)
  };
})();
