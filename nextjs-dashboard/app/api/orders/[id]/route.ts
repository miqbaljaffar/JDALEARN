import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Definisikan tipe untuk params agar lebih aman
interface Params {
  id: string;
}

// GET handler untuk mengambil satu pesanan
export async function GET(request: Request, { params }: { params: Promise<Params> }) { 
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id: orderId } = await params; 
        const id = parseInt(orderId);

        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order || (order.userId !== session.user.id && session.user.role !== 'ADMIN')) {
            return NextResponse.json({ message: 'Order not found or not authorized' }, { status: 404 });
        }
        
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// PUT handler untuk admin mengupdate status pesanan
export async function PUT(request: Request, { params }: { params: Promise<Params> }) { // 1. params sekarang adalah Promise
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: orderId } = await params; 
    const id = parseInt(orderId);
    
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ message: 'Status diperlukan' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Gagal mengupdate status pesanan:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}