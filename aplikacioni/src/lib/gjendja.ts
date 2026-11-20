import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getSql } from "./db";

export type GjendjaUdhetimit = {
  id: string;
  vende: number;
  roli: "shofer" | "udhetar" | "tjeter";
  kerkesat: { id: string; udhetari: string; statusi: "ne_pritje" | "e_pranuar" }[];
};

export class GabimGjendjeje extends Error {
  constructor(public status: number, mesazh: string) { super(mesazh); }
}

function kontrolloId(id: string) {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) throw new GabimGjendjeje(400, "ID e pavlefshme.");
}

async function sesioniIm() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !/^\d+$/.test(session.user.id)) {
    throw new GabimGjendjeje(401, "Hyr me GitHub për të parë dhe dërguar kërkesa.");
  }
  return session.user;
}

export async function lexoGjendjen(id: string): Promise<GjendjaUdhetimit> {
  kontrolloId(id);
  const user = await sesioniIm();
  const sql = getSql();
  // Një SELECT: vendet dhe kërkesat lexohen nga e njëjta pamje e databazës.
  const rows = await sql`
    SELECT u.id, u.vende,
      CASE WHEN u.shofer_id = ${user.id} AND p.roli = 'shofer' THEN 'shofer'
           WHEN COALESCE(p.roli, 'udhetar') = 'udhetar' AND u.shofer_id IS DISTINCT FROM ${user.id}
           THEN 'udhetar' ELSE 'tjeter' END AS roli,
      COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', k.id::text, 'udhetari', CASE WHEN k.udhetari_id = ${user.id} THEN 'Kërkesa ime' ELSE kp.emri END,
        'statusi', k.statusi) ORDER BY k.id)
        FROM kerkesat k JOIN profilet kp ON kp.github_id = k.udhetari_id
        WHERE k.udhetimi_id = u.id AND (k.udhetari_id = ${user.id}
          OR (u.shofer_id = ${user.id} AND p.roli = 'shofer'))), '[]'::jsonb) AS kerkesat
    FROM udhetimet u LEFT JOIN profilet p ON p.github_id = ${user.id} WHERE u.id = ${id}
  `;
  if (!rows[0]) throw new GabimGjendjeje(404, "Udhëtimi nuk u gjet.");
  return rows[0] as GjendjaUdhetimit;
}

export async function ndryshoGjendjen(id: string, veprimi: "kerko" | "prano", kerkesaId?: string) {
  kontrolloId(id);
  const user = await sesioniIm();
  const sql = getSql();
  let kodi: string;
  if (veprimi === "kerko") {
    await sql`INSERT INTO profilet (github_id, emri) VALUES (${user.id}, ${user.name ?? "Student"})
      ON CONFLICT (github_id) DO NOTHING`;
    const rows = await sql`SELECT kerko_vend(${id}, ${user.id}) AS kodi`;
    kodi = String(rows[0].kodi);
  } else {
    if (!kerkesaId || !/^[1-9]\d{0,18}$/.test(kerkesaId) || BigInt(kerkesaId) > BigInt("9223372036854775807")) {
      throw new GabimGjendjeje(400, "ID e kërkesës nuk është e vlefshme.");
    }
    const rows = await sql`SELECT prano_kerkesen(${id}, ${kerkesaId}::bigint, ${user.id}) AS kodi`;
    kodi = String(rows[0].kodi);
  }
  if (kodi === "ndaluar") throw new GabimGjendjeje(403, "Nuk ke leje për këtë veprim.");
  if (kodi === "mungon") throw new GabimGjendjeje(404, "Udhëtimi ose kërkesa nuk u gjet.");
  if (kodi === "pa_vende") throw new GabimGjendjeje(409, "Nuk ka vende të lira. Kërkesa nuk u pranua.");
  if (kodi === "pa_shofer") throw new GabimGjendjeje(409, "Udhëtimit duhet t’i caktohet shoferi pronar.");
  if (kodi !== "ne_pritje" && kodi !== "e_pranuar") throw new Error("Rezultat i papritur.");
  return { mesazh: veprimi === "kerko" ? "Kërkesa u ruajt. Po rilexojmë gjendjen." : "Pranimi u ruajt. Po rilexojmë gjendjen." };
}
