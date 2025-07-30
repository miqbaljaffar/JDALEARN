// Skeleton untuk Card
const CardSkeleton = () => (
  <div className="card">
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
  </div>
);

// Skeleton untuk Tabel
const TableRowSkeleton = () => (
  <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
    <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-100"></div>
        <div className="h-6 w-24 rounded bg-gray-100"></div>
      </div>
    </td>
    <td className="whitespace-nowrap px-3 py-3">
      <div className="h-6 w-32 rounded bg-gray-100"></div>
    </td>
    <td className="whitespace-nowrap px-3 py-3">
      <div className="h-6 w-16 rounded bg-gray-100"></div>
    </td>
  </tr>
);

export const TableSkeleton = () => (
  <div className="card">
    <table className="min-w-full text-gray-900">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Product</th>
          <th scope="col" className="px-3 py-5 font-medium">Category</th>
          <th scope="col" className="px-3 py-5 font-medium">Price</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </tbody>
    </table>
  </div>
);

// Skeleton untuk Halaman Detail Produk
export const ProductDetailSkeleton = () => (
    <div>
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-5"></div>
        <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div>
                    <div className="relative w-full h-96 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded-full mt-6 animate-pulse"></div>
                </div>
                <div>
                    <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-5 w-5/6 bg-gray-200 rounded animate-pulse mb-6"></div>
                    <div className="h-12 w-1/3 bg-gray-200 rounded animate-pulse mb-8"></div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-12 flex-1 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


// Skeleton untuk Dashboard
export const DashboardSkeleton = () => {
  return (
    <>
      <div className="h-8 w-48 mb-4 rounded bg-gray-200 animate-pulse"></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
         <div className="card col-span-1 md:col-span-4 h-96 bg-gray-200 animate-pulse"></div>
         <div className="card col-span-1 md:col-span-4 h-96 bg-gray-200 animate-pulse"></div>
      </div>
    </>
  );
};