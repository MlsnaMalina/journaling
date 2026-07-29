/* Koncept B — papirova vystrihovanka. Ploche vystrizky, kazda faze prida dalsi dil. */

var PAL = {
  pes:   { fill: '#cfe0ec', edge: '#6f93ad', dark: '#a9c4d6', acc: '#fbe3a3', accE: '#c9a86a' },
  kocka: { fill: '#f3cdd6', edge: '#c96f8a', dark: '#e2adbc', acc: '#cfe0d4', accE: '#6f9a7c' }
};
var INKB = '#5f5a4e';

function cut(d, fill, stroke, w) {
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + (stroke || 'none') + '" stroke-width="' + (w || 1.8) + '" stroke-linejoin="round" stroke-linecap="round"/>';
}
function line(d, c, w, op) {
  return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (op == null ? 1 : op) + '"/>';
}

/* ---- pes z boku, stojici. pocatek = stred na zemi ---- */
function dogB(t, mood, P) {
  var up = mood === 'hop', sleep = mood === 'sleep';
  var legH = 9 + 9 * t, bodyW = 26 + 12 * t, bodyH = 24 + 9 * t;
  var s = '';

  /* vzdalene nohy (tmavsi papir) */
  s += cut('M-14 ' + (-legH - 2) + ' h7 v' + (legH + 4) + ' q-3.5 3 -7 0 Z', P.dark, P.edge, 1.4);
  s += cut('M' + (bodyW - 8) + ' ' + (-legH - 2) + ' h7 v' + (legH + 4) + ' q-3.5 3 -7 0 Z', P.dark, P.edge, 1.4);

  /* ocas — az od faze 3 */
  if (t >= .5) {
    var tl = 16 + 10 * t;
    var ang = up ? -1 : (sleep ? .35 : -.55);
    s += cut('M' + (bodyW - 2) + ' ' + (-legH - bodyH * .78) + ' q' + (tl * .7) + ' ' + (tl * ang) + ' ' + (tl * .55) + ' ' + (tl * (ang - .35)) + ' q' + (-tl * .3) + ' ' + (tl * .18) + ' ' + (-tl * .75) + ' ' + (-tl * (ang - .30) * .55) + ' Z', P.dark, P.edge, 1.6);
  }

  /* trup */
  var by = -legH;
  s += cut('M' + (-bodyW - 2) + ' ' + (by - bodyH * .55)
    + ' C' + (-bodyW - 3) + ' ' + (by - bodyH * 1.15) + ' ' + (-bodyW * .5) + ' ' + (by - bodyH * 1.35) + ' ' + (bodyW * .12) + ' ' + (by - bodyH * 1.30)
    + ' C' + (bodyW * .75) + ' ' + (by - bodyH * 1.26) + ' ' + (bodyW + 4) + ' ' + (by - bodyH * 1.0) + ' ' + (bodyW + 3) + ' ' + (by - bodyH * .45)
    + ' C' + (bodyW + 2) + ' ' + (by - 2) + ' ' + (bodyW * .6) + ' ' + by + ' ' + (bodyW * .2) + ' ' + by
    + ' L' + (-bodyW * .5) + ' ' + by + ' C' + (-bodyW - 1) + ' ' + by + ' ' + (-bodyW - 2) + ' ' + (by - bodyH * .2) + ' ' + (-bodyW - 2) + ' ' + (by - bodyH * .55) + ' Z', P.fill, P.edge, 1.8);

  /* blizke nohy */
  s += cut('M' + (-bodyW + 2) + ' ' + (-legH - 2) + ' h8 v' + (legH + 4) + ' q-4 3 -8 0 Z', P.fill, P.edge, 1.6);
  s += cut('M' + (bodyW - 14) + ' ' + (-legH - 2) + ' h8 v' + (legH + 4) + ' q-4 3 -8 0 Z', P.fill, P.edge, 1.6);

  /* skvrna — az u dospelaka */
  if (t >= 1) s += cut('M' + (bodyW * .30) + ' ' + (by - bodyH * 1.02) + ' q9 -4 12 3 q3 7 -5 8 q-8 1 -7 -6 Z', P.dark, P.edge, 1.3);
  return s;
}

