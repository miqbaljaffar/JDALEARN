import Link from 'next/link'
import Image from 'next/image'

// Data produk unggulan
const featuredProducts = [
  {
    id: 1,
    name: "Kemeja Polo",
    description: "Kemeja polo katun premium untuk gaya kasual.",
    price: 250000,
    category: "Pakaian Pria",
    imageUrl: "/products/Polo.jpg"
  },
  {
    id: 2,
    name: "Celana Chino",
    description: "Celana chino slim-fit untuk tampilan modern.",
    price: 350000,
    category: "Pakaian Pria",
    imageUrl: "/products/Chinos.jpg"
  },
  {
    id: 4,
    name: "Knitwear",
    description: "Sweater rajut hangat untuk cuaca dingin.",
    price: 450000,
    category: "Pakaian Unisex",
    imageUrl: "/products/Knitwear.jpg"
  },
   {
    id: 5,
    name: "Rok",
    description: "Rok lipit yang elegan untuk berbagai kesempatan.",
    price: 300000,
    category: "Pakaian Wanita",
    imageUrl: "/products/Rok.jpg"
  },
]

// Data berita fashion (pengganti testimoni)
const fashionNews = [
  {
    id: 1,
    title: "5 Tren Warna Pakaian yang Akan Hits di Tahun 2024",
    excerpt: "Simak prediksi warna-warna yang akan mendominasi dunia fashion tahun ini, dari warna pastel lembut hingga warna-warna cerah yang berani.",
    imageUrl: "/news/news1.jpg", // Ganti dengan path gambar yang sesuai
    link: "/news/tren-warna-2024"
  },
  {
    id: 2,
    title: "Cara Mix and Match Pakaian Agar Tampil Stylish Setiap Hari",
    excerpt: "Dapatkan tips praktis untuk memadupadankan koleksi pakaian Anda agar tidak monoton dan selalu tampil percaya diri.",
    imageUrl: "/news/news2.jpg", // Ganti dengan path gambar yang sesuai
    link: "/news/mix-and-match"
  },
  {
    id: 3,
    title: "Kembalinya Gaya Retro: Fashion Ikonik dari Era 90-an",
    excerpt: "Gaya fashion tahun 90-an kembali populer! Temukan item-item kunci yang bisa Anda tambahkan ke lemari pakaian Anda.",
    imageUrl: "/news/news3.jpg", // Ganti dengan path gambar yang sesuai
    link: "/news/gaya-retro-90an"
  }
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>Selamat Datang di Toko Pakaian Kami</h1>
        <p>Temukan koleksi fashion terbaru dan terbaik di sini, dibuat dengan bahan berkualitas dan desain modern.</p>
        <Link href="/products" className="btn">
          Jelajahi Semua Produk
        </Link>
      </div>
      
      {/* Featured Products Section */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>Produk Unggulan</h2>
        <div className="grid">
          {featuredProducts.map((product) => (
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
                      {product.category}
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
            color: '#000',
            border: '2px solid #000'
            }}>
            Lihat Koleksi Lengkap
            </Link>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{ marginTop: '80px', background: '#f9f9f9', padding: '60px 20px', borderRadius: '16px' }}>
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
          {fashionNews.map((news) => (
            <Link key={news.id} href={news.link} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                <div className="product-image" style={{ position: 'relative', height: '200px' }}>
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-info">
                  <h3 style={{ marginBottom: '10px' }}>{news.title}</h3>
                  <p style={{ color: '#555' }}>{news.excerpt}</p>
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
  )
}