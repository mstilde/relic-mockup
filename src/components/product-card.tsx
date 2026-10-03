"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/utils";
import { useCart } from "./cart-context";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [liked, setLiked] = useState(false);
  const cart = useCart();
  const available = product.stock - product.reservedStock;

  return <article className="group">
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#efede8]">
      <Link href={`/products/${product.id}`}><Image src={product.image} alt={product.name} fill priority={priority} className="object-cover transition duration-500 group-hover:scale-[1.025]"/></Link>
      <button onClick={() => setLiked(!liked)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm" aria-label="Guardar prenda"><Heart size={16} fill={liked ? "#111" : "none"}/></button>
      {available > 0 && <button onClick={() => cart.add(product)} className="absolute bottom-3 left-3 right-3 flex h-11 translate-y-16 items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold text-black shadow-lg transition duration-300 group-hover:translate-y-0"><Plus size={14}/>Agregar rápido · Talle {product.size}</button>}
      {available === 0 && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold">Agotado</span>}
    </div>
    <div className="pt-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-[11px] text-stone-500">{product.brand} · Talle {product.size}</div><Link href={`/products/${product.id}`} className="mt-1 block truncate text-sm font-semibold">{product.name}</Link></div><div className="shrink-0 text-sm font-semibold">{money(product.price)}</div></div></div>
  </article>;
}
