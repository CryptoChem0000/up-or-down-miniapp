import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  // Only set minimal security headers, no frame blocking
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  
  return res;
}

export const config = { 
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
