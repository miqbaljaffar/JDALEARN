'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Definisikan tipe untuk item keranjang
interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
          // Perbaikan: Pastikan data yang diterima adalah array.
          if (Array.isArray(data)) {
            setCartItems(data);
          } else {
            // Jika API secara tak terduga mengembalikan format lain,
            // atur ke array kosong untuk mencegah error.
            console.warn("API /api/cart tidak mengembalikan array, mengatur ke array kosong.");
            setCartItems([]);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setCartItems([]); // Set ke array kosong jika ada error jaringan
          setIsLoading(false);
        });
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST'
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal membuat pesanan.');
      }
      alert('Pesanan berhasil dibuat!');
      router.push('/profile'); // Redirect ke halaman profil atau halaman "terima kasih"
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  if (isLoading || status === 'loading') {
    return <div className="card">Memuat keranjang Anda...</div>
  }
  
  if (cartItems.length === 0) {
    return <div className="card">Keranjang Anda kosong.</div>
  }

  return (
    <div className="card">
      <h1>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div>
          <h3>Ringkasan Pesanan</h3>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
              <Image src={item.product.imageUrl} alt={item.product.name} width={80} height={80} style={{ objectFit: 'cover', borderRadius: '8px' }}/>
              <div style={{ marginLeft: '20px', flexGrow: 1 }}>
                <h4>{item.product.name}</h4>
                <p>Kuantitas: {item.quantity}</p>
                <p>Rp{item.product.price.toLocaleString('id-ID')}</p>
              </div>
              <strong>Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</strong>
            </div>
          ))}
        </div>
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
             <h3>Total Pembayaran</h3>
             <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                <span>Subtotal</span>
                <strong>Rp{totalPrice.toLocaleString('id-ID')}</strong>
             </div>
             <hr />
             <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', fontSize: '20px' }}>
                <span>Total</span>
                <strong>Rp{totalPrice.toLocaleString('id-ID')}</strong>
             </div>
             <button onClick={handlePlaceOrder} className="btn" style={{ width: '100%' }} disabled={isProcessing}>
               {isProcessing ? 'Memproses...' : 'Buat Pesanan'}
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}