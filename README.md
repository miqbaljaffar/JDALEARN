# Ztyle: Modern E-commerce Platform

Ztyle adalah platform e-commerce fashion modern yang dibangun dengan Next.js. Proyek ini menampilkan fungsionalitas lengkap untuk pelanggan (penjelajahan produk, keranjang belanja, checkout, riwayat pesanan, manajemen profil) dan panel admin yang komprehensif untuk mengelola produk, kategori, pesanan, dan artikel berita.

## Fitur Utama

### Fitur Pengguna/Pelanggan
- **Autentikasi Pengguna**:
  - Pendaftaran, Login, dan Logout.
  - Verifikasi email dengan OTP.
  - Fungsionalitas lupa dan reset password.
  - Login menggunakan kredensial dan Google OAuth.

- **Manajemen Profil**: Pengguna dapat melihat dan memperbarui informasi profil mereka (nama, nomor telepon, alamat).

- **Penjelajahan Produk**:
  - Menampilkan daftar produk dengan paginasi.
  - Filter produk berdasarkan kategori dan rentang harga.
  - Pencarian produk berdasarkan nama.
  - Pengurutan produk berdasarkan terbaru, terpopuler, harga terendah, dan harga tertinggi.

- **Detail Produk**: Halaman detail produk yang menampilkan informasi lengkap, stok, harga, dan ulasan.

- **Keranjang Belanja**:
  - Menambah dan menghapus produk dari keranjang.
  - Memperbarui kuantitas item dalam keranjang.

- **Proses Checkout**:
  - Mengisi detail pengiriman (menggunakan alamat profil atau alamat baru).
  - Memilih metode pembayaran (m-Banking, DANA, OVO, GoPay).
  - Pembuatan pesanan dan pengurangan stok produk secara transaksional.

- **Pembayaran**: Mengunggah bukti pembayaran untuk pesanan yang berstatus `PENDING` atau `WAITING_CONFIRMATION`.

- **Riwayat Pesanan**: Pengguna dapat melihat semua pesanan mereka, statusnya, dan detail item.

- **Sistem Ulasan**: Pengguna dapat memberikan ulasan (rating dan komentar) untuk produk yang sudah dibeli dan diterima/dibayar.

- **Berita & Wawasan Fashion**: Melihat daftar artikel berita dan detailnya.

### Fitur Admin Dashboard
- **Akses Terproteksi**: Dashboard hanya dapat diakses oleh pengguna dengan peran `ADMIN`.

- **Ringkasan Dashboard**: Menampilkan statistik utama seperti total pendapatan, total penjualan, jumlah pelanggan, dan jumlah produk, serta grafik penjualan dan pelanggan baru.

- **Manajemen Produk**:
  - Melihat, menambah, mengedit, dan menghapus produk.
  - Mengunggah gambar produk dengan konversi otomatis ke format WebP.

- **Manajemen Kategori**: Membuat, mengedit, dan menghapus kategori produk. Menangani pengecekan dependensi produk sebelum penghapusan.

- **Manajemen Pesanan**: Melihat semua pesanan pelanggan, statusnya, detail pelanggan, dan bukti pembayaran (jika ada). Admin dapat mengonfirmasi pembayaran atau membatalkan pesanan.

- **Manajemen Berita**: Membuat, mengedit, dan menghapus artikel berita/blog menggunakan rich text editor (TipTap).

### Fitur Teknis & Umum
- **Paginasi**: Untuk daftar produk, pesanan, kategori, dan berita.
- **Global CSS**: Penggunaan Tailwind CSS untuk styling responsif, ditambah beberapa CSS kustom.
- **Font Kustom**: Penggunaan Poppins dari Google Fonts.
- **SEO-friendly**: Metadata dinamis untuk halaman produk dan berita, serta BreadcrumbList dan Article/Product schemas JSON-LD.
- **Notifikasi Pengguna**: Menggunakan library `sonner` untuk notifikasi toast yang interaktif dan informatif.
- **Middleware**: Contoh implementasi rate limiting untuk percobaan login.

## Teknologi yang Digunakan
- **Framework**: Next.js 14 (App Router)
- **Bahasa Pemrograman**: TypeScript
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Tailwind CSS
- **ORM**: Prisma ORM (untuk interaksi database)
- **Autentikasi**: NextAuth.js
- **Validasi Skema**: Zod
- **Notifikasi Toast**: Sonner
- **Rich Text Editor**: TipTap (digunakan di manajemen berita)
- **Image Processing**: Sharp (untuk optimasi gambar saat upload)
- **Icons**: Heroicons, React Icons
- **Charting Library**: Recharts (untuk grafik dashboard)
- **Debounce Hook**: use-debounce

## Memulai Proyek
Ikuti langkah-langkah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prerequisites
- Node.js (versi 18.x atau lebih tinggi direkomendasikan)
- npm atau yarn
- Database (PostgreSQL, MySQL, SQLite, atau MongoDB - sesuai konfigurasi Prisma Anda)

### Instalasi
1. Clone repositori:
   ```bash
   git clone [URL_REPOSITORI_ANDA]
   cd [nama_folder_proyek]
   ```

2. Instal dependensi:
   ```bash
   pnpm install
   # atau
   yarn install
   ```

