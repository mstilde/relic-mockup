import { z } from "zod";
import { collection, error, ok } from "@/lib/api";
import { createProduct, getProducts } from "@/lib/services/products";

const schema = z.object({ sku:z.string().min(2), name:z.string().min(2), description:z.string().min(5), category:z.string().min(2), brand:z.string().min(1), size:z.string().min(1), color:z.string().min(1), material:z.string().min(1), price:z.coerce.number().positive(), stock:z.coerce.number().int().nonnegative(), image:z.string().optional() });
export async function GET(request:Request){const url=new URL(request.url);return collection(getProducts(),{page:Number(url.searchParams.get("page"))||1,limit:Number(url.searchParams.get("limit"))||50})}
export async function POST(request:Request){try{const body=schema.parse(await request.json());return ok(createProduct(body),{status:201})}catch(e){return error(e instanceof Error?e.message:"Invalid request",422)}}
