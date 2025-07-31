'use client'

import { useCartStore } from "@/app/store/cart";

// Definisikan tipe untuk properti produk yang dibutuhkan
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Definisikan tipe untuk props komponen
interface AddToCartButtonProps {
  product: Product; // Sekarang menerima objek produk lengkap
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean; 
}

export default function AddToCartButton({ product, className, style, children, disabled }: AddToCartButtonProps) {
  // 1. Ambil aksi `addToCart` langsung dari store Zustand
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    // 2. Tidak perlu lagi memeriksa sesi atau memanggil API dari sini
    if (disabled) return;
    
    // 3. Cukup panggil aksi `addToCart` dengan data produk yang diterima dari props
    addToCart(product); 
  };

  return (
    <button onClick={handleAddToCart} className={className} style={style} disabled={disabled}>
      {children}
    </button>
  );
}