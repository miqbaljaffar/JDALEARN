// app/products/page.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Interface untuk mendefinisikan struktur data produk
interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Ubah state error untuk menyimpan pesan yang lebih deskriptif
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        // 1. Cek jika respons tidak OK
        if (!res.ok) {
          // Coba ambil pesan error dari body respons
          const errorData = await res.json().catch(() => null); 
          throw new Error(errorData?.message || 'Gagal mengambil data dari server. Silakan coba lagi nanti.');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        // 2. Set state error dengan pesan yang lebih jelas
        setError(err.message);
        console.error("Gagal mengambil data produk:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Tampilan saat loading
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat produk...</div>;
  }

  // 3. Tampilan jika ada error, lebih user-friendly
  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'red', borderColor: 'red' }}>
        <h2>Terjadi Kesalahan</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn" style={{marginTop: '20px'}}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1>Produk Kami</h1>
        <p>Jelajahi koleksi pakaian berkualitas tinggi dari kami, siap untuk Anda miliki.</p>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Saat ini tidak ada produk yang tersedia.</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link href={`/products/${product.id}`}>
                <div className="product-image" style={{ position: 'relative', height: '250px', cursor: 'pointer' }}>
                  <Image
                    src={product.imageUrl}
                    alt={`Gambar produk ${product.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={(e) => e.currentTarget.src = '/products/default.jpg'}
                  />
                </div>
              </Link>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  Kategori: {product.category.name}
                </p>
                <div className="price" style={{ marginBottom: '20px' }}>
                  Rp{product.price.toLocaleString('id-ID')}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button 
                    className="btn" 
                    style={{ flex: 1, background: '#333', borderColor: '#333' }}
                    onClick={() => alert(`Menambahkan ${product.name} ke keranjang!`)}
                  >
                    Checkout
                  </button>
                  <Link 
                    href={`/products/${product.id}`} 
                    className="btn" 
                    style={{ flex: 1, background: 'transparent', color: '#000', border: '2px solid #000', textAlign: 'center' }}
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}