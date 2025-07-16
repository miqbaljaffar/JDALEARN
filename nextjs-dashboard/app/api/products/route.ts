// app/api/products/route.ts
import { NextResponse } from 'next/server';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

// Data sementara (static array)
let products: Product[] = [
  { id: 1, name: "Kemeja Polo", price: 250000, category: "Pakaian Pria", imageUrl: "/products/Polo.jpg" },
  { id: 2, name: "Celana Chino", price: 350000, category: "Pakaian Pria", imageUrl: "/products/Chinos.jpg" },
  { id: 3, name: "Celana Skena", price: 400000, category: "Pakaian Pria", imageUrl: "/products/Celana.jpg" },
  { id: 4, name: "Knitwear", price: 450000, category: "Pakaian Unisex", imageUrl: "/products/Knitwear.jpg" },
  { id: 5, name: "Rok", price: 300000, category: "Pakaian Wanita", imageUrl: "/products/Rok.jpg" },
];

// Mengambil semua produk
export async function GET() {
  return NextResponse.json(products);
}

// Menambahkan produk baru
export async function POST(request: Request) {
  const newProductData = await request.json();
  const newProduct: Product = {
    id: products.length + 1, // ID sederhana
    ...newProductData,
  };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}