'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface Category {
  id: number;
  name: string;
}

interface FilterProps {
  categories: Category[];
}

export default function Filter({ categories }: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inisialisasi state dari URL search params
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    searchParams.getAll('categoryId').map(Number)
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 5000000,
  ]);
  
  // Gunakan debouncing agar tidak terlalu sering update URL saat user mengetik harga
  const handleFilterChange = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    
    // Reset page ke 1 setiap kali filter berubah
    params.set('page', '1');

    // Hapus parameter kategori lama dan set yang baru
    params.delete('categoryId');
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(id => params.append('categoryId', String(id)));
    }

    // Set parameter harga
    params.set('minPrice', String(priceRange[0]));
    params.set('maxPrice', String(priceRange[1]));

    router.replace(`${pathname}?${params.toString()}`);
  }, 500); // Tunggu 500ms setelah user berhenti mengubah filter

  // Panggil handleFilterChange setiap kali state berubah
  useEffect(() => {
    handleFilterChange();
  }, [selectedCategories, priceRange, handleFilterChange]);


  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };
  
  return (
    <div className="card sticky top-24 p-5">
      <h3 className="border-b pb-2 text-lg font-semibold">Filter</h3>

      <div className="mb-6 mt-4">
        <h4 className="mb-3 font-semibold">Kategori</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-600">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold">Harga</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            placeholder="Min"
            className="input-field w-full text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            placeholder="Max"
            className="input-field w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}