import { customers, movements, products, reservations, sales } from "@/lib/demo-data";

export function getDashboard() {
  const current = new Date();
  const dayKey = current.toISOString().slice(0, 10);
  const monthKey = current.toISOString().slice(0, 7);
  const completed = sales.filter((sale) => sale.status === "completed");
  const today = completed.filter((sale) => sale.createdAt.startsWith(dayKey));
  const month = completed.filter((sale) => sale.createdAt.startsWith(monthKey));
  const salesByDay = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(current.getTime() - (13 - index) * 86_400_000);
    const key = date.toISOString().slice(0, 10);
    return { date: date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }), value: completed.filter((sale) => sale.createdAt.startsWith(key)).reduce((sum, sale) => sum + sale.total, 0) };
  });
  return {
    todaySales: today.reduce((sum, sale) => sum + sale.total, 0), todayOrders: today.length,
    monthSales: month.reduce((sum, sale) => sum + sale.total, 0),
    productCount: products.length, customerCount: customers.length,
    lowStock: products.filter((product) => product.stock - product.reservedStock <= 3),
    latestSales: sales.slice(0, 6), latestMovements: movements.slice(0, 5),
    pendingReservations: reservations.filter((reservation) => reservation.status === "pending").length,
    salesByDay,
  };
}
