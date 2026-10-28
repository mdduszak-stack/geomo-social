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
  var s5 = clone(base[4], { note: 'Canyon Grail Gen 2, same rider: 178 cm, inseam 84 cm, typical flexibility, balanced. 95% in M, 54% in L.' });
  // size-M gravel frames (48, bikes-backup-2026-10-25): [stack, reach]
  var MSR = [[598, 379], [564, 394], [580, 410], [582, 382], [561, 387], [561, 404], [576, 385], [587, 385], [571, 395], [589, 390], [596, 404], [583.4, 395.5], [591, 385], [590, 380], [586, 382], [591, 411], [574, 383], [586, 387], [593, 381], [571, 406], [601, 406], [580.6, 396.4], [558, 396], [560, 392], [552, 376], [557, 375], [569, 392], [565, 384], [560, 389], [585, 408], [554, 391], [575, 411], [570, 373], [607, 412], [554, 391], [559, 384], [584, 397], [586, 387], [591, 401], [582, 406], [576, 405], [583, 395], [558, 380], [596, 395], [580, 400], [589, 391], [579, 391], [576, 395]];
  function strip(vals, lo, hi, vertical, ends) {
    var W = vertical ? 520 : 936, H = vertical ? 700 : 300, pad = 70, cnt = {};
    var pos = function (x) { return pad + (x - lo) / (hi - lo) * ((vertical ? H : W) - 2 * pad); };
    var dots = vals.map(function (x, i) { var k = Math.round(x); cnt[k] = (cnt[k] || 0) + 1; var off = (cnt[k] - 1) * 22;
      return vertical ? h('circle', { key: i, className: 'p18-dot', cx: 150 + off, cy: H - pos(x), r: 9, style: { fill: 'var(--series-1)' } })
                      : h('circle', { key: i, className: 'p18-dot', cx: pos(x), cy: 180 - off, r: 9, style: { fill: 'var(--series-1)' } }); });
    var T = function (k, x, y, t, a, c) { return h('text', { key: k, x: x, y: y, textAnchor: a || 'start', style: { font: '700 30px var(--font-display)', fill: c || INK } }, t); };
    var axis = vertical ? h('line', { x1: 120, y1: pad - 20, x2: 120, y2: H - pad + 20, style: { stroke: 'var(--s-line)', strokeWidth: 4 } })
                        : h('line', { x1: pad - 20, y1: 205, x2: W - pad + 20, y2: 205, style: { stroke: 'var(--s-line)', strokeWidth: 4 } });
    var labs = vertical ? [T('l1', 100, H - pos(lo) + 10, lo, 'end', MUTED), T('l2', 100, H - pos(hi) + 10, hi, 'end', MUTED), T('n1', 300, H - pos(lo) + 10, ends[0]), T('n2', 300, H - pos(hi) + 10, ends[1]),
                          T('ax', 120, 30, '↑ Stack, mm', 'middle', MUTED)]
                        : [T('l1', pos(lo), 250, lo, 'middle', MUTED), T('l2', pos(hi), 250, hi, 'middle', MUTED), T('n1', pos(lo), 60, ends[0], 'start'), T('n2', pos(hi), 60, ends[1], 'end'),
                          T('ax', W - pad + 20, 295, 'Reach, mm →', 'end', MUTED)];
    return h('svg', { className: 'p18-strip', viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, style: { display: 'block', overflow: 'visible' } }, axis, dots, labs);
  }
  var sStack = h(G.ContentSlide, { key: 3, kicker: 'Check 2 · Ignore the letter', title: 'An M is not an M. Height:', artFirst: true,
    art: h('div', { style: { display: 'flex', justifyContent: 'center', width: '100%' } }, strip(MSR.map(function (x) { return x[0]; }), 552, 607, true, ['Van Rysel GCR 552', 'Merida Silex 607'])),
    note: 'Stack of 48 size-M gravel frames in Geomo: 552 to 607 mm. 55 mm between the lowest and the highest front.' });
  var sReach = h(G.ContentSlide, { key: 4, kicker: 'Check 2 · Ignore the letter', title: 'And length:', artFirst: true,
    art: strip(MSR.map(function (x) { return x[1]; }), 373, 412, false, ['Basso Palta 373', 'Merida Silex 412']),
    note: 'Reach of the same 48 size-M frames: 373 to 412 mm. 39 mm between the shortest and the longest. Compare numbers, not letters.' });
  var list8 = [base[0], clone(s2, { series: 'Black Friday' }), sStack, sReach, base[3], s5].concat(base.slice(5));
  SETS[CODE] = list8.map(function (el, i) { return clone(el, { key: i + 1, page: i + 1, total: 8, series: 'Black Friday' }); });

  var byStyle = function (r, s) { return M.qa(r, '[style*="' + s + '"]'); };
  CHOREO[CODE] = [
    function (r) { var e = M.bike(M.q(r, 'svg.gd'), 400); return Math.max(4200, e + 1600); },
    function (r) { var sv = M.q(r, '.p18-body svg'); if (sv) M.rider(sv, 200); M.qa(r, '.p18-row').forEach(function (x, i) { M.fadeUp(x, 1000 + i * 500, 800); }); M.caption(r, 2800); return 6400; },
    function (r) { var sv = M.q(r, '.p18-strip'); M.qa(sv, 'line').forEach(function (l) { M.drawPath(l, 200, 900); }); M.qa(sv, '.p18-dot').forEach(function (c, i) { M.fade(c, 700 + ((i * 37) % 48) * 40, 400); }); M.qa(sv, 'text').forEach(function (t) { M.fade(t, 2800, 600); }); M.caption(r, 3200); return 6400; },
    function (r) { var sv = M.q(r, '.p18-strip'); M.qa(sv, 'line').forEach(function (l) { M.drawPath(l, 200, 900); }); M.qa(sv, '.p18-dot').forEach(function (c, i) { M.fade(c, 700 + ((i * 37) % 48) * 40, 400); }); M.qa(sv, 'text').forEach(function (t) { M.fade(t, 2800, 600); }); M.caption(r, 3200); return 6400; },
    function (r) { M.fadeUp(M.q(r, '.gs-art img'), 300); M.caption(r, 1200); return 4800; },
    function (r) { byStyle(r, 'grid-template-columns: 90px 1fr 130px').forEach(function (row, i) { var t = 400 + i * 180; M.fade(row, t, 500); if (row.children[1] && row.children[1].firstChild) M.grow(row.children[1].firstChild, t + 100, 1200); M.count(row.querySelector('b'), t + 100, 1200); });
      M.ring(r, 2400); M.caption(r, 2600); return 6000; },
    function (r) { var cols = M.q(r, '.gs-art > div'); if (cols) Array.prototype.forEach.call(cols.children, function (c, i) { Array.prototype.forEach.call(c.children, function (x, j) { M.fadeUp(x, 300 + i * 600 + j * 180, 700); }); }); M.caption(r, 2800); return 6000; },
    function (r) { M.ctaRows(r, 400); return 4600; }
  ];
})();
