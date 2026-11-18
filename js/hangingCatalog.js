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
    // le didascalie dei manifesti usano Montserrat: ridisegna quando il font è pronto
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load('700 22px Montserrat'), document.fonts.load('500 16px Montserrat')]).then(() => {
        const projects = window.PROJECT_REGISTRY || [];
        this.wireTrack.querySelectorAll('.hanging-sheet').forEach((sheet, idx) => {
          const cvs = sheet.querySelector('.sheet-photo-canvas');
          if (!cvs) return;
          this.drawSheetGraphic(cvs, projects[idx], idx);
          const old = sheet.querySelector('.sheet-dither-canvas');
          if (old) old.remove();
          delete sheet.dataset.dither;
        });
        if (window.initDitherEngines) window.initDitherEngines();
      }).catch(() => {});
    }
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

    // Manifesto Bauhaus su carta invecchiata (stile della moodboard del Canale R)
    const RED = '#D93D2A', YEL = '#EEA824', BLU = '#1D3557', INK = '#151413', PAPER = '#F1E8D4';
    const accent = proj.colorHex && /^#/.test(proj.colorHex) ? proj.colorHex : RED;
    const rnd = (() => { let t = (idx + 1) * 9973; return () => { t = (t * 16807) % 2147483647; return t / 2147483647; }; })();

    // 1. Carta: fondo caldo, vignettatura e grana
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.75);
    vg.addColorStop(0, 'rgba(255,250,238,0.35)');
    vg.addColorStop(1, 'rgba(150,110,60,0.22)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    const grain = ctx.getImageData(0, 0, w, h);
    for (let i = 0; i < grain.data.length; i += 4) {
      const n = (rnd() - 0.5) * 18;
      grain.data[i] += n; grain.data[i + 1] += n; grain.data[i + 2] += n * 0.8;
    }
    ctx.putImageData(grain, 0, 0);

    const hair = (x1, y1, x2, y2, lw) => { ctx.strokeStyle = INK; ctx.lineWidth = lw || 1.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
    const hatch = (x, y, ww, hh, gap) => { ctx.strokeStyle = INK; ctx.lineWidth = 1.4; for (let k = x; k < x + ww; k += gap) { ctx.beginPath(); ctx.moveTo(k, y); ctx.lineTo(k, y + hh); ctx.stroke(); } };
    const disc = (x, y, r, col, a0, a1) => { ctx.fillStyle = col; ctx.beginPath(); if (a0 !== undefined) ctx.moveTo(x, y); ctx.arc(x, y, r, a0 || 0, a1 === undefined ? Math.PI * 2 : a1); ctx.closePath(); ctx.fill(); };

    // 2. Composizioni (quattro varianti a rotazione)
    ctx.save();
    ctx.globalAlpha = 0.94;
    const variant = idx % 4;
    if (variant === 0) {
      // sole, blocco blu, mezzo disco nero (come il primo manifesto della moodboard)
      disc(w * 0.62, h * 0.3, 150, accent);
      ctx.fillStyle = BLU; ctx.fillRect(w * 0.08, h * 0.3, 250, 290);
      ctx.fillStyle = YEL; ctx.fillRect(w * 0.44, h * 0.47, 170, 170);
      disc(w * 0.38, h * 0.66, 120, INK, -Math.PI / 2, Math.PI / 2);
      ctx.fillStyle = RED; ctx.fillRect(w * 0.08, h * 0.63, 110, 120);
      hatch(w * 0.8, h * 0.18, 70, 230, 9);
      disc(w * 0.16, h * 0.12, 30, INK);
      hair(w * 0.06, h * 0.22, w * 0.94, h * 0.22);
      hair(w * 0.85, h * 0.08, w * 0.85, h * 0.86);
    } else if (variant === 1) {
      // archi e cerchio rosso con lama nera (secondo manifesto)
      ctx.strokeStyle = YEL; ctx.lineWidth = 42;
      ctx.beginPath(); ctx.arc(w * 0.46, h * 0.36, 175, Math.PI * 0.95, Math.PI * 1.75); ctx.stroke();
      disc(w * 0.56, h * 0.4, 145, accent);
      ctx.fillStyle = INK; ctx.save(); ctx.translate(w * 0.62, h * 0.24); ctx.rotate(-0.4);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(210, -30); ctx.lineTo(120, 120); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.fillStyle = BLU; ctx.fillRect(w * 0.6, h * 0.58, 120, 220);
      ctx.fillStyle = YEL; ctx.fillRect(w * 0.54, h * 0.72, 70, 170);
      ctx.fillStyle = RED; ctx.fillRect(w * 0.66, h * 0.6, 30, 130);
      hair(w * 0.12, h * 0.4, w * 0.62, h * 0.4, 6);
      ctx.save(); ctx.beginPath(); ctx.moveTo(w * 0.14, h * 0.6); ctx.lineTo(w * 0.42, h * 0.9); ctx.lineTo(w * 0.2, h * 0.92); ctx.closePath(); ctx.clip();
      for (let k = -h; k < w; k += 10) hair(k, h * 0.55, k + 300, h * 0.95, 1.2);
      ctx.restore();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(w * 0.32, h * 0.66); ctx.lineTo(w * 0.52, h * 0.66); ctx.lineTo(w * 0.44, h * 0.9); ctx.closePath(); ctx.fill();
    } else if (variant === 2) {
      // griglia costruttivista e diagonale
      ctx.fillStyle = BLU;
      ctx.beginPath(); ctx.moveTo(0, h * 0.2); ctx.lineTo(w, h * 0.46); ctx.lineTo(w, h * 0.7); ctx.lineTo(0, h * 0.44); ctx.closePath(); ctx.fill();
      disc(w * 0.34, h * 0.36, 108, YEL);
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.92, h * 0.5); ctx.lineTo(w * 0.71, h * 0.82); ctx.closePath(); ctx.fill();
      disc(w * 0.2, h * 0.74, 56, INK);
      hatch(w * 0.08, h * 0.08, 140, 90, 8);
      hair(w * 0.1, h * 0.92, w * 0.9, h * 0.06, 2);
      [0.25, 0.5, 0.75].forEach(f => hair(w * f, h * 0.86, w * f, h * 0.94, 2));
    } else {
      // quadrati, cerchi e tratteggi (variante modulare)
      ctx.fillStyle = accent; ctx.fillRect(w * 0.1, h * 0.14, 230, 230);
      disc(w * 0.66, h * 0.36, 125, YEL);
      ctx.fillStyle = INK; ctx.fillRect(w * 0.36, h * 0.48, 240, 26);
      ctx.fillStyle = BLU; ctx.fillRect(w * 0.18, h * 0.56, 180, 230);
      disc(w * 0.72, h * 0.72, 90, INK, Math.PI, Math.PI * 2);
      disc(w * 0.72, h * 0.72, 90, RED, 0, Math.PI);
      hatch(w * 0.56, h * 0.8, 160, 90, 9);
      disc(w * 0.88, h * 0.1, 20, INK);
    }
    ctx.restore();

    // 3. Didascalia tipografica da manifesto
    const code = String(idx + 1).padStart(2, '0');
    ctx.fillStyle = INK;
    ctx.font = '700 22px "Montserrat", "Helvetica Neue", Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('R-' + code, 36, h - 40);
    ctx.font = '500 16px "Montserrat", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(proj.category || '').toUpperCase().slice(0, 24) + ' · ' + (proj.year || ''), w - 36, h - 40);
    ctx.textAlign = 'left';
    hair(36, h - 70, w - 36, h - 70, 1.5);
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

window.HangingCatalogWire = HangingCatalogWire;

window.initHangingCatalog = function() {
  window.hangingCatalog = new HangingCatalogWire('hanging-catalog-stage');
};
