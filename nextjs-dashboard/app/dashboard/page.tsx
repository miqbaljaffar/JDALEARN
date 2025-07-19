// app/dashboard/page.tsx
'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ... (Interface Product dan Category yang sudah ada) ...
interface Product {
  id: number;
  name: string;
  price: number;
  category: { id: number; name: string; };
  imageUrl: string;
  description?: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}


export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State untuk kategori
  const [isLoading, setIsLoading] = useState(true);
  
  // ... (State lain yang sudah ada) ...
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    imageUrl: '/products/default.jpg',
    description: '',
  });
  
  // State untuk form kategori
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);


  // Fungsi untuk mengambil data produk dan kategori
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Handler untuk form kategori
  const handleCategorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryName) {
      alert('Nama kategori tidak boleh kosong.');
      return;
    }
    const url = editingCategoryId ? `/api/categories/${editingCategoryId}` : '/api/categories';
    const method = editingCategoryId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan kategori.');
      
      setCategoryName('');
      setEditingCategoryId(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan kategori.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Gagal menghapus kategori.');
        }
        fetchData();
      } catch (error: any) {
        console.error(error);
        alert(error.message);
      }
    }
  };


  // ... (Fungsi handleSubmit, handleDelete, handleEdit, resetForm untuk produk tetap sama) ...
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Nama Produk, Harga, dan ID Kategori wajib diisi.");
      return;
    }
    setUploading(true);
    let imageUrl = formData.imageUrl;

    if (selectedFile) {
      const fileFormData = new FormData();
      fileFormData.append('file', selectedFile);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url; 
        } else {
          throw new Error('Gagal mengunggah gambar.');
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengunggah gambar.');
        setUploading(false);
        return;
      }
    }

    const productData = {
      ...formData,
      price: parseInt(formData.price),
      categoryId: parseInt(formData.categoryId),
      imageUrl: imageUrl, 
    };

    const url = isEditing ? `/api/products/${isEditing}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const productRes = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!productRes.ok) {
        throw new Error('Gagal menyimpan data produk.');
      }
      
      resetForm();
      fetchData(); 
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert('Gagal menyimpan produk.');
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      imageUrl: product.imageUrl,
      description: product.description || '',
    });
    setShowForm(true);
    setSelectedFile(null);
  };
  
  const resetForm = () => {
    setShowForm(false);
    setIsEditing(null);
    setSelectedFile(null);
    setFormData({ name: '', price: '', categoryId: '', imageUrl: '/products/default.jpg', description: '' });
  };
  if (isLoading) {
    return <p>Memuat dasbor...</p>;
  }

  return (
    <div>
      {/* ... (UI Manajemen Produk yang sudah ada) ... */}
       <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dasbor Manajemen Produk</h1>
            <p>Kelola koleksi pakaian berkualitas tinggi kami.</p>
          </div>
          <button className="btn" onClick={() => { setShowForm(!showForm); if (isEditing) resetForm(); }}>
            {showForm && !isEditing ? 'Batal' : 'Tambah Produk Baru'}
          </button>
        </div>
      </div>
      {showForm && (
        <div className="card">
          <h2>{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <form onSubmit={handleSubmit}>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Produk" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Harga" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            {/* Ganti input text dengan dropdown untuk kategori */}
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi Produk" style={{ width: '100%', padding: '10px', marginBottom: '10px', minHeight: '80px' }} />
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Gambar Produk</label>
              <input type="file" onChange={handleFileChange} accept="image/*" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
              {isEditing && formData.imageUrl && 
                <div style={{ marginTop: '10px' }}>
                    <p>Gambar saat ini:</p>
                    <Image src={formData.imageUrl} alt="Gambar produk saat ini" width={80} height={80} style={{ borderRadius: '8px', objectFit: 'cover' }}/>
                </div>
              }
            </div>

            <button type="submit" className="btn" disabled={uploading}>
              {uploading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
            </button>
            {isEditing && <button type="button" onClick={resetForm} className="btn" style={{marginLeft: '10px', background: '#555'}}>Batal</button>}
          </form>
        </div>
      )}
      <div className="card">
        <h3>Daftar Produk</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Gambar</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nama</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Harga</th>
                 <th style={{ padding: '12px', textAlign: 'left' }}>Kategori</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <Image src={product.imageUrl} alt={product.name} width={50} height={50} style={{ borderRadius: '8px', objectFit: 'cover' }}/>
                  </td>
                  <td style={{ padding: '12px' }}>{product.name}</td>
                  <td style={{ padding: '12px' }}>Rp{product.price.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>{product.category.name}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEdit(product)} className="btn" style={{ marginRight: '8px', padding: '6px 12px', fontSize: '12px' }}>Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="btn" style={{ background: '#e53e3e', borderColor: '#e53e3e', padding: '6px 12px', fontSize: '12px' }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Kartu Baru untuk Manajemen Kategori */}
      <div className="card">
        <h2>Manajemen Kategori</h2>
        {/* Form untuk Tambah/Edit Kategori */}
        <form onSubmit={handleCategorySubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nama Kategori Baru"
            required
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" className="btn">
            {editingCategoryId ? 'Update' : 'Simpan'}
          </button>
          {editingCategoryId && (
            <button type="button" onClick={() => { setEditingCategoryId(null); setCategoryName(''); }} className="btn" style={{background: '#555'}}>
              Batal
            </button>
          )}
        </form>

        {/* Tabel Daftar Kategori */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nama Kategori</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{cat.name}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleEditCategory(cat)} className="btn" style={{ marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="btn" style={{ background: '#e53e3e' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}