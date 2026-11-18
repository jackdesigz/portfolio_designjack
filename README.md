# designjack // Canale [R] — Prototipo Interattivo Cyber-Bauhaus & CRT

Prototipo interattivo completo per la sezione principale (**Canale R**) del portfolio di **Jacopo (designjack)**, Communication & Digital Designer. 

Il sito unisce estetica cyber-informatica, rigore costruttivista Bauhaus, filtri a monitor **CRT**, **Geometria Sferica 3D** nella Hero, il sistema con **fogli appesi al filo con fisica pendolare**, effetto di **dithering con smolecolamento di pixel rossi** al passaggio del cursore e una **Toy Candy Claw Machine 3D standalone** (ispirata alla classica candy grabber da tavolo) con 42 caramelle metalliche riflettenti, leve ball-top e capsule Gashapon apribili.

---

## 🕹️ Novità & Funzionalità Implementate

### 1. Hero Section con Avatar 3D Low-Poly
- Nella hero, senza finestra, c'è la **testa low-poly di Jacopo** (`js/heroAvatar.js`): il ritratto `assets/avatar/jacopo-avatar.png` è montato come texture su un rilievo 3D (cranio, viso, naso, orbite), quindi ruota con parallasse vera.
- Fluttua, gira verso il cursore, sbatte le palpebre; **trascinala** per girarla (torna frontale a molla), **cliccala** per farla parlare (fumetto pixel-art, bip, bocca animata). Frasi in `MESSAGES`.
- **Avatar pilota** (`js/avatarPilot.js`): scrollando oltre la hero vola in basso a sinistra e commenta ciò su cui passi il cursore (mappa `COMMENTS`, oppure attributo `data-avatar-say="..."` su qualsiasi elemento). Passandoci sopra compare una **X** che lo rimanda al suo posto nella hero; tornando in cima alla pagina si riattiva e al prossimo scroll si riaggancia.
- **Una casa per canale** (`data-avatar-home` in `index.html`): in R sta nella hero, in G accanto al manifesto (stesso comportamento: si aggancia scrollando, la X lo rimanda a casa), in B è **intrappolato in una bolla**: cliccandola scoppia, lui ringrazia e va in basso a sinistra; la X lo rimette nella bolla. Frasi e saluti per canale in `MESSAGES` / `GREETING` di `js/avatarPilot.js`.
- **Filtro CRT pixelato** leggero sulla testa (render a metà risoluzione + scanline + maschera RGB), tinto di rosso in R, verde in G, blu in B (`setTint` in `js/heroAvatar.js`).
- Versioni precedenti: `archive/heroSphere.js` (sfera) e `archive/heroAvatar-procedurale.js` (testa procedurale).

### 2. "Mostra Intero Catalogo" — Fogli Appesi al Filo con Fisica
- Cliccando sul pulsante **`[ ⤢ MOSTRA INTERO CATALOGO // APRI FILO DA STUDIO ]`**:
  - Compare un cavo in acciaio orizzontale teso con tenditori laterali.
  - Da sinistra a destra scorrono i **fogli di progetto editoriali (stampati riso/proof)** appesi con mollette al filo.
  - **Fisica Pendolare Reale:** durante la corsa e l'arresto, i fogli oscillano avanti e indietro con inerzia, attrito e naturale flessione del cavo (*catenary sag*).
  - **Interazione al mouse (Hover):** passando il cursore sopra un foglio, questo si solleva verso lo spettatore (`scale: 1.14`, rotazione in avanti, ombra profonda e svelamento dei dettagli) accompagnato dal suono di fruscio di carta e vibrazione del cavo (`playPaperFlutter()`, `playCableTwang()`).
  - **Click:** cliccando su qualsiasi foglio appeso si apre direttamente il modal di ispezione del case study!
  - Include pulsanti di scorrimento laterale `[ ◄ SCORRI FILO ]` / `[ SCORRI FILO ► ]` e supporto wheel orizzontale.

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

### 6. Canali G e B: due siti a sé
Quando si passa a G o B la cornice del canale R sparisce (niente scanline CRT, niente carta crema, nav e toast restilizzati); resta solo la transizione CRT come "cambio canale".
- **Canale G — "febi"** (`css/channel-g.css`): organico × graffiti, tutto verde. Muro notturno con blob che respirano, tag spray con colature, adesivi da trascinare, nastro che scorre, manifesto su carta organica e **muro libero** da dipingere con la bomboletta (colori verdi, colature se tieni fermo il tratto). Font: Sedgwick Ave Display, Fraunces, Bricolage Grotesque.
- **Canale B — "Frutiger Marine"** (`css/channel-b.css`): contatti in stile Frutiger Aero oceanico, tutto blu. Cielo con sole e riflessi, onde animate, discesa sott'acqua con raggi di luce, caustiche, bolle che scoppiano e pesci; pannelli di vetro lucido con email (e tasto copia), **messaggio in bottiglia** (prepara una mail) e il flauto magico. Font: Varela Round, Hind.
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
