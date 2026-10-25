// ============================================================================
// P19 · carousel · "Gravel size map: 81 bikes, one 178 cm rider"  (filar: Which size? · save magnet)
// Sources (computed 25.10.2026): Geomo algorithm (supabase/functions/_shared/algorithms.ts @ bikefit 91aad78),
// bikes-backup-2026-10-25T19-12-31-744Z, all 81 gravel presets (Gravel, Gravel race, Gravel adventure, Gravel aero,
// Aero gravel, Gravel steel, Gravel Titanium, CX race, Adventure tour).
// Rider: 178 cm, inseam 84 cm, typical flexibility (3/3/3/3), balanced. For each bike: the size Geomo picks for him,
// as sold (factory stem), spacers chosen by Geomo. Handlebar target for this body: 627 / 468 mm (stack / reach of the bar).
//   Frame stack 554–621 mm (67 mm), frame reach 377–411 mm (34 mm).
//   Handlebar with factory stem: 58 of 81 within 10 mm (height) and 15 mm (reach) of the target.
//   Fit ≥ 85 %: 77 of 81. Below: 3 too high at the front (handlebar 655–662 mm even with no extra spacers), 1 too short (444 mm).
//   Factory stems in this set: 50–103 mm.
// POINTS: [frame stack, frame reach, handlebar stack, handlebar reach, fit %] (no names; the database stays private).
// ============================================================================
(function () {
  var CODE = 'P19';
  var POINTS = [[554,380,627,460,97],[554,391,625,462,97],[554,391,627,472,99],[555,394,625,460,95],[555,394,627,463,99],[555,399,625,465,98],[558,396,627,478,96],[560,388,627,460,97],[560,388,627,460,97],[560,389,627,471,100],[560,392,627,464,99],[561,394,627,455,93],[561,394,627,477,97],[563,380,627,463,99],[564,394,627,456,94],[564.9,383,627,456,95],[565,393,627,477,96],[567,385,627,459,97],[569,387,627,451,89],[571,395,627,455,93],[571,403,627,468,100],[571,406,627,482,92],[572,393,627,469,100],[573,398,627,461,98],[574,383,636,444,76],[574.8,385,627,476,97],[575,385,627,472,99],[575,385,643,456,91],[575,400,627,476,97],[575,411,627,477,96],[576,390,627,455,93],[576,395,627,472,99],[576,405,627,460,97],[577,399,627,466,99],[579,391,627,459,96],[579,393,628,472,98],[580,394,627,461,98],[580,397,627,464,98],[580,397,627,476,96],[580,400,631,477,93],[580,406,627,473,98],[580,410,627,466,99],[580.6,396,629,475,96],[582,377,630,455,93],[582,382,628,450,86],[582.5,380,630,458,95],[583,387,632,476,93],[583,395,632,472,95],[583.2,384,633,463,97],[583.4,396,632,474,95],[584,392,633,470,96],[584,397,630,465,98],[586,382,634,463,96],[587,384,636,465,95],[587,397,633,466,97],[588,389,633,453,90],[588,402,636,469,94],[589,390,655,462,81],[589,391,634,460,95],[590,380,638,448,85],[590,385,637,454,91],[590,385,637,464,95],[591,385,635,453,90],[591,401,638,470,93],[591,411,635,470,95],[592,382,640,460,93],[592,405,639,473,91],[593,381,641,459,93],[593,383,639,451,88],[593,398,640,467,93],[596,395,643,463,92],[596,404,638,453,89],[597,383,646,461,91],[598,379,644,450,86],[599,392,647,471,87],[600,394,646,465,90],[601,406,644,454,90],[602,391,642,461,93],[605,398,650,456,87],[618,403,662,462,73],[621,396,661,435,56]];
  var TARGET = { s: 627, r: 468 };
  var INK = 'var(--s-fg)', MUTED = 'var(--s-muted)', LINE = 'var(--s-line)', FRAME = 'var(--series-1)', BAR = 'var(--series-2)', MEAS = 'var(--s-measure)';

  // ---------- scatter: x = reach, y = stack, both measured from the bottom bracket ----------
  // mode: 'frames' | 'move' (frames + arrows + bars) | 'bars' | 'fit'
  function Map(props) {
    var W = props.width || 936, H = props.height || 760, m = { l: 96, r: 24, t: 24, b: 84 };
    var x0 = props.x0 || 370, x1 = props.x1 || 490, y0 = props.y0 || 545, y1 = props.y1 || 670;
    var X = function (v) { return m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r); };
    var Y = function (v) { return H - m.b - (v - y0) / (y1 - y0) * (H - m.t - m.b); };
    var els = [], mode = props.mode;
    for (var gx = Math.ceil(x0 / 20) * 20; gx <= x1; gx += 20) els.push(h('g', { key: 'gx' + gx }, h('line', { x1: X(gx), x2: X(gx), y1: m.t, y2: H - m.b, stroke: LINE, strokeWidth: 2 }), h('text', { x: X(gx), y: H - m.b + 40, textAnchor: 'middle', style: { font: '600 26px var(--font-display)', fill: MUTED } }, gx)));
    for (var gy = Math.ceil(y0 / 20) * 20; gy <= y1; gy += 20) els.push(h('g', { key: 'gy' + gy }, h('line', { x1: m.l, x2: W - m.r, y1: Y(gy), y2: Y(gy), stroke: LINE, strokeWidth: 2 }), h('text', { x: m.l - 14, y: Y(gy) + 9, textAnchor: 'end', style: { font: '600 26px var(--font-display)', fill: MUTED } }, gy)));
    els.push(h('text', { key: 'ax', x: W - m.r, y: H - 8, textAnchor: 'end', style: { font: '700 28px var(--font-display)', fill: INK } }, 'Reach, mm →'));
    els.push(h('text', { key: 'ay', x: 0, y: 0, transform: 'translate(26,' + (m.t + 6) + ') rotate(-90)', textAnchor: 'end', style: { font: '700 28px var(--font-display)', fill: INK } }, 'Stack, mm →'));
    var frames = [], arrows = [], bars = [];
    POINTS.forEach(function (p, i) {
      var bad = p[4] < 85;
      if (mode !== 'bars' && mode !== 'fit') frames.push(h('circle', { key: 'f' + i, className: 'p19-f', cx: X(p[1]), cy: Y(p[0]), r: 9, fill: FRAME, opacity: 0.85 }));
      if (mode === 'move') arrows.push(h('line', { key: 'a' + i, className: 'p19-a', x1: X(p[1]), y1: Y(p[0]), x2: X(p[3]), y2: Y(p[2]), stroke: MUTED, strokeWidth: 2, opacity: 0.35 }));
      if (mode === 'move' || mode === 'bars' || mode === 'fit') bars.push(h('circle', { key: 'b' + i, className: 'p19-b' + (bad ? ' p19-bad' : ''), cx: X(p[3]), cy: Y(p[2]), r: 9,
        fill: mode === 'fit' ? (bad ? 'var(--ig-bad)' : 'var(--ig-good)') : BAR, opacity: 0.85 }));
    });
    els.push(h('g', { key: 'A', className: 'p19-arrows' }, arrows), h('g', { key: 'F', className: 'p19-frames' }, frames));
    if (mode !== 'frames') {
      els.push(h('g', { key: 'T', className: 'p19-target' },
        h('rect', { x: X(TARGET.r - 15), y: Y(TARGET.s + 10), width: X(TARGET.r + 15) - X(TARGET.r - 15), height: Y(TARGET.s - 10) - Y(TARGET.s + 10), fill: 'none', stroke: MEAS, strokeWidth: 4, strokeDasharray: '10 8' }),
        h('text', { x: X(TARGET.r + 15) + 12, y: Y(TARGET.s - 10) + 8, style: { font: '700 28px var(--font-display)', fill: MEAS } }, 'his target')));
    }
    els.push(h('g', { key: 'B', className: 'p19-bars' }, bars));
    (props.notes || []).forEach(function (n, i) {
      els.push(h('text', { key: 'n' + i, className: 'p19-note', x: X(n.x), y: Y(n.y), textAnchor: n.a || 'start', style: { font: '700 30px var(--font-display)', fill: n.c || INK } }, n.t));
    });
    return h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, className: 'p19-map', style: { display: 'block', overflow: 'visible' } }, els);
  }
  var legend = function (items) { return h('div', { className: 'gs-legend', style: { display: 'flex', gap: 34, flexWrap: 'wrap', marginTop: 10 } }, items.map(function (it) {
    return h('span', { key: it[0], style: { display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: INK } },
      h('span', { style: { width: 22, height: 22, borderRadius: 11, background: it[1], display: 'inline-block' } }), it[0]); })); };

  var total = 7;
  SETS[CODE] = withSeries('Gravel size map', [
    h(G.CoverSlide, { key: 1, page: 1, total: total, kicker: 'Gravel size map', title: '81 gravel bikes.\n*One 178 cm rider.*', sub: 'Where do his hands end up? Swipe →',
      art: h(Map, { mode: 'frames', width: 900, height: 560, x0: 370, x1: 420, y0: 545, y1: 630 }) }),
    h(G.ContentSlide, { key: 2, page: 2, total: total, kicker: '1 · How to read it', title: 'Up = taller front.\nRight = longer.',
      art: h(Map, { mode: 'frames', width: 936, height: 600, x0: 370, x1: 420, y0: 545, y1: 630, notes: [{ x: 371, y: 625, t: '↑ more upright' }, { x: 419, y: 549, t: 'more stretched →', a: 'end' }] }),
      note: 'Each dot is one bike, in the size Geomo picks for this rider (178 cm, inseam 84 cm, typical flexibility). Stack and reach of the frame, from the bottom bracket.', artFirst: true }),
    h(G.ContentSlide, { key: 3, page: 3, total: total, kicker: '2 · The frames', title: '67 mm apart in height.\n34 mm in length.',
      art: h('div', null, h(Map, { mode: 'frames', width: 936, height: 600, x0: 370, x1: 420, y0: 545, y1: 630 }), legend([['Frame (top of the head tube)', FRAME]])),
      note: 'Frame stack 554–621 mm, reach 377–411 mm. Same rider, same kind of bike.', artFirst: true }),
    h(G.ContentSlide, { key: 4, page: 4, total: total, kicker: '3 · Add stem and spacers', title: 'The hands land\nin the same spot.',
      art: h('div', null, h(Map, { mode: 'move', width: 936, height: 580 }), legend([['Frame', FRAME], ['Hands, factory stem', BAR]])),
      note: '58 of 81 put his hands within 10 mm (height) and 15 mm (reach) of his target.', artFirst: true }),
    h(G.ContentSlide, { key: 5, page: 5, total: total, kicker: '4 · Fit', title: '77 of 81 fit him\n85% or better.',
      art: h('div', null, h(Map, { mode: 'fit', width: 936, height: 580, x0: 430, x1: 490, y0: 615, y1: 670 }), legend([['Fit 85%+', 'var(--ig-good)'], ['Below 85%', 'var(--ig-bad)']])),
      note: '4 don’t: 3 are too high at the front, 1 is too short. Fine for other bodies.', artFirst: true }),
    h(G.ContentSlide, { key: 6, page: 6, total: total, kicker: '5 · What it means', title: 'Pick the size first.\nThen the bike.',
      art: h('div', { className: 'p19-why', style: { display: 'grid', gap: 30, width: '100%' } },
        [['The size matters more than the brand', 'Most gravel bikes can fit you, in the right size.'],
         ['Some frames just don’t suit your body', 'Too tall or too short at the front. Check before you buy.'],
         ['The stem does the fine-tuning', 'On these bikes the factory stem runs from 50 to 103 mm.']].map(function (r, i) {
          return h('div', { key: i, style: { display: 'grid', gap: 6, borderTop: '3px solid var(--s-line)', paddingTop: 18 } },
            h('b', { style: Object.assign(DISP(800, 48, 80), { color: INK }) }, r[0]), h('span', { style: SERIF(36) }, r[1]));
        })),
      note: 'Your map looks different: a different height, inseam or flexibility moves the target.', artFirst: true }),
    h(G.CTASlide, { key: 7, page: 7, total: total, title: 'Find where your hands should be, then the bikes that get them there.', sub: 'Free · no account · about a minute', actions: CTA_ACT })
  ]);

  CHOREO[CODE] = [];
})();
