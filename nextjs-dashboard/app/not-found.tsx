import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-5 text-center">
      
      {/* Animasi menggunakan kelas 'animate-bounce' dari Tailwind */}
      <div className="animate-bounce text-8xl font-bold text-blue-500 md:text-9xl">
        404
      </div>
      
      {/* Ukuran teks responsif (text-4xl di mobile, md:text-5xl di desktop) */}
      <h1 className="mt-8 text-4xl font-bold text-gray-800 md:text-5xl">
        Oops! Halaman Tidak Ditemukan
      </h1>
      
      <p className="mt-4 max-w-md text-base text-gray-600 md:text-lg">
        Halaman yang Anda cari tidak ada. Mungkin telah dipindahkan, 
        dihapus, atau Anda salah memasukkan URL.
      </p>
      
      {/* Tombol dengan styling konsisten dari kelas 'btn' */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn">
          Kembali ke Beranda
        </Link>
        
        <Link 
          href="/products" 
          className="btn border-2 border-blue-500 bg-transparent text-blue-500 hover:bg-blue-50"
        >
          Lihat Semua Produk
        </Link>
      </div>
      
      <div className="mt-16 text-6xl opacity-30">
        🚀
      </div>

    </div>
  )
}
