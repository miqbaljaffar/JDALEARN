'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Filter from '@/app/ui/products/filter';
import AddToCartButton from '@/app/ui/products/AddToCartButton';
import Pagination from '@/app/ui/pagination';

// Interface untuk tipe data Product
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string; };
  imageUrl: string;
  rating: number; 
}

// Interface untuk tipe data Category
interface Category {
  id: number;
  name: string;
}

// Tipe untuk object filter
type Filters = {
  categoryIds: number[];
  priceRange: [number, number];
} | null;

// Komponen untuk menampilkan bintang rating
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e4e5e9' }}>
        &#9733;
      </span>
    );
  }
  return <div>{stars}</div>;
};


export default function ProductsPage() {
  // State untuk menyimpan data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Hook untuk membaca parameter dari URL
  const searchParams = useSearchParams();

  // Fungsi untuk mengambil data produk dari API
  const fetchProducts = useCallback(async (currentFilters: Filters, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      
      // Menambahkan filter ke parameter URL jika ada
      if (currentFilters && currentFilters.categoryIds.length > 0) {
        currentFilters.categoryIds.forEach((id: number) => params.append('categoryId', String(id)));
      }
      if (currentFilters) {
        params.append('minPrice', String(currentFilters.priceRange[0]));
        params.append('maxPrice', String(currentFilters.priceRange[1]));
      }

      // Menambahkan parameter halaman dan batas tampilan
      params.append('page', String(page));
      params.append('limit', '9');

      // Memanggil API
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null); 
        throw new Error(errorData?.message || 'Gagal mengambil data dari server.');
      }
      const data = await res.json();
      
      // Memperbarui state dengan data dari API
      const productsWithRating = data.products.map((p: Product) => ({ ...p, rating: 4.5 }));
      setProducts(productsWithRating);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);

    } catch (err: any) {
      setError(err.message);
      console.error("Gagal mengambil data produk:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect untuk mengambil data awal saat komponen dimuat atau URL berubah
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    
    const fetchInitialData = async () => {
      try {
        // Ambil data kategori sekali saja
        if (categories.length === 0) {
          const categoriesRes = await fetch('/api/categories');
          if (!categoriesRes.ok) throw new Error('Gagal mengambil data kategori.');
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
        // Panggil fetchProducts dengan filter saat ini dan halaman dari URL
        fetchProducts(filters, pageFromUrl);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchInitialData();
  }, [searchParams, filters, fetchProducts, categories.length]);

  // Handler saat filter diubah
  const handleFilterChange = useCallback((newFilters: NonNullable<Filters>) => {
    setFilters(newFilters);
    // Saat filter berubah, selalu kembali ke halaman 1
    fetchProducts(newFilters, 1);
  }, [fetchProducts]);
  
  // Tampilan loading awal
  if (!categories.length && isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat...</div>;
  }

  // Tampilan jika terjadi error
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
        {/* Kolom Filter */}
        <aside>
          {categories.length > 0 && <Filter onFilterChange={handleFilterChange} categories={categories} />}
        </aside>
        
        {/* Kolom Daftar Produk */}
        <main>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Memuat produk...</div>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>Tidak ada produk yang sesuai dengan kriteria filter Anda.</p>
            </div>
          ) : (
            <>
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
                      <div style={{ marginBottom: '10px' }}>
                          <StarRating rating={product.rating} />
                      </div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                        Kategori: {product.category.name}
                      </p>
                      <div className="price" style={{ marginBottom: '20px' }}>
                        Rp{product.price.toLocaleString('id-ID')}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                        <AddToCartButton
                          productId={product.id}
                          className="btn"
                          style={{ flex: 1, background: '#333', borderColor: '#333' }}
                        >
                          Tambah Keranjang
                        </AddToCartButton>
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
              
              {/* Komponen Pagination ditampilkan di bawah grid produk */}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
