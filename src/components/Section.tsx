import { useState } from 'react';
import type { Bucket, Category, Task } from '../types';
import { sortSection } from '../store';
import { TaskRow, type TaskActions } from './TaskRow';

interface SectionProps {
  bucket: Bucket;
  category: Category;
  label: string;
  tasks: Task[];
  today: string;
  actions: TaskActions;
  addTask: (bucket: Bucket, category: Category, text: string, priority: boolean) => void;
}

export function Section({ bucket, category, label, tasks, today, actions, addTask }: SectionProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(false);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    addTask(bucket, category, t, priority);
    setText('');
    setPriority(false);
  };

  return (
    <section className={`cat-section ${category}`}>
      <h3 className={`cat ${category}`}>
        <b aria-hidden="true" />
        {label}
      </h3>
      {sortSection(tasks).map((t) => (
        <TaskRow key={t.id} task={t} today={today} actions={actions} />
      ))}
      <div className="add-row">
        <span className="add-plus" aria-hidden="true">+</span>
        <input
          className="add-input"
          placeholder={bucket === 'today' ? 'nový úkol na dnešek…' : 'nový úkol na někdy…'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <button
          className={`add-star${priority ? ' on' : ''}`}
          title="založit jako prioritu"
          aria-label="založit jako prioritu"
          aria-pressed={priority}
          onClick={() => setPriority(!priority)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M7 1 L8.6 5 L13 5.3 L9.6 8 L10.8 12.4 L7 9.9 L3.2 12.4 L4.4 8 L1 5.3 L5.4 5 Z"
              fill={priority ? '#e8a63c' : 'none'}
              stroke={priority ? 'none' : '#c9c2b2'}
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
