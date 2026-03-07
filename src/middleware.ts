import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Public routes - allow access without authentication
const PUBLIC_ROUTES = ["/", "/login", "/register"];

// Protected routes - require authentication
const PROTECTED_ROUTES = ["/student", "/admin", "/parent", "/teacher"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes - allow access
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route),
    )
  ) {
    return NextResponse.next();
  }

  // Protected routes - must be authenticated
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!req.auth?.user) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
