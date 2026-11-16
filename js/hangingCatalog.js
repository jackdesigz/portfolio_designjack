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
    this.sheetSpacing = 360; // 3.5 fogli visibili contemporaneamente
    this.sheetWidth = 324;
    this.startOffset = 50;

    projects.forEach((proj, idx) => {
      const sheetEl = document.createElement('div');
      sheetEl.className = 'hanging-sheet';
      sheetEl.setAttribute('data-project-id', proj.id);

      const shortDesc = proj.description
        ? (proj.description.length > 115 ? proj.description.slice(0, 110).trim() + '...' : proj.description)
        : '';

      const mediaHtml = proj.coverImage
        ? `<img class="sheet-photo-media" src="${proj.coverImage}" alt="${proj.title}" loading="lazy" />`
        : `<canvas class="sheet-photo-canvas" width="648" height="880"></canvas>`;

      sheetEl.innerHTML = `
        <div class="sheet-clips-row">
          <div class="wire-clip left"></div>
          <div class="wire-clip right"></div>
        </div>
        <div class="sheet-paper">
          <div class="sheet-media-wrapper">
            ${mediaHtml}
          </div>
          <div class="sheet-hover-overlay">
            <div class="sheet-overlay-top">
              <span class="sheet-overlay-badge">${proj.category}</span>
              <span class="sheet-overlay-year">${proj.year}</span>
            </div>
            <div class="sheet-overlay-center">
              <h3 class="sheet-overlay-title">${proj.title}</h3>
              ${shortDesc ? `<p class="sheet-overlay-desc">${shortDesc}</p>` : ''}
              <div class="sheet-overlay-tags">
                ${(proj.stack || []).slice(0, 3).map(s => `<span class="sheet-overlay-tag">${s}</span>`).join('')}
              </div>
            </div>
            <div class="sheet-overlay-cta">
              <span class="cta-label">APRI SCHEDA PROGETTO</span>
              <span class="cta-arrow">↗</span>
            </div>
          </div>
        </div>
      `;

      this.wireTrack.appendChild(sheetEl);

      const cvs = sheetEl.querySelector('.sheet-photo-canvas');
      if (cvs) this.drawSheetGraphic(cvs, proj, idx);

      const restingX = this.startOffset + idx * this.sheetSpacing;
      this.sheets.push({
        el: sheetEl,
        project: proj,
        x: restingX - 10 - idx * 2,
        targetX: restingX,
        vx: 0.2,
        theta: (idx % 2 === 0 ? 0.012 : -0.012),
        omega: 0.001,
        hovered: false
      });

      sheetEl.addEventListener('mouseenter', () => {
        const item = this.sheets[idx];
        if (item) {
          item.hovered = true;
          item.omega += 0.06;
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

  drawSheetGraphic(canvas, proj, idx) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Se per qualche motivo proj.coverImage deve essere disegnata su canvas
    if (proj.coverImage) {
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        const targetAspect = w / h;
        let sx, sy, sw, sh;
        if (aspect > targetAspect) {
          sh = img.height;
          sw = sh * targetAspect;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = sw / targetAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      };
      img.src = proj.coverImage;
      return;
    }

    // Palette Bauhaus e Modernista
    const primaryRed = '#E63946';
    const primaryYellow = '#FFB703';
    const primaryBlue = '#1D3557';
    const primaryCyan = '#00B4D8';
    const accentColor = proj.colorHex || primaryRed;
    const bgDark = '#111218';

    // 1. Fondo scuro elegante
    ctx.fillStyle = bgDark;
    ctx.fillRect(0, 0, w, h);

    // 2. Griglia millimetrata / tecnica sottile di fondo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 30; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Tipografia decorativa / Filigrana in background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.font = '800 180px monospace';
    ctx.textAlign = 'right';
    const codeNum = String(idx + 1).padStart(2, '0');
    ctx.fillText(codeNum, w - 36, h * 0.38);
    ctx.restore();

    // 4. Composizioni grafiche geometriche d'autore (rotazione tra 4 varianti Bauhaus)
    const variant = idx % 4;

    if (variant === 0) {
      // Composizione Circolare Costruttivista
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(w * 0.42, h * 0.52, 170, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = primaryYellow;
      ctx.fillRect(w * 0.42, h * 0.32, 220, 220);

      ctx.fillStyle = primaryBlue;
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.72);
      ctx.lineTo(w * 0.75, h * 0.72);
      ctx.lineTo(w * 0.45, h * 0.22);
      ctx.closePath();
      ctx.fill();

      // Fascia diagonale
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.3);
      ctx.lineTo(w * 0.9, h * 0.7);
      ctx.stroke();
    } else if (variant === 1) {
      // Composizione ad Archi Concentrici e Blocchi Orizzontali
      ctx.fillStyle = primaryYellow;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.46, 210, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.46, 130, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0F1016';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.46, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = primaryCyan;
      ctx.fillRect(w * 0.12, h * 0.65, w * 0.76, 28);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(w * 0.25, h * 0.71, w * 0.5, 14);
    } else if (variant === 2) {
      // Composizione Diagonale Tectonica
      ctx.fillStyle = primaryBlue;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.15);
      ctx.lineTo(w, h * 0.45);
      ctx.lineTo(w, h * 0.85);
      ctx.lineTo(0, h * 0.55);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.25);
      ctx.lineTo(w * 0.85, h * 0.25);
      ctx.lineTo(w * 0.6, h * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = primaryYellow;
      ctx.beginPath();
      ctx.arc(w * 0.32, h * 0.45, 80, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Composizione Griglia Modulare e Sfere Isometriche
      ctx.fillStyle = accentColor;
      ctx.fillRect(w * 0.16, h * 0.28, 200, 200);

      ctx.fillStyle = primaryYellow;
      ctx.beginPath();
      ctx.arc(w * 0.64, h * 0.42, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(w * 0.38, h * 0.52, 180, 120);

      ctx.fillStyle = primaryBlue;
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.62, 70, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Cornice interna e mirini tecnici d'angolo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    const pad = 24;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

    // Mirini a croce agli angoli
    const crossSize = 10;
    const corners = [
      [pad + 12, pad + 12],
      [w - pad - 12, pad + 12],
      [pad + 12, h - pad - 12],
      [w - pad - 12, h - pad - 12]
    ];
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - crossSize, cy);
      ctx.lineTo(cx + crossSize, cy);
      ctx.moveTo(cx, cy - crossSize);
      ctx.lineTo(cx, cy + crossSize);
      ctx.stroke();
    });
  }

  getMaxScroll() {
    const containerW = this.container ? (this.container.clientWidth || 900) : 900;
    const spacing = this.sheetSpacing || 360;
    return Math.min(0, -(this.sheets.length * spacing - containerW + 120));
  }

  updateButtonStates() {
    const maxScroll = this.getMaxScroll();
    if (this.btnLeft) {
      const isStart = this.targetScrollX >= -5;
      this.btnLeft.classList.toggle('disabled', isStart);
      this.btnLeft.setAttribute('aria-disabled', isStart ? 'true' : 'false');
    }
    if (this.btnRight) {
      const isEnd = this.targetScrollX <= maxScroll + 5;
      this.btnRight.classList.toggle('disabled', isEnd);
      this.btnRight.setAttribute('aria-disabled', isEnd ? 'true' : 'false');
    }
  }

  setupControls() {
    this.btnLeft = document.getElementById('btn-wire-scroll-left');
    this.btnRight = document.getElementById('btn-wire-scroll-right');

    const scrollStep = (direction) => {
      const maxScroll = this.getMaxScroll();
      const step = this.sheetSpacing || 360;
      if (direction === 'left') {
        if (this.targetScrollX >= 0) return;
        this.targetScrollX = Math.min(0, this.targetScrollX + step);
      } else {
        if (this.targetScrollX <= maxScroll) return;
        this.targetScrollX = Math.max(maxScroll, this.targetScrollX - step);
      }
      if (window.audioEngine) window.audioEngine.playPaperFlutter();
      this.updateButtonStates();
    };

    // Scorrimento a scatti al click
    if (this.btnLeft) {
      this.btnLeft.addEventListener('click', (e) => {
        e.preventDefault();
        scrollStep('left');
      });
    }

    if (this.btnRight) {
      this.btnRight.addEventListener('click', (e) => {
        e.preventDefault();
        scrollStep('right');
      });
    }

    // Scorrimento continuo fluido tenendo premuto il tasto
    let holdInterval = null;
    let holdTimeout = null;

    const startHold = (direction) => {
      stopHold();
      holdTimeout = setTimeout(() => {
        holdInterval = setInterval(() => {
          const maxScroll = this.getMaxScroll();
          if (direction === 'left') {
            if (this.targetScrollX >= 0) {
              stopHold();
              return;
            }
            this.targetScrollX = Math.min(0, this.targetScrollX + 32);
          } else {
            if (this.targetScrollX <= maxScroll) {
              stopHold();
              return;
            }
            this.targetScrollX = Math.max(maxScroll, this.targetScrollX - 32);
          }
          this.updateButtonStates();
        }, 16);
      }, 180);
    };

    const stopHold = () => {
      if (holdTimeout) clearTimeout(holdTimeout);
      if (holdInterval) clearInterval(holdInterval);
      holdTimeout = null;
      holdInterval = null;
    };

    if (this.btnLeft) {
      this.btnLeft.addEventListener('mousedown', () => startHold('left'));
      this.btnLeft.addEventListener('mouseup', stopHold);
      this.btnLeft.addEventListener('mouseleave', stopHold);
      this.btnLeft.addEventListener('touchstart', () => startHold('left'), { passive: true });
      this.btnLeft.addEventListener('touchend', stopHold);
    }

    if (this.btnRight) {
      this.btnRight.addEventListener('mousedown', () => startHold('right'));
      this.btnRight.addEventListener('mouseup', stopHold);
      this.btnRight.addEventListener('mouseleave', stopHold);
      this.btnRight.addEventListener('touchstart', () => startHold('right'), { passive: true });
      this.btnRight.addEventListener('touchend', stopHold);
    }

    // Trackpad orizzontale facoltativo e non invasivo (zero interferenze col browser o la cronologia)
    if (this.container) {
      this.container.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5 && Math.abs(e.deltaX) > 4) {
          const maxScroll = this.getMaxScroll();
          this.targetScrollX = Math.min(0, Math.max(maxScroll, this.targetScrollX - e.deltaX * 0.75));
          this.updateButtonStates();
        }
      }, { passive: true });
    }

    window.addEventListener('resize', () => {
      this.updateButtonStates();
    });

    this.updateButtonStates();
  }

  openWireView() {
    this.isOpen = true;
    if (this.container) {
      this.container.classList.add('active');
      this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const toggleLabel = document.getElementById('wire-toggle-label');
    if (toggleLabel) toggleLabel.textContent = '✕ CHIUDI FILO DA STUDIO';

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
    if (toggleLabel) toggleLabel.textContent = '⤢ MOSTRA INTERO CATALOGO SU FILO DA STUDIO';

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
    this.updateButtonStates();

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

      const hoverScale = s.hovered ? 1.04 : 1.0;
      const hoverElevate = s.hovered ? -10 : 0;
      const hoverTilt = s.hovered ? -0.025 : 0;

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
