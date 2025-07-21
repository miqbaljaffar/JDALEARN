// app/dashboard/orders/page.tsx
'use client'

// Dummy data untuk pesanan
const dummyOrders = [
  { id: 1001, customer: 'Budi Santoso', date: '2025-07-20', total: 250000, status: 'Shipped' },
  { id: 1002, customer: 'Citra Lestari', date: '2025-07-21', total: 450000, status: 'Processing' },
  { id: 1003, customer: 'Ahmad Dahlan', date: '2025-07-21', total: 150000, status: 'Pending' },
  { id: 1004, customer: 'Dewi Anggraini', date: '2025-07-22', total: 750000, status: 'Delivered' },
];

export default function OrdersPage() {
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>#{order.id}</td>
                  <td style={{ padding: '12px' }}>{order.customer}</td>
                  <td style={{ padding: '12px' }}>{order.date}</td>
                  <td style={{ padding: '12px' }}>Rp{order.total.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        color: '#fff',
                        backgroundColor: order.status === 'Shipped' ? '#3b82f6' : order.status === 'Processing' ? '#f97316' : order.status === 'Delivered' ? '#22c55e' : '#f59e0b'
                    }}>
                        {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}