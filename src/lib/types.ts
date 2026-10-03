export type Product = {
  id: string; sku: string; name: string; description: string; category: string;
  brand: string; size: string; color: string; material: string; price: number;
  stock: number; reservedStock: number; image: string; createdAt: string; updatedAt: string;
};

export type Customer = {
  id: string; name: string; phone: string; email: string; createdAt: string;
};

export type SaleItem = { id: string; productId: string; productName: string; quantity: number; unitPrice: number; subtotal: number };

export type Sale = {
  id: string; number: string; customerId: string; customerName: string; items: SaleItem[];
  subtotal: number; discount: number; total: number; paymentMethod: "cash" | "transfer" | "card";
  status: "completed" | "refunded" | "pending"; createdAt: string;
};

export type StockMovement = {
  id: string; productId: string; productName: string; type: "purchase" | "sale" | "adjustment" | "reservation" | "release";
  quantity: number; reason: string; createdAt: string;
};

export type Reservation = {
  id: string; code: string; customerId: string; customerName: string; productId: string; productName: string;
  quantity: number; status: "pending" | "confirmed" | "cancelled" | "expired"; expiresAt: string; createdAt: string;
};
