"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, CalendarClock, ChevronDown, CircleHelp, LayoutDashboard, Menu, PackageSearch, Search, ShoppingBag, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: PackageSearch },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/sales", label: "Sales", icon: BarChart3 },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/reservations", label: "Reservations", icon: CalendarClock },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const title = nav.find((item) => item.href === "/" ? path === "/" : path.startsWith(item.href))?.label ?? "RELIC";
  return (
    <div className="min-h-screen bg-paper">
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-white transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-7">
          <Link href="/" onClick={() => setOpen(false)}>
            <div className="font-serif text-2xl tracking-[.22em]">RELIC</div>
            <div className="mt-0.5 text-[9px] uppercase tracking-[.3em] text-stone-400">Vintage clothing</div>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X size={20} /></button>
        </div>
        <nav className="flex-1 space-y-1 p-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-stone-500">Operations</p>
          {nav.map((item) => {
            const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition", active ? "bg-white text-ink shadow-lg" : "text-stone-400 hover:bg-white/5 hover:text-white")}>
                <item.icon size={18} strokeWidth={active ? 2.4 : 1.8} />{item.label}
                {item.label === "Reservations" && <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold", active ? "bg-rust text-white" : "bg-rust/20 text-orange-300")}>7</span>}
              </Link>
            );
          })}
        </nav>
        <div className="m-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold"><CircleHelp size={15} /> API sandbox</div>
          <p className="mt-2 text-[11px] leading-relaxed text-stone-400">Voice agent endpoints are ready at <span className="text-stone-200">/api/v1</span></p>
        </div>
        <div className="border-t border-white/10 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-moss text-xs font-bold">MR</div>
            <div><div className="text-xs font-semibold">Mora Reyes</div><div className="text-[10px] text-stone-500">Store manager</div></div>
            <ChevronDown className="ml-auto text-stone-500" size={14} />
          </button>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú" />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-stone-200/80 bg-paper/90 px-5 backdrop-blur-xl md:px-8">
          <button className="text-stone-600 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[.2em] text-stone-400">Store operations</div>
            <div className="mt-0.5 text-sm font-semibold">{title}</div>
          </div>
          <div className="ml-auto hidden h-10 w-72 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-400 shadow-sm md:flex">
            <Search size={16} /><span>Search anything…</span><kbd className="ml-auto rounded border bg-stone-50 px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
          </div>
          <button className="relative rounded-lg border border-stone-200 bg-white p-2.5"><ShoppingBag size={17} /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-rust" /></button>
        </header>
        <main className="p-5 md:p-8 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
