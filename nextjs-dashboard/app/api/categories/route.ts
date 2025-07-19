import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mengambil semua kategori
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Membuat kategori baru
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: "Nama kategori diperlukan" }, { status: 400 });
    }
    const newCategory = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat kategori:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}