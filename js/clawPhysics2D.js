/**
 * designjack — Claw Machine 2D: motore fisico
 *
 * Versione bidimensionale di clawPhysics.js, con la stessa logica di gioco:
 *  - capsule e palline come cerchi rigidi (urti, attrito, rotolamento, sonno)
 *  - fondo con rampe verso le pareti, buca dello scivolo con paratia
 *  - carrello motorizzato, cavo e artiglio a pendolo
 *  - due dita cinematiche con chiusura "cedevole": la presa nasce dai contatti
 *
 * Coordinate in unità di gioco: x da 0 (parete sinistra) a W, y verso l'alto,
 * fondo vasca a y = 0. La larghezza W si adatta alla forma dello schermo.
 */
(function (root) {
  'use strict';

  var K_INERTIA = 0.5;
  var TAN_MASS = 1 / (1 + 1 / K_INERTIA);

  var DEFAULTS = {
    W: 16,
    railY: 8.2,
    gravity: 26,
    chute: { x1: 2.4, wallT: 0.14, wallH: 1.5, depth: 2.2 },
    rimRamp: { w: 0.85, h: 0.2 },
    chuteRamp: { w: 1.5, h: 0.45 },
    carriage: { vmax: 3.4, accel: 16, brake: 21 },
    cable: { Lmin: 1.0, vDown: 4.2, vUp: 3.2 },
    restitution: 0.42,
    friction: 0.32,
    wallRestitution: 0.36,
    wallFriction: 0.45
  };

  // Profilo di un dito nel piano (ρ radiale verso l'esterno, y verso l'alto) rispetto al perno, a θ = 0
  var CLAW = {
    pivotR: 0.22,
    pivotY: -0.12,
    elbow: [0.51, -0.41],
    tip: [0.1, -1.14],
    hook: [-0.07, -1.22],
    rf: 0.1,
    palmY: -0.3,
    palmHW: 0.42,
    thetaOpen: 0.42,
    thetaIdle: 0.36,
    thetaMin: -0.08
  };

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function Sim2D(opts) {
    var cfg = {}, k;
    for (k in DEFAULTS) cfg[k] = DEFAULTS[k];
    if (opts) for (k in opts) cfg[k] = opts[k];
    cfg.chute = { x1: cfg.chute.x1, wallT: cfg.chute.wallT, wallH: cfg.chute.wallH, depth: cfg.chute.depth };
    this.chuteWide = cfg.chute.x1;
    this.cfg = cfg;
    this.geo = CLAW;
    this.h = 1 / 240;
    this.acc = 0;
    this.time = 0;
    this.bodies = [];
    this.nextId = 1;
    this.input = 0;
    this.impacts = [];
    this.listener = null;
    this.Lmax = cfg.railY - 1.1;
    this._fn = [0, 1];
    this._pn = [0, 0];
    this.hubPrev = [0, 0];
    this.hubV = [0, 0];

    this.claw = {
      state: 'IDLE', t: 0,
      cx: 0, cvx: 0, ox: 0, ovx: 0,
      L: cfg.cable.Lmin, vL: 0, lift: 0,
      theta: CLAW.thetaIdle, blocked: false,
      hub: { x: 0, y: 0 }, ex: [1, 0], ey: [0, 1],
      landedT: 0, settleT: 0, supported: false,
      held: null, moving: 0
    };
    this.setWidth(cfg.W);
    this.claw.cx = this.home;
    this._buildProfile();
    this._frame();
    this._fillSpheres(this.claw.theta);
    this._copyPrev();
  }

  Sim2D.prototype.emit = function (type, data) { if (this.listener) this.listener(type, data); };

  // La larghezza della vasca segue la forma dello schermo
  Sim2D.prototype.setWidth = function (W) {
    var cfg = this.cfg, c = cfg.chute;
    cfg.W = Math.max(6, W);
    c.x1 = cfg.W < 8 ? 1.9 : this.chuteWide;          // su schermi stretti lo scivolo lascia più spazio alla vasca
    this.dropX = c.x1 / 2;
    this.minX = this.dropX;
    this.maxX = cfg.W - 0.95;
    this.home = clamp(cfg.W * 0.55, c.x1 + 1.4, this.maxX);
    this.box = { x0: c.x1, x1: c.x1 + c.wallT, y0: -c.depth - 1, y1: c.wallH };
    var cl = this.claw;
    if (cl) cl.cx = clamp(cl.cx, this.minX, this.maxX);
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (b.active && b.x > cfg.W - b.r) { b.x = cfg.W - b.r; this.wake(b); }
    }
  };

  // ------------------------------------------------------------------
  // Corpi
  // ------------------------------------------------------------------
  Sim2D.prototype.addBody = function (o) {
    var r = o.r || 0.55;
    var m = o.m || Math.pow(r / 0.55, 2);
    var b = {
      id: this.nextId++, kind: o.kind || 'capsule', data: o.data || null,
      r: r, m: m, invM: 1 / m,
      x: o.x || 0, y: o.y || r, vx: o.vx || 0, vy: o.vy || 0,
      a: o.a || 0, w: o.w || 0,
      active: true, asleep: false, still: 0
    };
    this.bodies.push(b);
    return b;
  };

  Sim2D.prototype.respawn = function (b, x, y) {
    b.x = x; b.y = y; b.vx = 0; b.vy = 0; b.w = 0;
    b.active = true; b.asleep = false; b.still = 0;
  };

  Sim2D.prototype.wake = function (b) {
    if (!b.asleep) { b.still = 0; return; }
    var stack = [b], bodies = this.bodies;
    b.asleep = false; b.still = 0;
    while (stack.length) {
      var a = stack.pop();
      for (var i = 0; i < bodies.length; i++) {
        var o = bodies[i];
        if (!o.active || !o.asleep) continue;
        var dx = o.x - a.x, dy = o.y - a.y, rr = a.r + o.r + 0.06;
        if (dx * dx + dy * dy < rr * rr) { o.asleep = false; o.still = 0; stack.push(o); }
      }
    }
  };

  Sim2D.prototype.allAsleep = function () {
    for (var i = 0; i < this.bodies.length; i++) { var b = this.bodies[i]; if (b.active && !b.asleep) return false; }
    return true;
  };

  // ------------------------------------------------------------------
  // Geometria della vasca
  // ------------------------------------------------------------------
  Sim2D.prototype.overHole = function (x) { return x < this.cfg.chute.x1; };

  // Quota del fondo in x; la normale va in this._fn. Sopra la buca non c'è fondo.
  Sim2D.prototype.floorAt = function (x) {
    var cfg = this.cfg, c = cfg.chute, n = this._fn;
    n[0] = 0; n[1] = 1;
    if (x < c.x1) return -1e9;
    var h = 0, rr = cfg.rimRamp, cr = cfg.chuteRamp;
    var dw = cfg.W - x;
    if (dw < rr.w) { h = rr.h * (1 - Math.max(0, dw) / rr.w); n[0] = -rr.h / rr.w; }
    var ex = Math.max(0, x - (c.x1 + c.wallT));
    if (ex < cr.w) {
      var hc = cr.h * (1 - ex / cr.w);
      if (hc > h) { h = hc; n[0] = cr.h / cr.w; }
    }
    if (h > 0) { var il = 1 / Math.sqrt(n[0] * n[0] + 1); n[0] *= il; n[1] = il; }
    return h;
  };

  // ------------------------------------------------------------------
  // Artiglio
  // ------------------------------------------------------------------
  Sim2D.prototype._buildProfile = function () {
    var g = CLAW, pts = [];
    function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    pts.push({ p: lerp([0, 0], g.elbow, 0.55), r: g.rf });
    pts.push({ p: g.elbow, r: g.rf });
    for (var k = 1; k <= 4; k++) pts.push({ p: lerp(g.elbow, g.tip, k * 0.22), r: g.rf });
    pts.push({ p: g.tip, r: g.rf });
    pts.push({ p: g.hook, r: 0.09 });
    this.profile = pts;
    this.perFinger = pts.length;
    var n = pts.length * 2;
    this.spCount = n;
    this.sp = { x: new Float64Array(n), y: new Float64Array(n), r: new Float64Array(n) };
    this.spPrev = { x: new Float64Array(n), y: new Float64Array(n) };
    this.spV = { x: new Float64Array(n), y: new Float64Array(n) };
    this.tmp = { x: new Float64Array(pts.length), y: new Float64Array(pts.length) };
  };

  Sim2D.prototype._frame = function () {
    var c = this.claw, cfg = this.cfg;
    var Ly = Math.sqrt(Math.max(1e-6, c.L * c.L - c.ox * c.ox));
    c.hub.x = c.cx + c.ox;
    c.hub.y = cfg.railY - Ly + c.lift;
    c.ey[0] = -c.ox / c.L; c.ey[1] = Ly / c.L;
    c.ex[0] = c.ey[1]; c.ex[1] = -c.ey[0];
  };

  // side: -1 dito sinistro, +1 dito destro
  Sim2D.prototype._fingerPoints = function (side, theta, out) {
    var c = this.claw, g = CLAW, pts = this.profile;
    var dx = c.ex[0] * side, dy = c.ex[1] * side;
    var ct = Math.cos(theta), st = Math.sin(theta);
    for (var j = 0; j < pts.length; j++) {
      var p = pts[j].p;
      var rho = g.pivotR + p[0] * ct - p[1] * st;
      var yy = g.pivotY + p[1] * ct + p[0] * st;
      out.x[j] = c.hub.x + dx * rho + c.ey[0] * yy;
      out.y[j] = c.hub.y + dy * rho + c.ey[1] * yy;
    }
  };

  Sim2D.prototype._fillSpheres = function (theta) {
    var n = this.perFinger, tmp = this.tmp, sp = this.sp;
    for (var f = 0; f < 2; f++) {
      this._fingerPoints(f === 0 ? -1 : 1, theta, tmp);
      for (var j = 0; j < n; j++) {
        var k = f * n + j;
        sp.x[k] = tmp.x[j]; sp.y[k] = tmp.y[j]; sp.r[k] = this.profile[j].r;
      }
    }
  };

  Sim2D.prototype._copyPrev = function () {
    var c = this.claw;
    this.hubPrev[0] = c.hub.x; this.hubPrev[1] = c.hub.y;
    for (var k = 0; k < this.spCount; k++) { this.spPrev.x[k] = this.sp.x[k]; this.spPrev.y[k] = this.sp.y[k]; }
  };

  // Contatto cerchio–palmo (segmento piatto sotto il mozzo); normale in this._pn
  Sim2D.prototype._palmContact = function (b) {
    var c = this.claw, g = CLAW, n = this._pn;
    var dx = b.x - c.hub.x, dy = b.y - c.hub.y;
    var lx = dx * c.ex[0] + dy * c.ex[1];
    var ly = dx * c.ey[0] + dy * c.ey[1];
    var qx = clamp(lx, -g.palmHW, g.palmHW);
    var ox = lx - qx, oy = ly - g.palmY;
    if (oy > 0) return 0;
    var d2 = ox * ox + oy * oy;
    if (d2 >= b.r * b.r) return 0;
    var d = Math.sqrt(d2);
    if (d < 1e-6) { ox = 0; oy = -1; d = 1; }
    ox /= d; oy /= d;
    n[0] = ox * c.ex[0] + oy * c.ey[0];
    n[1] = ox * c.ex[1] + oy * c.ey[1];
    return b.r - d;
  };

  Sim2D.prototype._fingersMaxPen = function (theta) {
    var tmp = this.tmp, n = this.perFinger, bodies = this.bodies, hub = this.claw.hub, maxPen = 0;
    for (var f = 0; f < 2; f++) {
      this._fingerPoints(f === 0 ? -1 : 1, theta, tmp);
      for (var b = 0; b < bodies.length; b++) {
        var bd = bodies[b];
        if (!bd.active) continue;
        var hx = bd.x - hub.x, hy = bd.y - hub.y;
        if (hx * hx + hy * hy > 8) continue;
        for (var j = 0; j < n; j++) {
          var dx = bd.x - tmp.x[j], dy = bd.y - tmp.y[j], rr = bd.r + this.profile[j].r;
          var d2 = dx * dx + dy * dy;
          if (d2 < rr * rr) { var pen = rr - Math.sqrt(d2); if (pen > maxPen) maxPen = pen; }
        }
      }
    }
    return maxPen;
  };

  Sim2D.prototype.inCage = function () {
    var c = this.claw, out = [];
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (!b.active) continue;
      var dx = b.x - c.hub.x, dy = b.y - c.hub.y;
      var lx = dx * c.ex[0] + dy * c.ex[1], ly = dx * c.ey[0] + dy * c.ey[1];
      if (Math.abs(lx) < 0.61 && ly < -0.2 && ly > -1.73) out.push(b);
    }
    return out;
  };

  Sim2D.prototype.aim = function () {
    var c = this.claw, best = null, bestD = 1e9;
    for (var i = 0; i < this.bodies.length; i++) {
      var b = this.bodies[i];
      if (!b.active || b.kind !== 'capsule') continue;
      var d = Math.abs(b.x - c.hub.x);
      if (d < bestD) { bestD = d; best = b; }
    }
    return { body: best, dist: bestD };
  };

  // ------------------------------------------------------------------
  // Comandi e automazione
  // ------------------------------------------------------------------
  Sim2D.prototype.pressDrop = function () {
    if (this.claw.state !== 'IDLE') return false;
    this._setState('DROP');
    return true;
  };

  Sim2D.prototype._setState = function (s) {
    var c = this.claw;
    c.state = s; c.t = 0; c.landedT = 0; c.settleT = 0;
    this.emit('state', s);
  };

  Sim2D.prototype._drive = function (tv, h, accel) {
    var c = this.claw, dv = tv - c.cvx, mx = accel * h;
    c.cvx += clamp(dv, -mx, mx);
  };

  Sim2D.prototype._seek = function (tx, h, vmax, accel) {
    var c = this.claw, dx = tx - c.cx, dist = Math.abs(dx);
    if (dist < 1e-4) { this._drive(0, h, accel); return dist; }
    var v = Math.min(vmax, Math.sqrt(2 * accel * 0.55 * dist));
    this._drive(dx > 0 ? v : -v, h, accel);
    return dist;
  };

  Sim2D.prototype.update = function (dt) {
    if (dt > 0.05) dt = 0.05;
    this.acc += dt;
    this.impacts.length = 0;
    var n = 0;
    while (this.acc >= this.h && n < 16) { this._step(this.h); this.acc -= this.h; n++; }
    if (n === 16) this.acc = 0;
  };

  Sim2D.prototype._step = function (h) {
    var cfg = this.cfg, c = this.claw, g = CLAW, cab = cfg.cable, car = cfg.carriage;
    var i, j, k, b;
    this.time += h;
    c.t += h;

    // ---- 1. Logica di gioco
    var fingerTarget = g.thetaIdle, fingerRate = 3.0, vL = 0, pcv = c.cvx;
    switch (c.state) {
      case 'IDLE': {
        var ix = clamp(this.input, -1, 1);
        this._drive(ix * car.vmax, h, Math.abs(ix) > 0.01 ? car.accel : car.brake);
        vL = c.L > cab.Lmin ? -cab.vUp : 0;
        break;
      }
      case 'DROP': {
        this._drive(0, h, car.brake);
        fingerTarget = g.thetaOpen; fingerRate = 5.0;
        if (c.t > 0.16) vL = c.supported ? 0 : cab.vDown;
        if (c.supported) c.landedT += h; else c.landedT = Math.max(0, c.landedT - h);
        if (c.landedT > 0.05 || c.L >= this.Lmax - 1e-4) { this._setState('CLOSE'); this.emit('landed'); }
        break;
      }
      case 'CLOSE': {
        this._drive(0, h, car.brake);
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
        this._drive(0, h, car.brake);
        fingerTarget = g.thetaMin; fingerRate = 1.4;
        vL = -cab.vUp;
        if (c.L <= cab.Lmin + 1e-4) {
          var heldNow = this.inCage();
          if (heldNow.length) { c.held = heldNow[0]; this._setState('CARRY'); this.emit('lifted', c.held); }
          else { c.held = null; this._setState('RETURN'); this.emit('miss'); }
        }
        break;
      }
      case 'CARRY': {
        fingerTarget = g.thetaMin; fingerRate = 1.4;
        var dist = this._seek(this.dropX, h, 4.6, 7.5);
        var cage = this.inCage();
        if (!cage.length) { c.held = null; this._setState('RETURN'); this.emit('slip'); break; }
        c.held = cage[0];
        if (dist < 0.06) {
          c.settleT += h;
          var sway = Math.abs(c.ox) + 0.25 * Math.abs(c.ovx);
          if ((sway < 0.1 && c.settleT > 0.2) || c.settleT > 1.3) { this._setState('RELEASE'); this.emit('release', c.held); }
        }
        break;
      }
      case 'RELEASE': {
        this._drive(0, h, car.brake);
        fingerTarget = g.thetaOpen; fingerRate = 6.5;
        if (c.t > 0.85) { c.held = null; this._setState('RETURN'); }
        break;
      }
      case 'RETURN': {
        vL = c.L > cab.Lmin ? -cab.vUp : 0;
        var dh = this._seek(this.home, h, 5.2, 9.0);
        if (dh < 0.04 && c.L <= cab.Lmin + 1e-4) { this._setState('IDLE'); this.emit('ready'); }
        break;
      }
    }

    // ---- 2. Carrello con fine corsa
    c.cx += c.cvx * h;
    if (c.cx > this.maxX) { c.cx = this.maxX; if (c.cvx > 0) c.cvx = 0; }
    if (c.cx < this.minX) { c.cx = this.minX; if (c.cvx < 0) c.cvx = 0; }
    var ax = clamp((c.cvx - pcv) / h, -52, 52);
    c.moving = clamp(Math.max(Math.abs(c.cvx) / car.vmax, Math.abs(vL) > 0.01 ? 0.75 : 0), 0, 1);

    // ---- 3. Cavo e pendolo
    c.vL = vL;
    c.L = clamp(c.L + vL * h, cab.Lmin, this.Lmax);
    var w2 = cfg.gravity / Math.max(c.L, 0.9);
    var damp = c.held ? 1.25 : 1.7;
    c.ovx += (-w2 * c.ox - damp * c.ovx - ax * 0.5) * h;
    if (c.supported) c.ovx *= Math.max(0, 1 - 14 * h);
    c.ox += c.ovx * h;
    var omax = 0.55 * c.L;
    if (Math.abs(c.ox) > omax) { c.ox = clamp(c.ox, -omax, omax); c.ovx *= 0.5; }
    c.lift = Math.max(0, c.lift - 5.2 * h);
    this._frame();

    // ---- 4. Dita: apertura libera, chiusura cedevole
    if (fingerTarget > c.theta) {
      c.theta = Math.min(fingerTarget, c.theta + fingerRate * h);
      c.blocked = false;
    } else if (fingerTarget < c.theta) {
      var tryTh = Math.max(fingerTarget, c.theta - fingerRate * h);
      // si ferma solo se chiudendo schiaccerebbe di più un corpo (non per contatti già esistenti)
      var penTry = this._fingersMaxPen(tryTh);
      if (penTry > 0.025 && penTry > this._fingersMaxPen(c.theta) + 0.003) c.blocked = true;
      else { c.theta = tryTh; c.blocked = false; }
    }
    this._fillSpheres(c.theta);

    // ---- 5. Appoggio su fondo e paratia
    var sp = this.sp, nS = this.spCount, need = 0, bx = this.box;
    for (k = 0; k < nS; k++) {
      var fh = this.floorAt(sp.x[k]);
      if (fh > -1) { var pf = fh + sp.r[k] - sp.y[k]; if (pf > need) need = pf; }
      var dxb = sp.x[k] - clamp(sp.x[k], bx.x0, bx.x1);
      var hr = sp.r[k] * sp.r[k] - dxb * dxb;
      if (hr > 0) { var pb = bx.y1 + Math.sqrt(hr) - sp.y[k]; if (pb > 0 && pb < 0.4 && pb > need) need = pb; }
    }
    // il palmo conta come un dito piatto
    var palmY = c.hub.y + c.ey[1] * g.palmY, palmFh = Math.max(this.floorAt(c.hub.x - g.palmHW), this.floorAt(c.hub.x + g.palmHW));
    if (palmFh > -1 && palmFh - palmY > need) need = palmFh - palmY;
    c.supported = need > 0.001;
    if (need > 0) { c.lift += need; c.hub.y += need; for (k = 0; k < nS; k++) sp.y[k] += need; }
    var ih = 1 / h;
    this.hubV[0] = (c.hub.x - this.hubPrev[0]) * ih;
    this.hubV[1] = (c.hub.y - this.hubPrev[1]) * ih;
    for (k = 0; k < nS; k++) {
      this.spV.x[k] = (sp.x[k] - this.spPrev.x[k]) * ih;
      this.spV.y[k] = (sp.y[k] - this.spPrev.y[k]) * ih;
    }

    // ---- 6. Integrazione
    var bodies = this.bodies, nB = bodies.length;
    for (i = 0; i < nB; i++) {
      b = bodies[i];
      if (!b.active || b.asleep) continue;
      b.vy -= cfg.gravity * h;
      var lin = 1 - 0.12 * h;
      b.vx *= lin; b.vy *= lin; b.w *= 1 - 0.5 * h;
      b.x += b.vx * h; b.y += b.vy * h; b.a += b.w * h;
    }

    // ---- 7. Contatti
    for (var it = 0; it < 3; it++) {
      this._clawContacts();
      this._bodyContacts(it === 0);
      this._staticContacts(it === 0, h);
    }

    // ---- 8. In discesa il mozzo si ferma sopra un corpo che lo regge
    if (c.state === 'DROP') {
      var needB = 0;
      for (i = 0; i < nB; i++) {
        b = bodies[i];
        if (!b.active) continue;
        var hbx = b.x - c.hub.x, hby = b.y - c.hub.y;
        if (hbx * hbx + hby * hby > 8) continue;
        for (k = 0; k < nS; k++) {
          var dx = b.x - sp.x[k], dy = b.y - sp.y[k], rr = b.r + sp.r[k], d2 = dx * dx + dy * dy;
          if (d2 < rr * rr && d2 > 1e-9) {
            var d = Math.sqrt(d2), pen = rr - d, ny = dy / d;
            // le dita si fermano solo su un appoggio quasi orizzontale: sui fianchi scivolano e spostano i vicini
            if (pen > 0.01 && ny < -0.93 && pen * -ny > needB) needB = pen * -ny;
          }
        }
        var pp = this._palmContact(b);
        if (pp > 0.01 && this._pn[1] < -0.35 && pp * -this._pn[1] > needB) needB = pp * -this._pn[1];
      }
      if (needB > 0) {
        c.supported = true;
        needB = Math.min(needB, 0.1);
        c.lift += needB; c.hub.y += needB;
        for (k = 0; k < nS; k++) sp.y[k] += needB;
      }
    }
    this._copyPrev();

    // ---- 9. Scivolo e sonno
    var ch = cfg.chute;
    for (i = 0; i < nB; i++) {
      b = bodies[i];
      if (!b.active) continue;
      if (b.y < -ch.depth + 0.4) { b.active = false; this.emit('chute', b); continue; }
      if (b.asleep) continue;
      var v2 = b.vx * b.vx + b.vy * b.vy;
      if (v2 < 0.06 && b.w * b.w < 0.25) {
        b.still += h;
        if (b.still > 0.45) { b.asleep = true; b.vx = b.vy = b.w = 0; }
      } else {
        b.still = Math.max(0, b.still - 3 * h);
      }
    }
  };

  // Contatto con una superficie cinematica o fissa (normale dalla superficie al corpo)
  Sim2D.prototype._resolveFixed = function (b, nx, ny, pen, svx, svy, rest, mu, record) {
    b.x += nx * pen; b.y += ny * pen;
    var vn = (b.vx - svx) * nx + (b.vy - svy) * ny;
    if (vn >= 0) return;
    var e = vn < -1.4 ? rest : 0;
    var jn = -(1 + e) * vn;
    b.vx += jn * nx; b.vy += jn * ny;
    if (record && vn < -1.8) this.impacts.push({ speed: -vn, kind: 'wall' });
    var tx = -ny, ty = nx;
    var vt = (b.vx - svx) * tx + (b.vy - svy) * ty - b.w * b.r;
    var jt = clamp(-vt * TAN_MASS, -mu * jn, mu * jn);
    b.vx += jt * tx; b.vy += jt * ty;
    b.w -= jt / (K_INERTIA * b.r);
  };

  Sim2D.prototype._clawContacts = function () {
    var sp = this.sp, sv = this.spV, nS = this.spCount, bodies = this.bodies, hub = this.claw.hub;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.active) continue;
      var hx = b.x - hub.x, hy = b.y - hub.y;
      if (hx * hx + hy * hy > 8) continue;
      for (var k = 0; k < nS; k++) {
        var dx = b.x - sp.x[k], dy = b.y - sp.y[k], rr = b.r + sp.r[k], d2 = dx * dx + dy * dy;
        if (d2 >= rr * rr || d2 < 1e-10) continue;
        var d = Math.sqrt(d2);
        if (b.asleep) this.wake(b);
        this._resolveFixed(b, dx / d, dy / d, Math.min(rr - d, 0.06), sv.x[k], sv.y[k], 0, 0.9, false);
      }
      var pp = this._palmContact(b);
      if (pp > 0) {
        if (b.asleep) this.wake(b);
        this._resolveFixed(b, this._pn[0], this._pn[1], Math.min(pp, 0.06), this.hubV[0], this.hubV[1], 0, 0.9, false);
      }
    }
  };

  Sim2D.prototype._bodyContacts = function (record) {
    var bodies = this.bodies, n = bodies.length, cfg = this.cfg;
    for (var i = 0; i < n; i++) {
      var a = bodies[i];
      if (!a.active) continue;
      for (var j = i + 1; j < n; j++) {
        var b = bodies[j];
        if (!b.active || (a.asleep && b.asleep)) continue;
        var dx = b.x - a.x, dy = b.y - a.y, rr = a.r + b.r, d2 = dx * dx + dy * dy;
        if (d2 >= rr * rr || d2 < 1e-10) continue;
        var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = rr - d;
        var vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (a.asleep || b.asleep) {
          var mv = a.asleep ? b : a;
          if (vn < -0.6 || mv.vx * mv.vx + mv.vy * mv.vy > 0.2) this.wake(a.asleep ? a : b);
        }
        var wa = a.asleep ? 0 : a.invM, wb = b.asleep ? 0 : b.invM, ws = wa + wb;
        if (ws === 0) continue;
        var corr = Math.max(0, pen - 0.004) * 0.85 / ws;
        a.x -= nx * corr * wa; a.y -= ny * corr * wa;
        b.x += nx * corr * wb; b.y += ny * corr * wb;
        if (vn >= 0) continue;
        var e = vn < -1.4 ? cfg.restitution : 0;
        var jn = -(1 + e) * vn / ws;
        a.vx -= jn * wa * nx; a.vy -= jn * wa * ny;
        b.vx += jn * wb * nx; b.vy += jn * wb * ny;
        if (record && vn < -1.8) this.impacts.push({ speed: -vn, kind: 'body' });
        var tx = -ny, ty = nx;
        var vt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty - b.w * b.r - a.w * a.r;
        var jt = clamp(-vt * TAN_MASS / ws, -cfg.friction * jn, cfg.friction * jn);
        a.vx -= jt * wa * tx; a.vy -= jt * wa * ty;
        b.vx += jt * wb * tx; b.vy += jt * wb * ty;
        a.w -= jt * wa / (K_INERTIA * a.r);
        b.w -= jt * wb / (K_INERTIA * b.r);
      }
    }
  };

  Sim2D.prototype._staticContacts = function (record, h) {
    var cfg = this.cfg, bodies = this.bodies, bx = this.box;
    var e = cfg.wallRestitution, mu = cfg.wallFriction, top = cfg.railY - 0.5;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (!b.active || b.asleep) continue;
      var r = b.r, grounded = false;

      // paratia dello scivolo
      var qx = clamp(b.x, bx.x0, bx.x1), qy = clamp(b.y, bx.y0, bx.y1);
      var dx = b.x - qx, dy = b.y - qy, d2 = dx * dx + dy * dy;
      if (d2 < r * r) {
        if (d2 > 1e-10) { var d = Math.sqrt(d2); this._resolveFixed(b, dx / d, dy / d, r - d, 0, 0, e, mu, record); }
        else {
          var pl = b.x - bx.x0, pr = bx.x1 - b.x, pt = bx.y1 - b.y, m = Math.min(pl, pr, pt);
          if (m === pt) this._resolveFixed(b, 0, 1, pt + r, 0, 0, e, mu, record);
          else if (m === pl) this._resolveFixed(b, -1, 0, pl + r, 0, 0, e, mu, record);
          else this._resolveFixed(b, 1, 0, pr + r, 0, 0, e, mu, record);
        }
      }
      // pareti e soffitto
      if (b.x < r) this._resolveFixed(b, 1, 0, r - b.x, 0, 0, e, mu, record);
      if (b.x > cfg.W - r) this._resolveFixed(b, -1, 0, b.x - (cfg.W - r), 0, 0, e, mu, record);
      if (b.y > top - r) this._resolveFixed(b, 0, -1, b.y - (top - r), 0, 0, 0, mu, false);
      // fondo
      if (b.y < r + 0.3) {
        var fh = this.floorAt(b.x), fn = this._fn;
        var pen = (fh + r / fn[1] - b.y) * fn[1];
        if (fh > -1 && pen > 0) { this._resolveFixed(b, fn[0], fn[1], pen, 0, 0, e, mu, record); grounded = true; }
      }
      if (grounded && h) {
        var slow = (b.vx * b.vx + b.vy * b.vy) < 0.08;
        b.vx *= 1 - (slow ? 7 : 1.6) * h;
        b.w *= 1 - (slow ? 8 : 2.2) * h;
      }
    }
  };

  // Quanti corpi stanno comodi nella vasca, in base alla sua larghezza
  Sim2D.prototype.capacity = function () {
    var pitW = this.cfg.W - this.cfg.chute.x1 - this.cfg.chute.wallT;
    var slots = pitW / 1.1;
    return {
      capsules: Math.max(3, Math.min(12, Math.round(slots * 0.95))),
      fillers: Math.max(1, Math.min(8, Math.round(slots * 0.4)))
    };
  };

  // Punto da cui far piovere una capsula: lontano dallo scivolo e dall'artiglio
  Sim2D.prototype.dropPoint = function (rng) {
    var cfg = this.cfg, c = this.claw, x, tries = 0;
    var lo = cfg.chute.x1 + 1.3, hi = cfg.W - 0.9;
    do { x = lo + rng() * Math.max(0.1, hi - lo); tries++; } while (Math.abs(x - c.hub.x) < 1.5 && tries < 40);
    return { x: x, y: cfg.railY - 1.6 };
  };

  var api = { Sim2D: Sim2D, CLAW: CLAW, DEFAULTS: DEFAULTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ClawPhysics2D = api;
})(typeof window !== 'undefined' ? window : this);
