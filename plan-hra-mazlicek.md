# Plán: hra „mazlíček" (tamagoči) v deníku

Stav: **verze 2 — zapracovaná tvoje rozhodnutí.** Nic zatím není naprogramované.

---

## 1. Co to má umět (zadání)

- V deníku přibude zaškrtávací políčko **Hra**.
- Po zaškrtnutí si vyberu **kočku, nebo psa** → objeví se koťátko / štěňátko.
- **Splněný úkol = jídlo** → mazlíček roste.
- **Nový zadaný úkol** = menší bonus pro vývoj.
- **Prokrastinace** (stírací los, čmárání) = **hraní si s mazlíčkem** → lepší nálada.
- Když se nic neděje, je mazlíček **malý a schoulený**. **Nikdy neumře.**

---

## 2. Odsouhlasená rozhodnutí

1. **Mazlíček se každé ráno rodí znovu.** Žádný přenos mezi dny, žádný dluh.
2. **Bydlí v pruhu pod sešitem**, přechází sem a tam a přesahuje do sešitu tam,
   kde je místo. Koláče pokroku zůstávají.
3. **Bonusy do první verze:** reakce na splněný úkol (pes zavrtí ocasem, kočka se
   olízne) · růstové čárky · reakce na to, co se v deníku děje.
4. **Mazlíček nikdy nemluví.** Žádné hlášky, bubliny ani lístečky. Je to vedlejší
   funkce a vizuální odměna — všechno sděluje postojem, ušima a ocasem.
5. **Vybraný vzhled: koncept A — tužková malůvka.** Grafit `#6b6459`, dvojitá linka,
   žádná výplň, zvýrazňovačový flíček pod packami. Kresba se během dne sama dokresluje:
   srst na hrudi → šrafování na zádech → rozčepýřený ocas. **Žádné obojky ani rolničky.**
6. **Nic nepřetrvává přes noc kromě nastavení.** Napříč dny zůstane jen zaškrtnuté
   políčko *Hra* a volba kočka/pes. Růstové čárky ukazují **jen dnešek** — čas, kdy
   mazlíček povyrostl — a o půlnoci se vygumují jako všechno ostatní.

---

## 3. Proč je denní restart lepší nápad než dlouhodobý mazlíček

Je to lepší, a to ze tří důvodů:

**Sedí to na pravidla deníku.** Hotové úkoly se o půlnoci gumují, čmáranice na stole
taky, los je denní. Všechno v téhle appce žije jeden den. Mazlíček, který si pamatuje
tři týdny, by byl jediná věc, co přetrvává — a působil by cize.

**Splní to zadání líp než původní návrh.** Chtěla jsi, aby zvířátko bylo „smutné
a malé", když se nic neplní. S denním restartem to vyjde samo: v den, kdy nic neuděláš,
zůstane mrně a k večeru podřimuje. Žádný trest, žádné chřadnutí — prostě nevyrostlo.

**Je to výrazně jednodušší a bezpečnější.** Odpadá počítání útlumu za dny nepřítomnosti
a nemůže se stát, že se po dovolené vrátíš k vyhublému psovi. Navíc je to přesně ten
vzorec, co už v kódu je: los i čmáranice si ukládají `{ den, stav }` a při změně dne
se resetují. Mazlíček bude třetí v řadě.

**Co se tím ztrácí:** dlouhý oblouk „za měsíc mám velkého psa". Je to vědomá cena
za to, že hra nikdy nezačne vyčítat.

**Co zůstává napříč dny:** jen zaškrtnuté políčko *Hra* (je to nastavení, ne úkol —
nebudeš ho zaškrtávat každé ráno) a volba kočka/pes, kterou jde přehodit.
Všechno ostatní je ráno čerstvé, mazlíčka nevyjímaje.

---

## 4. Herní pravidla (denní měřítko)

### Dvě čísla

| | **Růst** (velikost) | **Nálada** |
|---|---|---|
| roste z | podílu splněného z dnešního seznamu | hraní — los, čmárání, hlazení |
| klesá | **nikdy během dne** | pomalu, když se dlouho nic neděje |
| vidíš to na | fázi mazlíčka (1–5) | živosti, uších, ocasu, postoji |
| ráno | zpátky na štěňátko | zpátky na klidnou střední hodnotu |

### Růst se měří proti dnešnímu seznamu, ne pevnou stupnicí

