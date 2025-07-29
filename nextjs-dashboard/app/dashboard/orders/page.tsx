'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Tipe data untuk Order
interface Order {
  id: number;
  user: { name: string; };
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentProof: string | null;
}

// Komponen Modal untuk menampilkan bukti bayar
const ProofModal = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative bg-white p-4 rounded-lg">
            <button onClick={onClose} className="absolute top-2 right-2 text-2xl font-bold">&times;</button>
            <Image src={imageUrl} alt="Bukti Pembayaran" width={400} height={600} style={{ objectFit: 'contain' }}/>
        </div>
    </div>
);

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error("Gagal mengambil data pesanan.");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: 'PAID' | 'CANCELLED') => {
    const confirmationText = newStatus === 'PAID' 
      ? 'Apakah Anda yakin ingin mengonfirmasi pembayaran ini?'
      : 'Apakah Anda yakin ingin membatalkan pesanan ini?';

    if (confirm(confirmationText)) {
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        fetchOrders(); // Refresh data
      } catch (error) {
        console.error("Gagal update status:", error);
        alert('Gagal memperbarui status pesanan.');
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
        case 'PAID':
        case 'SHIPPED':
        case 'DELIVERED':
            return '#22c55e'; // Hijau
        case 'WAITING_CONFIRMATION':
            return '#f97316'; // Oranye
        case 'CANCELLED':
            return '#ef4444'; // Merah
        case 'PENDING':
        default:
            return '#f59e0b'; // Kuning
    }
  };


  if (isLoading) return <p>Memuat data pesanan...</p>;

  return (
    <div className="w-full">
      <div className="card">
        <h1>Manajemen Pesanan</h1>
        <p>Lacak dan kelola semua pesanan yang masuk dari pelanggan.</p>
      </div>

      <div className="card">
        <h3>Daftar Pesanan</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Pelanggan</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Tanggal</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>#{order.id}</td>
                  <td style={{ padding: '12px' }}>{order.user.name}</td>
                  <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>Rp{order.totalAmount.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        color: '#fff',
                        backgroundColor: getStatusBadgeColor(order.status)
                    }}>
                        {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                     {order.paymentProof && (
                        <button onClick={() => setViewingProof(order.paymentProof)} className="btn text-xs p-2 mr-2">
                            Cek Struk
                        </button>
                     )}
                     {order.status === 'WAITING_CONFIRMATION' && (
                        <>
                            <button onClick={() => handleUpdateStatus(order.id, 'PAID')} className="btn bg-green-500 hover:bg-green-600 text-xs p-2 mr-2">
                                Konfirmasi
                            </button>
                             <button onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} className="btn bg-red-500 hover:bg-red-600 text-xs p-2">
                                Batalkan
                            </button>
                        </>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {viewingProof && <ProofModal imageUrl={viewingProof} onClose={() => setViewingProof(null)} />}
    </div>
  );
}