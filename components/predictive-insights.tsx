"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, TrendingUp, AlertTriangle, Lightbulb, Calendar } from "lucide-react"

interface PredictiveInsightsProps {
  results: any[]
}

export function PredictiveInsights({ results }: PredictiveInsightsProps) {
  const insights = [
    {
      type: "prediction",
      icon: Brain,
      title: "Performance Prediction",
      description:
        "Based on your learning patterns, you're likely to score 87-92% on your next Machine Learning assessment.",
      confidence: 94,
      action: "Take practice test",
      priority: "high",
    },
    {
      type: "recommendation",
      icon: Target,
      title: "Focus Area Recommendation",
      description: "Spending 30 more minutes on Unsupervised Learning could improve your overall ML score by 8-12%.",
      confidence: 87,
      action: "Study unsupervised learning",
      priority: "medium",
    },
    {
      type: "trend",
      icon: TrendingUp,
      title: "Learning Velocity Trend",
      description:
        "Your learning velocity has increased 23% this month. Maintain this pace to master 3 new competencies by month-end.",
      confidence: 91,
      action: "Continue current pace",
      priority: "low",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Retention Risk",
      description:
        "Your Statistics knowledge shows 15% decay. Review fundamental concepts within 3 days to prevent further loss.",
      confidence: 89,
      action: "Review statistics",
      priority: "high",
    },
    {
      type: "opportunity",
      icon: Lightbulb,
      title: "Skill Gap Opportunity",
      description:
        "You're 2 assessments away from achieving 'Advanced' level in AI Ethics. This would put you in the top 10% of learners.",
      confidence: 96,
      action: "Take AI Ethics test",
      priority: "medium",
    },
    {
      type: "schedule",
      icon: Calendar,
      title: "Optimal Study Schedule",
      description:
        "Your peak performance window is Tuesday 2-4 PM. Schedule challenging topics during this time for 15% better retention.",
      confidence: 92,
      action: "Adjust schedule",
      priority: "low",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI-Powered Learning Insights</span>
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on advanced learning analytics and predictive modeling
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                          {insight.priority} priority
                        </Badge>
                        <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-2 max-w-32">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                  </div>
                  <Button variant="outline" size="sm">
                    {insight.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Optimization Summary</CardTitle>
          <CardDescription>Key metrics and recommendations for maximizing your learning efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-sm font-medium text-green-800">Optimization Score</div>
              <div className="text-xs text-green-600 mt-1">Excellent efficiency</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">3.2x</div>
              <div className="text-sm font-medium text-blue-800">Learning Multiplier</div>
              <div className="text-xs text-blue-600 mt-1">Above peer average</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">87%</div>
              <div className="text-sm font-medium text-purple-800">Prediction Accuracy</div>
              <div className="text-xs text-purple-600 mt-1">High confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
