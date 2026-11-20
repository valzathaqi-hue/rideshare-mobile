"use server";

import { revalidatePath } from "next/cache";
import { shtoPreferimin } from "@/lib/preferimet";

export async function ruajPreferimin(id: string) {
  const rezultati = await shtoPreferimin(id);
  if (rezultati.ok) revalidatePath("/");
  return rezultati;
}
