'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Tipe data untuk pesanan
interface OrderItem {
  product: { name: string; imageUrl: string; };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    if (status === 'authenticated') {
      fetch('/api/profile/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [status, router]);
  
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

  if (isLoading) {
    return <div className="card text-center">Memuat riwayat pesanan Anda...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
        <p className="text-gray-600">Lihat semua transaksi yang pernah Anda lakukan.</p>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center">
          <p>Anda belum memiliki riwayat pesanan.</p>
          <Link href="/products" className="btn mt-4">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold">Pesanan #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#fff',
                    backgroundColor: getStatusBadgeColor(order.status)
                }}>
                    {order.status}
                </span>
              </div>
              
              <div className="border-t pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold">
                <span>Total Pesanan:</span>
                <span>Rp{order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              
              {order.status === 'PENDING' && (
                <div className="mt-4 text-right">
                  <Link href={`/payment/${order.id}`} className="btn">
                    Lanjutkan Pembayaran
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}