import type { JSX } from 'react';
import type { GrowthMark, PetKind, PetMood, PetStage } from './pet';

/** Tužková malůvka: dvojitá linka, žádná výplň. Grafit a světlejší souběžný tah. */
const INK = '#6b6459';
const INK2 = '#9a9287';
const PAPER = '#fdfdfb';

type Bits = JSX.Element[];

function pen(bits: Bits, d: string, w = 1.7, op = 1): void {
  const k = bits.length;
  bits.push(
    <path
      key={`p${k}`} d={d} fill="none" stroke={INK} strokeWidth={w}
      strokeLinecap="round" strokeLinejoin="round" opacity={op}
    />,
    <path
      key={`q${k}`} d={d} fill="none" stroke={INK2} strokeWidth={w * 0.6}
      strokeLinecap="round" strokeLinejoin="round" opacity={op * 0.7}
      transform="translate(0.8,0.7)"
    />,
  );
}

/** Bílá výplň pod tahem, aby se díly nepřekrývaly skrz. */
function paper(bits: Bits, d: string): void {
  bits.push(<path key={`w${bits.length}`} d={d} fill={PAPER} stroke="none" />);
}

function shape(bits: Bits, d: string, w = 1.9): void {
  paper(bits, d);
  pen(bits, d, w);
}

/* ---------- pes ---------- */

/** Trup: počátek je střed sedu na zemi, přední strana vlevo. */
function dogBody(t: number, mood: PetMood): Bits {
  const bits: Bits = [];
  const legTop = -18 - 10 * t;
  const tl = 14 + 12 * t;

  let td: string;
  let te: [number, number];
  if (mood === 'hop') {
    td = `M28 -12 C${30 + tl * 0.7} -18 ${32 + tl * 0.8} ${-24 - tl} ${24 + tl * 0.5} ${-30 - tl}`;
    te = [24 + tl * 0.5, -30 - tl];
  } else if (mood === 'sleep') {
    td = `M28 -10 C${32 + tl * 0.6} -8 ${34 + tl * 0.7} -2 ${26 + tl * 0.4} 0`;
    te = [26 + tl * 0.4, 0];
  } else {
    td = `M28 -12 C${34 + tl * 0.6} -16 ${36 + tl * 0.7} ${-16 - tl * 0.6} ${28 + tl * 0.35} ${-20 - tl * 0.75}`;
    te = [28 + tl * 0.35, -20 - tl * 0.75];
  }
  pen(bits, td, 2.1);
  if (t >= 1) {
    pen(bits, `M${te[0] - 1} ${te[1] + 3} l6 -3 M${te[0] - 3} ${te[1] + 9} l7 -2 M${te[0] - 5} ${te[1] + 15} l6 -2`, 1.2, 0.6);
  }

  shape(bits, 'M-23 0 C-30 -12 -28 -30 -19 -40 C-12 -47 2 -47 9 -39 C18 -29 28 -18 28 -7 C28 -1 24 1 18 1 L-18 1 Z');

  pen(bits, `M-19 ${legTop} L-19 -2.5`, 2);
  pen(bits, `M-8 ${legTop + 2} L-8 -2.5`, 2);
  pen(bits, 'M-24 -1 q5 4 10 0', 1.8);
  pen(bits, 'M-13 -1 q5 4 10 0', 1.8);

  /* kresba se během dne dokresluje: srst na hrudi, pak šrafování na zádech */
  if (t >= 0.5) pen(bits, 'M-21 -30 q4 3 3 7 M-16 -34 q4 3 3 7', 1.1, 0.5);
  if (t >= 0.75) {
    for (let i = 0; i < 3; i++) pen(bits, `M${6 + i * 6} ${-22 + i * 4} l5 8`, 1.1, 0.45);
  }
  return bits;
}

