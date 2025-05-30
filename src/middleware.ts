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
  
  // Restrict access based on user role
  const userRole = user?.data?.getUserByEmail?.role;
  
  // Prevent administrators from accessing /tasks routes
  if (userRole === "roleAdmin" && currentPath.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  
  // Prevent operators from accessing /supervisor routes
  if (userRole === "roleOperator" && currentPath.startsWith("/supervisor")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (currentPath === "/") {
    if (userRole === "roleOperator") {
      return NextResponse.redirect(new URL("/tasks", request.url));
    }
    if (userRole === "roleAdmin") {
      return NextResponse.redirect(new URL("/supervisor", request.url));
    }
  }

  if (currentPath === "/menu") {
    if (userRole === "roleAdmin") {
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
