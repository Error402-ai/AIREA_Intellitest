"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap, 
  Calendar,
  FileText,
  Play,
  Eye,
  MessageSquare,
  Plus,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  Upload
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  name: string
  email: string
  avatar: string
  joinDate: string
  totalAssessments: number
  averageScore: number
  studyStreak: number
  lastActive: string
  subjects: string[]
  currentLevel: string
  nextMilestone: string
}

interface UpcomingAssessment {
  id: string
  title: string
  subject: string
  type: string
  difficulty: number
  estimatedTime: number
  dueDate: string
  status: "assigned" | "in_progress" | "completed"
}

interface StudyRecommendation {
  id: string
  type: "assessment" | "flashcard" | "review" | "practice"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  estimatedTime: number
  subject: string
  reason: string
}

interface LearningGoal {
  id: string
  title: string
  description: string
  targetScore: number
  currentScore: number
  deadline: string
  progress: number
  status: "on_track" | "behind" | "completed"
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null)
  const [upcomingAssessments, setUpcomingAssessments] = useState<UpcomingAssessment[]>([])
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([])
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])

  useEffect(() => {
    // Load student data
    const loadStudentData = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          
          if (data.user) {
            setStudent({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              avatar: "/placeholder-user.jpg",
              joinDate: "2024-01-01",
              totalAssessments: 24,
              averageScore: 87,
              studyStreak: 7,
              lastActive: new Date().toISOString(),
              subjects: ["Machine Learning", "Deep Learning", "Computer Vision"],
              currentLevel: "Intermediate",
              nextMilestone: "Advanced ML Concepts"
            })
          }
        } else {
          throw new Error("Authentication failed")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        // For demonstration purposes, set a default student
        setStudent({
          id: "student-001",
          name: "Alex Chen",
          email: "student@intellitest.com",
          avatar: "/placeholder-user.jpg",
          joinDate: "2024-01-01",
          totalAssessments: 24,
          averageScore: 87,
          studyStreak: 7,
          lastActive: new Date().toISOString(),
          subjects: ["Machine Learning", "Deep Learning", "Computer Vision"],
          currentLevel: "Intermediate",
          nextMilestone: "Advanced ML Concepts"
        })
      }
    }

    loadStudentData()
    loadDemoData()
  }, [])

  const loadDemoData = () => {
    // Demo upcoming assessments
    const demoAssessments: UpcomingAssessment[] = [
      {
        id: "1",
        title: "Machine Learning Fundamentals Quiz",
        subject: "Machine Learning",
        type: "Quiz",
        difficulty: 3,
        estimatedTime: 30,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "assigned"
      },
      {
        id: "2",
        title: "Neural Networks Practice Test",
        subject: "Deep Learning",
        type: "Practice Test",
        difficulty: 4,
        estimatedTime: 45,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "assigned"
      }
    ]

    // Demo study recommendations
    const demoRecommendations: StudyRecommendation[] = [
      {
        id: "1",
        type: "flashcard",
        title: "Review ML Concepts",
        description: "Practice with flashcards on supervised learning concepts",
        priority: "high",
        estimatedTime: 15,
        subject: "Machine Learning",
        reason: "Based on your recent quiz performance"
      },
      {
        id: "2",
        type: "assessment",
        title: "Take Neural Networks Quiz",
        description: "Test your understanding of neural network fundamentals",
        priority: "medium",
        estimatedTime: 20,
        subject: "Deep Learning",
        reason: "Recommended based on your learning path"
      }
    ]

    // Demo learning goals
    const demoGoals: LearningGoal[] = [
      {
        id: "1",
        title: "Master Supervised Learning",
        description: "Achieve 90% accuracy in supervised learning assessments",
        targetScore: 90,
        currentScore: 87,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 87,
        status: "on_track"
      },
      {
        id: "2",
        title: "Complete Deep Learning Module",
        description: "Finish all deep learning assessments with 85%+ score",
        targetScore: 85,
        currentScore: 78,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 78,
        status: "behind"
      }
    ]

    setUpcomingAssessments(demoAssessments)
    setRecommendations(demoRecommendations)
    setLearningGoals(demoGoals)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "bg-green-100 text-green-800"
      case "behind": return "bg-red-100 text-red-800"
      case "completed": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600">Welcome back, {student?.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/login"))
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{student.averageScore}%</p>
                    <p className="text-xs text-green-600 mt-1">+5% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assessments Taken</p>
                    <p className="text-2xl font-bold text-gray-900">{student.totalAssessments}</p>
                    <p className="text-xs text-green-600 mt-1">+3 this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Study Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{student.studyStreak} days</p>
                    <p className="text-xs text-orange-600 mt-1">Keep it up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Level</p>
                    <p className="text-2xl font-bold text-gray-900">{student.currentLevel}</p>
                    <p className="text-xs text-purple-600 mt-1">Next: {student.nextMilestone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="goals">Learning Goals</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Assessments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assessments</CardTitle>
                    <CardDescription>Your scheduled tests and quizzes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAssessments.map((assessment) => (
                        <div key={assessment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{assessment.title}</h4>
                            <Badge variant="outline">{assessment.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span>{assessment.subject}</span>
                            <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              <span>Difficulty: {assessment.difficulty}/5</span>
                              <span>Time: {assessment.estimatedTime} min</span>
                            </div>
                            <Button size="sm">
                              <Play className="mr-2 h-4 w-4" />
                              Start
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with your learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Link href="/flashcards">
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Practice Flashcards
                        </Button>
                      </Link>
                      <Link href="/upload">
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Study Materials
                        </Button>
                      </Link>
                      <Link href="/generate">
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="mr-2 h-4 w-4" />
                          Generate Assessment
                        </Button>
                      </Link>
                      <Link href="/progress">
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Progress
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Assessments</CardTitle>
                  <CardDescription>Your complete assessment history and upcoming tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAssessments.map((assessment) => (
                      <div key={assessment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{assessment.title}</h4>
                            <p className="text-sm text-gray-600">{assessment.subject}</p>
                          </div>
                          <Badge 
                            className={
                              assessment.status === "completed" ? "bg-green-100 text-green-800" :
                              assessment.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {assessment.status === "completed" ? "Completed" :
                             assessment.status === "in_progress" ? "In Progress" :
                             "Assigned"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Difficulty: {assessment.difficulty}/5</span>
                            <span>Time: {assessment.estimatedTime} min</span>
                            <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <Button size="sm">
                            <ArrowRight className="mr-2 h-4 w-4" />
                            {assessment.status === "completed" ? "Review" : "Start"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Goals</CardTitle>
                  <CardDescription>Track your progress towards your learning objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningGoals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{goal.title}</h4>
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status === "on_track" ? "On Track" :
                             goal.status === "behind" ? "Behind" :
                             "Completed"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress: {goal.currentScore}/{goal.targetScore}</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <p className="text-xs text-gray-600">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Study Recommendations</CardTitle>
                  <CardDescription>Personalized suggestions based on your learning progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((recommendation) => (
                      <div key={recommendation.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{recommendation.title}</h4>
                              <Badge className={getPriorityColor(recommendation.priority)}>
                                {recommendation.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                            <p className="text-xs text-gray-500">{recommendation.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{recommendation.subject}</span>
                            <span>•</span>
                            <span>{recommendation.estimatedTime} min</span>
                          </div>
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
