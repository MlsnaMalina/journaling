export type Bucket = 'today' | 'someday';
export type Category = 'work' | 'personal';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  text: string;
  bucket: Bucket;
  category: Category;
  priority: boolean;
  done: boolean;
  completedAt: string | null;
  /** kolik nocí se úkol převalil nesplněný (migrační šipky ›) */
  migrations: number;
  /** datum, kdy uživatel odklikl migrační pobídku „nechat" */
  nudgeDismissed: string | null;
  subtasks: Subtask[];
  createdAt: number;
}

export interface AppData {
  tasks: Task[];
  lastOpen: string;
}

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'work', label: 'Práce' },
  { key: 'personal', label: 'Osobní' },
];
