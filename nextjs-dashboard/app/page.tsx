import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma'; // Impor instance Prisma

// Definisikan tipe data untuk produk dan berita
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: { name: string; };
  imageUrl: string;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

// Fungsi untuk mengambil data dari database
async function getFeaturedData() {
  const products = await prisma.product.findMany({
    take: 4, // Ambil 4 produk unggulan
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const news = await prisma.news.findMany({
    take: 3, // Ambil 3 berita terbaru
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { products, news };
}

export default async function Home() {
  const { products, news } = await getFeaturedData();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero text-center">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Toko Pakaian Kami</h1>
        <p className="text-lg text-gray-600 mb-8">Temukan koleksi fashion terbaru dan terbaik di sini, dibuat dengan bahan berkualitas dan desain modern.</p>
        <Link href="/products" className="btn">
          Jelajahi Semua Produk
        </Link>
      </div>

      {/* Featured Products Section */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>Produk Unggulan</h2>
        <div className="grid">
          {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                <div className="product-image" style={{ position: 'relative', height: '200px' }}>
                  <Image
                    src={product.imageUrl}
                    alt={`Gambar produk ${product.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <span className="price">Rp{product.price.toLocaleString('id-ID')}</span>
                    <span style={{
                      background: '#e5e7eb',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: '#374151'
                    }}>
                      {product.category.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/products" className="btn" style={{
            background: 'transparent',
            color: '#007bff',
            border: '2px solid #007bff'
          }}>
            Lihat Koleksi Lengkap
          </Link>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{ marginTop: '80px', background: '#f8f9fa', padding: '60px 20px', borderRadius: '16px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>Mengapa Memilih Kami?</h2>
        <div className="grid">
          <div className="card">
            <h2>🚀 Desain Modern</h2>
            <p>Dibuat dengan Next.js 14 dan TypeScript untuk performa optimal dan pengalaman pengembang terbaik.</p>
          </div>
          <div className="card">
            <h2>📱 Kualitas Terjamin</h2>
            <p>Kami hanya menggunakan bahan-bahan berkualitas tinggi untuk memastikan kenyamanan dan daya tahan produk.</p>
          </div>
          <div className="card">
            <h2>⚡ Pelayanan Cepat</h2>
            <p>Pesanan Anda akan kami proses dan kirimkan dengan cepat, karena kepuasan Anda adalah prioritas kami.</p>
          </div>
        </div>
      </div>

      {/* Fashion News Section */}
      <div style={{ marginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>Berita Fashion Terkini</h2>
        <div className="grid">
          {news.map((newsItem: News) => (
            <Link key={newsItem.id} href={`/news/${newsItem.slug}`} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                <div className="product-image" style={{ position: 'relative', height: '200px' }}>
                  <Image
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-info">
                  <h3 style={{ marginBottom: '10px' }}>{newsItem.title}</h3>
                  <p style={{ color: '#555' }}>{newsItem.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/news" className="btn">
            Lihat Semua Berita
          </Link>
        </div>
      </div>
    </div>
  );
}