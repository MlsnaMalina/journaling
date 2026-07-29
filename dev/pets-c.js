/* Koncept C — razitko. Jednobarevny otisk s nerovnymi okraji, bily vyseky misto detailu. */

var INKC = { pes: '#c96f4a', kocka: '#c96f8a' };
var uid = 0;

function ink(d, col) { return '<path d="' + d + '" fill="' + col + '"/>'; }
function knock(d, w) { return '<path d="' + d + '" fill="none" stroke="#ffffff" stroke-width="' + (w || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }

/* ---- PES zepredu, prisedici ---- */
function dogC(t, mood, col) {
  var up = mood === 'hop', sleep = mood === 'sleep';
  var s = '';

  if (sleep) {
    /* stocene klubicko */
    s += ink('M-30 0 C-34 -20 -18 -32 2 -32 C24 -32 34 -20 32 -4 C31 1 28 2 22 2 L-22 2 C-27 2 -30 1 -30 0 Z', col);
    s += ink('M-22 -14 a15 15 0 1 0 0.1 0 Z', col);
    /* ucho */
    s += ink('M-30 -22 C-40 -22 -42 -8 -34 -2 C-30 1 -26 -2 -26 -8 Z', col);
    /* ocas prehozeny pres telo */
    s += ink('M30 -12 C40 -18 42 -30 32 -32 C28 -33 26 -29 28 -26 C32 -22 30 -16 24 -14 Z', col);
    s += knock('M-29 -16 q5 4 10 0', 2.2);
    s += knock('M-14 -8 h6', 2);
    return s;
  }

  var bw = 24, bh = 42;
  /* trup */
  s += ink('M0 ' + (-bh) + ' C' + (bw * .62) + ' ' + (-bh) + ' ' + bw + ' ' + (-bh * .5) + ' ' + bw + ' -3 C' + bw + ' 1 ' + (bw * .8) + ' 2 ' + (bw * .6) + ' 2 L' + (-bw * .6) + ' 2 C' + (-bw * .8) + ' 2 ' + (-bw) + ' 1 ' + (-bw) + ' -3 C' + (-bw) + ' ' + (-bh * .5) + ' ' + (-bw * .62) + ' ' + (-bh) + ' 0 ' + (-bh) + ' Z', col);
  /* packy */
  s += ink('<>'.replace('<>', '') + 'M-16 -6 a7 6.5 0 1 0 0.1 0 Z', col);
  s += ink('M14 -6 a7 6.5 0 1 0 0.1 0 Z', col);
  s += knock('M-16 -4 v4 M-11 -5 v3', 1.6);
  s += knock('M16 -4 v4 M21 -5 v3', 1.6);

  /* usi */
  var out = up ? 1.35 : 1;
  s += ink('M-13 -70 C' + (-30 * out) + ' -72 ' + (-36 * out) + ' -54 ' + (-28 * out) + ' -44 C' + (-23 * out) + ' -38 -15 -44 -14 -52 Z', col);
  s += ink('M13 -70 C' + (30 * out) + ' -72 ' + (36 * out) + ' -54 ' + (28 * out) + ' -44 C' + (23 * out) + ' -38 15 -44 14 -52 Z', col);

  /* hlava */
  s += ink('M0 -74 C13 -74 21 -65 21 -54 C21 -42 12 -34 0 -34 C-12 -34 -21 -42 -21 -54 C-21 -65 -13 -74 0 -74 Z', col);

  /* bile vyseky: oci, cenich, hubicka */
  s += '<ellipse cx="0" cy="-42" rx="11" ry="7.5" fill="#ffffff"/>';
  s += '<ellipse cx="0" cy="-46" rx="3.6" ry="2.9" fill="' + col + '"/>';
  s += knock('M0 -42 v3 M0 -39 q-4 3 -7 0 M0 -39 q4 3 7 0', 1.8);
  if (up) {
    s += '<path d="M-6 -39 q6 7 12 0 q-6 4 -12 0 Z" fill="#ffffff"/>';
  }
  s += '<circle cx="-8" cy="-58" r="' + (up ? 3.4 : 2.9) + '" fill="#ffffff"/>';
  s += '<circle cx="8" cy="-58" r="' + (up ? 3.4 : 2.9) + '" fill="#ffffff"/>';
  /* hrudni znak roste s fazi */
  if (t >= .5) s += '<path d="M0 -30 q6 6 0 13 q-6 -7 0 -13 Z" fill="#ffffff"/>';
  if (t >= .75) s += knock('M-19 -36 q19 9 38 0', 3.2);
  return s;
}

/* ---- KOCKA zepredu ---- */
function catC(t, mood, col) {
  var up = mood === 'hop', sleep = mood === 'sleep';
  var s = '';
  if (sleep) {
    s += ink('M-28 0 C-32 -19 -16 -30 3 -30 C23 -30 32 -19 30 -4 C29 1 26 2 20 2 L-20 2 C-25 2 -28 1 -28 0 Z', col);
    s += ink('M-20 -13 a14 14 0 1 0 0.1 0 Z', col);
    s += ink('M-31 -20 L-33 -34 L-20 -25 Z', col);
    s += ink('M-10 -22 L-6 -35 L-3 -22 Z', col);
    s += ink('M28 -8 C40 -10 44 -22 34 -26 C30 -28 27 -24 29 -21 C33 -18 32 -12 24 -11 Z', col);
    s += knock('M-27 -15 q5 4 10 0', 2.2);
    return s;
  }
  var bw = 21, bh = 40;
  s += ink('M0 ' + (-bh) + ' C' + (bw * .62) + ' ' + (-bh) + ' ' + bw + ' ' + (-bh * .5) + ' ' + bw + ' -3 C' + bw + ' 1 ' + (bw * .8) + ' 2 ' + (bw * .6) + ' 2 L' + (-bw * .6) + ' 2 C' + (-bw * .8) + ' 2 ' + (-bw) + ' 1 ' + (-bw) + ' -3 C' + (-bw) + ' ' + (-bh * .5) + ' ' + (-bw * .62) + ' ' + (-bh) + ' 0 ' + (-bh) + ' Z', col);
  /* ocas oviuty dopredu */
  s += ink('M20 -6 C34 -8 40 -2 34 4 C30 8 18 8 8 5 C14 4 26 2 26 -1 C26 -3 23 -4 19 -3 Z', col);
  s += ink('M-14 -6 a6.5 6 0 1 0 0.1 0 Z', col);
  s += knock('M-14 -4 v4 M-9.5 -5 v3', 1.5);

  /* usi */
  var eh = up ? 26 : 21;
  s += ink('M-18 -58 L-21 ' + (-58 - eh) + ' L-2 ' + (-62) + ' Z', col);
  s += ink('M18 -58 L21 ' + (-58 - eh) + ' L2 ' + (-62) + ' Z', col);
  s += ink('M0 -70 C12 -70 19 -62 19 -52 C19 -41 11 -34 0 -34 C-11 -34 -19 -41 -19 -52 C-19 -62 -12 -70 0 -70 Z', col);

  s += '<circle cx="-7" cy="-56" r="' + (up ? 3.4 : 2.9) + '" fill="#ffffff"/>';
  s += '<circle cx="7" cy="-56" r="' + (up ? 3.4 : 2.9) + '" fill="#ffffff"/>';
  s += '<path d="M-3 -46 h6 l-3 3 Z" fill="#ffffff"/>';
  s += knock('M0 -43 q-4 3.5 -8 1 M0 -43 q4 3.5 8 1', 1.7);
  var fw = 12 + 6 * t;
  s += knock('M-11 -47 l' + (-fw) + ' -3 M-11 -44 l' + (-fw) + ' 3', 1.5);
  s += knock('M11 -47 l' + fw + ' -3 M11 -44 l' + fw + ' 3', 1.5);
  if (t >= .5) s += '<path d="M0 -30 q5 6 0 12 q-5 -6 0 -12 Z" fill="#ffffff"/>';
  if (t >= .75) s += knock('M-17 -35 q17 9 34 0', 3.2);
  return s;
}

function petSvgC(kind, t, mood, opt) {
  opt = opt || {};
  var col = INKC[kind], m = mood || 'ok';
  var sc = (.44 + .56 * t) * (opt.k || 1);
  var gy = 122, cx = 85, id = 'r' + (++uid);
  var body = (kind === 'pes' ? dogC : catC)(t, m, col);
  var rot = (m === 'hop' ? -4 : (m === 'sleep' ? 3 : -1.5));

  var f = '<filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%">'
    + '<feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="3" seed="' + (uid * 7 % 40) + '" result="n"/>'
    + '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>';

  var s = '<defs>' + f + '</defs>';
  s += '<g filter="url(#' + id + ')" transform="translate(' + cx + ' ' + gy + ') rotate(' + rot + ') scale(' + sc + ')" opacity=".92">' + body + '</g>';
  /* nerovnomerny inkoust — par svetlych flicku */
  for (var i = 0; i < 5; i++) {
    var a = (i * 2.4 + uid) % 6.28;
    s += '<circle cx="' + (cx + Math.cos(a) * 22 * sc) + '" cy="' + (gy - 34 * sc + Math.sin(a) * 20 * sc) + '" r="' + (1.4 + (i % 3) * .7) + '" fill="#ffffff" opacity=".5"/>';
  }
  if (m === 'hop') {
    s += '<path d="M' + (cx - 52 * sc) + ' ' + (gy - 72 * sc) + ' l-7 -6 M' + (cx + 52 * sc) + ' ' + (gy - 74 * sc) + ' l7 -6" stroke="' + col + '" stroke-width="2.2" stroke-linecap="round" opacity=".75" fill="none"/>';
  }
  if (m === 'sleep') {
    s += '<text x="' + (cx + 26 * sc) + '" y="' + (gy - 48 * sc) + '" font-family="Caveat,cursive" font-size="17" fill="' + col + '" opacity=".7">z</text>';
    s += '<text x="' + (cx + 36 * sc) + '" y="' + (gy - 60 * sc) + '" font-family="Caveat,cursive" font-size="22" fill="' + col + '" opacity=".7">z</text>';
  }
  var w = opt.w || 170, h = opt.h || 140;
  return '<svg viewBox="0 0 170 140" width="' + w + '" height="' + h + '" aria-hidden="true">' + s + '</svg>';
}

/* miska jako otisk */
function bowlSvgC(treats) {
  var col = '#c96f4a', id = 'rb' + (++uid);
  var s = '<defs><filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
  var g = '<path d="M6 18 q19 -6 38 0 l-5 14 q-14 4 -28 0 Z" fill="' + col + '"/>';
  if (treats) g += '<circle cx="19" cy="13" r="4" fill="' + col + '"/><circle cx="30" cy="12" r="3.2" fill="' + col + '"/>';
  s += '<g filter="url(#' + id + ')" opacity=".9" transform="rotate(-2 25 22)">' + g + '</g>';
  return '<svg viewBox="0 0 52 38" width="52" height="38" aria-hidden="true">' + s + '</svg>';
}

/* razitkova kartička: kolecka za posledni dny */
function cardSvgC(days) {
  days = days || [1, .25, .75, 1, .5, .75];
  var col = '#c96f4a';
  var w = 30 + days.length * 44;
  var s = '<rect x="2" y="2" width="' + (w - 4) + '" height="76" rx="5" fill="#fdfdfb" stroke="#d9d4c9" stroke-width="1.3" stroke-dasharray="5 4"/>';
  s += '<text x="12" y="19" font-family="Caveat,cursive" font-size="15" fill="#a8a294">poslední dny</text>';
  days.forEach(function (v, i) {
    var cx = 26 + i * 44, cy = 50, id = 'rc' + (++uid), last = i === days.length - 1;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="19" fill="none" stroke="' + (last ? '#c9a86a' : '#e0dbcf') + '" stroke-width="1.3" stroke-dasharray="3 3"/>';
    if (v > 0) {
      s += '<defs><filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" seed="' + (i * 3 + 2) + '" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
      s += '<g filter="url(#' + id + ')" opacity="' + (last ? .92 : .38) + '" transform="translate(' + cx + ' ' + (cy + 15) + ') rotate(' + ((i * 37) % 9 - 4) + ') scale(' + (0.20 + v * .16) + ')">'
        + '<path d="M-13 -70 C-30 -72 -36 -54 -28 -44 C-23 -38 -15 -44 -14 -52 Z" fill="' + col + '"/>'
        + '<path d="M13 -70 C30 -72 36 -54 28 -44 C23 -38 15 -44 14 -52 Z" fill="' + col + '"/>'
        + '<path d="M0 -42 C14 -42 24 -24 24 -3 C24 1 22 2 18 2 L-18 2 C-22 2 -24 1 -24 -3 C-24 -24 -14 -42 0 -42 Z" fill="' + col + '"/>'
        + '<path d="M0 -74 C13 -74 21 -65 21 -54 C21 -42 12 -34 0 -34 C-12 -34 -21 -42 -21 -54 C-21 -65 -13 -74 0 -74 Z" fill="' + col + '"/>'
        + '<ellipse cx="0" cy="-42" rx="11" ry="7.5" fill="#fdfdfb"/>'
        + '<circle cx="-8" cy="-58" r="3.2" fill="#fdfdfb"/><circle cx="8" cy="-58" r="3.2" fill="#fdfdfb"/></g>';
    }
  });
  return '<svg viewBox="0 0 ' + w + ' 80" width="' + w + '" height="80" aria-hidden="true">' + s + '</svg>';
}
