import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"; // Link bileşenini import et
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
  title: "Gelişmiş Blog Projesi",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-black text-foreground`}
      >
        {/* BASİT NAVİGASYON MENÜSÜ */}
        <nav className="w-full bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-black dark:text-white">
              Ana Sayfa (Blog)
            </Link>
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-sm"
            >
              Admin Paneli (Yeni Ekle)
            </Link>
          </div>
        </nav>

        {/* Sayfa içeriği burada render edilecek */}
        <main className="max-w-4xl mx-auto p-4 mt-8">
          {children}
        </main>
      </body>
    </html>
  );
}