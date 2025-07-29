import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Params {
  params: { id: string };
}

// POST handler untuk menyimpan URL bukti pembayaran
export async function POST(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const { paymentProof } = await request.json();

    if (!paymentProof) {
      return NextResponse.json({ message: 'URL bukti pembayaran diperlukan' }, { status: 400 });
    }
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        paymentProof,
        status: 'WAITING_CONFIRMATION', 
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Gagal menyimpan bukti pembayaran:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}