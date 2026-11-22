# designjack — portfolio

Portfolio di **Jacopo “Jack” Febi**, Communication & Digital Designer.

Il sito è statico: HTML, CSS e JavaScript senza build. Three.js r128 arriva da CDN, i font in parte da Google Fonts e in parte da `assets/fonts/`.

Si divide in tre **canali**, R, G e B, come i tre colori di uno schermo. Ognuno ha il suo stile e il passaggio dall'uno all'altro è una transizione da vecchio televisore. Il logo in alto a sinistra resta sempre **designjack**: cambiando canale cambia solo il suo stile.

---

## Avvio in locale

```bash
cd Portfolio
python3 -m http.server 8080
```

Poi apri **http://localhost:8080**.

Va aperto da un server e non come file (`file://`). Altrimenti il browser blocca le immagini nella capsula 3D, le maschere degli spruzzi e alcuni font.

---

## I tre canali

### R — Realizzazioni & Ricreazione (lavori e playground)
Stile Bauhaus su carta, con filtro da monitor CRT. Font Jost.
- **Chi sono:**
  - titolo "Idee in forma. Forme in gioco.";
  - una breve presentazione;
  - l'avatar 3D low-poly;
  - muovendo il cursore, un pennello retinato (dithering Bayer) scopre una composizione nascosta sotto la carta.
- **Progetti su filo:** i progetti sono fogli appesi a un cavo con mollette e oscillano come pendoli. Passandoci sopra il foglio si solleva e mostra la versione a 1 bit; cliccandolo si apre la scheda. Si scorre con le frecce o con la rotella.
- **Catalogo intero:** griglia di tutti i progetti, con filtri per categoria (quelli vuoti si nascondono).
  - In alto a destra c'è lo switch R / G / B, che cambia lo stile di tutto il sito.
  - Si apre anche dal pulsante **CATALOGO** nella barra in alto, che c'è in tutti e tre i canali e mostra il numero di progetti.
- **Toy Claw Machine:** macchina 2D a tutta pagina con fisica vera: capsule rigide, artiglio a pendolo, presa che nasce dai contatti, scivolo e vaschetta. Ogni capsula ha dentro l'immagine di un progetto e, una volta pescata, si apre la sua scheda.
  - **Comandi:** `A` / `D` o frecce ← → per muovere il carrello, `Spazio` o `Invio` per pescare.

### G — Germogli & Graffiti (il lato fuori orario)
Organico × graffiti, tutto verde. Font Bricolage Grotesque; Sedgwick Ave Display solo per le scritte a spray.
- **Muro:** muro notturno con blob che respirano e la tag "jack" con le colature.
- **Adesivi e nastro:** gli adesivi si staccano e si trascinano; sotto scorre un nastro.
- **Manifesto:** "in tre spruzzi".
- **Muro libero:** si dipinge con la bomboletta.

### B — Bolle & Bottiglie (contatti)
Frutiger Aero marino, tutto blu e lucido. Font Hind.
- **In superficie:** cielo con sole, onde, nastri di luce e un delfino.
- **Sotto l'acqua:** discesa con raggi di luce e caustiche morbide.
- **Contatti:** pannelli di vetro con l'email (e il tasto per copiarla) e il **messaggio in bottiglia**, che prepara una mail.
- **Flauto magico:** si apre dal suo pannello. I tasti R T Y U I suonano le note e ogni melodia porta a un canale.

### In comune
- **Tab R / G / B:** passandoci sopra compare un'etichetta con due parole che iniziano con la stessa lettera. In R scende come una tendina. In G si compone come un graffito: passata di spray, macchie di vernice attorno e una colatura. In B nasce come una bolla.
- **Avatar** (`js/heroAvatar.js`, `js/avatarPilot.js`): la testa low-poly ha come texture `assets/avatar/jacopo-avatar.png`.
  - Segue il cursore e sbatte le palpebre.
  - Si trascina per girarla e, se la clicchi, parla.
  - Scrollando si aggancia in basso a sinistra e commenta quello su cui passi.
  - Ha una casa per canale: la hero in R, accanto al manifesto in G, dentro una bolla in B.
