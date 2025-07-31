'use client'

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/app/store/cart';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'mbanking', name: 'm-Banking (Virtual Account)' },
  { id: 'dana', name: 'DANA' },
  { id: 'ovo', name: 'OVO' },
  { id: 'gopay', name: 'GoPay' },
];

export default function CheckoutPage() {
  const { items: cartItems, updateQuantity, clearCart } = useCartStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [addressOption, setAddressOption] = useState('default');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [newAddress, setNewAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = addressOption === 'default' ? session?.user?.address : newAddress;
    if (!shippingAddress) {
      toast.error('Alamat pengiriman wajib diisi.');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Keranjang Anda kosong.');
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
          items: cartItems.map(item => ({ 
            productId: item.id, 
            quantity: item.quantity,
            price: item.price
          })),
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || 'Gagal membuat pesanan.');
      }
      
      // Kosongkan keranjang di client setelah pesanan berhasil dibuat di server
      clearCart(); 
      toast.success('Pesanan berhasil dibuat! Anda akan dialihkan...');
      router.push(`/payment/${orderData.id}`);
      // Hapus baris yang tidak perlu dan duplikat

    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(false); // Set isProcessing false hanya jika terjadi error
    } 
    // finally block dihapus agar isProcessing tidak di-set false saat redirect
  };
  
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  // Tampilkan state "Memproses..." agar pesan "Keranjang Kosong" tidak muncul sesaat
  if (status === 'loading' || isProcessing) {
    return <div className="card text-center">Memproses pesanan Anda...</div>
  }

  if (status === 'authenticated' && cartItems.length === 0) {
    return <div className="card text-center">Keranjang Anda kosong. Silakan kembali berbelanja.</div>
  }

  return (
    <div className="card">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="object-cover rounded-lg"/>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Rp{item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="btn p-2 h-8 w-8">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="btn p-2 h-8 w-8">+</button>
                </div>
                <strong className="w-28 text-right">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</strong>
              </div>
            ))}
          </div>

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