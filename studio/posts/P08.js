// ============================================================================
// P08 · reel · "Same frame. Different stem."  (filar: Which size?)
// Sources (computed 26.10.2026, Geomo algorithm supabase/functions/_shared/algorithms.ts @ bikefit 91aad78,
// bikes-backup-2026-10-25T19-12-31-744Z), rider 178 cm, inseam 84 cm, typical flexibility (3/3/3/3), balanced,
// Canyon Grail CF / CF SLX / CFR (Gen 3, 2027–), category Gravel race. Handlebar target 627 / 468 mm.
//   Frame (stack/reach, head tube, HTA 71.5°): S 558/394 ht 120 · M 575/411 ht 138 · L 598/427 ht 162. Factory stems S/M/L 80 mm.
//   calcFitForBike(manualStem) — bar (stack/reach), spacers, fit:
//     M: 60 → 627/456 sp 21, 87% · 70 → 627/467 sp 19, 98% · 80 (stock) → 627/477 sp 17, 96% · 90 → 627/488 sp 14, 81% · 100 → 627/498 sp 12, 63%
//     S: 90 → 627/465 sp 32, 98%        L: 50 → 637/466 sp 10, 78% (bars 10 mm above target even with no extra spacers)
//   Cockpit geometry = algorithm: spacers + 20 mm cap along the steerer, stem at (90 − HTA) − 6°.
// ============================================================================
(function () {
  var CODE = 'P08';
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)', MEAS = 'var(--s-measure)', COL = 'var(--series-1)', COL2 = 'var(--series-2)';
  var T = { s: 627, r: 468 };
  var F = { S: { stack: 558, reach: 394, ht: 120 }, M: { stack: 575, reach: 411, ht: 138 }, L: { stack: 598, reach: 427, ht: 162 } };
  var M_STOPS = [{ L: 60, sp: 21, fit: 87 }, { L: 70, sp: 19, fit: 98 }, { L: 80, sp: 17, fit: 96 }, { L: 90, sp: 14, fit: 81 }, { L: 100, sp: 12, fit: 63 }];
  var HTA = 71.5, rad = function (d) { return d * Math.PI / 180; };
  var AX = [-Math.cos(rad(HTA)), Math.sin(rad(HTA))];            // steerer axis, up and back (mm, y up)
  function geo(f, L, sp, ang) {
    var SA = rad((90 - HTA) + (ang == null ? -6 : ang)), SD = [Math.cos(SA), Math.sin(SA)];  // stem direction (−6° typical, −17° steep)
    var H = [f.reach, f.stack], Hb = [H[0] - AX[0] * f.ht, H[1] - AX[1] * f.ht];
    var top = [H[0] + AX[0] * sp, H[1] + AX[1] * sp], cl = [H[0] + AX[0] * (sp + 20), H[1] + AX[1] * (sp + 20)];
    return { H: H, Hb: Hb, top: top, cl: cl, bar: [cl[0] + L * SD[0], cl[1] + L * SD[1]] };
  }
  // drawing window in mm and mapping to px
  function view(w, x0, x1, y0, y1) { var k = w / (x1 - x0); return { k: k, w: w, h: Math.round((y1 - y0) * k), X: function (x) { return (x - x0) * k; }, Y: function (y) { return (y1 - y) * k; } }; }
  var f1 = function (v) { return v.toFixed(1); };
  var P = function (V, p) { return f1(V.X(p[0])) + ' ' + f1(V.Y(p[1])); };
  function stemD(V, g) { return 'M' + P(V, g.cl) + ' L' + P(V, g.bar); }
  function spD(V, g) { return 'M' + P(V, g.H) + ' L' + P(V, g.cl); }
  var WIN = [335, 525, 545, 680];

  // one cockpit: frame front, spacers + stem (animatable), bar end, his target
  function cockpit(f, L, sp, o) {
    o = o || {}; var V = view(o.width || 936, WIN[0], WIN[1], WIN[2], WIN[3]), g = geo(f, L, sp, o.ang), col = o.color || COL;
    var line = function (key, a, b, w, c, cls) { return h('line', { key: key, className: cls, x1: V.X(a[0]), y1: V.Y(a[1]), x2: V.X(b[0]), y2: V.Y(b[1]), style: { stroke: c, strokeWidth: w, strokeLinecap: 'round' } }); };
    var tt = [g.H[0] - 240, g.H[1] - 26], dt = [g.Hb[0] - 170, g.Hb[1] - 130], fs = Math.max(0.6, V.w / 936);
    var txt = function (key, x, y, s, st, cls) { return h('text', { key: key, className: cls, x: x, y: y, style: Object.assign({ font: '700 ' + Math.round(30 * fs) + 'px var(--font-display)', fill: INK }, st || {}) }, s); };
    return h('svg', { viewBox: '0 0 ' + V.w + ' ' + V.h, width: V.w, height: V.h, className: 'p8-ck', 'data-f': o.key || 'M', style: { display: 'block', overflow: 'hidden' } },
      h('g', { className: 'p8-frame' }, line('ht', g.Hb, g.H, 16, col), line('tt', g.H, tt, 13, col), line('dt', g.Hb, dt, 13, col)),
      h('g', { className: 'p8-target' },
        h('circle', { cx: V.X(T.r), cy: V.Y(T.s), r: 26 * fs, style: { fill: 'none', stroke: MEAS, strokeWidth: 4, strokeDasharray: '8 7' } }),
        o.noTargetLabel ? null : txt('tl', V.X(T.r) + 34 * fs, V.Y(T.s) - 30 * fs, 'his target', { fill: MEAS, fontSize: Math.round(28 * fs) + 'px' })),
      h('path', { className: 'p8-sp', d: spD(V, g), style: { fill: 'none', stroke: MUTED, strokeWidth: 30 * fs, strokeLinecap: 'butt' } }),
      h('path', { className: 'p8-stem', d: stemD(V, g), style: { fill: 'none', stroke: INK, strokeWidth: 20 * fs, strokeLinecap: 'round' } }),
      h('circle', { className: 'p8-bar', cx: V.X(g.bar[0]), cy: V.Y(g.bar[1]), r: 24 * fs, style: { fill: INK } }),
      o.noKey ? null : h('g', { className: 'p8-key' }, txt('k1', V.X((g.H[0] + g.cl[0]) / 2) - 34 * fs, V.Y((g.H[1] + g.cl[1]) / 2) + 10 * fs, 'spacers', { fill: MUTED, textAnchor: 'end', fontSize: Math.round(26 * fs) + 'px' }),
        txt('k2', V.X((g.cl[0] + g.bar[0]) / 2), V.Y((g.cl[1] + g.bar[1]) / 2) - 30 * fs, 'stem', { fill: INK, textAnchor: 'middle', fontSize: Math.round(26 * fs) + 'px' })),
      o.label ? txt('lb', 14, 46, o.label, { fontSize: '38px', fill: col }) : null);
  }

  // animate a cockpit through stem stops (hold, move, hold ...); readouts = elements shown per stop
  function stemAnim(svg, f, stops, t0, hold, move, readouts) {
    var V = view(+svg.getAttribute('width'), WIN[0], WIN[1], WIN[2], WIN[3]), stem = M.q(svg, '.p8-stem'), bar = M.q(svg, '.p8-bar'), spp = M.q(svg, '.p8-sp');
    var last = stops[stops.length - 1], gl = geo(f, last.L, last.sp, last.ang), bx = V.X(gl.bar[0]), by = V.Y(gl.bar[1]);
    var ks = [], kb = [], kp = [], seg = hold + move, total = seg * (stops.length - 1) + hold, N = 120;
    for (var i = 0; i <= N; i++) {
      var t = i / N * total, j = Math.min(stops.length - 1, Math.floor(t / seg)), u = (t - j * seg - hold) / move;
      u = Math.max(0, Math.min(1, u)); u = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      var a = stops[j], b = stops[Math.min(stops.length - 1, j + 1)], L = a.L + (b.L - a.L) * u, sp = a.sp + (b.sp - a.sp) * u, an = (a.ang == null ? -6 : a.ang) + ((b.ang == null ? -6 : b.ang) - (a.ang == null ? -6 : a.ang)) * u, g = geo(f, L, sp, an);
      ks.push({ d: 'path("' + stemD(V, g) + '")', offset: i / N }); kp.push({ d: 'path("' + spD(V, g) + '")', offset: i / N }); kb.push({ transform: 'translate(' + f1(V.X(g.bar[0]) - bx) + 'px,' + f1(V.Y(g.bar[1]) - by) + 'px)', offset: i / N });
    }
    M.add(stem, ks, t0, total, 'linear'); M.add(bar, kb, t0, total, 'linear'); M.add(spp, kp, t0, total, 'linear');
    var key = M.q(svg, '.p8-key'); if (key) M.add(key, [{ opacity: 0 }, { opacity: 0 }], 0, 1, 'linear');
    (readouts || []).forEach(function (el, j) {   // stop j visible while the stem rests there
      var on = t0 + j * seg, off = t0 + j * seg + hold + 50, end = total + t0 + 10;   // one animation per element (fills don't fight)
      if (j === stops.length - 1) { M.add(el, [{ opacity: 0 }, { opacity: 1 }], on, 250, 'ease'); return; }
      var d = off + 250 - on;
      M.add(el, [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 250 / d }, { opacity: 1, offset: (off - on) / d }, { opacity: 0, offset: 1 }], on, d, 'linear');
    });
    return t0 + total;
  }

  // S and M on top of each other: frames first, then each with its own stem
  function overlay(w) {
    var V = view(w, WIN[0] - 60, WIN[1], 522, WIN[3]), fs = 1;
    var one = function (f, L, sp, col, name, cls) {
      var g = geo(f, L, sp), ln = function (a, b, wd) { return h('line', { x1: V.X(a[0]), y1: V.Y(a[1]), x2: V.X(b[0]), y2: V.Y(b[1]), style: { stroke: col, strokeWidth: wd, strokeLinecap: 'round' } }); };
      return h('g', { className: cls },
        h('g', { className: 'p8-fr' }, ln(g.Hb, g.H, 16), ln(g.H, [g.H[0] - 240, g.H[1] - 26], 12), ln(g.Hb, [g.Hb[0] - 170, g.Hb[1] - 130], 12),
          h('circle', { cx: V.X(g.H[0]), cy: V.Y(g.H[1]), r: 10, style: { fill: col } }),
          h('text', { x: V.X(g.H[0] - 20), y: V.Y(g.H[1] - 3) + (name === 'S' ? 84 : -22), textAnchor: 'end', style: { font: '800 34px var(--font-display)', fill: col } }, name + ' frame ' + f.stack + ' / ' + f.reach)),
        h('g', { className: 'p8-cp' },
          h('path', { d: spD(V, g), style: { fill: 'none', stroke: col, strokeOpacity: 0.45, strokeWidth: 26, strokeLinecap: 'butt' } }),
          h('path', { d: stemD(V, g), style: { fill: 'none', stroke: col, strokeWidth: 16, strokeLinecap: 'round' } }),
          h('circle', { cx: V.X(g.bar[0]), cy: V.Y(g.bar[1]), r: 20, style: { fill: col } }),
          h('text', { x: V.X(g.cl[0]) + (name === 'S' ? -20 : 24), y: V.Y(g.cl[1]) + (name === 'S' ? -26 : 60), textAnchor: name === 'S' ? 'end' : 'start', style: { font: '800 32px var(--font-display)', fill: col } }, L + ' mm stem')));
    };
    return h('svg', { viewBox: '0 0 ' + V.w + ' ' + V.h, width: V.w, height: V.h, className: 'p8-ov', style: { display: 'block', overflow: 'hidden' } },
      h('g', { className: 'p8-target' }, h('circle', { cx: V.X(T.r), cy: V.Y(T.s), r: 30, style: { fill: 'none', stroke: MEAS, strokeWidth: 4, strokeDasharray: '8 7' } })),
      one(F.S, 90, 32, COL2, 'S', 'p8-s'), one(F.M, 70, 19, COL, 'M', 'p8-m'));
  }
  function readout(st, key, last) {
    var col = st.fit >= 85 ? 'var(--ig-good)' : st.fit >= 75 ? 'var(--ig-mid, #C98A00)' : 'var(--ig-bad, #C0392B)';
    return h('div', { key: key, className: 'p8-ro', style: { position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'baseline', gap: 28, opacity: last ? 1 : 0 } },
      h('b', { style: Object.assign(DISP(800, st.lab ? 84 : 120, 75), { color: INK }) }, st.lab || (st.L + ' mm')),
      h('span', { style: Object.assign(DISP(800, 90, 75), { color: col }) }, st.fit + '%'));
  }
  var note = function (s) { return h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 30 } }, s); };

  SETS[CODE] = [
    // 1 · hook: the stem grows and shrinks on one frame
    h(G.Slide, { key: 1, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Which size? · the stem'), h(G.Hook, { size: 124 }, 'Same frame.\n*Different stem.*'),
        h('p', { style: Object.assign(DISP(700, 56, 85), { margin: '18px 0 0', color: INK }) }, '10 mm of stem = 10 mm of reach.')),
      h('div', { className: 'gs-art', style: { marginTop: 60 } }, cockpit(F.M, 80, 17)),
      h('div', { style: { flex: 1 } })),
    // 2 · as sold
    h(G.Slide, { key: 2, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Canyon Grail Gen 3 · size M'), h(G.Hook, { size: 104 }, 'As sold:\n*80 mm stem.*')),
      h('div', { className: 'gs-art', style: { marginTop: 50 } }, cockpit(F.M, 80, 17)),
      h('div', { className: 'p8-facts', style: { display: 'grid', gap: 10, marginTop: 30 } },
        h('b', { style: Object.assign(DISP(800, 64, 80), { color: 'var(--ig-good)' }) }, '96% fit'),
        h('span', { style: Object.assign(DISP(650, 44, 85), { color: INK }) }, 'Bars 9 mm past his target.')),
      note('Rider 178 cm, inseam 84 cm, typical flexibility, balanced position. Fit from Geomo.'),
      h('div', { style: { flex: 1 } })),
    // 3 · five stems on the same frame
    h(G.Slide, { key: 3, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Same frame, five stems'), h(G.Hook, { size: 104 }, 'Only the stem\n*changes.*')),
      h('div', { className: 'gs-art', style: { marginTop: 40 } }, cockpit(F.M, 100, 12)),
      h('div', { className: 'p8-ros', style: { position: 'relative', height: 140, minHeight: 140, flexShrink: 0, marginTop: 30 } }, M_STOPS.map(function (s, i) { return readout(s, i, i === M_STOPS.length - 1); })),
      note('Rider: 178 cm, inseam 84 cm, typical flexibility, balanced position. 70 mm: bars right on target (98%). 100 mm: 63%, too long.'),
      h('div', { style: { flex: 1 } })),
    // 4 · between sizes: frames on top of each other, then each one's stem
    h(G.Slide, { key: 4, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Between S and M?'), h(G.Hook, { size: 104 }, 'Different frames.\n*Same hands.*')),
      h('div', { className: 'gs-art', style: { marginTop: 40 } }, overlay(936)),
      h('div', { className: 'p8-facts', style: { display: 'grid', gap: 10, marginTop: 24 } },
        h('span', { style: Object.assign(DISP(650, 44, 85), { color: INK }) }, 'M is 17 mm taller and 17 mm longer.'),
        h('b', { style: Object.assign(DISP(800, 60, 80), { color: 'var(--ig-good)' }) }, 'S + 90 mm: 98% · M + 70 mm: 98%')),
      note('Rider: 178 cm, inseam 84 cm, typical flexibility, balanced position. S is a bit shorter between the wheels, M a bit calmer.'),
      h('div', { style: { flex: 1 } })),
    // 5 · too tall: shorter stem, then a steep (−17°) stem
    h(G.Slide, { key: 5, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Size L · too tall for him'), h(G.Hook, { size: 104 }, 'A steep stem helps.\n*A bit.*')),
      h('div', { className: 'gs-art', style: { marginTop: 40 } }, cockpit(F.L, 60, 10, { ang: -17 })),
      h('div', { className: 'p8-ros', style: { position: 'relative', height: 110, minHeight: 110, flexShrink: 0, marginTop: 24 } },
        [{ lab: '80 mm', fit: 61 }, { lab: '50 mm', fit: 78 }, { lab: '60 mm, −17°', fit: 83 }].map(function (x, i) { return readout(x, i, i === 2); })),
      note('Rider: 178 cm, inseam 84 cm, typical flexibility, balanced position. The steep stem brings the bars down, but the L stays long (wheelbase 1085 vs 1062 mm). M as sold: 96%.'),
      h('div', { style: { flex: 1 } })),
    // 6 · integrated cockpits
    h(G.Slide, { key: 6, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Integrated cockpit?'), h(G.Hook, { size: 104 }, 'Sometimes the stem\n*isn’t a quick swap.*')),
      h('div', { className: 'gs-art p8-int', style: { marginTop: 60 } }, h('svg', { viewBox: '0 0 936 300', width: 936, height: 300, style: { display: 'block' } },
        h('g', { className: 'p8-i1' }, h('line', { x1: 60, y1: 200, x2: 250, y2: 150, style: { stroke: INK, strokeWidth: 20, strokeLinecap: 'round' } }), h('circle', { cx: 270, cy: 145, r: 26, style: { fill: 'none', stroke: INK, strokeWidth: 12 } }),
          h('text', { x: 160, y: 270, textAnchor: 'middle', style: { font: '700 32px var(--font-display)', fill: MUTED } }, 'stem + bar')),
        h('g', { className: 'p8-i2' }, h('path', { d: 'M520 200 L700 152 Q760 136 790 170 Q812 196 800 240', style: { fill: 'none', stroke: INK, strokeWidth: 20, strokeLinecap: 'round', strokeLinejoin: 'round' } }),
          h('text', { x: 680, y: 270, textAnchor: 'middle', style: { font: '700 32px var(--font-display)', fill: MUTED } }, 'one-piece cockpit')))),
      h('p', { className: 'p8-last', style: Object.assign(DISP(650, 46, 85), { margin: '40px 0 0', color: INK, lineHeight: 1.25 }) }, 'Many bikes ship with a one-piece bar and stem. Another length means a new cockpit, and that costs real money.'),
      note('Geomo scores every size with the stem it’s sold with. So the first number you see is the bike as it comes.'),
      h('div', { style: { flex: 1 } })),
    // 7 · takeaway
    h(G.Slide, { key: 7, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Before you buy'), h(G.Hook, { size: 112 }, 'A stem is cheap\nto swap.\n*A frame isn’t.*'),
        h('p', { className: 'p8-last', style: Object.assign(DISP(650, 48, 85), { margin: '30px 0 0', color: 'var(--s-fg)', lineHeight: 1.25 }) }, 'Pick the size that fits as sold.\nFine-tune with the stem only if you need to.')),
      h('div', { style: { flex: 1 } })),
    // 7 · end card
    h(G.ReelEndCard, { key: 8, line: 'See which stem your size needs. About a minute.', cta: 'Free · link in bio' })
  ];

  CHOREO[CODE] = [
    function (r) { var svg = M.q(r, '.p8-ck'); return Math.max(4200, stemAnim(svg, F.M, [{ L: 80, sp: 17 }, { L: 60, sp: 21 }, { L: 100, sp: 12 }, { L: 80, sp: 17 }], 500, 350, 900) + 400); },
    function (r) { M.qa(r, '.p8-ck .p8-frame line').forEach(function (l) { M.drawPath(l, 200, 1000); }); M.fade(M.q(r, '.p8-target'), 900, 600); M.fade(M.q(r, '.p8-sp'), 1100, 500); M.fade(M.q(r, '.p8-key'), 1800, 600);
      M.add(M.q(r, '.p8-stem'), [{ opacity: 0 }, { opacity: 1 }], 1200, 500, 'ease'); M.add(M.q(r, '.p8-bar'), [{ opacity: 0 }, { opacity: 1 }], 1400, 500, 'ease');
      M.qa(r, '.p8-facts > *').forEach(function (x, i) { M.fadeUp(x, 1900 + i * 300, 800); }); M.caption(r, 2700); return 5600; },
    function (r) { var e = stemAnim(M.q(r, '.p8-ck'), F.M, M_STOPS, 400, 1100, 700, M.qa(r, '.p8-ro')); M.caption(r, e - 600); return e + 2600; },
    function (r) { [['.p8-s', 300], ['.p8-m', 900]].forEach(function (x) { var g = M.q(r, x[0]); M.qa(g, '.p8-fr line').forEach(function (l) { M.drawPath(l, x[1], 1000); }); M.qa(g, '.p8-fr circle, .p8-fr text').forEach(function (c) { M.fade(c, x[1] + 800, 500); }); });
      M.fadeUp(M.q(r, '.p8-facts > span'), 2000, 800); M.fade(M.q(r, '.p8-target'), 2800, 600);
      [['.p8-s', 3300], ['.p8-m', 3900]].forEach(function (x) { M.qa(M.q(r, x[0] + ' .p8-cp'), 'path, circle, text').forEach(function (c) { M.fade(c, x[1], 600); }); });
      M.fadeUp(M.q(r, '.p8-facts > b'), 4700, 800); M.caption(r, 5300); return 8200; },
    function (r) { var e = stemAnim(M.q(r, '.p8-ck'), F.L, [{ L: 80, sp: 10 }, { L: 50, sp: 10 }, { L: 60, sp: 10, ang: -17 }], 400, 1300, 900, M.qa(r, '.p8-ro')); M.caption(r, e - 300); return e + 3200; },
    function (r) { M.fade(M.q(r, '.p8-i1'), 400, 700); M.fade(M.q(r, '.p8-i2'), 1000, 700); M.fadeUp(M.q(r, '.p8-last'), 1700, 900); M.caption(r, 2600); return 6400; },
    function (r) { M.fadeUp(M.q(r, '.p8-last'), 1300, 900); return 4600; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3800; }
  ];
})();
