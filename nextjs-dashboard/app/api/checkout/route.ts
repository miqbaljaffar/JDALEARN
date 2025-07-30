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
    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "Alamat pengiriman dan metode pembayaran wajib diisi." }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Keranjang belanja kosong." }, { status: 400 });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      // 1. Cek stok untuk semua item di keranjang
      for (const item of cart.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Stok untuk produk ${item.product.name} tidak mencukupi.`);
        }
      }

      // 2. Buat pesanan baru
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: true }
      });

      // 3. Kurangi stok produk
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 4. Hapus item dari keranjang
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      
      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    console.error("Gagal membuat pesanan:", error);
    // Mengembalikan pesan error yang lebih spesifik jika dari validasi stok
    if (error.message.startsWith('Stok untuk produk')) {
       return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}