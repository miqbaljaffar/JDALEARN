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

// Modifikasi fungsi GET untuk menangani filter dan sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    const query = searchParams.get('query') || undefined;
    const categoryIds = searchParams.getAll('categoryId').map(id => parseInt(id)).filter(id => !isNaN(id));
    const minPrice = searchParams.has('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest'; // Ambil parameter sort

    const where: any = {};

    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive',
      };
    }

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
    
    // Tentukan klausa orderBy berdasarkan parameter sort
    const orderBy: any = {};
    if (sort === 'price-asc') {
      orderBy.price = 'asc';
    } else if (sort === 'price-desc') {
      orderBy.price = 'desc';
    } else if (sort === 'popularity') {
      orderBy.reviews = {
        _count: 'desc',
      };
    } else { 
      orderBy.createdAt = 'desc';
    }


    // Hitung total produk yang cocok dengan filter untuk informasi pagination
    const totalProducts = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        _count: { 
          select: { reviews: true },
        },
      },
      orderBy, 
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