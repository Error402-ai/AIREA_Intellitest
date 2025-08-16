"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Target, Brain, Clock, Zap } from "lucide-react"
import { useState } from "react"

export default function ProgressPage() {
  const [assessmentResults, setAssessmentResults] = useState(() => {
    // Load real assessment results from localStorage
    const storedResults = localStorage.getItem("allAssessmentResults")
    return storedResults ? JSON.parse(storedResults) : []
  })

  const calculateRealMetrics = () => {
    if (assessmentResults.length === 0) {
      return {
        averageScore: 0,
        totalAssessments: 0,
        totalStudyTime: 0,
        improvementTrend: 0,
      }
    }

    const scores = assessmentResults.map((r: any) => r.completionRate || 0)
    const averageScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length
    const totalStudyTime = assessmentResults.reduce((total: number, r: any) => total + (r.timeSpent || 0), 0)

    // Calculate improvement trend
    const recentScores = scores.slice(-5)
    const earlierScores = scores.slice(0, 5)
    const recentAvg = recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length
    const earlierAvg = earlierScores.reduce((a: number, b: number) => a + b, 0) / earlierScores.length
    const improvementTrend = recentAvg - earlierAvg

    return {
      averageScore: Math.round(averageScore),
      totalAssessments: assessmentResults.length,
      totalStudyTime: Math.round(totalStudyTime / 60), // Convert to minutes
      improvementTrend: Math.round(improvementTrend),
    }
  }

  const realMetrics = calculateRealMetrics()

  // Mock data for comprehensive analytics
  const weeklyProgress = [
    { day: "Mon", assessments: 2, score: 85, studyTime: 45 },
    { day: "Tue", assessments: 1, score: 92, studyTime: 60 },
    { day: "Wed", assessments: 3, score: 78, studyTime: 90 },
    { day: "Thu", assessments: 2, score: 88, studyTime: 75 },
    { day: "Fri", assessments: 1, score: 95, studyTime: 30 },
    { day: "Sat", assessments: 4, score: 82, studyTime: 120 },
    { day: "Sun", assessments: 2, score: 90, studyTime: 80 },
  ]

  const monthlyTrends = [
    { month: "Jan", avgScore: 75, assessments: 12, studyHours: 25 },
    { month: "Feb", avgScore: 78, assessments: 15, studyHours: 32 },
    { month: "Mar", avgScore: 82, assessments: 18, studyHours: 38 },
    { month: "Apr", avgScore: 85, assessments: 22, studyHours: 45 },
    { month: "May", avgScore: 87, assessments: 25, studyHours: 52 },
    { month: "Jun", avgScore: 89, assessments: 28, studyHours: 58 },
  ]

  const bloomsDistribution = [
    { name: "Knowledge", value: 15, color: "#ef4444" },
    { name: "Understanding", value: 25, color: "#f97316" },
    { name: "Application", value: 30, color: "#eab308" },
    { name: "Analysis", value: 20, color: "#22c55e" },
    { name: "Evaluation", value: 8, color: "#3b82f6" },
    { name: "Creation", value: 2, color: "#8b5cf6" },
  ]

  const subjectPerformance = [
    { subject: "Machine Learning", score: 92, assessments: 15, improvement: 8 },
    { subject: "Data Science", score: 87, assessments: 12, improvement: 5 },
    { subject: "Statistics", score: 84, assessments: 10, improvement: 12 },
    { subject: "AI Ethics", score: 89, assessments: 8, improvement: 3 },
    { subject: "Neural Networks", score: 78, assessments: 6, improvement: 15 },
  ]

  const learningGoals = [
    { goal: "Complete 50 assessments", current: 38, target: 50, category: "Assessments" },
    { goal: "Achieve 90% average score", current: 87, target: 90, category: "Performance" },
    { goal: "Study 100 hours", current: 78, target: 100, category: "Study Time" },
    { goal: "Master all Bloom's levels", current: 83, target: 100, category: "Cognitive Skills" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Progress Tracking</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights into your learning journey and performance trends.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                    <p className="text-3xl font-bold">{realMetrics.averageScore}%</p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        realMetrics.improvementTrend >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {realMetrics.improvementTrend >= 0 ? "+" : ""}
                      {realMetrics.improvementTrend}% trend
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assessments Taken</p>
                    <p className="text-3xl font-bold">{realMetrics.totalAssessments}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.max(0, realMetrics.totalAssessments - 5)} this month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                    <p className="text-3xl font-bold">{realMetrics.totalStudyTime}m</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Active learning
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Learning Streak</p>
                    <p className="text-3xl font-bold">15</p>
                    <p className="text-xs text-muted-foreground mt-1">days</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="studyTime"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="assessments"
                          stackId="2"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Bloom's Taxonomy Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cognitive Skills Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={bloomsDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                          {bloomsDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>6-Month Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgScore" stroke="#8884d8" strokeWidth={3} />
                      <Line type="monotone" dataKey="assessments" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Best Performance Day</span>
                        <Badge>Friday (95%)</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Most Active Day</span>
                        <Badge>Saturday (4 assessments)</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Longest Study Session</span>
                        <Badge>120 minutes</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <Badge>2.3 minutes</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <div className="grid gap-4">
                {subjectPerformance.map((subject, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{subject.subject}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{subject.assessments} tests</Badge>
                          <Badge
                            className={
                              subject.improvement > 10 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }
                          >
                            +{subject.improvement}% improvement
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Score</span>
                          <span className="font-medium">{subject.score}%</span>
                        </div>
                        <Progress value={subject.score} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="grid gap-4">
                {learningGoals.map((goal, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{goal.goal}</h3>
                          <p className="text-sm text-muted-foreground">{goal.category}</p>
                        </div>
                        <Badge variant={goal.current >= goal.target ? "default" : "secondary"}>
                          {goal.current >= goal.target ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
