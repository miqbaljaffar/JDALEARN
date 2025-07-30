'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

// Interface untuk data Berita
interface News {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  author: string;
  slug: string;
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    imageUrl: '/news/default.jpg',
    slug: '',
  });

  // Fungsi untuk mengambil data berita
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      // Pastikan untuk mengambil array 'news' dari objek response
      if (data && Array.isArray(data.news)) {
        setNews(data.news);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handler untuk perubahan file gambar
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handler untuk men-submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
      alert("Judul, excerpt, konten, dan penulis wajib diisi.");
      return;
    }
    setUploading(true);
    let imageUrl = formData.imageUrl;

    // Proses upload gambar jika ada file yang dipilih
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

    // Buat slug dari judul
    const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const newsData = { ...formData, imageUrl, slug };

    const url = isEditing ? `/api/news/${isEditing}` : '/api/news';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan data berita.');
      }
      
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Gagal menyimpan berita:", error);
      alert('Gagal menyimpan berita.');
    } finally {
      setUploading(false);
    }
  };
  
  // Handler untuk menghapus berita
  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await fetch(`/api/news/${id}`, { method: 'DELETE' });
        fetchNews();
      } catch (error) {
        console.error("Gagal menghapus berita:", error);
        alert('Gagal menghapus berita.');
      }
    }
  };

  // Handler untuk mode edit
  const handleEdit = (item: News) => {
    setIsEditing(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content || '',
      author: item.author,
      imageUrl: item.imageUrl,
      slug: item.slug
    });
    setShowForm(true);
    setSelectedFile(null);
  };
  
  // Fungsi untuk mereset form
  const resetForm = () => {
    setShowForm(false);
    setIsEditing(null);
    setSelectedFile(null);
    setFormData({ title: '', excerpt: '', content: '', author: '', imageUrl: '/news/default.jpg', slug: '' });
  };

  if (isLoading) {
    return <p>Memuat data berita...</p>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manajemen Berita</h1>
            <p>Kelola semua berita dan artikel di website Anda.</p>
          </div>
          <button className="btn" onClick={() => { setShowForm(!showForm); if (isEditing) resetForm(); }}>
            {showForm && !isEditing ? 'Batal' : 'Tambah Berita Baru'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>{isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Judul Berita" required className="input-field" />
            <input value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} placeholder="Insight Singkat (Excerpt)" required className="input-field" />
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Konten Lengkap Berita" required className="input-field" rows={6} />
            <input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} placeholder="Nama Penulis" required className="input-field" />
            
            <div>
              <label className="block mb-2 font-medium">Gambar Berita</label>
              <input type="file" onChange={handleFileChange} accept="image/*" className="input-field" />
              {formData.imageUrl && 
                <div className="mt-2">
                    <p>Gambar saat ini:</p>
                    <Image src={formData.imageUrl} alt="Gambar berita" width={100} height={100} className="rounded-md object-cover"/>
                </div>
              }
            </div>

            <div className="flex gap-4">
                <button type="submit" className="btn" disabled={uploading}>
                  {uploading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
                </button>
                {isEditing && <button type="button" onClick={resetForm} className="btn" style={{background: '#555'}}>Batal</button>}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Daftar Berita</h3>
        <div className="overflow-x-auto">
          <table className="w-full mt-4">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Gambar</th>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">
                    <Image src={item.imageUrl} alt={item.title} width={60} height={60} className="rounded-md object-cover"/>
                  </td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.author}</td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(item)} className="btn text-xs p-2 mr-2">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn bg-red-600 hover:bg-red-700 text-xs p-2">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .input-field {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
}