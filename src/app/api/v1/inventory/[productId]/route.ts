import { error, ok } from "@/lib/api";
import { getProductInventory } from "@/lib/services/inventory";
export async function GET(_:Request,{params}:{params:Promise<{productId:string}>}){const {productId}=await params;const inventory=getProductInventory(productId);return inventory?ok(inventory):error("Product not found",404)}