function dogHeadB(t, mood, P) {
  var up = mood === 'hop', sleep = mood === 'sleep';
  var R = 15 + 4 * t, s = '';

  /* usi — od faze 2 */
  if (t >= .25) {
    var drop = up ? .8 : (sleep ? 1.25 : 1.05);
    s += cut('M' + (-R * .25) + ' ' + (-R * .82) + ' q' + (-R * .95) + ' ' + (-R * .30) + ' ' + (-R * 1.05) + ' ' + (R * .55 * drop)
      + ' q' + (-R * .05) + ' ' + (R * .60 * drop) + ' ' + (R * .60) + ' ' + (R * .48 * drop) + ' Z', P.dark, P.edge, 1.6);
  }
  /* lebka */
  s += cut('M0 ' + (-R) + ' a' + R + ' ' + (R * .96) + ' 0 1 0 0.1 0 Z', P.fill, P.edge, 1.8);
  /* cenich */
  s += cut('M' + (-R * .35) + ' ' + (R * .10) + ' q' + (-R * .95) + ' ' + (-R * .12) + ' ' + (-R * .98) + ' ' + (R * .34)
    + ' q0 ' + (R * .46) + ' ' + (R * .98) + ' ' + (R * .30) + ' Z', '#fdfdfb', P.edge, 1.6);
  s += '<ellipse cx="' + (-R * 1.22) + '" cy="' + (R * .30) + '" rx="' + (2.8 + t) + '" ry="' + (2.3 + t * .8) + '" fill="' + INKB + '"/>';

  /* oko */
  var ex = -R * .12, ey = -R * .18;
  if (sleep) s += line('M' + (ex - 3.6) + ' ' + ey + ' q3.6 3.4 7.2 0', INKB, 1.7);
  else {
    s += '<circle cx="' + ex + '" cy="' + ey + '" r="' + (up ? 3.4 : 2.9) + '" fill="' + INKB + '"/>';
    s += '<circle cx="' + (ex + 1.2) + '" cy="' + (ey - 1.3) + '" r="1.1" fill="#fdfdfb"/>';
  }
  /* obojek — od faze 4 */
  if (t >= .75) s += cut('M' + (-R * .80) + ' ' + (R * .80) + ' q' + (R * .80) + ' ' + (R * .45) + ' ' + (R * 1.60) + ' -0.2 l0 4 q' + (-R * .80) + ' ' + (R * .45) + ' ' + (-R * 1.60) + ' 0 Z', P.acc, P.accE, 1.4);
  if (t >= 1) s += '<circle cx="0" cy="' + (R * 1.12) + '" r="3" fill="#fbe3a3" stroke="#c9a86a" stroke-width="1.2"/>';
  return s;
}

/* ---- kocka z boku ---- */
function catB(t, mood, P) {
  var up = mood === 'hop', sleep = mood === 'sleep';
  var legH = 8 + 9 * t, bodyW = 24 + 11 * t, bodyH = 21 + 8 * t;
  var s = '', by = -legH;

  s += cut('M-12 ' + (-legH - 2) + ' h6 v' + (legH + 4) + ' q-3 3 -6 0 Z', P.dark, P.edge, 1.4);
  s += cut('M' + (bodyW - 8) + ' ' + (-legH - 2) + ' h6 v' + (legH + 4) + ' q-3 3 -6 0 Z', P.dark, P.edge, 1.4);

  if (t >= .5) {
    var tl = 20 + 14 * t;
    var ang = up ? -1.05 : (sleep ? .2 : -.75);
    s += cut('M' + (bodyW - 1) + ' ' + (by - bodyH * .70) + ' q' + (tl * .55) + ' ' + (tl * ang * .55) + ' ' + (tl * .45) + ' ' + (tl * ang) + ' l4.5 1.5 q' + (-tl * .18) + ' ' + (-tl * ang * .30) + ' ' + (-tl * .60) + ' ' + (-tl * ang * .38) + ' Z', P.fill, P.edge, 1.5);
  }

  s += cut('M' + (-bodyW - 1) + ' ' + (by - bodyH * .50)
    + ' C' + (-bodyW - 2) + ' ' + (by - bodyH * 1.10) + ' ' + (-bodyW * .4) + ' ' + (by - bodyH * 1.28) + ' ' + (bodyW * .18) + ' ' + (by - bodyH * 1.24)
    + ' C' + (bodyW * .78) + ' ' + (by - bodyH * 1.20) + ' ' + (bodyW + 3) + ' ' + (by - bodyH * .95) + ' ' + (bodyW + 2) + ' ' + (by - bodyH * .40)
    + ' C' + (bodyW + 1) + ' ' + (by - 2) + ' ' + (bodyW * .6) + ' ' + by + ' ' + (bodyW * .2) + ' ' + by
    + ' L' + (-bodyW * .5) + ' ' + by + ' C' + (-bodyW) + ' ' + by + ' ' + (-bodyW - 1) + ' ' + (by - bodyH * .2) + ' ' + (-bodyW - 1) + ' ' + (by - bodyH * .50) + ' Z', P.fill, P.edge, 1.8);

  s += cut('M' + (-bodyW + 3) + ' ' + (-legH - 2) + ' h7 v' + (legH + 4) + ' q-3.5 3 -7 0 Z', P.fill, P.edge, 1.6);
  s += cut('M' + (bodyW - 13) + ' ' + (-legH - 2) + ' h7 v' + (legH + 4) + ' q-3.5 3 -7 0 Z', P.fill, P.edge, 1.6);

  if (t >= 1) {
    s += line('M' + (bodyW * .10) + ' ' + (by - bodyH * 1.18) + ' v9 M' + (bodyW * .40) + ' ' + (by - bodyH * 1.12) + ' v9', P.edge, 2.2, .55);
  }
  return s;
}

