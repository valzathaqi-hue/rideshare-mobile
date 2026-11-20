# RideShare · Programimi për Pajisje Mobile

Projekt universitar në Next.js me App Router. Vazhdon idenë dhe skicën e Javës 2.

## Java 10 · Dy ekrane, një gjendje

Shtova kërkesën reale dhe pranimin te detajet e udhëtimit. E rilexoj gjendjen rreth çdo 5 sekonda, pa lexime të mbivendosura. Në ndërprerje ruaj pamjen e fundit me paralajmërim; pas rilidhjes e rilexoj menjëherë. Pranimin dhe uljen e vendeve i ruaj së bashku në PostgreSQL, me kontroll të pronarit dhe pa ulje të përsëritur.

Për provën me llogaritë e mia të testimit:

1. Konfiguroj Neon dhe GitHub sipas Javëve 4–5 dhe ekzekutoj `aplikacioni/schema-java10.sql` pas `schema.sql` e `schema-java05.sql`. Migrimin mund ta ekzekutoj përsëri; nuk mbush të dhëna personale ose ndryshon vendet e udhëtimeve ekzistuese.
2. Përgatis dy udhëtime fiktive me 2 vende e pa kërkesa të pranuara: ID 2 për kërkesën/pranimin dhe ID 1 për rilidhjen. Si pronar i databazës caktoj `shofer_id` dhe rolin `shofer` për llogarinë time të shoferit; llogarinë tjetër e mbaj `udhetar`. Nuk ndaj fjalëkalime dhe nuk përdor të dhëna reale.
3. Hap `/udhetimi/2` në një dritare normale dhe një private me dy sesione të ndara. Dërgoj kërkesën si udhëtar dhe e pranoj si shofer. Të dy ekranet duhet të kalojnë nga 2 vende në 1 pa Refresh; përsëritja e pranimit nuk duhet ta ulë numrin përsëri.
4. Te ID 1 nis me një kërkesë të re në pritje. Vendos vetëm dritaren e udhëtarit në DevTools → Network → Offline, pranoj nga shoferi dhe rikthej No throttling te udhëtari. Kontrolloj pamjen e vjetër me paralajmërim, pastaj përditësimin automatik pas rilidhjes.

E lexoj gjendjen personale në `GET /api/udhetimet/{id}/gjendja`; në të njëjtën rrugë dërgoj POST me `veprimi: "kerko"` ose `veprimi: "prano"` dhe `kerkesaId`. Identitetin nuk e dërgoj nga telefoni: e merr serveri nga sesioni. Lidhjen e vjetër `/udhetimi/{id}/kerkesa` e ridrejtoj te detajet, pa krijuar kërkesë përmes GET-it.

Te [java-10.md](java-10.md) dokumentova tri provat lokale dhe kufizimin: ende duhet t'i përsëris me Neon e OAuth real. Për dorëzim përdor linkun kryesor të repository-t dhe zgjedh Java 10; pas krijimit të Issue-t lexoj përgjigjen e botit.

## Java 9 · Udhëtimet e preferuara

Në listë, përdoruesi i kyçur mund të ruajë një udhëtim personalisht. Ylli dhe numri ndryshojnë menjëherë me **Po ruhet…**; suksesi konfirmohet nga serveri. Refuzimi rikthen pamjen e mëparshme. Preferimi lexohet nga Neon pas rifreskimit dhe nuk rezervon vend. Çelësi i përbërë `(github_id, udhetimi_id)` pengon kopjet.

1. Përgatit Neon dhe hyrjen me GitHub sipas Javëve 4–5 më poshtë. Në të njëjtën databazë ekzekuto `aplikacioni/schema-java09.sql`, pas `schema.sql` dhe `schema-java05.sql`.
2. Nis serverin, hyr nga `/panel`, pastaj kthehu te lista dhe ruaj një udhëtim ende të paruajtur. Prit konfirmimin dhe rifresko. Kontrollo rreshtin përkatës në tabelën `preferimet` të Neon.
3. Për një refuzim të kontrolluar, shto privatisht `PREFERIME_REFUZO_PROVEN=1` te `aplikacioni/.env.local` dhe rinis **npm run dev**. Provo një udhëtim të paruajtur; ylli dhe numri duhet të rikthehen. Hiqe flamurin, rinis dhe provo sërish. Ky flamur funksionon vetëm në zhvillim, pas kontrollit të sesionit dhe para shkrimit në databazë.
4. Provo klikime të shpejta dhe përsërit të njëjtën ruajtje. Në Neon duhet të ketë vetëm një rresht për çiftin përdorues–udhëtim. Një llogari tjetër duhet të lexojë preferimet e veta.

