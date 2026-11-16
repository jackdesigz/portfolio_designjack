/**
 * designjack - Hero 3D Geometria Sferica (Three.js)
 * 
 * Replaces the old dither brush box with an interactive Cyber-Bauhaus Sphere:
 * - Concentric rotating orbital rings (Red, Yellow, Blue Bauhaus palette)
 * - Wireframe latitude/longitude sphere + inner geodesic faceted core
 * - Mouse-driven inertia tracking and interactive dragging
 */

class HeroBauhausSphere {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.sphereGroup = null;
    this.innerCore = null;
    this.ringX = null;
    this.ringY = null;
    this.ringZ = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.dragVel = { x: 0, y: 0 };

    this.init();
  }

  init() {
    const w = this.container.clientWidth || 360;
    const h = this.container.clientHeight || 300;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50);
    this.camera.position.set(0, 0, 4.4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(amb);

    const dirLight1 = new THREE.DirectionalLight(0xE63946, 1.2);
    dirLight1.position.set(3, 4, 3);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xFFB703, 1.0);
    dirLight2.position.set(-3, -2, -2);
    this.scene.add(dirLight2);

    this.buildSphere();
    this.setupEvents();
    this.animate();
  }

  buildSphere() {
    this.sphereGroup = new THREE.Group();

    // 1. Outer Latitude/Longitude Wireframe Sphere (Bauhaus Red)
    const wireGeo = new THREE.SphereGeometry(1.2, 18, 14);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xE63946,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.sphereGroup.add(wireMesh);

    // 2. Middle Orbital Rings (Bauhaus Yellow & Blue)
    const ringGeo1 = new THREE.TorusGeometry(1.35, 0.025, 12, 48);
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xFFB703, metalness: 0.8, roughness: 0.2 });
    this.ringX = new THREE.Mesh(ringGeo1, ringMat1);
    this.ringX.rotation.x = Math.PI / 3;
    this.sphereGroup.add(this.ringX);

    const ringGeo2 = new THREE.TorusGeometry(1.42, 0.022, 12, 48);
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x1D3557, metalness: 0.8, roughness: 0.2 });
    this.ringY = new THREE.Mesh(ringGeo2, ringMat2);
    this.ringY.rotation.y = Math.PI / 4;
    this.sphereGroup.add(this.ringY);

    // 3. Inner Faceted Geodesic Core (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.68, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x121214,
      metalness: 0.9,
      roughness: 0.15,
      flatShading: true
    });
    this.innerCore = new THREE.Mesh(coreGeo, coreMat);
    this.sphereGroup.add(this.innerCore);

    // 4. Floating Bauhaus Primary Axis Dots
    const dotGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const dotColors = [0xE63946, 0xFFB703, 0x1D3557, 0xffffff];
    const dotPositions = [
      [1.35, 0, 0], [-1.35, 0, 0],
      [0, 1.35, 0], [0, -1.35, 0],
      [0, 0, 1.35], [0, 0, -1.35]
    ];

    dotPositions.forEach((pos, i) => {
      const dotMat = new THREE.MeshBasicMaterial({ color: dotColors[i % dotColors.length] });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.set(...pos);
      this.sphereGroup.add(dotMesh);
    });

    this.scene.add(this.sphereGroup);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight || 300;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Mouse tilt tracking
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - cx) / (rect.width / 2);
      this.mouse.targetY = (e.clientY - cy) / (rect.height / 2);

      if (this.isDragging) {
        const dx = e.clientX - this.prevMouse.x;
        const dy = e.clientY - this.prevMouse.y;
        this.dragVel.x = dx * 0.012;
        this.dragVel.y = dy * 0.012;
        this.prevMouse.x = e.clientX;
        this.prevMouse.y = e.clientY;
      }
    });

    // Drag to spin sphere
    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
      if (window.audioEngine) window.audioEngine.playBeep(840, 0.03);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.container.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      this.isDragging = true;
      this.prevMouse.x = e.touches[0].clientX;
      this.prevMouse.y = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Inertia on drag
    if (this.sphereGroup) {
      this.sphereGroup.rotation.y += 0.01 + this.dragVel.x;
      this.sphereGroup.rotation.x = this.mouse.y * 0.45 + this.dragVel.y;
      this.sphereGroup.rotation.z = -this.mouse.x * 0.25;

      this.dragVel.x *= 0.94;
      this.dragVel.y *= 0.94;
    }

    // Rings independent counter-rotation
    if (this.ringX) this.ringX.rotation.z += 0.015;
    if (this.ringY) this.ringY.rotation.z -= 0.012;
    if (this.innerCore) {
      this.innerCore.rotation.x += 0.02;
      this.innerCore.rotation.y += 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.initHeroSphere = function() {
  window.heroSphere = new HeroBauhausSphere('hero-sphere-viewport');
};
