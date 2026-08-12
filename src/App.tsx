import { useEffect, useRef, useState } from 'react';
import type { AppData, Bucket, Category, Task } from './types';
import { todayKey } from './dates';
import { loadData, rollover, saveData } from './store';
import { IS_DEMO } from './demo';
import { Page } from './components/Page';
import { DeskDoodles } from './components/Desk';
import { ScribblePad } from './components/ScribblePad';
import { ScratchCard } from './components/ScratchCard';
import { GameToggle } from './components/GameToggle';
import { PetStrip } from './components/PetStrip';
import type { PetData, PetEvent, PetKind } from './pet';
import { applyEvent, loadPet, rolloverPet, savePet, syncGrowth } from './pet';
import type { TaskActions } from './components/TaskRow';

function newId(): string {
  return crypto.randomUUID();
}

/** Je všechno na dnešní stránce odškrtnuté? (razítko hotovo!) */
function allTodayDone(tasks: Task[]): boolean {
  const today = tasks.filter((t) => t.bucket === 'today');
  return today.length > 0 && today.every((t) => t.done);
}

export default function App() {
  const [today, setToday] = useState(() => todayKey());
  const [data, setData] = useState<AppData>(() => rollover(loadData(todayKey()), todayKey()));
  const [mobilePage, setMobilePage] = useState<Bucket>('today');
  const [pet, setPet] = useState<PetData>(() => loadPet(todayKey(), Date.now()));
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    savePet(pet);
  }, [pet]);

  /* po otevření deníku dorovnáme růst na dnešní stav — třeba u úkolů,
     které se přes noc převalily rozdělané */
  useEffect(() => {
    setPet((p) => syncGrowth(p, dataRef.current.tasks, Date.now()));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const t = todayKey();
      if (t !== dataRef.current.lastOpen) {
        setToday(t);
        setData((d) => rollover(d, t));
        setPet((p) => rolloverPet(p, t, Date.now()));
      }
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleGame = () =>
    setPet((p) => {
      const on = !p.on;
      /* při zapnutí dorovnáme růst na dnešní stav, ať mazlíček nezačíná od nuly */
      return on ? syncGrowth({ ...p, on }, dataRef.current.tasks, Date.now()) : { ...p, on };
    });
  const chooseKind = (kind: PetKind) =>
    setPet((p) => syncGrowth({ ...p, kind }, dataRef.current.tasks, Date.now()));
  const eat = () => setPet((p) => applyEvent(p, { type: 'eat' }, Date.now()));

  /**
   * Každá změna úkolů projde tudy: deník se uloží a mazlíčkovi se hned
   * přepočítá růst, spadne mu do misky porce a zaraduje se.
   */
  const mutate = (change: (d: AppData) => AppData, event?: PetEvent) => {
    const before = dataRef.current;
    const next = change(before);
    dataRef.current = next;
    setData(next);

    const now = Date.now();
    const stamped = allTodayDone(next.tasks) && !allTodayDone(before.tasks);
    setPet((p) => {
      let np = event ? applyEvent(p, event, now) : p;
      if (stamped) np = applyEvent(np, { type: 'all-done' }, now);
      return syncGrowth(np, next.tasks, now);
    });
  };

  const patchTask = (id: string, patch: (t: Task) => Task, event?: PetEvent) => {
    mutate((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? patch(t) : t)) }), event);
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
    mutate((d) => ({ ...d, tasks: [...d.tasks, task] }), { type: 'task-added' });
  };

  const actions: TaskActions = {
    toggleTask: (id) => {
      const was = dataRef.current.tasks.find((t) => t.id === id)?.done === true;
      patchTask(
        id,
        (t) => {
          const done = !t.done;
          return {
            ...t,
            done,
            completedAt: done ? todayKey() : null,
            subtasks: t.subtasks.map((s) => ({ ...s, done })),
          };
        },
        was ? undefined : { type: 'task-done' },
      );
    },
    toggleSubtask: (taskId, subId) => {
      const parent = dataRef.current.tasks.find((t) => t.id === taskId);
      const was = parent?.done === true;
      let becameDone = false;
      patchTask(taskId, (t) => {
        const subtasks = t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
        const done = subtasks.length > 0 && subtasks.every((s) => s.done);
        becameDone = done && !was;
        return { ...t, subtasks, done, completedAt: done ? todayKey() : null };
      });
      /* dokrmíme až když odškrtnutý podúkol dorazil celý úkol */
      if (becameDone) setPet((p) => applyEvent(p, { type: 'task-done' }, Date.now()));
    },
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
    deleteTask: (id) => mutate((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) })),
    dismissNudge: (id) => patchTask(id, (t) => ({ ...t, nudgeDismissed: todayKey() })),
  };

  return (
    <div className="desk">
      {IS_DEMO && <div className="demo-badge" role="note">ukázková verze · data jsou smyšlená</div>}
      <nav className="tabs" aria-label="přepínání stránek">
        <button className={mobilePage === 'today' ? 'on' : ''} onClick={() => setMobilePage('today')}>
          dnes
        </button>
        <button className={mobilePage === 'someday' ? 'on' : ''} onClick={() => setMobilePage('someday')}>
          někdy jindy
        </button>
      </nav>
      <div className={`desk-inner${pet.on ? ' with-pet' : ''}`}>
        <GameToggle on={pet.on} toggle={toggleGame} />
        <ScribblePad today={today} />
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
        <ScratchCard today={today} />
        <PetStrip pet={pet} chooseKind={chooseKind} eat={eat} />
        </div>
      </div>
    </div>
  );
}
