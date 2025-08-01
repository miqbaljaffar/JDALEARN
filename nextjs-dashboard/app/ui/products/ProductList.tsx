'use client';

import Link from 'next/link';
import Image from 'next/image';
import Filter from '@/app/ui/products/filter';
import AddToCartButton from '@/app/ui/products/AddToCartButton';

// Interface untuk props (tidak berubah)
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string };
  imageUrl: string;
  stock: number;
}

interface Category {
  id: number;
  name: string;
}

interface ProductListProps {
  products: Product[]; // Ganti nama dari initialProducts
  categories: Category[];
}

export default function ProductList({ products, categories }: ProductListProps) {
  // HAPUS: Semua state seperti [products, setProducts], isLoading, dll.
  // HAPUS: Fungsi fetchProducts

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <aside>
        {/* Filter sekarang akan menangani logikanya sendiri */}
        <Filter categories={categories} />
      </aside>

      <div>
        {products.length === 0 ? (
          <div className="card text-center">
            <p>Tidak ada produk yang sesuai dengan kriteria filter Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="product-card group flex flex-col">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative h-64 w-full cursor-pointer overflow-hidden rounded-t-lg">
                    <Image
                      src={product.imageUrl}
                      alt={`Gambar produk ${product.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = '/products/default.jpg')}
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                        STOK HABIS
                      </div>
                    )}
                  </div>
                </Link>
                <div className="product-info flex flex-grow flex-col p-4">
                  <span className="mb-1 text-xs text-gray-500">{product.category.name}</span>
                  <h3 className="truncate text-base font-semibold text-gray-800 transition-colors duration-200 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <div className="price mt-2 mb-4 text-xl font-bold text-gray-900">
                    Rp{product.price.toLocaleString('id-ID')}
                  </div>
                  <div className="mt-auto">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                      }}
                      className="btn w-full"
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </AddToCartButton>
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