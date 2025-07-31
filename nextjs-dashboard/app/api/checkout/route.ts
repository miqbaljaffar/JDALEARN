import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    // Ambil 'items' dari body request, bukan hanya alamat dan metode pembayaran
    const { shippingAddress, paymentMethod, items } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "Alamat pengiriman dan metode pembayaran wajib diisi." }, { status: 400 });
    }

    // Validasi 'items' yang dikirim dari client
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Keranjang belanja kosong." }, { status: 400 });
    }

    // Untuk keamanan, validasi harga dan stok dari database
    const productIds = items.map((item: any) => item.productId);
    const productsFromDb = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });
    
    // Buat map untuk akses data produk dari DB dengan mudah
    const productMap = new Map(productsFromDb.map(p => [p.id, p]));

    let totalAmount = 0;
    for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
            throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
        }
        // Gunakan harga dari DB untuk kalkulasi, bukan harga dari client
        totalAmount += product.price * item.quantity;
    }

    const order = await prisma.$transaction(async (tx) => {
      // 1. Cek stok untuk semua item di keranjang menggunakan data dari DB
      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Stok untuk produk ${product?.name || 'yang Anda pilih'} tidak mencukupi.`);
        }
      }

      // 2. Buat pesanan baru
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount, // Gunakan totalAmount yang sudah divalidasi
          status: 'PENDING',
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price, // Simpan harga dari DB
            })),
          },
        },
        include: { items: true }
      });

      // 3. Kurangi stok produk
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      
      // 4. Logika untuk menghapus cart dari DB tidak lagi diperlukan di sini
      // karena kita memproses 'items' langsung dari client.
      
      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    console.error("Gagal membuat pesanan:", error);
    // Mengembalikan pesan error yang lebih spesifik jika dari validasi stok
    if (error.message.startsWith('Stok untuk produk') || error.message.startsWith('Produk dengan ID')) {
       return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}