// ============================================================================
// P17 v2 · reel · Black Friday: "A discount on the wrong size isn't a deal."
// Sources (computed 26.10.2026, Geomo algorithm @ bikefit 91aad78, bikes-backup-2026-10-25T19-12-31-744Z):
//   Rider 178 cm, inseam 84 cm, typical flexibility, balanced; Canyon Grail CF / CF SLX / CFR (Gen 3, 2027–), Gravel race,
//   factory stems: S 93%, M 96%, L 61%, XL 0% (calcFitForBike, stock stem). L with a 50 mm stem: 78%, bars 10 mm above target
//   (manualStem 50: hb 637 vs target 627). "−30%" is an example discount, not a real offer; no shop or brand deal shown.
// ============================================================================
(function () {
  var CODE = 'P17';
  var INK = 'var(--s-fg)';
  var big = function (t, strike, cls, size) { return h('div', { className: cls, style: Object.assign(DISP(800, size || 320, 72), { color: 'var(--s-fg)', lineHeight: 1, position: 'relative', display: 'inline-block' }) }, t,
    strike ? h('span', { className: 'p17-strike', style: { position: 'absolute', left: -10, right: -10, top: '52%', height: 22, background: 'var(--measure-on-dark)', transformOrigin: 'left center' } }) : null); };
  var fitCol = function (v) { return v >= 85 ? 'var(--ig-good)' : v >= 75 ? 'var(--ig-mid, #C98A00)' : 'var(--ig-bad, #C0392B)'; };
  function bars(rows) {
    return h('div', { className: 'p17-bars', style: { display: 'grid', gap: 26 } }, rows.map(function (r, i) {
      return h('div', { key: i, className: 'p17-row', style: { display: 'grid', gridTemplateColumns: '120px 1fr 170px', alignItems: 'center', gap: 20 } },
        h('b', { style: Object.assign(DISP(800, 64, 80), { color: INK }) }, r[0]),
        h('div', { style: { height: 54, background: 'var(--s-line)', borderRadius: 6, overflow: 'hidden' } },
          h('div', { className: 'p17-fill', style: { width: r[1] + '%', height: '100%', background: fitCol(r[1]), opacity: r[2] ? 1 : 0.85 } })),
        h('b', { className: 'p17-num', style: Object.assign(DISP(800, 64, 80), { color: fitCol(r[1]), textAlign: 'right' }) }, r[1] + '%'));
    }));
  }
  var note = function (s) { return h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 40 } }, s); };

  SETS[CODE] = [
    h(G.Slide, { key: 1, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Black Friday'),
        h('div', { style: { display: 'grid', gap: 0 } }, ['−30%', '−40%', '−50%'].map(function (t) { return h('div', { key: t }, big(t, false, 'p17-big', 250)); })),
        h('div', { style: { marginTop: 30 } }, h(G.Hook, { size: 104 }, 'Great deal?')))),
    h(G.Slide, { key: 2, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Black Friday'),
        h('div', { style: { display: 'grid', gap: 0 } }, ['−30%', '−40%', '−50%'].map(function (t) { return h('div', { key: t }, big(t, true, 'p17-big', 250)); })),
        h('div', { className: 'p17-no', style: { marginTop: 30 } }, h(G.Hook, { size: 104 }, 'Not if it’s\nthe wrong size.')))),
    h(G.Slide, { key: 3, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Canyon Grail Gen 3 · rider 178 cm'), h(G.Hook, { size: 104 }, 'Only size L\n*left on sale?*')),
      h('div', { style: { marginTop: 80 } }, bars([['S', 93], ['M', 96], ['L', 61, true]])),
      note('Fit for a 178 cm rider (inseam 84 cm, typical flexibility, balanced), factory stems. From Geomo.'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 4, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Size L + a short stem'), h(G.Hook, { size: 104 }, 'A stem can’t\n*save it.*')),
      h('div', { style: { marginTop: 80 } }, bars([['L', 78, true]])),
      h('p', { className: 'p17-fact', style: Object.assign(DISP(650, 48, 85), { margin: '40px 0 0', color: INK, lineHeight: 1.25 }) }, 'Even with a 50 mm stem, the bars sit 10 mm too high. Height comes from the frame.'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 5, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Before you pay'), h(G.Hook, { size: 112 }, 'Check the size\n*on sale.*'),
        h('p', { className: 'p17-fact', style: Object.assign(DISP(650, 52, 85), { margin: '40px 0 0', color: INK, lineHeight: 1.25 }) }, 'Your height, inseam and 4 quick questions.\nAbout a minute.')),
      h('div', { style: { flex: 1 } })),
    h(G.ReelEndCard, { key: 6, line: 'A discount on the wrong size isn’t a deal.', cta: 'Free · link in bio' })
  ];

  function barsIn(r, t) { M.qa(r, '.p17-row').forEach(function (row, i) { var tt = t + i * 450; M.fadeUp(row, tt, 700); M.grow(M.q(row, '.p17-fill'), tt + 150, 1100); M.count(M.q(row, '.p17-num'), tt + 150, 1100); }); }
  CHOREO[CODE] = [
    function (r) { M.qa(r, '.p17-big').forEach(function (b, i) { b.style.transformOrigin = 'left center'; M.add(b, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], 200 + i * 550, 800); }); M.fadeUp(M.q(r, '.gs-hook'), 2000, 800); return 3600; },
    function (r) { M.qa(r, '.p17-strike').forEach(function (x, i) { M.grow(x, 300 + i * 250, 500); }); M.fadeUp(M.q(r, '.p17-no'), 1200, 800); return 3200; },
    function (r) { barsIn(r, 500); M.caption(r, 2400); return 5600; },
    function (r) { barsIn(r, 400); M.fadeUp(M.q(r, '.p17-fact'), 1500, 900); return 5000; },
    function (r) { M.fadeUp(M.q(r, '.p17-fact'), 900, 900); return 3600; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3600; }
  ];
})();
