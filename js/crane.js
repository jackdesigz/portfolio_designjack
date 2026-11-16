/**
 * designjack - Ultra-Charming 3D Toy Arcade Candy Claw Machine
 * Directly inspired by the reference photo:
 * - Standalone 3D physical object (no window frame)
 * - Molded candy-red canopy with illuminated retro marquee sign (★ JACK'S CLAW ★)
 * - 4 sleek silver metallic upright columns with polished reflections
 * - Molded red front console deck with sunburst decal plate & 3 interactive ball-top levers
 * - 40+ scattered metallic candy foil wrappers (Gold, Purple, Pink, Cyan) across the bed!
 * - Open toy capsule with wrapped candies beside the chute (just like in the photo!)
 * - Front-left prize chute with flashing LED lights dropping into the lower gray retrieval bin
 * - Silver metallic scoop claw hanging from chain links
 * - Full kinematics, arcade controls, capsule capture, and opening sequence
 */

window.PROJECT_REGISTRY = [
  {
    id: 'r-01',
    code: 'R-01 // INT-SYS',
    title: 'KINETIC INTERFACE // BAUHAUS DESIGN SYSTEM',
    category: 'Interaction Design',
    year: '2026',
    shapeName: 'Wireframe Cube',
    colorHex: '#E63946',
    capsuleColor: 'red',
    stack: ['Figma', 'React', 'Design Tokens', 'Micro-interactions'],
    description: 'Design system modulare basato sulle proporzioni auree di Walter Gropius e sulla reattività delle interfacce contemporanee. Navigazione ergonomica a canali cromatici e feedback aptico.',
    metrics: { components: '140+', accessibility: 'WCAG AAA', tokenEngine: 'Multi-brand' },
    details: 'Un framework di componenti che unisce rigore matematico costruttivista e fluidità digitale. Include token dinamici per transizioni cromatiche e micro-interazioni basate su fisica elastica.'
  },
  {
    id: 'r-02',
    code: 'R-02 // WEB-3D',
    title: 'NEO-GEOMETRY // THREE.JS EXPERIENCES',
    category: 'Web Design',
    year: '2025',
    shapeName: 'Golden Octahedron',
    colorHex: '#FFB703',
    capsuleColor: 'yellow',
    stack: ['Three.js', 'WebGL', 'GLSL Shaders', 'Blender'],
    description: 'Sito web tridimensionale immersivo con sculture platonici interattivi, illuminazione volumetrica PBR e rendering real-time a 60 FPS ottimizzato per mobile.',
    metrics: { fps: '60 FPS Lock', drawCalls: '< 30', weight: '2.4 MB' },
    details: 'Esperienza web-native guidata da shader GLSL custom di rifrazione e dispersione della luce, con interattività al cursore e orientamento giroscopico.'
  },
  {
    id: 'r-03',
    code: 'R-03 // AR-TOY',
    title: 'JACK-IN-THE-AR // SPATIAL TOY ENGINE',
    category: 'Interaction Design',
    year: '2025',
    shapeName: 'Cyan Torus',
    colorHex: '#1D3557',
    capsuleColor: 'blue',
    stack: ['WebXR', 'MindAR', 'Spatial Audio', 'Three.js'],
    description: 'Esperienza WebAR senza installazione che proietta un jack-in-the-box digitale interattivo nello spazio fisico con mini-giochi arcade e audio binaurale.',
    metrics: { zeroInstall: 'Web-Native', latency: '< 16ms', retention: '4.8 min' },
    details: 'Inquadrando un QR code sul packaging, il giocattolo digitale prende vita sulla superficie del tavolo con animazioni a molla e collezionabili 3D.'
  },
  {
    id: 'r-04',
    code: 'R-04 // EDIT-RADIX',
    title: 'MODULAR RADIX // CYBER EDITORIAL',
    category: 'Editorial Design',
    year: '2024',
    shapeName: 'Crimson Icosahedron',
    colorHex: '#E63946',
    capsuleColor: 'red',
    stack: ['Risograph', 'Grid Systems', 'Variable Fonts', 'InDesign'],
    description: 'Pubblicazione ibrida cartacea e digitale che esplora la convergenza tra tipografia modernista svizzera e codici binari stampata a tre colori risograph.',
    metrics: { edition: '500 Ltd Ed', inks: 'Fluo Red / Yellow / Blue', pages: '160 pp' },
    details: 'Sovrastampe materiche di griglie binarie e matrici di dithering su carte riciclate giapponesi, accompagnate da un compendio web interattivo.'
  },
  {
    id: 'r-05',
    code: 'R-05 // BRAND-SPECTRUM',
    title: 'SPECTRUM KINETIC // DYNAMIC IDENTITY',
    category: 'Brand Design',
    year: '2026',
    shapeName: 'Prism Polyhedron',
    colorHex: '#FFB703',
    capsuleColor: 'yellow',
    stack: ['Generative Identity', 'Variable Typography', 'Motion', 'Design Kit'],
    description: 'Identità visiva parametrica per festival di arti digitali: il logotipo si trasforma parametricamente in base al rumore ambientale e agli input sonori.',
    metrics: { variants: '∞ Dynamic', formats: 'Web / OOH / AR', response: '12ms' },
    details: 'Un marchio che non ha una forma statica: il carattere si comprime ed estende come una molla in base ai decibel rilevati, proiettando tipografie mutanti nei colori primari.'
  },
  {
    id: 'r-06',
    code: 'R-06 // GRAPHIC-BAU',
    title: 'BAUHAUS POSTERS // FORM & ALGORITHM',
    category: 'Graphic Design',
    year: '2024',
    shapeName: 'Double Pyramid',
    colorHex: '#1D3557',
    capsuleColor: 'blue',
    stack: ['Serigrafia', 'Illustrator', 'Matrici Geometriche', 'Pantone'],
    description: 'Serie di manifesti serigrafici di grande formato che reinterpretano i principi costruttivisti di Dessau attraverso tassellature geometriche e gradienti ottici.',
    metrics: { printRuns: '300 Copie', format: '70x100 cm', papers: 'Fedrigoni 350g' },
    details: 'Composizioni rigorose a tre inchiostri primari con matrici di cerchi, triangoli e quadrati che creano illusioni di profondità e vibrazione cromatica.'
  },
  {
    id: 'r-07',
    code: 'R-07 // PERS-SYNTH',
    title: 'SYNTH-BOX // PHYSICAL COMPUTING TOY',
    category: 'Personal Projects',
    year: '2025',
    shapeName: 'Electric Torus Knot',
    colorHex: '#E63946',
    capsuleColor: 'red',
    stack: ['Arduino', 'Laser Cut', 'WebAudio API', 'Acrylic Hardware'],
    description: 'Sintetizzatore hardware custom racchiuso in scocca acrilica rossa trasparente. Comunica via WebMIDI con un canvas web per visualizzare le onde sonore.',
    metrics: { voices: '4 Polifonia', knobs: '8 Rotary', baudRate: '115200 bps' },
    details: 'Esperimento personale nato per esplorare la materialità del suono. Potenziometri in alluminio controllano filtri e delay virtuali a nastro in tempo reale.'
  },
  {
    id: 'r-08',
    code: 'R-08 // WEB-DITHER',
    title: 'DITHER-LAB // INTERACTIVE HALFTONE ENGINE',
    category: 'Web Design',
    year: '2026',
    shapeName: 'Dodecahedron Core',
    colorHex: '#2A9D8F',
    capsuleColor: 'green',
    stack: ['HTML5 Canvas', 'GLSL', 'Bayer Matrix', 'JavaScript'],
    description: 'Web app sperimentale per la quantizzazione grafica in tempo reale di immagini e flussi video attraverso matrici di Bayer 4x4 e 8x8 con export vettoriale.',
    metrics: { speed: '60 FPS', algorithms: 'Floyd / Bayer / Atkinson', export: 'SVG / PNG' },
    details: 'Strumento open-source per designer che trasforma qualsiasi input grafico in texture ditherate rétro-cyber con palette personalizzabili.'
  },
  {
    id: 'r-09',
    code: 'R-09 // GRAPH-TECT',
    title: 'RADICAL GRID // TECTONIC POSTERS',
    category: 'Graphic Design',
    year: '2025',
    shapeName: 'Truncated Cone',
    colorHex: '#FFB703',
    capsuleColor: 'yellow',
    stack: ['Offset UV', 'Matrici Svizzere', 'Typo Vettoriale', 'Illustrator'],
    description: 'Manifesti tipografici brutalisti su fogli 100x140cm con sovrastampe dorate e inchiostro nero denso. Analisi visiva della modularità costruttivista.',
    metrics: { format: '100x140 cm', tiratura: '150 Copie', carta: 'Munken Kristall' },
    details: 'Composizioni tipografiche che sfidano la leggibilità per enfatizzare il ritmo architettonico delle lettere e dei pieni/vuoti modulari.'
  },
  {
    id: 'r-10',
    code: 'R-10 // EDIT-MATRIX',
    title: 'TYPE MATRIX // VARIABLE MONOSPACE JOURNAL',
    category: 'Editorial Design',
    year: '2025',
    shapeName: 'Prism Cylinder',
    colorHex: '#1D3557',
    capsuleColor: 'blue',
    stack: ['Variable Font', 'Bookbinding', 'Risograph 4-Color', 'InDesign'],
    description: 'Rivista sperimentale rilegata a mano con filo rosso a vista. Esplora la storia dei caratteri a spaziatura fissa dai mainframe IBM alle interfacce cyber attuali.',
    metrics: { pagine: '192 pp', rilegatura: 'Filo Singer Rosso', carta: 'Fedrigoni Arena' },
    details: 'Ogni capitolo è impaginato secondo vincoli di codice e layout a griglia fissa, con inserti in carta velina trasparente ditherata.'
  },
  {
    id: 'r-11',
    code: 'R-11 // BRAND-CONSTRUCT',
    title: 'CYBER-CONSTRUCT // IDENTITY ENGINE',
    category: 'Brand Design',
    year: '2026',
    shapeName: 'Bauhaus Tetrahedron',
    colorHex: '#E63946',
    capsuleColor: 'red',
    stack: ['Brand Guidelines', 'Generative Assets', 'Design System', 'Figma'],
    description: 'Ecosistema di identità visiva modulare per un collettivo di architettura computazionale. Logotipi reattivi generati da algoritmi di suddivisione spaziale.',
    metrics: { assetCount: '250+', guidelines: 'Interattive Web', responsiveBrand: '100%' },
    details: 'Un marchio vivo che calcola la propria geometria in base alla superficie del supporto: da favicon di 16px a mega-insegne luminose a LED.'
  },
  {
    id: 'r-12',
    code: 'R-12 // PERS-GAMEPAD',
    title: 'PIXEL-GLITCH // HAPTIC ARCADE GAMEPAD',
    category: 'Personal Projects',
    year: '2026',
    shapeName: 'Arcade Star Polyhedron',
    colorHex: '#2A9D8F',
    capsuleColor: 'green',
    stack: ['ESP32', '3D Print', 'Haptic Motors', 'Bluetooth LE'],
    description: 'Controller arcade tascabile con switch meccanici a scatto rapido, display OLED monochrome integrato e vibrazione aptica programmabile per chiptune.',
    metrics: { latenza: '1.2ms BLE', switch: 'Gateron Red', autonomia: '24 Ore' },
    details: 'Progettato e stampato in 3D con resina fotopolimerica semitrasparente. Si connette direttamente al browser via WebBluetooth per i giochi web arcade.'
  }
];

