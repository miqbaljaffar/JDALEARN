import Sidenav from '@/app/(admin)/dashboard/ui/sidenav';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard | Ztyle',
  description: 'Halaman manajemen untuk admin Ztyle.',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. Ambil data sesi di server
  const session = await getServerSession(authOptions);

  // 2. Lakukan pengecekan otorisasi
  if (!session || session?.user?.role !== 'ADMIN') {
    // 3. Jika bukan admin, alihkan ke halaman utama
    redirect('/');
  }

  // 4. Jika lolos, tampilkan layout dashboard
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <Sidenav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}