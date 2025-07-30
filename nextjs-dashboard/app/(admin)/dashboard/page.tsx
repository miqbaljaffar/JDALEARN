'use client'

import { poppins } from '@/app/ui/fonts';
import RevenueChart from '@/app/(admin)/dashboard/ui/revenue-chart'; 
import { useEffect, useState } from 'react';
import { DashboardSkeleton } from '@/app/ui/skeletons'; 
// Tipe data untuk statistik
interface Stats {
  totalRevenue: number;
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  salesChartData: { name: string; sales: number }[];
}

function Card({ title, value, type }: { title: string; value: string | number; type: 'invoices' | 'customers' | 'pending' | 'collected' }) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
                {value}
            </p>
        </div>
    );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State untuk pesan error

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Gagal mengambil data: Status ${res.status}. Respons: ${errorText.substring(0, 100)}...`);
        }
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        console.error("Kesalahan pada fetchStats:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Tampilkan skeleton saat isLoading true
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="card text-center bg-red-50 border-red-500">
            <h2 className="text-xl font-bold text-red-700">Terjadi Kesalahan</h2>
            <p className="text-red-600 mt-2">Tidak dapat memuat data statistik.</p>
            <p className="text-xs text-gray-500 mt-4">Pastikan Anda login sebagai Admin.</p>
        </div>
    );
  }

  if (!stats) {
    return <div className="card text-center">Data statistik tidak ditemukan.</div>;
  }

  return (
    <main>
      <h1 className={`${poppins.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Pendapatan" value={`Rp${stats.totalRevenue.toLocaleString('id-ID')}`} type="collected" />
        <Card title="Total Penjualan (Unit)" value={stats.totalSales} type="pending" />
        <Card title="Jumlah Pelanggan" value={stats.totalCustomers} type="invoices" />
        <Card title="Jumlah Produk" value={stats.totalProducts} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        
        <div className="card w-full col-span-1 md:col-span-4">
            <h2 className="text-xl font-semibold">Grafik Penjualan (Unit Terjual)</h2>
            <div className="mt-4">
                <RevenueChart data={stats.salesChartData} />
            </div>
        </div>
        
        <div className="card w-full col-span-1 md:col-span-4">
            <h2 className="text-xl font-semibold">Aktivitas Terbaru</h2>
            {/* Aktivitas terbaru bisa dibuat dinamis di lain waktu */}
            <ul className="mt-4 space-y-3">
                <li className="p-3 bg-gray-50 rounded-md">Pesanan baru #1005 telah dibuat.</li>
                <li className="p-3 bg-gray-50 rounded-md">Produk "Celana Jeans" stok diperbarui.</li>
                <li className="p-3 bg-gray-50 rounded-md">Pelanggan baru mendaftar: Amelia.</li>
                <li className="p-3 bg-gray-50 rounded-md">Pesanan #1002 statusnya diubah menjadi "Dikirim".</li>
            </ul>
        </div>
      </div>
    </main>
  );
}