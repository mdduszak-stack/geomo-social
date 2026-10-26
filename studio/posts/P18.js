// ============================================================================
// P18 v2 · carousel · Black Friday 3/3: "60 seconds before you pay" (checklist, pinned for BF week)
// Review 26.10 (Maciej): add animations; slide 2 — not only inseam, also mobility.
// Built on the v1 set (engine/core.js bf3); slide 2 replaced.
// Sources: inseam method + "3–5 cm shorter": app texts (wizard inseam steps, inseam.ratio.low.body);
//   4 mobility questions and "answer from memory": app i18n (mobility.*.test, wizard.mobility.unsure);
//   58 mm: P06 calculation (178 cm, inseam 84, balanced, Gravel race: all tests 1 → +33 mm, all 5 → −25 mm);
//   size-M stack 552–607 mm, 48 gravel bikes, median 580: bikes-backup-2026-10-25 (re-checked 26.10);
//   Grail Gen 2 M 95% / L 54% for 178 cm: Geomo algorithm @ 91aad78 (re-checked 26.10).
// ============================================================================
(function () {
  var CODE = 'P18';
  var base = window.SETS.bf3;
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)';
  var body = h('div', { className: 'p18-body', style: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 30, alignItems: 'center', width: '100%' } },
    h('div', { style: { display: 'flex', justifyContent: 'center' } }, h(G.Rider, { height: 178, inseam: 84, scale: 1.3, showMeasures: true })),
    h('div', { style: { display: 'grid', gap: 20 } }, [
      ['1', 'Inseam', 'Barefoot, book between your legs, floor to spine.'],
      ['2', 'Flexibility', 'Forward bend, plank, torso twist, head up.'],
      ['3', 'No stopwatch', 'Answer from memory. Not sure? Pick the middle.']
    ].map(function (r) {
      return h('div', { key: r[0], className: 'p18-row', style: { display: 'grid', gridTemplateColumns: '50px 1fr', gap: 14, alignItems: 'baseline', borderTop: '2px solid var(--s-line)', paddingTop: 14 } },
        h('b', { style: Object.assign(DISP(800, 40, 80), { color: 'var(--s-accent)' }) }, r[0]),
        h('div', { style: { display: 'grid', gap: 4 } }, h('b', { style: Object.assign(DISP(800, 40, 80), { color: INK }) }, r[1]), h('span', { style: Object.assign(DISP(650, 30, 85), { color: MUTED, lineHeight: 1.2 }) }, r[2])));
    })));
  var s2 = h(G.ContentSlide, { key: 2, page: 2, total: 7, kicker: 'Check 1 · Your body', title: 'Know your inseam and how flexible you are.', art: body,
    note: 'Same 178 cm rider: stiff vs flexible moves the ideal handlebar by 58 mm.', artFirst: true });
  SETS[CODE] = [base[0], clone(s2, { series: 'Black Friday' })].concat(base.slice(2));

  var byStyle = function (r, s) { return M.qa(r, '[style*="' + s + '"]'); };
  CHOREO[CODE] = [
    function (r) { var e = M.bike(M.q(r, 'svg.gd'), 400); return Math.max(4200, e + 1600); },
    function (r) { var sv = M.q(r, '.p18-body svg'); if (sv) M.rider(sv, 200); M.qa(r, '.p18-row').forEach(function (x, i) { M.fadeUp(x, 1000 + i * 500, 800); }); M.caption(r, 2800); return 6400; },
    function (r) { var big = M.q(r, '.gs-big-number, .gs-bignum b, b'); M.qa(r, 'svg circle').forEach(function (c, i) { M.fade(c, 900 + (i % 48) * 40, 400); }); M.caption(r, 3000); return 6000; },
    function (r) { M.fadeUp(M.q(r, '.gs-art img'), 300); M.caption(r, 1200); return 4800; },
    function (r) { byStyle(r, 'grid-template-columns: 90px 1fr 130px').forEach(function (row, i) { var t = 400 + i * 180; M.fade(row, t, 500); if (row.children[1] && row.children[1].firstChild) M.grow(row.children[1].firstChild, t + 100, 1200); M.count(row.querySelector('b'), t + 100, 1200); });
      M.ring(r, 2400); M.caption(r, 2600); return 6000; },
    function (r) { var cols = M.q(r, '.gs-art > div'); if (cols) Array.prototype.forEach.call(cols.children, function (c, i) { Array.prototype.forEach.call(c.children, function (x, j) { M.fadeUp(x, 300 + i * 600 + j * 180, 700); }); }); M.caption(r, 2800); return 6000; },
    function (r) { M.ctaRows(r, 400); return 4600; }
  ];
})();
