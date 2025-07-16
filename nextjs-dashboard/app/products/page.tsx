// app/products/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', imageUrl: '/products/default.jpg' });

  // Fungsi untuk mengambil data produk
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler untuk hapus produk
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: parseInt(formData.price) })
      });
      setShowForm(false);
      setFormData({ name: '', price: '', category: '', imageUrl: '/products/default.jpg' });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  }

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Produk Kami</h1>
            <p>Kelola koleksi pakaian berkualitas tinggi kami.</p>
          </div>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Batal' : 'Tambah Produk Baru'}
          </button>
        </div>
      </div>
      
      {/* Form Tambah Produk */}
      {showForm && (
        <div className="card">
          <h2>Tambah Produk Baru</h2>
          <form onSubmit={handleSubmit}>
            <input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Nama Produk" required 
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
            />
            <input 
              type="number" 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
              placeholder="Harga" required 
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
            />
            <input 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              placeholder="Kategori" required 
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
            />
            <button type="submit" className="btn">Simpan</button>
          </form>
        </div>
      )}

      {/* List Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-image" style={{ position: 'relative', height: '200px' }}>
                <Image
                  src={product.imageUrl}
                  alt={`Gambar produk ${product.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => e.currentTarget.src = '/products/default.jpg'} // Fallback image
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Kategori: {product.category}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="price">Rp{product.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </Link>
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
              {/* Tombol Update bisa ditambahkan di sini, akan me-redirect ke halaman edit */}
              <button className="btn" style={{flex: 1, background: '#f0f0f0', color: '#333', borderColor: '#ddd'}}>Update</button>
              <button onClick={() => handleDelete(product.id)} className="btn" style={{flex: 1, background: '#e53e3e', borderColor: '#e53e3e'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}