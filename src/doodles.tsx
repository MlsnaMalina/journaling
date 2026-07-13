import type { JSX } from 'react';

export interface Palette {
  fill: string;
  stroke: string;
  dark: string;
}

export type PaletteKey = 'blue' | 'pink' | 'green' | 'yellow';

export const PALETTES: Record<PaletteKey, Palette> = {
  blue: { fill: '#cfe0ec', stroke: '#6f93ad', dark: '#7f97a8' },
  pink: { fill: '#f3cdd6', stroke: '#c96f8a', dark: '#d98ba0' },
  green: { fill: '#cfe0d4', stroke: '#6f9a7c', dark: '#7fa68c' },
  yellow: { fill: '#fbe3a3', stroke: '#c9a86a', dark: '#d9b65c' },
};

type DoodleRender = (p: Palette) => JSX.Element;

function Hrnek(p: Palette): JSX.Element {
  return (
    <svg width="76" height="68" viewBox="0 0 90 80" aria-hidden="true">
      <path d="M38 20 C36 14 42 14 40 8 M50 20 C48 14 54 14 52 8" stroke="#b9c4cc" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M30 28 H60 V46 C60 56 53 62 45 62 C37 62 30 56 30 46 Z" fill={p.fill} stroke={p.stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M60 34 C70 32 70 48 59 46" stroke={p.stroke} strokeWidth="1.8" fill="none" />
      <path d="M45 48 C40 43 42 36 45 39 C48 36 50 43 45 48 Z" fill={p.stroke === '#c96f8a' ? '#e8c56a' : '#e8a0ae'} />
      <path d="M26 68 H64" stroke="#b9c4cc" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Sponka(p: Palette): JSX.Element {
  return (
    <svg width="70" height="64" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(14 45 40)">
        <path d="M36 16 V56 A10 10 0 0 0 56 56 V22 A7 7 0 0 0 42 22 V52 A4 4 0 0 0 50 52 V26" stroke={p.stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Nuzky(): JSX.Element {
  return (
    <svg width="70" height="64" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(-8 45 40)">
        <path d="M45 42 L35 12" stroke="#8a9aa5" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M45 42 L55 12" stroke="#a8b6bf" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="45" cy="43" r="2.4" fill="#d98ba0" />
        <circle cx="36" cy="58" r="7" fill="#f3cdd6" stroke="#c96f8a" strokeWidth="2" />
        <circle cx="54" cy="58" r="7" fill="#f3cdd6" stroke="#c96f8a" strokeWidth="2" />
        <path d="M45 45 L38 52 M45 45 L52 52" stroke="#c96f8a" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Knizky(): JSX.Element {
  return (
    <svg width="80" height="70" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(-2 45 56)">
        <rect x="18" y="52" width="54" height="11" rx="2" fill="#cfe0d4" stroke="#6f9a7c" strokeWidth="1.8" />
        <path d="M64 52 V63" stroke="#6f9a7c" strokeWidth="1.4" />
      </g>
      <g transform="rotate(1.5 45 44)">
        <rect x="23" y="40" width="46" height="11" rx="2" fill="#f3cdd6" stroke="#c96f8a" strokeWidth="1.8" />
        <path d="M28 40 V51" stroke="#c96f8a" strokeWidth="1.4" />
      </g>
      <g transform="rotate(-1 45 32)">
        <rect x="21" y="28" width="49" height="11" rx="2" fill="#fbe3a3" stroke="#c9a86a" strokeWidth="1.8" />
        <path d="M62 28 V39" stroke="#c9a86a" strokeWidth="1.4" />
      </g>
      <path d="M40 22 C42 18 48 18 50 22" stroke="#b9c4cc" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Papirek(p: Palette): JSX.Element {
  return (
    <svg width="72" height="66" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(3 45 42)">
        <path d="M28 24 H62 V54 L52 64 H28 Z" fill={p.fill} stroke={p.dark} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M62 54 L52 54 L52 64" fill={p.dark} fillOpacity="0.45" stroke={p.dark} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M34 34 H55 M34 41 H55 M34 48 H47" stroke={p.stroke} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Znamka(p: Palette): JSX.Element {
  const holes: JSX.Element[] = [];
  for (const y of [26, 36, 46, 56]) {
    holes.push(<circle key={`l${y}`} cx="26" cy={y} r="2.6" fill="#ffffff" />);
    holes.push(<circle key={`r${y}`} cx="64" cy={y} r="2.6" fill="#ffffff" />);
  }
  for (const x of [36, 46, 56]) {
    holes.push(<circle key={`t${x}`} cx={x} cy="20" r="2.6" fill="#ffffff" />);
    holes.push(<circle key={`b${x}`} cx={x} cy="64" r="2.6" fill="#ffffff" />);
  }
  return (
    <svg width="72" height="66" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(-3 45 42)">
        <rect x="26" y="20" width="38" height="44" fill={p.fill} stroke={p.stroke} strokeWidth="1.6" />
        {holes}
        <rect x="33" y="28" width="24" height="28" fill="#fdfdfb" stroke={p.stroke} strokeWidth="1.2" />
        <circle cx="40" cy="37" r="3.4" fill="#f0d9a0" />
        <path d="M33 52 C38 44 42 48 46 42 C50 47 54 45 57 49 L57 56 H33 Z" fill="#b7c9a8" />
      </g>
    </svg>
  );
}

function Polaroid(): JSX.Element {
  return (
    <svg width="72" height="66" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(-5 45 42)">
        <rect x="26" y="16" width="38" height="48" rx="1.5" fill="#fdfdfb" stroke="#c2bcae" strokeWidth="1.6" />
        <rect x="30" y="20" width="30" height="30" fill="#dce6ec" />
        <circle cx="39" cy="29" r="4" fill="#f0d9a0" />
        <path d="M30 46 C36 38 41 42 46 36 C51 42 56 40 60 44 L60 50 H30 Z" fill="#b7c9a8" />
        <path d="M36 58 H54" stroke="#c2bcae" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function WashiRolka(p: Palette): JSX.Element {
  return (
    <svg width="76" height="66" viewBox="0 0 90 80" aria-hidden="true">
      <circle cx="38" cy="42" r="17" fill={p.fill} stroke={p.stroke} strokeWidth="1.8" />
      <circle cx="38" cy="42" r="6.5" fill="#ffffff" stroke={p.stroke} strokeWidth="1.6" />
      <path d="M54 34 H74 L70 40 L74 46 L70 52 L74 58 H54" fill={p.fill} stroke={p.stroke} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="30" cy="33" r="1.7" fill={p.stroke} />
      <circle cx="47" cy="36" r="1.7" fill={p.stroke} />
      <circle cx="31" cy="51" r="1.7" fill={p.stroke} />
      <circle cx="45" cy="53" r="1.7" fill={p.stroke} />
      <circle cx="62" cy="42" r="1.7" fill={p.stroke} />
      <circle cx="62" cy="52" r="1.7" fill={p.stroke} />
    </svg>
  );
}

function Zarovka(): JSX.Element {
  return (
    <svg width="66" height="62" viewBox="0 0 90 80" aria-hidden="true">
      <path d="M45 8 V14 M24 18 L28 22 M66 18 L62 22 M18 38 H24 M66 38 H72" stroke="#d9b65c" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="45" cy="38" r="13" fill="#fbe3a3" stroke="#c9a86a" strokeWidth="1.8" />
      <path d="M40 44 L45 36 L50 44" stroke="#c9a86a" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="39" y="51" width="12" height="10" rx="2.5" fill="#b9c4cc" stroke="#8a9aa5" strokeWidth="1.6" />
      <path d="M40 55 H50 M40 58 H50" stroke="#8a9aa5" strokeWidth="1.2" />
    </svg>
  );
}

function Obalka(p: Palette): JSX.Element {
  return (
    <svg width="76" height="64" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(2 45 44)">
        <rect x="22" y="28" width="46" height="32" rx="3" fill={p.fill} stroke={p.stroke} strokeWidth="1.8" />
        <path d="M23 30 L45 46 L67 30" stroke={p.stroke} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <path d="M45 56 C41 52 42.5 46.5 45 49 C47.5 46.5 49 52 45 56 Z" fill={p.stroke} />
      </g>
    </svg>
  );
}

function Hvezdicky(): JSX.Element {
  return (
    <svg width="70" height="64" viewBox="0 0 90 80" aria-hidden="true">
      <path transform="translate(34 30)" d="M0 -11 C2 -2 2 -2 11 0 C2 2 2 2 0 11 C-2 2 -2 2 -11 0 C-2 -2 -2 -2 0 -11 Z" fill="#f0d9a0" stroke="#c9a86a" strokeWidth="1.4" strokeLinejoin="round" />
      <path transform="translate(58 46)" d="M0 -7 C1.3 -1.3 1.3 -1.3 7 0 C1.3 1.3 1.3 1.3 0 7 C-1.3 1.3 -1.3 1.3 -7 0 C-1.3 -1.3 -1.3 -1.3 0 -7 Z" fill="#f3cdd6" stroke="#c96f8a" strokeWidth="1.3" strokeLinejoin="round" />
      <path transform="translate(40 58)" d="M0 -5 C1 -1 1 -1 5 0 C1 1 1 1 0 5 C-1 1 -1 1 -5 0 C-1 -1 -1 -1 0 -5 Z" fill="#cfe0ec" stroke="#6f93ad" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="56" cy="24" r="1.8" fill="#d98ba0" />
      <circle cx="66" cy="32" r="1.5" fill="#c9a86a" />
      <circle cx="28" cy="50" r="1.5" fill="#7f97a8" />
    </svg>
  );
}

function Zvyraznovac(p: Palette): JSX.Element {
  const swipe = p === PALETTES.yellow ? '#f3cdd6' : '#fbe3a3';
  return (
    <svg width="80" height="66" viewBox="0 0 90 80" aria-hidden="true">
      <g transform="rotate(-4 45 40)">
        <rect x="24" y="32" width="36" height="13" rx="2" fill={p.fill} stroke={p.stroke} strokeWidth="1.8" />
        <rect x="60" y="30" width="14" height="17" rx="3" fill={p.dark} stroke={p.stroke} strokeWidth="1.8" />
        <path d="M24 34 L13 38.5 L24 43 Z" fill="#e8cfc0" stroke={p.stroke} strokeWidth="1.6" strokeLinejoin="round" />
      </g>
      <rect x="20" y="58" width="46" height="7" rx="2" fill={swipe} transform="rotate(-1.5 43 61)" />
    </svg>
  );
}

function Tuzka(): JSX.Element {
  return (
    <svg width="110" height="28" viewBox="0 0 120 30" aria-hidden="true">
      <g transform="rotate(-2 60 15)">
        <rect x="14" y="11" width="80" height="9" rx="2" fill="#f0d9a0" stroke="#c9a86a" strokeWidth="1.2" />
        <path d="M94 11 L108 15.5 L94 20 Z" fill="#e8cfc0" stroke="#c9a86a" strokeWidth="1.2" />
        <path d="M103 14.2 L108 15.5 L103 16.9 Z" fill="#3a3a3a" />
        <rect x="8" y="11" width="6" height="9" fill="#e8a0ae" />
      </g>
    </svg>
  );
}

export function WashiTape({ pal, pattern, rotate }: { pal: PaletteKey; pattern: 'dots' | 'dashes'; rotate: number }): JSX.Element {
  const p = PALETTES[pal];
  return (
    <svg width="70" height="26" viewBox="0 0 70 26" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)`, opacity: 0.92 }}>
      <rect x="2" y="4" width="66" height="18" fill={p.fill} />
      {pattern === 'dots' ? (
        <>
          <circle cx="12" cy="10" r="1.6" fill={p.dark} />
          <circle cx="24" cy="16" r="1.6" fill={p.dark} />
          <circle cx="36" cy="9" r="1.6" fill={p.dark} />
          <circle cx="48" cy="15" r="1.6" fill={p.dark} />
          <circle cx="60" cy="10" r="1.6" fill={p.dark} />
        </>
      ) : (
        <path d="M8 13 L14 13 M20 13 L26 13 M32 13 L38 13 M44 13 L50 13 M56 13 L62 13" stroke={p.dark} strokeWidth="1.6" />
      )}
    </svg>
  );
}

interface DoodleDef {
  key: string;
  render: DoodleRender;
  variants: PaletteKey[];
}

export const DOODLE_POOL: DoodleDef[] = [
  { key: 'hrnek', render: Hrnek, variants: ['blue', 'pink', 'green'] },
  { key: 'sponka', render: Sponka, variants: ['blue', 'pink'] },
  { key: 'nuzky', render: () => Nuzky(), variants: ['pink'] },
  { key: 'knizky', render: () => Knizky(), variants: ['blue'] },
  { key: 'papirek', render: Papirek, variants: ['yellow', 'pink', 'blue'] },
  { key: 'znamka', render: Znamka, variants: ['blue', 'green', 'pink'] },
  { key: 'polaroid', render: () => Polaroid(), variants: ['blue'] },
  { key: 'washi-rolka', render: WashiRolka, variants: ['green', 'pink', 'blue'] },
  { key: 'zarovka', render: () => Zarovka(), variants: ['yellow'] },
  { key: 'obalka', render: Obalka, variants: ['pink', 'blue', 'yellow'] },
  { key: 'hvezdicky', render: () => Hvezdicky(), variants: ['yellow'] },
];

export const BOTTOM_TOOLS: DoodleDef[] = [
  { key: 'tuzka', render: () => Tuzka(), variants: ['yellow'] },
  { key: 'zvyraznovac', render: Zvyraznovac, variants: ['pink', 'blue', 'green'] },
];

/** mulberry32 — deterministický RNG, aby výběr malůvek držel celý den */
export function seededRng(seedText: string): () => number {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PickedDoodle {
  key: string;
  node: JSX.Element;
}

export function pickDoodles(seedText: string, count: number): PickedDoodle[] {
  const rng = seededRng(seedText);
  const shuffled = [...DOODLE_POOL].sort(() => rng() - 0.5);
  return shuffled.slice(0, count).map((d) => {
    const pal = d.variants[Math.floor(rng() * d.variants.length)];
    return { key: d.key, node: d.render(PALETTES[pal]) };
  });
}

export function pickBottomTool(seedText: string): PickedDoodle {
  const rng = seededRng(`${seedText}-tool`);
  const d = BOTTOM_TOOLS[Math.floor(rng() * BOTTOM_TOOLS.length)];
  const pal = d.variants[Math.floor(rng() * d.variants.length)];
  return { key: d.key, node: d.render(PALETTES[pal]) };
}
