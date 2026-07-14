import { seededRng } from './doodles';

export interface ScratchItem {
  text: string;
  /** film u zkomolených hlášek; u zajímavostí prázdné */
  source?: string;
}

/** Zkomolené filmové hlášky ohnuté do světa deníku. */
const HLASKY: ScratchItem[] = [
  // Harry Potter
  { text: 'Bát se svého seznamu úkolů jenom zvětšuje strach ze samotné věci.', source: 'Harry Potter' },
  { text: 'Expecto Odškrtnum!', source: 'Harry Potter' },
  { text: 'Nejsou to naše schopnosti, ale volby, co ukazuje, čím doopravdy jsme — třeba i to, co dáváme na „někdy jindy".', source: 'Harry Potter' },
  { text: 'Napřed žertík, pak podúkoly.', source: 'Harry Potter' },
  { text: 'Neboj se svého seznamu. Říkej mu prostě „ten dnešní".', source: 'Harry Potter' },
  // Star Wars
  { text: 'Ať tě provází síla. A kofein.', source: 'Star Wars' },
  { text: 'Udělej, nebo neudělej. Není žádné „zkusím to zítra".', source: 'Star Wars' },
  { text: 'Tohle nejsou úkoly, které hledáš.', source: 'Star Wars' },
  { text: 'Velikost seznamu neurčuje nic. Podle velikosti soudíš mě?', source: 'Star Wars' },
  { text: 'Já jsem tvůj úkol. A vracím se každou noc, dokud mě neodškrtneš.', source: 'Star Wars' },
  // Hříšný tanec
  { text: 'Nikdo nedává tenhle úkol do kouta.', source: 'Hříšný tanec' },
  { text: 'Měla jsem ten nejúžasnější seznam mého života.', source: 'Hříšný tanec' },
  { text: 'Pojď sem a odškrtni to se mnou — nikdo tě nebude soudit za rytmus.', source: 'Hříšný tanec' },
  // Deník Bridget Jonesové
  { text: 'Milý deníčku, dnes jsem si dala předsevzetí přestat s cigaretami, alkoholem a odkládáním úkolů.', source: 'Deník Bridget Jonesové' },
  { text: 'Mám ráda svůj seznam přesně takový, jaký je.', source: 'Deník Bridget Jonesové' },
  { text: 'Nejsi žádné ošklivé káčátko, jenom máš rozepsaný seznam.', source: 'Deník Bridget Jonesové' },
  { text: 'Rozcuchaný diář, tři nesplněné úkoly a kila navíc — klasické pondělí.', source: 'Deník Bridget Jonesové' },
  // Pravá blondýnka
  { text: 'Co, jako, je snad těžké odškrtnout úkol?', source: 'Pravá blondýnka' },
  { text: 'Jsem blondýna, ale rozhodně nejsem hloupá — na rozdíl od odloženého úkolu.', source: 'Pravá blondýnka' },
  { text: 'Elle Woods by ten úkol zvládla s culíkem v jedné ruce a diářem ve druhé.', source: 'Pravá blondýnka' },
  // podobné romantické a kultovní kousky
  { text: 'Odškrtnuto. To je vše.', source: 'Ďábel nosí Pradu' },
  { text: 'Velká chyba. VELKÁ. Obrovská. (tak akorát pro odložený úkol)', source: 'Pretty Woman' },
  { text: 'Jsem jen holka, co stojí před seznamem a prosí ho, aby se sám odškrtl.', source: 'Notting Hill' },
  { text: 'Úkoly jsou všude kolem nás.', source: 'Láska nebeská' },
  { text: 'Úkoly, úkoly, úkoly — vždycky vtipné, vždycky komické.', source: 'Mamma Mia!' },
  { text: 'Zítra bude přesně stejný den — pokud dnes něco neodškrtneš.', source: 'Na Hromnice' },
  { text: 'Miluju svoje boty skoro tak jako splněný seznam.', source: 'Sex ve městě' },
  { text: 'Nikdy tě nepustím. — úkol, který s sebou táhneš čtvrtý den', source: 'Titanic' },
];

