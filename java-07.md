# RideShare · Java 7

## Rasti im
GitHub: valzathaqi-hue
Kodi: P7-904
Skenari i zgjedhur (numri dhe titulli, nga Rastet 1–5): Rasti 3 · Klikim apo rezervim
ID i udhëtimit në projektin tim: 2
Të dhënat fiktive të rastit: Gjakovë → AAB, 08:20, 2 vende. Ora për provën e re: 08:25.

Kodi u llogarit me funksionin publik personalCase të profesorit për llogarinë e repository-t. Këto janë të dhënat e caktuara për provë; ende nuk janë vendosur në Neon. schema.sql aktual ka ID 2: Fushë Kosovë → AAB, 08:15, 1 vend.

## Parashikimi
Parashikimi personal i studentes nuk është dhënë ende. Sipas udhëzimit, ky paragraf duhet të shkruhet prej saj, pa AI; ky version nuk e zëvendëson me një përgjigje të gjeneruar.

## Dy probleme
1. Në kodin e faqes së detajeve, kur ka vende, lidhja shfaq tekstin “Kërko vend”. Vetëm faqja pas klikimit tregon “Simulim: Në pritje” dhe se kërkesa nuk është dërguar. Paqartësia është se kufiri i simulimit nuk shpjegohet para klikimit. Vëzhgim nga leximi i kodit; demonstrimi me databazë mbetet për t'u kryer.
2. Në provën lokale, hapja e listës dhe detajeve të ID 2 shfaq “Nuk u lidhëm me databazën. Provo përsëri.” Nuk ka DATABASE_URL të konfiguruar. Kjo pengon krahasimin e të njëjtit udhëtim dhe provën reale të kërkesës. Ky është kufizim konfigurimi, jo provë që kërkesa funksionon.

## Korrigjimi
Skedari: aplikacioni/src/app/udhetimi/[id]/page.tsx
Ky skedar lexon ID-në, merr udhëtimin dhe shfaq detajet. Do të sqarohet simulimi para klikimit, duke ruajtur kontrollin vende > 0 dhe të njëjtën rrugë të kërkesës.

## Versionet
Para: do të plotësohet me commit-in e këtij versioni fillestar.
Pas: korrigjimi ende nuk është ruajtur.

## Provat që bëra
### Prova 1
Hapat: nisa npm.cmd run dev -- --port 3007 nga aplikacioni dhe kërkova / e /udhetimi/2 përmes HTTP.
Pritshmëria: të lexohen lista dhe detajet e të njëjtit udhëtim.
Vëzhgimi: të dyja përgjigjet ishin HTTP 200 me mesazhin e gabimit të databazës. Rrjedha nuk kaloi; nuk u panë vlerat e udhëtimit.

### Prova 2
Hapat: kontrolli i korrigjimit do të kryhet pas ndryshimit.
Pritshmëria: simulimi të jetë i qartë para klikimit.
Vëzhgimi: ende pa rezultat.

### Prova 3
Hapat: kontrolli me një ID tjetër do të kryhet pas ndryshimit.
Pritshmëria: hyrja tjetër të ketë përgjigjen e vet, pa shfaqur një udhëtim tjetër.
Vëzhgimi: ende pa rezultat.

## Ndryshimi i ri
Demonstrimi me kolegun nuk është kryer. Puna po përgatitet jashtë kontrollit në çift; shpjegimi personal mbetet për takimin e radhës.

## Ndihma nga AI
AI lexoi projektin, modelin zyrtar dhe gjeneratorin publik, identifikoi paqartësinë në tekst dhe nisi kontrollet HTTP. Këto nuk deklarohen si prova personale në shfletues ose si demonstrim me kolegun. Raporti është në përgatitje.
