import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Selamat Datang di Toko Pakaian Kami</h1>
        <p>Temukan koleksi fashion terbaru dan terbaik di sini.</p>
        <Link href="/products" className="btn">
          Jelajahi Produk
        </Link>
      </div>
      
      <div className="grid">
        <div className="card">
          <h2>🚀 Desain Modern</h2>
          <p>Dibuat dengan Next.js 14 dan TypeScript untuk performa optimal dan pengalaman pengembang terbaik.</p>
        </div>
        
        <div className="card">
          <h2>📱 Responsif</h2>
          <p>Desain yang sepenuhnya responsif yang berfungsi sempurna di semua perangkat dan ukuran layar.</p>
        </div>
        
        <div className="card">
          <h2>⚡ Pemuatan Cepat</h2>
          <p>Dioptimalkan untuk kecepatan dengan pembuatan statis dan teknologi web modern.</p>
        </div>
      </div>
    </div>
  )
}