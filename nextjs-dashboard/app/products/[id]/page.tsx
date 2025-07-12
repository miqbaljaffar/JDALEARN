import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  features: string[]
  specifications: { [key: string]: string }
}

const products: Product[] = [
  {
    id: 1,
    name: "Kemeja Polo",
    description: "Kemeja polo katun premium untuk gaya kasual.",
    price: 250000,
    category: "Pakaian Pria",
    imageUrl: "/products/Polo.jpg",
    features: [
      "Bahan Katun Pique",
      "Potongan Reguler",
      "Kerah Berkancing",
      "Nyaman Dikenakan",
      "Tersedia Berbagai Warna"
    ],
    specifications: {
      "Bahan": "100% Katun",
      "Perawatan": "Cuci mesin",
      "Asal": "Indonesia"
    }
  },
  {
    id: 2,
    name: "Celana Chino",
    description: "Celana chino slim-fit untuk tampilan modern.",
    price: 350000,
    category: "Pakaian Pria",
    imageUrl: "/products/Chinos.jpg",
    features: [
      "Bahan Twill Stretch",
      "Potongan Slim-Fit",
      "Kantong Samping dan Belakang",
      "Ritsleting YKK",
      "Tahan Lama"
    ],
    specifications: {
      "Bahan": "98% Katun, 2% Spandex",
      "Perawatan": "Cuci mesin",
      "Asal": "Indonesia"
    }
  },
  {
    id: 3,
    name: "Celana Skena",
    description: "Celana kargo dengan banyak kantong untuk gaya urban.",
    price: 400000,
    category: "Pakaian Pria",
    imageUrl: "/products/Celana.jpg",
    features: [
      "Bahan Ripstop",
      "Banyak Kantong",
      "Potongan Longgar",
      "Tali Serut di Pinggang",
      "Gaya Streetwear"
    ],
    specifications: {
      "Bahan": "100% Katun Ripstop",
      "Perawatan": "Cuci mesin",
      "Asal": "Indonesia"
    }
  },
  {
    id: 4,
    name: "Knitwear",
    description: "Sweater rajut hangat untuk cuaca dingin.",
    price: 450000,
    category: "Pakaian Unisex",
    imageUrl: "/products/Knitwear.jpg",
    features: [
      "Bahan Wol Merino",
      "Rajutan Kabel",
      "Hangat dan Lembut",
      "Kerah Bulat",
      "Gaya Klasik"
    ],
    specifications: {
      "Bahan": "80% Wol Merino, 20% Nilon",
      "Perawatan": "Cuci dengan tangan",
      "Asal": "Indonesia"
    }
  },
  {
    id: 5,
    name: "Rok",
    description: "Rok lipit yang elegan untuk berbagai kesempatan.",
    price: 300000,
    category: "Pakaian Wanita",
    imageUrl: "/products/Rok.jpg",
    features: [
      "Bahan Poliester",
      "Model Lipit",
      "Pinggang Karet",
      "Panjang Midi",
      "Desain Feminin"
    ],
    specifications: {
      "Bahan": "100% Poliester",
      "Perawatan": "Cuci mesin",
      "Asal": "Indonesia"
    }
  },
]

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id)
  const product = products.find(p => p.id === productId)
  
  if (!product) {
    notFound()
  }
  
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
            {/* Bagian ini sudah benar, menampilkan gambar produk */}
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
              {product.category}
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
            
            <button className="btn" style={{ marginRight: '15px' }}>
              Tambah ke Keranjang
            </button>
            <button className="btn" style={{ background: '#333', borderColor: '#333' }}>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div className="card">
          <h2>Fitur</h2>
          <ul style={{ paddingLeft: '20px' }}>
            {product.features.map((feature, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div className="card">
          <h2>Spesifikasi</h2>
          <div>
            {Object.entries(product.specifications).map(([key, value]) => (
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
      </div>
    </div>
  )
}