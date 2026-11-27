/**
 * designjack — Avatar 3D (Three.js r128 + GLTFLoader)
 *
 * La testa è il modello Blender di Jack (assets/avatar/jacopo-head.glb, ricavato da
 * Avatar/Avatar.glb senza la scansione fotografica "alta"). Le parti si riconoscono
 * dal nome che hanno in Blender:
 *   testa        → pelle (+ bianchi degli occhi "occhiVERI" + labbra)
 *   occhi        → pupille
 *   sopracciglia → sopracciglia
 *   capelli, Occhiali
 *
 * Espressioni (come nell'avatar di prima, più qualcosa):
 * - battito di palpebre; gli occhi seguono il cursore e, da fermi, si guardano intorno
 * - bocca che si apre mentre parla: scendono labbro inferiore e mento, dentro è scuro
 * - sopracciglia che si alzano parlando e nella sorpresa
 * - sorpresa (easter egg): salto, tremolio, occhi spalancati, bocca a O
 * - fluttuazione, rotazione verso il cursore, giro a molla trascinandolo, saltello al clic
 *
 * Resa "Nintendo DS": la scena è disegnata a bassa risoluzione (circa 128 pixel di
 * altezza, come la testa di Brain Training), con colori a 15 bit, un leggero retino,
 * texture senza smussatura, contorno di un pixel e la griglia appena visibile dell'LCD.
 *
 * L'avatar precedente (ritratto 2D su rilievo) è in archive/heroAvatar-rilievo2D.js.
 */

