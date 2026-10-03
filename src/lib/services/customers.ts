import { customers, sales } from "@/lib/demo-data";

export function getCustomers(q?: string) {
  const term = q?.trim().toLowerCase();
  return customers.map((customer) => {
    const purchases = sales.filter((sale) => sale.customerId === customer.id && sale.status === "completed");
    return { ...customer, purchaseCount: purchases.length, totalSpent: purchases.reduce((sum, sale) => sum + sale.total, 0), lastPurchase: purchases[0]?.createdAt ?? null };
  }).filter((customer) => !term || `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(term));
}

export function getCustomer(id: string) {
  const customer = customers.find((item) => item.id === id);
  if (!customer) return undefined;
  const purchases = sales.filter((sale) => sale.customerId === customer.id);
  return { ...customer, purchases, purchaseCount: purchases.length, totalSpent: purchases.filter((sale) => sale.status === "completed").reduce((sum, sale) => sum + sale.total, 0), lastPurchase: purchases[0]?.createdAt ?? null };
}

export function getCustomerPurchases(id: string) { return sales.filter((sale) => sale.customerId === id); }
