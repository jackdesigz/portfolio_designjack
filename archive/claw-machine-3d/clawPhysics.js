/**
 * designjack — Claw Machine Physics Core
 *
 * Simulazione a passo fisso (240 Hz), senza dipendenze e senza DOM:
 *  - capsule e palline come sfere rigide (urti, attrito, rotolamento, sonno)
 *  - vasca con pareti, buca dello scivolo e paratie in acrilico
 *  - carrello motorizzato, cavo e artiglio a pendolo sferico
 *  - tre dita cinematiche con chiusura "cedevole": la presa nasce dai
 *    contatti reali fra dita, palmo e capsula, non da un esito deciso a priori
 *
 * Coordinate: origine al centro della vasca, pavimento a y = 0, +z verso il giocatore.
 * La vista (crane.js) legge lo stato e non modifica mai la simulazione.
 */
(function (root) {
  'use strict';

  var K_INERTIA = 0.5;                       // I = k·m·r² (guscio di plastica)
  var TAN_MASS = 1 / (1 + 1 / K_INERTIA);    // massa efficace tangenziale di una sfera che rotola

  var DEFAULTS = {
    hx: 2.2,            // semi-larghezza interna della vasca (vetro)
    hz: 1.55,           // semi-profondità interna
    railY: 3.0,         // quota del carrello
    gravity: 13,
    // Buca dello scivolo nell'angolo anteriore sinistro, con paratie in acrilico
    chute: { x0: -2.2, x1: -1.22, z0: 0.57, z1: 1.55, wallH: 0.62, wallT: 0.07, depth: 0.95 },
    chuteDrop: { x: -1.68, z: 1.03 },
    // Il fondo sale dolcemente verso i vetri e verso le paratie: le capsule non restano
    // mai appoggiate a un ostacolo dove le dita non potrebbero scendere
    rimRamp: { w: 0.42, h: 0.10 },
    chuteRamp: { w: 0.52, h: 0.11 },
    home: { x: 0.5, z: 0.0 },
    carriage: { maxX: 1.68, maxZ: 1.03, vmax: 1.6, accel: 7.5, brake: 10 },
    cable: { Lmin: 0.5, vDown: 2.0, vUp: 1.55 },
    restitution: 0.42,
    friction: 0.32,
    wallRestitution: 0.36,
    wallFriction: 0.45
  };

  // Geometria dell'artiglio nel piano radiale di ogni dito (ρ, y) rispetto al perno, in posa chiusa (θ = 0)
  var CLAW = {
    pivotR: 0.11,
    pivotY: -0.06,
    elbow: [0.25, -0.20],
    tip: [0.05, -0.56],
    hook: [-0.035, -0.60],
    rf: 0.05,
    palmY: -0.15,       // il palmo è un disco piatto di gomma sotto il mozzo
    palmR: 0.21,
    thetaOpen: 0.70,
    thetaIdle: 0.36,
    thetaMin: -0.08,
    azimuth: [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6]   // un dito dietro, due davanti
  };

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function Sim(opts) {
    var cfg = {};
    var k;
    for (k in DEFAULTS) cfg[k] = DEFAULTS[k];
    if (opts) for (k in opts) cfg[k] = opts[k];
    this.cfg = cfg;
    this.geo = CLAW;

    this.h = 1 / 240;
    this.acc = 0;
    this.time = 0;
    this.bodies = [];
    this.nextId = 1;
    this.input = { x: 0, z: 0 };
    this.impacts = [];           // urti del frame corrente, per l'audio
    this.listener = null;

    var c = cfg.chute;
    // Paratie attorno alla buca (scendono sotto il pavimento per fare da condotto)
    this.boxes = [
      { x0: c.x1, x1: c.x1 + c.wallT, y0: -c.depth - 0.5, y1: c.wallH, z0: c.z0 - c.wallT, z1: c.z1 },
      { x0: c.x0, x1: c.x1 + c.wallT, y0: -c.depth - 0.5, y1: c.wallH, z0: c.z0 - c.wallT, z1: c.z0 }
    ];

    this.Lmax = cfg.railY - 0.55;

    this.claw = {
      state: 'IDLE',
      t: 0,
      cx: cfg.home.x, cz: cfg.home.z, cvx: 0, cvz: 0,
      ox: 0, oz: 0, ovx: 0, ovz: 0,
      L: cfg.cable.Lmin, vL: 0,
      lift: 0,
      psi: 0, vpsi: 0,
      theta: CLAW.thetaIdle,     // le tre dita sono collegate allo stesso solenoide: un solo angolo
      blocked: false,
      hub: { x: cfg.home.x, y: cfg.railY - cfg.cable.Lmin, z: cfg.home.z },
      ex: [1, 0, 0], ey: [0, 1, 0], ez: [0, 0, 1],
      landedT: 0,
      settleT: 0,
      supported: false,    // l'artiglio poggia su pavimento, paratie o su un corpo bloccato
      held: null,
      moving: 0            // 0..1, per il suono del motore
    };

    this._fn = [0, 1, 0];
    this.hubPrev = [0, 0, 0];
    this.hubV = [0, 0, 0];
    this._buildProfile();
    this._frame();
    this._fillSpheres(this.claw.theta, this.sp);
    this._copyPrev();
  }

  Sim.prototype.emit = function (type, data) {
    if (this.listener) this.listener(type, data);
  };

  // ------------------------------------------------------------------
  // Corpi
  // ------------------------------------------------------------------
  Sim.prototype.addBody = function (o) {
    var r = o.r || 0.27;
    var m = o.m || Math.pow(r / 0.27, 3);
    var b = {
      id: this.nextId++,
      kind: o.kind || 'capsule',
      data: o.data || null,
      r: r, m: m, invM: 1 / m,
      x: o.x || 0, y: o.y || r, z: o.z || 0,
      vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0,
      wx: o.wx || 0, wy: o.wy || 0, wz: o.wz || 0,
      qx: 0, qy: 0, qz: 0, qw: 1,
      active: true,
      asleep: false,
      still: 0
    };
    if (o.q) { b.qx = o.q[0]; b.qy = o.q[1]; b.qz = o.q[2]; b.qw = o.q[3]; }
    this.bodies.push(b);
    return b;
  };

  Sim.prototype.respawn = function (b, x, y, z) {
    b.x = x; b.y = y; b.z = z;
    b.vx = 0; b.vy = 0; b.vz = 0;
    b.wx = 0; b.wy = 0; b.wz = 0;
    b.active = true; b.asleep = false; b.still = 0;
  };

  Sim.prototype.wake = function (b) {
    if (!b.asleep) { b.still = 0; return; }
    // Sveglia tutta l'isola di corpi a contatto, così nessuno resta sospeso
    var stack = [b];
    b.asleep = false; b.still = 0;
    var bodies = this.bodies;
    while (stack.length) {
      var a = stack.pop();
      for (var i = 0; i < bodies.length; i++) {
        var o = bodies[i];
        if (!o.active || !o.asleep) continue;
        var dx = o.x - a.x, dy = o.y - a.y, dz = o.z - a.z;
        var rr = a.r + o.r + 0.03;
        if (dx * dx + dy * dy + dz * dz < rr * rr) {
          o.asleep = false; o.still = 0;
          stack.push(o);
        }
      }
    }
  };

  Sim.prototype.wakeAll = function () {
    for (var i = 0; i < this.bodies.length; i++) { this.bodies[i].asleep = false; this.bodies[i].still = 0; }
  };

  Sim.prototype.allAsleep = function () {
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (b.active && !b.asleep) return false;
    }
    return true;
  };

  // ------------------------------------------------------------------
  // Artiglio: profilo delle dita e sfere di collisione
  // ------------------------------------------------------------------
  Sim.prototype._buildProfile = function () {
    var g = CLAW;
    var pts = [];
    function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    var P0 = [0, 0];
    pts.push({ p: lerp(P0, g.elbow, 0.55), r: g.rf });
    pts.push({ p: g.elbow, r: g.rf });
    pts.push({ p: lerp(g.elbow, g.tip, 0.22), r: g.rf });
    pts.push({ p: lerp(g.elbow, g.tip, 0.44), r: g.rf });
    pts.push({ p: lerp(g.elbow, g.tip, 0.66), r: g.rf });
    pts.push({ p: lerp(g.elbow, g.tip, 0.88), r: g.rf });
    pts.push({ p: g.tip, r: g.rf });
    pts.push({ p: g.hook, r: 0.045 });
    this.profile = pts;
    this.perFinger = pts.length;
    var n = pts.length * 3;
    this.spCount = n;
    this.sp = { x: new Float64Array(n), y: new Float64Array(n), z: new Float64Array(n), r: new Float64Array(n) };
    this.spPrev = { x: new Float64Array(n), y: new Float64Array(n), z: new Float64Array(n) };
    this.spV = { x: new Float64Array(n), y: new Float64Array(n), z: new Float64Array(n) };
    this.tmpFinger = { x: new Float64Array(pts.length), y: new Float64Array(pts.length), z: new Float64Array(pts.length) };
  };

  Sim.prototype._frame = function () {
    var c = this.claw, cfg = this.cfg;
    var o2 = c.ox * c.ox + c.oz * c.oz;
    var Ly = Math.sqrt(Math.max(1e-6, c.L * c.L - o2));
    c.hub.x = c.cx + c.ox;
    c.hub.y = cfg.railY - Ly + c.lift;
    c.hub.z = c.cz + c.oz;
    var eyx = -c.ox / c.L, eyy = Ly / c.L, eyz = -c.oz / c.L;
    var exx = 1 - eyx * eyx, exy = -eyx * eyy, exz = -eyx * eyz;
    var il = 1 / Math.sqrt(exx * exx + exy * exy + exz * exz);
    exx *= il; exy *= il; exz *= il;
    c.ey[0] = eyx; c.ey[1] = eyy; c.ey[2] = eyz;
    c.ex[0] = exx; c.ex[1] = exy; c.ex[2] = exz;
    c.ez[0] = exy * eyz - exz * eyy;
    c.ez[1] = exz * eyx - exx * eyz;
    c.ez[2] = exx * eyy - exy * eyx;
  };

  Sim.prototype._fingerPoints = function (i, theta, out) {
    var c = this.claw, g = CLAW, pts = this.profile;
    var phi = g.azimuth[i] + c.psi;
    var cp = Math.cos(phi), sn = Math.sin(phi);
    var dx = c.ex[0] * cp + c.ez[0] * sn;
    var dy = c.ex[1] * cp + c.ez[1] * sn;
    var dz = c.ex[2] * cp + c.ez[2] * sn;
    var ct = Math.cos(theta), st = Math.sin(theta);
    for (var j = 0; j < pts.length; j++) {
      var p = pts[j].p;
      var rho = g.pivotR + p[0] * ct - p[1] * st;
      var yy = g.pivotY + p[1] * ct + p[0] * st;
      out.x[j] = c.hub.x + dx * rho + c.ey[0] * yy;
      out.y[j] = c.hub.y + dy * rho + c.ey[1] * yy;
      out.z[j] = c.hub.z + dz * rho + c.ey[2] * yy;
    }
  };

  Sim.prototype._fillSpheres = function (theta, sp) {
    var c = this.claw, g = CLAW, n = this.perFinger, tmp = this.tmpFinger;
    for (var i = 0; i < 3; i++) {
      this._fingerPoints(i, theta, tmp);
      for (var j = 0; j < n; j++) {
        var k = i * n + j;
        sp.x[k] = tmp.x[j]; sp.y[k] = tmp.y[j]; sp.z[k] = tmp.z[j];
        sp.r[k] = this.profile[j].r;
      }
    }
  };

  // Contatto sfera–disco del palmo. Restituisce la compenetrazione e scrive la normale (palmo → corpo) in this._pn
  Sim.prototype._palmContact = function (b) {
    var c = this.claw, g = CLAW, n = this._pn || (this._pn = [0, 0, 0, 0, 0, 0]);
    var dx = b.x - c.hub.x, dy = b.y - c.hub.y, dz = b.z - c.hub.z;
    var lx = dx * c.ex[0] + dy * c.ex[1] + dz * c.ex[2];
    var ly = dx * c.ey[0] + dy * c.ey[1] + dz * c.ey[2];
    var lz = dx * c.ez[0] + dy * c.ez[1] + dz * c.ez[2];
    var rho = Math.sqrt(lx * lx + lz * lz);
    var qr = rho > g.palmR ? g.palmR / rho : 1;       // punto più vicino sul disco
    var ox = lx - lx * qr, oy = ly - g.palmY, oz = lz - lz * qr;
    var d2 = ox * ox + oy * oy + oz * oz;
    if (d2 >= b.r * b.r || oy > 0) return 0;
    var d = Math.sqrt(d2);
    if (d < 1e-6) { ox = 0; oy = -1; oz = 0; d = 1; }
    ox /= d; oy /= d; oz /= d;
    n[0] = ox * c.ex[0] + oy * c.ey[0] + oz * c.ez[0];
    n[1] = ox * c.ex[1] + oy * c.ey[1] + oz * c.ez[1];
    n[2] = ox * c.ex[2] + oy * c.ey[2] + oz * c.ez[2];
    return b.r - d;
  };

  Sim.prototype._copyPrev = function () {
    var hb = this.claw.hub;
    this.hubPrev[0] = hb.x; this.hubPrev[1] = hb.y; this.hubPrev[2] = hb.z;
    for (var k = 0; k < this.spCount; k++) {
      this.spPrev.x[k] = this.sp.x[k]; this.spPrev.y[k] = this.sp.y[k]; this.spPrev.z[k] = this.sp.z[k];
    }
  };

  // Massima compenetrazione di un dito, provato a un certo angolo, contro i corpi
  Sim.prototype._fingerMaxPen = function (i, theta) {
    var tmp = this.tmpFinger, n = this.perFinger, bodies = this.bodies, hub = this.claw.hub;
    this._fingerPoints(i, theta, tmp);
    var maxPen = 0;
    for (var b = 0; b < bodies.length; b++) {
      var bd = bodies[b];
      if (!bd.active) continue;
      var hx = bd.x - hub.x, hy = bd.y - hub.y, hz = bd.z - hub.z;
      if (hx * hx + hy * hy + hz * hz > 2.0) continue;
      for (var j = 0; j < n; j++) {
        var dx = bd.x - tmp.x[j], dy = bd.y - tmp.y[j], dz = bd.z - tmp.z[j];
        var rr = bd.r + this.profile[j].r;
        var d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < rr * rr) {
          var pen = rr - Math.sqrt(d2);
          if (pen > maxPen) maxPen = pen;
        }
      }
    }
    return maxPen;
  };

  Sim.prototype.overHole = function (x, z) {
    var c = this.cfg.chute;
    return x < c.x1 && z > c.z0;
  };

  // Quota del fondo in (x, z). Scrive la normale in this._fn. Sopra la buca non c'è fondo.
  Sim.prototype.floorAt = function (x, z) {
    var cfg = this.cfg, c = cfg.chute, n = this._fn;
    n[0] = 0; n[1] = 1; n[2] = 0;
    if (x < c.x1 && z > c.z0) return -1e9;
    var h = 0;
    // rampa perimetrale
    var rr = cfg.rimRamp;
    var dxw = cfg.hx - Math.abs(x), dzw = cfg.hz - Math.abs(z);
    var dw = Math.min(dxw, dzw);
    if (dw < rr.w) {
      h = rr.h * (1 - Math.max(0, dw) / rr.w);
      var s = rr.h / rr.w;
      if (dxw < dzw) { n[0] = x > 0 ? -s : s; n[2] = 0; } else { n[0] = 0; n[2] = z > 0 ? -s : s; }
    }
    // rampa attorno alle paratie dello scivolo
    var cr = cfg.chuteRamp;
    var ex = Math.max(0, x - (c.x1 + c.wallT)), ez = Math.max(0, (c.z0 - c.wallT) - z);
    var dc = Math.sqrt(ex * ex + ez * ez);
    if (dc < cr.w) {
      var hc = cr.h * (1 - dc / cr.w);
      if (hc > h) {
        h = hc;
        var sc = cr.h / cr.w;
        if (dc > 1e-6) { n[0] = sc * ex / dc; n[2] = -sc * ez / dc; } else { n[0] = 0; n[2] = 0; }
      }
    }
    if (h > 0) {
      n[1] = 1;
      var il = 1 / Math.sqrt(n[0] * n[0] + 1 + n[2] * n[2]);
      n[0] *= il; n[1] *= il; n[2] *= il;
    }
    return h;
  };

  // Corpi attualmente dentro la gabbia dell'artiglio
  Sim.prototype.inCage = function () {
    var c = this.claw, out = [];
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (!b.active) continue;
      var dx = b.x - c.hub.x, dy = b.y - c.hub.y, dz = b.z - c.hub.z;
      var lx = dx * c.ex[0] + dy * c.ex[1] + dz * c.ex[2];
      var ly = dx * c.ey[0] + dy * c.ey[1] + dz * c.ey[2];
      var lz = dx * c.ez[0] + dy * c.ez[1] + dz * c.ez[2];
      if (lx * lx + lz * lz < 0.3 * 0.3 && ly < -0.1 && ly > -0.85) out.push(b);
    }
    return out;
  };

  // Capsula più vicina all'asse dell'artiglio (per la luce di mira)
  Sim.prototype.aim = function () {
    var c = this.claw, best = null, bestD = 1e9;
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (!b.active || b.kind !== 'capsule') continue;
      var dx = b.x - c.hub.x, dz = b.z - c.hub.z;
      var d = Math.sqrt(dx * dx + dz * dz);
      if (d < bestD) { bestD = d; best = b; }
    }
    return { body: best, dist: bestD };
  };

  // ------------------------------------------------------------------
  // Comandi
  // ------------------------------------------------------------------
  Sim.prototype.pressDrop = function () {
    var c = this.claw;
    if (c.state !== 'IDLE') return false;
    this._setState('DROP');
    return true;
  };

  Sim.prototype._setState = function (s) {
    var c = this.claw;
    c.state = s; c.t = 0; c.landedT = 0; c.settleT = 0;
    this.emit('state', s);
  };

  Sim.prototype._driveCarriage = function (tvx, tvz, h, accel) {
    var c = this.claw;
    var dvx = tvx - c.cvx, dvz = tvz - c.cvz;
    var dv = Math.sqrt(dvx * dvx + dvz * dvz);
    var maxDv = accel * h;
    if (dv > maxDv) { dvx *= maxDv / dv; dvz *= maxDv / dv; }
    c.cvx += dvx; c.cvz += dvz;
  };

  Sim.prototype._seek = function (tx, tz, h, vmax, accel) {
    var c = this.claw;
    var dx = tx - c.cx, dz = tz - c.cz;
    var dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 1e-4) { this._driveCarriage(0, 0, h, accel); return dist; }
    var v = Math.min(vmax, Math.sqrt(2 * accel * 0.55 * dist));
    this._driveCarriage(dx / dist * v, dz / dist * v, h, accel);
    return dist;
  };

  // ------------------------------------------------------------------
  // Passo di simulazione
  // ------------------------------------------------------------------
  Sim.prototype.update = function (dt) {
    if (dt > 0.05) dt = 0.05;
    this.acc += dt;
    this.impacts.length = 0;
    var n = 0;
    while (this.acc >= this.h && n < 16) {
      this._step(this.h);
      this.acc -= this.h;
      n++;
    }
    if (n === 16) this.acc = 0;
  };

  Sim.prototype._step = function (h) {
    var cfg = this.cfg, c = this.claw, g = CLAW, cab = cfg.cable, car = cfg.carriage;
    var i, j, k, b;
    this.time += h;
    c.t += h;

    // ---- 1. Logica di gioco: bersagli di carrello, cavo e dita
    var fingerTarget = g.thetaIdle, fingerRate = 3.0;
    var vL = 0;
    var pcvx = c.cvx, pcvz = c.cvz;

    switch (c.state) {
      case 'IDLE': {
        var ix = this.input.x, iz = this.input.z;
        var il = Math.sqrt(ix * ix + iz * iz);
        if (il > 1) { ix /= il; iz /= il; }
        this._driveCarriage(ix * car.vmax, iz * car.vmax, h, il > 0.01 ? car.accel : car.brake);
        vL = c.L > cab.Lmin ? -cab.vUp : 0;
        break;
      }
      case 'DROP': {
        this._driveCarriage(0, 0, h, car.brake);
        fingerTarget = g.thetaOpen; fingerRate = 5.0;
        if (c.t > 0.16) vL = c.supported ? 0 : cab.vDown;
        if (c.supported) c.landedT += h; else c.landedT = Math.max(0, c.landedT - h);
        if (c.landedT > 0.05 || c.L >= this.Lmax - 1e-4) {
          this._setState('CLOSE');
          this.emit('landed');
        }
        break;
      }
      case 'CLOSE': {
        this._driveCarriage(0, 0, h, car.brake);
        fingerTarget = g.thetaMin; fingerRate = 2.3;
        var done = c.blocked || c.theta <= g.thetaMin + 0.01;
        if (done) c.settleT += h; else c.settleT = 0;
        if ((c.t > 0.3 && c.settleT > 0.14) || c.t > 1.0) {
          var got = this.inCage();
          this._setState('LIFT');
          this.emit('grip', got.length ? got[0] : null);
        }
        break;
      }
      case 'LIFT': {
        this._driveCarriage(0, 0, h, car.brake);
        fingerTarget = g.thetaMin; fingerRate = 1.4;
        vL = -cab.vUp;
        if (c.L <= cab.Lmin + 1e-4) {
          var heldNow = this.inCage();
          if (heldNow.length) {
            c.held = heldNow[0];
            this._setState('CARRY');
            this.emit('lifted', c.held);
          } else {
            c.held = null;
            this._setState('RETURN');
            this.emit('miss');
          }
        }
        break;
      }
      case 'CARRY': {
        fingerTarget = g.thetaMin; fingerRate = 1.4;
        var dist = this._seek(cfg.chuteDrop.x, cfg.chuteDrop.z, h, 1.2, 2.4);
        var cage = this.inCage();
        if (!cage.length) {
          c.held = null;
          this._setState('RETURN');
          this.emit('slip');
          break;
        }
        c.held = cage[0];
        if (dist < 0.03) {
          c.settleT += h;
          var sway = Math.sqrt(c.ox * c.ox + c.oz * c.oz) + 0.25 * Math.sqrt(c.ovx * c.ovx + c.ovz * c.ovz);
          if ((sway < 0.05 && c.settleT > 0.2) || c.settleT > 1.3) {
            this._setState('RELEASE');
            this.emit('release', c.held);
          }
        }
        break;
      }
      case 'RELEASE': {
        this._driveCarriage(0, 0, h, car.brake);
        fingerTarget = g.thetaOpen; fingerRate = 6.5;
        if (c.t > 0.85) { c.held = null; this._setState('RETURN'); }
        break;
      }
      case 'RETURN': {
        vL = c.L > cab.Lmin ? -cab.vUp : 0;
        var dh = this._seek(cfg.home.x, cfg.home.z, h, 1.4, 3.0);
        if (dh < 0.02 && c.L <= cab.Lmin + 1e-4) {
          this._setState('IDLE');
          this.emit('ready');
        }
        break;
      }
    }

    // ---- 2. Carrello, con fine corsa
    c.cx += c.cvx * h; c.cz += c.cvz * h;
    if (c.cx > car.maxX) { c.cx = car.maxX; if (c.cvx > 0) c.cvx = 0; }
    if (c.cx < -car.maxX) { c.cx = -car.maxX; if (c.cvx < 0) c.cvx = 0; }
    if (c.cz > car.maxZ) { c.cz = car.maxZ; if (c.cvz > 0) c.cvz = 0; }
    if (c.cz < -car.maxZ) { c.cz = -car.maxZ; if (c.cvz < 0) c.cvz = 0; }
    var ax = clamp((c.cvx - pcvx) / h, -26, 26);
    var az = clamp((c.cvz - pcvz) / h, -26, 26);
    var spd = Math.sqrt(c.cvx * c.cvx + c.cvz * c.cvz) / car.vmax;
    c.moving = clamp(Math.max(spd, Math.abs(vL) > 0.01 ? 0.75 : 0), 0, 1);

    // ---- 3. Cavo e pendolo sferico (linearizzato attorno alla verticale)
    c.vL = vL;
    c.L = clamp(c.L + vL * h, cab.Lmin, this.Lmax);
    var Lp = Math.max(c.L, 0.45);
    var w2 = cfg.gravity / Lp;
    var damp = c.held ? 1.25 : 1.7;
    var couple = 0.5;                  // il motore parte e frena in modo morbido
    c.ovx += (-w2 * c.ox - damp * c.ovx - ax * couple) * h;
    c.ovz += (-w2 * c.oz - damp * c.ovz - az * couple) * h;
    if (c.supported) {                 // appoggiato: l'attrito a terra smorza l'oscillazione
      var f = Math.max(0, 1 - 14 * h);
      c.ovx *= f; c.ovz *= f;
    }
    c.ox += c.ovx * h; c.oz += c.ovz * h;
    var omax = 0.55 * c.L;
    var om = Math.sqrt(c.ox * c.ox + c.oz * c.oz);
    if (om > omax) { c.ox *= omax / om; c.oz *= omax / om; c.ovx *= 0.5; c.ovz *= 0.5; }
    // Leggera torsione attorno al cavo, eccitata dalle accelerazioni
    c.vpsi += (-9 * c.psi - 1.6 * c.vpsi + (ax * 0.012 - az * 0.012)) * h;
    c.psi += c.vpsi * h;

    c.lift = Math.max(0, c.lift - 2.6 * h);
    this._frame();

    // ---- 4. Dita: apertura libera, chiusura cedevole (si fermano se la capsula non può spostarsi)
    var th = c.theta, fstep = fingerRate * h;
    if (fingerTarget > th) {
      c.theta = Math.min(fingerTarget, th + fstep);
      c.blocked = false;
    } else if (fingerTarget < th) {
      var tryTh = Math.max(fingerTarget, th - fstep);
      var worst = 0;
      for (i = 0; i < 3; i++) worst = Math.max(worst, this._fingerMaxPen(i, tryTh));
      if (worst > 0.012) {
        c.blocked = true;
      } else {
        c.theta = tryTh;
        c.blocked = false;
      }
    }
    this._fillSpheres(c.theta, this.sp);

    // ---- 5. Appoggio dell'artiglio su pavimento e paratie: il mozzo si solleva, il cavo si allenta
    var sp = this.sp, nS = this.spCount, palm = nS;
    var need = 0;
    for (k = 0; k < palm; k++) {
      var fh = this.floorAt(sp.x[k], sp.z[k]);
      if (fh > -1) {
        var pf = fh + sp.r[k] - sp.y[k];
        if (pf > need) need = pf;
      }
      for (j = 0; j < this.boxes.length; j++) {
        var bx = this.boxes[j];
        if (sp.x[k] > bx.x0 - sp.r[k] && sp.x[k] < bx.x1 + sp.r[k] && sp.z[k] > bx.z0 - sp.r[k] && sp.z[k] < bx.z1 + sp.r[k]) {
          var qx = clamp(sp.x[k], bx.x0, bx.x1), qz = clamp(sp.z[k], bx.z0, bx.z1);
          var ddx = sp.x[k] - qx, ddz = sp.z[k] - qz;
          var hr = sp.r[k] * sp.r[k] - ddx * ddx - ddz * ddz;
          if (hr > 0) {
            var pb = bx.y1 + Math.sqrt(hr) - sp.y[k];
            if (pb > 0 && pb < 0.2 && pb > need) need = pb;
          }
        }
      }
    }
    c.supported = need > 0.0005;
    if (need > 0) {
      c.lift += need;
      c.hub.y += need;
      for (k = 0; k < nS; k++) sp.y[k] += need;
    }
    var ih = 1 / h;
    this.hubV[0] = (c.hub.x - this.hubPrev[0]) * ih;
    this.hubV[1] = (c.hub.y - this.hubPrev[1]) * ih;
    this.hubV[2] = (c.hub.z - this.hubPrev[2]) * ih;
    for (k = 0; k < nS; k++) {
      this.spV.x[k] = (sp.x[k] - this.spPrev.x[k]) * ih;
      this.spV.y[k] = (sp.y[k] - this.spPrev.y[k]) * ih;
      this.spV.z[k] = (sp.z[k] - this.spPrev.z[k]) * ih;
    }

    // ---- 6. Integrazione dei corpi
    var bodies = this.bodies, nB = bodies.length, grav = cfg.gravity;
    for (i = 0; i < nB; i++) {
      b = bodies[i];
      if (!b.active || b.asleep) continue;
      b.vy -= grav * h;
      var lin = 1 - 0.12 * h, ang = 1 - 0.5 * h;
      b.vx *= lin; b.vy *= lin; b.vz *= lin;
      b.wx *= ang; b.wy *= ang; b.wz *= ang;
      b.x += b.vx * h; b.y += b.vy * h; b.z += b.vz * h;
      // orientamento: q += ½·h·ω⊗q
      var hx2 = b.wx * h * 0.5, hy2 = b.wy * h * 0.5, hz2 = b.wz * h * 0.5;
      var nqx = b.qx + hx2 * b.qw + hy2 * b.qz - hz2 * b.qy;
      var nqy = b.qy + hy2 * b.qw + hz2 * b.qx - hx2 * b.qz;
      var nqz = b.qz + hz2 * b.qw + hx2 * b.qy - hy2 * b.qx;
      var nqw = b.qw - hx2 * b.qx - hy2 * b.qy - hz2 * b.qz;
      var ql = 1 / Math.sqrt(nqx * nqx + nqy * nqy + nqz * nqz + nqw * nqw);
      b.qx = nqx * ql; b.qy = nqy * ql; b.qz = nqz * ql; b.qw = nqw * ql;
    }

    // ---- 7. Contatti (ordine: artiglio, corpo-corpo, statici per ultimi)
    for (var it = 0; it < 3; it++) {
      this._clawContacts();
      this._bodyContacts(it === 0);
      this._staticContacts(it === 0, h);
    }

    // ---- 8. In discesa: se un corpo bloccato regge l'artiglio, il mozzo si ferma sopra di lui
    if (c.state === 'DROP') {
      var needB = 0;
      for (i = 0; i < nB; i++) {
        b = bodies[i];
        if (!b.active) continue;
        var hbx = b.x - c.hub.x, hby = b.y - c.hub.y, hbz = b.z - c.hub.z;
        if (hbx * hbx + hby * hby + hbz * hbz > 2.0) continue;
        for (k = 0; k < nS; k++) {
          var dx = b.x - sp.x[k], dy = b.y - sp.y[k], dz = b.z - sp.z[k];
          var rr = b.r + sp.r[k];
          var d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < rr * rr && d2 > 1e-9) {
            var d = Math.sqrt(d2);
            var pen = rr - d, ny = dy / d;
            if (pen > 0.005 && ny < -0.35) {
              var up = pen * -ny;
              if (up > needB) needB = up;
            }
          }
        }
        var ppen = this._palmContact(b);
        if (ppen > 0.005 && this._pn[1] < -0.35 && ppen * -this._pn[1] > needB) needB = ppen * -this._pn[1];
      }
      if (needB > 0) {
        c.supported = true;
        needB = Math.min(needB, 0.05);
        c.lift += needB;
        c.hub.y += needB;
        for (k = 0; k < nS; k++) sp.y[k] += needB;
      }
    }
    this._copyPrev();

    // ---- 9. Sonno, buca dello scivolo
    var ch = cfg.chute;
    for (i = 0; i < nB; i++) {
      b = bodies[i];
      if (!b.active) continue;
      if (b.y < -ch.depth + 0.2) {
        b.active = false;
        this.emit('chute', b);
        continue;
      }
      if (b.asleep) continue;
      var v2 = b.vx * b.vx + b.vy * b.vy + b.vz * b.vz;
      var w2b = b.wx * b.wx + b.wy * b.wy + b.wz * b.wz;
      if (v2 < 0.015 && w2b < 0.25) {
        b.still += h;
        if (b.still > 0.45) { b.asleep = true; b.vx = b.vy = b.vz = 0; b.wx = b.wy = b.wz = 0; }
      } else {
        b.still = Math.max(0, b.still - 3 * h);
      }
    }
  };

  // Contatto di un corpo con una superficie cinematica o statica (velocità vs)
  Sim.prototype._resolveFixed = function (b, nx, ny, nz, pen, svx, svy, svz, rest, mu, record) {
    b.x += nx * pen; b.y += ny * pen; b.z += nz * pen;
    var rvx = b.vx - svx, rvy = b.vy - svy, rvz = b.vz - svz;
    var vn = rvx * nx + rvy * ny + rvz * nz;
    if (vn >= 0) return;
    var e = vn < -0.7 ? rest : 0;
    var jn = -(1 + e) * vn;
    b.vx += jn * nx; b.vy += jn * ny; b.vz += jn * nz;
    if (record && vn < -0.9) this.impacts.push({ speed: -vn, kind: 'wall', x: b.x, y: b.y, z: b.z });
    // attrito: velocità del punto di contatto (rc = −n·r), compresa la rotazione
    var r = b.r;
    var cvx = b.vx - svx + (b.wy * -nz - b.wz * -ny) * r;
    var cvy = b.vy - svy + (b.wz * -nx - b.wx * -nz) * r;
    var cvz = b.vz - svz + (b.wx * -ny - b.wy * -nx) * r;
    var cn = cvx * nx + cvy * ny + cvz * nz;
    cvx -= cn * nx; cvy -= cn * ny; cvz -= cn * nz;
    var vt = Math.sqrt(cvx * cvx + cvy * cvy + cvz * cvz);
    if (vt > 1e-5) {
      var tx = cvx / vt, ty = cvy / vt, tz = cvz / vt;
      var jt = Math.min(mu * jn, vt * TAN_MASS);
      b.vx -= jt * tx; b.vy -= jt * ty; b.vz -= jt * tz;
      // Δω = −jt·(rc × t)/(k·r²), con rc = −n·r  →  +jt·(n × t)/(k·r)
      var s = jt / (K_INERTIA * r);
      b.wx += (ny * tz - nz * ty) * s;
      b.wy += (nz * tx - nx * tz) * s;
      b.wz += (nx * ty - ny * tx) * s;
    }
  };

  Sim.prototype._clawContacts = function () {
    var sp = this.sp, sv = this.spV, nS = this.spCount, bodies = this.bodies, hub = this.claw.hub;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.active) continue;
      var hx = b.x - hub.x, hy = b.y - hub.y, hz = b.z - hub.z;
      if (hx * hx + hy * hy + hz * hz > 2.0) continue;
      for (var k = 0; k < nS; k++) {
        var dx = b.x - sp.x[k], dy = b.y - sp.y[k], dz = b.z - sp.z[k];
        var rr = b.r + sp.r[k];
        var d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= rr * rr || d2 < 1e-10) continue;
        var d = Math.sqrt(d2);
        var pen = Math.min(rr - d, 0.03);
        if (b.asleep) this.wake(b);
        this._resolveFixed(b, dx / d, dy / d, dz / d, pen, sv.x[k], sv.y[k], sv.z[k], 0, 0.9, false);
      }
      var pp = this._palmContact(b);
      if (pp > 0) {
        if (b.asleep) this.wake(b);
        var pn = this._pn, hv = this.hubV;
        this._resolveFixed(b, pn[0], pn[1], pn[2], Math.min(pp, 0.03), hv[0], hv[1], hv[2], 0, 0.9, false);
      }
    }
  };

  Sim.prototype._bodyContacts = function (record) {
    var bodies = this.bodies, n = bodies.length, cfg = this.cfg;
    for (var i = 0; i < n; i++) {
      var a = bodies[i];
      if (!a.active) continue;
      for (var j = i + 1; j < n; j++) {
        var b = bodies[j];
        if (!b.active) continue;
        if (a.asleep && b.asleep) continue;
        var dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
        var rr = a.r + b.r;
        var d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= rr * rr || d2 < 1e-10) continue;
        var d = Math.sqrt(d2);
        var nx = dx / d, ny = dy / d, nz = dz / d;
        var pen = rr - d;

        // velocità relativa nel punto di contatto
        var rvx = (b.vx + (b.wy * -nz - b.wz * -ny) * b.r) - (a.vx + (a.wy * nz - a.wz * ny) * a.r);
        var rvy = (b.vy + (b.wz * -nx - b.wx * -nz) * b.r) - (a.vy + (a.wz * nx - a.wx * nz) * a.r);
        var rvz = (b.vz + (b.wx * -ny - b.wy * -nx) * b.r) - (a.vz + (a.wx * ny - a.wy * nx) * a.r);
        var vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny + (b.vz - a.vz) * nz;

        // un corpo addormentato fa da appoggio fermo finché l'urto non è abbastanza forte
        if (a.asleep || b.asleep) {
          var moving = a.asleep ? b : a;
          var ms = moving.vx * moving.vx + moving.vy * moving.vy + moving.vz * moving.vz;
          if (vn < -0.3 || ms > 0.05) this.wake(a.asleep ? a : b);
        }
        var wa = a.asleep ? 0 : a.invM, wb = b.asleep ? 0 : b.invM;
        var wsum = wa + wb;
        if (wsum === 0) continue;

        var corr = Math.max(0, pen - 0.002) * 0.85 / wsum;
        a.x -= nx * corr * wa; a.y -= ny * corr * wa; a.z -= nz * corr * wa;
        b.x += nx * corr * wb; b.y += ny * corr * wb; b.z += nz * corr * wb;

        if (vn >= 0) continue;
        var e = vn < -0.7 ? cfg.restitution : 0;
        var jn = -(1 + e) * vn / wsum;
        a.vx -= jn * wa * nx; a.vy -= jn * wa * ny; a.vz -= jn * wa * nz;
        b.vx += jn * wb * nx; b.vy += jn * wb * ny; b.vz += jn * wb * nz;
        if (record && vn < -0.9) this.impacts.push({ speed: -vn, kind: 'body', x: a.x + nx * a.r, y: a.y + ny * a.r, z: a.z + nz * a.r });

        var rn = rvx * nx + rvy * ny + rvz * nz;
        rvx -= rn * nx; rvy -= rn * ny; rvz -= rn * nz;
        var vt = Math.sqrt(rvx * rvx + rvy * rvy + rvz * rvz);
        if (vt > 1e-5) {
          var tx = rvx / vt, ty = rvy / vt, tz = rvz / vt;
          var jt = Math.min(cfg.friction * jn, vt * TAN_MASS / wsum);
          a.vx += jt * wa * tx; a.vy += jt * wa * ty; a.vz += jt * wa * tz;
          b.vx -= jt * wb * tx; b.vy -= jt * wb * ty; b.vz -= jt * wb * tz;
          var cxn = ny * tz - nz * ty, cyn = nz * tx - nx * tz, czn = nx * ty - ny * tx;
          var sa = jt * wa / (K_INERTIA * a.r), sb = jt * wb / (K_INERTIA * b.r);
          a.wx += cxn * sa; a.wy += cyn * sa; a.wz += czn * sa;
          b.wx += cxn * sb; b.wy += cyn * sb; b.wz += czn * sb;
        }
      }
    }
  };

  Sim.prototype._staticContacts = function (record, h) {
    var cfg = this.cfg, bodies = this.bodies, boxes = this.boxes;
    var e = cfg.wallRestitution, mu = cfg.wallFriction;
    var top = cfg.railY - 0.25;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.active || b.asleep) continue;
      var r = b.r, grounded = false;

      // paratie dello scivolo
      for (var j = 0; j < boxes.length; j++) {
        var bx = boxes[j];
        var qx = clamp(b.x, bx.x0, bx.x1), qy = clamp(b.y, bx.y0, bx.y1), qz = clamp(b.z, bx.z0, bx.z1);
        var dx = b.x - qx, dy = b.y - qy, dz = b.z - qz;
        var d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r * r) continue;
        if (d2 > 1e-10) {
          var d = Math.sqrt(d2);
          this._resolveFixed(b, dx / d, dy / d, dz / d, r - d, 0, 0, 0, e, mu, record);
        } else {
          // centro dentro la paratia: esce dal lato più vicino
          var px0 = b.x - bx.x0, px1 = bx.x1 - b.x, pz0 = b.z - bx.z0, pz1 = bx.z1 - b.z, py1 = bx.y1 - b.y;
          var m = Math.min(px0, px1, pz0, pz1, py1);
          if (m === py1) this._resolveFixed(b, 0, 1, 0, py1 + r, 0, 0, 0, e, mu, record);
          else if (m === px0) this._resolveFixed(b, -1, 0, 0, px0 + r, 0, 0, 0, e, mu, record);
          else if (m === px1) this._resolveFixed(b, 1, 0, 0, px1 + r, 0, 0, 0, e, mu, record);
          else if (m === pz0) this._resolveFixed(b, 0, 0, -1, pz0 + r, 0, 0, 0, e, mu, record);
          else this._resolveFixed(b, 0, 0, 1, pz1 + r, 0, 0, 0, e, mu, record);
        }
      }

      // vetri della vasca
      if (b.x < -cfg.hx + r) this._resolveFixed(b, 1, 0, 0, -cfg.hx + r - b.x, 0, 0, 0, e, mu, record);
      if (b.x > cfg.hx - r) this._resolveFixed(b, -1, 0, 0, b.x - (cfg.hx - r), 0, 0, 0, e, mu, record);
      if (b.z < -cfg.hz + r) this._resolveFixed(b, 0, 0, 1, -cfg.hz + r - b.z, 0, 0, 0, e, mu, record);
      if (b.z > cfg.hz - r) this._resolveFixed(b, 0, 0, -1, b.z - (cfg.hz - r), 0, 0, 0, e, mu, record);
      if (b.y > top - r) this._resolveFixed(b, 0, -1, 0, b.y - (top - r), 0, 0, 0, 0, mu, false);

      // pavimento (assente sopra la buca)
      if (b.y < r + 0.13) {
        var fh = this.floorAt(b.x, b.z), fn = this._fn;
        var pen = (fh + r / fn[1] - b.y) * fn[1];
        if (fh > -1 && pen > 0) {
          this._resolveFixed(b, fn[0], fn[1], fn[2], pen, 0, 0, 0, e, mu, record);
          grounded = true;
        }
      }
      if (grounded && h) {
        // resistenza al rotolamento
        // (più marcata quando il corpo è quasi fermo, così il mucchio si assesta invece di strisciare)
        var slow = (b.vx * b.vx + b.vy * b.vy + b.vz * b.vz) < 0.02;
        var f = 1 - (slow ? 7 : 1.6) * h;
        b.vx *= f; b.vz *= f;
        var fw = 1 - (slow ? 8 : 2.2) * h;
        b.wx *= fw; b.wy *= fw; b.wz *= fw;
      }
    }
  };

  // ------------------------------------------------------------------
  // Riempimento della vasca: le capsule piovono dall'alto
  // ------------------------------------------------------------------
  Sim.prototype.dropPoint = function (rng) {
    var cfg = this.cfg, c = this.claw, x, z, tries = 0, bad;
    do {
      x = (rng() * 2 - 1) * (cfg.hx - 0.55);
      z = (rng() * 2 - 1) * (cfg.hz - 0.55);
      var dx = x - c.hub.x, dz = z - c.hub.z;
      bad = (x < cfg.chute.x1 + 0.65 && z > cfg.chute.z0 - 0.65) || (dx * dx + dz * dz < 0.85 * 0.85);
      tries++;
    } while (bad && tries < 80);
    return { x: x, y: 2.05, z: z };
  };

  var api = { Sim: Sim, CLAW: CLAW, DEFAULTS: DEFAULTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ClawPhysics = api;
})(typeof window !== 'undefined' ? window : this);
