# RideShare — Java 8

## Çfarë ndërtova

Te detajet e udhëtimit u shtua komponenti i klientit `Vendtakimi`. Arta mund ta shkruajë vendtakimin dhe ta konfirmojë vetëm në telefonin e saj. Dy vlera `useState` mbajnë veçmas tekstin në shkrim dhe zgjedhjen e konfirmuar. `konfirmo` përdor `trim()`; teksti bosh shfaq gabim dhe ruan zgjedhjen e mëparshme.

Butoni “Përdor vendndodhjen time” kërkon pozicionin vetëm pas klikimit, përmes `getCurrentPosition`, me `timeout: 10000`. Shfaqet pritja dhe më pas rezultati. Suksesi shfaq saktësinë në metra; kodi 1 shfaq refuzimin, kodi 2 pozicionin e padisponueshëm dhe kodi 3 skadimin e kohës. Mungesa e API-së ka mesazh të veçantë. Çdo rezultat përfundon pritjen dhe mundëson riprovimin. Fusha manuale dhe konfirmimi mbeten aktive edhe gjatë pritjes.

Pozicioni nuk shndërrohet automatikisht në emër vendtakimi dhe nuk ndryshon zgjedhjen e konfirmuar. Koordinatat nuk ruhen ose dërgohen. Shoferi nuk e merr këtë zgjedhje; nuk kryhet rezervim. Leximi i udhëtimeve dhe lidhja Neon mbeten në server.

Faqja `/java-08-test` përdor po të njëjtin komponent, me udhëtimin lokal fiktiv ID 2, Dritoni, Ferizaj → AAB, 08:15, 2 vende. Ka etiketat `data-testid` dhe gjendjet që kërkon kontrata zyrtare. `mobile-week08.json` është pranë README; `package-lock.json` mbetet pranë `aplikacioni/package.json`. Në faqen e provës nuk regjistrohet PWA dhe nuk kërkohet lista nga Neon.

## Provat që bëra

Provat teknike më poshtë u kryen nga AI në Chrome me Playwright dhe API vendndodhjeje të kontrolluar, më 20.11.2026. Tetë sjelljet kaluan në serverin lokal dhe u rikonfirmuan në versionin production në portin 3008 (`npm.cmd run build`, pastaj `npm.cmd run start -- --port 3008`). `npm.cmd run lint`, build dhe kontrolli TypeScript kaluan. Nuk u përdor GPS real ose adresa e studentes. Pranimi/refuzimi u simulua përmes përgjigjeve të API-së; nuk deklarohet klikim i një lejeje reale në telefon ose provë me kolegun.

### Prova 1: Leja nuk kërkohet sapo hapet faqja.

Hapat: u hap `/java-08-test` dhe u numëruan thirrjet e API-së: 0. U shkrua `  Biblioteka  ` dhe u konfirmua; më pas u shkrua `Parkingu` pa konfirmim. U klikua butoni i vendndodhjes, u kontrollua gjendja `loading` dhe u kthye sukses fiktiv me saktësi 37 m.

Pritshmëria: hapja të mos kërkojë leje; të konfirmohet `Biblioteka` pa hapësira anësore; vetëm shkrimi të mos ndryshojë zgjedhjen; suksesi të shfaqë 37 m dhe të përfundojë pritjen. Konfirmimi manual të punojë edhe gjatë leximit.

Vëzhgimi: kaluan të gjitha kontrollet. Para klikimit kishte 0 kërkesa. `Biblioteka` mbeti e konfirmuar gjatë shkrimit të `Parkingu`; pas një konfirmimi të ri u ruajt `Parkingu`. Suksesi shfaqi saktësinë 37 m, gjendjen `success` dhe butonin sërish aktiv. API-ja e vendndodhjes nuk zëvendësoi tekstin manual. Rifreskimi e ktheu gjendjen në `idle`, pa vendtakim të konfirmuar dhe pa kërkesë automatike.

### Prova 2: Refuzimi i lejes nuk e bllokon përdoruesin.

Hapat: pas klikimit, API-ja e kontrolluar ktheu `{ code: 1 }`; u konfirmua `Biblioteka` manualisht. U riprovua dhe u kthye `{ code: 3 }`, pastaj u konfirmua `Parkingu`. Veçmas u provuan kodi 2 dhe mungesa e `navigator.geolocation`.

Pritshmëria: kodi 1 të japë `denied` dhe mesazhin “Leja u refuzua. Shkruaj vendtakimin vetë.”; kodi 3 të japë `timeout`; kodi 2 dhe mungesa e mbështetjes të japin `unavailable`, me mesazhe të dallueshme. Pritja të përfundojë, saktësia e vjetër të pastrohet dhe zgjedhja manuale të funksionojë.

Vëzhgimi: të gjitha degët kaluan. Butoni u riaktivizua pas rezultateve dhe zgjedhjet manuale u konfirmuan. Timeout-i ishte **simulim**, jo matje e vonesës reale 10-sekondëshe. Nuk u shtua ose la buton simulimi në aplikacion. Mungesa e API-së shfaqi mesazhin e mbështetjes, kurse kodi 2 shfaqi mesazhin e pozicionit të padisponueshëm. Në 375 px nuk kishte tejkalim horizontal.

