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
    code: 'R-06 // GRAPHIC-ECHO',
    title: 'ECHO SOUND FESTIVAL',
    category: 'Graphic Design',
    year: '2025',
    shapeName: 'Double Pyramid',
    colorHex: '#FF5E7E',
    capsuleColor: 'red',
    stack: ['Adobe Illustrator', 'Poster Design', 'Pop Art', 'Illustrazione Vettoriale', 'Mockup Design'],
    description: 'Esercizio di grafica vettoriale e visual design composto con Adobe Illustrator: una serie di illustrazioni che vanno a comporre un poster grafico ispirato a grafiche psichedeliche e POP, corredato da mockup.',
    metrics: { software: 'Illustrator', stile: 'POP / Psychedelic', output: 'Poster & Mockup' },
    details: 'Un lavoro di composizione e ritmo visivo sviluppato interamente in vettoriale. Le singole illustrazioni, ricche di curve organiche e palette sature a contrasto, si intrecciano per dare vita al poster ufficiale dell’Echo Sound Festival e alle sue declinazioni promozionali.',
    coverImage: 'assets/projects/echo-sound-festival/poster.png',
    gallery: {
      poster: {
        src: 'assets/projects/echo-sound-festival/poster.png',
        alt: 'Echo Sound Festival — Poster Ufficiale',
        caption: 'Poster Ufficiale // Composizione vettoriale psichedelica & POP in Adobe Illustrator'
      },
      illustrations: [
        {
          src: 'assets/projects/echo-sound-festival/illustration-1.png',
          alt: 'Echo Sound Festival — Illustrazione 1',
          caption: 'Illustrazione 01 // Soggetto vettoriale & onde cromatiche'
        },
        {
          src: 'assets/projects/echo-sound-festival/illustration-2.png',
          alt: 'Echo Sound Festival — Illustrazione 2',
          caption: 'Illustrazione 02 // Curve fluide ed elementi POP'
        },
        {
          src: 'assets/projects/echo-sound-festival/illustration-3.png',
          alt: 'Echo Sound Festival — Illustrazione 3',
          caption: 'Illustrazione 03 // Composizione orizzontale di dettaglio'
        }
      ],
      mockups: [
        {
          src: 'assets/projects/echo-sound-festival/mockup-poster.png',
          alt: 'Echo Sound Festival — Mockup Affissione Poster',
          title: 'Affissione Urbana',
          desc: 'Mockup realistico del poster ambientato in contesto urbano'
        },
        {
          src: 'assets/projects/echo-sound-festival/mockup-instagram.png',
          alt: 'Echo Sound Festival — Mockup Instagram',
          title: 'Instagram Feed & Social Post',
          desc: 'Declinazione in formato quadrato 1:1 per la promozione social'
        }
      ]
    }
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

    // Deep arcade noir atmosphere
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.Fog(0x0a0a0f, 14, 28);

    this.camera = new THREE.PerspectiveCamera(34, this.width / this.height, 0.1, 100);
    this.updateCameraFraming();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Arcade floor plane (dark reflective)
    const floorGeo = new THREE.PlaneGeometry(18, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x060608,
      roughness: 0.08,
      metalness: 0.72,
      envMapIntensity: 1.0
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Rear arcade wall
    const wallGeo = new THREE.PlaneGeometry(18, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d14,
      roughness: 0.85,
      metalness: 0.0
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 4, -5.5);
    this.scene.add(wall);

    // Side walls for depth
    const sideWallMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, roughness: 0.9 });
    [-7, 7].forEach(wx => {
      const sw = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), sideWallMat);
      sw.rotation.y = wx < 0 ? Math.PI / 2 : -Math.PI / 2;
      sw.position.set(wx, 4, -1);
      this.scene.add(sw);
    });

    window.addEventListener('resize', () => this.onResize());
  }

  updateCameraFraming() {
    if (!this.camera || !this.container) return;
    const aspect = this.width / Math.max(1, this.height);
    this.camera.aspect = aspect;

    // Cabinet is centered at X=0, Z=0.
    // Height spans Y=0.0 (rubber feet) to Y=4.72 (marquee arch & top chaser bulbs).
    // Center point of whole machine: Y = 2.36.
    const lookY = 2.36;

    if (aspect >= 1.6) {
      this.camera.fov = 32;
      this.camera.position.set(0, 3.4, 9.2);
    } else if (aspect >= 1.3) {
      this.camera.fov = 35;
      this.camera.position.set(0, 3.45, 9.6);
    } else if (aspect >= 1.0) {
      this.camera.fov = 40;
      this.camera.position.set(0, 3.5, 10.4);
    } else if (aspect >= 0.75) {
      this.camera.fov = 47;
      this.camera.position.set(0, 3.55, 11.5);
    } else {
      this.camera.fov = 54;
      this.camera.position.set(0, 3.6, 12.8);
    }

    this.camera.lookAt(0, lookY, 0);
    this.camera.updateProjectionMatrix();
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 580;
    this.updateCameraFraming();
    this.renderer.setSize(this.width, this.height);
  }

  setupLighting() {
    // Very soft base ambient — keep it dark for arcade drama
    const ambient = new THREE.AmbientLight(0x1a1030, 1.4);
    this.scene.add(ambient);

    // Overhead warm-white key light from front-top — main scene illumination
    const warmKey = new THREE.SpotLight(0xfff5e0, 2.4, 22, Math.PI / 3.5, 0.3, 1.0);
    warmKey.position.set(1.5, 9, 7);
    warmKey.castShadow = true;
    warmKey.shadow.mapSize.width = 2048;
    warmKey.shadow.mapSize.height = 2048;
    warmKey.shadow.bias = -0.001;
    warmKey.shadow.camera.near = 2;
    warmKey.shadow.camera.far = 20;
    this.scene.add(warmKey);

    // Dynamic claw-tracking spotlight — crisp focused beam inside cabinet
    this.clawSpotlight = new THREE.SpotLight(0xd0eeff, 3.0, 8, Math.PI / 5, 0.25, 1.2);
    this.clawSpotlight.position.set(this.clawPos.x, 3.75, this.clawPos.z);
    this.clawSpotlightTarget = new THREE.Object3D();
    this.clawSpotlightTarget.position.set(this.clawPos.x, 1.15, this.clawPos.z);
    this.scene.add(this.clawSpotlightTarget);
    this.clawSpotlight.target = this.clawSpotlightTarget;
    this.scene.add(this.clawSpotlight);

    // Warm golden ceiling glow — the LED diffuser inside cabinet
    const ceilingLight = new THREE.PointLight(0xFFE8A0, 3.2, 8.0);
    ceilingLight.position.set(0.1, 3.72, 0);
    this.scene.add(ceilingLight);

    // Candy-neon CYAN accent light — left interior fill
    this.neonCyan = new THREE.PointLight(0x00e5ff, 1.1, 5.5);
    this.neonCyan.position.set(-1.6, 1.8, -0.5);
    this.scene.add(this.neonCyan);

    // Candy-neon RED accent — right interior rim
    this.neonRed = new THREE.PointLight(0xff2244, 0.9, 5.0);
    this.neonRed.position.set(1.8, 2.0, -0.8);
    this.scene.add(this.neonRed);

    // Golden retro bulb — from below/front for uplighting the machine face
    this.neonGold = new THREE.PointLight(0xffb703, 1.2, 6.0);
    this.neonGold.position.set(0, 0.5, 4.5);
    this.scene.add(this.neonGold);

    // Prize trough glow (amber)
    const troughLight = new THREE.PointLight(0xFFB703, 2.0, 2.5);
    troughLight.position.set(this.chutePos.x, 0.6, this.chutePos.z + 0.4);
    this.scene.add(troughLight);

    // Strong red rim from back-left — Bauhaus drama
    const redRim = new THREE.DirectionalLight(0xcc1122, 0.9);
    redRim.position.set(-5, 4, -3);
    this.scene.add(redRim);

    // Golden bounce fill from right — warm retro feel
    const goldFill = new THREE.DirectionalLight(0xFFCC44, 0.6);
    goldFill.position.set(5, 3, -1);
    this.scene.add(goldFill);

    // Subtle cool backlight — separates machine from bg wall
    const coolBack = new THREE.DirectionalLight(0x334488, 0.55);
    coolBack.position.set(0, 5, -6);
    this.scene.add(coolBack);
  }

  buildToyMachine() {
    const machine = new THREE.Group();

    // High gloss molded candy red — deeper, richer with emissive warmth
    const redGlossMat = new THREE.MeshStandardMaterial({
      color: 0xC50F18,
      roughness: 0.08,
      metalness: 0.22,
      emissive: 0x3a0005,
      emissiveIntensity: 0.4
    });

    // Precision chassis dark charcoal — industrial look
    const toyGrayMat = new THREE.MeshStandardMaterial({
      color: 0x2a2d35,
      roughness: 0.55,
      metalness: 0.35
    });

    // Gleaming mirror chrome — maximum reflectivity
    const silverChromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8e4f8,
      roughness: 0.03,
      metalness: 1.0,
      envMapIntensity: 1.5
    });

    // Warm brushed gold trim
    const goldChromeMat = new THREE.MeshStandardMaterial({
      color: 0xFFCC22,
      roughness: 0.08,
      metalness: 0.98,
      emissive: 0x332200,
      emissiveIntensity: 0.3
    });

    // Clear acrylic walls — tinted very faintly cyan for a neon-lit look
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xe8f8ff,
      transmission: 0.94,
      opacity: 0.32,
      transparent: true,
      roughness: 0.015,
      reflectivity: 0.98,
      ior: 1.52,
      thickness: 0.12
    });

    // Deep rear mirror with subtle blue-chrome tint
    const rearMirrorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c18,
      roughness: 0.02,
      metalness: 1.0,
      envMapIntensity: 2.0
    });

    // Neon trim emissive strip — cyan glow
    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.8,
      roughness: 0.3
    });

    // Neon trim emissive strip — red glow
    const neonRedMat = new THREE.MeshStandardMaterial({
      color: 0xff2244,
      emissive: 0xff2244,
      emissiveIntensity: 1.5,
      roughness: 0.3
    });

    const baseW = 4.6;
    const baseH = 0.65;
    const baseD = 3.6;

    // 1. Lower Chassis — dark industrial with chrome trim
    const lowerBaseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    const lowerBase = new THREE.Mesh(lowerBaseGeo, toyGrayMat);
    lowerBase.position.set(0, baseH / 2, 0);
    lowerBase.castShadow = true;
    lowerBase.receiveShadow = true;
    machine.add(lowerBase);

    // Chrome T-Molding around bottom base edge
    const btmTrimGeo = new THREE.BoxGeometry(baseW + 0.06, 0.06, baseD + 0.06);
    const btmTrim = new THREE.Mesh(btmTrimGeo, silverChromeMat);
    btmTrim.position.set(0, 0.03, 0);
    machine.add(btmTrim);

    // Cyan neon accent strip along the base front
    const neonBaseFrontGeo = new THREE.BoxGeometry(baseW - 0.4, 0.028, 0.028);
    const neonBaseFront = new THREE.Mesh(neonBaseFrontGeo, neonCyanMat);
    neonBaseFront.position.set(0.1, baseH * 0.55, baseD / 2 + 0.014);
    machine.add(neonBaseFront);

    // Chrome T-Molding around upper base edge
    const midTrimGeo = new THREE.BoxGeometry(baseW + 0.06, 0.06, baseD + 0.06);
    const midTrim = new THREE.Mesh(midTrimGeo, silverChromeMat);
    midTrim.position.set(0, baseH - 0.03, 0);
    machine.add(midTrim);

    // 4 Heavy-duty Rubber Toy Feet with chrome rings
    const footGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.12, 16);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x1C1C22, roughness: 0.8 });
    const footRingGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16);

    [
      [-baseW / 2 + 0.35, -baseD / 2 + 0.35],
      [ baseW / 2 - 0.35, -baseD / 2 + 0.35],
      [-baseW / 2 + 0.35,  baseD / 2 - 0.35],
      [ baseW / 2 - 0.35,  baseD / 2 - 0.35]
    ].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx, 0.06, fz);
      machine.add(foot);

      const footRing = new THREE.Mesh(footRingGeo, silverChromeMat);
      footRing.position.set(fx, 0.11, fz);
      machine.add(footRing);
    });

    // Front Brushed Steel Coin Door Assembly
    const coinDoorGeo = new THREE.BoxGeometry(1.6, 0.44, 0.06);
    const coinDoorMat = new THREE.MeshStandardMaterial({ color: 0x1a1d28, metalness: 0.9, roughness: 0.2 });
    const coinDoor = new THREE.Mesh(coinDoorGeo, coinDoorMat);
    coinDoor.position.set(0.65, 0.34, baseD / 2 + 0.03);
    machine.add(coinDoor);

    // Red neon border around coin door
    const coinDoorBorderMat = new THREE.MeshStandardMaterial({ color: 0xff2244, emissive: 0xff2244, emissiveIntensity: 1.2, roughness: 0.3 });
    const doorBorderH = new THREE.BoxGeometry(1.68, 0.025, 0.025);
    const doorTop = new THREE.Mesh(doorBorderH, coinDoorBorderMat);
    doorTop.position.set(0.65, 0.34 + 0.22 + 0.012, baseD / 2 + 0.055);
    machine.add(doorTop);
    const doorBot = new THREE.Mesh(doorBorderH, coinDoorBorderMat);
    doorBot.position.set(0.65, 0.34 - 0.22 - 0.012, baseD / 2 + 0.055);
    machine.add(doorBot);

    // Dual illuminated 25¢ coin return buttons
    const coinBtnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16);
    const coinBtnMat = new THREE.MeshStandardMaterial({
      color: 0xFF8800,
      emissive: 0xFF5500,
      emissiveIntensity: 0.65,
      roughness: 0.2
    });
    [-0.32, 0.32].forEach(bx => {
      const btn = new THREE.Mesh(coinBtnGeo, coinBtnMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0.65 + bx, 0.34, baseD / 2 + 0.07);
      machine.add(btn);

      // Coin entry slit above button
      const slitGeo = new THREE.BoxGeometry(0.08, 0.016, 0.01);
      const slitMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
      const slit = new THREE.Mesh(slitGeo, slitMat);
      slit.position.set(0.65 + bx, 0.45, baseD / 2 + 0.065);
      machine.add(slit);
    });

    // 2. Front-Left Prize Retrieval Trough (Beveled Chrome Rim + Internal Drop Ramp)
    const troughGeo = new THREE.BoxGeometry(1.2, 0.46, 0.72);
    const trough = new THREE.Mesh(troughGeo, toyGrayMat);
    trough.position.set(-1.4, 0.28, baseD / 2 + 0.24);
    machine.add(trough);

    // Polished Chrome Rim around Trough
    const troughBevelGeo = new THREE.BoxGeometry(1.26, 0.52, 0.06);
    const troughBevel = new THREE.Mesh(troughBevelGeo, silverChromeMat);
    troughBevel.position.set(-1.4, 0.28, baseD / 2 + 0.58);
    machine.add(troughBevel);

    const troughCavityGeo = new THREE.BoxGeometry(1.0, 0.38, 0.58);
    const troughCavityMat = new THREE.MeshStandardMaterial({ color: 0x1A1B22, roughness: 0.5 });
    const troughCavity = new THREE.Mesh(troughCavityGeo, troughCavityMat);
    troughCavity.position.set(-1.4, 0.33, baseD / 2 + 0.26);
    machine.add(troughCavity);

    // Spring-loaded prize push flap with red finish
    const flapGeo = new THREE.BoxGeometry(0.88, 0.26, 0.02);
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0xE5181F,
      roughness: 0.2,
      metalness: 0.1
    });
    const flap = new THREE.Mesh(flapGeo, flapMat);
    flap.position.set(-1.4, 0.38, baseD / 2 + 0.54);
    flap.rotation.x = 0.2;
    machine.add(flap);

    // 3. Molded Candy Red Console Deck with Chamfered Edges
    const deckGeo = new THREE.BoxGeometry(baseW + 0.2, 0.28, baseD + 0.6);
    const deck = new THREE.Mesh(deckGeo, redGlossMat);
    deck.position.set(0, baseH + 0.14, 0.25);
    deck.castShadow = true;
    machine.add(deck);

    // Extended Front Console Shelf with rounded chrome lip
    const ledgeGeo = new THREE.BoxGeometry(2.4, 0.18, 0.72);
    const ledge = new THREE.Mesh(ledgeGeo, redGlossMat);
    ledge.position.set(0.65, baseH + 0.12, baseD / 2 + 0.5);
    machine.add(ledge);

    const ledgeChromeLipGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.44, 16);
    const ledgeLip = new THREE.Mesh(ledgeChromeLipGeo, silverChromeMat);
    ledgeLip.rotation.z = Math.PI / 2;
    ledgeLip.position.set(0.65, baseH + 0.12, baseD / 2 + 0.86);
    machine.add(ledgeLip);

    // Cyan neon strip under ledge — illuminates the control deck from below
    const ledgeNeonGeo = new THREE.CylinderGeometry(0.012, 0.012, 2.3, 8);
    const ledgeNeon = new THREE.Mesh(ledgeNeonGeo, neonCyanMat);
    ledgeNeon.rotation.z = Math.PI / 2;
    ledgeNeon.position.set(0.65, baseH + 0.04, baseD / 2 + 0.72);
    machine.add(ledgeNeon);

    // Sunburst Arcade Graphic Decal on Console
    const decalCanvas = document.createElement('canvas');
    decalCanvas.width = 512;
    decalCanvas.height = 128;
    const dctx = decalCanvas.getContext('2d');
    dctx.fillStyle = '#08639C';
    dctx.fillRect(0, 0, 512, 128);

    dctx.fillStyle = '#FFDD00';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      dctx.beginPath();
      dctx.moveTo(256, 128);
      dctx.arc(256, 128, 420, a, a + Math.PI / 16);
      dctx.fill();
    }
    dctx.strokeStyle = '#E5181F';
    dctx.lineWidth = 14;
    dctx.strokeRect(6, 6, 500, 116);

    const decalTexture = new THREE.CanvasTexture(decalCanvas);
    const decalGeo = new THREE.PlaneGeometry(2.2, 0.46);
    const decalMat = new THREE.MeshBasicMaterial({ map: decalTexture });
    const decalMesh = new THREE.Mesh(decalGeo, decalMat);
    decalMesh.rotation.x = -Math.PI / 2;
    decalMesh.position.set(0.65, baseH + 0.22, baseD / 2 + 0.5);
    machine.add(decalMesh);

    // 4. Three Retro Ball-Top Joystick Levers with Accordion Rubber Boots
    this.levers = [];
    const leverXPositions = [-0.62, 0.0, 0.62];
    const leverBallColors = [0x00e5ff, 0xf0f4ff, 0xE5181F]; // Neon Cyan, Bright Chrome, Candy Red

    leverXPositions.forEach((lx, i) => {
      // Chrome collar mounting plate
      const lPlateGeo = new THREE.CylinderGeometry(0.16, 0.17, 0.03, 20);
      const lPlate = new THREE.Mesh(lPlateGeo, silverChromeMat);
      lPlate.position.set(0.65 + lx, baseH + 0.22, baseD / 2 + 0.5);
      machine.add(lPlate);

      // Accordion rubber dust boot (3 stacked tapered rings)
      const bootMat = new THREE.MeshStandardMaterial({ color: 0x18181D, roughness: 0.85 });
      [0.02, 0.05, 0.08].forEach((by, rIdx) => {
        const rad = 0.13 - rIdx * 0.025;
        const ringGeo = new THREE.CylinderGeometry(rad * 0.85, rad, 0.03, 16);
        const ring = new THREE.Mesh(ringGeo, bootMat);
        ring.position.set(0.65 + lx, baseH + 0.23 + by, baseD / 2 + 0.5);
        machine.add(ring);
      });

      const leverGroup = new THREE.Group();
      leverGroup.position.set(0.65 + lx, baseH + 0.29, baseD / 2 + 0.5);

      // Polished chrome shaft
      const shaftGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.44, 16);
      const shaft = new THREE.Mesh(shaftGeo, silverChromeMat);
      shaft.position.y = 0.22;
      leverGroup.add(shaft);

      // High-gloss specular spherical ball top
      const ballGeo = new THREE.SphereGeometry(0.13, 24, 24);
      const ballEmissive = [0x003344, 0x111122, 0x200005];
      const ballMat = new THREE.MeshStandardMaterial({
        color: leverBallColors[i],
        roughness: 0.05,
        metalness: 0.5,
        emissive: ballEmissive[i],
        emissiveIntensity: 0.6
      });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      ball.position.y = 0.44;
      leverGroup.add(ball);

      machine.add(leverGroup);
      this.levers.push(leverGroup);
    });

    // 5. Four Mirror Chrome Corner Pillars with Fluted Rings and Neon Base Rings
    const colRadius = 0.11;
    const colHeight = 3.0;
    const colGeo = new THREE.CylinderGeometry(colRadius, colRadius, colHeight, 20);
    const ringGeo = new THREE.TorusGeometry(colRadius + 0.02, 0.022, 10, 20);
    const neonRingGeo = new THREE.TorusGeometry(colRadius + 0.035, 0.016, 8, 24);

    const cornerCols = [
      [-baseW / 2 + 0.22, -baseD / 2 + 0.22],
      [ baseW / 2 - 0.22, -baseD / 2 + 0.22],
      [-baseW / 2 + 0.22,  baseD / 2 - 0.22],
      [ baseW / 2 - 0.22,  baseD / 2 - 0.22]
    ];

    cornerCols.forEach(([cx, cz], ci) => {
      const col = new THREE.Mesh(colGeo, silverChromeMat);
      col.position.set(cx, baseH + 0.28 + colHeight / 2, cz);
      col.castShadow = true;
      machine.add(col);

      // Fluted accent rings along pillar
      [-0.8, 0, 0.8].forEach(ry => {
        const ring = new THREE.Mesh(ringGeo, silverChromeMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(cx, baseH + 0.28 + colHeight / 2 + ry, cz);
        machine.add(ring);
      });

      // Neon accent ring at column base and top — alternating cyan/red
      const neonRingMat = (ci % 2 === 0) ? neonCyanMat : neonRedMat;
      [baseH + 0.32, baseH + 0.28 + colHeight - 0.04].forEach(ry => {
        const nring = new THREE.Mesh(neonRingGeo, neonRingMat);
        nring.rotation.x = Math.PI / 2;
        nring.position.set(cx, ry, cz);
        machine.add(nring);
      });
    });

    // 6. Crystal Acrylic Glass Panels + Mirrored Rear Depth Wall
    const glassH = colHeight;
    const glassW = baseW - 0.1;
    const glassD = baseD - 0.1;
    const glassY = baseH + 0.28 + glassH / 2;

    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassW, glassH), acrylicMat);
    frontGlass.position.set(0, glassY, baseD / 2 - 0.05);
    machine.add(frontGlass);

    // REAR MIRROR WALL (Mirrored Chrome reflection panel)
    const backMirror = new THREE.Mesh(new THREE.PlaneGeometry(glassW, glassH), rearMirrorMat);
    backMirror.rotation.y = Math.PI;
    backMirror.position.set(0, glassY, -baseD / 2 + 0.06);
    machine.add(backMirror);

    const leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassD, glassH), acrylicMat);
    leftGlass.rotation.y = Math.PI / 2;
    leftGlass.position.set(-baseW / 2 + 0.05, glassY, 0);
    machine.add(leftGlass);

    const rightGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassD, glassH), acrylicMat);
    rightGlass.rotation.y = -Math.PI / 2;
    rightGlass.position.set(baseW / 2 - 0.05, glassY, 0);
    machine.add(rightGlass);

    // Thin Chrome Edge Framing on Glass Corners
    const edgeTrimGeo = new THREE.BoxGeometry(0.04, colHeight, 0.04);
    cornerCols.forEach(([cx, cz]) => {
      const trim = new THREE.Mesh(edgeTrimGeo, silverChromeMat);
      trim.position.set(cx, glassY, cz);
      machine.add(trim);
    });

    // 7. Internal Red Prize Chute Partition (Front-Left)
    const chuteWallGeo = new THREE.BoxGeometry(1.1, 1.2, 1.0);
    const chuteWall = new THREE.Mesh(chuteWallGeo, redGlossMat);
    chuteWall.position.set(this.chutePos.x, baseH + 0.28 + 0.6, this.chutePos.z);
    machine.add(chuteWall);

    // Chute Polished Lip
    const chuteLipGeo = new THREE.TorusGeometry(0.44, 0.035, 12, 28);
    const chuteLip = new THREE.Mesh(chuteLipGeo, silverChromeMat);
    chuteLip.rotation.x = Math.PI / 2;
    chuteLip.position.set(this.chutePos.x, baseH + 0.28 + 1.2, this.chutePos.z);
    machine.add(chuteLip);

    const chuteCavityGeo = new THREE.CylinderGeometry(0.44, 0.36, 0.52, 24, 1, true);
    const chuteCavityMat = new THREE.MeshStandardMaterial({ color: 0x121216, side: THREE.DoubleSide });
    const chuteCavity = new THREE.Mesh(chuteCavityGeo, chuteCavityMat);
    chuteCavity.position.set(this.chutePos.x, baseH + 0.28 + 1.2, this.chutePos.z);
    machine.add(chuteCavity);

    // 8. Molded Glossy Red Canopy with Beveled Lips & Illuminated Diffuser
    const roofY = baseH + 0.28 + colHeight;

    // Translucent Illuminated Ceiling Diffuser — warm golden glow
    const ceilingDiffuserGeo = new THREE.PlaneGeometry(baseW - 0.2, baseD - 0.2);
    const ceilingDiffuserMat = new THREE.MeshStandardMaterial({
      color: 0xFFFAE0,
      emissive: 0xFFCC55,
      emissiveIntensity: 1.1,
      roughness: 0.18
    });
    const ceilingPanel = new THREE.Mesh(ceilingDiffuserGeo, ceilingDiffuserMat);
    ceilingPanel.rotation.x = Math.PI / 2;
    ceilingPanel.position.set(0, roofY - 0.02, 0);
    machine.add(ceilingPanel);

    // Main Canopy Body
    const canopyGeo = new THREE.BoxGeometry(baseW + 0.4, 0.46, baseD + 0.4);
    const canopy = new THREE.Mesh(canopyGeo, redGlossMat);
    canopy.position.set(0, roofY + 0.23, 0);
    canopy.castShadow = true;
    machine.add(canopy);

    // Chrome perimeter trim on canopy base
    const canopyTrimGeo = new THREE.BoxGeometry(baseW + 0.44, 0.05, baseD + 0.44);
    const canopyTrim = new THREE.Mesh(canopyTrimGeo, silverChromeMat);
    canopyTrim.position.set(0, roofY + 0.025, 0);
    machine.add(canopyTrim);

    // Red neon edge strip on canopy underside perimeter
    const canopyNeonFrontGeo = new THREE.BoxGeometry(baseW + 0.44, 0.022, 0.022);
    const canopyNeonFront = new THREE.Mesh(canopyNeonFrontGeo, neonRedMat);
    canopyNeonFront.position.set(0, roofY + 0.025, baseD / 2 + 0.22);
    machine.add(canopyNeonFront);
    const canopyNeonBack = new THREE.Mesh(canopyNeonFrontGeo, neonRedMat);
    canopyNeonBack.position.set(0, roofY + 0.025, -(baseD / 2 + 0.22));
    machine.add(canopyNeonBack);
    const canopyNeonSideGeo = new THREE.BoxGeometry(0.022, 0.022, baseD + 0.44);
    [-( baseW / 2 + 0.22), baseW / 2 + 0.22].forEach(nx => {
      const sn = new THREE.Mesh(canopyNeonSideGeo, neonRedMat);
      sn.position.set(nx, roofY + 0.025, 0);
      machine.add(sn);
    });

    // Stepped Upper Roof Lip
    const topTrayGeo = new THREE.BoxGeometry(baseW + 0.12, 0.22, baseD + 0.12);
    const topTray = new THREE.Mesh(topTrayGeo, redGlossMat);
    topTray.position.set(0, roofY + 0.56, 0);
    machine.add(topTray);

    // Retro Marquee Sign -- premium dark LED panel look
    const marqueeCanvas = document.createElement('canvas');
    marqueeCanvas.width = 1024;
    marqueeCanvas.height = 200;
    const mctx = marqueeCanvas.getContext('2d');

    // Deep noir BG
    const gradM = mctx.createLinearGradient(0, 0, 0, 200);
    gradM.addColorStop(0, '#1a0005');
    gradM.addColorStop(0.4, '#060001');
    gradM.addColorStop(1, '#1a0005');
    mctx.fillStyle = gradM;
    mctx.fillRect(0, 0, 1024, 200);

    // Outer gold border
    mctx.strokeStyle = '#FFD700';
    mctx.lineWidth = 10;
    mctx.strokeRect(5, 5, 1014, 190);

    // Inner red thin border
    mctx.strokeStyle = '#E5181F';
    mctx.lineWidth = 3;
    mctx.strokeRect(18, 18, 988, 164);

    // LED dot grid
    mctx.fillStyle = 'rgba(255,200,0,0.07)';
    for (let gx = 24; gx < 1000; gx += 8) {
      for (let gy = 24; gy < 176; gy += 8) {
        mctx.fillRect(gx, gy, 3, 3);
      }
    }

    // Main title with gold glow
    mctx.shadowColor = '#FFD700';
    mctx.shadowBlur = 20;
    mctx.fillStyle = '#FFFFFF';
    mctx.font = '900 70px "Montserrat", sans-serif';
    mctx.textAlign = 'center';
    mctx.fillText('\u2605  JACK\u2019S TOY CLAW  \u2605', 512, 100);

    // Subtitle
    mctx.shadowColor = '#FF4455';
    mctx.shadowBlur = 10;
    mctx.fillStyle = '#FFD700';
    mctx.font = '700 26px "Montserrat", sans-serif';
    mctx.fillText('\u2756  RETRO ARCADE  \u00B7  PESCA UN PROGETTO!  \u2756', 512, 152);
    mctx.shadowBlur = 0;

    const marqueeTex = new THREE.CanvasTexture(marqueeCanvas);
    const marqueeGeo = new THREE.PlaneGeometry(4.0, 0.52);
    const marqueeMat = new THREE.MeshStandardMaterial({
      map: marqueeTex,
      emissive: 0x220005,
      emissiveIntensity: 0.4,
      emissiveMap: marqueeTex
    });
    const marqueeMesh = new THREE.Mesh(marqueeGeo, marqueeMat);
    marqueeMesh.position.set(0, roofY + 0.26, baseD / 2 + 0.22);
    machine.add(marqueeMesh);

    // Marquee Chaser Bulbs — 3-state color cycle (yellow/red/off)
    this.marqueeBulbs = [];
    const bulbGeo = new THREE.SphereGeometry(0.055, 12, 12);
    for (let b = -2.1; b <= 2.1; b += 0.35) {
      const bMat = new THREE.MeshStandardMaterial({
        color: 0xFFDD00,
        emissive: 0xFFAA00,
        emissiveIntensity: 1.4,
        roughness: 0.15
      });
      const bulb = new THREE.Mesh(bulbGeo, bMat);
      bulb.position.set(b, roofY + 0.5, baseD / 2 + 0.24);
      machine.add(bulb);
      this.marqueeBulbs.push(bulb);
    }

    // Playfield Bed Floor — dark mirror surface with subtle emissive
    const bedGeo = new THREE.BoxGeometry(baseW - 0.2, 0.1, baseD - 0.2);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.12,
      metalness: 0.65,
      emissive: 0x000820,
      emissiveIntensity: 0.3
    });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, baseH + 0.29, 0);
    bed.receiveShadow = true;
    machine.add(bed);

    // Cyan neon strip around inside bed perimeter
    const bedNeonFrontGeo = new THREE.BoxGeometry(baseW - 0.24, 0.016, 0.016);
    const bedNeonFront = new THREE.Mesh(bedNeonFrontGeo, neonCyanMat);
    bedNeonFront.position.set(0, baseH + 0.35, baseD / 2 - 0.18);
    machine.add(bedNeonFront);
    const bedNeonBack = new THREE.Mesh(bedNeonFrontGeo, neonCyanMat);
    bedNeonBack.position.set(0, baseH + 0.35, -(baseD / 2 - 0.18));
    machine.add(bedNeonBack);
    const bedNeonSideGeo = new THREE.BoxGeometry(0.016, 0.016, baseD - 0.24);
    [-(baseW / 2 - 0.18), baseW / 2 - 0.18].forEach(bx => {
      const bs = new THREE.Mesh(bedNeonSideGeo, neonCyanMat);
      bs.position.set(bx, baseH + 0.35, 0);
      machine.add(bs);
    });

    this.scene.add(machine);
  }

  buildGantryAndClaw() {
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xc8d8f0,
      metalness: 1.0,
      roughness: 0.04,
      envMapIntensity: 1.5
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFCC22,
      metalness: 0.98,
      roughness: 0.07,
      emissive: 0x221100,
      emissiveIntensity: 0.3
    });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x0e0e12, roughness: 0.9 });
    const clawBodyMat = new THREE.MeshStandardMaterial({
      color: 0xC50F18,
      roughness: 0.1,
      metalness: 0.25,
      emissive: 0x200003,
      emissiveIntensity: 0.4
    });

    // Dual polished chrome rail tubes for X axis
    const railXGeo = new THREE.CylinderGeometry(0.045, 0.045, 4.0, 16);
    this.gantryX = new THREE.Group();
    
    [-0.14, 0.14].forEach(offsetZ => {
      const rod = new THREE.Mesh(railXGeo, silverMat);
      rod.rotation.z = Math.PI / 2;
      rod.position.z = offsetZ;
      this.gantryX.add(rod);
    });

    // End brackets on rail X
    [-2.0, 2.0].forEach(endX => {
      const bGeo = new THREE.BoxGeometry(0.1, 0.16, 0.42);
      const b = new THREE.Mesh(bGeo, silverMat);
      b.position.set(endX, 0, 0);
      this.gantryX.add(b);
    });

    this.gantryX.position.set(0, 3.65, 0);
    this.scene.add(this.gantryX);

    // Motorized Carriage Box with Stepper Motor & Warning LED
    this.carriageZ = new THREE.Group();
    const carGeo = new THREE.BoxGeometry(0.48, 0.16, 0.48);
    const carBody = new THREE.Mesh(carGeo, clawBodyMat);
    this.carriageZ.add(carBody);

    // Motor cylinder on top of carriage
    const motorGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16);
    const motor = new THREE.Mesh(motorGeo, silverMat);
    motor.position.set(0.12, 0.12, 0);
    this.carriageZ.add(motor);

    // Glowing green status LED
    const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x70E000,
      emissive: 0x70E000,
      emissiveIntensity: 0.9
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.16, 0.09, 0.22);
    this.carriageZ.add(led);

    this.carriageZ.position.set(0, 3.65, 0);
    this.scene.add(this.carriageZ);

    // Polished steel hoist cable
    const cableGeo = new THREE.CylinderGeometry(0.018, 0.018, 1, 8);
    this.cableMesh = new THREE.Mesh(cableGeo, silverMat);
    this.cableMesh.position.set(0, 3.4, 0);
    this.scene.add(this.cableMesh);

    // Scoop Claw with mechanical winch collar and curved fingers
    this.clawAssembly = new THREE.Group();
    this.clawAssembly.position.set(this.clawPos.x, this.clawPos.y, this.clawPos.z);

    // Chrome winch cylinder with gold decorative mechanical band
    const winchGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.22, 20);
    const winch = new THREE.Mesh(winchGeo, silverMat);
    this.clawAssembly.add(winch);

    const bandGeo = new THREE.CylinderGeometry(0.285, 0.285, 0.06, 20);
    const band = new THREE.Mesh(bandGeo, goldMat);
    band.position.y = 0.02;
    this.clawAssembly.add(band);

    this.clawFingers = [];
    const fingerAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

    fingerAngles.forEach(angle => {
      const fingerRoot = new THREE.Group();
      fingerRoot.rotation.y = angle;

      const mount = new THREE.Group();
      mount.position.set(0.18, -0.06, 0);

      // Scissor hinge joint pin
      const pinGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.16, 12);
      const pin = new THREE.Mesh(pinGeo, goldMat);
      pin.rotation.z = Math.PI / 2;
      mount.add(pin);

      const armGeo = new THREE.BoxGeometry(0.08, 0.44, 0.14);
      const arm = new THREE.Mesh(armGeo, silverMat);
      arm.position.set(0, -0.21, 0);
      arm.rotation.z = 0.25;
      mount.add(arm);

      const scoopGeo = new THREE.BoxGeometry(0.07, 0.34, 0.22);
      const scoop = new THREE.Mesh(scoopGeo, silverMat);
      scoop.position.set(-0.1, -0.38, 0);
      scoop.rotation.z = -0.7;
      mount.add(scoop);

      // Non-slip rubber tip on claw scoop end
      const tipGeo = new THREE.BoxGeometry(0.08, 0.08, 0.2);
      const tip = new THREE.Mesh(tipGeo, rubberMat);
      tip.position.set(-0.14, -0.5, 0);
      tip.rotation.z = -0.7;
      mount.add(tip);

      fingerRoot.add(mount);
      this.clawAssembly.add(fingerRoot);
      this.clawFingers.push(mount);
    });

    this.scene.add(this.clawAssembly);
    this.updateClawTransforms();
  }

  // Spawns 68+ crinkled metallic candy foil wrappers (Gold, Purple, Cyan, Magenta, Emerald, Orange)
  spawnCandyFoilWrappers() {
    const foilColorData = [
      { c: 0xFFD700, e: 0x332200 },
      { c: 0x9B40FF, e: 0x0d0020 },
      { c: 0xFF007F, e: 0x200010 },
      { c: 0x00E5FF, e: 0x001522 },
      { c: 0x06D6A0, e: 0x001a0d },
      { c: 0xFF6020, e: 0x1a0800 }
    ];
    const floorY = 1.15;

    for (let i = 0; i < 68; i++) {
      const colData = foilColorData[i % foilColorData.length];
      const candyGroup = new THREE.Group();

      const foilMat = new THREE.MeshStandardMaterial({
        color: colData.c,
        metalness: 0.98,
        roughness: 0.06,
        emissive: colData.e,
        emissiveIntensity: 0.6
      });

      // Center sweet cylinder
      const sweetGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 10);
      const sweet = new THREE.Mesh(sweetGeo, foilMat);
      sweet.rotation.z = Math.PI / 2;
      candyGroup.add(sweet);

      // Left twisted foil bow
      const bowLeftGeo = new THREE.ConeGeometry(0.095, 0.13, 8);
      const bowLeft = new THREE.Mesh(bowLeftGeo, foilMat);
      bowLeft.position.set(-0.15, 0, 0);
      bowLeft.rotation.z = Math.PI / 2;
      candyGroup.add(bowLeft);

      // Right twisted foil bow
      const bowRightGeo = new THREE.ConeGeometry(0.095, 0.13, 8);
      const bowRight = new THREE.Mesh(bowRightGeo, foilMat);
      bowRight.position.set(0.15, 0, 0);
      bowRight.rotation.z = -Math.PI / 2;
      candyGroup.add(bowRight);

      // Random position across bed avoiding the chute area
      let rx = (Math.random() - 0.5) * 3.4;
      let rz = (Math.random() - 0.5) * 2.4;
      if (rx < -0.8 && rz > 0.4) rx += 1.4; // leave chute clear

      candyGroup.position.set(rx, floorY + (Math.random() * 0.05), rz);
      candyGroup.rotation.y = Math.random() * Math.PI * 2;
      candyGroup.rotation.x = (Math.random() - 0.5) * 0.4;
      candyGroup.rotation.z = (Math.random() - 0.5) * 0.4;

      this.scene.add(candyGroup);
    }

    // Cute geometric Bauhaus mascot toy resting amongst the candies
    this.spawnMascotToy();
  }

  spawnMascotToy() {
    const mascot = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xFFDD00, roughness: 0.2 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x121218 });

    // Toy body cube
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), bodyMat);
    mascot.add(body);

    // Digital dot eyes
    [-0.05, 0.05].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
      eye.position.set(ex, 0.04, 0.125);
      mascot.add(eye);
    });

    // Antenna
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08), bodyMat);
    antStem.position.y = 0.16;
    mascot.add(antStem);

    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0xE5181F }));
    antTip.position.y = 0.2;
    mascot.add(antTip);

    mascot.position.set(-0.3, 1.25, 0.85);
    mascot.rotation.y = -0.3;
    mascot.rotation.z = 0.15;
    this.scene.add(mascot);
  }

  // Spawns colorful two-tone gashapon capsules with crystal-clear top domes!
  spawnColorfulCapsules() {
    this.capsules.forEach(c => this.scene.remove(c.mesh));
    this.capsules = [];

    const capRadius = 0.24;
    const capHeight = 0.26;

    const toyCapsuleColors = [
      { hex: 0xFF1A28, name: 'red',    emissive: 0x280003 },
      { hex: 0xFFE01A, name: 'yellow', emissive: 0x1a1000 },
      { hex: 0x9B40FF, name: 'purple', emissive: 0x0d0020 },
      { hex: 0x00C8FF, name: 'cyan',   emissive: 0x001822 },
      { hex: 0x00E87A, name: 'green',  emissive: 0x001a0d },
      { hex: 0xFF6020, name: 'orange', emissive: 0x1a0800 },
      { hex: 0xFFE01A, name: 'yellow', emissive: 0x1a1000 },
      { hex: 0xFF1A28, name: 'red',    emissive: 0x280003 }
    ];

    // Crystal clear acrylic top dome material
    const clearTopMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.98,
      opacity: 0.36,
      transparent: true,
      roughness: 0.03,
      reflectivity: 0.95,
      ior: 1.52
    });

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

      // Bottom half: vivid glossy plastic with subtle emissive inner radiance
      const btmMat = new THREE.MeshStandardMaterial({
        color: capCol.hex,
        roughness: 0.1,
        metalness: 0.08,
        emissive: capCol.emissive,
        emissiveIntensity: 1.0
      });

      const bodyGeo = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 20);
      const bodyMesh = new THREE.Mesh(bodyGeo, btmMat);
      bodyMesh.castShadow = true;
      capGroup.add(bodyMesh);

      const btmGeo = new THREE.SphereGeometry(capRadius, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const btmMesh = new THREE.Mesh(btmGeo, btmMat);
      btmMesh.position.y = -capHeight / 2;
      capGroup.add(btmMesh);

      // Top half: crystal-clear transparent acrylic dome revealing prize inside!
      const topGeo = new THREE.SphereGeometry(capRadius, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const topMesh = new THREE.Mesh(topGeo, clearTopMat);
      topMesh.position.y = capHeight / 2;
      capGroup.add(topMesh);

      // Center seam ring where halves snap together
      const seamGeo = new THREE.TorusGeometry(capRadius + 0.006, 0.012, 8, 24);
      const seamMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.25 });
      const seam = new THREE.Mesh(seamGeo, seamMat);
      seam.rotation.x = Math.PI / 2;
      capGroup.add(seam);

      // Inside: 3D Project Token + miniature golden jewel
      const token = this.createInternalToken(proj, capRadius * 0.65);
      capGroup.add(token);

      const jewelGeo = new THREE.IcosahedronGeometry(capRadius * 0.28);
      const jewelMat = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        metalness: 0.95,
        roughness: 0.12
      });
      const jewel = new THREE.Mesh(jewelGeo, jewelMat);
      jewel.position.set(0.04, 0.05, 0.04);
      capGroup.add(jewel);

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

    // Dynamic claw downward spotlight tracks claw horizontal coordinates
    if (this.clawSpotlight && this.clawSpotlightTarget) {
      this.clawSpotlight.position.set(this.clawActual.x, 3.75, this.clawActual.z);
      this.clawSpotlightTarget.position.set(this.clawActual.x, 1.15, this.clawActual.z);
    }
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

    // Marquee bulbs — 3-state chaser: yellow / red / dim (every 8 frames)
    if (this.marqueeBulbs.length && this.time % 8 === 0) {
      const step = Math.floor(this.time / 8) % 3;
      this.marqueeBulbs.forEach((b, i) => {
        const phase = (i + step) % 3;
        if (phase === 0) {
          b.material.color.setHex(0xFFDD00);
          b.material.emissive.setHex(0xFFAA00);
          b.material.emissiveIntensity = 1.6;
        } else if (phase === 1) {
          b.material.color.setHex(0xFF2244);
          b.material.emissive.setHex(0xCC0022);
          b.material.emissiveIntensity = 1.3;
        } else {
          b.material.color.setHex(0x1a0003);
          b.material.emissive.setHex(0x000000);
          b.material.emissiveIntensity = 0;
        }
      });
    }

    // Animated neon accent lights — slow pulse in and out
    const t = this.time * 0.025;
    if (this.neonCyan) {
      this.neonCyan.intensity = 0.6 + 0.5 * Math.sin(t * 1.1);
    }
    if (this.neonRed) {
      this.neonRed.intensity = 0.5 + 0.4 * Math.sin(t * 0.9 + 1.2);
    }
    if (this.neonGold) {
      this.neonGold.intensity = 0.8 + 0.4 * Math.sin(t * 0.7 + 0.5);
    }

    // Gentle spinning of internal tokens + slight bob
    this.capsules.forEach((c, ci) => {
      if (c.token) {
        c.token.rotation.y += 0.022;
        c.token.position.y = Math.sin(this.time * 0.04 + ci * 0.8) * 0.018;
      }
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
