/**
 * designjack — Registro dei progetti
 * Unica fonte dei dati usata da filo dei progetti, catalogo, claw machine e modal.
 */

window.PROJECT_REGISTRY = [
  {
    id: 'r-24',
    code: 'R-24 // WEB-DESIGNJACK',
    title: 'DESIGNJACK — IL PORTFOLIO',
    category: 'Web Design',
    year: '2026',
    shapeName: 'RGB Prism',
    colorHex: '#E63946',
    capsuleColor: 'red',
    style: 'Tre canali in uno',
    palette: ['#F2EBDD', '#E63946', '#151413', '#B8F23A', '#0F2A1D', '#28C3FF', '#0A4F8C'],
    software: ['JavaScript', 'Three.js', 'HTML5 Canvas'],
    stack: ['JavaScript', 'Three.js', 'HTML5 Canvas', 'Web Design', 'Interaction Design', 'Cultura visiva', 'Intelligenza artificiale', 'Web Audio'],
    description: 'Il sito che stai guardando: un portfolio in tre canali, R, G e B, ognuno con il suo carattere. L’ho costruito unendo design, cultura visiva e intelligenza artificiale.',
    details: 'Il canale R (Realizzazioni e Ricreazione) mescola il Bauhaus con i monitor CRT e i giochi arcade: i lavori sono fogli appesi a un filo e capsule da pescare con una claw machine. Il canale G è il lato organico e street, dove racconto chi sono. Il canale B, per i contatti, è Frutiger Aero marino: vetro lucido, bolle e acqua. Il codice è nato in dialogo con un assistente di intelligenza artificiale: io ho deciso riferimenti, regole e dettagli visivi, l’AI li ha tradotti in codice, e ho provato e corretto ogni passaggio.',
    coverImage: 'assets/projects/designjack/cover.jpg',
    capsuleImage: 'assets/projects/designjack/capsule.png',
    gallery: {
      layout: 'designjack',
      base: 'assets/projects/designjack/',
      kicker: 'Web Design // Il sito che stai guardando',
      heroTitle: 'Un sito, tre canali.',
      lead: 'Il mio portfolio non ha una sola faccia: R per i lavori e i giochi, G per raccontarmi, B per i contatti. Il nome resta, lo stile cambia. L’ho costruito unendo <strong>design</strong>, <strong>cultura visiva</strong> e <strong>intelligenza artificiale</strong>.',
      vennTitle: 'Design × Cultura visiva × AI',
      venn: {
        design: { title: 'Design', text: 'Il progetto: l’idea dei tre canali, le griglie, i caratteri, i colori, le interazioni. Ogni scelta parte da cosa deve fare la pagina: mostrare i lavori, raccontarmi, farmi trovare.' },
        culture: { title: 'Cultura visiva', text: 'I riferimenti: il Bauhaus e il costruttivismo, i monitor CRT e gli arcade per R; graffiti, adesivi e forme organiche per G; il Frutiger Aero, l’acqua e le bolle dei primi anni Duemila per B.' },
        ai: { title: 'AI', text: 'Lo strumento: il codice è nato in dialogo con un assistente di intelligenza artificiale. Io descrivevo cosa volevo e come doveva sembrare, l’AI scriveva il codice, io lo provavo e chiedevo correzioni, un giro dopo l’altro.' },
        center: { title: 'designjack', text: 'Nessuna delle tre basta da sola. Senza un progetto l’AI fa pagine qualunque; senza riferimenti il progetto è vuoto; senza uno strumento i riferimenti restano su una tavola. Il sito sta nel mezzo.' }
      },
      moodTitle: 'Il moodboard',
      moodText: 'Quattro famiglie di immagini, tre canali. Passa sulle zone per vedere dove sono finite.',
      zones: [
        { ch: 'r', x: 37, y: 4, w: 26, h: 24, title: 'Schermi e arcade', text: 'Il display arancione di un vecchio cellulare, una griglia al neon, una scritta su un monitor CRT. Nel canale R diventano le scanline, la claw machine e i giochi.' },
        { ch: 'r', x: 5, y: 44, w: 24, h: 54, title: 'Bauhaus e costruttivismo', text: 'Cerchi, triangoli e rettangoli in rosso, giallo e blu su carta. Nel canale R diventano la carta crema, le ombre dure e le forme geometriche.' },
        { ch: 'g', x: 40, y: 47, w: 25, h: 40, title: 'Verde e graffiti', text: 'Onde verdi, segni di spray, adesivi. Nel canale G diventano il muro verde notte, i blob che respirano e la tag a spray.' },
        { ch: 'b', x: 75, y: 50, w: 24, h: 43, title: 'Acqua e Frutiger Aero', text: 'Un vinile azzurro, l’acqua, le bolle. Nel canale B diventano il vetro lucido, il mare e le bolle che salgono.' }
      ],
      channelsTitle: 'Tre canali',
      channels: [
        { key: 'r', name: 'R — Realizzazioni e Ricreazione', shot: 'shot-r.jpg', more: 'shot-claw.jpg', text: 'I lavori e i giochi. Carta crema, ombre dure e le forme del Bauhaus, dentro finestre con le scanline di un vecchio monitor. I progetti sono fogli appesi a un filo e capsule da pescare con una claw machine.', refs: 'Bauhaus · costruttivismo · monitor CRT · arcade anni ’80' },
        { key: 'g', name: 'G — Germogli e Graffiti', shot: 'shot-g.jpg', more: 'shot-gabout.jpg', text: 'Il lato organico e street, dove racconto chi sono e come lavoro. Un muro verde notte con forme che respirano, adesivi da staccare e la tag a spray.', refs: 'graffiti · sticker art · forme organiche · verde' },
        { key: 'b', name: 'B — Bolle e Bottiglie', shot: 'shot-b.jpg', more: 'shot-bdeep.jpg', text: 'I contatti, in Frutiger Aero marino: cielo, acqua, vetro lucido e bolle. Si può anche lanciare un messaggio in bottiglia.', refs: 'Frutiger Aero · primi anni 2000 · acqua · bolle' }
      ],
      stepsTitle: 'Come l’ho costruito',
      steps: [
        { who: 'me', whoLabel: 'io', title: 'Riferimenti', text: 'Raccolgo le immagini nel moodboard e le divido in famiglie: ognuna diventa un canale.' },
        { who: 'me', whoLabel: 'io', title: 'Regole', text: 'Per ogni canale decido colori, caratteri e comportamenti: carta e ombre dure in R, muro verde e spray in G, vetro e bolle in B.' },
        { who: 'both', whoLabel: 'io + AI', title: 'Prototipo', text: 'Descrivo all’AI cosa deve succedere e come deve sembrare; lei scrive il codice e io lo apro nel browser.' },
        { who: 'both', whoLabel: 'io + AI', title: 'Prova e correggi', text: 'Provo su computer e telefono e segnalo cosa non va: un’animazione che scatta, un ritaglio sbagliato, un colore fuori tono. Si rifà finché funziona.' },
        { who: 'me', whoLabel: 'io', title: 'Contenuti', text: 'Ogni progetto ha una pagina tutta sua, nello stile del progetto, con immagini e testi presi dai file originali.' }
      ],
      featuresTitle: 'Dentro il sito',
      features: [
        { src: 'shot-wire.jpg', title: 'Il filo dei progetti', text: 'I lavori appesi come fogli: passandoci sopra si illuminano, cliccandoli si apre la scheda.' },
        { src: 'shot-claw.jpg', title: 'La claw machine', text: 'Ogni progetto è una capsula: la peschi e si apre la sua scheda.' },
        { src: 'shot-catalog.jpg', title: 'Il catalogo', text: 'Tutto l’archivio in griglia, con i filtri per disciplina e lo stile R, G o B da cambiare al volo.' },
        { src: 'shot-project.jpg', title: 'Le schede dei progetti', text: 'L’intestazione segue il canale, il resto prende lo stile del progetto.' },
        { src: 'shot-gabout.jpg', title: 'L’avatar', text: 'Un avatar 3D che saluta, commenta quello che guardi e ti segue in basso a sinistra.' },
        { src: 'shot-bdeep.jpg', title: 'I contatti', text: 'Scrivermi, copiare l’indirizzo o mandare un messaggio in bottiglia.' }
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'Canvas', 'Web Audio', 'nessun framework']
    }
  },
  {
    id: 'r-23',
    code: 'R-23 // COLLAB-IKIGAI',
    title: 'IKIGAI × DESIGNJACK — YŪGEN / KŌKOTSU',
    category: 'Collaborations',
    year: '2025',
    shapeName: 'Chrome Blob',
    colorHex: '#DE6450',
    capsuleColor: 'coral',
    style: 'Surreale & 3D',
    palette: ['#D3D3D1', '#BC4138', '#DE6450', '#C97BAE', '#6E3F7E', '#1F1A1C'],
    software: ['Blender'],
    stack: ['Blender', 'Rendering 3D', 'Copertina', 'Spotify Canvas', 'Motion', 'Musica'],
    description: 'La copertina e il Canvas per Spotify di Yūgen (幽玄) e Kōkotsu (恍惚), due singoli di Ikigai: un personaggio low-poly con un mantello a pixel, in un deserto rosso sotto nuvole di cromo liquido.',
    details: 'Tutto è costruito in 3D. Il personaggio ha un volto fotografico spezzato in poligoni, un braccio meccanico e un mantello di pixel colorati; attorno, picchi rossi appuntiti e forme cromate che fluttuano e riflettono il paesaggio. Il Canvas, il video in loop che Spotify mostra durante l’ascolto, riprende la stessa scena: la camera gira piano attorno al personaggio, il mantello si muove e le nuvole scorrono.',
    coverImage: 'assets/projects/ikigai-yugen-kokotsu/cover.jpg',
    capsuleImage: 'assets/projects/ikigai-yugen-kokotsu/capsule.png',
    gallery: {
      layout: 'ikigai',
      base: 'assets/projects/ikigai-yugen-kokotsu/',
      kicker: 'Collaborations // Ikigai × designjack',
      lead: 'La copertina e il Canvas per Spotify di due singoli di Ikigai: un personaggio low-poly in un deserto rosso, sotto nuvole di cromo liquido.',
      credit: 'Musica di Ikigai — grafiche di designjack',
      artist: 'Ikigai',
      tracks: [
        { title: 'Yūgen', kanji: '幽玄', reading: 'yūgen', meaning: 'Una parola dell’estetica giapponese: la bellezza profonda e misteriosa, quella che si intuisce senza poterla spiegare del tutto.' },
        { title: 'Kōkotsu', kanji: '恍惚', reading: 'kōkotsu', meaning: 'Estasi, rapimento: lo stato in cui si resta incantati, come fuori dal tempo.' }
      ],
      listenTitle: 'Ascolta',
      listenText: 'Su Spotify, mentre ascolti, al posto della copertina parte il <strong>Canvas</strong>: un video verticale di pochi secondi che si ripete. Qui la camera gira piano attorno al personaggio, il mantello si muove e le nuvole di cromo scorrono.',
      listenNote: 'I brani sono gli stessi del disco in alto a destra: i pulsanti di questa pagina comandano quel player.',
      coverTitle: 'La copertina',
      spots: [
        { x: 61, y: 37, title: 'Il volto', text: 'Una foto di un volto vero, spezzata nei poligoni di una testa low-poly.' },
        { x: 55, y: 57, title: 'Il mantello', text: 'Un mantello di pixel colorati, come un glitch che diventa stoffa.' },
        { x: 70, y: 66, title: 'Il braccio', text: 'Un braccio meccanico nero: il personaggio è mezzo umano e mezzo macchina.' },
        { x: 20, y: 14, title: 'Le nuvole di cromo', text: 'Forme di metallo liquido che fluttuano nel cielo grigio e riflettono il rosso del paesaggio.' },
        { x: 29, y: 50, title: 'Il deserto rosso', text: 'Picchi rossi appuntiti e un pavimento salmone: un paesaggio irreale, quasi su un altro pianeta.' }
      ],
      wordsTitle: 'Due parole'
    }
  },
  {
    id: 'r-22',
    code: 'R-22 // GRAPHIC-BOSCH',
    title: 'HIERONYMUS BOSCH × VIVIENNE WESTWOOD',
    category: 'Graphic Design',
    year: '2025',
    shapeName: 'Golden Orb',
    colorHex: '#B08D57',
    capsuleColor: 'gold',
    style: 'Concept & Gioielleria',
    palette: ['#D6CFC6', '#F1EEEA', '#1C1916', '#B08D57', '#2E6B4F'],
    software: ['Blender'],
    stack: ['Blender', 'Modellazione 3D', 'Rendering 3D', 'Concept', 'Gioielleria', 'Storia dell’arte'],
    description: 'Un concept di collaborazione tra Vivienne Westwood e Hieronymus Bosch: un ciondolo Orb in cui il globo diventa l’uovo spaccato di Bosch, modellato e renderizzato in Blender, e un Armor Ring con il Giardino delle delizie.',
    details: 'Nato come progetto d’esame di Storia dell’arte moderna. Westwood e Bosch usano entrambi simboli forti per andare contro il gusto del loro tempo, ed entrambi sono ancora vivi nella cultura pop: da qui l’idea di unirli in un gioiello. Ho modellato il ciondolo in Blender, sostituendo il globo dell’Orb con l’uovo spaccato dell’uomo-albero, e l’ho messo in scena nello spazio, sopra la Terra, curando luci e composizione. La seconda proposta porta il Giardino delle delizie sull’Armor Ring, dall’alto verso il basso: paradiso, giardino, inferno.',
    coverImage: 'assets/projects/bosch-westwood/cover.jpg',
    capsuleImage: 'assets/projects/bosch-westwood/capsule.png',
    gallery: {
      layout: 'bosch',
      base: 'assets/projects/bosch-westwood/',
      kicker: 'Concept di collaborazione — render 3D in Blender — 2025',
      heroNote: 'Render in Blender — Jacopo “Jack” Febi',
      rootsText: 'Il progetto è nato per l’esame di Storia dell’arte moderna (05/09/2025): prima di disegnare il gioiello ho studiato i due autori. Bosch, il «creatore di diavoli», e Vivienne Westwood, dal punk all’Orb, in breve.',
      boschQuote: '“creatore di diavoli”',
      boschText: [
        'Hieronymus Bosch, nato come Jeroen van Aken, è stato un pittore nordeuropeo (sud dei Paesi Bassi) brillante e originale, le cui opere rivelano un’iconografia complessa e uno stile individuale. Vissuto tra il 1450 e il 1516, è stato riconosciuto come un fantasioso <strong>«creatore di diavoli»</strong> e un potente inventore di scene apparentemente senza senso, ma ricche di significato.',
        'Le sue pitture, che a prima vista possono sembrare il frutto di un incubo, sono rappresentazioni visive della <strong>follia e del peccato umano</strong>, veicolati tramite complessi simbolismi. La sua visione del mondo era pessimista e severamente moralista: non aveva illusioni sulla razionalità della natura umana.'
      ],
      phases: [
        {
          title: 'Opere giovanili',
          sub: 'Primi accenni al creatore di demoni',
          text: 'I primi lavori mostrano una tecnica ancora in via di sviluppo, con un disegno e una composizione a volte incerti. Le scene, ambientate in contesti calmi e quotidiani, hanno un aspetto convenzionale, ma ci sono già i <strong>panorami</strong> e le <strong>zone d’ombra</strong> in cui si celano i primi simboli e le prime creature.',
          works: [
            { src: 'ecce-homo.jpg', cap: 'Ecce Homo, ca. 1475–1485, tempera e olio su quercia, Städel Museum, Francoforte' },
            { src: 'adorazione-magi.jpg', cap: 'Adorazione dei Magi, ca. 1475, olio e oro su quercia, Metropolitan Museum of Art, New York' }
          ]
        },
        {
          title: 'Opere di maturità',
          sub: 'Picco massimo del suo stile artistico',
          text: 'È nella maturità che Bosch crea i suoi capolavori più complessi e visionari. I grandi trittici, come il <strong>Giardino delle delizie</strong>, il <strong>Trittico del fieno</strong> e le <strong>Tentazioni di Sant’Antonio</strong>, sono un’eruzione di fantasia: scene apocalittiche di caos e incubo contrapposte a raffigurazioni idilliache, con figure aggraziate, colori sottili e una composizione fluida.',
          works: [
            { src: 'carro-fieno.jpg', cap: 'Il carro di fieno, ca. 1500–1516, olio su tavola, Museo del Prado, Madrid' },
            { src: 'giardino-inferno.jpg', cap: 'Giardino delle delizie, l’inferno, ca. 1490, olio su tavola, Museo del Prado, Madrid' }
          ]
        },
        {
          title: 'Opere finali',
          sub: 'Cambio di prospettiva',
          text: 'L’ultimo periodo è segnato da un radicale cambiamento di scala: Bosch lascia i vasti paesaggi abitati da centinaia di piccole figure per concentrarsi su <strong>primi piani drammatici</strong>. Nell’Incoronazione di spine e in Cristo che porta la croce i gruppi di figure sono compattati contro il piano del quadro, e lo spettatore partecipa fisicamente e psicologicamente all’evento.',
          works: [
            { src: 'cristo-croce.jpg', cap: 'Cristo che porta la croce, ca. 1510, olio su tavola, Museo di Belle Arti, Gand' },
            { src: 'cristo-deriso.jpg', cap: 'Cristo deriso, ca. 1510, olio su tavola, National Gallery, Londra' }
          ]
        }
      ],
      punk: [
        { year: '1971', title: 'Let it Rock, SEX, Seditionaries', src: 'westwood-punk.jpg', cap: 'Vivienne Westwood negli anni del punk', text: 'Vivienne Westwood e Malcolm McLaren si ribellano alla moda hippie e nel 1971 aprono «Let it Rock»: abiti per i Teddy Boy, poi la cultura biker, il fetish e il bondage. Nel 1974 il negozio diventa «SEX», poi «Seditionaries»: con i <strong>Sex Pistols</strong> nasce un’estetica «fai da te» di slogan e immagini provocatorie, in cui zip e cinghie diventano simboli di ribellione.' },
        { year: 'Dopo', title: 'Corsetti contro la borghesia', src: 'westwood-passerella.jpg', cap: 'Abiti di Vivienne Westwood in passerella', text: 'Dopo la rottura con McLaren, il suo stile guarda alla moda dei secoli passati: i <strong>corsetti</strong> servono a criticare e ridicolizzare la borghesia.' },
        { year: 'Orb', title: 'Il simbolo', src: 'orb.jpg', cap: 'The Orb, il ciondolo simbolo di Vivienne Westwood', text: 'Vivienne ha sempre usato simboli e icone per esprimersi. <strong>The Orb</strong>, creato da lei, porta la tradizione verso il futuro; i suoi capi e gioielli influenzano ancora oggi la cultura pop del punk e della ribellione.' },
        { year: '2005', title: 'NANA', src: 'nana.jpg', cap: 'I personaggi di NANA con abiti e gioielli Westwood', text: 'Nel manga <strong>NANA</strong> (dal 2005) i personaggi indossano vestiti e gioielli identici a quelli di Vivienne Westwood.' }
      ],
      ideaText: [
        'L’idea fonde i simbolismi e la cultura punk ribelle di Vivienne Westwood con i grandi simbolismi di Hieronymus Bosch, per raccontare la <strong>mente umana, il peccato e la ribellione</strong>.',
        'Ho scelto un simbolo per parte: <strong>The Orb</strong>, il globo con la croce che è il marchio di Westwood, e l’<strong>uovo spaccato</strong> dell’uomo-albero del Giardino delle delizie. Nel nuovo ciondolo l’uovo prende il posto del globo.'
      ],
      renders: [
        { src: 'render-1.jpg', label: 'Vista 1', cap: 'Il ciondolo nello spazio, sopra la Terra' },
        { src: 'render-2.jpg', label: 'Vista 2', cap: 'I due ciondoli, oro e nero' },
        { src: 'render-3.jpg', label: 'Vista 3', cap: 'Il ciondolo nero' },
        { src: 'render-4.jpg', label: 'Vista 4', cap: 'Il ciondolo nero, da lontano' },
        { src: 'blender.jpg', label: 'Blender', cap: 'La scena in Blender: camera, luci e composizione', blender: true }
      ],
      renderText: 'Ho modellato il ciondolo in <strong>Blender</strong>: l’anello dorato con le pietre verdi, la croce, l’uovo spaccato al posto del globo, le catene. Poi l’ho messo in scena nello spazio, sopra la Terra, con le sfere che fluttuano attorno: luci e inquadrature sono pensate per far risaltare l’Orb e l’uovo, i due simboli più forti dei due autori. Scegli una vista, l’ultima è la scena in Blender.',
      ringText: 'Un’altra proposta dà ancora più spazio all’artista: portare un’intera opera, il <strong>Giardino delle delizie</strong>, nell’iconico Armor Ring di Vivienne. L’anello racconta la storia del trittico dall’alto verso il basso, con il passaggio fra i vari regni dell’opera. Passa sui tre pannelli.',
      realms: [
        { name: 'Paradiso', text: 'Il pannello di sinistra: il giardino dell’Eden, dove Dio presenta Eva ad Adamo. Sull’anello è la fascia più in alto.' },
        { name: 'Giardino', text: 'Il pannello centrale, il Giardino delle delizie: un mondo di piaceri, frutti giganti e corpi. Sull’anello sta nel mezzo.' },
        { name: 'Inferno', text: 'Il pannello di destra: l’inferno, buio e pieno di demoni. Sull’anello chiude in basso, verso la mano.' }
      ],
      refs: [
        'Kathleen Kuiper, Hieronymus Bosch, Enciclopedia Britannica, 05/08/2025',
        'Michelangelo Manazza, Il Cristo deriso di Hieronymus Bosch, artslife, 29/05/2021',
        'Paul Vandenbroeck, Bosch Hieronymus, Oxford Art — Grove Art Online, 28/05/2015',
        'Scottie Andrew, How Vivienne Westwood dressed the Sex Pistols and shaped punk, CNN Style, 30/12/2022',
        'Vivienne Westwood, sito web ufficiale'
      ]
    }
  },
  {
    id: 'r-20',
    code: 'R-20 // BRAND-GELATO',
    title: 'GELATO DI PIAZZA',
    category: 'Brand Design',
    year: '2025',
    shapeName: 'Scoop Sphere',
    colorHex: '#5881C1',
    capsuleColor: 'sky',
    style: 'Fresco & Artigianale',
    palette: ['#FFF2CC', '#5881C1', '#2A2B2A', '#FCFCFC'],
    software: ['Adobe Illustrator', 'Adobe Photoshop'],
    stack: ['Adobe Illustrator', 'Adobe Photoshop', 'Logo Design', 'Pattern', 'Packaging', 'Web Design', 'Wireframe'],
    description: 'Identità visiva per Gelato di Piazza, una gelateria artigianale di Sesto Fiorentino: il marchio con un uccellino e la G che abbraccia la parola, un pattern, coppette, grembiule e il sito.',
    details: 'Il logo nasce dalla statua della piazza con il nome in corsivo; poi passa a un bastoncino in DIN Condensed Bold, con la G alta che contiene GELATO, e la statua lascia il posto a un uccellino crema e blu. Tre colori (crema, azzurro e inchiostro), un pattern di uccellini per coppette e grembiule, e il sito, pensato prima in wireframe: menu, slider dei banner con la colata di gelato, il benvenuto e il pulsante per prenotare.',
    coverImage: 'assets/projects/gelato-di-piazza/cover.jpg',
    capsuleImage: 'assets/projects/gelato-di-piazza/capsule.png',
    gallery: {
      layout: 'gelato',
      base: 'assets/projects/gelato-di-piazza/',
      kicker: 'Brand Design // Gelateria artigianale a Sesto Fiorentino',
      lead: 'Il marchio di una gelateria artigianale: un uccellino crema e blu, una G che abbraccia la parola e un pattern che finisce su coppette, grembiule e sito.',
      moodTitle: 'Il moodboard',
      moodText: 'Il punto di partenza: la torre e la piazza di Sesto Fiorentino con la sua fontana, la crema del gelato che si avvolge, una spirale blu, onde disegnate a mano, un martin pescatore e un cono a tre gusti. Dominano il crema e l’azzurro.',
      stepsTitle: 'Dalla statua all’uccellino',
      steps: [
        { title: 'La statua', src: 'processo-1.jpg', alt: 'Le prime prove: la statua della piazza accanto a Gelato di Piazza scritto in corsivo', text: 'Il primo logo parte dalla statua della piazza: la sua sagoma accanto a «Gelato di Piazza» scritto in corsivo, in blu, in rosso e in nero.' },
        { title: 'Il corsivo', src: 'processo-2.jpg', alt: 'Varianti del logo in corsivo, in blu, rosso e nero', text: 'Il corsivo si prova dritto e ondulato, con la palette crema, rosso, azzurro e nero; la statua si riduce a un segno di pennello.' },
        { title: 'La G', src: 'processo-3.jpg', alt: 'Il nome in DIN Condensed con la G alta, accanto alla statua in tanti colori', text: 'Cambio di rotta: il nome passa a un bastoncino, il <strong>DIN Condensed Bold</strong>, con la G alta che abbraccia ELATO. La statua prova tutti i colori.' },
        { title: 'L’uccellino', src: 'processo-4.jpg', alt: 'Il logo con un uccellino al posto della statua, in diverse combinazioni di colore', text: 'Al posto della statua arriva un uccellino, più semplice e più simpatico, che si riconosce anche piccolo. Si cercano i colori giusti.' },
        { title: 'Il marchio', src: 'processo-5.jpg', alt: 'Il marchio finale: l’uccellino crema e blu accanto a GELATO DI PIAZZA', text: 'L’uccellino crema con l’ala e la zampa blu, la G che contiene GELATO e DI PIAZZA sotto: il marchio finale.' }
      ],
      markTitle: 'Il marchio',
      markText: 'Un uccellino crema e blu accanto a GELATO DI PIAZZA in DIN Condensed Bold: la G alta abbraccia ELATO, DI PIAZZA sta sotto. L’uccellino da solo diventa l’icona, anche in negativo e su nero.',
      buildText: 'Il corpo è un semicerchio, la testa un semicerchio più piccolo, la zampa un rettangolo: poche forme geometriche, contorno uguale ovunque.',
      versions: [
        { key: 'crema', name: 'Classico', bg: '#FFF2CC' },
        { key: 'inv', name: 'Invertito', bg: '#FCFCFC' },
        { key: 'scuro', name: 'Su scuro', bg: '#2A2B2A' }
      ],
      paletteTitle: 'Colori e caratteri',
      colors: [
        { name: 'Crema', hex: '#FFF2CC', rgb: 'R255 G242 B204', use: 'Fondo e corpo dell’uccellino' },
        { name: 'Azzurro', hex: '#5881C1', rgb: 'R88 G129 B193', use: 'Marchio, ala e pulsanti', ink: '#FFF2CC' },
        { name: 'Inchiostro', hex: '#2A2B2A', rgb: 'R42 G43 B42', use: 'Contorni e testi', ink: '#FFF2CC' },
        { name: 'Bianco', hex: '#FCFCFC', rgb: 'R252 G252 B252', use: 'Fondo dei testi del sito' }
      ],
      fonts: [
        { use: 'Marchio e titoli', name: 'DIN Condensed Bold', sample: 'Scopri il nostro sapore artigianale!', cls: 'is-din' },
        { use: 'Testi del sito', name: 'Akzidenz Grotesk CE Roman', sample: 'Gusto autentico, sapori veri e freschezza', cls: 'is-akz' }
      ],
      patternTitle: 'Il pattern',
      patternText: 'L’uccellino si ripete inclinato su fondo azzurro e diventa il pattern di coppette e grembiule. Passaci sopra: si girano a guardarti. Cliccane uno e saltella.',
      siteTitle: 'Il sito',
      siteText: 'La home: logo e social in alto, il menu, lo slider dei banner con la colata di gelato, poi il benvenuto con l’orario e il pulsante per prenotare. Lo slider qui sotto funziona: prova le frecce.',
      menu: ['HOME', 'GELATI', 'CONSEGNA A DOMICILIO', 'CONTATTI'],
      banners: [
        { src: 'banner-1.jpg', alt: 'Banner: Gelato artigianale, benvenuti nel cuore del gusto autentico di Sesto' },
        { src: 'banner-2.jpg', alt: 'Banner: Produzione propria a casa tua, consegne dei gelati artigianali in vaschette apposite' },
        { src: 'banner-3.jpg', alt: 'Banner: Contattaci, siamo disponibili, tramite la scheda Contatti del sito' }
      ],
      siteBoxTitle: 'Scopri il nostro sapore artigianale!',
      siteBoxText: 'Benvenuti nel cuore del <strong>gusto autentico</strong> a Sesto Fiorentino. Ogni nostro gelato artigianale è un viaggio nei <strong>sapori veri</strong>, preparato con passione e ingredienti selezionati. Lasciati conquistare dalla cremosità e dalla <strong>freschezza</strong> che solo la vera tradizione sa offrire.',
      siteHours: 'Orario: 9:00 - 18:30 Tutti i giorni',
      compareTitle: 'Dal wireframe al mockup'
    }
  },
  {
    id: 'r-19',
    code: 'R-19 // EDITORIAL-MAO',
    title: 'MAO — MUSEO D’ARTE ORIENTALE',
    category: 'Editorial Design',
    year: '2026',
    shapeName: 'Red Square',
    colorHex: '#DB3332',
    capsuleColor: 'red',
    style: 'Zen & Tipografico',
    palette: ['#DB3332', '#F5F4EE', '#000000'],
    software: ['Adobe InDesign', 'Adobe Photoshop'],
    stack: ['Adobe InDesign', 'Adobe Photoshop', 'Catalogo', 'Griglia modulare', 'Campagna OOH', 'Social Media'],
    description: 'Il catalogo delle collezioni permanenti del MAO, il Museo d’Arte Orientale di Torino, e la campagna che lo porta in città: affissioni, totem, manifesti, un pieghevole a tre ante e i post per Instagram.',
    details: 'Il progetto parte dall’identità del museo e da un approccio decoloniale (#MAOtempopresente). La sobrietà di Palazzo Mazzonis incontra il rigore tipografico occidentale e la materia delle opere asiatiche: una gabbia modulare 7 × 5 nata dall’interlinea, molto spazio bianco, il Rosso “MAO” e il Kongo Rikishi, il guardiano dei templi, come figura di benvenuto su ogni supporto.',
    coverImage: 'assets/projects/mao-torino/cover.jpg?v=2',
    capsuleImage: 'assets/projects/mao-torino/capsule.png',
    gallery: {
      layout: 'mao',
      base: 'assets/projects/mao-torino/',
      pages: 36,
      kicker: 'Catalogo e campagna · Palazzo Mazzonis, Torino',
      lead: 'Un catalogo per le collezioni permanenti del Museo d’Arte Orientale e una campagna che lo porta in città, dal totem all’ingresso ai post su Instagram.',
      facts: [
        { k: 'Formato', v: '25 × 35 cm' },
        { k: 'Facciate', v: '36' },
        { k: 'Gallerie', v: '5' }
      ],
      conceptTitle: 'Il concept',
      conceptText: [
        'Il progetto traduce l’identità del MAO superando la visione orientalista, a favore di un approccio <strong>decoloniale, partecipativo e aperto al presente</strong> (#MAOtempopresente).',
        'La memoria storica e sobria di Palazzo Mazzonis incontra il rigore tipografico occidentale e la materia delle opere asiatiche. A guidare ogni scelta ci sono quattro principi della cultura giapponese: <strong>和敬清寂</strong>.'
      ],
      principles: [
        { jp: 'Wa', it: 'Armonia', text: 'La ricerca dell’equilibrio diventa la <strong>gabbia modulare 7 × 5</strong>, ricavata dall’interlinea di 11,5 pt e agganciata alla baseline grid: un dialogo proporzionato tra tipografia, margini e architettura del palazzo.' },
        { jp: 'Kei', it: 'Rispetto', text: 'Un approccio non eurocentrico, che rispetta l’identità delle opere. Ogni reperto è <strong>scontornato in Photoshop</strong>, con tracciati e canale alfa, e posato sul fondo color carta di riso.' },
        { jp: 'Sei', it: 'Purezza', text: 'Nessun elemento superfluo. La gerarchia nasce dal contrasto armonico tra il <strong>Rotis</strong>, che riprende il marchio del museo, e il <strong>Gill Sans</strong> dei testi continui.' },
        { jp: 'Jaku', it: 'Quiete', text: 'Il ritmo disteso delle pagine richiama i <strong>giardini zen</strong> del museo: grandi bianchi ai margini e una palette misurata, per una lettura contemplativa.' }
      ],
      gridTitle: 'La gabbia',
      gridText: [
        'L’impaginato nasce <strong>dal basso</strong>: la griglia viene dal ritmo del testo. Ogni modulo quadrato contiene esattamente 7 righe da 11,5 pt e i moduli sono separati da un’interlinea.',
        'Il canone di Van de Graaf fissa i margini. Per leggere si uniscono 2 o 3 moduli, mentre i margini ampi ospitano didascalie e opere a tutta pagina. Le stesse regole, semplificate, impaginano anche i materiali per la città.'
      ],
      gridNumbers: [
        { v: '7 × 5', k: 'moduli per pagina' },
        { v: '11,5 pt', k: 'interlinea di base' },
        { v: '7', k: 'righe per modulo' },
        { v: '1', k: 'interlinea tra i moduli' }
      ],
      bookTitle: 'Il catalogo',
      bookText: '36 facciate che attraversano le cinque gallerie permanenti del MAO. Sfoglialo: clicca sulle pagine, usa le frecce o salta a un capitolo.',
      chapters: [
        { page: 4, title: 'Introduzione' },
        { page: 8, title: 'Gandhāra, India e Sud-est asiatico' },
        { page: 16, title: 'Cina' },
        { page: 22, title: 'Himalaya' },
        { page: 26, title: 'Giappone' },
        { page: 30, title: 'Arte islamica' }
      ],
      colorsTitle: 'Il colore',
      colors: [
        { name: 'Rosso “MAO”', hex: '#DB3332', cmyk: 'C10 M95 Y90 K0', note: 'Il colore d’accento: identitario sia per il marchio del museo sia per i paesi in mostra.', ink: '#FFFFFF', weight: 2.2 },
        { name: 'Bianco Riso', hex: '#F5F4EE', cmyk: 'C3 M2 Y5 K0', note: 'Il fondo delle pagine.', ink: '#111111', weight: 1.4 },
        { name: 'Nero', hex: '#000000', cmyk: 'C75 M68 Y67 K90', note: 'Il colore del testo.', ink: '#F5F4EE', weight: 1 }
      ],
      typeTitle: 'Tipografia',
      fonts: [
        { name: 'Gill Sans', sample: 'MAO — Museo d’Arte Orientale', note: 'Versatile: la maggior parte dei titoli e tutti i testi. Fa già parte delle linee guida di comunicazione del MAO.' },
        { name: 'Rotis Semi Serif', sample: 'il museo<br>le opere<br>l’idea', note: 'Il carattere della scritta “museo d’arte orientale” nel logo, ripreso in alcune titolazioni per continuità visiva.' }
      ],
      oohTitle: 'Fuori dal museo',
      oohText: 'Nei templi i Kongō-rikishi sono i guardiani che accolgono chi entra. Qui il Kongo Rikishi diventa la figura di benvenuto: a cavallo tra il fondo riso e la fascia rossa rompe la griglia, dà profondità e rende riconoscibile ogni supporto.',
      poster: {
        src: 'mockup-manifesto.jpg', ratio: 812 / 1210, kind: 'MANIFESTO', title: 'Il manifesto',
        text: 'In alto il logo, accanto il titolo “viaggio culturale nell’Asia” e, a cavallo della fascia rossa, il Kongo Rikishi; in basso i kanji e gli orari delle collezioni permanenti.',
        alt: 'Il manifesto del MAO incorniciato in una sala: logo, Kongo Rikishi sulla fascia rossa e il titolo viaggio culturale nell’Asia'
      },
      totem: {
        src: 'mockup-totem.jpg', ratio: 754 / 1700, kind: 'TOTEM', title: 'Il totem',
        text: 'La stessa composizione in verticale: il Kongo Rikishi a figura intera accoglie chi passa, come i guardiani all’ingresso dei templi.',
        alt: 'Il totem del MAO in una piazza, con il Kongo Rikishi a figura intera'
      },
      insta: {
        src: 'mockup-instagram.jpg', ratio: 2600 / 1706, kind: 'INSTAGRAM', title: 'Quattro post, uno per sezione',
        text: 'Quattro post separati: tre raccontano una sezione della mostra, il quarto riprende la grafica della campagna con il Kongo Rikishi. Scegli un post per guardarlo da vicino.',
        alt: 'I quattro post Instagram del MAO su fondo rosa, accanto a uno smartphone con il post sul Giappone',
        posts: [
          { name: 'Kongo Rikishi', x: 9, y: 44, w: 22, h: 46 },
          { name: 'Giappone', x: 14, y: 0, w: 22, h: 45 },
          { name: 'Gandhāra, India e Sudest asiatico', x: 34, y: 4, w: 22, h: 46 },
          { name: 'Cina', x: 29, y: 48, w: 23, h: 44 },
          { name: 'Sullo smartphone', x: 54, y: 9, w: 35, h: 91 }
        ]
      },
      ooh: [
        { src: 'mockup-affissione.jpg', ratio: 1700 / 1506, kind: 'AFFISSIONE', title: 'Il banner in città', alt: 'Il banner del MAO su un ponteggio in una via di Torino, con la Mole sullo sfondo' },
        { src: 'mockup-tre-ante.jpg', ratio: 1700 / 1486, kind: 'PIEGHEVOLE', title: 'Il tre ante', alt: 'Il pieghevole a tre ante chiuso' },
        { src: 'mockup-tre-ante-interno.jpg', ratio: 1700 / 1660, kind: 'PIEGHEVOLE', title: 'L’interno', alt: 'L’interno del pieghevole a tre ante' },
        { src: 'mockup-catalogo-aperto.jpg', ratio: 1700 / 1098, kind: 'CATALOGO', title: 'Aperto sul tavolo', alt: 'Il catalogo del MAO aperto' }
      ]
    }
  },
  {
    id: 'r-18',
    code: 'R-18 // EDITORIAL-DECODER',
    title: 'DECODER',
    category: 'Editorial Design',
    year: '2026',
    shapeName: 'Glitch Cube',
    colorHex: '#E53232',
    capsuleColor: 'black',
    style: 'Punk & Duotono',
    palette: ['#1C1C1C', '#E53232', '#FBFBFB', '#4871B4', '#BBCE19'],
    software: ['Adobe InDesign', 'Adobe Photoshop'],
    stack: ['Adobe InDesign', 'Adobe Photoshop', 'Rivista', 'Duotono', 'Tipografia sperimentale'],
    description: 'Una rivista di 32 pagine sul cyberpunk nella cultura moderna: dalla rivista italiana Decoder a Blade Runner, Akira, Ghost in the Shell, Cyberpunk 2077, Marathon, Neuromante e i Nine Inch Nails.',
    details: 'Fondo nero, immagini ridotte a due toni e una tinta diversa per ogni opera, come segnali su uno schermo. I titoli sono condensati e pesantissimi, i testi in un carattere largo e tecnico; le colonne si spezzano, il testo si sgretola in pixel e le pagine giocano con il glitch. Il nome viene dalle teorie di Burroughs: decodificare il linguaggio del potere per sovvertirlo.',
    coverImage: 'assets/projects/decoder/cover.jpg',
    coverFocusY: 0,
    capsuleImage: 'assets/projects/decoder/capsule.png',
    gallery: {
      layout: 'decoder',
      base: 'assets/projects/decoder/',
      pages: 32,
      stamp: 'Rivista // 32 pagine // stampa',
      subtitle: 'il cyberpunk nella cultura moderna',
      lead: 'Il cyberpunk non come semplice fantascienza, ma come strumento per leggere il presente: dalla scena italiana nata attorno alla rivista Decoder ai film, ai videogiochi e alla musica che ne hanno fatto un immaginario.',
      indexTitle: 'Indice',
      index: [
        { t: 'Il cyberpunk', p: 4, c: '#F2EEE3' },
        { t: 'Decoder', p: 7, c: '#E53232' },
        { t: 'Media principali', p: 10, c: '#F08FC0' },
        { t: 'Blade Runner', p: 14, c: '#4871B4' },
        { t: 'Ghost in the Shell', p: 18, c: '#E9702F' },
        { t: 'Cyberpunk 2077', p: 20, c: '#E6E13A' },
        { t: 'Marathon', p: 24, c: '#BBCE19' },
        { t: 'Neuromante', p: 26, c: '#B0449C' },
        { t: 'Nine Inch Nails', p: 28, c: '#2E9A55' }
      ],
      readerTitle: 'Sfoglia la rivista',
      decTitle: 'Decoder',
      decText: [
        'Il nome della rivista non è casuale: deriva direttamente dalle teorie sulla comunicazione di William S. Burroughs, lo scrittore americano che più di ogni altro aveva trasformato il linguaggio in un campo di battaglia politico. Per Burroughs, il linguaggio non è uno strumento neutro — è un sistema di controllo, un codice imposto dal potere per plasmare la realtà e il pensiero. Decodificare significa allora smontare quel codice, leggerlo controcorrente, sovvertirlo.',
        'La rivista raccoglieva questa eredità e la applicava al presente: di fronte a un mondo sempre più dominato da tecnologie opache, media controllati e sistemi economici incomprensibili ai più, Decoder si proponeva come strumento critico per leggere ciò che stava dietro la superficie. Non si trattava solo di capire la realtà, ma di modificarla — restituendo ai lettori gli strumenti per decifrare, e quindi per agire.',
        'Il titolo era insomma un programma: un invito a non accettare passivamente i codici del potere, ma a imparare a smontarli.'
      ],
      decCaption: '“Decoder” Film del 1984 è un film che trae spunto dalle idee di Burroughs',
      decChannel: 84,
      dotsTitle: 'Sapevi che...',
      dotsText: [
        'Ogni volta che stampi un documento a colori, potresti star lasciando una firma invisibile sul foglio. Si chiamano Printer Tracking Dots, o Machine Identification Code, e sono micropunti gialli stampati in pattern precisi dalla maggior parte delle stampanti laser a colori. Invisibili a occhio nudo, diventano visibili sotto luce blu o ultravioletta e codificano informazioni come il numero seriale della stampante e la data e l’ora esatte della stampa.',
        'Il sistema fu sviluppato negli anni ‘80 da Xerox e altri produttori in accordo con diversi governi occidentali, con l’obiettivo dichiarato di contrastare la contraffazione. Per vent’anni rimase nell’ombra, senza che nessun produttore lo comunicasse ai propri utenti. Nel 2004 la Electronic Frontier Foundation lo rese pubblico, decodificando il pattern usato da Xerox. Non è teoria: nel 2017 una contractor della NSA, Reality Winner, fu identificata e arrestata dopo aver fatto trapelare documenti classificati alla stampa. Gli investigatori risalirono a lei proprio attraverso i micropunti sul foglio stampato.',
        'La carta non è anonima. E la tecnologia che usi ogni giorno sa più cose di te di quanto immagini.'
      ],
      dotsSheet: 'La carta non è anonima.',
      worksTitle: 'Un’opera, uno stile',
      worksText: 'Nella rivista ogni opera ha il suo colore, i suoi caratteri e le sue immagini ridotte a due toni. Scegline una.',
      works: [
        { key: 'akira', title: 'Akira', kicker: 'Manga 1982 // Film 1988', pages: [12, 13], c: '#D22629', img: 'ed-akira.jpg', ar: 0.713, quote: 'Le corporazioni e i governi non proteggono i cittadini, li usano.' },
        { key: 'blade', title: 'Blade Runner', kicker: 'Film // 1982', pages: [14, 17], c: '#4871B4', img: 'ed-blade.jpg', ar: 0.713, img2: 'ed-lacrime.jpg', ar2: 0.713, quote: 'Chi può se ne va. Chi resta è quello che rimane quando il progresso decide di andare avanti senza di te.' },
        { key: 'ghost', title: 'Ghost in the Shell', kicker: 'Manga // 1989', pages: [18, 19], c: '#E9702F', img: 'ed-ghost.jpg', ar: 0.713, quote: 'Un’opera che non si accontenta di raccontare il futuro, vuole capirlo dall’interno, smontarlo pezzo per pezzo e vedere cosa rimane.' },
        { key: 'cp', title: 'Cyberpunk 2077', kicker: 'Videogioco // 2020', pages: [20, 22], c: '#E6E13A', img: 'ed-v2077.jpg', ar: 0.715, img2: 'ed-arasaka.jpg', ar2: 0.991, quote: 'Night City non è un posto dove si vince. È un posto dove si sopravvive, se si è fortunati.' },
        { key: 'johnny', title: 'Johnny Silverhand', kicker: 'Rockstar // terrorista // fantasma digitale', pages: [23, 23], c: '#EEEB95', img: 'ed-johnny.jpg', ar: 0.716, img2: 'ed-johnny-foto.jpg', ar2: 2.857, quote: 'Un uomo che ha combattuto le corporazioni con una chitarra e con le bombe.' },
        { key: 'marathon', title: 'Marathon', kicker: 'Videogioco // Bungie', pages: [24, 25], c: '#BBCE19', img: 'ed-marathon.jpg', ar: 1.582, quote: 'Corpo sostituito, identità in bilico, sistemi di controllo opachi: è la grammatica classica del genere.' },
        { key: 'neuro', title: 'Neuromante', kicker: 'Romanzo // 1984', pages: [26, 27], c: '#B0449C', img: 'ed-sprawl.jpg', ar: 0.713, quote: 'Gibson inventa in queste pagine il concetto di cyberspazio, definendolo come una allucinazione condivisa da milioni di utenti.' },
        { key: 'nin', title: 'Nine Inch Nails', kicker: 'Musica // dal 1989', pages: [28, 29], c: '#2E9A55', img: 'ed-nin.jpg', ar: 1.794, quote: 'Una macchina che soffre, un uomo che si trasforma in qualcosa di diverso e non sa se esserne sollevato o terrorizzato.' }
      ],
      outroWords: ['No', 'Future'],
      outroText: 'Il motto punk era “No Future”. Sulle pagine di Decoder il cyberpunk arriva in Italia con la voglia di affrontare quel futuro temuto e di usarlo per leggere il presente.'
    }
  },
  {
    id: 'r-17',
    code: 'R-17 // EDITORIAL-MODARTECH',
    title: 'MODARTECH — FOTOGRAFIA',
    category: 'Editorial Design',
    year: '2026',
    shapeName: 'Soft Prism',
    colorHex: '#F9CCAD',
    capsuleColor: 'pink',
    style: 'Fashion & Pastello',
    palette: ['#F9CCAD', '#F8D7E7', '#D3EAE5', '#DEECD7', '#B9392D', '#2A2828'],
    software: ['Adobe InDesign', 'Adobe Photoshop'],
    stack: ['Adobe InDesign', 'Adobe Photoshop', 'Magazine', 'Fotografia', 'Ritratto', 'Fashion'],
    description: 'Un magazine di fotografia di 82 pagine: i maestri della moda (Erwin Blumenfeld, Paolo Roversi, Peter Lindbergh), l’intelligenza artificiale, il ritratto e i servizi fotografici del corso, dagli schemi di luce a una campagna per un laboratorio di cappelli.',
    details: 'Ogni sezione ha il suo colore pastello: pesca, rosa, menta e salvia. I titoli sono in un condensato dal sapore editoriale, i testi in un serif elegante; barre rosse, triangoli e forme spezzate muovono le pagine, mentre le foto restano protagoniste, a piena pagina o accostate come in un provino.',
    coverImage: 'assets/projects/modartech/cover.jpg',
    coverFocusY: 0,
    capsuleImage: 'assets/projects/modartech/capsule.png',
    gallery: {
      layout: 'modartech',
      base: 'assets/projects/modartech/',
      pages: 82,
      kicker: 'Magazine di fotografia',
      lead: 'Dai maestri della fotografia di moda ai servizi fatti in studio e per strada: un magazine che racconta la luce, il volto e lo sguardo.',
      contentsTitle: 'Contenuti',
      contents: [
        { t: 'Erwin Blumenfeld', p: 4 },
        { t: 'Intelligenza artificiale', p: 16 },
        { t: 'Il ritratto', p: 22 },
        { t: 'Schemi di illuminazione', p: 26 },
        { t: 'Fotografia di moda', p: 34 },
        { t: 'Paolo Roversi', p: 42 },
        { t: 'Peter Lindbergh', p: 54 },
        { t: 'Sena | Cappelli', p: 64 },
        { t: 'Viaggio | Vastità | Proporzione', p: 74 }
      ],
      lightTitle: 'Schemi di illuminazione',
      lightText: 'Sei modi di illuminare un volto, fotografati in studio. Scegli uno schema: cambia la foto e la luce si sposta nello schema visto dall’alto.',
      lights: [
        { name: 'Frontale', src: 'luce-frontale.jpg', x: 14, y: 64, text: 'La luce colpisce il soggetto dalla direzione della fotocamera: quasi nessuna ombra e volumi appiattiti. Massima visibilità dei dettagli, meno tridimensionalità del volto.' },
        { name: 'Rembrandt', src: 'luce-rembrandt.jpg', x: -52, y: 46, text: 'Ispirato al pittore e molto usato nella calotipia dell’Ottocento: un piccolo triangolo di luce sulla guancia in ombra. Drammatico e profondo, con un forte contrasto tra luci e ombre.' },
        { name: 'Laterale', src: 'luce-laterale.jpg', x: -72, y: 0, text: 'La fonte è a 90 gradi rispetto al soggetto: metà volto illuminata, metà al buio. Esalta la texture della pelle e dà un’aria misteriosa al ritratto.' },
        { name: 'Butterfly', src: 'luce-butterfly.jpg', x: 0, y: 40, high: true, text: 'La luce arriva dall’alto, davanti al soggetto, e sotto il naso disegna un’ombra a forma di farfalla. Un classico del glamour: scolpisce gli zigomi e addolcisce i lineamenti.' },
        { name: 'Riflessi', src: 'luce-riflessi.jpg', x: -56, y: 38, reflector: true, text: 'Non è una fonte diretta: la luce principale rimbalza su una superficie riflettente verso le zone d’ombra. Ammorbidisce il contrasto e recupera i dettagli nelle parti scure.' },
        { name: 'Backlight', src: 'luce-backlight.jpg', x: 0, y: -66, text: 'La fonte è dietro il soggetto: disegna la sagoma con un alone (rim light) o crea una silhouette. Stacca la figura dallo sfondo e aggiunge profondità.' }
      ],
      aiTitle: 'Originale o AI?',
      aiText: [
        'Riccardo Falcinelli si chiede cosa succede al volto quando a generarlo è un’intelligenza artificiale: ricreare le persone rischia un torto non solo morale, ma anche <strong>culturale</strong>, verso la loro memoria.',
        'Le foto originali accanto alle versioni rifatte con un’AI generativa: gli stessi volti, una scena che non è mai esistita. Trascina la linea per confrontarle.'
      ],
      aiPairs: [
        { a: 'ai-originale-1.jpg', b: 'ai-generata-1.jpg', ratio: 2181 / 1351 },
        { a: 'ai-originale-2.jpg', b: 'ai-generata-2.jpg', ratio: 2000 / 1449 }
      ],
      portraitTitle: 'Nuove prospettive',
      portraitText: 'Tre luoghi, tre servizi di ritratto: le aule, Crastan e il parco.',
      portraitSets: [
        { name: 'Aule', imgs: ['ritratto-aule-1.jpg', 'ritratto-aule-2.jpg', 'ritratto-aule-3.jpg'] },
        { name: 'Crastan', imgs: ['ritratto-crastan-1.jpg', 'ritratto-crastan-2.jpg', 'ritratto-crastan-3.jpg'] },
        { name: 'Parco', imgs: ['ritratto-parco-1.jpg', 'ritratto-parco-2.jpg', 'ritratto-parco-3.jpg'] }
      ],
      senaTitle: '#MADEINSENA',
      senaText: 'Una campagna per Sena, artigiani del cappello: le persone, le mani e gli strumenti del laboratorio, con il marchio e l’hashtag sopra le foto.',
      sena: ['sena-33.jpg', 'sena-34.jpg', 'sena-35.jpg', 'sena-36.jpg', 'sena-37.jpg'],
      travelTitle: 'Viaggio | Vastità | Proporzione',
      travelText: 'Il magazine si chiude in montagna: tre parole, tre doppie pagine, le foto scattate in viaggio.',
      travel: [
        {
          word: 'Viaggio',
          pages: [74, 75],
          text: 'Il viaggio non è una vacanza; è un atto di sabotaggio contro l’abitudine. In un mondo che ci vuole immobili davanti a uno schermo, spostare il corpo nello spazio diventa un gesto rivoluzionario. Viaggiare significa cercare l’attrito: il fastidio di una lingua che non mastichiamo, il peso di uno zaino, l’imprevisto di un treno perso. È in quell’attrito che la nostra identità, solitamente pigra e statica, viene levigata come un sasso dal fiume. Viaggiamo non per aggiungere timbri sul passaporto, ma per sottrarre pregiudizi alla mente. Il vero viaggiatore non è chi cerca nuovi paesaggi, ma chi accetta di tornare a casa con occhi che non riconoscono più i vecchi mobili.',
          imgs: [{ src: 'viaggio-1.jpg', alt: 'Un lago di montagna tra i boschi di abeti, sotto un cielo di nuvole' }]
        },
        {
          word: 'Vastità',
          pages: [76, 77],
          text: 'Esiste una forma di vertigine benefica che ci assale quando l’orizzonte smette di avere confini visibili. La vastità è lo specchio in cui la nostra arroganza si frantuma. Che sia il blu cobalto dell’oceano o il vuoto pneumatico tra le stelle, la vastità ci ricorda che siamo ospiti, non padroni. In questa immensità, il tempo rallenta e le nostre “urgenze” quotidiane rivelano la loro natura di sussurri nel vento. Abitare la vastità significa imparare la lingua dell’umiltà: accettare che non tutto può essere misurato, mappato o posseduto. È il luogo dove finisce il controllo e inizia, finalmente, la meraviglia.',
          imgs: [
            { src: 'viaggio-3.jpg', alt: 'Una cima rosata dal sole sopra la nebbia e i tetti del paese' },
            { src: 'viaggio-2.jpg', alt: 'Una casa tra gli alberi, con le montagne sullo sfondo' }
          ]
        },
        {
          word: 'Proporzione',
          pages: [78, 79],
          text: 'Le barche sul lago, i tetti delle case: tutto si fa piccolo sotto le pareti di roccia.',
          imgs: [
            { src: 'viaggio-4.jpg', alt: 'Barche ormeggiate su un lago verde, sotto una parete di roccia' },
            { src: 'viaggio-5.jpg', alt: 'Il tetto di una casa di legno davanti a una valle nella nebbia' }
          ]
        }
      ]
    }
  },
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
    coverImage: 'assets/projects/teatro-ablondi/cover.jpg?v=2',
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
