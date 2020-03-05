
### Feature: Árucikk adatainak szerkesztése

Termék listázásakor a szerkesztés gombra kattintva jelenjen
meg egy modal.

A modalban a termékfelviteli űrlap jelenjen meg.

![](../../projects/inventory/add_product.png)

Az űrlap betöltésekor legyen kitöltve az adott termék adataival.

A mentés gombra kattintva írjuk felül a termék adatait.

#### frontend (30 perc)

1. Modal megjelenítése szerkesztés gomb klikkre
1. Szerkesztés űrlap a modalban
  - ID: hidden inputban vagy action URLbe kódolva
1. Kapcsolódó termék adatainak betöltése űrlapba
1. CSERE!

#### backend (30 perc)

1. Űrlapadatokat fogadó NOOP endpoint redirekttel
1. Adatok adatbázisba mentése
1. CSERE!


---

### Feature: Termékleírások

SQLite adattípusok, TEXT: https://www.sqlite.org/datatype3.html

Egészítsük ki a termékek adatmodelljét egy termékleírás mezővel.

A termékleírás egy lényegében tetszőlegesen hosszú szöveg.

A termékfelviteli és szerkesztés űrlapokon a termékleírás
a név alatt kapjon helyet egy szövegdoboz formájában.

#### full stack (45 perc)

1. Felviteli és szerkesztés űrlapok módosítása
1. dbinit szkript módosítása: új oszlop a termék táblába
1. Backend logika módosítása: termékleírás elmentése
1. CSERE!

---

### Feature: Árucikk törlése

Termék listázásakor a törlés gombra kattintva jelenjen
meg egy modal.

A modalban kérjünk megerősítést a törlésre. A modalban legyen megerősítő gomb és egy mégsem gomb.

A törlés gombra kattintva töröljük a terméket az adatbázisból.

#### full stack (30 perc)

1. Törlés modal megjelenítése törlés gomb klikkre
1. NOOP törlés endpoint redirekttel (NOOP: semmit nem csináló, > "no operation")
1. Törlés az adatbázisból
1. CSERE!

---

### Feature: Csoport listázása

A Csoportok menüpont alatt listázzuk a csoportokat egy táblázatban, a Termékekhez hasonlóan.

Minden csoporthoz tartozzon egy szerkesztés és egy törlés
gomb.

A táblázat alatt legyen egy Új csoport gomb.

#### frontend (30 perc)

1. Statikus HTML Csoportok oldal, HTMLbe égetett csoportokkal
1. Csoportok oldal átalakítása Handlebars templatekre
1. Memóriába égetett csoportokból generált táblázat
1. CSERE!

#### backend (30 perc)

1. dbinit szkript módosítása: csoportok modellezése
1. Memóriába égetett értékek helyett adatbázis használata
1. CSERE!

---

### Feature: Csoportok létrehozása

A Csoportok képernyőn az Új csoport gombra kattintva jelenjen meg
egy modal ablak.

A modal ablakban legyen egy űrlap, amelyen egy csoport adatait 
tudjuk megadni.

