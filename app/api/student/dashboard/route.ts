import { NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth"
import { getDatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await authService.getCurrentUser()
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getDatabaseService()
    
    // Get student's assessment results
    const assessmentResults = await db.getAssessmentResults()
    const studentResults = assessmentResults.filter(result => result.userId === user.id)

    // Calculate student statistics
    const totalAssessments = studentResults.length
    const averageScore = totalAssessments > 0 
      ? Math.round(studentResults.reduce((sum, result) => sum + (result.completionRate || 0), 0) / totalAssessments)
      : 0

    // Get study materials
    const studyMaterials = await db.getStudyMaterials()

    // Mock upcoming assessments (in real app, this would come from teacher assignments)
    const upcomingAssessments = [
      {
        id: "1",
        title: "Neural Networks Assessment",
        subject: "Machine Learning",
        type: "Mixed",
        difficulty: 4,
        estimatedTime: 45,
        dueDate: "2024-01-20T14:00:00Z",
        status: "assigned" as const
      },
      {
        id: "2",
        title: "Data Visualization Practice",
        subject: "Data Science",
        type: "Subjective",
        difficulty: 3,
        estimatedTime: 30,
        dueDate: "2024-01-22T10:00:00Z",
        status: "in_progress" as const
      }
    ]

    // Generate AI recommendations based on performance
    const recommendations = generateRecommendations(studentResults, studyMaterials)

    // Mock learning goals (in real app, this would be stored in database)
    const learningGoals = [
      {
        id: "1",
        title: "Master Neural Networks",
        description: "Achieve 90%+ in neural network assessments",
        targetScore: 90,
        currentScore: 75,
        deadline: "2024-02-15",
        progress: 75,
        status: "on_track" as const
      },
      {
        id: "2",
        title: "Complete Data Science Track",
        description: "Finish all data science modules",
        targetScore: 85,
        currentScore: 60,
        deadline: "2024-03-01",
        progress: 60,
        status: "behind" as const
      }
    ]

    // Calculate study streak (mock data for now)
    const studyStreak = 7

    return NextResponse.json({
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "/placeholder-user.jpg",
        joinDate: "2024-01-01",
        totalAssessments,
        averageScore,
        studyStreak,
        lastActive: new Date().toISOString(),
        subjects: ["Machine Learning", "Data Science", "AI Ethics"],
        currentLevel: "Intermediate",
        nextMilestone: "Advanced ML Concepts"
      },
      upcomingAssessments,
      recommendations,
      learningGoals
    })
  } catch (error) {
    console.error("Error fetching student dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

function generateRecommendations(assessmentResults: any[], studyMaterials: any[]) {
  const recommendations = []

  // Analyze recent performance to generate recommendations
  const recentResults = assessmentResults.slice(-5)
  const averageRecentScore = recentResults.length > 0
    ? recentResults.reduce((sum, result) => sum + (result.completionRate || 0), 0) / recentResults.length
    : 0

  if (averageRecentScore < 70) {
    recommendations.push({
      id: "1",
      type: "assessment" as const,
      title: "Practice Fundamentals",
      description: "Based on your recent performance, focus on core concepts",
      priority: "high" as const,
      estimatedTime: 25,
      subject: "Machine Learning",
      reason: "Lower performance in recent assessments"
    })
  }

  if (studyMaterials.length > 0) {
    recommendations.push({
      id: "2",
      type: "flashcard" as const,
      title: "Review Key Concepts",
      description: "Spaced repetition for important terms and definitions",
      priority: "medium" as const,
      estimatedTime: 15,
      subject: "Machine Learning",
      reason: "Upcoming assessment preparation"
    })
  }

  recommendations.push({
    id: "3",
    type: "review" as const,
    title: "Revisit Probability Concepts",
    description: "Review probability distributions and Bayes theorem",
    priority: "low" as const,
    estimatedTime: 20,
    subject: "Statistics",
    reason: "Foundation for advanced topics"
  })

  return recommendations
}
