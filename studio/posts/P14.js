// ============================================================================
// P14 v2 · reel · Black Friday 1/3: "Parts you can swap. The frame stays."
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
  // line icons (100×100), drawn on as each row comes in
  var IC = {
    tyre: 'M50 12 A38 38 0 1 1 49.9 12 M50 30 A20 20 0 1 1 49.9 30 M50 12 L50 20 M88 50 L80 50 M50 88 L50 80 M12 50 L20 50 M77 23 L71 29 M77 77 L71 71 M23 77 L29 71 M23 23 L29 29',
    saddle: 'M10 40 Q30 30 60 34 Q86 36 92 46 Q70 54 40 52 Q22 50 10 40 Z M48 52 L44 86 M32 86 L56 86',
    cockpit: 'M14 70 L30 40 M24 50 L66 38 M66 38 Q86 32 88 52 Q90 70 76 78',
    gear: 'M50 26 A24 24 0 1 1 49.9 26 M50 40 A10 10 0 1 1 49.9 40 M50 8 L50 20 M50 80 L50 92 M8 50 L20 50 M80 50 L92 50 M20 20 L29 29 M71 71 L80 80 M80 20 L71 29 M29 71 L20 80',
    wheel: 'M50 10 A40 40 0 1 1 49.9 10 M50 50 L50 10 M50 50 L85 70 M50 50 L15 70 M50 50 L85 30 M50 50 L15 30 M50 50 L50 90',
    stack: 'M50 10 L50 90 M38 22 L50 10 L62 22 M38 78 L50 90 L62 78 M20 90 L80 90',
    reach: 'M10 50 L90 50 M22 38 L10 50 L22 62 M78 38 L90 50 L78 62 M10 20 L10 80',
    angle: 'M20 85 L85 85 M20 85 L62 18 M55 85 A35 35 0 0 0 38 56',
    base: 'M28 48 A18 18 0 1 1 27.9 48 M72 48 A18 18 0 1 1 71.9 48 M28 84 L72 84 M28 78 L28 90 M72 78 L72 90'
  };
  var icon = function (k, col) { return h('svg', { className: 'p14-ic', viewBox: '0 0 100 100', width: 110, height: 110, style: { display: 'block' } }, h('path', { d: IC[k], style: { fill: 'none', stroke: col, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' } })); };
  var item = function (t, sub, mark, col, ic) {
    return h('div', { className: 'p14-item', style: { display: 'grid', gridTemplateColumns: ic ? '70px 1fr 120px' : '70px 1fr', gap: 18, alignItems: 'center', borderTop: '3px solid var(--s-line)', paddingTop: 12, paddingBottom: 4 } },
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
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 550, 700); M.icon(M.q(x, '.p14-ic'), 600 + i * 550, 1000); }); return 5400; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 650, 700); M.icon(M.q(x, '.p14-ic'), 600 + i * 650, 1000); }); return 5600; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 800, 800); }); M.caption(r, 2900); return 7000; },
    function (r) { return 3400; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3600; }
  ];
})();
