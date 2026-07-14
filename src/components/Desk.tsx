import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { WashiTape, pickBottomTool, pickDoodles, seededRng, PALETTES } from '../doodles';
import type { PaletteKey } from '../doodles';

const SLOTS: CSSProperties[] = [
  { left: -4, top: 120 },
  { right: -6, top: 170 },
  { left: 0, top: '62%' },
  { right: -2, bottom: 64 },
];

interface Manifest {
  files: string[];
}

/** Vlastní malůvky: obrázky ve složce public/doodles vyjmenované v manifest.json */
function useCustomDoodles(): string[] {
  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => {
    fetch('/doodles/manifest.json')
      .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : { files: [] }))
      .then((m) => setFiles(Array.isArray(m.files) ? m.files : []))
      .catch(() => setFiles([]));
  }, []);
  return files;
}

export function DeskDoodles({ today }: { today: string }) {
  const custom = useCustomDoodles();
  const rng = seededRng(`${today}-desk`);
  const palKeys = Object.keys(PALETTES) as PaletteKey[];
  const tapeA = palKeys[Math.floor(rng() * palKeys.length)];
  let tapeB = palKeys[Math.floor(rng() * palKeys.length)];
  if (tapeB === tapeA) tapeB = palKeys[(palKeys.indexOf(tapeA) + 2) % palKeys.length];

  const picked = pickDoodles(today, SLOTS.length);
  const tool = pickBottomTool(today);

  const slotNodes = SLOTS.map((style, i) => {
    const customIndex = i - (SLOTS.length - Math.min(custom.length, 2));
    if (customIndex >= 0 && custom[customIndex]) {
      return (
        <div key={`custom-${customIndex}`} className="margin-doodle side" style={style}>
          <img src={`/doodles/${custom[customIndex]}`} alt="" width={76} />
        </div>
      );
    }
    const d = picked[i];
    return (
      <div key={d.key} className="margin-doodle side" style={style}>
        {d.node}
      </div>
    );
  });

  return (
    <>
      <div className="margin-doodle doodle-tape-a">
        <WashiTape pal={tapeA} pattern="dots" rotate={-3} />
      </div>
      <div className="margin-doodle doodle-tape-b">
        <WashiTape pal={tapeB} pattern="dashes" rotate={2} />
      </div>
      {slotNodes}
      <div className="margin-doodle doodle-tool">{tool.node}</div>
    </>
  );
}
