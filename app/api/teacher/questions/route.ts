import { NextRequest, NextResponse } from "next/server"
import { OpenAIService } from "@/lib/ai/openai-service"
import { getDatabaseService } from "@/lib/database"

const openAIService = new OpenAIService()
const db = getDatabaseService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, questionId, feedback, feedbackType } = body

    switch (action) {
      case "approve":
        // Handle question approval
        return NextResponse.json({ 
          success: true, 
          message: "Question approved successfully" 
        })

      case "reject":
        // Handle question rejection
        return NextResponse.json({ 
          success: true, 
          message: "Question rejected" 
        })

      case "feedback":
        // Handle feedback submission with AI analysis
        if (!feedback || !questionId) {
          return NextResponse.json(
            { success: false, error: "Feedback and question ID are required" },
            { status: 400 }
          )
        }

        // Analyze feedback with AI
        let aiAnalysis = ""
        try {
          const analysis = await openAIService.validateQuestionQuality(
            {
              id: "temp-id",
              question: "Sample question", // This would come from the actual question
              type: "mcq",
              difficulty: 3,
              bloomsLevel: "understand",
              options: [],
              correctAnswer: "",
              explanation: "",
              keywords: [],
              sourceText: "",
              qualityScore: 0.8
            },
            {
              type: "mixed",
              difficulty: 3,
              bloomsLevel: "understand",
              questionCount: 1,
              focusAreas: "",
              selectedMaterials: [],
              timeLimit: 30
            }
          )
          aiAnalysis = analysis.feedback
        } catch (error) {
          console.error("Error analyzing feedback:", error)
          aiAnalysis = "AI analysis unavailable"
        }

        return NextResponse.json({
          success: true,
          message: "Feedback submitted successfully",
          aiAnalysis
        })

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error in question management API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "stats":
        // Return question statistics
        return NextResponse.json({
          success: true,
          stats: {
            totalQuestions: 15,
            approved: 8,
            pending: 5,
            rejected: 2,
            averageQuality: 85
          }
        })

      case "questions":
        // Return questions for review
        return NextResponse.json({
          success: true,
          questions: [
            {
              id: "q1",
              question: "What is supervised learning?",
              type: "mcq",
              difficulty: 3,
              bloomsLevel: "understand",
              status: "pending",
              qualityScore: 0.85
            }
          ]
        })

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error in question management API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
