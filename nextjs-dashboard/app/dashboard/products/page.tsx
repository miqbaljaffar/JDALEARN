'use client'

import { useState, useEffect, FormEvent, ChangeEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Pagination from '@/app/ui/pagination';
import { TableSkeleton } from '@/app/ui/skeletons';

// Interface untuk data Product dan Category
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number; // BENAR: Properti stok sudah ada
  category: { id: number; name: string; };
  imageUrl: string;
  description?: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

// Komponen utama dipisahkan untuk menggunakan Suspense
function ProductsManagementComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State untuk data dan UI
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // State untuk paginasi
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = Number(searchParams.get('page')) || 1;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    stock: '0', // BENAR: Nilai awal stok sudah ada
    imageUrl: '/products/default.jpg',
    description: '',
  });

  // useEffect sekarang bergantung pada searchParams (perubahan URL)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?page=${currentPage}`), // Menggunakan currentPage dari URL
          fetch('/api/categories')
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData.products);
        setTotalPages(productsData.totalPages);

        if (categoriesData && Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories);
        } else if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }

      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage]); 

  const refetchCurrentPage = async () => {
    setIsLoading(true);
    try {
      const productsRes = await fetch(`/api/products?page=${currentPage}`);
      const productsData = await productsRes.json();
      setProducts(productsData.products);
      setTotalPages(productsData.totalPages);
    } catch (error) {
        console.error("Gagal memuat ulang data:", error);
    } finally {
        setIsLoading(false);
    }
  };

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
      stock: parseInt(formData.stock), // BENAR: Konversi stok ke integer
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
      await refetchCurrentPage();
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
        await refetchCurrentPage();
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
      stock: product.stock.toString(), // BENAR: Mengisi form dengan data stok
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
    // PERBAIKAN: Tambahkan reset untuk field 'stock'
    setFormData({ name: '', price: '', categoryId: '', stock: '0', imageUrl: '/products/default.jpg', description: '' });
  };

  if (isLoading && products.length === 0) {
    return <TableSkeleton />;
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
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Produk" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Harga" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            {/* BENAR: Input untuk stok sudah ada */}
            <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="Jumlah Stok" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
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
        <div style={{ overflowX: 'auto', position: 'relative' }}>
          {isLoading && <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', display: 'grid', placeItems: 'center'}}>Memuat...</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Gambar</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nama</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Harga</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Stok</th>
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
                  {/* PERBAIKAN: Menampilkan data stok dan memperbaiki urutan kolom */}
                  <td style={{ padding: '12px' }}>{product.stock}</td>
                  <td style={{ padding: '12px' }}>{product.category?.name || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEdit(product)} className="btn" style={{ marginRight: '8px', padding: '6px 12px', fontSize: '12px' }}>Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="btn" style={{ background: '#e53e3e', borderColor: '#e53e3e', padding: '6px 12px', fontSize: '12px' }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8">
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
      </div>
    </div>
  );
}

// Gunakan Suspense untuk menangani pembacaan searchParams di server
export default function ProductsManagementPage() {
    return (
        <Suspense fallback={<TableSkeleton />}>
            <ProductsManagementComponent />
        </Suspense>
    )
}