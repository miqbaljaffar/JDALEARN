import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AddToCartButton from '@/app/ui/products/AddToCartButton';
import BuyNowButton from '@/app/ui/products/BuyNowButton';
import { unstable_cache } from 'next/cache';

// Mendefinisikan tipe data untuk produk
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: { name: string; };
  imageUrl: string;
  features: any; 
  specifications: any; 
  rating: number; 
}

// Dummy data untuk ulasan
const dummyReviews = [
  { id: 1, author: "Budi", rating: 5, comment: "Kualitasnya bagus banget! Bahannya adem dan nyaman dipakai. Recommended!" },
  { id: 2, author: "Siti", rating: 4, comment: "Desainnya keren, sesuai gambar. Pengirimannya juga cepat." },
  { id: 3, author: "Joko", rating: 5, comment: "Sangat puas dengan pembelian ini. Ukurannya pas dan warnanya tidak luntur setelah dicuci." },
];

// Komponen untuk menampilkan bintang rating
const StarRating = ({ rating, count }: { rating: number, count?: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e4e5e9', fontSize: '24px' }}>
                &#9733;
            </span>
        );
    }
    return <div className="flex items-center gap-2">{stars} {count && <span className="text-gray-500 text-sm">({count} ulasan)</span>}</div>;
};

// Fungsi untuk mengambil data produk tunggal dari database
const getProduct = unstable_cache(
  async (id: number): Promise<Product> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      notFound();
    }
    
    const productWithRating: any = product;
    productWithRating.rating = 4.5;

    return productWithRating as Product;
  },
  ['product'],
  { revalidate: 3600 }
);


export default async function ProductDetail({ params }: { params: { id: string } }) {
  // --- PERBAIKAN DI SINI ---
  // Destructuring 'id' dari 'params' untuk mengatasi peringatan dari Next.js.
  // Ini adalah pola yang direkomendasikan untuk kompatibilitas di masa depan.
  const { id } = params;
  const productId = parseInt(id, 10);

  // Tambahan: Pemeriksaan jika ID yang diberikan bukan angka
  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProduct(productId);

  return (
    <div>
      <Link
        href="/products"
        className="inline-block mb-5 text-gray-800 hover:text-blue-600 transition-colors"
      >
        ← Kembali ke Semua Produk
      </Link>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Kolom Gambar */}
          <div>
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.imageUrl}
                alt={`Gambar produk ${product.name}`}
                fill
                className="object-cover"
              />
            </div>
            <span className="inline-block bg-gray-200 text-gray-700 text-sm font-medium px-4 py-1 rounded-full mt-6">
              {product.category.name}
            </span>
          </div>

          {/* Kolom Info Produk */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="mb-4">
                <StarRating rating={product.rating} count={dummyReviews.length}/>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              {product.description}
            </p>
            <div className="text-4xl font-bold text-gray-900 mb-8">
              Rp{product.price.toLocaleString('id-ID')}
            </div>

            <div className="flex items-center gap-4">
              <AddToCartButton productId={product.id} className="btn flex-1">
                Tambah ke Keranjang
              </AddToCartButton>

              <BuyNowButton productId={product.id} className="btn flex-1 bg-gray-800 hover:bg-gray-700">
                Beli Sekarang
              </BuyNowButton>
            </div>
          </div>
        </div>
      </div>

      {/* Grid untuk Fitur, Spesifikasi, dan Ulasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Fitur Unggulan</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {(product.features as string[]).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {product.specifications &&
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Spesifikasi Teknis</h2>
            <div className="space-y-3">
              {Object.entries(product.specifications as { [key: string]: string }).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-800">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        }
      </div>

      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-6">Ulasan Pelanggan</h2>
        <div className="space-y-6">
            {dummyReviews.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                        <p className="font-semibold text-lg mr-4">{review.author}</p>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}