Egy csoport adatai:
- azonosító: adatbázis által generált fix érték (SQLite autoinkrement: https://www.sqlite.org/autoinc.html)
- megnevezés: szöveges érték

A mentés gombra kattintva mentsük el a csoportot az adatbázisba
és irányítsunk át a csoportokat listázó oldalra.

#### full stack (30 perc)

1. Modal ablak Új csoport gomb klikkre
1. Űrlap
1. Űrlapadatokat fogadó endpoint
1. Adatbázisba mentés
1. CSERE!

---

### Feature: Árucikk csoportokhoz rendelése és eltávolítása

Kulcsok: https://mariadb.com/kb/en/relational-databases-table-keys/

Külső kulcsok: https://www.sqlite.org/foreignkeys.html, https://mariadb.com/kb/en/relational-databases-foreign-keys/

Alakítsuk át a termékkezelést úgy, hogy a termékek csoportja ne
egy szöveges érték legyen, hanem egy hivatkozás egy felvitt
csoportra.

Egy terméket továbbra is csak egy csoportba lehet felvinni.

Csak olyan csoporthoz lehessen egy terméket felvinni, amely
létezik az adatbázisban.

A termékfelviteli és szerkesztés űrlapon a leugró menü elemei a
az adatbázisban tárolt csoportok alapján generálódjon.

#### fullstack (45 perc)

1. Leugró menü opciók generálása adatbázis sorok alapján
1. dbinit.js módosítása: termék-csoport összekapcsolás modellezése
1. CSERE!

### Feature: Csoport adatainak szerkesztése

A Csoportok képernyőn egy csoporthoz tartozó szerkesztés gombra
kattintva jelenjen meg egy modal.

A modal ablakban legyen egy űrlap, amelyen egy csoport adatait 
tudjuk megadni. Az űrlap a felviteli űrlaphoz hasonló, csak a
csoport adataival ki van töltve.

#### fullstack (30 perc)

1. Modal ablak a szerkesztés gomb klikkre
1. Szerkesztés adatokat fogadó endpoint
1. adatok felülírása

### Feature: Árucikk hozzáadása több csoporthoz

Módosítsuk a termékkezelést úgy, hogy egy termék több csoportba
is felvehető legyen.

A termékfelviteli és szerkesztés űrlapon a leugró menü elemei
közül lehessen többet is kiválasztani.

#### full stack (45 perc)

1. Modal űrlap módosítása: multi selectté alakítás
1. Backend módosítás: adattömb fogadása egyszerű szöveges adat helyett
1. Adatbázisba írás módosítása
1. CSERE!

---

### Feature: Csoport törlése

Csoport listázásakor a törlés gombra kattintva jelenjen
meg egy modal.

A modalban kérjünk megerősítést a törlésre.

A törlés gombra kattintva töröljük a csoportot az adatbázisból.

Csoport törlésekor szűnjenek meg a kitörölt csoportra
vonatkozó termék-csoport hozzárendelések.

#### full stack (15 perc)

1. Törlés modal megjelenítése törlés gomb klikkre
1. NOOP törlés endpoint redirekttel (NOOP: semmit nem csináló, > "no operation")
1. Törlés az adatbázisból

---

### Random adatgeneráló (30 perc)

> mindenki önmagának megírja ezt a kisegítő programot a repójába, nincs csere-bere

Írjunk egy seed_products.js szkriptet, ami SQL beszúrásokat
 végez az alábbiak szerint:

- legyen adjectives egy mellékneveket tartalmazó tömb
- legyen pronouns egy főneveket tartalmazó tömb
- a szkript annyi darab terméket ír az adatbázisba, amennyi egyedi kombináció lehetséges a két tömb alapján
- feltételezzük, hogy az adatbázis üres a szkript futtatásakor

Töltsük fel az adatbázist legalább 100 termékkel.

---

### Feature: Termékek

![](products_filter.png)

Tegyük szűrhetővé a termékek táblázatot. 

Legyen a listázás oldalon egy űrlap a táblázat felett.
Az űrlap egy leugró menüt tartalmazzon a csoportokkal.

Az űrlap elküldésével csak a kiválasztott csoportba tartozó
termékek jelenjenek meg.

#### full stack (45 perc)



---

### Feature: Rendezés

Implementáljunk rendezést a listázó oldalakon.

A táblázatok fejlécei legyenek kattintható linkek. Ha egy
ilyen linkre rákattintunk, az adott sor szerint rendezze a
táblázatot, először növekvő sorrendben, majd ismételt 
rákattinás csökkenő sorrendbe.

Az oszlop, amely alapján rendezünk, valamilyen módon jelezze,
hogy az oszlop szerint növekvő vagy csökkenő sorrendben
sorrendezünk éppen.

#### full stack (45 perc)

1. Táblázat felécek kattintható linkek
    - a linkek a termékeket listázó oldalra vezessenek
    - query paraméterként küldjük a rendezés adatait 
1. A rendezési oszlop legyen egy orderby query param, az irány egy order query paraméter
    - pl. `products?orderby=category&order=desc`
1. A lekérdezésbe építsük be a rendezést

---


### Feature: Lapozás

Implementáljunk lapozást a listázó oldalakon.

A lapméret legyen 30 tétel.

A táblázatok alatt egy előző és egy következő gomb legyen,
ezekkel tudjuk az előző és következő lapokat megjeleníteni.

Ha a lista első 30 elemét látjuk, csak a következő gomb jelenik
meg, ha a lista utolsó oldalán látjuk, csak az előző gomb
jelenik meg.

Tippek:
- legyen a lekérni kívánt lapszám egy query paraméter, pl `?page=2`
- a backend ezen query paraméterek alapján kérdezze le az adatokat
    - LIMIT záradék: a kiválasztott elemek számát maximalizálja
    - OFFSET záradék: a kiválasztott elemek közül kihagyja az megadott N sort az eredményhalmazból
    - harmadik oldal, harminc soros lapokkal: LIMIT 30 OFFSET 60
    - ha a query paraméter üresek vagy hiányzik, jelenítsük meg az első oldalt
    - A lapozó gombok linkjeit az aktuális lapszám alapján kell kigenerálni

#### full stack (45 perc)

1. Gombok elhelyezése query paraméteres linkekkel
    - ha a harmadik oldalon vagyunk
    - előző: `<a href="products?page=2">`
    - következő: `<a href="products?page=4">`
1. Query paraméter beolvasása backenden
1. Query paraméter lefordítása OFFSET záradékra
1. SELECT átírása LIMIT és OFFSET használatával


### Feature: Csoportok hierarchiába rendezése

Alcsoportok létrehozása. Egy csoportnak tetszőleges számú
alcsoportja lehet, de nem kell minden csoportnak valamely
másik csoport alá tartoznia.

Ha egy csoportra szűrünk, az összes alcsoport elemei is
megjelennek az eredményhalmazban.


