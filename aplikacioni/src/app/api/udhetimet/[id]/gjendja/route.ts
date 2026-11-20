import { GabimGjendjeje, lexoGjendjen, ndryshoGjendjen } from "@/lib/gjendja";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
type Context = { params: Promise<{ id: string }> };

function gabim(error: unknown) {
  return Response.json(
    { error: error instanceof GabimGjendjeje ? error.message : "Gjendja nuk mund të lexohet ose ruhet tani." },
    { status: error instanceof GabimGjendjeje ? error.status : 503, headers },
  );
}

export async function GET(_request: Request, { params }: Context) {
  try { return Response.json(await lexoGjendjen((await params).id), { headers }); }
  catch (error) { return gabim(error); }
}

export async function POST(request: Request, { params }: Context) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Origjinë e palejuar." }, { status: 403, headers });
  }
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Kërkesë e pavlefshme." }, { status: 400, headers }); }
  if (!body || (body.veprimi !== "kerko" && body.veprimi !== "prano") ||
      (body.veprimi === "prano" && typeof body.kerkesaId !== "string")) {
    return Response.json({ error: "Veprim i pavlefshëm." }, { status: 400, headers });
  }
  try {
    return Response.json(await ndryshoGjendjen((await params).id, body.veprimi, body.kerkesaId), { headers });
  } catch (error) { return gabim(error); }
}
