import { PrismaClient, PaymentMethod, ReservationStatus, SaleStatus, StockMovementType } from "@prisma/client";
import { categories, customers, movements, products, reservations, sales } from "../src/lib/demo-data";

const prisma = new PrismaClient();
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  console.log("Seeding RELIC demo data…");
  await prisma.$transaction([
    prisma.reservation.deleteMany(), prisma.stockMovement.deleteMany(), prisma.saleItem.deleteMany(),
    prisma.sale.deleteMany(), prisma.product.deleteMany(), prisma.category.deleteMany(), prisma.customer.deleteMany(),
  ]);

  for (const name of categories) await prisma.category.create({ data: { name, slug: slug(name) } });
  const dbCategories = await prisma.category.findMany();
  const categoryIds = new Map(dbCategories.map((category) => [category.name, category.id]));

  await prisma.product.createMany({ data: products.map((product) => ({
    id: product.id, sku: product.sku, name: product.name, description: product.description,
    brand: product.brand, size: product.size, color: product.color, material: product.material,
    price: product.price, stock: product.stock, reservedStock: product.reservedStock, image: product.image,
    categoryId: categoryIds.get(product.category)!, createdAt: new Date(product.createdAt), updatedAt: new Date(product.updatedAt),
  })) });
  await prisma.customer.createMany({ data: customers.map((customer) => ({ ...customer, createdAt: new Date(customer.createdAt), updatedAt: new Date(customer.createdAt) })) });

  for (const sale of sales) await prisma.sale.create({ data: {
    id: sale.id, number: sale.number, customerId: sale.customerId, subtotal: sale.subtotal, discount: sale.discount,
    total: sale.total, paymentMethod: sale.paymentMethod as PaymentMethod, status: sale.status as SaleStatus,
    createdAt: new Date(sale.createdAt), updatedAt: new Date(sale.createdAt),
    items: { create: sale.items.map((item) => ({ id: item.id, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, subtotal: item.subtotal })) },
  } });
  await prisma.stockMovement.createMany({ data: movements.map((movement) => ({ id: movement.id, productId: movement.productId, type: movement.type as StockMovementType, quantity: movement.quantity, reason: movement.reason, createdAt: new Date(movement.createdAt) })) });
  await prisma.reservation.createMany({ data: reservations.map((reservation) => ({ id: reservation.id, code: reservation.code, customerId: reservation.customerId, productId: reservation.productId, quantity: reservation.quantity, status: reservation.status as ReservationStatus, expiresAt: new Date(reservation.expiresAt), createdAt: new Date(reservation.createdAt), updatedAt: new Date(reservation.createdAt) })) });
  console.log(`Seed complete: ${products.length} products, ${customers.length} customers, ${sales.length} sales, ${reservations.length} reservations.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
