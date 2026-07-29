/* Dočasná kontrola výpočtů mazlíčka. Otevři /koncepty/kontrola.html. Nepatří do buildu. */
import type { Task } from '../src/types';
import {
  applyEvent, currentMood, dayProgress, emptyPet, moodFor, rolloverPet, stageFor, syncGrowth,
} from '../src/pet';
import type { PetData } from '../src/pet';

let seq = 0;
function task(p: Partial<Task> = {}): Task {
  seq += 1;
  return {
    id: `t${seq}`,
    text: `úkol ${seq}`,
    bucket: 'today',
    category: 'work',
    priority: false,
    done: false,
    completedAt: null,
    migrations: 0,
    nudgeDismissed: null,
    subtasks: [],
    createdAt: seq,
    ...p,
  };
}

const NOW = Date.UTC(2026, 6, 29, 10, 0, 0);
const HOUR = 3_600_000;

function on(kind: 'pes' | 'kocka' = 'pes'): PetData {
  const d = emptyPet('2026-07-29', NOW);
  return { ...d, on: true, kind };
}

interface Row { name: string; want: string; got: string }
const rows: Row[] = [];
function check(name: string, want: unknown, got: unknown): void {
  rows.push({ name, want: JSON.stringify(want), got: JSON.stringify(got) });
}

function pct(tasks: Task[]): number {
  return Math.round(dayProgress(tasks) * 100);
}

/* --- růst podle dnešního seznamu --- */
check('prázdný den → 0 %, fáze 1', [0, 1], [pct([]), stageFor(dayProgress([]))]);

const tri = [task(), task(), task()];
check('3 úkoly, 0 hotové → 0 %, fáze 1', [0, 1], [pct(tri), stageFor(dayProgress(tri))]);

const tri1 = [task({ done: true }), task(), task()];
check('3 úkoly, 1 hotový → 33 %, fáze 2', [33, 2], [pct(tri1), stageFor(dayProgress(tri1))]);

const tri2 = [task({ done: true }), task({ done: true }), task()];
check('3 úkoly, 2 hotové → 67 %, fáze 4', [67, 4], [pct(tri2), stageFor(dayProgress(tri2))]);

const tri3 = [task({ done: true }), task({ done: true }), task({ done: true })];
check('3 úkoly, 3 hotové → 100 %, dospělý pes', [100, 5], [pct(tri3), stageFor(dayProgress(tri3))]);

const pet5 = [task({ done: true }), task(), task(), task(), task()];
check('5 úkolů, 1 hotový → 20 %, fáze 2', [20, 2], [pct(pet5), stageFor(dayProgress(pet5))]);

const prio = [task({ priority: true, done: true }), task()];
check('prioritní váží 1,5 → 60 %', 60, pct(prio));

const migr = [task({ migrations: 3, done: true }), task()];
check('3 migrační šipky váží 1,5 → 60 %', 60, pct(migr));

const oba = [task({ priority: true, migrations: 4, done: true }), task(), task()];
check('prioritní a převalovaný váží 2 → 50 %', 50, pct(oba));

const subs = [task({ subtasks: [
  { id: 'a', text: 'a', done: true }, { id: 'b', text: 'b', done: true },
  { id: 'c', text: 'c', done: false }, { id: 'd', text: 'd', done: false },
] })];
check('2 ze 4 podúkolů → 50 %', 50, pct(subs));

const jindy = [task({ done: true }), task({ bucket: 'someday' }), task({ bucket: 'someday' })];
check('„někdy jindy" se nepočítá → 100 %', 100, pct(jindy));

/* --- mazlíček se během dne nezmenší --- */
let d1 = syncGrowth(on(), tri3, NOW);
check('po 3 z 3 je fáze 5', 5, stageFor(d1.today.peak));
d1 = syncGrowth(d1, [...tri3, task(), task()], NOW);
check('přidám 2 úkoly → pořád fáze 5', 5, stageFor(d1.today.peak));

let d2 = syncGrowth(on(), tri2, NOW);
d2 = syncGrowth(d2, tri1, NOW);
check('odškrtnu zpátky → velikost zůstane (fáze 4)', 4, stageFor(d2.today.peak));

