import { Check } from './TaskRow';

/** Zaškrtávací políčko „Hra" — stejné čtverečko jako u úkolů. */
export function GameToggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <div className="game-toggle">
      <button
        type="button"
        className="box"
        onClick={toggle}
        aria-pressed={on}
        aria-label="hra s mazlíčkem"
      >
        {on && <Check />}
      </button>
      <span>Hra</span>
    </div>
  );
}
