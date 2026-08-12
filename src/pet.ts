import type { Task } from './types';
import { IS_DEMO } from './demo';

export type PetKind = 'pes' | 'kocka';
/** rozjívený · spokojený · ospalý */
export type PetMood = 'hop' | 'ok' | 'sleep';
export type PetStage = 1 | 2 | 3 | 4 | 5;

/** Čárka na veřejích: v kolik hodin mazlíček povyrostl. Platí jen pro dnešek. */
export interface GrowthMark {
  stage: PetStage;
  /** HH:MM */
  at: string;
}

/** Kolikrát už dnešní hraní zvedlo náladu — každý zdroj má svůj strop. */
export interface PlayCounts {
  scratch: number;
  scribble: number;
  stroke: number;
  added: number;
}

/** Stav, který se každou půlnoc gumuje. */
export interface PetDay {
  day: string;
  /** nejvyšší dnešní podíl splněného (0–1); během dne nikdy neklesá */
  peak: number;
  /** nálada 0–100 v okamžiku poslední události */
  mood: number;
  /** kdy se naposledy něco stalo (ms) — z toho se počítá útlum */
  lastActivity: number;
  marks: GrowthMark[];
  plays: PlayCounts;
  /** kolik porcí čeká v misce (0–3) */
  treats: number;
  /** do kdy (ms) má mazlíček radost — vrtí ocasem, olizuje se */
  cheerUntil: number;
}

export interface PetData {
  /** zaškrtnuté políčko „Hra" — přetrvává přes noc */
  on: boolean;
  /** vybrané zvíře — přetrvává přes noc */
  kind: PetKind | null;
  today: PetDay;
}

export type PetEvent =
  | { type: 'task-done' }
  | { type: 'task-added' }
  | { type: 'all-done' }
  /** mazlíček spolkl jednu porci z misky */
  | { type: 'eat' }
  | { type: 'play'; source: 'scratch' | 'scribble' | 'stroke' };

const KEY = 'bujo-pet-v1';

const MOOD_START = 60;
const MOOD_MIN = 15;
const MOOD_MAX = 100;
/** o kolik nálada klesne za každou celou hodinu, kdy se nic nedělo */
const MOOD_DECAY_PER_HOUR = 4;

const MOOD_GAIN = {
  scratch: 12,
  scribble: 8,
  stroke: 6,
  added: 5,
  done: 4,
  allDone: 10,
} as const;

/** stropy, aby se nálada nedala vytočit opakováním jedné věci */
const PLAY_LIMIT: PlayCounts = { scratch: 1, scribble: 2, stroke: 4, added: 4 };

/** do misky se vejdou tři porce */
export const TREATS_MAX = 3;
/** jak dlouho má mazlíček radost ze splněného úkolu (ms) */
const CHEER_MS = 5_000;
const CHEER_ALL_MS = 9_000;

/** hranice fází podle podílu splněného z dnešního seznamu */
const STAGE_BREAKS = [0.35, 0.65, 1] as const;

