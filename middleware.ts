import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'self' https://warpcast.com https://*.warpcast.com",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  // Remove X-Frame-Options to allow Warpcast embedding
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  return res;
}

export const config = { 
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
