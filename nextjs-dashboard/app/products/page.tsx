import Link from 'next/link'
import Image from 'next/image'


interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl: string // Menambahkan properti imageUrl
}

const products: Product[] = [
  {
    id: 1,
    name: "Kemeja Polo",
    description: "Kemeja polo katun premium untuk gaya kasual.",
    price: 250000,
    category: "Pakaian Pria",
    imageUrl: "/products/Polo.jpg" // Menambahkan URL gambar
  },
  {
    id: 2,
    name: "Celana Chino",
    description: "Celana chino slim-fit untuk tampilan modern.",
    price: 350000,
    category: "Pakaian Pria",
    imageUrl: "/products/Chinos.jpg" // Menambahkan URL gambar
  },
  {
    id: 3,
    name: "Celana Skena",
    description: "Celana kargo dengan banyak kantong untuk gaya urban.",
    price: 400000,
    category: "Pakaian Pria",
    imageUrl: "/products/Celana.jpg" // Menambahkan URL gambar
  },
  {
    id: 4,
    name: "Knitwear",
    description: "Sweater rajut hangat untuk cuaca dingin.",
    price: 450000,
    category: "Pakaian Unisex",
    imageUrl: "/products/Knitwear.jpg" // Menambahkan URL gambar
  },
  {
    id: 5,
    name: "Rok",
    description: "Rok lipit yang elegan untuk berbagai kesempatan.",
    price: 300000,
    category: "Pakaian Wanita",
    imageUrl: "/products/Rok.jpg" // Menambahkan URL gambar
  },
]

export default function Products() {
  return (
    <div>
      <div className="card">
        <h1>Produk Kami</h1>
        <p>Temukan koleksi pakaian berkualitas tinggi kami.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="product-card">
              {/* Mengganti div dengan komponen Image */}
              <div className="product-image" style={{ position: 'relative', height: '200px' }}>
                <Image
                  src={product.imageUrl}
                  alt={`Gambar produk ${product.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="price">Rp{product.price.toLocaleString('id-ID')}</span>
                  <span style={{ 
                    background: '#e5e7eb', 
                    padding: '4px 12px', 
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}