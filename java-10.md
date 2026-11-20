# RideShare — Java 10

## Çfarë ndërtova

Shtova kërkesën reale për vend, pranimin nga shoferi pronar dhe rileximin automatik te detajet e udhëtimit. Ndryshe nga Java 9, ku ruaja një preferim personal, këtë javë kërkesa dhe pranimi ndryshojnë gjendjen e përbashkët të udhëtimit në server.

Përditësimin e realizova me një lexim fillestar dhe një lexim tjetër 5 sekonda pas përfundimit të të mëparshmit. Nuk nis dy lexime njëkohësisht. Pastroj timer-in dhe anuloj kërkesën kur largohem nga faqja. Përgjigjet e anuluara ose të një udhëtimi të mëparshëm nuk i përdor për ta ndryshuar ekranin. Para një veprimi anuloj leximin e vjetër; pas veprimit e lexoj menjëherë gjendjen e konfirmuar.

Identitetin e marr nga sesioni GitHub në server. Udhëtarit i kthej vetëm kërkesën e vet; shoferit pronar i kthej kërkesat për udhëtimin e tij. Vendet dhe kërkesat i lexoj me një SELECT, nga e njëjta pamje e databazës. Përgjigjes personale i vendosa `Cache-Control: private, no-store, max-age=0` dhe `Vary: Cookie`. Në POST kontrolloj edhe origjinën e kërkesës.

Pranimin e ruaj brenda funksionit PostgreSQL `prano_kerkesen`: kyç rreshtin e udhëtimit, kontrolloj pronarin dhe rolin, pastaj kërkesën. Në të njëjtin transaksion ul vendet dhe shënoj pranimin. Nëse kërkesa është pranuar më parë, kthej të njëjtin rezultat pa ulje tjetër. Me 0 vende nuk pranoj kërkesë të re. Për kërkesat vendosa çift unik përdorues–udhëtim.

Gjatë ndërprerjes ruaj pamjen e fundit dhe shfaq “Po rilidhemi · të dhënat mund të jenë të vjetra”. Nuk i zëvendësoj vendet me zero. Bllokoj veprimet që kërkojnë rrjet. Pas ngjarjes `online` e nis leximin menjëherë dhe e heq paralajmërimin vetëm pas një përgjigjeje të suksesshme. Nëse sesioni nuk vlen më, pastroj pamjen personale dhe kërkoj hyrje.

## Përgatitja e provës

Për kontrollin teknik përdora udhëtimet fiktive ID **2** dhe ID **1**, secilin me **2 vende**, një shofer pronar dhe dy udhëtarë prove. Nisa dy kontekste të izoluara Chrome me cookie të ndara: njërin për shoferin dhe tjetrin për udhëtaren. Nuk përdora dy skeda me të njëjtin sesion ose `localStorage` për sinkronizim.

Provat i automatizova me ndihmën e AI në një mjedis të përkohshëm, jashtë repository-t. Përdora komponentin real React, trajtuesit realë GET/POST, funksionet e projektit dhe migrimin SQL kundër PostgreSQL lokal PGlite. Hyrjen GitHub e zëvendësova me identitete fiktive të izoluara për secilën kërkesë HTTP; Neon-in e zëvendësova me motorin lokal. Pra, këto janë prova të automatizuara lokale, **jo prova të përfunduara me Neon dhe dy llogari reale GitHub**.

Në dosjen e projektit ende nuk kam `.env.local` të konfiguruar. Më mbetet t'i përsëris provat në aplikacionin e plotë pasi të lidh Neon dhe OAuth. Nuk kam publikuar koordinata, kredenciale, cookie reale ose të dhëna personale.

## Provat që bëra

### Prova 1: Rasti 1 · Kërkesa mbërrin te shoferi

- Hapat: hapa ID 2 në të dy sesionet e provës, prita leximin fillestar dhe dërgova kërkesën nga udhëtarja. Nuk përdora Refresh në dritaren e shoferit.
- Çfarë prisja: kërkesa të ruhej “Në pritje”, shoferi ta shihte pas leximit të radhës dhe vendet të mbeteshin 2. Dërgimi ende nuk duhet të rezervonte vend.
- Çfarë pa realisht shoferi dhe udhëtari, pa Refresh: të dy ekranet treguan kërkesën në pritje dhe 2 vende. Shoferi e mori gjendjen nga leximi automatik; udhëtarja e mori nga rileximi pas POST-it. Kjo provë kaloi në mjedisin lokal.
- Ku e verifikova ruajtjen: lexova rreshtin në tabelën `kerkesat` të PostgreSQL lokal dhe e rilexova përmes funksionit `lexoGjendjen`. Përsërita dërgimin dhe kontrollova që nuk u krijua kërkesë e dyfishtë. Me një udhëtar tjetër kontrollova që kërkesa e parë nuk shfaqej si e tij. Ende nuk e kam verifikuar rreshtin në Neon real.

