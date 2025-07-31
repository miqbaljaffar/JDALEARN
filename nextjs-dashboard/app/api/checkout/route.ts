import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// Definisikan tipe untuk produk yang diambil dari database
interface ProductFromDb {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { shippingAddress, paymentMethod, items } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "Alamat pengiriman dan metode pembayaran wajib diisi." }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Keranjang belanja kosong." }, { status: 400 });
    }

    const productIds = items.map((item: any) => item.productId);
    const productsFromDb = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });
    
    // Buat map untuk akses data produk dari DB dengan mudah dan berikan tipe eksplisit
    const productMap = new Map<number, ProductFromDb>(
        productsFromDb.map((p: ProductFromDb) => [p.id, p])
    );

    let totalAmount = 0;
    for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
            throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
        }
        // TypeScript sekarang tahu bahwa product bukan undefined karena sudah di-check di atas
        totalAmount += product.price * item.quantity;
    }

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Stok untuk produk ${product?.name || 'yang Anda pilih'} tidak mencukupi.`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: { items: true }
      });

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
      
      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    console.error("Gagal membuat pesanan:", error);
    if (error.message.startsWith('Stok untuk produk') || error.message.startsWith('Produk dengan ID')) {
       return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}