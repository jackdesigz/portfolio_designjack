/**
 * designjack — Registro dei progetti
 * Unica fonte dei dati usata da filo dei progetti, catalogo, claw machine e modal.
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
