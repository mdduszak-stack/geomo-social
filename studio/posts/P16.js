// ============================================================================
// P16 v2 · reel · Black Friday 2/3: "Two sizes fit. Which one?"
// Review 26.10 (Maciej): when two sizes fit well, say when to go smaller and when bigger — handling, comfort, position.
// Sources (Geomo algorithm @ bikefit 91aad78, bikes-backup-2026-10-25T19-12-31-744Z, computed 26.10.2026):
//   Rider 178 cm, inseam 84 cm, typical flexibility, balanced; Canyon Grail CF / CF SLX / CFR (Gen 3), Gravel race.
//   As sold (80 mm stems): S 93%, M 96%. Best stem: S + 90 mm 98% (spacers 32 mm), M + 70 mm 98% (spacers 19 mm),
//   both with the bars at 627 / 465–467 mm. Wheelbase S 1039, M 1062 mm. Frame S 558/394, M 575/411.
//   "Size down / size up" guidance: general geometry knowledge (shorter wheelbase = quicker, longer = steadier; spacers = room to
//   lower the bars), not a fit-score claim.
// ============================================================================
(function () {
  var CODE = 'P16';
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)', C1 = 'var(--series-1)', C2 = 'var(--series-2)';
  var card = function (size, fit, stem, col) {
    return h('div', { className: 'p16-card', style: { display: 'grid', gap: 6, borderTop: '6px solid ' + col, paddingTop: 20 } },
      h('b', { style: Object.assign(DISP(800, 120, 75), { color: col }) }, size),
      h('b', { className: 'p16-fit', style: Object.assign(DISP(800, 84, 75), { color: 'var(--ig-good)' }) }, fit + '%'),
      h('span', { style: Object.assign(DISP(650, 38, 85), { color: INK }) }, stem));
  };
  var list = function (items, col) {
    return h('div', { className: 'p16-list', style: { display: 'grid', gap: 22, marginTop: 60 } }, items.map(function (t, i) {
      return h('div', { key: i, className: 'p16-item', style: { display: 'grid', gap: 6, borderTop: '3px solid var(--s-line)', paddingTop: 18 } },
        h('b', { style: Object.assign(DISP(800, 54, 80), { color: INK }) }, t[0]),
        h('span', { style: Object.assign(DISP(650, 38, 85), { color: col }) }, t[1]));
    }));
  };
  var note = function (s) { return h('p', { className: 'gs-caption', style: { fontSize: 38, marginTop: 40 } }, s); };

  SETS[CODE] = [
    h(G.Slide, { key: 1, format: 'reel', tone: 'navy', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Black Friday · between sizes'), h(G.Hook, { size: 132 }, 'Two sizes fit.\n*Which one?*'),
        h('p', { className: 'p16-sub', style: Object.assign(DISP(650, 52, 85), { margin: '30px 0 0', color: 'var(--s-fg)' }) }, 'Smaller or bigger isn’t a guess.')),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 2, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Canyon Grail Gen 3 · rider 178 cm'), h(G.Hook, { size: 104 }, 'S or M?\n*Both work.*')),
      h('div', { className: 'p16-photo', style: { display: 'grid', gap: 6, marginTop: 40 } }, h('img', { src: 'grail3-ride.jpg', style: { width: 936, height: 420, objectFit: 'cover', display: 'block' } }),
        h('span', { style: { fontFamily: 'var(--font-display)', fontSize: 22, color: MUTED } }, 'Canyon Grail Gen 3 · photo: Canyon')),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 40 } },
        card('S', 98, 'with a 90 mm stem', C2), card('M', 98, 'with a 70 mm stem', C1)),
      note('Rider: 178 cm, inseam 84 cm, typical flexibility, balanced position. Same bar position. As sold (80 mm stems): S 93%, M 96%. Fit from Geomo.'),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 3, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Go smaller if…'), h(G.Hook, { size: 112 }, 'Size down *(S)*')),
      list([['You like quick, playful handling', 'Wheelbase 23 mm shorter (1039 vs 1062)'], ['You want to ride lower later', '32 mm of spacers to remove (M: 19)'], ['You ride twisty, tight trails', 'A shorter bike turns in faster']], C2),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 4, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Go bigger if…'), h(G.Hook, { size: 112 }, 'Size up *(M)*')),
      list([['You want a calm, steady ride', 'Longer wheelbase, less twitchy at speed'], ['Long days, bags, rough roads', 'More room on the bike, steadier when loaded'], ['You don’t want a tall spacer stack', 'Same bar height with 13 mm fewer spacers']], C1),
      h('div', { style: { flex: 1 } })),
    h(G.Slide, { key: 5, format: 'reel', tone: 'paper', footer: false },
      h('div', { className: 'gs-stack' }, h(G.Kicker, null, 'Before you pay'), h(G.Hook, { size: 112 }, 'Same score?\n*Pick by how you ride.*'),
        h('p', { className: 'p16-sub', style: Object.assign(DISP(650, 48, 85), { margin: '40px 0 0', color: INK, lineHeight: 1.25 }) }, 'Geomo shows both sizes, the stem each one needs and how they differ. About a minute.')),
      h('div', { style: { flex: 1 } })),
    h(G.ReelEndCard, { key: 6, line: 'Two sizes fit? Pick the one that rides like you do.', cta: 'Free · link in bio' })
  ];

  CHOREO[CODE] = [
    function (r) { M.fadeUp(M.q(r, '.p16-sub'), 1200, 900); return 3400; },
    function (r) { M.fadeUp(M.q(r, '.p16-photo'), 200, 900); M.qa(r, '.p16-card').forEach(function (c, i) { M.fadeUp(c, 900 + i * 500, 800); M.count(M.q(c, '.p16-fit'), 1100 + i * 500, 1100); }); M.caption(r, 2700); return 6200; },
    function (r) { M.qa(r, '.p16-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 700, 800); }); return 5400; },
    function (r) { M.qa(r, '.p16-item').forEach(function (x, i) { M.fadeUp(x, 400 + i * 700, 800); }); return 5400; },
    function (r) { M.fadeUp(M.q(r, '.p16-sub'), 900, 900); return 4200; },
    function (r) { M.qa(r, '.gs-body > *, .gs-stack > *').forEach(function (x, i) { if (i < 6) M.fadeUp(x, 200 + i * 220, 900); }); return 3600; }
  ];
})();
