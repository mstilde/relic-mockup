import { error, ok } from "@/lib/api";
import { getProduct, updateProduct } from "@/lib/services/products";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const product=getProduct(id);return product?ok(product):error("Product not found",404)}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;try{const body=await request.json();if(body.price!==undefined)body.price=Number(body.price);if(body.stock!==undefined)body.stock=Number(body.stock);const product=updateProduct(id,body);return product?ok(product):error("Product not found",404)}catch{return error("Invalid JSON body",422)}}
