# Java 3 · RideShare

## Çfarë ndërtova

Vazhdova projektin e Javës 2 në Next.js me App Router: lista me tri karta, detajet e udhëtimit dhe kërkesa e simuluar. Të dhënat janë fiktive dhe ruhen në `aplikacioni/src/lib/udhetimet.ts`. Kartat përdorin komponentin `KartaUdhetimi.tsx`.

## Provat

### Prova 1 · Lista në telefon

Kontrolli i përgjigjes së serverit konfirmoi saktësisht tri karta dhe konfigurimin viewport për telefon; stilet kanë një kolonë, hapësirë mes kartave dhe veprime me lartësi të paktën 44 px. Kontrolli vizual në 375 px dhe mungesa e lëvizjes anash mbeten për t'u provuar në Chrome/Edge, sepse lidhja e kontrollit të shfletuesit nuk ishte e disponueshme.

### Prova 2 · Detajet, zero vende dhe ID 99

Kontrolli lokal HTTP konfirmoi se `/udhetimi/2` përmban vendtakimin “Te stacioni kryesor”, orën 08:15 dhe një vend të lirë; `/udhetimi/3` ka buton të çaktivizuar “Nuk ka vende të lira”, ndërsa `/udhetimi/99` kthen HTTP 404 dhe përmban mesazhin “Udhëtimi nuk u gjet” me lidhjen për te lista në përgjigjen e Next.js.

### Prova 3 · Kërkesa dhe kthimi mbrapa

Kontrolli lokal HTTP konfirmoi mesazhin “Simulim: Në pritje” te `/udhetimi/2/kerkesa`, sqarimin se kërkesa nuk është dërguar te shoferi dhe lidhjen e kthimit te `/udhetimi/2`; detajet kanë lidhjen për te lista. Hapja direkte e `/udhetimi/3/kerkesa` shfaq mungesën e vendeve, pa mesazh pritjeje.

## Korrigjimet dhe kontrollet

- Thjeshtova `next.config.ts`, sepse konfigurimi i cache-it pengonte build-in e faqeve dinamike.
- Vendosa gjuhën shqipe dhe titullin RideShare; përdora fontin e sistemit.
- Shtova README në rrënjën e repository-t dhe këtë raport pranë tij.
- `npm run lint` dhe `npm run build` përfunduan me sukses.
- Kontrollet HTTP u kryen lokalisht në versionin production, në portin 3005.

Këto janë kontrolle teknike me ndihmën e AI-së. Prova vizuale në telefon dhe prova me një koleg nuk janë kryer gjatë këtij kontrolli dhe duhen bërë nga studenti. Përgjigjja automatike e dorëzimit në GitHub nuk është kontrolluar këtu.

## Kufijtë e projektit

Kërkesa është vetëm demonstrim. Nuk ka rezervim real, hyrje përdoruesi, databazë ose pagesa.

## Ndihma nga AI

Përdora AI për kontrollin e kërkesave, korrigjimin e konfigurimit, dokumentimin dhe provat teknike lokale. Kodin dhe rrjedhën do t'i provoj edhe vetë në shfletues.
