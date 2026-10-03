import { ok } from "@/lib/api";
export async function GET(){return ok({name:"RELIC Store API",version:"1.0.0",mode:process.env.DEMO_MODE!=="false"?"demo":"database",resources:{products:"/api/v1/products",productSearch:"/api/v1/products/search?q=leather&size=M&inStock=true",customers:"/api/v1/customers",sales:"/api/v1/sales",inventory:"/api/v1/inventory",reservations:"/api/v1/reservations"}})}
