'use client'

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Definisikan tipe data
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

const paymentMethods = [
  { id: 'mbanking', name: 'm-Banking (Virtual Account)' },
  { id: 'dana', name: 'DANA' },
  { id: 'ovo', name: 'OVO' },
  { id: 'gopay', name: 'GoPay' },
];

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // State untuk data checkout
  const [addressOption, setAddressOption] = useState('default'); // 'default' atau 'new'
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [newAddress, setNewAddress] = useState('');

  // Ambil data keranjang saat komponen dimuat
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCartItems(data);
          setIsLoading(false);
        });
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fungsi untuk mengubah kuantitas
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    // Optimistic UI update
    const originalItems = [...cartItems];
    const updatedItems = cartItems.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0);
    setCartItems(updatedItems);

    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
    } catch (error) {
      console.error("Gagal update kuantitas:", error);
      setCartItems(originalItems); // Rollback jika gagal
      alert('Gagal memperbarui keranjang.');
    }
  };

  // Fungsi untuk menyelesaikan pesanan
  const handlePlaceOrder = async () => {
    const shippingAddress = addressOption === 'default' ? session?.user?.address : newAddress;
    if (!shippingAddress) {
      alert('Alamat pengiriman wajib diisi.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Keranjang Anda kosong.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: shippingAddress,
          paymentMethod: selectedPayment,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal membuat pesanan.');
      }
      alert('Pesanan berhasil dibuat! Terima kasih telah berbelanja.');
      router.push('/profile'); // Arahkan ke halaman profil
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Hitung total harga
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  if (isLoading || status === 'loading') {
    return <div className="card text-center">Memuat keranjang Anda...</div>
  }

  if (!isLoading && cartItems.length === 0) {
    return <div className="card text-center">Keranjang Anda kosong. Silakan kembali berbelanja.</div>
  }

  return (
    <div className="card">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Kolom Kiri: Detail Pesanan & Alamat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daftar Item */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                <Image src={item.product.imageUrl} alt={item.product.name} width={80} height={80} className="object-cover rounded-lg"/>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Rp{item.product.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} className="btn p-2 h-8 w-8">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} className="btn p-2 h-8 w-8">+</button>
                </div>
                <strong className="w-28 text-right">Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</strong>
              </div>
            ))}
          </div>

          {/* Opsi Alamat Pengiriman */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="radio" id="default_address" name="address" value="default" checked={addressOption === 'default'} onChange={() => setAddressOption('default')} className="mr-2"/>
                <label htmlFor="default_address" className="w-full">
                  Gunakan alamat profil:
                  <p className="text-sm text-gray-600 p-2 bg-gray-100 rounded mt-1">{session?.user?.address || 'Alamat belum diatur di profil.'}</p>
                </label>
              </div>
              <div className="flex items-start">
                <input type="radio" id="new_address" name="address" value="new" checked={addressOption === 'new'} onChange={() => setAddressOption('new')} className="mr-2 mt-1"/>
                <label htmlFor="new_address" className="w-full">
                  Gunakan alamat baru:
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    disabled={addressOption !== 'new'}
                    placeholder="Masukkan alamat lengkap Anda di sini..."
                    className="input-field w-full mt-1 disabled:bg-gray-100"
                    rows={3}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan & Pembayaran */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
             <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>
             <div className="space-y-2 mb-6">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center">
                    <input type="radio" id={method.id} name="payment" value={method.id} checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="mr-2"/>
                    <label htmlFor={method.id}>{method.name}</label>
                  </div>
                ))}
             </div>

             <h2 className="text-xl font-semibold mb-4">Total Pembayaran</h2>
             <div className="flex justify-between items-center text-lg my-2">
                <span>Subtotal</span>
                <strong>Rp{totalPrice.toLocaleString('id-ID')}</strong>
             </div>
             <hr className="my-2"/>
             <div className="flex justify-between items-center text-2xl font-bold my-4">
                <span>Total</span>
                <strong>Rp{totalPrice.toLocaleString('id-ID')}</strong>
             </div>
             <button onClick={handlePlaceOrder} className="btn w-full text-lg py-3" disabled={isProcessing}>
               {isProcessing ? 'Memproses...' : 'Pesan Sekarang'}
             </button>
          </div>
        </div>
      </div>
       <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
      `}</style>
    </div>
  )
}