/** Hlava: počátek je střed lebky. */
function dogHead(t: number, mood: PetMood): Bits {
  const bits: Bits = [];
  const up = mood === 'hop';
  const sleep = mood === 'sleep';

  const eL = 16 + 7 * t;
  const drop = up ? 0.72 : sleep ? 1.12 : 0.94;
  const earL = `M-13 -13 C-25 -16 -30 ${-4 + eL * 0.2 * drop} -25 ${eL * drop} C-22 ${eL * drop + 6} -14 ${eL * drop + 4} -12 ${eL * drop - 4}`;
  const earR = `M13 -14 C25 -17 30 ${-5 + eL * 0.2 * drop} 25 ${eL * drop - 2} C22 ${eL * drop + 4} 15 ${eL * drop + 2} 13 ${eL * drop - 6}`;
  paper(bits, `${earL} Z`);
  paper(bits, `${earR} Z`);
  pen(bits, earL, 1.8);
  pen(bits, earR, 1.8);

  shape(bits, 'M-17 -3 C-18 -15 -10 -22 0 -22 C10 -22 18 -15 17 -3 C16 8 9 15 0 15 C-9 15 -16 8 -17 -3 Z');

  const mz = 'M-11 4 C-22 3 -27 8 -25 13 C-23 18 -12 19 -6 14';
  paper(bits, `${mz} Z`);
  pen(bits, mz, 1.8);
  bits.push(<ellipse key="nos" cx={-24} cy={8.5} rx={3.4} ry={2.8} fill={INK} />);
  pen(bits, 'M-19 15 q4 3 8 0', 1.4);

  if (sleep) {
    pen(bits, 'M-11 -2 q4 4 8 0', 1.7);
    pen(bits, 'M5 -2 q4 4 8 0', 1.7);
  } else {
    const r = up ? 3.2 : 2.7;
    bits.push(
      <circle key="ol" cx={-7} cy={-2} r={r} fill={INK} />,
      <circle key="op" cx={9} cy={-2} r={r} fill={INK} />,
      <circle key="jl" cx={-5.8} cy={-3.2} r={1} fill={PAPER} />,
      <circle key="jp" cx={10.2} cy={-3.2} r={1} fill={PAPER} />,
    );
  }
  if (t >= 0.75) pen(bits, 'M-11 -13 q3 -3 6 -2 M5 -15 q3 -1 6 2', 1.2, 0.55);
  return bits;
}

/* ---------- kočka ---------- */

function catBody(t: number, mood: PetMood): Bits {
  const bits: Bits = [];
  const legTop = -16 - 9 * t;
  const tl = 18 + 16 * t;

  let td: string;
  let te: [number, number];
  if (mood === 'sleep') {
    td = `M22 -6 C${26 + tl * 0.5} -4 ${28 + tl * 0.6} 2 ${10 + tl * 0.3} 4`;
    te = [10 + tl * 0.3, 4];
  } else {
    td = `M22 -8 C${28 + tl * 0.5} -14 ${30 + tl * 0.55} ${-14 - tl * 0.7} ${18 + tl * 0.3} ${-18 - tl * 0.8}`;
    te = [18 + tl * 0.3, -18 - tl * 0.8];
  }
  pen(bits, td, 2);
  if (t >= 1) pen(bits, `M${te[0] - 2} ${te[1] + 2} l6 -2 M${te[0] - 4} ${te[1] + 8} l6 -2`, 1.2, 0.55);

  shape(bits, 'M-19 0 C-25 -12 -24 -30 -16 -40 C-10 -47 2 -47 8 -38 C15 -28 23 -17 23 -7 C23 -1 20 1 15 1 L-15 1 Z');

  pen(bits, `M-16 ${legTop} L-16 -2.5`, 2);
  pen(bits, `M-6 ${legTop + 2} L-6 -2.5`, 2);
  pen(bits, 'M-20 -1 q4 4 8 0', 1.8);
  pen(bits, 'M-10 -1 q4 4 8 0', 1.8);

  if (t >= 0.5) {
    for (let i = 0; i < 3; i++) pen(bits, `M${2 + i * 5} ${-24 + i * 4} l5 7`, 1.1, 0.45);
  }
  return bits;
}

function catHead(t: number, mood: PetMood): Bits {
  const bits: Bits = [];
  const up = mood === 'hop';
  const sleep = mood === 'sleep';
  const eh = (14 + 5 * t) * (up ? 1.22 : sleep ? 0.6 : 0.88);

  shape(bits, `M-15 -8 L-16 ${-8 - eh} L-2 ${-13 - eh * 0.25} Z`, 1.8);
  shape(bits, `M15 -8 L16 ${-8 - eh} L2 ${-13 - eh * 0.25} Z`, 1.8);
  pen(bits, `M-13 -10 L-13 ${-10 - eh * 0.55} L-6 ${-12 - eh * 0.18}`, 1.1, 0.5);
  pen(bits, `M13 -10 L13 ${-10 - eh * 0.55} L6 ${-12 - eh * 0.18}`, 1.1, 0.5);

  shape(bits, 'M-16 -2 C-17 -13 -9 -19 0 -19 C9 -19 17 -13 16 -2 C15 8 9 14 0 14 C-9 14 -15 8 -16 -2 Z');

  bits.push(<path key="cumak" d="M-3 4 h6 l-3 3 Z" fill="#c96f8a" />);
  pen(bits, 'M0 7 q-3.5 3.5 -7 1.5 M0 7 q3.5 3.5 7 1.5', 1.4);

  const fw = 11 + 6 * t;
  pen(bits, `M-8 4 l${-fw} -2.5 M-8 7 l${-fw} 2.5`, 1.05, 0.65);
  pen(bits, `M8 4 l${fw} -2.5 M8 7 l${fw} 2.5`, 1.05, 0.65);

  if (sleep) {
    pen(bits, 'M-11 -3 q4 4 8 0', 1.7);
    pen(bits, 'M4 -3 q4 4 8 0', 1.7);
  } else {
    const r = up ? 3.4 : 2.8;
    bits.push(
      <ellipse key="ol" cx={-7} cy={-3} rx={r} ry={r * 1.2} fill={INK} />,
      <ellipse key="op" cx={8} cy={-3} rx={r} ry={r * 1.2} fill={INK} />,
      <circle key="jl" cx={-5.8} cy={-4.4} r={1} fill={PAPER} />,
      <circle key="jp" cx={9.2} cy={-4.4} r={1} fill={PAPER} />,
    );
  }
  if (t >= 0.75) pen(bits, 'M-10 -12 q4 -2 7 0 M3 -12 q4 -2 7 0', 1.1, 0.5);
  return bits;
}

