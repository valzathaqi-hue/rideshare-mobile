# RideShare — Java 5 · Hyrja me GitHub dhe ndryshimi me leje

## Çfarë ndërtova

Shtova NextAuth `4.24.15` me GitHub, sesion JWT me afat dy orë dhe butonat Hyr/Dil. Lista ka lidhjen `/panel`. Paneli shfaq profilin dhe rolin nga Neon; formulari për ID 2 shfaqet vetëm për shoferin. Serveri kontrollon lejen edhe kur formulari ndryshohet nga shfletuesi.

`schema-java05.sql` krijon tabelën `profilet`, rolin fillestar `udhetar` dhe kolonën `shofer_id`. ID 1 merr një pronar fiktiv kur nuk ka pronar. Pronari i databazës duhet ta caktojë veçmas profilin e vet si shofer dhe pronar të ID 2 në Neon.

## Provat që bëra

### Prova 1: Sesioni, rifreskimi dhe dalja

Nisa aplikacionin production lokalisht në portin 3005 me një sekret sesioni të përkohshëm vetëm në procesin e testimit. Pa cookie hyrjeje, `/panel` ktheu butonin “Hyr me GitHub”, pa formular për ndryshimin e orës; `/api/auth/session` ktheu `{}` dhe `/api/auth/providers` përmbante ofruesin GitHub. Hyrja e plotë, ruajtja e sesionit pas rifreskimit dhe dalja nuk janë provuar me llogari reale, sepse mungon konfigurimi lokal OAuth dhe Neon.

### Prova 2: Ndryshimi i lejuar i ID 2

Në një provë të izoluar me zëvendësues testimi për sesionin dhe SQL-në, helper-i ktheu `ruajtur` kur SQL ktheu një rresht të ndryshuar. U kontrollua që ora, ID-ja dhe identiteti i sesionit kalohen si parametra dhe që veprimi kërkon rifreskimin e listës e detajeve përpara ridrejtimit në panel. Kjo nuk provon ruajtje reale: ndryshimi 08:15 → 08:25 në Neon, shfaqja në listë/detaje dhe rikthimi në 08:15 mbeten për t'u kryer pasi të konfigurohen lidhjet private.

### Prova 3: Refuzimi dhe pronësia

Dërgova drejtpërdrejt një formular te veprimi i serverit pa sesion, me ID 1 dhe orën 08:25. Serveri u përgjigj HTTP 303 me ridrejtim `/panel?m=hyr`, duke refuzuar ndryshimin për përdoruesin pa hyrje. Në provat e izoluara u refuzuan edhe roli `udhetar`, identiteti i pavlefshëm, fushat e gabuara dhe rezultati SQL pa rresht të ndryshuar. Prova me shofer të kyçur që ndryshon ID 2 në ID 1 përmes DevTools dhe verifikimi real se ora e ID 1 mbetet 08:00 nuk janë kryer ende.

## Kontrollet teknike

- `npm run lint` dhe `npm run build` përfunduan me sukses.
- Kaluan 13 raste të izoluara për lejet dhe veprimin e serverit, me sesion dhe SQL të zëvendësuar vetëm gjatë testimit; kodi i aplikacionit nuk përdor këta zëvendësues.
- Kontrollet HTTP verifikuan panelin pa hyrje, sesionin bosh, ofruesin GitHub dhe refuzimin e dërgimit pa sesion.
- Sekreti i përkohshëm i testimit nuk u shkrua në kod ose raport. Nuk është krijuar apo publikuar një `.env.local` me kredenciale.

## Ku gjendet puna

- `aplikacioni/schema-java05.sql`
- `aplikacioni/src/lib/auth.ts` dhe `aplikacioni/src/lib/lejet.ts`
- `aplikacioni/src/app/api/auth/[...nextauth]/route.ts`
- `aplikacioni/src/components/Hyrja.tsx`
- `aplikacioni/src/app/panel/page.tsx` dhe `aplikacioni/src/app/panel/actions.ts`
- Lidhja për panelin është te `aplikacioni/src/app/page.tsx`; hapat e konfigurimit janë në README.
- Repository: https://github.com/valzathaqi-hue/rideshare-mobile

## Çfarë mbetet

Duhet të konfigurohen Neon dhe GitHub OAuth App, të ekzekutohen dy skedarët SQL sipas radhës dhe të vendosen `DATABASE_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET` dhe `NEXTAUTH_URL` në `aplikacioni/.env.local`. Pastaj duhen bërë hyrja reale, caktimi i pronarit, tri provat e ushtrimit dhe prova në 375 px me një koleg. Raporti duhet të përditësohet me rezultatet reale. Push-i i kodit është i veçantë nga dorëzimi me Issue; përgjigjja automatike e Javës 5 nuk është lexuar gjatë kësaj pune.

## Ndihma nga AI

Përdora AI për përshtatjen e shembullit të profesorit, kodin, SQL-në, dokumentimin dhe kontrollet teknike. Provat e izoluara nuk janë deklaruar si hyrje reale me GitHub ose shkrim real në Neon. Kërkesa për vend mbetet simulim, pa rezervim ose pagesë.
