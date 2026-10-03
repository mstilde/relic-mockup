"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Instagram, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { CartProvider, useCart } from "./cart-context";
import { colorLabel, money } from "@/lib/utils";

const navigation = [
  ["Inicio", "/"], ["Tienda", "/products"], ["Novedades", "/products?sort=new"],
  ["Camperas", "/products?category=Jackets"], ["Denim", "/products?category=Jeans"],
  ["Editorial", "/story"], ["Nuestra historia", "/story"],
];

export function StoreShell({ children }: { children: React.ReactNode }) {
  return <CartProvider><StoreFrame>{children}</StoreFrame></CartProvider>;
}

function StoreFrame({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false); const cart = useCart();
  return <div className="min-h-screen bg-white text-[#111]">
    <div className="flex min-h-9 items-center justify-center bg-black px-3 py-2 text-center text-[10px] font-semibold leading-tight text-white sm:text-[11px]">Envío gratis en Argentina en compras superiores a US$180</div>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[70px] max-w-[1300px] items-center justify-between px-5 md:px-8">
        <div className="hidden items-center gap-5 text-xs md:flex"><button className="flex items-center gap-1">🇦🇷 Español <ChevronDown size={12}/></button><button className="flex items-center gap-1">USD $ <ChevronDown size={12}/></button></div>
        <button className="flex h-11 w-11 items-center justify-center md:hidden" onClick={()=>setMenu(true)} aria-label="Abrir menú"><Menu size={22}/></button>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-extrabold tracking-[.08em] sm:text-[27px]">RELIC</Link>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3"><Link href="/products" className="flex h-11 w-11 items-center justify-center" aria-label="Buscar"><Search size={20} strokeWidth={1.5}/></Link><button className="hidden h-11 w-11 items-center justify-center sm:flex" aria-label="Cuenta"><UserRound size={20} strokeWidth={1.5}/></button><button className="hidden h-11 w-11 items-center justify-center sm:flex" aria-label="Favoritos"><Heart size={20} strokeWidth={1.5}/></button><button onClick={()=>cart.setOpen(true)} className="relative flex h-11 w-11 items-center justify-center" aria-label="Abrir carrito"><ShoppingBag size={21} strokeWidth={1.5}/>{cart.count>0&&<span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">{cart.count}</span>}</button></div>
      </div>
      <nav className="hidden h-[54px] items-center justify-center gap-10 border-y border-stone-200 text-sm font-medium lg:flex">{navigation.map(([label,href])=><Link key={`${label}-${href}`} href={href} className="transition hover:opacity-50">{label}</Link>)}</nav>
    </header>
    {menu&&<div className="fixed inset-0 z-[80] overflow-y-auto bg-white"><div className="flex h-20 items-center justify-between border-b px-5"><span className="text-2xl font-extrabold tracking-[.08em]">RELIC</span><button className="flex h-11 w-11 items-center justify-center" onClick={()=>setMenu(false)} aria-label="Cerrar menú"><X/></button></div><nav aria-label="Navegación móvil" className="flex flex-col px-6 pb-24">{navigation.map(([label,href])=><Link key={`${label}-${href}`} href={href} onClick={()=>setMenu(false)} className="border-b py-4 text-2xl font-semibold">{label}</Link>)}</nav><div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-5 text-xs text-stone-500">Buenos Aires · Desde 2026</div></div>}
    <main>{children}</main>
    <footer className="bg-[#111] px-6 py-14 text-white md:px-10 md:py-20"><div className="mx-auto max-w-[1300px]"><div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><div className="text-3xl font-extrabold tracking-[.08em]">RELIC</div><p className="mt-5 max-w-xs text-sm leading-6 text-stone-400">Prendas vintage únicas, seleccionadas en Buenos Aires y listas para su próximo capítulo.</p></div><FooterLinks title="Tienda" links={navigation.slice(1,5)}/><FooterLinks title="Ayuda" links={[["Envíos y devoluciones","/story#shipping"],["Guía de talles","/story#sizing"],["Contacto","mailto:hello@relic.example"]]}/><div><div className="text-xs font-semibold">Sumate a la lista RELIC</div><p className="mt-4 text-xs leading-5 text-stone-400">Nuevos ingresos, notas de estudio y cero spam.</p><div className="mt-5 flex border-b border-white/30 pb-2"><input className="w-full bg-transparent text-xs outline-none placeholder:text-stone-600" placeholder="Tu email"/><button aria-label="Suscribirme">→</button></div></div></div><div className="flex flex-col justify-between gap-4 pt-6 text-[10px] text-stone-500 sm:flex-row"><span>© 2026 RELIC Vintage</span><span className="flex items-center gap-2"><Instagram size={13}/> Buenos Aires, Argentina</span><span>Cada prenda tiene una historia.</span></div></div></footer>
    <CartDrawer/>
  </div>;
}

function FooterLinks({title,links}:{title:string;links:string[][]}) { return <div><div className="text-xs font-semibold">{title}</div><div className="mt-4 space-y-3">{links.map(([label,href])=><Link key={href} href={href} className="block text-xs text-stone-400 hover:text-white">{label}</Link>)}</div></div>; }

function CartDrawer() {
  const cart=useCart();
  return <>{cart.open&&<button className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={()=>cart.setOpen(false)} aria-label="Cerrar carrito"/>}<aside aria-label="Carrito" aria-hidden={!cart.open} className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col overflow-x-hidden bg-white transition-transform duration-300 ${cart.open?"visible translate-x-0":"invisible translate-x-full"}`}><div className="flex h-20 items-center justify-between border-b px-5 sm:px-6"><div><span className="text-2xl font-semibold">Tu carrito</span><span className="ml-2 text-xs text-stone-400">({cart.count})</span></div><button className="flex h-11 w-11 items-center justify-center" onClick={()=>cart.setOpen(false)} aria-label="Cerrar carrito"><X size={21}/></button></div>{cart.items.length===0?<div className="flex flex-1 flex-col items-center justify-center px-6 text-center sm:px-8"><ShoppingBag size={34} strokeWidth={1} className="text-stone-400"/><h2 className="mt-5 text-2xl font-semibold">Tu carrito está vacío</h2><p className="mt-2 text-sm text-stone-500">Las piezas únicas no suelen esperar.</p><Link href="/products" onClick={()=>cart.setOpen(false)} className="store-button mt-7">Seguir comprando</Link></div>:<><div className="flex-1 overflow-y-auto">{cart.items.map(({product,quantity})=><div key={product.id} className="flex gap-3 border-b p-4 sm:gap-4 sm:p-5"><div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100"><Image src={product.image} alt={product.name} fill className="object-cover"/></div><div className="flex min-w-0 flex-1 flex-col"><div className="text-[10px] text-stone-400">{product.brand}</div><Link href={`/products/${product.id}`} onClick={()=>cart.setOpen(false)} className="mt-1 text-sm font-semibold leading-tight">{product.name}</Link><div className="mt-1 text-xs text-stone-500">Talle {product.size} · {colorLabel(product.color)}</div><div className="mt-auto flex items-end justify-between"><div className="flex items-center rounded-full border"><button onClick={()=>cart.change(product.id,quantity-1)} className="h-9 w-9" aria-label="Restar una unidad">−</button><span className="w-7 text-center text-xs">{quantity}</span><button onClick={()=>cart.change(product.id,quantity+1)} className="h-9 w-9" aria-label="Sumar una unidad">+</button></div><div className="text-sm font-semibold">{money(product.price*quantity)}</div></div><button onClick={()=>cart.remove(product.id)} className="mt-2 min-h-9 self-start text-[10px] text-stone-400 underline">Eliminar</button></div></div>)}</div><div className="border-t bg-white p-5 sm:p-6"><div className="flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{money(cart.subtotal)}</span></div><p className="mt-2 text-xs text-stone-500">Envío e impuestos calculados al finalizar la compra.</p><Link href="/checkout" onClick={()=>cart.setOpen(false)} className="store-button mt-5 w-full">Finalizar compra</Link><button onClick={()=>cart.setOpen(false)} className="mt-3 min-h-11 w-full text-center text-xs underline">Seguir comprando</button></div></>}</aside></>;
}
