"use client";

import { useId, useState } from "react";

type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

export default function Vendtakimi() {
  const inputId = useId();
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimi, setGabimi] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [mesazhi, setMesazhi] = useState("");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmo() {
    const zgjedhja = teksti.trim();
    if (!zgjedhja) {
      setGabimi("Shkruaj vendtakimin përpara konfirmimit.");
      return;
    }
    setVendtakimi(zgjedhja);
    setGabimi("");
  }

  function kurDeshtonLeximi(error: Pick<GeolocationPositionError, "code">) {
    setSaktesia(null);
    if (error.code === 1) {
      setGjendja("denied");
      setMesazhi("Leja u refuzua. Shkruaj vendtakimin vetë.");
    } else if (error.code === 3) {
      setGjendja("timeout");
      setMesazhi("Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
    } else {
      setGjendja("unavailable");
      setMesazhi("Pozicioni është i padisponueshëm. Provo sërish ose shkruaj vendtakimin vetë.");
    }
  }

  function perdorVendndodhjen() {
    setSaktesia(null);
    if (!navigator.geolocation) {
      setGjendja("unavailable");
      setMesazhi("Ky shfletues nuk mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }

    setGjendja("loading");
    setMesazhi("Po kërkojmë vendndodhjen…");
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSaktesia(position.coords.accuracy);
          setGjendja("success");
          setMesazhi("Pozicioni u mor. Shkruaj dhe konfirmo një vendtakim të dallueshëm.");
        },
        kurDeshtonLeximi,
        { timeout: 10000 },
      );
    } catch {
      kurDeshtonLeximi({ code: 2 });
    }
  }

  return (
    <section className="meeting" aria-label="Zgjedhja e vendtakimit">
      <h2>Vendtakimi im</h2>
      <p>Zgjidh ku do të presësh. Konfirmimi vlen vetëm në këtë telefon; nuk i dërgohet shoferit.</p>
      <form onSubmit={(event) => { event.preventDefault(); konfirmo(); }}>
        <label htmlFor={inputId}>Shkruaj vendtakimin</label>
        <input
          id={inputId}
          data-testid="meeting-input"
          value={teksti}
          onChange={(event) => { setTeksti(event.target.value); setGabimi(""); }}
          placeholder="p.sh. Biblioteka"
          aria-invalid={Boolean(gabimi)}
          aria-describedby={`${inputId}-error`}
        />
        <p id={`${inputId}-error`} data-testid="meeting-error" role="alert">{gabimi}</p>
        <button className="action" type="submit" data-testid="confirm-meeting">Konfirmo në telefon</button>
      </form>
      <p>Vendtakimi i konfirmuar:</p>
      <p data-testid="confirmed-meeting" aria-live="polite">{vendtakimi}</p>
      <button
        className="action"
        type="button"
        data-testid="locate-me"
        disabled={gjendja === "loading"}
        onClick={perdorVendndodhjen}
      >Përdor vendndodhjen time</button>
      <p data-testid="location-status" data-state={gjendja} role="status">{mesazhi}</p>
      <p data-testid="location-accuracy" aria-live="polite">
        {saktesia !== null ? `Saktësia rreth ${Math.round(saktesia)} m` : ""}
      </p>
      <p>Vendndodhja nuk përcakton emrin e vendtakimit. Zgjedhjen e konfirmon vetë; pas rifreskimit ajo humbet.</p>
    </section>
  );
}
