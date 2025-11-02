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
  title: "Gelişmiş Portfolyo Projesi", // Başlığı portfolyoya çevirelim
  description: "Next.js 16 + Supabase ile güçlendirildi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-light dark:bg-black text-foreground`}
      >
        {/* Navigasyonu kaldırdık çünkü ana sayfanız (app/page.tsx) 
          ve admin paneliniz (app/admin/layout.tsx) kendi navigasyon mantıklarına sahip.
          <main> etiketindeki tüm kısıtlayıcı class'ları (max-w-4xl, p-4, mt-8) kaldırdık.
          Bu, app/page.tsx'in tam ekran 3D sahnesini göstermesine izin verecek.
        */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}