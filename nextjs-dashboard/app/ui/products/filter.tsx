'use client';

import { useState, useEffect } from 'react';

// Interface untuk kategori
interface Category {
  id: number;
  name: string;
}

// Interface untuk props komponen Filter
interface FilterProps {
  onFilterChange: (filters: { categoryIds: number[]; priceRange: [number, number] }) => void;
  categories: Category[];
}

export default function Filter({ onFilterChange, categories }: FilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]); // Rentang harga default

  // Efek untuk memanggil onFilterChange saat ada perubahan pada filter
  useEffect(() => {
    onFilterChange({ categoryIds: selectedCategories, priceRange });
  }, [selectedCategories, priceRange, onFilterChange]);

  // Handler untuk mengubah kategori yang dipilih
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handler untuk mengubah rentang harga
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px' }}>Filter Produk</h3>
      
      {/* Filter berdasarkan Kategori */}
      <div>
        <h4>Kategori</h4>
        {categories.map((category) => (
          <div key={category.id} style={{ marginTop: '10px' }}>
            <input
              type="checkbox"
              id={`category-${category.id}`}
              onChange={() => handleCategoryChange(category.id)}
              style={{ marginRight: '10px' }}
            />
            <label htmlFor={`category-${category.id}`}>{category.name}</label>
          </div>
        ))}
      </div>

      {/* Filter berdasarkan Harga */}
      <div style={{ marginTop: '20px' }}>
        <h4>Harga</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            placeholder="Min"
            style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            placeholder="Max"
            style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
      </div>
    </div>
  );
}