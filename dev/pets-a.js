/* Koncept A — tuzkova malůvka. Kresba po dilech, dvojity tah, bez vyplne. */

var INK = '#6b6459', INK2 = '#9a9287';

function pen(d, w, op) {
  w = w == null ? 1.7 : w; op = op == null ? 1 : op;
  return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + op + '"/>'
       + '<path d="' + d + '" fill="none" stroke="' + INK2 + '" stroke-width="' + (w * .6) + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (op * .7) + '" transform="translate(0.8,0.7)"/>';
}
function paper(d) { return '<path d="' + d + '" fill="#fdfdfb" stroke="none"/>'; }
function shape(d, w) { return paper(d) + pen(d, w); }

/* ---------- PES ---------- */
/* telo: pocatek = stred sedu na zemi, prisedici pes, predek vlevo */
function dogBody(t, mood) {
  var s = '';
  var legTop = -18 - 10 * t;
  var tailUp = mood === 'hop' ? 1 : (mood === 'sleep' ? -1 : 0);

  /* ocas */
  var tl = 14 + 12 * t, te;
  var td;
  if (tailUp > 0) {
    td = 'M28 -12 C' + (30 + tl * .7) + ' -18 ' + (32 + tl * .8) + ' ' + (-24 - tl) + ' ' + (24 + tl * .5) + ' ' + (-30 - tl);
    te = [24 + tl * .5, -30 - tl];
  } else if (tailUp < 0) {
    td = 'M28 -10 C' + (32 + tl * .6) + ' -8 ' + (34 + tl * .7) + ' -2 ' + (26 + tl * .4) + ' 0';
    te = [26 + tl * .4, 0];
  } else {
    td = 'M28 -12 C' + (34 + tl * .6) + ' -16 ' + (36 + tl * .7) + ' ' + (-16 - tl * .6) + ' ' + (28 + tl * .35) + ' ' + (-20 - tl * .75);
    te = [28 + tl * .35, -20 - tl * .75];
  }
  s += pen(td, 2.1);
  /* chlupaty ocas — az u dospelaka */
  if (t >= 1) {
    s += pen('M' + (te[0] - 1) + ' ' + (te[1] + 3) + ' l6 -3 M' + (te[0] - 3) + ' ' + (te[1] + 9) + ' l7 -2 M' + (te[0] - 5) + ' ' + (te[1] + 15) + ' l6 -2', 1.2, .6);
  }

  /* trup — vpredu vysoky (hrud a krk), vzadu nizky kulaty zadek */
  var bd = 'M-23 0 C-30 -12 -28 -30 -19 -40 C-12 -47 2 -47 9 -39 C18 -29 28 -18 28 -7 C28 -1 24 1 18 1 L-18 1 Z';
  s += shape(bd, 1.9);

  /* predni nohy */
  s += pen('M-19 ' + legTop + ' L-19 -2.5', 2.0);
  s += pen('M-8 ' + (legTop + 2) + ' L-8 -2.5', 2.0);
  s += pen('M-24 -1 q5 4 10 0', 1.8);
  s += pen('M-13 -1 q5 4 10 0', 1.8);

  /* srst na hrudi — pribyva s rustem */
  if (t >= .5) s += pen('M-21 -30 q4 3 3 7 M-16 -34 q4 3 3 7', 1.1, .5);
  if (t >= .75) {
    for (var i = 0; i < 3; i++) s += pen('M' + (6 + i * 6) + ' ' + (-22 + i * 4) + ' l5 8', 1.1, .45);
  }
  return s;
}

/* hlava: pocatek = stred hlavy */
function dogHead(t, mood) {
  var s = '', up = mood === 'hop', sleep = mood === 'sleep';

  /* usi — velke klopene, kresli se pod hlavou */
  var eL = 16 + 7 * t, drop = up ? .72 : (sleep ? 1.12 : .94);
  var earL = 'M-13 -13 C-25 -16 -30 ' + (-4 + eL * .2 * drop) + ' -25 ' + (eL * drop) + ' C-22 ' + (eL * drop + 6) + ' -14 ' + (eL * drop + 4) + ' -12 ' + (eL * drop - 4);
  var earR = 'M13 -14 C25 -17 30 ' + (-5 + eL * .2 * drop) + ' 25 ' + (eL * drop - 2) + ' C22 ' + (eL * drop + 4) + ' 15 ' + (eL * drop + 2) + ' 13 ' + (eL * drop - 6);
  s += paper(earL + ' Z') + paper(earR + ' Z') + pen(earL, 1.8) + pen(earR, 1.8);

  /* lebka */
  var hd = 'M-17 -3 C-18 -15 -10 -22 0 -22 C10 -22 18 -15 17 -3 C16 8 9 15 0 15 C-9 15 -16 8 -17 -3 Z';
  s += shape(hd, 1.9);

  /* cenich */
  var mz = 'M-11 4 C-22 3 -27 8 -25 13 C-23 18 -12 19 -6 14';
  s += paper(mz + ' Z') + pen(mz, 1.8);
  s += '<ellipse cx="-24" cy="8.5" rx="3.4" ry="2.8" fill="' + INK + '"/>';
  s += pen('M-19 15 q4 3 8 0', 1.4);

  /* oci */
  var ey = -2;
  if (sleep) {
    s += pen('M-11 ' + ey + ' q4 4 8 0', 1.7);
    s += pen('M5 ' + ey + ' q4 4 8 0', 1.7);
  } else {
    var r = up ? 3.2 : 2.7;
    s += '<circle cx="-7" cy="' + ey + '" r="' + r + '" fill="' + INK + '"/><circle cx="9" cy="' + ey + '" r="' + r + '" fill="' + INK + '"/>';
    s += '<circle cx="-5.8" cy="' + (ey - 1.2) + '" r="1" fill="#fdfdfb"/><circle cx="10.2" cy="' + (ey - 1.2) + '" r="1" fill="#fdfdfb"/>';
  }
  /* obocko / detail az u vzrostleho */
  if (t >= .75) s += pen('M-11 -13 q3 -3 6 -2 M5 -15 q3 -1 6 2', 1.2, .55);
  return s;
}