function catHeadB(t, mood, P) {
  var up = mood === 'hop', sleep = mood === 'sleep';
  var R = 14 + 4 * t, s = '';
  if (t >= .25) {
    var eh = (R * .85) * (up ? 1.2 : (sleep ? .65 : .95));
    s += cut('M' + (-R * .88) + ' ' + (-R * .42) + ' L' + (-R * .95) + ' ' + (-R * .42 - eh) + ' L' + (-R * .10) + ' ' + (-R * .90) + ' Z', P.dark, P.edge, 1.5);
    s += cut('M' + (R * .88) + ' ' + (-R * .42) + ' L' + (R * .95) + ' ' + (-R * .42 - eh) + ' L' + (R * .10) + ' ' + (-R * .90) + ' Z', P.dark, P.edge, 1.5);
  }
  s += cut('M0 ' + (-R * .96) + ' a' + (R * .98) + ' ' + (R * .92) + ' 0 1 0 0.1 0 Z', P.fill, P.edge, 1.8);
  s += '<path d="M' + (-R * .90) + ' ' + (R * .14) + ' h' + (R * .40) + ' l' + (-R * .20) + ' ' + (R * .22) + ' Z" fill="' + P.edge + '"/>';
  var fw = 10 + 5 * t;
  s += line('M' + (-R * .95) + ' ' + (R * .20) + ' l' + (-fw) + ' -2.5 M' + (-R * .95) + ' ' + (R * .40) + ' l' + (-fw) + ' 2.5', INKB, 1.05, .6);
  var ex = -R * .10, ey = -R * .22;
  if (sleep) s += line('M' + (ex - 3.6) + ' ' + ey + ' q3.6 3.4 7.2 0', INKB, 1.7);
  else {
    s += '<ellipse cx="' + ex + '" cy="' + ey + '" rx="' + (up ? 3.4 : 2.9) + '" ry="' + (up ? 4 : 3.4) + '" fill="' + INKB + '"/>';
    s += '<circle cx="' + (ex + 1.2) + '" cy="' + (ey - 1.5) + '" r="1.1" fill="#fdfdfb"/>';
  }
  if (t >= .75) s += cut('M' + (-R * .78) + ' ' + (R * .74) + ' q' + (R * .78) + ' ' + (R * .44) + ' ' + (R * 1.56) + ' -0.2 l0 4 q' + (-R * .78) + ' ' + (R * .44) + ' ' + (-R * 1.56) + ' 0 Z', P.acc, P.accE, 1.4);
  if (t >= 1) s += '<circle cx="0" cy="' + (R * 1.06) + '" r="3" fill="' + P.acc + '" stroke="' + P.accE + '" stroke-width="1.2"/>';
  return s;
}

