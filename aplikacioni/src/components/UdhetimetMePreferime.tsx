"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { KartaUdhetimi } from "./KartaUdhetimi";
import { ruajPreferimin } from "@/app/preferimet/actions";
import type { GjendjaPreferimeve } from "@/lib/preferimet";
import type { Udhetim } from "@/lib/udhetimet";

export default function UdhetimetMePreferime({ udhetimet, fillimi }: {
  udhetimet: Udhetim[];
  fillimi: GjendjaPreferimeve;
}) {
  const [ids, setIds] = useState(fillimi.ids);
  const [nePritje, setNePritje] = useState<string | null>(null);
  const [gabimi, setGabimi] = useState<{ id: string; mesazh: string } | null>(null);
  const [konfirmuar, setKonfirmuar] = useState<string | null>(null);
  const poRuhet = useRef(false);

  async function ruaj(id: string) {
    if (poRuhet.current || ids.includes(id) || !fillimi.perdoruesi || fillimi.gabim) return;
    poRuhet.current = true;
    const mepare = ids;
    setIds([...mepare, id]);
    setNePritje(id);
    setGabimi(null);
    setKonfirmuar(null);
    try {
      const rezultati = await ruajPreferimin(id);
      if (!rezultati.ok) {
        setIds(mepare);
        setGabimi({ id, mesazh: rezultati.mesazh });
      } else {
        setKonfirmuar(id);
      }
    } catch {
      setIds(mepare);
      setGabimi({ id, mesazh: "Nuk u konfirmua ruajtja. Provo përsëri ose rifresko faqen." });
    } finally {
      setNePritje(null);
      poRuhet.current = false;
    }
  }

  return (
    <section aria-label="Udhëtimet dhe preferimet">
      {fillimi.gabim ? (
        <p role="alert">{fillimi.gabim} Rifresko faqen për të provuar përsëri.</p>
      ) : fillimi.perdoruesi ? (
        <p aria-live="polite">Të preferuarat: <strong data-testid="favorites-count">{ids.length}</strong></p>
      ) : <p><Link href="/panel">Hyr me GitHub</Link> për të ruajtur preferimet e tua.</p>}
      <p>Preferim personal · jo rezervim. Vendet dhe vendtakimi nuk ndryshojnë.</p>
      <div className="trip-list">
        {udhetimet.map((udhetim) => {
          const id = udhetim.id;
          const zgjedhur = ids.includes(id);
          const pret = nePritje === id;
          return (
            <div key={id} className="favorite-trip" data-trip-id={id}>
              <KartaUdhetimi udhetim={udhetim} />
              <button
                className="action"
                type="button"
                aria-pressed={zgjedhur}
                disabled={!fillimi.perdoruesi || Boolean(fillimi.gabim) || nePritje !== null || zgjedhur}
                onClick={() => ruaj(id)}
              >{fillimi.gabim ? "Preferimet të padisponueshme" : pret ? "★ Po ruhet…" : zgjedhur ? "★ I ruajtur" : gabimi?.id === id ? "☆ Provo përsëri" : "☆ Ruaj udhëtimin"}</button>
              <p role="status">
                {fillimi.gabim ? "Gjendja e preferimit nuk mund të kontrollohet tani."
                  : pret ? "Po presim konfirmimin e serverit."
                  : gabimi?.id === id ? gabimi.mesazh
                  : konfirmuar === id ? "U ruajt te të preferuarat."
                  : zgjedhur ? "Preferimi u lexua nga serveri."
                  : "Nuk është te të preferuarat."}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
