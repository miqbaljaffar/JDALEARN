# 🛍️ Ztyle - Modern E-Commerce Platform

**Ztyle** adalah platform e-commerce modern yang dibangun menggunakan **Next.js**, dirancang untuk memberikan pengalaman berbelanja yang intuitif dan mulus. Platform ini dilengkapi dengan fitur lengkap untuk **pelanggan** maupun **admin**, termasuk katalog produk, checkout, manajemen pesanan, sistem ulasan, hingga CMS berita fashion.

---

## 🔗 Tautan Langsung

* **Aplikasi**: [Klik untuk mengunjungi](https://ztyle-store.vercel.app)
* **Repository**: [Lihat kode di GitHub](https://github.com/miqbaljaffar/JDALEARN)

---

## 🌟 Fitur Utama

### 👥 Untuk Pengguna (Klien)

* **Autentikasi Lengkap**
  Pendaftaran, login, logout, verifikasi email via OTP, serta login melalui Google (OAuth) dengan NextAuth.js.

* **Manajemen Profil**
  Pengguna dapat memperbarui nama, nomor telepon, dan alamat pengiriman.

* **Katalog & Detail Produk**
  Pencarian, filter kategori/harga, sorting, dan tampilan detail lengkap dengan stok, ulasan, dan galeri.

* **Keranjang Belanja**
  Menambahkan/menghapus produk dan update kuantitas. Data persist menggunakan Zustand.

* **Proses Checkout**
  Input alamat, pilih metode pembayaran (DANA, OVO, GoPay, m-Banking), upload bukti pembayaran.

* **Riwayat & Status Pesanan**
  Melihat semua transaksi, status pesanan, dan ulasan produk.

* **Sistem Ulasan**
  Memberikan rating & komentar untuk produk yang dibeli dan telah diterima.

* **Berita Fashion**
  Membaca artikel dan berita seputar tren fashion.

---

### 🛠️ Untuk Admin (Dasbor)

* **Dasbor Statistik**
  Total pendapatan, penjualan, pelanggan baru, dan produk terlaris dalam grafik interaktif (Recharts).

* **Manajemen Produk**
  CRUD produk, upload gambar (Vercel Blob), dan konversi otomatis ke WebP.

* **Manajemen Kategori**
  CRUD kategori dengan validasi dependensi produk.

* **Manajemen Pesanan**
  Melihat dan memproses pesanan pelanggan, bukti pembayaran, dan update status pesanan.

* **CMS Berita**
  CRUD artikel berita dengan editor kaya (TipTap).

* **Otorisasi Berbasis Peran**
  Hanya pengguna dengan peran `ADMIN` yang dapat mengakses dasbor.

---

## ⚙️ Teknologi yang Digunakan

| Kategori          | Teknologi                  |
| ----------------- | -------------------------- |
| Framework         | Next.js 14 (App Router)    |
| Bahasa            | TypeScript                 |
| Styling           | Tailwind CSS               |
| ORM               | Prisma                     |
| Database          | PostgreSQL & Neon |
| Autentikasi       | NextAuth.js                |
| Validasi Form     | Zod + React Hook Form      |
| Manajemen State   | Zustand (keranjang)        |
| Editor Teks       | TipTap                     |
| Grafik Dashboard  | Recharts                   |
| Notifikasi        | Sonner (toast)             |
| Pengolahan Gambar | Sharp (konversi WebP)      |
| Email OTP         | Nodemailer                 |
| Upload Gambar     | Vercel Blob                |
| Ikon              | Heroicons, React Icons     |

---

## 🚀 Instalasi & Setup Lokal

### 🔧 Prasyarat

* Node.js v18+
* PostgreSQL (atau sesuai konfigurasi Prisma)
* Git + Package Manager (pnpm/yarn/npm)

### 📥 Langkah Instalasi

1. **Clone repositori**

   ```bash
   git clone https://github.com/miqbaljaffar/JDALEARN.git
   cd nextjs-dashboard
   ```

2. **Install dependensi**

   ```bash
   pnpm install
   # atau
   yarn install
   ```

3. **Siapkan file `.env`**
   Buat file `.env` dan isi berdasarkan `.env.example`:

   ```env
   DATABASE_URL="..."
   NEXTAUTH_SECRET="..."
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   EMAIL_SERVER_HOST="..."
   EMAIL_SERVER_PORT=...
   EMAIL_SERVER_USER="..."
   EMAIL_SERVER_PASSWORD="..."
   EMAIL_FROM="no-reply@domain.com"
   BLOB_READ_WRITE_TOKEN="..."
   ```

4. **Migrasi & Seed Database**

   ```bash
   pnpm prisma migrate dev --name init
   pnpm prisma db seed  # opsional
   ```

5. **Jalankan Server**

   ```bash
   pnpm run dev
   # akses di http://localhost:3000
   ```

---

## 🧱 Struktur Proyek (Next.js App Router)

```
/app
├── (admin)/dashboard/      → Halaman dasbor admin
├── (site)/                 → Halaman publik (beranda, produk, checkout, dll)
├── api/                    → API route (auth, produk, pesanan, dll)
/lib                         → Helper (prisma, auth, mailer, dll)
/store                       → Zustand store
/ui                          → Komponen UI reusable
/public                      → Gambar & aset statis
/prisma                      → Skema dan file migrasi database
```

---

## 🔌 API Endpoints (Ringkasan)

| Modul     | Method | Endpoint                   | Deskripsi                  |
| --------- | ------ | -------------------------- | -------------------------- |
| Produk    | GET    | `/api/products`            | Ambil semua produk         |
|           | GET    | `/api/products/[id]`       | Detail produk tertentu     |
|           | POST   | `/api/products`            | Tambah produk (admin)      |
|           | PUT    | `/api/products/[id]`       | Edit produk (admin)        |
|           | DELETE | `/api/products/[id]`       | Hapus produk (admin)       |
| Kategori  | GET    | `/api/categories`          | Ambil kategori             |
|           | POST   | `/api/categories`          | Tambah kategori (admin)    |
| Pesanan   | GET    | `/api/orders`              | Semua pesanan (admin/user) |
|           | POST   | `/api/orders/[id]/payment` | Upload bukti pembayaran    |
| Checkout  | POST   | `/api/checkout`            | Proses checkout            |
| Keranjang | GET    | `/api/cart`                | Ambil item keranjang       |
| Pengguna  | GET    | `/api/user/profile`        | Data profil pengguna       |
|           | PUT    | `/api/user/profile`        | Update profil pengguna     |
| Berita    | GET    | `/api/news`                | Daftar artikel             |
|           | POST   | `/api/news`                | Tambah artikel (admin)     |
| Review    | POST   | `/api/reviews`             | Kirim ulasan produk        |
| Upload    | POST   | `/api/upload`              | Upload file/gambar         |

---

## 🤝 Kontribusi

Kontribusi sangat kami hargai!

* Temukan bug? Buat [issue](https://github.com/miqbaljaffar/JDALEARN/issues)
* Punya ide fitur baru? Ajukan [pull request](https://github.com/miqbaljaffar/JDALEARN/pulls)

---

## Lampiran 
![Halaman Utama](https://raw.githubusercontent.com/miqbaljaffar/JDALEARN/main/nextjs-dashboard/insight/1.png)
![Halaman Produk](https://raw.githubusercontent.com/miqbaljaffar/JDALEARN/main/nextjs-dashboard/insight/2.png)
![Halaman Dashboard](https://raw.githubusercontent.com/miqbaljaffar/JDALEARN/main/nextjs-dashboard/insight/3.png)


## 📄 Lisensi

Proyek ini menggunakan **Lisensi MIT**. Silakan lihat file [LICENSE](./LICENSE) untuk informasi lebih lanjut.
