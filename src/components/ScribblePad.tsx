import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

const KEY = 'bujo-scribble-v1';

interface Saved {
  day: string;
  img: string;
}

const TOOLS = [
  { color: '#8a8a8a', width: 1.6, alpha: 0.9, label: 'tužka' },
  { color: '#f2c1cc', width: 6, alpha: 0.5, label: 'růžový zvýrazňovač' },
  { color: '#fbe3a3', width: 6, alpha: 0.5, label: 'žlutý zvýrazňovač' },
  { color: '#cfe0d4', width: 6, alpha: 0.5, label: 'zelený zvýrazňovač' },
];

function loadSaved(day: string): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' && parsed !== null &&
      (parsed as Saved).day === day && typeof (parsed as Saved).img === 'string'
    ) {
      return (parsed as Saved).img;
    }
  } catch {
    /* poškozené čmáranice — začneme s čistým stolem */
  }
  return null;
}

/** Čmárací koutek: celý stůl kolem sešitu; o půlnoci se vygumuje. */
export function ScribblePad({ today }: { today: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState(0);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const todayRef = useRef(today);
  todayRef.current = today;

  const redrawFrom = (img: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const image = new Image();
    image.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.drawImage(image, 0, 0, canvas.width / dpr, canvas.height / dpr);
    };
    image.src = img;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    let mounted = false;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(parent.clientWidth * dpr);
      const h = Math.round(parent.clientHeight * dpr);
      if (w === 0 || h === 0 || (canvas.width === w && canvas.height === h)) return;
      const snapshot = mounted ? canvas.toDataURL('image/png') : loadSaved(todayRef.current);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (snapshot) redrawFrom(snapshot);
      mounted = true;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // nový den: stůl se gumuje spolu s hotovými úkoly
    if (loadSaved(today) === null) {
      localStorage.removeItem(KEY);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [today]);

  const persist = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ day: today, img: canvas.toDataURL('image/png') }));
    } catch {
      /* plné úložiště — čmáranice prostě nepřežije reload */
    }
  };

  const point = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    last.current = point(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext('2d');
    if (!ctx) return;
    const p = point(e);
    const t = TOOLS[tool];
    ctx.strokeStyle = t.color;
    ctx.lineWidth = t.width;
    ctx.lineCap = 'round';
    ctx.globalAlpha = t.alpha;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    persist();
  };

  const wipe = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem(KEY);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="scribble-canvas"
        aria-label="čmárací plocha kolem sešitu"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      <div className="scribble-tools">
        {TOOLS.map((t, i) => (
          <button
            key={t.label}
            className={`swatch${tool === i ? ' on' : ''}`}
            style={{ background: t.color }}
            title={t.label}
            aria-label={t.label}
            aria-pressed={tool === i}
            onClick={() => setTool(i)}
          />
        ))}
        <button className="wipe" onClick={wipe}>
          vygumovat stůl
        </button>
      </div>
    </>
  );
}
