// ============================================================================
// P14 v2 · reel · Black Friday 1/3: "Parts you can swap. The frame stays."
// Review 28.10 (Maciej, s2): realistic part icons (drivetrain: crank, chain, cassette, rear derailleur) that keep moving.
// Review 26.10 (Maciej, s4): mention that a drop (negative) stem lowers the bars too.
// Sources:
//   Size step: median between neighbouring gravel sizes = +20 mm stack, +9 mm reach (362 size pairs, bikes-backup-2026-10-25).
//   Spacers: app shows 10–35 mm in the normal range (algorithm e.spLo/e.spHi; 45 mm in comfort position).
//   Steep stem: Geomo algorithm @ bikefit 91aad78, Canyon Grail Gen 3 L, 60 mm stem, spacers 10 mm:
//     −6° → bars 639 mm high, −17° → 628 mm (11 mm lower). Rider/profile irrelevant for this geometry.
//   No part or frame prices (we say "cheap" vs "the most expensive part", no amounts).
// ============================================================================
(function () {
  var CODE = 'P14';
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)';
  // Icons (100×100 user units, drawn at 130 px). Review 28.10 (Maciej): look like real parts, keep moving after they appear.
  //   Classes: f = fades in (dashed teeth, chain), anything else draws on. Groups carry data-* loops:
  //   data-spin="ms" (continuous rotation), data-move="dx,dy,ms" (out and back), data-rock="deg,ms", data-chain="ms" (chain runs).
  var P = function (d, o) { return h('path', Object.assign({ d: d }, o || {})); };
  var C = function (cx, cy, r, o) { return h('circle', Object.assign({ cx: cx, cy: cy, r: r }, o || {})); };
  var Gp = function (o, kids) { return h('g', Object.assign({}, o, { style: Object.assign({ transformBox: 'view-box' }, o.style || {}) }), kids); };
  var ORG = function (x, y) { return { transformOrigin: x + 'px ' + y + 'px' }; };
  var radial = function (cx, cy, r1, r2, n, off) { var d = ''; for (var i = 0; i < n; i++) { var a = (i + (off || 0)) / n * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a);
    d += 'M' + (cx + r1 * c).toFixed(1) + ' ' + (cy + r1 * s).toFixed(1) + 'L' + (cx + r2 * c).toFixed(1) + ' ' + (cy + r2 * s).toFixed(1); } return d; };
  var spokes = function (cx, cy, rh, rr, n) { var d = ''; for (var i = 0; i < n; i++) { var a = i / n * 2 * Math.PI, b = a + (i % 2 ? 0.55 : -0.55);   // tangential lacing
    d += 'M' + (cx + rh * Math.cos(a)).toFixed(1) + ' ' + (cy + rh * Math.sin(a)).toFixed(1) + 'L' + (cx + rr * Math.cos(b)).toFixed(1) + ' ' + (cy + rr * Math.sin(b)).toFixed(1); } return d; };
  var ICONS = {
    tyre: function () { return Gp({ 'data-spin': 3200, style: ORG(50, 50) }, [
      C(50, 50, 41, { key: 1, style: { strokeWidth: 5 } }), C(50, 50, 31, { key: 2 }), C(50, 50, 26, { key: 3, style: { strokeWidth: 2.5 } }),
      P(radial(50, 50, 42, 47, 24), { key: 4, className: 'f', style: { strokeWidth: 6, strokeLinecap: 'butt' } }),     // tread knobs
      P(radial(50, 50, 45, 49, 24, 0.5), { key: 5, className: 'f', style: { strokeWidth: 3, strokeLinecap: 'butt' } }),     // staggered shoulder knobs
      C(50, 50, 5, { key: 6 })]); },
    saddle: function () { return h('g', null,
      P('M41 99 L49 67', { key: 1, style: { strokeWidth: 12 } }), P('M42 66 L57 66', { key: 9, style: { strokeWidth: 4 } }),   // seat tube + collar
      Gp({ key: 2, 'data-move': '2.2,-10,2600' }, [
        P('M49 70 L57 38', { key: 1, style: { strokeWidth: 6 } }),                                                         // seatpost
        P('M50 37 L64 37 L62 42 L52 42 Z', { key: 2, style: { strokeWidth: 3 } }),                                         // clamp
        Gp({ key: 3, 'data-move': '6,0,3400' }, [
          P('M8 27 C 18 23, 32 23, 44 24 C 60 25, 74 21, 91 14 C 96 19, 93 27, 84 30 C 66 34, 40 32, 10 31 Z', { key: 1, style: { strokeWidth: 3.5 } }),   // saddle shell, nose left
          P('M24 31 C 34 39, 64 39, 80 30', { key: 2, style: { strokeWidth: 3 } })])])); },                               // rails
    cockpit: function () { return h('g', null,
      P('M26 99 L38 60', { key: 1, style: { strokeWidth: 10 } }),                                                          // head tube
      P('M33 58 L47 58 M34 53 L48 53', { key: 2, style: { strokeWidth: 3 } }),                                          // spacers
      Gp({ key: 3, 'data-move': '-1.5,-7,2800' }, [
        P('M36 50 L42 40 L76 33 L77 43 Z', { key: 1, style: { strokeWidth: 3.5 } }),                                      // stem
        C(78, 38, 6.5, { key: 2, style: { strokeWidth: 3.5 } }),                                                          // bar clamp
        P('M78 38 C 92 38, 97 48, 96 60 C 95 74, 84 80, 72 78 L 63 76', { key: 3, style: { strokeWidth: 5 } }),             // drop bar
        P('M87 39 C 91 32, 99 34, 99 42 C 99 46, 97 49, 95 51 L 99 70', { key: 4, style: { strokeWidth: 4 } })])); },     // hood + brake lever
    gear: function () { return h('g', null,
      Gp({ key: 1, 'data-spin': 1500, style: ORG(22, 52) }, [                                                               // cassette (spins faster)
        C(22, 52, 14, { key: 1, className: 'f', style: { strokeWidth: 3, strokeDasharray: '2.2 1.8' } }), C(22, 52, 10.5, { key: 2, style: { strokeWidth: 2.5 } }),
        C(22, 52, 7, { key: 3, style: { strokeWidth: 2.5 } }), C(22, 52, 2.5, { key: 4, style: { strokeWidth: 2.5 } })]),
      P('M22 38 L66 38', { key: 2, className: 'f', 'data-chain': 700, style: { strokeWidth: 3, strokeDasharray: '3 2' } }),           // chain, top run
      P('M66 78 L27 83.5 M25 66 L28 66', { key: 3, className: 'f', 'data-chain': 700, style: { strokeWidth: 3, strokeDasharray: '3 2' } }),   // chain, bottom run
      P('M24 54 L33 60 L30 69', { key: 4, style: { strokeWidth: 3.5 } }),                                                  // rear derailleur body
      P('M30 69 L26 80', { key: 5, style: { strokeWidth: 3.5 } }), C(29, 69, 3.5, { key: 6, style: { strokeWidth: 2.5 } }), C(26, 80, 3.5, { key: 7, style: { strokeWidth: 2.5 } }),   // cage + pulleys
      Gp({ key: 8, 'data-spin': 3600, style: ORG(66, 58) }, [                                                               // chainring + crank
        C(66, 58, 20, { key: 1, className: 'f', style: { strokeWidth: 3, strokeDasharray: '2.6 2' } }), C(66, 58, 16.5, { key: 2, style: { strokeWidth: 3 } }),
        P(radial(66, 58, 4, 16.5, 4, 0.125), { key: 3, style: { strokeWidth: 3 } }), C(66, 58, 4, { key: 4, style: { strokeWidth: 3 } }),
        P('M66 58 L80 86', { key: 5, style: { strokeWidth: 6 } }), P('M73 88 L88 85', { key: 6, style: { strokeWidth: 5 } })])); },
    wheel: function () { return Gp({ 'data-spin': 3200, style: ORG(50, 50) }, [
      C(50, 50, 46, { key: 1, style: { strokeWidth: 4 } }), C(50, 50, 40, { key: 2, style: { strokeWidth: 3 } }),
      P(spokes(50, 50, 6, 40, 20), { key: 3, style: { strokeWidth: 1.6 } }), C(50, 50, 6, { key: 4, style: { strokeWidth: 3 } }),
      P('M50 4 L50 0', { key: 5, style: { strokeWidth: 3 } })]); },                                                          // valve
    stack: function () { return h('g', null,
      P('M20 92 L80 92', { key: 1 }), P('M50 90 L50 22', { key: 2 }), P('M40 80 L50 90 L60 80', { key: 3 }),
      Gp({ key: 4, 'data-move': '0,-7,2400' }, [P('M38 12 L62 12', { key: 1, style: { strokeWidth: 5 } }), P('M40 24 L50 14 L60 24', { key: 2 })])); },
    reach: function () { return h('g', null,
      P('M10 20 L10 80', { key: 1 }), P('M12 50 L78 50', { key: 2 }), P('M22 40 L12 50 L22 60', { key: 3 }),
      Gp({ key: 4, 'data-move': '7,0,2400' }, [P('M90 30 L90 70', { key: 1, style: { strokeWidth: 5 } }), P('M78 40 L88 50 L78 60', { key: 2 })])); },
    angle: function () { return h('g', null,
      P('M8 88 L92 88', { key: 1 }), C(66, 72, 15, { key: 2, style: { strokeWidth: 3 } }),
      Gp({ key: 3, 'data-rock': '3,3000', style: ORG(60, 88) }, [P('M42 8 L60 64', { key: 1, style: { strokeWidth: 7 } }), P('M60 64 L64 72', { key: 2, style: { strokeWidth: 4 } })]),
      P('M78 88 A 18 18 0 0 0 73 75', { key: 4, style: { strokeWidth: 3 } })); },
    base: function () { return h('g', null,
      Gp({ key: 1, 'data-spin': 2600, style: ORG(24, 50) }, [C(24, 50, 18, { key: 1 }), P(radial(24, 50, 3, 18, 6), { key: 2, style: { strokeWidth: 2 } })]),
      Gp({ key: 2, 'data-spin': 2600, style: ORG(76, 50) }, [C(76, 50, 18, { key: 1 }), P(radial(76, 50, 3, 18, 6), { key: 2, style: { strokeWidth: 2 } })]),
      P('M24 50 L76 50', { key: 3, style: { strokeWidth: 3 } }),
      P('M24 84 L76 84 M24 78 L24 90 M76 78 L76 90', { key: 4 })); }
  };
  var icon = function (k, col) { return h('svg', { className: 'p14-ic', viewBox: '0 0 100 100', width: 130, height: 130,
    style: { display: 'block', overflow: 'visible', fill: 'none', stroke: col, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' } }, ICONS[k]()); };
  function iconIn(svg, t) {
    if (!svg) return;
    M.qa(svg, 'path,circle').forEach(function (p) { if (p.classList.contains('f')) M.fade(p, t + 500, 700); else M.drawPath(p, t, 1100); });
    var t2 = t + 1300, loop = function (el, kf, dur, ease) { var a = el.animate(kf, { delay: t2, duration: dur, iterations: Infinity, easing: ease || 'ease-in-out', fill: 'both' }); a.pause(); };
    M.qa(svg, '[data-spin]').forEach(function (g) { loop(g, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], +g.getAttribute('data-spin'), 'linear'); });
    M.qa(svg, '[data-move]').forEach(function (g) { var m = g.getAttribute('data-move').split(',').map(Number);
      loop(g, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(' + m[0] + 'px,' + m[1] + 'px)' }, { transform: 'translate(0px,0px)' }], m[2]); });
    M.qa(svg, '[data-rock]').forEach(function (g) { var m = g.getAttribute('data-rock').split(',').map(Number);
      loop(g, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + m[0] + 'deg)' }, { transform: 'rotate(0deg)' }, { transform: 'rotate(' + (-m[0]) + 'deg)' }, { transform: 'rotate(0deg)' }], m[1]); });
    M.qa(svg, '[data-chain]').forEach(function (p) { loop(p, [{ strokeDashoffset: 0 }, { strokeDashoffset: -10 }], +p.getAttribute('data-chain'), 'linear'); });
  }
  var item = function (t, sub, mark, col, ic) {
    return h('div', { className: 'p14-item', style: { display: 'grid', gridTemplateColumns: ic ? '70px 1fr 150px' : '70px 1fr', gap: 18, alignItems: 'center', borderTop: '3px solid var(--s-line)', paddingTop: 12, paddingBottom: 4 } },
      h('b', { style: Object.assign(DISP(800, 54, 80), { color: col }) }, mark),
      h('div', { style: { display: 'grid', gap: 4 } }, h('b', { style: Object.assign(DISP(800, 54, 80), { color: INK }) }, t), sub ? h('span', { style: Object.assign(DISP(650, 36, 85), { color: MUTED }) }, sub) : null),
      ic ? icon(ic, col === 'var(--series-1)' ? col : INK) : null);
  };
  var list = function (rows, mark, col) { return h('div', { style: { display: 'grid', gap: 14, marginTop: 50 } }, rows.map(function (r, i) { return h('div', { key: i }, item(r[0], r[1], mark, col, r[2])); })); };
  var note = function (s) { return h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 40 } }, s); };

  SETS[CODE] = [
    h(G.Slide, { key: 1, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Black Friday · before you buy'), h(G.Hook, { size: 128 }, 'What can you\n*swap later?*')),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 2, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Swap any time'), h(G.Hook, { size: 104 }, 'Upgrade later.')),
      list([['Tyres', null, 'tyre'], ['Saddle', null, 'saddle'], ['Stem and bar', null, 'cockpit'], ['Gearing', null, 'gear'], ['Wheels', null, 'wheel']], '✓', 'var(--ig-good)'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 3, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Built into the frame'), h(G.Hook, { size: 104 }, 'Yours for good.')),
      list([['Stack', 'how high the front is', 'stack'], ['Reach', 'how long the front is', 'reach'], ['Head angle and trail', 'how it steers', 'angle'], ['Wheelbase', 'how steady it feels', 'base']], '✕', 'var(--ig-bad, #C0392B)'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 4, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Fine-tuning'), h(G.Hook, { size: 104 }, 'The cockpit moves\n*a little.*')),
      list([['Spacers', 'about 10–35 mm under the stem'], ['Stem length', '10 mm of stem ≈ 10 mm of reach'], ['A steeper, “negative” stem', '−17° instead of −6°: bars about 11 mm lower']], '↕', 'var(--series-1)'),
      note('One size up on a gravel bike is typically 20 mm taller and 9 mm longer. Tuning helps; it doesn’t replace the right size.'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 5, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Before you pay'), h(G.Hook, { size: 112 }, 'The part you can’t\nswap costs the most.\n*Check it first.*')),
      h('div', { style: { flex: 1 } })),
    h(G.ReelEndCard, { key: 6, line: 'Check your size before you check the price.', cta: 'Free · link in bio' })
  ];

  CHOREO[CODE] = [
    function (r) { return 2800; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 550, 700); iconIn(M.q(x, '.p14-ic'), 600 + i * 550); }); return 7600; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 650, 700); iconIn(M.q(x, '.p14-ic'), 600 + i * 650); }); return 7200; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 800, 800); }); M.caption(r, 2900); return 7000; },
    function (r) { return 3400; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3600; }
  ];
})();
