import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { getJWTSecret } from "@/lib/config"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify JWT token
    const jwtSecret = getJWTSecret()
    const decoded = verify(sessionToken, jwtSecret) as any

    // Check if expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      },
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }
}
