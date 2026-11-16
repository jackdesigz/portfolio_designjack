/**
 * designjack - Main Application Orchestrator
 * Cleaned: Removed all filler telemetry (clock, coordinates, FPS, hex codes).
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloaderWithCRT();
  initChannelSwitcherCRT();
  initSystemSoundToggle();
  initFullscreenInstagramCatalog();

  // Initialize subsystem engines
  if (window.initHeroSphere) window.initHeroSphere();
  if (window.initHangingCatalog) window.initHangingCatalog();
  if (window.initDitherEngines) window.initDitherEngines();
  if (window.initCraneMachine) window.initCraneMachine();
  if (window.initModalManager) window.initModalManager();
  if (window.initMagicFlute) window.initMagicFlute();
});

// ---------------------------------------------------------------------
// 1. CRT SCREEN TRANSITION SYSTEM
// ---------------------------------------------------------------------
window.triggerCRTTransition = function(onMidpoint, onComplete) {
  const crt = document.getElementById('crt-transition-fx');
  if (!crt) {
    if (onMidpoint) onMidpoint();
    if (onComplete) onComplete();
    return;
  }

  // 1. Play CRT high-pitch capacitor discharge & snap
  try {
    if (window.audioEngine) window.audioEngine.playCRTShutdown();
  } catch (e) {}

  // 2. Shut down: picture collapses smoothly into horizontal phosphor line then dot
  crt.className = 'active shutting-down';

  // 3. Midpoint: beam collapsed, screen is 100% solid, impenetrable black
  setTimeout(() => {
    // Lock in solid black backdrop so DOM updates are 100% invisible
    crt.className = 'active blackout';

    try {
      if (onMidpoint) onMidpoint();
    } catch (e) {
      console.warn('CRT midpoint callback error:', e);
    }

    // Force synchronous browser layout reflow while completely hidden
    void crt.offsetHeight;

    // Use double rAF to guarantee browser finished layout & first paint of arrival view
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 4. Brief cathode pause before bloom
        setTimeout(() => {
          try {
            if (window.audioEngine) window.audioEngine.playCRTPowerOn();
          } catch (e) {}

          // 5. Power on: dot expands into line and blooms vertically
          crt.className = 'active powering-on';

          // 6. Complete transition and hide overlay when bloom is fully done
          setTimeout(() => {
            crt.className = '';
            try {
              if (onComplete) onComplete();
            } catch (e) {}
          }, 480);
        }, 50);
      });
    });
  }, 320);

  // Safety fallback
  setTimeout(() => {
    if (crt && crt.classList.contains('active')) {
      crt.className = '';
      if (onComplete) onComplete();
    }
  }, 1800);
};

// ---------------------------------------------------------------------
// 2. INTRO / PRELOADER WITH CRT MONITOR TRANSITION
// ---------------------------------------------------------------------
function initPreloaderWithCRT() {
  const preloader = document.getElementById('preloader');
  const jackEl = document.getElementById('preloader-jack');
  const progressFill = document.getElementById('preloader-progress-fill');
  const skipBtn = document.getElementById('preloader-skip');
  const mainApp = document.getElementById('main-app');

  if (!preloader || !jackEl) return;

  const fontStyles = [
    { font: "'Press Start 2P', monospace", color: '#FFB703' },
    { font: "'Playfair Display', serif", color: '#E63946' },
    { font: "'JetBrains Mono', monospace", color: '#1D3557' },
    { font: "'Syne', sans-serif", color: '#FFFFFF' },
    { font: "'Permanent Marker', cursive", color: '#FFB703' },
    { font: "'UnifrakturMaguntia', cursive", color: '#E63946' },
    { font: "'Bungee Shade', cursive", color: '#1D3557' }
  ];

  let step = 0;
  const totalDuration = 2200;
  const stepInterval = 70;
  const startTime = performance.now();
  let preloaderActive = true;

  const cycleInterval = setInterval(() => {
    if (!preloaderActive) {
      clearInterval(cycleInterval);
      return;
    }

    const current = fontStyles[step % fontStyles.length];
    jackEl.style.fontFamily = current.font;
    jackEl.style.color = current.color;

    if (window.audioEngine) window.audioEngine.playTick();

    const elapsed = performance.now() - startTime;
    const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
    if (progressFill) progressFill.style.width = `${progress}%`;

    step++;
  }, stepInterval);

  const executeCRTShutdownTransition = () => {
    if (!preloaderActive) return;
    preloaderActive = false;
    clearInterval(cycleInterval);

    window.triggerCRTTransition(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => { preloader.style.display = 'none'; }, 200);
      if (mainApp) mainApp.classList.remove('preload-hidden');
    });
  };

  setTimeout(executeCRTShutdownTransition, totalDuration);

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      executeCRTShutdownTransition();
    });
  }
}

// ---------------------------------------------------------------------
// 3. CHANNEL SWITCHER (R / G / B) CON TRANSIZIONE CRT
// ---------------------------------------------------------------------
function initChannelSwitcherCRT() {
  const tabR = document.getElementById('channel-btn-r');
  const tabG = document.getElementById('channel-btn-g');
  const tabB = document.getElementById('channel-btn-b');
  const btnReturnG = document.getElementById('btn-return-channel-r-from-g');
  const btnReturnB = document.getElementById('btn-return-channel-r-from-b');
  const toast = document.getElementById('channel-toast');
  const brandSuffix = document.getElementById('nav-brand-suffix');

  const viewR = document.getElementById('channel-view-r');
  const viewG = document.getElementById('channel-view-g');
  const viewB = document.getElementById('channel-view-b');

  let currentChannel = 'R';
  let isTransitioning = false;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2800);
  };

  const switchChannel = (target) => {
    if (target === currentChannel || isTransitioning) return;
    isTransitioning = true;

    // Fade out departure view smoothly as the CRT collapses
    const fromView = currentChannel === 'R' ? viewR : (currentChannel === 'G' ? viewG : viewB);
    if (fromView) {
      fromView.classList.add('transition-out');
    }

    window.triggerCRTTransition(
      () => {
        // Midpoint: screen is 100% blacked out behind the curtain
        currentChannel = target;

        // Reset all views & tabs
        [tabR, tabG, tabB].forEach(t => t && t.classList.remove('active'));
        [viewR, viewG, viewB].forEach(v => {
          if (v) {
            v.classList.remove('active', 'transition-out');
            v.style.display = 'none';
          }
        });
        document.body.classList.remove('channel-g-active', 'channel-b-active');

        // Instant scroll to top while invisible
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const targetView = target === 'R' ? viewR : (target === 'G' ? viewG : viewB);
        if (targetView) {
          targetView.style.display = 'flex';
          targetView.classList.add('active');
        }

        if (target === 'R') {
          if (tabR) tabR.classList.add('active');
          if (brandSuffix) brandSuffix.textContent = 'jack';

          showToast('Canale R // Bauhaus Works & Arcade');

          // Wake up 3D viewports and render fresh frame while hidden
          if (window.heroSphere && window.heroSphere.onResize) window.heroSphere.onResize();
          if (window.craneMachine && window.craneMachine.onResize) window.craneMachine.onResize();
          if (window.hangingCatalog && window.hangingCatalog.updateButtonStates) {
            window.hangingCatalog.updateButtonStates();
          }
        } else if (target === 'G') {
          if (tabG) tabG.classList.add('active');
          document.body.classList.add('channel-g-active');
          if (brandSuffix) brandSuffix.textContent = 'febi';

          showToast('Canale G // Organic & Street');
          if (window.audioEngine) window.audioEngine.playSprayCan();
        } else if (target === 'B') {
          if (tabB) tabB.classList.add('active');
          document.body.classList.add('channel-b-active');
          if (brandSuffix) brandSuffix.textContent = 'marine';

          showToast('Canale B // Calm Marine & Contatti');
          if (window.audioEngine) window.audioEngine.playWaterDrop();
          initMarineBubbles();
        }
      },
      () => {
        // Clear any leftover inline styles and release transition lock
        [viewR, viewG, viewB].forEach(v => {
          if (v) v.style.display = '';
        });
        isTransitioning = false;
      }
    );
  };

  if (tabR) {
    tabR.addEventListener('click', (e) => {
      e.preventDefault();
      switchChannel('R');
    });
  }

  if (tabG) {
    tabG.addEventListener('click', (e) => {
      e.preventDefault();
      switchChannel('G');
    });
  }

  if (tabB) {
    tabB.addEventListener('click', (e) => {
      e.preventDefault();
      switchChannel('B');
    });
  }

  if (btnReturnG) {
    btnReturnG.addEventListener('click', (e) => {
      e.preventDefault();
      switchChannel('R');
    });
  }

  if (btnReturnB) {
    btnReturnB.addEventListener('click', (e) => {
      e.preventDefault();
      switchChannel('R');
    });
  }

  // Expose global channel switcher for Flauto Magico and external triggers
  window.switchChannel = (target) => {
    if (!target) return;
    switchChannel(target.toUpperCase());
  };
}

// ---------------------------------------------------------------------
// 3B. CANALE B: INTERACTIVE MARINE FLOATING BUBBLES
// ---------------------------------------------------------------------
function initMarineBubbles() {
  const container = document.getElementById('marine-bubbles-container');
  if (!container) return;

  container.innerHTML = '';
  const bubbleCount = 20;

  for (let i = 0; i < bubbleCount; i++) {
    spawnMarineBubble(container);
  }
}

function spawnMarineBubble(container) {
  if (!container) return;
  const bubble = document.createElement('div');
  bubble.className = 'marine-bubble';

  const size = Math.floor(18 + Math.random() * 52);
  const left = Math.floor(4 + Math.random() * 92);
  const dur = (6 + Math.random() * 8).toFixed(2);
  const delay = (Math.random() * 5).toFixed(2);
  const swayDur = (2.5 + Math.random() * 3).toFixed(2);

  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}%`;
  bubble.style.animationDuration = `${dur}s, ${swayDur}s`;
  bubble.style.animationDelay = `${delay}s, 0s`;

  // Inner glistening highlight
  const highlight = document.createElement('div');
  highlight.className = 'bubble-highlight';
  bubble.appendChild(highlight);

  // Hover or click pops bubble with gentle water droplet sound
  const popBubble = () => {
    if (bubble.classList.contains('popping')) return;
    bubble.classList.add('popping');
    if (window.audioEngine) window.audioEngine.playWaterDrop();

    setTimeout(() => {
      bubble.remove();
      spawnMarineBubble(container);
    }, 280);
  };

  bubble.addEventListener('mouseenter', popBubble);
  bubble.addEventListener('click', popBubble);

  container.appendChild(bubble);
}

// ---------------------------------------------------------------------
// 4. FULLSCREEN INSTAGRAM-STYLE CATALOG WITH FILTER HOVER HIGHLIGHT
// ---------------------------------------------------------------------
function initFullscreenInstagramCatalog() {
  const btnOpen = document.getElementById('btn-open-full-catalog');
  const btnClose = document.getElementById('btn-close-full-catalog');
  const modal = document.getElementById('fullscreen-catalog-modal');
  const grid = document.getElementById('instagram-project-grid');
  const filterBtns = document.querySelectorAll('.insta-filter-pill');

  if (!grid) return;

  const projects = window.PROJECT_REGISTRY || [];
  let activeFilter = 'all';

  // 1. Render Instagram-style project cards (Visual Only)
  grid.innerHTML = '';
  projects.forEach((proj, idx) => {
    const card = document.createElement('article');
    card.className = 'insta-project-card';
    card.setAttribute('data-category', proj.category);
    card.setAttribute('data-project-id', proj.id);

    card.innerHTML = `
      <canvas class="insta-card-canvas" width="340" height="340"></canvas>
      <div class="insta-card-overlay">
        <span class="insta-overlay-cat" style="color: ${proj.colorHex || '#E63946'}; border-color: ${proj.colorHex || '#E63946'};">
          ${proj.category.toUpperCase()}
        </span>
        <h3 class="insta-overlay-title">${proj.title}</h3>
        <p class="insta-overlay-desc">${proj.description}</p>
        <span class="insta-overlay-btn">VEDI SCHEDA PROGETTO →</span>
      </div>
    `;

    grid.appendChild(card);

    // Draw visual artwork on canvas
    const cvs = card.querySelector('.insta-card-canvas');
    if (cvs) {
      drawInstagramProjectArtwork(cvs, proj, idx);
    }

    // Card Hover Sound & Click
    card.addEventListener('mouseenter', () => {
      if (window.audioEngine) window.audioEngine.playTick();
    });

    card.addEventListener('click', () => {
      if (window.audioEngine) window.audioEngine.playBeep(880, 0.05);
      if (window.openProjectModal) {
        window.openProjectModal(proj);
      }
    });
  });

  // 2. Interactive Filter Hover Highlight:
  // "quando passi sopra uno dei filtri tutti gli elementi nella griglia con quel filtro si illuminano"
  filterBtns.forEach(btn => {
    const cat = btn.getAttribute('data-filter') || 'all';

    // Hover Highlight
    btn.addEventListener('mouseenter', () => {
      const allCards = grid.querySelectorAll('.insta-project-card');
      allCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        const isMatch = (cat === 'all' || cardCat.toLowerCase() === cat.toLowerCase());

        if (isMatch) {
          card.classList.add('filter-illuminated');
          card.classList.remove('filter-dimmed');
        } else {
          card.classList.remove('filter-illuminated');
          card.classList.add('filter-dimmed');
        }
      });

      if (window.audioEngine) window.audioEngine.playBeep(680, 0.03);
    });

    btn.addEventListener('mouseleave', () => {
      const allCards = grid.querySelectorAll('.insta-project-card');
      allCards.forEach(card => {
        card.classList.remove('filter-illuminated');
        card.classList.remove('filter-dimmed');
      });
    });

    // Filter Click Selection
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = cat;

      const allCards = grid.querySelectorAll('.insta-project-card');
      allCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        const matches = (activeFilter === 'all' || cardCat.toLowerCase() === activeFilter.toLowerCase());
        card.style.display = matches ? 'block' : 'none';
      });

      if (window.audioEngine) window.audioEngine.playBeep(840, 0.04);
    });
  });

  // 3. Open & Close Fullscreen Modal
  const openModal = () => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    if (window.audioEngine) {
      window.audioEngine.playPaperFlutter();
      window.audioEngine.playBeep(920, 0.05);
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (window.audioEngine) window.audioEngine.playBeep(520, 0.04);
  };

  if (btnOpen) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    // Non chiudere il catalogo se sopra c'è aperto il modale del progetto o il lightbox
    const projModal = document.getElementById('project-modal-overlay');
    const lightbox = document.getElementById('project-lightbox');
    if (projModal && projModal.classList.contains('active')) return;
    if (lightbox && lightbox.classList.contains('active')) return;

    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Procedural visual artwork generator for Instagram-style tiles
function drawInstagramProjectArtwork(canvas, proj, idx) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Se il progetto ha una cover reale (come Echo Sound Festival), la disegniamo
  if (proj.coverImage) {
    const img = new Image();
    img.onload = () => {
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, w, h);
    };
    img.src = proj.coverImage;
    return;
  }

  // Background
  ctx.fillStyle = idx % 2 === 0 ? '#0B0B10' : '#101016';
  ctx.fillRect(0, 0, w, h);

  // Fine cyber grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Geometric Bauhaus Composition
  const col = proj.colorHex || '#E63946';

  ctx.save();
  // Central dominant shape
  if (idx % 3 === 0) {
    // Bauhaus Circle with glowing rim
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(w * 0.45, h * 0.46, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB703';
    ctx.fillRect(w * 0.52, h * 0.22, 60, 60);

    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.85);
    ctx.lineTo(w * 0.55, h * 0.85);
    ctx.lineTo(w * 0.375, h * 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (idx % 3 === 1) {
    // Bauhaus Diagonal Tectonic composition
    ctx.fillStyle = '#1D3557';
    ctx.fillRect(w * 0.15, h * 0.15, 120, 180);

    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(w * 0.62, h * 0.58, 65, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFB703';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.35, 35, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Bauhaus Tripartite Constructivist balance
    ctx.fillStyle = '#FFB703';
    ctx.fillRect(w * 0.25, h * 0.2, 130, 130);

    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.82);
    ctx.lineTo(w * 0.85, h * 0.82);
    ctx.lineTo(w * 0.625, h * 0.38);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.arc(w * 0.32, h * 0.68, 48, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Halftone / Bayer Dither Texture Overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  for (let py = 12; py < h; py += 16) {
    for (let px = 12; px < w; px += 16) {
      if ((px + py) % 32 === 0) {
        ctx.fillRect(px, py, 2, 2);
      }
    }
  }

  // Minimalist Bauhaus Typo Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText(proj.code || `R-0${idx + 1}`, 20, 36);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, w - 32, h - 32);
}

function initSystemSoundToggle() {
  const toggleBtn = document.getElementById('hud-audio-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (window.audioEngine) {
      const isMuted = window.audioEngine.toggleMute();
      toggleBtn.textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: ON';
      toggleBtn.classList.toggle('muted', isMuted);
      if (!isMuted) window.audioEngine.playBeep(640, 0.05);
    }
  });
}
