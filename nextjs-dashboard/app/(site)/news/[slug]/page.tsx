import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { Metadata, ResolvingMetadata } from 'next';

// --- AWAL PERUBAHAN ---
// Definisikan tipe Props agar konsisten dengan halaman dinamis lainnya.
// 'params' dan 'searchParams' harus dibungkus dengan Promise.
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
// --- AKHIR PERUBAHAN ---

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // --- AWAL PERUBAHAN ---
  // Gunakan 'await' untuk mendapatkan nilai dari Promise 'params'
  const { slug } = await params;
  // --- AKHIR PERUBAHAN ---
  const newsItem = await getNews(slug);

  if (!newsItem) {
    return {
      title: 'Berita Tidak Ditemukan',
      description: 'Halaman berita yang Anda cari tidak dapat ditemukan.',
    }
  }

  const title = `${newsItem.title} | Ztyle News`;
  const description = newsItem.excerpt;

  return {
    title,
    description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: newsItem.imageUrl,
          width: 1200,
          height: 630,
          alt: `Gambar untuk ${newsItem.title}`,
        },
      ],
    },
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  }
}

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
  ['news_by_slug'],
  { revalidate: 3600 }
);

// --- AWAL PERUBAHAN ---
// Gunakan 'Props' yang sudah didefinisikan dan 'await' params di dalam komponen
export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const newsItem = await getNews(slug);
// --- AKHIR PERUBAHAN ---

  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": newsItem.title,
    "image": [
      `${siteUrl}${newsItem.imageUrl}`
     ],
    "datePublished": new Date(newsItem.createdAt).toISOString(),
    "dateModified": new Date(newsItem.updatedAt).toISOString(),
    "author": [{
        "@type": "Person",
        "name": newsItem.author,
        "url": `${siteUrl}/about`
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Ztyle",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/Logo.png`
      }
    },
    "description": newsItem.excerpt
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "News",
        "item": `${siteUrl}/news`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": newsItem.title,
        "item": `${siteUrl}/news/${slug}`
      }
    ]
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <h1 className="text-4xl font-bold mb-4">{newsItem.title}</h1>
      
      <div className="flex items-center text-gray-500 mb-6">
        <span>Oleh: {newsItem.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(newsItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={newsItem.imageUrl}
          alt={`Gambar untuk ${newsItem.title}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="prose lg:prose-xl max-w-none">
        <p>{newsItem.content}</p>
      </div>
    </div>
  );
}