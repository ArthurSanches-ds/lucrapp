import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LucrApp",
  description: "Controle financeiro para motoristas de app",
  manifest: "/manifest.json",
  themeColor: "#2d4a2e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LucrApp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
       <Providers>{children}</Providers>
      </body>
    </html>
  );
}