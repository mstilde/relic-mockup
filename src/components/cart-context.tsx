"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

export type CartItem = { product: Product; quantity: number };
type CartContextValue = {
  items: CartItem[]; count: number; subtotal: number; open: boolean;
  setOpen: (open: boolean) => void; add: (product: Product) => void;
  remove: (productId: string) => void; change: (productId: string, quantity: number) => void; clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("relic-cart"); if (saved) setItems(JSON.parse(saved)); } finally { setLoaded(true); } }, []);
  useEffect(() => { if (loaded) localStorage.setItem("relic-cart", JSON.stringify(items)); }, [items, loaded]);
  const value = useMemo<CartContextValue>(() => ({
    items, open, setOpen,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    add(product) { setItems(current => { const found = current.find(item => item.product.id === product.id); return found ? current.map(item => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock - product.reservedStock) } : item) : [{ product, quantity: 1 }, ...current]; }); setOpen(true); },
    remove(productId) { setItems(current => current.filter(item => item.product.id !== productId)); },
    change(productId, quantity) { setItems(current => current.map(item => item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock - item.product.reservedStock)) } : item)); },
    clear() { setItems([]); },
  }), [items, open, loaded]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }
