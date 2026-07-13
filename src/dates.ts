const WEEKDAYS = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
const MONTHS = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
];

/** Lokální datum jako klíč YYYY-MM-DD */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function weekdayName(key: string): string {
  return WEEKDAYS[new Date(`${key}T12:00:00`).getDay()];
}

export function formatCzechDate(key: string): string {
  const d = new Date(`${key}T12:00:00`);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function diffDays(fromKey: string, toKey: string): number {
  const from = Date.UTC(
    Number(fromKey.slice(0, 4)), Number(fromKey.slice(5, 7)) - 1, Number(fromKey.slice(8, 10)),
  );
  const to = Date.UTC(
    Number(toKey.slice(0, 4)), Number(toKey.slice(5, 7)) - 1, Number(toKey.slice(8, 10)),
  );
  return Math.round((to - from) / 86_400_000);
}
