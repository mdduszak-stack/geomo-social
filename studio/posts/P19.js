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
// Named on slides 2, 3, 5 (Maciej asked for names of the extremes): Colnago G3-X 49 (554/380, 100 mm stem, 34 mm spacers → hands 627/460, fit 97),
//   Polygon Bend R L (621/396, 50 mm stem, 10 mm spacers → 661/435, fit 56), Marin Gestalt 54 (reach 377), Canyon Grail Gen 3 M (reach 411).
//   Frame drawings: schematic (seat tube height and fork not from data), stack/reach/angles/head tube/chainstay/BB drop from the database.
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
        h('text', { x: X(TARGET.r + 15), y: Y(TARGET.s - 10) + 34, textAnchor: 'end', style: { font: '700 28px var(--font-display)', fill: MEAS, paintOrder: 'stroke', stroke: 'var(--ig-paper, #F4F1EA)', strokeWidth: 8 } }, 'his target')));
    }
    els.push(h('g', { key: 'B', className: 'p19-bars' }, bars));
    (props.named || []).forEach(function (n, i) {
      els.push(h('g', { key: 'nm' + i, className: 'p19-named' }, h('circle', { cx: X(n.x), cy: Y(n.y), r: 13, fill: 'none', stroke: INK, strokeWidth: 3 }),
        h('text', { x: X(n.x) + n.dx, y: Y(n.y) + n.dy, textAnchor: n.a, style: { font: '700 26px var(--font-display)', fill: INK, paintOrder: 'stroke', stroke: 'var(--s-bg, #f5f3ee)', strokeWidth: 8, strokeLinejoin: 'round' } }, n.t)));
    });
    (props.notes || []).forEach(function (n, i) {
      els.push(h('text', { key: 'n' + i, className: 'p19-note', x: X(n.x), y: Y(n.y), textAnchor: n.a || 'start', style: { font: '700 30px var(--font-display)', fill: n.c || INK } }, n.t));
    });
    return h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, className: 'p19-map', style: { display: 'block', overflow: 'visible' } }, els);
  }
  var legend = function (items) { return h('div', { className: 'gs-legend', style: { display: 'flex', gap: 34, flexWrap: 'wrap', marginTop: 10 } }, items.map(function (it) {
    return h('span', { key: it[0], style: { display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: INK } },
      h('span', { style: { width: 22, height: 22, borderRadius: 11, background: it[1], display: 'inline-block' } }), it[0]); })); };

  // ---------- named extremes (frame of the size Geomo picks for this rider; geometry from the database) ----------
  var LOW = { name: 'Colnago G3-X', size: '49', stack: 554, reach: 380, hta: 71.5, sta: 74, chainstay: 430, bbDrop: 70, headTube: 122, stem: 100, spacers: 34, bar: [627, 460], fit: 97 };
  var HIGH = { name: 'Polygon Bend R', size: 'L', stack: 621, reach: 396, hta: 70.5, sta: 73.5, chainstay: 440, bbDrop: 72, headTube: 200, stem: 50, spacers: 10, bar: [661, 435], fit: 56 };
  var NAMED = [{ x: 380, y: 554, t: 'Colnago G3-X 49', a: 'start', dx: 14, dy: 34 }, { x: 396, y: 621, t: 'Polygon Bend R L', a: 'start', dx: 16, dy: 8 },
               { x: 377, y: 582, t: 'Marin Gestalt 54', a: 'start', dx: -6, dy: -18 }, { x: 411, y: 575, t: 'Canyon Grail Gen 3 M', a: 'end', dx: 0, dy: 40 }];

  // schematic side view of the frame front + optional cockpit; everything from stack/reach/angles/lengths in the database
  function Frames(props) {
    var bikes = props.bikes, W = props.width || 936, Hh = props.height || 620, cock = props.cockpit;
    var r = function (d) { return d * Math.PI / 180; };
    var x0 = props.x0 != null ? props.x0 : -470, x1 = props.x1 != null ? props.x1 : 520, y0 = props.y0 != null ? props.y0 : -40, y1 = props.y1 != null ? props.y1 : 700;
    var k = Math.min(W / (x1 - x0), Hh / (y1 - y0));
    var X = function (v) { return (v - x0) * k; }, Y = function (v) { return Hh - (v - y0) * k; };
    var els = [h('line', { key: 'g', x1: 0, x2: W, y1: Y(0), y2: Y(0), stroke: LINE, strokeWidth: 2 })];
    bikes.forEach(function (b, i) {
      var col = i === 0 ? FRAME : BAR, sw = 10, dx = -Math.cos(r(b.hta)), dy = Math.sin(r(b.hta));
      var H = [b.reach, b.stack], Hb = [H[0] - dx * b.headTube, H[1] - dy * b.headTube];
      var ra = [-Math.sqrt(b.chainstay * b.chainstay - b.bbDrop * b.bbDrop), b.bbDrop];
      var st = [-Math.cos(r(b.sta)), Math.sin(r(b.sta))], seatH = b.stack - 30, seat = [st[0] * seatH / st[1], seatH];
      var fork = [Hb[0] + (Hb[1] - b.bbDrop) / dy * -dx, b.bbDrop];
      var L = function (p, q, extra) { return h('line', Object.assign({ x1: X(p[0]), y1: Y(p[1]), x2: X(q[0]), y2: Y(q[1]), stroke: col, strokeWidth: sw, strokeLinecap: 'round' }, extra || {})); };
      var g = [L([0, 0], ra), L(ra, seat), L([0, 0], seat), L(seat, [H[0] - dx * 25, H[1] - dy * 25]), L([0, 0], Hb), L(Hb, H, { strokeWidth: 16 }), L(Hb, fork, { strokeDasharray: '3 14', strokeWidth: 6 })];
      g.push(h('circle', { cx: X(H[0]), cy: Y(H[1]), r: 12, fill: MEAS }));
      if (cock) {
        var u = b.spacers + 20, clamp = [H[0] + dx * u, H[1] + dy * u], a = r((90 - b.hta) - 6), bar = [clamp[0] + b.stem * Math.cos(a), clamp[1] + b.stem * Math.sin(a)];
        g.push(L(H, clamp, { stroke: INK, strokeWidth: 14 }), L(clamp, bar, { stroke: INK, strokeWidth: 12 }), h('circle', { cx: X(bar[0]), cy: Y(bar[1]), r: 18, fill: 'none', stroke: col, strokeWidth: 8 }));
      }
      els.push(h('g', { key: 'b' + i, className: 'p19-frame p19-frame-' + i }, g));
    });
    els.push(h('circle', { key: 'bb', cx: X(0), cy: Y(0), r: 12, fill: INK }));
    (props.labels || []).forEach(function (l, i) { els.push(h('text', { key: 'l' + i, className: 'p19-lab', x: X(l.x) + (l.dx || 0), y: Y(l.y) + (l.dy || 0), textAnchor: l.a || 'start', style: { font: '700 ' + (l.s || 30) + 'px var(--font-display)', fill: l.c || INK, paintOrder: 'stroke', stroke: 'var(--s-bg, #f5f3ee)', strokeWidth: 8, strokeLinejoin: 'round' } }, l.t)); });
    if (props.target) els.push(h('g', { key: 'tg', className: 'p19-tg' }, h('circle', { cx: X(TARGET.r), cy: Y(TARGET.s), r: 30, fill: 'none', stroke: MEAS, strokeWidth: 4, strokeDasharray: '8 7' }),
      h('text', { x: X(TARGET.r) + 44, y: Y(TARGET.s) + 10, textAnchor: 'start', style: { font: '700 28px var(--font-display)', fill: MEAS, paintOrder: 'stroke', stroke: 'var(--s-bg, #f5f3ee)', strokeWidth: 8, strokeLinejoin: 'round' } }, 'target')));
    return h('svg', { width: W, height: Hh, viewBox: '0 0 ' + W + ' ' + Hh, className: 'p19-frames', style: { display: 'block', overflow: 'hidden' } }, els);
  }

  var total = 8;
  SETS[CODE] = withSeries('Gravel size map', [
    h(G.CoverSlide, { key: 1, page: 1, total: total, kicker: 'Gravel size map', title: '81 gravel bikes.\n*One 178 cm rider.*', sub: 'Where do his hands end up? Swipe →',
      art: h(Map, { mode: 'frames', width: 900, height: 560, x0: 370, x1: 420, y0: 545, y1: 630 }) }),
    h(G.ContentSlide, { key: 2, page: 2, total: total, kicker: '1 · How to read it', title: 'Up = taller front.\nRight = longer.',
      art: h(Map, { mode: 'frames', width: 936, height: 600, x0: 370, x1: 420, y0: 545, y1: 630, named: NAMED, notes: [{ x: 371, y: 627, t: '↑ more upright' }, { x: 419, y: 547, t: 'more stretched →', a: 'end' }] }),
      note: 'Each dot is one bike, in the size Geomo picks for this rider (178 cm, inseam 84 cm, typical flexibility, balanced). Frame stack and reach.', artFirst: true }),
    h(G.ContentSlide, { key: 3, page: 3, total: total, kicker: '2 · The frames', title: '67 mm apart\nin height.',
      art: h('div', { style: { position: 'relative' } }, h('div', { className: 'p19-ghost', style: { position: 'absolute', left: 0, top: 0, opacity: 0 } }, h(Map, { mode: 'frames', width: 936, height: 600, x0: 370, x1: 420, y0: 545, y1: 630, named: [NAMED[0], NAMED[1]] })), h(Frames, { bikes: [LOW, HIGH], width: 936, height: 600, labels: [{ x: LOW.reach, y: LOW.stack, t: 'Colnago G3-X 49 · 554 / 380', dx: -30, dy: 92, c: FRAME, a: 'end' }, { x: HIGH.reach, y: HIGH.stack, t: 'Polygon Bend R L · 621 / 396', dx: -30, dy: -24, c: BAR, a: 'end' }] })),
      note: 'Lowest and highest frame on the map, drawn to scale from the bottom bracket (the red dot is the top of the head tube). All 81: stack 554–621 mm, reach 377–411 mm.', artFirst: true }),
    h(G.ContentSlide, { key: 4, page: 4, total: total, kicker: '3 · Add stem and spacers', title: 'Most hands land\nin the same spot.',
      art: h('div', null, h(Map, { mode: 'move', width: 936, height: 580 }), legend([['Frame', FRAME], ['Hands, factory stem', BAR]])),
      note: '58 of 81 put his hands within 10 mm (height) and 15 mm (reach) of his target.', artFirst: true }),
    h(G.ContentSlide, { key: 5, page: 5, total: total, kicker: '4 · The two extremes', title: 'One gets there.\nOne can’t.',
      art: h('div', { style: { position: 'relative' } }, h('div', { className: 'p19-ghost', style: { position: 'absolute', left: 0, top: 0, opacity: 0 } }, h(Map, { mode: 'move', width: 936, height: 540, named: [{ x: 460, y: 627, t: 'Colnago G3-X 49', a: 'end', dx: -20, dy: 50 }, { x: 435, y: 661, t: 'Polygon Bend R L', a: 'end', dx: -20, dy: -16 }] })), h(Frames, { bikes: [LOW, HIGH], cockpit: true, target: true, width: 936, height: 540, x0: 200, x1: 620, y0: 470, y1: 720,
        labels: [] }), legend([['Colnago G3-X 49: hands 627 / 460 · fit 97%', FRAME], ['Polygon Bend R L: 661 / 435 · fit 56%', BAR]])),
      note: 'Colnago: 100 mm stem, 34 mm of spacers. Polygon: 50 mm stem and the lowest setting, and the bars still sit 34 mm too high and 33 mm too close.', artFirst: true }),
    h(G.ContentSlide, { key: 6, page: 6, total: total, kicker: '5 · Fit', title: '77 of 81 fit him\n85% or better.',
      art: h('div', null, h(Map, { mode: 'fit', width: 936, height: 580, x0: 430, x1: 490, y0: 615, y1: 670 }), legend([['Fit 85%+', 'var(--ig-good)'], ['Below 85%', 'var(--ig-bad)']])),
      note: '4 don’t: 3 are too high at the front, 1 is too short. Fine for other bodies.', artFirst: true }),
    h(G.ContentSlide, { key: 7, page: 7, total: total, kicker: '6 · What it means', title: 'Pick the size first.\nThen the bike.',
      art: h('div', { className: 'p19-why', style: { display: 'grid', gap: 30, width: '100%' } },
        [['The size matters more than the brand', 'Most gravel bikes can fit you, in the right size.'],
         ['Some frames just don’t suit your body', 'Too tall or too short at the front. Check before you buy.'],
         ['The stem does the fine-tuning', 'On these bikes the factory stem runs from 50 to 103 mm.']].map(function (r, i) {
          return h('div', { key: i, style: { display: 'grid', gap: 6, borderTop: '3px solid var(--s-line)', paddingTop: 18 } },
            h('b', { style: Object.assign(DISP(800, 48, 80), { color: INK }) }, r[0]), h('span', { style: SERIF(36) }, r[1]));
        })),
      note: 'Your map looks different: a different height, inseam or flexibility moves the target.', artFirst: true }),
    h(G.CTASlide, { key: 8, page: 8, total: total, title: 'Find where your hands should be, then the bikes that get them there.', sub: 'Free · no account · about a minute', actions: CTA_ACT })
  ]);

  // ---------- motion ----------
  var rnd = (function () { var x = 7; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; })();
  function dotsIn(svg, sel, t, span) { M.qa(svg, sel).forEach(function (c) { var d = t + rnd() * span;
    M.add(c, [{ opacity: 0, transform: 'scale(0.2)' }, { opacity: 0.85, transform: 'scale(1)' }], d, 700); c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center'; }); }
  function axes(svg, t) { M.qa(svg, ':scope > g > line, :scope > g > text, :scope > text').forEach(function (e) { M.fade(e, t, 600); }); }
  function framesDraw(svg, t) { var end = t; M.qa(svg, '.p19-frame').forEach(function (g, i) {
      M.qa(g, 'line').forEach(function (l) { M.drawPath(l, t + i * 500, 1300); }); M.qa(g, 'circle').forEach(function (c) { M.fade(c, t + i * 500 + 1100, 500); }); end = t + i * 500 + 1600; });
    M.qa(svg, '.p19-lab, .p19-tg').forEach(function (e, i) { M.fade(e, end + i * 250, 600); }); return end + 800; }
  function ghostOut(r, t) { var gh = M.q(r, '.p19-ghost'); if (!gh) return; var svg = M.q(gh, 'svg');
    M.add(gh, [{ opacity: 1 }, { opacity: 1 }], 0, t); M.add(gh, [{ opacity: 1 }, { opacity: 0 }], t, 900);
    M.qa(svg, '.p19-named').forEach(function (n, i) { M.fade(n, 200 + i * 200, 500); }); }
  CHOREO[CODE] = [
    function (r) { var svg = M.q(r, 'svg.p19-map'); axes(svg, 300); dotsIn(svg, '.p19-f', 500, 2200); return 4600; },
    function (r) { var svg = M.q(r, 'svg.p19-map'); axes(svg, 0); dotsIn(svg, '.p19-f', 200, 1400);
      M.qa(svg, '.p19-named').forEach(function (n, i) { M.fade(n, 1900 + i * 350, 600); }); M.qa(svg, '.p19-note').forEach(function (n, i) { M.fade(n, 1400 + i * 300, 600); });
      M.caption(r, 3300); return 6200; },
    function (r) { ghostOut(r, 1500); var e = framesDraw(M.q(r, 'svg.p19-frames'), 2000); M.caption(r, e); return e + 2600; },
    function (r) { var svg = M.q(r, 'svg.p19-map'); axes(svg, 0); dotsIn(svg, '.p19-f', 100, 900);
      M.qa(svg, '.p19-a').forEach(function (l, i) { var len = l.getTotalLength(); l.style.strokeDasharray = len + ' ' + len; M.add(l, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 1300 + (i % 20) * 40, 1100); }); dotsIn(svg, '.p19-b', 2300, 900);
      M.qa(svg, '.p19-target').forEach(function (g) { M.fade(g, 3300, 700); }); M.fade(M.q(r, '.gs-legend'), 3500, 700); M.caption(r, 3900); return 6600; },
    function (r) { ghostOut(r, 1500); var e = framesDraw(M.q(r, 'svg.p19-frames'), 2000); M.fade(M.q(r, '.gs-legend'), e, 700); M.caption(r, e + 400); return e + 3200; },
    function (r) { var svg = M.q(r, 'svg.p19-map'); axes(svg, 0); M.qa(svg, '.p19-target').forEach(function (g) { M.fade(g, 300, 600); });
      dotsIn(svg, '.p19-b:not(.p19-bad)', 600, 1400); dotsIn(svg, '.p19-bad', 2400, 400); M.fade(M.q(r, '.gs-legend'), 2800, 700); M.caption(r, 3200); return 6000; },
    function (r) { M.qa(r, '.p19-why > div').forEach(function (d, i) { M.fadeUp(d, 300 + i * 450, 900); }); M.caption(r, 1900); return 5200; },
    function (r) { M.ctaRows(r, 400); return 4600; }
  ];
})();
