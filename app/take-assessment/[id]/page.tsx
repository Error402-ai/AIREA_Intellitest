"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

interface Question {
  id: string // Changed from number to string to match generated assessment format
  question: string
  type: "mcq" | "subjective" | "numerical"
  options?: string[]
  correctAnswer?: string
  bloomsLevel: string
  difficulty: number
}

interface Assessment {
  id: string
  title: string
  questions: Question[]
  timeLimit: number
  createdAt: string
}

export default function TakeAssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({}) // Changed key type from number to string
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAssessment = () => {
      try {
        // Get the generated assessment from localStorage
        const storedAssessment = localStorage.getItem("currentAssessment")
        if (storedAssessment) {
          const parsedAssessment = JSON.parse(storedAssessment)
          console.log("[v0] Loaded assessment from localStorage:", parsedAssessment)
          console.log("[v0] Assessment questions length:", parsedAssessment?.questions?.length)
          console.log("[v0] Assessment questions:", parsedAssessment?.questions)
          console.log("[v0] Assessment timeLimit:", parsedAssessment?.timeLimit)

          setAssessment(parsedAssessment)
          const timeInSeconds = (parsedAssessment.timeLimit || 30) * 60
          setTimeRemaining(timeInSeconds)
          console.log("[v0] Set time remaining to:", timeInSeconds, "seconds")
        } else {
          console.log("[v0] No assessment found in localStorage, redirecting to generate")
          router.push("/generate")
        }
      } catch (error) {
        console.error("[v0] Error loading assessment:", error)
        router.push("/generate")
      } finally {
        setLoading(false)
      }
    }

    loadAssessment()
  }, [params.id, router])

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted && assessment && !loading) {
      const timer = setTimeout(() => {
        console.log("[v0] Timer tick, time remaining:", timeRemaining - 1)
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isSubmitted && assessment && !loading) {
      console.log("[v0] Time expired, auto-submitting")
      handleSubmit()
    }
  }, [timeRemaining, isSubmitted, assessment, loading])

  const handleAnswerChange = (questionId: string, answer: string) => {
    // Changed parameter type from number to string
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    console.log("[v0] handleSubmit called")
    console.log("[v0] Assessment state at submission:", assessment)
    console.log("[v0] Is assessment null?", assessment === null)
    console.log("[v0] Assessment questions:", assessment?.questions)

    if (!assessment) {
      console.error("[v0] Cannot submit - assessment is null!")
      return
    }

    setIsSubmitted(true)

    const totalQuestions = assessment.questions.length
    const answeredQuestions = Object.keys(answers).length
    const completionRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

    console.log("[v0] Total questions:", totalQuestions)
    console.log("[v0] Answered questions:", answeredQuestions)
    console.log("[v0] Answers object:", answers)

    // Create result data
    const resultData = {
      assessmentId: assessment.id,
      title: assessment.title,
      answers,
      totalQuestions,
      answeredQuestions,
      completionRate,
      timeSpent: assessment.timeLimit * 60 - timeRemaining,
      submittedAt: new Date().toISOString(),
      questions: assessment.questions,
    }

    console.log("[v0] Submitting assessment with results:", resultData)

    localStorage.setItem("latestAssessmentResult", JSON.stringify(resultData))

    setTimeout(() => {
      router.push(`/assessment-results/${assessment.id}`)
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    if (!assessment) return 0
    return ((currentQuestion + 1) / assessment.questions.length) * 100
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading assessment...</div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    console.log("[v0] Assessment is null, showing error state")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Assessment not found</p>
          <Button onClick={() => router.push("/generate")}>Generate New Assessment</Button>
        </div>
      </div>
    )
  }

  console.log("[v0] Rendering assessment interface with", assessment.questions.length, "questions")
  console.log("[v0] Current question:", currentQuestion)
  console.log("[v0] Time remaining:", timeRemaining)

  const currentQ = assessment.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Timer */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold">{assessment.title}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className={`font-mono ${timeRemaining < 300 ? "text-red-500" : ""}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant={timeRemaining < 300 ? "destructive" : "secondary"}>
                {timeRemaining < 300 ? "Time Running Out!" : "In Progress"}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">
                {getAnsweredCount()}/{assessment.questions.length} answered
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Question Panel */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {currentQ.bloomsLevel}
                      </Badge>
                      <Badge variant="secondary">Difficulty: {currentQ.difficulty}/5</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed">{currentQ.question}</p>

                  {/* MCQ Options */}
                  {currentQ.type === "mcq" && currentQ.options && (
                    <RadioGroup
                      value={answers[currentQ.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    >
                      {currentQ.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {/* Subjective Answer */}
                  {currentQ.type === "subjective" && (
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  )}

                  {/* Numerical Answer */}
                  {currentQ.type === "numerical" && (
                    <div className="space-y-2">
                      <Label>Your Answer:</Label>
                      <input
                        type="number"
                        placeholder="Enter numerical answer"
                        value={answers[currentQ.id] || ""}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md"
                      />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentQuestion === assessment.questions.length - 1 ? (
                      <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                        Submit Assessment
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          setCurrentQuestion(Math.min(assessment.questions.length - 1, currentQuestion + 1))
                        }
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Navigator */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Question Navigator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {assessment.questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentQuestion === index ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          answers[assessment.questions[index].id] ? "bg-green-100 border-green-300 text-green-700" : "" // Fixed to use string ID
                        }`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Assessment Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span>{assessment.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span>{getAnsweredCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span>{assessment.questions.length - getAnsweredCount()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
