import { useState } from 'react';
import type { Task } from '../types';

export interface TaskActions {
  toggleTask: (id: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  addSubtask: (taskId: string, text: string) => void;
  moveTask: (id: string) => void;
  togglePriority: (id: string) => void;
  deleteTask: (id: string) => void;
  dismissNudge: (id: string) => void;
}

interface TaskRowProps {
  task: Task;
  today: string;
  actions: TaskActions;
}

function Star({ active }: { active: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M7 1 L8.6 5 L13 5.3 L9.6 8 L10.8 12.4 L7 9.9 L3.2 12.4 L4.4 8 L1 5.3 L5.4 5 Z"
        fill={active ? '#e8a63c' : 'none'}
        stroke={active ? 'none' : '#c9c2b2'}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 6.5 L5 9.5 L10 2.5" stroke="#7a8f6d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TaskRow({ task, today, actions }: TaskRowProps) {
  const [folded, setFolded] = useState(false);
  const [addingSub, setAddingSub] = useState(false);
  const [subText, setSubText] = useState('');

  const hasSubs = task.subtasks.length > 0;
  const doneSubs = task.subtasks.filter((s) => s.done).length;
  const showNudge =
    task.bucket === 'today' && !task.done && task.migrations >= 3 && task.nudgeDismissed !== today;
  const moveLabel = task.bucket === 'today' ? '⇢ jindy' : '⇠ dnes';

  const submitSub = () => {
    const text = subText.trim();
    if (text) actions.addSubtask(task.id, text);
    setSubText('');
    setAddingSub(false);
  };

  return (
    <div className="task-group">
      <div className={`task-row${task.done ? ' done' : ''}`}>
        <button
          className="box"
          aria-label={task.done ? 'vrátit úkol' : 'odškrtnout úkol'}
          onClick={() => actions.toggleTask(task.id)}
        >
          {task.done && <Check />}
        </button>
        <span className={`txt${task.done ? ' done' : ''}`}>
          {task.migrations > 0 && !task.done && (
            <span className="mig" title={`převaluje se ${task.migrations + 1}. den`}>
              {'›'.repeat(Math.min(task.migrations, 4))}
            </span>
          )}
          <span className={task.priority ? 'hl' : undefined}>{task.text}</span>
          {task.priority && (
            <span className="star-inline">
              {' '}
              <Star active />
            </span>
          )}
          <span className="strike" />
        </span>
        {hasSubs && <span className="frac">{doneSubs}/{task.subtasks.length}</span>}
        {hasSubs && (
          <button
            className={`fold${folded ? ' folded' : ''}`}
            aria-label={folded ? 'rozbalit podúkoly' : 'sbalit podúkoly'}
            onClick={() => setFolded(!folded)}
          >
            ▾
          </button>
        )}
        <span className="row-tools">
          <button
            className="tool"
            title={task.priority ? 'zrušit prioritu' : 'označit jako prioritu'}
            aria-label="priorita"
            onClick={() => actions.togglePriority(task.id)}
          >
            <Star active={task.priority} />
          </button>
          <button
            className="tool"
            title="přidat podúkol"
            aria-label="přidat podúkol"
            onClick={() => {
              setFolded(false);
              setAddingSub(true);
            }}
          >
            +
          </button>
          <button className="tool" title="vygumovat úkol" aria-label="smazat úkol" onClick={() => actions.deleteTask(task.id)}>
            ×
          </button>
        </span>
        <button className="move" onClick={() => actions.moveTask(task.id)}>
          {moveLabel}
        </button>
      </div>

      {hasSubs && !folded && (
        <div className="subs">
          {task.subtasks.map((s) => (
            <div key={s.id} className={`task-row sub${s.done ? ' done' : ''}`}>
              <button
                className="box"
                aria-label={s.done ? 'vrátit podúkol' : 'odškrtnout podúkol'}
                onClick={() => actions.toggleSubtask(task.id, s.id)}
              >
                {s.done && <Check />}
              </button>
              <span className={`txt${s.done ? ' done' : ''}`}>
                {s.text}
                <span className="strike" />
              </span>
            </div>
          ))}
        </div>
      )}

      {addingSub && (
        <div className="subs">
          <input
            className="add-input sub-input"
            autoFocus
            placeholder="podúkol…"
            value={subText}
            onChange={(e) => setSubText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitSub();
              if (e.key === 'Escape') {
                setSubText('');
                setAddingSub(false);
              }
            }}
            onBlur={submitSub}
          />
        </div>
      )}

      {showNudge && (
        <div className="nudge">
          <span>
            tenhle úkol s sebou táhneš už {task.migrations + 1}. den —
          </span>
          <button onClick={() => actions.moveTask(task.id)}>⇢ někdy jindy</button>
          <button onClick={() => actions.deleteTask(task.id)}>vygumovat</button>
          <button onClick={() => actions.dismissNudge(task.id)}>nechat</button>
        </div>
      )}
    </div>
  );
}
