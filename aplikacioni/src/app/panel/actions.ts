"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ndryshoOren } from "@/lib/lejet";

export async function ruajOren(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const ora = String(formData.get("ora") ?? "");
  let mesazh: string;
  try {
    mesazh = await ndryshoOren(id, ora);
  } catch {
    mesazh = "databaza";
  }

  if (mesazh === "ruajtur") {
    revalidatePath("/");
    revalidatePath(`/udhetimi/${id}`);
  }
  // redirect është jashtë try/catch, sepse ndërpret rrjedhën e Next.js.
  redirect("/panel?m=" + mesazh);
}
