import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Impor instance Prisma

interface Params {
  params: { id: string };
}

// Mengambil satu produk berdasarkan ID
export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }, // Sertakan juga info kategori
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Mengupdate produk berdasarkan ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        description: data.description,
        features: data.features,
        specifications: data.specifications,
        categoryId: data.categoryId,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Menghapus produk berdasarkan ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}