// app/dashboard/page.tsx (Halaman Utama Dashboard Baru - Diperbaiki)
'use client'

// Menggunakan font 'poppins' yang sudah ada di proyek Anda
import { poppins } from '@/app/ui/fonts'; 

// Definisikan komponen Card langsung di sini untuk sementara
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
    // Untuk saat ini, kita akan gunakan data dummy untuk kartu insight.
    const totalRevenue = 125000000;
    const totalSales = 550;
    const totalCustomers = 120;
    const totalProducts = 85;

  return (
    <main>
      <h1 className={`${poppins.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sekarang ini akan bekerja karena komponen Card sudah didefinisikan di atas */}
        <Card title="Total Pendapatan" value={`Rp${totalRevenue.toLocaleString('id-ID')}`} type="collected" />
        <Card title="Total Penjualan" value={totalSales} type="pending" />
        <Card title="Jumlah Pelanggan" value={totalCustomers} type="invoices" />
        <Card title="Jumlah Produk" value={totalProducts} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        
        {/* Placeholder untuk Chart Pendapatan */}
        <div className="card w-full col-span-1 md:col-span-4">
            <h2 className="text-xl font-semibold">Grafik Penjualan</h2>
            <div className="h-80 bg-gray-100 rounded-md mt-4 flex items-center justify-center">
                <p className="text-gray-500">Grafik akan ditampilkan di sini</p>
            </div>
        </div>

        {/* Placeholder untuk Aktivitas Terbaru */}
        <div className="card w-full col-span-1 md:col-span-4">
            <h2 className="text-xl font-semibold">Aktivitas Terbaru</h2>
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