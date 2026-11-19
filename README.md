# RideShare · Programimi për Pajisje Mobile

Projekt universitar në Next.js me App Router. Vazhdon idenë dhe skicën e Javës 2.

## Nisja e aplikacionit

Në terminal, nga dosja e repository-t:

```bash
cd aplikacioni
npm install
npm run dev
```

Hap adresën që shfaq terminali, zakonisht http://localhost:3000.

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

Kërkesa për vend mbetet simulim, pa rezervim real ose pagesa. Versioni aktual shton Neon dhe hyrjen me GitHub.

Kodi është në `aplikacioni/src/`. Raportet `java-02.md`, `java-03.md`, `java-04.md` dhe `java-05.md` ruhen këtu, pranë README-së. Raportet e mëparshme përshkruajnë versionet e atyre javëve.

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