/* ---------- sestavení ---------- */

const VIEW_W = 170;
const VIEW_H = 140;

interface PetProps {
  kind: PetKind;
  stage: PetStage;
  mood: PetMood;
  /** šířka v pixelech; výška dopočítá poměr */
  width?: number;
  /** zvýrazňovačový flíček pod packami */
  ground?: boolean;
}

export function Pet({ kind, stage, mood, width = VIEW_W, ground = true }: PetProps) {
  const dog = kind === 'pes';
  const t = (stage - 1) / 4;
  /* tělo roste víc než hlava, takže mládě má velkou hlavu */
  const sb = 0.48 + 0.52 * t;
  const sh = 0.7 + 0.3 * t;
  const gy = 118;
  const cx = 84;

  const hx = cx - (dog ? 21 : 18) * sb - (dog ? 2 : 1) * sh;
  const hy = gy - 47 * sb - (dog ? 11 : 10) * sh + (mood === 'sleep' ? 7 * sh : 0);
  const tilt = mood === 'hop' ? -5 : mood === 'sleep' ? 7 : 0;

  const extra: Bits = [];
  if (mood === 'hop') {
    pen(extra, `M${hx - 30 * sh} ${hy - 26 * sh} l-5 -5 M${hx + 30 * sh} ${hy - 28 * sh} l5 -5`, 1.4, 0.75);
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={width}
      height={(width * VIEW_H) / VIEW_W}
      aria-hidden="true"
    >
      {ground && (
        <rect
          x={cx - 46 * sb} y={gy - 3} width={96 * sb + 14} height={7.5} rx={3.5}
          fill={dog ? '#fbe3a3' : '#f3cdd6'} opacity={0.6}
          transform={`rotate(-1 ${cx} ${gy})`}
        />
      )}
      <g transform={`translate(${cx} ${gy}) scale(${sb})`}>
        {dog ? dogBody(t, mood) : catBody(t, mood)}
      </g>
      <g transform={`translate(${hx} ${hy}) rotate(${tilt}) scale(${sh})`}>
        {dog ? dogHead(t, mood) : catHead(t, mood)}
      </g>
      {extra}
      {mood === 'sleep' && (
        <>
          <text x={hx + 26 * sh} y={hy - 20 * sh} fontFamily="Caveat, cursive" fontSize="16" fill={INK2}>z</text>
          <text x={hx + 34 * sh} y={hy - 31 * sh} fontFamily="Caveat, cursive" fontSize="21" fill={INK2}>z</text>
        </>
      )}
    </svg>
  );
}

export function Bowl({ treats }: { treats: number }) {
  const bits: Bits = [];
  const d = 'M7 18 q18 -5 36 0 l-5 13 q-13 4 -26 0 Z';
  paper(bits, d);
  pen(bits, d, 1.8);
  return (
    <svg viewBox="0 0 50 36" width={50} height={36} aria-hidden="true">
      {treats > 0 && <circle cx={20} cy={16} r={3.4} fill="#f3cdd6" stroke="#c96f8a" strokeWidth={1.1} />}
      {treats > 1 && <circle cx={28} cy={15} r={2.8} fill="#fbe3a3" stroke="#c9a86a" strokeWidth={1.1} />}
      {bits}
    </svg>
  );
}

const MARK_Y: Record<PetStage, number> = { 1: 92, 2: 74, 3: 56, 4: 38, 5: 20 };

/** Dnešní růstové čárky s časem. O půlnoci se vygumují jako všechno ostatní. */
export function GrowthMarks({ marks }: { marks: GrowthMark[] }) {
  const bits: Bits = [];
  pen(bits, 'M7 14 V94', 1.5, 0.8);
  return (
    <svg viewBox="0 0 52 100" width={52} height={100} aria-hidden="true">
      {bits}
      {marks.map((m, i) => {
        const y = MARK_Y[m.stage];
        const last = i === marks.length - 1;
        return (
          <g key={`${m.stage}-${m.at}`}>
            <path d={`M7 ${y} h11`} stroke={INK} strokeWidth={1.7} strokeLinecap="round" opacity={last ? 1 : 0.38} />
            <text x={21} y={y + 4.5} fontFamily="Caveat, cursive" fontSize="13" fill={last ? INK : '#b8b2a6'}>
              {m.at}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
