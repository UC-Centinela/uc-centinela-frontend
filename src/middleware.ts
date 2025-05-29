import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserProfile } from "./services/users";
import { handleUserSession } from "./utils/functions";

export async function middleware(request: NextRequest) {
  const response = await handleUserSession(request);

  const user = await getUserProfile();

  const currentPath = request.nextUrl.pathname;

  const publicPaths = ["/", "/unauthorized", "/auth/login"];

  if (!user && !publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  
  if (currentPath === "/") {
    if (user?.data?.getUserByEmail?.role === "roleOperator") {
      return NextResponse.redirect(new URL("/tasks", request.url));
    }
    if (user?.data?.getUserByEmail?.role === "roleAdmin") {
      return NextResponse.redirect(new URL("/supervisor", request.url));
    }
  }

  if (currentPath === "/menu") {
    if (user?.data?.getUserByEmail?.role === "roleAdmin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
