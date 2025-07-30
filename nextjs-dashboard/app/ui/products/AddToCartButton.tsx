'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

// Buat interface props agar komponen lebih fleksibel
interface AddToCartButtonProps {
  productId: number;
  className?: string; 
  style?: React.CSSProperties; 
  children: React.ReactNode;
  disabled?: boolean;
}

export default function AddToCartButton({ productId, className, style, children }: AddToCartButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleAddToCart = async () => {
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
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan ke keranjang');
      }
      
      toast.success('Produk berhasil ditambahkan ke keranjang!');

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Gagal menambahkan produk ke keranjang.');
    }
  };
  
  return (
    <button onClick={handleAddToCart} className={className} style={style}>
      {children}
    </button>
  );
}