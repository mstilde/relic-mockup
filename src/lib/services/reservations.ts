import { movements, reservations } from "@/lib/demo-data";
import type { Reservation } from "@/lib/types";
import { customers } from "@/lib/demo-data";
import { getProduct } from "./products";

export function getReservations(status?: string) { return reservations.filter((reservation) => !status || reservation.status === status); }
export function getReservation(id: string) { return reservations.find((reservation) => reservation.id === id); }

export function createReservation(input: { customerId: string; productId: string; quantity: number; expiresAt?: string }) {
  const product = getProduct(input.productId);
  const customer = customers.find((item) => item.id === input.customerId);
  if (!product) throw new Error("Producto no encontrado");
  if (!customer) throw new Error("Cliente no encontrado");
  const quantity = Number(input.quantity || 1);
  if (quantity < 1 || product.stock - product.reservedStock < quantity) throw new Error("Stock disponible insuficiente");
  const timestamp = new Date();
  const reservation: Reservation = {
    id: `res_${Date.now()}`, code: `RSV-${String(Date.now()).slice(-5)}`,
    customerId: customer.id, customerName: customer.name, productId: product.id, productName: product.name,
    quantity, status: "pending", createdAt: timestamp.toISOString(),
    expiresAt: input.expiresAt || new Date(timestamp.getTime() + 2 * 86_400_000).toISOString(),
  };
  product.reservedStock += quantity;
  reservations.unshift(reservation);
  movements.unshift({ id: `mov_${Date.now()}`, productId: product.id, productName: product.name, type: "reservation", quantity: -quantity, reason: `Reserva ${reservation.code}`, createdAt: timestamp.toISOString() });
  return reservation;
}

export function cancelReservation(id: string) {
  const reservation = getReservation(id);
  if (!reservation) return undefined;
  if (reservation.status === "pending" || reservation.status === "confirmed") {
    const product = getProduct(reservation.productId);
    if (product) product.reservedStock = Math.max(0, product.reservedStock - reservation.quantity);
    reservation.status = "cancelled";
    movements.unshift({ id: `mov_${Date.now()}`, productId: reservation.productId, productName: reservation.productName, type: "release", quantity: reservation.quantity, reason: `Cancelación ${reservation.code}`, createdAt: new Date().toISOString() });
  }
  return reservation;
}
