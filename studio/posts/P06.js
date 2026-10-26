// ============================================================================
// P06 · reel · "Can you touch the floor? It can change your bike size."  (filar: Body first)
// Sources (computed 25.10.2026, Geomo algorithm supabase/functions/_shared/algorithms.ts @ bikefit 91aad78,
// bikes-backup-2026-10-25T19-12-31-744Z):
//   Rider 178 cm, inseam 84 cm, balanced position, category Gravel race (Canyon Grail Gen 3).
//   targetBar() with all four tests "typical" (3): handlebar 627 / 468 mm, drop 66 mm.
//   Change of handlebar height when ONE test moves from typical to:
//     forward bend   1: +11 mm · 5: −8 mm      plank   1: +9 mm · 5: −7 mm
//     torso twist    1: +8 mm  · 5: −5 mm      neck    1: +6 mm · 5: −4 mm
//   All four at 1: +33 mm (660 mm) · all four at 5: −25 mm (602 mm) → 58 mm apart.
//   Canyon Grail CF / CF SLX / CFR (Gen 3, 2027–), factory stems:
//     all 1 (stiff):  M 93 (best), L 76, S 30 · all 3 (typical): M 96 (best), S 93, L 61 · all 5 (flexible): S 95 (best), M 83.
//   Test wording and answers: app i18n (mobility.*, wizard.mobility.unsure: "Do four quick tests or answer from memory").
// Review 25.10 (2nd round): figures move like people (articulated, not drawn on), neck test shown on a bike,
//   plank/neck: answer from memory, twist rows get top-view angle wedges, sums: ±0 first.
// ============================================================================
(function () {
  var CODE = 'P06';
  var INK = 'var(--s-fg)', ACC = 'var(--s-accent)', MUTED = 'var(--s-muted)', UP = 'var(--s-measure)', DOWN = 'var(--series-1)';

  // ---------- articulated figures (side view, units of a 400×290 box) ----------
  var L = { shin: 62, thigh: 64, torso: 82, neck: 28, ua: 50, fa: 46, foot: 20 };
  function dir(a) { var r = a * Math.PI / 180; return [Math.sin(r), -Math.cos(r)]; }   // 0 = up, clockwise +
  function mv(p, l, a) { var d = dir(a); return [p[0] + l * d[0], p[1] + l * d[1]]; }
  function ik(A, C, l1, l2, pick) {   // two-bone IK, pick(candA, candB) chooses the joint
    var dx = C[0] - A[0], dy = C[1] - A[1], d0 = Math.hypot(dx, dy), d = Math.min(d0, l1 + l2 - 0.01);
    var a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, l1 * l1 - a * a)), ux = dx / d0, uy = dy / d0;
    var m = [A[0] + a * ux, A[1] + a * uy];
    return pick([m[0] - hh * uy, m[1] + hh * ux], [m[0] + hh * uy, m[1] - hh * ux]);
  }
  function chain(root, a) {
    var K = mv(root, L.shin, a.shin), Hp = mv(K, L.thigh, a.thigh), S = mv(Hp, L.torso, a.torso), E = mv(S, L.ua, a.ua);
    return { toe: mv(root, L.foot, a.foot), ank: root, knee: K, hip: Hp, sh: S, head: mv(S, L.neck, a.neck), elb: E, hand: mv(E, L.fa, a.fa) };
  }
  function mix(a, b, u) { var o = {}; for (var k in a) o[k] = a[k] + (b[k] - a[k]) * u; return o; }
  function ease(u) { u = Math.max(0, Math.min(1, u)); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  var BEND0 = { foot: -100, shin: 0, thigh: 0, torso: 0, neck: 0, ua: 180, fa: 180 };
  var BEND1 = { foot: -100, shin: 10, thigh: 10, torso: -113, neck: -150, ua: 185, fa: 185 };   // straight arms just reach the floor
  var PRONE = { foot: 135, shin: -90, thigh: -90, torso: -59, neck: -65, ua: 180, fa: -90 };
  var PLANK = { foot: 135, shin: -78.3, thigh: -78.3, torso: -78.3, neck: -78, ua: 180, fa: -90 };
  // bike for the neck test: scale 0.15 px/mm (wheel r 350 mm, wheelbase ~1030 mm, crank 172 mm)
  var BK = { R: [120, 234], F: [275, 234], BB: [184, 244], ST: [160, 165], HT: [246, 158], HB: [253, 178], hip: [154.6, 138.5], hand: [264, 160], crank: 26 };
  var POSE = {
    bend: function (u) {   // hands stop at the floor: the elbows give a little instead of going through it
      var j = chain([232, 260], mix(BEND0, BEND1, ease(u)));
      return j;
    },
    plank: function (u) { return chain([340, 258], mix(PRONE, PLANK, ease(u))); },
    bike: function (T) {   // T in ms: pedalling at a calm cadence, head lifts from looking down to looking ahead
      var th = (T / 1700) * 2 * Math.PI + 0.6, P = [BK.BB[0] + BK.crank * Math.cos(th), BK.BB[1] + BK.crank * Math.sin(th)];
      var ank = [P[0] - 4, P[1] - 12], toe = [P[0] + 13, P[1] - 1];
      var knee = ik(BK.hip, ank, L.thigh, L.shin, function (a, b) { return a[0] > b[0] ? a : b; });
      var S = mv(BK.hip, L.torso, 55), elb = ik(S, BK.hand, L.ua, L.fa, function (a, b) { return a[1] > b[1] ? a : b; });
      var hu = ease((T - 900) / 1400);
      return { toe: toe, ank: ank, knee: knee, hip: BK.hip, sh: S, elb: elb, hand: BK.hand, head: mv(S, 30, 105 - 55 * hu), pedal: P, hu: hu };
    }
  };
  var fx = function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); };
  function dBody(j) { return 'M' + fx(j.toe) + ' L' + fx(j.ank) + ' L' + fx(j.knee) + ' L' + fx(j.hip) + ' L' + fx(j.sh); }
  function dArm(j) { return 'M' + fx(j.sh) + ' L' + fx(j.elb) + ' L' + fx(j.hand); }
  var ST = { fill: 'none', stroke: INK, strokeWidth: 13, strokeLinecap: 'round', strokeLinejoin: 'round' };
  var THIN = { fill: 'none', stroke: MUTED, strokeWidth: 4, strokeLinecap: 'round' };

  function person(kind, w) {
    var j = kind === 'bike' ? POSE.bike(6000) : POSE[kind](1), els = [];
    if (kind === 'bike') {
      var B = { fill: 'none', stroke: MUTED, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' };
      els.push(h('line', { key: 'fl', className: 'p6-floor', x1: 30, y1: 289, x2: 380, y2: 289, style: THIN }),
        h('circle', { key: 'w1', cx: BK.R[0], cy: BK.R[1], r: 52, style: B }), h('circle', { key: 'w2', cx: BK.F[0], cy: BK.F[1], r: 52, style: B }),
        h('path', { key: 'fr', d: 'M' + fx(BK.R) + ' L' + fx(BK.BB) + ' L' + fx(BK.HB) + ' L' + fx(BK.HT) + ' L' + fx(BK.ST) + ' Z M' + fx(BK.ST) + ' L' + fx(BK.R) + ' M' + fx(BK.BB) + ' L' + fx(BK.ST) + ' L157 150 M' + fx(BK.HB) + ' L' + fx(BK.F), style: B }),
        h('path', { key: 'sd', d: 'M138 146 H168', style: Object.assign({}, B, { stroke: INK, strokeWidth: 8 }) }),
        h('path', { key: 'bar', d: 'M246 158 L258 154 Q268 154 268 165 L262 178', style: Object.assign({}, B, { stroke: INK, strokeWidth: 7 }) }),
        h('path', { key: 'cr', 'data-part': 'crank', d: 'M' + fx(BK.BB) + ' L' + fx(j.pedal), style: Object.assign({}, B, { stroke: INK, strokeWidth: 7 }) }),
        h('path', { key: 'sight', className: 'p6-sight', d: 'M' + fx([j.head[0] + 18, j.head[1] - 2]) + ' L380 ' + (j.head[1] - 10).toFixed(1), style: { fill: 'none', stroke: ACC, strokeWidth: 5, strokeLinecap: 'round', strokeDasharray: '2 12' } }));
    } else {
      els.push(h('line', { key: 'fl', className: 'p6-floor', x1: kind === 'plank' ? 30 : 60, y1: 271, x2: kind === 'plank' ? 380 : 340, y2: 271, style: THIN }));
    }
    els.push(h('path', { key: 'b', 'data-part': 'body', d: dBody(j), style: ST }), h('path', { key: 'a', 'data-part': 'arm', d: dArm(j), style: ST }),
      h('circle', { key: 'h', 'data-part': 'head', cx: j.head[0], cy: j.head[1], r: 19, style: { fill: INK } }));
    return h('svg', { viewBox: '0 0 400 290', width: w, height: w * 290 / 400, className: 'p6-fig', 'data-kind': kind, style: { display: 'block', overflow: 'visible' } }, els);
  }

  // top view of the torso twist: hips stay, shoulders turn (answer 3 = 45–60°)
  function twistTop(w, small) {
    var cx = 200, cy = 160, R = 120;
    var pt = function (d, r) { var a = d * Math.PI / 180; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
    var marks = [30, 45, 60, 75].map(function (d) { var a = pt(90 - d, R), t = pt(90 - d, R + 40);
      return h('g', { key: d, className: 'p6-mark' }, h('line', { x1: cx, y1: cy, x2: a[0], y2: a[1], style: { stroke: MUTED, strokeWidth: 3, strokeDasharray: '4 8' } }),
        small ? null : h('text', { x: t[0], y: t[1] + 10, textAnchor: 'middle', style: { font: '700 24px var(--font-display)', fill: MUTED } }, d + '°')); });
    var sh = pt(30, R), sh2 = pt(210, R), a1 = pt(30, R * 0.55);
    return h('svg', { viewBox: '0 0 400 300', width: w, height: w * 300 / 400, className: 'p6-fig', 'data-kind': 'twist', style: { display: 'block', overflow: 'visible' } },
      h('circle', { cx: cx, cy: cy, r: R, style: THIN }), marks,
      h('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, style: { stroke: MUTED, strokeWidth: 8, strokeLinecap: 'round' } }),
      small ? null : h('text', { x: cx - R - 12, y: cy + 10, textAnchor: 'end', style: { font: '600 26px var(--font-display)', fill: MUTED } }, 'hips'),
      h('path', { className: 'p6-arc', d: 'M' + (cx + R * 0.55) + ' ' + cy + ' A' + (R * 0.55) + ' ' + (R * 0.55) + ' 0 0 0 ' + a1.join(' '), style: { fill: 'none', stroke: ACC, strokeWidth: 5 } }),
      h('line', { className: 'p6-shoulders', x1: sh2[0], y1: sh2[1], x2: sh[0], y2: sh[1], style: ST }), h('circle', { cx: cx, cy: cy, r: 30, style: { fill: INK } }),
      small ? null : h('text', { className: 'p6-shlab', x: sh2[0] - 12, y: sh2[1] + 30, textAnchor: 'end', style: { font: '700 26px var(--font-display)', fill: INK } }, 'shoulders'),
      small ? null : h('text', { x: cx, y: cy + R + 46, textAnchor: 'middle', style: { font: '600 26px var(--font-display)', fill: MUTED } }, 'seen from above'));
  }
  // small top-view wedge for one answer range of the twist test
  function wedge(lo, hi) {
    var c = 50, r = 40, pt = function (d) { var a = (90 - d) * Math.PI / 180; return (c + r * Math.sin(a)).toFixed(1) + ' ' + (c - r * Math.cos(a)).toFixed(1); };
    return h('svg', { viewBox: '0 0 100 100', width: 66, height: 66, style: { display: 'block' } },
      h('circle', { cx: c, cy: c, r: r, style: { fill: 'none', stroke: MUTED, strokeWidth: 3 } }),
      h('path', { d: 'M' + c + ' ' + c + ' L' + pt(lo) + ' A' + r + ' ' + r + ' 0 0 0 ' + pt(hi) + ' Z', style: { fill: ACC, fillOpacity: 0.28, stroke: ACC, strokeWidth: 3, strokeLinejoin: 'round' } }),
      h('line', { x1: c - r, y1: c, x2: c + r, y2: c, style: { stroke: MUTED, strokeWidth: 5, strokeLinecap: 'round' } }));
  }
  function fig(kind, w) { return kind === 'twist' ? twistTop(w, w < 450) : person(kind, w); }

  // ---------- one answer row: answer text + handlebar shift ----------
  function shiftRow(answer, mm, key, icon) {
    var col = mm > 0 ? UP : mm < 0 ? DOWN : MUTED;
    var lab = mm === 0 ? 'typical' : (mm > 0 ? '+' + mm : '−' + Math.abs(mm)) + ' mm';
    var arrow = mm > 0 ? '↑' : mm < 0 ? '↓' : '·';
    return h('div', { key: key, className: 'p6-row', style: { display: 'grid', gridTemplateColumns: icon ? '48px 76px 1fr 250px' : '48px 1fr 250px', alignItems: 'center', gap: 18, borderTop: '3px solid var(--s-line)', paddingTop: 16 } },
      h('span', { style: Object.assign(DISP(800, 40, 80), { color: MUTED }) }, key + 1),
      icon || null,
      h('span', { style: Object.assign(DISP(650, 42, 85), { color: INK, lineHeight: 1.12 }) }, answer),
      h('b', { className: 'p6-mm', style: Object.assign(DISP(800, 56, 75), { color: col, textAlign: 'right' }) }, arrow + ' ' + lab));
  }
  function testBoard(key, n, name, kind, question, rows, note, icons) {
    return h(G.Slide, { key: key, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack', style: { gap: 10 } }, h(G.Kicker, null, 'Test ' + n + ' of 4 · ' + name), h(G.Hook, { size: 96 }, question)),
      h('div', { className: 'gs-art', style: { display: 'flex', justifyContent: 'center', marginTop: 40 } }, fig(kind, kind === 'twist' ? 520 : kind === 'bike' ? 560 : 600)),
      h('div', { style: { display: 'grid', gap: 16, marginTop: 30 } },
        h('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, color: MUTED } }, 'Your answer (1–5, as in Geomo) → your handlebar'),
        rows.map(function (r, i) { return shiftRow(r[0], r[1], i, icons ? icons[i] : null); })),
      note ? h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 34 } }, note) : null,
      h('div', { style: { flex: 1 } }));
  }

  // ---------- slides ----------
  var sizeLine = function (label, best, other, key) {
    return h('div', { key: key, className: 'p6-res', style: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'baseline', borderTop: '3px solid var(--s-line)', paddingTop: 24 } },
      h('span', { style: Object.assign(DISP(700, 46, 85), { color: INK }) }, label),
      h('div', { style: { display: 'grid', gap: 4 } },
        h('b', { style: Object.assign(DISP(800, 76, 75), { color: 'var(--ig-good)' }) }, best),
        h('span', { style: SERIF(36) }, other)));
  };

  SETS[CODE] = [
    // 1 · hook: a person bends forward from standing
    h(G.Slide, { key: 1, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Body first'), h(G.Hook, { size: 128 }, 'Can you touch\n*the floor?*'), h('p', { style: Object.assign(DISP(700, 64, 85), { margin: '18px 0 0', color: INK }) }, 'It can change your bike size.')),
      h('div', { className: 'gs-art', style: { display: 'flex', justifyContent: 'center', marginTop: 80 } }, fig('bend', 760)),
      h('div', { style: { flex: 1 } })),
    // 2 · four questions
    h(G.Slide, { key: 2, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Geomo asks 4 questions'), h(G.Hook, { size: 112 }, '4 questions.\n*About a minute.*'),
        h('p', { style: Object.assign(DISP(650, 46, 85), { margin: '18px 0 0', color: MUTED, lineHeight: 1.2 }) }, 'Answer from memory. No stopwatch needed.')),
      h('div', { className: 'p6-grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 30px', marginTop: 60 } },
        [['bend', 'Forward bend', 'back of the thighs'], ['plank', 'Plank', 'core'], ['twist', 'Torso twist', 'upper back'], ['bike', 'Head up', 'neck']].map(function (t) {
          return h('div', { key: t[0], className: 'p6-cell', style: { display: 'grid', gap: 10, justifyItems: 'center', alignContent: 'end' } }, fig(t[0], t[0] === 'twist' ? 330 : 400),
            h('b', { style: Object.assign(DISP(800, 52, 80), { color: INK }) }, t[1]), h('span', { style: SERIF(34) }, t[2]));
        })),
      h('div', { style: { flex: 1 } })),
    // 3–6 · each test: answer → handlebar height (rider 178 cm, other tests typical)
    testBoard(3, 1, 'back of the thighs', 'bend', 'Bend forward,\nknees straight.', [['Barely to my knees', 11], ['To mid-calf', 6], ['Fingertips to the floor', 0], ['Whole hands on the floor', -4], ['Palms flat, elbows near the floor', -8]],
      'Rider 178 cm, inseam 84 cm, balanced. The other three tests stay typical (3).'),
    testBoard(4, 2, 'core', 'plank', 'How long can you\nhold a plank?', [['Less than 15 seconds', 9], ['Half a minute to a minute', 5], ['1–2 minutes', 0], ['3–4 minutes', -3], ['5 minutes or more', -7]],
      'No need to hold it now: answer from what you know. Not sure? Pick 3. Other tests typical (3).'),
    testBoard(5, 3, 'upper back', 'twist', 'Sit, arms crossed.\nTwist. How far?', [['Under 30°', 8], ['30–45°', 4], ['45–60°', 0], ['60–75°', -3], ['Over 75°', -5]],
      'Hips stay still; only the shoulders turn. Other tests typical (3).', [wedge(0, 30), wedge(30, 45), wedge(45, 60), wedge(60, 75), wedge(75, 90)]),
    testBoard(6, 4, 'neck', 'bike', 'Riding, head up.\nHow long before\nyour neck hurts?', [['A few minutes', 6], ['Up to 30–45 minutes', 3], ['A few hours', 0], ['4–5 hours, no problem', -2], ['No limit, in any position', -4]],
      'Answer from your rides, or lie on your stomach on your elbows, head up. Other tests typical (3).'),
    // 7 · add them up: the starting point first, then both ends
    h(G.Slide, { key: 7, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'All four together'), h(G.Hook, { size: 112 }, 'Same rider.\n*58 mm* apart.')),
      h('div', { className: 'p6-sum', style: { display: 'grid', gap: 40, marginTop: 80 } },
        [['Stiff in all four', '+33 mm', 'bars higher', UP], ['Typical in all four', '±0', 'the starting point', MUTED], ['Flexible in all four', '−25 mm', 'bars lower', DOWN]].map(function (r, i) {
          return h('div', { key: i, className: 'p6-sumrow', style: { display: 'grid', gap: 6, borderTop: '3px solid var(--s-line)', paddingTop: 20 } },
            h('span', { style: Object.assign(DISP(650, 44, 85), { color: INK }) }, r[0]),
            h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 20 } },
              h('b', { className: 'p6-big', style: Object.assign(DISP(800, 110, 75), { color: r[3] }) }, r[1]),
              h('span', { style: SERIF(36) }, r[2])));
        })),
      h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 40 } }, '178 cm, inseam 84 cm, balanced position. Same body size, very different cockpit.'),
      h('div', { style: { flex: 1 } })),
    // 8 · what it does to the size
    h(G.Slide, { key: 8, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Canyon Grail Gen 3'), h(G.Hook, { size: 108 }, 'Same height.\n*Different size.*'), h('p', { style: Object.assign(DISP(650, 38, 85), { margin: '16px 0 0', color: MUTED, lineHeight: 1.25 }) }, 'Rider: 178 cm, inseam 84 cm, balanced position.\nStiff = answer 1 in all four tests, typical = 3, flexible = 5.')),
      h('div', { style: { display: 'grid', gap: 34, marginTop: 80 } },
        sizeLine('Stiff', 'M · 93%', 'L drops to 76%', 1),
        sizeLine('Typical', 'M · 96%', 'S close behind at 93%', 2),
        sizeLine('Flexible', 'S · 95%', 'M drops to 83%', 3)),
      h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 44 } }, 'Fit scores from Geomo (Gravel race, factory stems). The flexible rider gets the bars low enough on the smaller frame.'),
      h('div', { style: { flex: 1 } })),
    // 9 · end card
    h(G.ReelEndCard, { key: 9, line: 'Answer 4 questions in about a minute. Get your size.', cta: 'Free · link in bio' })
  ];

  // ---------- motion: people move (joint angles, not drawn on) ----------
  function poseAnim(svg, sample, t, dur, steps) {
    var parts = { body: M.q(svg, '[data-part=body]'), arm: M.q(svg, '[data-part=arm]'), head: M.q(svg, '[data-part=head]'), crank: M.q(svg, '[data-part=crank]') };
    var hx = +parts.head.getAttribute('cx'), hy = +parts.head.getAttribute('cy'), kb = [], ka = [], kh = [], kc = [];
    for (var i = 0; i <= steps; i++) {
      var j = sample(i / steps);
      kb.push({ d: 'path("' + dBody(j) + '")' }); ka.push({ d: 'path("' + dArm(j) + '")' });
      kh.push({ transform: 'translate(' + (j.head[0] - hx).toFixed(1) + 'px,' + (j.head[1] - hy).toFixed(1) + 'px)' });
      if (j.pedal) kc.push({ d: 'path("M' + fx(BK.BB) + ' L' + fx(j.pedal) + '")' });
    }
    M.add(parts.body, kb, t, dur, 'linear'); M.add(parts.arm, ka, t, dur, 'linear'); M.add(parts.head, kh, t, dur, 'linear');
    if (parts.crank && kc.length) M.add(parts.crank, kc, t, dur, 'linear');
  }
  function figMotion(svg, t) {
    var k = svg.getAttribute('data-kind');
    M.qa(svg, '.p6-floor').forEach(function (x) { M.fade(x, t, 600); });
    if (k === 'bend') { poseAnim(svg, POSE.bend, t + 500, 2200, 60); return t + 2700; }
    if (k === 'plank') { poseAnim(svg, POSE.plank, t + 500, 1800, 50); return t + 2300; }
    if (k === 'bike') { var D = 12000; poseAnim(svg, function (u) { return POSE.bike(u * D); }, t, D, 360); M.fade(M.q(svg, '.p6-sight'), t + 2300, 700); return t + 3000; }
    if (k === 'twist') {   // shoulders start in line with the hips and turn to 60°, the arc follows
      var sh = M.q(svg, '.p6-shoulders'); sh.style.transformBox = 'view-box'; sh.style.transformOrigin = '200px 160px';
      M.add(sh, [{ transform: 'rotate(60deg)' }, { transform: 'rotate(0deg)' }], t + 600, 1800, 'cubic-bezier(.45,0,.2,1)');
      M.drawPath(M.q(svg, '.p6-arc'), t + 600, 1800);
      M.fade(M.q(svg, '.p6-shlab'), t + 2200, 500);
      return t + 2400;
    }
    return t;
  }
  function rowsIn(r, t) { var rows = M.qa(r, '.p6-row'); rows.forEach(function (row, i) { M.fadeUp(row, t + i * 380, 800); M.count(M.q(row, '.p6-mm'), t + i * 380 + 200, 900); }); return t + rows.length * 380 + 600; }
  function testMotion(r) { var e0 = figMotion(M.q(r, '.p6-fig'), 200); M.fade(M.q(r, '.gs-art + div > span'), Math.min(e0, 2200), 600); var e = rowsIn(r, Math.min(e0, 2200) + 300); M.caption(r, e); return e + 3200; }
  CHOREO[CODE] = [
    function (r) { figMotion(M.q(r, '.p6-fig'), 300); return 4200; },
    function (r) { M.fadeUp(M.q(r, '.gs-stack p'), 500, 800); M.qa(r, '.p6-cell').forEach(function (c, i) { M.fadeUp(c, 300 + i * 250, 800); figMotion(M.q(c, 'svg'), 300 + i * 250); }); return 6200; },
    testMotion, testMotion, testMotion, testMotion,
    function (r) { M.qa(r, '.p6-sumrow').forEach(function (row, i) { var t = i === 1 ? 300 : i === 0 ? 1500 : 2200; M.fadeUp(row, t, 900); M.count(M.q(row, '.p6-big'), t + 200, 1300); }); M.caption(r, 3200); return 6600; },
    function (r) { M.qa(r, '.p6-res').forEach(function (row, i) { var t = i === 1 ? 400 : i === 0 ? 1400 : 2000; M.fadeUp(row, t, 900); M.count(M.q(row, 'b'), t + 200, 1200); }); M.caption(r, 2600); return 6400; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3800; }
  ];
})();
