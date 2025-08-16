import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"
import { config, getJWTSecret } from "@/lib/config"
import { ErrorHandler, logger } from "@/lib/error-handler"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    try {
      ErrorHandler.validateRequired(email, "Email")
      ErrorHandler.validateRequired(password, "Password")
      ErrorHandler.validateEmail(email)
    } catch (validationError) {
      logger.warn("Login validation failed", { email, error: validationError })
      return NextResponse.json({ error: validationError.message }, { status: 400 })
    }

    // For demo purposes: accept any email/password combination
    // Determine role based on email pattern or specific demo emails
    let role = "student"
    let name = "Demo Student"
    let userId = "demo-student-1"

    if (email.toLowerCase().includes('teacher') || 
        email.toLowerCase().includes('prof') || 
        email.toLowerCase().includes('dr') ||
        email.toLowerCase().includes('instructor') ||
        email === "teacher@demo.com") {
      role = "teacher"
      name = "Demo Teacher"
      userId = "demo-teacher-1"
    }

    // Create JWT token with proper expiration
    const jwtSecret = getJWTSecret()
    const expiresIn = "24h"
    const token = sign(
      {
        userId: userId,
        role: role,
        name: name,
        email: email,
      },
      jwtSecret,
      { expiresIn: expiresIn }
    )

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: config.getValue('isProduction'),
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    logger.info("User logged in successfully", { userId, email, role })

    return NextResponse.json({
      user: {
        id: userId,
        email: email,
        role: role,
        name: name,
      },
    })
  } catch (error) {
    ErrorHandler.handle(error, "Login API", true)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
