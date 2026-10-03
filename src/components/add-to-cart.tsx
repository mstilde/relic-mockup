"use client";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-context";

export function AddToCart({product,className=""}:{product:Product;className?:string}){const cart=useCart();const available=product.stock-product.reservedStock;return <button disabled={available<=0} onClick={()=>cart.add(product)} className={`store-button ${className}`}><ShoppingBag size={15}/>{available>0?"Agregar al carrito":"Agotado"}</button>}