/** Praštěné, ale pravdivé zajímavosti s dovětkem k deníku. */
const FAKTA: ScratchItem[] = [
  { text: 'Vombat je jediné zvíře na světě, které kadí kostičky. I příroda si potrpí na úhledné seznamy.' },
  { text: 'Chobotnice má tři srdce — a dvě z nich si při plavání dávají pauzu. Uč se od chobotnice.' },
  { text: 'Med se nikdy nezkazí. Archeologové ochutnali tři tisíce let starý med z egyptské hrobky. Ten úkol ze středy taky ještě není ztracený.' },
  { text: 'Eiffelovka je v létě až o 15 cm vyšší — roztahuje se teplem. Taky se občas natáhni.' },
  { text: 'Šestadvacet minut spánku zlepšilo pilotům NASA výkon o třetinu. Odškrtni si šlofíka jako splněný úkol.' },
  { text: 'Krávy mají nejlepší kamarádky a bez nich se stresují. Zavolej té svojí.' },
  { text: 'Mravenci netvoří kolony ani v hustém provozu — umí dávat přednost. Seřaď si úkoly po mravenčím způsobu.' },
  { text: 'Stromy si pod zemí posílají cukr přes houbovou síť. I statný dub má podpůrný tým — deleguj.' },
  { text: 'Mořské vydry se při spánku drží za tlapky, aby je neodnesl proud. Drž se večer svého deníku stejně pevně.' },
  { text: 'Tučňák nosí vyvolené oblázky. Každý odškrtnutý úkol je oblázek na tvojí hromádce.' },
  { text: 'Plameňák stojí na jedné noze, protože ho to nestojí žádnou sílu. Najdi si i ty polohu, ve které to jde samo.' },
  { text: 'Banán je bobule, malina není. Kategorie jsou zrádné — tvoje „Práce" a „Osobní" jsou na tom líp.' },
  { text: 'Kolibřík si pamatuje každou květinu, kterou navštívil, a ví, kdy se v ní doplní nektar. Tvůj deník dělá totéž s úkoly.' },
  { text: 'Den se každých sto let natáhne o pár milisekund — Země zpomaluje. Technicky vzato máš času čím dál víc.' },
  { text: 'Hlemýžď má přes deset tisíc zoubků, a stejně jí pomalu. Klidně žvýkej svůj seznam jeho tempem.' },
  { text: 'Jedna včela nasbírá za celý život dvanáctinu lžičky medu. A stejně se to sečte. Malé úkoly platí.' },
  { text: 'Kočka prospí dvě třetiny života a nikdo jí to nevyčítá. Jedno zdřímnutí ti deník odpustí taky.' },
  { text: 'Nejdelší dopravní zácpa světa trvala dvanáct dní. Tvůj úkol na třetí den na tom pořád není nejhůř.' },
  { text: 'Papír prý jde přeložit napůl jen sedmkrát. Rekord je dvanáct — i „nemožné" úkoly mají rezervu.' },
  { text: 'Slon si pamatuje křivdy desítky let. Tvůj deník jen do půlnoci — je milosrdnější.' },
  { text: 'Na Venuši trvá den déle než rok. Když se pondělí vleče, mohlo by být hůř.' },
  { text: 'Lenochod slézá ze stromu jen jednou týdně a má z toho celý obřad. Některé úkoly prostě mají svůj rytmus.' },
  { text: 'Dešťová kapka nemá tvar slzy, spíš housky. Rozepiš velký úkol na podúkoly a taky změní tvar.' },
  { text: 'Mrkev bývala fialová, oranžovou vyšlechtili až Nizozemci. Zaběhnuté věci jdou předělat.' },
  { text: 'Žirafa spí jen kolem čtyř hodin denně a zvládá to celý život. Nezkoušej to po ní — radši se uč od kočky.' },
  { text: 'Horká voda někdy zmrzne rychleji než studená a fyzika dodnes neví jistě proč. Klidně měj i ty v deníku jednu záhadu.' },
  { text: 'Krtek skoro nevidí, a přesto vyhrabe desítky metrů chodeb denně. Nemusíš vidět konec seznamu, stačí hrabat.' },
  { text: 'Oxfordská univerzita je starší než říše Aztéků. Některé věci vydrží — tvůj zítřejší seznam to jistí.' },
];

const POOL: ScratchItem[] = [...HLASKY, ...FAKTA];

/** Pevně zamíchané pořadí (stejné pro všechny dny) — los se neopakuje, dokud se zásobník nevyčerpá. */
function shuffledPool(): ScratchItem[] {
  const rng = seededRng('bujo-scratch-pool-v1');
  const arr = [...POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SHUFFLED = shuffledPool();

export function scratchForDay(dayKey: string): ScratchItem {
  const dayNumber = Math.floor(
    Date.UTC(
      Number(dayKey.slice(0, 4)), Number(dayKey.slice(5, 7)) - 1, Number(dayKey.slice(8, 10)),
    ) / 86_400_000,
  );
  return SHUFFLED[dayNumber % SHUFFLED.length];
}
