// ============================================================================
// N1 · carousel · "New bike, new numbers" #1: Canyon Grail Gen 3 vs Gen 2 (size M)
// Sources: bikes-backup-2026-10-25T19-12-31-744Z (Geomo database):
//   Grail CF / CF SLX / CFR (Gen 3, 2027–) M: stack 575, reach 411, HTA 71.5, STA 73.8, trail 62, chainstay 435, BB drop 75,
//     wheelbase 1062, head tube 138, stock stem 80; tyre clearance 57 mm (canyon.com Grail CFR AXS page).
//   Grail Gen 2 M: 591 / 411, HTA 71.5, STA 73.5, trail 69, chainstay 425, BB drop 75, wheelbase 1057, head tube 163, stem 70;
//     tyre clearance 42 mm (canyon.com Grail CF SLX 8 Di2 page, fork FK0117).
//   Fit (Geomo algorithm @ bikefit 91aad78, 26.10.2026; 178 cm, inseam 84, typical flexibility, balanced, factory stems):
//     Gen 3 M 96% (bars 627 / 477), Gen 2 M 95% (635 / 470).
//   Rivals, best size for the same rider: Specialized Crux 5 54: 560/388, trail 69, cs 425, 55 mm tyres, 97% ·
//     Giant Revolt Advanced ML: 602/391, trail 68, cs 435, 53 mm, 93% · Colnago G5-X 540: 591/401, trail 72, cs 435, 53 mm, 93%
//     (G5-X: stem estimated, not published).
//   Photos: Canyon (cover: ride photo; slide 2: product side view grail3-product.jpg from geomo.app compare pages, morphs into the drawing). Review 28.10.
// ============================================================================
(function () {
  var CODE = 'N1';
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)', C2 = 'var(--series-2)', C1 = 'var(--series-1)';
  var g2 = { name: 'Grail Gen 2', size: 'M', stack: 591, reach: 411, hta: 71.5, sta: 73.5, chainstay: 425, bbDrop: 75, wheelbase: 1057, trail: 69, headTube: 163, stem: 70 };
  var g3 = { name: 'Grail Gen 3', size: 'M', stack: 575, reach: 411, hta: 71.5, sta: 73.8, chainstay: 435, bbDrop: 75, wheelbase: 1062, trail: 62, headTube: 138, stem: 80 };
  var total = 8;
  function change(rows) {   // "old → new" rows
    return h('div', { className: 'n1-rows', style: { display: 'grid', gap: 26, width: 936 } }, rows.map(function (r, i) {
      return h('div', { key: i, className: 'n1-row', style: { display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', borderTop: '3px solid var(--s-line)', paddingTop: 18 } },
        h('span', { style: Object.assign(DISP(650, 44, 85), { color: INK }) }, r[0]),
        h('span', { style: { display: 'flex', alignItems: 'baseline', gap: 18 } },
          h('span', { style: Object.assign(DISP(700, 52, 80), { color: C2 }) }, r[1]), h('span', { style: Object.assign(DISP(700, 44, 80), { color: MUTED }) }, '→'),
          h('b', { className: 'n1-new', style: Object.assign(DISP(800, 72, 75), { color: C1 }) }, r[2])));
    }));
  }
  var legend = h(G.OverlayLegend, { bikes: [g3, g2] });
  function rivals() {
    var rows = [['Grail Gen 3', 'M', '575 / 411', '62', '57', 96, true], ['Crux 5', '54', '560 / 388', '69', '55', 97], ['Revolt Adv.', 'ML', '602 / 391', '68', '53', 93], ['G5-X', '540', '591 / 401', '72', '53', 93]];
    var cell = function (t, st) { return h('span', { style: Object.assign(DISP(650, 34, 85), { color: INK }, st || {}) }, t); };
    return h('div', { className: 'n1-tab', style: { display: 'grid', gap: 0, width: 936 } },
      h('div', { style: { display: 'grid', gridTemplateColumns: '230px 90px 220px 120px 130px 1fr', gap: 8, paddingBottom: 12 } },
        ['Bike', 'Size', 'Stack / reach', 'Trail', 'Tyre', 'Fit'].map(function (t) { return cell(t, { color: MUTED, fontSize: 26 }); })),
      rows.map(function (r, i) {
        return h('div', { key: i, className: 'n1-row', style: { display: 'grid', gridTemplateColumns: '230px 90px 220px 120px 130px 1fr', gap: 8, alignItems: 'baseline', borderTop: '3px solid var(--s-line)', padding: '16px 0' } },
          cell(r[0], { fontWeight: 800, color: r[6] ? C1 : INK }), cell(r[1]), cell(r[2]), cell(r[3]), cell(r[4] + ' mm'),
          h('b', { className: 'n1-fit', style: Object.assign(DISP(800, 44, 80), { color: 'var(--ig-good)' }) }, r[5] + '%'));
      }));
  }
  function proscons() {
    var col = function (title, items, c) {
      return h('div', { className: 'n1-col', style: { display: 'grid', gap: 18, alignContent: 'start' } },
        h('b', { style: Object.assign(DISP(800, 48, 80), { color: c }) }, title),
        items.map(function (t, i) { return h('span', { key: i, style: Object.assign(DISP(650, 36, 85), { color: INK, lineHeight: 1.2, borderTop: '3px solid var(--s-line)', paddingTop: 14 }) }, t); }));
    };
    return h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, width: 936 } },
      col('Better for', ['A lower, racier front end', 'Big tyres: up to 57 mm', 'A steadier rear end (+10 mm chainstay)'], 'var(--ig-good)'),
      col('Watch out', ['Livelier steering: 7 mm less trail', 'Liked Gen 2’s tall front? Check your size again', 'Stock stem 10 mm longer'], 'var(--ig-bad, #C0392B)'));
  }

  SETS[CODE] = withSeries('New bike, new numbers', [
    h(G.CoverSlide, { key: 1, total: total, kicker: 'New bike, new numbers', title: 'New Canyon Grail.\n*What changed?*', sub: 'Gen 3 vs Gen 2, size M. Swipe →',
      art: h('div', { className: 'n1-photo', style: { display: 'grid', gap: 8 } }, h('img', { src: 'grail3-ride.jpg', style: { width: 936, height: 560, objectFit: 'cover', display: 'block' } }),
        h('span', { style: { fontFamily: 'var(--font-display)', fontSize: 22, color: MUTED } }, 'Photo: Canyon')) }),
    h(G.ContentSlide, { key: 2, page: 2, total: total, kicker: '1 · The front', title: 'The front is 16 mm lower.',
      art: h('div', { style: { position: 'relative' } }, h(G.BikeDrawing, { bikes: [g3, g2], width: 900, showSaddle: false, callouts: [{ at: 'H', from: 0, to: 1, text: '16 mm lower', dx: -60, dy: 100, size: 40 }] }), legend,
        h('img', { className: 'n1-prod', 'data-ax': '{"rx":266.5,"fx":931.5,"cy":482.5,"w":1200}', src: 'grail3-product.jpg', style: { position: 'absolute', left: 0, top: 0, width: 900, opacity: 0.12, mixBlendMode: 'multiply', pointerEvents: 'none' } })),
      note: 'Stack 591 → 575 mm. Reach stays 411 mm. Same size M, a lower, racier position. Photo: Canyon.', artFirst: true }),
    h(G.ContentSlide, { key: 3, page: 3, total: total, kicker: '2 · Steering', title: 'Quicker steering.',
      art: change([['Trail', '69', '62 mm'], ['Head angle', '71.5°', '71.5°']]),
      note: 'Same head angle, 7 mm less trail: it turns in faster. Gen 2 held a line more calmly.', artFirst: true }),
    h(G.ContentSlide, { key: 4, page: 4, total: total, kicker: '3 · Tyres and rear end', title: 'Room for 57 mm tyres.',
      art: change([['Max tyre', '42', '57 mm'], ['Chainstay', '425', '435 mm'], ['Wheelbase', '1057', '1062 mm']]),
      note: 'Longer chainstays make the room and keep the rear steady. Tyre sizes from Canyon’s specs.', artFirst: true }),
    h(G.ContentSlide, { key: 5, page: 5, total: total, kicker: '4 · As sold', title: 'Longer stem. Lower bars.',
      art: change([['Stock stem', '70', '80 mm'], ['Bars: height', '635', '627 mm'], ['Bars: reach', '470', '477 mm']]),
      note: 'Bars and fit for a 178 cm rider: inseam 84 cm, typical flexibility, balanced position, factory stem. Fit: Gen 2 M 95%, Gen 3 M 96%.', artFirst: true }),
    h(G.ContentSlide, { key: 6, page: 6, total: total, kicker: '5 · Vs rivals', title: 'Against other gravel racers.',
      art: rivals(), note: 'Best size in each bike for one rider: 178 cm, inseam 84 cm, typical flexibility, balanced position. Colnago stem estimated (not published).', artFirst: true }),
    h(G.ContentSlide, { key: 7, page: 7, total: total, kicker: '6 · Who it suits', title: 'Read the numbers, not the hype.',
      art: proscons(), note: 'Neither generation is better. It depends on how you like to sit and ride.', artFirst: true }),
    h(G.CTASlide, { key: 8, page: 8, total: total, title: 'Check how the new Grail fits you.', sub: 'Free · no account · about a minute', actions: CTA_ACT })
  ]);

  function rowsIn(r, t) { M.qa(r, '.n1-row').forEach(function (x, i) { M.fadeUp(x, t + i * 350, 800); var n = M.q(x, '.n1-new, .n1-fit'); if (n) M.count(n, t + i * 350 + 200, 1000); }); return t + M.qa(r, '.n1-row').length * 350 + 600; }
  CHOREO[CODE] = [
    function (r) { M.fadeUp(M.q(r, '.n1-photo'), 300, 1000); return 3800; },
    function (r) { var sv = M.q(r, 'svg.gd'); M.morph(M.q(r, '.n1-prod'), 0, 3000); var e = M.bike(sv, 1400); M.fade(M.q(r, '.gs-legend'), e - 600, 700); M.caption(r, e); return e + 2400; },
    function (r) { var e = rowsIn(r, 300); M.caption(r, e); return e + 2600; },
    function (r) { var e = rowsIn(r, 300); M.caption(r, e); return e + 2600; },
    function (r) { var e = rowsIn(r, 300); M.caption(r, e); return e + 2600; },
    function (r) { var e = rowsIn(r, 300); M.caption(r, e); return e + 2800; },
    function (r) { M.qa(r, '.n1-col').forEach(function (c, i) { Array.prototype.forEach.call(c.children, function (x, j) { M.fadeUp(x, 300 + i * 700 + j * 300, 800); }); }); M.caption(r, 2800); return 6000; },
    function (r) { M.ctaRows(r, 400); return 4600; }
  ];
})();
