/**
 * designjack - Real-Time Bayer Matrix Dithering & Red "Smolecolamento" Engine
 * 
 * Channels the Channel [R] red particle physics:
 * When hovering over an image / project card, the artwork pixelates via
 * a Bayer 4x4 matrix and "smolecola" (disintegrates) into scattering glowing
 * red pixel particles (#E63946, #FF2A3A) that float and drift with inertia.
 */

const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5]
];

class RedSmolecolaCardDither {
  constructor(canvasElement, projectData) {
    this.canvas = canvasElement;
    this.project = projectData;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    this.isHovered = false;
    this.mouse = { x: -999, y: -999, speed: 0 };
    this.time = 0;
    this.scanY = 0;

    // Smolecola particles pool
    this.particles = [];
    this.maxParticles = 180;

    // Offscreen raw artwork buffer
    this.rawCanvas = document.createElement('canvas');
    this.rawCtx = this.rawCanvas.getContext('2d');

    this.pixelScale = 2;
    this.init();
  }

  init() {
    this.resize();
    this.renderArtwork(0);
    this.draw();

    const card = this.canvas.closest('.project-card');
    if (card) {
      card.addEventListener('mouseenter', (e) => {
        this.isHovered = true;
        this.updateMousePos(e);
        if (window.audioEngine) window.audioEngine.playDitherSmolecola();
        this.draw();
      });

      card.addEventListener('mousemove', (e) => {
        this.updateMousePos(e);
        this.spawnRedSmolecolaPixels();
      });

      card.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.mouse.x = -999;
        this.mouse.y = -999;
      });
    }
  }

  updateMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.mouse.x !== -999) {
      const dx = x - this.mouse.x;
      const dy = y - this.mouse.y;
      this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
    }
    this.mouse.x = x;
    this.mouse.y = y;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.floor(rect.width || 340);
    const h = Math.floor(rect.height || 220);

    this.pw = Math.floor(w / this.pixelScale);
    this.ph = Math.floor(h / this.pixelScale);

    this.canvas.width = w;
    this.canvas.height = h;

    this.rawCanvas.width = this.pw;
    this.rawCanvas.height = this.ph;
  }

  // Spawns disintegrating red pixel particles at cursor position
  spawnRedSmolecolaPixels() {
    if (!this.isHovered) return;

    const count = Math.min(12, Math.floor(3 + this.mouse.speed * 0.4));
    const redPalette = ['#E63946', '#FF2A3A', '#FF5C69', '#B01020', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.5;
      const spread = 20;

      this.particles.push({
        x: this.mouse.x + (Math.random() - 0.5) * spread,
        y: this.mouse.y + (Math.random() - 0.5) * spread,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5),
        vy: Math.sin(angle) * speed - 0.8,
        size: Math.random() > 0.4 ? 3 : 2,
        color: redPalette[Math.floor(Math.random() * redPalette.length)],
        alpha: 1.0,
        decay: 0.025 + Math.random() * 0.035
      });
    }

    if (Math.random() < 0.15 && window.audioEngine) {
      window.audioEngine.playDitherSmolecola();
    }
  }

  renderArtwork(t) {
    const ctx = this.rawCtx;
    const w = this.pw;
    const h = this.ph;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#F4F4F0';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(18, 18, 18, 0.09)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cat = (this.project.category || '').toLowerCase();

    if (cat.includes('interaction') || cat.includes('ux')) {
      ctx.fillStyle = '#E63946';
      ctx.beginPath();
      ctx.arc(w * 0.32 + Math.sin(t * 0.04) * 3, h * 0.48, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1D3557';
      ctx.fillRect(w * 0.48, h * 0.28, 38, 38);

      ctx.fillStyle = '#FFB703';
      ctx.beginPath();
      ctx.moveTo(w * 0.72, h * 0.72);
      ctx.lineTo(w * 0.88, h * 0.72);
      ctx.lineTo(w * 0.8, h * 0.38);
      ctx.closePath();
      ctx.fill();
    } else if (cat.includes('graphic') || cat.includes('brand')) {
      ctx.fillStyle = '#E63946';
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.15);
      ctx.lineTo(w * 0.85, h * 0.15);
      ctx.lineTo(w * 0.5, h * 0.85);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFB703';
      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.55, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#121212';
      ctx.fillRect(w * 0.15, h * 0.65, w * 0.4, 8);
    } else if (cat.includes('editorial')) {
      ctx.fillStyle = '#121212';
      ctx.fillRect(w * 0.12, h * 0.2, w * 0.76, 6);
      ctx.fillRect(w * 0.12, h * 0.3, w * 0.5, 4);

      ctx.fillStyle = '#E63946';
      ctx.fillRect(w * 0.12, h * 0.42, 34, 34);

      ctx.fillStyle = '#FFB703';
      ctx.beginPath();
      ctx.arc(w * 0.68, h * 0.6, 22, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const cx = w * 0.5;
      const cy = h * 0.5;
      const s = 24;

      ctx.fillStyle = '#FFB703';
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s * 0.866, cy - s * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - s * 0.866, cy - s * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1D3557';
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.866, cy - s * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + s);
      ctx.lineTo(cx - s * 0.866, cy + s * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#E63946';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + s * 0.866, cy - s * 0.5);
      ctx.lineTo(cx + s * 0.866, cy + s * 0.5);
      ctx.lineTo(cx, cy + s);
      ctx.closePath();
      ctx.fill();
    }

    // Clean art composition without filler code text
  }

  draw() {
    this.time++;
    this.renderArtwork(this.time);

    if (this.isHovered || this.particles.length > 0) {
      this.applyRedBayerDither();
      this.renderSmolecolaParticles();
      this.scanY = (this.scanY + 2.5) % this.canvas.height;
      requestAnimationFrame(() => this.draw());
    } else {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.drawImage(this.rawCanvas, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  applyRedBayerDither() {
    const srcImg = this.rawCtx.getImageData(0, 0, this.pw, this.ph);
    const src = srcImg.data;

    const outImg = this.ctx.createImageData(this.pw, this.ph);
    const dst = outImg.data;

    const bayer = BAYER_4X4;

    for (let y = 0; y < this.ph; y++) {
      const by = y % 4;
      const rowOffset = y * this.pw;

      for (let x = 0; x < this.pw; x++) {
        const idx = (rowOffset + x) * 4;
        const bx = x % 4;

        const r = src[idx + 0];
        const g = src[idx + 1];
        const b = src[idx + 2];

        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
        const threshold = bayer[by][bx] / 16.0;

        if (lum > threshold) {
          if (r > 160 && g > 130) {
            dst[idx + 0] = 255;
            dst[idx + 1] = 183;
            dst[idx + 2] = 3;
          } else {
            dst[idx + 0] = 244;
            dst[idx + 1] = 244;
            dst[idx + 2] = 240;
          }
        } else {
          if (r > 120 || lum > threshold * 0.5) {
            dst[idx + 0] = 230;
            dst[idx + 1] = 57;
            dst[idx + 2] = 70;
          } else {
            dst[idx + 0] = 18;
            dst[idx + 1] = 18;
            dst[idx + 2] = 22;
          }
        }
        dst[idx + 3] = 255;
      }
    }

    this.ctx.imageSmoothingEnabled = false;
    createImageBitmap(outImg).then(bmp => {
      this.ctx.drawImage(bmp, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'rgba(230, 57, 70, 0.35)';
      this.ctx.fillRect(0, this.scanY, this.canvas.width, 3);
    }).catch(() => {});
  }

  renderSmolecolaParticles() {
    const ctx = this.ctx;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      ctx.restore();
    }
  }
}

window.initDitherEngines = function() {
  window.cardDithers = [];
  document.querySelectorAll('.project-card-canvas').forEach(canvas => {
    const card = canvas.closest('.project-card');
    const projId = card ? card.getAttribute('data-project-id') : null;
    const projData = (window.PROJECT_REGISTRY || []).find(p => p.id === projId) || { code: 'R-PROJ', category: 'Graphic Design' };
    const engine = new RedSmolecolaCardDither(canvas, projData);
    window.cardDithers.push(engine);
  });
};
