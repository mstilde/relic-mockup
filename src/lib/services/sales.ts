import { sales } from "@/lib/demo-data";

export type SalesFilters = { customer?: string; date?: string; status?: string };
export function getSales(filters: SalesFilters = {}) {
  return sales.filter((sale) => {
    const customerMatch = !filters.customer || sale.customerName.toLowerCase().includes(filters.customer.toLowerCase()) || sale.customerId === filters.customer;
    const dateMatch = !filters.date || sale.createdAt.startsWith(filters.date);
    const statusMatch = !filters.status || sale.status === filters.status;
    return customerMatch && dateMatch && statusMatch;
  });
}
export function getSale(id: string) { return sales.find((sale) => sale.id === id); }
