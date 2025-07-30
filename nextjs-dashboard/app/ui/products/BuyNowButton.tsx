'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function BuyNowButton({ productId, className, style, children }: BuyNowButtonProps) {
  const { status } = useSession();
  const router = useRouter();

  const handleBuyNow = async () => {
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
        throw new Error('Gagal menambahkan produk');
      }

      // 2. Jika berhasil, langsung arahkan ke halaman checkout
      router.push('/checkout');

    } catch (error) {
      console.error(error);
      alert('Gagal memproses, silakan coba lagi.');
    }
  };

  return (
    <button onClick={handleBuyNow} className={className} style={style}>
      {children}
    </button>
  );
}