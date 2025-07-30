import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { unstable_cache } from 'next/cache';
import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import AddToCartButton from '@/app/ui/products/AddToCartButton';
import BuyNowButton from '@/app/ui/products/BuyNowButton';
import StarRating from '@/app/ui/products/StarRating';
import ReviewForm from '@/app/ui/products/ReviewForm';

// --- DATA FETCHING (Tidak ada perubahan di sini) ---
const getProductData = unstable_cache(
  async (id: number) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      notFound();
    }

    const totalReviews = product.reviews.length;
    const averageRating =
      totalReviews > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    return { product, totalReviews, averageRating: parseFloat(averageRating.toFixed(1)) };
  },
  ['product_with_reviews'],
  { revalidate: 3600 }
);


// --- METADATA GENERATION ---
type Props = {
  params: Promise<{ id: string }>; // Perbarui tipe
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Perbarui tipe
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // --- AWAL PERUBAHAN ---
  const { id } = await params; // Await params untuk mendapatkan ID
  const productId = parseInt(id, 10);
  // --- AKHIR PERUBAHAN ---

  if (isNaN(productId)) return {};

  const { product, averageRating, totalReviews } = await getProductData(productId);

  const title = `Jual ${product.name} - Ztyle Store`;
  const description =
    product.description?.substring(0, 160) ||
    `Beli ${product.name} terbaik. Rating ${averageRating}/5 dari ${totalReviews} ulasan. Bahan premium, pengiriman cepat.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.imageUrl, width: 800, height: 600, alt: `Gambar ${product.name}` }],
    },
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'), // Tambahkan metadataBase
  };
}


// --- MAIN COMPONENT ---
export default async function ProductDetail({ params, searchParams }: Props) {
  const { id } = await params; // Await params untuk mendapatkan ID
  const searchParamsObject = await searchParams; // Await searchParams
  
  const productId = parseInt(id, 10);
  const orderItemIdStr = searchParamsObject.order_item_id as string | undefined;
  const orderItemId = orderItemIdStr ? parseInt(orderItemIdStr) : null;

  if (isNaN(productId)) {
    notFound();
  }

  const { product, totalReviews, averageRating } = await getProductData(productId);
  const session = await getServerSession(authOptions);
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  let canReview = false;
  if (session?.user?.id && orderItemId) {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
        productId: productId,
        order: { userId: session.user.id, status: { in: ['PAID', 'DELIVERED'] } },
        reviewId: null,
      },
    });
    if (orderItem) {
      canReview = true;
    }
  }

  const productSchema = { /* ... (schema tidak berubah) ... */ };
  const breadcrumbSchema = { /* ... (schema tidak berubah) ... */ };

  const handleReviewSubmitted = async () => {
    'use server'
    revalidatePath(`/products/${productId}`);
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Link href="/products" className="inline-block mb-5 text-gray-800 hover:text-blue-600 transition-colors">
        ← Kembali ke Semua Produk
      </Link>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <Image src={product.imageUrl} alt={`Gambar produk ${product.name}`} fill className="object-cover" />
            </div>
            <span className="inline-block bg-gray-200 text-gray-700 text-sm font-medium px-4 py-1 rounded-full mt-6">
              {product.category.name}
            </span>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="mb-4">
              <StarRating rating={averageRating} count={totalReviews} />
            </div>
            <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            <div className="text-4xl font-bold text-gray-900 mb-8">
              Rp{product.price.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-4">
              <AddToCartButton 
                productId={product.id} 
                className="btn flex-1" 
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </AddToCartButton>
              <BuyNowButton 
                productId={product.id} 
                className="btn flex-1 bg-gray-800 hover:bg-gray-700"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Stok Habis' : 'Beli Sekarang'}
              </BuyNowButton>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* ... (Fitur dan Spesifikasi) ... */}
      </div>

      {canReview && orderItemId && (
        <ReviewForm
          productId={productId}
          orderItemId={orderItemId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-6">Ulasan Pelanggan ({totalReviews})</h2>
        <div className="space-y-6">
          {totalReviews > 0 ? (
            product.reviews.map(review => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-lg mr-4">{review.user.name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))
          ) : (
            <p>Belum ada ulasan untuk produk ini. Jadilah yang pertama memberi ulasan!</p>
          )}
        </div>
      </div>
    </div>
  );
}