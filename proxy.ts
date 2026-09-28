import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge-compatible middleware.
 *
 * We cannot import `lib/auth.ts` here because it uses `mongodbAdapter`
 * (Node.js API), which is not available in the Edge Runtime.
 *
 * Instead we call the `/api/auth/get-session` endpoint — which runs in
 * the regular Node.js route handler — forwarding the request cookies so
 * better-auth can validate the session token (works for both email/password
 * AND Google OAuth sessions).
 */

async function getSession(request: NextRequest) {
  try {
    const res = await fetch(
      new URL("/api/auth/get-session", request.nextUrl.origin),
      {
        headers: {
          // Forward cookies so the session token is included
          cookie: request.headers.get("cookie") ?? "",
        },
        // Tell the runtime not to cache this
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/presets") ||
    pathname.startsWith("/settings");

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Only hit the session endpoint when protection or auth redirect is needed
  if (isProtectedRoute || isAuthRoute) {
    const session = await getSession(request);

    // No session → redirect to login
    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Already logged in → skip login/register
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
