import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QueryForge — citation-first document Q&A",
  description:
    "Open-source intent routing + retrieval + source-linked answers over a markdown corpus. Domain-agnostic demo.",
  openGraph: {
    title: "QueryForge",
    description: "Citation-first document Q&A demo",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
