# designjack // Canale [R] — Prototipo Interattivo Cyber-Bauhaus & CRT

Prototipo interattivo completo per la sezione principale (**Canale R**) del portfolio di **Jacopo (designjack)**, Communication & Digital Designer. 

Il sito unisce estetica cyber-informatica, rigore costruttivista Bauhaus, filtri a monitor **CRT**, **Geometria Sferica 3D** nella Hero, il sistema con **fogli appesi al filo con fisica pendolare**, effetto di **dithering con smolecolamento di pixel rossi** al passaggio del cursore e una **Toy Candy Claw Machine 3D standalone** (ispirata alla classica candy grabber da tavolo) con 42 caramelle metalliche riflettenti, leve ball-top e capsule Gashapon apribili.

---

## 🕹️ Novità & Funzionalità Implementate

### 1. Hero Section con Geometria Sferica 3D (Rimosso Vecchio Dither Nascosto)
- **Eliminato il pennello e l'immagine nascosta** che creavano rumore visivo.
- Al suo posto è presente la **Geometria Sferica 3D Bauhaus** (`js/heroSphere.js`):
  - Sfera a reticolo wireframe nei colori primari (Rosso `#E63946`, Giallo `#FFB703`, Blu `#1D3557`).
  - Anelli orbitali rotanti concentrici e nucleo icosaedrico sfaccettato.
  - Reattiva in tempo reale: si inclina seguendo la posizione del cursore e può essere **trascinata/ruotata con fisica a inerzia**.

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

### 4. Toy Candy Claw Machine 3D (Ancora Più Curata & Carina)
- Ispirata direttamente alla candy grabber arcade da tavolo della foto di riferimento:
  - **Tettuccio (Canopy) in plastica rossa lucida** con modanature beffate retro e vassoio superiore a scalino.
  - **Insegna Marquee Retrò illuminata:** `★ JACK’S TOY CLAW ★` con lampadine gialle e rosse chaser lampeggianti lungo il cornicione!
  - **42 Caramelle con Involucro Metallico (Candy Foil Wrappers):** carta stagnola accartocciata lucida (oro, viola, fucsia, ciano metallizzato) sparpagliata sul fondo della teca tra le capsule!
  - **Dettaglio della capsula aperta:** capsula blu aperta con coperchio reclinato e caramella dorata adagiata a lato della vaschetta di scarico.
  - **Consolle a sbalzo con decalcomania Sunburst** e **3 Joystick Leve a pallina 3D** (blu, argento, rossa) che si inclinano fisicamente quando muovi l'artiglio con `WASD` o con i tasti a schermo!
  - **Vaschetta premi frontale-sinistra** con sensore di scarico e fanfara sonora.

### 5. Monitor CRT & Transizione Catodica
- Spengimento a riga orizzontale, collasso nel punto di fosforo centrale, scarica flyback e riaccensione a degauss surge tra il preloader e il sito, e quando si selezionano i canali `[ G ]` e `[ B ]`.
- Filtro CRT globale con scanlines, vignettatura scura e telaio con angoli arrotondati.

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
- **Leve / Tasti Gru:** `WASD` o `Frecce Direzionali` per muovere l'artiglio e le leve 3D; `Spazio` o `Invio` per pescare; `Esc` per chiudere i modal.
- **Fogli al Filo:** Clicca `[ MOSTRA INTERO CATALOGO ]` per srotolare i fogli lungo il cavo con fisica pendolare.
