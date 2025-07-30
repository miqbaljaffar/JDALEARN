'use client'

import { useState, useEffect, FormEvent } from 'react';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      // Pastikan untuk mengambil array 'categories' dari objek response
      if (data && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        // Fallback jika format data tidak sesuai dugaan
        setCategories([]);
      }
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
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
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan kategori.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Ini bisa gagal jika ada produk yang terkait.')) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Gagal menghapus kategori.');
        }
        fetchCategories();
      } catch (error: any) {
        console.error(error);
        alert(error.message);
      }
    }
  };

  if (isLoading) {
    return <p>Memuat data kategori...</p>;
  }

  return (
    <div className="w-full">
      <div className="card">
        <h1>Manajemen Kategori</h1>
        <p>Tambah, edit, atau hapus kategori produk.</p>
      </div>

      <div className="card">
        <h2>{editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nama Kategori"
            required
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
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
      </div>
      
      <div className="card">
        <h3>Daftar Kategori</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nama Kategori</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{cat.id}</td>
                <td style={{ padding: '12px' }}>{cat.name}</td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(cat)} className="btn" style={{ padding: '6px 12px', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="btn" style={{ background: '#e53e3e', padding: '6px 12px', fontSize: '12px' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}