/** po téhle hodině mazlíček spí, ať je nálada jakákoli */
const NIGHT_HOUR = 22;

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Čas jako 9:40 — bez nuly na začátku, jak se píše česky. */
export function timeLabel(now: Date = new Date()): string {
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function freshDay(day: string, now: number): PetDay {
  return {
    day,
    peak: 0,
    mood: MOOD_START,
    lastActivity: now,
    marks: [],
    plays: { scratch: 0, scribble: 0, stroke: 0, added: 0 },
    treats: 0,
    cheerUntil: 0,
  };
}

export function emptyPet(day: string, now: number): PetData {
  return { on: false, kind: null, today: freshDay(day, now) };
}

/**
 * Váha úkolu. Prioritní a dlouho převalované úkoly jsou těžší,
 * takže se za ně mazlíček nají víc. Váhy mění jen mezikroky —
 * odškrtnuté všechno je vždycky 100 %.
 */
export function taskWeight(t: Task): number {
  return 1 + (t.priority ? 0.5 : 0) + (t.migrations >= 3 ? 0.5 : 0);
}

/** Jak je úkol hotový: 0–1. Podúkoly si dělí váhu rodiče. */
export function taskPortion(t: Task): number {
  if (t.done) return 1;
  if (t.subtasks.length === 0) return 0;
  return t.subtasks.filter((s) => s.done).length / t.subtasks.length;
}

/** Podíl splněného z dnešní stránky (0–1). Prázdný den je 0. */
export function dayProgress(tasks: Task[]): number {
  let total = 0;
  let done = 0;
  for (const t of tasks) {
    if (t.bucket !== 'today') continue;
    const w = taskWeight(t);
    total += w;
    done += w * taskPortion(t);
  }
  return total === 0 ? 0 : done / total;
}

export function stageFor(peak: number): PetStage {
  if (peak <= 0) return 1;
  if (peak < STAGE_BREAKS[0]) return 2;
  if (peak < STAGE_BREAKS[1]) return 3;
  if (peak < STAGE_BREAKS[2]) return 4;
  return 5;
}

/** Nálada teď: uložená hodnota zmenšená o útlum za hodiny bez dění. */
export function currentMood(day: PetDay, now: number): number {
  const idleHours = Math.floor(Math.max(0, now - day.lastActivity) / 3_600_000);
  return clamp(day.mood - idleHours * MOOD_DECAY_PER_HOUR, MOOD_MIN, MOOD_MAX);
}

export function moodFor(day: PetDay, now: number, at: Date = new Date()): PetMood {
  /* radost ze splněného úkolu přebije všechno ostatní, i noc */
  if (now < day.cheerUntil) return 'hop';
  if (at.getHours() >= NIGHT_HOUR) return 'sleep';
  const m = currentMood(day, now);
  if (m >= 75) return 'hop';
  if (m >= 45) return 'ok';
  return 'sleep';
}

/** Má právě radost? Podle toho se vrtí ocasem / olizuje. */
export function isCheering(day: PetDay, now: number): boolean {
  return now < day.cheerUntil;
}

function bump(data: PetData, gain: number, now: number): PetData {
  return {
    ...data,
    today: {
      ...data.today,
      mood: clamp(currentMood(data.today, now) + gain, MOOD_MIN, MOOD_MAX),
      lastActivity: now,
    },
  };
}

function addTreat(data: PetData, n: number): PetData {
  return { ...data, today: { ...data.today, treats: Math.min(TREATS_MAX, data.today.treats + n) } };
}

function cheer(data: PetData, ms: number, now: number): PetData {
  return { ...data, today: { ...data.today, cheerUntil: Math.max(data.today.cheerUntil, now + ms) } };
}

/** Hraní a splněné úkoly zvedají náladu. Růst se počítá jinde, v syncGrowth. */
export function applyEvent(data: PetData, ev: PetEvent, now: number): PetData {
  if (!data.on) return data;
  switch (ev.type) {
    case 'task-done':
      /* splněný úkol = jídlo do misky, radost a lepší nálada */
      return cheer(addTreat(bump(data, MOOD_GAIN.done, now), 1), CHEER_MS, now);
    case 'all-done':
      return cheer(bump(data, MOOD_GAIN.allDone, now), CHEER_ALL_MS, now);
    case 'eat':
      if (data.today.treats <= 0) return data;
      return { ...data, today: { ...data.today, treats: data.today.treats - 1 } };
    case 'task-added': {
      /* pamlsek za plánování spadne do misky vždy, nálada jen do stropu */
      const withTreat = addTreat(data, 1);
      if (data.today.plays.added >= PLAY_LIMIT.added) return bump(withTreat, 0, now);
      const next = bump(withTreat, MOOD_GAIN.added, now);
      return { ...next, today: { ...next.today, plays: { ...next.today.plays, added: next.today.plays.added + 1 } } };
    }
    case 'play': {
      const src = ev.source;
      if (data.today.plays[src] >= PLAY_LIMIT[src]) return bump(data, 0, now);
      const next = bump(data, MOOD_GAIN[src], now);
      return { ...next, today: { ...next.today, plays: { ...next.today.plays, [src]: next.today.plays[src] + 1 } } };
    }
  }
}

/**
 * Srovná růst s dnešním seznamem. Mazlíček nikdy během dne nezmenší —
 * když přibude nový úkol, podíl spadne, ale velikost zůstane.
 */
export function syncGrowth(data: PetData, tasks: Task[], now: number, at: Date = new Date()): PetData {
  if (!data.on) return data;
  const peak = Math.max(data.today.peak, dayProgress(tasks));
  if (peak === data.today.peak) return data;

  const before = stageFor(data.today.peak);
  const after = stageFor(peak);
  /* Čárka se dělá jen tam, kde se mazlíček opravdu změřil. Když přeskočí
     víc fází naráz, je to jedna čárka na výšce, kde skončil. */
  const marks = after > before
    ? [...data.today.marks, { stage: after, at: timeLabel(at) }]
    : data.today.marks;
  return { ...data, today: { ...data.today, peak, marks, lastActivity: now } };
}

/** Ráno se mazlíček rodí znovu. Zůstane jen zapnutá hra a vybrané zvíře. */
export function rolloverPet(data: PetData, today: string, now: number): PetData {
  if (data.today.day === today) return data;
  return { on: data.on, kind: data.kind, today: freshDay(today, now) };
}

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function readPlays(v: unknown): PlayCounts {
  const p = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  return {
    scratch: num(p.scratch, 0),
    scribble: num(p.scribble, 0),
    stroke: num(p.stroke, 0),
    added: num(p.added, 0),
  };
}

function readMarks(v: unknown): GrowthMark[] {
  if (!Array.isArray(v)) return [];
  return v.filter((m): m is GrowthMark => {
    if (typeof m !== 'object' || m === null) return false;
    const g = m as Record<string, unknown>;
    return typeof g.at === 'string' && typeof g.stage === 'number' && g.stage >= 1 && g.stage <= 5;
  });
}

/**
 * Načtení uloženého stavu. Chybějící políčka se dopočítají, ne odmítnou —
 * po přidání nové vlastnosti nesmí uživatelka přijít o vybrané zvíře.
 */
function readPet(v: unknown, now: number): PetData | null {
  if (typeof v !== 'object' || v === null) return null;
  const d = v as Record<string, unknown>;
  const t = (typeof d.today === 'object' && d.today !== null ? d.today : null) as Record<string, unknown> | null;
  if (t === null || typeof t.day !== 'string') return null;
  return {
    on: d.on === true,
    kind: d.kind === 'pes' || d.kind === 'kocka' ? d.kind : null,
    today: {
      day: t.day,
      peak: num(t.peak, 0),
      mood: num(t.mood, MOOD_START),
      lastActivity: num(t.lastActivity, now),
      marks: readMarks(t.marks),
      plays: readPlays(t.plays),
      treats: num(t.treats, 0),
      cheerUntil: num(t.cheerUntil, 0),
    },
  };
}

/** Ukázkový režim: mazlíček je rozkoukaný a dobře naložený, nic se neukládá. */
function demoPet(day: string, now: number): PetData {
  return {
    on: true,
    kind: 'pes',
    today: {
      day,
      peak: 0.5,
      mood: 78,
      lastActivity: now,
      marks: [{ stage: 2, at: '9:40' }, { stage: 3, at: '11:15' }],
      plays: { scratch: 1, scribble: 0, stroke: 1, added: 2 },
      treats: 2,
      cheerUntil: 0,
    },
  };
}

export function loadPet(today: string, now: number): PetData {
  if (IS_DEMO) return demoPet(today, now);
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = readPet(JSON.parse(raw) as unknown, now);
      if (parsed !== null) return rolloverPet(parsed, today, now);
    }
  } catch {
    /* poškozená data — mazlíček se prostě narodí znovu */
  }
  return emptyPet(today, now);
}

export function savePet(data: PetData): void {
  if (IS_DEMO) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* plné úložiště — hra přežije jen do reloadu */
  }
}
