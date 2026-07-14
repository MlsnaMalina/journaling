import type { Bucket, Category, Task } from '../types';
import { CATEGORIES } from '../types';
import { formatCzechDate, weekdayName } from '../dates';
import { Pie } from './Pie';
import { Section } from './Section';
import type { TaskActions } from './TaskRow';

interface PageProps {
  bucket: Bucket;
  tasks: Task[];
  today: string;
  actions: TaskActions;
  addTask: (bucket: Bucket, category: Category, text: string, priority: boolean) => void;
  hiddenOnMobile: boolean;
}

function spaced(word: string): string {
  return word.split('').join(' ');
}

export function Page({ bucket, tasks, today, actions, addTask, hiddenOnMobile }: PageProps) {
  const pageTasks = tasks.filter((t) => t.bucket === bucket);
  const allDone = bucket === 'today' && pageTasks.length > 0 && pageTasks.every((t) => t.done);

  const pies = CATEGORIES.map((c) => {
    const list = pageTasks.filter((t) => t.category === c.key);
    return (
      <Pie
        key={c.key}
        category={c.key}
        done={list.filter((t) => t.done).length}
        total={list.length}
        label={c.label}
      />
    );
  });

  return (
    <div className={`page ${bucket}${hiddenOnMobile ? ' m-hidden' : ''}`}>
      {bucket === 'today' ? (
        <>
          <div className="pies">{pies}</div>
          <div className="tape">{spaced(weekdayName(today))}</div>
          <div className="date">{formatCzechDate(today)}</div>
        </>
      ) : (
        <>
          <div className="tape tilt">{spaced('někdy')}&nbsp;&nbsp;{spaced('jindy')}</div>
          <div className="pies inline">{pies}</div>
        </>
      )}

      {CATEGORIES.map((c) => (
        <Section
          key={c.key}
          bucket={bucket}
          category={c.key}
          label={c.label}
          tasks={pageTasks.filter((t) => t.category === c.key)}
          today={today}
          actions={actions}
          addTask={addTask}
        />
      ))}

      {allDone && (
        <div className="stamp" aria-label="všechny dnešní úkoly hotové">
          hotovo!
        </div>
      )}
    </div>
  );
}
