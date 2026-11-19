"use client";

import { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;

    // Renderimi në server nuk mbush cache-n e JSON-it.
    async function warmSnapshot() {
      if (cancelled || !navigator.serviceWorker.controller) return;
      try {
        await fetch("/api/udhetimet", { cache: "no-store" });
      } catch { /* Pa rrjet; worker-i provon kopjen e ruajtur. */ }
    }

    navigator.serviceWorker.addEventListener("controllerchange", warmSnapshot);
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then(warmSnapshot)
      .catch(() => {});

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", warmSnapshot);
    };
  }, []);

  return (
    <aside className="pwa-info">
      <a href="/offline.html">Lista për lexim pa internet</a>
      <p>Kopja e ruajtur mund të jetë e vjetër. Këtu nuk konfirmohen rezervime.</p>
    </aside>
  );
}
