# designjack // Canale [R] — Prototipo Interattivo Cyber-Bauhaus & CRT

Prototipo interattivo completo per la sezione principale (**Canale R**) del portfolio di **Jacopo (designjack)**, Communication & Digital Designer. 

Il sito unisce estetica cyber-informatica, rigore costruttivista Bauhaus, filtri a monitor **CRT**, **Geometria Sferica 3D** nella Hero, il sistema con **fogli appesi al filo con fisica pendolare**, effetto di **dithering con smolecolamento di pixel rossi** al passaggio del cursore e una **Toy Candy Claw Machine 3D standalone** (ispirata alla classica candy grabber da tavolo) con 42 caramelle metalliche riflettenti, leve ball-top e capsule Gashapon apribili.

---

## 🕹️ Novità & Funzionalità Implementate

### 1. Hero Section con Avatar 3D Low-Poly
- Nella hero, senza finestra, c'è la **testa low-poly di Jacopo** (`js/heroAvatar.js`): il ritratto `assets/avatar/jacopo-avatar.png` è montato come texture su un rilievo 3D (cranio, viso, naso, orbite), quindi ruota con parallasse vera.
- Fluttua, gira verso il cursore, sbatte le palpebre; **trascinala** per girarla (torna frontale a molla), **cliccala** per farla parlare (fumetto pixel-art, bip, bocca animata). Frasi in `MESSAGES`.
- **Avatar pilota** (`js/avatarPilot.js`): scrollando oltre la hero vola in basso a sinistra e commenta ciò su cui passi il cursore (mappa `COMMENTS`, oppure attributo `data-avatar-say="..."` su qualsiasi elemento). Passandoci sopra compare una **X** che lo rimanda al suo posto nella hero; tornando in cima alla pagina si riattiva e al prossimo scroll si riaggancia.
- **Una casa per canale** (`data-avatar-home` in `index.html`): in R sta nella hero, in G accanto al manifesto (stesso comportamento: si aggancia scrollando, la X lo rimanda a casa), in B è **intrappolato in una delle bolle che salgono su tutta la pagina**, dal fondale al cielo (più grande delle altre, sale lenta e quando esce dallo schermo rientra dal basso): cliccandola scoppia, lui ringrazia e va in basso a sinistra; la X lo rimette nella bolla. Frasi e saluti per canale in `MESSAGES` / `GREETING` di `js/avatarPilot.js`.
- **Filtro CRT pixelato** leggero sulla testa (render a metà risoluzione + scanline + maschera RGB), senza tinte di colore in tutti i canali (`setTint` in `js/heroAvatar.js`).
- Versioni precedenti: `archive/heroSphere.js` (sfera) e `archive/heroAvatar-procedurale.js` (testa procedurale).

### 2. "Mostra Intero Catalogo" — Fogli Appesi al Filo con Fisica
- Cliccando sul pulsante **`[ ⤢ MOSTRA INTERO CATALOGO // APRI FILO DA STUDIO ]`**:
  - Compare un cavo in acciaio orizzontale teso con tenditori laterali.
  - Da sinistra a destra scorrono i **fogli di progetto editoriali (stampati riso/proof)** appesi con mollette al filo.
  - **Fisica Pendolare Reale:** durante la corsa e l'arresto, i fogli oscillano avanti e indietro con inerzia, attrito e naturale flessione del cavo (*catenary sag*).
  - **Interazione al mouse (Hover):** passando il cursore sopra un foglio, questo si solleva verso lo spettatore (`scale: 1.14`, rotazione in avanti, ombra profonda e svelamento dei dettagli) accompagnato dal suono di fruscio di carta e vibrazione del cavo (`playPaperFlutter()`, `playCableTwang()`).
  - **Click:** cliccando su qualsiasi foglio appeso si apre direttamente il modal di ispezione del case study!
  - Include pulsanti di scorrimento laterale `[ ◄ SCORRI FILO ]` / `[ SCORRI FILO ► ]` e supporto wheel orizzontale.
