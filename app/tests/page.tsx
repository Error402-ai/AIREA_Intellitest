"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TestResultCard } from "@/components/test-result-card"
import { PerformanceChart } from "@/components/performance-chart"
import { SkillsRadarChart } from "@/components/skills-radar-chart"
import { RecentActivity } from "@/components/recent-activity"
import { LearningVelocityChart } from "@/components/learning-velocity-chart"
import { StudyPatternHeatmap } from "@/components/study-pattern-heatmap"
import { CompetencyBreakdown } from "@/components/competency-breakdown"
import { PredictiveInsights } from "@/components/predictive-insights"
import { FileText, TrendingUp, Award, Download, Zap, Users, Eye, RotateCcw, Calendar, Clock, Target } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TestResult {
  id: string
  title: string
  type: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  timeLimit: number
  difficulty: number
  bloomsLevel: string
  completedAt: string
  feedback: string
  strengths: string[]
  improvements: string[]
  questions?: TestQuestion[]
}

interface TestQuestion {
  id: string
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
  timeSpent: number
}

export default function TestsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRetakeOpen, setIsRetakeOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Mock test results data with detailed questions
  const testResults: TestResult[] = [
    {
      id: "test-1",
      title: "Machine Learning Fundamentals",
      type: "MCQ",
      score: 85,
      totalQuestions: 15,
      correctAnswers: 13,
      timeSpent: 22,
      timeLimit: 30,
      difficulty: 3,
      bloomsLevel: "application",
      completedAt: "2024-01-15T10:30:00Z",
      feedback: "Excellent understanding of core ML concepts. Strong performance in supervised learning questions.",
      strengths: ["Supervised Learning", "Neural Networks", "Model Evaluation"],
      improvements: ["Unsupervised Learning", "Feature Engineering"],
      questions: [
        {
          id: "q1",
          question: "What is supervised learning?",
          userAnswer: "Learning with labeled training data",
          correctAnswer: "Learning with labeled training data",
          isCorrect: true,
          explanation: "Supervised learning uses labeled training data to learn the mapping from inputs to outputs.",
          timeSpent: 45
        },
        {
          id: "q2",
          question: "Which algorithm is best for classification problems?",
          userAnswer: "Linear Regression",
          correctAnswer: "Logistic Regression",
          isCorrect: false,
          explanation: "Logistic Regression is specifically designed for classification problems, while Linear Regression is for regression.",
          timeSpent: 60
        }
      ]
    },
    {
      id: "test-2",
      title: "Data Science Statistics",
      type: "Mixed",
      score: 78,
      totalQuestions: 20,
      correctAnswers: 16,
      timeSpent: 35,
      timeLimit: 40,
      difficulty: 4,
      bloomsLevel: "analyze",
      completedAt: "2024-01-12T14:15:00Z",
      feedback: "Good analytical skills demonstrated. Focus on probability distributions for improvement.",
      strengths: ["Descriptive Statistics", "Hypothesis Testing", "Correlation Analysis"],
      improvements: ["Probability Distributions", "Bayesian Statistics"],
      questions: [
        {
          id: "q3",
          question: "What is the p-value in hypothesis testing?",
          userAnswer: "Probability of rejecting null hypothesis",
          correctAnswer: "Probability of observing data as extreme as the sample data",
          isCorrect: false,
          explanation: "The p-value is the probability of observing data as extreme as the sample data, assuming the null hypothesis is true.",
          timeSpent: 90
        }
      ]
    },
    {
      id: "test-3",
      title: "AI Ethics Assessment",
      type: "Subjective",
      score: 92,
      totalQuestions: 8,
      correctAnswers: 7,
      timeSpent: 45,
      timeLimit: 60,
      difficulty: 2,
      bloomsLevel: "evaluate",
      completedAt: "2024-01-10T16:45:00Z",
      feedback: "Outstanding critical thinking and ethical reasoning. Comprehensive understanding of AI bias issues.",
      strengths: ["Ethical Reasoning", "Bias Detection", "Fairness Principles"],
      improvements: ["Regulatory Frameworks"],
      questions: [
        {
          id: "q4",
          question: "Explain the concept of AI bias and its implications.",
          userAnswer: "AI bias occurs when algorithms reflect human prejudices...",
          correctAnswer: "AI bias refers to systematic and unfair discrimination...",
          isCorrect: true,
          explanation: "Excellent explanation of AI bias and its real-world implications.",
          timeSpent: 180
        }
      ]
    },
  ]

  const overallStats = {
    totalTests: testResults.length,
    averageScore: Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length),
    totalTimeSpent: testResults.reduce((sum, test) => sum + test.timeSpent, 0),
    improvementRate: 12,
    learningVelocity: 2.3, // Tests per week
    competencyGrowth: 18, // Percentage growth in competencies
    studyStreak: 7, // Days
    peerRanking: 85, // Percentile
  }

  const handleViewDetails = (test: TestResult) => {
    setSelectedTest(test)
    setIsDetailsOpen(true)
  }

  const handleRetakeTest = (test: TestResult) => {
    setSelectedTest(test)
    setIsRetakeOpen(true)
  }

  const handleExportResults = () => {
    setIsExportOpen(true)
  }

  const exportTestResults = () => {
    const csvContent = [
      ["Test Title", "Type", "Score", "Total Questions", "Correct Answers", "Time Spent", "Difficulty", "Completed At"],
      ...testResults.map(test => [
        test.title,
        test.type,
        test.score.toString(),
        test.totalQuestions.toString(),
        test.correctAnswers.toString(),
        test.timeSpent.toString(),
        test.difficulty.toString(),
        new Date(test.completedAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test-results-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    setIsExportOpen(false)
  }

  const startRetakeTest = () => {
    if (selectedTest) {
      // In a real app, this would navigate to the test taking page
      console.log(`Starting retake of test: ${selectedTest.title}`)
      // Navigate to test taking page with the test ID
      window.location.href = `/take-assessment?retake=${selectedTest.id}`
    }
    setIsRetakeOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Advanced Learning Analytics</h1>
            <p className="text-muted-foreground">
              AI-powered insights into your learning patterns, performance trends, and predictive recommendations.
            </p>
          </div>

          {/* Enhanced Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Tests</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{overallStats.totalTests}</p>
                <p className="text-xs text-muted-foreground mt-1">Completed assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-muted-foreground">Average Score</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{overallStats.averageScore}%</p>
                <p className="text-xs text-green-600 mt-1">+{overallStats.improvementRate}% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">Learning Velocity</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{overallStats.learningVelocity}</p>
                <p className="text-xs text-muted-foreground mt-1">Tests per week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">Peer Ranking</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{overallStats.peerRanking}th</p>
                <p className="text-xs text-blue-600 mt-1">Percentile</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="results" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="results">Test Results</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
              <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
              <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            {/* Test Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Test Results</h2>
                <Button variant="outline" size="sm" onClick={handleExportResults}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>

              <div className="space-y-4">
                {testResults.map((test) => (
                  <TestResultCard 
                    key={test.id} 
                    result={test}
                    onViewDetails={() => handleViewDetails(test)}
                    onRetakeTest={() => handleRetakeTest(test)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Enhanced Performance Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Your score progression over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PerformanceChart data={testResults} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Velocity</CardTitle>
                    <CardDescription>Rate of knowledge acquisition and skill development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LearningVelocityChart />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Competency Breakdown</CardTitle>
                  <CardDescription>Detailed analysis of your skill development across domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <CompetencyBreakdown results={testResults} />
                </CardContent>
              </Card>

              {/* Bloom's Taxonomy Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Bloom's Taxonomy Performance</CardTitle>
                  <CardDescription>Your cognitive skill development across different thinking levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["remember", "understand", "apply", "analyze", "evaluate", "create"].map((level) => {
                      const testsAtLevel = testResults.filter((t) => t.bloomsLevel === level)
                      const avgScore =
                        testsAtLevel.length > 0
                          ? Math.round(testsAtLevel.reduce((sum, t) => sum + t.score, 0) / testsAtLevel.length)
                          : 0

                      return (
                        <div key={level} className="text-center p-4 border rounded-lg">
                          <h4 className="font-medium capitalize mb-2">{level}</h4>
                          <div className="text-2xl font-bold text-primary mb-1">{avgScore}%</div>
                          <div className="text-xs text-muted-foreground">{testsAtLevel.length} tests</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Assessment Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Radar</CardTitle>
                    <CardDescription>Your performance across different skill areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkillsRadarChart results={testResults} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Strengths & Areas for Improvement</CardTitle>
                    <CardDescription>Based on your recent test performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-green-700 mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Top Strengths
                      </h4>
                      <div className="space-y-2">
                        {Array.from(new Set(testResults.flatMap((t) => t.strengths)))
                          .slice(0, 5)
                          .map((strength, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-orange-700 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Focus Areas
                      </h4>
                      <div className="space-y-2">
                        {Array.from(new Set(testResults.flatMap((t) => t.improvements)))
                          .slice(0, 5)
                          .map((improvement, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span className="text-sm">{improvement}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* New Learning Patterns tab */}
            <TabsContent value="patterns" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Pattern Heatmap</CardTitle>
                    <CardDescription>Your learning activity patterns throughout the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StudyPatternHeatmap />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optimal Learning Times</CardTitle>
                    <CardDescription>When you perform best based on historical data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Peak Performance</span>
                        <span className="text-sm text-muted-foreground">2:00 PM - 4:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Most Active Day</span>
                        <span className="text-sm text-muted-foreground">Tuesday</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Session</span>
                        <span className="text-sm text-muted-foreground">28 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Study Streak</span>
                        <span className="text-sm text-green-600">{overallStats.studyStreak} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Efficiency Metrics</CardTitle>
                  <CardDescription>How effectively you're absorbing and retaining knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">94%</div>
                      <div className="text-sm text-muted-foreground">Retention Rate</div>
                      <div className="text-xs text-green-600 mt-1">+8% this month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-2">1.8x</div>
                      <div className="text-sm text-muted-foreground">Learning Multiplier</div>
                      <div className="text-xs text-blue-600 mt-1">Above average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-500 mb-2">76%</div>
                      <div className="text-sm text-muted-foreground">Focus Score</div>
                      <div className="text-xs text-purple-600 mt-1">Excellent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <PredictiveInsights results={testResults} />
            </TabsContent>

            {/* Recent Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <RecentActivity results={testResults} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* View Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTest?.title} - Detailed Results</DialogTitle>
            <DialogDescription>
              Complete breakdown of your test performance and individual question analysis
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-6">
              {/* Test Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedTest.score}%</div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedTest.correctAnswers}/{selectedTest.totalQuestions}</div>
                      <div className="text-sm text-muted-foreground">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedTest.timeSpent}m</div>
                      <div className="text-sm text-muted-foreground">Time Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedTest.difficulty}/5</div>
                      <div className="text-sm text-muted-foreground">Difficulty</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Analysis */}
              {selectedTest.questions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Question Analysis</CardTitle>
                    <CardDescription>Detailed breakdown of each question</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTest.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <Badge variant={question.isCorrect ? "default" : "destructive"}>
                              {question.isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{question.question}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Your Answer:</p>
                              <p className="mt-1">{question.userAnswer}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Correct Answer:</p>
                              <p className="mt-1">{question.correctAnswer}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-muted/50 rounded">
                            <p className="font-medium text-sm mb-1">Explanation:</p>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                            <span>Time spent: {question.timeSpent}s</span>
                            <span>Question type: {selectedTest.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTest.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Areas for Improvement
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTest.improvements.map((improvement, index) => (
                          <Badge key={index} variant="outline">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Retake Test Modal */}
      <Dialog open={isRetakeOpen} onOpenChange={setIsRetakeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retake Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to retake this test? Your previous results will be saved for comparison.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{selectedTest.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Previous Score:</span>
                    <p className="font-medium">{selectedTest.score}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Questions:</span>
                    <p className="font-medium">{selectedTest.totalQuestions}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time Limit:</span>
                    <p className="font-medium">{selectedTest.timeLimit} minutes</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Difficulty:</span>
                    <p className="font-medium">{selectedTest.difficulty}/5</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={startRetakeTest} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Retake
                </Button>
                <Button variant="outline" onClick={() => setIsRetakeOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Results Modal */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Test Results</DialogTitle>
            <DialogDescription>
              Choose how you'd like to export your test results
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={exportTestResults}>
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">CSV Export</h4>
                    <p className="text-sm text-muted-foreground">Download as CSV file for spreadsheet analysis</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">PDF Report</h4>
                    <p className="text-sm text-muted-foreground">Generate detailed PDF report with charts</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Performance Summary</h4>
                    <p className="text-sm text-muted-foreground">Export performance trends and insights</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsExportOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
