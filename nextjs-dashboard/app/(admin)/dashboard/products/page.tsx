'use client'

import { useState, useEffect, FormEvent, ChangeEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Pagination from '@/app/ui/pagination';
import { TableSkeleton } from '@/app/ui/skeletons';
import { toast } from 'sonner';

// Import komponen dan hook dari TipTap
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Toolbar } from '@/app/(admin)/dashboard/ui/Toolbar';

// Interface untuk data Product dan Category
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
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
    stock: '0',
    imageUrl: '/products/default.jpg',
    description: '',
  });

  // Inisialisasi editor TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Tulis deskripsi lengkap produk di sini...',
      }),
    ],
    content: formData.description,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, description: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none w-full input-field min-h-[200px] p-2',
      },
    },
    // Pastikan ini ditambahkan agar editor tidak langsung dirender di server
    immediatelyRender: false,
  });

  // Sinkronisasi konten editor saat formData.description berubah
  useEffect(() => {
    if (editor && editor.getHTML() !== formData.description) {
      editor.commands.setContent(formData.description);
    }
  }, [formData.description, editor]);

  // useEffect sekarang bergantung pada searchParams (perubahan URL)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?page=${currentPage}`), 
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
        toast.error("Gagal memuat data produk atau kategori.");
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
        toast.error("Gagal memuat ulang data produk.");
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
    if (!formData.name || !formData.price || !formData.categoryId || !editor?.getText()) {
      toast.error("Nama Produk, Harga, Kategori, dan Deskripsi wajib diisi.");
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
        toast.error('Terjadi kesalahan saat mengunggah gambar.');
        setUploading(false);
        return;
      }
    }

    const productData = {
      ...formData,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock), 
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
      
      toast.success(isEditing ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!');
      resetForm();
      await refetchCurrentPage();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      toast.error('Gagal menyimpan produk.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    toast('Apakah Anda yakin ingin menghapus produk ini?', {
      action: {
        label: 'Hapus',
        onClick: async () => {
          try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            toast.success('Produk berhasil dihapus.');
            await refetchCurrentPage();
          } catch (error) {
            console.error("Gagal menghapus produk:", error);
            toast.error('Gagal menghapus produk.');
          }
        },
      },
      cancel: {
        label: 'Batal',
        onClick: () => {}, 
      },
    });
  };
  
  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(), 
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
    setFormData({ name: '', price: '', categoryId: '', stock: '0', imageUrl: '/products/default.jpg', description: '' });
    editor?.commands.clearContent();
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
            {/* Input lainnya tetap sama */}
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama Produk" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Harga" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
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
            <div>
              <label className="block mb-2 font-medium">Deskripsi Produk</label>
              <div className="border border-gray-200 rounded-lg">
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
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