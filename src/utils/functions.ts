import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function handleUserSession(request: NextRequest) {
  const response = await auth0.middleware(request);
  const session = await auth0.getSession(request);

  if (session?.user?.email) {
    try {
      const accessToken = session.tokenSet?.accessToken;
      if (accessToken) {
        const url = new URL(`${request.nextUrl.origin}/api/auth/user`);
        url.searchParams.set("email", session.user.email);
        url.searchParams.set("accessToken", accessToken);

        const userResponse = await fetch(url.toString());

        if (userResponse.ok) {
          const result = await userResponse.json();

          if (result.data?.getUserByEmail?.role) {
            const newResponse = NextResponse.next();

            const emailToStore = session.user.email;

            newResponse.cookies.set("userEmail", emailToStore, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });

            newResponse.cookies.set(
              "userRole",
              result.data.getUserByEmail.role,
              {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              }
            );

            newResponse.cookies.set("accessToken", accessToken, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });

            return newResponse;
          }
        }
      }
    } catch (error) {
      console.error("Error in handleUserSession:", error);
    }
  }

  return response;
}
