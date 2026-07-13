import type { AppData, Task } from './types';
import { diffDays } from './dates';

const KEY = 'bujo-todo-v1';

export function loadData(fallbackDay: string): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed === 'object' && parsed !== null &&
        Array.isArray((parsed as AppData).tasks) &&
        typeof (parsed as AppData).lastOpen === 'string'
      ) {
        return parsed as AppData;
      }
    }
  } catch {
    /* poškozená data — začneme s čistou stránkou */
  }
  return { tasks: [], lastOpen: fallbackDay };
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/**
 * Denní úklid: hotové úkoly se vygumují, nesplněným úkolům na „dnes"
 * přibudou migrační šipky za každou přespanou noc.
 */
export function rollover(data: AppData, today: string): AppData {
  if (data.lastOpen === today) return data;
  const nights = Math.max(1, diffDays(data.lastOpen, today));
  const tasks = data.tasks
    .filter((t) => !t.done)
    .map((t): Task => (
      t.bucket === 'today' ? { ...t, migrations: t.migrations + nights } : t
    ));
  return { tasks, lastOpen: today };
}

/** Řazení v sekci: priorita nahoře, hotové (přeškrtnuté) dole, jinak dle vzniku. */
export function sortSection(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (!a.done && a.priority !== b.priority) return a.priority ? -1 : 1;
    return a.createdAt - b.createdAt;
  });
}
