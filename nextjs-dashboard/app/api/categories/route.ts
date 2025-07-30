import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeInput } from '@/lib/sanitizer';

// Mengambil semua kategori dengan paginasi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10; // Jumlah item per halaman
    const skip = (page - 1) * limit;

    const [categories, totalCategories] = await Promise.all([
      prisma.category.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          id: 'asc'
        },
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json({
        categories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
    });
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Membuat kategori baru (tidak berubah)
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: "Nama kategori diperlukan" }, { status: 400 });
    }
    const sanitizedName = sanitizeInput(name);
    const newCategory = await prisma.category.create({
      data: { name: sanitizedName },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat kategori:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}