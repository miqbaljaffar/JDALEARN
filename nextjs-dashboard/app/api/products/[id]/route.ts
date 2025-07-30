import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeObject } from '@/lib/sanitizer'; // Import sanitizer

interface Params {
  params: { id: string };
}

// Mengambil satu produk berdasarkan ID (Tidak ada perubahan)
export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
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
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    // Sanitasi data sebelum diupdate
    const sanitizedData = sanitizeObject(data);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: sanitizedData.name,
        price: sanitizedData.price,
        stock: sanitizedData.stock, // <-- TAMBAHKAN BARIS INI
        imageUrl: sanitizedData.imageUrl,
        description: sanitizedData.description,
        features: sanitizedData.features,
        specifications: sanitizedData.specifications,
        categoryId: sanitizedData.categoryId,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Menghapus produk berdasarkan ID (Tidak ada perubahan)
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