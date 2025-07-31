import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
// Hapus import PrismaClient yang tidak terpakai di sini jika hanya untuk type `tx`
// import { PrismaClient } from '@prisma/client';

const reviewSchema = z.object({
  productId: z.number(),
  orderItemId: z.number(),
  rating: z.number().min(1, "Rating harus diisi").max(5),
  comment: z.string().min(10, "Komentar minimal harus 10 karakter."),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);
    const userId = session.user.id;

    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: validatedData.orderItemId,
        productId: validatedData.productId,
        order: {
          userId: userId,
          status: { in: ['DELIVERED', 'PAID'] }
        },
        reviewId: null
      }
    });

    if (!orderItem) {
      return NextResponse.json({ message: "Anda tidak dapat memberikan ulasan untuk produk ini atau ulasan sudah ada." }, { status: 403 });
    }

    // --- PERBAIKAN DI SINI ---
    // Hapus tipe eksplisit 'PrismaClient' dari 'tx'.
    // Biarkan TypeScript yang menentukan tipenya secara otomatis.
    const newReview = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: {
          rating: validatedData.rating,
          comment: validatedData.comment,
          userId: userId,
          productId: validatedData.productId,
        },
      });

      await tx.orderItem.update({
        where: { id: orderItem.id },
        data: { reviewId: createdReview.id },
      });

      return createdReview;
    },
    {
      maxWait: 15000,
      timeout: 30000, 
    });
    // --- AKHIR PERBAIKAN ---

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Input tidak valid", errors: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Gagal membuat review:", error);
    if ((error as any).code === 'P2028') {
        return NextResponse.json({ message: "Proses terlalu lama, transaksi timeout. Coba lagi." }, { status: 504 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}