- **Catalogo completo a griglia:** riquadri compatti (min 178px, 6 colonne su un portatile, 2 su telefono) così si vedono tutti i progetti insieme. L'avatar resta agganciato in basso a sinistra anche col catalogo aperto (senza la X) e commenta progetti e filtri; alla chiusura torna dov'era (`AvatarPilot.pin()`).
- **Pulsante CATALOGO nella barra in alto:** c'è in R, G e B (`#nav-open-catalog`, qualsiasi elemento con `data-open-catalog` apre il catalogo). La barra è fissa, quindi è sempre visibile; è pieno di colore per staccare dal resto (rosso Bauhaus in R, lime in G, gel acquamarina in B) e ha il numero dei progetti con un piccolo "ping". Su telefono resta l'icona con il numero.
- **Switch R / G / B nel catalogo:** in alto a destra, accanto a "Chiudi". Cambia lo stile di tutto il sito (stessa transizione CRT dei tab) e il catalogo si ridisegna nello stile scelto: carta Bauhaus (R), muro verde con adesivi storti (G), vetro lucido marino (B). Stili in `css/catalog-ui.css`; l'avatar resta agganciato anche dopo il cambio.
- **Niente flicker nel catalogo:** il catalogo ha un fondo pieno senza `backdrop-filter`, e mentre è aperto il sito sotto è nascosto (`body.catalog-open`), quindi non può più comparire dietro. Chiudendo una scheda aperta dal catalogo la pagina resta bloccata (`modal-open` resta finché il catalogo è aperto).
- **Chiusura delle finestre:** cerchio, triangolo e quadrato restano solo sulle finestre principali del canale R (Chi sono, Progetti su filo, Toy Claw Machine). Scheda progetto e capsula si chiudono con una **X in overlay** in alto a destra (`.modal-x`), nello stile del canale attivo, oltre che con Esc.

### 3. Catalogo Progetti Espandibile (6 Categorie & Dither Smolecola Rosso)
- Suddiviso nelle 6 categorie ufficiali:
  1. `Graphic Design`
  2. `Interaction Design`
  3. `Editorial Design`
  4. `Web Design`
  5. `Brand Design`
  6. `Personal Projects`
- **Dithering con Smolecolamento in Pixel Rossi:** al passaggio del mouse su ciascuna scheda, l'artwork si ditherizza a matrice di Bayer e si **"smolecola"** in una scia di particelle pixel rosse fluorescenti con moto parabolico e dissolvenza.
- Tasto di espansione griglia per visualizzare l'intero catalogo o tornare alla vista curata.

