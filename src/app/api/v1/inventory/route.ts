import { collection } from "@/lib/api";
import { getInventory } from "@/lib/services/inventory";
export async function GET(request:Request){const u=new URL(request.url);let inventory=getInventory();if(u.searchParams.get("lowStock")==="true")inventory=inventory.filter(p=>p.lowStock);return collection(inventory,{page:Number(u.searchParams.get("page"))||1,limit:Number(u.searchParams.get("limit"))||50})}