/* ---------- KOCKA ---------- */
function catBody(t, mood) {
  var s = '';
  var legTop = -16 - 9 * t;
  var tl = 18 + 16 * t, td, te;
  if (mood === 'sleep') {
    td = 'M22 -6 C' + (26 + tl * .5) + ' -4 ' + (28 + tl * .6) + ' 2 ' + (10 + tl * .3) + ' 4';
    te = [10 + tl * .3, 4];
  } else {
    td = 'M22 -8 C' + (28 + tl * .5) + ' -14 ' + (30 + tl * .55) + ' ' + (-14 - tl * .7) + ' ' + (18 + tl * .3) + ' ' + (-18 - tl * .8);
    te = [18 + tl * .3, -18 - tl * .8];
  }
  s += pen(td, 2.0);
  if (t >= 1) {
    s += pen('M' + (te[0] - 2) + ' ' + (te[1] + 2) + ' l6 -2 M' + (te[0] - 4) + ' ' + (te[1] + 8) + ' l6 -2', 1.2, .55);
  }

  var bd = 'M-19 0 C-25 -12 -24 -30 -16 -40 C-10 -47 2 -47 8 -38 C15 -28 23 -17 23 -7 C23 -1 20 1 15 1 L-15 1 Z';
  s += shape(bd, 1.9);

  s += pen('M-16 ' + legTop + ' L-16 -2.5', 2.0);
  s += pen('M-6 ' + (legTop + 2) + ' L-6 -2.5', 2.0);
  s += pen('M-20 -1 q4 4 8 0', 1.8);
  s += pen('M-10 -1 q4 4 8 0', 1.8);

  if (t >= .5) { for (var i = 0; i < 3; i++) s += pen('M' + (2 + i * 5) + ' ' + (-24 + i * 4) + ' l5 7', 1.1, .45); }
  return s;
}

function catHead(t, mood) {
  var s = '', up = mood === 'hop', sleep = mood === 'sleep';
  var eh = (14 + 5 * t) * (up ? 1.22 : (sleep ? .6 : .88));

  /* usi — spicate trojuhelniky */
  var earL = 'M-15 -8 L-16 ' + (-8 - eh) + ' L-2 ' + (-13 - eh * .25) + ' Z';
  var earR = 'M15 -8 L16 ' + (-8 - eh) + ' L2 ' + (-13 - eh * .25) + ' Z';
  s += shape(earL, 1.8) + shape(earR, 1.8);
  s += pen('M-13 -10 L-13 ' + (-10 - eh * .55) + ' L-6 ' + (-12 - eh * .18), 1.1, .5);
  s += pen('M13 -10 L13 ' + (-10 - eh * .55) + ' L6 ' + (-12 - eh * .18), 1.1, .5);

  var hd = 'M-16 -2 C-17 -13 -9 -19 0 -19 C9 -19 17 -13 16 -2 C15 8 9 14 0 14 C-9 14 -15 8 -16 -2 Z';
  s += shape(hd, 1.9);

  /* cumacek */
  s += '<path d="M-3 4 h6 l-3 3 Z" fill="#c96f8a"/>';
  s += pen('M0 7 q-3.5 3.5 -7 1.5 M0 7 q3.5 3.5 7 1.5', 1.4);

  /* fousy */
  var fw = 11 + 6 * t;
  s += pen('M-8 4 l' + (-fw) + ' -2.5 M-8 7 l' + (-fw) + ' 2.5', 1.05, .65);
  s += pen('M8 4 l' + fw + ' -2.5 M8 7 l' + fw + ' 2.5', 1.05, .65);

  var ey = -3;
  if (sleep) {
    s += pen('M-11 ' + ey + ' q4 4 8 0', 1.7);
    s += pen('M4 ' + ey + ' q4 4 8 0', 1.7);
  } else {
    var r = up ? 3.4 : 2.8;
    s += '<ellipse cx="-7" cy="' + ey + '" rx="' + r + '" ry="' + (r * 1.2) + '" fill="' + INK + '"/>';
    s += '<ellipse cx="8" cy="' + ey + '" rx="' + r + '" ry="' + (r * 1.2) + '" fill="' + INK + '"/>';
    s += '<circle cx="-5.8" cy="' + (ey - 1.4) + '" r="1" fill="#fdfdfb"/><circle cx="9.2" cy="' + (ey - 1.4) + '" r="1" fill="#fdfdfb"/>';
  }
  if (t >= .75) s += pen('M-10 -12 q4 -2 7 0 M3 -12 q4 -2 7 0', 1.1, .5);
  return s;
}

