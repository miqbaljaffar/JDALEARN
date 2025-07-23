import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah.' });
  }

  // Ubah spasi atau karakter spesial di nama file
  const filename = file.name.replace(/\s+/g, '_');
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Simpan file di direktori public/products
  const path = join(process.cwd(), 'public/products', filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File berhasil diunggah di: ${path}`);
    
    // Kembalikan path URL yang bisa diakses publik
    const publicPath = `/products/${filename}`;
    return NextResponse.json({ success: true, url: publicPath });

  } catch (error) {
    console.error("Gagal menyimpan file:", error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan file.' }, { status: 500 });
  }
}