(function () {
  const MODEL_URL = 'assets/avatar/jacopo-head.glb';
  const HEAD_H = 2.25;               // altezza della testa in unità di scena
  const DS_LINES = 128;              // righe di pixel "DS" sull'altezza del riquadro
  const DITHER = 12;                 // livelli per canale del retino: meno livelli = retino più evidente
  const SMILE = 0.45;                // sorriso a riposo: 0 = bocca dritta come in Blender, 1 = sorriso pieno
  // carnagione: il colore "pelle" di Blender, un po' più scuro e caldo (moltiplicatore lineare)
  const SKIN_TONE = [0.82, 0.76, 0.72];

  // stato dell'espressione: ogni valore si avvicina piano al suo bersaglio
  const FX_REST = {
    eyeOpen: 1,      // 1 aperti, 0 chiusi
    wide: 0,         // occhi spalancati
    pupil: 1,        // grandezza pupille
    brow: 0,         // entrambe le sopracciglia (in "alzate")
    browL: 0,        // solo la sinistra (dal suo punto di vista)
    browR: 0,        // solo la destra
    frown: 0,        // estremità interne giù: aria corrucciata
    cornerL: 0,      // angoli della bocca: + su, − giù
    cornerR: 0,
    squeeze: 1,      // larghezza delle labbra (0.75 = a O / bacio, 1.1 = tirate)
    pucker: 0,       // labbra in fuori
    puff: 0,         // guance gonfie
    boost: 1,        // quanto si spalanca la bocca
    gx: 0, gy: 0, gw: 0,   // sguardo forzato e quanto pesa
    yaw: 0, tilt: 0, // testa: giro e inclinazione in più
    flush: 0         // viso rosso (arrabbiato, poi imbarazzato)
  };
  const BROW_FWD = 0.9;              // quanto avanzano le sopracciglia per ogni unità di alzata
  const ANGRY_TEXT = 'HEY NON SONO UN GIOCATTOLO! beh… un po’ sì…';
  const ANTICS = ['doubt', 'grimace', 'shifty', 'waggle', 'puff'];
  const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
  // 0→1 tra a e b, poi 1→0 tra c e d
  const pulse = (t, a, b, c, d) => ease((t - a) / (b - a)) * (1 - ease((t - c) / (d - c)));

  const MESSAGES = [
    'Ciao! Sono Jacopo “Jack” Febi.',
    'Disegno grafica, interfacce e cose in 3D.',
    'Sfoglia i progetti appesi al filo qui sotto.',
    'Oppure pesca una capsula dalla claw machine!',
    'Psst… trascinami per farmi girare la testa.'
  ];

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const tk0 = (av) => av.talk.open;
  function smooth(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  class HeroAvatar {
    constructor(container, opts = {}) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      if (!this.container) return;
      this.bubble = opts.bubble || null;
      this.modelUrl = opts.model || window.AVATAR_MODEL || MODEL_URL;
      this.messages = opts.messages || MESSAGES;
      this.autoGreet = opts.autoGreet !== false;
      this.clickHandler = null;       // se restituisce false, il clic non fa parlare l'avatar
      this.pixel = 3;                 // lato del pixel "DS" in px CSS (ricalcolato sul riquadro)

      this.mouse = { x: 0, y: 0, tx: 0, ty: 0, moved: 0 };
      this.spin = 0;
      this.spinVel = 0;
      this.nod = 0;                   // annuire trascinando in verticale
      this.nodVel = 0;
      this.hop = 0;
      this.hopVel = 0;
      this.drag = null;
      this.shock = 0;
      this.blink = { t: 0, next: 1.5 + Math.random() * 2, closing: 0 };
      this.talk = { open: 0, target: 0, applied: -1 };
      this.gaze = { x: 0, y: 0, tx: 0, ty: 0, idleT: 0, idleNext: 1.2 };
      this.brow = { v: 0, target: 0 };
      this.fx = Object.assign({}, FX_REST);
      this.antic = null;                // mossa buffa in corso: { name, t, dur }
      this.anticQueue = [];
      this.anticWait = 7 + Math.random() * 5;
      this.clicks = [];
      this.reduceMotion = !!((window.djReduceMotion && window.djReduceMotion()));
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
      this.camera.position.set(0, -0.06, 5.5);

      // niente antialias: la scena passa dal buffer a bassa risoluzione (vedi buildPost)
      this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);
      this.buildPost(w, h);

      // luce semplice, da console portatile: ambiente + una luce di tre quarti + un riempimento
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.36));
      const key = new THREE.DirectionalLight(0xffffff, 0.9);
      key.position.set(-1.2, 1.6, 4);
      this.scene.add(key);
      const fill = new THREE.DirectionalLight(0xffe6cc, 0.22);
      fill.position.set(2.5, -0.5, 2);
      this.scene.add(fill);

      this.root = new THREE.Group();
      this.head = new THREE.Group();
      this.root.add(this.head);
      this.scene.add(this.root);

      if (THREE.GLTFLoader) {
        new THREE.GLTFLoader().load(
          this.modelUrl,
          (gltf) => this.buildHead(gltf.scene),
          undefined,
          (err) => console.warn('Avatar 3D: modello non caricato', err)
        );
      } else {
        console.warn('Avatar 3D: manca THREE.GLTFLoader');
      }
      this.buildShadow();
      this.setupEvents();
      this.animate();
    }

    /* ------------------------------------------------------------------ */
    /* Modello                                                              */
    /* ------------------------------------------------------------------ */
    buildHead(model) {
      // la scansione fotografica, se è rimasta nell'export, non si mostra
      const scan = model.getObjectByName('alta');
      if (scan && scan.parent) scan.parent.remove(scan);

      // misure con la testa ferma
      const saved = [this.root.position.clone(), this.root.rotation.clone(), this.head.rotation.clone()];
      this.root.position.set(0, 0, 0);
      this.root.rotation.set(0, 0, 0);
      this.head.rotation.set(0, 0, 0);

      // materiali "DS": Lambert, texture senza smussatura; via le lenti quasi invisibili
      const parts = { skin: null, sclera: null, lips: null };
      model.traverse((o) => {
        if (!o.isMesh) return;
        const m = o.material;
        const name = (m && m.name) || '';
        if (m.transparent && m.opacity < 0.2) { o.visible = false; return; }
        const map = m.map || null;
        if (map) {
          map.magFilter = THREE.NearestFilter;
          map.minFilter = THREE.NearestFilter;
          map.generateMipmaps = false;
          map.needsUpdate = true;
        }
        o.material = new THREE.MeshLambertMaterial({ color: m.color.clone(), map, side: THREE.DoubleSide });
        o.material.name = name;
        if (name === 'pelle') {
          parts.skin = o;
          o.material.color.multiply(new THREE.Color(SKIN_TONE[0], SKIN_TONE[1], SKIN_TONE[2]));
          this.skinMat = o.material;
          this.skinColor = o.material.color.clone();
        }
        else if (name === 'occhiVERI') parts.sclera = o;
        else if (o.parent && o.parent.name === 'testa' && !parts.lips && name !== 'pelle' && name !== 'occhiVERI') parts.lips = o;
      });
      // labbra: la parte della testa che non è pelle né occhi
      if (!parts.lips) {
        model.traverse((o) => {
          if (o.isMesh && o !== parts.skin && o !== parts.sclera && o.parent && o.parent.name === 'testa') parts.lips = o;
        });
      }

      // centra e scala la testa
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const s = HEAD_H / size.y;
      model.scale.multiplyScalar(s);
      model.position.sub(center.multiplyScalar(s));
      this.head.add(model);
      this.model = model;
      this.root.updateMatrixWorld(true);

      // ---- occhi: un perno al centro dei bianchi; le pupille in un gruppo che si sposta
      const pupils = model.getObjectByName('occhi');
      if (parts.sclera) {
        const eb = new THREE.Box3().setFromObject(parts.sclera);
        const ec = this.head.worldToLocal(eb.getCenter(new THREE.Vector3()));
        const es = eb.getSize(new THREE.Vector3());
        this.eyePivot = new THREE.Group();
        this.eyePivot.position.copy(ec);
        this.head.add(this.eyePivot);
        this.root.updateMatrixWorld(true);
        this.eyePivot.attach(parts.sclera);
        this.gazeGroup = new THREE.Group();
        this.eyePivot.add(this.gazeGroup);
        this.root.updateMatrixWorld(true);
        if (pupils) this.gazeGroup.attach(pupils);
        this.pupils = pupils;
        this.sclera = parts.sclera;
        this.scleraColor = parts.sclera.material.color.clone();
        this.lashColor = new THREE.Color(0x2a1a12).convertSRGBToLinear();
        this.gazeRange = { x: es.x * 0.07, y: es.y * 0.16 };
      }

      // ---- sopracciglia
      const brows = model.getObjectByName('sopracciglia');
      if (brows) {
        const bb = new THREE.Box3().setFromObject(brows);
        this.browPivot = new THREE.Group();
        this.browPivot.position.copy(this.head.worldToLocal(bb.getCenter(new THREE.Vector3())));
        this.head.add(this.browPivot);
        this.root.updateMatrixWorld(true);
        this.browPivot.attach(brows);
        this.browBase = this.browPivot.position.y;
        this.browBaseZ = this.browPivot.position.z;
        // alzata: abbastanza da uscire da sopra la montatura degli occhiali
        // (il riquadro di un mesh ruotato è gonfiato: meglio misurare sull'altezza degli occhi)
        const eyeH = this.gazeRange ? this.gazeRange.y / 0.16 : HEAD_H * 0.045;
        this.browLift = eyeH * 1.15;
        this.buildBrowSides(brows);
        // come nei cartoni, le sopracciglia si vedono anche sopra la frangia;
        // gli occhiali, disegnati dopo, restano comunque davanti
        // in Blender hanno il materiale dei capelli: qui più scure, se no sulla frangia spariscono
        brows.material = brows.material.clone();
        brows.material.color.setRGB(0.006, 0.004, 0.003);
        brows.material.depthTest = false;
        brows.material.depthWrite = false;
        brows.renderOrder = 5;
        this.browMesh = brows;
        const glasses = model.getObjectByName('Occhiali');
        if (glasses) glasses.traverse((o) => { if (o.isMesh) o.renderOrder = 10; });
      }

      // ---- bocca: mento e labbro inferiore scendono, dentro c'è il buio
      if (parts.lips && parts.skin) this.buildMouth(parts.skin, parts.lips);

      this.root.position.copy(saved[0]);
      this.root.rotation.copy(saved[1]);
      this.head.rotation.copy(saved[2]);
      this.draw();
    }

    // Ogni sopracciglio si può alzare da solo: si spostano i vertici del suo lato.
    // Il mesh è ruotato e scalato, quindi lo spostamento "in su" della testa va
    // riportato nelle coordinate del mesh.
    buildBrowSides(brows) {
      this.root.updateMatrixWorld(true);
      const toHead = new THREE.Matrix4().copy(this.head.matrixWorld).invert().multiply(brows.matrixWorld);
      const toLocal = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().copy(toHead).invert());
      const up = new THREE.Vector3(0, 1, 0).applyMatrix3(toLocal);
      const fwd = new THREE.Vector3(0, 0, 1).applyMatrix3(toLocal);
      const pos = brows.geometry.attributes.position;
      const v = new THREE.Vector3();
      let maxX = 0;
      const hx = new Float32Array(pos.count);
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(toHead);
        hx[i] = v.x - this.browPivot.position.x;
        maxX = Math.max(maxX, Math.abs(hx[i]));
      }
      this.browGeo = brows.geometry;
      this.browBasePos = Float32Array.from(pos.array);
      this.browUp = up;
      this.browFwd = fwd;
      // lato (L = x negativa nella testa, R = positiva) e quanto il vertice è verso l'interno
      this.browSide = Array.from(hx, (x) => ({ L: x < 0 ? 1 : 0, R: x >= 0 ? 1 : 0, inner: 1 - Math.abs(x) / (maxX || 1) }));
      this.browApplied = '';
    }

    applyBrowSides() {
      const f = this.fx;
      const key = f.browL.toFixed(3) + f.browR.toFixed(3) + f.frown.toFixed(3);
      if (!this.browGeo || key === this.browApplied) return;
      this.browApplied = key;
      const pos = this.browGeo.attributes.position;
      const b = this.browBasePos, up = this.browUp, fw = this.browFwd, L = this.browLift;
      for (let i = 0; i < pos.count; i++) {
        const sd = this.browSide[i];
        // alzato: si alza di più verso l'esterno (arco); corrucciato: giù verso l'interno
        const lift = (sd.L * f.browL + sd.R * f.browR) * (0.75 + 0.25 * (1 - sd.inner)) - f.frown * 0.8 * sd.inner * sd.inner;
        const d = lift * L;
        const z = Math.max(0, d) * BROW_FWD;     // salendo avanza, se no sparisce nella fronte
        pos.setXYZ(i, b[i * 3] + up.x * d + fw.x * z, b[i * 3 + 1] + up.y * d + fw.y * z, b[i * 3 + 2] + up.z * d + fw.z * z);
      }
      pos.needsUpdate = true;
    }

    buildMouth(skin, lips) {
      lips.geometry.computeBoundingBox();
      const lb = lips.geometry.boundingBox;
      const mx = (lb.min.x + lb.max.x) / 2;
      const my = (lb.min.y + lb.max.y) / 2;
      const lw = (lb.max.x - lb.min.x) / 2;
      const lh = lb.max.y - lb.min.y;
      this.mouthDrop = lh * 1.15;              // apertura massima, in unità della geometria
      this.lipLh = lh;

      // la linea tra le labbra: al centro, il punto più incavato della parte anteriore
      const lp = lips.geometry.attributes.position;
      let seam = my, seamZ = Infinity;
      const zMid = (lb.min.z + lb.max.z) / 2;
      for (let i = 0; i < lp.count; i++) {
        const x = lp.getX(i), y = lp.getY(i), z = lp.getZ(i);
        if (Math.abs(x - mx) > lw * 0.3 || z < zMid) continue;
        if (y > lb.max.y - lh * 0.2 || y < lb.min.y + lh * 0.2) continue;
        if (z < seamZ) { seamZ = z; seam = y; }
      }
      seam += lh * 0.06;                        // appena sopra il vertice più incavato
      this.mouthY = seam;

      // labbro inferiore: quello che sta sotto la linea (deciso prima del sorriso)
      const lower = [];
      for (let i = 0; i < lp.count; i++) if (lp.getY(i) < seam) lower.push(i);

      // sorriso a riposo: angoli della bocca in su, labbra un filo più larghe, guance che salgono
      if (SMILE) {
        for (let i = 0; i < lp.count; i++) {
          const dx = (lp.getX(i) - mx) / lw;
          lp.setX(i, mx + (lp.getX(i) - mx) * (1 + 0.06 * SMILE));
          const d4 = dx * dx * dx * dx;
          lp.setY(i, lp.getY(i) + SMILE * lh * 1.5 * d4 + SMILE * lh * 0.15 * dx * dx);
          lp.setZ(i, lp.getZ(i) + SMILE * lh * 0.6 * d4);     // gli angoli restano davanti alle guance
        }
        lp.needsUpdate = true;
        lips.geometry.computeVertexNormals();
        const sp0 = skin.geometry.attributes.position;
        for (let i = 0; i < sp0.count; i++) {
          const x = sp0.getX(i), y = sp0.getY(i), z = sp0.getZ(i);
          if (z < lb.min.z - lh * 4) continue;
          const ax = Math.abs(x - mx) / lw;
          const w = Math.exp(-(((ax - 1.15) / 0.55) ** 2)) * Math.exp(-(((y - my) / (lh * 2.2)) ** 2));
          if (w > 0.01) sp0.setY(i, y + SMILE * lh * 0.7 * w);
        }
        sp0.needsUpdate = true;
        skin.geometry.computeVertexNormals();
      }

      // pelle: i vertici sotto la bocca scendono con la mandibola; quelli delle guance si gonfiano
      const sp = skin.geometry.attributes.position;
      this.skinBase = Float32Array.from(sp.array);
      this.skinMove = [];                        // [indice, peso mandibola, spinta guancia x, y, z]
      const R = lw * 1.4;
      for (let i = 0; i < sp.count; i++) {
        const x = sp.getX(i), y = sp.getY(i), z = sp.getZ(i);
        if (z < lb.min.z - lh * 6) continue;    // solo la parte anteriore del viso
        const jw = 0.85 * smooth(my + lh * 0.1, my - lh * 0.9, y) * Math.exp(-(((x - mx) / (lw * 1.1)) ** 2))
          * (1 - smooth(my - lh * 4.5, my - lh * 7, y) * 0.6);
        const side = x < mx ? -1 : 1;
        const cx = mx + side * lw * 1.9, cy = my + lh * 1.1;
        const cw = Math.exp(-(((x - cx) ** 2 + ((y - cy) * 1.2) ** 2) / (R * R)));
        if (jw > 0.01 || cw > 0.02) {
          const amt = lw * 0.62 * cw;
          this.skinMove.push([i, jw > 0.01 ? jw : 0, side * amt * 0.8, -amt * 0.08, amt * 0.7]);
        }
      }
      this.skinGeo = skin.geometry;

      // labbra: posizione di partenza (sorridente), lato, peso degli angoli
      this.lipsBase = Float32Array.from(lp.array);
      const isLow = new Uint8Array(lp.count);
      lower.forEach((i) => { isLow[i] = 1; });
      this.lipInfo = [];
      for (let i = 0; i < lp.count; i++) {
        const dx = (lp.getX(i) - mx) / (lw * (1 + 0.06 * SMILE));
        this.lipInfo.push([isLow[i], dx, dx * dx * dx * dx]);
      }
      this.lipMx = mx;
      this.lipsGeo = lips.geometry;
      this.lips = lips;
      this.mouthApplied = '';

      // L'interno della bocca segue la linea tra le labbra: in alto è la linea stessa (con il
      // sorriso e gli angoli), in basso il bordo del labbro inferiore che scende. Si assottiglia
      // verso gli angoli, quindi la bocca si apre "a fessura", come una bocca vera.
      // Le labbra sono un pezzo unico: aprendosi, le facce tra labbro superiore e inferiore si
      // allungano. L'interno si disegna sopra di loro, esattamente nella fessura.
      const N = 20;
      this.mouthN = N;
      this.mouthLw = lw * (1 + 0.06 * SMILE);
      this.mouthSeam = seam;
      // profondità di ogni colonna: quella delle labbra vicino alla linea
      this.mouthZ = new Float32Array(N + 1);
      for (let c = 0; c <= N; c++) {
        const dx = -0.9 + 1.8 * c / N;
        const x = mx + dx * this.mouthLw;
        let best = Infinity, z = lb.max.z;
        for (let i = 0; i < lp.count; i++) {
          const d = Math.abs(lp.getX(i) - x) * 2 + Math.abs(lp.getY(i) - this.seamAt(dx, 0, 0));
          if (lp.getZ(i) > (lb.min.z + lb.max.z) / 2 && d < best) { best = d; z = lp.getZ(i); }
        }
        this.mouthZ[c] = z;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3));
      const col = new Float32Array((N + 1) * 2 * 3);
      const dark = new THREE.Color(0x2a0e0c).convertSRGBToLinear();
      const tongue = new THREE.Color(0x8a3a34).convertSRGBToLinear();
      for (let c = 0; c <= N; c++) {
        col.set([dark.r, dark.g, dark.b], c * 6);
        // la lingua si vede solo al centro, in basso
        const k = Math.max(0, 1 - Math.abs(-0.9 + 1.8 * c / N) / 0.55);
        const t = new THREE.Color().copy(dark).lerp(tongue, k);
        col.set([t.r, t.g, t.b], c * 6 + 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const idx = [];
      for (let c = 0; c < N; c++) {
        const a0 = c * 2, b0 = c * 2 + 1, a1 = c * 2 + 2, b1 = c * 2 + 3;
        idx.push(a0, b0, a1, a1, b0, b1);
      }
      geo.setIndex(idx);
      const hole = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        vertexColors: true, side: THREE.DoubleSide, depthTest: false, depthWrite: false
      }));
      lips.renderOrder = 4;
      hole.renderOrder = 6;
      hole.frustumCulled = false;
      hole.visible = false;
      lips.parent.add(hole);
      this.mouthHole = hole;
    }

    // altezza della linea tra le labbra in un punto (dx: −1 angolo sinistro … 1 destro)
    seamAt(dx, cornerL, cornerR) {
      const d2 = dx * dx, d4 = d2 * d2;
      return this.mouthSeam + SMILE * this.lipLh * (1.5 * d4 + 0.15 * d2)
        + (dx < 0 ? cornerL : cornerR) * this.lipLh * 1.4 * d4;
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
        new THREE.PlaneGeometry(1.7, 1.7),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
      );
      this.shadow.rotation.x = -Math.PI / 2;
      this.shadow.position.y = -HEAD_H / 2 - 0.12;
      this.scene.add(this.shadow);
    }

    /* ------------------------------------------------------------------ */
    /* Fumetto                                                              */
    /* ------------------------------------------------------------------ */
    say(text, opts = {}) {
      if (!this.bubble || !text) return;
      // in inglese la frase si traduce prima di batterla lettera per lettera
      if (window.i18n) text = window.i18n.t(text);
      clearTimeout(this.typing);
      clearTimeout(this.hideTimer);
      this.bubble.hidden = false;
      this.bubble.classList.remove('pop');
      void this.bubble.offsetWidth;
      this.bubble.classList.add('pop');
      this.bubble.textContent = '';
      this.brow.target = 0.45;                  // attacca la frase alzando le sopracciglia
      if (this.antic && this.antic.name !== 'angry') this.antic = null;
      let i = 0;
      const step = () => {
        i++;
        this.bubble.textContent = text.slice(0, i);
        const ch = text[i - 1] || '';
        this.talk.target = /[aeiouàèéìòù]/i.test(ch) ? 1 : /[\s.,!?…]/.test(ch) ? 0 : 0.45;
        if (/[!?]/.test(ch)) this.brow.target = 0.7;
        else if (i % 9 === 0) this.brow.target = Math.random() < 0.35 ? 0.35 : 0;
        if (!opts.quiet && i % 3 === 0 && window.audioEngine && window.audioEngine.playBeep) {
          window.audioEngine.playBeep(520 + Math.random() * 160, 0.025, 'square');
        }
        if (i >= text.length) {
          this.typing = null;
          this.talk.target = 0;
          this.brow.target = 0;
          if (opts.autoHide) {
            this.hideTimer = setTimeout(() => { this.bubble.hidden = true; }, opts.autoHide);
          }
          return;
        }
        // piccole pause sulla punteggiatura, come chi parla davvero
        const pause = /[!?]/.test(ch) ? 260 : /[…]/.test(ch) ? 320 : ch === '.' ? 120 : 34;
        if (pause > 34) this.talk.target = 0;
        this.typing = setTimeout(step, pause);
      };
      this.typing = setTimeout(step, 34);
    }

    // Sorpresa (easter egg del Konami code): salto secco, sussulto, bocca a O,
    // occhi spalancati e sopracciglia su (niente battito di ciglia finché dura)
    surprise(duration = 1.1) {
      this.hideBubble();
      this.hopVel = 0.11;
      this.shock = duration;
      this.spinVel += (Math.random() < 0.5 ? -1 : 1) * 0.05;
      this.blink.closing = 0;
      this.blink.t = 0;
      this.blink.next = duration + 1.5;
      this.talk.target = 0.85;
      this.brow.target = 1;
      clearTimeout(this.shockTimer);
      this.shockTimer = setTimeout(() => {
        if (!this.typing) { this.talk.target = 0; this.brow.target = 0; }
      }, duration * 1000);
    }

    /* ------------------------------------------------------------------ */
    /* Mosse buffe                                                          */
    /* ------------------------------------------------------------------ */
    startAntic(name) {
      const dur = { doubt: 2.6, grimace: 3.2, shifty: 3.4, waggle: 1.5, puff: 2.4, angry: 4.6 }[name] || 2;
      this.antic = { name, t: 0, dur };
      if (name === 'puff') this.anticPuffed = false;
    }

    // Arrabbiato: lo hai cliccato troppe volte. Sbuffa rosso in faccia, poi ci ripensa.
    angry() {
      this.startAntic('angry');
      this.hopVel = 0.06;
      this.blink.closing = 0;
      this.blink.t = 0;
      this.blink.next = 5;
      if (window.audioEngine && window.audioEngine.playBeep) window.audioEngine.playBeep(150, 0.14, 'square');
      this.say(ANGRY_TEXT, { autoHide: 2600 });
    }

    // Bersagli dell'espressione per la mossa in corso (t = secondi dall'inizio)
    anticTargets(T, a) {
      const t = a.t;
      switch (a.name) {
        case 'doubt': {        // un sopracciglio su, l'altro giù, bocca storta, testa inclinata
          const k = pulse(t, 0, 0.35, a.dur - 0.45, a.dur);
          T.browL = 1.7 * k; T.browR = -0.4 * k; T.frown = 0.15 * k;
          T.cornerL = -0.5 * k; T.cornerR = 0.35 * k;
          T.eyeOpen = 1 - 0.18 * k;
          T.gx = 0.55; T.gy = -0.35; T.gw = k;
          T.tilt = 0.09 * k; T.yaw = -0.12 * k;
          break;
        }
        case 'grimace': {      // occhi strizzati qualche secondo, bocca storta e tirata
          const k = pulse(t, 0, 0.25, a.dur - 0.4, a.dur);
          T.eyeOpen = 1 - k; T.frown = 1.1 * k;
          T.cornerL = -1.8 * k; T.cornerR = 1.1 * k; T.squeeze = 1 + 0.14 * k;
          T.tilt = -0.06 * k;
          T.brow = -0.25 * k;
          // un piccolo tremolio di sforzo
          T.yaw = Math.sin(t * 22) * 0.015 * k;
          break;
        }
        case 'shifty': {       // occhi stretti, sguardo a destra e a sinistra, ghigno
          const k = pulse(t, 0, 0.35, a.dur - 0.45, a.dur);
          const seq = t < 0.9 ? 1 : t < 1.8 ? -1 : t < 2.6 ? 1 : 0;
          T.eyeOpen = 1 - 0.5 * k; T.frown = 0.9 * k; T.brow = -0.2 * k;
          T.cornerR = 0.75 * k; T.cornerL = -0.2 * k;
          T.gx = seq; T.gy = 0.05; T.gw = k;
          T.yaw = seq * 0.14 * k;
          break;
        }
        case 'waggle': {       // doppio alzo di sopracciglia, uno dopo l'altro
          const k = pulse(t, 0, 0.12, a.dur - 0.2, a.dur);
          T.brow = 1.25 * (pulse(t, 0.05, 0.2, 0.32, 0.5) + pulse(t, 0.6, 0.75, 0.87, 1.08));
          T.cornerL = 0.45 * k; T.cornerR = 0.45 * k; T.wide = 0.25 * k;
          T.gx = 0; T.gy = 0; T.gw = k;
          break;
        }
        case 'puff': {         // guance gonfissime, labbra a palloncino, poi "pff"
          const k = pulse(t, 0.05, 0.45, a.dur - 0.25, a.dur - 0.05);
          T.puff = k; T.squeeze = 1 - 0.3 * k; T.pucker = k;
          T.eyeOpen = 1 - 0.25 * k; T.brow = 0.35 * k; T.wide = 0;
          if (!this.anticPuffed && t > a.dur - 0.25) {
            this.anticPuffed = true;
            this.hopVel += 0.03;
            if (window.audioEngine && window.audioEngine.playBeep) window.audioEngine.playBeep(160, 0.08, 'sawtooth');
          }
          break;
        }
        case 'angry': {        // "HEY NON SONO UN GIOCATTOLO!" arrabbiato, poi "beh… un po' sì…"
          const k = pulse(t, 0, 0.15, 1.45, 1.75);
          const shy = pulse(t, 1.65, 1.95, a.dur - 0.4, a.dur);
          T.frown = 1.4 * k - 0.3 * shy; T.brow = -0.35 * k + 0.15 * shy;
          T.eyeOpen = 1 - 0.3 * k - 0.2 * shy;
          T.cornerL = -1.0 * k + 0.4 * shy; T.cornerR = -1.0 * k + 0.2 * shy;
          T.squeeze = 1 - 0.05 * k;
          T.flush = 1 * k + 0.45 * shy;
          T.browL = 0.4 * shy;
          T.gx = -0.7 * shy; T.gy = 0.5 * shy; T.gw = Math.max(k, shy);
          // scuote la testa nella parte arrabbiata
          T.yaw = Math.sin(t * 15) * 0.09 * k * (t < 1.0 ? 1 : 0);
          T.tilt = 0.07 * shy;
          break;
        }
      }
    }

    hideBubble() {
      clearTimeout(this.typing);
      clearTimeout(this.hideTimer);
      this.typing = null;
      this.talk.target = 0;
      this.brow.target = 0;
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
    /* Filtro "Nintendo DS"                                                 */
    /* ------------------------------------------------------------------ */
    buildPost(w, h) {
      this.rt = new THREE.WebGLRenderTarget(2, 2, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
      });
      // matrice di Bayer 4×4 per il retino
      const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      const data = new Uint8Array(16 * 4);
      bayer.forEach((v, i) => { data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = Math.round((v / 16) * 255); data[i * 4 + 3] = 255; });
      const tBayer = new THREE.DataTexture(data, 4, 4, THREE.RGBAFormat);
      tBayer.magFilter = tBayer.minFilter = THREE.NearestFilter;
      tBayer.wrapS = tBayer.wrapT = THREE.RepeatWrapping;
      tBayer.needsUpdate = true;

      this.postScene = new THREE.Scene();
      this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.postMat = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: this.rt.texture },
          tBayer: { value: tBayer },
          uRes: { value: new THREE.Vector2(2, 2) },
          uTint: { value: new THREE.Vector3(1, 1, 1) },
          uMix: { value: 0 },
          uBlock: { value: 3 },
          uInk: { value: new THREE.Vector3(0.09, 0.07, 0.06) },
          uLevels: { value: DITHER }
        },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: [
          'uniform sampler2D tDiffuse; uniform sampler2D tBayer;',
          'uniform vec2 uRes; uniform vec3 uTint; uniform float uMix; uniform float uBlock; uniform vec3 uInk; uniform float uLevels;',
          'varying vec2 vUv;',
          'void main(){',
          '  vec2 px = floor(vUv * uRes);',                          // pixel "DS"
          '  vec2 uv = (px + 0.5) / uRes;',
          '  vec4 c = texture2D(tDiffuse, uv);',
          '  float d = texture2D(tBayer, px / 4.0).r - 0.47;',
          '  if (c.a < 0.95) {',
          // contorno di un pixel attorno alla sagoma (solo accanto a pixel pieni)
          '    vec2 t = 1.0 / uRes;',
          '    float n = step(0.95, texture2D(tDiffuse, uv + vec2(t.x, 0.0)).a) + step(0.95, texture2D(tDiffuse, uv - vec2(t.x, 0.0)).a)',
          '            + step(0.95, texture2D(tDiffuse, uv + vec2(0.0, t.y)).a) + step(0.95, texture2D(tDiffuse, uv - vec2(0.0, t.y)).a);',
          '    if (n > 0.5) { gl_FragColor = vec4(uInk, 1.0); return; }',
          // ombra semitrasparente: puntini a retino, come la trasparenza del DS
          '    float sa = step(d + 0.5, c.a * 3.0) * 0.3;',
          '    gl_FragColor = vec4(uInk * sa, sa); return;',
          '  }',
          // da lineare a sRGB, tinta del canale (spenta di default)
          '  vec3 col = pow(clamp(c.rgb, 0.0, 1.0), vec3(1.0 / 2.2));',
          '  float l = dot(col, vec3(0.299, 0.587, 0.114));',
          '  col = mix(col, l * uTint * 1.2, uMix);',
          // retino ordinato leggero: pochi livelli per canale, il passaggio tra uno e l\'altro
          // si fa a puntini di Bayer (sfumature della pelle, ombre, capelli)
          '  col = floor(col * uLevels + 0.5 + d) / uLevels;',
          // griglia dell\'LCD, appena visibile
          '  if (uBlock >= 3.0) {',
          '    vec2 g = mod(gl_FragCoord.xy, uBlock);',
          '    if (g.x < 1.0 || g.y < 1.0) col *= 0.9;',
          '  }',
          '  gl_FragColor = vec4(col, 1.0);',
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
      // pixel grandi quanto serve per avere ~128 righe, come lo schermo del DS
      this.pixel = clamp(Math.round(h / DS_LINES), 2, 4);
      const rw = Math.max(1, Math.ceil(w / this.pixel));
      const rh = Math.max(1, Math.ceil(h / this.pixel));
      this.rt.setSize(rw, rh);
      this.postMat.uniforms.uRes.value.set(rw, rh);
      this.postMat.uniforms.uBlock.value = this.pixel * this.renderer.getPixelRatio();
    }

    // In tutti i canali: solo pixel, senza tinta di colore.
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
        this.mouse.moved = 0;
      };

      // Trascinando la testa gira (in orizzontale) e annuisce (in verticale), col mouse e col dito.
      // Su telefono il gesto soprattutto verticale resta allo scorrimento della pagina
      // (touch-action: pan-y): il browser manda pointercancel e la testa torna libera.
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'touch' || this.drag) track(e.clientX, e.clientY);
        if (this.drag && e.pointerId === this.drag.id) {
          const dx = e.clientX - this.drag.x;
          const dy = e.clientY - this.drag.y;
          this.drag.moved += Math.abs(dx) + Math.abs(dy);
          this.spin = clamp(this.spin + dx * 0.006, -0.75, 0.75);
          this.nod = clamp(this.nod + dy * 0.004, -0.35, 0.35);
          this.drag.x = e.clientX;
          this.drag.y = e.clientY;
        }
      });

      this.container.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0, touch: e.pointerType !== 'mouse' };
        // il dito resta "attaccato" alla testa anche se esce dal riquadro
        try { this.container.setPointerCapture(e.pointerId); } catch (err) { /* va bene lo stesso */ }
        track(e.clientX, e.clientY);
      });

      // gesto annullato (es. il telefono ha iniziato a scorrere la pagina): niente clic
      const release = () => {
        if (this.drag && this.drag.touch) { this.mouse.tx = 0; this.mouse.ty = 0; }
        this.drag = null;
      };
      this.container.addEventListener('pointercancel', release);
      window.addEventListener('pointercancel', (e) => { if (this.drag && e.pointerId === this.drag.id) release(); });

      window.addEventListener('pointerup', (e) => {
        if (!this.drag || e.pointerId !== this.drag.id) return;
        const clicked = this.drag.moved < 8;
        release();
        if (clicked && this.clickHandler && this.clickHandler() === false) return;
        if (clicked) {
          // tanti clic di fila: si spaventa
          const now = performance.now();
          this.clicks = this.clicks.filter((c) => now - c < 2600);
          this.clicks.push(now);
          if (this.clicks.length >= 5 && !(this.antic && this.antic.name === 'angry')) {
            this.clicks = [];
            this.angry();
            return;
          }
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
      this.update(dt);
      this.draw();
    }

    // un passo di animazione (separato da animate per poterlo avanzare a mano nei test)
    update(dt) {
      this.time = (this.time || 0) + dt;
      const t = this.time;

      const m = this.mouse;
      m.x += (m.tx - m.x) * 0.07;
      m.y += (m.ty - m.y) * 0.07;
      m.moved += dt;

      if (!this.drag) {
        this.spinVel += -this.spin * 0.02;
        this.spinVel *= 0.88;
        this.spin += this.spinVel;
        this.nodVel += -this.nod * 0.03;
        this.nodVel *= 0.86;
        this.nod += this.nodVel;
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
      this.head.rotation.x = clamp(m.y, -1.2, 1.2) * 0.16 + this.nod + Math.sin(t * 1.1) * 0.015;
      if (this.shadow) {
        const s = 1 - this.root.position.y * 0.6;
        this.shadow.scale.set(s, s, s);
      }

      // Mosse buffe: ogni tanto, a rotazione, quando è tranquillo
      const busy = this.typing || this.drag || this.shock > 0 || tk0(this) > 0.05;
      if (this.antic) {
        this.antic.t += dt;
        if (this.antic.t >= this.antic.dur) this.antic = null;
      } else if (!busy && !this.reduceMotion && this.model) {
        this.anticWait -= dt;
        if (this.anticWait <= 0) {
          if (!this.anticQueue.length) this.anticQueue = ANTICS.slice().sort(() => Math.random() - 0.5);
          this.startAntic(this.anticQueue.shift());
          this.anticWait = 8 + Math.random() * 7;
        }
      }
      const T = Object.assign({}, FX_REST);
      if (this.antic) this.anticTargets(T, this.antic);
      const f = this.fx;
      for (const k in T) f[k] += (T[k] - f[k]) * (k === 'boost' ? 0.3 : 0.2);
      this.head.rotation.y = clamp(this.head.rotation.y + f.yaw, -0.95, 0.95);
      this.root.rotation.z += f.tilt;

      // Sguardo: segue il cursore; se il cursore è fermo da un po', si guarda intorno
      const g = this.gaze;
      if (m.moved < 2.5 || this.drag) {
        g.tx = clamp(m.tx * 0.6, -1, 1);
        g.ty = clamp(m.ty * 0.6, -1, 1);
      } else {
        g.idleT += dt;
        if (g.idleT > g.idleNext) {
          g.idleT = 0;
          g.idleNext = 0.8 + Math.random() * 2.2;
          const near = Math.random() < 0.35;
          g.tx = near ? 0 : (Math.random() * 2 - 1);
          g.ty = near ? 0 : (Math.random() * 1.4 - 0.7);
        }
      }
      g.x += (g.tx - g.x) * 0.25;
      g.y += (g.ty - g.y) * 0.25;
      const gx = g.x * (1 - f.gw) + f.gx * f.gw;
      const gy = g.y * (1 - f.gw) + f.gy * f.gw;

      // Battito di ciglia (non durante la sorpresa né a occhi già strizzati)
      const b = this.blink;
      b.t += dt;
      if (b.t > b.next && this.shock <= 0 && f.eyeOpen > 0.6) { b.closing = 1; b.t = 0; b.next = 2.2 + Math.random() * 3.5; }
      b.closing = Math.max(0, b.closing - dt * 7);
      const close = Math.sin(Math.min(1, b.closing) * Math.PI);

      if (this.eyePivot) {
        const wide = Math.max(this.shock > 0 ? 1 : 0, f.wide);
        const open = (1 - close) * f.eyeOpen * (1 + wide * 0.3);
        this.eyePivot.scale.set(1 + wide * 0.1, Math.max(0.08, open), 1);
        if (this.gazeGroup) {
          this.gazeGroup.position.x = gx * this.gazeRange.x;
          this.gazeGroup.position.y = -gy * this.gazeRange.y;
          const ps = (wide ? 1 - 0.18 * wide : 1) * f.pupil;
          this.gazeGroup.scale.set(ps, ps, 1);
        }
        // a occhi chiusi resta la riga scura delle ciglia
        const shut = open < 0.3;
        if (this.pupils) this.pupils.visible = !shut;
        if (this.sclera) this.sclera.material.color.copy(shut ? this.lashColor : this.scleraColor);
      }

      // Sopracciglia: insieme (perno) e una per volta (vertici)
      const br = this.brow;
      br.v += (br.target - br.v) * 0.18;
      if (this.browPivot) {
        const lift = (br.v + f.brow) * this.browLift;
        this.browPivot.position.y = this.browBase + lift;
        this.browPivot.position.z = this.browBaseZ + Math.max(0, lift) * BROW_FWD;
      }
      this.applyBrowSides();
      // girato molto di lato, si torna alla profondità vera (se no si vedrebbero attraverso la testa)
      if (this.browMesh) this.browMesh.material.depthTest = Math.abs(this.head.rotation.y) > 0.5;
      if (this.mouthHole) this.mouthHole.material.depthTest = Math.abs(this.head.rotation.y) > 0.5;

      // rossore
      if (this.skinMat) {
        const c = this.skinColor, k = this.fx.flush;
        this.skinMat.color.setRGB(c.r * (1 + 0.35 * k), c.g * (1 - 0.22 * k), c.b * (1 - 0.3 * k));
      }

      // Bocca e guance
      const tk = this.talk;
      tk.open += (tk.target - tk.open) * 0.35;
      if (this.skinGeo) {
        const key = [tk.open, f.boost, f.cornerL, f.cornerR, f.squeeze, f.pucker, f.puff].map((v) => v.toFixed(3)).join();
        if (key !== this.mouthApplied) {
          this.mouthApplied = key;
          const drop = tk.open * this.mouthDrop * f.boost;
          // pelle: mandibola giù e guance gonfie
          const sp = this.skinGeo.attributes.position, sb = this.skinBase;
          for (const [i, jw, cx, cy, cz] of this.skinMove) {
            sp.setXYZ(i, sb[i * 3] + cx * f.puff, sb[i * 3 + 1] - drop * jw + cy * f.puff, sb[i * 3 + 2] + cz * f.puff);
          }
          sp.needsUpdate = true;
          // labbra: il labbro inferiore scende di più al centro e resta attaccato agli angoli;
          // angoli su o giù, labbra più strette o più larghe, in fuori
          const lp = this.lipsGeo.attributes.position, lb0 = this.lipsBase, lh = this.lipLh, mx = this.lipMx;
          // nella sorpresa la bocca si stringe a O
          const sq = f.squeeze * (this.shock > 0 ? 1 - tk.open * 0.22 : 1);
          const prof = (dx) => Math.pow(Math.max(0, 1 - dx * dx), 0.75);
          for (let i = 0; i < this.lipInfo.length; i++) {
            const [low, dx, d4] = this.lipInfo[i];
            const corner = (dx < 0 ? f.cornerL : f.cornerR) * lh * 1.4 * d4;
            lp.setXYZ(i,
              mx + (lb0[i * 3] - mx) * sq,
              lb0[i * 3 + 1] - (low ? drop * prof(dx) : 0) + corner,
              lb0[i * 3 + 2] + f.pucker * lh * 0.9 * (1 - Math.min(1, dx * dx)));
          }
          lp.needsUpdate = true;
          // interno: dalla linea tra le labbra al bordo del labbro inferiore
          this.mouthHole.visible = tk.open > 0.03;
          if (this.mouthHole.visible) {
            const hp = this.mouthHole.geometry.attributes.position, N = this.mouthN;
            const inset = lh * 0.03;              // un filo dentro la fessura: i bordi restano labbra
            for (let c = 0; c <= N; c++) {
              const dx = -0.9 + 1.8 * c / N;
              const x = mx + dx * this.mouthLw * sq;
              const top = this.seamAt(dx, f.cornerL, f.cornerR);
              const z = this.mouthZ[c] + f.pucker * lh * 0.9 * (1 - Math.min(1, dx * dx));
              const gap = drop * prof(dx);
              hp.setXYZ(c * 2, x, top - Math.min(inset, gap / 2), z);
              hp.setXYZ(c * 2 + 1, x, top - gap + Math.min(inset, gap / 2), z);
            }
            hp.needsUpdate = true;
          }
        }
      }
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
