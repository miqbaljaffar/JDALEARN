import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeObject } from '@/lib/sanitizer';

// Mengambil semua berita
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error("Gagal mengambil berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Membuat berita baru
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