import { useEffect, useRef, useState } from 'react';
import type { AppData, Bucket, Category, Task } from './types';
import { todayKey } from './dates';
import { loadData, rollover, saveData } from './store';
import { Page } from './components/Page';
import { DeskDoodles } from './components/Desk';
import type { TaskActions } from './components/TaskRow';

function newId(): string {
  return crypto.randomUUID();
}

export default function App() {
  const [today, setToday] = useState(() => todayKey());
  const [data, setData] = useState<AppData>(() => rollover(loadData(todayKey()), todayKey()));
  const [mobilePage, setMobilePage] = useState<Bucket>('today');
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const t = todayKey();
      if (t !== dataRef.current.lastOpen) {
        setToday(t);
        setData((d) => rollover(d, t));
      }
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const patchTask = (id: string, patch: (t: Task) => Task) => {
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? patch(t) : t)) }));
  };

  const addTask = (bucket: Bucket, category: Category, text: string, priority: boolean) => {
    const task: Task = {
      id: newId(),
      text,
      bucket,
      category,
      priority,
      done: false,
      completedAt: null,
      migrations: 0,
      nudgeDismissed: null,
      subtasks: [],
      createdAt: Date.now(),
    };
    setData((d) => ({ ...d, tasks: [...d.tasks, task] }));
  };

  const actions: TaskActions = {
    toggleTask: (id) =>
      patchTask(id, (t) => {
        const done = !t.done;
        return {
          ...t,
          done,
          completedAt: done ? todayKey() : null,
          subtasks: t.subtasks.map((s) => ({ ...s, done })),
        };
      }),
    toggleSubtask: (taskId, subId) =>
      patchTask(taskId, (t) => {
        const subtasks = t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
        const done = subtasks.length > 0 && subtasks.every((s) => s.done);
        return { ...t, subtasks, done, completedAt: done ? todayKey() : null };
      }),
    addSubtask: (taskId, text) =>
      patchTask(taskId, (t) => ({
        ...t,
        done: false,
        completedAt: null,
        subtasks: [...t.subtasks, { id: newId(), text, done: false }],
      })),
    moveTask: (id) =>
      patchTask(id, (t) => ({
        ...t,
        bucket: t.bucket === 'today' ? 'someday' : 'today',
        migrations: 0,
        nudgeDismissed: null,
      })),
    togglePriority: (id) => patchTask(id, (t) => ({ ...t, priority: !t.priority })),
    deleteTask: (id) => setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) })),
    dismissNudge: (id) => patchTask(id, (t) => ({ ...t, nudgeDismissed: todayKey() })),
  };

  return (
    <div className="desk">
      <nav className="tabs" aria-label="přepínání stránek">
        <button className={mobilePage === 'today' ? 'on' : ''} onClick={() => setMobilePage('today')}>
          dnes
        </button>
        <button className={mobilePage === 'someday' ? 'on' : ''} onClick={() => setMobilePage('someday')}>
          někdy jindy
        </button>
      </nav>
      <div className="desk-inner">
        <DeskDoodles today={today} />
        <div className="book">
        <Page
          bucket="today"
          tasks={data.tasks}
          today={today}
          actions={actions}
          addTask={addTask}
          hiddenOnMobile={mobilePage !== 'today'}
        />
        <Page
          bucket="someday"
          tasks={data.tasks}
          today={today}
          actions={actions}
          addTask={addTask}
          hiddenOnMobile={mobilePage !== 'someday'}
        />
        </div>
      </div>
    </div>
  );
}
