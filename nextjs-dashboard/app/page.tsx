import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache'; 
// Impor komponen carousel yang baru
import ProductCarousel from '@/app/ui/ProductCarousel';

// Definisikan tipe data
interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

// Ubah fungsi pengambilan data untuk mengambil lebih banyak produk
const getCachedFeaturedData = unstable_cache(
  async () => {
    // Ambil lebih banyak produk (misalnya 9) untuk carousel
    const products = await prisma.product.findMany({
      take: 9,
      orderBy: { createdAt: 'desc' },
      // Hanya pilih field yang diperlukan untuk performa lebih baik
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    });
    const news = await prisma.news.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
    return { products, news };
  },
  ['featured_data_carousel'], // Gunakan kunci cache baru
  { revalidate: 3600 } // Revalidasi setiap 1 jam
);

export default async function Home() {
  const { products, news } = await getCachedFeaturedData();

  return (
    <div className="space-y-20">
      <section 
        className="relative text-center py-24 md:py-32 rounded-lg overflow-hidden"
        style={{
          backgroundImage: 'url(/back.jpg)', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div 
          className="absolute inset-0 bg-black opacity-50"
          style={{ zIndex: 1 }}
        ></div>

        {/* Konten Hero Section */}
        <div className="relative" style={{ zIndex: 2 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Selamat Datang di Toko Kami</h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
            Temukan koleksi fashion terbaru dan terbaik di sini, dibuat dengan bahan berkualitas dan desain modern.
          </p>
          <Link href="/products" className="btn bg-white text-gray-800 hover:bg-gray-200">
            Jelajahi Semua Produk
          </Link>
        </div>
      </section>


      {/* Produk Unggulan */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Produk Unggulan</h2>
        <div className="mx-auto max-w-6xl px-10">
           <ProductCarousel products={products} />
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