// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Umut Karaytuğ | Full-Stack Developer", // Başlığı güncelledim
  description: "Yaratıcı 3D ve AI çözümleri üreten geliştirici portfolyosu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* body'ye yeni arka plan rengimizi uygulayalım */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Main tag'i tam ekran deneyimi için kısıtlamasız kalmalı */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}