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

Kërkesa është vetëm simulim. Nuk ka rezervim real, databazë, hyrje përdoruesi ose pagesa.

Kodi është në `aplikacioni/src/`. Raportet `java-02.md`, `java-03.md` dhe `java-04.md` ruhen këtu, pranë README-së. Rezultatet e Javës 3 përshkruajnë versionin e asaj jave; versioni aktual kërkon Neon.

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
