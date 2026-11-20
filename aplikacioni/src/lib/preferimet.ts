import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getSql } from "./db";

export type GjendjaPreferimeve = {
  perdoruesi: string | null;
  ids: string[];
  gabim: string | null;
};

export type RezultatiPreferimit =
  | { ok: true; id: string }
  | { ok: false; mesazh: string };

export async function lexoPreferimet(): Promise<GjendjaPreferimeve> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id || !/^\d+$/.test(id)) return { perdoruesi: null, ids: [], gabim: null };
  const sql = getSql();
  const rows = await sql`SELECT udhetimi_id FROM preferimet WHERE github_id = ${id} ORDER BY udhetimi_id`;
  return { perdoruesi: id, ids: rows.map((r) => String(r.udhetimi_id)), gabim: null };
}

export async function shtoPreferimin(id: unknown): Promise<RezultatiPreferimit> {
  try {
    const session = await getServerSession(authOptions);
    const perdoruesi = session?.user?.id;
    if (!perdoruesi || !/^\d+$/.test(perdoruesi)) {
      return { ok: false, mesazh: "Hyr me GitHub për të ruajtur udhëtimin." };
    }
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(id)) {
      return { ok: false, mesazh: "ID e udhëtimit nuk është e vlefshme." };
    }

    // Vetëm provë lokale; refuzimi ndodh përpara çdo shkrimi në databazë.
    if (process.env.NODE_ENV === "development" && process.env.PREFERIME_REFUZO_PROVEN === "1") {
      return { ok: false, mesazh: "Nuk u ruajt (refuzim prove). Provo përsëri." };
    }

    const sql = getSql();
    await sql`
      INSERT INTO profilet (github_id, emri)
      VALUES (${perdoruesi}, ${session.user.name ?? "Student"})
      ON CONFLICT (github_id) DO NOTHING
    `;
    const rows = await sql`
      INSERT INTO preferimet (github_id, udhetimi_id)
      SELECT ${perdoruesi}, id FROM udhetimet WHERE id = ${id}
      ON CONFLICT (github_id, udhetimi_id)
      DO UPDATE SET udhetimi_id = EXCLUDED.udhetimi_id
      RETURNING udhetimi_id
    `;
    // Përsëritja konfirmon të njëjtin çift; nuk krijon rresht tjetër.
    if (rows.length !== 1) return { ok: false, mesazh: "Udhëtimi nuk u gjet. Kthehu te lista." };
    return { ok: true, id: String(rows[0].udhetimi_id) };
  } catch {
    // Një përgjigje e humbur nuk provon që shkrimi nuk ndodhi. Riprovimi është idempotent.
    return { ok: false, mesazh: "Nuk u konfirmua ruajtja. Provo përsëri ose rifresko faqen." };
  }
}
