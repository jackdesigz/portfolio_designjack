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

    this.isOpen = false;
    this.noteBuffer = [];
    this.bufferTimeout = null;
    this.targetChannel = null;

    // Melody definitions
    this.melodies = [
      {
        channel: 'r',
        name: 'Canale R (Archivio & Toy Claw)',
        sequence: ['R', 'T', 'Y', 'R'],
        sheetEl: this.sheetCards.r
      },
      {
        channel: 'g',
        name: 'Canale G (Jacopo Febi // Organic & Street)',
        sequence: ['T', 'Y', 'U', 'T'],
        sheetEl: this.sheetCards.g
      },
      {
        channel: 'b',
        name: 'Canale B (Contatti // Calm Ocean)',
        sequence: ['Y', 'U', 'I', 'Y'],
        sheetEl: this.sheetCards.b
      }
    ];

    this.init();
  }

  init() {
    if (!this.modal) return;

    // Open button (located in Channel B right dock)
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Reset notes button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearBuffer());
    }

    // Modal overlay click outside window
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Hole click events
    this.holeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const note = btn.dataset.note;
        if (note) this.playNote(note.toUpperCase());
      });
    });

    // Keyboard events
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
        // Prevent browser shortcuts when playing
        e.preventDefault();
        this.playNote(key);
      }
    });

    // Prompt Buttons
    if (this.promptCancelBtn) {
      this.promptCancelBtn.addEventListener('click', () => this.closePrompt());
    }

    if (this.promptConfirmBtn) {
      this.promptConfirmBtn.addEventListener('click', () => this.executeTeleport());
    }
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add('open');
    this.clearBuffer();
    this.closePrompt();

    // Sound effect
    if (window.audioEngine) {
      window.audioEngine.playWaterDrop();
    }
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('open');
    this.closePrompt();
    this.clearBuffer();
  }

  playNote(note) {
    if (!this.isOpen) return;

    // 1. Audio synthesis
    if (window.audioEngine) {
      window.audioEngine.playFluteNote(note);
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
    const btn = Array.from(this.holeButtons).find(b => b.dataset.note === note);
    if (btn) {
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 250);
    }
  }

  renderStave() {
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
    Object.values(this.sheetCards).forEach(el => {
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
      window.audioEngine.playMelodyFanfare();
    }

    // 2. Highlight matching sheet card
    if (melody.sheetEl) {
      melody.sheetEl.classList.add('melody-unlocked');
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
    if (this.promptEl) {
      this.promptEl.style.display = 'none';
      this.promptEl.classList.remove('active');
    }
    this.clearBuffer();
  }

  executeTeleport() {
    const dest = this.targetChannel;
    this.close();

    if (dest && typeof window.switchChannel === 'function') {
      // Trigger full CRT transition to chosen channel!
      window.switchChannel(dest);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.magicFlute = new MagicFlute();
});
