import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizeObject } from '@/lib/sanitizer';
import { revalidatePath } from 'next/cache';

// Definisikan tipe untuk params agar lebih aman
interface RouteParams {
  id: string;
}

/**
 * Mengupdate berita berdasarkan ID.
 * Setelah berhasil, cache untuk halaman daftar dan detail berita akan dihapus.
 */
export async function PUT(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id: newsId } = await params;
    const id = parseInt(newsId);
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

    // Revalidasi (bersihkan cache) untuk path yang relevan
    revalidatePath('/news'); // Membersihkan cache halaman daftar berita
    revalidatePath(`/news/${sanitizedData.slug}`); // Membersihkan cache halaman detail yang diupdate

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Gagal mengupdate berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Menghapus berita berdasarkan ID.
 * Setelah berhasil, cache untuk halaman daftar dan detail berita yang dihapus akan dibersihkan.
 */
export async function DELETE(request: Request, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id: newsId } = await params;
    const id = parseInt(newsId);

    // Ambil data berita (terutama slug) SEBELUM dihapus
    const newsToDelete = await prisma.news.findUnique({
      where: { id },
    });

    if (newsToDelete) {
      // Hapus berita dari database
      await prisma.news.delete({
        where: { id },
      });

      // Revalidasi (bersihkan cache) untuk path yang relevan
      revalidatePath('/news'); // Membersihkan cache halaman daftar berita
      revalidatePath(`/news/${newsToDelete.slug}`); // Membersihkan cache halaman detail yang dihapus
    }

    return NextResponse.json({ message: 'Berita berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error("Gagal menghapus berita:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