Mazlíček nesbírá body do nějaké tabulky. Roste podle toho, **jak daleko jsi
v dnešním dni** — tři úkoly ráno, tři odškrtnuté odpoledne, dospělý pes.
Osm úkolů ráno, tři odškrtnuté, je zhruba v půlce. Je to vlastně živý koláč pokroku.

### Fáze růstu

| fáze | pes / kočka | hotovo z dnešního seznamu |
|---|---|---|
| 1 | štěňátko / koťátko | 0 % — ráno, ještě nic |
| 2 | neposeda | do 34 % |
| 3 | rošťák | 35–64 % |
| 4 | dorostenec | 65–99 % |
| 5 | **dospělý pes / kočka** | 100 % — všechno na dnes hotové |

Při třech úkolech to vypadá takhle: 1 hotový → neposeda · 2 hotové → dorostenec ·
3 hotové → dospělý pes. Skáče to o fázi, což je dobře — je to pořádně vidět.

### Ne všechny úkoly váží stejně

| | váha |
|---|---|
| obyčejný úkol | 1 |
| prioritní (hvězdička) | 1,5 |
| úkol se třemi a více migračními šipkami | 1,5 |
| prioritní a zároveň převalovaný | 2 |
| podúkoly | dělí si váhu rodiče, takže roste i po částech |

Váhy mění jen mezikroky. Odškrtnuté všechno je vždy 100 %, ať mají úkoly váhu jakou chtějí.

### Když přidáš úkol, mazlíček se nezmenší

Nový úkol zvětší jmenovatele, takže by podíl spadl dolů. Proto **růst nikdy během dne
neklesá** — mazlíček zůstane ve velikosti, kterou už dosáhl. Platí to i když omylem
odškrtneš a zase odškrtneš.

Znamená to ale, že zadání úkolu nemůže být bonus na velikost — v poměrovém měřítku
by šel proti sobě. **Bonus za zadání se proto projeví jinak:** do misky spadne
pamlsek (vidíš, že se má na co těšit) a mazlíček se okamžitě rozzáří — plus na náladě.
Je to jediný způsob, jak můžou obě pravidla platit zároveň.

### Nálada (0–100, ráno startuje na 60)

Nahoru: setřený los +12 (1× denně) · čmárání +8 (max 2× denně) · pohlazení +6
(max 4× denně) · zadání nového úkolu +5 · splněný úkol +4 · razítko *hotovo!* +10.

Dolů: −4 za každou hodinu, kdy se vůbec nic nestalo. **Dolní hranice 15.**

Tři podoby: **rozjívený** (75+) — ušiska vzhůru, poskakuje · **spokojený** (45–74) —
sedí, občas mrkne · **ospalý** (pod 45) — schoulený, hlava na packách.

### Dva okrajové případy

- **Prázdný den** (žádné úkoly): mazlíček zůstane štěňátko a sedí u prázdné misky.
- **Přidáš úkol, když už byl dospělý:** zůstane dospělý, jen v misce přibude pamlsek.

### Aby to nešlo obejít ani omylem rozbít

- Odškrtnout a znovu odškrtnout nic nepřidá.
- Smazaný úkol mazlíčka nezmenší.
- Ukázkový režim `?demo`: mazlíček je ve fázi 3, dobře naložený, nic se neukládá.

---

## 5. Kde bude a jak se pohybuje

**Zapínací políčko „Hra"** — ručně kreslené čtverečko stejné jako u úkolů, popisek
krasopisem. Zaškrtnutím se poprvé objeví výběr *kočka / pes*, pak už se jen zapíná
a vypíná koutek.

**Pruh pod sešitem**, který zdola přesahuje do spodního okraje stránek. Mazlíček má
několik **sedátek**: na stole vlevo, na stole vpravo, na spodním okraji levé stránky,
na spodním okraji pravé stránky, na hřbetu uprostřed. Každých pár minut se zvedne,
přejde jinam a znovu si sedne.

**Jak pozná, kde je místo:** nebude nic měřit v prohlížeči — jednoduše se podívá,
kolik úkolů daná stránka má. Zaplněná stránka svoje sedátko zamkne a mazlíček tam
nevleze. Levné, spolehlivé, nikdy nesedí na textu.

**Nepřekáží:** klikací je jen jeho vlastní tělíčko (na pohlazení), zbytek pruhu
propouští čmárání skrz.

