import type { Metadata } from "next";
import Pwa from "@/components/Pwa";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare · Udhëtimet për AAB",
  description: "Projekt universitar me udhëtime fiktive, kërkesa dhe përditësim automatik të gjendjes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq">
      <body>
        <Pwa />
        {children}
      </body>
    </html>
  );
}
