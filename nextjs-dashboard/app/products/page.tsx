import prisma from '@/lib/prisma';
import ProductList from '@/app/ui/products/ProductList';
import Pagination from '@/app/ui/pagination';
import { Suspense } from 'react'; 
import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons'; 

// Tipe data untuk kejelasan
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string };
  imageUrl: string;
  rating: number;
}

interface Category {
  id: number;
  name: string;
}

export const dynamic = 'force-dynamic';

async function getProductsAndCategories(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const query = searchParams?.query as string | undefined;
  const currentPage = parseInt((searchParams?.page as string) || '1');
  const limit = 9;
  const skip = (currentPage - 1) * limit;

  const categoryIds = (
    Array.isArray(searchParams?.categoryId)
      ? searchParams.categoryId
      : [searchParams?.categoryId]
  )
    .filter(Boolean)
    .map((id) => parseInt(id as string))
    .filter((id) => !isNaN(id));

  const minPrice = searchParams?.minPrice
    ? parseFloat(searchParams.minPrice as string)
    : undefined;
  const maxPrice = searchParams?.maxPrice
    ? parseFloat(searchParams.maxPrice as string)
    : undefined;

  const whereClause: any = {};

  if (query) {
    whereClause.name = {
      contains: query,
      mode: 'insensitive',
    };
  }

  if (categoryIds.length > 0) {
    whereClause.categoryId = { in: categoryIds };
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = minPrice;
    if (maxPrice !== undefined && maxPrice > 0)
      whereClause.price.lte = maxPrice;
  }

  const [productsData, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany(),
  ]);

  const productsWithRating = productsData.map((p: any) => ({
    ...p,
    rating: 4.5, // Rating ini masih statis, bisa dikembangkan nanti
  }));

  return {
    products: productsWithRating,
    totalPages: Math.ceil(totalProducts / limit),
    categories,
    currentPage,
  };
}

// Komponen Halaman Utama (Server Component)
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { products, totalPages, categories, currentPage } =
    await getProductsAndCategories(searchParams);

  return (
    <div>
      <div className="card">
        <h1>Produk Kami</h1>
        <p>Jelajahi koleksi pakaian berkualitas tinggi dari kami, siap untuk Anda miliki.</p>
        <div className="mt-4">
          <Search placeholder="Cari produk..." />
        </div>
      </div>

      {/* Gunakan Suspense untuk menampilkan skeleton saat data dimuat */}
      <Suspense fallback={<TableSkeleton />}>
        <ProductList initialProducts={products} categories={categories} />
      </Suspense>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}