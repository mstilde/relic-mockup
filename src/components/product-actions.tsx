"use client";
import { FormEvent, useState } from "react";
import { Edit3, Plus, X } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductActions({ product, categories }: { product?: Product; categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const body = { ...values, price: Number(values.price), stock: Number(values.stock) };
    const response = await fetch(product ? `/api/v1/products/${product.id}` : "/api/v1/products", { method: product ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) { setMessage("Saved successfully"); setTimeout(() => window.location.reload(), 500); } else { const error = await response.json(); setMessage(error.error || "Could not save"); setSaving(false); }
  }
  return <>
    <button className={product ? "btn-secondary" : "btn-primary"} onClick={() => setOpen(true)}>{product ? <Edit3 size={15}/> : <Plus size={16}/>} {product ? "Edit product" : "Add product"}</button>
    {open && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5"><div><h2 className="font-serif text-2xl">{product ? "Edit product" : "Add a vintage piece"}</h2><p className="text-xs text-stone-500">Keep catalog information clear and searchable.</p></div><button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-stone-100"><X size={18}/></button></div><form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
      <Field label="Name" name="name" defaultValue={product?.name} required className="sm:col-span-2"/><Field label="SKU" name="sku" defaultValue={product?.sku} required/><Field label="Brand" name="brand" defaultValue={product?.brand} required/>
      <label><span className="label">Category</span><select className="input w-full" name="category" defaultValue={product?.category}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <Field label="Size" name="size" defaultValue={product?.size || "M"} required/><Field label="Color" name="color" defaultValue={product?.color} required/><Field label="Material" name="material" defaultValue={product?.material} required/>
      <Field label="Price (USD)" name="price" type="number" defaultValue={product?.price} required/><Field label="Stock" name="stock" type="number" defaultValue={product?.stock ?? 1} required/>
      <label className="sm:col-span-2"><span className="label">Description</span><textarea className="input h-24 w-full py-3" name="description" defaultValue={product?.description} required/></label>
      <div className="flex items-center justify-end gap-3 border-t pt-5 sm:col-span-2"><span className="mr-auto text-xs text-stone-500">{message}</span><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save product"}</button></div>
    </form></div></div>}
  </>;
}

function Field({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className={className}><span className="label">{label}</span><input className="input w-full" {...props}/></label>; }
