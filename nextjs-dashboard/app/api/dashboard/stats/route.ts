import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Ambil semua order yang sudah lunas (PAID)
    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' },
      include: {
        items: true,
      }
    });

    // 2. Hitung total pendapatan
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 3. Hitung total produk terjual
    const totalSales = paidOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    // 4. Hitung jumlah pelanggan (semua user dengan role CUSTOMER)
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    // 5. Hitung total produk yang ada
    const totalProducts = await prisma.product.count();

    // 6. Siapkan data untuk grafik penjualan
    const salesChartData = getMonthlySalesData(paidOrders);

    return NextResponse.json({
      totalRevenue,
      totalSales,
      totalCustomers,
      totalProducts,
      salesChartData,
    });

  } catch (error) {
    console.error("Gagal mengambil data statistik dashboard:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}