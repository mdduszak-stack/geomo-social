// ============================================================================
// POST TEMPLATE · copy to posts/<CODE>.js (e.g. P08.js) and fill in.
// Content (TEXT, numbers) on top, slides in the middle, motion at the bottom.
// Static preview:  node studio/make.js <CODE> png     Motion: node studio/make.js <CODE> mp4
// Helpers from engine/core.js: G (design system components), h, F, clone, withSeries, DISP, SERIF, lab, kick,
// ring, CTA_ACT, G.BIKES, G.BikeDrawing, G.ContentSlide, G.CTASlide, Cockpit, GroundPair ...
// Motion helpers (engine/motion.js): M.fade, M.fadeUp, M.grow, M.drawPath, M.count, M.bike, M.rider, M.icon,
// M.ring, M.ctaRows, M.caption, M.titleIn, M.cockpit, M.q, M.qa
// ============================================================================
(function () {
  var CODE = 'PXX';

  // ---- 1. CONTENT: every number with its source -----------------------------------------------
  var TEXT = {
    series: 'Geometry 101',
    cover: { kicker: 'Geometry 101 · Part 4', title: 'Your hook question here?', sub: 'Swipe →' },
    // ...
  };
  // Sources: bikes-backup-YYYY-MM-DD (stack/reach/...), geomo.app (handlebar numbers, profile ...).

  // ---- 2. SLIDES -------------------------------------------------------------------------------
  var total = 2;
  SETS[CODE] = withSeries(TEXT.series, [
    h(G.CoverSlide || G.ContentSlide, { key: 1, page: 1, total: total, kicker: TEXT.cover.kicker, title: TEXT.cover.title }),
    h(G.CTASlide, { key: 2, page: 2, total: total, title: 'Check yours before you buy.', sub: 'Free · no account · about a minute', actions: CTA_ACT })
  ]);

  // ---- 3. MOTION (one function per slide, returns total duration in ms) -------------------------
  CHOREO[CODE] = [
    function (r) { M.fadeUp(M.q(r, '.gs-art'), 300); return 3500; },
    function (r) { M.ctaRows(r, 400); return 4600; }
  ];
})();
