/**
 * designjack - Audio Engine (Procedural Web Audio API)
 * Zero external audio dependencies. Generates authentic cyber-mechanical,
 * arcade, CRT power discharge, paper rustle, and toy claw sounds.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // 1. Mechanical relay click for jack font cycling
  playTick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.025);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  // 2. CRT Monitor Shutdown: high-pitch capacitor discharge + power snap
  playCRTShutdown() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(15734, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.28);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);

      const frameCount = Math.max(1, Math.floor(this.ctx.sampleRate * 0.04));
      const buf = this.ctx.createBuffer(1, frameCount, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.18, t + 0.24);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      noise.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(t + 0.24);
    } catch (e) {
      // Audio autoplay policy or device failure gracefully ignored
    }
  }

  // 3. CRT Monitor Power-On: Degauss coil THWUMP + rising electrostatic sizzle
  playCRTPowerOn() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const degauss = this.ctx.createOscillator();
      const dGain = this.ctx.createGain();
      degauss.type = 'triangle';
      degauss.frequency.setValueAtTime(60, t);
      degauss.frequency.linearRampToValueAtTime(120, t + 0.15);
      degauss.frequency.exponentialRampToValueAtTime(40, t + 0.5);

      dGain.gain.setValueAtTime(0.22, t);
      dGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      degauss.connect(dGain);
      dGain.connect(this.ctx.destination);
      degauss.start(t);
      degauss.stop(t + 0.55);

      const raster = this.ctx.createOscillator();
      const rGain = this.ctx.createGain();
      raster.type = 'sine';
      raster.frequency.setValueAtTime(400, t + 0.1);
      raster.frequency.exponentialRampToValueAtTime(15734, t + 0.45);

      rGain.gain.setValueAtTime(0.001, t + 0.1);
      rGain.linearRampToValueAtTime(0.06, t + 0.35);
      rGain.exponentialRampToValueAtTime(0.001, t + 0.6);

      raster.connect(rGain);
      rGain.connect(this.ctx.destination);
      raster.start(t + 0.1);
      raster.stop(t + 0.6);
    } catch (e) {
      // Audio autoplay policy gracefully ignored
    }
  }

  // 4. Spring Pop (Jack-in-the-box release & capsule opening)
  playSpringPop() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.22);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.35);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.38);
  }

  // 5. Paper Rustle / Sheet Flutter on the Wire
  playPaperFlutter() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600 + Math.random() * 600, t);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.12);
  }

  // 6. Cable Twang / Wire Vibration
  playCableTwang() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 40, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.25);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // 7. Red Dither "Smolecolamento" Particle Disintegration Sound
  playDitherSmolecola() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 8. UI button click / blip
  playBeep(freq = 640, duration = 0.035, type = 'sine') {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  // 9. Joystick clack
  playJoystickClack() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playMotorPulse() {
    this.playJoystickClack();
  }

  playClawDrop() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.6);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  playGrab() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playChuteDrop() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    const baseT = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const t = baseT + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Urto fra capsule o contro il vetro: colpetto di plastica, più acuto e forte con la velocità
  playClack(intensity = 0.5) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (this._lastClack && t - this._lastClack < 0.035) return;
    this._lastClack = t;
    const k = Math.max(0.08, Math.min(1, intensity));

    [1, 2.31].forEach((mult, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const f = (520 + k * 520 + Math.random() * 160) * mult;
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 0.62, t + 0.05);
      gain.gain.setValueAtTime((i ? 0.035 : 0.09) * k, t);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.06 + k * 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  // Ronzio continuo dei motori del carroponte: level 0..1 (0 = fermo)
  setMotor(level) {
    if (!this.ctx || this.ctx.state !== 'running') {
      if (level > 0.02 && !this.muted) this.ensureContext();
      return;
    }
    if (!this._motor) {
      if (level <= 0.02) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 70;
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      gain.gain.value = 0;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      this._motor = { osc, gain };
    }
    const t = this.ctx.currentTime;
    const target = this.muted ? 0 : Math.min(1, Math.max(0, level));
    this._motor.gain.gain.setTargetAtTime(target * 0.028, t, 0.05);
    this._motor.osc.frequency.setTargetAtTime(62 + target * 58, t, 0.08);
  }

  playMiss() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const baseT = this.ctx.currentTime;
    [330, 247].forEach((freq, idx) => {
      const t = baseT + idx * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.86, t + 0.2);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  playWin() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const baseT = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((freq, idx) => {
      const t = baseT + idx * 0.075;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(idx % 2 ? 0.1 : 0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  playCapsuleOpen() {
    this.playSpringPop();
    setTimeout(() => {
      this.playChuteDrop();
    }, 180);
  }

  // 15. Calm Marine Water Bubble Drop Sound (Canale B)
  playWaterDrop() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const startF = 420 + Math.random() * 320;
      osc.frequency.setValueAtTime(startF, t);
      osc.frequency.exponentialRampToValueAtTime(startF * 2.3, t + 0.12);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    } catch (e) {}
  }

  // 16. Street Graffiti Spray Can / Stencil Click (Canale G)
  playSprayCan() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [0, 0.035].forEach(dt => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, t + dt);
        osc.frequency.exponentialRampToValueAtTime(220, t + dt + 0.02);
        gain.gain.setValueAtTime(0.08, t + dt);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + dt);
        osc.stop(t + dt + 0.02);
      });
    } catch (e) {}
  }

  // 17. Magic Flute Note Synthesizer (5 Notes: R, T, Y, U, I)
  playFluteNote(noteKey) {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const freqMap = {
        'R': 293.66, // D4
        'r': 293.66,
        'T': 349.23, // F4
        't': 349.23,
        'Y': 440.00, // A4
        'y': 440.00,
        'U': 493.88, // B4
        'u': 493.88,
        'I': 587.33, // D5
        'i': 587.33
      };

      const freq = freqMap[noteKey] || 440;
      const t = this.ctx.currentTime;
      const duration = 0.68;

      // Master envelope for note
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.035);
      gain.gain.setValueAtTime(0.26, t + 0.12);
      gain.gain.linearRampToValueAtTime(0.001, t + duration);

      // Primary tone (warm sine with natural resonance)
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Subtle warm second harmonic (woodwind body)
      const oscHarmonic = this.ctx.createOscillator();
      const harmonicGain = this.ctx.createGain();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, t);
      harmonicGain.gain.setValueAtTime(0.06, t);
      harmonicGain.gain.linearRampToValueAtTime(0.001, t + duration * 0.8);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(gain);

      // Natural Flute Vibrato (5.5 Hz LFO)
      try {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5.5, t);
        lfoGain.gain.setValueAtTime(0.5, t);
        lfoGain.gain.linearRampToValueAtTime(4.5, t + 0.18);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + duration);
      } catch (err) {}

      // Acoustic woodwind breath noise articulation
      try {
        const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * 0.08));
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(freq * 1.5, t);
        noiseFilter.Q.setValueAtTime(2.0, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.06, t);
        noiseGain.gain.linearRampToValueAtTime(0.001, t + 0.07);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(gain);
        noise.start(t);
      } catch (err) {}

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
      oscHarmonic.start(t);
      oscHarmonic.stop(t + duration);
    } catch (e) {
      console.warn('Flute audio error:', e);
    }
  }

  // 18. Zelda Mystery / Melody Fanfare Arpeggio
  playMelodyFanfare() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const t = this.ctx.currentTime;
      // Classic Zelda secret solve / arpeggio (G4, C5, E5, G5, C6)
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const noteTime = t + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.02);
        gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.45);
      });
    } catch (e) {
      console.warn('Fanfare audio error:', e);
    }
  }
}

window.audioEngine = new SoundEngine();
