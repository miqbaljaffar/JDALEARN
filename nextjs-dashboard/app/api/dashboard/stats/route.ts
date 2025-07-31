import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Fungsi untuk mengelompokkan data penjualan per bulan
const getMonthlySalesData = (orders: any[]) => {
  const salesByMonth: { [key: string]: number } = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  orders.forEach(order => {
    const month = new Date(order.createdAt).getMonth(); 
    const monthName = monthNames[month];
    const totalItems = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    if (salesByMonth[monthName]) {
      salesByMonth[monthName] += totalItems;
    } else {
      salesByMonth[monthName] = totalItems;
    }
  });
  
  return monthNames.map(month => ({
    name: month,
    sales: salesByMonth[month] || 0,
  }));
};

// Fungsi BARU untuk mengelompokkan pelanggan baru per bulan
const getNewCustomersData = (users: any[]) => {
  const customersByMonth: { [key: string]: number } = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  // Hanya proses user yang dibuat pada tahun ini
  const currentYear = new Date().getFullYear();
  const usersThisYear = users.filter(user => new Date(user.createdAt).getFullYear() === currentYear);

  usersThisYear.forEach(user => {
    const month = new Date(user.createdAt).getMonth();
    const monthName = monthNames[month];
    if (customersByMonth[monthName]) {
      customersByMonth[monthName]++;
    } else {
      customersByMonth[monthName] = 1;
    }
  });

  return monthNames.map(month => ({
    name: month,
    customers: customersByMonth[month] || 0,
  }));
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ambil data dari database
    const [paidOrders, allCustomers, totalProducts, totalCustomerCount] = await Promise.all([
        prisma.order.findMany({
            where: { status: 'PAID' },
            include: { items: { include: { product: { select: { id: true, name: true } } } } }
        }),
        prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            orderBy: { createdAt: 'asc' }
        }),
        prisma.product.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } })
    ]);

    // Kalkulasi statistik dasar
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalSales = paidOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    // Siapkan data untuk grafik penjualan bulanan
    const salesChartData = getMonthlySalesData(paidOrders);

    // Hitung produk terlaris
    const productSales: { [key: string]: { name: string; sales: number } } = {};
    paidOrders.forEach(order => {
        order.items.forEach(item => {
            if(productSales[item.product.id]) {
                productSales[item.product.id].sales += item.quantity;
            } else {
                productSales[item.product.id] = { name: item.product.name, sales: item.quantity };
            }
        });
    });
    const bestSellingProducts = Object.values(productSales)
                                    .sort((a, b) => b.sales - a.sales)
                                    .slice(0, 5); // Ambil 5 teratas

    // Siapkan data untuk grafik pelanggan baru
    const newCustomersChartData = getNewCustomersData(allCustomers);

    // Kembalikan semua data dalam satu respons
    return NextResponse.json({
      totalRevenue,
      totalSales,
      totalCustomers: totalCustomerCount,
      totalProducts,
      salesChartData,
      bestSellingProducts,
      newCustomersChartData,
    });

  } catch (error) {
    console.error("Gagal mengambil data statistik dashboard:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
