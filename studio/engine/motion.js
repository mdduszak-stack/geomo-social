// Geomo carousel motion — deterministic timeline for frame capture.
// Style: calm and fluid, like the geomo.app landing page (Apple-like). Lines draw over 1.3 s with
// cubic-bezier(.45,0,.2,1); everything else eases out on cubic-bezier(.22,1,.36,1); numbers count up with
// ease-out-expo; overlapping staggers instead of hard steps. Headline, header and title block are static from frame 0.
(function () {
  var EASE_OUT = 'cubic-bezier(.22,1,.36,1)';   // landing: dot slide, fades
  var DRAW = 'cubic-bezier(.45,0,.2,1)';        // landing: lp-draw
  var counters = [];
  function q(root, s) { return root.querySelector(s); }
  function qa(root, s) { return Array.prototype.slice.call(root.querySelectorAll(s)); }
  function add(el, kf, t, dur, easing) {
    if (!el) return;
    var a = el.animate(kf, { delay: t, duration: dur, easing: easing || EASE_OUT, fill: 'both' }); a.pause();
  }
  function fade(el, t, dur) { add(el, [{ opacity: 0 }, { opacity: 1 }], t, dur || 600, 'ease'); }
  function fadeUp(el, t, dur) {
    if (!el) return;
    if (el instanceof SVGElement) return fade(el, t, dur);
    add(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], t, dur || 900);
  }
  function grow(el, t, dur) { if (!el) return; el.style.transformOrigin = 'left center'; add(el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], t, dur || 1200); }
  function drawPath(p, t, dur, easing) {
    var len = p.getTotalLength ? p.getTotalLength() : 0; if (!len) return fade(p, t, dur);
    p.style.strokeDasharray = len + ' ' + len;
    add(p, [{ opacity: 0 }, { opacity: 1 }], t, 350, 'ease-out');   // soft start: no hard dots from round caps
    add(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], t, dur || 1300, easing || DRAW);
  }
  function count(el, t, dur) {
    if (!el) return;
    var txt = el.textContent, m = txt.match(/^(\D*)(\d+)(.*)$/); if (!m) return fade(el, t, dur);
    counters.push({ el: el, pre: m[1], to: +m[2], post: m[3], t: t, dur: dur || 1400 });
  }
  // Bike drawing, the way the landing page draws its comparison: every tube of a bike starts at the same moment
  // and unrolls from the bottom bracket side over 1.3 s; wheels draw with it; overlays start 0.4 s apart.
  // Labels (dimensions, callouts, legend text) fade in 0.5 s, 0.9 s after their group starts.
  function seg(tpl, d) { var p = tpl.cloneNode(false); p.setAttribute('d', d); p.removeAttribute('pathLength'); p.removeAttribute('class'); tpl.parentNode.insertBefore(p, tpl); return p; }
  function bike(svg, t) {
    if (!svg) return t;
    var groups = qa(svg, ':scope > g'), frames = [], dims = [], calls = [];
    groups.forEach(function (g) {
      if (g.querySelector('polygon')) dims.push(g);
      else if (g.querySelector('text[font-style="italic"]')) calls.push(g);
      else frames.push(g);
    });
    qa(svg, ':scope > line').forEach(function (l) { fade(l, t, 900); });
    frames.forEach(function (g, i) {
      var d = t + 250 + i * 400;
      qa(g, 'circle').forEach(function (c) { drawPath(c, d, 1300); });
      var paths = qa(g, 'path'), main = null, cockpit = null, saddle = null;
      paths.forEach(function (p) {
        var s = p.getAttribute('d'), n = (s.match(/M/g) || []).length;
        if (n >= 4) main = p; else if (n === 2) saddle = p; else cockpit = p;
      });
      if (main) {
        var pts = main.getAttribute('d').match(/-?[\d.]+,-?[\d.]+/g); // rear, 0,0, Hd, Hb, H, S, rear, 0,0, S, Hb, front
        var rear = pts[0], Hd = pts[2], Hb = pts[3], H = pts[4], S = pts[5], front = pts[10], BB = '0,0';
        [[BB, Hd], [BB, S], [BB, rear], [Hb, H], [S, H], [S, rear], [Hb, front]]
          .forEach(function (q) { drawPath(seg(main, 'M' + q[0] + ' L' + q[1]), d, 1300); });
        main.style.display = 'none';
      }
      if (cockpit) drawPath(cockpit, d + 150, 1300);   // spacers → stem → bar, a touch behind the frame
      if (saddle) drawPath(saddle, d, 1300);
      qa(g, 'text').forEach(function (x) { fade(x, d + 900, 500); });
    });
    var last = t + 250 + Math.max(0, frames.length - 1) * 400;
    qa(svg, ':scope > circle').forEach(function (c) { fade(c, last + 900, 500); });  // BB dot
    var dd = last + 900;                                 // labels group
    dims.forEach(function (g, i) {
      var di = dd + i * 250;
      qa(g, 'line[stroke="var(--s-ref)"]').forEach(function (l) { fade(l, di, 700); });
      qa(g, 'line[stroke="var(--s-measure)"]').forEach(function (l) { drawPath(l, di, 1100); });
      qa(g, 'polygon,text').forEach(function (x) { fade(x, di + 700, 500); });
    });
    var end = dims.length ? dd + (dims.length - 1) * 250 + 1200 : last + 1400;
    calls.forEach(function (g, i) {
      var ci = (dims.length ? end - 300 : dd) + i * 250;
      qa(g, 'circle').forEach(function (c) { fade(c, ci, 500); });
      qa(g, 'path').forEach(function (p) { drawPath(p, ci + 100, 800); });
      qa(g, 'text').forEach(function (x) { fade(x, ci + 600, 500); });
    });
    if (calls.length) end = Math.max(end, (dims.length ? end - 300 : dd) + (calls.length - 1) * 250 + 1100);
    return end;
  }

  // Titles: words are grouped into their visual lines; each line rises 0.35 em and fades in, lines 110 ms apart
  // (the landing hero does the same line by line). The kicker above fades in first.
  function titleIn(root, t) {
    qa(root, '.gs-kicker').forEach(function (k) { fadeUp(k, t, 800); });
    qa(root, '.gs-hook, .gs-headline').forEach(function (hd) {
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
            parts.forEach(function (w) {
              if (!w) return;
              if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
              else { var sp = document.createElement('span'); sp.className = 'gx-w'; sp.style.display = 'inline-block'; sp.textContent = w; frag.appendChild(sp); }
            });
            node.replaceChild(frag, c);
          } else if (c.nodeType === 1 && c.classList.contains('gs-acc')) { c.classList.add('gx-w'); c.style.display = 'inline-block'; }   // keep the pencil underline whole
          else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
        });
      };
      walk(hd);
      var words = qa(hd, '.gx-w'), lines = [], lastTop = null;
      words.forEach(function (w) { var top = Math.round(w.getBoundingClientRect().top); if (lastTop === null || Math.abs(top - lastTop) > 8) { lines.push([]); lastTop = top; } lines[lines.length - 1].push(w); });
      lines.forEach(function (ln, i) { ln.forEach(function (w) { add(w, [{ opacity: 0, transform: 'translateY(0.35em)' }, { opacity: 1, transform: 'translateY(0)' }], t + 150 + i * 110, 1000); }); });
      // the pencil underline (if any) is drawn after its words land
      qa(hd, '.gs-acc').forEach(function (a) { add(a, [{ textDecorationColor: 'transparent' }, { textDecorationColor: 'var(--s-measure)' }], t + 150 + lines.length * 110 + 500, 700, 'ease'); });
    });
    qa(root, '.gs-cover .gs-text, .gs-cta .gs-text').forEach(function (b) { fadeUp(b, t + 500, 900); });
  }
  // Rider: built from the floor up — ground, legs, torso, arm, head; then the height bar grows from the floor
  // with its number counting up, and the inseam mark rises from the floor to the crotch, counting too.
  function rider(svg, t) {
    if (!svg) return t;
    var floor = qa(svg, ':scope > line').pop(); if (floor) drawPath(floor, t, 1100);
    var body = q(svg, 'g[stroke-linecap="round"]');
    if (body) { var ls = qa(body, 'line'); ls.forEach(function (l, i) { drawPath(l, t + 200 + (i < 2 ? 0 : i === 2 ? 450 : 750), i < 2 ? 1100 : 800); }); }
    var head = q(svg, ':scope > circle'); if (head) { head.style.transformOrigin = 'center'; head.style.transformBox = 'fill-box'; add(head, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], t + 1000, 800); }
    var m = q(svg, 'g[font-family]');
    if (m) {
      var mls = qa(m, 'line'), txt = qa(m, 'text');
      var bar = mls[0], topTick = mls[1], botTick = mls[2], inseam = mls[3];
      var y0 = +bar.getAttribute('y1'), yH = +bar.getAttribute('y2'), yL = inseam ? +inseam.getAttribute('y1') : y0;
      var tm = t + 1300;
      fade(botTick, tm, 400);
      // height bar: a line from the floor up (y1 = floor) unrolls upward
      drawPath(bar, tm, 1600, 'cubic-bezier(.33,0,.15,1)');
      add(topTick, [{ opacity: 0, transform: 'translateY(' + (y0 - yH) + 'px)' }, { opacity: 1, transform: 'translateY(0)' }], tm, 1600, 'cubic-bezier(.33,0,.15,1)');
      add(txt[0], [{ opacity: 0, transform: 'translateY(' + (y0 - yH) + 'px)' }, { opacity: 1, transform: 'translateY(0)' }], tm, 1600, 'cubic-bezier(.33,0,.15,1)');
      count(txt[0], tm, 1600);
      if (inseam) {
        var ti = tm + 500;
        add(inseam, [{ opacity: 0, transform: 'translateY(' + (y0 - yL) + 'px)' }, { opacity: 1, transform: 'translateY(0)' }], ti, 1500, 'cubic-bezier(.33,0,.15,1)');
        add(txt[1], [{ opacity: 0, transform: 'translateY(' + (y0 - yL) + 'px)' }, { opacity: 1, transform: 'translateY(0)' }], ti, 1500, 'cubic-bezier(.33,0,.15,1)');
        count(txt[1], ti, 1500);
      }
    }
    var lab = qa(svg, ':scope > text').pop(); if (lab) fade(lab, t + 1600, 700);
    return t + 3400;
  }
  function icon(svg, t, dur) { qa(svg, 'path,circle').forEach(function (p) { drawPath(p, t, dur || 1300); }); }
  function ring(root, t) { qa(root, '.gs-pencil path').forEach(function (p) { drawPath(p, t, 1000, 'cubic-bezier(.45,0,.25,1)'); }); }
  function ctaRows(root, t) {
    var rows = qa(root, '.gs-actions span');
    rows.forEach(function (s, i) { fadeUp(s, t + i * 180, 900); });
    fade(q(root, '.gs-url'), t + rows.length * 180 + 300, 700);
    fade(q(root, '.gs-pl'), t + rows.length * 180 + 500, 700);
  }
  function caption(root, t) { qa(root, '.gs-caption').forEach(function (c) { fadeUp(c, t, 900); }); }
  function byStyle(root, s) { return qa(root, '[style*="' + s + '"]'); }

  // ---------- choreography per post and slide; returns duration in ms ----------
  var SIZE_ROWS = function (root, t0) {
    var lab = byStyle(root, 'font-size: 34px')[0]; fade(lab, t0, 700);
    var rows = byStyle(root, 'grid-template-columns: 90px 1fr 130px');
    rows.forEach(function (r, i) {
      var t = t0 + 300 + i * 160;
      fade(r.children[0], t, 600); fade(r.children[1], t, 600); fade(r.children[2], t, 400);
      grow(r.children[1].firstChild, t + 100, 1300);
      count(r.querySelector('b'), t + 100, 1300);
    });
    var tEnd = t0 + 300 + (rows.length - 1) * 160 + 1400;
    var legend = rows.length ? rows[rows.length - 1].nextSibling : null; fade(legend, tEnd - 400, 700);
    ring(root, tEnd + 100);
    return tEnd + 1100;
  };
  var CHOREO = {
    c: [
      function (r) { // cover: flow builds step by step
        var flow = q(r, '.gs-art > div'), k = flow.children; // row, ↓, row, ↓, row
        fadeUp(k[0], 300); fade(k[1], 900, 700); fadeUp(k[2], 1100); fade(k[3], 1700, 700); fadeUp(k[4], 1900);
        count(k[4].querySelector('b'), 2000, 1500);
        return 5600;
      },
      function (r) { // inputs: three sections, then "Balanced" gets picked
        var secs = q(r, '.gs-art > div').children;
        fadeUp(secs[0], 300); fadeUp(secs[1], 1000); fadeUp(secs[2], 1700);
        var b = qa(secs[2], 'span')[1];
        if (b) add(b, [{ background: 'transparent', color: 'var(--s-fg)' }, { background: 'var(--s-fg)', color: 'var(--s-bg)' }], 3000, 450, 'ease');
        return 5600;
      },
      function (r) { var imgs = qa(r, '.gs-art img'); imgs.forEach(function (im, i) { fadeUp(im, 300 + i * 450); }); caption(r, 1300); return 4800; },
      function (r) { var e = SIZE_ROWS(r, 200); caption(r, e); return e + 2200; },
      function (r) { fadeUp(q(r, '.gs-art img'), 300); caption(r, 1000); return 4400; },
      function (r) { fadeUp(q(r, '.gs-art img'), 300); caption(r, 1000); return 4400; },
      function (r) { ctaRows(r, 400); return 4600; }
    ],
    cm: null,
    p1: [
      function (r) { var rd = qa(r, '.gs-riders > svg'), e = 0; rd.forEach(function (s, i) { e = rider(s, 500 + i * 450); }); return e + 1800; },
      function (r) { var rd = qa(r, '.gs-riders > svg'), e = 0; rd.forEach(function (s, i) { e = rider(s, 300 + i * 450); });
        qa(r, '.gs-end > *').forEach(function (x, i) { if (i > 0) fadeUp(x, e - 600); }); return e + 1800; },
      function (r) { var rows = qa(r, '.gs-chart-row'); rows.forEach(function (x, i) { fadeUp(x, 500 + i * 260); });
        var m = q(r, '.gs-chart-row b'); if (m) { m.style.display = 'inline-block'; m.style.transformOrigin = 'right center'; add(m, [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1)' }], 1000, 900); }
        qa(r, '.gx-q').forEach(function (qb, i) { var t = 1500 + i * 260; add(qb, [{ opacity: 0 }, { opacity: 1 }], t, 600, 'ease');
          var qm = qb.firstChild; qm.style.display = 'inline-block'; add(qm, [{ opacity: 0, transform: 'translateY(10px) rotate(-8deg)' }, { opacity: 1, transform: 'translateY(0) rotate(0deg)' }], t + 250, 900); });
        fadeUp(q(r, '.gs-end'), 2700); return 5800; },
      function (r) { var e = bike(q(r, 'svg.gd'), 200); qa(r, '.gs-notes li').forEach(function (li, i) { fadeUp(li, e - 200 + i * 250); }); return e + 2600; },
      function (r) { qa(r, '.gs-stats > div').forEach(function (d, i) { fadeUp(d, 300 + i * 220); }); caption(r, 1600); return 4800; },
      function (r) { ctaRows(r, 400); return 4600; }
    ],
    g1: [
      function (r) { var e = bike(q(r, 'svg.gd'), 300); return e + 2200; },
      function (r) { var e = bike(q(r, 'svg.gd'), 200); qa(r, '.gs-notes li').forEach(function (li, i) { fadeUp(li, e - 200 + i * 250); }); return e + 2400; },
      function (r) { var cols = q(r, '.gs-art > div').children;
        Array.prototype.forEach.call(cols, function (c, i) { var t = 300 + i * 600; icon(q(c, 'svg'), t, 1400); fadeUp(c.children[1], t + 900); fadeUp(c.children[2], t + 1050); });
        caption(r, 2600); return 5400; },
      function (r) { var svg = q(r, 'svg.gs-chart'); var dots = qa(svg, 'circle');
        var order = dots.map(function (d, i) { return [+d.getAttribute('cx'), +d.getAttribute('cy') * -1, i]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
        order.forEach(function (o, k) { add(dots[o[2]], [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }], 300 + k * 30, 700); });
        var t = 300 + order.length * 30;
        qa(svg, 'line[stroke-dasharray], text[style*="italic"]').forEach(function (x) { fade(x, t, 700); });
        qa(svg, ':scope > g').forEach(function (g) { if (g.querySelector('text') && !g.querySelector('line[y1="350"]')) fade(g, t + 300, 700); });
        caption(r, t + 800); return t + 3200; },
      function (r) { fadeUp(q(r, '.gs-art img'), 300); caption(r, 1000); return 4400; },
      function (r) { var imgs = qa(r, '.gs-art img'); imgs.forEach(function (im, i) { fadeUp(im, 300 + i * 450); }); caption(r, 1300); return 4800; },
      function (r) { ctaRows(r, 400); return 4600; }
    ]
  };


  // Story · inseam: wall and floor draw, rider rises in, then the four app steps play one after another
  // (book slides up, pencil mark on the wall, tape grows from the floor and counts to 84 cm).
  CHOREO.si = [function (r) {
    var svg = q(r, '#inseam-art'), M = 'cubic-bezier(.33,0,.15,1)';
    drawPath(q(svg, '#floor'), 300, 1100); drawPath(q(svg, '#wall'), 500, 1100);
    fade(q(svg, '#wall-fill'), 700, 900); fade(q(svg, '#wall-lab'), 1000, 700);
    add(q(svg, '#rider'), [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], 1000, 1100);
    var S = [1200, 4200, 7400, 10400], END = 16000;
    qa(r, '.si-step').forEach(function (el, i) {
      var s = S[i], e = i < 3 ? S[i + 1] : END, D = e - s + (i < 3 ? 0 : 0);
      var k = i < 3
        ? [{ opacity: 0, transform: 'translateY(14px)', offset: 0 }, { opacity: 1, transform: 'translateY(0)', offset: 800 / D },
           { opacity: 1, transform: 'translateY(0)', offset: (D - 450) / D }, { opacity: 0, transform: 'translateY(-10px)', offset: 1 }]
        : [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }];
      add(el, k, i < 3 ? s - 450 * (i > 0) : s, i < 3 ? D : 900, i < 3 ? 'linear' : EASE_OUT);
    });
    // step 2: book slides up between the legs, arrow pushes and fades away
    var book = q(svg, '#book');
    add(book, [{ opacity: 0, transform: 'translateY(170px)' }, { opacity: 1, transform: 'translateY(0)', offset: .25 }, { opacity: 1, transform: 'translateY(0)' }], S[1] + 200, 2000, M);
    add(q(svg, '#push'), [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)', offset: .3 }, { opacity: 1, transform: 'translateY(-8px)', offset: .75 }, { opacity: 0, transform: 'translateY(-8px)' }], S[1] + 500, 2400, 'ease-in-out');
    // step 3: level line from the spine to the wall, then the pencil mark
    drawPath(q(svg, '#level'), S[2] + 300, 900); drawPath(q(svg, '#mark'), S[2] + 1000, 900, 'cubic-bezier(.45,0,.25,1)');
    // step 4: tape unrolls from the floor to the mark, number counts up
    var tl = q(svg, '#tape-line'), y0 = +tl.getAttribute('y1'), yL = +tl.getAttribute('y2');
    fade(q(svg, '#tape'), S[3] + 200, 400);
    drawPath(tl, S[3] + 200, 1800, M);
    add(q(svg, '#tape-top'), [{ opacity: 0, transform: 'translateY(' + (y0 - yL) + 'px)' }, { opacity: 1, transform: 'translateY(0)' }], S[3] + 200, 1800, M);
    var lab = q(svg, '#tape-lab'); fade(lab, S[3] + 400, 600); count(lab, S[3] + 200, 1800);
    fade(q(svg, '#tape-eg'), S[3] + 1400, 700);
    fadeUp(q(r, '#si-note'), S[3] + 2400, 900);
    fadeUp(q(r, '#si-cta'), S[3] + 3000, 900);
    return END;
  }];


  // Geometry 101 · Part 2 and Part 3
  function dumbbell(svg, t) {
    if (!svg) return t;
    var rule = q(svg, ':scope > line'); if (rule) drawPath(rule, t, 900);
    var gs = qa(svg, ':scope > g'), e = t;
    gs.forEach(function (g, i) {
      var t0 = t + 300 + i * 900, ln = qa(g, 'line'), tx = qa(g, 'text'), dots = qa(g, 'circle');
      if (ln.length > 1) fade(ln[0], t0, 500);
      fade(tx[0], t0, 600);
      var bar = ln[ln.length - 1];
      dots.forEach(function (d, k) { d.style.transformOrigin = 'center'; d.style.transformBox = 'fill-box';
        add(d, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], t0 + 200 + k * 500, 700); });
      add(bar, [{ opacity: 0 }, { opacity: 1 }], t0 + 300, 300, 'ease-out');
      drawPath(bar, t0 + 300, 800);
      fade(tx[1], t0 + 300, 600); fade(tx[2], t0 + 800, 600);
      var dl = tx[3]; if (dl) { fade(dl, t0 + 1100, 600); }
      e = t0 + 1700;
    });
    return e;
  }
  function tableRows(r, t) {
    var tb = q(r, '.gs-table'); if (!tb) return t;
    fade(q(tb, 'thead'), t, 700);
    var rows = qa(tb, 'tbody tr'); rows.forEach(function (tr, i) { fadeUp(tr, t + 400 + i * 300); });
    return t + 400 + rows.length * 300 + 600;
  }
  function ground(svg, t) {
    qa(svg, 'circle[r]').forEach(function (c) { if (+c.getAttribute('r') > 50) fade(c, t, 900); });
    qa(svg, 'path').forEach(function (p, i) { drawPath(p, t + 200 + i * 250, 1300); });
    qa(svg, 'line').forEach(function (l) { fade(l, t + 900, 700); });
    qa(svg, 'circle').forEach(function (c) { if (+c.getAttribute('r') <= 50) fade(c, t + 1200, 500); });
    var txt = qa(svg, 'text'); txt.forEach(function (x) { fade(x, t + 1500, 700); });
    var mm = txt.filter(function (x) { return /mm/.test(x.textContent); })[0]; if (mm) count(mm, t + 1500, 1200);
    return t + 2600;
  }
  CHOREO.g2 = [
    function (r) { var e = bike(q(r, 'svg.gd'), 300); return e + 2200; },
    function (r) { var e = bike(q(r, 'svg.gd'), 200); qa(r, '.gs-notes li').forEach(function (li, i) { fadeUp(li, e - 200 + i * 300); }); return e + 2600; },
    function (r) { var e = tableRows(r, 300); ring(r, e + 300); caption(r, e + 900); return e + 3200; },
    function (r) { fade(q(r, '.gs-legend'), 200, 700); var e = dumbbell(q(r, 'svg.gs-chart'), 500); caption(r, e); return e + 2400; },
    function (r) { var e = bike(q(r, 'svg.gd'), 200); fade(q(r, '.gs-legend'), e - 600, 700); qa(r, '.gs-notes li').forEach(function (li, i) { fadeUp(li, e - 200 + i * 300); }); return e + 2600; },
    function (r) { fadeUp(q(r, '.gs-art img'), 300); caption(r, 1000); return 4400; },
    function (r) { ctaRows(r, 400); return 4600; }
  ];
  function pairSlide(r) { var e = bike(q(r, 'svg.gd'), 300); fade(q(r, '.gs-legend'), e - 600, 700); caption(r, e); return e + 2400; }
  CHOREO.g3 = [
    function (r) { var e = bike(q(r, 'svg.gd'), 300); return e + 2200; },
    pairSlide, pairSlide, pairSlide, pairSlide,
    function (r) { var svgs = qa(r, '.gs-art svg').filter(function (s) { return !s.classList.contains('gs-lockup'); }), e = 300;
      var k = q(r, '.gs-art > div > div:nth-child(2)');
      svgs.forEach(function (s, i) { e = ground(s, 300 + i * 1600); });
      if (k) fade(k, 1500, 700); fade(q(r, '.gs-legend'), 1200, 700); caption(r, e); return e + 2400; },
    function (r) { qa(r, '.gs-stats > div').forEach(function (d, i) { fadeUp(d, 300 + i * 300); count(q(d, 'b'), 300 + i * 300, 1500); }); caption(r, 1900); return 5000; },
    function (r) { ctaRows(r, 400); return 4600; }
  ];



  // P05 v2 · Geometry 101 part 2 · frame vs handlebar
  function cockpit(svg, t, gap) { if (!svg) return t; gap = gap || 900;
    qa(svg, '.ck-frame line, .ck-frame path').forEach(function (p) { drawPath(p, t, 900); });
    ['.ck-s1', '.ck-s2', '.ck-s3', '.ck-s4'].forEach(function (c, i) { var g = q(svg, c); if (g) fade(g, t + 700 + i * gap, 700); });
    return t + 700 + 4 * gap; }
  CHOREO.g2v2 = [
    CHOREO.g2[0],
    function (r) { var e = bike(q(r, 'svg.gd'), 300); caption(r, e); return e + 2600; },
    function (r) { var e = cockpit(q(r, '.gs-art svg'), 300, 1100); caption(r, e - 200); return e + 2600; },
    function (r) { var e = bike(q(r, 'svg.gd'), 300); fade(q(r, '.gs-legend'), e - 600, 700); caption(r, e); return e + 2400; },
    function (r) { var e = 0; qa(r, '.gs-art svg').forEach(function (s, i) { e = cockpit(s, 300 + i * 500, 700); });
      qa(r, '.ck-pair > div > :first-child').forEach(function (k, i) { fadeUp(k, 200 + i * 500, 700); });
      caption(r, e); return e + 2800; },
    function (r) { var cols = qa(r, '.gs-art > div > div'), e = 300; cols.forEach(function (c, i) { Array.prototype.forEach.call(c.children, function (x, j) { e = 300 + i * 700 + j * 300; fadeUp(x, e, 800); }); });
      caption(r, e + 600); return e + 3400; },
    CHOREO.g2[5],
    CHOREO.g2[6]
  ];

  // Reel P04 · 178 cm. M or L? (each board rendered separately, joined with short cross-fades)
  function capNow(r, t) { var n = q(r, '.gs-captions .is-now'); if (n) fadeUp(n, t, 700); qa(r, '.gs-captions .is-next').forEach(function (p, i) { fade(p, t + 200 + i * 120, 600); }); }
  CHOREO.r2 = [
    function (r) { var e = bike(q(r, 'svg.gd'), 300); return Math.min(e + 600, 3000); },
    function (r) { var e = bike(q(r, 'svg.gd'), 100); fade(q(r, '.gs-legend'), 900, 600); capNow(r, 500); return 3200; },
    function (r) { capNow(r, 100); return 2200; },
    function (r) { capNow(r, 100); return 2200; },
    function (r) { qa(r, '.gs-art svg').forEach(function (s, i) { icon(s, 400 + i * 220, 1100); }); return 3200; },
    function (r) { qa(r, '.gs-body > *, .gs-body > * > *').forEach(function (x, i) { if (i < 6) fadeUp(x, 200 + i * 200, 900); }); return 3200; }
  ];


  // P04 v2 · reel · Same height, three answers
  function p4card(r) {
    qa(r, '.p4-traits > span').forEach(function (x, i) { fadeUp(x, 300 + i * 220, 800); });
    var e = rider(q(r, '.gs-art svg'), 600);
    qa(r, '.p4-row').forEach(function (row, i) { var t = 1500 + i * 300;
      fadeUp(row, t, 700); grow(q(row, '.p4-bar'), t + 200, 1300); count(q(row, '.p4-pct'), t + 200, 1300); });
    ring(r, 3000); caption(r, 3400); return 6200;
  }
  CHOREO.p4 = [
    function (r) { fadeUp(q(r, '.p4-photo'), 700, 1100); return 3400; },
    function (r) { var e = 0; qa(r, '.gs-riders > div').forEach(function (d, i) { e = rider(q(d, 'svg'), 300 + i * 350); fadeUp(d.children[1], 1500 + i * 350, 700); fadeUp(d.children[2], 1700 + i * 350, 700); }); caption(r, 2600); return 5600; },
    p4card, p4card, p4card,
    function (r) { qa(r, '.p4-why > div').forEach(function (d, i) { fadeUp(d, 900 + i * 400, 900); }); return 4800; },
    function (r) { qa(r, '.gs-body > *').forEach(function (x, i) { fadeUp(x, 200 + i * 250, 900); }); return 3400; }
  ];

  CHOREO.cm = CHOREO.c.slice();
  CHOREO.cm[5] = function (r) {
    var e = bike(q(r, 'svg.gd'), 200);
    var tb = q(r, '.gs-table');
    fade(tb, e - 300, 800);
    qa(tb, 'tbody tr').forEach(function (tr, i) { fadeUp(tr, e - 100 + i * 200); });
    var t2 = e - 100 + 2 * 200 + 900; ring(r, t2); caption(r, t2 + 300);
    return t2 + 2600;
  };
  window.CHOREO = CHOREO;
  window.M = { q: q, qa: qa, add: add, fade: fade, fadeUp: fadeUp, grow: grow, drawPath: drawPath, count: count, bike: bike, rider: rider, icon: icon, ring: ring, ctaRows: ctaRows, caption: caption, titleIn: titleIn, cockpit: cockpit };
  window.GeomoMotion = {
    setup: function (set, idx) {
      var root = document.querySelector('#s1 > *');
      titleIn(root, 0);
      var f = (CHOREO[set] || [])[idx]; var dur = f ? f(root) : 3000;
      window.__dur = dur; window.GeomoMotion.seek(0); return dur;
    },
    seek: function (t) {
      document.getAnimations().forEach(function (a) { a.pause(); a.currentTime = t; });
      counters.forEach(function (c) {   // ease-out-expo, like the landing page counters
        var p = Math.max(0, Math.min(1, (t - c.t) / c.dur)); var e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
        c.el.textContent = c.pre + Math.round(c.to * e) + c.post;
      });
    }
  };
})();
