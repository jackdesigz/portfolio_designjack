/**
 * designjack - Magic Flute (Ocarina of Time style)
 * 5 Notes: R, T, Y, U, I
 * Melodies:
 *   - Song of Red (Canale R): R - T - Y - R
 *   - Song of Green (Canale G): T - Y - U - T
 *   - Song of Blue (Canale B): Y - U - I - Y
 */

class MagicFlute {
  constructor() {
    this.isOpen = false;
    this.noteBuffer = [];
    this.bufferTimeout = null;
    this.targetChannel = null;

    this.cacheElements();
    this.initMelodies();
    this.bindEvents();
  }

  cacheElements() {
    this.modal = document.getElementById('magic-flute-modal');
    this.openBtn = document.getElementById('btn-open-flute');
    this.closeBtn = document.getElementById('btn-close-flute');
    this.clearBtn = document.getElementById('btn-flute-clear-notes');
    this.staveContainer = document.getElementById('flute-notes-buffer');
    this.holeButtons = document.querySelectorAll('.flute-hole-btn');

    // Prompt Elements
    this.promptEl = document.getElementById('flute-teleport-prompt');
    this.promptTitle = document.getElementById('prompt-melody-title');
    this.promptMsg = document.getElementById('prompt-melody-msg');
    this.promptCancelBtn = document.getElementById('btn-flute-prompt-cancel');
    this.promptConfirmBtn = document.getElementById('btn-flute-prompt-confirm');

    this.sheetCards = {
      'r': document.getElementById('sheet-song-r'),
      'g': document.getElementById('sheet-song-g'),
      'b': document.getElementById('sheet-song-b')
    };
  }

  initMelodies() {
    this.melodies = [
      {
        channel: 'R',
        name: 'Canale R (Archivio & Toy Claw)',
        sequence: ['R', 'T', 'Y', 'R'],
        sheetEl: this.sheetCards.r
      },
      {
        channel: 'G',
        name: 'Canale G (Jacopo Febi // Organic & Street)',
        sequence: ['T', 'Y', 'U', 'T'],
        sheetEl: this.sheetCards.g
      },
      {
        channel: 'B',
        name: 'Canale B (Contatti // Calm Ocean)',
        sequence: ['Y', 'U', 'I', 'Y'],
        sheetEl: this.sheetCards.b
      }
    ];
  }

