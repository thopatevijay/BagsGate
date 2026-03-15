import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/content",
  "/gates",
  "/earnings",
  "/analytics",
  "/settings",
  "/team",
  "/feed",
  "/portfolio",
  "/notifications",
];

const PUBLIC_ROUTES = ["/", "/login", "/onboard", "/explore"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/api/")
  );

  if (!isProtected || isPublic) {
    return NextResponse.next();
  }

  const privyToken = request.cookies.get("privy-token");

  if (!privyToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