- **Music player:** in alto a destra un mezzo disco gira incastrato nel bordo. Riproduce due singoli di Ikigai (cartella `Musica/`), con note che escono nello stile del canale.
- **Easter egg:** il Konami code (↑ ↑ ↓ ↓ ← → ← → B A; su telefono gli swipe e poi due tap). L'avatar si spaventa, sopra la testa compare il "!" di Metal Gear e parte il suono di allarme. Dalla console si prova con `konamiAlert()`.

---

## Progetti

| Id | Progetto | Categoria | Anno | Layout |
|---|---|---|---|---|
| r-19 | MAO — Museo d’Arte Orientale | Editorial Design | 2026 | `mao` |
| r-18 | Decoder | Editorial Design | 2026 | `decoder` |
| r-17 | Modartech — Fotografia | Editorial Design | 2026 | `modartech` |
| r-16 | Melagoccio | Brand Design | 2025 | `melagoccio` |
| r-15 | Teatro Salone Ablondi | Brand Design | 2025 | `ablondi` |
| r-14 | Campari Champ-AR | Interaction Design | 2026 | `champar` |
| r-13 | La Fanciulla del West | Graphic Design | 2025 | `fanciulla` |
| r-06 | Echo Sound Festival | Graphic Design | 2025 | `echo` |

I dati sono in `js/projects.js`, gli asset in `assets/projects/<progetto>/`, i materiali originali in `Progetti/`.

### Come è fatta una scheda progetto
1. **Parte introduttiva**, nello stile del **canale attivo** (`css/project-page.css`):
   - titolo;
   - software, palette e stile;
   - le schede *Panoramica* e *Progettazione*.
2. **Layout dedicato** sotto, nello stile del **progetto**. Ogni layout è una funzione registrata in `window.PROJECT_LAYOUTS[nome]`: disegna la pagina e restituisce una funzione di pulizia, che `js/modal.js` chiama alla chiusura.

Si chiude con la X in alto a destra o con `Esc`.

