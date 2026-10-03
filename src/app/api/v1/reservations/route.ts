import { z } from "zod";
import { collection, error, ok } from "@/lib/api";
import { createReservation, getReservations } from "@/lib/services/reservations";
const schema=z.object({customerId:z.string().min(1),productId:z.string().min(1),quantity:z.coerce.number().int().positive().default(1),expiresAt:z.string().datetime().optional()});
export async function GET(request:Request){const u=new URL(request.url);return collection(getReservations(u.searchParams.get("status")||undefined),{page:Number(u.searchParams.get("page"))||1,limit:Number(u.searchParams.get("limit"))||50})}
export async function POST(request:Request){try{return ok(createReservation(schema.parse(await request.json())),{status:201})}catch(e){return error(e instanceof Error?e.message:"Invalid request",422)}}
