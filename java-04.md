# RideShare — Java 4 · Neon dhe PostgreSQL

## Çfarë ndërtova

Zëvendësova listën e udhëtimeve në kod me dy funksione SQL: `lexoUdhetimet` lexon listën dhe `gjejUdhetimin` lexon një udhëtim sipas ID-së. Lista, detajet dhe kërkesa i presin të dhënat me `await`. Lidhja krijohet vetëm në server përmes `src/lib/db.ts`, me `DATABASE_URL` dhe paketën `@neondatabase/serverless`.

Shtova `schema.sql` me tabelën `udhetimet` dhe tri udhëtime fiktive. Faqet lexohen në çdo kërkesë përmes `dynamic = "force-dynamic"`. Lista bosh shfaq mesazh tjetër nga gabimi i databazës. Kërkesa “Në pritje” mbetet simulim, pa rezervim real.

## Provat që bëra

### Prova 1: Ndryshimi në databazë shfaqet në aplikacion

Hapat për provën janë: ekzekuto `schema.sql` në Neon, ndrysho orën e ID 2 nga 08:15 në 08:25 dhe rifresko listën e detajet; pastaj rikthe 08:15. Kjo provë nuk është kryer ende, sepse në mjedisin lokal nuk ka një lidhje `DATABASE_URL` të konfiguruar. Nuk është verifikuar leximi nga Neon ose ndryshimi i orës në dy faqet.

### Prova 2: Lista bosh dhe rikthimi

Hapat për provën janë: me lidhjen Neon aktive, shto përkohësisht `WHERE false` vetëm te pyetja e `lexoUdhetimet`, rifresko dhe kontrollo mesazhin “Nuk ka udhëtime për momentin.”; pastaj hiqe kushtin dhe verifiko tri kartat. Kjo provë nuk është kryer ende me databazë reale. Në kod kushti i listës bosh është i ndarë nga `catch`, ndërsa pyetja përfundimtare është pa `WHERE false`.

### Prova 3: Lidhja mungon, rikthimi dhe siguria

Nisa versionin production lokalisht pa `DATABASE_URL` dhe kontrollova përgjigjet HTTP të listës, detajeve të ID 2 dhe kërkesës së ID 2. Të tria përmbanin mesazhin “Nuk u lidhëm me databazën. Provo përsëri.” me `role="alert"`, pa e ngatërruar me listën bosh. `git check-ignore aplikacioni/.env.local` konfirmoi se skedari privat përjashtohet nga Git. Rikthimi i lidhjes dhe i tri kartave nuk është provuar ende, sepse mungon lidhja reale Neon.

## Ku gjendet puna

- SQL: `aplikacioni/schema.sql`.
- Lidhja private: `aplikacioni/src/lib/db.ts`.
- Leximi SQL: `aplikacioni/src/lib/udhetimet.ts`.
- Faqet: `aplikacioni/src/app/page.tsx`, `aplikacioni/src/app/udhetimi/[id]/page.tsx` dhe `aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx`.
- Repository: https://github.com/valzathaqi-hue/rideshare-mobile.
- Udhëzimet e konfigurimit dhe provave janë në README. Nuk është kryer publikim në Vercel gjatë kësaj pune.

## Çfarë mbetet për përmirësim

Kodi përfundoi me sukses kontrollet `npm run lint` dhe `npm run build`. Duhet të krijohet/lidhet Neon, të ekzekutohet `schema.sql` në databazën përkatëse dhe të vendoset lidhja private në `aplikacioni/.env.local`. Pastaj duhen bërë provat 1 dhe 2, rikthimi i lidhjes në provën 3, si dhe kontrolli në 375 px dhe me një koleg. Ky raport duhet të përditësohet me ato rezultate reale para demonstrimit si punë plotësisht funksionale.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Përdora AI për përshtatjen e shembullit të profesorit, instalimin e paketave, kodin SQL, dokumentimin dhe kontrollet teknike lokale. Kontrollet e kryera nga AI janë shënuar më sipër; nuk janë deklaruar si prova personale me koleg ose si lidhje e suksesshme me Neon.