### Prova 2: Rasti 2 · Pranimi përditëson të dy ekranet

- Hapat dhe vendet para/pas: nga kërkesa në pritje për ID 2 klikova “Prano kërkesën” si shofer pronar. Pa Refresh, të dy ekranet kaluan nga 2 vende në 1 dhe shfaqën “U pranua”. Udhëtarja mori edhe sqarimin se vendi u konfirmua nga serveri.
- Përsëritja e pranimit dhe prova me 0 vende: përsërita të njëjtin POST dhe numri mbeti 1. Në kontrollin SQL krijova një kërkesë tjetër në pritje, vendosa përkohësisht 0 vende në të dhënat lokale të provës dhe provova pranimin. Mora refuzimin 409; vendet mbetën 0 dhe kërkesa mbeti në pritje.
- Çfarë pashë realisht te të dy përdoruesit: pas pranimit të vlefshëm, të dy panë 1 vend dhe statusin e pranuar, pa rifreskim manual. Testi lokal kaloi. Kontrollova edhe një gabim të detyruar gjatë UPDATE-it të kërkesës: i gjithë transaksioni u anulua dhe ulja e vendeve nuk mbeti e ruajtur. Provat për një shofer tjetër dhe për udhëtarin që tenton pranimin u refuzuan në server. Testet lokale nuk zëvendësojnë provën e ngarkesës me shumë lidhje të njëkohshme Neon.

### Prova 3: Rasti 3 · Ndërprerja dhe rilidhja

- ID-ja e udhëtimit të ri të provës, cila dritare ishte offline dhe si e provova: përdora ID **1**, me 2 vende dhe një kërkesë të re në pritje. Me kontrollin e shfletuesit e vendosa vetëm kontekstin e udhëtares offline; kontekstin e shoferit e lashë online. Nuk ndërpreva Wi-Fi-n e gjithë kompjuterit.
- Pamja e fundit gjatë ndërprerjes: udhëtarja mbajti “Në pritje” dhe 2 vende, me paralajmërimin e rilidhjes dhe veprimet të bllokuara. Ndërkohë shoferi e pranoi kërkesën dhe pa “U pranua”, me 1 vend. Nuk u shfaq numër i rremë 0 te udhëtarja.
- Çfarë ndryshoi pas rilidhjes: riktheva rrjetin vetëm te udhëtarja. Pa Refresh manual, leximi i menjëhershëm solli “U pranua” dhe 1 vend; paralajmërimi u hoq pas përgjigjes së suksesshme. Kjo provë kaloi në mjedisin lokal.

### Kontrolle shtesë

Kontrollova një lexim të vonuar 7 sekonda: klienti nuk nisi lexim të dytë gjatë pritjes. Pas largimit nga faqja prita më shumë se intervali i timer-it dhe nuk pati lexime të reja nga ajo faqe. Kontrollova edhe pamjen në 375 px, pa lëvizje horizontale.

`npm.cmd run lint` dhe `npm.cmd run build` më përfunduan me sukses, përfshirë TypeScript. Në fillim build-i më tregoi se literali BigInt nuk përputhej me objektivin ekzistues TypeScript; e zëvendësova me `BigInt("9223372036854775807")` dhe e përsërita kontrollin me sukses.

Në serverin real Next.js production provova API-në pa sesion, me një sekret sesioni të përkohshëm vetëm në proces: GET dhe POST u refuzuan me 401, pa kërkuar databazën. Pa konfigurimin e nevojshëm të autentikimit mora 503, pra nuk e raportova si hyrje funksionale. POST-i nga origjinë tjetër u refuzua me 403. Rruga e vjetër `/udhetimi/2/kerkesa` ktheu ridrejtimin 307 te detajet dhe nuk krijoi kërkesë përmes GET-it.

