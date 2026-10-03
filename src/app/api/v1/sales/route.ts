import { collection } from "@/lib/api";
import { getSales } from "@/lib/services/sales";
export async function GET(request:Request){const u=new URL(request.url),p=u.searchParams;return collection(getSales({customer:p.get("customer")||undefined,date:p.get("date")||undefined,status:p.get("status")||undefined}),{page:Number(p.get("page"))||1,limit:Number(p.get("limit"))||50})}
