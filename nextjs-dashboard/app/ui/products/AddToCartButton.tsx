'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Buat interface props agar komponen lebih fleksibel
interface AddToCartButtonProps {
  productId: number;
  className?: string; // class CSS opsional
  style?: React.CSSProperties; // style inline opsional
  children: React.ReactNode; // untuk teks tombol (e.g., "Tambah ke Keranjang")
}

export default function AddToCartButton({ productId, className, style, children }: AddToCartButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleAddToCart = async () => {
    // Jika belum login, arahkan ke halaman login
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });
      
      if (!res.ok) {
        throw new Error('Gagal menambahkan ke keranjang');
      }
      
      alert('Produk berhasil ditambahkan ke keranjang!');
      // Kita hapus window.location.reload() agar tidak ada refresh halaman

    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan produk ke keranjang.');
    }
  };
  
  // Gunakan props untuk mengatur tampilan dan isi tombol
  return (
    <button onClick={handleAddToCart} className={className} style={style}>
      {children}
    </button>
  );
}