import type { Category } from '../types';

const SEGMENTS = [
  'M30,30 L30,4 A26,26 0 0 1 48.4,11.6 Z',
  'M30,30 L48.4,11.6 A26,26 0 0 1 56,30 Z',
  'M30,30 L56,30 A26,26 0 0 1 48.4,48.4 Z',
  'M30,30 L48.4,48.4 A26,26 0 0 1 30,56 Z',
  'M30,30 L30,56 A26,26 0 0 1 11.6,48.4 Z',
  'M30,30 L11.6,48.4 A26,26 0 0 1 4,30 Z',
  'M30,30 L4,30 A26,26 0 0 1 11.6,11.6 Z',
  'M30,30 L11.6,11.6 A26,26 0 0 1 30,4 Z',
];

const COLORS: Record<Category, { fill: string; stroke: string }> = {
  work: { fill: '#fbe3a3', stroke: '#c9a86a' },
  personal: { fill: '#f3cdd6', stroke: '#c96f8a' },
};

interface PieProps {
  category: Category;
  done: number;
  total: number;
  label: string;
}

export function Pie({ category, done, total, label }: PieProps) {
  const filled = total === 0 ? 0 : Math.round((done / total) * SEGMENTS.length);
  const c = COLORS[category];
  return (
    <div className="pie" title={`${label}: ${done}/${total}`}>
      <svg width="44" height="44" viewBox="0 0 60 60" style={{ transform: 'rotate(-4deg)' }} role="img" aria-label={`${label}: hotovo ${done} z ${total}`}>
        {SEGMENTS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={i < filled ? c.fill : '#fdfdfb'}
            stroke={i < filled ? c.stroke : '#b8b2a6'}
            strokeWidth="1"
          />
        ))}
      </svg>
      <span className="pie-label">{label.toLowerCase()}</span>
    </div>
  );
}
