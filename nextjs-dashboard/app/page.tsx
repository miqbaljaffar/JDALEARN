import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache'; // Import unstable_cache

// Definisikan tipe data (tetap sama)
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

// 1. BUNGKUS FUNGSI PENGAMBILAN DATA DENGAN unstable_cache
// Ini akan menyimpan hasil query selama 1 jam (3600 detik)
const getCachedFeaturedData = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      take: 4,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    const news = await prisma.news.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
    return { products, news };
  },
  ['featured_data'], // Kunci cache unik
  { revalidate: 3600 } // Waktu revalidasi dalam detik
);


export default async function Home() {
  // Panggil fungsi yang sudah di-cache
  const { products, news } = await getCachedFeaturedData();

  return (
    // 2. GUNAKAN TAILWIND CSS UNTUK SEMUA STYLING
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Selamat Datang di Toko Kami</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Temukan koleksi fashion terbaru dan terbaik di sini, dibuat dengan bahan berkualitas dan desain modern.
        </p>
        <Link href="/products" className="btn">
          Jelajahi Semua Produk
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Produk Unggulan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              <div className="product-card overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={`Gambar produk ${product.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gray-900">Rp{product.price.toLocaleString('id-ID')}</span>
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/products" className="btn border-2 border-blue-500 bg-transparent text-blue-500 hover:bg-blue-50">
            Lihat Koleksi Lengkap
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Mengapa Memilih Kami?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">🚀 Desain Modern</h3>
            <p className="text-gray-600">Dibuat dengan Next.js 14 dan TypeScript untuk performa optimal.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">📱 Kualitas Terjamin</h3>
            <p className="text-gray-600">Bahan berkualitas tinggi untuk kenyamanan dan daya tahan produk.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">⚡ Pelayanan Cepat</h3>
            <p className="text-gray-600">Pesanan Anda kami proses dan kirimkan dengan cepat.</p>
          </div>
        </div>
      </section>

      {/* Fashion News Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Berita Fashion Terkini</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((newsItem: News) => (
             <Link key={newsItem.id} href={`/news/${newsItem.slug}`} className="group block">
              <div className="product-card overflow-hidden">
                <div className="relative h-56 w-full">
                  <Image
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{newsItem.title}</h3>
                  <p className="text-sm text-gray-600">{newsItem.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/news" className="btn">
            Lihat Semua Berita
          </Link>
        </div>
      </section>
    </div>
  );
}
