import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kpata — Tout ce dont vous avez besoin, au même endroit.",
  description:
    "Kpata est la destination shopping en ligne des Béninois : des milliers de produits, livrés partout au Bénin.",
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
