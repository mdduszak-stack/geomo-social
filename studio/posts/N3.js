// ============================================================================
// N3 · carousel · "New bike, new numbers": Colnago G5-X vs G3-X (same-stack sizes 510 vs 52)
// Sources: bikes-backup-2026-10-25T19-12-31-744Z (Geomo database) and Geomo algorithm @ bikefit 91aad78 (26.10.2026;
//   rider 178 cm, inseam 84 cm, typical flexibility, balanced, factory stems). G5-X 510: 573/392, HTA 71, STA 73.5, trail 73, chainstay 435, BB drop 80, wb 1044 (stem not published: Geomo estimate); G3-X 52: 573/390, HTA 71.5, STA 73.5, chainstay 430, BB drop 70, stem 110 (no trail/wheelbase published). Tyres: G5-X 53 mm, G3-X 42 mm (Colnago specs). Fit 178 cm: G5-X best 540 93% (510 94% with estimated stem), G3-X best 49 97%.
//   Photo: Colnago G5-X product image supplied by Maciej 28.10, background removed (rembg isnet); cover + slide 2 morph.
// ============================================================================
(function () {
  var CODE = 'N3';
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)', C2 = 'var(--series-2)', C1 = 'var(--series-1)';
  var NEW = { name: 'G5-X', size: '510', stack: 573, reach: 392, hta: 71, sta: 73.5, chainstay: 435, bbDrop: 80, wheelbase: 1044, trail: 73 }, OLD = { name: 'G3-X', size: '52', stack: 573, reach: 390, hta: 71.5, sta: 73.5, chainstay: 430, bbDrop: 70, headTube: 140, stem: 110 };
  var total = 8;
  function change(rows) {
    return h('div', { className: 'n1-rows', style: { display: 'grid', gap: 22, width: 936 } }, rows.map(function (r, i) {
      return h('div', { key: i, className: 'n1-row', style: { display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', borderTop: '3px solid var(--s-line)', paddingTop: 16 } },
        h('span', { style: Object.assign(DISP(650, 42, 85), { color: INK }) }, r[0]),
        h('span', { style: { display: 'flex', alignItems: 'baseline', gap: 18 } },
          h('span', { style: Object.assign(DISP(700, 48, 80), { color: C2 }) }, r[1]), h('span', { style: Object.assign(DISP(700, 40, 80), { color: MUTED }) }, '→'),
          h('b', { className: 'n1-new', style: Object.assign(DISP(800, 66, 75), { color: C1 }) }, r[2])));
    }));
  }
  function proscons(a, b) {
    var col = function (title, items, c) {
      return h('div', { className: 'n1-col', style: { display: 'grid', gap: 18, alignContent: 'start' } },
        h('b', { style: Object.assign(DISP(800, 48, 80), { color: c }) }, title),
        items.map(function (t, i) { return h('span', { key: i, style: Object.assign(DISP(650, 36, 85), { color: INK, lineHeight: 1.2, borderTop: '3px solid var(--s-line)', paddingTop: 14 }) }, t); }));
    };
    return h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, width: 936 } }, col('Better for', a, 'var(--ig-good)'), col('Watch out', b, 'var(--ig-bad, #C0392B)'));
  }
  var legend = h(G.OverlayLegend, { bikes: [NEW, OLD] });
  SETS[CODE] = withSeries('New bike, new numbers', [
    h(G.CoverSlide, { key: 1, total: total, kicker: 'New bike, new numbers', title: 'New Colnago G5-X.\n*What changed?*', sub: 'Vs the G3-X, sizes with the same stack. Swipe →',
      art: h('div', { className: 'n1-photo', style: { display: 'grid', gap: 8 } }, h('img', { src: 'g5x-product.png', style: { width: 936, display: 'block' } }),
        h('span', { style: { fontFamily: 'var(--font-display)', fontSize: 22, color: MUTED } }, 'G5-X · photo: Colnago')) }),
    h(G.ContentSlide, { key: 2, page: 2, total: total, kicker: 'At a glance · 510 vs 52', title: 'Same stack. Lower and longer below.',
      art: h('div', { style: { position: 'relative' } }, h(G.BikeDrawing, { bikes: [NEW, OLD], width: 900, showSaddle: false }), legend,
        h('img', { className: 'n1-prod', 'data-ax': '{"rx":303,"fx":1096.2,"cy":531.1,"w":1400}', src: 'g5x-product.png', style: { position: 'absolute', left: 0, top: 0, width: 900, opacity: 0.12, pointerEvents: 'none' } })),
      note: 'Stack 573 mm in both. The G5-X sits 10 mm lower at the bottom bracket and has longer chainstays. Photo: Colnago.', artFirst: true }),
    h(G.ContentSlide, { key: 3, page: 3, total: total, kicker: '1 · Tyres', title: 'From 42 to 53 mm.', art: change([['Max tyre (700c)', '42', '53 mm'], ['Chainstay', '430', '435 mm']]), note: 'Tyre sizes from Colnago’s specs.', artFirst: true }),
    h(G.ContentSlide, { key: 4, page: 4, total: total, kicker: '2 · Bottom bracket', title: '10 mm lower.', art: change([['BB drop', '70', '80 mm']]), note: 'You sit deeper between the wheels: steadier on loose ground, a bit less pedal clearance.', artFirst: true }),
    h(G.ContentSlide, { key: 5, page: 5, total: total, kicker: '3 · Fit', title: 'Same stack, almost the same reach.', art: change([['Stack', '573', '573 mm'], ['Reach', '390', '392 mm'], ['Head angle', '71.5°', '71°']]), note: 'G5-X 510 vs G3-X 52: the two sizes with the same stack.', artFirst: true }),
    h(G.ContentSlide, { key: 6, page: 6, total: total, kicker: '4 · Sizes', title: 'New sizes, new names.', art: change([['Size range', '46–58', '450–570'], ['Best size, 178 cm rider', '49', '540']]), note: 'Rider: 178 cm, inseam 84 cm, typical flexibility, balanced position. G3-X 49: 97%. G5-X 540: 93% (G5-X stems not published, so Geomo estimates them).', artFirst: true }),
    h(G.ContentSlide, { key: 7, page: 7, total: total, kicker: '5 · Who it suits', title: 'Read the numbers, not the hype.', art: proscons(['Big tyres, rough gravel', 'A low, planted ride', 'Riders who liked the G3-X fit'], ['Size names changed: don’t buy by habit', 'Lower BB: less pedal clearance', 'Stems unknown: check the bike as sold']), note: 'Neither is better. It depends on where you ride.', artFirst: true }),
    h(G.CTASlide, { key: 8, page: 8, total: total, title: 'Check how the G5-X fits you.', sub: 'Free · no account · about a minute', actions: CTA_ACT })
  ]);
  function rowsIn(r, t) { var rows = M.qa(r, '.n1-row'); rows.forEach(function (x, i) { M.fadeUp(x, t + i * 350, 800); var n = M.q(x, '.n1-new'); if (n) M.count(n, t + i * 350 + 200, 1000); }); return t + rows.length * 350 + 600; }
  var rowsSlide = function (r) { var e = rowsIn(r, 300); M.caption(r, e); return e + 2600; };
  CHOREO[CODE] = [
    function (r) { M.fadeUp(M.q(r, '.n1-photo'), 300, 1000); return 3800; },
    function (r) { var sv = M.q(r, 'svg.gd'); M.morph(M.q(r, '.n1-prod'), 0, 3000); var e = M.bike(sv, 1400); M.fade(M.q(r, '.gs-legend'), e - 600, 700); M.caption(r, e); return e + 2400; },
    rowsSlide, rowsSlide, rowsSlide, rowsSlide,
    function (r) { M.qa(r, '.n1-col').forEach(function (c, i) { Array.prototype.forEach.call(c.children, function (x, j) { M.fadeUp(x, 300 + i * 700 + j * 300, 800); }); }); M.caption(r, 2800); return 6000; },
    function (r) { M.ctaRows(r, 400); return 4600; }
  ];
})();
