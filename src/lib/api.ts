import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) { return NextResponse.json({ data }, init); }
export function collection<T>(data: T[], query?: { page?: number; limit?: number }) {
  const page = Math.max(1, query?.page || 1); const limit = Math.min(100, Math.max(1, query?.limit || 50)); const start = (page - 1) * limit;
  return NextResponse.json({ data: data.slice(start, start + limit), meta: { total: data.length, page, limit, pages: Math.ceil(data.length / limit) } });
}
export function error(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
