# RideShare — Java 6 · PWA dhe lexim offline

## Çfarë ndërtova

Shtova manifestin, dy ikonat, API-në publike dhe një lexues offline. Komponenti `Pwa` në layout regjistron `/sw.js` dhe kërkon listën pasi worker-i kontrollon faqen. Kjo mbush kopjen lokale me JSON-in e udhëtimeve, kur Neon përgjigjet me sukses.

Cache `rideshare-public-v1` përmban vetëm dokumentin offline, ikonat dhe listën publike. API-ja kthen gjashtë fushat e udhëtimit, pa profil, pronar, email ose sesion. Hyrja dhe lejet e Javës 5 mbeten; paneli, autentikimi dhe POST nuk ruhen. Lexuesi nuk konfirmon rezervim dhe butoni Kërko vend është i çaktivizuar.

## Provat që bëra

### Prova 1: Manifesti dhe vizita online

Hapat: nisa versionin production lokalisht në portin 3005 dhe kërkova manifestin, dy ikonat, worker-in, lexuesin dhe faqen kryesore përmes HTTP.

Pritshmëria: manifesti të quhet RideShare AAB, ikonat të kenë përmasat e sakta dhe lexuesi të jetë i arritshëm edhe kur lista kryesore ka gabim databaze.

Vëzhgimi: adresat kthyen HTTP 200, manifesti kishte emrin dhe pamjen standalone, ndërsa ikonat kishin përmasat 192×192 dhe 512×512. Lidhja e lexuesit dhe ajo e panelit ishin në faqen kryesore edhe kur Neon mungonte. API-ja reale ktheu mesazhin e përgjithshëm HTTP 503, sepse `DATABASE_URL` ende nuk është konfiguruar. Aktivizimi real i worker-it në Application, tri kartat nga Neon dhe instalimi në pajisje nuk janë provuar.

### Prova 2: Pa internet, edhe pas rifreskimit

Hapat: ekzekutova kodin e worker-it në një provë të izoluar me rrjet dhe Cache Storage të zëvendësuar për testim. Kontrollova instalimin, kërkesën pa kopje, ruajtjen online dhe kërkesën/navigation pa rrjet.

Pritshmëria: kërkesa e parë pa kopje të mos shpikë të dhëna; pas ruajtjes lista dhe dokumenti të lexohen nga cache me kohën origjinale, pa ruajtur faqe private.

Vëzhgimi: kaluan rastet `no_snapshot`, burimi `cache`, ruajtja e kohës, dokumenti offline për `/`, mosndërhyrja te paneli/autentikimi/POST dhe pastrimi vetëm i cache-ve të vjetra RideShare. Dokumenti i shërbyer përmbante butonin e çaktivizuar. Këto janë prova të izoluara të kodit; rifreskimi real në shfletues me tri karta nga Neon dhe kontrolli në 375 px me koleg mbeten për t'u kryer.

### Prova 3: Rikthimi i lidhjes dhe lista e re

Hapat: në provën e izoluar ruajta një përgjigje me orën 08:15, simulova ndërprerjen, pastaj një përgjigje të re me 08:25. Kontrollova edhe HTTP 503, përgjigje jo-JSON dhe mungesë hapësire për ruajtje.

Pritshmëria: rrjeti të përditësojë kopjen; dështimet të mos e mbishkruajnë kopjen e mirë; mungesa e hapësirës të lejojë leximin pa pretenduar ruajtje.

Vëzhgimi: përgjigjja e re u shënua `network` dhe kopja e ardhshme përmbante 08:25; gabimet ruajtën kopjen e mëparshme. Kur ruajtja dështoi, lista e freskët u kthye pa kohë të re ruajtjeje. Ndryshimi real në Neon, klikimi Rifresko listën në shfletues dhe rikthimi i ID 2 në 08:15 nuk janë kryer, sepse mungon konfigurimi privat i databazës.

## Kontrollet teknike

- `npm run lint` dhe `npm run build` përfunduan me sukses.
- Provat e izoluara kontrolluan ciklin e cache-it, kthimin offline, përditësimin, gabimet dhe përjashtimin e faqeve private.
- Me të dhëna testimi që përmbanin fusha shtesë private, API-ja ktheu vetëm gjashtë fushat publike. Gabimi SQL u kthye si mesazh i përgjithshëm HTTP 503.
- Kontrollet HTTP konfirmuan shërbimin e manifestit, ikonave, worker-it dhe lexuesit.
- Nuk u shtua paketë, OAuth App ose sekret i ri. `.env.local` përjashtohet nga Git.

## Ku gjendet puna

- `aplikacioni/src/app/manifest.ts`
- `aplikacioni/src/app/api/udhetimet/route.ts`
- `aplikacioni/src/components/Pwa.tsx` dhe përfshirja në `aplikacioni/src/app/layout.tsx`
- `aplikacioni/public/sw.js` dhe `aplikacioni/public/offline.html`
- `aplikacioni/public/icons/icon-192.png` dhe `aplikacioni/public/icons/icon-512.png`, nga materiali i profesorit.
- Repository: https://github.com/valzathaqi-hue/rideshare-mobile

## Çfarë mbetet

Duhet të lidhet Neon sipas README-së dhe të bëhen tri provat reale në shfletues, përfshirë rifreskimin pa internet, kohën e kopjes dhe përditësimin nga SQL Editor. Pastaj ky raport duhet të përditësohet me rezultatet reale. Push-i ruan kodin; dorëzimi me Issue dhe leximi i përgjigjes së GitHub-it bëhen veçmas.

## Ndihma nga AI

Përdora AI për përshtatjen e shembullit, shtimin e skedarëve, dokumentimin dhe kontrollet lokale. Provat e izoluara nuk janë deklaruar si provë reale offline me Neon ose si punë e kryer me koleg.
