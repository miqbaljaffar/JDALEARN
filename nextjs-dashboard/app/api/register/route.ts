import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitizer'; // Import sanitizer

// Skema validasi menggunakan Zod
const userSchema = z.object({
  name: z.string().min(3, "Nama harus lebih dari 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal harus 6 karakter."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validasi input terlebih dahulu
    const validatedData = userSchema.parse(body);

    // Sanitasi input setelah validasi
    const sanitizedName = sanitizeInput(validatedData.name);
    const sanitizedEmail = sanitizeInput(validatedData.email);

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
      },
    });

    // Jangan kembalikan password dalam response
    const { password: _, ...result } = newUser;

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Input tidak valid", errors: error.errors }, { status: 400 });
    }
    console.error("Gagal membuat user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}