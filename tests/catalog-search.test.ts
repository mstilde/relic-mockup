import assert from "node:assert/strict";
import test from "node:test";
import { searchProducts } from "@/lib/services/products";

test("la búsqueda combina categoría, talle, color y disponibilidad", () => {
  const products = searchProducts({ category: "Jackets", size: "M", color: "black", inStock: true });

  assert.ok(products.length > 0);
  assert.ok(products.every((product) =>
    product.category === "Jackets"
    && product.size === "M"
    && product.color.includes("black")
    && product.stock - product.reservedStock > 0,
  ));
});

test("la búsqueda por texto encuentra una prenda y nunca devuelve agotados cuando se pide stock", () => {
  const products = searchProducts({ q: "leather", inStock: true });

  assert.ok(products.some((product) => product.name === "Wilson Leather Jacket"));
  assert.ok(products.every((product) => product.stock - product.reservedStock > 0));
});

test("un filtro sin coincidencias devuelve una colección vacía", () => {
  assert.deepEqual(searchProducts({ q: "prenda-inexistente" }), []);
});
