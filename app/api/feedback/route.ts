import { NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth"
import { getDatabaseService } from "@/lib/database"

interface Feedback {
  id: string
  title: string
  content: string
  type: "question" | "bug" | "feature" | "general"
  priority: "low" | "medium" | "high"
  status: "open" | "in_progress" | "resolved" | "closed"
  fromUserId: string
  fromUserName: string
  fromUserRole: "student" | "teacher" | "admin"
  createdAt: string
  updatedAt: string
  responses?: FeedbackResponse[]
}

interface FeedbackResponse {
  id: string
  feedbackId: string
  content: string
  fromUserId: string
  fromUserName: string
  fromUserRole: "student" | "teacher" | "admin"
  createdAt: string
}

// Mock function to notify users (in real app, this would send emails/push notifications)
function notifyUser(userId: string, message: string) {
  console.log(`Notification to user ${userId}: ${message}`)
}

export async function POST(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, type, priority } = body

    if (!title || !content || !type || !priority) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const feedback: Feedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      type,
      priority,
      status: "open",
      fromUserId: user.id,
      fromUserName: user.name,
      fromUserRole: user.role as "student" | "teacher" | "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: []
    }

    const db = getDatabaseService()
    await db.saveFeedback(feedback)

    // Notify relevant users (teachers/admins for student feedback, etc.)
    if (user.role === "student") {
      notifyUser("admin", `New feedback from student: ${title}`)
    }

    return NextResponse.json({ feedback }, { status: 201 })
  } catch (error) {
    console.error("Error creating feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const priority = searchParams.get("priority")

    const db = getDatabaseService()
    let feedback = await db.getFeedback()

    // Filter based on query parameters
    if (status) {
      feedback = feedback.filter((f: Feedback) => f.status === status)
    }
    if (type) {
      feedback = feedback.filter((f: Feedback) => f.type === type)
    }
    if (priority) {
      feedback = feedback.filter((f: Feedback) => f.priority === priority)
    }

    // Students can only see their own feedback, teachers/admins can see all
    if (user.role === "student") {
      feedback = feedback.filter((f: Feedback) => f.fromUserId === user.id)
    }

    // Sort by creation date (newest first)
    feedback.sort((a: Feedback, b: Feedback) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { feedbackId, action, content } = body

    if (!feedbackId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const db = getDatabaseService()
    const allFeedback = await db.getFeedback()
    const feedbackIndex = allFeedback.findIndex((f: Feedback) => f.id === feedbackId)

    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      )
    }

    const feedback = allFeedback[feedbackIndex]

    if (action === "update_status") {
      // Only teachers/admins can update status
      if (user.role === "student") {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        )
      }

      const { status } = body
      if (!status) {
        return NextResponse.json(
          { error: "Status is required" },
          { status: 400 }
        )
      }

      feedback.status = status
      feedback.updatedAt = new Date().toISOString()

      await db.updateFeedback(feedback)

      // Notify the original feedback creator
      notifyUser(feedback.fromUserId, `Your feedback "${feedback.title}" status has been updated to ${status}`)

      return NextResponse.json({ feedback })
    }

    if (action === "add_response") {
      if (!content) {
        return NextResponse.json(
          { error: "Response content is required" },
          { status: 400 }
        )
      }

      const response: FeedbackResponse = {
        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feedbackId,
        content,
        fromUserId: user.id,
        fromUserName: user.name,
        fromUserRole: user.role as "student" | "teacher" | "admin",
        createdAt: new Date().toISOString()
      }

      if (!feedback.responses) {
        feedback.responses = []
      }
      feedback.responses.push(response)
      feedback.updatedAt = new Date().toISOString()

      await db.updateFeedback(feedback)

      // Notify the original feedback creator about the response
      if (response.fromUserId !== feedback.fromUserId) {
        notifyUser(feedback.fromUserId, `You have a new response to your feedback "${feedback.title}"`)
      }

      return NextResponse.json({ feedback, response })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
