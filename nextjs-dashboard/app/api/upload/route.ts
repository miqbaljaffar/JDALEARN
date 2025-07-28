import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp'; 

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah.' });
  }

  // Ubah spasi atau karakter spesial di nama file dan hilangkan ekstensinya
  const originalFilename = file.name.replace(/\s+/g, '_');
  const filenameWithoutExt = originalFilename.split('.').slice(0, -1).join('.');
  const webpFilename = `${filenameWithoutExt}.webp`; // 2. Buat nama file baru dengan ekstensi .webp

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Tentukan path untuk menyimpan file WebP
  const path = join(process.cwd(), 'public/products', webpFilename);

  try {
    // 3. Gunakan sharp untuk konversi ke WebP dan simpan
    await sharp(buffer)
      .webp({ quality: 80 }) // Atur kualitas gambar WebP (opsional, 80 adalah default yang baik)
      .toFile(path);

    console.log(`File berhasil dikonversi dan diunggah di: ${path}`);

    // 4. Kembalikan path URL yang bisa diakses publik untuk file .webp
    const publicPath = `/products/${webpFilename}`;
    return NextResponse.json({ success: true, url: publicPath });

  } catch (error) {
    console.error("Gagal menyimpan atau mengonversi file:", error);
    return NextResponse.json({ success: false, message: 'Gagal memproses file.' }, { status: 500 });
  }
}