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
    // --- PERBAIKAN: Ambil data dari body request ---
    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "Alamat pengiriman dan metode pembayaran wajib diisi." }, { status: 400 });
    }
    // --- AKHIR PERBAIKAN ---

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Keranjang belanja kosong." }, { status: 400 });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          // --- PERBAIKAN: Simpan data baru ke database ---
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          // --- AKHIR PERBAIKAN ---
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

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      
      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error("Gagal membuat pesanan:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}