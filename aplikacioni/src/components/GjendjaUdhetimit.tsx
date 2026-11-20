"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GjendjaUdhetimit as Pamja } from "@/lib/gjendja";

type Lidhja = "loading" | "online" | "reconnecting" | "login" | "unavailable";

export default function GjendjaUdhetimit({ id }: { id: string }) {
  const [pamja, setPamja] = useState<Pamja | null>(null);
  const [lidhja, setLidhja] = useState<Lidhja>("loading");
  const [mesazhi, setMesazhi] = useState("");
  const [nePritje, setNePritje] = useState(false);
  const dukeVepruar = useRef(false);
  const aktiv = useRef(false);
  const post = useRef<AbortController | null>(null);
  const kontrolli = useRef({ rilexo: () => {}, ndalo: () => {} });

  useEffect(() => {
    aktiv.current = true;
    let mbyllur = false;
    let dukeLexuar = false;
    let perserite = false;
    let versioni = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let leximi: AbortController | null = null;
    const url = `/api/udhetimet/${encodeURIComponent(id)}/gjendja`;

    function ndalo() {
      clearTimeout(timer);
      versioni++;
      leximi?.abort();
    }
    function rilexo() {
      if (mbyllur) return;
      clearTimeout(timer);
      if (dukeLexuar) { perserite = true; ndalo(); }
      else void lexo();
    }
    async function lexo() {
      if (mbyllur || dukeLexuar || dukeVepruar.current) return;
      if (!navigator.onLine) {
        setLidhja("reconnecting");
        timer = setTimeout(rilexo, 5000);
        return;
      }
      dukeLexuar = true;
      const kyVersion = ++versioni;
      leximi = new AbortController();
      const afati = setTimeout(() => leximi?.abort(), 10000);
      let ndalim = false;
      try {
        const response = await fetch(url, { cache: "no-store", credentials: "same-origin", signal: leximi.signal });
        if (mbyllur || kyVersion !== versioni) return;
        if ([401, 403, 404].includes(response.status)) {
          setPamja(null);
          setLidhja(response.status === 401 ? "login" : "unavailable");
          ndalim = true;
          return;
        }
        if (!response.ok) throw new Error("Leximi dështoi.");
        const data: Pamja = await response.json();
        if (mbyllur || kyVersion !== versioni) return;
        if (data.id !== id || !Number.isInteger(data.vende) || data.vende < 0 || !Array.isArray(data.kerkesat)) {
          throw new Error("Gjendje e pavlefshme.");
        }
        setPamja(data);
        setLidhja("online");
      } catch {
        if (!mbyllur && kyVersion === versioni) setLidhja("reconnecting");
      } finally {
        clearTimeout(afati);
        dukeLexuar = false;
        leximi = null;
        if (!mbyllur && !dukeVepruar.current) {
          if (perserite) { perserite = false; void lexo(); }
          else if (!ndalim) timer = setTimeout(rilexo, 5000);
        }
      }
    }
    function offline() {
      ndalo();
      setLidhja("reconnecting");
      if (!dukeLexuar) timer = setTimeout(rilexo, 5000);
    }
    kontrolli.current = { rilexo, ndalo };
    window.addEventListener("online", rilexo);
    window.addEventListener("offline", offline);
    void lexo();
    return () => {
      mbyllur = true;
      aktiv.current = false;
      ndalo();
      post.current?.abort();
      kontrolli.current = { rilexo: () => {}, ndalo: () => {} };
      window.removeEventListener("online", rilexo);
      window.removeEventListener("offline", offline);
    };
  }, [id]);

  async function vepro(veprimi: "kerko" | "prano", kerkesaId?: string) {
    if (dukeVepruar.current || lidhja !== "online") return;
    dukeVepruar.current = true;
    kontrolli.current.ndalo();
    setNePritje(true);
    setMesazhi("Po ruajmë veprimin…");
    post.current = new AbortController();
    const afati = setTimeout(() => post.current?.abort(), 10000);
    try {
      const response = await fetch(`/api/udhetimet/${encodeURIComponent(id)}/gjendja`, {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ veprimi, kerkesaId }), signal: post.current.signal,
      });
      const result = await response.json();
      if (!aktiv.current) return;
      setMesazhi(response.ok ? result.mesazh : result.error);
      if (response.status === 401 || response.status === 403) {
        setPamja(null);
        setLidhja(response.status === 401 ? "login" : "unavailable");
      }
    } catch {
      if (aktiv.current) {
        setMesazhi("Nuk u konfirmua veprimi. Pas rilidhjes do të rilexojmë gjendjen.");
        setLidhja("reconnecting");
      }
    } finally {
      clearTimeout(afati);
      post.current = null;
      dukeVepruar.current = false;
      if (aktiv.current) {
        setNePritje(false);
        kontrolli.current.rilexo();
      }
    }
  }

  const bllokuar = lidhja !== "online" || nePritje;
  return (
    <section id="kerkesa" className="meeting" aria-label="Gjendja e udhëtimit">
      <h2>Vendet dhe kërkesat</h2>
      <p>Vende të lira: <strong data-testid="trip-seats">{pamja?.vende ?? "—"}</strong></p>
      <p role="status" data-testid="sync-status" data-state={lidhja}>
        {lidhja === "online" ? "Gjendja u lexua nga serveri."
          : lidhja === "reconnecting" ? "Po rilidhemi · të dhënat mund të jenë të vjetra. Veprimet që kërkojnë rrjet janë të bllokuara."
          : lidhja === "login" ? "Hyr në llogari për të lexuar kërkesat."
          : lidhja === "unavailable" ? "Gjendja nuk është e disponueshme për këtë sesion ose udhëtim."
          : "Po lexojmë gjendjen…"}
      </p>
      {lidhja === "login" && <Link href="/panel">Hyr me GitHub</Link>}
      <p>Përditësim automatik çdo 5 sekonda pas përfundimit të leximit.</p>
      {pamja && <>
        <h3>{pamja.roli === "shofer" ? "Kërkesat për udhëtimin tim" : "Kërkesa ime"}</h3>
        {pamja.kerkesat.length === 0 && <p>Pa kërkesë</p>}
        {pamja.kerkesat.map((k) => (
          <div className="trip-card" key={k.id} data-request-id={k.id}>
            <p>{k.udhetari}: <strong>{k.statusi === "e_pranuar" ? "U pranua" : "Në pritje"}</strong></p>
            {k.statusi === "e_pranuar" && pamja.roli === "udhetar" && <p>Vendi u konfirmua nga serveri.</p>}
            {pamja.roli === "shofer" && <button className="action"
              disabled={bllokuar || k.statusi === "e_pranuar" || pamja.vende === 0}
              onClick={() => vepro("prano", k.id)}>Prano kërkesën</button>}
          </div>
        ))}
        {pamja.roli === "udhetar" && <button className="action" data-testid="request-seat"
          disabled={bllokuar || pamja.vende === 0 || pamja.kerkesat.length > 0}
          onClick={() => vepro("kerko")}>
          {pamja.kerkesat.length > 0 ? "Kërkesa u dërgua" : pamja.vende === 0 ? "Nuk ka vende të lira" : "Kërko një vend"}
        </button>}
      </>}
      <p role="status" data-testid="mutation-status">{mesazhi}</p>
      <p>Dërgimi i kërkesës nuk rezervon vend. Vetëm pranimi i shoferit e konfirmon.</p>
    </section>
  );
}
