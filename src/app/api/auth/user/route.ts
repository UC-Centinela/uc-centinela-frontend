import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const accessToken = searchParams.get("accessToken");

    if (!email || !accessToken) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await getUserProfile(email, accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