Raporti [java-09.md](java-09.md) dallon kontrollet e kaluara me PostgreSQL lokal nga provat që mbeten me Neon dhe OAuth real. Heqja e preferimeve nuk është përfshirë. Për dorëzim përdor linkun kryesor të repository-t dhe zgjidh Java 9; Push-i nuk hap Issue.

## Java 8 · Vendtakimi në telefon

Te detajet e udhëtimit mund të shkruash vendtakimin dhe ta konfirmosh lokalisht. Butoni **Përdor vendndodhjen time** kërkon leje vetëm pas klikimit dhe shfaq saktësinë ose arsyen e dështimit. Fusha manuale mbetet aktive. Vendtakimi nuk i dërgohet shoferit dhe humbet pas rifreskimit.

Për provë pa Neon ose hyrje, hap **/java-08-test**. Kjo faqe përdor të njëjtin komponent si detajet, me udhëtim fiktiv. Konfigurimi `mobile-week08.json` gjendet në rrënjë. Raporti [java-08.md](java-08.md) dokumenton kontrollet me vendndodhje të simuluar dhe kufizimet. Provat lokale nuk janë raportet e botit: pas Push-it, dorëzo linkun kryesor të repository-t në formularin e Javës 8 dhe lexo të dy komentet në Issue.

## Java 7 · Provo, korrigjo dhe shpjego

Rasti i zgjedhur është **Rasti 3 · Klikim apo rezervim**, me kodin personal **P7-904**. Në detajet e udhëtimit, lidhja tani thotë **Provo kërkesën · simulim** dhe shpjegon përpara klikimit se nuk rezervohet vend ose njoftohet shoferi. Kontrolli për zero vende mbetet aktiv.

Raporti [java-07.md](java-07.md) përmban dy problemet, korrigjimin, lidhjet Para/Pas dhe rezultatet e kontrolleve. Lint, build dhe kontrollet e izoluara kaluan. Provat HTTP të rrjedhës u bllokuan nga mungesa e konfigurimit Neon; provat reale në shfletues dhe pjesët personale të ushtrimit mbeten për përfundim. Push-i nuk e zëvendëson dorëzimin me Issue.

## Nisja e aplikacionit

Në terminal, nga dosja e repository-t:

```bash
cd aplikacioni
npm install
npm run dev
```

Hap adresën që shfaq terminali, zakonisht http://localhost:3000.

## Java 6 · PWA dhe lista offline

