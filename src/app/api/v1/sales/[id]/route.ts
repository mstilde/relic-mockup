import { error, ok } from "@/lib/api";
import { getSale } from "@/lib/services/sales";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const sale=getSale(id);return sale?ok(sale):error("Sale not found",404)}
