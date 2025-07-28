'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

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

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Untuk dashboard, kita minta semua produk tanpa pagination
      // dengan menambahkan parameter `limit=-1` (atau angka yang sangat besar)
      // atau dengan memodifikasi API, tapi cara ini lebih cepat.
      // Untuk sekarang, kita akan perbaiki cara data dibaca.
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'), // API call tetap sama
        fetch('/api/categories')
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      // --- AWAL PERBAIKAN ---
      // Cek apakah respons dari API adalah objek yang memiliki properti 'products'
      if (productsData && Array.isArray(productsData.products)) {
        // Jika ya, gunakan array dari properti tersebut
        setProducts(productsData.products);
      } else if (Array.isArray(productsData)) {
        // Fallback jika API suatu saat mengembalikan array lagi
        setProducts(productsData);
      } else {
        // Jika format tidak dikenali, set ke array kosong untuk mencegah error
        console.error("Format data produk tidak terduga:", productsData);
        setProducts([]);
      }
      // --- AKHIR PERBAIKAN ---

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
    return <p>Memuat data produk...</p>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manajemen Produk</h1>
            <p>Kelola semua produk di toko Anda.</p>
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
            {/* Form inputs remain the same */}
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Produk" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Harga" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
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
              {/* Table headers remain the same */}
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
                  {/* Table body remains the same */}
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
    </div>
  );
}
