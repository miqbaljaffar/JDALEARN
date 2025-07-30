import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeObject } from '@/lib/sanitizer';

// Mengambil semua berita dengan paginasi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10; // Jumlah item per halaman
    const skip = (page - 1) * limit;

    const [news, totalNews] = await Promise.all([
        prisma.news.findMany({
            orderBy: { createdAt: 'desc' },
            skip: skip,
            take: limit,
        }),
        prisma.news.count(),
    ]);
    
    return NextResponse.json({
        news,
        totalPages: Math.ceil(totalNews / limit),
        currentPage: page,
    });
  } catch (error) {
    console.error("Gagal mengambil berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Membuat berita baru (tidak berubah)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const sanitizedData = sanitizeObject(data);

    const newNews = await prisma.news.create({
      data: {
        title: sanitizedData.title,
        excerpt: sanitizedData.excerpt,
        content: sanitizedData.content,
        imageUrl: sanitizedData.imageUrl,
        author: sanitizedData.author,
        slug: sanitizedData.slug,
      },
    });
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}