### Layout dedicati
- **Campari Champ-AR** (`js/projectChampar.js`, `css/project-champar.css`; font Upheaval TT):
  - apertura: la scatola sbuca e lo spiritello spunta da dietro;
  - la storia con gli sprite animati, il packaging, lo showcase e la campagna sui telefoni;
  - in fondo un mini gioco endless: si parte con **SALTA** (o Spazio o ↑) e si saltano le arance che lo spiritello lancia. Il record resta salvato nel browser.
  - Il codice del gioco AR (A-Frame + MindAR) è su [github.com/jackdesigz/champar](https://github.com/jackdesigz/champar).
- **Teatro Salone Ablondi** (`js/projectBrand.js`, `css/project-brand.css`; Montserrat e Radlush SemiBold):
  - un sipario di velluto si apre sul marchio;
  - il simbolo, dalle prime variazioni alla versione finale;
  - la costruzione con le proporzioni delle linee guida;
  - la palette, la tipografia e le magliette.
- **Melagoccio** (`js/projectBrand.js`, `css/project-brand.css`; font del brand BLOCKY, testi in Rubik):
  - il logo su un fondo di scritte che scorrono;
  - palette e mascotte;
  - la felpa che si gira tra fronte e retro;
  - le figurine a ventaglio;
  - il banner Instagram che si compone dai tre post.
- **La Fanciulla del West** (`js/projectBrand.js`, `css/project-fanciulla.css`; font Decondol):
  - apertura art déco con una carta che si gira e mostra il poster;
  - la regina di cuori e la mano del morto;
  - le sagome poligonali;
  - moodboard, palette e font;
  - le bozze su un tavolo verde e i mockup;
  - il download della presentazione.
- **Echo Sound Festival** (`js/projectBrand.js`, `css/project-echo.css`; font Super Earthly):
  - anelli psichedelici che pulsano e il poster con le illustrazioni attaccate come adesivi;
  - il poster con la palette a bollini;
  - le tre illustrazioni a zig-zag;
  - i mockup.

### Editorial Design: le pubblicazioni da sfogliare
I tre progetti editoriali sono in `js/projectEditorial.js`, con uno stile per ciascuno (`css/project-mao.css`, `css/project-decoder.css`, `css/project-modartech.css`). Le pagine vere stanno in `assets/projects/<progetto>/pages/` (01.jpg, 02.jpg…), ricavate dai PDF in `Progetti/Editorial Design/`.

- **Lettore sfogliabile** (`createFlipbook`, stile base in `css/project-editorial.css`):
  - la copertina sta da sola al centro, poi le doppie pagine;
  - la pagina gira in 3D;
  - si sfoglia con un clic sulla pagina, con le frecce della tastiera, con uno swipe o con la barra;
  - il tasto ⤢ ingrandisce la pagina;
  - su telefono si legge una pagina alla volta;
  - le immagini si caricano solo attorno alla pagina aperta.
- **MAO — Museo d’Arte Orientale** (font Gill Sans, quello di sistema su Mac e iPhone; Rotis Semi Serif per il motto):
  - apertura come il banner: kanji 和敬清寂 che compaiono a pennellate, la fascia rossa e il Kongo Rikishi scontornato;
  - i quattro principi (Wa, Kei, Sei, Jaku), uno alla volta;
  - la gabbia: canone di Van de Graaf, moduli 7 × 5 e baseline grid disegnati dal vivo;
  - il catalogo da sfogliare, con i capitoli che portano alla pagina giusta;
  - palette con CMYK e HEX e tipografia;
  - la campagna: il banner, il manifesto e il totem interi e grandi, i quattro post Instagram (scegli un post e la vista si avvicina finché non si legge), gli altri mockup in file a proporzioni vere.
- **Decoder**, impaginata come una fanzine punk: fotocopie strappate, nastro adesivo, lettere ritagliate, timbri, pennarello (titoli in Anton al posto di Druk, testi in Special Elite, scritte a mano in Permanent Marker, numeri in Monobloco):
  - testata nel carattere della rivista (rossa, stretta e altissima) e copertina incollata con il nastro; le lettere ritagliate restano per le cose più punk, come Johnny Silverhand;
  - l’indice ad adesivi colorati: ogni voce apre la rivista a quella pagina;
  - taglia il codice: la frase di Burroughs su strisce di carta da tagliare e rimescolare (cut-up);
  - sapevi che…: impaginata come la pagina 9 (titolo in Monobloco, testo originale su due colonne in Michroma, la stampante, le frecce e le cornici), ma interattiva: la stampante stampa il foglio, la luce blu scopre i micropunti gialli e il riquadro MIC decodifica seriale, data e ora della stampa man mano che muovi la luce;
  - un’opera, uno stile: Akira, Blade Runner, Ghost in the Shell, Cyberpunk 2077, Johnny Silverhand, Marathon, Neuromante e Nine Inch Nails, ognuno con il suo colore, i suoi caratteri e le sue immagini, come nella rivista. Le immagini (`ed-*`) sono ritagliate da una versione del PDF senza testo (solo le lettere tolte, colori invariati), così le figure sono intere e pulite; si vedono sempre intere, con la larghezza presa dalle proporzioni (`ar` nel registro);
  - chiusura su “No Future”.
- **Modartech** (titoli in Boldark, testi in Cormorant Garamond al posto di Canela):
  - copertina, testata e contenuti cliccabili;
  - il magazine da sfogliare (le doppie pagine del PDF sono divise in pagine singole);
  - gli schemi di illuminazione: scegli lo schema, cambia la foto e la luce si sposta nella pianta vista dall’alto;
  - originale o AI: confronto con la linea da trascinare;
  - i ritratti (aule, Crastan, parco) e la campagna #MADEINSENA che scorre in orizzontale;
  - Viaggio, Vastità, Proporzione: le ultime tre doppie pagine, con i testi del magazine e un rimando alle pagine da sfogliare.

Tutte le immagini con `data-img-src` si aprono ingrandite al clic (anche quando la classe `zoomable-trigger` si perde accanto a un altro `class`). Ogni scheda di progetto si apre sempre dall’inizio.

### Aggiungere un progetto
1. Crea la cartella `assets/projects/<progetto>/` con:
   - `cover.jpg` (catalogo e filo);
   - `capsule.png` (quadrata, 256 px, per la claw machine).
2. Aggiungi la voce in `js/projects.js`:
   - `id`, `title`, `category`, `year`;
   - `coverImage`, `capsuleImage` (e, se serve, `coverFocusY`: da dove ritagliare la copertina in verticale, 0 = in alto);
   - `software`, `palette`, `style`;
   - i testi di panoramica e progettazione;
   - `gallery`.
3. Per la pagina hai due strade:
   - usa le sezioni standard di `gallery` (`poster`, `moodboard`, `sketches`, `illustrations`, `mockups`, `download`);
   - oppure scrivi un layout dedicato: registra `PROJECT_LAYOUTS.<nome>` e metti `gallery.layout: '<nome>'`.
4. Nella claw machine finiscono solo i progetti con `capsuleImage`.

---

## Struttura

```
index.html              pagina unica: tre canali, catalogo, schede
css/
  styles.css            base e canale R
  channel-g.css         canale G
  channel-b.css         canale B
  catalog-ui.css        catalogo, switch R/G/B, pulsante CATALOGO, X delle schede
  project-page.css      parte introduttiva delle schede (stile del canale)
  project-*.css         layout dedicati dei progetti (project-editorial.css: il lettore sfogliabile)
  music-player.css · mobile.css · easter-egg.css
js/
  main.js               cambio canale, catalogo, filtri
  channels.js           animazioni di G e B (muro spray, adesivi, bolle)
  projects.js           registro dei progetti
  modal.js              scheda progetto e capsula vinta
  projectChampar.js     layout Campari + gioco
  projectBrand.js       layout Ablondi, Melagoccio, Fanciulla, Echo
  projectEditorial.js   lettore sfogliabile + layout MAO, Decoder, Modartech
  hangingCatalog.js     fogli sul filo
  dither.js             pennello retinato e fogli a 1 bit
  crane2d.js · clawPhysics2D.js   claw machine 2D
  heroAvatar.js · avatarPilot.js  avatar 3D e i suoi spostamenti
  musicPlayer.js · audio.js · flute.js · konami.js · softwareIcons.js
assets/
  projects/             immagini dei progetti
  fonts/                font locali
  avatar/ · Immagini/ · sfx/
Musica/                 brani del player
Progetti/               materiali originali (PDF, istruzioni)
archive/                versioni precedenti (claw machine 3D, sfera e avatar procedurale)
```

`js/crane.js` è la vecchia claw machine 3D: la pagina non la carica. Come riattivarla è spiegato in `archive/claw-machine-3d/LEGGIMI.md`.

---

## Note tecniche

- **Cache:** i file CSS e JS sono richiamati con `?v=` in `index.html`. Quando ne modifichi uno, alza il numero, altrimenti il browser può tenere la versione vecchia.
- **Prestazioni:** lo scroll gira a 60 fps in tutti e tre i canali.
  - L'avatar non usa l'antialias WebGL: con l'antialias ogni ridimensionamento costava circa 200 ms.
  - La barra in alto non ha `backdrop-filter`.
  - Il catalogo ha un fondo pieno e nasconde il sito sotto (`body.catalog-open`), così non lampeggia.
- **Telefono** (`css/mobile.css` e media query nei singoli file):
  - fogli sul filo più piccoli;
  - sfondo più leggero per la claw machine;
  - suggerimenti "tocca" al posto di "passa sopra";
  - disco della musica e avatar più piccoli.
- **Spruzzi del canale G:** sono SVG generati usati come maschere (`--splat-*` in `css/channel-g.css`), quindi prendono il colore della lettera.
- **Maiuscole nei percorsi:** la cartella `assets/Immagini` ha la I maiuscola. Online le maiuscole contano: se la rinomini, aggiorna `js/konami.js`.
- **Font locali:** Upheaval TT, Radlush, BLOCKY, Decondol, Super Earthly, Rotis Semi Serif, Boldark e Monobloco sono in `assets/fonts/`. Monobloco è libero anche per uso commerciale; per gli altri, prima di distribuire il repo verifica che le licenze lo permettano (Rotis è un font Adobe a pagamento).
- **Font sostituiti:** Decoder usa Druk solo in versione Trial, che non si può pubblicare: sul sito i titoli sono in Anton (la testata vera resta nella copertina e nelle pagine). Canela (Modartech) e Gill Sans (MAO) non si possono distribuire: al loro posto ci sono Cormorant Garamond e, fuori dai dispositivi Apple, Hind.
- **PDF troppo grande per GitHub:** `Progetti/Editorial Design/Fotografia_Modartech/Fotografia_Magazine_Jacopo_febi.pdf` pesa 117 MB e GitHub rifiuta i file oltre i 100 MB, quindi è in `.gitignore`. Il sito non lo usa: le pagine sono già in `assets/projects/modartech/pages/`.
