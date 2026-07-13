# Můj deník · to do

Online bullet journal, který slouží výhradně jako to do list. Otevřená dvoustrana sešitu:
vlevo **dnes** (datum + den v týdnu), vpravo **někdy jindy**. Každá stránka je rozdělená
na kategorie **Práce** a **Osobní**.

## Pravidla deníku

- Nesplněný úkol na „dnes" se druhý den automaticky převalí zpět na „dnes"
  a přibude mu oranžová migrační šipka `›`. Po třech šipkách se deník jemně zeptá,
  jestli úkol nepatří na „někdy jindy", nebo ho vygumovat.
- Hotový úkol se ručně přeškrtne, sesune se na konec sekce a o půlnoci se nenávratně
  vygumuje — žádný archiv.
- Úkol může mít podúkoly (jedna úroveň); rodič se odškrtne sám, jakmile je hotový
  poslední podúkol. Skupina jde sbalit šipkou.
- Prioritní úkoly dostanou zvýrazňovačový podklad a hvězdičku a drží se nahoře sekce.
- Koláče pokroku (žlutý Práce, růžový Osobní) se vybarvují po dílcích; když je vše
  na „dnes" hotové, otiskne se razítko *hotovo!*
- Data se ukládají v `localStorage` prohlížeče — žádný účet, žádný server.

## Vlastní malůvky

Malůvky v okrajích se losují každý den. Vlastní obrázky (SVG/PNG s průhledným pozadím)
vložte do `public/doodles/` a vyjmenujte je v `public/doodles/manifest.json`:

```json
{ "files": ["moje-kvetina.svg", "kocka.png"] }
```

Zamíchají se do denní rotace vedle vestavěných.

## Vývoj

```
npm install
npm run dev     # http://localhost:5173
npm run build   # produkční build do dist/
```
