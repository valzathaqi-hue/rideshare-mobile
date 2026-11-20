import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import { profiliIm } from "@/lib/lejet";
import { ruajOren } from "./actions";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  hyr: "Hyr në llogari para se të ndryshosh udhëtimin.",
  ndaluar: "Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.",
  fushe: "Shkruaj një orë të vlefshme, p.sh. 08:25. ID duhet të jetë 1, 2 ose 3.",
  ruajtur: "Ora u ruajt me sukses. Kontrollo listën dhe detajet.",
  databaza: "Nuk u lidhëm me databazën. Kontrollo Neon dhe provo përsëri.",
};

export default async function Panel({ searchParams }: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const mesazh = m && Object.hasOwn(mesazhet, m) ? mesazhet[m] : null;
  let p;
  try {
    p = await profiliIm();
  } catch {
    return (
      <main>
        <h1>Paneli im</h1>
        <p role="alert">{mesazhet.databaza}</p>
        <form action="/panel" method="get">
          <button className="action" type="submit">Provo përsëri</button>
        </form>
        <p><Link href="/">Kthehu te udhëtimet</Link></p>
      </main>
    );
  }

  return (
    <main>
      <h1>Paneli im</h1>
      {mesazh && <p role="status">{mesazh}</p>}
      {!p ? (
        <p>Lista është publike. Për panelin hyr me llogarinë tënde GitHub.</p>
      ) : (
        <>
          <p>Përshëndetje, {p.emri}. Roli: <strong>{p.roli}</strong>.</p>
          <p>ID ime GitHub: <code>{p.id}</code></p>
        </>
      )}
      <Hyrja brenda={Boolean(p)} />
      {p?.roli === "shofer" ? (
        <form action={ruajOren} className="panel-form">
          <h2>Ndrysho orën e udhëtimit tim</h2>
          <input type="hidden" name="id" value="2" />
          <label htmlFor="ora">Ora e re</label>
          <input id="ora" name="ora" type="time" defaultValue="08:15" required />
          <button className="action" type="submit">Ruaj orën</button>
          <p>Formulari i laboratorit provon ID 2. Serveri verifikon pronarin edhe nëse ID ndryshohet.</p>
        </form>
      ) : p && (
        <p>Si udhëtar mund të shohësh udhëtimet; nuk mund të ndryshosh orën e shoferit.</p>
      )}
      <p><Link href="/">Kthehu te udhëtimet</Link></p>
      <p>Kërkesat dhe pranimi shfaqen te <Link href="/udhetimi/2">detajet e udhëtimit 2</Link>. Serveri kontrollon rolin dhe pronarin.</p>
    </main>
  );
}
