import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache'; 
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

// --- AWAL PERUBAHAN ---
// Fungsi untuk mengambil produk secara acak
const getCachedFeaturedData = unstable_cache(
  async () => {
    const productsToTake = 9;

    // 1. Hitung total produk
    const totalProducts = await prisma.product.count();
    
    // 2. Buat titik awal (skip) acak, pastikan tidak error jika produk < 9
    const skip = totalProducts > productsToTake 
      ? Math.floor(Math.random() * (totalProducts - productsToTake)) 
      : 0;

    // 3. Ambil 9 produk dari titik acak tersebut
    const products = await prisma.product.findMany({
      take: productsToTake,
      skip: skip,
      orderBy: { 
        // Dibutuhkan order by agar 'skip' konsisten
        id: 'asc' 
      },
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    });

    // Pengambilan data berita tetap sama
    const news = await prisma.news.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return { products, news };
  },
  ['featured_data_random_carousel'], // Kunci cache baru untuk data acak
  { revalidate: 3600 } // Produk unggulan akan diacak ulang setiap 1 jam
);
// --- AKHIR PERUBAHAN ---


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

      {/* Why Choose Us Section - Versi Baru yang Lebih Menarik */}
      <section className="bg-gray-50 rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Kenapa Ztyle Pilihan Tepat?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Keunggulan 1: Koleksi Terkurasi */}
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mx-auto mb-4 w-16 h-16 bg-blue-100 text-blue-600 rounded-full">
              {/* Ganti dengan ikon yang sesuai, misalnya SparklesIcon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.455L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.455l.398-1.178.398 1.178a3.375 3.375 0 002.455 2.455l1.178.398-1.178.398a3.375 3.375 0 00-2.455 2.455z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Koleksi Terkurasi</h3>
            <p className="text-gray-600">Setiap produk dipilih dengan cermat untuk memastikan Anda mendapatkan gaya yang unik, modern, dan berkualitas, bukan sekadar produk pasaran.</p>
          </div>
          
          {/* Keunggulan 2: Kualitas Premium */}
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mx-auto mb-4 w-16 h-16 bg-green-100 text-green-600 rounded-full">
              {/* Ganti dengan ikon yang sesuai, misalnya ShieldCheckIcon */}
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Kualitas Tanpa Kompromi</h3>
            <p className="text-gray-600">Dari pemilihan bahan terbaik hingga detail jahitan yang presisi, kami menjamin setiap produk yang Anda terima adalah yang terbaik.</p>
          </div>

          {/* Keunggulan 3: Pengiriman Cepat */}
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center mx-auto mb-4 w-16 h-16 bg-purple-100 text-purple-600 rounded-full">
               {/* Ganti dengan ikon yang sesuai, misalnya TruckIcon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2a1 1 0 00-1 1v2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat & Terpercaya</h3>
            <p className="text-gray-600">Kami tahu Anda tidak sabar. Pesanan Anda diproses super cepat, dikemas dengan aman, dan dikirim hingga sampai ke tangan Anda.</p>
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