**Na mobilu:** stejný pruh, přilepený dole; stránce se přidá spodní odsazení,
aby nic nezakrýval. Hlazení prstem funguje stejně — a na telefonu je to jediný
způsob hraní, protože los ani čmárání se pod 980 px nezobrazují.

---

## 6. Reakce (všechny beze slov)

| kdy | co udělá |
|---|---|
| odškrtnu úkol | pamlsek přiletí od řádku do misky, mazlíček přiběhne a sní ho |
| po jídle — **pes** | zavrtí ocasem |
| po jídle — **kočka** | olízne si packu a přejede si po uchu |
| přejdu do další fáze | protáhne se a přibude dnešní růstová čárka s časem |
| razítko *hotovo!* | poskočí a zůstane rozjívený |
| dnes ještě nic nezadaného | sedí u prázdné misky a kouká na sešit |
| úkol se převaluje potřetí | dojde k té stránce a kouká na ten řádek |
| dlouho se nic neděje | schoulí se, hlava na packy, uši dolů |
| po desáté večer | spí (jen dýchá) |

---

## 7. Postup práce

Každý krok je samostatný, jde ho vidět a otestovat.

**Krok 1 — návrhy vzhledu** ⏸ *čeká se na tvůj výběr*
Tři opravdu odlišné koncepty jako živý náhled: kočka i pes, fáze 2 a 4, nálada
rozjívená i ospalá, plus jak vypadá pruh pod sešitem. Nic dalšího se nedělá, dokud
si nevybereš. Mazlíček musí být kreslený **stejným perem** jako malůvky v okrajích —
tenká linka, čtyři schválené barvy — jinak bude v deníku cizí.

**Krok 2 — základ pod kapotou** (není vidět)
Pravidla, výpočty, denní ukládání `bujo-pet-v1` ve tvaru `{ den, zvíře, sousta, nálada }`.

**Krok 3 — zapnutí hry**
Políčko *Hra*, výběr zvířete, mazlíček se objeví a sedí. Zkouška na telefonu.

**Krok 4 — krmení a růst**
Napojení na odškrtnutí a na zadání úkolu, letící pamlsek, přechody mezi fázemi,
růstové čárky na veřejích.

**Krok 5 — nálada, hraní a přecházení**
Los, čmárání a hlazení. Tři podoby nálady. Sedátka a přecházení mezi nimi.

**Krok 6 — reakce a doladění**
Zbytek tabulky z kapitoly 6, sladění na 375 px, vypnutí animací pro
`prefers-reduced-motion`, README.

**Krok 7 — nasazení a zkouška naostro**
Push → Vercel → živá adresa na telefonu: zapnout hru, vybrat zvíře, splnit úkol,
setřít los, pohladit.

---

## 8. Co se bude měnit v kódu

**Nové soubory:** `src/pet.ts` (pravidla, výpočty, ukládání) ·
`src/petArt.tsx` (kresba po dílech) · `src/components/PetStrip.tsx` (pruh, sedátka,
přecházení) · `src/components/PetSetup.tsx` (kočka / pes).

**Úpravy:** `App.tsx` (stav hry, políčko, napojení akcí) · `ScratchCard.tsx`
a `ScribblePad.tsx` (ohlásí „hrálo se") · `styles.css` · `README.md`.

Data deníku (`bujo-todo-v1`) se **nemění ani nerozšiřují** — hra má vlastní klíč,
takže kdyby se na ní cokoli pokazilo, deník to nepocítí.

**K rozsahu kresby:** 5 fází × 3 nálady × 2 zvířata by bylo 30 obrázků. Místo toho
5 tělíček na zvíře (10 celkem) a nálada se řeší vyměnitelnýma ušima, očima a úhlem
ocasu plus nakloněním — ne novými obrázky.

---

## 9. Na co si dát pozor

1. **Bude to první „živá" kresba v appce**, kde jsou jinak jen geometrické papírnické
   malůvky. Musí být nakreslený stejnou linkou a stejnými barvami, jinak bude působit
   jako cizí nálepka. Proto jsou návrhy vzhledu první krok.
2. **Nesmí překážet.** Pohyblivá věc přes sešit je nejrychlejší cesta k tomu, aby
   začala vadit. Proto zamčená sedátka na zaplněných stránkách, propouštění čmárání
   a klidné, pomalé přecházení — žádné pobíhání.
3. **Na mobilu chybí los i čmárání**, takže hlazení není bonus, ale hlavní způsob hraní.
