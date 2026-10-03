import { error, ok } from "@/lib/api";
import { getCustomer } from "@/lib/services/customers";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const customer=getCustomer(id);return customer?ok(customer):error("Customer not found",404)}
