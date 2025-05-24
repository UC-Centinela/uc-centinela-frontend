"use server";

import { config } from "@/middleware";
import { cookies } from "next/headers";

export async function handleLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", "", {
      ...config,
      maxAge: -1,
    });
    cookieStore.set("userEmail", "", {
      ...config,
      maxAge: -1,
    });
    cookieStore.set("userRole", "", {
      ...config,
      maxAge: -1,
    });

    return true;
  } catch (error) {
    console.error("Error durante el logout:", error);
    return false;
  }
}
