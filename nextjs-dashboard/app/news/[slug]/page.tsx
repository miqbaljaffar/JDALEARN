import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// Fungsi untuk mengambil data berita tunggal dari database
const getNews = unstable_cache(
  async (slug: string) => {
    const newsItem = await prisma.news.findUnique({
      where: { slug },
    });

    if (!newsItem) {
      notFound();
    }
    return newsItem;
  },
  ['news_by_slug'], // Kunci cache
  { revalidate: 3600 } // Revalidasi setiap 1 jam
);

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const newsItem = await getNews(params.slug);

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Judul Berita */}
      <h1 className="text-4xl font-bold mb-4">{newsItem.title}</h1>
      
      {/* Informasi Penulis dan Tanggal */}
      <div className="flex items-center text-gray-500 mb-6">
        <span>Oleh: {newsItem.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(newsItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Gambar Utama Berita */}
      <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={newsItem.imageUrl}
          alt={`Gambar untuk ${newsItem.title}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Konten Detail Berita */}
      <div className="prose lg:prose-xl max-w-none">
        <p>{newsItem.content}</p>
      </div>
    </div>
  );
}