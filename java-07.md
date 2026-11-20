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
Ky skedar lexon ID-në, merr udhëtimin dhe shfaq detajet. Teksti “Kërko vend” u ndryshua në “Provo kërkesën · simulim”. Para tij u shtua “Kjo është vetëm provë: nuk rezervohet vend dhe nuk njoftohet shoferi.” Përdoruesi e kupton kufirin përpara veprimit. Kushti vende > 0, ID-ja dhe rruga e kërkesës mbetën të njëjta; me 0 vende ruhet butoni joaktiv. Nuk u shtua rezervim ose panel i ri.

## Versionet
Para: https://github.com/valzathaqi-hue/rideshare-mobile/commit/ccc7ff629799704848d50fe89f2b7572d1b88d63
Pas: https://github.com/valzathaqi-hue/rideshare-mobile/commit/05fe27810e1a6dc1d657f65bd56c7b2b7003a2be

## Provat që bëra
### Prova 1
Hapat: më 20.11.2026 AI nisi npm.cmd run dev -- --port 3007 nga aplikacioni dhe kërkoi /, /udhetimi/2 dhe /udhetimi/2/kerkesa përmes HTTP në aplikacionin lokal.
Pritshmëria: lista dhe detajet të lexojnë ID 2; kërkesa të shpjegojë simulimin, pa rezervim ose njoftim real.
Vëzhgimi: përgjigjet ishin HTTP 200 me mesazhin “Nuk u lidhëm me databazën. Provo përsëri.” Nuk u panë vlerat e udhëtimit ose gjendja e simulimit. Rrjedha nuk kaloi, sepse mungon DATABASE_URL. HTTP 200 nuk është provë e suksesit të rrjedhës.

### Prova 2
Hapat: pas korrigjimit AI kërkoi përsëri /udhetimi/2 dhe /udhetimi/2/kerkesa dhe lexoi përmbajtjen e elementit main të përgjigjeve.
Pritshmëria: për një udhëtim me vende, detajet të tregojnë “Provo kërkesën · simulim” dhe paralajmërimin para klikimit; faqja pasuese të tregojë “Simulim: Në pritje”.
Vëzhgimi: të dyja faqet kthyen HTTP 200 me gabimin e databazës dhe lidhjen e kthimit te lista. Korrigjimi nuk mund të verifikohej në rrjedhën reale. Ky kontroll është i bllokuar, jo i kaluar; kontrolli i izoluar më poshtë nuk e zëvendëson.

### Prova 3
Hapat: AI ndryshoi vetëm ID-në në adresë nga /udhetimi/2 në /udhetimi/99, pa ndryshuar databazën ose kodin.
Pritshmëria: me databazë funksionale dhe pa ID 99, të shfaqet “Udhëtimi nuk u gjet” me lidhjen te lista.
Vëzhgimi: përmbajtja main shfaqi gabimin e databazës dhe lidhjen e kthimit; përgjigjja ishte HTTP 200. Kontrolli për ID të munguar nuk u arrit, sepse leximi i databazës dështoi më herët. Ky rezultat nuk provon sjelljen e ID-së së panjohur me Neon aktiv.

### Kontrolle teknike shtesë
- npm.cmd run lint dhe npm.cmd run build përfunduan me sukses, përfshirë TypeScript.
- Në një renderim të izoluar të faqes reale TSX, AI zëvendësoi vetëm leximin e databazës me një objekt prove: ID 2, 08:20, 2 vende. U verifikuan teksti i simulimit, paralajmërimi dhe lidhja /udhetimi/2/kerkesa.
- Me të njëjtin objekt dhe vetëm vende = 0, renderimi kishte butonin disabled dhe nuk kishte lidhje kërkese ose tekst veprimi për simulimin.
- Me vetëm ID = 99, zëvendësuesi nuk ktheu udhëtim dhe komponenti thirri notFound. Këto tri kontrolle të izoluara kaluan; ato nuk përdorën Neon, klikime në shfletues ose koleg dhe nuk paraqiten si tri prova të përfunduara të detyrës.

## Ndryshimi i ri
Demonstrimi me kolegun nuk është kryer. Puna po përgatitet jashtë kontrollit në çift; shpjegimi personal mbetet për takimin e radhës. Hyrja alternative e kontrolluar nga AI ishte ID 99; në kontrollin e izoluar u ndryshuan edhe vendet nga 2 në 0. Nuk deklarohet se këto ndryshime i bëri kolegu.

## Ndihma nga AI
AI lexoi projektin, modelin zyrtar dhe gjeneratorin publik, identifikoi paqartësinë në tekst, shkroi ndryshimin e vogël dhe këtë raport, si dhe kreu kontrollet HTTP, renderimin e izoluar, lint dhe build. Parashikimi personal, verifikimi nga studentja dhe shpjegimi me kolegun nuk janë kryer gjatë kësaj pune. Sipas ushtrimit, studentja duhet ta shkruajë e provojë vetë ndryshimin dhe ta shpjegojë pa AI në kontrollin në çift; ky raport nuk pretendon përmbushjen e këtyre pjesëve.

## Çfarë mbetet për përfundimin dhe dorëzimin
1. Studentja duhet të shkruajë parashikimin e saj; gjendja fillestare është ruajtur sinqerisht pa të. Parashikimi nuk mund të deklarohet më vonë si i shkruar para këtij korrigjimi.
2. Të konfigurohet privatisht Neon sipas README dhe të përgatitet rreshti fiktiv ID 2 me të dhënat P7-904. Sekretet nuk duhen publikuar.
3. Të përsëriten tri provat në shfletues: lista → ID 2 → kërkesa; sqarimi i simulimit para/pas klikimit; vetëm një hyrje tjetër, p.sh. ID 99 ose 0 vende. Të shënohen vëzhgimet reale në këtë raport.
4. Të kryhet demonstrimi personal me kolegun dhe të dokumentohet hyrja e ndryshuar.
5. Pastaj të bëhet Commit/Push i raportit të përditësuar, të hapet formulari i Javës 7 dhe të lexohet përgjigjja e botit në Issue. Gjatë kësaj pune nuk është krijuar Issue ose marrë rezultat 5/5; Push-i nuk përbën dorëzim të lëndës.

Modeli zyrtar: https://arbenl.github.io/lendet/2026-2027/mobile/java-07/java-07-model.md
Gjeneratori publik: https://arbenl.github.io/lendet/2026-2027/mobile/java-07/week-07-model.mjs
