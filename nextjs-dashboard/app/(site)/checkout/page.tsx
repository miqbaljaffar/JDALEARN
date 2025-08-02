'use client'

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/app/store/cart';
import { toast } from 'sonner';
import { CreditCardIcon, MapPinIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';

const paymentMethods = [
  { id: 'mbanking', name: 'm-Banking (BCA VA)', account: '1234567890' },
  { id: 'dana', name: 'DANA', account: '08123456789' },
  { id: 'ovo', name: 'OVO', account: '08987654321' },
  { id: 'gopay', name: 'GoPay', account: '08112233445' },
];

export default function CheckoutPage() {
  const { items: cartItems, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressOption, setAddressOption] = useState('saved'); // State untuk pilihan alamat

  useEffect(() => {
    if (session?.user?.address) {
      setShippingAddress(session.user.address);
    }
  }, [session]);

  const handlePlaceOrder = async () => {
    // Cek status sesi sebelum melakukan apapun
    if (status === 'unauthenticated') {
      toast.error('Anda harus login untuk melanjutkan pesanan.');
      router.push('/login'); 
      return; 
    }

    if (!shippingAddress.trim()) {
      toast.error('Alamat pengiriman wajib diisi.');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Keranjang Anda kosong.');
      return;
    }

    setIsProcessing(true);
    const promise = fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: selectedPayment,
        items: cartItems.map(item => ({ 
          productId: item.id, 
          quantity: item.quantity,
          price: item.price
        })),
      }),
    }).then(async (res) => {
      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || 'Gagal membuat pesanan.');
      }
      return orderData;
    });

    toast.promise(promise, {
      loading: 'Memproses pesanan Anda...',
      success: (orderData) => {
        clearCart();
        router.push(`/payment/${orderData.id}`);
        return 'Pesanan berhasil dibuat! Mengalihkan ke halaman pembayaran...';
      },
      error: (err) => {
        setIsProcessing(false);
        return err.message;
      },
    });
  };
  
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="text-center py-20">
        <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-gray-500">Sepertinya Anda belum menambahkan produk apapun.</p>
        <Link href="/products" className="btn mt-6">
          Mulai Belanja
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ringkasan Pesanan</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="object-cover rounded-lg"/>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Rp{item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn-qty">-</button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn-qty">+</button>
                  </div>
                  <strong className="w-28 text-right text-gray-800">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="h-5 w-5"/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
             <h2 className="text-xl font-semibold mb-4 text-gray-700">Alamat Pengiriman</h2>
             <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="saved-address"
                        name="addressOption"
                        value="saved"
                        checked={addressOption === 'saved'}
                        onChange={() => setAddressOption('saved')}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="saved-address" className="ml-3 block text-sm font-medium text-gray-700">
                        Gunakan Alamat Tersimpan
                    </label>
                </div>
                {addressOption === 'saved' && (
                    <div className="pl-7 text-gray-600">
                        <p>{session?.user?.address || 'Tidak ada alamat tersimpan.'}</p>
                    </div>
                )}
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="new-address"
                        name="addressOption"
                        value="new"
                        checked={addressOption === 'new'}
                        onChange={() => setAddressOption('new')}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="new-address" className="ml-3 block text-sm font-medium text-gray-700">
                        Gunakan Alamat Baru
                    </label>
                </div>
                {addressOption === 'new' && (
                    <div className="pl-7"> 
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Masukkan alamat lengkap Anda (Jalan, No. Rumah, Kelurahan, Kecamatan, Kota, Kode Pos)"
                          className="input-field w-full" 
                          rows={4}
                        />
                    </div>
                )}
              </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
             <h2 className="text-xl font-semibold mb-4 text-gray-700">Metode Pembayaran</h2>
             <div className="space-y-3 mb-6">
                {paymentMethods.map(method => (
                  <div key={method.id} onClick={() => setSelectedPayment(method.id)}
                       className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <CreditCardIcon className="h-6 w-6 mr-3 text-gray-600"/>
                    <span className="font-semibold">{method.name}</span>
                  </div>
                ))}
             </div>

             <hr className="my-4"/>

             <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <strong>Rp{totalPrice.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>Biaya Pengiriman</span>
                    <strong>Gratis</strong>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-2 text-gray-800">
                    <span>Total</span>
                    <strong>Rp{totalPrice.toLocaleString('id-ID')}</strong>
                </div>
             </div>
             
             <button onClick={handlePlaceOrder} className="btn w-full text-lg py-3 mt-6" disabled={isProcessing}>
               {isProcessing ? 'Memproses...' : 'Buat Pesanan & Bayar'}
             </button>
          </div>
        </div>
      </div>
       <style jsx>{`
        .input-field {
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
        }
        .btn-qty {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 9999px;
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
            transition: background-color 0.2s;
        }
        .btn-qty:hover {
            background-color: #e5e7eb;
        }
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}