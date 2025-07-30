import prisma from '@/lib/prisma';
import ProductList from '@/app/ui/products/ProductList';
import Pagination from '@/app/ui/pagination';
import { Suspense } from 'react';
import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';
import SortDropdown from '@/app/ui/products/SortDropdown'; 

// Definisikan tipe untuk kejelasan
interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string };
  imageUrl: string;
  rating: number;
  stock: number;
}

interface Category {
  id: number;
  name: string;
}

// Definisikan tipe untuk searchParams
interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export const dynamic = 'force-dynamic';

async function getProductsAndCategories(searchParamsPromise: Promise<SearchParams>) {
  const searchParams = await searchParamsPromise;

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
  
  const sort = searchParams?.sort as string | undefined || 'newest'; 

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
  
  // Tentukan klausa orderBy
  const orderBy: any = {};
  if (sort === 'price-asc') {
    orderBy.price = 'asc';
  } else if (sort === 'price-desc') {
    orderBy.price = 'desc';
  } else if (sort === 'popularity') {
      orderBy.reviews = {
        _count: 'desc',
      };
  } else {
    orderBy.createdAt = 'desc';
  }


  const [productsData, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: { 
        category: true,
        _count: { 
          select: { reviews: true },
        },
      },
      orderBy: orderBy, 
      skip: skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany(),
  ]);

  const productsWithRating = productsData.map((p: any) => ({
    ...p,
    rating: 4.5, 
  }));

  return {
    products: productsWithRating,
    totalPages: Math.ceil(totalProducts / limit),
    categories,
    currentPage,
  };
}

// Komponen Halaman Utama (Server Component)
export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) { 
  const { products, totalPages, categories, currentPage } =
    await getProductsAndCategories(searchParams);

  return (
    <div>
      <div className="card">
        <h1>Produk Kami</h1>
        <p>Jelajahi koleksi pakaian berkualitas tinggi dari kami, siap untuk Anda miliki.</p>
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-grow">
            <Search placeholder="Cari produk..." />
          </div>
          <div className="w-full md:w-auto md:min-w-[200px]">
            <SortDropdown /> 
          </div>
        </div>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ProductList initialProducts={products} categories={categories} />
      </Suspense>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}