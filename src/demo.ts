import type { AppData, Task } from './types';

/** Ukázkový režim — aktivuje se přes ?demo v URL. Data jsou smyšlená a nikam se neukládají. */
export const IS_DEMO = new URLSearchParams(window.location.search).has('demo');

interface DemoSpec {
  text: string;
  bucket: Task['bucket'];
  category: Task['category'];
  priority?: boolean;
  done?: boolean;
  migrations?: number;
  subtasks?: { text: string; done: boolean }[];
}

const SPECS: DemoSpec[] = [
  // dnes · práce
  { text: 'Poslat nabídku novému klientovi', bucket: 'today', category: 'work', priority: true },
  {
    text: 'Připravit podklady na poradu',
    bucket: 'today',
    category: 'work',
    subtasks: [
      { text: 'vytisknout tabulku', done: true },
      { text: 'doplnit čísla za červen', done: false },
    ],
  },
  { text: 'Zavolat do banky kvůli termínu', bucket: 'today', category: 'work', migrations: 2 },
  { text: 'Odpovědět na e-maily', bucket: 'today', category: 'work', done: true },
  // dnes · osobní
  { text: 'Objednat dort na sobotní oslavu', bucket: 'today', category: 'personal', priority: true },
  { text: 'Vyzvednout balík na poště', bucket: 'today', category: 'personal' },
  { text: 'Roztřídit fotky z dovolené', bucket: 'today', category: 'personal', migrations: 3 },
  { text: 'Zalít kytky', bucket: 'today', category: 'personal', done: true },
  // někdy jindy · práce
  { text: 'Zaktualizovat ceník na webu', bucket: 'someday', category: 'work' },
  { text: 'Vymyslet vánoční akci pro klienty', bucket: 'someday', category: 'work' },
  // někdy jindy · osobní
  {
    text: 'Naplánovat víkendový výlet',
    bucket: 'someday',
    category: 'personal',
    subtasks: [
      { text: 'vybrat místo', done: true },
      { text: 'zarezervovat ubytování', done: false },
    ],
  },
  { text: 'Vybrat dárek pro tetu', bucket: 'someday', category: 'personal' },
  { text: 'Dočíst rozečtenou knížku', bucket: 'someday', category: 'personal' },
];

/** Sestaví ukázkový stav deníku — vždy čerstvý, ať návštěvník vidí zaplněnou dvoustranu. */
export function demoData(today: string): AppData {
  const base = Date.now() - SPECS.length * 60_000;
  const tasks: Task[] = SPECS.map((s, i) => ({
    id: `demo-${i + 1}`,
    text: s.text,
    bucket: s.bucket,
    category: s.category,
    priority: s.priority ?? false,
    done: s.done ?? false,
    completedAt: s.done ? today : null,
    migrations: s.migrations ?? 0,
    nudgeDismissed: null,
    subtasks: (s.subtasks ?? []).map((sub, j) => ({
      id: `demo-${i + 1}-${j + 1}`,
      text: sub.text,
      done: sub.done,
    })),
    createdAt: base + i * 60_000,
  }));
  return { tasks, lastOpen: today };
}