class SuperCuteCandyClawMachine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.width = this.container.clientWidth || 920;
    this.height = this.container.clientHeight || 580;

    // Advanced Physics Simulation State
    this.carriage = { x: 0.2, z: 0, vx: 0, vz: 0 };
    this.clawPos = { x: 0.2, y: 3.2, z: 0 };
    this.clawActual = { x: 0.2, y: 3.2, z: 0 };
    this.clawSway = { angleX: 0, angleZ: 0, velX: 0, velZ: 0 };
    this.clawAngle = 0.22;
    this.state = 'IDLE';
    this.dropSpeed = 0;
    this.fallingCapsule = null;

    // Analog Spring Physics for the 3 Levers
    this.leverPhysics = [
      { rotX: 0, rotZ: 0, targetX: 0, targetZ: 0, velX: 0, velZ: 0 },
      { rotX: 0, rotZ: 0, targetX: 0, targetZ: 0, velX: 0, velZ: 0 },
      { rotX: 0, rotZ: 0, targetX: 0, targetZ: 0, velX: 0, velZ: 0 }
    ];

    this.bounds = {
      minX: -1.6, maxX: 1.8,
      minZ: -1.2, maxZ: 1.2,
      topY: 3.2,
      bottomY: 0.85
    };

    this.chutePos = { x: -1.4, z: 0.9 };
    this.keys = { up: false, down: false, left: false, right: false };
    this.levers = [];

    this.marqueeBulbs = [];
    this.time = 0;

    this.gantryX = null;
    this.carriageZ = null;
    this.cableMesh = null;
    this.clawAssembly = null;
    this.clawFingers = [];
    this.capsules = [];
    this.grabbedCapsule = null;

    this.init();
  }

  init() {
    this.setupScene();
    this.setupLighting();
    this.buildToyMachine();
    this.buildGantryAndClaw();
    this.spawnCandyFoilWrappers();
    this.spawnColorfulCapsules();
    this.spawnOpenCapsuleDetail();
    this.setupEvents();
    this.setupControlsUI();

    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 4.3, 7.8);
    this.camera.lookAt(0, 1.7, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 580;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.82);
    this.scene.add(ambient);

    const warmKey = new THREE.SpotLight(0xfffaed, 1.45, 18, Math.PI / 3, 0.4, 1.2);
    warmKey.position.set(2, 6.8, 5.5);
    warmKey.castShadow = true;
    warmKey.shadow.mapSize.width = 1024;
    warmKey.shadow.mapSize.height = 1024;
    this.scene.add(warmKey);

    const redRim = new THREE.DirectionalLight(0xE62020, 0.85);
    redRim.position.set(-4, 3.5, -2);
    this.scene.add(redRim);

    const yellowFill = new THREE.DirectionalLight(0xFFDD00, 0.65);
    yellowFill.position.set(4, 2.5, -1);
    this.scene.add(yellowFill);
  }

  buildToyMachine() {
    const machine = new THREE.Group();

    // High gloss candy red material (matches the photo!)
    const redGlossMat = new THREE.MeshStandardMaterial({
      color: 0xE52024,
      roughness: 0.18,
      metalness: 0.12
    });

    const toyGrayMat = new THREE.MeshStandardMaterial({
      color: 0xD4D6DF,
      roughness: 0.35,
      metalness: 0.15
    });

    const silverChromeMat = new THREE.MeshStandardMaterial({
      color: 0xC8CCD6,
      roughness: 0.15,
      metalness: 0.92
    });

    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.32,
      transparent: true,
      roughness: 0.04,
      reflectivity: 0.9,
      ior: 1.5
    });

    const baseW = 4.6;
    const baseH = 0.65;
    const baseD = 3.6;

    // 1. Lower Gray Chassis with Toy Feet
    const lowerBaseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    const lowerBase = new THREE.Mesh(lowerBaseGeo, toyGrayMat);
    lowerBase.position.set(0, baseH / 2, 0);
    lowerBase.castShadow = true;
    lowerBase.receiveShadow = true;
    machine.add(lowerBase);

    // 4 Rounded Toy Feet
    const footGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.12, 16);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x2A2A30, roughness: 0.7 });
    [
      [-baseW / 2 + 0.35, -baseD / 2 + 0.35],
      [ baseW / 2 - 0.35, -baseD / 2 + 0.35],
      [-baseW / 2 + 0.35,  baseD / 2 - 0.35],
      [ baseW / 2 - 0.35,  baseD / 2 - 0.35]
    ].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx, 0.06, fz);
      machine.add(foot);
    });

    // Lower Red Accent Drawer Plate
    const drawerGeo = new THREE.BoxGeometry(1.8, 0.36, 0.08);
    const drawer = new THREE.Mesh(drawerGeo, redGlossMat);
    drawer.position.set(0.65, 0.36, baseD / 2 + 0.04);
    machine.add(drawer);

    // 2. Front-Left Prize Retrieval Trough (The open gray bin in front!)
    const troughGeo = new THREE.BoxGeometry(1.2, 0.46, 0.72);
    const trough = new THREE.Mesh(troughGeo, toyGrayMat);
    trough.position.set(-1.4, 0.28, baseD / 2 + 0.24);
    machine.add(trough);

    const troughCavityGeo = new THREE.BoxGeometry(1.0, 0.38, 0.58);
    const troughCavityMat = new THREE.MeshStandardMaterial({ color: 0x585864, roughness: 0.6 });
    const troughCavity = new THREE.Mesh(troughCavityGeo, troughCavityMat);
    troughCavity.position.set(-1.4, 0.33, baseD / 2 + 0.26);
    machine.add(troughCavity);

    // 3. Molded Red Console Deck
    const deckGeo = new THREE.BoxGeometry(baseW + 0.2, 0.28, baseD + 0.6);
    const deck = new THREE.Mesh(deckGeo, redGlossMat);
    deck.position.set(0, baseH + 0.14, 0.25);
    deck.castShadow = true;
    machine.add(deck);

    // Extended Front Console Shelf with rounded edge
    const ledgeGeo = new THREE.BoxGeometry(2.4, 0.18, 0.72);
    const ledge = new THREE.Mesh(ledgeGeo, redGlossMat);
    ledge.position.set(0.65, baseH + 0.12, baseD / 2 + 0.5);
    machine.add(ledge);

    // Sunburst Graphic Decal on Console (Cyan and Yellow Rays as in photo!)
    const decalCanvas = document.createElement('canvas');
    decalCanvas.width = 512;
    decalCanvas.height = 128;
    const dctx = decalCanvas.getContext('2d');
    dctx.fillStyle = '#0E7AC4';
    dctx.fillRect(0, 0, 512, 128);

    dctx.fillStyle = '#FFDD00';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      dctx.beginPath();
      dctx.moveTo(256, 128);
      dctx.arc(256, 128, 420, a, a + Math.PI / 16);
      dctx.fill();
    }
    dctx.strokeStyle = '#E52024';
    dctx.lineWidth = 14;
    dctx.strokeRect(6, 6, 500, 116);

    const decalTexture = new THREE.CanvasTexture(decalCanvas);
    const decalGeo = new THREE.PlaneGeometry(2.2, 0.46);
    const decalMat = new THREE.MeshBasicMaterial({ map: decalTexture });
    const decalMesh = new THREE.Mesh(decalGeo, decalMat);
    decalMesh.rotation.x = -Math.PI / 2;
    decalMesh.position.set(0.65, baseH + 0.22, baseD / 2 + 0.5);
    machine.add(decalMesh);

    // 4. Three Retro Ball-Top Joystick Levers (Interactive!)
    this.levers = [];
    const leverXPositions = [-0.62, 0.0, 0.62];
    const leverBallColors = [0x0E7AC4, 0xD4D6DF, 0xE52024]; // Blue, Silver, Red balls!

    leverXPositions.forEach((lx, i) => {
      const lBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16);
      const lBaseMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5 });
      const lBase = new THREE.Mesh(lBaseGeo, lBaseMat);
      lBase.position.set(0.65 + lx, baseH + 0.23, baseD / 2 + 0.5);
      machine.add(lBase);

      const leverGroup = new THREE.Group();
      leverGroup.position.set(0.65 + lx, baseH + 0.27, baseD / 2 + 0.5);

      // Silver shaft
      const shaftGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.46, 14);
      const shaft = new THREE.Mesh(shaftGeo, silverChromeMat);
      shaft.position.y = 0.23;
      leverGroup.add(shaft);

      // Shiny spherical ball top
      const ballGeo = new THREE.SphereGeometry(0.125, 20, 20);
      const ballMat = new THREE.MeshStandardMaterial({
        color: leverBallColors[i],
        roughness: 0.15,
        metalness: 0.5
      });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      ball.position.y = 0.46;
      leverGroup.add(ball);

      machine.add(leverGroup);
      this.levers.push(leverGroup);
    });

    // 5. Four Silver Upright Structural Pillars
    const colRadius = 0.12;
    const colHeight = 3.0;
    const colGeo = new THREE.CylinderGeometry(colRadius, colRadius, colHeight, 16);

    const cornerCols = [
      [-baseW / 2 + 0.25, -baseD / 2 + 0.25],
      [ baseW / 2 - 0.25, -baseD / 2 + 0.25],
      [-baseW / 2 + 0.25,  baseD / 2 - 0.25],
      [ baseW / 2 - 0.25,  baseD / 2 - 0.25]
    ];

    cornerCols.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(colGeo, silverChromeMat);
      col.position.set(cx, baseH + 0.28 + colHeight / 2, cz);
      col.castShadow = true;
      machine.add(col);
    });

    // 6. Clear Acrylic Walls
    const glassH = colHeight;
    const glassW = baseW - 0.1;
    const glassD = baseD - 0.1;
    const glassY = baseH + 0.28 + glassH / 2;

    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassW, glassH), acrylicMat);
    frontGlass.position.set(0, glassY, baseD / 2 - 0.05);
    machine.add(frontGlass);

    const backGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassW, glassH), acrylicMat);
    backGlass.rotation.y = Math.PI;
    backGlass.position.set(0, glassY, -baseD / 2 + 0.05);
    machine.add(backGlass);

    const leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassD, glassH), acrylicMat);
    leftGlass.rotation.y = Math.PI / 2;
    leftGlass.position.set(-baseW / 2 + 0.05, glassY, 0);
    machine.add(leftGlass);

    const rightGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassD, glassH), acrylicMat);
    rightGlass.rotation.y = -Math.PI / 2;
    rightGlass.position.set(baseW / 2 - 0.05, glassY, 0);
    machine.add(rightGlass);

    // 7. Internal Red Prize Chute Partition (Front-Left)
    const chuteWallGeo = new THREE.BoxGeometry(1.1, 1.2, 1.0);
    const chuteWall = new THREE.Mesh(chuteWallGeo, redGlossMat);
    chuteWall.position.set(this.chutePos.x, baseH + 0.28 + 0.6, this.chutePos.z);
    machine.add(chuteWall);

    const chuteCavityGeo = new THREE.CylinderGeometry(0.46, 0.38, 0.52, 24, 1, true);
    const chuteCavityMat = new THREE.MeshStandardMaterial({ color: 0x18181D, side: THREE.DoubleSide });
    const chuteCavity = new THREE.Mesh(chuteCavityGeo, chuteCavityMat);
    chuteCavity.position.set(this.chutePos.x, baseH + 0.28 + 1.2, this.chutePos.z);
    machine.add(chuteCavity);

    // 8. Molded Glossy Red Canopy with Marquee Sign!
    const roofY = baseH + 0.28 + colHeight;
    const canopyGeo = new THREE.BoxGeometry(baseW + 0.4, 0.46, baseD + 0.4);
    const canopy = new THREE.Mesh(canopyGeo, redGlossMat);
    canopy.position.set(0, roofY + 0.23, 0);
    canopy.castShadow = true;
    machine.add(canopy);

    // Stepped Upper Roof Tray (Beveled retro lip as in reference photo)
    const topTrayGeo = new THREE.BoxGeometry(baseW + 0.1, 0.22, baseD + 0.1);
    const topTray = new THREE.Mesh(topTrayGeo, redGlossMat);
    topTray.position.set(0, roofY + 0.56, 0);
    machine.add(topTray);

    // Retro Marquee Arch Sign on Canopy ("★ JACK'S CANDY CLAW ★")
    const marqueeCanvas = document.createElement('canvas');
    marqueeCanvas.width = 512;
    marqueeCanvas.height = 80;
    const mctx = marqueeCanvas.getContext('2d');
    mctx.fillStyle = '#E52024';
    mctx.fillRect(0, 0, 512, 80);
    mctx.strokeStyle = '#FFDD00';
    mctx.lineWidth = 6;
    mctx.strokeRect(4, 4, 504, 72);
    mctx.fillStyle = '#FFFFFF';
    mctx.font = 'bold 36px "Montserrat", sans-serif';
    mctx.textAlign = 'center';
    mctx.fillText('★ JACK’S TOY CLAW ★', 256, 52);

    const marqueeTex = new THREE.CanvasTexture(marqueeCanvas);
    const marqueeGeo = new THREE.PlaneGeometry(3.6, 0.38);
    const marqueeMat = new THREE.MeshBasicMaterial({ map: marqueeTex });
    const marqueeMesh = new THREE.Mesh(marqueeGeo, marqueeMat);
    marqueeMesh.position.set(0, roofY + 0.23, baseD / 2 + 0.21);
    machine.add(marqueeMesh);

    // Marquee Chaser Bulbs along front roofline
    this.marqueeBulbs = [];
    const bulbGeo = new THREE.SphereGeometry(0.045, 10, 10);
    for (let b = -1.9; b <= 1.9; b += 0.38) {
      const bMat = new THREE.MeshBasicMaterial({ color: 0xFFDD00 });
      const bulb = new THREE.Mesh(bulbGeo, bMat);
      bulb.position.set(b, roofY + 0.44, baseD / 2 + 0.22);
      machine.add(bulb);
      this.marqueeBulbs.push(bulb);
    }

    // Playfield Bed Floor
    const bedGeo = new THREE.BoxGeometry(baseW - 0.2, 0.1, baseD - 0.2);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0xEAEAEA, roughness: 0.6 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, baseH + 0.29, 0);
    bed.receiveShadow = true;
    machine.add(bed);

    this.scene.add(machine);
  }

  buildGantryAndClaw() {
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xC8CCD6, metalness: 0.92, roughness: 0.15 });

    const railGeo = new THREE.BoxGeometry(4.0, 0.1, 0.1);
    this.gantryX = new THREE.Mesh(railGeo, silverMat);
    this.gantryX.position.set(0, 3.65, 0);
    this.scene.add(this.gantryX);

    const carGeo = new THREE.BoxGeometry(0.42, 0.14, 0.42);
    const carMat = new THREE.MeshStandardMaterial({ color: 0xE52024, roughness: 0.2 });
    this.carriageZ = new THREE.Mesh(carGeo, carMat);
    this.carriageZ.position.set(0, 3.65, 0);
    this.scene.add(this.carriageZ);

    const cableGeo = new THREE.CylinderGeometry(0.018, 0.018, 1, 8);
    this.cableMesh = new THREE.Mesh(cableGeo, silverMat);
    this.cableMesh.position.set(0, 3.4, 0);
    this.scene.add(this.cableMesh);

    // Scoop Claw with rivets and curved fingers
    this.clawAssembly = new THREE.Group();
    this.clawAssembly.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);

    const winchGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.2, 16);
    const winch = new THREE.Mesh(winchGeo, silverMat);
    this.clawAssembly.add(winch);

    this.clawFingers = [];
    const fingerAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

    fingerAngles.forEach(angle => {
      const fingerRoot = new THREE.Group();
      fingerRoot.rotation.y = angle;

      const mount = new THREE.Group();
      mount.position.set(0.18, -0.06, 0);

      const armGeo = new THREE.BoxGeometry(0.08, 0.42, 0.14);
      const arm = new THREE.Mesh(armGeo, silverMat);
      arm.position.set(0, -0.2, 0);
      arm.rotation.z = 0.25;
      mount.add(arm);

      const scoopGeo = new THREE.BoxGeometry(0.07, 0.32, 0.2);
      const scoop = new THREE.Mesh(scoopGeo, silverMat);
      scoop.position.set(-0.09, -0.36, 0);
      scoop.rotation.z = -0.7;
      mount.add(scoop);

      fingerRoot.add(mount);
      this.clawAssembly.add(fingerRoot);
      this.clawFingers.push(mount);
    });

    this.scene.add(this.clawAssembly);
    this.updateClawTransforms();
  }

  // Spawns 40+ crinkled metallic candy foil wrappers (Gold, Purple, Cyan, Magenta) as in the photo!
  spawnCandyFoilWrappers() {
    const foilColors = [0xFFD700, 0x8338EC, 0xFF007F, 0x00E5FF, 0x38B000, 0xFF6B00];
    const floorY = 1.15;

    for (let i = 0; i < 42; i++) {
      const col = foilColors[i % foilColors.length];
      const candyGroup = new THREE.Group();

      const foilMat = new THREE.MeshStandardMaterial({
        color: col,
        metalness: 0.95,
        roughness: 0.18
      });

      // Center sweet cylinder
      const sweetGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 10);
      const sweet = new THREE.Mesh(sweetGeo, foilMat);
      sweet.rotation.z = Math.PI / 2;
      candyGroup.add(sweet);

      // Left twisted foil bow
      const bowLeftGeo = new THREE.ConeGeometry(0.09, 0.12, 8);
      const bowLeft = new THREE.Mesh(bowLeftGeo, foilMat);
      bowLeft.position.set(-0.14, 0, 0);
      bowLeft.rotation.z = Math.PI / 2;
      candyGroup.add(bowLeft);

      // Right twisted foil bow
      const bowRightGeo = new THREE.ConeGeometry(0.09, 0.12, 8);
      const bowRight = new THREE.Mesh(bowRightGeo, foilMat);
      bowRight.position.set(0.14, 0, 0);
      bowRight.rotation.z = -Math.PI / 2;
      candyGroup.add(bowRight);

      // Random position across bed avoiding the chute area
      let rx = (Math.random() - 0.5) * 3.4;
      let rz = (Math.random() - 0.5) * 2.4;
      if (rx < -0.8 && rz > 0.4) rx += 1.4; // leave chute clear

      candyGroup.position.set(rx, floorY + (Math.random() * 0.04), rz);
      candyGroup.rotation.y = Math.random() * Math.PI * 2;
      candyGroup.rotation.x = (Math.random() - 0.5) * 0.3;
      candyGroup.rotation.z = (Math.random() - 0.5) * 0.3;

      this.scene.add(candyGroup);
    }
  }

  // Spawns colorful pill/egg gashapon capsules
  spawnColorfulCapsules() {
    this.capsules.forEach(c => this.scene.remove(c.mesh));
    this.capsules = [];

    const capRadius = 0.24;
    const capHeight = 0.26;

    const toyCapsuleColors = [
      { hex: 0xE52024, name: 'red' },
      { hex: 0xFFDD00, name: 'yellow' },
      { hex: 0x8338EC, name: 'purple' },
      { hex: 0x3A86FF, name: 'blue' },
      { hex: 0x38B000, name: 'green' },
      { hex: 0xFB5607, name: 'orange' },
      { hex: 0xFFDD00, name: 'yellow' },
      { hex: 0xE52024, name: 'red' }
    ];

    const floorY = 1.25;

    const bedPositions = [
      { x:  0.2, z:  0.0, rotX: 1.57, rotY: 0.2 },
      { x:  1.1, z:  0.4, rotX: 1.57, rotY: -0.6 },
      { x: -0.4, z: -0.5, rotX: 1.57, rotY: 0.8 },
      { x:  0.8, z: -0.6, rotX: 1.57, rotY: 0.1 },
      { x: -0.2, z:  0.6, rotX: 1.57, rotY: -0.4 },
      { x:  1.3, z: -0.1, rotX: 1.57, rotY: 1.2 },
      { x:  0.5, z:  0.8, rotX: 1.57, rotY: -0.9 },
      { x: -0.8, z:  0.1, rotX: 1.57, rotY: 0.4 }
    ];

    window.PROJECT_REGISTRY.forEach((proj, idx) => {
      const pos = bedPositions[idx] || { x: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 1.5, rotX: 1.57, rotY: 0 };
      const capCol = toyCapsuleColors[idx % toyCapsuleColors.length];

      const capGroup = new THREE.Group();

      const bodyGeo = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 20);
      const capMat = new THREE.MeshStandardMaterial({
        color: capCol.hex,
        roughness: 0.22,
        metalness: 0.15
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, capMat);
      bodyMesh.castShadow = true;
      capGroup.add(bodyMesh);

      const topGeo = new THREE.SphereGeometry(capRadius, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const topMesh = new THREE.Mesh(topGeo, capMat);
      topMesh.position.y = capHeight / 2;
      capGroup.add(topMesh);

      const btmGeo = new THREE.SphereGeometry(capRadius, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const btmMesh = new THREE.Mesh(btmGeo, capMat);
      btmMesh.position.y = -capHeight / 2;
      capGroup.add(btmMesh);

      const token = this.createInternalToken(proj, capRadius * 0.7);
      capGroup.add(token);

      capGroup.position.set(pos.x, floorY, pos.z);
      capGroup.rotation.x = pos.rotX;
      capGroup.rotation.y = pos.rotY;

      this.scene.add(capGroup);

      this.capsules.push({
        id: proj.id,
        project: proj,
        mesh: capGroup,
        token: token,
        colorHex: capCol.hex,
        originalPos: { x: pos.x, y: floorY, z: pos.z },
        isGrabbed: false,
        isInChute: false
      });
    });
  }

  // Replicates the charming open capsule detail sitting outside the chute as in the photo!
  spawnOpenCapsuleDetail() {
    const detailGroup = new THREE.Group();
    const capMat = new THREE.MeshStandardMaterial({ color: 0x3A86FF, roughness: 0.25 });

    // Open bottom cup
    const btmCupGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.22, 16);
    const btmCup = new THREE.Mesh(btmCupGeo, capMat);
    btmCup.position.set(-2.0, 0.35, 2.2);
    detailGroup.add(btmCup);

    // Tilted open lid
    const lidGeo = new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const lid = new THREE.Mesh(lidGeo, capMat);
    lid.position.set(-2.0, 0.48, 2.2);
    lid.rotation.z = 0.6;
    detailGroup.add(lid);

    // A golden wrapped candy resting beside it!
    const candyMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.95, roughness: 0.2 });
    const sweetGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 8);
    const sweet = new THREE.Mesh(sweetGeo, candyMat);
    sweet.position.set(-2.3, 0.24, 2.3);
    sweet.rotation.z = Math.PI / 2;
    detailGroup.add(sweet);

    this.scene.add(detailGroup);
  }

  createInternalToken(proj, size) {
    let geo;
    let mat = new THREE.MeshStandardMaterial({
      color: proj.colorHex,
      roughness: 0.2,
      metalness: 0.8
    });

    switch (proj.shapeName) {
      case 'Wireframe Cube':
        geo = new THREE.BoxGeometry(size, size, size);
        mat.wireframe = true;
        break;
      case 'Golden Octahedron':
        geo = new THREE.OctahedronGeometry(size);
        break;
      case 'Cyan Torus':
        geo = new THREE.TorusGeometry(size * 0.7, size * 0.22, 12, 24);
        break;
      case 'Crimson Icosahedron':
        geo = new THREE.IcosahedronGeometry(size);
        break;
      case 'Double Pyramid':
        geo = new THREE.ConeGeometry(size * 0.8, size * 1.3, 4);
        break;
      case 'Electric Torus Knot':
        geo = new THREE.TorusKnotGeometry(size * 0.6, size * 0.2, 32, 8);
        break;
      default:
        geo = new THREE.DodecahedronGeometry(size);
        break;
    }

    const tokenMesh = new THREE.Mesh(geo, mat);
    tokenMesh.position.set(0, 0, 0);
    return tokenMesh;
  }

  setupEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      let matched = false;
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.keys.up = true;
          this.tiltLever(1, -0.35, 0);
          matched = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.keys.down = true;
          this.tiltLever(1, 0.35, 0);
          matched = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.keys.left = true;
          this.tiltLever(0, 0, 0.35);
          matched = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = true;
          this.tiltLever(0, 0, -0.35);
          matched = true;
          break;
        case 'Space':
        case 'Enter':
          this.tiltLever(2, 0.45, 0);
          this.dropClaw();
          matched = true;
          break;
      }

      if (matched) {
        e.preventDefault();
        if (window.audioEngine) window.audioEngine.playJoystickClack();
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.keys.up = false;
          this.tiltLever(1, 0, 0);
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.keys.down = false;
          this.tiltLever(1, 0, 0);
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.keys.left = false;
          this.tiltLever(0, 0, 0);
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = false;
          this.tiltLever(0, 0, 0);
          break;
        case 'Space':
        case 'Enter':
          this.tiltLever(2, 0, 0);
          break;
      }
    });
  }

  tiltLever(index, rotX, rotZ) {
    if (this.leverPhysics[index]) {
      this.leverPhysics[index].targetX = rotX;
      this.leverPhysics[index].targetZ = rotZ;
    }
  }

  updateLeverPhysics() {
    this.leverPhysics.forEach((lp, i) => {
      const lev = this.levers[i];
      if (!lev) return;

      const spring = 0.32;
      const damp = 0.74;

      const ax = (lp.targetX - lp.rotX) * spring;
      lp.velX = (lp.velX + ax) * damp;
      lp.rotX += lp.velX;

      const az = (lp.targetZ - lp.rotZ) * spring;
      lp.velZ = (lp.velZ + az) * damp;
      lp.rotZ += lp.velZ;

      lev.rotation.x = lp.rotX;
      lev.rotation.z = lp.rotZ;
    });
  }

  setupControlsUI() {
    const btnUp = document.getElementById('crane-btn-up');
    const btnDown = document.getElementById('crane-btn-down');
    const btnLeft = document.getElementById('crane-btn-left');
    const btnRight = document.getElementById('crane-btn-right');
    const btnDrop = document.getElementById('crane-btn-drop');

    const bind = (btn, keyProp, leverIdx, rx, rz) => {
      if (!btn) return;
      const start = (e) => {
        e.preventDefault();
        this.keys[keyProp] = true;
        this.tiltLever(leverIdx, rx, rz);
        if (window.audioEngine) window.audioEngine.playJoystickClack();
      };
      const end = (e) => {
        e.preventDefault();
        this.keys[keyProp] = false;
        this.tiltLever(leverIdx, 0, 0);
      };
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end);
    };

    bind(btnUp, 'up', 1, -0.35, 0);
    bind(btnDown, 'down', 1, 0.35, 0);
    bind(btnLeft, 'left', 0, 0, 0.35);
    bind(btnRight, 'right', 0, 0, -0.35);

    if (btnDrop) {
      btnDrop.addEventListener('click', () => {
        this.tiltLever(2, 0.45, 0);
        setTimeout(() => this.tiltLever(2, 0, 0), 300);
        this.dropClaw();
      });
    }
  }

  dropClaw() {
    if (this.state !== 'IDLE') return;

    this.state = 'DROPPING';
    if (window.audioEngine) window.audioEngine.playClawDrop();
    this.updateStatusUI('PESCATA IN CORSO...');
  }

  updateClawTransforms() {
    if (this.gantryX) this.gantryX.position.z = this.carriage.z;
    if (this.carriageZ) this.carriageZ.position.set(this.carriage.x, 3.65, this.carriage.z);

    // Dynamic 3D Hanging Cable with real physical orientation
    const pTop = new THREE.Vector3(this.carriage.x, 3.65, this.carriage.z);
    const pBottom = new THREE.Vector3(this.clawActual.x, this.clawActual.y + 0.28, this.clawActual.z);
    const cableVector = new THREE.Vector3().subVectors(pBottom, pTop);
    const cableDist = cableVector.length();

    if (this.cableMesh) {
      const mid = new THREE.Vector3().addVectors(pTop, pBottom).multiplyScalar(0.5);
      this.cableMesh.position.copy(mid);
      this.cableMesh.scale.set(1, Math.max(0.08, cableDist), 1);
      
      const dir = cableVector.clone().normalize();
      this.cableMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
    }

    if (this.clawAssembly) {
      this.clawAssembly.position.set(this.clawActual.x, this.clawActual.y, this.clawActual.z);
      this.clawAssembly.rotation.z = -this.clawSway.angleX * 0.95;
      this.clawAssembly.rotation.x = this.clawSway.angleZ * 0.95;
      this.clawAssembly.rotation.y = (this.clawSway.angleX * this.clawSway.angleZ) * 0.45;
    }

    this.clawFingers.forEach(f => {
      f.rotation.z = -this.clawAngle;
    });
  }

  updateStatusUI(text) {
    const statusEl = document.getElementById('crane-status-hud');
    if (statusEl) statusEl.textContent = text;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.time++;

    // Update Arcade Levers Spring Physics
    this.updateLeverPhysics();

    // Marquee bulbs blinking sequence
    if (this.marqueeBulbs.length && this.time % 12 === 0) {
      const step = Math.floor(this.time / 12) % 2;
      this.marqueeBulbs.forEach((b, i) => {
        if (i % 2 === step) {
          b.material.color.setHex(0xFFDD00);
        } else {
          b.material.color.setHex(0xE52024);
        }
      });
    }

    // Gentle spinning of internal tokens
    this.capsules.forEach(c => {
      if (c.token) c.token.rotation.y += 0.02;
    });

    // 1. CALCULATE CABLE LENGTH AND PENDULUM SWAY PHYSICS
    const cableL = Math.max(0.35, 3.65 - this.clawPos.y);
    const gravity = 0.048;
    const isHeavy = !!this.grabbedCapsule;
    const swayDamp = isHeavy ? 0.96 : 0.938;

    const torqueX = -Math.sin(this.clawSway.angleX) * (gravity / cableL) - this.carriage.vx * (0.16 / Math.sqrt(cableL));
    this.clawSway.velX = (this.clawSway.velX + torqueX) * swayDamp;
    this.clawSway.angleX += this.clawSway.velX;

    const torqueZ = -Math.sin(this.clawSway.angleZ) * (gravity / cableL) - this.carriage.vz * (0.16 / Math.sqrt(cableL));
    this.clawSway.velZ = (this.clawSway.velZ + torqueZ) * swayDamp;
    this.clawSway.angleZ += this.clawSway.velZ;

    // Real physical position of the claw
    this.clawActual.x = this.carriage.x + Math.sin(this.clawSway.angleX) * cableL * 0.28;
    this.clawActual.z = this.carriage.z + Math.sin(this.clawSway.angleZ) * cableL * 0.28;
    this.clawActual.y = this.clawPos.y - (1 - Math.cos(this.clawSway.angleX)) * 0.12 - (1 - Math.cos(this.clawSway.angleZ)) * 0.12;

    // 2. KINEMATIC STATE MACHINE
    switch (this.state) {
      case 'IDLE':
        let ax = 0, az = 0;
        if (this.keys.left) ax -= 0.0075;
        if (this.keys.right) ax += 0.0075;
        if (this.keys.up) az -= 0.0075;
        if (this.keys.down) az += 0.0075;

        this.carriage.vx = (this.carriage.vx + ax) * 0.88;
        this.carriage.vz = (this.carriage.vz + az) * 0.88;

        this.carriage.x += this.carriage.vx;
        this.carriage.z += this.carriage.vz;

        // Soft physical bumpers at rail boundaries
        if (this.carriage.x < this.bounds.minX) {
          this.carriage.x = this.bounds.minX;
          this.carriage.vx = -this.carriage.vx * 0.32;
        } else if (this.carriage.x > this.bounds.maxX) {
          this.carriage.x = this.bounds.maxX;
          this.carriage.vx = -this.carriage.vx * 0.32;
        }

        if (this.carriage.z < this.bounds.minZ) {
          this.carriage.z = this.bounds.minZ;
          this.carriage.vz = -this.carriage.vz * 0.32;
        } else if (this.carriage.z > this.bounds.maxZ) {
          this.carriage.z = this.bounds.maxZ;
          this.carriage.vz = -this.carriage.vz * 0.32;
        }

        this.clawAngle = THREE.MathUtils.lerp(this.clawAngle, 0.22, 0.1);
        this.updateClawTransforms();
        break;

      case 'DROPPING':
        // Decelerate horizontal gantry
        this.carriage.vx *= 0.75;
        this.carriage.vz *= 0.75;
        this.carriage.x += this.carriage.vx;
        this.carriage.z += this.carriage.vz;

        this.dropSpeed = (this.dropSpeed || 0.015) + 0.0035;
        this.clawPos.y -= this.dropSpeed;
        this.clawAngle = THREE.MathUtils.lerp(this.clawAngle, 0.68, 0.16);

        if (this.clawPos.y <= this.bounds.bottomY) {
          this.clawPos.y = this.bounds.bottomY;
          this.state = 'GRABBING';
          this.grabTimer = 0;
          this.dropSpeed = 0;

          // Contact impulse wobble
          this.clawSway.velX += (Math.random() - 0.5) * 0.04;
          this.clawSway.velZ += (Math.random() - 0.5) * 0.04;

          if (window.audioEngine) window.audioEngine.playGrab();
          this.updateStatusUI('PRESA IN CORSO');
        }
        this.updateClawTransforms();
        break;

      case 'GRABBING':
        this.grabTimer = (this.grabTimer || 0) + 1;
        this.clawAngle = THREE.MathUtils.lerp(this.clawAngle, -0.06, 0.16);

        if (this.grabTimer === 10) {
          let closest = null;
          let minDist = 1.45;

          this.capsules.forEach(c => {
            if (c.isInChute) return;
            const dx = c.mesh.position.x - this.clawActual.x;
            const dz = c.mesh.position.z - this.clawActual.z;
            const d = Math.sqrt(dx * dx + dz * dz);
            if (d < minDist) {
              minDist = d;
              closest = c;
            }
          });

          if (!closest) {
            let fallbackMin = 999;
            this.capsules.forEach(c => {
              if (c.isInChute) return;
              const dx = c.mesh.position.x - this.clawActual.x;
              const dz = c.mesh.position.z - this.clawActual.z;
              const d = Math.sqrt(dx * dx + dz * dz);
              if (d < fallbackMin) {
                fallbackMin = d;
                closest = c;
              }
            });
          }

          if (closest) {
            this.grabbedCapsule = closest;
            closest.isGrabbed = true;
            this.clawSway.velX += (Math.random() - 0.5) * 0.03;
          }
        }

        if (this.grabTimer > 24) {
          this.state = 'ASCENDING';
          this.updateStatusUI('PRESA EFFETTUATA!');
        }
        this.updateClawTransforms();
        break;

      case 'ASCENDING':
        this.clawPos.y += 0.052;

        if (this.grabbedCapsule) {
          this.grabbedCapsule.mesh.position.set(
            this.clawActual.x,
            this.clawActual.y - 0.42,
            this.clawActual.z
          );
          this.grabbedCapsule.mesh.rotation.z = this.clawAssembly.rotation.z;
          this.grabbedCapsule.mesh.rotation.x = this.clawAssembly.rotation.x + 1.57;
        }

        if (this.clawPos.y >= this.bounds.topY) {
          this.clawPos.y = this.bounds.topY;
          this.state = 'MOVING_TO_CHUTE';
          this.updateStatusUI('VERSO IL VANO PREMI...');
        }
        this.updateClawTransforms();
        break;

      case 'MOVING_TO_CHUTE':
        const dx = this.chutePos.x - this.carriage.x;
        const dz = this.chutePos.z - this.carriage.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.08) {
          const speed = Math.min(0.065, dist * 0.08);
          this.carriage.vx = (dx / dist) * speed;
          this.carriage.vz = (dz / dist) * speed;
          this.carriage.x += this.carriage.vx;
          this.carriage.z += this.carriage.vz;

          if (this.grabbedCapsule) {
            this.grabbedCapsule.mesh.position.set(
              this.clawActual.x,
              this.clawActual.y - 0.42,
              this.clawActual.z
            );
            this.grabbedCapsule.mesh.rotation.z = this.clawAssembly.rotation.z;
            this.grabbedCapsule.mesh.rotation.x = this.clawAssembly.rotation.x + 1.57;
          }
        } else {
          this.carriage.vx *= 0.5;
          this.carriage.vz *= 0.5;
          this.state = 'RELEASING';
          this.releaseTimer = 0;
          this.updateStatusUI('RILASCIO CAPSULA...');
        }
        this.updateClawTransforms();
        break;

      case 'RELEASING':
        this.releaseTimer = (this.releaseTimer || 0) + 1;
        this.clawAngle = THREE.MathUtils.lerp(this.clawAngle, 0.72, 0.16);

        // Jerk upward on release
        if (this.releaseTimer < 6) {
          this.clawPos.y = THREE.MathUtils.lerp(this.clawPos.y, this.bounds.topY + 0.06, 0.2);
        }

        // Detach capsule into physical trajectory
        if (this.grabbedCapsule && this.releaseTimer === 6) {
          this.fallingCapsule = {
            capsule: this.grabbedCapsule,
            x: this.clawActual.x,
            y: this.clawActual.y - 0.42,
            z: this.clawActual.z,
            vx: -0.015,
            vy: -0.02,
            vz: 0.02,
            rotX: this.grabbedCapsule.mesh.rotation.x,
            rotZ: this.grabbedCapsule.mesh.rotation.z,
            vRotX: 0.15,
            vRotZ: 0.12,
            bounced: false,
            settled: false,
            settleTimer: 0
          };
          this.grabbedCapsule = null;
          if (window.audioEngine) window.audioEngine.playChuteDrop();
        }

        // If capsule is currently tumbling through the chute
        if (this.fallingCapsule) {
          const fc = this.fallingCapsule;
          if (!fc.settled) {
            fc.vy -= 0.012; // gravity
            fc.x += fc.vx;
            fc.y += fc.vy;
            fc.z += fc.vz;
            fc.rotX += fc.vRotX;
            fc.rotZ += fc.vRotZ;

            // Funnel collision at y <= 0.85
            if (fc.y <= 0.85 && !fc.bounced) {
              fc.bounced = true;
              fc.vy = -0.015;
              fc.vx = -0.018; // deflect towards retrieval slot
              fc.vz = 0.035;
              fc.vRotX *= 0.6;
              fc.vRotZ *= 0.6;
              if (window.audioEngine) window.audioEngine.playTick();
            }

            // Retrieval tray bottom at y <= 0.32
            if (fc.y <= 0.32) {
              fc.y = 0.32;
              fc.vy = 0;
              fc.vx *= 0.6;
              fc.vz *= 0.6;
              fc.vRotX *= 0.4;
              fc.vRotZ *= 0.4;
              fc.settleTimer++;

              if (fc.settleTimer > 18) {
                fc.settled = true;
                fc.capsule.isInChute = true;
                const wonProject = fc.capsule.project;

                setTimeout(() => {
                  if (window.openCapsuleModal) {
                    window.openCapsuleModal(wonProject);
                  }
                }, 400);

                this.state = 'RETURNING';
                this.updateStatusUI('CAPSULA EROGATA!');
              }
            }

            fc.capsule.mesh.position.set(fc.x, fc.y, fc.z);
            fc.capsule.mesh.rotation.x = fc.rotX;
            fc.capsule.mesh.rotation.z = fc.rotZ;
          }
        } else if (this.releaseTimer > 28) {
          this.state = 'RETURNING';
        }

        this.updateClawTransforms();
        break;

      case 'RETURNING':
        const rdx = 0.2 - this.carriage.x;
        const rdz = 0 - this.carriage.z;
        const rdist = Math.sqrt(rdx * rdx + rdz * rdz);

        if (rdist > 0.08) {
          const speed = Math.min(0.065, rdist * 0.08);
          this.carriage.vx = (rdx / rdist) * speed;
          this.carriage.vz = (rdz / rdist) * speed;
          this.carriage.x += this.carriage.vx;
          this.carriage.z += this.carriage.vz;
          this.clawPos.y = THREE.MathUtils.lerp(this.clawPos.y, this.bounds.topY, 0.1);
          this.clawAngle = THREE.MathUtils.lerp(this.clawAngle, 0.22, 0.1);
        } else {
          this.carriage.x = 0.2;
          this.carriage.z = 0;
          this.carriage.vx = 0;
          this.carriage.vz = 0;
          this.clawPos.y = this.bounds.topY;
          this.clawAngle = 0.22;
          this.state = 'IDLE';
          this.fallingCapsule = null;
          this.updateStatusUI('PRONTO // USA LE LEVE O WASD');
        }
        this.updateClawTransforms();
        break;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resetForNewGame() {
    this.state = 'IDLE';
    this.carriage.x = 0.2;
    this.carriage.z = 0;
    this.carriage.vx = 0;
    this.carriage.vz = 0;
    this.clawPos.x = 0.2;
    this.clawPos.z = 0;
    this.clawPos.y = this.bounds.topY;
    this.clawActual.x = 0.2;
    this.clawActual.z = 0;
    this.clawActual.y = this.bounds.topY;
    this.clawSway.angleX = 0;
    this.clawSway.angleZ = 0;
    this.clawSway.velX = 0;
    this.clawSway.velZ = 0;
    this.clawAngle = 0.22;
    this.grabbedCapsule = null;
    this.fallingCapsule = null;

    this.capsules.forEach(c => {
      c.isInChute = false;
      c.isGrabbed = false;
      c.mesh.visible = true;
      c.mesh.scale.set(1, 1, 1);
      c.mesh.position.set(c.originalPos.x, c.originalPos.y, c.originalPos.z);
      c.mesh.rotation.x = 1.57;
      c.mesh.rotation.z = 0;
    });

    this.updateClawTransforms();
    this.updateStatusUI('PRONTO // USA LE LEVE O WASD');
  }
}

window.initCraneMachine = function() {
  window.craneMachine = new SuperCuteCandyClawMachine('crane-canvas-container');
};
