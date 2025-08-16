"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Brain, TrendingUp, RotateCcw } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AssessmentResult {
  assessmentId: string
  title: string
  answers: Record<string, string> // Changed from number to string keys to match question IDs
  totalQuestions: number
  answeredQuestions: number
  completionRate: number
  timeSpent: number
  submittedAt: string
  questions: Array<{
    id: string // Changed from number to string to match generated assessment format
    question: string
    type: string
    bloomsLevel: string
    difficulty: number
    options?: string[]
    correctAnswer?: string
    explanation?: string
  }>
}

export default function AssessmentResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = () => {
      try {
        const storedResult = localStorage.getItem("latestAssessmentResult")
        if (storedResult) {
          const parsedResult = JSON.parse(storedResult)
          console.log("[v0] Loaded assessment results:", parsedResult)
          setResult(parsedResult)
        } else {
          console.log("[v0] No results found, redirecting to tests")
          router.push("/tests")
        }
      } catch (error) {
        console.error("[v0] Error loading results:", error)
        router.push("/tests")
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading results...</div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">No results found</div>
      </div>
    )
  }

  // Calculate analytics based on user responses
  const bloomsLevelData = result.questions.reduce(
    (acc, q) => {
      const level = q.bloomsLevel
      acc[level] = (acc[level] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const difficultyData = result.questions.reduce(
    (acc, q) => {
      const diff = `Level ${q.difficulty}`
      acc[diff] = (acc[diff] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(bloomsLevelData).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }))

  const barData = Object.entries(difficultyData).map(([level, count]) => ({
    difficulty: level,
    questions: count,
    answered: Math.floor(count * ((result.completionRate || 0) / 100)),
  }))

  const formatTime = (seconds: number) => {
    const mins = Math.floor((seconds || 0) / 60)
    const secs = (seconds || 0) % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="font-serif text-3xl font-bold">Assessment Complete!</h1>
            <p className="text-muted-foreground">{result.title}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{(result.completionRate || 0).toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">
                  {result.answeredQuestions || 0}/{result.totalQuestions || 0}
                </div>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{formatTime(result.timeSpent)}</div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">
                  {new Date(result.submittedAt).toLocaleDateString()}
                </div>
                <p className="text-sm text-muted-foreground">Completed On</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="breakdown">Question Breakdown</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cognitive Skills Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Level Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="difficulty" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="questions" fill="#8884d8" name="Total Questions" />
                        <Bar dataKey="answered" fill="#82ca9d" name="Answered" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Question-by-Question Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.questions.map((question, index) => {
                    const userAnswer = result.answers[question.id]
                    const isCorrect = question.correctAnswer && userAnswer === question.options?.[0] // First option is correct

                    return (
                      <div key={question.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">
                            Q{index + 1}: {question.question}
                          </h4>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {question.bloomsLevel}
                            </Badge>
                            <Badge variant="secondary">Difficulty {question.difficulty}</Badge>
                            <Badge className={isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                          </div>
                        </div>

                        {question.type === "mcq" && question.options && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Options:</p>
                            {question.options.map((option, optIndex) => {
                              const isUserChoice = userAnswer === option
                              const isCorrectOption = optIndex === 0 // First option is always correct

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded text-sm border ${
                                    isCorrectOption
                                      ? "bg-green-50 border-green-200 text-green-800"
                                      : isUserChoice
                                        ? "bg-red-50 border-red-200 text-red-800"
                                        : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                  {isCorrectOption && <span className="ml-2 text-green-600">✓ Correct</span>}
                                  {isUserChoice && !isCorrectOption && (
                                    <span className="ml-2 text-red-600">✗ Your answer</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <div className="text-sm text-muted-foreground">
                          <strong>Your Answer:</strong> {userAnswer || "Not answered"}
                        </div>

                        {question.explanation && (
                          <div className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                            <strong className="text-blue-800">Explanation:</strong>
                            <p className="text-blue-700 mt-1">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>AI-Powered Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Strengths Identified:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Strong completion rate of {(result.completionRate || 0).toFixed(1)}%</li>
                        <li>• Consistent engagement throughout the assessment</li>
                        <li>• Good time management skills</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Focus on higher-order thinking skills</li>
                        <li>• Practice more complex problem-solving</li>
                        <li>• Review concepts in areas with lower performance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Next Steps</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => router.push("/study-plans")}>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Study Plan
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/flashcards")}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Review with Flashcards
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/generate")}
                    >
                      Create New Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