Manifesti është te `/manifest.webmanifest`; ikonat janë PNG 192×192 dhe 512×512. Ikonat u morën nga [materiali i profesorit për Javën 6](https://arbenl.github.io/lendet/2026-2027/mobile/java-06/ushtrimet.html).

Lidhja **Lista për lexim pa internet** shfaqet në çdo faqe, edhe kur databaza nuk lidhet. Lexuesi `/offline.html` punon si dokument më vete, pa asetet e Next.js. Butoni i rezervimit është i çaktivizuar.

Service worker-i `/sw.js` ruan vetëm dokumentin offline, dy ikonat dhe përgjigjen publike të `/api/udhetimet` në `rideshare-public-v1`. Për listën provon rrjetin, pastaj kopjen lokale; shfaqen burimi dhe koha e ruajtjes. Paneli, hyrja, sesionet dhe POST nuk ruhen ose ridërgohen.

Për provën e plotë duhet të punojë më parë lidhja Neon e Javës 4. Pa vizitë online dhe listë të lexuar me sukses nuk ka tri udhëtime për t'u shfaqur offline.

1. Nis aplikacionin në `localhost` ose publikoje me HTTPS. Për një provë të qëndrueshme mund të përdorësh `npm run build` dhe pastaj `npm start` nga `aplikacioni/`.
2. Hap faqen kryesore online. Në DevTools → Application → Service Workers kontrollo `/sw.js`; te Cache Storage → `rideshare-public-v1` gjej `/api/udhetimet`. Hap lexuesin dhe kontrollo tri kartat dhe kohën.
3. Vetëm te tab-i RideShare aktivizo Network → Offline. Hap `/` dhe rifresko. Duhet të shfaqet dokumenti offline, tri kartat dhe koha e kopjes. Kontrollo edhe në 375 px.
4. Në tab-in online të Neon ndrysho orën e ID 2 në 08:25. Kopja offline mbetet me orën e vjetër. Rikthe rrjetin te RideShare dhe kliko **Rifresko listën**. Kontrollo orën e re, burimin server dhe kohën e re. Në fund rikthe 08:15 në Neon dhe rifresko përsëri.

Një adresë HTTP me IP të rrjetit lokal zakonisht nuk lejon service worker. Hap fillimisht aplikacionin kryesor, që komponenti `Pwa` të regjistrojë worker-in dhe të kërkojë listën publike. Rezultatet dhe kufizimet e kontrollit janë te `java-06.md`.

## Java 5 · Hyrja me GitHub dhe lejet

Lista mbetet publike. Lidhja **Hyr / Paneli im** hap `/panel`. Përdoruesi i ri merr rolin `udhetar`; vetëm shoferi pronar i udhëtimit mund ta ndryshojë orën. Serveri kontrollon sesionin, rolin, fushat dhe pronarin në çdo ruajtje.

Përgatit së pari Neon sipas Javës 4 më poshtë. Pastaj:

1. Në GitHub → Settings → Developer settings → OAuth Apps → New OAuth App krijo aplikacionin tënd. Homepage URL: `http://localhost:3000`; callback: `http://localhost:3000/api/auth/callback/github`.
2. Në `aplikacioni/.env.local` mbaj `DATABASE_URL` dhe shto vlerat private të aplikacionit OAuth dhe sekretin e sesionit:

   ```dotenv
   GITHUB_ID="CLIENT_ID_I_OAUTH_APP"
   GITHUB_SECRET="CLIENT_SECRET_I_OAUTH_APP"
   NEXTAUTH_SECRET="SEKRETI_YT_I_RASTESISHEM"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   Për të gjeneruar sekretin vetëm në kompjuterin tënd:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

3. Ekzekuto `aplikacioni/schema-java05.sql` në të njëjtën databazë Neon si `schema.sql`. Shton profilet, rolet dhe pronarin fiktiv të ID 1; nuk fshin udhëtimet.
4. Rinis serverin dhe hap `http://localhost:3000/panel`. Hyr me GitHub. Profili i parë është `udhetar`. Kopjo **ID ime GitHub** nga paneli.
5. Në Neon SQL Editor zëvendëso `SHENO_ID_TENDE` me atë numër dhe ekzekuto:

   ```sql
   UPDATE profilet SET roli = 'shofer' WHERE github_id = 'SHENO_ID_TENDE';
   UPDATE udhetimet SET shofer_id = 'SHENO_ID_TENDE' WHERE id = '2';
   SELECT id, ora, shofer_id FROM udhetimet ORDER BY id;
   ```

   Caktimi i rolit bëhet nga pronari i databazës në laborator; përdoruesi nuk zgjedh rol në formular.

Nëse ndryshon portin, përdor të njëjtën adresë te Homepage, callback dhe `NEXTAUTH_URL`. Mos përziej `localhost` me `127.0.0.1`. NextAuth është versioni `4.24.15`, sipas ushtrimit.

Tri provat e Javës 5:

1. Hyr, rifresko panelin dhe dil. Kontrollo që sesioni ruhet pas rifreskimit dhe mbyllet pas daljes.
2. Si pronar i ID 2 ruaj 08:25. Kontrollo panelin, listën, detajet dhe Neon; pastaj rikthe 08:15.
3. Në DevTools ndrysho përkohësisht ID-në e fshehtë nga 2 në 1 dhe dërgo formularin. Duhet të refuzohet dhe ID 1 të mbetet 08:00. Rifresko panelin pas provës.

Rezultatet e kryera dhe ato që presin konfigurimin privat shënohen te `java-05.md`. Mos publiko sekrete ose pamje të `.env.local`.

## Java 4 · Neon dhe PostgreSQL

Udhëtimet tani lexohen nga tabela `udhetimet` në Neon. Lista, detajet dhe kërkesa përdorin të njëjtën databazë. Pas ndryshimit të të dhënave në SQL Editor, rifresko faqen për të parë ndryshimin.

Për lidhjen e parë:

1. Krijo një databazë Neon falas, direkt në Neon Console ose përmes Vercel → Storage/Marketplace → Neon.
2. Në SQL Editor të asaj databaze ekzekuto përmbajtjen e `aplikacioni/schema.sql`. Ekzekutimi i përsëritur nuk krijon kopje.
3. Krijo `aplikacioni/.env.local`, pranë `package.json`, dhe vendos lidhjen private nga Neon → Connect:

   ```dotenv
   DATABASE_URL="LIDHJA_JOTE_POSTGRESQL"
   ```

4. Rinis `npm run dev` dhe hap aplikacionin. Pa një lidhje të vlefshme shfaqet mesazhi i gabimit të databazës.

`.env.local` është privat dhe përjashtohet nga Git përmes rregullit `.env*`. Mos e shto në GitHub dhe mos përdor `NEXT_PUBLIC_DATABASE_URL`.

Në Vercel përdor **Root Directory: aplikacioni** dhe shto `DATABASE_URL` te Environment Variables për Production dhe Development. Pastaj bëj Redeploy. Publikimi në Vercel është opsional për këtë javë.

## Rrjedha nga Java 3

- Faqja kryesore shfaq saktësisht tri karta me udhëtime fiktive.
- `/udhetimi/2` shfaq detajet dhe vendtakimin e udhëtimit të dytë.
- `/udhetimi/2/kerkesa` shfaq **Simulim: Në pritje**.
- `/udhetimi/3` ka zero vende dhe buton të çaktivizuar.
- `/udhetimi/99` shfaq **Udhëtimi nuk u gjet** dhe lidhjen për te lista.

Rrjedha e mësipërme përshkruan versionin e Javës 3. Nga Java 10 kërkesa ruhet dhe pranohet realisht në databazën e provës; udhëzimet e konfigurimit janë në seksionin e Javës 10. Pagesat nuk janë përfshirë.

Kodin Next.js e mbaj në `aplikacioni/src/`; worker-in, lexuesin offline dhe ikonat në `aplikacioni/public/`. Raportet `java-02.md` deri te `java-10.md` i ruaj këtu, pranë README-së. Në raportet e mëparshme përshkruaj versionet e atyre javëve.

## Kontrolli

```bash
cd aplikacioni
npm run lint
npm run build
```

Për provën në telefon: në Chrome/Edge hap Inspect, aktivizo ikonën e telefonit/tabletit dhe vendos gjerësinë 375 px. Provo listën, detajet, kërkesën dhe lidhjet e kthimit. Rezultatet janë te `java-03.md`.

Tri provat e Javës 4:

1. Në Neon ndrysho orën e ID 2 në 08:25. Rifresko listën dhe detajet e ID 2; duhet të tregojnë të njëjtën orë. Pastaj rikthe 08:15.

   ```sql
   UPDATE udhetimet SET ora = '08:25' WHERE id = '2';
   -- Pas provës:
   UPDATE udhetimet SET ora = '08:15' WHERE id = '2';
   ```

2. Vetëm te `lexoUdhetimet` në `src/lib/udhetimet.ts`, ndrysho përkohësisht `FROM udhetimet ORDER BY id` në `FROM udhetimet WHERE false ORDER BY id`. Rifresko: duhet të shfaqet “Nuk ka udhëtime për momentin.” Hiqe `WHERE false` pas provës. Mos fshi rreshta nga databaza.
3. Riemërto përkohësisht `DATABASE_URL` në `.env.local` dhe rinis serverin: duhet të shfaqet “Nuk u lidhëm me databazën. Provo përsëri.” Rikthe emrin, rinis dhe provo sërish.

Shëno rezultatet reale te `java-04.md`. Mos përfshi lidhjen private ose pamje të saj.
