import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AddToCartButton from '@/app/ui/products/AddToCartButton';

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
// Perubahan di sini: Tipe return diubah menjadi Promise<Product>
async function getProduct(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  // Jika produk tidak ditemukan, hentikan eksekusi dan tampilkan halaman 404.
  // Fungsi tidak akan pernah mencapai 'return' di bawah jika ini terjadi.
  if (!product) {
    notFound();
  }

  // Karena kita sudah memeriksa, di titik ini 'product' dijamin ada.
  return product;
}


export default async function ProductDetail({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  
  // Sekarang TypeScript yakin 'product' tidak akan pernah null.
  const product = await getProduct(productId);

  return (
    <div>
      <Link
        href="/products"
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          color: '#000',
          textDecoration: 'none'
        }}
      >
        ← Kembali ke Produk
      </Link>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{
              width: '100%',
              position: 'relative',
              height: '350px',
              background: '#f4f4f4',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <Image
                src={product.imageUrl}
                alt={`Gambar produk ${product.name}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            <span style={{
              background: '#eee',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#333',
              display: 'inline-block',
              marginTop: '20px'
            }}>
              {product.category.name}
            </span>
          </div>

          <div>
            <h1 style={{ marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
              {product.description}
            </p>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#000', marginBottom: '30px' }}>
              Rp{product.price.toLocaleString('id-ID')}
            </div>

            <AddToCartButton productId={product.id} className="btn">
              Tambah ke Keranjang
            </AddToCartButton>

            <button className="btn" style={{ marginLeft: '15px', background: '#333', borderColor: '#333' }}>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
        <div className="card">
          <h2>Fitur</h2>
          <ul style={{ paddingLeft: '20px' }}>
            {(product.features as string[]).map((feature, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
            ))}
          </ul>
        </div>

        {product.specifications &&
          <div className="card">
            <h2>Spesifikasi</h2>
            <div>
              {Object.entries(product.specifications as { [key: string]: string }).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontWeight: '600' }}>{key}:</span>
                  <span style={{ color: '#555' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  );
}