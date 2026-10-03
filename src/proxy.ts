import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const legacyPaths = ["/inventory", "/customers", "/sales", "/reservations"];
  if (legacyPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`))) {
    return NextResponse.redirect(new URL("/products", request.url));
  }
  const apiKey = process.env.API_KEY;
  if (!apiKey) return NextResponse.next();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (token !== apiKey) return NextResponse.json({ error: "Unauthorized", message: "Use Authorization: Bearer <API_KEY>" }, { status: 401 });
  return NextResponse.next();
}

export const config = { matcher: ["/api/v1/:path*", "/inventory/:path*", "/customers/:path*", "/sales/:path*", "/reservations/:path*"] };
