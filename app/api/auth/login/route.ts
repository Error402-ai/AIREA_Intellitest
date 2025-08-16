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

    // For demonstration purposes: accept any email/password combination
    // Determine role based on email pattern or specific demonstration emails
    let role = "student"
    let name = "Student User"
    let userId = "student-001"

    console.log("Login attempt with email:", email)

    if (email.toLowerCase().includes('teacher') || 
        email.toLowerCase().includes('prof') || 
        email.toLowerCase().includes('dr') ||
        email.toLowerCase().includes('instructor') ||
        email === "teacher@intellitest.com") {
      role = "teacher"
      name = "Professor Johnson"
      userId = "teacher-001"
      console.log("Role determined as teacher")
    } else if (email === "student@intellitest.com") {
      name = "Alex Chen"
      userId = "student-001"
      console.log("Role determined as student")
    } else {
      console.log("Role determined as student (default)")
    }

    console.log("Final role:", role)

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
