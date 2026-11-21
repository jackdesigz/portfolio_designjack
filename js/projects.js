/**
 * designjack — Registro dei progetti
 * Unica fonte dei dati usata da filo dei progetti, catalogo, claw machine e modal.
 */

window.PROJECT_REGISTRY = [
  {
    id: 'r-16',
    code: 'R-16 // BRAND-MELAGOCCIO',
    title: 'MELAGOCCIO',
    category: 'Brand Design',
    year: '2025',
    shapeName: 'Mint Torus',
    colorHex: '#02AF91',
    capsuleColor: 'green',
    style: 'Cartoon & Sportivo',
    palette: ['#CDEEE9', '#02AF91', '#C7609C', '#EDD6E5', '#0B0F14'],
    software: ['Adobe Illustrator', 'Adobe Photoshop'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Logo Design', 'Mascotte', 'Merchandising', 'Social Media'],
    description: 'Identità visiva per i Melagoccio, squadra amatoriale mista di pallavolo: un logo con la mascotte, la grafica della felpa, le figurine dei giocatori e il banner per Instagram.',
    details: 'Il marchio è un badge tondo con la mascotte rosa al centro e il nome che gira tutto intorno in lettere a blocchi. Rosa e verde menta tengono insieme ogni pezzo, dalle figurine al profilo social. Sulla felpa grigia il logo sta sul petto, mentre il retro porta la mascotte con pallone e boccale e lo slogan “One shot, one spike”. Ogni giocatore ha la sua figurina con numero, firma e soprannome.',
    coverImage: 'assets/projects/melagoccio/cover.jpg',
    capsuleImage: 'assets/projects/melagoccio/capsule.png',
    gallery: {
      layout: 'melagoccio',
      base: 'assets/projects/melagoccio/',
      kicker: 'Brand Design // Squadra amatoriale mista',
      lead: 'Pallavolo, amici e una mascotte rosa: l’identità di una squadra che gioca per divertirsi.',
      slogan: 'ONE SHOT ✦ ONE SPIKE ✦',
      brandTitle: 'Il brand',
      brandText: [
        'Il logo è un <strong>badge tondo</strong>: la mascotte al centro e il nome MELAGOCCIO che le gira intorno in lettere a blocchi, come lo stemma di una squadra.',
        'La palette mette insieme il <strong>rosa</strong> della mascotte e il <strong>verde menta</strong>, con il nero per i contorni: colori pop che si riconoscono da lontano, sul campo e sui social.'
      ],
      colors: [
        { name: 'Menta', hex: '#CDEEE9' },
        { name: 'Verde', hex: '#02AF91', text: '#FFFFFF' },
        { name: 'Rosa', hex: '#C7609C', text: '#FFFFFF' },
        { name: 'Rosa chiaro', hex: '#EDD6E5' },
        { name: 'Inchiostro', hex: '#0B0F14', text: '#FFFFFF' }
      ],
      hoodieTitle: 'La felpa',
      hoodieText: 'Sul petto il logo, sul retro la mascotte con pallone e boccale e lo slogan <strong>“One shot, one spike”</strong>. Gira la felpa per vedere entrambi i lati.',
      cardsTitle: 'Le figurine',
      cardsText: 'Una figurina per ogni giocatore: foto con la divisa, numero, soprannome firmato a mano e nome in lettere a blocchi, sullo sfondo a scritte del brand.',
      players: [
        { src: 'giocatore-1.jpg', caption: 'Figurina // #42 Marta Parabito' },
        { src: 'giocatore-2.jpg', caption: 'Figurina // #40 Azzurra Pagani' },
        { src: 'giocatore-3.jpg', caption: 'Figurina // #69 Andrea Meinardi' },
        { src: 'giocatore-4.jpg', caption: 'Figurina // #18 Sara Sabetta' }
      ],
      banner: {
        title: 'Social',
        text: 'Sul profilo Instagram il banner “Squadra amatoriale mista” è diviso in <strong>tre post</strong> che, uno accanto all’altro, ricompongono l’immagine intera.',
        src: 'banner-instagram.jpg',
        ratio: 2169 / 961,
        caption: 'Instagram // Il banner diviso in tre post'
      }
    }
  },
  {
    id: 'r-15',
    code: 'R-15 // BRAND-ABLONDI',
    title: 'TEATRO SALONE ABLONDI',
    category: 'Brand Design',
    year: '2025',
    shapeName: 'Velvet Prism',
    colorHex: '#440096',
    capsuleColor: 'purple',
    style: 'Elegante & Teatrale',
    palette: ['#FFFFFF', '#F5EBDD', '#000000', '#440096'],
    software: ['Adobe Illustrator', 'Adobe Photoshop'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Logo Design', 'Brand Guidelines', 'Tipografia', 'Mockup Design'],
    description: 'Identità visiva per il Teatro Salone Ablondi: un simbolo nato dalla A del nome, un marchio con due caratteri in proporzione fissa e le linee guida per usarlo.',
    details: 'Il simbolo parte dalla A di Ablondi: due archi la racchiudono come le quinte di un sipario e tre linee curve, sotto, disegnano il palco. Ci si è arrivati per variazioni successive, semplificando il segno a ogni passaggio. Il marchio unisce Montserrat Regular per TEATRO SALONE e Radlush SemiBold per ABLONDI, in proporzioni fissate dalle linee guida. La palette ha quattro colori (bianco, crema, nero e un viola profondo) e il marchio funziona su ognuno. Le linee guida chiudono con le applicazioni sulle magliette.',
    coverImage: 'assets/projects/teatro-ablondi/cover.jpg',
    capsuleImage: 'assets/projects/teatro-ablondi/capsule.png',
    gallery: {
      layout: 'ablondi',
      base: 'assets/projects/teatro-ablondi/',
      stageCaption: 'Si apre il sipario',
      symbolTitle: 'Il simbolo',
      symbolText: [
        'Il simbolo parte dalla <strong>A di Ablondi</strong>: due archi la racchiudono come le quinte di un sipario e tre linee curve, sotto, disegnano il palco.',
        'Ci si è arrivati per variazioni successive, togliendo a ogni passaggio quello che non serviva.'
      ],
      process: [
        { src: 'variazioni-prime.png', title: 'Prime variazioni', desc: 'Le prime idee: gradini, la A tagliata, il cerchio' },
        { src: 'variazioni-ultime.png', title: 'Ultime variazioni', desc: 'Il segno si stringe attorno alla A e al palco' },
        { title: 'Versione finale', desc: 'Il simbolo definitivo', final: true }
      ],
      buildTitle: 'Costruzione',
      facts: [
        { value: '× 2,42', label: 'ABLONDI è 2,42 volte più grande di TEATRO SALONE.' },
        { value: '× 2,546', label: 'L’altezza y è 2,546 volte l’altezza x.' }
      ],
      paletteTitle: 'Palette',
      colors: [
        { name: 'Bianco', hex: '#FFFFFF', cmyk: 'C0 M0 Y0 K0', ink: '#000000', logo: 'black' },
        { name: 'Crema', hex: '#F5EBDD', cmyk: 'C3 M6 Y12 K0', ink: '#440096', logo: 'viola' },
        { name: 'Nero', hex: '#000000', cmyk: 'C60 M40 Y40 K100', ink: '#FFFFFF', logo: 'bianco' },
        { name: 'Viola', hex: '#440096', cmyk: 'C89 M100 Y2 K3', ink: '#F5EBDD', logo: 'crema' }
      ],
      typeTitle: 'Tipografia',
      fonts: [
        { cls: 'is-montserrat', use: 'TEATRO SALONE', name: 'Montserrat Regular', sample: 'TEATRO SALONE' },
        { cls: 'is-radlush', use: 'ABLONDI', name: 'Radlush SemiBold', sample: 'ABLONDI' }
      ],
      mockup: {
        title: 'Applicazioni',
        lead: 'Il marchio sulle magliette: in <strong>bianco sul nero</strong> e in <strong>nero sul bianco</strong>, piccolo sul petto.',
        src: 'mockup-tshirt.jpg',
        alt: 'Magliette nera e bianca con il marchio del Teatro Salone Ablondi',
        caption: 'Mockup // Il marchio sulle magliette'
      }
    }
  },
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
    capsuleImage: 'assets/projects/campari-champ-ar/capsule.png',
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
    capsuleColor: 'yellow',
    style: 'Art Déco & Pop Art',
    palette: ['#BF2025', '#E7C42F', '#000000', '#FFFFFF'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Poster Design', 'Art Déco', 'Pop Art', 'Mockup Design'],
    description: 'Manifesto grafico per l’opera lirica di Giacomo Puccini: un’identità visiva che trasforma la protagonista in una regina di cuori, tra sagome poligonali pop art e dettagli art déco.',
    metrics: { formato: 'Manifesto', palette: 'Rosso / Oro / Nero', stile: 'Art Déco & Pop Art' },
    details: 'La protagonista è disegnata come la regina di cuori di un mazzo da gioco: lo sguardo assorto richiama la partita a carte in cui si gioca il destino suo e dell’uomo che ama. Nella parte bassa, sagome poligonali bicromatiche raccontano gli elementi chiave dell’opera e la loro posizione ha un significato: l’amato ferito è sul cuore di lei, lo sceriffo dal lato opposto, e la mano inserita è la “mano del morto”, leggenda del Far West. Lo stile prende da Saul Bass, dall’opening di Casino Royale e dalle cinematiche di Deathloop; il titolo è composto in Decondol Regular. Progetto d’esame di progettazione grafica, Istituto Modartech (2025).',
    coverImage: 'assets/projects/la-fanciulla-del-west/poster.jpg',
    capsuleImage: 'assets/projects/la-fanciulla-del-west/capsule.png',
    gallery: {
      layout: 'fanciulla',
      base: 'assets/projects/la-fanciulla-del-west/',
      kicker: 'Giacomo Puccini',
      lead: 'Il manifesto per l’opera di Puccini: la protagonista diventa la regina di cuori, tra sagome pop art e dettagli art déco.',
      posterAlt: 'Il manifesto de La Fanciulla del West',
      queenTitle: 'La regina di cuori',
      queenText: [
        'La protagonista è disegnata come la <strong>regina di cuori</strong> di un mazzo da gioco standard. Il suo sguardo assorto riporta al momento più importante dell’opera: la partita a carte in cui si gioca il destino suo e dell’uomo che ama.',
        'Per vincere estrae dalla calza una mano di valore più alto, in un momento di distrazione dell’avversario, e si assicura così la vittoria.'
      ],
      handCaption: 'Nel manifesto c’è anche la mano del morto, leggenda del Far West: assi e otto neri.',
      shapesTitle: 'Le sagome',
      shapesText: [
        'Sagome poligonali bicromatiche in stile pop art e art déco. Rappresentano gli elementi importanti dell’opera, e anche <strong>la loro posizione ha un significato</strong>.'
      ],
      sagome: [
        { src: 'amato.png', title: 'L’amato ferito', text: 'Si rifugia da lei ferito poco prima della partita: per questo sta sul suo cuore.', cls: 'is-heart' },
        { src: 'cowboy.png', title: 'Lo sceriffo', text: 'Dal lato opposto, rivale del bandito.' },
        { src: 'pistola.png', title: 'La pistola', text: 'Vicino allo sceriffo, con gli elementi che lo mettono contro il bandito.' },
        { src: 'tamburo.png', title: 'Il tamburo', text: 'Il tamburo del revolver, accanto allo sceriffo.' },
        { src: 'proiettili.png', title: 'I proiettili', text: 'Bicromatici come le altre sagome: bianco e oro.' },
        { src: 'carte.png', title: 'La mano del morto', text: 'Non è casuale: è la mano leggendaria del Far West.' }
      ],
      styleTitle: 'Lo stile',
      styleText: [
        'Art déco stilizzato e pop art: lo si vede nel font del titolo, il <strong>Decondol Regular</strong>, e nelle sagome nella parte bassa del manifesto.',
        'Le sagome bicromatiche si sposano con la protagonista in stile “carta da gioco”, dove i pattern semplici riprendono sia la geometria dell’art déco sia le vesti della regina di cuori.'
      ],
      references: [
        { year: '1959', title: 'Anatomy of a Murder', note: 'I titoli di testa di Saul Bass' },
        { year: '2006', title: '007 Casino Royale', note: 'La sequenza d’apertura' },
        { year: '2021', title: 'Deathloop', note: 'Le cinematiche animate' }
      ],
      colors: [
        { hex: '#BF2025', cmyk: 'C16 M100 Y100 K9', rank: 'Q', suit: '♥', ink: '#F4EFE4' },
        { hex: '#E7C42F', cmyk: 'C11 M19 Y94 K0', rank: 'K', suit: '♦', ink: '#0A0A0A' },
        { hex: '#000000', cmyk: 'C60 M40 Y40 K100', rank: 'A', suit: '♠', ink: '#F4EFE4' },
        { hex: '#FFFFFF', cmyk: 'C0 M0 Y0 K0', rank: 'J', suit: '♣', ink: '#0A0A0A' }
      ],
      sketchesTitle: 'Le bozze',
      sketchesList: [
        { src: 'bozza-1.jpg', title: 'Bozza 1', text: 'L’idea originale: la rappresentazione della scena.' },
        { src: 'bozza-2.jpg', title: 'Bozza 2', text: 'Il focus sul personaggio e le prime stilizzazioni.' },
        { src: 'bozza-3.jpg', title: 'Bozza 3', text: 'Il personaggio e l’idea concreta di stilizzazione.' }
      ],
      mockupsTitle: 'Nel mondo',
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
    id: 'r-06',
    code: 'R-06 // GRAPHIC-ECHO',
    title: 'ECHO SOUND FESTIVAL',
    category: 'Graphic Design',
    year: '2025',
    shapeName: 'Double Pyramid',
    colorHex: '#FF5E7E',
    capsuleColor: 'blue',
    style: 'Pop & Psichedelico',
    palette: ['#EFEA16', '#D68DC1', '#6DC8AB', '#0E74BA', '#070707'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Poster Design', 'Pop Art', 'Illustrazione Vettoriale', 'Mockup Design'],
    description: 'Esercizio di grafica vettoriale e visual design composto con Adobe Illustrator: una serie di illustrazioni che vanno a comporre un poster grafico ispirato a grafiche psichedeliche e POP, corredato da mockup.',
    metrics: { software: 'Illustrator', stile: 'POP / Psychedelic', output: 'Poster & Mockup' },
    details: 'Un lavoro di composizione e ritmo visivo sviluppato interamente in vettoriale. Le singole illustrazioni, ricche di curve organiche e palette sature a contrasto, si intrecciano per dare vita al poster ufficiale dell’Echo Sound Festival e alle sue declinazioni promozionali.',
    coverImage: 'assets/projects/echo-sound-festival/poster.png',
    capsuleImage: 'assets/projects/echo-sound-festival/capsule.png',
    gallery: {
      layout: 'echo',
      base: 'assets/projects/echo-sound-festival/',
      date: '20 maggio 2025',
      lead: 'Un esercizio di grafica vettoriale: tante illustrazioni che, messe insieme, compongono il poster di un festival pop e rap.',
      strip: 'POP ✦ RAP ✦ PSICHEDELIA ✦',
      posterTitle: 'Il poster',
      posterText: [
        'Il poster è un mosaico di riquadri, ognuno con la sua illustrazione e il suo fondo: le righe, la griglia ondulata, le onde blu, i cerchi arancioni.',
        'I colori sono <strong>saturi e a contrasto</strong>, tenuti insieme da un contorno nero spesso, come nelle grafiche pop e psichedeliche a cui si ispira.'
      ],
      colors: [
        { hex: '#EFEA16' },
        { hex: '#D68DC1' },
        { hex: '#6DC8AB' },
        { hex: '#0E74BA', ink: '#FEF7CF' },
        { hex: '#070707', ink: '#EFEA16' }
      ],
      illTitle: 'Le illustrazioni',
      illLead: 'Le illustrazioni sono nate una per una in Adobe Illustrator, poi ognuna ha trovato il suo posto nel poster.',
      illustrationsList: [
        { src: 'illustration-1.png', title: 'L’UFO', text: 'Un disco volante con un occhio solo, sopra le onde blu.', bg: 'blue' },
        { src: 'illustration-2.png', title: 'La cassetta', text: 'Il nastro che fa partire la musica, sui cerchi arancioni.', bg: 'orange' },
        { src: 'illustration-3.png', title: 'I ballerini', text: 'Tre figure gialle che ballano sulle righe rosa.', bg: 'pink' }
      ],
      mockTitle: 'I mockup',
      mockLead: 'Il poster attaccato in strada e il post su Instagram.',
      mockupsList: [
        { src: 'mockup-poster.jpg', ratio: 1600 / 1070, kind: 'AFFISSIONE', title: 'Il poster su un muro in città', alt: 'Il poster dell’Echo Sound Festival attaccato su una parete di legno' },
        { src: 'mockup-instagram.jpg', ratio: 1, kind: 'INSTAGRAM', title: 'Il post del festival', alt: 'Il post Instagram dell’Echo Sound Festival' }
      ]
    }
  }
];