function petSvgB(kind, t, mood, opt) {
  opt = opt || {};
  var dog = kind === 'pes', P = PAL[kind];
  var sb = .52 + .48 * t, sh = .74 + .26 * t;
  var gy = 116, cx = 74, m = mood || 'ok';

  var body = (dog ? dogB : catB)(t, m, P);
  var head = (dog ? dogHeadB : catHeadB)(t, m, P);

  var legH = (dog ? 9 : 8) + 9 * t, bodyW = (dog ? 26 : 24) + (dog ? 12 : 11) * t, bodyH = (dog ? 24 : 21) + (dog ? 9 : 8) * t;
  var hx = cx - (bodyW + (dog ? 8 : 7)) * sb;
  var hy = gy - (legH + bodyH * (dog ? 1.10 : 1.05)) * sb - (dog ? 3 : 2) * sh;
  if (m === 'sleep') hy += 8 * sh;
  if (m === 'hop') hy -= 3 * sh;
  var tilt = m === 'hop' ? -9 : (m === 'sleep' ? 9 : 0);

  var s = '';
  var g = '<g transform="translate(' + cx + ' ' + gy + ') scale(' + sb + ')">' + body + '</g>'
        + '<g transform="translate(' + hx + ' ' + hy + ') rotate(' + tilt + ') scale(' + sh + ')">' + head + '</g>';
  /* papirovy stin */
  s += '<g opacity=".16" transform="translate(2.5,3)"><g style="filter:none">' + g.replace(/fill="#[0-9a-f]{6}"/gi, 'fill="#8a8478"').replace(/stroke="#[0-9a-f]{6}"/gi, 'stroke="#8a8478"') + '</g></g>';
  s += g;

  if (m === 'hop') s += line('M' + (hx - 26 * sh) + ' ' + (hy - 22 * sh) + ' l-5 -5 M' + (cx + 40 * sb) + ' ' + (gy - 46 * sb) + ' l5 -5', P.edge, 1.5, .8);
  if (m === 'sleep') {
    s += '<text x="' + (hx - 4) + '" y="' + (hy - 24 * sh) + '" font-family="Caveat,cursive" font-size="16" fill="' + P.edge + '">z</text>';
    s += '<text x="' + (hx + 6) + '" y="' + (hy - 34 * sh) + '" font-family="Caveat,cursive" font-size="21" fill="' + P.edge + '">z</text>';
  }
  var w = opt.w || 170, h = opt.h || 140;
  return '<svg viewBox="0 0 170 140" width="' + w + '" height="' + h + '" aria-hidden="true">' + s + '</svg>';
}

/* miska jako vystrizek */
function bowlSvgB(treats) {
  var s = '';
  if (treats) {
    s += cut('M16 12 q5 -4 9 1 q3 4 -2 6 q-6 2 -7 -3 Z', '#f3cdd6', '#c96f8a', 1.3);
    s += '<circle cx="31" cy="15" r="3.4" fill="#fbe3a3" stroke="#c9a86a" stroke-width="1.3"/>';
  }
  s += cut('M6 19 q19 -6 38 0 l-5 13 q-14 4 -28 0 Z', '#cfe0d4', '#6f9a7c', 1.8);
  return '<svg viewBox="0 0 52 38" width="52" height="38" aria-hidden="true">' + s + '</svg>';
}

/* rustove cedulky na provazku */
function marksSvgB(days) {
  days = days || [['so', .25], ['ne', .75], ['po', 1], ['út', .5], ['st', .75]];
  var s = line('M3 11 Q38 4 73 11', '#b8b2a6', 1.3);
  days.forEach(function (d, i) {
    var x = 5 + i * 14, top = 10 + Math.abs(i - 2) * .9, h = 13 + d[1] * 40, last = i === days.length - 1;
    var col = last ? '#fbe3a3' : '#f6f4ee', edge = last ? '#c9a86a' : '#d2ccbe';
    s += line('M' + (x + 5.5) + ' ' + top + ' v4', '#b8b2a6', 1.1);
    s += cut('M' + x + ' ' + (top + 4) + ' h11 v' + h + ' l-5.5 3.5 l-5.5 -3.5 Z', col, edge, 1.3);
    s += '<text x="' + (x + 5.5) + '" y="' + (top + 16) + '" text-anchor="middle" font-family="Caveat,cursive" font-size="12" fill="' + (last ? '#8a7a4e' : '#b8b2a6') + '">' + d[0] + '</text>';
  });
  return '<svg viewBox="0 0 78 76" width="78" height="76" aria-hidden="true">' + s + '</svg>';
}
