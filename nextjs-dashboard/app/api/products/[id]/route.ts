// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

// Data sementara (dapat di-refactor ke satu file nanti)
let products: Product[] = [
  { id: 1, name: "Kemeja Polo", price: 250000, category: "Pakaian Pria", imageUrl: "/products/Polo.jpg" },
  { id: 2, name: "Celana Chino", price: 350000, category: "Pakaian Pria", imageUrl: "/products/Chinos.jpg" },
  { id: 3, name: "Celana Skena", price: 400000, category: "Pakaian Pria", imageUrl: "/products/Celana.jpg" },
  { id: 4, name: "Knitwear", price: 450000, category: "Pakaian Unisex", imageUrl: "/products/Knitwear.jpg" },
  { id: 5, name: "Rok", price: 300000, category: "Pakaian Wanita", imageUrl: "/products/Rok.jpg" },
];

// Mengambil satu produk berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id));
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

// Mengupdate produk berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === parseInt(params.id));
  if (index === -1) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  const updatedData = await request.json();
  products[index] = { ...products[index], ...updatedData };
  return NextResponse.json(products[index]);
}

// Menghapus produk berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === parseInt(params.id));
  if (index === -1) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  const deletedProduct = products.splice(index, 1);
  return NextResponse.json(deletedProduct[0]);
}