### Progetti con pagina completa
I progetti con `gallery` in `js/projects.js` mostrano asset reali nella pagina progetto (`renderProjectGallery` in `js/modal.js`). Sezioni opzionali, numerate in automatico: `poster`, `moodboard`, `sketches` (bozze), `illustrations`, `concept.slides` (slide della presentazione), `mockups` (con `kind`), `download` (link alla presentazione PDF).
- **La Fanciulla del West** (R-13, Graphic Design): manifesto per l'opera di Puccini. Immagini estratte dai PDF in `Progetti/Graphic Design/La Fanciulla del West/` e salvate in `assets/projects/la-fanciulla-del-west/` (poster, moodboard, bozze, slide di concept, due mockup ritagliati dalla slide dei mockup).
- **Echo Sound Festival** (R-06): poster, illustrazioni, mockup.
- **Intestazione uguale per tutti i progetti:** in alto a sinistra i software con la loro icona (`software` del progetto, oppure le voci dello `stack` che hanno un'icona in `js/softwareIcons.js`), al centro la palette a quadrati (`palette`, codice HEX solo al passaggio del mouse), a destra lo stile (`style`). In fondo restano le altre voci dello stack come competenze. Il campo `metrics` non viene più mostrato nella scheda.
- **Mockup affiancati:** se ogni mockup ha `ratio` (larghezza/altezza), stanno sulla stessa riga alla stessa altezza e interi, senza ritagli (su telefono vanno uno sotto l'altro).
- **Layout dedicati:** con `gallery.layout` un progetto usa un'impaginazione tutta sua, registrata in `window.PROJECT_LAYOUTS` (la funzione disegna la pagina e restituisce la pulizia, chiamata alla chiusura o al cambio progetto).
  - `champar` (`js/projectChampar.js` + `css/project-champar.css`), per **Campari Champ-AR**: hero con la scatola che sbuca e lo spiritello (sprite girato verso sinistra) che spunta da dietro, storia con gli sprite animati, packaging, showcase, campagna sui telefoni e in fondo il mini gioco endless.
  - **Il gioco:** si parte con il tasto **SALTA** (oppure Spazio o ↑). Lo spiritello lancia le arance, che rotolano da destra a sinistra, e l'eroe (4 frame) le salta. Il record si salva nel browser (`dj-champar-best`). Gira solo quando è in vista.
  - **Asset:** stanno in `assets/projects/campari-champ-ar/`; il font Upheaval TT è in `assets/fonts/`.

### 4. Toy Claw Machine 3D (fisica reale)
- **Motore fisico dedicato** (`js/clawPhysics.js`, 240 Hz, nessuna dipendenza): capsule e palline sono sfere rigide con urti, attrito e rotolamento; l'artiglio è un pendolo appeso al cavo.
- **La presa non è decisa a tavolino:** le tre dita si chiudono finché la capsula non può più spostarsi. Se sei in asse la capsula resta in gabbia, altrimenti scivola via.
- **Luce di mira e mirino a terra:** diventano verdi quando l'artiglio è allineato a una capsula.
- **Scivolo fisico:** la capsula cade davvero nella buca e rotola nella vaschetta `PREMI`, poi si apre la scheda del progetto. Le capsule vinte non tornano in vasca: finite le 12, arriva un nuovo carico.
- **Vista orbitale:** trascina sul vetro per girare attorno alla macchina e giudicare la profondità.
- **Resa** (`js/crane.js`): cabinato rosso/crema/blu, insegna a lampadine, neon Bauhaus sullo sfondo, riflessi da environment map, ombre e bloom HDR (`js/vendor/three-postfx-r128.js`). Se il dispositivo non regge, il bloom si disattiva da solo.
- I dati dei progetti sono in `js/projects.js`.

### 5. Monitor CRT & Transizione Catodica
- Spengimento a riga orizzontale, collasso nel punto di fosforo centrale, scarica flyback e riaccensione a degauss surge tra il preloader e il sito, e quando si selezionano i canali `[ G ]` e `[ B ]`.
- Filtro CRT globale con scanlines, vignettatura scura e telaio con angoli arrotondati.

---

### Tab R / G / B
Al passaggio del mouse sotto ogni lettera compare un box con due parole con la stessa iniziale (anche negli avvisi di cambio canale): **R — Realizzazioni & Ricreazione** (lavori e playground), **G — Germogli & Graffiti** (il lato fuori orario), **B — Bolle & Bottiglie** (contatti e messaggi in bottiglia). Testi in `index.html` (`.channel-tip`), toast in `js/main.js`. Il colore del box segue la lettera (R rosso, G verde, B blu) in ogni sezione; la forma e l’animazione seguono la sezione: in R scende dall’alto come una tendina, in G si compone come un graffito (passata spray, nebulizzato, colatura), in B nasce come una bolla che sale e ondeggia.

### Music player
In alto a destra, sotto la barra, metà disco con la copertina gira incastrato nel bordo dello schermo. In hover (o al tocco su mobile) il disco esce e compare il pannello: brano precedente/successivo, play/pausa, muto e volume, barra di avanzamento cliccabile. Brani e copertina sono in `Musica/` (singoli di Ikigai, grafiche di designjack); l'avatar lo dice quando passi sopra al player. La musica parte appena entri, a volume basso (`DEFAULT_VOLUME` 0.22) e in dissolvenza; se il browser blocca l'audio prima di un'interazione, il brano parte in muto (il disco gira) e il suono arriva al primo clic, tasto o tocco (`AUTOSTART` in `js/musicPlayer.js`). Il pannello si vede solo in hover. Mentre la musica si sente, dal disco escono note che svaniscono, nello stile del canale: in R quadrate rosso/blu/giallo, in G tonde lime che ondeggiano e sfumano come spray, in B dentro bollicine che salgono e scoppiano. Spariscono mentre usi il player, a scheda nascosta, in muto e con "riduci movimento". Volume, brano e pausa sono ricordati nel browser. Stile per canale in `css/music-player.css`.

### Font
Un font principale per canale (variabile `--font-main` in `css/styles.css`): **Jost** in R (geometrico erede del Futura, il carattere del Bauhaus), **Bricolage Grotesque** in G, **Hind** in B (umanista vicino al Frutiger). Eccezioni solo decorative: Sedgwick Ave Display per i graffiti di G e il ciclo di font di "jack" nel preloader.

### 6. Canali G e B: due siti a sé
Quando si passa a G o B la cornice del canale R sparisce (niente scanline CRT, niente carta crema, nav e toast restilizzati); resta solo la transizione CRT come "cambio canale".
- **Canale G — "febi"** (`css/channel-g.css`): organico × graffiti, tutto verde. Muro notturno con blob che respirano, tag spray con colature, adesivi da trascinare, nastro che scorre, manifesto su carta organica e **muro libero** da dipingere con la bomboletta (colori verdi, colature se tieni fermo il tratto). Font: Bricolage Grotesque (Sedgwick Ave Display solo per i graffiti decorativi).
- **Canale B — "Frutiger Marine"** (`css/channel-b.css`): contatti in stile Frutiger Aero oceanico, tutto blu. Cielo con sole e riflessi, onde animate, discesa sott'acqua con raggi di luce, caustiche, bolle che scoppiano e pesci; pannelli di vetro lucido con gocce d’acqua e icone a sfera, email (e tasto copia), **messaggio in bottiglia** (prepara una mail) e il flauto magico; in superficie nastri di luce, bokeh, scintille, titolo riflesso e un delfino lucido che salta tra le onde. Font: Hind.
- Logica di entrambi in `js/channels.js` (le animazioni girano solo con il canale attivo).

---

## 🚀 Avvio Locale

Il server locale è attivo:

```bash
cd /Users/jacob/Desktop/Portfolio
python3 -m http.server 8080
```

Apri nel browser:
👉 **`http://localhost:8080`**

### 🎮 Controlli
- **Claw machine:** `WASD` o `Frecce` per muovere il carrello, `Spazio` o `Invio` per pescare, trascina sul vetro per ruotare la vista; `Esc` chiude i modal. I tasti sono attivi solo quando la macchina è in vista.
- **Fogli al Filo:** Clicca `[ MOSTRA INTERO CATALOGO ]` per srotolare i fogli lungo il cavo con fisica pendolare.

### Prestazioni dello scroll
- **Avatar:** il renderer WebGL dell'avatar non usa l'antialias. La scena passa comunque dal buffer pixelato, quindi non cambia nulla a vista, ma con l'antialias ogni ridimensionamento del canvas (l'avatar che si aggancia o si sgancia scrollando, o la bolla del canale B) costava ~200 ms e dava scatti e lampi. Ora costa 3–10 ms. `onResize` salta anche le chiamate con la stessa misura (il ResizeObserver lo richiamava due volte).
- **Barra in alto:** non ha più il `backdrop-filter`. Lo sfondo era già quasi pieno, ma la sfocatura di ciò che scorre sotto veniva ricalcolata a ogni frame.
- **Misura:** scroll automatico dall'alto in basso, schermo Retina, due passate per canale. Prima: R e G con picchi di 150–250 ms, B intorno ai 30 fps con frame fino a 600 ms. Dopo: 60 fps fissi in tutti e tre i canali.


### Easter egg: Konami code
- **Codice:** ↑ ↑ ↓ ↓ ← → ← → B A da tastiera; su telefono gli stessi swipe seguiti da due tap. `js/konami.js` + `css/easter-egg.css`; si prova anche dalla console con `konamiAlert()`.
- **Cosa succede:** l'avatar si spaventa (`HeroAvatar.surprise()`: salto, sussulto, bocca aperta, niente battito di ciglia). Sopra la testa scatta il punto esclamativo `assets/Immagini/alert.png` e parte il suono `assets/sfx/Metal Gear Solid Alert Sound Effect.mp3`. Poi l'avatar commenta.
- **Ovunque sia l'avatar:** funziona nella hero, agganciato in basso a sinistra o nella bolla del canale B. Se è fuori schermo viene richiamato in basso a sinistra; se è coperto da una scheda aperta il "!" compare al centro.
- **Audio:** il suono rispetta il tasto AUDIO della barra e abbassa la musica per un attimo.
- **Attenzione alle maiuscole:** la cartella si chiama `Immagini` con la I maiuscola. Su un server online le maiuscole contano, quindi se la rinomini va aggiornato `IMG` in `js/konami.js`.

### Claw machine con i progetti veri
- **Quali progetti:** nella vasca ci sono solo i progetti con `capsuleImage` in `js/projects.js`, cioè quelli veri: Campari Champ-AR, La Fanciulla del West ed Echo Sound Festival. Se nessun progetto ha l'immagine, la macchina torna a usarli tutti.
- **Dentro la capsula:** l'immagine (`assets/projects/<progetto>/capsule.png`, quadrata 256 px) è disegnata come un adesivo tondo dietro la plastica colorata. Resta dritta mentre la capsula rotola, così si legge sempre.
- **Colori:** le capsule hanno colori diversi: Campari rossa, Fanciulla gialla, Echo blu.
- **Capsula vinta:** quando si apre (il 3D in `js/modal.js`) esce un gettone tondo con la stessa immagine, che oscilla verso chi guarda, al posto della forma geometrica.
- **Aggiungere un progetto:** salva un ritaglio quadrato come `capsule.png` nella sua cartella e aggiungi `capsuleImage` alla sua voce in `js/projects.js`.
- **Server locale:** l'immagine nella capsula 3D si vede solo aprendo il sito da un server (`http://…`). Aperto come file (`file://`) il browser non permette a WebGL di usare le immagini.


### Progetti di Brand Design: Teatro Salone Ablondi e Melagoccio
Due layout dedicati in `js/projectBrand.js` + `css/project-brand.css` (`gallery.layout: 'ablondi'` e `'melagoccio'`). Ognuno segue le linee guida del suo marchio. Asset in `assets/projects/teatro-ablondi/` e `assets/projects/melagoccio/`, presi da `Progetti/Brand Design/`.

**Teatro Salone Ablondi (R-15)**
- **Apertura:** un sipario di velluto viola si apre e mostra il marchio sotto l'occhio di bue.
- **Il simbolo:** dalle prime variazioni alla versione finale.
- **Costruzione:** il marchio è ridisegnato con le guide e le proporzioni delle linee guida (ABLONDI = 2,42 × TEATRO SALONE; y = 2,546 × x).
- **Palette:** quattro colori con il marchio su ognuno; passandoci sopra il riquadro si allarga.
- **Tipografia:** Montserrat Regular e Radlush SemiBold.
- **Applicazioni:** le magliette.
- **Asset:** il simbolo è in quattro SVG senza scritte (`simbolo-black/viola/bianco/crema.svg`); TEATRO SALONE e ABLONDI sono scritti in HTML con i font veri. Montserrat arriva da Google Fonts, Radlush da `assets/fonts/Radlush-SemiBold.ttf`.

**Melagoccio (R-16)**
- **Apertura:** su sfondo menta con le scritte ripetute delle figurine, il logo ondeggia; sotto scorre la striscia "ONE SHOT ✦ ONE SPIKE".
- **Il brand:** palette a bollini e la mascotte.
- **La felpa:** si gira con un clic tra fronte e retro (fa un giro da sola la prima volta che compare).
- **Le figurine:** i quattro giocatori distribuiti a ventaglio come un mazzo.
- **Social:** il banner di Instagram si compone dai suoi tre post.
- **Font:** i titoli usano BLOCKY, il font originale del brand (`assets/fonts/blocky.ttf`, lo stesso delle figurine); i testi Rubik (Google Fonts). Il banner di Instagram è ripulito: senza barra dell’app, righe tra i post e puntine, e i tre pezzi a fine animazione combaciano senza spazi.

**Copertine e capsule:** entrambi hanno `coverImage` (catalogo e filo) e `capsuleImage`, quindi sono anche nella claw machine (capsula viola e verde).

### Pagine progetto: parte introduttiva nello stile del canale
- **Parte iniziale:** titolo, software / palette / stile, Panoramica e Progettazione sono dentro `.project-intro` e seguono lo stile del canale attivo (`css/project-page.css`): carta Bauhaus in R, muro verde con adesivi in G, cielo e vetro lucido in B. Panoramica e Progettazione sono due schede. Dal primo blocco del progetto in poi la pagina prende lo stile del brand (layout dedicati).
- **Solo progetti veri:** nel registro restano solo i progetti reali: Melagoccio, Teatro Salone Ablondi, Campari Champ-AR, La Fanciulla del West ed Echo Sound Festival. I filtri del catalogo senza progetti si nascondono da soli. Una copia del vecchio registro con i segnaposto è salvata fuori dal progetto.

### Echo Sound Festival: pagina dedicata
`gallery.layout: 'echo'` (`js/projectBrand.js` + `css/project-echo.css`), stile pop psichedelico del poster. Titoli in Super Earthly (`assets/fonts/super-earthly.ttf`), il font installato più vicino alle lettere del poster.
1. **Apertura:** anelli gialli e rosa che pulsano, il poster con due illustrazioni attaccate come adesivi.
2. **Il poster:** fondo menta a griglia, palette a bollini.
3. **Le illustrazioni:** a zig-zag, ognuna sul fondo che ha nel poster.
4. **I mockup:** in fondo, come chiedevano le istruzioni.

### Canale B e catalogo in G e B
- **Canale B:** le caustiche dell'acqua non sono più una texture ripetuta a piastrelle. Sono macchie di luce morbide, grandi quanto la sezione, che vagano piano.
- **Catalogo B:** sfumatura unica dal cielo all'abisso, raggi di luce, riflessi, un'onda sotto i filtri e bolle che salgono (solo a catalogo aperto); i riquadri sono bolle di vetro.
- **Catalogo G:** macchie di spray sul muro, la tag "febi" gigante, colature lime sotto i filtri, riquadri attaccati con il nastro e titoli a pennarello.
- **Livello comune:** le decorazioni stanno in `.catalog-deco`, dietro la griglia.

### Telefono
- **Progetti su filo:** su schermi stretti i fogli si rimpiccioliscono (scala 0,58 sotto i 520 px, 0,74 sotto gli 820) e l'area si accorcia. Su telefono si vedono un foglio e mezzo invece di mezzo.
- **Claw machine:** sotto i 560 px lo sfondo è una composizione Bauhaus più leggera (quarto di cerchio, barra gialla, puntinato), invece del manifesto grande che si deformava.
- **`css/mobile.css`:**
  - sui touch i suggerimenti dicono "tocca" invece di "passa sopra";
  - il disco della musica è più piccolo;
  - nell'intestazione della scheda progetto palette e stile stanno affiancati;
  - nel catalogo l'avatar è più piccolo e non copre i progetti.
- **Campari su telefono:** la scatola non copre più "Accetti la sfida?" e lo spiritello resta dentro lo schermo.

