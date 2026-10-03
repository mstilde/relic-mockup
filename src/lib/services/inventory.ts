import { movements, products } from "@/lib/demo-data";
import { getProduct } from "./products";

export function getInventory() { return products.map((product) => ({ ...product, availableStock: Math.max(0, product.stock - product.reservedStock), lowStock: product.stock - product.reservedStock <= 3 })); }
export function getProductInventory(productId: string) {
  const product = getProduct(productId);
  if (!product) return undefined;
  return { product, availableStock: Math.max(0, product.stock - product.reservedStock), movements: movements.filter((movement) => movement.productId === productId) };
}
export function getMovements() { return movements; }
