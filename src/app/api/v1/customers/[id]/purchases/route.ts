import { collection } from "@/lib/api";
import { getCustomerPurchases } from "@/lib/services/customers";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return collection(getCustomerPurchases(id))}
