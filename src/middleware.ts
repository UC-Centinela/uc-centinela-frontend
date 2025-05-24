import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserProfile } from "./lib/auth";
import { handleUserSession } from "./utils/functions";

export async function middleware(request: NextRequest) {
  const response = await handleUserSession(request);

  const emailInCookie = request.cookies.get("userEmail");
  const accessTokenInCookie = request.cookies.get("accessToken");

  // const publicPaths = ["/", "/signin", "/unauthorized", "/auth/login"]; // agrega aquí las rutas públicas

  // if (!accessTokenInCookie && !publicPaths.includes(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  if (emailInCookie && accessTokenInCookie) {
    const userData = await getUserProfile(
      emailInCookie.value,
      accessTokenInCookie.value
    );

    const currentPath = request.nextUrl.pathname;

    if (currentPath === "/menu") {
      if (userData.data?.getUserByEmail?.role === "roleAdmin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (currentPath === "/" || currentPath === "/signin") {
      if (userData.data?.getUserByEmail?.role === "roleAdmin") {
        return NextResponse.redirect(new URL("/tasks", request.url));
      } else {
        return NextResponse.redirect(new URL("/tasks", request.url));
      }
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
