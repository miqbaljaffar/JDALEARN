'use client';

import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { Product } from '@/app/lib/definitions';

export default function EditProductForm({
  product,
}: {
  product: Product;
}) {
  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={product.name}
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={product.description}
            />
          </div>
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Product Category */}
        <div className="mb-4">
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
                Category
            </label>
            <div className="relative">
                <input
                id="category"
                name="category"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={product.category}
                />
            </div>
        </div>

        {/* Image URL */}
        <div className="mb-4">
            <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                Image URL
            </label>
            <div className="relative">
                <input
                id="image_url"
                name="image_url"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={product.imageUrl}
                />
            </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Product</Button>
      </div>
    </form>
  );
}