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
}

window.audioEngine = new SoundEngine();
