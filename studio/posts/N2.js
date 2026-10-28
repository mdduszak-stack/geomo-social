// ============================================================================
// N2 · carousel · "New bike, new numbers": Specialized Crux 5 vs Crux (2022–2025), size 54 and 56
// Sources: bikes-backup-2026-10-25T19-12-31-744Z (Geomo database) and Geomo algorithm @ bikefit 91aad78 (26.10.2026;
//   rider 178 cm, inseam 84 cm, typical flexibility, balanced, factory stems). Crux 5 54: 560/388, HTA 71, trail 69, BB drop 78, wheelbase 1026, stem 90; 56: 578/400, HTA 71.5, trail 66, BB drop 78. Crux (2022–2025) 54: 560/388, HTA 71.5, trail 67, BB drop 72, wb 1023; 56: 578/397, HTA 72, trail 64, BB drop 72. Tyres: Crux 5 55 mm (Specialized manual), old Crux 47 mm 700c (product page). Fit 178 cm: both 54 = 97%, 56: new 81%, old 86%.
//   Photo: Specialized product image supplied by Maciej 28.10 (cover + slide 2 morph). Press-photo permission request to Specialized still open.
// ============================================================================
(function () {
  var CODE = 'N2';
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)', C2 = 'var(--series-2)', C1 = 'var(--series-1)';
  var NEW = { name: 'Crux 5', size: '56', stack: 578, reach: 400, hta: 71.5, sta: 74, chainstay: 425, bbDrop: 78, wheelbase: 1039, trail: 66, headTube: 142, stem: 100 }, OLD = { name: 'Crux (2022–25)', size: '56', stack: 578, reach: 397, hta: 72, sta: 73.5, chainstay: 425, bbDrop: 72, wheelbase: 1033, trail: 64, headTube: 147, stem: 100 };
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
    h(G.CoverSlide, { key: 1, total: total, kicker: 'New bike, new numbers', title: 'New Specialized Crux.\n*What changed?*', sub: 'Crux 5 vs the 2022–2025 Crux. Swipe →',
      art: h('div', { className: 'n1-photo', style: { display: 'grid', gap: 8 } }, h('img', { src: 'crux5-product.jpg', style: { width: 936, height: 527, objectFit: 'cover', display: 'block', mixBlendMode: 'multiply' } }),
        h('span', { style: { fontFamily: 'var(--font-display)', fontSize: 22, color: MUTED } }, 'Crux 5 · photo: Specialized')) }),
    h(G.ContentSlide, { key: 2, page: 2, total: total, kicker: 'At a glance · size 56', title: 'Same front. New numbers below.',
      art: h('div', { style: { position: 'relative' } }, h(G.BikeDrawing, { bikes: [NEW, OLD], width: 900, showSaddle: false }), legend,
        h('img', { className: 'n1-prod', 'data-ax': '{"rx":325,"fx":1073,"cy":500,"w":1400}', src: 'crux5-product.jpg', style: { position: 'absolute', left: 0, top: 0, width: 900, opacity: 0.12, mixBlendMode: 'multiply', pointerEvents: 'none' } })),
      note: 'Stack 578 mm in both. The changes are in the details: tyres, bottom bracket, steering. Photo: Specialized.', artFirst: true }),
    h(G.ContentSlide, { key: 3, page: 3, total: total, kicker: '1 · Tyres', title: 'Room for 55 mm tyres.', art: change([['Max tyre (700c)', '47', '55 mm']]), note: 'Biggest change of the generation. From Specialized’s manual and product page.', artFirst: true }),
    h(G.ContentSlide, { key: 4, page: 4, total: total, kicker: '2 · Lower and slacker', title: 'You sit lower in the bike.', art: change([['BB drop', '72', '78 mm'], ['Head angle (56)', '72°', '71.5°'], ['Trail (56)', '64', '66 mm']]), note: '6 mm lower bottom bracket, a touch slacker and more trail: steadier on rough ground.', artFirst: true }),
    h(G.ContentSlide, { key: 5, page: 5, total: total, kicker: '3 · Fit', title: 'Same stack. Reach +3 mm in 56.', art: change([['Stack (56)', '578', '578 mm'], ['Reach (56)', '397', '400 mm'], ['Wheelbase (56)', '1033', '1039 mm']]), note: 'Sizes 49–54 keep the same stack and reach. From 56 up the new bike is a bit longer.', artFirst: true }),
    h(G.ContentSlide, { key: 6, page: 6, total: total, kicker: '4 · For a 178 cm rider', title: 'The right size didn’t change.', art: change([['Size 54 fit', '97%', '97%'], ['Size 56 fit', '86%', '81%']]), note: 'Rider: 178 cm, inseam 84 cm, typical flexibility, balanced position, factory stems. Best size: 54 in both; in 56 the extra reach costs the new bike a little.', artFirst: true }),
    h(G.ContentSlide, { key: 7, page: 7, total: total, kicker: '5 · Who it suits', title: 'Read the numbers, not the hype.', art: proscons(['Bigger tyres, rougher routes', 'A steadier, lower ride', 'Same fit as before in sizes 49–54'], ['Slightly slower steering', 'Size 56 and up got longer: check again', 'Lower BB: a bit less pedal clearance']), note: 'Neither generation is better. It depends on where you ride.', artFirst: true }),
    h(G.CTASlide, { key: 8, page: 8, total: total, title: 'Check how the new Crux fits you.', sub: 'Free · no account · about a minute', actions: CTA_ACT })
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
