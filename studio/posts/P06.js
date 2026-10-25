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
//   Test wording and answers: app i18n (mobility.*).
// ============================================================================
(function () {
  var CODE = 'P06';
  var INK = 'var(--s-fg)', ACC = 'var(--s-accent)', MUTED = 'var(--s-muted)', UP = 'var(--s-measure)', DOWN = 'var(--series-1)';

  // ---------- line figures of the four tests (drawn, design-system strokes) ----------
  function fig(kind, w) {
    var st = { fill: 'none', stroke: INK, strokeWidth: 13, strokeLinecap: 'round', strokeLinejoin: 'round' };
    var thin = { fill: 'none', stroke: MUTED, strokeWidth: 4, strokeLinecap: 'round' };
    var hint = { fill: 'none', stroke: ACC, strokeWidth: 5, strokeLinecap: 'round', strokeDasharray: '2 12' };
    var P = function (d, s) { return h('path', { d: d, style: s || st }); };
    var head = function (x, y) { return h('circle', { cx: x, cy: y, r: 19, style: { fill: INK, stroke: 'none' } }); };
    var parts = {
      bend: [P('M40 272 H360', thin), P('M232 266 L228 140'), P('M228 140 L188 224'), P('M190 222 L204 264'), head(172, 246)],
      plank: [P('M30 272 H370', thin), P('M345 264 L132 206'), P('M134 208 L134 262 L186 262'), head(100, 196)],
      twist: [P('M110 270 H290', thin), P('M135 200 H265 M150 200 V268 M250 200 V268', thin), P('M200 196 L200 118'), P('M150 132 L250 132'), P('M165 150 L235 150', thin), head(200, 86),
        P('M120 70 A90 40 0 0 1 280 70', hint), P('M268 58 L282 70 L265 80', { fill: 'none', stroke: ACC, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' })],
      neck: [P('M30 272 H390', thin), P('M385 264 L276 258'), P('M276 258 L172 220'), P('M172 220 L176 262 L124 262'), head(152, 190), P('M126 186 L34 172', hint)]
    };
    if (kind === 'twistTop') {
      var cx = 200, cy = 160, R = 120, rad = function (d) { return d * Math.PI / 180; };
      var pt = function (d, r) { return [cx + r * Math.sin(rad(d)), cy - r * Math.cos(rad(d))]; };
      var marks = [30, 45, 60, 75].map(function (d) { var a = pt(90 - d + 0, R), b = pt(90 - d, R + 22), t = pt(90 - d, R + 40);
        return h('g', { key: d }, h('line', { x1: cx, y1: cy, x2: a[0], y2: a[1], style: { stroke: MUTED, strokeWidth: 3, strokeDasharray: '4 8' } }),
          h('text', { x: t[0], y: t[1] + 10, textAnchor: 'middle', style: { font: '700 24px var(--font-display)', fill: MUTED } }, d + '°')); });
      var sh = pt(90 - 60, R), sh2 = pt(270 - 60, R);
      return h('svg', { viewBox: '0 0 400 300', width: w || 400, height: (w || 400) * 300 / 400, className: 'p6-fig', style: { display: 'block', overflow: 'visible' } },
        h('circle', { cx: cx, cy: cy, r: R, style: thin }), marks,
        h('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, style: { stroke: MUTED, strokeWidth: 8, strokeLinecap: 'round' } }),
        h('text', { x: cx - R - 12, y: cy + 10, textAnchor: 'end', style: { font: '600 26px var(--font-display)', fill: MUTED } }, 'hips'),
        h('path', { d: 'M' + (cx + R * 0.55) + ' ' + cy + ' A' + (R * 0.55) + ' ' + (R * 0.55) + ' 0 0 0 ' + pt(90 - 60, R * 0.55).join(' '), style: { fill: 'none', stroke: ACC, strokeWidth: 5 } }),
        h('line', { x1: sh2[0], y1: sh2[1], x2: sh[0], y2: sh[1], style: st }), h('circle', { cx: cx, cy: cy, r: 30, style: { fill: INK } }),
        h('text', { x: sh2[0] - 12, y: sh2[1] + 30, textAnchor: 'end', style: { font: '700 26px var(--font-display)', fill: INK } }, 'shoulders'),
        h('text', { x: cx, y: cy + R + 46, textAnchor: 'middle', style: { font: '600 26px var(--font-display)', fill: MUTED } }, 'seen from above'));
    }
    return h('svg', { viewBox: '0 0 400 290', width: w || 400, height: (w || 400) * 290 / 400, className: 'p6-fig', style: { display: 'block', overflow: 'visible' } }, parts[kind]);
  }

  // ---------- one answer row: answer text + handlebar shift ----------
  function shiftRow(answer, mm, key) {
    var col = mm > 0 ? UP : mm < 0 ? DOWN : MUTED;
    var lab = mm === 0 ? 'typical' : (mm > 0 ? '+' + mm : '−' + Math.abs(mm)) + ' mm';
    var arrow = mm > 0 ? '↑' : mm < 0 ? '↓' : '·';
    return h('div', { key: key, className: 'p6-row', style: { display: 'grid', gridTemplateColumns: '48px 1fr 250px', alignItems: 'center', gap: 18, borderTop: '3px solid var(--s-line)', paddingTop: 16 } },
      h('span', { style: Object.assign(DISP(800, 40, 80), { color: MUTED }) }, key + 1),
      h('span', { style: Object.assign(DISP(650, 42, 85), { color: INK, lineHeight: 1.12 }) }, answer),
      h('b', { className: 'p6-mm', style: Object.assign(DISP(800, 56, 75), { color: col, textAlign: 'right' }) }, arrow + ' ' + lab));
  }
  function testBoard(key, n, name, kind, question, rows, note) {
    return h(G.Slide, { key: key, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack', style: { gap: 10 } }, h(G.Kicker, null, 'Test ' + n + ' of 4 · ' + name), h(G.Hook, { size: 96 }, question)),
      h('div', { className: 'gs-art', style: { display: 'flex', justifyContent: 'center', marginTop: 40 } }, fig(kind, kind === 'twistTop' ? 520 : 600)),
      h('div', { style: { display: 'grid', gap: 16, marginTop: 30 } },
        h('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, color: MUTED } }, 'Your answer (1–5, as in Geomo) → your handlebar'),
        rows.map(function (r, i) { return shiftRow(r[0], r[1], i); })),
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
    // 1 · hook
    h(G.Slide, { key: 1, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Body first'), h(G.Hook, { size: 128 }, 'Can you touch\n*the floor?*'), h('p', { style: Object.assign(DISP(700, 64, 85), { margin: '18px 0 0', color: INK }) }, 'It can change your bike size.')),
      h('div', { className: 'gs-art', style: { display: 'flex', justifyContent: 'center', marginTop: 80 } }, fig('bend', 760)),
      h('div', { style: { flex: 1 } })),
    // 2 · four tests
    h(G.Slide, { key: 2, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Geomo asks 4 questions'), h(G.Hook, { size: 112 }, '4 tests.\n*About a minute.*')),
      h('div', { className: 'p6-grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 30px', marginTop: 70 } },
        [['bend', 'Forward bend', 'back of the thighs'], ['plank', 'Plank', 'core'], ['twist', 'Torso twist', 'upper back'], ['neck', 'Head up', 'neck']].map(function (t) {
          return h('div', { key: t[0], className: 'p6-cell', style: { display: 'grid', gap: 10, justifyItems: 'center' } }, fig(t[0], 400),
            h('b', { style: Object.assign(DISP(800, 52, 80), { color: INK }) }, t[1]), h('span', { style: SERIF(34) }, t[2]));
        })),
      h('div', { style: { flex: 1 } })),
    // 3–6 · each test: answer → handlebar height (rider 178 cm, other tests typical)
    testBoard(3, 1, 'back of the thighs', 'bend', 'Bend forward,\nknees straight.', [['Barely to my knees', 11], ['To mid-calf', 6], ['Fingertips to the floor', 0], ['Whole hands on the floor', -4], ['Palms flat, elbows near the floor', -8]],
      'Rider 178 cm, inseam 84 cm, balanced. The other three tests stay typical (3).'),
    testBoard(4, 2, 'core', 'plank', 'How long can you\nhold a plank?', [['Less than 15 seconds', 9], ['Half a minute to a minute', 5], ['1–2 minutes', 0], ['3–4 minutes', -3], ['5 minutes or more', -7]],
      'Rider 178 cm, inseam 84 cm, balanced. The other three tests stay typical (3).'),
    testBoard(5, 3, 'upper back', 'twistTop', 'Sit, arms crossed.\nTwist. How far?', [['Under 30°', 8], ['30–45°', 4], ['45–60°', 0], ['60–75°', -3], ['Over 75°', -5]],
      'Hips stay still; only the shoulders turn. Other tests typical (3).'),
    testBoard(6, 4, 'neck', 'neck', 'Head up, looking ahead.\nHow long before\nyour neck hurts?', [['A few minutes', 6], ['Up to 30–45 minutes', 3], ['A few hours', 0], ['4–5 hours, no problem', -2], ['No limit, in any position', -4]],
      'On the bike, or lying on your stomach on your elbows. Other tests typical (3).'),
    // 7 · add them up
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
    h(G.ReelEndCard, { key: 9, line: 'Do the 4 tests in about a minute. Get your size.', cta: 'Free · link in bio' })
  ];

    // ---------- motion ----------
  function figIn(r, t) { M.qa(r, '.p6-fig').forEach(function (svg, i) { M.icon(svg, t + i * 250, 1300); M.qa(svg, 'text').forEach(function (x) { M.fade(x, t + i * 250 + 900, 500); }); }); }
  function rowsIn(r, t) { var rows = M.qa(r, '.p6-row'); rows.forEach(function (row, i) { M.fadeUp(row, t + i * 380, 800); M.count(M.q(row, '.p6-mm'), t + i * 380 + 200, 900); }); return t + rows.length * 380 + 600; }
  function testMotion(r) { figIn(r, 300); M.fade(M.q(r, '.gs-art + div > span'), 1500, 600); var e = rowsIn(r, 1800); M.caption(r, e); return e + 3200; }
  CHOREO[CODE] = [
    function (r) { figIn(r, 400); return 3800; },
    function (r) { M.qa(r, '.p6-cell').forEach(function (c, i) { M.fadeUp(c, 200 + i * 300, 800); M.icon(M.q(c, 'svg'), 300 + i * 300, 1200); }); return 5200; },
    testMotion, testMotion, testMotion, testMotion,
    function (r) { M.qa(r, '.p6-sumrow').forEach(function (row, i) { M.fadeUp(row, 300 + i * 700, 900); M.count(M.q(row, '.p6-big'), 500 + i * 700, 1300); }); M.caption(r, 2900); return 6400; },
    function (r) { M.qa(r, '.p6-res').forEach(function (row, i) { M.fadeUp(row, 400 + i * 600, 900); M.count(M.q(row, 'b'), 600 + i * 600, 1200); }); M.caption(r, 2600); return 6400; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3800; }
  ];
})();
