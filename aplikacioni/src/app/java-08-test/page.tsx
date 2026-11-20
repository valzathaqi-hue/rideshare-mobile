import Link from "next/link";
import Vendtakimi from "@/components/Vendtakimi";

export default function Java08Test() {
  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>RideShare · Vendtakimi i Artës</h1>
      <p>Udhëtimi 2 · Dritoni · Ferizaj → AAB · 08:15 · 2 vende</p>
      <p>Udhëtim fiktiv për provë. Kjo faqe punon pa hyrje dhe pa databazë.</p>
      <Vendtakimi />
    </main>
  );
}
