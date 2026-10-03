import { collection } from "@/lib/api";
import { getCustomers } from "@/lib/services/customers";
export async function GET(request:Request){const u=new URL(request.url);return collection(getCustomers(u.searchParams.get("q")||undefined),{page:Number(u.searchParams.get("page"))||1,limit:Number(u.searchParams.get("limit"))||50})}
