import { useEffect, useState } from 'react';
import type { PetData, PetKind } from '../pet';
import { moodFor, stageFor } from '../pet';
import { Bowl, GrowthMarks, Pet } from '../petArt';

interface PetStripProps {
  pet: PetData;
  chooseKind: (kind: PetKind) => void;
}

/** Nabídka po prvním zaškrtnutí: kočka, nebo pes? */
function PetSetup({ chooseKind }: { chooseKind: (kind: PetKind) => void }) {
  return (
    <div className="pet-setup">
      <div className="pet-setup-q">Kočka, nebo pes?</div>
      <div className="pet-setup-row">
        <button type="button" onClick={() => chooseKind('kocka')} aria-label="chci kočku">
          <Pet kind="kocka" stage={3} mood="ok" width={136} ground={false} />
          <span>kočka</span>
        </button>
        <button type="button" onClick={() => chooseKind('pes')} aria-label="chci psa">
          <Pet kind="pes" stage={3} mood="ok" width={136} ground={false} />
          <span>pes</span>
        </button>
      </div>
    </div>
  );
}

/** Pruh pod sešitem: růstové čárky, mazlíček, miska. */
export function PetStrip({ pet, chooseKind }: PetStripProps) {
  /* nálada se s hodinami bez dění propadá — stačí ji přepočítat po minutě */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!pet.on) return null;
  if (pet.kind === null) {
    return (
      <div className="pet-strip setup">
        <PetSetup chooseKind={chooseKind} />
      </div>
    );
  }

  const stage = stageFor(pet.today.peak);
  const mood = moodFor(pet.today, now);

  return (
    <div className="pet-strip">
      {pet.today.marks.length > 0 && (
        <div className="pet-marks">
          <GrowthMarks marks={pet.today.marks} />
        </div>
      )}
      <div className="pet-sit">
        <Pet kind={pet.kind} stage={stage} mood={mood} width={190} />
      </div>
      <div className="pet-bowl">
        <Bowl treats={0} />
      </div>
    </div>
  );
}