/* ---------- sestaveni ---------- */
function petSvg(kind, t, mood, opt) {
  opt = opt || {};
  var dog = kind === 'pes';
  var sb = .48 + .52 * t;              /* telo roste vic */
  var sh = .70 + .30 * t;              /* hlava roste min → mladě ma velkou hlavu */
  var gy = 118, cx = 84;
  var mood2 = mood || 'ok';

  var body = (dog ? dogBody : catBody)(t, mood2);
  var head = (dog ? dogHead : catHead)(t, mood2);

  var bodyTop = dog ? 47 : 47;
  var hx = cx - (dog ? 21 : 18) * sb - (dog ? 2 : 1) * sh;
  var hy = gy - bodyTop * sb - (dog ? 11 : 10) * sh;
  if (mood2 === 'sleep') { hy += 7 * sh; }
  var tilt = mood2 === 'hop' ? -5 : (mood2 === 'sleep' ? 7 : 0);

  var s = '';
  if (opt.ground !== false) {
    s += '<rect x="' + (cx - 46 * sb) + '" y="' + (gy - 3) + '" width="' + (96 * sb + 14) + '" height="7.5" rx="3.5" fill="' + (opt.hl || (dog ? '#fbe3a3' : '#f3cdd6')) + '" opacity=".6" transform="rotate(-1 ' + cx + ' ' + gy + ')"/>';
  }
  s += '<g transform="translate(' + cx + ' ' + gy + ') scale(' + sb + ')">' + body + '</g>';
  s += '<g transform="translate(' + hx + ' ' + hy + ') rotate(' + tilt + ') scale(' + sh + ')">' + head + '</g>';

  if (mood2 === 'hop') {
    s += pen('M' + (hx - 30 * sh) + ' ' + (hy - 26 * sh) + ' l-5 -5 M' + (hx + 30 * sh) + ' ' + (hy - 28 * sh) + ' l5 -5', 1.4, .75);
  }
  if (mood2 === 'sleep') {
    s += '<text x="' + (hx + 26 * sh) + '" y="' + (hy - 20 * sh) + '" font-family="Caveat,cursive" font-size="16" fill="' + INK2 + '">z</text>';
    s += '<text x="' + (hx + 34 * sh) + '" y="' + (hy - 31 * sh) + '" font-family="Caveat,cursive" font-size="21" fill="' + INK2 + '">z</text>';
  }
  var w = opt.w || 170, h = opt.h || 140;
  return '<svg viewBox="0 0 170 140" width="' + w + '" height="' + h + '" aria-hidden="true">' + s + '</svg>';
}

function bowlSvg(treats) {
  var s = '';
  if (treats) {
    s += '<circle cx="20" cy="16" r="3.4" fill="#f3cdd6" stroke="#c96f8a" stroke-width="1.1"/>';
    s += '<circle cx="28" cy="15" r="2.8" fill="#fbe3a3" stroke="#c9a86a" stroke-width="1.1"/>';
  }
  var d = 'M7 18 q18 -5 36 0 l-5 13 q-13 4 -26 0 Z';
  s += paper(d) + pen(d, 1.8);
  return '<svg viewBox="0 0 50 36" width="50" height="36" aria-hidden="true">' + s + '</svg>';
}

/* dnesni rustove carky: cas, kdy mazlicek povyrostl. O pulnoci se vygumuji. */
function marksSvg(reached) {
  reached = reached || [['9:40', 2], ['11:15', 3], ['13:20', 4]];
  var yOf = { 2: 74, 3: 56, 4: 38, 5: 20 };
  var s = pen('M7 14 V94', 1.5, .8);
  reached.forEach(function (r, i) {
    var y = yOf[r[1]], last = i === reached.length - 1;
    s += '<path d="M7 ' + y + ' h11" stroke="' + INK + '" stroke-width="1.7" stroke-linecap="round" opacity="' + (last ? 1 : .38) + '"/>';
    s += '<text x="21" y="' + (y + 4.5) + '" font-family="Caveat,cursive" font-size="13" fill="' + (last ? INK : '#b8b2a6') + '">' + r[0] + '</text>';
  });
  return '<svg viewBox="0 0 52 100" width="52" height="100" aria-hidden="true">' + s + '</svg>';
}
