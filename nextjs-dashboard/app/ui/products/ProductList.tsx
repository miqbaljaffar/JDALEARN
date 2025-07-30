'use client';

import { useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Filter from '@/app/ui/products/filter';
import AddToCartButton from '@/app/ui/products/AddToCartButton';

// Interface untuk props
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name:string };
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductListProps {
  initialProducts: Product[];
  categories: Category[];
}

type Filters = {
  categoryIds: number[];
  priceRange: [number, number];
};

export default function ProductList({ initialProducts, categories }: ProductListProps) {
  // State untuk produk sekarang diinisialisasi dengan data dari server
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fungsi untuk mengambil data produk dari sisi klien (saat filter berubah)
  const fetchProducts = useCallback(async (filters: Filters) => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams(searchParams.toString());

    // Hapus parameter lama sebelum mengatur yang baru
    params.delete('categoryId');

    // Atur parameter baru
    if (filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(id => params.append('categoryId', String(id)));
    }
    params.set('minPrice', String(filters.priceRange[0]));
    params.set('maxPrice', String(filters.priceRange[1]));
    
    // Update URL tanpa reload halaman
    router.replace(`${pathname}?${params.toString()}`);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Gagal memuat produk yang difilter.');
      }
      const data = await res.json();
      setProducts(data.products); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router, searchParams]);

  return (
    // Menggunakan Tailwind CSS untuk layout yang responsif
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      {/* Kolom Filter */}
      <aside>
        {categories.length > 0 && (
          <Filter onFilterChange={fetchProducts} categories={categories} />
        )}
      </aside>

      {/* Kolom Daftar Produk */}
      <div>
        {isLoading ? (
          <div className="flex h-96 items-center justify-center text-gray-500">Memuat produk...</div>
        ) : error ? (
           <div className="card border-red-500 text-center text-red-600">
            <h2 className="font-bold">Terjadi Kesalahan</h2>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card text-center">
            <p>Tidak ada produk yang sesuai dengan kriteria filter Anda.</p>
          </div>
        ) : (
          // Grid produk yang responsif
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="product-card flex flex-col">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative h-64 w-full cursor-pointer overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={`Gambar produk ${product.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => e.currentTarget.src = '/products/default.jpg'}
                    />
                  </div>
                </Link>
                <div className="product-info flex flex-grow flex-col p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="mb-3 text-sm text-gray-500">
                    Kategori: {product.category.name}
                  </p>
                  <div className="price mb-4 text-2xl font-bold text-gray-900">
                    Rp{product.price.toLocaleString('id-ID')}
                  </div>
                  <div className="mt-auto flex gap-2">
                    <AddToCartButton
                      productId={product.id}
                      className="btn flex-1 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Tambah Keranjang
                    </AddToCartButton>
                    <Link 
                      href={`/products/${product.id}`} 
                      className="btn flex-1 border-2 border-gray-800 bg-transparent text-center text-gray-800 hover:bg-gray-100"
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
  );
}