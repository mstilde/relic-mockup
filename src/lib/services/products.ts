import { brands, categories, products } from "@/lib/demo-data";
import type { Product } from "@/lib/types";

export type ProductFilters = {
  q?: string; category?: string; brand?: string; size?: string; color?: string;
  minPrice?: number; maxPrice?: number; inStock?: boolean;
};

export function searchProducts(filters: ProductFilters = {}) {
  const q = filters.q?.trim().toLowerCase();
  return products.filter((product) => {
    const haystack = `${product.name} ${product.description} ${product.sku} ${product.brand} ${product.color}`.toLowerCase();
    return (!q || haystack.includes(q))
      && (!filters.category || product.category.toLowerCase() === filters.category.toLowerCase())
      && (!filters.brand || product.brand.toLowerCase() === filters.brand.toLowerCase())
      && (!filters.size || product.size.toLowerCase() === filters.size.toLowerCase())
      && (!filters.color || product.color.toLowerCase().includes(filters.color.toLowerCase()))
      && (filters.minPrice === undefined || product.price >= filters.minPrice)
      && (filters.maxPrice === undefined || product.price <= filters.maxPrice)
      && (filters.inStock !== true || product.stock - product.reservedStock > 0);
  });
}

export function getProducts() { return products; }
export function getProduct(id: string) { return products.find((product) => product.id === id); }
export function getProductOptions() { return { categories, brands, sizes: ["XS", "S", "M", "L", "XL"] }; }

export function createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt" | "reservedStock" | "image"> & { image?: string }) {
  const timestamp = new Date().toISOString();
  const product: Product = { ...input, id: `prd_${Date.now()}`, reservedStock: 0, image: input.image || `/products/${input.category.toLowerCase()}.svg`, createdAt: timestamp, updatedAt: timestamp };
  products.unshift(product);
  return product;
}

export function updateProduct(id: string, input: Partial<Product>) {
  const product = getProduct(id);
  if (!product) return undefined;
  Object.assign(product, input, { id, updatedAt: new Date().toISOString() });
  return product;
}
