import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeObject } from '@/lib/sanitizer';
import { revalidatePath } from 'next/cache';

// Definisikan tipe untuk params
interface RouteParams {
  id: string;
}

// Mengambil satu produk berdasarkan ID 
export async function GET(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id: productId } = await params;
    const id = parseInt(productId);
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
export async function PUT(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id: productId } = await params;
    const id = parseInt(productId);
    const data = await request.json();
    const sanitizedData = sanitizeObject(data);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: sanitizedData.name,
        price: sanitizedData.price,
        stock: sanitizedData.stock,
        imageUrl: sanitizedData.imageUrl,
        description: sanitizedData.description,
        categoryId: sanitizedData.categoryId,
        features: sanitizedData.features, 
        specifications: sanitizedData.specifications, 
      },
    });

    revalidatePath('/products');
    revalidatePath(`/products/${id}`);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Menghapus produk berdasarkan ID
export async function DELETE(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id: productId } = await params;
    const id = parseInt(productId);
    
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/products');
    revalidatePath(`/products/${id}`);

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
