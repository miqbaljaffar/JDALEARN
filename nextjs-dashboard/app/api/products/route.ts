// app/api/products/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Definisikan skema validasi untuk produk baru
const productSchema = z.object({
  name: z.string().min(3, { message: "Nama produk harus memiliki setidaknya 3 karakter" }),
  price: z.number().positive({ message: "Harga harus bernilai positif" }),
  categoryId: z.number().int().positive({ message: "Kategori ID tidak valid" }),
  // UBAH BARIS INI: Ganti .url() menjadi .min(1) untuk menerima path
  imageUrl: z.string().min(1, { message: "URL gambar diperlukan" }),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
});

// Mengambil semua produk dari database
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Menambahkan produk baru ke database
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validasi data menggunakan skema Zod
    const validatedData = productSchema.parse(data);

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
    // Tangani error validasi dari Zod
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