import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeObject } from '@/lib/sanitizer';

interface Params {
  params: { id: string };
}

// Mengupdate berita berdasarkan ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    const sanitizedData = sanitizeObject(data);

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: sanitizedData.title,
        excerpt: sanitizedData.excerpt,
        content: sanitizedData.content,
        imageUrl: sanitizedData.imageUrl,
        author: sanitizedData.author,
        slug: sanitizedData.slug,
      },
    });
    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Gagal mengupdate berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Menghapus berita berdasarkan ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    await prisma.news.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Berita berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error("Gagal menghapus berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}