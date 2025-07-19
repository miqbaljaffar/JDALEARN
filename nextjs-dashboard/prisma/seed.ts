import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Daftar kategori awal yang ingin Anda tambahkan
const initialCategories = [
  { name: 'Kemeja' },
  { name: 'Celana' },
  { name: 'Rok' },
  { name: 'Kaos' },
  { name: 'Pakaian Unisex' },
  { name: 'Pakaian Pria' },
  { name: 'Pakaian Wanita' },
];

async function main() {
  console.log(`Memulai proses seeding...`);

  for (const categoryData of initialCategories) {
    // Coba buat kategori baru
    // `upsert` akan membuat data baru jika belum ada, atau mengupdate jika sudah ada (berdasarkan `where`).
    // Dalam kasus ini, kita hanya ingin membuat jika belum ada, jadi `update` bisa dikosongkan.
    await prisma.category.upsert({
      where: { name: categoryData.name }, // Cari berdasarkan nama untuk menghindari duplikat
      update: {}, // Tidak melakukan apa-apa jika sudah ada
      create: {
        name: categoryData.name,
      },
    });
    console.log(`Kategori "${categoryData.name}" berhasil dibuat atau sudah ada.`);
  }

  console.log(`Proses seeding selesai.`);
}

// Jalankan fungsi main dan tangani jika ada error
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Tutup koneksi Prisma
    await prisma.$disconnect();
  });