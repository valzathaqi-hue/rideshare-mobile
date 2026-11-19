import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare · Udhëtimet për AAB",
  description: "Projekt universitar me tri udhëtime fiktive dhe kërkesë të simuluar për vend.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
