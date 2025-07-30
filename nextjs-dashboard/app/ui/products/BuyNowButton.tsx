'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

interface BuyNowButtonProps {
  productId: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean; // Pastikan props disabled diterima
}

export default function BuyNowButton({ productId, className, style, children, disabled }: BuyNowButtonProps) {
  const { status } = useSession();
  const router = useRouter();

  const handleBuyNow = async () => {
    // Tambahkan pengecekan ini di awal fungsi
    if (disabled) {
      toast.error('Stok produk ini sudah habis.');
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    try {
      // 1. Tambahkan produk ke keranjang
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });

      if (!res.ok) {
        // Ambil pesan error dari API
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menambahkan produk');
      }

      // 2. Jika berhasil, langsung arahkan ke halaman checkout
      router.push('/checkout');

    } catch (error: any) {
      console.error(error);
      // Tampilkan error menggunakan toast
      toast.error(error.message || 'Gagal memproses, silakan coba lagi.');
    }
  };

  return (
    // Pastikan untuk meneruskan props 'disabled' ke elemen button
    <button onClick={handleBuyNow} className={className} style={style} disabled={disabled}>
      {children}
    </button>
  );
}