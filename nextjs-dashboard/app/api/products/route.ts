import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeObject } from '@/lib/sanitizer';

// Skema Zod untuk validasi produk
const productSchema = z.object({
  name: z.string().min(3, { message: "Nama produk harus memiliki setidaknya 3 karakter" }),
  price: z.number().positive({ message: "Harga harus bernilai positif" }),
  categoryId: z.number().int().positive({ message: "Kategori ID tidak valid" }),
  imageUrl: z.string().min(1, { message: "URL gambar diperlukan" }),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
});

// 2. Modifikasi fungsi GET untuk menangani filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Ambil parameter halaman dan batas dari URL, default ke halaman 1 & 9 item
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    const categoryIds = searchParams.getAll('categoryId').map(id => parseInt(id)).filter(id => !isNaN(id));
    const minPrice = searchParams.has('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    // Buat objek `where` untuk query Prisma
    const where: any = {};

    if (categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined && maxPrice > 0) { 
        where.price.lte = maxPrice;
      }
    }

    // Hitung total produk yang cocok dengan filter untuk informasi pagination
    const totalProducts = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where, 
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
      skip: skip,
      take: limit,
    });
    return NextResponse.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Fungsi POST untuk membuat produk baru
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Sanitasi seluruh objek sebelum validasi
    const sanitizedData = sanitizeObject(data);
    const validatedData = productSchema.parse(sanitizedData);

    const newProduct = await prisma.product.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl,
        description: validatedData.description,
        features: validatedData.features || [],
        specifications: validatedData.specifications || {},
        categoryId: validatedData.categoryId,
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Input tidak valid", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Failed to create product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}