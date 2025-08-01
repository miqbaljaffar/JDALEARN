'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Tipe data untuk produk
interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 py-10">Produk unggulan tidak ditemukan.</div>;
  }
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const showNavigation = products.length > itemsPerPage;

  const goToPreviousPage = () => {
    setPage((prevPage) => (prevPage === 0 ? totalPages - 1 : prevPage - 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => (prevPage === totalPages - 1 ? 0 : prevPage + 1));
  };

  const startIndex = page * itemsPerPage;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative w-full flex items-center">
      {showNavigation && (
        <button 
          onClick={goToPreviousPage}
          className="absolute left-0 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all duration-300 ease-in-out transform active:scale-90 -translate-x-1/2"
          aria-label="Previous Products"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-900" />
        </button>
      )}

      {/* Grid untuk Gambar Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"> 
        {visibleProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group block">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 shadow-md">
              <div className="relative h-80 w-full">
                <Image
                  src={product.imageUrl}
                  alt={`Gambar produk ${product.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tombol Kanan */}
      {showNavigation && (
         <button 
          onClick={goToNextPage} 
          className="absolute right-0 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all duration-300 ease-in-out transform active:scale-90 translate-x-1/2"
          aria-label="Next Products"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-900" />
        </button>
      )}
    </div>
  );
}