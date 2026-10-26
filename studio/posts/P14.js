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
  var item = function (t, sub, mark, col) {
    return h('div', { className: 'p14-item', style: { display: 'grid', gridTemplateColumns: '70px 1fr', gap: 18, alignItems: 'baseline', borderTop: '3px solid var(--s-line)', paddingTop: 16 } },
      h('b', { style: Object.assign(DISP(800, 54, 80), { color: col }) }, mark),
      h('div', { style: { display: 'grid', gap: 4 } }, h('b', { style: Object.assign(DISP(800, 54, 80), { color: INK }) }, t), sub ? h('span', { style: Object.assign(DISP(650, 36, 85), { color: MUTED }) }, sub) : null));
  };
  var list = function (rows, mark, col) { return h('div', { style: { display: 'grid', gap: 18, marginTop: 60 } }, rows.map(function (r, i) { return h('div', { key: i }, item(r[0], r[1], mark, col)); })); };
  var note = function (s) { return h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 40 } }, s); };

  SETS[CODE] = [
    h(G.Slide, { key: 1, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Black Friday · before you buy'), h(G.Hook, { size: 128 }, 'What can you\n*swap later?*')),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 2, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Swap any time'), h(G.Hook, { size: 104 }, 'Upgrade later.')),
      list([['Tyres', null], ['Saddle', null], ['Stem and bar', null], ['Gearing', null], ['Wheels', null]], '✓', 'var(--ig-good)'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 3, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Built into the frame'), h(G.Hook, { size: 104 }, 'Yours for good.')),
      list([['Stack', 'how high the front is'], ['Reach', 'how long the front is'], ['Head angle and trail', 'how it steers'], ['Wheelbase', 'how steady it feels']], '✕', 'var(--ig-bad, #C0392B)'),
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
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 450, 700); }); return 4600; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 550, 700); }); return 4800; },
    function (r) { M.qa(r, '.p14-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 800, 800); }); M.caption(r, 2900); return 7000; },
    function (r) { return 3400; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3600; }
  ];
})();
