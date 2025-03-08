import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const authHandler = NextAuth(authOptions);

// ✅ Wrapper for error logging
export async function GET(req: NextRequest) {
  try {
    return authHandler(req);
  } catch (error) {
    console.error("[NextAuth GET Error]:", error);

    // Log error to your backend API (or email service)
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/log-auth-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: (error as Error).message, route: "/api/auth" }),
    });

    return NextResponse.json({ error: "Authentication error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return authHandler(req);
  } catch (error) {
    console.error("[NextAuth POST Error]:", error);

    // Log error to your backend API (or email service)
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/log-auth-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: (error as Error).message, route: "/api/auth" }),
    });

    return NextResponse.json({ error: "Authentication error occurred" }, { status: 500 });
  }
}