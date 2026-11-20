import Link from "next/link";
import UdhetimetMePreferime from "@/components/UdhetimetMePreferime";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";
import { lexoPreferimet, type GjendjaPreferimeve } from "@/lib/preferimet";

// Lexo të dhënat përsëri kur faqja hapet ose rifreskohet.
export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];
  try {
    udhetimet = await lexoUdhetimet();
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
        <p><Link href="/panel">Hyr / Paneli im</Link></p>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <form action="/" method="get">
          <button className="action" type="submit">Provo përsëri</button>
        </form>
      </main>
    );
  }

  let preferimet: GjendjaPreferimeve;
  try {
    preferimet = await lexoPreferimet();
  } catch {
    preferimet = { perdoruesi: null, ids: [], gabim: "Preferimet nuk mund të lexohen tani." };
  }

  return (
    <main>
      <h1>RideShare · Udhëtimet për AAB</h1>
      <p><Link href="/panel">Hyr / Paneli im</Link></p>
      <p>Burimi: Neon · të dhëna fiktive për ushtrime</p>

      {udhetimet.length === 0 ? (
        <p>Nuk ka udhëtime për momentin.</p>
      ) : (
        <UdhetimetMePreferime
          key={`${preferimet.perdoruesi ?? "publik"}:${preferimet.ids.join(",")}:${preferimet.gabim ?? ""}`}
          udhetimet={udhetimet}
          fillimi={preferimet}
        />
      )}
    </main>
  );
}
