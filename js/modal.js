// Restituisce il premio alla macchina che l'ha prodotto (3D o 2D)
window.resetClawPrize = function () {
  const game = window.clawPrizeOwner || window.craneMachine;
  window.clawPrizeOwner = null;
  if (game && game.resetForNewGame) game.resetForNewGame();
};

/**
 * designjack - Capsule Opening Animation & Project Inspector Modal
 * Cleaned: Removed all random codes, hex addresses, and filler metadata.
 */

class CapsuleOpeningStage {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.topCap = null;
    this.bottomCap = null;
    this.tokenMesh = null;
    this.particleGroup = null;

    this.isOpen = false;
    this.currentProject = null;

    this.init();
  }

  init() {
    const w = this.container.clientWidth || 380;
    const h = this.container.clientHeight || 340;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50);
    this.camera.position.set(0, 0.3, 4.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(amb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xFFB703, 0.9);
    rimLight.position.set(-3, -2, -2);
    this.scene.add(rimLight);

    this.animate();
  }

  loadProjectCapsule(project) {
    this.currentProject = project;
    this.isOpen = false;

    if (this.topCap) this.scene.remove(this.topCap);
    if (this.bottomCap) this.scene.remove(this.bottomCap);
    if (this.tokenMesh) this.scene.remove(this.tokenMesh);
    if (this.particleGroup) this.scene.remove(this.particleGroup);

    const radius = 0.65;
    const bodyH = 0.45;

    let colHex = 0xE62020;
    if (project.capsuleColor === 'yellow') colHex = 0xFFDD00;
    if (project.capsuleColor === 'blue') colHex = 0x3A86FF;
    if (project.capsuleColor === 'green') colHex = 0x38B000;
    if (project.capsuleColor === 'purple') colHex = 0x8338EC;

    const capMat = new THREE.MeshStandardMaterial({
      color: colHex,
      roughness: 0.25,
      metalness: 0.2
    });

    this.topCap = new THREE.Group();
    const topDome = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
    topDome.position.y = bodyH / 2;
    this.topCap.add(topDome);
    const topCyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, bodyH / 2, 24), capMat);
    topCyl.position.y = bodyH / 4;
    this.topCap.add(topCyl);
    this.scene.add(this.topCap);

    this.bottomCap = new THREE.Group();
    const btmDome = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), capMat);
    btmDome.position.y = -bodyH / 2;
    this.bottomCap.add(btmDome);
    const btmCyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, bodyH / 2, 24), capMat);
    btmCyl.position.y = -bodyH / 4;
    this.bottomCap.add(btmCyl);
    this.scene.add(this.bottomCap);

    this.tokenMesh = this.buildTokenMesh(project, radius * 0.7);
    this.tokenMesh.scale.set(0.1, 0.1, 0.1);
    this.tokenMesh.position.set(0, 0, 0);
    this.scene.add(this.tokenMesh);

    this.particleGroup = new THREE.Group();
    const pGeo = new THREE.OctahedronGeometry(0.045);
    const pColors = [0xE63946, 0xFFB703, 0x1D3557, 0xffffff];
    for (let i = 0; i < 28; i++) {
      const pMat = new THREE.MeshBasicMaterial({ color: pColors[i % pColors.length] });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2
      );
      this.particleGroup.add(pMesh);
    }
    this.particleGroup.visible = false;
    this.scene.add(this.particleGroup);

    this.topCap.position.set(0, 0, 0);
    this.topCap.rotation.set(0, 0, 0);
    this.bottomCap.position.set(0, 0, 0);
    this.bottomCap.rotation.set(0, 0, 0);

    setTimeout(() => {
      this.triggerPopAnimation();
    }, 300);
  }

  buildTokenMesh(project, size) {
    let geo;
    let mat = new THREE.MeshStandardMaterial({
      color: project.colorHex || 0xE63946,
      roughness: 0.2,
      metalness: 0.75
    });

    switch (project.shapeName) {
      case 'Wireframe Cube':
        geo = new THREE.BoxGeometry(size, size, size);
        mat.wireframe = true;
        break;
      case 'Golden Octahedron':
        geo = new THREE.OctahedronGeometry(size);
        break;
      case 'Cyan Torus':
        geo = new THREE.TorusGeometry(size * 0.75, size * 0.26, 16, 32);
        break;
      case 'Crimson Icosahedron':
        geo = new THREE.IcosahedronGeometry(size);
        break;
      case 'Double Pyramid':
        geo = new THREE.ConeGeometry(size * 0.8, size * 1.5, 4);
        break;
      case 'Electric Torus Knot':
        geo = new THREE.TorusKnotGeometry(size * 0.65, size * 0.22, 48, 12);
        break;
      default:
        geo = new THREE.DodecahedronGeometry(size);
        break;
    }

    return new THREE.Mesh(geo, mat);
  }

  triggerPopAnimation() {
    this.isOpen = true;
    if (window.audioEngine) window.audioEngine.playCapsuleOpen();
    if (this.particleGroup) this.particleGroup.visible = true;

    const startTime = performance.now();
    const duration = 1200;

    const animateOpen = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / duration);
      const spring = this.easeOutElastic(t);

      if (this.topCap) {
        this.topCap.position.y = spring * 1.25;
        this.topCap.position.x = -spring * 0.3;
        this.topCap.rotation.z = spring * 0.45;
      }

      if (this.bottomCap) {
        this.bottomCap.position.y = -spring * 1.1;
        this.bottomCap.position.x = spring * 0.25;
        this.bottomCap.rotation.z = -spring * 0.35;
      }

      if (this.tokenMesh) {
        const tokenScale = THREE.MathUtils.lerp(0.1, 1.35, spring);
        this.tokenMesh.scale.set(tokenScale, tokenScale, tokenScale);
        this.tokenMesh.position.y = spring * 0.1;
      }

      if (t < 1.0) {
        requestAnimationFrame(animateOpen);
      }
    };

    requestAnimationFrame(animateOpen);
  }

  easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // disegna solo mentre il modale della capsula è aperto
    if (document.hidden) return;
    const overlay = this.container.closest('#capsule-modal-overlay');
    if (overlay && !overlay.classList.contains('active')) return;

    if (this.tokenMesh) {
      this.tokenMesh.rotation.y += 0.025;
      this.tokenMesh.rotation.x += 0.015;
    }

    if (this.particleGroup && this.particleGroup.visible) {
      this.particleGroup.rotation.y -= 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ---------------------------------------------------------------------
// MODAL CONTROLLER & CASE STUDY INSPECTOR
// ---------------------------------------------------------------------
class ModalManager {
  constructor() {
    this.capsuleStage = null;
    this.currentProject = null;

    this.capsuleModal = document.getElementById('capsule-modal-overlay');
    this.projectModal = document.getElementById('project-modal-overlay');
    this.lightbox = document.getElementById('project-lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');

    this.init();
  }

  init() {
    this.capsuleStage = new CapsuleOpeningStage('capsule-3d-stage');
    this.setupListeners();
  }

  setupListeners() {
    const btnInspect = document.getElementById('btn-capsule-inspect');
    const btnPlayAgain = document.getElementById('btn-capsule-play-again');
    const btnCapsuleClose = document.getElementById('btn-capsule-close');

    if (btnInspect) {
      btnInspect.addEventListener('click', () => {
        if (window.audioEngine) window.audioEngine.playBeep(920, 0.05);
        this.closeCapsuleModal();
        if (this.currentProject) {
          this.openProjectModal(this.currentProject);
        }
      });
    }

    if (btnPlayAgain) {
      btnPlayAgain.addEventListener('click', () => {
        if (window.audioEngine) window.audioEngine.playBeep(640, 0.04);
        this.closeCapsuleModal();
        if (window.resetClawPrize) window.resetClawPrize();
      });
    }

    if (btnCapsuleClose) {
      btnCapsuleClose.addEventListener('click', () => {
        this.closeCapsuleModal();
        if (window.resetClawPrize) window.resetClawPrize();
      });
    }

    const btnProjectClose = document.getElementById('btn-project-close');
    const btnProjectBack = document.getElementById('btn-project-back-main');

    if (btnProjectClose) {
      btnProjectClose.addEventListener('click', () => {
        this.closeProjectModal();
      });
    }

    if (btnProjectBack) {
      btnProjectBack.addEventListener('click', () => {
        this.closeProjectModal();
      });
    }

    const btnLightboxClose = document.getElementById('btn-lightbox-close');
    if (btnLightboxClose) {
      btnLightboxClose.addEventListener('click', () => {
        this.closeLightbox();
      });
    }

    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.lightbox && this.lightbox.classList.contains('active')) {
          this.closeLightbox();
        } else if (this.projectModal && this.projectModal.classList.contains('active')) {
          this.closeProjectModal();
        } else if (this.capsuleModal && this.capsuleModal.classList.contains('active')) {
          this.closeCapsuleModal();
          if (window.resetClawPrize) window.resetClawPrize();
        }
      }
    });

    document.addEventListener('click', (e) => {
      const zoomTrigger = e.target.closest('.zoomable-trigger');
      if (zoomTrigger) {
        e.preventDefault();
        const src = zoomTrigger.getAttribute('data-img-src');
        const caption = zoomTrigger.getAttribute('data-img-caption') || '';
        if (src) this.openLightbox(src, caption);
        return;
      }

      const card = e.target.closest('.project-card');
      if (card) {
        const projId = card.getAttribute('data-project-id');
        const proj = (window.PROJECT_REGISTRY || []).find(p => p.id === projId);
        if (proj) {
          if (window.audioEngine) window.audioEngine.playBeep(780, 0.04);
          this.openProjectModal(proj);
        }
      }
    });
  }

  openCapsuleModal(project) {
    this.currentProject = project;

    const titleEl = document.getElementById('capsule-spec-title');
    const catEl = document.getElementById('capsule-spec-category');
    const descEl = document.getElementById('capsule-spec-desc');
    const stackContainer = document.getElementById('capsule-spec-stack');

    if (titleEl) titleEl.textContent = project.title;
    if (catEl) catEl.textContent = project.category;
    if (descEl) descEl.textContent = project.description;

    if (stackContainer) {
      stackContainer.innerHTML = '';
      (project.stack || []).forEach(tech => {
        const pill = document.createElement('span');
        pill.className = 'tech-pill';
        pill.textContent = tech;
        stackContainer.appendChild(pill);
      });
    }

    if (this.capsuleStage) {
      this.capsuleStage.loadProjectCapsule(project);
    }

    if (this.capsuleModal) {
      this.capsuleModal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  closeCapsuleModal() {
    if (this.capsuleModal) {
      this.capsuleModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  openProjectModal(project) {
    this.currentProject = project;

    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalYear = document.getElementById('modal-project-year');
    const modalDesc = document.getElementById('modal-project-description');
    const modalDetails = document.getElementById('modal-project-details');
    const modalStack = document.getElementById('modal-project-stack');
    const modalMetrics = document.getElementById('modal-project-metrics');

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalCategory) modalCategory.textContent = project.category;
    if (modalYear) modalYear.textContent = project.year;
    if (modalDesc) modalDesc.textContent = project.description;
    if (modalDetails) modalDetails.textContent = project.details;

    if (modalStack) {
      modalStack.innerHTML = '';
      (project.stack || []).forEach(t => {
        const badge = document.createElement('span');
        badge.className = 'tech-badge';
        badge.textContent = t;
        modalStack.appendChild(badge);
      });
    }

    if (modalMetrics && project.metrics) {
      modalMetrics.innerHTML = '';
      Object.entries(project.metrics).forEach(([k, v]) => {
        const mBox = document.createElement('div');
        mBox.className = 'metric-card';
        mBox.innerHTML = `
          <div class="metric-value">${v}</div>
          <div class="metric-label">${k}</div>
        `;
        modalMetrics.appendChild(mBox);
      });
    }

    this.renderProjectGallery(project);

    if (this.projectModal) {
      this.projectModal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  closeProjectModal() {
    if (this.projectModal) {
      this.projectModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  openLightbox(src, caption) {
    if (!this.lightbox || !this.lightboxImg) return;
    this.lightboxImg.src = src;
    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = caption || '';
    }
    this.lightbox.classList.add('active');
    this.lightbox.setAttribute('aria-hidden', 'false');
    if (window.audioEngine) window.audioEngine.playBeep(920, 0.04);
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('active');
    this.lightbox.setAttribute('aria-hidden', 'true');
    if (this.lightboxImg) {
      setTimeout(() => {
        if (!this.lightbox.classList.contains('active')) {
          this.lightboxImg.src = '';
        }
      }, 200);
    }
  }

  renderProjectGallery(project) {
    const galleryShowcase = document.getElementById('modal-project-media-showcase');
    const canvasFallback = document.getElementById('modal-project-canvas-fallback');

    if (!galleryShowcase) return;

    if (project.gallery) {
      // Progetto con asset reali (Poster, Illustrazioni, Mockup)
      if (canvasFallback) canvasFallback.style.display = 'none';
      galleryShowcase.style.display = 'flex';

      const g = project.gallery;
      let html = '';

      // 1. POSTER IN PRIMO PIANO
      if (g.poster) {
        html += `
          <div class="gallery-block poster-hero-block">
            <div class="project-section-tag">
              <span class="step-num">01</span>
              <span>IL MANIFESTO</span>
            </div>
            <div class="poster-hero-container zoomable-trigger" data-img-src="${g.poster.src}" data-img-caption="${g.poster.caption || project.title}">
              <div class="poster-image-box">
                <img src="${g.poster.src}" alt="${g.poster.alt || 'Poster'}" class="poster-hero-image" loading="lazy" />
                <div class="poster-zoom-pill">
                  <span>🔍</span> CLICCA PER INGRANDIRE IL POSTER
                </div>
              </div>
              <div class="poster-hero-meta">
                <div class="poster-meta-title">${project.title} — POSTER UFFICIALE</div>
                <div class="poster-meta-sub">${g.poster.caption || 'Composizione vettoriale realizzata con Adobe Illustrator'}</div>
              </div>
            </div>
          </div>
        `;
      }

      // 2. ILLUSTRAZIONI QUA E LÀ NELLA PAGINA
      if (g.illustrations && g.illustrations.length) {
        html += `
          <div class="gallery-block illustrations-block">
            <div class="project-section-tag">
              <span class="step-num">02</span>
              <span>ELEMENTI GRAFICI & VETTORIALI</span>
            </div>
            <p class="section-lead-text">
              Elementi figurativi, onde cromatiche e curve d'ispirazione POP e psichedelica composti con <strong>Adobe Illustrator</strong>:
            </p>
            <div class="illustrations-gallery-grid">
              ${g.illustrations.map((ill, i) => `
                <div class="illustration-item-card zoomable-trigger" data-img-src="${ill.src}" data-img-caption="${ill.caption || ill.alt}">
                  <div class="illustration-img-holder">
                    <img src="${ill.src}" alt="${ill.alt}" class="illustration-thumb" loading="lazy" />
                    <div class="card-hover-overlay">
                      <span>🔍 INGRANDISCI</span>
                    </div>
                  </div>
                  <div class="illustration-card-info">
                    <span class="ill-badge">ILLUSTRAZIONE 0${i + 1}</span>
                    <span class="ill-title">${ill.caption || 'Dettaglio vettoriale'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // 3. GALLERIA DI MOCKUP A FINE PAGINA
      if (g.mockups && g.mockups.length) {
        html += `
          <div class="gallery-block mockups-block">
            <div class="project-section-tag">
              <span class="step-num">03</span>
              <span>GALLERIA MOCKUP & AMBIENTAZIONI</span>
            </div>
            <p class="section-lead-text">
              Applicazione del manifesto grafico in contesti urbani reali e declinazione per i canali social:
            </p>
            <div class="mockups-duo-grid">
              ${g.mockups.map((m, i) => `
                <div class="mockup-display-card zoomable-trigger" data-img-src="${m.src}" data-img-caption="${m.title} — ${m.desc}">
                  <div class="mockup-img-holder">
                    <img src="${m.src}" alt="${m.alt}" class="mockup-thumb" loading="lazy" />
                    <div class="card-hover-overlay">
                      <span>🔍 VEDI A SCHERMO INTERO</span>
                    </div>
                  </div>
                  <div class="mockup-card-info">
                    <div class="mockup-kind-tag">MOCKUP // ${i === 0 ? 'AFFISSIONE OOH' : 'INSTAGRAM FEED'}</div>
                    <h4 class="mockup-item-title">${m.title}</h4>
                    <p class="mockup-item-desc">${m.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      galleryShowcase.innerHTML = html;
    } else {
      // Progetto generico (senza gallery reale): fallback su canvas Bauhaus
      if (galleryShowcase) {
        galleryShowcase.style.display = 'none';
        galleryShowcase.innerHTML = '';
      }
      if (canvasFallback) canvasFallback.style.display = 'block';
      this.renderCaseStudyVisual(project);
    }
  }

  renderCaseStudyVisual(project) {
    const canvas = document.getElementById('case-study-visual-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 540;
    const h = canvas.height = 240;

    ctx.fillStyle = '#0F0F12';
    ctx.fillRect(0, 0, w, h);

    // Clean grid lines without text clutter
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Bauhaus Geometry
    ctx.fillStyle = project.colorHex || '#E63946';
    ctx.beginPath();
    ctx.arc(w * 0.25, h * 0.5, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB703';
    ctx.fillRect(w * 0.45, h * 0.25, 80, 80);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.75, h * 0.8);
    ctx.lineTo(w * 0.9, h * 0.8);
    ctx.lineTo(w * 0.825, h * 0.2);
    ctx.closePath();
    ctx.stroke();
  }
}

window.initModalManager = function() {
  window.modalManager = new ModalManager();
  window.openCapsuleModal = (p) => window.modalManager.openCapsuleModal(p);
  window.openProjectModal = (p) => window.modalManager.openProjectModal(p);
};
