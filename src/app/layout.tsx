import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "RELIC — Ropa vintage seleccionada",
  description: "Prendas vintage únicas, seleccionadas para el presente.",
};

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${spaceGrotesk.variable} ${dmMono.variable} font-sans antialiased`}><StoreShell>{children}</StoreShell></body></html>;
}
