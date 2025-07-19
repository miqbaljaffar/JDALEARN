import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log(`Memulai proses seeding...`);

  // --- Seeding Kategori (Tetap sama) ---
  const initialCategories = [
    { name: 'Kemeja' },
    { name: 'Celana' },
    { name: 'Rok' },
    { name: 'Kaos' },
    { name: 'Pakaian Unisex' },
    { name: 'Pakaian Pria' },
    { name: 'Pakaian Wanita' },
  ];

  for (const categoryData of initialCategories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: { name: categoryData.name },
    });
    console.log(`Kategori "${categoryData.name}" berhasil dibuat atau sudah ada.`);
  }

  // --- Seeding Pengguna (Admin dan Customer) ---
  console.log(`Membuat pengguna admin dan customer...`);

  // Data untuk Admin
  const adminPassword = await hash('admin123', 10); // Ganti dengan password yang aman
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN', // Tentukan perannya sebagai ADMIN
    },
  });
  console.log(`Pengguna Admin (admin@example.com) berhasil dibuat.`);

  // Data untuk Customer
  const customerPassword = await hash('customer123', 10); // Ganti dengan password yang aman
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Customer User',
      password: customerPassword,
      role: 'CUSTOMER', // Default-nya sudah CUSTOMER, tapi lebih baik eksplisit
    },
  });
  console.log(`Pengguna Customer (customer@example.com) berhasil dibuat.`);


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