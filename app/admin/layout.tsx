import Link from 'next/link';
import { LayoutDashboard, Plus } from 'lucide-react'; // lucide-react zaten kurulu

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-white dark:bg-dark border-r dark:border-gray-300/20 p-6 space-y-4">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center gap-3 text-gray-200 hover:text-white">
              <LayoutDashboard size={18} />
              Gönderileri Yönet
            </Link>
          </li>
          <li>
            <Link href="/admin/new" className="flex items-center gap-3 text-gray-200 hover:text-white">
              <Plus size={18} />
              Yeni Ekle
            </Link>
          </li>
        </ul>
        <div className="border-t dark:border-gray-300/20 pt-4">
           <Link href="/" className="text-sm text-gray-200 hover:text-white">
            ← Siteye Geri Dön
           </Link>
        </div>
      </nav>
      <main className="flex-1 p-10 bg-light dark:bg-black">
        {children}
      </main>
    </div>
  );
}