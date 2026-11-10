// Geomo 3D bike builder (Three.js). Builds a detailed, textured bike from frame geometry (mm).
// Coordinates: x forward, y up, z = drive side. Bottom bracket at the origin.
// Frame numbers (stack, reach, angles, chainstay, BB drop, wheelbase, head tube, stem) come from the Geomo database;
// tube diameters, component sizes and saddle height are generic visual choices, never shown as data.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const rad = d => d * Math.PI / 180;
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

// ---------- procedural textures ----------
function canvasTex(w, h, draw, repeat = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
export function textures() {
  const carbon = canvasTex(256, 256, (g, w, h) => {           // 2x2 twill weave
    const n = 16, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const a = ((i + j) >> 1) % 2 === 0;
      const gr = g.createLinearGradient(i * s, j * s, a ? (i + 1) * s : i * s, a ? j * s : (j + 1) * s);
      gr.addColorStop(0, a ? '#2a2c31' : '#17181b'); gr.addColorStop(0.5, a ? '#3a3d43' : '#202226'); gr.addColorStop(1, a ? '#2a2c31' : '#17181b');
      g.fillStyle = gr; g.fillRect(i * s, j * s, s, s);
    }
  }, [6, 2]);
  const tape = canvasTex(64, 256, (g, w, h) => {              // bar tape: diagonal wraps + perforation
    g.fillStyle = '#111214'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#2a2b2f'; g.lineWidth = 6;
    for (let y = -w; y < h + w; y += 22) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + 18); g.stroke(); }
    g.fillStyle = '#060607'; for (let y = 6; y < h; y += 11) for (let x = 6; x < w; x += 12) { g.beginPath(); g.arc(x + (y % 22 ? 6 : 0), y, 1.3, 0, 7); g.fill(); }
  }, [1, 30]);
  const sidewall = canvasTex(1024, 32, (g, w, h) => {         // tan sidewall with fine casing texture
    g.fillStyle = '#b8895a'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 3) { g.fillStyle = `rgba(80,50,20,${0.08 + 0.06 * Math.sin(x)})`; g.fillRect(x, 0, 1, h); }
  }, [6, 1]);
  const rotor = canvasTex(256, 256, (g, w, h) => {            // disc rotor with holes (alpha)
    g.clearRect(0, 0, w, h); const c = w / 2;
    g.fillStyle = '#c9cdd3'; g.beginPath(); g.arc(c, c, 127, 0, 7); g.arc(c, c, 100, 0, 7, true); g.fill();
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 36; i++) { const a = i / 36 * 2 * Math.PI; for (const r of [107, 119]) { g.beginPath(); g.arc(c + r * Math.cos(a + (r > 110 ? 0.09 : 0)), c + r * Math.sin(a + (r > 110 ? 0.09 : 0)), 3.2, 0, 7); g.fill(); } }
    g.globalCompositeOperation = 'source-over'; g.fillStyle = '#26282c';
    for (let i = 0; i < 6; i++) { g.save(); g.translate(c, c); g.rotate(i / 6 * 2 * Math.PI); g.fillRect(-7, 30, 14, 74); g.restore(); }
    g.beginPath(); g.arc(c, c, 34, 0, 7); g.fill();
  });
  return { carbon, tape, sidewall, rotor };
}

// ---------- helpers ----------
function tube(a, b, r1, r2, mat, seg = 28) {   // tapered cylinder from a to b
  const d = new THREE.Vector3().subVectors(b, a), L = d.length();
  const g = new THREE.CylinderGeometry(r2, r1, L, seg, 1, false);
  const m = new THREE.Mesh(g, mat); m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); m.castShadow = true; return m;
}
function addAt(par, m) { par.add(m); return m; }
function ball(p, r, mat) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat); m.position.copy(p); m.castShadow = true; return m; }
function gearShape(teeth, r, inner) {
  const s = new THREE.Shape(), n = teeth * 4;
  for (let i = 0; i <= n; i++) { const a = i / n * 2 * Math.PI, k = i % 4, rr = (k === 0 || k === 1) ? r + 3.2 : r - 1.2; const x = rr * Math.cos(a), y = rr * Math.sin(a); i ? s.lineTo(x, y) : s.moveTo(x, y); }
  if (inner) { const h = new THREE.Path(); h.absarc(0, 0, inner, 0, 2 * Math.PI, true); s.holes.push(h); }
  return s;
}