### Prova 3: Dëshmitë në GitHub nuk tregojnë adresën time reale.

Hapat: u kontrolluan ndryshimet dhe skedarët që do të publikohen. U verifikua që nuk ndiqen skedarë `.env`, `node_modules` ose `.next`; u kërkuan koordinata, sekrete dhe shenja të modelit të paplotësuar në skedarët e rinj. U vëzhguan kërkesat e faqes së provës gjatë testeve.

Pritshmëria: kodi dhe raporti të përmbajnë vetëm të dhëna fiktive, pa koordinata reale, adresë personale ose çelësa privatë. Faqja e provës të punojë pa shërbime të jashtme.

Vëzhgimi: komponenti lexon vetëm `position.coords.accuracy`; nuk ruan gjerësinë ose gjatësinë gjeografike. Nuk ka dërgim të vendtakimit, ruajtje në databazë, `localStorage` ose log të pozicionit. Të dhënat e faqes janë fiktive; mjetet e testimit dhe pamja e kontrollit ruhen përkohësisht jashtë repository-t. Gjatë testit nuk pati kërkesa drejt shërbimeve të jashtme. Skedari ekzistues i pandjekur `src/` në rrënjë nuk u përfshi në këtë punë.

## Ku gjendet puna

- `aplikacioni/src/components/Vendtakimi.tsx`: gjendja lokale, konfirmimi dhe leximi i vendndodhjes.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx`: përdor komponentin te detajet, me `key={id}` që zgjedhja të mos bartet në një udhëtim tjetër.
- `aplikacioni/src/app/java-08-test/page.tsx`: i njëjti komponent pa Neon ose login.
- `aplikacioni/src/app/globals.css`: forma e përshtatshme për telefon.
- `aplikacioni/src/components/Pwa.tsx`: përjashton faqen e provës nga regjistrimi dhe leximi PWA.
- `mobile-week08.json`: `{"version":1,"path":"/java-08-test"}`.
- Repository: https://github.com/valzathaqi-hue/rideshare-mobile
- Prova lokale: http://localhost:3007/java-08-test kur serveri niset me `npm.cmd run dev -- --port 3007` nga `aplikacioni/`. Nuk ka publikim të ri në Vercel.

## Çfarë mbetet për përmirësim

Zgjedhja mbahet vetëm në kujtesën e komponentit dhe humbet pas rifreskimit ose largimit. Dritoni nuk e merr, sepse nuk ka dërgim ose lexim të vendtakimit nga serveri. Ruajtja dhe ndarja me shoferin janë punë e ardhshme.

Detajet reale vazhdojnë të kërkojnë konfigurimin Neon të javëve të kaluara; faqja e provës funksionon pa të. Mbetet demonstrimi personal në telefon, përfshirë dialogun real të lejes, dhe shpjegimi në klasë. Kontrollet lokale të tetë sjelljeve kaluan; kjo nuk është rezultat i botit të GitHub-it. Dorëzimi me Issue dhe leximi i dy komenteve të botit mbeten të veçanta nga Push-i.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

AI lexoi udhëzimin dhe kontratën zyrtare, shkroi komponentin, e integroi në projekt, përgatiti faqen e testimit dhe këtë raport, si dhe kreu kontrollet në Chrome me të dhëna fiktive. Provat personale të studentes dhe demonstrimi me kolegun nuk u kryen gjatë kësaj pune dhe nuk paraqiten si të përfunduara. Studentja duhet ta lexojë, provojë dhe shpjegojë kodin në klasë.

## Prova me një hyrje të re

- Hyrja që provova: në testin e AI, pas konfirmimit të `Biblioteka` u shkrua `Parkingu` pa konfirmim dhe pastaj tekst vetëm me hapësira, që u konfirmua.
- Parashikimi im para klikimit: pritshmëria e kontrollit teknik ishte që `Biblioteka` të mbetej e konfirmuar në të dy rastet dhe konfirmimi i hapësirave të shfaqte gabim. Nuk është parashikim personal i studentes ose i kolegut.
- Çfarë pashë realisht: testet në Chrome konfirmuan të dyja sjelljet; zgjedhja mbeti `Biblioteka` dhe u shfaq gabimi për tekstin bosh.
- Skedari dhe funksioni që e shpjegojnë: `aplikacioni/src/components/Vendtakimi.tsx`, funksioni `konfirmo`. `onChange` ndryshon vetëm `teksti`; `konfirmo` ndryshon `vendtakimi` vetëm pasi `teksti.trim()` nuk është bosh.
- Çfarë kuptova ose korrigjova: shkrimi dhe konfirmimi kanë gjendje të ndryshme. Kontrolli i tekstit bosh kthehet para ndryshimit të zgjedhjes së konfirmuar. Kjo duhet të shpjegohet dhe të riprovohet personalisht me kolegun.

Kontrata e testimit: https://arbenl.github.io/lendet/2026-2027/mobile/java-08/testimi-automatik.html
