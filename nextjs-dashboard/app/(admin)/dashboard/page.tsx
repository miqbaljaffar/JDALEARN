'use client'

import { poppins } from '@/app/ui/fonts';
import { useEffect, useState } from 'react';
import { DashboardSkeleton } from '@/app/ui/skeletons'; 
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Tipe data untuk statistik, disesuaikan dengan API terbaru
interface Stats {
  totalRevenue: number;
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  salesChartData: { name: string; sales: number }[];
  bestSellingProducts: { name: string; sales: number }[];
  newCustomersChartData: { name: string; customers: number }[];
}

// Komponen Card untuk menampilkan data tunggal
function Card({ title, value }: { title: string; value: string | number; }) {
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

// Komponen Chart yang generik untuk Bar dan Line
function AnalyticsChart({ data, type, dataKey, name, color }: { data: any[], type: 'line' | 'bar', dataKey: string, name: string, color: string }) {
    if (type === 'line') {
        return (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey} name={name} stroke={color} />
              </LineChart>
            </ResponsiveContainer>
        );
    }
    
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} name={name} fill={color} />
            </BarChart>
        </ResponsiveContainer>
    )
}

// Komponen utama halaman Dashboard
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

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
        toast.error("Gagal memuat data statistik.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        <Card title="Total Pendapatan" value={`Rp${stats.totalRevenue.toLocaleString('id-ID')}`} />
        <Card title="Total Penjualan (Unit)" value={stats.totalSales.toLocaleString('id-ID')} />
        <Card title="Jumlah Pelanggan" value={stats.totalCustomers.toLocaleString('id-ID')} />
        <Card title="Jumlah Produk" value={stats.totalProducts.toLocaleString('id-ID')} />
      </div>
      
      {/* Layout baru untuk menampilkan chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        <div className="card w-full">
            <h2 className="text-xl font-semibold">5 Produk Terlaris (Unit)</h2>
            <div className="mt-4">
                <AnalyticsChart 
                    data={stats.bestSellingProducts} 
                    type="bar"
                    dataKey="sales"
                    name="Unit Terjual"
                    color="#8884d8"
                />
            </div>
        </div>
        
        <div className="card w-full">
            <h2 className="text-xl font-semibold">Grafik Pelanggan Baru (Tahun Ini)</h2>
             <div className="mt-4">
                <AnalyticsChart 
                    data={stats.newCustomersChartData} 
                    type="line"
                    dataKey="customers"
                    name="Pelanggan Baru"
                    color="#82ca9d"
                />
            </div>
        </div>

        <div className="card w-full lg:col-span-2">
            <h2 className="text-xl font-semibold">Grafik Penjualan (Unit per Bulan)</h2>
             <div className="mt-4">
                <AnalyticsChart 
                    data={stats.salesChartData} 
                    type="line"
                    dataKey="sales"
                    name="Unit Terjual"
                    color="#ffc658"
                />
            </div>
        </div>

      </div>
    </main>
  );
}
