# Claw machine 3D (disattivata)

La versione 3D della claw machine è stata tolta dalla pagina e sostituita dalla
versione 2D a tutta pagina (`js/crane2d.js` + `js/clawPhysics2D.js`).
I file sono conservati qui, intatti, per poterla riattivare.

## Contenuto
- `crane.js` — scena Three.js, comandi, premi e HUD della macchina 3D
- `clawPhysics.js` — motore fisico 3D
- `three-postfx-r128.js` — bloom / post-produzione usato solo dalla 3D
- `crane-section.html` — il markup della sezione da rimettere in `index.html`

Gli stili (`.crane-standalone-stage`, `.crane-bottom-dashboard`, `.crane-hud`, …)
sono ancora in `css/styles.css`: non servono modifiche al CSS.

## Come riattivarla
1. Rimetti i tre file JS al loro posto:
   - `crane.js` e `clawPhysics.js` in `js/`
   - `three-postfx-r128.js` in `js/vendor/`
2. In `index.html` incolla il contenuto di `crane-section.html` prima della
   sezione `claw2d-section` (o dove preferisci).
3. In fondo a `index.html`, prima di `js/modal.js`, aggiungi:
   ```html
   <script src="js/vendor/three-postfx-r128.js"></script>
   <script src="js/clawPhysics.js"></script>
   <script src="js/crane.js"></script>
   ```
`main.js` avvia la macchina 3D da solo se trova `initCraneMachine`, e il modal
della capsula sa già restituire il premio alla macchina giusta.
