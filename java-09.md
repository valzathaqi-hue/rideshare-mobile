# RideShare — Java 9

## Çfarë ndërtova

Te lista publike u shtua ruajtja e udhëtimeve të preferuara për përdoruesin e kyçur. Pas klikimit ylli mbushet, numri rritet dhe shfaqet “Po ruhet…”, me shpjegimin se po pritet konfirmimi i serverit. Gjatë pritjes nuk niset një ruajtje tjetër. Suksesi shfaqet vetëm pasi serveri konfirmon shkrimin. Në refuzim ose dështim të kërkesës, rikthehen lista e mëparshme e ID-ve, ylli dhe numri, dhe ofrohet riprovim.

Preferimet lexohen nga serveri gjatë hapjes/rifreskimit të listës. Identiteti merret nga sesioni NextAuth me GitHub, jo nga një fushë e klientit. SQL përdor parametra dhe filtron sipas përdoruesit të sesionit. Përdoruesi tjetër lexon vetëm preferimet e veta. Pa hyrje, lista mbetet publike dhe shfaqet lidhja për hyrje; ruajtja refuzohet edhe në server. Nëse leximi i preferimeve dështon, shfaqet gabimi dhe nuk paraqitet numri 0 si rezultat i konfirmuar.

Migrimi `schema-java09.sql` shton tabelën `preferimet`, me çelësin primar të përbërë `(github_id, udhetimi_id)` dhe lidhje me `profilet` e `udhetimet`. `INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING` e bën përsëritjen të sigurt: i njëjti synim ruajtjeje konfirmon të njëjtin çift. Nuk shtohet kopje, nuk ndryshojnë vendet dhe nuk kryhet rezervim. Heqja e preferimeve nuk është përfshirë.

## Provat që bëra

Kontrollet teknike u kryen nga AI më 20.11.2026, me komponentin real React në Chrome dhe funksionet reale të `src/lib/preferimet.ts` kundër PostgreSQL lokal PGlite. U ekzekutuan skemat e projektit dhe migrimi i ri; sesioni u zëvendësua me dy përdorues fiktivë. Një mjedis i përkohshëm testimi lidhi komponentin me funksionin real të ruajtjes. Ky mjedis nuk publikohet si faqe e aplikacionit dhe nuk zëvendëson Neon ose hyrjen reale. Mbështjellësi Server Action i Next.js dhe OAuth nuk u testuan në këtë mjedis; build-i i Next.js u kontrollua veçmas.

Në projekt ende mungon `aplikacioni/.env.local`. Prandaj tri provat me llogari reale GitHub, Neon dhe aplikacionin e plotë mbeten për t'u kryer. Rezultatet lokale më poshtë nuk deklarohen si prova të përfunduara me Neon, GPS, koleg ose si rezultat i botit.

### Prova 1: Ruajtja e suksesshme mbetet pas rifreskimit.

Hapat: në mjedisin lokal të testimit, përdoruesja fiktive nisi me 0 preferime. U klikua ruajtja për ID 2 dhe përgjigjja u mbajt në pritje. U kontrolluan ylli, numri dhe butoni; pastaj u lejua shkrimi në PostgreSQL. U rifreskua faqja e testimit, e cila rilexoi të dhënat përmes `lexoPreferimet`.

Pritshmëria: ylli të mbushet menjëherë dhe numri të bëhet 1, por mesazhi të mbetet “Po ruhet…” deri në përgjigje. Pas suksesit dhe rileximit nga databaza të mbeten ylli i mbushur dhe numri 1. Numri i vendeve të udhëtimit të mos ndryshojë.

Vëzhgimi: kaloi në mjedisin lokal. Gjatë pritjes numri ishte 1 dhe butoni joaktiv; pas shkrimit u shfaq “I ruajtur”. Pas rifreskimit u lexua sërish një preferim nga PostgreSQL. SQL konfirmoi një rresht për çiftin. Përdoruesi i dytë fiktiv lexoi 0 preferime dhe mund ta ruante udhëtimin për vete. Mbetet riprovimi i të njëjtëve hapa në Next.js me Neon dhe sesion real.

### Prova 2: Gabimi i serverit nuk lë një sukses të rremë në ekran.

Hapat: nga gjendja me një preferim të ruajtur për ID 2, u zgjodh ID 1 ende e paruajtur. U aktivizua refuzimi i kontrolluar `PREFERIME_REFUZO_PROVEN=1` me `NODE_ENV=development`. Pas klikimit numri u bë përkohësisht 2. U lejua përgjigjja e refuzimit; më pas u çaktivizua refuzimi dhe u provua përsëri.

Pritshmëria: refuzimi të ndodhë përpara çdo shkrimi SQL. Numri të kthehet nga 2 në 1, ylli i ID 1 të zbrazet dhe të shfaqet “Provo përsëri”. Preferimi i mëparshëm për ID 2 të ruhet. Pas çaktivizimit të provës, ruajtja të funksionojë.

Vëzhgimi: kaloi në mjedisin lokal. Kontrolli i thirrjeve konfirmoi 0 pyetje SQL për degën e refuzimit. Për ID 1 nuk kishte rresht në databazë; ylli dhe numri u rikthyen, butoni u riaktivizua. Riprovimi pa refuzim ruajti ID 1 dhe numri u bë 2. Flamuri është vetëm i serverit, funksionon vetëm në zhvillim dhe nuk është aktivizuar në projekt. Nuk ka buton refuzimi ose rrugë publike që anashkalon hyrjen.

