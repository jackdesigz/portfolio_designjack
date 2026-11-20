/**
 * designjack — Registro dei progetti
 * Unica fonte dei dati usata da filo dei progetti, catalogo, claw machine e modal.
 */

window.PROJECT_REGISTRY = [
  {
    id: 'r-14',
    code: 'R-14 // AR-CAMPARI',
    title: 'CAMPARI CHAMP-AR',
    category: 'Interaction Design',
    year: '2026',
    shapeName: 'Crimson Cube',
    colorHex: '#EC2027',
    capsuleColor: 'red',
    style: 'Pixel Art & Arcade anni ’80',
    palette: ['#EC2027', '#2D2D2D', '#FFD252', '#FFFFFF'],
    software: ['Adobe Illustrator', 'Adobe Photoshop', 'JavaScript'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'JavaScript', 'A-Frame', 'MindAR', 'Realtà Aumentata', 'Pixel Art', 'Packaging Design', 'Social Campaign'],
    description: 'Un gioco in realtà aumentata e un packaging in edizione limitata per Campari. “Champ-AR” unisce “Champ” e “AR” (Augmented Reality) e porta dentro un cabinato arcade da scaffale l’interazione che il brand ha sempre cercato nelle sue campagne.',
    details: 'Lo spiritello ha rubato il Campari e farà di tutto per tenerselo: l’eroe in stile Depero deve saltare le arance e recuperare la bottiglia. Packaging ed etichetta richiamano i cabinati dei videogiochi anni ’80 e ’90 e parlano a chi ha vissuto i primi giochi arcade, con un target tra i 20 e i 35 anni. La pixel art si unisce all’estetica minimale con pattern delle scatole di alcolici. Il gioco gira nel browser con A-Frame e MindAR: inquadrando la scatola parte la sfida. Progetto del secondo anno di Communication Design, Istituto Modartech.',
    coverImage: 'assets/projects/campari-champ-ar/showcase.jpg',
    gallery: {
      layout: 'champar',
      base: 'assets/projects/campari-champ-ar/',
      hero: {
        kicker: 'Interaction Design // Realtà aumentata',
        lead: 'Gioco in realtà aumentata e packaging in edizione limitata: la scatola diventa un cabinato arcade.',
        tagline: 'Accetti la sfida?'
      },
      story: {
        title: 'La storia',
        paragraphs: [
          'Il gioco è un tributo al brand e alla sua storia: <strong>lo spiritello ha rubato il Campari</strong> e farà di tutto per tenerselo.',
          'L’eroe in stile Depero deve saltare le arance che gli vengono lanciate contro e <strong>recuperare la bottiglia</strong>. Le grafiche citano i classici arcade come Donkey Kong e Pac-Man.'
        ],
        cast: [
          { sprite: 'player', name: 'L’eroe', text: 'In stile Depero, con movimenti rigidi e geometrici.' },
          { sprite: 'spirit', name: 'Lo spiritello', text: 'Dal manifesto di Cappiello del 1921, con movimenti giocosi e scomposti.' },
          { sprite: 'orange', name: 'L’arancia', text: 'Dalla scorza che avvolge lo spiritello di Cappiello, diventata la sua arma.' }
        ]
      },
      packaging: {
        title: 'Il packaging',
        faceCaption: 'Il fronte del packaging — l’etichetta come lo schermo di un cabinato',
        paragraphs: [
          'Packaging ed etichetta rimandano ai <strong>cabinati per videogiochi anni ’80 e ’90</strong> e si rivolgono a un pubblico che ha vissuto il periodo dei primi giochi arcade.',
          'Sul fronte c’è il livello del gioco con le travi e le scale, e un QR code con la domanda <strong>“Accetti la sfida?”</strong>.'
        ],
        aestheticsTitle: 'L’estetica',
        aesthetics: [
          'L’estetica cult di quegli anni, la <strong>pixel art</strong>, si unisce a quella dei packaging minimali con pattern, molto usata per le scatole degli alcolici.',
          'Nelle sprite sheet le animazioni rispecchiano il carattere dei personaggi: movimenti giocosi per lo spiritello, rigidi e geometrici per l’eroe.'
        ],
        fonts: [
          { use: 'Per il web', name: 'Upheaval TT (BRK)', pixel: true },
          { use: 'Per la stampa', name: 'Rajdhani' }
        ]
      },
      showcase: {
        title: 'Showcase',
        lead: 'I lati del packaging, con i personaggi del gioco che escono dalle scatole.',
        src: 'showcase.jpg',
        alt: 'Tre scatole Campari Champ-AR con l’eroe e lo spiritello in pixel art',
        caption: 'Showcase // I lati del packaging Campari Champ-AR'
      },
      campaignTitle: 'La campagna',
      campaignLead: 'Il lancio passa dai social, in tre momenti.',
      campaign: [
        {
          title: 'Lancio e hype',
          text: 'Il lancio è preceduto da storie che generano hype: messaggi criptici e misteriosi annunciano la <strong>scomparsa dell’amata bevanda</strong>.',
          phones: [
            { src: 'phone-01.png', caption: 'Storia // Cessata la produzione' },
            { src: 'phone-02.png', caption: 'Storia // Il Campari è stato rubato' }
          ]
        },
        {
          title: 'La sfida',
          text: 'Poi arriva la sfida: emerge un <strong>QR code</strong> che porta al gioco, ancora senza la realtà aumentata. Subito dopo un reel di lancio svela l’edizione limitata.',
          phones: [
            { src: 'phone-03.png', caption: 'Storia // Recuperalo! Insert coin' },
            { src: 'phone-04.png', caption: 'Reel // L’edizione limitata' }
          ]
        },
        {
          title: 'Il post lancio',
          text: 'Dopo il lancio, sui social escono le <strong>classifiche dei punteggi migliori</strong>: gli utenti sono spinti a condividere i risultati con l’hashtag <strong>#champar</strong>.',
          oranges: true,
          phones: [
            { src: 'phone-05.png', caption: 'Il gioco // Il livello su smartphone' }
          ]
        }
      ],
      game: {
        title: 'Gioca',
        lead: 'Una versione endless del gioco: lo spiritello lancia le arance, tu saltale. Premi <strong>SALTA</strong> per iniziare.'
      },
      repo: {
        href: 'https://github.com/jackdesigz/champar',
        label: 'Il codice del gioco AR su GitHub',
        meta: 'A-Frame + MindAR, jackdesigz/champar'
      }
    }
  },
  {
    id: 'r-13',
    code: 'R-13 // GRAPHIC-PUCCINI',
    title: 'LA FANCIULLA DEL WEST',
    category: 'Graphic Design',
    year: '2025',
    shapeName: 'Crimson Octahedron',
    colorHex: '#BF2025',
    capsuleColor: 'red',
    style: 'Art Déco & Pop Art',
    palette: ['#BF2025', '#E7C42F', '#000000', '#FFFFFF'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Poster Design', 'Art Déco', 'Pop Art', 'Mockup Design'],
    description: 'Manifesto grafico per l’opera lirica di Giacomo Puccini: un’identità visiva che trasforma la protagonista in una regina di cuori, tra sagome poligonali pop art e dettagli art déco.',
    metrics: { formato: 'Manifesto', palette: 'Rosso / Oro / Nero', stile: 'Art Déco & Pop Art' },
    details: 'La protagonista è disegnata come la regina di cuori di un mazzo da gioco: lo sguardo assorto richiama la partita a carte in cui si gioca il destino suo e dell’uomo che ama. Nella parte bassa, sagome poligonali bicromatiche raccontano gli elementi chiave dell’opera e la loro posizione ha un significato: l’amato ferito è sul cuore di lei, lo sceriffo dal lato opposto, e la mano inserita è la “mano del morto”, leggenda del Far West. Lo stile prende da Saul Bass, dall’opening di Casino Royale e dalle cinematiche di Deathloop; il titolo è composto in Decondol Regular. Progetto d’esame di progettazione grafica, Istituto Modartech (2025).',
    coverImage: 'assets/projects/la-fanciulla-del-west/poster.jpg',
    gallery: {
      poster: {
        src: 'assets/projects/la-fanciulla-del-west/poster.jpg',
        alt: 'La Fanciulla del West — Manifesto',
        caption: 'Manifesto // La protagonista come regina di cuori, sagome pop art e titolo art déco'
      },
      moodboard: {
        src: 'assets/projects/la-fanciulla-del-west/moodboard.jpg',
        alt: 'La Fanciulla del West — Moodboard',
        caption: 'Moodboard // Saul Bass, Casino Royale, Deathloop e la regina di cuori',
        lead: 'I riferimenti da cui è partito tutto: i manifesti di <strong>Saul Bass</strong>, l’opening di <strong>007 Casino Royale</strong>, le cinematiche di <strong>Deathloop</strong> e la regina di cuori delle carte da gioco.'
      },
      sketches: {
        src: 'assets/projects/la-fanciulla-del-west/bozze.jpg',
        alt: 'La Fanciulla del West — Bozze di progettazione',
        caption: 'Bozze // Dall’idea della scena alla stilizzazione del personaggio',
        lead: 'Tre bozze: dall’idea originale della scena al focus sul personaggio, fino alla stilizzazione definitiva con le sagome in basso.'
      },
      concept: {
        label: 'IL CONCEPT // DALLA PRESENTAZIONE',
        lead: 'Le slide della presentazione che spiegano le scelte: la protagonista, le sagome e lo stile.',
        slides: [
          {
            src: 'assets/projects/la-fanciulla-del-west/valori.jpg',
            alt: 'La Fanciulla del West — I valori della grafica',
            kind: 'I VALORI',
            title: 'I valori della grafica',
            desc: 'Protagonista, sagome e stile: i tre pilastri del manifesto.'
          },
          {
            src: 'assets/projects/la-fanciulla-del-west/protagonista.jpg',
            alt: 'La Fanciulla del West — La protagonista',
            kind: '01 // PROTAGONISTA',
            title: 'La regina di cuori',
            desc: 'Lo sguardo assorto richiama la partita a carte che decide il suo destino.'
          },
          {
            src: 'assets/projects/la-fanciulla-del-west/sagome.jpg',
            alt: 'La Fanciulla del West — Le sagome',
            kind: '02 // SAGOME',
            title: 'Sagome poligonali',
            desc: 'Ogni sagoma è un elemento dell’opera, e la sua posizione conta.'
          },
          {
            src: 'assets/projects/la-fanciulla-del-west/stile.jpg',
            alt: 'La Fanciulla del West — Lo stile',
            kind: '03 // STILE',
            title: 'Art déco e pop art',
            desc: 'Saul Bass, Casino Royale e Deathloop come ispirazioni.'
          }
        ]
      },
      mockupsLead: 'Il manifesto nel mondo: in strada tra gli adesivi e sulla facciata del teatro.',
      mockups: [
        {
          src: 'assets/projects/la-fanciulla-del-west/mockup-strada.jpg',
          ratio: 456 / 840,
          alt: 'La Fanciulla del West — Mockup in strada',
          kind: 'AFFISSIONE IN STRADA',
          title: 'Tra gli adesivi',
          desc: 'Il manifesto su un muro urbano pieno di sticker'
        },
        {
          src: 'assets/projects/la-fanciulla-del-west/mockup-teatro.jpg',
          ratio: 1108 / 840,
          alt: 'La Fanciulla del West — Mockup sul teatro',
          kind: 'FACCIATA DEL TEATRO',
          title: 'All’ingresso del teatro',
          desc: 'Il manifesto in bacheca sulla facciata dell’opera'
        }
      ],
      download: {
        href: 'Progetti/Graphic%20Design/La%20Fanciulla%20del%20West/Presentazione_JacopoFebi_LaFanciullaDelWest.pdf',
        label: 'Apri la presentazione completa',
        meta: 'PDF, 11 slide, 12,8 MB'
      }
    }
  },
  {
    id: 'r-01',
    code: 'R-01 // INT-SYS',
    title: 'KINETIC INTERFACE // BAUHAUS DESIGN SYSTEM',
    category: 'Interaction Design',
    year: '2026',
    shapeName: 'Wireframe Cube',
    colorHex: '#E63946',
    capsuleColor: 'red',
    style: 'Bauhaus / Design System',
    palette: ['#E63946', '#FFB703', '#1D3557', '#F7F1E4', '#151413'],
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
    style: 'Geometrico 3D',
    palette: ['#FFB703', '#F4A261', '#1D3557', '#0C0C10'],
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
    style: 'Toy / Arcade',
    palette: ['#1D3557', '#3A86FF', '#FFB703', '#F7F1E4'],
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
    style: 'Svizzero / Risograph',
    palette: ['#FF4F6D', '#FFE600', '#2E5BFF', '#F7F1E4'],
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
    style: 'Cinetico / Generativo',
    palette: ['#E63946', '#FFB703', '#1D3557', '#FFFFFF'],
    software: ['Adobe After Effects', 'Figma'],
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
    style: 'Pop & Psichedelico',
    palette: ['#EFEA16', '#D68DC1', '#6DC8AB', '#0E74BA', '#070707'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Poster Design', 'Pop Art', 'Illustrazione Vettoriale', 'Mockup Design'],
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
    style: 'Hardware / Industriale',
    palette: ['#E63946', '#C1121F', '#151413', '#E5E5E5'],
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
    style: 'Rétro-cyber / 1-bit',
    palette: ['#2A9D8F', '#151413', '#F7F1E4', '#E63946'],
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
    style: 'Brutalista / Costruttivista',
    palette: ['#151413', '#C9A227', '#F7F1E4', '#FFB703'],
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
    style: 'Monospace / Editoriale',
    palette: ['#1D3557', '#E63946', '#F7F1E4', '#151413'],
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
    style: 'Modulare / Computazionale',
    palette: ['#E63946', '#151413', '#F7F1E4', '#8D99AE'],
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
    style: 'Pixel / Arcade',
    palette: ['#2A9D8F', '#38B000', '#151413', '#F7F1E4'],
    software: ['Arduino', 'Blender'],
    stack: ['ESP32', '3D Print', 'Haptic Motors', 'Bluetooth LE'],
    description: 'Controller arcade tascabile con switch meccanici a scatto rapido, display OLED monochrome integrato e vibrazione aptica programmabile per chiptune.',
    metrics: { latenza: '1.2ms BLE', switch: 'Gateron Red', autonomia: '24 Ore' },
    details: 'Progettato e stampato in 3D con resina fotopolimerica semitrasparente. Si connette direttamente al browser via WebBluetooth per i giochi web arcade.'
  }
];