  bindEvents() {
    // 1. Document-level Event Delegation for 100% click reliability
    document.addEventListener('click', (e) => {
      // Trigger Open Flute Button
      const openTrigger = e.target.closest('#btn-open-flute');
      if (openTrigger) {
        e.preventDefault();
        e.stopPropagation();
        this.open();
        return;
      }

      // Close Flute Button
      const closeTrigger = e.target.closest('#btn-close-flute');
      if (closeTrigger) {
        e.preventDefault();
        e.stopPropagation();
        this.close();
        return;
      }

      // Clear Stave Notes Button
      const clearTrigger = e.target.closest('#btn-flute-clear-notes');
      if (clearTrigger) {
        e.preventDefault();
        e.stopPropagation();
        this.clearBuffer();
        return;
      }

      // Hole Note Buttons
      const holeTrigger = e.target.closest('.flute-hole-btn');
      if (holeTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const note = holeTrigger.dataset.note;
        if (note) this.playNote(note.toUpperCase());
        return;
      }

      // Prompt Cancel
      const cancelTrigger = e.target.closest('#btn-flute-prompt-cancel');
      if (cancelTrigger) {
        e.preventDefault();
        e.stopPropagation();
        this.closePrompt();
        return;
      }

      // Prompt Confirm Teleport
      const confirmTrigger = e.target.closest('#btn-flute-prompt-confirm');
      if (confirmTrigger) {
        e.preventDefault();
        e.stopPropagation();
        this.executeTeleport();
        return;
      }

      // Click outside modal window to dismiss
      if (this.isOpen && this.modal && e.target === this.modal) {
        this.close();
      }
    });

    // 2. Keyboard listener for R, T, Y, U, I and ESC
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        if (this.promptEl && this.promptEl.style.display !== 'none') {
          this.closePrompt();
        } else {
          this.close();
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (['R', 'T', 'Y', 'U', 'I'].includes(key)) {
        e.preventDefault();
        this.playNote(key);
      }
    });
  }

  open() {
    this.cacheElements();
    this.isOpen = true;

    if (this.modal) {
      this.modal.classList.add('open');
      this.modal.style.display = 'flex';
      this.modal.style.opacity = '1';
      this.modal.style.pointerEvents = 'auto';
    }

    this.clearBuffer();
    this.closePrompt();

    // Sound effect & AudioContext resume
    if (window.audioEngine) {
      try {
        window.audioEngine.ensureContext();
        window.audioEngine.playWaterDrop();
      } catch (e) {}
    }
  }

  close() {
    this.isOpen = false;

    if (this.modal) {
      this.modal.classList.remove('open');
      this.modal.style.display = 'none';
      this.modal.style.opacity = '0';
      this.modal.style.pointerEvents = 'none';
    }

    this.closePrompt();
    this.clearBuffer();
  }

  playNote(note) {
    if (!this.isOpen) return;

    // 1. Audio synthesis
    if (window.audioEngine) {
      try {
        window.audioEngine.playFluteNote(note);
      } catch (e) {
        console.warn('Flute sound failed:', e);
      }
    }

    // 2. Visual hole feedback
    this.triggerHoleVisual(note);

    // 3. Add to sequence buffer
    this.noteBuffer.push(note);
    if (this.noteBuffer.length > 8) {
      this.noteBuffer.shift();
    }
    this.renderStave();

    // 4. Reset auto-clear timer (clears after 6s of inactivity)
    clearTimeout(this.bufferTimeout);
    this.bufferTimeout = setTimeout(() => {
      this.clearBuffer();
    }, 6000);

    // 5. Check if a melody matches
    this.checkMelodyMatch();
  }

  triggerHoleVisual(note) {
    const buttons = document.querySelectorAll('.flute-hole-btn');
    buttons.forEach(b => {
      if (b.dataset.note === note) {
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 250);
      }
    });
  }

  renderStave() {
    if (!this.staveContainer) {
      this.staveContainer = document.getElementById('flute-notes-buffer');
    }
    if (!this.staveContainer) return;

    if (this.noteBuffer.length === 0) {
      this.staveContainer.innerHTML = '<span class="stave-placeholder">SUONA UNA NOTA...</span>';
      return;
    }

    this.staveContainer.innerHTML = '';
    this.noteBuffer.forEach((n, idx) => {
      const badge = document.createElement('span');
      badge.className = `stave-note-badge note-${n.toLowerCase()}`;
      badge.textContent = n;
      badge.style.animationDelay = `${idx * 0.04}s`;
      this.staveContainer.appendChild(badge);
    });
  }

  clearBuffer() {
    this.noteBuffer = [];
    clearTimeout(this.bufferTimeout);
    this.renderStave();

    // Remove sheet card highlight
    const cards = [
      document.getElementById('sheet-song-r'),
      document.getElementById('sheet-song-g'),
      document.getElementById('sheet-song-b')
    ];
    cards.forEach(el => {
      if (el) el.classList.remove('melody-unlocked');
    });
  }

  checkMelodyMatch() {
    if (this.noteBuffer.length < 4) return;

    for (const mel of this.melodies) {
      const seq = mel.sequence;
      const lastFour = this.noteBuffer.slice(-seq.length);
      const isMatch = lastFour.every((note, i) => note === seq[i]);

      if (isMatch) {
        this.onMelodySuccess(mel);
        break;
      }
    }
  }

  onMelodySuccess(melody) {
    // 1. Play Zelda Mystery Fanfare
    if (window.audioEngine) {
      try {
        window.audioEngine.playMelodyFanfare();
      } catch (e) {}
    }

    // 2. Highlight matching sheet card
    const sheetEl = document.getElementById(`sheet-song-${melody.channel.toLowerCase()}`);
    if (sheetEl) {
      sheetEl.classList.add('melody-unlocked');
    }

    // 3. Open confirmation prompt
    this.targetChannel = melody.channel;
    if (this.promptTitle) {
      this.promptTitle.textContent = `Hai suonato la Melodia di ${melody.sequence.join(' - ')}!`;
    }
    if (this.promptMsg) {
      this.promptMsg.innerHTML = `Melodia corretta! Vuoi procedere ad andare a destinazione <strong>${melody.name}</strong>?`;
    }

    if (this.promptEl) {
      this.promptEl.style.display = 'flex';
      this.promptEl.classList.add('active');
    }
  }

  closePrompt() {
    if (!this.promptEl) {
      this.promptEl = document.getElementById('flute-teleport-prompt');
    }
    if (this.promptEl) {
      this.promptEl.style.display = 'none';
      this.promptEl.classList.remove('active');
    }
    this.clearBuffer();
  }

  executeTeleport() {
    const dest = (this.targetChannel || 'R').toUpperCase();
    this.close();

    // Check if user is already in that channel
    const currentView = document.querySelector('.channel-view.active');
    const isAlreadyThere = currentView && currentView.id === `channel-view-${dest.toLowerCase()}`;

    if (isAlreadyThere) {
      const toast = document.getElementById('channel-toast');
      if (toast) {
        toast.textContent = `Sei già nel Canale [${dest}]! Prova a suonare una melodia per gli altri canali.`;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3200);
      }
      return;
    }

    // Primary teleport via global window.switchChannel
    if (typeof window.switchChannel === 'function') {
      window.switchChannel(dest);
    } else {
      // Fallback: click channel tab directly
      const tab = document.getElementById(`channel-btn-${dest.toLowerCase()}`);
      if (tab) tab.click();
    }
  }
}

// Global initialization function
window.initMagicFlute = function() {
  if (!window.magicFlute) {
    window.magicFlute = new MagicFlute();
  }
};

// Auto-run if DOM ready or attach listener
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initMagicFlute);
} else {
  window.initMagicFlute();
}
