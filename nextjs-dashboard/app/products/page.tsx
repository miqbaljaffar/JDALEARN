// app/products/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Filter from '@/app/ui/products/filter';

// Interface untuk produk dan kategori
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string; };
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
}

// Menambahkan tipe untuk filter
type Filters = {
  categoryIds: number[];
  priceRange: [number, number];
} | null;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(null);

  // Perbaikan 1: Tambahkan tipe untuk parameter 'currentFilters'
  const fetchProducts = useCallback(async (currentFilters: Filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentFilters && currentFilters.categoryIds.length > 0) {
        // Perbaikan 2: Tambahkan tipe untuk parameter 'id'
        currentFilters.categoryIds.forEach((id: number) => params.append('categoryId', String(id)));
      }
      if (currentFilters) {
        params.append('minPrice', String(currentFilters.priceRange[0]));
        params.append('maxPrice', String(currentFilters.priceRange[1]));
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null); 
        throw new Error(errorData?.message || 'Gagal mengambil data dari server.');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Gagal mengambil data produk:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Gagal mengambil data kategori.');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        fetchProducts(null); // Memuat semua produk pada awalnya
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchInitialData();
  }, [fetchProducts]);

  const handleFilterChange = useCallback((newFilters: NonNullable<Filters>) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [fetchProducts]);
  
  if (!categories.length && isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat...</div>;
  }

  if (error && !products.length) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'red', borderColor: 'red' }}>
        <h2>Terjadi Kesalahan</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1>Produk Kami</h1>
        <p>Jelajahi koleksi pakaian berkualitas tinggi dari kami, siap untuk Anda miliki.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
        <div>
          {categories.length > 0 && <Filter onFilterChange={handleFilterChange} categories={categories} />}
        </div>
        
        <div>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Memuat produk...</div>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>Tidak ada produk yang sesuai dengan kriteria filter Anda.</p>
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
      </div>
    </div>
  );
}