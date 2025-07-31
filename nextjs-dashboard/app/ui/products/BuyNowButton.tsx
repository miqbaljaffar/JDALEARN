'use client'

import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cart"; 
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Definisikan tipe untuk properti produk yang dibutuhkan
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Definisikan tipe untuk props komponen
interface BuyNowButtonProps {
  product: Product; // Menerima objek produk lengkap
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function BuyNowButton({ product, className, style, children, disabled }: BuyNowButtonProps) {
  const router = useRouter();
  const { status } = useSession();
  
  // Ambil aksi `addToCart` dari store
  const addToCart = useCartStore((state) => state.addToCart); 

  const handleBuyNow = () => {
    if (disabled) {
        toast.error('Stok produk ini sudah habis.');
        return;
    }
    
    // Pengecekan sesi tetap diperlukan untuk memastikan hanya pengguna yang login
    // yang dapat melanjutkan ke halaman checkout.
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // 1. Panggil aksi `addToCart` dari store
    addToCart(product);
    
    // 2. Langsung arahkan ke halaman checkout
    router.push('/checkout');
  };

  return (
    <button onClick={handleBuyNow} className={className} style={style} disabled={disabled}>
      {children}
    </button>
  );
}