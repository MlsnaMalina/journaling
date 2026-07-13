import { seededRng } from './doodles';

export interface ScratchItem {
  text: string;
  /** film u zkomolených hlášek; u zajímavostí prázdné */
  source?: string;
}

/** Zkomolené filmové hlášky ohnuté do světa deníku. */
const HLASKY: ScratchItem[] = [
  { text: 'Můžeme s pondělkem nesouhlasit, můžeme o něm vést spory, ale to je tak všechno, co se s ním dá dělat.', source: 'Jára Cimrman' },
  { text: 'Kde udělali soudruzi z NDR chybu? Neměli podúkoly.', source: 'Pelíšky' },
  { text: 'Já se vrátím. — tvůj nesplněný úkol, zítra ráno', source: 'Terminátor' },
  { text: 'Život je jako bonboniéra. Úkoly na „někdy jindy" jsou ty s marcipánem — nikdo neví, kdy na ně dojde.', source: 'Forrest Gump' },
  { text: 'Dneska nic neodkládej, nebo se to odstěhuje do Humpolce jako hliník.', source: 'Marečku, podejte mi pero!' },
  { text: 'Ať tě provází síla. A kofein.', source: 'Star Wars' },
  { text: 'Dám ti nabídku, která se neodmítá: pět minut pauzu.', source: 'Kmotr' },
  { text: 'Proletářky všech zemí, odškrtněte se!', source: 'Pelíšky' },
  { text: 'Vezmeš si modrou pilulku a uvěříš, že se úkoly splní samy. Vezmeš si červenou — a otevřeš deník.', source: 'Matrix' },
  { text: 'Úkol nikdy nechodí pozdě. Přichází přesně tehdy, kdy se převalí na dnešek.', source: 'Pán prstenů' },
  { text: 'Myslím, že tohle je začátek krásného seznamu.', source: 'Casablanca' },
  { text: 'Nikdy tě nepustím. — úkol, který s sebou táhneš čtvrtý den', source: 'Titanic' },
  { text: 'Život si vždycky najde cestu. Odložené úkoly taky — zpátky na dnešek.', source: 'Jurský park' },
  { text: 'Nastěnko, hotovo? — Hotovo, dědečku.', source: 'Mrazík' },
  { text: 'Adéla ještě nevečeřela. Taky si to napsala na „někdy jindy".', source: 'Adéla ještě nevečeřela' },
  { text: 'Whisky, to je moje gusto. Ale až po posledním úkolu.', source: 'Limonádový Joe' },
  { text: 'Nejde o to, jak tvrdě škrtáš. Jde o to, kolik ran ti seznam dá — a ty jdeš dál.', source: 'Rocky' },
  { text: 'Jmenuju se Seznam. Úkolový Seznam. Protřepat, neodkládat.', source: 'James Bond' },
  { text: 'Sůl nad zlato. Spánek nad úkoly.', source: 'Sůl nad zlato' },
  { text: 'Tři oříšky pro dnešek: jeden úkol ráno, jeden po obědě a jeden si schovej na zítra.', source: 'Tři oříšky pro Popelku' },
  { text: 'Světlo se najde i v nejtemnějším seznamu. Stačí odškrtnout první úkol.', source: 'Harry Potter' },
  { text: 'Houstone, máme problém. Jmenuje se „někdy jindy".', source: 'Apollo 13' },
  { text: 'Co odškrtneš dnes, o půlnoci se slavně vygumuje. Stihni se pokochat.', source: 'Gladiátor' },
  { text: 'Hasta la vista, úkole.', source: 'Terminátor 2' },
  { text: 'E. T. volat domů. Ty volat mamince — klidně si to napiš jako úkol.', source: 'E. T. Mimozemšťan' },
  { text: 'S tebou mě baví svět. I ten odškrtnutý.', source: 'S tebou mě baví svět' },
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
