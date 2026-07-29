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
  if (at.getHours() >= NIGHT_HOUR) return 'sleep';
  const m = currentMood(day, now);
  if (m >= 75) return 'hop';
  if (m >= 45) return 'ok';
  return 'sleep';
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

/** Hraní a splněné úkoly zvedají náladu. Růst se počítá jinde, v syncGrowth. */
export function applyEvent(data: PetData, ev: PetEvent, now: number): PetData {
  if (!data.on) return data;
  switch (ev.type) {
    case 'task-done':
      return bump(data, MOOD_GAIN.done, now);
    case 'all-done':
      return bump(data, MOOD_GAIN.allDone, now);
    case 'task-added': {
      if (data.today.plays.added >= PLAY_LIMIT.added) return bump(data, 0, now);
      const next = bump(data, MOOD_GAIN.added, now);
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

function isPlayCounts(v: unknown): v is PlayCounts {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return ['scratch', 'scribble', 'stroke', 'added'].every((k) => typeof p[k] === 'number');
}

function isPetData(v: unknown): v is PetData {
  if (typeof v !== 'object' || v === null) return false;
  const d = v as Record<string, unknown>;
  if (typeof d.on !== 'boolean') return false;
  if (d.kind !== null && d.kind !== 'pes' && d.kind !== 'kocka') return false;
  const t = d.today as Record<string, unknown> | undefined;
  if (typeof t !== 'object' || t === null) return false;
  return (
    typeof t.day === 'string' &&
    typeof t.peak === 'number' &&
    typeof t.mood === 'number' &&
    typeof t.lastActivity === 'number' &&
    Array.isArray(t.marks) &&
    isPlayCounts(t.plays)
  );
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
    },
  };
}

export function loadPet(today: string, now: number): PetData {
  if (IS_DEMO) return demoPet(today, now);
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isPetData(parsed)) return rolloverPet(parsed, today, now);
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