/* --- růstové čárky --- */
let d3 = syncGrowth(on(), tri1, NOW, new Date(2026, 6, 29, 9, 40));
d3 = syncGrowth(d3, tri2, NOW, new Date(2026, 6, 29, 11, 15));
d3 = syncGrowth(d3, tri3, NOW, new Date(2026, 6, 29, 13, 20));
check('čárky po jedné: 2 v 9:40, 4 v 11:15, 5 v 13:20',
  [{ stage: 2, at: '9:40' }, { stage: 4, at: '11:15' }, { stage: 5, at: '13:20' }],
  d3.today.marks);

const skok = syncGrowth(on(), tri3, NOW, new Date(2026, 6, 29, 16, 5));
check('skok z ničeho rovnou na 100 % → jedna čárka', [{ stage: 5, at: '16:05' }], skok.today.marks);

/* --- nálada --- */
check('ráno startuje na 60', 60, currentMood(on().today, NOW));
check('útlum 4 za hodinu → po 3 h je 48', 48, currentMood(on().today, NOW + 3 * HOUR));
check('dolní mez je 15, nikdy 0', 15, currentMood(on().today, NOW + 40 * HOUR));

const poLosu = applyEvent(on(), { type: 'play', source: 'scratch' }, NOW);
check('setřený los → +12', 72, currentMood(poLosu.today, NOW));

let hlazeni = on();
for (let i = 0; i < 6; i++) hlazeni = applyEvent(hlazeni, { type: 'play', source: 'stroke' }, NOW);
check('pohlazení 6× → počítají se jen 4 (60 + 24)', 84, currentMood(hlazeni.today, NOW));

let pridano = on();
for (let i = 0; i < 6; i++) pridano = applyEvent(pridano, { type: 'task-added' }, NOW);
check('zadání úkolu 6× → počítají se jen 4 (60 + 20)', 80, currentMood(pridano.today, NOW));

let strop = on();
for (let i = 0; i < 12; i++) strop = applyEvent(strop, { type: 'task-done' }, NOW);
check('nálada nepřeteče přes 100', 100, currentMood(strop.today, NOW));

check('nálada 60 → spokojený', 'ok', moodFor(on().today, NOW, new Date(2026, 6, 29, 14, 0)));
check('nálada 72 po losu → spokojený', 'ok', moodFor(poLosu.today, NOW, new Date(2026, 6, 29, 14, 0)));
check('nálada 84 → rozjívený', 'hop', moodFor(hlazeni.today, NOW, new Date(2026, 6, 29, 14, 0)));
check('po 6 h bez dění (36) → ospalý', 'sleep', moodFor(on().today, NOW + 6 * HOUR, new Date(2026, 6, 29, 16, 0)));
check('po 22. hodině spí, i když je nálada dobrá', 'sleep', moodFor(hlazeni.today, NOW, new Date(2026, 6, 29, 22, 30)));

/* --- vypnutá hra nic nepočítá --- */
const vyp = applyEvent(emptyPet('2026-07-29', NOW), { type: 'play', source: 'scratch' }, NOW);
check('vypnutá hra: nálada se nehýbe', 60, currentMood(vyp.today, NOW));
check('vypnutá hra: růst se nepočítá', 0, syncGrowth(emptyPet('2026-07-29', NOW), tri3, NOW).today.peak);

/* --- ráno nanovo --- */
const vecer = applyEvent(syncGrowth(on('kocka'), tri3, NOW), { type: 'play', source: 'scratch' }, NOW);
const rano = rolloverPet(vecer, '2026-07-30', NOW + 20 * HOUR);
check('nový den → fáze 1', 1, stageFor(rano.today.peak));
check('nový den → nálada zpátky na 60', 60, rano.today.mood);
check('nový den → čárky vygumované', 0, rano.today.marks.length);
check('nový den → hra zůstane zapnutá', true, rano.on);
check('nový den → zvíře zůstane vybrané', 'kocka', rano.kind);
check('stejný den → nic se nemění', true, rolloverPet(vecer, '2026-07-29', NOW) === vecer);

/* --- výpis --- */
const root = document.getElementById('out');
if (root) {
  const bad = rows.filter((r) => r.want !== r.got);
  root.innerHTML =
    `<p class="sum ${bad.length ? 'bad' : 'ok'}">${bad.length ? `${bad.length} z ${rows.length} neprošlo` : `všech ${rows.length} kontrol prošlo`}</p>` +
    '<table>' + rows.map((r) => {
      const pass = r.want === r.got;
      return `<tr class="${pass ? 'p' : 'f'}"><td>${pass ? '✓' : '✗'}</td><td>${r.name}</td><td>${r.got}</td><td>${pass ? '' : r.want}</td></tr>`;
    }).join('') + '</table>';
}
