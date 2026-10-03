import { error, ok } from "@/lib/api";
import { cancelReservation, getReservation } from "@/lib/services/reservations";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const reservation=getReservation(id);return reservation?ok(reservation):error("Reservation not found",404)}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const reservation=cancelReservation(id);return reservation?ok(reservation):error("Reservation not found",404)}
