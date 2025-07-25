import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AddToCartButton from '@/app/ui/products/AddToCartButton';
import BuyNowButton from '@/app/ui/products/BuyNowButton';

// Mendefinisikan tipe data untuk produk
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: { name: string; };
  imageUrl: string;
  features: any; // Menggunakan 'any' agar lebih fleksibel saat casting
  specifications: any; // Menggunakan 'any' agar lebih fleksibel saat casting
}

// Fungsi untuk mengambil data produk tunggal dari database
async function getProduct(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  // Jika produk tidak ditemukan, tampilkan halaman 404
  if (!product) {
    notFound();
  }

  return product;
}


export default async function ProductDetail({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
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
            <p className="text-lg text-gray-600 mb-6">
              {product.description}
            </p>
            <div className="text-4xl font-bold text-gray-900 mb-8">
              Rp{product.price.toLocaleString('id-ID')}
            </div>

            {/* --- PERBAIKAN TOMBOL --- */}
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

      {/* Kolom Fitur dan Spesifikasi */}
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
    </div>
  );
}