Në një gabim rrjeti nuk mund të pohohet se databaza nuk shkroi: ndaj mesazhi i përgjithshëm thotë “Nuk u konfirmua ruajtja”, ofron riprovim/rifreskim dhe pamja rikthehet te gjendja e mëparshme. Përsëritja e sigurt shmang kopjet edhe kur përgjigjja humbet pas shkrimit.

### Prova 3: Klikimet e përsëritura nuk krijojnë kopje.

Hapat: për ID 3 të paruajtur u nisën katër klikime të njëpasnjëshme në të njëjtin cikël. Përgjigjja u mbajt në pritje për ta vëzhguar. Pas suksesit u përsërit ruajtja drejtpërdrejt në funksionin e serverit dhe u rifreskua pamja. Veçmas u nisën tetë ruajtje për të njëjtin çift dhe u tentua një INSERT i dyfishtë pa trajtimin ON CONFLICT.

Pritshmëria: klienti të nisë vetëm një kërkesë gjatë pritjes; përsëritjet në server të mos shtojnë rresht tjetër ose të rrisin numrin gabimisht. Çelësi primar të ndalojë kopjen edhe kur nuk përdoret butoni i aplikacionit.

Vëzhgimi: kaloi në mjedisin lokal. Katër klikimet nisën një kërkesë dhe numri u rrit vetëm një herë. Pas ruajtjeve të përsëritura dhe rifreskimit kishte vetëm një rresht për çiftin. INSERT-i i drejtpërdrejtë i dyfishtë u refuzua nga PostgreSQL me kodin `23505`. Migrimi u ekzekutua dy herë pa gabim. U kontrolluan edhe refuzimi pa sesion, ID e pavlefshme dhe ID 99 që nuk ekziston; nuk u shtuan preferime për këto raste. Pamja në 375 px nuk kishte tejkalim horizontal.

## Ku gjendet puna

- `aplikacioni/schema-java09.sql`: migrimi dhe çelësi unik i përdoruesit me udhëtimin.
- `aplikacioni/src/lib/preferimet.ts`: kontrolli i sesionit, leximi personal, validimi dhe ruajtja SQL.
- `aplikacioni/src/app/preferimet/actions.ts`: Server Action dhe rifreskimi i rrugës kryesore pas suksesit.
- `aplikacioni/src/components/UdhetimetMePreferime.tsx`: pamja optimiste, gjendja e pritjes, rikthimi dhe numri personal.
- `aplikacioni/src/app/page.tsx`: leximi fillestar në server dhe integrimi në listë. Çelësi i komponentit ndryshon me përdoruesin/gjendjen e lexuar.
- `aplikacioni/src/app/globals.css`: paraqitja e kartave me preferime.
- Repository: https://github.com/valzathaqi-hue/rideshare-mobile
- Rrjedha e aplikacionit: `/`, hyrja te `/panel`. Nuk është krijuar publikim i ri në Vercel.

`npm.cmd run lint` dhe `npm.cmd run build` kaluan, përfshirë TypeScript. SQL, testet e komponentit dhe pamja u verifikuan lokalisht me të dhëna fiktive. U kontrollua edhe gabimi i leximit fillestar: nuk shfaqet numri 0 si rezultat, butonat mbeten joaktivë dhe gjendja shpjegohet si e panjohur. Paketat dhe skedarët e përkohshëm të provave mbetën jashtë repository-t; nuk u shtuan varësi në aplikacion.

## Çfarë mbetet për përmirësim

Duhet të konfigurohen privatisht Neon dhe GitHub OAuth sipas README, pastaj të ekzekutohet `schema-java09.sql` pas dy skemave të mëparshme. Duhet të përsëriten tri provat me aplikacionin real, të shihet rreshti në Neon dhe të përditësohet ky raport me rezultatet. Demonstrimi me kolegun dhe parashikimi i tij për një ID tjetër nuk janë kryer gjatë kësaj pune.

Ruajtjet në këtë pamje kryhen një nga një, që rikthimi i një gabimi të mos fshijë ndryshimin e një kërkese tjetër. Heqja e preferimeve dhe sinkronizimi automatik mes disa tab-eve janë zgjerime të ardhshme; tab-i tjetër merr gjendjen e re me rifreskim. Preferimet nuk ruhen te kopja publike offline. API-ja publike e udhëtimeve mbetet pa këto të dhëna personale.

Push-i ruan kodin dhe raportin. Issue-ja për Javën 9 dhe leximi i përgjigjes së botit janë hapa të veçantë. Gjatë kësaj pune nuk është krijuar Issue dhe nuk pretendohet rezultat 2/2 ose notë. Kontrolli teknik i botit nuk provon tri sjelljet.

## Ndihma nga AI (Artificial Intelligence)

AI lexoi projektin dhe modelin zyrtar, shkroi migrimin, komponentin, funksionet e serverit, integrimin dhe këtë raport. Gjithashtu kreu build/lint dhe provat lokale me PostgreSQL e shfletues me përdorues fiktivë. Hyrja reale me GitHub, konfigurimi Neon, demonstrimi personal dhe kontrolli me kolegun nuk janë kryer nga studentja gjatë kësaj pune. Studentja duhet ta provojë dhe ta shpjegojë zgjidhjen në klasë, përfshirë pse ylli optimist nuk vërteton ruajtje.
