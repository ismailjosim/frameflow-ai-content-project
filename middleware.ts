import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/presets") ||
    pathname.startsWith("/settings");

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Only check session for routes that need protection or redirection
  if (isProtectedRoute || isAuthRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Unauthenticated user trying to access private dashboard routes
    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Already authenticated user visiting login or register → go to dashboard
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/presets/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
