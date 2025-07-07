import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { cookies } from "next/headers";

export async function handleUserSession(request: NextRequest) {
  const response = await auth0.middleware(request);
  const session = await auth0.getSession(request);

  if (session?.user?.name) {
    try {
      const accessToken = session.tokenSet?.accessToken;
      if (accessToken) {
        const newResponse = NextResponse.next();
        const emailToStore = session.user.name;

        const cookieStore = await cookies();
        cookieStore.set("userEmail", emailToStore, {
          path: "/",
          domain: "uc-centinela-frontend.vercel.app",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        cookieStore.set("accessToken", accessToken, {
          path: "/",
          domain: "uc-centinela-frontend.vercel.app",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return newResponse;
      }
    } catch (error) {
      console.error("Error in handleUserSession:", error);
    }
  }

  return response;
}
