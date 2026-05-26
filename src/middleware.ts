import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "supersecretkey123" });
  const { pathname } = req.nextUrl;

  // Protect Admin Pages and Admin APIs
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token || token.role !== "ADMIN") {
      // For APIs, return a 403 JSON response
      if (pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ message: "Forbidden: Admins only" }),
          { status: 403, headers: { "content-type": "application/json" } }
        );
      }
      // For pages, redirect to dashboard or login
      return NextResponse.redirect(new URL(token ? "/dashboard" : "/login", req.url));
    }
  }

  // Protect general user routes (dashboard, exam, result, and evaluation APIs)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/exam") ||
    pathname.startsWith("/result") ||
    pathname.startsWith("/api/exam")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/exam/:path*",
    "/result/:path*",
    "/api/exam/:path*"
  ],
};