// ---------- the bike ----------
export function buildBike(G, opt = {}) {
  const T = opt.tex || textures();
  const bike = new THREE.Group();
  const M = {
    frame: new THREE.MeshPhysicalMaterial({ color: opt.frameColor || '#ffffff', map: T.carbon, roughness: 0.38, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.07 }),
    paint: new THREE.MeshPhysicalMaterial({ color: opt.paint || '#2f3a2c', roughness: 0.45, clearcoat: 1, clearcoatRoughness: 0.1 }),
    black: new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.55 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#17181a', roughness: 0.92 }),
    alu: new THREE.MeshStandardMaterial({ color: '#9aa0a8', roughness: 0.32, metalness: 0.9 }),
    steel: new THREE.MeshStandardMaterial({ color: '#c4c8ce', roughness: 0.25, metalness: 1.0 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: '#3a3d43', roughness: 0.35, metalness: 0.85 }),
    tape: new THREE.MeshStandardMaterial({ map: T.tape, roughness: 0.85 }),
    side: new THREE.MeshStandardMaterial({ map: T.sidewall, roughness: 0.8, side: THREE.DoubleSide }),
    rotor: new THREE.MeshStandardMaterial({ map: T.rotor, transparent: true, alphaTest: 0.5, metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide }),
    spoke: new THREE.MeshStandardMaterial({ color: '#202226', roughness: 0.4, metalness: 0.6 }),
    bottle: new THREE.MeshPhysicalMaterial({ color: opt.accent || '#1D9E75', roughness: 0.35, transmission: 0.0, clearcoat: 0.6 })
  };
  const R = opt.wheelR || 362;                                   // 700c x 45 mm tyre, outer radius
  const ra = -Math.sqrt(G.chainstay ** 2 - G.bbDrop ** 2), fa = ra + G.wheelbase, ay = G.bbDrop;
  const RA = V(ra, ay), FA = V(fa, ay);
  const htT = V(G.reach, G.stack), sa = V(Math.cos(rad(G.hta)), -Math.sin(rad(G.hta)));     // steering axis, pointing down
  const htB = V(G.reach + G.headTube * sa.x, G.stack + G.headTube * sa.y);
  const stTop = V(-(G.seatClusterY || 540) / Math.tan(rad(G.sta)), G.seatClusterY || 540);
  const onST = y => V(-y / Math.tan(rad(G.sta)), y);
  const parts = { frame: new THREE.Group(), wheels: [], crank: null, chain: null, cockpit: new THREE.Group() };

  // --- frame (centre plane + split stays) ---
  const F = parts.frame, fm = M.frame;
  const ttFront = htT.clone().add(V(-6, -26)), dtFront = htB.clone().add(V(-4, 34));
  F.add(tube(V(0, 0), stTop, 19, 16, fm));                      // seat tube
  F.add(tube(ttFront, stTop.clone().add(V(4, -14)), 19, 15, fm)); // top tube
  F.add(tube(htB.clone().add(V(sa.x * 8, sa.y * 8)), htT.clone().add(V(-sa.x * 6, -sa.y * 6)), 25, 21, fm)); // head tube (tapered)
  F.add(tube(V(0, 0), dtFront, 26, 24, fm));                    // down tube
  F.add(ball(dtFront, 25, fm)); F.add(ball(ttFront, 19, fm)); F.add(ball(stTop.clone().add(V(0, -6)), 18, fm));
  const bb = tube(V(0, 0, -44), V(0, 0, 44), 23, 23, fm); F.add(bb);
  const seatStayTop = onST(G.seatStayY || 420);
  for (const s of [-1, 1]) {
    F.add(tube(V(0, -6, s * 30), V(ra + 18, ay, s * 66), 12, 9, fm));      // chainstays
    F.add(tube(V(seatStayTop.x, seatStayTop.y, s * 14), V(ra + 12, ay + 6, s * 66), 9.5, 7, fm)); // dropped seat stays
    F.add(ball(V(ra + 10, ay, s * 66), 10, fm));                           // dropouts
  }
  // fork: crown + curved legs
  const crown = htB.clone().add(V(sa.x * 22, sa.y * 22));
  addAt(F, new THREE.Mesh(new RoundedBoxGeometry(46, 26, 110, 4, 8), fm)).position.copy(crown);
  for (const s of [-1, 1]) {
    const c = new THREE.QuadraticBezierCurve3(V(crown.x, crown.y, s * 40), V(crown.x + sa.x * 230 + 10, crown.y + sa.y * 230, s * 56), V(fa, ay, s * 58));
    const leg = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 13, 20, false), fm); leg.castShadow = true; F.add(leg);
  }
  bike.add(F);

  // --- wheels ---
  function wheel(center, front) {
    const w = new THREE.Group(); w.position.copy(center);
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(R - 21, 21, 28, 180), M.rubber); tyre.castShadow = true; w.add(tyre);
    const knob = new THREE.BoxGeometry(9, 5, 7), kn = 150;            // tread knobs, two staggered rows + centre row
    const inst = new THREE.InstancedMesh(knob, M.rubber, kn * 3), d = new THREE.Object3D();
    for (let i = 0; i < kn * 3; i++) {
      const row = i % 3, a = (Math.floor(i / 3) + (row === 1 ? 0.5 : 0)) / kn * 2 * Math.PI, z = [-11, 0, 11][row], rr = R - 1 + (row === 1 ? 0.6 : 0);
      d.position.set(rr * Math.cos(a), rr * Math.sin(a), z); d.rotation.set(0, 0, a); d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
    }
    inst.castShadow = true; w.add(inst);
    for (const s of [-1, 1]) { const ring = new THREE.Mesh(new THREE.RingGeometry(R - 36, R - 18, 180, 1), M.side); ring.position.z = s * 16.5; w.add(ring); }
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R - 50, 15, 20, 160), M.black); rim.scale.set(1, 1, 0.75); w.add(rim);
    const rimDepth = new THREE.Mesh(new THREE.CylinderGeometry(R - 44, R - 44, 22, 160, 1, true), M.black); rimDepth.rotation.x = Math.PI / 2; w.add(rimDepth);
    const hub = tube(V(0, 0, -52), V(0, 0, 52), 9, 9, M.darkMetal); w.add(hub);
    for (const s of [-1, 1]) w.add(tube(V(0, 0, s * 26), V(0, 0, s * 30), 24, 24, M.darkMetal));
    for (let i = 0; i < 24; i++) {                                       // tangential spokes
      const s = i % 2 ? 1 : -1, a = i / 24 * 2 * Math.PI, b = a + s * 0.35 * (i % 4 < 2 ? 1 : -1);
      w.add(tube(V(22 * Math.cos(a), 22 * Math.sin(a), s * 28), V((R - 62) * Math.cos(b), (R - 62) * Math.sin(b), s * 3), 1.2, 1.2, M.spoke, 6));
    }
    const disc = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), M.rotor); disc.position.z = -44; w.add(disc);   // 160 mm rotor, non-drive side
    w.userData.spin = true; return w;
  }
  const rw = wheel(RA, false), fw = wheel(FA, true); parts.wheels = [rw, fw]; bike.add(rw, fw);
  // brake calipers
  addAt(bike, new THREE.Mesh(new RoundedBoxGeometry(46, 30, 26, 3, 6), M.black)).position.set(ra + 30, ay + 70, -50);
  addAt(bike, new THREE.Mesh(new RoundedBoxGeometry(46, 30, 26, 3, 6), M.black)).position.set(fa - 50, ay + 55, -56);

  // --- drivetrain (drive side, z+) ---
  const crank = new THREE.Group(); crank.position.set(0, 0, 0);
  const ringT = opt.chainring || 40, rR = ringT * 12.7 / (2 * Math.PI);
  const ring = new THREE.Mesh(new THREE.ExtrudeGeometry(gearShape(ringT, rR, rR - 14), { depth: 3, bevelEnabled: false, curveSegments: 4 }), M.darkMetal); ring.position.z = 56; crank.add(ring);
  const spider = new THREE.Mesh(new THREE.CylinderGeometry(rR - 12, rR - 12, 4, 48), M.black); spider.rotation.x = Math.PI / 2; spider.position.z = 58; crank.add(spider);
  const armShape = new THREE.Shape(); armShape.moveTo(-17, 0); armShape.quadraticCurveTo(-11, 90, -10, 172.5); armShape.lineTo(10, 172.5); armShape.quadraticCurveTo(11, 90, 17, 0); armShape.absarc(0, 0, 17, 0, Math.PI, true);
  const armGeo = new THREE.ExtrudeGeometry(armShape, { depth: 14, bevelEnabled: true, bevelSize: 3, bevelThickness: 3, bevelSegments: 3 });
  const armR = new THREE.Mesh(armGeo, M.black); armR.position.z = 64; crank.add(armR);
  const armL = new THREE.Mesh(armGeo, M.black); armL.rotation.z = Math.PI; armL.position.z = -78; crank.add(armL);
  for (const [s, ang] of [[1, 0], [-1, Math.PI]]) { const p = new THREE.Mesh(new RoundedBoxGeometry(70, 16, 90, 3, 5), M.black); p.position.set(172.5 * Math.cos(ang + Math.PI / 2), 172.5 * Math.sin(ang + Math.PI / 2), s * 120); p.userData.pedal = true; crank.add(p); }
  crank.add(tube(V(0, 0, -80), V(0, 0, 80), 12, 12, M.darkMetal));
  parts.crank = crank; bike.add(crank);
  const cogs = opt.cogs || [10, 12, 14, 16, 18, 21, 24, 28, 32, 38, 44, 52];
  const cassette = new THREE.Group(); cassette.position.copy(RA);
  cogs.forEach((t, i) => { const r = t * 12.7 / (2 * Math.PI); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(gearShape(t, r, 8), { depth: 2, bevelEnabled: false, curveSegments: 3 }), i % 2 ? M.steel : M.alu); m.position.z = 64 - i * 3.9; cassette.add(m); });
  bike.add(cassette); parts.cassette = cassette;
  const cogR = 24 * 12.7 / (2 * Math.PI), cogZ = 64 - 6 * 3.9 + 1;
  // rear derailleur
  const rd = new THREE.Group(); rd.position.set(ra + 6, ay - 18, 76);
  addAt(rd, new THREE.Mesh(new RoundedBoxGeometry(40, 70, 26, 3, 6), M.black)).position.set(-6, -36, 0);
  const pullU = V(ra + 4, ay - cogR - 34, cogZ), pullL = V(ra + 30, ay - cogR - 100, cogZ);
  for (const p of [pullU, pullL]) { const pu = new THREE.Mesh(new THREE.ExtrudeGeometry(gearShape(12, 12, 3), { depth: 4, bevelEnabled: false }), M.darkMetal); pu.position.copy(p); bike.add(pu); }
  addAt(bike, new THREE.Mesh(new RoundedBoxGeometry(26, 110, 8, 2, 3), M.black)).position.set((pullU.x + pullL.x) / 2, (pullU.y + pullL.y) / 2, cogZ + 8);
  bike.add(rd);
  // chain: instanced links along a closed path
  const chainZ = 57.5;
  const pts = [];
  const arc = (c, r, a0, a1, n) => { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push(V(c.x + r * Math.cos(a), c.y + r * Math.sin(a), chainZ)); } };
  arc(V(0, 0), rR, rad(-75), rad(-275), 40);                         // around the chainring (top half, going back)
  arc(RA, cogR, rad(95), rad(250), 16);                               // around the cog
  arc(pullU, 12, rad(160), rad(300), 6); arc(pullL, 12, rad(120), rad(-70), 8);
  const path = new THREE.CatmullRomCurve3(pts, true, 'centripetal', 0.2);
  const L = path.getLength(), nLinks = Math.round(L / 12.7);
  const chain = new THREE.InstancedMesh(new RoundedBoxGeometry(12.7, 7.5, 6, 2, 1.5), M.steel, nLinks);
  chain.userData = { path, n: nLinks, offset: 0 }; parts.chain = chain; bike.add(chain);
  parts.updateChain = (u) => { const d = new THREE.Object3D(); for (let i = 0; i < nLinks; i++) { const t = ((i / nLinks) + u) % 1, p = path.getPointAt(t), tg = path.getTangentAt(t); d.position.copy(p); d.rotation.set(0, 0, Math.atan2(tg.y, tg.x)); d.updateMatrix(); chain.setMatrixAt(i, d.matrix); } chain.instanceMatrix.needsUpdate = true; };
  parts.updateChain(0);

  // --- cockpit ---
  const C = parts.cockpit, up = V(-sa.x, -sa.y);
  for (let i = 0; i < 2; i++) C.add(tube(htT.clone().addScaledVector(up, 4 + i * 10), htT.clone().addScaledVector(up, 12 + i * 10), 19, 19, M.black));
  const sTop = htT.clone().addScaledVector(up, 24 + 20);
  C.add(tube(htT, sTop.clone().addScaledVector(up, 10), 15, 15, M.black));                       // steerer
  const stemDir = V(Math.cos(rad(-6)), Math.sin(rad(-6))), stemA = sTop.clone().addScaledVector(up, 0), bc = stemA.clone().addScaledVector(stemDir, G.stem);
  const stem = new THREE.Mesh(new RoundedBoxGeometry(G.stem + 30, 38, 42, 4, 10), M.black); stem.position.copy(stemA.clone().addScaledVector(stemDir, G.stem / 2)); stem.rotation.z = rad(-6); C.add(stem);
  C.add(tube(bc.clone().add(V(0, 0, -30)), bc.clone().add(V(0, 0, 30)), 21, 21, M.black));        // bar clamp
  const half = s => [V(bc.x, bc.y, 0), V(bc.x + 2, bc.y + 2, s * 150), V(bc.x + 30, bc.y + 6, s * 205), V(bc.x + 78, bc.y - 8, s * 212), V(bc.x + 96, bc.y - 48, s * 215), V(bc.x + 84, bc.y - 104, s * 220), V(bc.x + 40, bc.y - 128, s * 222), V(bc.x - 32, bc.y - 124, s * 222)];
  const barPts = [...half(-1).reverse(), ...half(1).slice(1)];
  const bar = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(barPts, false, 'centripetal'), 260, 12.5, 18, false), M.tape); bar.castShadow = true; C.add(bar);
  for (const s of [-1, 1]) {
    const hood = new THREE.Mesh(new RoundedBoxGeometry(72, 40, 34, 4, 12), M.rubber); hood.position.set(bc.x + 92, bc.y + 2, s * 213); hood.rotation.z = rad(-18); C.add(hood);
    const lever = tube(V(bc.x + 120, bc.y - 6, s * 213), V(bc.x + 112, bc.y - 112, s * 216), 9, 6, M.black); C.add(lever);
  }
  bike.add(C);

  // --- seatpost + saddle ---
  const sh = opt.saddleHeight || 745, dirST = V(-Math.cos(rad(G.sta)), Math.sin(rad(G.sta)));
  const sp = dirST.clone().multiplyScalar(sh - 40);
  bike.add(tube(stTop.clone().addScaledVector(dirST, -30), sp, 14, 14, M.black));
  const ss = new THREE.Shape();                                       // saddle outline, top view (x forward, y = width)
  ss.moveTo(-135, 0); ss.bezierCurveTo(-140, 70, -60, 74, -20, 46); ss.bezierCurveTo(30, 22, 100, 18, 140, 14); ss.quadraticCurveTo(150, 0, 140, -14); ss.bezierCurveTo(100, -18, 30, -22, -20, -46); ss.bezierCurveTo(-60, -74, -140, -70, -135, 0);
  const sg = new THREE.ExtrudeGeometry(ss, { depth: 14, bevelEnabled: true, bevelSize: 6, bevelThickness: 9, bevelSegments: 5, curveSegments: 24 });
  const saddle = new THREE.Mesh(sg, M.rubber); saddle.rotation.x = -Math.PI / 2; saddle.position.set(sp.x + 15, sp.y + 40, 0); saddle.castShadow = true; bike.add(saddle);
  addAt(bike, new THREE.Mesh(new RoundedBoxGeometry(70, 20, 30, 2, 4), M.darkMetal)).position.set(sp.x, sp.y + 22, 0);

  // --- bottle on the down tube ---
  const dtDir = dtFront.clone().normalize(), bpos = dtDir.clone().multiplyScalar(330).add(V(-dtDir.y * 48, dtDir.x * 48));
  const bot = new THREE.Group(); bot.position.copy(bpos); bot.quaternion.setFromUnitVectors(V(0, 1, 0), dtDir);
  bot.add(new THREE.Mesh(new THREE.CylinderGeometry(36, 36, 190, 40), M.bottle)); addAt(bot, new THREE.Mesh(new THREE.CylinderGeometry(16, 22, 30, 24), M.black)).position.y = 108;
  bike.add(bot);

  bike.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  bike.userData = { parts, RA, FA, htT, htB, R, groundY: ay - R };
  return bike;
}

export function animateBike(bike, t, speed = 1) {   // wheels roll, cranks turn, chain runs
  const { parts, R } = bike.userData;
  const dist = t * 1400 * speed;                    // mm travelled
  for (const w of parts.wheels) w.rotation.z = -dist / R;
  const crankA = -dist / R / 2.2;                    // gear ratio look
  parts.crank.rotation.z = crankA;
  parts.crank.children.forEach(c => { if (c.userData.pedal) c.rotation.z = -crankA; });
  parts.cassette.rotation.z = -dist / R;
  parts.updateChain(((-crankA * 40 / (2 * Math.PI)) / parts.chain.userData.n) % 1 + 1);
}
