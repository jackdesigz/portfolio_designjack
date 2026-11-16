/**
 * designjack - Hanging Sheets on Wire Physics Engine (Fogli Appesi al Filo)
 * Cleaned: Removed random filler codes; clean presentation of project & category.
 */

class HangingCatalogWire {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.wireTrack = document.getElementById('hanging-wire-track');
    this.isOpen = true; // PROGETTI SU FILO GIÀ APERTI DI DEFAULT
    this.sheets = [];
    this.scrollX = 0;
    this.targetScrollX = 0;

    this.init();
  }

  init() {
    this.renderSheets();
    this.setupControls();
    this.startPhysicsLoop();
  }

  renderSheets() {
    if (!this.wireTrack) return;
    this.wireTrack.innerHTML = '';
    this.sheets = [];

    const projects = window.PROJECT_REGISTRY || [];
    const sheetSpacing = 280;
    const startOffset = 80;

    projects.forEach((proj, idx) => {
      const sheetEl = document.createElement('div');
      sheetEl.className = 'hanging-sheet';
      sheetEl.setAttribute('data-project-id', proj.id);

      sheetEl.innerHTML = `
        <div class="sheet-clips-row">
          <div class="wire-clip left"></div>
          <div class="wire-clip right"></div>
        </div>
        <div class="sheet-paper">
          <div class="sheet-header">
            <span class="sheet-cat">${proj.category}</span>
            <span class="sheet-year">${proj.year}</span>
          </div>
          <div class="sheet-artwork-preview">
            <canvas class="sheet-mini-canvas" width="220" height="130"></canvas>
            <div class="sheet-hover-overlay">
              <span>[ APRI PROGETTO ]</span>
            </div>
          </div>
          <div class="sheet-footer">
            <h4 class="sheet-title">${proj.title}</h4>
            <div class="sheet-tags">
              ${(proj.stack || []).slice(0, 3).map(s => `<span class="sheet-pill">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      `;

      this.wireTrack.appendChild(sheetEl);

      const cvs = sheetEl.querySelector('.sheet-mini-canvas');
      if (cvs) this.drawSheetGraphic(cvs, proj);

      const restingX = startOffset + idx * sheetSpacing;
      this.sheets.push({
        el: sheetEl,
        project: proj,
        x: restingX - 12 - idx * 2, // Natural initial position on page load
        targetX: restingX,
        vx: 0.2,
        theta: (idx % 2 === 0 ? 0.015 : -0.015),
        omega: 0.001,
        hovered: false
      });

      sheetEl.addEventListener('mouseenter', () => {
        const item = this.sheets[idx];
        if (item) {
          item.hovered = true;
          item.omega += 0.08;
          if (window.audioEngine) {
            window.audioEngine.playPaperFlutter();
            window.audioEngine.playCableTwang();
          }
        }
      });

      sheetEl.addEventListener('mouseleave', () => {
        const item = this.sheets[idx];
        if (item) {
          item.hovered = false;
        }
      });

      sheetEl.addEventListener('click', () => {
        if (window.audioEngine) window.audioEngine.playBeep(880, 0.05);
        if (window.openProjectModal) {
          window.openProjectModal(proj);
        }
      });
    });
  }

  drawSheetGraphic(canvas, proj) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0F0F14';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    ctx.fillStyle = proj.colorHex || '#E63946';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.5, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB703';
    ctx.fillRect(w * 0.52, h * 0.25, 42, 42);

    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.moveTo(w * 0.78, h * 0.75);
    ctx.lineTo(w * 0.92, h * 0.75);
    ctx.lineTo(w * 0.85, h * 0.32);
    ctx.closePath();
    ctx.fill();
  }

  setupControls() {
    const btnScrollLeft = document.getElementById('btn-wire-scroll-left');
    const btnScrollRight = document.getElementById('btn-wire-scroll-right');

    if (btnScrollLeft) {
      btnScrollLeft.addEventListener('click', () => {
        this.targetScrollX = Math.min(0, this.targetScrollX + 340);
        if (window.audioEngine) window.audioEngine.playCableTwang();
      });
    }

    if (btnScrollRight) {
      btnScrollRight.addEventListener('click', () => {
        const maxScroll = -(this.sheets.length * 280 - (this.container.clientWidth || 900) + 120);
        this.targetScrollX = Math.max(maxScroll, this.targetScrollX - 340);
        if (window.audioEngine) window.audioEngine.playCableTwang();
      });
    }

    if (this.container) {
      this.container.addEventListener('wheel', (e) => {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (Math.abs(e.deltaY) > 10 ? e.deltaY * 0.6 : 0);
        if (delta !== 0) {
          const maxScroll = -(this.sheets.length * 280 - (this.container.clientWidth || 900) + 120);
          this.targetScrollX = Math.min(0, Math.max(maxScroll, this.targetScrollX - delta));
        }
      }, { passive: true });
    }
  }

  openWireView() {
    this.isOpen = true;
    if (this.container) {
      this.container.classList.add('active');
      this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const toggleLabel = document.getElementById('wire-toggle-label');
    if (toggleLabel) toggleLabel.textContent = '[ ✕ CHIUDI FILO DA STUDIO ]';

    if (window.audioEngine) {
      window.audioEngine.playCableTwang();
      window.audioEngine.playPaperFlutter();
    }

    // Smooth, gentle entry without violent bouncing/sobbalzi
    this.sheets.forEach((s, idx) => {
      s.x = s.targetX - 60 - idx * 14;
      s.vx = 1.4;
      s.theta = -0.035;
      s.omega = 0.003;
      s.hovered = false;
    });
  }

  closeWireView() {
    this.isOpen = false;
    if (this.container) {
      this.container.classList.remove('active');
    }

    const toggleLabel = document.getElementById('wire-toggle-label');
    if (toggleLabel) toggleLabel.textContent = '[ ⤢ MOSTRA INTERO CATALOGO SU FILO DA STUDIO ]';

    if (window.audioEngine) window.audioEngine.playBeep(540, 0.04);
  }

  startPhysicsLoop() {
    const loop = () => {
      this.updatePhysics();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updatePhysics() {
    if (!this.isOpen) return;

    this.scrollX += (this.targetScrollX - this.scrollX) * 0.08;

    // Elegant physics: smooth glide, high angular damping, gentle organic sway
    const damping = 0.86;
    const springK = 0.036;
    const friction = 0.82;

    this.sheets.forEach((s) => {
      const dx = s.targetX - s.x;
      const ax = dx * springK;
      s.vx = (s.vx + ax) * friction;
      s.x += s.vx;

      // Gentle restoring torque and subtle linear inertia
      const linearInertiaTorque = -s.vx * 0.0024;
      const restoringTorque = -Math.sin(s.theta) * 0.42;

      s.omega = (s.omega + restoringTorque + linearInertiaTorque) * damping;
      s.theta += s.omega;

      const screenX = s.x + this.scrollX;
      const normX = screenX / 1200;
      const sagY = Math.sin(normX * Math.PI) * 14;

      const hoverScale = s.hovered ? 1.08 : 1.0;
      const hoverElevate = s.hovered ? -12 : 0;
      const hoverTilt = s.hovered ? -0.04 : 0;

      const deg = (s.theta + hoverTilt) * (180 / Math.PI);
      s.el.style.transform = `
        translate3d(${screenX}px, ${sagY + hoverElevate}px, 0)
        rotate(${deg}deg)
        scale(${hoverScale})
      `;

      s.el.style.zIndex = s.hovered ? 100 : Math.floor(Math.abs(s.x) % 20);
      s.el.classList.toggle('is-hovered', s.hovered);
    });
  }
}

window.initHangingCatalog = function() {
  window.hangingCatalog = new HangingCatalogWire('hanging-catalog-stage');
};
