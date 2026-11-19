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

## Java 3

- Faqja kryesore shfaq saktësisht tri karta me udhëtime fiktive.
- `/udhetimi/2` shfaq detajet dhe vendtakimin e udhëtimit të dytë.
- `/udhetimi/2/kerkesa` shfaq **Simulim: Në pritje**.
- `/udhetimi/3` ka zero vende dhe buton të çaktivizuar.
- `/udhetimi/99` shfaq **Udhëtimi nuk u gjet** dhe lidhjen për te lista.

Kërkesa është vetëm simulim. Nuk ka rezervim real, databazë, hyrje përdoruesi ose pagesa.

Kodi është në `aplikacioni/src/`. Raportet `java-02.md` dhe `java-03.md` ruhen këtu, pranë README-së.

## Kontrolli

```bash
cd aplikacioni
npm run lint
npm run build
```

Për provën në telefon: në Chrome/Edge hap Inspect, aktivizo ikonën e telefonit/tabletit dhe vendos gjerësinë 375 px. Provo listën, detajet, kërkesën dhe lidhjet e kthimit. Rezultatet janë te `java-03.md`.
