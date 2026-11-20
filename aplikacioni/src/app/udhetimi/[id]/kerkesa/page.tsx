import { redirect } from "next/navigation";

export default async function Kerkesa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // GET vetem hap faqen; kerkesa dergohet nga butoni POST.
  redirect(`/udhetimi/${encodeURIComponent(id)}#kerkesa`);
}