3. Konfigurasi Variabel Lingkungan:
   Buat file `.env` di root proyek dan isi dengan variabel-variabel berikut:
   ```env
   # Database (Ganti dengan URL database Anda)
   DATABASE_URL="postgresql://user:password@host:port/database"

   # NextAuth.js
   NEXTAUTH_SECRET="SUPER_RAHASIA_STRING_YANG_PANJANG_DAN_UNIK"
   NEXTAUTH_URL="http://localhost:3000" # Ganti dengan URL domain Anda saat deployment

   # Google OAuth (Opsional, jika ingin mengaktifkan login Google)
   GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
   GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

   # Konfigurasi Email (untuk verifikasi email dan reset password)
   EMAIL_SERVER_HOST="smtp.mailtrap.io" # Contoh untuk development, ganti dengan SMTP provider Anda
   EMAIL_SERVER_PORT=2525
   EMAIL_SERVER_USER="your_mailtrap_user"
   EMAIL_SERVER_PASSWORD="your_mailtrap_password"
   EMAIL_FROM="no-reply@yourdomain.com"
   ```

   **Penting**: Untuk `NEXTAUTH_SECRET`, gunakan string acak yang panjang dan kuat. Anda bisa membuatnya dengan `openssl rand -base64 32` di terminal Linux/macOS, atau generator online.

4. Inisialisasi Database (Prisma):
   - Pastikan `DATABASE_URL` di `.env` sudah benar.
   - Jalankan migrasi Prisma untuk membuat skema database:
     ```bash
     pnpm prisma migrate dev --name init
     ```
   - Jika Anda ingin mengisi database dengan data dummy (seperti produk, kategori, user admin):
     ```bash
     pnpm prisma db seed
     ```
     (Asumsi Anda memiliki file `seed.ts` atau `seed.js` di folder `prisma` Anda.)

### Menjalankan Aplikasi
```bash
pnpm run dev
# atau
yarn dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

## Struktur Proyek (Ringkasan)
- `app/`: Berisi semua halaman dan API routes Next.js.
  - `(site)/`: Halaman-halaman yang dapat diakses oleh semua pengguna (homepage, products, news, checkout, profile).
  - `(admin)/dashboard/`: Halaman-halaman admin dashboard.
  - `api/`: Semua API routes (authentication, products, orders, cart, etc.).
  - `ui/`: Komponen UI yang dapat digunakan kembali (buttons, forms, product cards, pagination, etc.).
  - `lib/`: Utility functions (Prisma client, sanitizer, mailer, rate-limiter).
- `public/`: File statis (gambar, logo).
- `prisma/`: Skema database Prisma dan file migrasi.

## API Endpoints (Ringkasan)
Berikut adalah beberapa endpoint API utama:

- **Produk**:
  - `GET /api/products`: Mengambil daftar produk (mendukung filter, pencarian, paginasi, sorting).
  - `GET /api/products/[id]`: Mengambil detail produk berdasarkan ID.
  - `POST /api/products`: Membuat produk baru (Admin).
  - `PUT /api/products/[id]`: Memperbarui produk (Admin).
  - `DELETE /api/products/[id]`: Menghapus produk (Admin).

- **Kategori**:
  - `GET /api/categories`: Mengambil daftar kategori.
  - `POST /api/categories`: Membuat kategori baru (Admin).
  - `PUT /api/categories/[id]`: Memperbarui kategori (Admin).
  - `DELETE /api/categories/[id]`: Menghapus kategori (Admin).

- **Keranjang & Pesanan**:
  - `GET /api/cart`: Mengambil item di keranjang belanja pengguna yang sedang login.
  - `POST /api/cart`: Menambahkan produk ke keranjang.
  - `PUT /api/cart`: Memperbarui kuantitas item di keranjang.
  - `POST /api/checkout`: Memproses checkout dan membuat pesanan baru.
  - `POST /api/orders/[id]/payment`: Mengunggah bukti pembayaran untuk pesanan.
  - `GET /api/orders`: Mengambil semua pesanan (Admin).
  - `PUT /api/orders/[id]`: Memperbarui status pesanan (Admin).
  - `GET /api/profile/orders`: Mengambil riwayat pesanan pengguna yang sedang login.

- **Pengguna**:
  - `GET /api/user/profile`: Mengambil data profil pengguna yang sedang login.
  - `PUT /api/user/profile`: Memperbarui data profil pengguna.
  - `POST /api/register`: Mendaftarkan pengguna baru dan mengirim email verifikasi.
  - `POST /api/verify-email`: Memverifikasi email pengguna dengan OTP.
  - `POST /api/auth/forgot-password`: Mengirim email instruksi reset password.
  - `POST /api/auth/reset-password`: Mereset password pengguna.
  - `POST /api/reviews`: Mengirimkan ulasan produk.

- **Berita**:
  - `GET /api/news`: Mengambil daftar berita.
  - `POST /api/news`: Membuat berita baru (Admin).
  - `PUT /api/news/[id]`: Memperbarui berita (Admin).
  - `DELETE /api/news/[id]`: Menghapus berita (Admin).

- **Lainnya**:
  - `POST /api/upload`: Mengunggah file gambar ke server (digunakan oleh manajemen produk dan berita).

## Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.