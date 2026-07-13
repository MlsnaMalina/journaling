import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { scratchForDay } from '../scratch';

const KEY = 'bujo-scratch-v1';
const W = 240;
const H = 130;

function loadRevealed(day: string): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return (
      typeof parsed === 'object' && parsed !== null &&
      (parsed as { day: string }).day === day &&
      (parsed as { revealed: boolean }).revealed === true
    );
  } catch {
    return false;
  }
}

/** Stírací los pod sešitem: každý den nová hláška nebo zajímavost. */
export function ScratchCard({ today }: { today: string }) {
  const item = scratchForDay(today);
  const [revealed, setRevealed] = useState(() => loadRevealed(today));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scratching = useRef(false);

  useEffect(() => {
    setRevealed(loadRevealed(today));
  }, [today]);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#c9c4b8';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#b3ada0';
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 2, 1);
    }
    ctx.font = "600 21px Caveat, cursive";
    ctx.fillStyle = '#7d7768';
    ctx.textAlign = 'center';
    ctx.fillText('setři mě', W / 2, H / 2 + 7);
    ctx.font = "13px 'Patrick Hand', cursive";
    ctx.fillText('dnešní los', W / 2, 20);
  }, [revealed, today]);

  const scratch = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) * W) / r.width;
    const y = ((e.clientY - r.top) * H) / r.height;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const checkRevealed = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, W, H).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (clear / total > 0.55) {
      setRevealed(true);
      localStorage.setItem(KEY, JSON.stringify({ day: today, revealed: true }));
    }
  };

  return (
    <div className="scratch-slot">
      <div className="scratch-under">
        <div className="scratch-text">{item.text}</div>
        {item.source && <div className="scratch-src">~ {item.source} ~</div>}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className={`scratch-cover${revealed ? ' gone' : ''}`}
        aria-label="stírací los — táhni myší a setři vrstvu"
        onPointerDown={(e) => {
          scratching.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={(e) => {
          if (scratching.current) scratch(e);
        }}
        onPointerUp={() => {
          scratching.current = false;
          checkRevealed();
        }}
        onPointerCancel={() => {
          scratching.current = false;
        }}
      />
    </div>
  );
}