## Ku gjendet puna

- `aplikacioni/schema-java10.sql`: tabela `kerkesat`, çifti unik, funksionet `kerko_vend` dhe `prano_kerkesen`.
- `aplikacioni/src/lib/gjendja.ts`: identiteti nga sesioni, leximi personal në një SELECT, validimi dhe thirrja e funksioneve SQL.
- `aplikacioni/src/app/api/udhetimet/[id]/gjendja/route.ts`: leximi GET dhe veprimet POST me `veprimi: "kerko"` ose `veprimi: "prano"` dhe ID-në e kërkesës.
- `aplikacioni/src/components/GjendjaUdhetimit.tsx`: timer-i, anulimi i leximit, pritja e veprimit, ruajtja e pamjes së fundit dhe rilidhja.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx`: integrimi i komponentit te detajet. Nuk shfaq më një numër statik vendesh pranë numrit të sinkronizuar.
- `aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx`: ridrejtimi i lidhjes së vjetër, pa shkrim në databazë.
- `aplikacioni/src/app/panel/page.tsx` dhe `aplikacioni/src/app/layout.tsx`: teksti i përshtatur për kërkesat reale të kësaj jave.
- Repository: https://github.com/valzathaqi-hue/rideshare-mobile
- Në aplikacion përdor `/udhetimi/2` për provën e parë dhe `/udhetimi/1` për rilidhjen, pasi përgatis të dhënat fiktive. Nuk kam bërë publikim të ri në Vercel.

## Prova me kolegun

Nuk e kam kryer ende demonstrimin me kolegun. Për një hyrje tjetër kam përgatitur rastin me 0 vende dhe një kërkesë në pritje. Parashikimi im është që pranimi të refuzohet, statusi të mos bëhet i pranuar dhe vendet të mos bëhen negative. Kontrolli lokal e konfirmoi këtë; rregullin e shpjegoj te kushti `u.vende <= 0` në `prano_kerkesen`. Më mbetet ta përsëris dhe ta shpjegoj personalisht me kolegun, me një vlerë që e zgjedh ai.

## Çfarë mbetet për përmirësim

Duhet të konfiguroj privatisht Neon dhe GitHub OAuth, të ekzekutoj migrimin pas `schema.sql` e `schema-java05.sql`, dhe t'i caktoj profilit të shoferit rolin dhe pronësinë e udhëtimeve fiktive të provës. Pastaj duhet t'i përsëris tri provat me dy sesione reale dhe ta përditësoj raportin me vëzhgimet nga Neon.

Përditësimin e kam periodik, jo në kohë reale me WebSocket. Një ndryshim nga përdoruesi tjetër mund të presë rreth 5 sekonda plus kohën e rrjetit. Lista kryesore nuk ka timer; sinkronizimi i kësaj jave është te detajet e udhëtimit. Nuk kam përfshirë refuzimin/anulimin e kërkesës, pagesa ose dërgimin e vendtakimit lokal te shoferi. Numrin e vendeve në të dhënat e provës duhet ta përgatis përpara skenarit, pa prekur udhëtime reale ose duke rikthyer vende mbi kërkesa tashmë të pranuara.

Një timer që lexon çdo 5 sekonda nuk garanton rezervim të saktë: ai vetëm tregon gjendjen e lexuar. Saktësinë e pranimit e mbështes te kontrolli i pronarit, kyçja e rreshtit, kontrolli i vendeve dhe transaksioni në PostgreSQL.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Përdora AI për të analizuar projektin, për të shkruar migrimin, funksionet e serverit, komponentin e sinkronizimit dhe këtë raport, si dhe për të përgatitur e ekzekutuar testet automatike lokale. E kam dalluar në raport kontrollin e automatizuar nga demonstrimi personal që nuk e kam kryer ende. Më mbetet ta provoj vetë me Neon dhe dy llogari reale dhe të jem në gjendje ta shpjegoj e ta ndryshoj kodin në klasë.

## Pas dorëzimit të parë — përditëso më vonë

Ende nuk kam hapur Issue për Javën 10 dhe nuk kam marrë përgjigjen e botit. Pas dorëzimit do të shtoj linkun e Issue-t, commit-in e kontrolluar dhe rezultatin e çdo kontrolli. Push-i nuk është dorëzim në lëndë; 2/2 teknikisht nuk provon tri rastet e sinkronizimit.
